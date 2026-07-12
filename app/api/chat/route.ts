// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { calculateFare, VehicleType } from "@/lib/fareCalculator";

export async function POST(req: Request) {
  try {
    const { messages, currentStep, bookingData } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }

    // Safeguard setup against undefined context
    const currentBookingState = bookingData || {};
    let calculatedDynamicAmount = currentBookingState.finalAmount || 0;
    let rawFlatFare = 0;
    let isDryZoneDetected = false;
    let isShortLead = false;

    let mappedVehicleKey: VehicleType = "sedan";
    const currentVehicleStr = (currentBookingState.vehicle || "").toLowerCase();
    if (currentVehicleStr.includes("ertiga")) mappedVehicleKey = "ertiga";
    else if (currentVehicleStr.includes("crysta")) mappedVehicleKey = "crysta";

    // 👑 NATIVE PARALLEL DIRECT GOOGLE MAPS ROUTING ENTRY
    if (currentBookingState.pickup && currentBookingState.drop && currentBookingState.vehicle && currentStep === "fare_show" && !currentBookingState.finalAmount) {
      try {
        const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
        const requestBody = {
          origin: { address: currentBookingState.pickup },
          destination: { address: currentBookingState.drop },
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_UNAWARE",
          computeAlternativeRoutes: false,
          languageCode: "en-IN",
          units: "METRIC",
        };

        const mapsResponse = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": mapsApiKey || "",
              "X-Goog-FieldMask": "routes.distanceMeters,routes.travelAdvisory.tollInfo",
            },
            body: JSON.stringify(requestBody),
          }
        );

        let liveKm = 150; 
        let liveGoogleToll = 0;

        if (mapsResponse.ok) {
          const mapsData = await mapsResponse.json();
          const route = mapsData?.routes?.[0];
          if (route?.distanceMeters) {
            liveKm = Math.round(route.distanceMeters / 1000);
          }
          if (route?.travelAdvisory?.tollInfo?.estimatedPrice) {
            const priceList = route.travelAdvisory.tollInfo.estimatedPrice;
            const inrPrice = priceList.find((p: any) => p.currencyCode === "INR");
            if (inrPrice) {
              liveGoogleToll = Math.round(Number(inrPrice.units || 0));
            }
          }
        }

        const calculatorOutput = calculateFare({
          distance: liveKm,
          vehicleType: mappedVehicleKey,
          bookingType: currentBookingState.tripType === "Round Trip" ? "roundtrip" : "oneway",
          serviceType: "outstation"
        });

        const dropLower = currentBookingState.drop.toLowerCase();
        isShortLead = liveKm <= 200;
        isDryZoneDetected = dropLower.includes("chirmiri") || dropLower.includes("ambikapur") || dropLower.includes("mainpat");

        if (isShortLead) {
          const shortLeadIncrement = 600;
          if (isDryZoneDetected && currentBookingState.tripType !== "Round Trip") {
            calculatedDynamicAmount = Math.round((calculatorOutput.finalFare + shortLeadIncrement) * 1.5) + liveGoogleToll;
          } else {
            calculatedDynamicAmount = calculatorOutput.finalFare + shortLeadIncrement + liveGoogleToll;
          }
        } else {
          // Outstation Cushion protection adds dynamically over genuine calculation
          calculatedDynamicAmount = calculatorOutput.finalFare + 2200 + liveGoogleToll;
        }

        rawFlatFare = Math.round(calculatedDynamicAmount * 1.15); 
      } catch (err) {
        console.error("Native matrix extraction error:", err);
        calculatedDynamicAmount = 5500;
        rawFlatFare = 6400;
      }
    }

    if (!rawFlatFare && calculatedDynamicAmount) {
      rawFlatFare = Math.round(calculatedDynamicAmount * 1.15);
    }

    const chosenLang = currentBookingState.language || "Hindi";
    const advance20Percent = Math.round(calculatedDynamicAmount * 0.20);
    
    const languageInstruction = chosenLang === "English" 
      ? `STRICT LANGUAGE RULE: Respond ONLY in clean professional English.`
      : `STRICT LANGUAGE RULE: Respond in warm regional Hinglish language.`;

    const systemInstruction = `
      You are "Sakha", the professional AI Assistant for "Khatu Rides Travels Co." (Chhattisgarh).
      Your response must be point-to-point (maximum 1-2 sentences), highly polished, and clear.

      ${languageInstruction}

      🚨 STATE METRICS MAP:
      Current Step: ${currentStep}
      Live Parameters: Trip Type: ${currentBookingState.tripType}, Vehicle: ${currentBookingState.vehicle}, Pickup: ${currentBookingState.pickup}, Drop: ${currentBookingState.drop}, Date: ${currentBookingState.dateTime}

      🚨 STAGE FLOW SEQUENCE VALIDATION:
      - 'pickup_loc': Ask for Drop Destination City.
      - 'drop_loc': Ask to select Trip Type ('One-way' or 'Round Trip').
      - 'triptype': Ask to select Vehicle Type ('Sedan (Dzire)', 'Ertiga (SUV)', or 'Innova Crysta').
      - 'vehicle': Inform that pricing calculations are complete and click enter to reveal the bill summary invoice.
      - 'fare_show': Show calculation layout exactly formatted as:
          "Bhaiya, aapke liye special discounted fare calculate ho gaya hai! Regular rate Rs. ${rawFlatFare} tha, par aapko special price Rs. ${calculatedDynamicAmount}.00 (All-Inclusive) padega. Niche ticket check karein. Booking lock karne ke liye kripya 'CONFIRM' reply karein."
      - 'datetime': Strictly ask for date and time: "Great decision! Kripya apni Pickup Date aur Time batayein taaki verification box open kiya ja sake."

      🚨 FINAL TICKET GENERATION:
      - If currentStep is 'final': Output a beautifully formatted professional ticket booking summary with Name (${currentBookingState.custName}), Pickup, Drop, Vehicle, Total Fare (Rs. ${calculatedDynamicAmount}.00), and Advance Paid (Rs. ${advance20Percent}.00). Add a warm thank you note.

      Always append this token format at the very end of text output only when confirm block hits:
      [TRIGGER_CHECKOUT: {"vehicle": "${currentBookingState.vehicle}", "amount": ${advance20Percent}, "pickup": "${currentBookingState.pickup}", "drop": "${currentBookingState.drop}"}]
    `;

    const geminiPayload = {
      contents: [
        { role: "user", parts: [{ text: systemInstruction }] },
        ...messages.map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }))
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload),
      }
    );

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Bhaiya, please refresh data parameters.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Sakha True API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
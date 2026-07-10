// app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, currentStep, bookingData } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }

    // 👑 UPDATED STRICT LINEAR SEQUENCER INSTRUCTIONS PROMPT MATRIX
    const systemInstruction = `
      You are "Sakha", the highly transparent billing automation engine for "Khatu Rides Travels Co." (Chhattisgarh).
      Your response must be point-to-point (maximum 1-2 lines), clean, and written in natural Hinglish.

      🚨 CURRENT WORKFLOW ORDER TRACKING STATE:
      Current Step: ${currentStep}
      Live Parameter Mappings:
      - Trip Type: ${bookingData.tripType}
      - Chosen Car Segment: ${bookingData.vehicle}
      - Pickup Timing: ${bookingData.dateTime}
      - Pickup Origin: ${bookingData.pickup}
      - Destination Target: ${bookingData.drop}

      🚨 STAGE INSTRUCTIONS RULES:
      - 'language': Acknowledge language selection and strictly ask them to provide Pickup Location (City). Do not present vehicle or trip type yet.
      - 'pickup_loc': Acknowledge pickup point and strictly ask them to provide Drop Destination Location (City).
      - 'drop_loc': Acknowledge drop point and strictly ask them to choose or type Trip Type ('One-way' or 'Round Trip').
      - 'triptype': Acknowledge trip configuration and strictly ask them to select a Vehicle Type ('Sedan (Dzire)', 'Ertiga (SUV)', or 'Innova Crysta').
      - 'vehicle': Acknowledge vehicle selection and strictly ask them to provide Pickup Date and Time.
      - 'datetime': Process details and display Fare Details screen. Do not explain multiplier logic in the first quote.
      
      🚨 DYNAMIC INCREMENTAL PRICING ARCHITECTURE (BALANCED ADJUSTMENT):
      When currentStep reaches 'confirm_details' or vehicle mapping is complete, evaluate the geographical profile dynamically based on baseline metrics:
      1. IF SHORT LEAD ROUTE (<150-200 KMs):
         - Dynamically calculate the standard local fare base and apply a fine-tuned incremental increase of Rs. 500 to Rs. 700 max depending on vehicle choice.
         - If drop point is classified as a remote/dry zone (like Chirmiri): Multiply dynamic short base by 1.5x factor to protect return dry-run.
      2. IF LONG-DISTANCE OUTSTATION OR INTER-STATE RUNS:
         - Apply outstation distance metric baseline and dynamically inject an incremental profit cushion of Rs. 1500 to Rs. 2500 max.

      🚨 JUSTIFICATION CONTRACT (IF USER COMPLAINS / SAY MEHNGA HAI):
      ONLY IF the user says "mehnga hai/discount do", provide this exact transparent justification text block:
      "Bhaiya, hamari transparency policy ke mutabik hum aapko bata dein ki is dropping location se wapis aate waqt return booking bilkul nahi milti hai. Gaadi ko ya toh wahan se kisi popular pickup point tak khali jana hoga ya fir poora rasta khali aana hoga, jisse nuksaan hota hai. Fir bhi hum aapse poora Round-Trip fare na lekar, One-Way ke rate ka sirf 1.5 guna hi charge kar rahe hain, jo ki ekdam sahi aur transparent hai."
      Then apply a flat Rs. 500 privilege desk discount to lock the booking.

      🚨 FINAL STEP TICKET DETAIL GENERATION:
      - If currentStep is 'final': Output a beautifully formatted professional ticket booking summary with their name (${bookingData.custName}), pickup, drop, vehicle, and invoice number (${bookingData.invoiceNum}). Include a warm "Thank you for choosing Khatu Rides Travels Co.! Have a safe journey!" message.

      For pricing confirmation blocks, append this exact token at the end of text:
      [TRIGGER_CHECKOUT: {"vehicle": "${bookingData.vehicle}", "amount": ${bookingData.finalAmount}, "pickup": "${bookingData.pickup}", "drop": "${bookingData.drop}"}]
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
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Bhaiya, kripya details dubara confirm karein.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Sakha Sequencer Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
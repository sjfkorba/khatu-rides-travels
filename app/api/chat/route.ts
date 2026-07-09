// app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, currentStep, bookingData } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // 👑 STAGE-BASED SYSTEM INSTRUCTIONS
    let systemInstruction = `
      You are "Sakha", the point-to-point AI Assistant for "Khatu Rides Travels Co." (The best taxi service provider in Chhattisgarh).
      Your response must be extremely short (maximum 1-2 sentences). Do not use any flattery or extra greetings.
    `;

    if (currentStep === "language") {
      systemInstruction += " The user is selecting a language. Acknowledge the language choice in 1 short sentence, and strictly ask them to select or type Trip Type: 'One-way' or 'Round Trip'.";
    } else if (currentStep === "triptype") {
      systemInstruction += " The user is providing the Trip Type. Validate it quickly, and strictly ask them to select Vehicle Type: 'Sedan', 'Ertiga', or 'Innova Crysta'.";
    } else if (currentStep === "vehicle") {
      systemInstruction += " The user is selecting the Vehicle. Validate it quickly, and strictly ask them to provide the Pickup Date and Time.";
    } else if (currentStep === "datetime") {
      systemInstruction += " The user is providing the Date and Time. Validate it quickly, and strictly ask them to confirm the Route (From which city to which destination).";
    } else if (currentStep === "route") {
      systemInstruction += `
        The user has confirmed the route. You must now display the total fare.
        CRITICAL BUSINESS MARGIN RULES:
        - The absolute final fare to show is: Rs. ${bookingData.finalAmount}.00 (All-Inclusive).
        - Explicitly state that this is the best price from Khatu Rides Travels Co.
        - Ask for their Full Name and Phone Number to lock the booking.
        - Append this exact checkout token block at the very end of your response text:
        [TRIGGER_CHECKOUT: {"vehicle": "${bookingData.vehicle}", "amount": ${bookingData.finalAmount}, "pickup": "${bookingData.pickup}", "drop": "${bookingData.drop}", "type": "${bookingData.tripType}"}]
      `;
    }

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
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Bhaiya, please next step confirm karein.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Sakha Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
// app/api/chat/route.ts
import { NextResponse } from "next/server";

const SUPPORT_PHONE = "+91 92441 37353";

export async function POST(req: Request) {
  try {
    const { messages, instruction } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }

    // Comprehensive Guardrails & Context for Sakha AI
    const systemInstruction = `
      You are "Sakha", the polite and helpful regional AI assistant for "Khatu Rides Travels Co." (serving Chhattisgarh - Raipur, Korba, Bilaspur, Raigarh, Ambikapur, Jagdalpur, etc.).

      ${instruction || ""}

      🚨 CRITICAL BUSINESS RULES:
      1. TONE & LANGUAGE:
         - Respond in warm, respectful Hinglish (Hindi written in Roman English script) with polite phrases like "Hii", "Dear Customer", or "Sir/Ma'am".
         - Keep replies extremely concise, crystal-clear, and practical (maximum 2 to 3 short sentences).

      2. STRICT ZERO-FARE RULE (NO PRICE QUOTES):
         - NEVER quote any numerical price, estimate, rate per km, or total rupees (e.g., do not say ₹1500, ₹12/km, etc.).
         - If the user asks about taxi fare, discount, or package price, politely explain:
           "Bhaiya, exact fare humari operations team confirm karti hai route aur live availability ke hisab se. Aap apna contact details form me submit kijiye, ya instant confirmed rate ke liye turant humare helpline par call karein: ${SUPPORT_PHONE}."

      3. WHAT YOU CAN ANSWER:
         - Cab types available (AC Sedan like Dzire/Etios, SUV Ertiga, Luxury Innova Crysta).
         - Available services: Share One Way Cab, Dedicated One Way, Local Hourly Rentals, and Outstation trips.
         - Luggage policy: Ample boot space for standard luggage; carrier available on request for SUVs.
         - Night travel / AC: All cabs are 100% commercial permit AC vehicles with verified drivers available 24x7.
         - Doorstep pickup & Raipur Airport pickup/drop facility.

      4. ALWAYS GUIDE TOWARDS BOOKING / CALL:
         - At the end of every helpful response, encourage them to fill their journey details in the chat or call directly at ${SUPPORT_PHONE}.
    `;

    // Filter and sanitize conversation messages
    const formattedHistory = Array.isArray(messages)
      ? messages
          .filter((m: any) => m && m.content)
          .map((m: any) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          }))
      : [];

    const geminiPayload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: formattedHistory.length > 0 ? formattedHistory : [
        { role: "user", parts: [{ text: "Hello Sakha" }] }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 250,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Gemini API Error Body:", errBody);
      return NextResponse.json({
        reply: `Namaste! Humari dispatch team aapse jald connect karegi. Fast support ke liye call karein: ${SUPPORT_PHONE}`,
      });
    }

    const data = await response.json();
    const replyText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      `Bhaiya, aapki query note kar li gayi hai. Direct confirmation ke liye kripya call karein: ${SUPPORT_PHONE}`;

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Sakha Chat API Error:", error);
    return NextResponse.json(
      {
        reply: `Khatu Rides helpline par direct sampark karein: ${SUPPORT_PHONE}`,
      },
      { status: 500 }
    );
  }
}
// app/api/verify-booking/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Simple helper to initialize Firebase admin fallback natively safely
async function saveToFirebase(bookingData: any) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // Firebase Firestore REST Native API endpoint execution
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/bookings`;
  
  const payload = {
    fields: {
      invoiceId: { stringValue: `KR-${Date.now().toString().substring(6)}` },
      pickup: { stringValue: bookingData.pickup },
      drop: { stringValue: bookingData.drop },
      tripType: { stringValue: bookingData.bookingType },
      vehicle: { stringValue: bookingData.vehicleLabel },
      pickupDate: { stringValue: bookingData.pickupDate },
      pickupTime: { stringValue: bookingData.pickupTime },
      amountPaid: { stringValue: `₹${bookingData.amount}` },
      paymentId: { stringValue: bookingData.razorpayPaymentId },
      status: { stringValue: "CONFIRMED_ONLINE" },
      timestamp: { stringValue: new Date().toISOString() }
    }
  };

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return payload.fields.invoiceId.stringValue;
}

// Telegram Admin Bot Alert Hook
async function sendAdminNotification(invoiceId: string, data: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = 
    `🚨 *NEW KHATU RIDES ONLINE BOOKING* 🚨\n\n` +
    `🆔 *Invoice:* ${invoiceId}\n` +
    `🚖 *Vehicle:* ${data.vehicleLabel}\n` +
    `🔄 *Type:* ${data.bookingType.toUpperCase()}\n\n` +
    `📍 *From:* ${data.pickup}\n` +
    `🏁 *To:* ${data.drop}\n` +
    `📅 *Schedule:* ${data.pickupDate} | ${data.pickupTime}\n\n` +
    `💰 *Paid Amount:* ₹${data.amount}\n` +
    `💳 *Payment ID:* \`${data.razorpayPaymentId}\`\n\n` +
    `🟢 *Status:* Fleet Lineup Authorized!`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "Markdown" }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    const text = razorpayOrderId + "|" + razorpayPaymentId;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    if (generated_signature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment token signature" }, { status: 400 });
    }

    // Save transaction metrics inside Firestore
    const invoiceId = await saveToFirebase(body);
    
    // Alert management team immediately via bot tunnel
    await sendAdminNotification(invoiceId, body);

    return NextResponse.json({ success: true, invoiceId });
  } catch (error: any) {
    console.error("Verification system broken:", error);
    return NextResponse.json({ error: error.message || "Internal crash protection" }, { status: 500 });
  }
}
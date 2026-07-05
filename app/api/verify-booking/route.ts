// app/api/verify-booking/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Helper to initialize Firebase admin natively safely with dynamic user variables
async function saveToFirebase(bookingData: any) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  
  // REST API endpoint reference definition
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/bookings`;
  
  // 👑 UPDATED payload schema map: Ensuring total null safety with fallback defaults
  const payload = {
    fields: {
      invoiceId: { stringValue: `KR-${Date.now().toString().substring(6)}` },
      customerName: { stringValue: bookingData.customerName || "Guest User" },
      customerPhone: { stringValue: bookingData.customerPhone || "0000000000" },
      pickup: { stringValue: bookingData.pickup || "" },
      drop: { stringValue: bookingData.drop || "" },
      tripType: { stringValue: bookingData.bookingType || "oneway" },
      vehicle: { stringValue: bookingData.vehicleLabel || "" },
      pickupDate: { stringValue: bookingData.pickupDate || "" },
      pickupTime: { stringValue: bookingData.pickupTime || "" },
      
      // 👑 NEW: Adding support for Round Trip duration safety bounds
      returnDate: { stringValue: bookingData.returnDate || "N/A" },
      returnTime: { stringValue: bookingData.returnTime || "N/A" },
      
      amountPaid: { stringValue: `₹${bookingData.amount || 0}` },
      paymentId: { stringValue: bookingData.razorpayPaymentId || "" },
      status: { stringValue: "CONFIRMED_ONLINE" },
      timestamp: { stringValue: new Date().toISOString() }
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Firestore REST API Error: ${errText}`);
  }

  return payload.fields.invoiceId.stringValue;
}

// Telegram Admin Bot Alert Hook with Customer Identity
async function sendAdminNotification(invoiceId: string, data: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  // 👑 RE-CONFIGURED TELEGRAM MESSAGE BLUEPRINT (Includes Client Phone link directly)
  const text = 
    `🚨 *NEW KHATU RIDES ONLINE BOOKING* 🚨\n\n` +
    `🆔 *Invoice:* ${invoiceId}\n` +
    `👤 *Customer:* ${data.customerName || "Guest User"}\n` +
    `📞 *Phone:* ${data.customerPhone || "N/A"}\n\n` +
    `🚖 *Vehicle:* ${data.vehicleLabel}\n` +
    `🔄 *Type:* ${data.bookingType.toUpperCase()}\n\n` +
    `📍 *From:* ${data.pickup}\n` +
    `🏁 *To:* ${data.drop}\n` +
    `📅 *Schedule:* ${data.pickupDate} | ${data.pickupTime}\n` +
    `${data.bookingType === "roundtrip" ? `🔙 *Return:* ${data.returnDate} | ${data.returnTime}\n` : ""}\n` +
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

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing required Razorpay signature fields" }, { status: 400 });
    }

    const text = razorpayOrderId + "|" + razorpayPaymentId;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    if (generated_signature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment token signature" }, { status: 400 });
    }

    // Save transaction metrics inside Firestore REST node safely
    const invoiceId = await saveToFirebase(body);
    
    // Alert management team immediately via bot tunnel
    await sendAdminNotification(invoiceId, body);

    return NextResponse.json({ success: true, invoiceId });
  } catch (error: any) {
    console.error("Verification system broken:", error);
    return NextResponse.json({ error: error.message || "Internal crash protection" }, { status: 500 });
  }
}
// app/api/create-order/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 👑 FIX: Extract 'amount' from the frontend payload
    const { amount, pickup, drop, vehicleLabel } = body;

    // Safety Check: Agar amount nahi aaya ya galat hai, toh error return karein
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid payment amount received." },
        { status: 400 }
      );
    }

    const options = {
      // 👑 FIX: Dynamic amount dynamically converted to Paise
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        pickup: pickup || "N/A",
        drop: drop || "N/A",
        vehicle: vehicleLabel || "N/A",
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Order creation failed" },
      { status: 500 }
    );
  }
}
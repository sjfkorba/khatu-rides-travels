// app/api/create-order/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, pickup, drop, vehicleLabel } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: "Amount required" }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // convert rupees to paise
      currency: "INR",
      receipt: `rec_${Date.now()}`,
      notes: {
        pickup_loc: pickup.substring(0, 50),
        drop_loc: drop.substring(0, 50),
        vehicle: vehicleLabel,
      },
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: error.message || "Order creation failed" }, { status: 500 });
  }
}
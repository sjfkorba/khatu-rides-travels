// app/api/create-order/route.ts

import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, pickupDate, pickupTime } = await req.json();

    // 1. Fetch exact current system runtime clock factors in India Standard Time
    const serverDate = new Date();
    const istHourStr = serverDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false });
    const currentIstHour = parseInt(istHourStr, 10);
    const istDateStr = serverDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" });
    
    // Normalize format to YYYY-MM-DD
    const [im, id, iy] = istDateStr.split("/");
    const normalizedToday = `${iy}-${im}-${id}`;

    const isCurrentlyNight = currentIstHour >= 22 || currentIstHour < 6;

    // 2. RUN TRANSACTION BOUNDARY CROSS-CHECK
    if (isCurrentlyNight && pickupDate && pickupTime) {
      const [pHour] = pickupTime.split(":").map(Number);
      
      if (normalizedToday === pickupDate) {
        if (pHour >= 22 || pHour < 7) {
          return NextResponse.json(
            { error: "Raat ko instant current night ki ride ke liye online payment allowed nahi hai. Kripya manual team se WhatsApp par sampark karein." },
            { status: 403 }
          );
        }
      } else {
        // Calculate tomorrow match parameters
        const tomorrow = new Date(serverDate);
        tomorrow.setDate(serverDate.getDate() + 1);
        const tHourStr = tomorrow.toLocaleString("en-US", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" });
        const [tm, td, ty] = tHourStr.split("/");
        const normalizedTomorrow = `${ty}-${tm}-${td}`;

        if (currentIstHour < 6 && normalizedToday === pickupDate && pHour < 7) {
          return NextResponse.json({ error: "Immediate early morning run locked to manual assignment." }, { status: 403 });
        }
        if (currentIstHour >= 22 && normalizedTomorrow === pickupDate && pHour < 7) {
          return NextResponse.json({ error: "Tomorrow morning urgent runs are handled via offline operators." }, { status: 403 });
        }
      }
    }

    const options = {
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: `receipt_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Order Validation Error Code Sequence Exception: ", error);
    return NextResponse.json({ error: "Razorpay framework failed to initiate payment sequence." }, { status: 500 });
  }
}
// components/SlidingTicker.tsx
"use client";

import React from "react";

export default function SlidingTicker() {
  const tickerText = "⚡ For More Discount and Getting Rs. 1101/- Wallet Balance Please Signup with Khatu Rides Travels Co. and get more offers as a Premium Customer. 🚗 One Way Fare Will be depends on Availability of Vehicle and Drop Location. 🛡️ We are Providing 24x7 Customer Supports, If any issue will comes during your journery, please make call on 9244137353. 📞";

  return (
    <div className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white py-2.5 overflow-hidden shadow-inner relative z-30 select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider mx-4">
          {tickerText}
        </span>
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider mx-4" aria-hidden="true">
          {tickerText}
        </span>
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider mx-4" aria-hidden="true">
          {tickerText}
        </span>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Image from "next/image";
import { PHONE, PHONE_DISPLAY, WHATSAPP } from "./data";
import Icon from "./Icons";

export default function Hero() {
  // Form State for Lead Capture
  const [tripType, setTripType] = useState("One-Way");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [travelDate, setTravelDate] = useState("");

  const telUrl = `tel:${PHONE}`;

  // Handle Form Submit -> Redirect to WhatsApp with pre-filled details
  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !drop) return;
    
    const message = `Hello Khatu Rides, I need an enquiry:\n*Trip Type:* ${tripType}\n*From:* ${pickup}\n*To:* ${drop}\n*Date:* ${travelDate || "Flexible"}\n\nPlease share the best fare.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && typeof (window as any).gtag_report_conversion === "function") {
      (window as any).gtag_report_conversion(telUrl);
    } else {
      window.location.href = telUrl;
    }
  };

  return (
    <section className="relative bg-slate-50 overflow-hidden font-sans pt-4 pb-12 lg:py-12">
      {/* -------------------------------------------------------------
          1. TOP HINDI MARQUEE TICKER 
      -------------------------------------------------------------- */}
      <div className="absolute top-0 w-full bg-slate-900 border-b-4 border-amber-400 z-20">
        <div className="flex h-10 items-center overflow-hidden max-w-7xl mx-auto px-4">
          <div className="flex shrink-0 animate-marquee items-center gap-12 text-[13px] font-medium tracking-wide text-white">
            <span className="inline-flex items-center gap-2">
              <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900 uppercase">Discount</span>
              कोरबा से रायपुर / बिलासपुर वन-वे टैक्सी. एडवांस बुकिंग पर विशेष छूट!
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            <span className="inline-flex items-center gap-2">
              <span className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">24/7 Service</span>
              छत्तीसगढ़ में एयरपोर्ट ड्रॉप और कमर्शियल बुकिंग के लिए तुरंत कॉल करें.
            </span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 mt-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          
          {/* -------------------------------------------------------------
              LEFT COLUMN: HIGH-IMPACT BUSINESS PITCH & TRUST SIGNALS
          -------------------------------------------------------------- */}
          <div className="space-y-7 z-10 lg:col-span-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800 mb-4 border border-amber-200">
                ⭐ 4.9/5 Top Rated Travel Firm in CG
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] leading-[1.1]">
                KHATU RIDES <br />
                <span className="text-amber-500">TRAVELS CO.</span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 font-semibold max-w-lg">
                Premium Cabs for One-Way, Round Trips & Airport Transfers. <br className="hidden sm:block"/> 
                <span className="text-slate-900">Zero Hidden Cost. Pay After Drop.</span>
              </p>
            </div>

            {/* Quick Action Buttons (Primary CTAs) */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={telUrl}
                onClick={handleCall}
                className="group flex flex-1 items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-4 font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon name="phone" size={24} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wider text-amber-400 font-bold">Call Dispatch Desk</span>
                  <span className="text-xl tracking-wide">{PHONE_DISPLAY || "Call Us Now"}</span>
                </div>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello`}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-1 items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 font-bold text-white shadow-lg shadow-green-200 transition-all hover:bg-[#20bd5a] hover:shadow-xl hover:-translate-y-1"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon name="whatsapp" size={24} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wider text-green-100 font-bold">Fastest Reply</span>
                  <span className="text-xl tracking-wide">WhatsApp Us</span>
                </div>
              </a>
            </div>

            {/* Trust Badges - Crucial for Conversion */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 max-w-lg">
              <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl mb-1">🛡️</span>
                <span className="text-xs font-bold text-slate-800">Verified Drivers</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl mb-1">₹</span>
                <span className="text-xs font-bold text-slate-800">No Advance</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl mb-1">❄️</span>
                <span className="text-xs font-bold text-slate-800">Clean AC Cabs</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              RIGHT COLUMN: LEAD CAPTURE FORM (BUSINESS ENGINE)
          -------------------------------------------------------------- */}
          <div className="lg:col-span-5 z-10 w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 p-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/pattern.png')] mix-blend-overlay"></div>
                <h3 className="text-xl font-extrabold text-white relative z-10">Get Instant Fare Quote</h3>
                <p className="text-amber-400 text-sm font-semibold relative z-10 mt-1">100% Assured Cab Availability</p>
              </div>
              
              <form onSubmit={handleQuickBook} className="p-6 space-y-5">
                {/* Trip Type Selector */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {["One-Way", "Round Trip", "Airport"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTripType(type)}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                        tripType === type 
                          ? "bg-white text-slate-900 shadow-sm" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pickup City</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Korba, Raipur Airport" 
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Drop City</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bilaspur, Ambikapur" 
                      value={drop}
                      onChange={(e) => setDrop(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Travel Date</label>
                    <input 
                      type="date" 
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-lg py-4 rounded-xl shadow-[0_4px_14px_0_rgba(251,191,36,0.39)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.23)] hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
                >
                  Check Fare on WhatsApp <Icon name="whatsapp" size={20} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-amber-300/20 rounded-full blur-[80px] -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] -z-10" />

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
// Assumed data import
import { ROUTES } from "./data"; 

const WHATSAPP_NUMBER = "919244137353";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

function getWhatsAppUrl(from: string, to: string) {
  const message = `Hello Khatu Rides Travels,\n\nI want to book a cab for:\n📍 *Pickup:* ${from}\n📍 *Destination:* ${to}\n\nPlease share the available cab options, fare and booking details.\n\nThank you.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function PopularRoutes() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollRoutes = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const amount = Math.min(sliderRef.current.clientWidth * 0.8, 400);
    sliderRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section id="routes" className="relative overflow-hidden bg-slate-50 py-16 lg:py-24 font-sans">
      {/* Background Subtle Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================
            SECTION HEADER (Premium & Clean)
        ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 mb-4">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Trending Routes
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl mb-3">
              Most Booked <span className="text-amber-500">Cab Routes</span>
            </h2>
            <p className="text-sm sm:text-base font-medium text-slate-600 max-w-lg">
              Affordable one-way and outstation cabs with verified drivers. Lock your fare today and pay after the ride.
            </p>
          </div>

          {/* Slider Controls (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scrollRoutes("left")}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-95"
              aria-label="Previous routes"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scrollRoutes("right")}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
              aria-label="Next routes"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* =========================================================
            CARDS SLIDER (Modern UI)
        ========================================================= */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-5 sm:gap-6 overflow-x-auto pb-8 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {ROUTES.map((route, index) => (
              <article
                key={`${route.from}-${route.to}`}
                className="group relative flex-none w-[300px] sm:w-[340px] snap-start flex flex-col bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden"
              >
                {/* Upper Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={route.image}
                    alt={`${route.from} to ${route.to} cab`}
                    loading={index < 3 ? "eager" : "lazy"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Subtle Dark Gradient for Text Visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-white/95 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-sm">
                      One-Way Trip
                    </span>
                  </div>
                  {index < 3 && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-amber-400 text-[10px] font-black uppercase tracking-wider text-amber-950 shadow-sm">
                        🔥 Popular
                      </span>
                    </div>
                  )}

                  {/* Route overlay on image bottom */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-900">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-black tracking-tight drop-shadow-md">
                      {route.from} <span className="text-amber-400 mx-1">→</span> {route.to}
                    </h3>
                  </div>
                </div>

                {/* Card Body content */}
                <div className="flex flex-col flex-grow p-5 sm:p-6">
                  {/* Meta / Description */}
                  <p className="text-sm font-medium text-slate-500 line-clamp-2 min-h-[40px] mb-4">
                    {route.meta || "Comfortable AC cabs with verified drivers for a safe and smooth journey."}
                  </p>

                  <div className="mt-auto space-y-4">
                    {/* Price & Features */}
                    <div className="flex items-end justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">
                          Starting Fare
                        </p>
                        <div className="flex items-baseline gap-1 text-slate-900">
                          <span className="text-2xl font-black">{route.price}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> No Advance
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                          <CheckCircle2 className="h-3 w-3" /> Toll Included
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <a
                      href={getWhatsAppUrl(route.from, route.to)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-200 transition-all hover:-translate-y-1 hover:bg-[#20bd5a] hover:shadow-xl active:translate-y-0"
                    >
                      <MessageCircle className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
                      Book via WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile Swipe Hint */}
          <div className="mt-2 flex items-center justify-center gap-2 sm:hidden text-slate-400">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Swipe to explore
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* =========================================================
            BOTTOM CUSTOM ROUTE CTA (Conversion Focused)
        ========================================================= */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-slate-900 relative shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Don't see your specific route?
              </h3>
              <p className="text-slate-300 font-medium text-sm sm:text-base">
                We operate across all of Chhattisgarh! Just text us your Pickup and Drop location, and our dispatch team will share the best possible fare instantly.
              </p>
            </div>
            
            <a
              href={`${WHATSAPP_URL}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20know%20the%20fare%20for%20a%20custom%20route.`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-3 rounded-xl bg-amber-400 px-8 py-4 text-sm font-black uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-500/30 transition-transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
              Ask on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
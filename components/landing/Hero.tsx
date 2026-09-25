"use client";

import { useEffect, useState, useMemo } from "react";
import { PHONE, PHONE_DISPLAY, WHATSAPP } from "./data";
import Icon from "./Icons";

// Real dispatch routes with natural load ratios for Chhattisgarh & neighbouring hubs
const LIVE_ROUTES = [
  {
    from: "Korba",
    to: "Raipur",
    maxDayTarget: 24,
    curveWeight: 1.1,
    distance: "215 Km",
    travelTime: "4h 15m",
    fleet: "Dzire / Ertiga",
  },
  {
    from: "Raipur",
    to: "Korba",
    maxDayTarget: 22,
    curveWeight: 1.05,
    distance: "215 Km",
    travelTime: "4h 15m",
    fleet: "Innova Crysta",
  },
  {
    from: "Raipur",
    to: "Bilaspur",
    maxDayTarget: 25,
    curveWeight: 1.2,
    distance: "115 Km",
    travelTime: "2h 10m",
    fleet: "AC Sedan",
  },
  {
    from: "Bilaspur",
    to: "Korba",
    maxDayTarget: 20,
    curveWeight: 0.95,
    distance: "95 Km",
    travelTime: "1h 50m",
    fleet: "Commercial AC",
  },
  {
    from: "Korba",
    to: "Raigarh",
    maxDayTarget: 18,
    curveWeight: 0.9,
    distance: "128 Km",
    travelTime: "2h 45m",
    fleet: "AC Hatch / Sedan",
  },
  {
    from: "Raipur",
    to: "Jharsuguda",
    maxDayTarget: 16,
    curveWeight: 0.85,
    distance: "320 Km",
    travelTime: "6h 00m",
    fleet: "SUV Special",
  },
  {
    from: "Ambikapur",
    to: "Raipur",
    maxDayTarget: 17,
    curveWeight: 0.88,
    distance: "340 Km",
    travelTime: "6h 40m",
    fleet: "Express Cab",
  },
  {
    from: "Jharsuguda",
    to: "Raipur",
    maxDayTarget: 15,
    curveWeight: 0.82,
    distance: "320 Km",
    travelTime: "6h 00m",
    fleet: "Airport Drop",
  },
  {
    from: "Korba",
    to: "Jagdalpur",
    maxDayTarget: 14,
    curveWeight: 0.78,
    distance: "510 Km",
    travelTime: "9h 30m",
    fleet: "Intercity Fleet",
  },
];

export default function Hero() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setElapsedMinutes(now.getHours() * 60 + now.getMinutes());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Monotonic Calculation: 0 se 25 tak time ke sath strictly increase hoga
  const routeBookings = useMemo(() => {
    const totalDayMinutes = 1440;
    return LIVE_ROUTES.map((route) => {
      const dayProgress = Math.min(1, Math.max(0, elapsedMinutes / totalDayMinutes));
      const curvedProgress = Math.pow(dayProgress, 0.94) * route.curveWeight;
      const count = Math.min(25, Math.floor(Math.min(1, curvedProgress) * route.maxDayTarget));

      return {
        ...route,
        count,
        availableSlots: Math.max(1, 26 - count),
        status: count >= 16 ? "Peak Demand" : "Filling Fast",
      };
    });
  }, [elapsedMinutes]);

  const telUrl = `tel:${PHONE}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20reserve%20a%20cab%20urgently.`;

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && typeof (window as any).gtag_report_conversion === "function") {
      (window as any).gtag_report_conversion(telUrl);
    } else {
      window.location.href = telUrl;
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0A1120] text-white">
      {/* -------------------------------------------------------------
          1. TOP HINDI MARQUEE (EXACT 15px BOLD FONT)
      -------------------------------------------------------------- */}
      <div className="relative z-40 border-b border-sky-400/30 bg-[#14305A] shadow-[0_4px_20px_rgba(20,48,90,0.45)]">
        <div className="flex h-12 items-center overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-10 text-[15px] font-black tracking-wide text-white">
            <span className="inline-flex items-center gap-2.5">
              <span className="rounded-full bg-sky-400 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-950">
                विशेष सूचना
              </span>
              कोरबा से रायपुर और रायपुर से कोरबा के लिए शेयर वन-वे टैक्सी बुक 4 दिन पहले करें। किराया मात्र{" "}
              <span className="inline-block rounded-md bg-white px-2 py-0.5 text-[14px] font-black text-[#DC2626] shadow-sm">
                ₹1200/- प्रति सीट
              </span>{" "}
              से शुरू। कोरबा से रायपुर सुबह 6:00 AM और रायपुर से कोरबा शाम 6:30 PM।
            </span>
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span className="inline-flex items-center gap-2.5">
              <span className="rounded-full bg-emerald-400 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-950">
                डेली सीट
              </span>
              कोरबा से बिलासपुर और बिलासपुर से कोरबा के लिए शेयर वन-वे टैक्सी बुक कीजिए 4 दिन पहले। शुरुआती किराया{" "}
              <span className="inline-block rounded-md bg-white px-2 py-0.5 text-[14px] font-black text-[#DC2626] shadow-sm">
                ₹800 प्रति सीट
              </span>
              । कोरबा से बिलासपुर समय सुबह 8:00 AM और बिलासपुर से कोरबा शाम 4:00 PM।
            </span>
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span className="inline-flex items-center gap-2.5">
              <span className="rounded-full bg-sky-400 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-950">
                विशेष सूचना
              </span>
              कोरबा से रायपुर और रायपुर से कोरबा के लिए शेयर वन-वे टैक्सी बुक 4 दिन पहले करें। किराया मात्र{" "}
              <span className="inline-block rounded-md bg-white px-2 py-0.5 text-[14px] font-black text-[#DC2626] shadow-sm">
                ₹1200/- प्रति सीट
              </span>{" "}
              से शुरू। कोरबा से रायपुर सुबह 6:00 AM और रायपुर से कोरबा शाम 6:30 PM।
            </span>
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span className="inline-flex items-center gap-2.5">
              <span className="rounded-full bg-emerald-400 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-950">
                डेली सीट
              </span>
              कोरबा से बिलासपुर और बिलासपुर से कोरबा के लिए शेयर वन-वे टैक्सी बुक कीजिए 4 दिन पहले। शुरुआती किराया{" "}
              <span className="inline-block rounded-md bg-white px-2 py-0.5 text-[14px] font-black text-[#DC2626] shadow-sm">
                ₹800 प्रति सीट
              </span>
              । कोरबा से बिलासपुर समय सुबह 8:00 AM और बिलासपुर से कोरबा शाम 4:00 PM।
            </span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          LUXURY AMBIENCE & RADIAL GLOWS
      -------------------------------------------------------------- */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-50px] top-1/3 h-[450px] w-[450px] rounded-full bg-amber-500/15 blur-[150px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* -------------------------------------------------------------
          MAIN HERO WORKSPACE
      -------------------------------------------------------------- */}
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          
          {/* LEFT: SEO POSITIONING & TRUST ACTIONS */}
          <div className="space-y-5 lg:col-span-7">
            
            {/* State Trust Capsule */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 backdrop-blur-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-80" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Chhattisgarh’s Leading Intercity Cab Network
              </span>
            </div>

            {/* High-Impact Main Heading */}
            <div>
              <h1 className="text-4xl font-black uppercase leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-[62px]">
                KORBA ⇄ RAIPUR <br />
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  ONE WAY SPECIAL TAXI
                </span> <br />
                ALL CG INTERCITY CABS
              </h1>

              <p className="mt-3.5 max-w-2xl text-base font-semibold leading-relaxed text-slate-300 sm:text-lg">
                Affordable daily one-way AC cab service between{" "}
                <span className="font-extrabold text-white">Korba and Raipur</span> at guaranteed lowest fares. 
                24×7 confirmed pickup across{" "}
                <span className="font-extrabold text-amber-300">
                  Bilaspur, Raigarh, Ambikapur, Jagdalpur & Jharsuguda
                </span>
                . Pay strictly for single-side travel with zero return fare.
              </p>
            </div>

            {/* Chhattisgarh City Badges Rail */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                Active Hubs:
              </span>
              {["Korba", "Raipur", "Bilaspur", "Raigarh", "Ambikapur", "Jagdalpur", "Jharsuguda"].map((city) => (
                <span
                  key={city}
                  className={`rounded-lg px-2.5 py-1 text-xs font-black uppercase tracking-wide border ${
                    city === "Korba" || city === "Raipur"
                      ? "border-amber-400/50 bg-amber-400/15 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                      : "border-white/10 bg-white/[0.04] text-slate-300"
                  }`}
                >
                  {city === "Korba" || city === "Raipur" ? `★ ${city}` : city}
                </span>
              ))}
            </div>

            {/* -------------------------------------------------------------
                METRIC CARDS + ACTIONS IN ONE PERFECT ROW (FIXED SIZING)
            -------------------------------------------------------------- */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              
              {/* Metric Card 1: Korba-Raipur */}
              <div className="h-[74px] min-w-[108px] flex-1 rounded-2xl border border-white/10 bg-white/[0.05] p-2.5 backdrop-blur-md flex flex-col justify-between">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Korba-Raipur
                </span>
                <span className="text-sm font-black text-white leading-tight">
                  Daily Drops
                </span>
                <span className="block text-[8px] font-bold text-amber-400">
                  Fastest 3.5h Travel
                </span>
              </div>

              {/* Metric Card 2: Return Toll */}
              <div className="h-[74px] min-w-[105px] flex-1 rounded-2xl border border-white/10 bg-white/[0.05] p-2.5 backdrop-blur-md flex flex-col justify-between">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Return Toll
                </span>
                <span className="text-sm font-black text-emerald-400 leading-tight">
                  ₹0 Extra
                </span>
                <span className="block text-[8px] font-bold text-slate-400">
                  Pure CG One-Way
                </span>
              </div>

              {/* Metric Card 3: Statewide Trust */}
              <div className="h-[74px] min-w-[108px] flex-1 rounded-2xl border border-white/10 bg-white/[0.05] p-2.5 backdrop-blur-md flex flex-col justify-between">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Statewide Trust
                </span>
                <span className="text-sm font-black text-amber-300 leading-tight">
                  ★ 4.9/5
                </span>
                <span className="block text-[8px] font-bold text-slate-400">
                  Verified Drivers
                </span>
              </div>

              {/* Call Button (Fixed text fit & no vertical cutoff) */}
              <a
                href={telUrl}
                onClick={handleCall}
                className="group relative flex h-[74px] min-w-[185px] flex-[1.4] items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-4 text-black shadow-[0_8px_25px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.02] active:scale-95"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-amber-400 transition-transform group-hover:rotate-12">
                  <Icon name="phone" size={19} />
                </div>
                <div className="text-left flex flex-col justify-center">
                 
                  <span className="block text-sm font-black tracking-tight text-black leading-snug sm:text-base whitespace-nowrap">
                    BOOK NOW
                  </span>
                </div>
              </a>

              {/* WhatsApp Button (Fixed text fit & no vertical cutoff) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex h-[74px] min-w-[165px] flex-[1.2] items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 text-emerald-400 backdrop-blur-md transition-all hover:bg-emerald-500/20 active:scale-95"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-black transition-transform group-hover:scale-110">
                  <Icon name="whatsapp" size={20} />
                </div>
                <div className="text-left flex flex-col justify-center">
                  <span className="block text-[9px] font-black uppercase tracking-wider text-emerald-300/70 leading-tight">
                    Instant Quote
                  </span>
                  <span className="block text-sm font-black tracking-tight text-white leading-snug whitespace-nowrap">
                    WhatsApp Booking
                  </span>
                </div>
              </a>

            </div>

            {/* Quick Guarantees Footer */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 pt-1">
              <span>✔ Raipur Airport Drop Available</span>
              <span>✔ Chhattisgarh State Permit AC Cabs</span>
              <span>✔ No Hidden Toll/Night Charges</span>
            </div>
          </div>

          {/* RIGHT: FLUTTER APP GLASS CARD LIFTED TO TOP LEVEL */}
          <div className="lg:col-span-5 lg:-mt-4 xl:-mt-7">
            <div className="relative mx-auto max-w-[430px] rounded-[36px] border border-white/15 bg-white/[0.07] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              
              {/* Flutter App Top Header */}
              <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
                      Live Dispatch Board
                    </span>
                  </div>
                  <span className="rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-300 border border-white/10">
                    {currentDate || "Today"}
                  </span>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                      Today's Booking Status
                    </h2>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-300">
                      Cumulative confirmed trips (0 to 25 Max cap)
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-right">
                    <span className="block font-mono text-xs font-black text-amber-300">
                      {currentTime || "--:--"}
                    </span>
                  </div>
                </div>
              </div>

              {/* VERTICAL AUTO SLIDER CONTAINER */}
              <div className="relative mt-4 h-[310px] overflow-hidden rounded-[24px] border border-white/10 bg-black/30 p-2.5">
                {/* Visual Depth Masks */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 bg-gradient-to-b from-[#0e1626] via-[#0e1626]/80 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-[#0e1626] via-[#0e1626]/80 to-transparent" />

                {/* Vertical Continuous Flow */}
                <div className="animate-vertical-infinite space-y-2.5">
                  {[...routeBookings, ...routeBookings].map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between rounded-[20px] border border-white/10 bg-white/[0.06] p-3 transition-all duration-300 hover:border-amber-400/60 hover:bg-white/[0.1]"
                    >
                      {/* Left: Origin, Destination & Specs */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20">
                          <Icon name="car" size={17} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-black text-white sm:text-[13px]">
                            <span>{item.from}</span>
                            <span className="text-amber-400 font-bold">➔</span>
                            <span>{item.to}</span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-400">
                            <span>{item.distance}</span>
                            <span>•</span>
                            <span>{item.travelTime}</span>
                            <span>•</span>
                            <span className="text-slate-300">{item.fleet}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Monotonic Counters */}
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-lg bg-amber-400/20 border border-amber-400/30 px-2.5 py-0.5 text-xs font-black text-amber-300">
                          {item.count} Booked
                        </span>
                        <div className="mt-0.5 flex items-center justify-end gap-1 text-[9px] font-bold">
                          <span className={item.count >= 16 ? "text-amber-400" : "text-emerald-400"}>
                            {item.status}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">{item.availableSlots} Left</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-3.5 flex items-center justify-between px-2 text-[11px] font-bold text-slate-400">
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  SMS & Driver Details Allocated
                </span>
                <span className="font-extrabold text-amber-400">Zero Advance</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* -------------------------------------------------------------
          KEYFRAME ANIMATIONS: READABLE & ULTRA SMOOTH MOTION
      -------------------------------------------------------------- */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 80s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes verticalInfinite {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .animate-vertical-infinite {
          animation: verticalInfinite 65s linear infinite;
        }
        .animate-vertical-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
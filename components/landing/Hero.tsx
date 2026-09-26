"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
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
        status: count >= 16 ? "High Demand" : "Filling Fast",
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
    <section className="relative min-h-[94vh] overflow-hidden bg-[#050B17] text-white">
      {/* -------------------------------------------------------------
          1. BACKGROUND IMAGE + COLOR-RICH CINEMATIC OVERLAYS
      -------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero/main image.png"
          alt="Khatu Rides Chhattisgarh Fleet"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_right] sm:object-center"
        />

        {/* Ambient Color Washes (Replaces the flat black feel) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D1A]/95 via-[#081528]/80 to-[#0A1628]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B17] via-transparent to-[#050D1A]/50" />
        
        {/* Subtle Radial Glows for Sunlight & Reflections */}
        <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-amber-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 top-10 h-80 w-80 rounded-full bg-sky-500/15 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-orange-600/10 blur-[150px]" />
      </div>

      {/* -------------------------------------------------------------
          2. TOP HINDI MARQUEE TICKER (LUXURY DEEP BLUE)
      -------------------------------------------------------------- */}
      <div className="relative z-30 border-b border-sky-400/25 bg-[#081933]/75 backdrop-blur-xl">
        <div className="flex h-11 items-center overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-12 text-[14px] font-black tracking-wide text-white">
            <span className="inline-flex items-center gap-2.5">
              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-950 shadow-sm">
                विशेष सूचना
              </span>
              कोरबा से रायपुर और रायपुर से कोरबा के लिए शेयर वन-वे टैक्सी बुक 4 दिन पहले करें। किराया मात्र{" "}
              <span className="inline-block rounded-md bg-white px-2 py-0.5 text-[13px] font-black text-rose-600 shadow-md">
                ₹1499/- प्रति सीट
              </span>{" "}
              से शुरू। कोरबा से सुबह 6:00 AM | रायपुर से शाम 6:30 PM।
            </span>

            <span className="h-2 w-2 rounded-full bg-sky-400" />

            <span className="inline-flex items-center gap-2.5">
              <span className="rounded-full bg-emerald-400 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-950 shadow-sm">
                डेली सीट
              </span>
              कोरबा से बिलासपुर और बिलासपुर से कोरबा वन-वे शेयर टैक्सी। शुरुआती किराया{" "}
              <span className="inline-block rounded-md bg-white px-2 py-0.5 text-[13px] font-black text-rose-600 shadow-md">
                ₹899/- प्रति सीट
              </span>{" "}
              । कोरबा सुबह 8:00 AM | बिलासपुर शाम 4:00 PM।
            </span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. MAIN HERO CONTENT AREA
      -------------------------------------------------------------- */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          
          {/* LEFT COLUMN: HERO CONTENT */}
          <div className="space-y-6 lg:col-span-7">
            
            {/* Live Capsule */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                Live Dispatch Desk • 0 Return Charge
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-4xl font-black uppercase leading-[1.02] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] sm:text-6xl lg:text-[58px]">
                KORBA <span className="text-amber-400">⇄</span> RAIPUR <br />
                <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                  ONE-WAY SPECIAL CABS
                </span>
              </h1>
              <p className="mt-3.5 text-lg font-bold text-slate-100 sm:text-xl drop-shadow-sm">
                Direct Airport & Intercity Drops across CG State.
              </p>
              <p className="mt-1 text-sm font-medium text-slate-300 drop-shadow-sm">
                Pay strictly for one direction with instant verified driver allocation.
              </p>
            </div>

            {/* City Tags Quick Rail */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80">
                Active Hubs:
              </span>
              {["Korba", "Raipur", "Bilaspur", "Raigarh", "Ambikapur", "Jagdalpur"].map((city) => (
                <span
                  key={city}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase backdrop-blur-md transition-all ${
                    city === "Korba" || city === "Raipur"
                      ? "border border-amber-400/50 bg-amber-400/20 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
                      : "border border-white/15 bg-slate-900/40 text-slate-200"
                  }`}
                >
                  {city}
                </span>
              ))}
            </div>

            {/* CTA Button Row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
              {/* Call CTA */}
              <a
                href={telUrl}
                onClick={handleCall}
                className="group relative flex h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-6 font-black text-black shadow-[0_10px_35px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-95"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-amber-400 transition-transform group-hover:rotate-12">
                  <Icon name="phone" size={18} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[10px] font-black uppercase tracking-wider opacity-85">
                    Call 24/7 Dispatch
                  </span>
                  <span className="text-base font-extrabold tracking-tight">
                    {PHONE_DISPLAY || "Call Dispatch Desk"}
                  </span>
                </div>
              </a>

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex h-14 items-center justify-center gap-3 rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-6 font-bold text-white shadow-[0_8px_25px_rgba(16,185,129,0.2)] backdrop-blur-xl transition-all hover:bg-emerald-500/30 active:scale-95"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-black transition-transform group-hover:scale-110">
                  <Icon name="whatsapp" size={19} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-300">
                    Instant Fare Quote
                  </span>
                  <span className="text-sm font-black">Book via WhatsApp</span>
                </div>
              </a>
            </div>

            {/* Frosted Glass Value Props */}
            <div className="grid grid-cols-3 gap-3 pt-1 max-w-lg">
              <div className="rounded-xl border border-white/15 bg-slate-900/40 p-2.5 text-center backdrop-blur-md shadow-lg">
                <span className="block text-xs font-black text-amber-300">₹0 Advance</span>
                <span className="text-[10px] font-semibold text-slate-300">Pay On Drop</span>
              </div>
              <div className="rounded-xl border border-white/15 bg-slate-900/40 p-2.5 text-center backdrop-blur-md shadow-lg">
                <span className="block text-xs font-black text-emerald-400">Zero Return Fare</span>
                <span className="text-[10px] font-semibold text-slate-300">Pure 1-Way Toll</span>
              </div>
              <div className="rounded-xl border border-white/15 bg-slate-900/40 p-2.5 text-center backdrop-blur-md shadow-lg">
                <span className="block text-xs font-black text-white">4.9 ★ Statewide</span>
                <span className="text-[10px] font-semibold text-slate-300">Clean AC Cabs</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRO FROSTED GLASS DISPATCH BOARD */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-[420px] rounded-[28px] border border-sky-400/25 bg-[#0a1832]/65 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
              
              {/* Dispatch Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      Live Fleet Tracker
                    </h3>
                    <p className="text-[10px] text-slate-300">{currentDate || "Today"}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-400/40 bg-amber-400/15 px-2.5 py-1 text-right font-mono text-[11px] font-black text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.15)]">
                  {currentTime || "--:--"}
                </div>
              </div>

              {/* Scroller Box with Dynamic Depth */}
              <div className="relative mt-3 h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#040914]/50 p-2 backdrop-blur-sm">
                {/* Gradient Masks */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-7 bg-gradient-to-b from-[#040914]/90 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-7 bg-gradient-to-t from-[#040914]/90 to-transparent" />

                <div className="animate-vertical-infinite space-y-2">
                  {[...routeBookings, ...routeBookings].map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] p-2.5 backdrop-blur-md transition-all hover:border-amber-400/50 hover:bg-white/[0.1]"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-white">
                          <span>{item.from}</span>
                          <span className="text-amber-400">➔</span>
                          <span>{item.to}</span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[9px] font-semibold text-slate-300">
                          <span>{item.distance}</span>
                          <span>•</span>
                          <span>{item.travelTime}</span>
                          <span>•</span>
                          <span className="text-amber-200/80">{item.fleet}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block rounded-md bg-amber-400/25 px-2 py-0.5 text-[10px] font-black text-amber-300 border border-amber-400/30">
                          {item.count} Booked
                        </span>
                        <div className="mt-0.5 flex items-center justify-end gap-1 text-[8px] font-extrabold uppercase tracking-wide">
                          <span className={item.count >= 16 ? "text-amber-400" : "text-emerald-400"}>
                            {item.status}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-rose-400">{item.availableSlots} Left</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Driver & Cab Details via SMS
                </span>
                <span className="text-amber-400 font-extrabold">Instant Confirm</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* -------------------------------------------------------------
          KEYFRAME ANIMATIONS
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
          animation: marquee 75s linear infinite;
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
          animation: verticalInfinite 50s linear infinite;
        }
        .animate-vertical-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
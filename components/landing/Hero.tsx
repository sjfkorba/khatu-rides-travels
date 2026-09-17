"use client";

import { useEffect, useState } from "react";
import { HERO_SLIDES, PHONE, PHONE_DISPLAY, WHATSAPP } from "./data";
import Icon from "./Icons";

const QUICK_INTENTS = [
  {
    title: "One Way",
    short: "ONE WAY",
    subtitle: "City to City",
    icon: "route",
    href: "#routes",
  },
  {
    title: "Round Trip",
    short: "ROUND TRIP",
    subtitle: "Dedicated Cab",
    icon: "route",
    href: "#routes",
  },
  {
    title: "Airport",
    short: "AIRPORT",
    subtitle: "Pickup & Drop",
    icon: "plane",
    href: "#airport",
  },
  {
    title: "Outstation",
    short: "OUTSTATION",
    subtitle: "Long Distance",
    icon: "car",
    href: "#services",
  },
  {
    title: "Tours",
    short: "TOURS",
    subtitle: "Spiritual & Holiday",
    icon: "temple",
    href: "#tours",
  },
];

/*
|--------------------------------------------------------------------------
| FIXED SLIDE COPY
|--------------------------------------------------------------------------
| Every slide uses exactly 3 visual headline rows.
| This keeps the hero geometry stable while slides change.
|--------------------------------------------------------------------------
*/

const SLIDE_COPY = [
  {
    label: "ONE WAY CAB",
    lines: ["ONE WAY CABS.", "NO HIDDEN CHARGES", ","],
  },
  {
    label: "AIRPORT TRANSFER",
    lines: ["REACH ON TIME.", "TRAVEL", "WITHOUT STRESS."],
  },
  {
    label: "OUTSTATION CAB",
    lines: ["GO FARTHER.", "TRAVEL", "COMFORTABLY."],
  },
  {
    label: "SPIRITUAL JOURNEY",
    lines: ["YOUR JOURNEY.", "OUR", "RESPONSIBILITY."],
  },
  {
    label: "CORPORATE TRAVEL",
    lines: ["BUSINESS TRAVEL.", "DONE", "RIGHT."],
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  useEffect(() => {
    if (isPaused || HERO_SLIDES.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const slide = HERO_SLIDES[index] ?? HERO_SLIDES[0];

  const copy =
    SLIDE_COPY[index % SLIDE_COPY.length] ?? SLIDE_COPY[0];

  if (!slide) return null;

  const whatsappUrl =
    `https://wa.me/${WHATSAPP}` +
    `?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20cab.`;

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[#020B1A] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =================================================================
          PREMIUM BLUE BACKGROUND
      ================================================================== */}

      <div className="absolute inset-0 -z-30 overflow-hidden">
        <img
          src="/splash-bg.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-110 object-cover opacity-[0.11] blur-[7px]"
        />

        {/* Deep base */}
        <div className="absolute inset-0 bg-[#020B1A]/95" />

        {/* Main blue glow */}
        <div className="absolute right-[-80px] top-[-80px] h-[520px] w-[520px] rounded-full bg-blue-600/[0.16] blur-[125px]" />

        {/* Cyan secondary glow */}
        <div className="absolute right-[28%] top-[30%] h-[300px] w-[300px] rounded-full bg-cyan-400/[0.065] blur-[100px]" />

        {/* Bottom blue depth */}
        <div className="absolute -bottom-[190px] -left-[140px] h-[440px] w-[440px] rounded-full bg-blue-700/[0.11] blur-[110px]" />

        {/* Cinematic horizontal gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,24,.99)_0%,rgba(2,12,28,.95)_35%,rgba(2,13,30,.64)_68%,rgba(2,13,30,.78)_100%)]" />

        {/* Bottom fade */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,24,.04),rgba(2,9,24,0)_55%,rgba(2,9,24,.94)_100%)]" />
      </div>

      {/* Subtle premium grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.022] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:72px_72px]" />

      {/* =================================================================
          DESKTOP HERO
      ================================================================== */}

      <div className="relative mx-auto hidden max-w-[1480px] px-6 py-4 lg:block xl:px-8">
        <div className="grid h-[400px] items-center lg:grid-cols-[.98fr_1.02fr] xl:h-[415px]">
          {/* =============================================================
              DESKTOP LEFT CONTENT
          ============================================================== */}

          <div className="relative z-30 max-w-[680px]">
            {/* 24×7 status */}
            <div className="inline-flex h-[27px] items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-300">
                24×7 Booking Support
              </span>
            </div>

            {/* Slide category */}
            <div className="mt-3 flex h-[16px] items-center gap-2.5">
              <span className="h-px w-7 bg-amber-400" />

              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">
                {copy.label}
              </span>
            </div>

            {/* =========================================================
                FIXED DESKTOP HEADLINE
            ========================================================== */}

            <div className="mt-2.5 h-[170px] overflow-hidden">
              <h1 className="text-[57px] font-black leading-[0.89] tracking-[-0.06em] xl:text-[66px]">
                <span className="block h-[56px] whitespace-nowrap">
                  {copy.lines[0]}
                </span>

                <span className="block h-[56px] whitespace-nowrap bg-gradient-to-r from-[#FFE89B] via-[#FFC21A] to-[#FFAC00] bg-clip-text text-transparent">
                  {copy.lines[1]}
                </span>

                <span className="block h-[56px] whitespace-nowrap">
                  {copy.lines[2]}
                </span>
              </h1>
            </div>

            {/* Short service descriptor */}
            <div className="flex h-[17px] items-center">
              <p className="text-[10px] font-medium text-white/45">
                One-way&nbsp; • &nbsp;Airport&nbsp; • &nbsp;Outstation&nbsp; •
                &nbsp;Local&nbsp; • &nbsp;Tours
              </p>
            </div>

            {/* =========================================================
                INLINE TRUST
            ========================================================== */}

            <div className="mt-2 flex h-[18px] items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="text-[14px] text-amber-400">★</span>

                <b className="text-[9px] font-black">4.9/5</b>

                <span className="text-[8px] font-bold text-white/35">
                  Rating
                </span>
              </span>

              <span className="h-3 w-px bg-white/15" />

              <span className="flex items-center gap-1.5 text-[8px] font-bold text-white/50">
                <Icon name="shield" size={12} />
                Safe & Reliable
              </span>

              <span className="h-3 w-px bg-white/15" />

              <span className="flex items-center gap-1.5 text-[8px] font-bold text-white/50">
                <Icon name="clock" size={12} />
                24×7
              </span>
            </div>

            {/* =========================================================
                DESKTOP CTA
                PRIMARY = DEEP BLUE
            ========================================================== */}

            <div className="mt-3 flex h-[56px] items-center gap-2.5">
              {/* -------------------------------------------------------
                  CALL NOW
              -------------------------------------------------------- */}

              <a
                href={`tel:${PHONE}`}
                aria-label={`Call Khatu Rides at ${PHONE_DISPLAY}`}
                onClick={(e) => {
    e.preventDefault();
    const telUrl = `tel:${PHONE}`;
    if (typeof window !== "undefined" && typeof (window as any).gtag_report_conversion === "function") {
      (window as any).gtag_report_conversion(telUrl);
    } else {
      window.location.href = telUrl;
    }
  }}
                className="group relative flex h-[56px] min-w-[205px] items-center justify-center gap-2.5 overflow-hidden rounded-[16px] border border-blue-300/20 bg-[#063B8F] px-5 text-white shadow-[0_12px_35px_rgba(6,59,143,.38)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#084CA8] hover:shadow-[0_16px_45px_rgba(6,59,143,.5)] active:scale-[.98]"
              >
                {/* Shine */}
                <span className="absolute inset-y-0 -left-24 w-14 -skew-x-[20deg] bg-white/20 blur-md transition-all duration-700 group-hover:left-[120%]" />

                {/* Icon */}
                <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Icon name="phone" size={18} />
                </span>

                {/* Text */}
                <span className="relative text-left">
                  <b className="block text-[14px] font-black uppercase leading-none tracking-[0.08em]">
                    Call Now
                    
                  </b>

                  <small className="mt-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-white/65">
                    Book Your Cab
                  </small>
                </span>
              </a>

              {/* -------------------------------------------------------
                  WHATSAPP
              -------------------------------------------------------- */}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Book Khatu Rides through WhatsApp"
                className="flex h-[56px] min-w-[195px] items-center justify-center gap-2.5 rounded-[16px] border border-emerald-400/25 bg-emerald-500/[0.08] px-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500/[0.15] active:scale-[.98]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <Icon name="whatsapp" size={18} />
                </span>

                <span className="text-left">
                  <b className="block text-[12px] font-black uppercase leading-none tracking-[0.08em]">
                    WhatsApp
                  </b>

                  <small className="mt-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-300/65">
                    Quick Booking
                  </small>
                </span>
              </a>
            </div>

            {/* Phone micro line */}
            <div className="mt-1.5 flex h-[12px] items-center gap-1.5 text-[7px] text-white/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span>Need a cab now?</span>

              <a
                href={`tel:${PHONE}`}
                className="font-black text-white/55 transition hover:text-amber-300"
              >
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          {/* =============================================================
              DESKTOP RIGHT VISUAL
          ============================================================== */}

          <div className="relative h-[400px] xl:h-[415px]">
            {/* Main blue spotlight */}
            <div className="absolute left-[53%] top-[52%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.14] blur-[95px]" />

            {/* Outer ring */}
            <div className="absolute left-[53%] top-[52%] h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/[0.065]" />

            {/* Inner ring */}
            <div className="absolute left-[53%] top-[52%] h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/[0.045]" />

            {/* Travel / Explore / Believe */}
            <div className="absolute right-[2%] top-[1%] z-20 rotate-[-6deg] text-right">
              <div className="text-[27px] font-semibold italic leading-[0.82] text-white/50">
                Travel
              </div>

              <div className="text-[27px] font-semibold italic leading-[0.82] text-white/60">
                Explore
              </div>

              <div className="text-[30px] font-black italic leading-[0.82] text-amber-300">
                Believe
              </div>
            </div>

            {/* Vehicle */}
            <img
              src="/splash-car.png"
              alt="Khatu Rides cab"
              className="absolute bottom-0 left-1/2 z-10 w-[108%] -translate-x-1/2 object-contain drop-shadow-[0_32px_42px_rgba(0,0,0,.68)]"
            />
          </div>
        </div>

        {/* =============================================================
            DESKTOP QUICK SERVICE BAR
        ============================================================== */}

        <div className="relative z-50 mt-1 overflow-hidden rounded-[21px] border border-white/10 bg-white/[0.97] p-1.5 shadow-[0_18px_55px_rgba(0,0,0,.32)]">
          <div className="grid grid-cols-5 gap-1">
            {QUICK_INTENTS.map((item, i) => (
              <a
                key={item.title}
                href={item.href}
                className={`group flex h-[52px] items-center gap-2 rounded-2xl px-3 transition-all hover:bg-amber-50 ${
                  i === 0 ? "bg-amber-50/80" : ""
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition group-hover:bg-amber-400 group-hover:text-slate-950">
                  <Icon name={item.icon as any} size={15} />
                </span>

                <span>
                  <b className="block text-[10px] font-black text-slate-950">
                    {item.title}
                  </b>

                  <small className="text-[8px] font-bold text-slate-500">
                    {item.subtitle}
                  </small>
                </span>

                <span className="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-amber-500">
                  <Icon name="arrow" size={12} />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Desktop slide dots */}
        {HERO_SLIDES.length > 1 && (
          <div className="mt-2 flex h-2 items-center justify-center gap-1.5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Hero slide ${i + 1}`}
                aria-current={i === index}
                className={
                  i === index
                    ? "h-1.5 w-7 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,.45)]"
                    : "h-1.5 w-1.5 rounded-full bg-white/20 hover:bg-white/40"
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* =================================================================
          MOBILE HERO
          FIXED 390px COMPOSITION
      ================================================================== */}

      <div className="relative flex h-[390px] min-h-[390px] max-h-[390px] flex-col px-4 pt-3 lg:hidden">
        {/* Mobile blue glows */}
        <div className="pointer-events-none absolute right-[-100px] top-[20%] h-[270px] w-[270px] rounded-full bg-blue-600/[0.17] blur-[75px]" />

        <div className="pointer-events-none absolute left-[-110px] bottom-[-70px] h-[220px] w-[220px] rounded-full bg-cyan-500/[0.06] blur-[70px]" />

        {/* =============================================================
            MOBILE TOP ROW
        ============================================================== */}

        <div className="relative z-30 flex h-[23px] shrink-0 items-center justify-between">
          <div className="flex h-[23px] items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,.8)]" />

            <span className="text-[7px] font-black uppercase tracking-[0.14em] text-emerald-300">
              24×7 Booking
            </span>
          </div>

          <span className="max-w-[150px] truncate text-[7px] font-black uppercase tracking-[0.14em] text-amber-300/80">
            {copy.label}
          </span>
        </div>

        {/* =============================================================
            MOBILE HEADLINE
            FIXED 3 ROWS
        ============================================================== */}

        <div className="relative z-30 mt-2.5 h-[94px] shrink-0 overflow-visible">
          <h1 className="font-black leading-[0.9] tracking-[-0.055em]">
            {/* Row 1 */}
            <span className="block h-[31px] whitespace-nowrap text-[clamp(29px,8.8vw,36px)]">
              {copy.lines[0]}
            </span>

            {/* Row 2 */}
            <span className="block h-[31px] whitespace-nowrap text-[clamp(29px,8.8vw,36px)]">
              <span className="bg-gradient-to-r from-[#FFE89B] via-[#FFC21A] to-[#FFAC00] bg-clip-text text-transparent">
                {copy.lines[1]}
              </span>
            </span>

            {/* Row 3 */}
            <span
              className={`block h-[31px] whitespace-nowrap ${
                copy.lines[2].length >= 14
                  ? "text-[clamp(25px,7.7vw,32px)]"
                  : "text-[clamp(29px,8.8vw,36px)]"
              }`}
            >
              {copy.lines[2]}
            </span>
          </h1>
        </div>

        {/* =============================================================
            MOBILE CAR ZONE
            20% SMALLER THAN PREVIOUS VERSION
        ============================================================== */}

        <div className="relative z-10 min-h-0 flex-1 overflow-visible">
          {/* Spotlight */}
          <div className="absolute left-1/2 top-[51%] h-[205px] w-[205px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.13] blur-[62px]" />

          {/* Ring */}
          <div className="absolute left-1/2 top-[51%] h-[195px] w-[195px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/[0.05]" />

          {/* =========================================================
              VEHICLE
              Previous: 104%
              Current: 83%
              Approximately 20% smaller
          ========================================================== */}

          <img
            src="/splash-car.png"
            alt="Khatu Rides cab"
            className="absolute left-1/2 top-[52%] z-10 w-[83%] max-w-[400px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_22px_30px_rgba(0,0,0,.68)]"
          />
        </div>

        {/* =============================================================
            MOBILE TRUST
        ============================================================== */}

        <div className="relative z-30 mb-1.5 flex h-[17px] shrink-0 items-center justify-center gap-2.5">
          <span className="flex items-center gap-1 text-[8px] font-black">
            <span className="text-[12px] text-amber-400">★</span>
            4.9/5
          </span>

          <span className="h-2.5 w-px bg-white/15" />

          <span className="text-[7px] font-bold text-white/45">
            Safe & Reliable
          </span>

          <span className="h-2.5 w-px bg-white/15" />

          <span className="text-[7px] font-bold text-white/45">
            24×7 Support
          </span>
        </div>

        {/* =============================================================
            MOBILE PRIMARY CALL CTA
            DEEP BLUE + WHITE + BIG BOLD TEXT
        ============================================================== */}

        <div className="relative z-40 shrink-0 pb-1">
          <a
            href={`tel:${PHONE}`}
            aria-label={`Call Khatu Rides at ${PHONE_DISPLAY}`}
            className="group relative flex h-[50px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-[15px] border border-blue-300/20 bg-[#063B8F] text-white shadow-[0_10px_30px_rgba(6,59,143,.42)] active:scale-[.98]"
          >
            {/* Shine */}
            <span className="absolute inset-y-0 -left-20 w-12 -skew-x-[20deg] bg-white/20 blur-md" />

            {/* Icon */}
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <Icon name="phone" size={17} />
            </span>

            {/* Bigger CTA text */}
            <span className="relative text-[13px] font-black uppercase leading-none tracking-[0.07em]">
              Call Now — Book Your Cab
            </span>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 flex h-[19px] items-center justify-center gap-1.5 text-[7px] font-black uppercase tracking-[0.12em] text-emerald-300/75"
          >
            <Icon name="whatsapp" size={11} />
            WhatsApp Booking
          </a>
        </div>

        {/* =============================================================
            MOBILE SERVICE RAIL
        ============================================================== */}

        <div className="relative z-50 -mx-4 h-[30px] shrink-0 overflow-x-auto border-t border-white/[0.06] bg-[#061426]/80 px-3 py-1 backdrop-blur-xl scrollbar-none">
          <div className="flex h-full w-max items-center gap-1.5">
            {QUICK_INTENTS.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="flex h-[22px] items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5"
              >
                <Icon name={item.icon as any} size={9} />

                <span className="text-[6.5px] font-black uppercase tracking-[0.08em] text-white/55">
                  {item.short}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile dots */}
        {HERO_SLIDES.length > 1 && (
          <div className="absolute bottom-[-8px] left-1/2 z-50 flex -translate-x-1/2 gap-1">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Hero slide ${i + 1}`}
                aria-current={i === index}
                className={
                  i === index
                    ? "h-1 w-6 rounded-full bg-amber-400"
                    : "h-1 w-1 rounded-full bg-white/25"
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* =================================================================
          MOBILE FLOATING BOOKING BUTTON
      ================================================================== */}

      <div className="fixed bottom-3 right-3 z-[100] lg:hidden">
        {/* Floating actions */}
        <div
          className={`absolute bottom-[61px] right-0 flex flex-col items-end gap-2 transition-all duration-300 ${
            mobileActionsOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          {/* Floating Call */}
          <a
            href={`tel:${PHONE}`}
            className="flex items-center gap-2 rounded-full border border-blue-300/20 bg-[#063B8F] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-white shadow-[0_10px_30px_rgba(6,59,143,.45)]"
          >
            <Icon name="phone" size={14} />
            Call Now
          </a>

          {/* Floating WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#16A34A] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-white shadow-[0_10px_30px_rgba(0,0,0,.35)]"
          >
            <Icon name="whatsapp" size={14} />
            WhatsApp
          </a>
        </div>

        {/* Main floating button */}
        <button
          type="button"
          onClick={() => setMobileActionsOpen((value) => !value)}
          aria-label={
            mobileActionsOpen
              ? "Close booking actions"
              : "Open booking actions"
          }
          className={`flex h-[50px] w-[50px] items-center justify-center rounded-full shadow-[0_12px_35px_rgba(0,0,0,.45)] transition-all duration-300 ${
            mobileActionsOpen
              ? "rotate-45 bg-white text-[#06101F]"
              : "bg-[#063B8F] text-white"
          }`}
        >
          {mobileActionsOpen ? (
            <span className="text-[25px] font-light leading-none">×</span>
          ) : (
            <Icon name="phone" size={18} />
          )}
        </button>
      </div>
    </section>
  );
}
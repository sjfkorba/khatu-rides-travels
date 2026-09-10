"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { ROUTES } from "./data";

const WHATSAPP_NUMBER = "919244137353";

function getWhatsAppUrl(from: string, to: string) {
  const message = `Hello Khatu Rides Travels,

I want to book a cab for:

📍 Pickup: ${from}
📍 Destination: ${to}

Please share the available cab options, fare and booking details.

Thank you.
Khatu Rides Travels Co.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}

export default function PopularRoutes() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollRoutes = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const amount = Math.min(
      sliderRef.current.clientWidth * 0.82,
      760
    );

    sliderRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="routes"
      className="relative overflow-hidden bg-[#F5F7FA] py-12 sm:py-16 lg:py-20"
    >
      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#F5C400]/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#063B8F]/10 blur-3xl" />

        {/* subtle road lines */}
        <div className="absolute left-0 top-[48%] h-px w-full bg-slate-200/70" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* =========================================================
            SECTION HEADER
        ========================================================= */}
        <div className="flex items-end justify-between gap-5">
          <div className="max-w-[760px]">
            {/* Eyebrow */}
            <div className="mb-2 flex items-center gap-2">
              <span className="h-[3px] w-7 rounded-full bg-[#F5C400]" />

              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
                Most Booked Routes
              </span>
            </div>

            <h2 className="text-[30px] font-black leading-[1.02] tracking-[-0.045em] text-[#071A3A] sm:text-[40px] lg:text-[48px]">
              Popular Cab Routes
            </h2>

            <p className="mt-2 max-w-[620px] text-[12px] font-medium leading-5 text-slate-500 sm:text-sm">
              Book reliable one-way and outstation cabs on the routes
              our customers travel most.
            </p>
          </div>

          {/* Desktop Controls */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollRoutes("left")}
              aria-label="Previous routes"
              className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#071A3A] bg-white text-[#071A3A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#071A3A] hover:text-white active:translate-y-0"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.7} />
            </button>

            <button
              type="button"
              onClick={() => scrollRoutes("right")}
              aria-label="Next routes"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C400] text-[#071A3A] shadow-[0_8px_20px_rgba(245,196,0,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFD21A] active:translate-y-0"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={2.7} />
            </button>
          </div>
        </div>

        {/* =========================================================
            ROUTE SLIDER
        ========================================================= */}
        <div className="relative mt-7">
          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
          >
            {ROUTES.map((route, index) => (
              <article
                key={`${route.from}-${route.to}`}
                className="group relative w-[285px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(7,26,58,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_42px_rgba(7,26,58,0.16)] sm:w-[315px] lg:w-[330px]"
              >
                {/* =================================================
                    IMAGE
                ================================================= */}
                <div className="relative h-[250px] overflow-hidden bg-[#071A3A] sm:h-[270px] lg:h-[280px]">
                  <img
  src={route.image}
  alt={`${route.from} to ${route.to} cab service`}
  loading={index < 3 ? "eager" : "lazy"}
  className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.04]"
/>

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A3A]/90 via-[#071A3A]/15 to-transparent" />

                  {/* Route Number */}
                  <div className="absolute left-4 top-4 flex h-8 min-w-8 items-center justify-center rounded-lg border border-white/20 bg-[#071A3A]/85 px-2 text-[9px] font-black tracking-wider text-white backdrop-blur-md">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Popular Badge */}
                  {index < 3 && (
                    <div className="absolute right-4 top-4 rounded-lg bg-[#F5C400] px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wider text-[#071A3A] shadow-lg">
                      Popular
                    </div>
                  )}

                  {/* Location pin */}
                  <div className="absolute bottom-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F5C400] text-[#071A3A] shadow-[0_5px_16px_rgba(245,196,0,0.40)]">
                    <MapPin
                      className="h-4 w-4"
                      fill="currentColor"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Route on image */}
                  <div className="absolute bottom-4 left-[58px] right-4">
                    <div className="flex items-center gap-2 text-[16px] font-black tracking-[-0.025em] text-white">
                      <span>{route.from}</span>

                      <span className="text-[#F5C400]">→</span>

                      <span>{route.to}</span>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    CARD BODY
                ================================================= */}
                <div className="p-4">
                  {/* Journey line */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-[2px] flex-1 bg-slate-100" />
                    <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                      One Way Cab
                    </span>
                    <span className="h-[2px] flex-1 bg-slate-100" />
                  </div>

                  {/* Route title */}
                  <h3 className="text-[15px] font-black tracking-[-0.02em] text-[#071A3A]">
                    {route.from}
                    <span className="mx-1.5 text-[#F5C400]">→</span>
                    {route.to}
                  </h3>

                  {/* Meta */}
                  <p className="mt-1.5 min-h-[30px] text-[10px] font-semibold leading-4 text-slate-500">
                    {route.meta}
                  </p>

                  {/* Price + CTA */}
                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3.5">
                    <div>
                      <span className="block text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                        Starting Fare
                      </span>

                      <div className="mt-0.5 flex items-baseline gap-1">
                        <span className="text-[21px] font-black tracking-[-0.04em] text-[#071A3A]">
                          {route.price}
                        </span>
                      </div>
                    </div>

                    <a
                      href={getWhatsAppUrl(route.from, route.to)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn flex min-h-10 items-center gap-1.5 rounded-xl bg-[#F5C400] px-3.5 text-[9px] font-black uppercase tracking-wide text-[#071A3A] shadow-[0_7px_18px_rgba(245,196,0,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFD21A] hover:shadow-[0_10px_22px_rgba(245,196,0,0.32)]"
                    >
                      <MessageCircle
                        className="h-3.5 w-3.5"
                        strokeWidth={2.7}
                      />

                      Book Now

                      <ArrowRight
                        className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-0.5"
                        strokeWidth={2.8}
                      />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* =======================================================
              MOBILE SWIPE INDICATOR
          ======================================================= */}
          <div className="mt-1 flex items-center justify-center gap-2 sm:hidden">
            <span className="h-1.5 w-8 rounded-full bg-[#F5C400]" />
            <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
              Swipe to explore routes
            </span>
            <ArrowRight
              className="h-3 w-3 text-[#063B8F]"
              strokeWidth={2.8}
            />
          </div>
        </div>

        {/* =========================================================
            BOTTOM CTA
        ========================================================= */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-[20px] bg-[#071A3A] px-5 py-4 shadow-[0_14px_35px_rgba(7,26,58,0.16)] sm:flex-row sm:px-6">
          <div>
            <p className="text-[13px] font-black text-white sm:text-[15px]">
              Don&apos;t see your route?
            </p>

            <p className="mt-0.5 text-[10px] font-medium text-white/55">
              Tell us your pickup and destination. We&apos;ll help you plan
              the ride.
            </p>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-[#18C964] px-5 text-[9px] font-black uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(24,201,100,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#12B457]"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.7} />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
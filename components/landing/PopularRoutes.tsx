"use client";

import { useState } from "react";
import Link from "next/link"; // Next.js Link import kiya
import {
  ArrowRight,
  ArrowUpRight,
  CarFront,
  MapPin,
  MessageCircle,
  PhoneCall,
  Sparkles,
} from "lucide-react";

import { ROUTES } from "./data";

const PHONE_NUMBER = "9244137353";
const WHATSAPP_NUMBER = "919244137353";

const PHONE_URL = `tel:+91${PHONE_NUMBER}`;

function getWhatsAppUrl(from: string, to: string) {
  const message =
    `Namaste Khatu Rides Travels Co.!\n\n` +
    `Mujhe ${from} se ${to} ke liye cab book karni hai.\n` +
    `Kripya cab availability, vehicle options aur booking details batayein.\n\n` +
    `Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}

// Ye function route string (e.g. "Raipur") ko URL friendly (e.g. "raipur") banata hai
function getRouteUrl(from: string, to: string) {
  const fromSlug = from.toLowerCase().replace(/\s+/g, '-');
  const toSlug = to.toLowerCase().replace(/\s+/g, '-');
  // Agar aapke route pages outstation-cabs ke andar hain
  return `/outstation-cabs/${fromSlug}-to-${toSlug}`;
}

export default function PopularRoutes() {
  const [activeRoute, setActiveRoute] = useState<string | null>(null);

  return (
    <section
      id="popular-routes"
      aria-labelledby="popular-routes-heading"
      className="kr-routes-section relative isolate overflow-hidden bg-[#f7f9fd] py-14 font-sans sm:py-16 lg:py-20"
    >
      {/* LIGHTWEIGHT BACKGROUND DECORATION */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 -z-10 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-[45%] -z-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* SECTION HEADER */}
        <div className="kr-routes-reveal mb-9 flex flex-col gap-5 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3.5 py-2 shadow-sm">
              <Sparkles
                size={14}
                className="text-orange-500"
              />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-slate-700 sm:text-[11px]">
                Popular Travel Routes
              </span>

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            </div>

            <h2
              id="popular-routes-heading"
              className="text-3xl font-black leading-tight tracking-tight text-[#101b35] sm:text-4xl lg:text-[46px]"
            >
              Your Route.
              <br className="sm:hidden" />{" "}
              <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                Your Ride.
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Looking for a one-way taxi, outstation cab or a comfortable
              intercity ride? Explore popular routes with Khatu Rides
              Travels Co. and click on any route to view details or book now.
            </p>
          </div>

          {/* HEADER CALL CTA */}
          <a
            href={PHONE_URL}
            className="kr-call-glow group inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 self-start rounded-2xl bg-[#101d3a] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#192c51] active:scale-[0.97] sm:self-auto"
          >
            <PhoneCall
              size={17}
              className="text-orange-300 transition-transform duration-300 group-hover:rotate-[-12deg]"
            />

            <span>Talk to Our Team</span>

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* ROUTES GRID */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">

          {ROUTES.map((route, index) => {
            const routeKey = `${route.from}-${route.to}`;
            const isActive = activeRoute === routeKey;
            
            // Dynamic URL generation for this route
            const routePageUrl = getRouteUrl(route.from, route.to);

            const description =
              route.meta ||
              `Book a one-way taxi from ${route.from} to ${route.to} with Khatu Rides Travels Co. Contact our team for available AC cabs, vehicle options and outstation travel assistance.`;

            return (
              <article
                key={routeKey}
                onMouseEnter={() => setActiveRoute(routeKey)}
                onMouseLeave={() => setActiveRoute(null)}
                className={`kr-route-card group relative flex min-w-0 flex-col overflow-hidden rounded-[24px] border bg-white transition-all duration-300 ${
                  isActive
                    ? "border-orange-200 shadow-[0_18px_45px_rgba(15,35,75,0.12)]"
                    : "border-slate-200/80 shadow-[0_5px_22px_rgba(15,35,75,0.045)]"
                }`}
                style={{
                  animationDelay: `${Math.min(index * 70, 420)}ms`,
                }}
              >
                {/* 
                   THUMBNAIL IMAGE WITH PAGE LINK 
                   Pehle ye tel: link tha, ab hum isko Link component bana rahe hain 
                   jo click karne par specific route page par jayega 
                */}
                <Link
                  href={routePageUrl}
                  aria-label={`View details for taxi from ${route.from} to ${route.to}`}
                  className="relative block overflow-hidden bg-slate-100"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={route.image}
                      alt={`${route.from} to ${route.to} taxi service, outstation cab by Khatu Rides Travels Co.`}
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
                    />

                    {/* SUBTLE IMAGE GRADIENT */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09152d]/35 via-transparent to-transparent opacity-70" />

                    {/* SINGLE MINIMAL BADGE */}
                    <div className="absolute left-3 top-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-[10px] font-bold text-slate-800 shadow-sm backdrop-blur-md">
                        <CarFront
                          size={13}
                          className="text-orange-500"
                        />
                        One-way & Outstation
                      </span>
                    </div>

                    {/* SMALL CORNER ICON (ab ispe click karne se page khulega) */}
                    <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-800 shadow-md backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-orange-500 group-hover:text-white">
                      <ArrowUpRight size={19} />
                    </div>
                  </div>
                </Link>

                {/* MINIMAL CARD CONTENT */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">

                  {/* ROUTE NAME - Ab is title pe click karne se bhi route page open hoga */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-white">
                      <MapPin size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link href={routePageUrl}>
                        <h3 className="text-[19px] font-extrabold leading-snug tracking-tight text-[#14213d] hover:text-orange-500 transition-colors sm:text-xl">
                          {route.from}
                          <span className="mx-1.5 text-orange-500">
                            →
                          </span>
                          {route.to}
                        </h3>
                      </Link>

                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        Intercity Taxi Service
                      </p>
                    </div>
                  </div>

                  {/* SHORT DESCRIPTION */}
                  <p className="mt-4 line-clamp-2 min-h-[40px] text-[13px] leading-5 text-slate-600">
                    {description}
                  </p>

                  {/* CONVERSION MESSAGE */}
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f5f7fb] px-3 py-2.5">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>

                    <p className="text-[11px] font-semibold text-slate-700">
                      Talk to our team for best fare
                    </p>
                  </div>

                  {/* CALL + WHATSAPP ACTIONS (These remain unchanged for quick conversion) */}
                  <div className="mt-4 flex items-center gap-2.5">
                    <a
                      href={PHONE_URL}
                      className="kr-route-call group/call flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-3 text-[12px] font-extrabold text-white shadow-md shadow-orange-500/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25 active:scale-[0.97] sm:text-[13px]"
                    >
                      <PhoneCall
                        size={15}
                        className="transition-transform duration-300 group-hover/call:rotate-[-12deg]"
                      />

                      Call Now
                    </a>

                    <a
                      href={getWhatsAppUrl(route.from, route.to)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ask on WhatsApp about ${route.from} to ${route.to} taxi`}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-[12px] font-extrabold text-emerald-800 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-100 active:scale-[0.97] sm:text-[13px]"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* SUBTLE CARD ACCENT */}
                <div
                  aria-hidden="true"
                  className={`h-[3px] w-full origin-left bg-gradient-to-r from-orange-400 via-rose-500 to-violet-500 transition-transform duration-500 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </article>
            );
          })}
        </div>

        {/* SEO CONTENT: NATURAL, USEFUL AND ROUTE-RELEVANT */}
        <div className="kr-routes-reveal mt-12 border-t border-slate-200 pt-8 sm:mt-14 sm:pt-10">
          <h3 className="text-xl font-extrabold tracking-tight text-[#14213d] sm:text-2xl">
            One-Way Taxi & Outstation Cab Booking in Chhattisgarh
          </h3>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
            Khatu Rides Travels Co. helps travellers find cab services for
            popular intercity routes across Chhattisgarh and nearby
            destinations. Whether you need a Raipur taxi service, a
            Korba to Bilaspur cab, a Raipur airport taxi, or an outstation
            car for travel between cities, contact our team to discuss
            your pickup location, destination, preferred vehicle and
            journey requirements. Call or WhatsApp us for current
            availability and booking assistance.
          </p>

          {/* FINAL CALL TO ACTION */}
          <div className="relative mt-7 overflow-hidden rounded-[24px] bg-[#101d3a] p-5 shadow-[0_12px_35px_rgba(16,29,58,0.12)] sm:p-7 lg:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-orange-400/15 blur-3xl"
            />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300">
                  <Sparkles size={14} />
                  Your journey starts here
                </div>

                <h3 className="text-xl font-black leading-snug text-white sm:text-2xl">
                  Apna route batayein, cab booking par baat karein.
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Share your pickup and drop location. Our team can help
                  you enquire about vehicle options and availability.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:min-w-[190px]">
                <a
                  href={PHONE_URL}
                  className="kr-call-glow inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 px-5 py-3.5 text-sm font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <PhoneCall size={17} />
                  अभी कॉल करें
                  <ArrowRight size={16} />
                </a>

                <a
                  href={`${`https://wa.me/${WHATSAPP_NUMBER}`} ?text=${encodeURIComponent(
                    "Namaste Khatu Rides! Mujhe cab booking karni hai. Kripya meri trip ke liye vehicle options aur availability batayein."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/[0.12]"
                >
                  <MessageCircle size={17} />
                  WhatsApp पर पूछें
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* LIGHTWEIGHT CSS ANIMATIONS */}
      <style jsx>{`
        .kr-routes-section {
          isolation: isolate;
        }

        .kr-routes-reveal {
          animation: krReveal 650ms ease-out both;
        }

        .kr-route-card {
          animation: krCardReveal 550ms ease-out both;
          transform: translateZ(0);
        }

        .kr-call-glow {
          animation: krCallGlow 3.5s ease-in-out infinite;
        }

        @keyframes krReveal {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes krCardReveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes krCallGlow {
          0%, 100% {
            box-shadow: 0 0 0 rgba(249, 115, 22, 0);
          }

          50% {
            box-shadow: 0 0 20px rgba(249, 115, 22, 0.17);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .kr-routes-reveal,
          .kr-route-card,
          .kr-call-glow {
            animation: none !important;
          }

          .kr-route-card,
          .kr-route-card *,
          .kr-route-card::before,
          .kr-route-card::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
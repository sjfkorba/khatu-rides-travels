"use client";

import Image from "next/image";
import { Phone, MessageCircle, ShieldCheck, Clock3 } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-[100] w-full">
      <div className="border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-5 lg:px-8">
          <div className="flex min-h-[68px] items-center justify-between gap-4">

            {/* =====================================================
                BRAND
            ====================================================== */}
            <a
              href="/"
              aria-label="Khatu Rides Travels - Home"
              className="group flex min-w-0 items-center gap-3"
            >
              {/* Logo */}
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_8px_25px_rgba(0,0,0,0.25)] ring-1 ring-white/20 sm:h-12 sm:w-12">
                <Image
                  src="/logo.png"
                  alt="Khatu Rides Travels"
                  width={48}
                  height={48}
                  priority
                  className="h-full w-full object-contain p-1"
                />
              </div>

              {/* Brand text */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[15px] font-black leading-none tracking-[0.02em] text-white sm:text-[17px]">
                    KHATU RIDES
                  </span>

                  <span className="hidden rounded-full border border-orange-400/20 bg-orange-500/10 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.14em] text-orange-400 sm:inline-flex">
                    Travels
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:text-[10px]">
                    Premium Cab & Travel
                  </span>

                  <span className="hidden h-1 w-1 rounded-full bg-orange-500 sm:block" />

                  <span className="hidden text-[9px] font-semibold text-slate-500 sm:block">
                    Chhattisgarh
                  </span>
                </div>
              </div>
            </a>

            {/* =====================================================
                TRUST / SUPPORT — DESKTOP
            ====================================================== */}
            <div className="hidden items-center gap-7 lg:flex">

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <ShieldCheck
                    size={17}
                    className="text-orange-400"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Booking
                  </p>
                  <p className="text-[11px] font-bold text-slate-200">
                    Transparent Fare
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <Clock3
                    size={16}
                    className="text-orange-400"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Support
                  </p>
                  <p className="text-[11px] font-bold text-slate-200">
                    24×7 Assistance
                  </p>
                </div>
              </div>

            </div>

            {/* =====================================================
                CONTACT ACTIONS
            ====================================================== */}
            <div className="flex shrink-0 items-center gap-2">

              {/* Call */}
              <a
                href="tel:9244137353"
                aria-label="Call Khatu Rides Travels"
                className="
                  group relative flex h-11 w-11 items-center justify-center
                  rounded-xl border border-orange-400/20
                  bg-orange-500/[0.08]
                  text-orange-400
                  transition-all duration-300
                  hover:border-orange-400/40
                  hover:bg-orange-500/15
                  hover:text-orange-300
                  sm:h-auto sm:w-auto sm:px-4 sm:py-2.5
                "
              >
                <Phone
                  size={17}
                  strokeWidth={2.3}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                <span className="ml-2 hidden text-[11px] font-extrabold uppercase tracking-[0.08em] sm:block">
                  Call Now
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919244137353"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Khatu Rides Travels on WhatsApp"
                className="
                  group relative flex h-11 w-11 items-center justify-center
                  rounded-xl bg-[#25D366]
                  text-white
                  shadow-[0_8px_25px_rgba(37,211,102,0.20)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#20bd5c]
                  hover:shadow-[0_12px_30px_rgba(37,211,102,0.28)]
                  sm:h-auto sm:w-auto sm:px-4 sm:py-2.5
                "
              >
                <MessageCircle
                  size={17}
                  fill="currentColor"
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                <span className="ml-2 hidden text-[11px] font-extrabold uppercase tracking-[0.08em] sm:block">
                  WhatsApp
                </span>
              </a>

            </div>

          </div>
        </div>
      </div>

      {/* =========================================================
          MOBILE SUPPORT STRIP
      ========================================================== */}
      <div className="border-b border-orange-500/10 bg-slate-900/95 backdrop-blur-md sm:hidden">
        <div className="mx-auto flex h-7 max-w-[1440px] items-center justify-center gap-2 px-3">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

          <span className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
            24×7 Booking Support
          </span>

          <span className="text-[8px] text-slate-600">•</span>

          <span className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-orange-400">
            Instant Assistance
          </span>
        </div>
      </div>
    </header>
  );
}
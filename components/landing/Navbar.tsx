"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ChevronRight, Phone } from "lucide-react";
import { PHONE, PHONE_DISPLAY, WHATSAPP } from "./data";

const links = [
  { label: "Home", href: "/" },
  { label: "Cab Booking", href: "/#cab-booking" },
  { label: "Popular Routes", href: "/#popular-routes" },
  { label: "Tour Packages", href: "/#tour-packages" },
  { label: "Fleet", href: "/#fleet" },
  { label: "Services", href: "/#services" },
  { label: "Fare Calculator", href: "/fare-calculator" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-[100] border-b border-slate-200/80 bg-white/95 shadow-[0_4px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-[76px] lg:px-8">
        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex min-w-0 items-center gap-2.5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5C400] shadow-[0_6px_16px_rgba(245,196,0,0.28)]">
            <span className="text-[19px] font-black tracking-[-0.06em] text-[#071A3A]">
              KR
            </span>
          </div>

          <div className="min-w-0 leading-none">
            <div className="truncate text-[15px] font-black tracking-[-0.03em] text-[#071A3A] sm:text-[17px]">
              KHATU RIDES
            </div>
            <div className="mt-1 truncate text-[8px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:text-[9px]">
              Travels Co.
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const isCalculator = link.href === "/fare-calculator";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "group relative flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-extrabold tracking-wide transition",
                  isCalculator
                    ? "bg-[#071A3A] text-white shadow-[0_6px_18px_rgba(7,26,58,0.16)] hover:bg-[#0B2A5B]"
                    : "text-slate-700 hover:bg-slate-100 hover:text-[#071A3A]",
                ].join(" ")}
              >
                {isCalculator && <Calculator className="h-3.5 w-3.5" />}
                {link.label}
                {isCalculator && (
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP CTA */}
        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center rounded-xl border border-[#18C964]/25 bg-[#18C964]/10 px-4 text-[11px] font-black uppercase tracking-wide text-[#079447] transition hover:bg-[#18C964]/15"
          >
            WhatsApp
          </a>

          <a
            href={`tel:${PHONE}`}
            className="flex h-11 items-center gap-2 rounded-xl bg-[#063B8F] px-5 text-[11px] font-black uppercase tracking-wide text-white shadow-[0_9px_22px_rgba(6,59,143,0.22)] transition hover:-translate-y-0.5 hover:bg-[#052F73]"
          >
            <Phone className="h-4 w-4" strokeWidth={2.8} />
            Call Now
          </a>
        </div>

        {/* MOBILE CALL + MENU */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`tel:${PHONE}`}
            aria-label={`Call Khatu Rides Travels at ${PHONE_DISPLAY}`}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-[#063B8F] px-3.5 text-[10px] font-black uppercase tracking-wide text-white shadow-[0_7px_18px_rgba(6,59,143,0.22)]"
          >
            <Phone className="h-4 w-4" strokeWidth={2.8} />
            Call
          </a>

          <button
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#071A3A] shadow-sm transition active:scale-95"
          >
            {open ? (
              /* CSS X — avoids lucide-react X module */
              <span className="relative block h-5 w-5" aria-hidden="true">
                <span className="absolute left-1/2 top-1/2 h-[2.5px] w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-[#071A3A]" />
                <span className="absolute left-1/2 top-1/2 h-[2.5px] w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-[#071A3A]" />
              </span>
            ) : (
              /* CSS hamburger — avoids lucide-react Menu module */
              <span
                className="flex w-5 flex-col gap-[4px]"
                aria-hidden="true"
              >
                <span className="h-[2.5px] w-5 rounded-full bg-[#071A3A]" />
                <span className="h-[2.5px] w-5 rounded-full bg-[#071A3A]" />
                <span className="h-[2.5px] w-5 rounded-full bg-[#071A3A]" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-200 bg-white shadow-[0_16px_30px_rgba(15,23,42,0.10)] lg:hidden">
          <nav className="mx-auto max-w-[1440px] px-4 py-3 sm:px-6">
            <div className="grid gap-1.5">
              {links.map((link) => {
                const isCalculator = link.href === "/fare-calculator";

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={[
                      "flex min-h-12 items-center justify-between rounded-xl px-4 text-[12px] font-black uppercase tracking-wide transition",
                      isCalculator
                        ? "bg-[#071A3A] text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#071A3A]",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2">
                      {isCalculator && (
                        <Calculator className="h-4 w-4" />
                      )}
                      {link.label}
                    </span>

                    <ChevronRight
                      className={[
                        "h-4 w-4",
                        isCalculator ? "text-white" : "text-slate-400",
                      ].join(" ")}
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center rounded-xl bg-[#18C964] px-3 text-[10px] font-black uppercase tracking-wide text-white shadow-[0_8px_18px_rgba(24,201,100,0.18)]"
              >
                WhatsApp
              </a>

              <a
                href={`tel:${PHONE}`}
                onClick={closeMenu}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-3 text-[10px] font-black uppercase tracking-wide text-white shadow-[0_8px_18px_rgba(6,59,143,0.18)]"
              >
                <Phone className="h-4 w-4" strokeWidth={2.8} />
                Call Now
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
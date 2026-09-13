"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calculator, ChevronRight, Phone } from "lucide-react";
import { PHONE, PHONE_DISPLAY } from "./data";

const WHATSAPP_URL = "https://wa.me/919244137353";

const links = [
  { label: "Home", href: "/" },
  { label: "Cab Booking", href: "/#home" },
  { label: "Popular Routes", href: "/#routes" },
  { label: "Tour Packages", href: "/#tours" },
  { label: "Fleet", href: "/#fleet" },
  { label: "Services", href: "/#services" },
  { label: "Fare Calculator", href: "/fare-calculator" },
];

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M16 3.2C9 3.2 3.3 8.8 3.3 15.8c0 2.2.6 4.4 1.7 6.3L3.2 28.8l6.9-1.8c1.8 1 3.8 1.5 5.9 1.5 7 0 12.7-5.7 12.7-12.7S23 3.2 16 3.2Zm0 23.1c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4a10.6 10.6 0 0 1-1.6-5.5C5.4 10.9 10.2 6.1 16 6.1s10.6 4.8 10.6 10.7S21.8 26.3 16 26.3Zm5.8-7.9c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-1.9-.9-3.1-1.7-4.3-3.7-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.3 3.6 5.7 5 2.1.9 2.9 1 4 .8.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4 0-.2-.2-.3-.5-.5Z"
      />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] border-b border-slate-200 bg-white shadow-[0_5px_24px_rgba(7,26,58,0.10)]">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-[76px] lg:px-8">
        {/* =========================================================
            BRAND LOGO
        ========================================================= */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Khatu Rides Travels Co. Home"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/logo.png"
            alt="Khatu Rides Travels Co."
            width={190}
            height={58}
            priority
            className="h-auto w-[145px] object-contain sm:w-[165px] lg:w-[180px]"
          />
        </Link>

        {/* =========================================================
            DESKTOP NAVIGATION
        ========================================================= */}
        <nav className="hidden items-center gap-0.5 xl:flex">
          {links.map((link) => {
            const isCalculator = link.href === "/fare-calculator";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "group relative flex items-center gap-1.5 rounded-[11px] px-3 py-2.5 text-[11px] font-black tracking-wide transition-all duration-200",
                  isCalculator
                    ? "ml-1 bg-[#F5C400] text-[#071A3A] shadow-[0_7px_18px_rgba(245,196,0,0.28)] hover:-translate-y-0.5 hover:bg-[#FFD21A] hover:shadow-[0_10px_24px_rgba(245,196,0,0.36)]"
                    : "text-[#26364D] hover:bg-[#071A3A] hover:text-white",
                ].join(" ")}
              >
                {isCalculator && (
                  <Calculator
                    className="h-3.5 w-3.5"
                    strokeWidth={2.7}
                  />
                )}

                {link.label}

                {isCalculator && (
                  <ChevronRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    strokeWidth={2.8}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* =========================================================
            DESKTOP CTA
        ========================================================= */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Khatu Rides Travels on WhatsApp"
            className="group flex h-11 items-center gap-2 rounded-xl bg-[#18C964] px-4 text-[11px] font-black uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(24,201,100,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#12B457] hover:shadow-[0_12px_28px_rgba(24,201,100,0.32)]"
          >
            <WhatsAppIcon className="h-[19px] w-[19px] transition-transform duration-200 group-hover:scale-110" />
            WhatsApp
          </a>

          {/* Call */}
          <a
            href={`tel:${PHONE}`}
            aria-label={`Call Khatu Rides Travels at ${PHONE_DISPLAY}`}
            onClick={(e) => {
    e.preventDefault();
    const telUrl = `tel:${PHONE}`;
    if (typeof window !== "undefined" && typeof (window as any).gtag_report_conversion === "function") {
      (window as any).gtag_report_conversion(telUrl);
    } else {
      window.location.href = telUrl;
    }
  }}
            className="group flex h-11 items-center gap-2 rounded-xl bg-[#063B8F] px-5 text-[11px] font-black uppercase tracking-wide text-white shadow-[0_9px_22px_rgba(6,59,143,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#052F73] hover:shadow-[0_12px_28px_rgba(6,59,143,0.34)]"
          >
            <Phone
              className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
              strokeWidth={2.8}
            />
            Call Now
          </a>
        </div>

        {/* =========================================================
            MOBILE ACTIONS
        ========================================================= */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Call */}
          <a
            href={`tel:${PHONE}`}
            aria-label={`Call Khatu Rides Travels at ${PHONE_DISPLAY}`}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-[#063B8F] px-3.5 text-[10px] font-black uppercase tracking-wide text-white shadow-[0_7px_18px_rgba(6,59,143,0.24)] transition active:scale-95"
          >
            <Phone
              className="h-4 w-4"
              strokeWidth={2.8}
            />
            Call
          </a>

          {/* Menu */}
          <button
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={[
              "flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-200 active:scale-95",
              open
                ? "border-[#071A3A] bg-[#071A3A] shadow-[0_7px_18px_rgba(7,26,58,0.20)]"
                : "border-[#F5C400] bg-[#F5C400] shadow-[0_7px_18px_rgba(245,196,0,0.26)]",
            ].join(" ")}
          >
            {open ? (
              <span
                className="relative block h-5 w-5"
                aria-hidden="true"
              >
                <span className="absolute left-1/2 top-1/2 h-[2.5px] w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white" />
                <span className="absolute left-1/2 top-1/2 h-[2.5px] w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
              </span>
            ) : (
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

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}
      {open && (
        <div className="border-t border-slate-200 bg-white shadow-[0_18px_34px_rgba(7,26,58,0.12)] lg:hidden">
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
                      "flex min-h-12 items-center justify-between rounded-xl px-4 text-[12px] font-black uppercase tracking-wide transition-all duration-200",
                      isCalculator
                        ? "bg-[#F5C400] text-[#071A3A] shadow-[0_6px_16px_rgba(245,196,0,0.22)]"
                        : "text-[#26364D] hover:bg-[#071A3A] hover:text-white",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2">
                      {isCalculator && (
                        <Calculator
                          className="h-4 w-4"
                          strokeWidth={2.7}
                        />
                      )}

                      {link.label}
                    </span>

                    <ChevronRight
                      className={[
                        "h-4 w-4",
                        isCalculator
                          ? "text-[#071A3A]"
                          : "text-slate-400",
                      ].join(" ")}
                      strokeWidth={2.7}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA */}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Khatu Rides Travels on WhatsApp"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#18C964] px-3 text-[10px] font-black uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(24,201,100,0.22)] transition active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>

              <a
                href={`tel:${PHONE}`}
                onClick={closeMenu}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-3 text-[10px] font-black uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(6,59,143,0.22)] transition active:scale-[0.98]"
              >
                <Phone
                  className="h-4 w-4"
                  strokeWidth={2.8}
                />
                Call Now
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
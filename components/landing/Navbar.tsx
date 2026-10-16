"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calculator, ChevronRight, Phone } from "lucide-react";
import { PHONE, PHONE_DISPLAY } from "./data";

const WHATSAPP_URL = "https://wa.me/919244137353";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
  { label: "Travel Invoice", href: "/my-invoices" },
  { label: "Fleet", href: "/fleet" },
  { label: "Services", href: "/services" },
  { label: "Online Book", href: "/fare-calculator" },
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
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] border-b border-white/10 bg-[#010614]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#010614]/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-[84px] lg:px-8">
        {/* =========================================================
            BRAND LOGO
        ========================================================= */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Khatu Rides Travels Co. Home"
          className="flex shrink-0 items-center drop-shadow-lg"
        >
          {/* Note: Ensure your nav_logo.png is visible on dark backgrounds, or use a white/transparent variant here */}
          <Image
            src="/nav_logo.png"
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
        <nav className="hidden items-center gap-1 xl:flex">
          {links.map((link) => {
            const isCalculator = link.href === "/fare-calculator";
            const isActive = isActiveLink(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "group relative flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                  isActive
                    ? "kr-nav-active ml-0 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-slate-950 ring-1 ring-yellow-200/70 shadow-[0_5px_18px_rgba(250,204,21,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(250,204,21,0.5)]"
                    : isCalculator
                      ? "ml-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_4px_15px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(245,158,11,0.6)]"
                      : "text-slate-300 hover:bg-white/10 hover:text-white",
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
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.9)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* =========================================================
            DESKTOP CTA
        ========================================================= */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* WhatsApp - Premium Dark Variant */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Khatu Rides Travels on WhatsApp"
            className="group flex h-[42px] items-center gap-2 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-4 text-[11px] font-bold uppercase tracking-widest text-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.1)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/60 hover:bg-[#25D366]/20 hover:text-[#25D366] hover:shadow-[0_0_25px_rgba(37,211,102,0.25)]"
          >
            <WhatsAppIcon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
            WhatsApp
          </a>

          {/* Call - High Contrast White Variant */}
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
            className="group flex h-[42px] items-center gap-2 rounded-xl bg-white px-5 text-[11px] font-extrabold uppercase tracking-widest text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          >
            <Phone
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110"
              strokeWidth={2.8}
            />
            Call Now
          </a>
        </div>

        {/* =========================================================
            MOBILE ACTIONS
        ========================================================= */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Call */}
          <a
            href={`tel:${PHONE}`}
            aria-label={`Call Khatu Rides Travels at ${PHONE_DISPLAY}`}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-white px-3.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-950 shadow-[0_4px_10px_rgba(255,255,255,0.1)] transition active:scale-95"
          >
            <Phone
              className="h-3.5 w-3.5"
              strokeWidth={2.8}
            />
            Call
          </a>

          {/* Menu Toggle */}
          <button
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={[
              "flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-300 active:scale-95",
              open
                ? "border-white/20 bg-white/10 text-white shadow-inner"
                : "border-amber-400/50 bg-amber-400/10 text-amber-400",
            ].join(" ")}
          >
            {open ? (
              <span className="relative block h-4 w-4" aria-hidden="true">
                <span className="absolute left-1/2 top-1/2 h-[2px] w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current transition-all" />
                <span className="absolute left-1/2 top-1/2 h-[2px] w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current transition-all" />
              </span>
            ) : (
              <span className="flex w-4 flex-col gap-[3.5px]" aria-hidden="true">
                <span className="h-[2px] w-4 rounded-full bg-current" />
                <span className="h-[2px] w-4 rounded-full bg-current" />
                <span className="h-[2px] w-4 rounded-full bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}
      {open && (
        <div className="absolute top-full left-0 w-full border-b border-white/10 bg-[#010614]/95 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.7)] lg:hidden">
          <nav className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6">
            <div className="grid gap-1.5">
              {links.map((link) => {
                const isCalculator = link.href === "/fare-calculator";
                const isActive = isActiveLink(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "relative flex min-h-[48px] items-center justify-between rounded-xl px-4 text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 ring-1 ring-yellow-200/70 shadow-[0_5px_18px_rgba(250,204,21,0.25)]"
                        : isCalculator
                          ? "mt-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_4px_15px_rgba(245,158,11,0.3)]"
                          : "text-slate-300 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2.5">
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
                        isActive || isCalculator ? "text-slate-950" : "text-slate-500",
                      ].join(" ")}
                      strokeWidth={2.7}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Khatu Rides Travels on WhatsApp"
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-3 text-[10px] font-bold uppercase tracking-widest text-[#25D366] transition active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                WhatsApp
              </a>

              <a
                href={`tel:${PHONE}`}
                onClick={closeMenu}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-white px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-950 shadow-[0_4px_15px_rgba(255,255,255,0.15)] transition active:scale-[0.98]"
              >
                <Phone
                  className="h-3.5 w-3.5"
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
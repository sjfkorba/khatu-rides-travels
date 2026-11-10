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
  { label: "Book Online", href: "/fare-calculator" },
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
    <header className="sticky top-0 z-[100] border-b border-orange-100 bg-[#fffaf5]/95 shadow-[0_2px_12px_rgba(15,23,42,0.07)] backdrop-blur-xl">
      <div className="mx-auto flex h-[56px] max-w-[1440px] items-center justify-between px-3 sm:px-5 lg:h-[62px] lg:px-7">
        {/* =========================================================
            BRAND LOGO
        ========================================================= */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Khatu Rides Travels Co. Home"
          className="flex shrink-0 items-center drop-shadow-sm"
        >
          {/* Note: Ensure your nav_logo.png is visible on dark backgrounds, or use a white/transparent variant here */}
          <Image
            src="/new_logo.png"
            alt="Khatu Rides Travels Co."
            width={190}
            height={58}
            priority
            className="h-auto w-[118px] object-contain sm:w-[132px] lg:w-[148px]"
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
                  "group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide transition-all duration-200",
                  isActive
                    ? "kr-nav-active bg-orange-500 text-white shadow-[0_3px_10px_rgba(249,115,22,0.25)] ring-1 ring-orange-400"
                    : "text-slate-700 hover:bg-orange-50 hover:text-orange-700",
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
                    className="absolute -bottom-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-white"
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
            className="group flex h-8 items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 text-[10px] font-extrabold uppercase tracking-wide text-green-700 transition hover:bg-green-100"
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
            className="group flex h-8 items-center gap-2 rounded-lg bg-orange-500 px-4 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm transition hover:bg-orange-600"
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
        <div className="flex items-center gap-2 lg:hidden">
          {/* Call */}
          <a
            href={`tel:${PHONE}`}
            aria-label={`Call Khatu Rides Travels at ${PHONE_DISPLAY}`}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-orange-500 px-3 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm transition active:scale-95"
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
              "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 active:scale-95",
              open
                ? "border-orange-200 bg-orange-50 text-orange-700 shadow-inner"
                : "border-orange-200 bg-white text-orange-600",
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
        <div className="absolute top-full left-0 w-full border-b border-orange-100 bg-[#fffaf5]/98 shadow-[0_12px_28px_rgba(15,23,42,0.12)] backdrop-blur-2xl lg:hidden">
          <nav className="mx-auto max-w-[1440px] px-3 py-3 sm:px-5">
            <div className="grid gap-1">
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
                      "relative flex min-h-[40px] items-center justify-between rounded-lg px-3.5 text-[11px] font-extrabold uppercase tracking-wide transition-all duration-200",
                      isActive
                        ? "bg-orange-500 text-white ring-1 ring-orange-400 shadow-sm"
                        : "text-slate-700 hover:bg-orange-50 hover:text-orange-700",
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
                        isActive ? "text-white" : "text-slate-400",
                      ].join(" ")}
                      strokeWidth={2.7}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA */}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-orange-100 pt-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Khatu Rides Travels on WhatsApp"
                className="flex min-h-[38px] items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 text-[10px] font-extrabold uppercase tracking-wide text-green-700 transition active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                WhatsApp
              </a>

              <a
                href={`tel:${PHONE}`}
                onClick={closeMenu}
                className="flex min-h-[38px] items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm transition active:scale-[0.98]"
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
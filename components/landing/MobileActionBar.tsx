"use client";

import { useState } from "react";
import { PHONE, WHATSAPP } from "./data";
import Icon from "./Icons";

export default function MobileActionBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-4 z-[999] md:hidden">
      <div className="flex flex-col items-center gap-3">

        {/* CALL + WHATSAPP */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-300 ease-out ${
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-5 opacity-0"
          }`}
        >
          {/* CALL */}
          <a
  href={`tel:${PHONE}`}
  aria-label="Call Khatu Rides"
  onClick={(e) => {
    e.preventDefault();
    const telUrl = `tel:${PHONE}`;
    if (typeof window !== "undefined" && typeof (window as any).gtag_report_conversion === "function") {
      (window as any).gtag_report_conversion(telUrl);
    } else {
      window.location.href = telUrl;
    }
  }}
  className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316] text-white shadow-[0_8px_25px_rgba(249,115,22,0.35)] ring-[3px] ring-white transition-all duration-200 hover:scale-110 active:scale-95"
>
  <Icon name="phone" size={21} />

  <span className="pointer-events-none absolute right-[68px] whitespace-nowrap rounded-lg bg-[#F97316] px-3 py-2 text-[9px] font-black uppercase tracking-wider text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
    Call Us
  </span>
</a>

          {/* WHATSAPP */}
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp Khatu Rides"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#16A34A] text-white shadow-[0_8px_25px_rgba(22,163,74,0.35)] ring-[3px] ring-white transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Icon name="whatsapp" size={23} />

            <span className="pointer-events-none absolute right-[68px] whitespace-nowrap rounded-lg bg-[#16A34A] px-3 py-2 text-[9px] font-black uppercase tracking-wider text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              WhatsApp
            </span>
          </a>
        </div>

        {/* MAIN BUTTON */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close contact options" : "Open contact options"}
          aria-expanded={open}
          className={`relative flex h-[64px] w-[64px] items-center justify-center rounded-full border-[3px] border-white text-slate-950 shadow-[0_10px_35px_rgba(245,158,11,0.40)] transition-all duration-300 active:scale-90 ${
            open
              ? "rotate-0 bg-white text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.20)]"
              : "bg-[#F9B900]"
          }`}
        >
          {!open && (
            <span className="absolute inset-0 animate-ping rounded-full bg-[#F9B900] opacity-20" />
          )}

          <span className="relative z-10">
            {open ? (
              <Icon name="close" size={23} />
            ) : (
              <Icon name="phone" size={22} />
            )}
          </span>
        </button>

      </div>
    </div>
  );
}
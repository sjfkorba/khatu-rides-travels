"use client";

import { useState } from "react";
import Icon from "./Icons";
import { PHONE, PHONE_DISPLAY, WHATSAPP } from "./data";

const links = [
  ["Home", "#home"], ["Cab Services", "#services"], ["Tour Packages", "#tours"],
  ["Popular Routes", "#routes"], ["About Us", "#trust"], ["Contact", "#contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#home" className="shrink-0">
          <img src="/nav_logo.png" alt="Khatu Rides Travels" className="h-12 w-auto sm:h-14" />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href], i) => (
            <a key={label} href={href} className={`text-[12px] font-extrabold transition ${i === 0 ? "text-slate-950 after:mx-auto after:mt-2 after:block after:h-1 after:w-7 after:rounded-full after:bg-amber-400" : "text-slate-600 hover:text-slate-950"}`}>
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={`tel:${PHONE}`} className="hidden items-center gap-2 rounded-2xl bg-amber-400 px-4 py-2.5 shadow-sm sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-amber-400"><Icon name="phone" size={15} /></span>
            <span className="leading-tight">
              <span className="block text-[9px] font-black uppercase tracking-wider text-slate-600">24×7 Customer Support</span>
              <span className="block text-sm font-black text-slate-950">{PHONE_DISPLAY}</span>
            </span>
          </a>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="hidden rounded-xl bg-slate-950 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-amber-400 hover:text-slate-950 md:block">
            WhatsApp
          </a>
          <button onClick={() => setOpen(v => !v)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-900 lg:hidden" aria-label="Open menu">
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 shadow-xl lg:hidden">
          <nav className="grid gap-1">
            {links.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-amber-50 hover:text-slate-950">{label}</a>
            ))}
            <a href={`tel:${PHONE}`} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950"><Icon name="phone" size={17} /> Call {PHONE_DISPLAY}</a>
          </nav>
        </div>
      )}
    </header>
  );
}

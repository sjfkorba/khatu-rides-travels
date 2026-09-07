"use client";

import { useEffect, useState } from "react";
import { HERO_SLIDES, PHONE, PHONE_DISPLAY, WHATSAPP } from "./data";
import Icon from "./Icons";

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex(v => (v + 1) % HERO_SLIDES.length), 5000);
    return () => window.clearInterval(id);
  }, []);

  const slide = HERO_SLIDES[index];

  return (
    <section id="home" className="relative isolate overflow-hidden bg-[#061426]">
      <div className="absolute inset-0">
        <img src="/splash-bg.png" alt="" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,13,27,.96)_0%,rgba(3,13,27,.78)_42%,rgba(3,13,27,.20)_78%,rgba(3,13,27,.45)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,13,27,.10),rgba(3,13,27,.70))]" />
      </div>

      <div className="relative mx-auto min-h-[590px] max-w-[1440px] px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-[.2em] text-amber-300 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              {slide.eyebrow}
            </div>
            <h1 className="mt-5 text-[42px] font-black leading-[.95] tracking-[-.045em] sm:text-6xl lg:text-[76px]">
              YOUR JOURNEY<br />
              <span className="text-amber-300">OUR PRIORITY</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm font-medium leading-6 text-white/75 sm:text-base">
              Reliable cabs across Chhattisgarh & beyond. One-way taxi, airport transfer, local rental and spiritual journeys with 24×7 support.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-bold text-white/90">
              {[
                ["shield", "Safe Rides"], ["route", "Transparent Fare"], ["driver", "Professional Drivers"], ["clock", "24×7 Support"]
              ].map(([icon, text]) => (
                <span key={text} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur">
                  <Icon name={icon as any} size={14} /> {text}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={`tel:${PHONE}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_12px_35px_rgba(251,191,36,.28)] transition hover:-translate-y-0.5 hover:bg-amber-300">
                <Icon name="phone" size={17} /> Call For Booking
              </a>
              <a href={`https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20cab.`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-xs font-black uppercase tracking-wider text-white backdrop-blur transition hover:bg-white hover:text-slate-950">
                <Icon name="whatsapp" size={17} /> WhatsApp Booking
              </a>
            </div>
          </div>

          <div className="relative hidden min-h-[420px] items-end justify-center lg:flex">
            <div className="absolute right-0 top-10 max-w-[180px] -rotate-6 text-right text-3xl font-semibold italic leading-[.9] text-white/90">
              Travel<br />Explore<br /><span className="text-amber-300">Believe</span>
            </div>
            <div className="absolute bottom-2 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-amber-400/15 blur-3xl" />
            <img src="/splash-car.png" alt="Khatu Rides cab" className="relative z-10 w-[92%] max-w-[650px] object-contain drop-shadow-[0_30px_35px_rgba(0,0,0,.5)]" />
          </div>
        </div>

        <div className="mt-8 grid gap-2 rounded-[26px] border border-white/15 bg-white/95 p-2 shadow-[0_20px_70px_rgba(0,0,0,.3)] backdrop-blur-xl sm:grid-cols-4 lg:max-w-[920px]">
          {[
            ["One Way", "City to City", "route"],
            ["Round Trip", "Dedicated Cab", "route"],
            ["Airport", "Pickup & Drop", "plane"],
            ["Tour Package", "Spiritual & Holiday", "temple"],
          ].map(([title, text, icon]) => (
            <a key={title} href={title === "Airport" ? "#airport" : title === "Tour Package" ? "#tours" : "#routes"} className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-amber-50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><Icon name={icon as any} size={18} /></span>
              <span><b className="block text-xs font-black text-slate-950">{title}</b><small className="text-[9px] font-bold text-slate-500">{text}</small></span>
              <Icon name="arrow" size={15} />
            </a>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-1.5">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Hero slide ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-amber-400" : "w-2 bg-white/30"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

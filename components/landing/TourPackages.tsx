"use client";

import { useRef } from "react";
import { DESTINATIONS, TOURS } from "./data";
import { 
  ArrowRight, 
  MessageCircle, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Clock3, 
  Car 
} from "lucide-react";

/* ============================================================
   CONSTANTS FOR LEADS
============================================================ */
const PHONE = "9244137353";
const WHATSAPP = "919244137353";

type TourItem = {
  readonly title: string;
  readonly type: string;
  readonly image: string;
  readonly href?: string;
};

/* ============================================================
   SLIDER BUTTON
============================================================ */

function SliderButton({
  direction,
  onClick,
  label,
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#063B8F] shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-[#063B8F] hover:bg-[#063B8F] hover:text-white active:scale-90"
    >
      <ArrowRight
        size={18}
        className={direction === "left" ? "rotate-180" : ""}
      />
    </button>
  );
}

/* ============================================================
   LEAD-GEN TRAVEL CARD (NO OVERLAPPING TEXT)
============================================================ */

function TravelCard({ item, index }: { item: TourItem; index: number }) {
  const whatsappMsg = encodeURIComponent(
    `Hi Khatu Rides, I want to know the cab fare and details for ${item.title}.`
  );

  return (
    <div className="group flex h-auto w-[82vw] min-w-[260px] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] sm:w-[300px] lg:w-[320px]">
      
      {/* 1. IMAGE SECTION (Top) - Clean, no text clutter */}
      <a href={item.href || "#contact"} className="relative block h-[180px] w-full overflow-hidden sm:h-[200px]">
        <img
          src={item.image}
          alt={item.title}
          loading={index < 2 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Subtle Gradient just for the top badge */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#071B33] shadow-sm backdrop-blur-md">
          <MapPin size={11} className="text-amber-500" />
          {item.type}
        </div>
      </a>

      {/* 2. CONTENT SECTION (Bottom) - Easy to read */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <a href={item.href || "#contact"} className="block">
          <h3 className="text-lg font-black leading-tight tracking-tight text-slate-900 group-hover:text-[#063B8F] sm:text-xl">
            {item.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[11px] font-semibold leading-relaxed text-slate-500">
            {item.type.toLowerCase().includes("tour")
              ? `Book a private, comfortable outstation cab for your ${item.title} journey.`
              : `Explore ${item.title} and nearby attractions with our premium local taxi.`}
          </p>
        </a>

        {/* 3. DIRECT ACTION BUTTONS (Maximized Leads) */}
        <div className="mt-auto pt-5 flex items-center gap-2">
          {/* WhatsApp Action (Primary Lead Generator) */}
          <a
            href={`https://wa.me/${WHATSAPP}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-[10px] font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-[#20bd5a] active:scale-95"
          >
            <MessageCircle size={15} />
            Get Quote
          </a>

          {/* Direct Call Action */}
          <a
            href={`tel:+91${PHONE}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#071B33] transition hover:bg-[#071B33] hover:text-white active:scale-95"
            aria-label="Call Now"
          >
            <Phone size={17} fill="currentColor" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  eyebrow,
  title,
  highlight,
  description,
  href,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-[760px]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
            {eyebrow}
          </span>
        </div>
        <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight text-[#071B33] sm:text-4xl lg:text-[42px]">
          {title} <span className="text-[#063B8F]">{highlight}</span>
        </h2>
        <p className="mt-3 max-w-[650px] text-xs font-medium leading-relaxed text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>

      <a
        href={href}
        className="group hidden shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#063B8F] shadow-sm transition hover:border-[#063B8F] hover:bg-[#063B8F] hover:text-white lg:flex"
      >
        View All Packages
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>
  );
}

/* ============================================================
   TRAVEL CAROUSEL
============================================================ */

function TravelCarousel({ items, id }: { items: readonly TourItem[]; id: string }) {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const amount = Math.min(slider.clientWidth * 0.8, 320);
    slider.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-8">
      <div className="mb-4 hidden items-center justify-end lg:flex">
        <div className="flex items-center gap-2">
          <SliderButton direction="left" label={`Prev ${id}`} onClick={() => scroll("left")} />
          <SliderButton direction="right" label={`Next ${id}`} onClick={() => scroll("right")} />
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
      >
        {items.map((item, index) => (
          <TravelCard key={`${id}-${item.title}-${index}`} item={item} index={index} />
        ))}

        {/* EXPLORE MORE CARD (Lead Gen Focused) */}
        <div className="group flex h-auto w-[82vw] min-w-[260px] max-w-[320px] shrink-0 snap-start flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-all duration-300 hover:border-amber-400 hover:bg-amber-50 sm:w-[300px] lg:w-[320px]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#063B8F] shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-900">
            <ArrowRight size={22} />
          </div>
          <h3 className="mt-5 text-lg font-black text-slate-900">Custom Route?</h3>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">
            Can't find your destination? Message us for a custom outstation cab fare.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP}?text=Hi Khatu Rides, I need a custom cab quote.`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-amber-400 hover:text-slate-900"
          >
            Get Custom Quote
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TRUST STRIP (Boosts Conversions)
============================================================ */

function FeatureStrip() {
  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:grid sm:grid-cols-3">
      <Feature icon={<ShieldCheck size={20} />} title="100% Safe Rides" text="Police verified & experienced drivers." />
      <Feature icon={<Car size={20} />} title="Premium Cabs" text="Clean AC Innova, Ertiga & Sedans." />
      <Feature icon={<Clock3 size={20} />} title="On-Time Guarantee" text="Punctual pickups & 24x7 support." />
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-slate-100 p-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-black text-slate-900">{title}</h3>
        <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{text}</p>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN TOUR PACKAGES SECTION
============================================================ */

export default function TourPackages() {
  return (
    <section
      id="tours"
      aria-labelledby="tour-packages-heading"
      className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      {/* PREMIUM BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute -left-[10%] top-0 h-[500px] w-[500px] rounded-full bg-amber-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-[10%] top-[40%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        
        {/* INTRO */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                Top Rated Travel Partner
              </span>
            </div>
            <h2 className="mt-4 max-w-[800px] text-4xl font-black leading-tight tracking-tight text-[#071B33] sm:text-5xl lg:text-6xl">
              Journeys worth <span className="text-amber-500">remembering.</span>
            </h2>
            <p className="mt-4 max-w-[600px] text-sm font-medium leading-relaxed text-slate-500 sm:text-base">
              Book private outstation cabs for spiritual tours and local Chhattisgarh destinations. Transparent fares, expert drivers, and instant booking.
            </p>
          </div>
        </div>

        {/* CAROUSEL 1: SPIRITUAL */}
        <div className="mt-16">
          <SectionHeader
            eyebrow="Spiritual Routes"
            title="Divine"
            highlight="Journeys"
            description="Comfortable, safe, and family-friendly cab travel to India's top pilgrimage destinations."
            href="/tour-packages"
          />
          <TravelCarousel items={TOURS} id="spiritual" />
        </div>

        {/* CAROUSEL 2: CHHATTISGARH */}
        <div className="mt-12 sm:mt-16">
          <SectionHeader
            eyebrow="Explore Local"
            title="Discover"
            highlight="Chhattisgarh"
            description="From waterfalls to ancient temples, book a direct cab to Chhattisgarh's best tourist spots."
            href="/destinations"
          />
          <TravelCarousel items={DESTINATIONS} id="chhattisgarh" />
        </div>

        {/* TRUST STRIP */}
        <FeatureStrip />

        {/* MOBILE VIEW ALL BUTTONS */}
        <div className="mt-8 grid grid-cols-2 gap-3 lg:hidden">
          <a
            href="/tour-packages"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#071B33] px-4 text-[10px] font-black uppercase tracking-wider text-white shadow-md active:scale-95"
          >
            All Packages <ArrowRight size={14} />
          </a>
          <a
            href="/destinations"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-[10px] font-black uppercase tracking-wider text-[#063B8F] shadow-sm active:scale-95"
          >
            All Destinations <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
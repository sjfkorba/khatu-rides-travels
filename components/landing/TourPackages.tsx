"use client";

import { useRef } from "react";
import { DESTINATIONS, TOURS } from "./data";
import Icon from "./Icons";

type TourItem = {
  readonly title: string;
  readonly type: string;
  readonly image: string;
  readonly href?: string;
};

/* ============================================================
   ARROW ICON
============================================================ */

function ArrowIcon({
  direction = "right",
}: {
  direction?: "left" | "right";
}) {
  return (
    <span
      className={`block transition-transform duration-300 ${
        direction === "left" ? "rotate-180" : ""
      }`}
    >
      <Icon name="arrow" size={14} />
    </span>
  );
}

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
      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#063B8F] shadow-[0_6px_18px_rgba(15,23,42,0.08)] transition duration-200 hover:border-[#063B8F]/20 hover:bg-[#063B8F] hover:text-white active:scale-95"
    >
      <span
        className={
          direction === "left"
            ? "rotate-180 transition-transform duration-200"
            : "transition-transform duration-200"
        }
      >
        <Icon name="arrow" size={13} />
      </span>
    </button>
  );
}

/* ============================================================
   TRAVEL CARD
============================================================ */

function TravelCard({
  item,
  index,
}: {
  item: TourItem;
  index: number;
}) {
  return (
    <a
      href={item.href || "#contact"}
      aria-label={`Explore ${item.title} - ${item.type}`}
      className="group relative block h-[245px] w-[78vw] min-w-[250px] max-w-[315px] shrink-0 snap-start overflow-hidden rounded-[24px] bg-[#071B33] shadow-[0_14px_38px_rgba(15,23,42,0.12)] outline-none transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.18)] focus-visible:ring-2 focus-visible:ring-[#F59E0B] sm:h-[265px] sm:w-[290px] lg:h-[285px] lg:w-[300px]"
    >
      {/* ======================================================
          IMAGE
      ====================================================== */}

      <img
        src={item.image}
        alt={`${item.title} - ${item.type}`}
        loading={index < 2 ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-[1.07]"
      />

      {/* ======================================================
          IMAGE OVERLAY
      ====================================================== */}

      <div className="absolute inset-0 bg-gradient-to-b from-[#071B33]/10 via-[#071B33]/10 to-[#071B33]/95" />

      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#071B33] via-[#071B33]/70 to-transparent" />

      {/* ======================================================
          TOP CATEGORY
      ====================================================== */}

      <div className="absolute left-4 top-4 z-10">
        <span className="inline-flex items-center rounded-full border border-white/20 bg-[#071B33]/65 px-2.5 py-1.5 text-[7px] font-black uppercase tracking-[0.15em] text-white backdrop-blur-md">
          {item.type}
        </span>
      </div>

      {/* ======================================================
          CARD NUMBER
      ====================================================== */}

      <div className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[8px] font-black text-white backdrop-blur-md">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
        <div className="pr-10">
          <h3 className="text-[17px] font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-[19px]">
            {item.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-[8px] font-semibold leading-4 text-white/65 sm:text-[9px]">
            {item.type.toLowerCase().includes("tour")
              ? `Comfortable cab travel for your ${item.title} journey.`
              : `Explore ${item.title} with comfortable local cab travel.`}
          </p>
        </div>

        {/* ====================================================
            ARROW CTA
        ==================================================== */}

        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#071B33] shadow-[0_8px_20px_rgba(0,0,0,0.20)] transition duration-300 group-hover:bg-[#FBBF24]">
          <ArrowIcon />
        </div>

        {/* ====================================================
            EXPLORE LABEL
        ==================================================== */}

        <div className="mt-3 flex items-center gap-2 text-[7px] font-black uppercase tracking-[0.12em] text-amber-300 opacity-80 transition duration-300 group-hover:opacity-100">
          Explore journey

          <span className="h-px w-7 bg-amber-300/70 transition-all duration-300 group-hover:w-11" />
        </div>
      </div>
    </a>
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
        {/* Eyebrow */}
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />

          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B77900]">
            {eyebrow}
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-2 text-[30px] font-black leading-[1] tracking-[-0.055em] text-[#071B33] sm:text-[38px] lg:text-[44px]">
          {title}{" "}
          <span className="text-[#063B8F]">
            {highlight}
          </span>
        </h2>

        {/* Description */}
        <p className="mt-3 max-w-[650px] text-[10px] font-semibold leading-5 text-slate-500 sm:text-[11px]">
          {description}
        </p>
      </div>

      {/* ======================================================
          DESKTOP VIEW ALL
      ====================================================== */}

      <a
        href={href}
        className="group hidden shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[8px] font-black uppercase tracking-[0.12em] text-[#063B8F] shadow-sm transition hover:border-[#063B8F]/20 hover:bg-[#F7F9FC] lg:flex"
      >
        View All

        <span className="transition-transform duration-300 group-hover:translate-x-1">
          <Icon name="arrow" size={13} />
        </span>
      </a>
    </div>
  );
}

/* ============================================================
   TRAVEL CAROUSEL
============================================================ */

function TravelCarousel({
  items,
  id,
}: {
  items: readonly TourItem[];
  id: string;
}) {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;

    if (!slider) return;

    const amount = Math.min(
      slider.clientWidth * 0.78,
      360
    );

    slider.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-6">
      {/* ======================================================
          DESKTOP CAROUSEL CONTROLS

          IMPORTANT:
          These have their own reserved row, so they never
          overlap View All.
      ====================================================== */}

      <div className="mb-3 hidden items-center justify-end lg:flex">
        <div className="flex items-center gap-2">
          <SliderButton
            direction="left"
            label={`Previous ${id}`}
            onClick={() => scroll("left")}
          />

          <SliderButton
            direction="right"
            label={`Next ${id}`}
            onClick={() => scroll("right")}
          />
        </div>
      </div>

      {/* ======================================================
          SLIDER
      ====================================================== */}

      <div
        ref={sliderRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
      >
        {items.map((item, index) => (
          <TravelCard
            key={`${id}-${item.title}-${index}`}
            item={item}
            index={index}
          />
        ))}

        {/* ====================================================
            END / EXPLORE MORE CARD
        ==================================================== */}

        <a
          href={
            id === "spiritual"
              ? "/tour-packages"
              : "/destinations"
          }
          aria-label={
            id === "spiritual"
              ? "View all tour packages"
              : "View all Chhattisgarh destinations"
          }
          className="group flex h-[245px] w-[78vw] min-w-[250px] max-w-[315px] shrink-0 snap-start flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-[#F8FAFC] text-center transition duration-300 hover:border-[#F59E0B] hover:bg-amber-50 sm:h-[265px] sm:w-[290px] lg:h-[285px] lg:w-[300px]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#063B8F] shadow-[0_8px_25px_rgba(15,23,42,0.08)] transition duration-300 group-hover:scale-105 group-hover:bg-[#FBBF24] group-hover:text-[#071B33]">
            <Icon name="arrow" size={17} />
          </div>

          <div className="mt-4 text-[11px] font-black text-[#071B33]">
            Explore More
          </div>

          <div className="mt-1 text-[8px] font-semibold text-slate-400">
            Discover more journeys
          </div>
        </a>
      </div>

      {/* ======================================================
          MOBILE SLIDE HINT
      ====================================================== */}

      <div className="mt-1 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <span className="h-1 w-7 rounded-full bg-[#F59E0B]" />
          <span className="h-1 w-3 rounded-full bg-slate-200" />
          <span className="h-1 w-3 rounded-full bg-slate-200" />
        </div>

        <span className="text-[7px] font-black uppercase tracking-[0.14em] text-slate-400">
          Swipe to explore
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   FEATURE STRIP
============================================================ */

function FeatureStrip() {
  return (
    <div className="mt-8 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] sm:grid sm:grid-cols-3">
      <Feature
        number="01"
        title="Comfortable Travel"
        text="Choose a vehicle that suits your journey."
      />

      <Feature
        number="02"
        title="Local Knowledge"
        text="Travel across Chhattisgarh with local expertise."
      />

      <Feature
        number="03"
        title="Direct Booking"
        text="Connect directly with our booking team."
      />
    </div>
  );
}

/* ============================================================
   FEATURE ITEM
============================================================ */

function Feature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-4 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#071B33] text-[7px] font-black text-amber-300">
        {number}
      </div>

      <div>
        <h3 className="text-[9px] font-black uppercase tracking-[0.08em] text-[#071B33]">
          {title}
        </h3>

        <p className="mt-1 text-[8px] font-semibold leading-4 text-slate-400">
          {text}
        </p>
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
      className="relative overflow-hidden bg-[#F7F9FC] py-12 sm:py-16 lg:py-20"
    >
      {/* ======================================================
          PREMIUM BACKGROUND GLOWS
      ====================================================== */}

      <div className="pointer-events-none absolute left-[-180px] top-[-160px] h-[420px] w-[420px] rounded-full bg-amber-200/25 blur-3xl" />

      <div className="pointer-events-none absolute right-[-180px] top-[20%] h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-220px] left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-slate-200/30 blur-3xl" />

      {/* ======================================================
          SUBTLE GRID
      ====================================================== */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#071B33 1px, transparent 1px), linear-gradient(90deg, #071B33 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        {/* ====================================================
            MAIN INTRO
        ==================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span
              id="tour-packages-heading"
              className="sr-only"
            >
              Cab Tour Packages and Chhattisgarh Travel Destinations
            </span>

            {/* INTRO BADGE */}

            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

              <span className="text-[8px] font-black uppercase tracking-[0.18em] text-amber-700">
                Travel • Explore • Experience
              </span>
            </div>

            {/* MAIN HEADING */}

            <h2 className="mt-3 max-w-[800px] text-[34px] font-black leading-[0.98] tracking-[-0.06em] text-[#071B33] sm:text-[44px] lg:text-[52px]">
              Journeys worth{" "}
              <span className="text-[#063B8F]">
                remembering.
              </span>
            </h2>

            {/* INTRO DESCRIPTION */}

            <p className="mt-3 max-w-[680px] text-[10px] font-semibold leading-5 text-slate-500 sm:text-[11px]">
              Explore spiritual tour packages, Chhattisgarh
              destinations and comfortable cab journeys with
              Khatu Rides Travels Co.
            </p>
          </div>

          {/* ==================================================
              QUICK STATS
          ================================================== */}

          <div className="flex w-fit items-center gap-2 rounded-[18px] border border-slate-200 bg-white p-2 shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
            <div className="rounded-[13px] bg-[#071B33] px-3 py-2.5 text-center">
              <div className="text-[15px] font-black leading-none text-white">
                {TOURS.length}
              </div>

              <div className="mt-1 text-[6px] font-black uppercase tracking-[0.12em] text-blue-100/55">
                Tours
              </div>
            </div>

            <div className="rounded-[13px] bg-amber-50 px-3 py-2.5 text-center">
              <div className="text-[15px] font-black leading-none text-amber-700">
                {DESTINATIONS.length}
              </div>

              <div className="mt-1 text-[6px] font-black uppercase tracking-[0.12em] text-amber-700/55">
                Places
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            SPIRITUAL TRAVEL
        ==================================================== */}

        <div className="mt-10 sm:mt-12">
          <SectionHeader
            eyebrow="Spiritual Travel"
            title="Divine"
            highlight="Journeys"
            description="Plan comfortable cab journeys to spiritual and pilgrimage destinations with flexible travel options for families, groups and devotees."
            href="/tour-packages"
          />

          <TravelCarousel
            items={TOURS}
            id="spiritual"
          />
        </div>

        {/* ====================================================
            LOCAL CHHATTISGARH
        ==================================================== */}

        <div className="mt-12 border-t border-slate-200/80 pt-10 sm:mt-16 sm:pt-12">
          <SectionHeader
            eyebrow="Explore Local"
            title="Discover"
            highlight="Chhattisgarh"
            description="Explore local destinations, nature, heritage and memorable places across Chhattisgarh with comfortable cab travel."
            href="/destinations"
          />

          <TravelCarousel
            items={DESTINATIONS}
            id="chhattisgarh"
          />
        </div>

        {/* ====================================================
            TRUST / EXPERIENCE STRIP
        ==================================================== */}

        <FeatureStrip />

        {/* ====================================================
            MOBILE VIEW ALL
        ==================================================== */}

        <div className="mt-5 grid grid-cols-2 gap-2 lg:hidden">
          <a
            href="/tour-packages"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#071B33] px-3 text-[8px] font-black uppercase tracking-[0.1em] text-white shadow-[0_8px_22px_rgba(7,27,51,0.15)] transition active:scale-[0.98]"
          >
            Tour Packages

            <Icon name="arrow" size={12} />
          </a>

          <a
            href="/destinations"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[8px] font-black uppercase tracking-[0.1em] text-[#063B8F] shadow-sm transition active:scale-[0.98]"
          >
            Destinations

            <Icon name="arrow" size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
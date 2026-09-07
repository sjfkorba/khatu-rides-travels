"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { REVIEWS } from "./data";
import Icon from "./Icons";

const REVIEW_PHONE = "9244137353";
const REVIEW_WHATSAPP = "919244137353";

const AUTO_SLIDE_MS = 4500;

export default function Reviews() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalReviews = REVIEWS.length;

  /*
   * Number of cards visible at different breakpoints.
   * Mobile = 1
   * Tablet = 2
   * Desktop = 3
   */
  const visibleCount = 3;

  /*
   * Maximum starting index.
   *
   * Example:
   * 25 reviews + 3 visible cards
   * Last useful starting position = 22
   */
  const maxStart = Math.max(0, totalReviews - visibleCount);

  /*
   * Keep active index valid if REVIEWS changes.
   */
  useEffect(() => {
    if (active > maxStart) {
      setActive(maxStart);
    }
  }, [active, maxStart]);

  /*
   * Move forward.
   *
   * Once the end is reached, start again from the beginning.
   */
  const nextReview = () => {
    setActive((current) => {
      if (totalReviews <= visibleCount) return 0;

      return current >= maxStart ? 0 : current + 1;
    });
  };

  /*
   * Move backward.
   */
  const previousReview = () => {
    setActive((current) => {
      if (totalReviews <= visibleCount) return 0;

      return current <= 0 ? maxStart : current - 1;
    });
  };

  /*
   * Auto slider.
   */
  useEffect(() => {
    if (isPaused || totalReviews <= visibleCount) return;

    const interval = window.setInterval(() => {
      nextReview();
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(interval);
  }, [isPaused, totalReviews, visibleCount]);

  /*
   * Touch / swipe support.
   */
  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchEndX.current = null;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      return;
    }

    const distance = touchStartX.current - touchEndX.current;

    /*
     * Minimum swipe distance.
     */
    if (Math.abs(distance) < 50) {
      return;
    }

    if (distance > 0) {
      nextReview();
    } else {
      previousReview();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  /*
   * Reviews currently visible.
   *
   * We use CSS responsive hiding:
   * - Mobile: first card
   * - sm: first 2 cards
   * - lg: first 3 cards
   *
   * The actual slider position is controlled by active.
   */
  const visibleReviews = useMemo(() => {
    return REVIEWS.map((review, index) => ({
      review,
      index,
    })).slice(active, active + visibleCount);
  }, [active]);

  /*
   * If we reach the end, fill remaining slots from the beginning
   * so desktop never shows an empty card.
   */
  const displayReviews = useMemo(() => {
    if (totalReviews === 0) return [];

    const result = [];

    for (let i = 0; i < visibleCount; i++) {
      const index = (active + i) % totalReviews;

      result.push({
        review: REVIEWS[index],
        index,
      });
    }

    return result;
  }, [active, totalReviews]);

  /*
   * Progress percentage.
   */
  const progress =
    totalReviews > 0
      ? ((active + Math.min(visibleCount, totalReviews)) / totalReviews) * 100
      : 0;

  if (totalReviews === 0) {
    return null;
  }

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="relative overflow-hidden bg-white py-14 sm:py-20"
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute -left-40 top-20 h-[350px] w-[350px] rounded-full bg-amber-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[350px] w-[350px] rounded-full bg-orange-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-[1250px] px-4 sm:px-6">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">

          {/* LEFT HEADING */}
          <div>

            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-[9px] font-black uppercase tracking-[.2em] text-amber-700">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-950">
                G
              </span>

              Google Reviews
            </span>

            <h2
              id="reviews-heading"
              className="mt-4 text-3xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
            >
              Real Journeys.
              <span className="block text-amber-500">
                Real People.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px] sm:leading-7">
              See what travellers say about their experience with Khatu Rides
              Travels. From local cab rides to airport transfers and
              outstation journeys, every customer experience helps us improve
              every journey.
            </p>

          </div>

          {/* =================================================
              RATING BOX
          ================================================= */}

          <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div className="flex items-center gap-4">

              {/* Google icon */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-black shadow-sm">
                <span className="text-[#4285F4]">
                  G
                </span>
              </div>

              <div>

                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black leading-none tracking-tight text-slate-950">
                    4.9
                  </span>

                  <span className="pb-0.5 text-xs font-bold text-slate-400">
                    / 5
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Icon
                      key={index}
                      name="star"
                      size={15}
                    />
                  ))}
                </div>

              </div>

            </div>

            <div className="border-t border-slate-200 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">

              <span className="block text-xl font-black text-slate-950">
                25+
              </span>

              <span className="text-[10px] font-bold text-slate-500">
                Ratings & Reviews
              </span>

              <span className="mt-1 block text-[9px] font-semibold text-emerald-600">
                ★ Customer feedback
              </span>

            </div>

          </div>

        </div>

        {/* =====================================================
            CAROUSEL HEADER
        ===================================================== */}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              Customer Experiences
            </span>

            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              What Our Travellers Say
            </h3>
          </div>

          {/* Desktop navigation */}
          <div className="flex items-center gap-2">

            <span className="mr-2 hidden text-[10px] font-black text-slate-400 sm:block">
              {String(active + 1).padStart(2, "0")}–
              {String(
                Math.min(active + visibleCount, totalReviews)
              ).padStart(2, "0")}{" "}
              / {String(totalReviews).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={previousReview}
              aria-label="Previous reviews"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-black text-slate-700 shadow-sm transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 active:scale-95"
            >
              ←
            </button>

            <button
              type="button"
              onClick={nextReview}
              aria-label="Next reviews"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white shadow-sm transition-all hover:bg-amber-400 hover:text-slate-950 active:scale-95"
            >
              →
            </button>

          </div>

        </div>

        {/* =====================================================
            REVIEW CAROUSEL
        ===================================================== */}

        <div
          className="relative mt-5 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {displayReviews.map(({ review, index }) => (

              <article
                key={`${review.name}-${index}`}
                className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-gradient-to-br from-white via-white to-[#F8FAFC] p-5 shadow-[0_15px_45px_rgba(15,23,42,.06)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_20px_55px_rgba(245,158,11,.12)] sm:p-6"
              >

                {/* Top glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-100/60 blur-2xl transition-all duration-300 group-hover:bg-amber-200/70" />

                {/* Quote */}
                <div className="pointer-events-none absolute right-5 top-3 font-serif text-[75px] font-black leading-none text-amber-100/70">
                  “
                </div>

                {/* =================================================
                    CUSTOMER
                ================================================= */}

                <div className="relative z-10 flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-amber-100 to-orange-100 text-lg font-black text-amber-700 shadow-md">
                      {review.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <h4 className="truncate text-sm font-black text-slate-950 sm:text-[15px]">
                          {review.name}
                        </h4>

                        <span
                          title="Customer review"
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white"
                        >
                          ✓
                        </span>

                      </div>

                      <span className="mt-0.5 block truncate text-[9px] font-bold text-slate-400">
                        {review.route}
                      </span>

                    </div>

                  </div>

                  {/* Google */}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-black text-[#4285F4] shadow-sm">
                    G
                  </span>

                </div>

                {/* =================================================
                    RATING
                ================================================= */}

                <div className="relative z-10 mt-4 flex items-center gap-1">

                  {Array.from({
                    length: review.rating,
                  }).map((_, starIndex) => (
                    <Icon
                      key={starIndex}
                      name="star"
                      size={14}
                    />
                  ))}

                  <span className="ml-1 text-[9px] font-black text-slate-400">
                    {review.rating}.0
                  </span>

                </div>

                {/* =================================================
                    REVIEW TEXT
                ================================================= */}

                <div className="relative z-10 mt-5 flex-1">

                  <p className="text-[14px] font-semibold leading-6 tracking-tight text-slate-700 sm:text-[15px] sm:leading-7">
                    “{review.text}”
                  </p>

                </div>

                {/* =================================================
                    BOTTOM
                ================================================= */}

                <div className="relative z-10 mt-5 border-t border-slate-100 pt-4">

                  <div className="flex items-center justify-between gap-2">

                    <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-amber-700">
                      Comfortable Journey
                    </span>

                    <span className="text-[8px] font-bold text-slate-400">
                      Google Review
                    </span>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </div>

        {/* =====================================================
            CAROUSEL PROGRESS
        ===================================================== */}

        <div className="mt-6 flex items-center gap-4">

          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{
                width: `${Math.max(
                  8,
                  Math.min(100, progress)
                )}%`,
              }}
            />

          </div>

          <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-slate-400">
            {active + 1} / {totalReviews}
          </span>

        </div>

        {/* =====================================================
            MOBILE SWIPE HINT
        ===================================================== */}

        <div className="mt-3 text-center sm:hidden">

          <span className="text-[8px] font-black uppercase tracking-[.16em] text-slate-300">
            ← Swipe to explore reviews →
          </span>

        </div>

        {/* =====================================================
            TRUST + CTA AREA
        ===================================================== */}

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_300px]">

          {/* TRUST CARD */}

          <div className="relative overflow-hidden rounded-[28px] bg-[#061B32] p-6 text-white sm:p-8">

            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-300">
                    Why Travellers Choose Us
                  </span>

                  <h3 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
                    Your Journey
                    <span className="block text-amber-300">
                      Matters To Us.
                    </span>
                  </h3>

                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg">
                  <Icon
                    name="star"
                    size={23}
                  />
                </div>

              </div>

              <p className="mt-4 max-w-2xl text-[11px] leading-6 text-white/55 sm:text-[13px]">
                We believe every traveller deserves a comfortable, dependable
                and respectful travel experience. That is why we focus on
                clean vehicles, professional drivers and responsive customer
                assistance.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                {[
                  "Comfortable vehicles",
                  "Professional drivers",
                  "Easy booking assistance",
                  "Local & outstation expertise",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3"
                  >

                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-slate-950">
                      ✓
                    </span>

                    <span className="text-[9px] font-bold text-white/70">
                      {item}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* CTA CARD */}

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_15px_45px_rgba(15,23,42,.05)]">

            <span className="text-[9px] font-black uppercase tracking-[.18em] text-amber-600">
              Plan Your Journey
            </span>

            <h3 className="mt-2 text-xl font-black leading-tight text-slate-950">
              Ready to travel with us?
            </h3>

            <p className="mt-2 text-[10px] leading-5 text-slate-500">
              Book a cab for local travel, airport transfer, outstation
              journey or a comfortable tour.
            </p>

            <div className="mt-5 grid gap-2">

              <a
                href={`tel:+91${REVIEW_PHONE}`}
                aria-label="Call Khatu Rides"
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-[9px] font-black uppercase tracking-wider text-slate-950 transition hover:bg-amber-300 active:scale-[.98]"
              >
                <Icon
                  name="phone"
                  size={14}
                />

                Call Now
              </a>

              <a
                href={`https://wa.me/${REVIEW_WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20cab`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Khatu Rides"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-emerald-500 active:scale-[.98]"
              >
                <Icon
                  name="whatsapp"
                  size={15}
                />

                WhatsApp
              </a>

            </div>

          </div>

        </div>

        {/* =====================================================
            SEO SUPPORTING CONTENT
        ===================================================== */}

        <div className="mt-10 rounded-[26px] border border-slate-200 bg-[#F8FAFC] p-6 text-center sm:p-8">

          <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
            Trusted Cab Service in Chhattisgarh
          </span>

          <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Travel With Confidence With Khatu Rides
          </h3>

          <p className="mx-auto mt-3 max-w-4xl text-[11px] leading-6 text-slate-500 sm:text-sm sm:leading-7">
            Whether you need a local cab in Raipur, an airport taxi from
            Raipur Airport, an outstation cab to Bilaspur or Korba, or a
            comfortable vehicle for a spiritual journey, Khatu Rides Travels
            is focused on providing a convenient travel experience with
            professional drivers and customer support.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">

            {[
              "Raipur Cab Service",
              "Raipur Airport Taxi",
              "Bilaspur Cab",
              "Korba Cab Service",
              "Durg Taxi",
              "Bhilai Cab",
              "Outstation Cab",
              "One Way Taxi",
            ].map((keyword) => (

              <span
                key={keyword}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[8px] font-bold text-slate-500 shadow-sm"
              >
                {keyword}
              </span>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}
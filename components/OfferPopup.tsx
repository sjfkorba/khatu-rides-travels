
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CarFront,
  Zap,
  BadgeCheck,
  Tag,
} from "lucide-react";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Offer = {
  fromCity: string;
  toCity: string;
  tripType: string;
  vehicleType: string;
  strikeFare?: number | string;
  offerFare: number | string;
  offerAvailable?: boolean;
};

const palettes = [
  { start: "#ff1687", end: "#ff633d", accent: "#ffe66d" },
  { start: "#753cff", end: "#ed168c", accent: "#59f2ff" },
  { start: "#ff5a24", end: "#ff0878", accent: "#ffe66d" },
  { start: "#00b9e9", end: "#6446ff", accent: "#ffdb70" },
  { start: "#16a34a", end: "#00b9e9", accent: "#fef08a" },
];

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, "-");

const formatFare = (value: number | string) => {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? amount.toLocaleString("en-IN")
    : String(value);
};

export default function OfferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const flipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFlippingRef = useRef(false);
  const indexRef = useRef(0);

  // Fetch all active offers from Firebase
  useEffect(() => {
    let cancelled = false;

    async function fetchOffers() {
      try {
        const offersRef = collection(db, "special_offers");

        const offersQuery = query(
          offersRef,
          where("offerAvailable", "==", true)
        );

        const snapshot = await getDocs(offersQuery);

        if (cancelled) return;

        const validOffers = snapshot.docs
          .map((document) => document.data() as Offer)
          .filter(
            (offer) =>
              typeof offer.fromCity === "string" &&
              offer.fromCity.trim().length > 0 &&
              typeof offer.toCity === "string" &&
              offer.toCity.trim().length > 0 &&
              offer.offerFare !== undefined &&
              offer.offerFare !== null &&
              offer.offerFare !== ""
          );

        setOffers(validOffers);

        if (validOffers.length > 0) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error fetching special offers:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  // Clear pending animation timers
  useEffect(() => {
    return () => {
      if (flipTimeout.current) {
        clearTimeout(flipTimeout.current);
      }
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // 3D paper flip navigation
  const changeOffer = (step: number) => {
    if (offers.length <= 1 || isFlippingRef.current) return;

    isFlippingRef.current = true;
    setIsFlipping(true);

    const nextDirection: 1 | -1 = step >= 0 ? 1 : -1;
    setDirection(nextDirection);

    if (flipTimeout.current) {
      clearTimeout(flipTimeout.current);
    }

    flipTimeout.current = setTimeout(() => {
      const nextIndex =
        (indexRef.current + step + offers.length) % offers.length;

      indexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      setIsFlipping(false);
      isFlippingRef.current = false;
    }, 360);
  };

  // Auto flip every 4 seconds
  useEffect(() => {
    if (!isOpen || offers.length <= 1) return;

    const interval = window.setInterval(() => {
      changeOffer(1);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isOpen, offers.length]);

  if (isLoading || !isOpen || offers.length === 0) {
    return null;
  }

  const offer = offers[currentIndex];
  const palette = palettes[currentIndex % palettes.length];

  const tripType = String(offer.tripType || "oneway").toLowerCase();
  const bookingPath =
    tripType === "oneway" ? "outstation-cabs" : "cab-service";

  const bookUrl =
    `/${bookingPath}/${slugify(offer.fromCity)}-to-${slugify(
      offer.toCity
    )}`;

  return (
    <div
      className="kr-offer-backdrop fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-[#020817]/80 p-3 backdrop-blur-md sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setIsOpen(false);
        }
      }}
    >
      {/* PERSPECTIVE STAGE */}
      <div className="kr-offer-stage relative my-auto w-full max-w-[370px] sm:max-w-[390px]">

        {/* BACK PAPER LAYER 2 */}
        <div
          aria-hidden="true"
          className="kr-paper kr-paper-back absolute inset-0 rounded-[30px]"
          style={{
            background: `linear-gradient(135deg, ${palette.end}, ${palette.accent})`,
          }}
        />

        {/* BACK PAPER LAYER 1 */}
        <div
          aria-hidden="true"
          className="kr-paper kr-paper-middle absolute inset-0 rounded-[30px]"
          style={{
            background: `linear-gradient(135deg, ${palette.start}, ${palette.end})`,
          }}
        />

        {/* MULTICOLOR GLOWING FRAME */}
        <div
          className="kr-offer-frame relative rounded-[30px] p-[2px]"
          style={{
            background: `linear-gradient(135deg, ${palette.start}, ${palette.accent}, ${palette.end}, ${palette.start})`,
            boxShadow: `0 0 25px ${palette.start}30, 0 0 55px ${palette.end}20`,
          }}
        >
          {/* MAIN CARD */}
          <div
            className={`kr-offer-card relative isolate overflow-hidden rounded-[28px] bg-[#09162f] px-5 pb-5 pt-6 text-white sm:px-7 sm:pb-6 sm:pt-7 ${
              isFlipping
                ? direction === 1
                  ? "kr-flip-out-next"
                  : "kr-flip-out-prev"
                : "kr-flip-in"
            }`}
            aria-live="polite"
          >
            {/* BACKGROUND GLOW */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 -z-10 h-56 w-56 rounded-full blur-[70px]"
              style={{ backgroundColor: `${palette.start}55` }}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-20 -z-10 h-56 w-56 rounded-full blur-[75px]"
              style={{ backgroundColor: `${palette.end}45` }}
            />

            {/* GRID TEXTURE */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize: "23px 23px",
              }}
            />

            {/* TOP HIGHLIGHT */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-[3px] w-2/3 -translate-x-1/2 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)`,
              }}
            />

            {/* CLOSE */}
            <button
              type="button"
              aria-label="Close offers"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white/75 transition-all duration-300 hover:rotate-90 hover:bg-white/15 hover:text-white sm:right-4 sm:top-4"
            >
              <X size={18} />
            </button>

            {/* OFFER BADGE */}
            <div className="relative z-10 mb-6 flex justify-center sm:mb-7">
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2"
                style={{
                  borderColor: `${palette.accent}65`,
                  background: `linear-gradient(100deg, ${palette.start}22, ${palette.end}20)`,
                  boxShadow: `0 0 20px ${palette.start}18`,
                }}
              >
                <Sparkles
                  size={15}
                  style={{ color: palette.accent }}
                />

                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white sm:text-[11px]">
                  Today&apos;s Mega Offer
                </span>

                <span
                  className="h-1.5 w-1.5 animate-pulse rounded-full"
                  style={{ backgroundColor: palette.accent }}
                />
              </div>
            </div>

            {/* ROUTE */}
            <div className="relative z-10 mb-4 text-center">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Your next journey
              </p>

              <h2 className="text-[26px] font-black leading-tight tracking-tight text-white [overflow-wrap:anywhere] sm:text-[29px]">
                {offer.fromCity}
                <span
                  className="mx-1.5"
                  style={{ color: palette.accent }}
                >
                  to
                </span>
                {offer.toCity}
              </h2>
            </div>

            {/* VEHICLE CHIP */}
            <div className="relative z-10 mb-5 flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3.5 py-2">
                <CarFront
                  size={17}
                  style={{ color: palette.accent }}
                />

                <span className="text-[12px] font-bold text-slate-100 sm:text-[13px]">
                  {offer.vehicleType || "Sedan"} AC Cab
                </span>

                <span
                  className="h-1 w-1 rounded-full"
                  style={{ backgroundColor: palette.end }}
                />

                <span className="text-[11px] font-medium capitalize text-slate-400">
                  {tripType}
                </span>
              </div>
            </div>

            {/* FARE PANEL */}
            <div className="relative z-10 mb-5 w-full rounded-[22px] border border-white/[0.12] bg-gradient-to-br from-white/[0.09] to-white/[0.025] px-3 py-4 sm:mb-6 sm:py-5">
              <div className="mb-2 flex items-center justify-center gap-1.5">
                <Tag
                  size={12}
                  style={{ color: palette.accent }}
                />

                <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-300 sm:text-[10px]">
                  Your Exclusive Fare
                </p>
              </div>

              {offer.strikeFare !== undefined &&
                offer.strikeFare !== null &&
                offer.strikeFare !== "" && (
                  <div className="mb-1.5 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-[13px] font-semibold text-slate-400 line-through decoration-orange-400">
                      ₹{formatFare(offer.strikeFare)}
                    </span>

                    <span
                      className="rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-wide"
                      style={{
                        backgroundColor: `${palette.end}25`,
                        color: palette.accent,
                      }}
                    >
                      Special Price
                    </span>
                  </div>
                )}

              <div className="flex items-baseline justify-center gap-1">
                <span
                  className="text-[26px] font-bold sm:text-[30px]"
                  style={{ color: palette.accent }}
                >
                  ₹
                </span>

                <span className="text-[clamp(43px,12vw,60px)] font-black leading-none tracking-[-0.065em] text-white [text-shadow:0_0_25px_rgba(255,255,255,0.12)]">
                  {formatFare(offer.offerFare)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1.5">
                <Zap
                  size={13}
                  style={{ color: palette.end }}
                />

                <span className="text-[10px] font-medium text-slate-300 sm:text-[11px]">
                  Premium ride. Smarter fare.
                </span>
              </div>
            </div>

            {/* BOOK NOW */}
            <Link
              href={bookUrl}
              onClick={() => setIsOpen(false)}
              className="group relative z-10 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-white/30 px-4 py-4 text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                background: `linear-gradient(105deg, ${palette.start}, ${palette.end})`,
                boxShadow: `0 7px 26px ${palette.start}45`,
              }}
            >
              <span className="kr-button-shimmer pointer-events-none absolute inset-y-0 left-[-80%] w-1/2 skew-x-[-22deg] bg-gradient-to-r from-transparent via-white/45 to-transparent" />

              <span className="relative z-10 text-[16px] font-black tracking-wide sm:text-[17px]">
                Book Your Ride
              </span>

              <ArrowRight
                size={21}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* DOT NAVIGATION */}
            {offers.length > 1 && (
              <div className="relative z-10 mt-5 flex flex-col items-center gap-2.5">
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    aria-label="Previous offer"
                    onClick={() => changeOffer(-1)}
                    disabled={isFlipping}
                    className="mr-1 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                  >
                    <ArrowLeft size={14} />
                  </button>

                  {offers.map((_, index) => {
                    const selected = index === currentIndex;
                    const dotPalette =
                      palettes[index % palettes.length];

                    return (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Show offer ${index + 1}`}
                        aria-current={selected ? "true" : undefined}
                        onClick={() =>
                          changeOffer(
                            (index - currentIndex + offers.length) %
                              offers.length
                          )
                        }
                        disabled={isFlipping}
                        className="flex h-6 items-center justify-center px-0.5 disabled:cursor-wait"
                      >
                        <span
                          className={`block h-2 rounded-full transition-all duration-300 ${
                            selected ? "w-7" : "w-2"
                          }`}
                          style={{
                            backgroundColor: selected
                              ? dotPalette.accent
                              : "#53617a",
                            boxShadow: selected
                              ? `0 0 12px ${dotPalette.accent}80`
                              : "none",
                          }}
                        />
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    aria-label="Next offer"
                    onClick={() => changeOffer(1)}
                    disabled={isFlipping}
                    className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Offer {currentIndex + 1} of {offers.length}
                </p>
              </div>
            )}

            {/* TRUST FOOTER */}
            <div className="relative z-10 mt-4 flex items-center justify-center gap-1.5">
              <BadgeCheck size={13} className="text-emerald-400" />

              <span className="text-[10px] font-medium text-slate-400">
                Khatu Rides Travels Co.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D PAPER FLIP ANIMATIONS */}
      <style jsx>{`
        .kr-offer-stage {
          perspective: 1200px;
          perspective-origin: 50% 50%;
        }

        .kr-offer-frame {
          transform-style: preserve-3d;
          transform-origin: center center;
          backface-visibility: hidden;
          animation: kr-frame-enter 500ms ease-out both;
        }

        .kr-offer-card {
          transform-origin: center center;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        .kr-paper {
          transform-origin: center center;
          pointer-events: none;
        }

        .kr-paper-back {
          transform: rotate(4deg) translateY(7px) translateZ(-8px);
          opacity: 0.8;
        }

        .kr-paper-middle {
          transform: rotate(-2.5deg) translateY(4px) translateZ(-4px);
          opacity: 0.9;
        }

        .kr-flip-out-next {
          animation: kr-flip-out-next 360ms ease-in both;
        }

        .kr-flip-out-prev {
          animation: kr-flip-out-prev 360ms ease-in both;
        }

        .kr-flip-in {
          animation: kr-flip-in 500ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        .kr-button-shimmer {
          animation: kr-shimmer 4s ease-in-out infinite;
        }

        @keyframes kr-frame-enter {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes kr-flip-out-next {
          0% {
            opacity: 1;
            transform: perspective(1000px) rotateY(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: perspective(1000px) rotateY(-72deg) scale(0.94);
          }
        }

        @keyframes kr-flip-out-prev {
          0% {
            opacity: 1;
            transform: perspective(1000px) rotateY(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: perspective(1000px) rotateY(72deg) scale(0.94);
          }
        }

        @keyframes kr-flip-in {
          0% {
            opacity: 0;
            transform: perspective(1000px) rotateY(65deg) scale(0.94);
          }
          65% {
            opacity: 1;
            transform: perspective(1000px) rotateY(-6deg) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: perspective(1000px) rotateY(0deg) scale(1);
          }
        }

        @keyframes kr-shimmer {
          0%, 70% {
            left: -80%;
          }
          95%, 100% {
            left: 140%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .kr-offer-frame,
          .kr-flip-out-next,
          .kr-flip-out-prev,
          .kr-flip-in,
          .kr-button-shimmer {
            animation: none !important;
          }

          .kr-offer-card {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}

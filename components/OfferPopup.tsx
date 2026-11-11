"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CarFront,
  BadgeCheck,
  Tag,
  BellRing,
  CalendarDays,
  Info,
  Megaphone,
} from "lucide-react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Offer = {
  fromCity: string;
  toCity: string;
  tripType?: string;
  vehicleType?: string;
  strikeFare?: number | string;
  offerFare: number | string;
  offerAvailable?: boolean;
  priority?: number;
};

type ImportantNotice = {
  popupType: "notice";
  isActive: boolean;
  noticeTitle?: string;
  noticeMessage?: string;
  buttonLink?: string;
  buttonText?: string;
  priority?: number;
};

type PopupScreen = "notice" | "offer";

const palettes = [
  { start: "#f43f8e", end: "#fb923c", accent: "#facc15" },
  { start: "#7c3aed", end: "#db2777", accent: "#22d3ee" },
  { start: "#0891b2", end: "#4f46e5", accent: "#fbbf24" },
  { start: "#16a34a", end: "#0d9488", accent: "#fde047" },
  { start: "#ea580c", end: "#e11d48", accent: "#a3e635" },
];

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, "-");

const formatFare = (value: number | string) => {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? amount.toLocaleString("en-IN")
    : String(value);
};

const sortByPriority = <T extends { priority?: number }>(items: T[]) =>
  [...items].sort(
    (a, b) => Number(b.priority || 0) - Number(a.priority || 0)
  );

export default function OfferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [notice, setNotice] = useState<ImportantNotice | null>(null);
  const [screen, setScreen] = useState<PopupScreen>("notice");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const flipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFlippingRef = useRef(false);
  const indexRef = useRef(0);

  // Load the Important Notice first, then load active offers.
  useEffect(() => {
    let cancelled = false;

    async function fetchPopupContent() {
      try {
        const offersRef = collection(db, "special_offers");

        // Read the collection once to avoid requiring a new composite index.
        const snapshot = await getDocs(offersRef);

        if (cancelled) return;

        const documents = snapshot.docs.map((document) => document.data());

        const activeNotices = sortByPriority(
          documents
            .filter(
              (data) =>
                data.popupType === "notice" &&
                data.isActive === true
            )
            .map((data) => data as ImportantNotice)
            .filter(
              (item) =>
                item.isActive === true &&
                item.popupType === "notice" &&
                !!item.noticeTitle?.trim() &&
                !!item.noticeMessage?.trim()
            )
        );

        const validOffers = sortByPriority(
          documents
            .filter((data) => data.offerAvailable === true && data.popupType !== "notice")
            .map((data) => data as Offer)
            .filter(
              (offer) =>
                typeof offer.fromCity === "string" &&
                offer.fromCity.trim().length > 0 &&
                typeof offer.toCity === "string" &&
                offer.toCity.trim().length > 0 &&
                offer.offerFare !== undefined &&
                offer.offerFare !== null &&
                offer.offerFare !== ""
            )
        );

        const firstNotice = activeNotices[0] || null;

        setNotice(firstNotice);
        setOffers(validOffers);

        if (firstNotice) {
          setScreen("notice");
          setIsOpen(true);
        } else if (validOffers.length > 0) {
          setScreen("offer");
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error fetching popup content:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPopupContent();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (flipTimeout.current) clearTimeout(flipTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const openOffers = () => {
    if (offers.length > 0) {
      setScreen("offer");
      setCurrentIndex(0);
      indexRef.current = 0;
    } else {
      setIsOpen(false);
    }
  };

  const changeOffer = (step: number) => {
    if (offers.length <= 1 || isFlippingRef.current) return;

    isFlippingRef.current = true;
    setIsFlipping(true);

    if (flipTimeout.current) clearTimeout(flipTimeout.current);

    flipTimeout.current = setTimeout(() => {
      const nextIndex =
        (indexRef.current + step + offers.length) % offers.length;

      indexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      setIsFlipping(false);
      isFlippingRef.current = false;
    }, 260);
  };

  // Auto rotate offers only after the notice has been shown.
  useEffect(() => {
    if (!isOpen || screen !== "offer" || offers.length <= 1) return;

    const interval = window.setInterval(() => changeOffer(1), 4500);
    return () => window.clearInterval(interval);
  }, [isOpen, screen, offers.length]);

  if (isLoading || !isOpen || (screen === "offer" && offers.length === 0)) {
    return null;
  }

  const offer = offers[currentIndex];
  const palette = palettes[currentIndex % palettes.length];
  const tripType = String(offer?.tripType || "oneway").toLowerCase();
  const bookingPath =
    tripType === "oneway" ? "outstation-cabs" : "cab-service";
  const bookUrl = offer
    ? `/${bookingPath}/${slugify(offer.fromCity)}-to-${slugify(offer.toCity)}`
    : "#booking-form";

  const noticeButtonLink = notice?.buttonLink?.trim() || "#booking-form";
  const noticeButtonIsExternal =
    noticeButtonLink.startsWith("http://") ||
    noticeButtonLink.startsWith("https://");

  return (
    <div
      className="kr-popup-backdrop fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <div
        className="kr-popup-shell relative my-auto w-full max-w-[340px] sm:max-w-[360px]"
        role="dialog"
        aria-modal="true"
        aria-label={screen === "notice" ? "Important notice" : "Special offer"}
      >
        {/* Multicolour outer border */}
        <div className="rounded-[25px] bg-[linear-gradient(125deg,#ec4899,#f97316,#eab308,#06b6d4,#8b5cf6)] p-[2px] shadow-[0_18px_60px_rgba(15,23,42,0.28)]">
          <div className="relative overflow-hidden rounded-[23px] bg-white">
            {/* Compact colour accents */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full opacity-20 blur-2xl"
              style={{
                background:
                  screen === "notice"
                    ? "linear-gradient(135deg,#f97316,#ec4899)"
                    : `linear-gradient(135deg,${palette.start},${palette.end})`,
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-12 h-32 w-32 rounded-full bg-cyan-300/30 blur-2xl"
            />

            {/* Header */}
            <div
              className="relative flex items-center justify-between px-4 pb-3 pt-3.5"
              style={{
                background:
                  screen === "notice"
                    ? "linear-gradient(110deg,#fff1f2 0%,#fff7ed 52%,#fefce8 100%)"
                    : `linear-gradient(110deg,${palette.start}12,${palette.end}12)`,
              }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                  style={{
                    background:
                      screen === "notice"
                        ? "linear-gradient(135deg,#f97316,#e11d48)"
                        : `linear-gradient(135deg,${palette.start},${palette.end})`,
                  }}
                >
                  {screen === "notice" ? (
                    <BellRing size={18} />
                  ) : (
                    <Sparkles size={18} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-600">
                    Khatu Rides Travels Co.
                  </p>
                  <h2 className="truncate text-[17px] font-extrabold leading-tight text-slate-900">
                    {screen === "notice" ? "Important Notice" : "Special Offers"}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close popup"
                onClick={() => setIsOpen(false)}
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:rotate-90 hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={17} />
              </button>
            </div>

            {/* Content */}
            {screen === "notice" && notice ? (
              <div className="relative px-4 pb-4 pt-3.5">
                {/* High-contrast customer information label */}
                <div className="mb-3 flex items-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 p-[1.5px] shadow-[0_4px_12px_rgba(236,72,153,0.18)]">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-sm">
                        <Info size={12} strokeWidth={2.8} />
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-[0.13em] text-rose-700">
                        Customer Information
                      </span>
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                    </span>
                  </div>
                </div>

                {/* Notice title and message are presented as a distinct highlight card */}
                <div className="overflow-hidden rounded-2xl border border-orange-200/90 bg-[linear-gradient(135deg,#fff7ed_0%,#fff1f2_52%,#f5f3ff_100%)] p-3 shadow-[0_5px_18px_rgba(244,63,94,0.08)]">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 text-white shadow-[0_5px_12px_rgba(225,29,72,0.22)]">
                      <Megaphone size={19} strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-[0.16em] text-rose-600">
                        Important Update
                      </span>
                      <h3 className="break-words text-[20px] font-black leading-[1.15] tracking-[-0.02em] text-slate-950">
                        {notice.noticeTitle || "Important Notice"}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-white/90 border-l-[3px] border-l-rose-400 bg-white/90 px-3 py-2.5 shadow-sm">
                    <p className="whitespace-pre-line text-[15px] font-medium leading-[1.55] text-slate-700">
                      {notice.noticeMessage}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {offers.length > 0 ? (
                    <button
                      type="button"
                      onClick={openOffers}
                      className="group flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(100deg,#f97316,#ec4899,#8b5cf6)] px-4 py-2.5 text-[14px] font-extrabold text-white shadow-[0_7px_18px_rgba(236,72,153,0.22)] transition hover:-translate-y-0.5 active:translate-y-0"
                    >
                      View Offers
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  ) : noticeButtonIsExternal ? (
                    <a
                      href={noticeButtonLink}
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(100deg,#f97316,#ec4899)] px-4 py-2.5 text-[14px] font-extrabold text-white shadow-md"
                    >
                      {notice.buttonText || "Book Now"}
                      <ArrowRight size={16} />
                    </a>
                  ) : (
                    <Link
                      href={noticeButtonLink}
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(100deg,#f97316,#ec4899)] px-4 py-2.5 text-[14px] font-extrabold text-white shadow-md"
                    >
                      {notice.buttonText || "Book Now"}
                      <ArrowRight size={16} />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>

                {offers.length > 0 && (
                  <p className="mt-2 text-center text-[11px] font-semibold text-slate-500">
                    {offers.length} active {offers.length === 1 ? "offer" : "offers"} available after this notice
                  </p>
                )}
              </div>
            ) : offer ? (
              <div
                className={`relative px-4 pb-4 pt-3.5 ${
                  isFlipping ? "kr-offer-changing" : ""
                }`}
                aria-live="polite"
              >
                <div className="mb-2 flex items-center justify-center gap-1.5">
                  <Sparkles size={13} style={{ color: palette.start }} />
                  <span
                    className="text-[11px] font-black uppercase tracking-[0.14em]"
                    style={{ color: palette.start }}
                  >
                    Limited Time Offer
                  </span>
                  <Sparkles size={13} style={{ color: palette.end }} />
                </div>

                <div className="text-center">
                  <h3 className="break-words text-[25px] font-black leading-tight tracking-tight text-slate-900">
                    {offer.fromCity}
                    <span
                      className="mx-1.5"
                      style={{ color: palette.start }}
                    >
                      to
                    </span>
                    {offer.toCity}
                  </h3>

                  <div className="mt-2 inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                    <CarFront size={15} style={{ color: palette.start }} />
                    <span className="truncate text-[13px] font-bold text-slate-700">
                      {offer.vehicleType || "Sedan"} AC Cab
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-[11px] font-semibold capitalize text-slate-600">
                      {tripType}
                    </span>
                  </div>
                </div>

                <div
                  className="mt-3 rounded-2xl border px-3 py-3 text-center"
                  style={{
                    borderColor: `${palette.start}35`,
                    background: `linear-gradient(120deg,${palette.start}0D,${palette.end}12,${palette.accent}18)`,
                  }}
                >
                  <div className="mb-1 flex items-center justify-center gap-1.5">
                    <Tag size={12} style={{ color: palette.start }} />
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                      Exclusive Fare
                    </span>
                  </div>

                  <div className="flex items-baseline justify-center gap-2">
                    {offer.strikeFare !== undefined &&
                      offer.strikeFare !== null &&
                      offer.strikeFare !== "" && (
                        <span className="text-[12px] font-semibold text-slate-400 line-through">
                          ₹{formatFare(offer.strikeFare)}
                        </span>
                      )}
                    <span
                      className="text-[36px] font-black leading-none tracking-tight"
                      style={{ color: palette.start }}
                    >
                      ₹{formatFare(offer.offerFare)}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-slate-600">
                    Special fare for your journey
                  </p>
                </div>

                <Link
                  href={bookUrl}
                  onClick={() => setIsOpen(false)}
                  className="group mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-extrabold text-white shadow-md transition hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    background: `linear-gradient(100deg,${palette.start},${palette.end})`,
                    boxShadow: `0 7px 18px ${palette.start}35`,
                  }}
                >
                  Book Your Ride
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                {offers.length > 1 && (
                  <div className="mt-2.5 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous offer"
                      onClick={() => changeOffer(-1)}
                      disabled={isFlipping}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ArrowLeft size={14} />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {offers.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          aria-label={`Show offer ${index + 1}`}
                          aria-current={index === currentIndex ? "true" : undefined}
                          onClick={() => {
                            if (isFlippingRef.current) return;
                            const step =
                              (index - currentIndex + offers.length) %
                              offers.length;
                            changeOffer(step);
                          }}
                          disabled={isFlipping}
                          className="flex h-6 items-center px-0.5 disabled:cursor-wait"
                        >
                          <span
                            className={`block h-1.5 rounded-full transition-all ${
                              index === currentIndex ? "w-5" : "w-1.5"
                            }`}
                            style={{
                              backgroundColor:
                                index === currentIndex
                                  ? palettes[index % palettes.length].start
                                  : "#cbd5e1",
                            }}
                          />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      aria-label="Next offer"
                      onClick={() => changeOffer(1)}
                      disabled={isFlipping}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ArrowRight size={14} />
                    </button>
                    <span className="ml-1 text-[11px] font-bold text-slate-500">
                      {currentIndex + 1}/{offers.length}
                    </span>
                  </div>
                )}
              </div>
            ) : null}

            {/* Small trust footer */}
            <div className="relative flex items-center justify-center gap-1.5 border-t border-slate-100 px-3 py-2.5">
              <BadgeCheck size={12} className="text-emerald-500" />
              <span className="text-[10px] font-semibold text-slate-500">
                Trusted rides • Reliable service
              </span>
              <CalendarDays size={11} className="ml-1 text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .kr-popup-shell {
          animation: kr-popup-enter 280ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        .kr-offer-changing {
          animation: kr-offer-change 260ms ease both;
        }

        @keyframes kr-popup-enter {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes kr-offer-change {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          50% {
            opacity: 0.45;
            transform: translateX(-8px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .kr-popup-shell,
          .kr-offer-changing {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

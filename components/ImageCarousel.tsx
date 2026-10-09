// components/ImageCarousel.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Phone,
} from "lucide-react";

import { PHONE } from "@/components/landing/data";

const BANNERS = [
  {
    id: 1,
    src: "/hero/01.png",
    alt: "One Way Taxi Service - Khatu Rides Travels",
    coupon: "ONEWAY",
  },
  {
    id: 2,
    src: "/hero/02.png",
    alt: "Book One Way Taxi - Khatu Rides Travels",
    coupon: "ONEWAY",
  },
  // ... (Keep your remaining banners here)
];

// Framer Motion Variants for Premium Slide & Scale Animation
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.05,
  }),
};

export default function ImageCarousel() {
  // We use a tuple to track both current index and the direction we are moving
  const [[current, direction], setPage] = useState([0, 0]);
  const [copied, setCopied] = useState(false);

  const activeBanner = BANNERS[current] ?? BANNERS[0];

  const paginate = (newDirection: number) => {
    let nextIndex = current + newDirection;
    if (nextIndex < 0) nextIndex = BANNERS.length - 1;
    if (nextIndex >= BANNERS.length) nextIndex = 0;
    setPage([nextIndex, newDirection]);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      paginate(1);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [current]); // Added current to dependency array for accurate timing

  useEffect(() => {
    setCopied(false);
  }, [current]);

  const copyCoupon = async () => {
    if (!activeBanner.coupon) return;
    try {
      await navigator.clipboard.writeText(activeBanner.coupon);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      aria-label="Khatu Rides promotional banners"
      className="relative w-full overflow-hidden bg-slate-50 py-2 sm:py-4 px-2 sm:px-4 max-w-[1400px] mx-auto"
    >
      <div
        className="
          relative
          h-[220px]
          w-full
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-[0_8px_30px_rgb(0,0,0,0.06)]
          border border-slate-100
          sm:h-[300px]
          md:h-[380px]
          lg:h-[480px]
          xl:h-[540px]
          xl:rounded-[32px]
        "
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 }
            }}
            className="absolute inset-0 z-10 h-full w-full"
          >
            <Image
              src={activeBanner.src}
              alt={activeBanner.alt}
              fill
              priority={current === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1400px"
              className="select-none object-cover"
              draggable={false}
            />
            {/* Very subtle light gradient overlay to ensure text/buttons are visible but keep the light theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* =========================================================
            PREVIOUS BUTTON (Frosted Light Glass)
        ========================================================== */}
        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label="Previous promotional banner"
          className="
            absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center 
            rounded-full border border-white/60 bg-white/70 text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] 
            backdrop-blur-md transition-all hover:bg-white hover:scale-110 active:scale-95
            sm:left-6 sm:h-12 sm:w-12
          "
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
        </button>

        {/* =========================================================
            NEXT BUTTON (Frosted Light Glass)
        ========================================================== */}
        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Next promotional banner"
          className="
            absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center 
            rounded-full border border-white/60 bg-white/70 text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] 
            backdrop-blur-md transition-all hover:bg-white hover:scale-110 active:scale-95
            sm:right-6 sm:h-12 sm:w-12
          "
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
        </button>

        {/* =========================================================
            CALL NOW (Premium White floating Card)
        ========================================================== */}
        <a
          href={`tel:${PHONE}`}
          onClick={(e) => {
            e.preventDefault();
            const telUrl = `tel:${PHONE}`;
            if (typeof window !== "undefined" && typeof (window as any).gtag_report_conversion === "function") {
              (window as any).gtag_report_conversion(telUrl);
            } else {
              window.location.href = telUrl;
            }
          }}
          className="
            absolute bottom-4 left-4 z-30 flex items-center gap-3 rounded-2xl 
            border border-white/80 bg-white/90 px-4 py-2.5 text-slate-900 
            shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all 
            hover:bg-white hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] 
            active:scale-95 sm:bottom-6 sm:left-6 sm:px-5 sm:py-3
          "
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600 sm:h-10 sm:w-10">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Instant Booking
            </span>
            <span className="mt-1 text-sm font-black sm:text-base">
              Call Dispatch
            </span>
          </span>
        </a>

        {/* =========================================================
            SLIDE DOTS (Pill Shaped Glass Container)
        ========================================================== */}
        <div
          className="
            absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 
            rounded-full border border-white/40 bg-white/60 px-3 py-2 
            shadow-sm backdrop-blur-md sm:bottom-6 sm:px-4 sm:py-2.5
          "
        >
          {BANNERS.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => {
                const direction = index > current ? 1 : -1;
                setPage([index, direction]);
              }}
              aria-label={`Go to promotional banner ${index + 1}`}
              className={`
                rounded-full transition-all duration-500 ease-out
                ${
                  current === index
                    ? "h-2 w-6 bg-amber-500 sm:w-8 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    : "h-2 w-2 bg-slate-400/50 hover:bg-slate-600"
                }
              `}
            />
          ))}
        </div>

        {/* =========================================================
            COUPON CODE (Light Glass Badge)
        ========================================================== */}
        {activeBanner.coupon && (
          <button
            type="button"
            onClick={copyCoupon}
            aria-label={`Copy coupon ${activeBanner.coupon}`}
            className="
              absolute right-4 top-4 z-30 flex items-center gap-2 rounded-xl 
              border border-white/70 bg-white/80 px-3 py-2 text-slate-800 
              shadow-lg backdrop-blur-xl transition-all hover:bg-white active:scale-95
              sm:right-6 sm:top-6 sm:px-4 sm:py-2.5
            "
          >
            <span className="text-xs font-black tracking-widest text-amber-600">
              {activeBanner.coupon}
            </span>

            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
            ) : (
              <Copy className="h-4 w-4 text-slate-400" strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
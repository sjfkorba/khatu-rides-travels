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
  {
    id: 3,
    src: "/hero/03.png",
    alt: "Airport Cab Service - Khatu Rides Travels",
    coupon: "AIRPORT",
  },
  {
    id: 4,
    src: "/hero/04.png",
    alt: "Outstation Taxi Service - Khatu Rides Travels",
    coupon: "OUTSTATION",
  },
  {
    id: 5,
    src: "/hero/05.png",
    alt: "Divine Tour Cab Service - Khatu Rides Travels",
    coupon: "DIVINE",
  },
  {
    id: 6,
    src: "/hero/06.png",
    alt: "Corporate Cab Service - Khatu Rides Travels",
    coupon: "CORPORATE",
  },
  {
    id: 7,
    src: "/hero/07.png",
    alt: "Tour and Travel Cab Service - Khatu Rides Travels",
    coupon: "TRAVEL",
  },
  {
    id: 8,
    src: "/hero/08.png",
    alt: "Cab Partner Service - Khatu Rides Travels",
    coupon: "PARTNER",
  },
  {
    id: 9,
    src: "/hero/09.png",
    alt: "Cab Booking Service - Khatu Rides Travels",
    coupon: "BOOKCAB",
  },
  {
    id: 10,
    src: "/hero/10.png",
    alt: "Best Cab Service - Khatu Rides Travels",
    coupon: "KHATURIDES",
  },
  {
    id: 11,
    src: "/hero/donation.png",
    alt: "Khatu Rides Social Initiative",
    coupon: "",
  },
];

export default function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeBanner = BANNERS[current] ?? BANNERS[0];

  /* ==========================================================
     AUTO SLIDE

     7 seconds per banner
  ========================================================== */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 7000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /* ==========================================================
     RESET COPY STATE
  ========================================================== */

  useEffect(() => {
    setCopied(false);
  }, [current]);

  /* ==========================================================
     PREVIOUS
  ========================================================== */

  const previousSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? BANNERS.length - 1 : prev - 1
    );
  };

  /* ==========================================================
     NEXT
  ========================================================== */

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  };

  /* ==========================================================
     COPY COUPON
  ========================================================== */

  const copyCoupon = async () => {
    if (!activeBanner.coupon) return;

    try {
      await navigator.clipboard.writeText(
        activeBanner.coupon
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      aria-label="Khatu Rides promotional banners"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#f8fafc]
      "
    >
      {/* =====================================================
          MAIN CAROUSEL
      ====================================================== */}

      <div
        className="
          relative
          w-full
          overflow-hidden
          bg-white
          shadow-[0_6px_24px_rgba(15,23,42,0.10)]
        "
      >
        {/* ===================================================
            IMAGE
        ==================================================== */}

        <AnimatePresence
          mode="wait"
          initial={false}
        >
          <motion.div
            key={activeBanner.id}
            initial={{
              x: "100%",
              opacity: 0,
            }}
            animate={{
              x: "0%",
              opacity: 1,
            }}
            exit={{
              x: "-100%",
              opacity: 1,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              w-full
            "
          >
            <Image
              src={activeBanner.src}
              alt={activeBanner.alt}
              width={2560}
              height={320}
              priority={current === 0}
              sizes="100vw"
              className="
                block
                h-auto
                w-full
                select-none
              "
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* ===================================================
            LEFT ARROW
        ==================================================== */}

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous banner"
          className="
            absolute
            left-2
            top-1/2
            z-40
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/60
            bg-slate-950/55
            text-white
            shadow-lg
            backdrop-blur-md
            transition-all
            duration-200
            hover:scale-110
            hover:bg-slate-950/80
            active:scale-95
            sm:left-4
            sm:h-11
            sm:w-11
          "
        >
          <ChevronLeft
            size={22}
            strokeWidth={2.5}
          />
        </button>

        {/* ===================================================
            RIGHT ARROW
        ==================================================== */}

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next banner"
          className="
            absolute
            right-2
            top-1/2
            z-40
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/60
            bg-slate-950/55
            text-white
            shadow-lg
            backdrop-blur-md
            transition-all
            duration-200
            hover:scale-110
            hover:bg-slate-950/80
            active:scale-95
            sm:right-4
            sm:h-11
            sm:w-11
          "
        >
          <ChevronRight
            size={22}
            strokeWidth={2.5}
          />
        </button>

        {/* ===================================================
            TOP RIGHT COUPON
        ==================================================== */}

        {activeBanner.coupon && (
          <div
            className="
              absolute
              right-2
              top-2
              z-40
              flex
              items-center
              gap-1.5
              rounded-lg
              border
              border-white/70
              bg-white
              p-1
              shadow-[0_5px_18px_rgba(15,23,42,0.22)]
              sm:right-5
              sm:top-4
              sm:gap-2
              sm:rounded-xl
              sm:p-1.5
            "
          >
            <span
              className="
                px-1.5
                text-[8px]
                font-black
                tracking-[0.10em]
                text-slate-800
                sm:px-2
                sm:text-[10px]
              "
            >
              {activeBanner.coupon}
            </span>

            <button
              type="button"
              onClick={copyCoupon}
              aria-label="Copy coupon code"
              className="
                flex
                h-6
                items-center
                gap-1
                rounded-md
                bg-[#F9B900]
                px-2
                text-[8px]
                font-black
                uppercase
                tracking-wide
                text-slate-950
                shadow-sm
                transition-all
                hover:bg-[#eab000]
                active:scale-95
                sm:h-7
                sm:px-2.5
                sm:text-[9px]
              "
            >
              {copied ? (
                <>
                  <Check size={11} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={11} />
                  Copy
                </>
              )}
            </button>
          </div>
        )}

        {/* ===================================================
            BOTTOM LEFT CALL NOW CARD
        ==================================================== */}

        <a
          href={`tel:${PHONE}`}
          aria-label="Call Khatu Rides now"
          className="
            absolute
            bottom-3
            left-3
            z-40
            flex
            items-center
            gap-2.5
            rounded-xl
            bg-[#0B3B91]
            px-4
            py-2.5
            text-white
            shadow-[0_8px_25px_rgba(11,59,145,0.40)]
            ring-1
            ring-white/25
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-[#082f75]
            hover:shadow-[0_10px_30px_rgba(11,59,145,0.50)]
            active:scale-95
            sm:bottom-5
            sm:left-5
            sm:gap-3
            sm:rounded-2xl
            sm:px-5
            sm:py-3
          "
        >
          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white/15
              sm:h-9
              sm:w-9
            "
          >
            <Phone
              size={17}
              strokeWidth={2.8}
            />
          </span>

          <span
            className="
              text-[11px]
              font-black
              uppercase
              tracking-[0.08em]
              sm:text-sm
            "
          >
            Call Now
          </span>
        </a>

        {/* ===================================================
            DOT NAVIGATION
        ==================================================== */}

        <div
          className="
            absolute
            bottom-2
            left-1/2
            z-40
            flex
            -translate-x-1/2
            items-center
            gap-1
            rounded-full
            bg-slate-950/40
            px-2.5
            py-1.5
            backdrop-blur-md
          "
        >
          {BANNERS.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Show banner ${index + 1}`}
              aria-current={
                current === index
                  ? "true"
                  : undefined
              }
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                ${
                  current === index
                    ? "w-6 bg-[#F9B900] shadow-[0_0_8px_rgba(249,185,0,0.65)]"
                    : "w-1.5 bg-white/80 hover:bg-white"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
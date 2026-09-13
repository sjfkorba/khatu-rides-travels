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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setCopied(false);
  }, [current]);

  const previousSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? BANNERS.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  };

  const copyCoupon = async () => {
    if (!activeBanner.coupon) return;

    try {
      await navigator.clipboard.writeText(activeBanner.coupon);
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
      className="relative w-full overflow-hidden bg-[#f8fafc]"
    >
      {/*
        ============================================================
        Yaha se image aur frame ka height manually set kar sakte ho
        ============================================================

        Mobile  : h-[220px]
        Small   : sm:h-[250px]
        Tablet  : md:h-[300px]
        Desktop : lg:h-[360px]
        Large   : xl:h-[420px]

        Sirf in values ko change karke carousel/frame ki height
        manually adjust kar sakte ho.
      */}

      <div
        className="
          relative
          h-[220px]
          w-full
          overflow-hidden
          bg-white
          shadow-[0_6px_24px_rgba(15,23,42,0.10)]
          sm:h-[250px]
          md:h-[300px]
          lg:h-[460px]
          xl:h-[520px]
        "
      >
        {/*
          Slides absolute hain.

          Is wajah se:
          - Slide change hone par height change nahi hogi
          - Homepage jump nahi karega
          - Outgoing image parent ki height ko affect nahi karegi
          - Incoming image parent ki height ko affect nahi karegi
        */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={activeBanner.id}
            initial={{
              x: "100%",
              opacity: 1,
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
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 z-10 h-full w-full"
          >
            <Image
              src={activeBanner.src}
              alt={activeBanner.alt}
              fill
              priority={current === 0}
              sizes="100vw"
              className="select-none object-cover"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* =========================================================
            PREVIOUS BUTTON
        ========================================================== */}
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous promotional banner"
          className="
            absolute
            left-3
            top-1/2
            z-30
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/50
            bg-black/45
            text-white
            shadow-xl
            backdrop-blur-sm
            transition
            hover:bg-[#063B8F]
            active:scale-95
            sm:left-5
            sm:h-12
            sm:w-12
          "
        >
          <ChevronLeft
            className="h-5 w-5 sm:h-6 sm:w-6"
            strokeWidth={2.7}
          />
        </button>

        {/* =========================================================
            NEXT BUTTON
        ========================================================== */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next promotional banner"
          className="
            absolute
            right-3
            top-1/2
            z-30
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/50
            bg-black/45
            text-white
            shadow-xl
            backdrop-blur-sm
            transition
            hover:bg-[#063B8F]
            active:scale-95
            sm:right-5
            sm:h-12
            sm:w-12
          "
        >
          <ChevronRight
            className="h-5 w-5 sm:h-6 sm:w-6"
            strokeWidth={2.7}
          />
        </button>

        {/* =========================================================
            DESKTOP COUPON
        ========================================================== */}
        

        {/* =========================================================
            CALL NOW
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
            absolute
            bottom-4
            left-4
            z-30
            flex
            items-center
            gap-2.5
            rounded-xl
            bg-[#0B3B91]
            px-4
            py-3
            text-white
            shadow-[0_8px_24px_rgba(0,0,0,0.32)]
            transition
            hover:bg-[#062d70]
            active:scale-95
            sm:bottom-5
            sm:left-6
            sm:gap-3
            sm:px-5
            sm:py-3.5
          "
        >
          <span
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#0B3B91]
              sm:h-10
              sm:w-10
            "
          >
            <Phone
              className="h-5 w-5"
              strokeWidth={2.8}
            />
          </span>

          <span className="flex flex-col leading-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/75">
              Instant Booking
            </span>

            <span className="mt-1 text-sm font-extrabold sm:text-base">
              Call Now
            </span>
          </span>
        </a>

        {/* =========================================================
            SLIDE DOTS
        ========================================================== */}
        <div
          className="
            absolute
            bottom-4
            left-1/2
            z-30
            flex
            -translate-x-1/2
            items-center
            gap-1.5
            rounded-full
            bg-black/45
            px-3
            py-2
            backdrop-blur-sm
            sm:bottom-5
            sm:gap-2
            sm:px-4
          "
        >
          {BANNERS.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Go to promotional banner ${index + 1}`}
              aria-current={
                current === index ? "true" : undefined
              }
              className={`
                rounded-full
                transition-all
                duration-300
                ${
                  current === index
                    ? "h-1.5 w-6 bg-white sm:w-8"
                    : "h-1.5 w-1.5 bg-white/55 hover:bg-white/90"
                }
              `}
            />
          ))}
        </div>

        {/* =========================================================
            MOBILE COUPON
        ========================================================== */}
        {activeBanner.coupon && (
          <button
            type="button"
            onClick={copyCoupon}
            aria-label={`Copy coupon ${activeBanner.coupon}`}
            className="
              absolute
              right-4
              top-4
              z-30
              flex
              items-center
              gap-1.5
              rounded-lg
              border
              border-white/30
              bg-black/50
              px-3
              py-2
              text-white
              shadow-lg
              backdrop-blur-md
              sm:hidden
            "
          >
            <span className="text-[10px] font-bold tracking-wide">
              {activeBanner.coupon}
            </span>

            {copied ? (
              <Check
                className="h-3.5 w-3.5"
                strokeWidth={3}
              />
            ) : (
              <Copy
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
              />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
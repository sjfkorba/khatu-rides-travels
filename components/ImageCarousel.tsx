// components/ImageCarousel.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const ROUTE_BANNERS = [
  {
    id: 1,
    src: "/hero/01.png",
    alt: "One Way Taxi Service - Khatu Rides",
  },
  {
    id: 2,
    src: "/hero/02.png",
    alt: "Airport Taxi Service - Khatu Rides",
  },
  {
    id: 3,
    src: "/hero/03.png",
    alt: "Outstation Cab Service - Khatu Rides",
  },
  {
    id: 4,
    src: "/hero/04.png",
    alt: "Prayagraj Taxi Tour - Khatu Rides",
  },
  {
    id: 5,
    src: "/hero/05.png",
    alt: "Travel and Tour Cab Service - Khatu Rides",
  },
  {
    id: 6,
    src: "/hero/donation.png",
    alt: "Khatu Rides Social Initiative",
  },
];

export default function ImageCarousel() {
  const [current, setCurrent] = useState(0);

  const activeBanner =
    ROUTE_BANNERS[current] ?? ROUTE_BANNERS[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) =>
        prev >= ROUTE_BANNERS.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      aria-label="Khatu Rides promotional banners"
      className="
        relative
        z-10
        flex
        w-full
        items-center
        justify-center
        overflow-hidden
        bg-[#f8fafc]
        px-2
        py-1.5
        sm:px-4
        sm:py-2
      "
    >
      {/* Main Carousel */}
      <div
        className="
          relative
          flex
          h-[10vh]
          min-h-[64px]
          max-h-[110px]
          w-full
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-[0_8px_30px_rgba(15,23,42,0.10)]
          sm:rounded-2xl
        "
      >
        {/* Soft background */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-r
            from-[#F9B900]/[0.04]
            via-transparent
            to-orange-500/[0.04]
          "
        />

        <AnimatePresence
          mode="wait"
          initial={false}
        >
          <motion.div
            key={activeBanner.id}
            initial={{
              x: "105%",
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: "-105%",
              opacity: 0,
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute
              inset-0
              flex
              h-full
              w-full
              items-center
              justify-center
            "
          >
            {/* ==========================================
                BLURRED BACKGROUND
            ========================================== */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                overflow-hidden
              "
            >
              <Image
                src={activeBanner.src}
                alt=""
                fill
                sizes="100vw"
                className="
                  scale-110
                  object-cover
                  opacity-[0.08]
                  blur-xl
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-white/80
                  backdrop-blur-[2px]
                "
              />
            </div>

            {/* ==========================================
                MAIN IMAGE
            ========================================== */}
            <div
              className="
                relative
                z-20
                flex
                h-full
                w-full
                items-center
                justify-center
                px-1
                sm:px-3
              "
            >
              <Image
                src={activeBanner.src}
                alt={activeBanner.alt}
                width={1920}
                height={360}
                priority={current === 0}
                sizes="100vw"
                className="
                  h-[10vh]
                  min-h-[64px]
                  max-h-[110px]
                  w-auto
                  max-w-[96vw]
                  object-contain
                  select-none
                  drop-shadow-[0_6px_18px_rgba(15,23,42,0.20)]
                "
                draggable={false}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ==========================================
            EDGE DEPTH
        ========================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-30
            w-8
            bg-gradient-to-r
            from-white/40
            to-transparent
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-30
            w-8
            bg-gradient-to-l
            from-white/40
            to-transparent
          "
        />

        {/* ==========================================
            DOTS
        ========================================== */}

        <div
          className="
            absolute
            bottom-1
            left-1/2
            z-40
            flex
            -translate-x-1/2
            items-center
            gap-1
            rounded-full
            bg-slate-900/25
            px-2
            py-1
            backdrop-blur-md
          "
        >
          {ROUTE_BANNERS.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Show banner ${index + 1}`}
              aria-current={
                current === index ? "true" : undefined
              }
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                ${
                  current === index
                    ? "w-5 bg-[#F9B900] shadow-[0_0_8px_rgba(249,185,0,0.60)]"
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
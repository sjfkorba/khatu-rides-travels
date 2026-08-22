"use client";

import { useEffect, useState } from "react";

export default function PremiumSplashScreen() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    /*
     * ==========================================================
     * SPLASH DURATION
     * ==========================================================
     *
     * Previous: 4500ms
     * New:      6500ms
     */
    const duration = 6500;
    const startTime = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;

      const value = Math.min(
        Math.round((elapsed / duration) * 100),
        100
      );

      setProgress(value);

      if (value >= 100) {
        window.clearInterval(interval);

        /*
         * Small final cinematic pause
         */
        window.setTimeout(() => {
          setShow(false);
        }, 750);
      }
    }, 50);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  if (!show) {
    return null;
  }

  /*
   * ==========================================================
   * MASTER PROGRESS
   * ==========================================================
   */

  const ratio = progress / 100;


  /*
   * ==========================================================
   * CAR POSITION
   * ==========================================================
   */

  const carY = 62 - ratio * 42;

  const carX = -7 + ratio * 15;


  /*
   * ==========================================================
   * CAR SCALE
   * ==========================================================
   */

  const carScale = 1.05 - ratio * 0.73;


  /*
   * ==========================================================
   * CAR ROAD ROTATION
   * ==========================================================
   */

  let roadRotation = 0;

  if (progress >= 25 && progress < 55) {
    roadRotation = -1.2;
  }

  if (progress >= 55 && progress < 78) {
    roadRotation = -2.5;
  }

  if (progress >= 78) {
    roadRotation = -4;
  }


  /*
   * ==========================================================
   * CAR SUSPENSION
   * ==========================================================
   */

  const suspension =
    progress < 90
      ? Math.sin(progress * 0.45) *
        (1.8 - ratio)
      : 0;


  /*
   * ==========================================================
   * CAR HORIZON FADE
   * ==========================================================
   */

  const carOpacity =
    progress >= 90
      ? Math.max(
          0,
          1 - (progress - 90) / 10
        )
      : 1;


  /*
   * ==========================================================
   * CAR TRANSFORM
   * ==========================================================
   */

  const carTransform =
    "translate3d(calc(-50% + " +
    carX +
    "px), " +
    (carY + suspension) +
    "vh, 0) rotate(" +
    roadRotation +
    "deg) scale(" +
    carScale +
    ")";


  /*
   * ==========================================================
   * SHADOW
   * ==========================================================
   */

  const shadowScale =
    Math.max(
      0.25,
      1 - ratio * 0.75
    );

  const shadowOpacity =
    Math.max(
      0.12,
      0.7 - ratio * 0.55
    );


  /*
   * ==========================================================
   * HEADLIGHT
   * ==========================================================
   */

  const headlightOpacity =
    Math.max(
      0.12,
      0.85 - ratio * 0.65
    );


  /*
   * ==========================================================
   * ROAD REFLECTION
   * ==========================================================
   */

  const reflectionOpacity =
    Math.max(
      0.04,
      0.3 - ratio * 0.25
    );


  /*
   * ==========================================================
   * CINEMATIC CAMERA ZOOM
   * ==========================================================
   *
   * Background slowly pushes toward the horizon.
   */

  const backgroundScale =
    1 + ratio * 0.045;


  /*
   * ==========================================================
   * LIGHT STREAKS
   * ==========================================================
   *
   * These are positioned using progress rather than CSS
   * keyframes.
   */

  const streak1X =
    -35 + progress * 1.4;

  const streak2X =
    105 - progress * 1.25;

  const streak3X =
    -25 + progress * 1.1;

  const streak4X =
    115 - progress * 1.05;


  /*
   * ==========================================================
   * FINAL CINEMATIC EXIT
   * ==========================================================
   */

  const exitActive = progress >= 96;

  const mainScale =
    exitActive
      ? 1 + ((progress - 96) / 4) * 0.025
      : 1;

  const mainOpacity =
    exitActive
      ? Math.max(
          0,
          1 - ((progress - 96) / 4) * 0.8
        )
      : 1;


  return (
    <div
      className="
        fixed
        inset-0
        z-[999999]
        overflow-hidden
        bg-[#050D18]
      "
      style={{
        opacity: mainOpacity,
        transform:
          "scale(" +
          mainScale +
          ")",
        transition:
          "opacity 120ms linear, transform 120ms linear",
      }}
    >

      {/* =====================================================
          CINEMATIC BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 overflow-hidden">

        <img
          src="/splash-bg.png"
          alt=""
          aria-hidden="true"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-center
          "
          style={{
            transform:
              "scale(" +
              backgroundScale +
              ")",
            transition:
              "transform 100ms linear",
          }}
        />

        {/* Main dark overlay */}

        <div
          className="
            absolute
            inset-0
            bg-[#020914]/35
          "
        />

        {/* Top cinematic darkness */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-56
            bg-gradient-to-b
            from-[#020914]/80
            to-transparent
          "
        />

        {/* Bottom cinematic darkness */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-80
            bg-gradient-to-t
            from-[#020914]
            via-[#020914]/55
            to-transparent
          "
        />

      </div>


      {/* =====================================================
          CINEMATIC LIGHT STREAKS
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          overflow-hidden
        "
      >

        {/* Left streak */}

        <div
          className="
            absolute
            bottom-[30%]
            h-[2px]
            w-32
            rounded-full
            bg-orange-300/20
            blur-[2px]
          "
          style={{
            left: streak1X + "%",
            opacity:
              progress > 85
                ? 0
                : 0.35,
          }}
        />

        {/* Right streak */}

        <div
          className="
            absolute
            bottom-[34%]
            h-[2px]
            w-40
            rounded-full
            bg-amber-300/15
            blur-[2px]
          "
          style={{
            left: streak2X + "%",
            opacity:
              progress > 85
                ? 0
                : 0.3,
          }}
        />

        {/* Lower left streak */}

        <div
          className="
            absolute
            bottom-[23%]
            h-[1px]
            w-24
            rounded-full
            bg-orange-400/15
            blur-[2px]
          "
          style={{
            left: streak3X + "%",
            opacity:
              progress > 88
                ? 0
                : 0.25,
          }}
        />

        {/* Lower right streak */}

        <div
          className="
            absolute
            bottom-[26%]
            h-[1px]
            w-28
            rounded-full
            bg-orange-300/15
            blur-[2px]
          "
          style={{
            left: streak4X + "%",
            opacity:
              progress > 88
                ? 0
                : 0.25,
          }}
        />

      </div>


      {/* =====================================================
          ROAD
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-[2]
          h-[58vh]
          overflow-hidden
        "
      >

        <img
          src="/splash-road.png"
          alt=""
          aria-hidden="true"
          className="
            absolute
            bottom-[-3%]
            left-1/2
            h-auto
            w-[120%]
            min-w-[900px]
            max-w-none
            -translate-x-1/2
            object-contain
            object-bottom
          "
        />

        {/* Road blend */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-44
            bg-gradient-to-t
            from-[#020914]/65
            to-transparent
          "
        />

      </div>


      {/* =====================================================
          DISTANT ROAD GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-[17%]
          left-1/2
          z-[4]
          h-40
          w-40
          -translate-x-1/2
          rounded-full
          bg-orange-400/10
          blur-[80px]
        "
      />


      {/* =====================================================
          CAR
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-10
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            left-1/2
            top-0
            w-[190px]
            sm:w-[245px]
            md:w-[285px]
            lg:w-[320px]
          "
          style={{
            transform:
              carTransform,
            transformOrigin:
              "center center",
            opacity:
              carOpacity,
            transition:
              "transform 70ms linear, opacity 100ms linear",
          }}
        >

          {/* Car ambient glow */}

          <div
            className="
              pointer-events-none
              absolute
              -inset-12
              rounded-full
              bg-orange-400/10
              blur-3xl
            "
          />


          {/* =================================================
              HEADLIGHT GLOW
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-[18%]
              left-[17%]
              z-[1]
              h-8
              w-8
              rounded-full
              bg-white
              blur-xl
            "
            style={{
              opacity:
                headlightOpacity,
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              bottom-[18%]
              right-[17%]
              z-[1]
              h-8
              w-8
              rounded-full
              bg-white
              blur-xl
            "
            style={{
              opacity:
                headlightOpacity,
            }}
          />


          {/* Headlight beams */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-[5%]
              left-[8%]
              z-[1]
              h-24
              w-[35%]
              rotate-[-7deg]
              bg-gradient-to-b
              from-white/20
              to-transparent
              blur-xl
            "
            style={{
              opacity:
                headlightOpacity,
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              bottom-[5%]
              right-[8%]
              z-[1]
              h-24
              w-[35%]
              rotate-[7deg]
              bg-gradient-to-b
              from-white/20
              to-transparent
              blur-xl
            "
            style={{
              opacity:
                headlightOpacity,
            }}
          />


          {/* Road reflection */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-[-4%]
              left-1/2
              z-[1]
              h-12
              w-[65%]
              -translate-x-1/2
              rounded-[50%]
              bg-orange-300/20
              blur-xl
            "
            style={{
              opacity:
                reflectionOpacity,
              transform:
                "translateX(-50%) scale(" +
                shadowScale +
                ")",
            }}
          />


          {/* Main shadow */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-[1%]
              left-1/2
              z-[2]
              h-6
              w-[72%]
              -translate-x-1/2
              rounded-[50%]
              bg-black
              blur-xl
            "
            style={{
              opacity:
                shadowOpacity,
              transform:
                "translateX(-50%) scaleX(" +
                shadowScale +
                ")",
            }}
          />


          {/* Orange underglow */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-[3%]
              left-1/2
              z-[3]
              h-3
              w-[45%]
              -translate-x-1/2
              rounded-full
              bg-orange-400/20
              blur-md
            "
            style={{
              opacity:
                reflectionOpacity,
              transform:
                "translateX(-50%) scaleX(" +
                shadowScale +
                ")",
            }}
          />


          {/* Actual car */}

          <img
            src="/splash-car.png"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="
              relative
              z-10
              block
              h-auto
              w-full
              select-none
              object-contain
              drop-shadow-[0_18px_25px_rgba(0,0,0,0.7)]
            "
          />

        </div>

      </div>


      {/* =====================================================
          LOGO / BRAND
      ====================================================== */}

      <div
        className="
          absolute
          left-1/2
          top-[5%]
          z-30
          w-full
          -translate-x-1/2
          px-5
          text-center
        "
      >

        <div
          className="
            mx-auto
            flex
            h-[105px]
            w-[210px]
            items-center
            justify-center
            overflow-hidden
            rounded-[28px]
            border
            border-white/20
            bg-white
            p-3
            shadow-[0_25px_80px_rgba(0,0,0,0.45)]
            sm:h-[120px]
            sm:w-[235px]
          "
        >

          <img
            src="/logo.png"
            alt="Khatu Rides"
            className="
              h-full
              w-full
              object-contain
            "
          />

        </div>


        <p
          className="
            mt-5
            text-[9px]
            font-black
            uppercase
            tracking-[0.4em]
            text-orange-400
          "
        >
          Travels Co.
        </p>


        <h1
          className="
            mt-3
            text-3xl
            font-black
            tracking-tight
            text-white
            drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]
            sm:text-4xl
          "
        >
          Your Journey.
        </h1>


        <h2
          className="
            mt-1
            text-2xl
            font-black
            tracking-tight
            text-orange-400
            drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]
            sm:text-3xl
          "
        >
          Our Responsibility.
        </h2>


        <div
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-3
          "
        >

          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">
            Safe
          </span>

          <span className="h-1 w-1 rounded-full bg-orange-400" />

          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">
            Comfortable
          </span>

          <span className="h-1 w-1 rounded-full bg-orange-400" />

          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">
            On Time
          </span>

        </div>

      </div>


      {/* =====================================================
          LOADING
      ====================================================== */}

      <div
        className="
          absolute
          bottom-[5%]
          left-1/2
          z-40
          w-full
          max-w-md
          -translate-x-1/2
          px-6
          text-center
        "
      >

        <div
          className="
            mb-3
            flex
            items-center
            justify-between
          "
        >

          <span
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.2em]
              text-slate-300
            "
          >
            Preparing Your Journey
          </span>

          <span
            className="
              text-[10px]
              font-black
              text-orange-400
            "
          >
            {progress}%
          </span>

        </div>


        {/* Progress bar */}

        <div
          className="
            h-2
            w-full
            overflow-hidden
            rounded-full
            border
            border-white/10
            bg-black/40
            shadow-inner
            backdrop-blur
          "
        >

          <div
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-orange-600
              via-amber-400
              to-orange-500
              shadow-[0_0_18px_rgba(249,115,22,0.65)]
            "
            style={{
              width:
                progress + "%",
              transition:
                "width 50ms linear",
            }}
          />

        </div>


        <p
          className="
            mt-5
            text-[7px]
            font-bold
            uppercase
            tracking-[0.3em]
            text-slate-500
          "
        >
          Chhattisgarh • Madhya Pradesh
        </p>

      </div>

    </div>
  );
}
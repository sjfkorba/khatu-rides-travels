import Icon from "./Icons";
import { PHONE, PHONE_DISPLAY, WHATSAPP } from "./data";

const CTA_POINTS = [
  {
    number: "01",
    title: "Tell Us Your Route",
    text: "Share your pickup, destination and travel date.",
  },
  {
    number: "02",
    title: "Choose Your Cab",
    text: "Our team can help you select a suitable vehicle.",
  },
  {
    number: "03",
    title: "Start Your Journey",
    text: "Confirm your booking and travel comfortably.",
  },
];

const SERVICE_TAGS = [
  "One Way Cab",
  "Airport Taxi",
  "Outstation Cab",
  "Round Trip",
  "Tour Packages",
];

export default function FinalCTA() {
  return (
    <section
      id="contact"
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden bg-[#061B32] text-white"
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ===================================================== */}

      <div className="absolute inset-0">
        <img
          src="/splash-road.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-20"
        />
      </div>

      {/* =====================================================
          MULTI-LAYER OVERLAY
      ===================================================== */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#061B32] via-[#062039]/95 to-[#102B45]/90" />

      <div className="pointer-events-none absolute -left-32 top-10 h-[320px] w-[320px] rounded-full bg-amber-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-orange-400/10 blur-3xl" />

      {/* =====================================================
          DECORATIVE ROAD LINE
      ===================================================== */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      <div className="relative mx-auto max-w-[1250px] px-4 py-14 sm:px-6 sm:py-20 lg:py-24">

        {/* =====================================================
            TOP LABEL
        ===================================================== */}

        <div className="mx-auto max-w-4xl text-center">

          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-[9px] font-black uppercase tracking-[.22em] text-amber-300">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-950">
              ✓
            </span>

            Cab Booking Made Simple
          </span>

          {/* =================================================
              MAIN HEADING
          ================================================= */}

          <h2
            id="final-cta-heading"
            className="mt-5 text-3xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Your Destination Is
            <span className="block text-amber-300">
              Just One Call Away.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-[15px] sm:leading-7">
            Tell us where you want to go. Our booking team will help you with
            the right cab option for local travel, airport transfers,
            outstation journeys, family trips and tour packages.
          </p>

        </div>

        {/* =====================================================
            MAIN ACTION AREA
        ===================================================== */}

        <div className="mx-auto mt-8 max-w-2xl">

          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-3 shadow-[0_25px_80px_rgba(0,0,0,.25)] backdrop-blur-md sm:p-4">

            <div className="grid gap-3 sm:grid-cols-2">

              {/* CALL */}

              <a
                href={`tel:${PHONE}`}
                aria-label={`Call Khatu Rides at ${PHONE_DISPLAY}`}
                className="group flex min-h-[68px] items-center justify-center gap-3 rounded-[20px] bg-amber-400 px-6 py-4 text-slate-950 shadow-[0_12px_35px_rgba(245,158,11,.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-[0_18px_45px_rgba(245,158,11,.30)] active:scale-[.98]"
              >

                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-amber-300 transition-transform duration-300 group-hover:scale-105">
                  <Icon
                    name="phone"
                    size={18}
                  />
                </span>

                <span className="text-left">

                  <span className="block text-[8px] font-black uppercase tracking-[.18em] text-slate-950/55">
                    Fastest Booking
                  </span>

                  <span className="mt-0.5 block text-sm font-black uppercase tracking-wide">
                    Call For Booking
                  </span>

                </span>

              </a>

              {/* WHATSAPP */}

              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20cab`}
                target="_blank"
                rel="noreferrer"
                aria-label="Book a cab through WhatsApp"
                className="group flex min-h-[68px] items-center justify-center gap-3 rounded-[20px] border border-emerald-400/20 bg-emerald-500/15 px-6 py-4 text-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-500/25 active:scale-[.98]"
              >

                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <Icon
                    name="whatsapp"
                    size={19}
                  />
                </span>

                <span className="text-left">

                  <span className="block text-[8px] font-black uppercase tracking-[.18em] text-white/40">
                    Quick Enquiry
                  </span>

                  <span className="mt-0.5 block text-sm font-black uppercase tracking-wide">
                    WhatsApp Us
                  </span>

                </span>

              </a>

            </div>

          </div>

          {/* PHONE */}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">

            <span className="text-[10px] font-black text-white/35">
              Booking Helpline
            </span>

            <a
              href={`tel:${PHONE}`}
              className="text-sm font-black text-amber-300 transition hover:text-amber-200"
            >
              {PHONE_DISPLAY}
            </a>

            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />

            <span className="text-[10px] font-bold text-white/35">
              Customer Support Available
            </span>

          </div>

        </div>

        {/* =====================================================
            SERVICE TAGS
        ===================================================== */}

        <div className="mt-10 flex flex-wrap justify-center gap-2">

          {SERVICE_TAGS.map((service) => (

            <span
              key={service}
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[8px] font-black uppercase tracking-wider text-white/55 backdrop-blur-sm"
            >
              {service}
            </span>

          ))}

        </div>

        {/* =====================================================
            BOOKING PROCESS
        ===================================================== */}

        <div className="mt-14">

          <div className="mb-6 text-center">

            <span className="text-[9px] font-black uppercase tracking-[.22em] text-amber-300/80">
              How It Works
            </span>

            <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              From Call To Cab In 3 Simple Steps
            </h3>

          </div>

          <div className="grid gap-3 md:grid-cols-3">

            {CTA_POINTS.map((step, index) => (

              <div
                key={step.number}
                className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/20 hover:bg-white/[0.07]"
              >

                {/* Connector */}

                {index < CTA_POINTS.length - 1 && (
                  <div className="pointer-events-none absolute right-[-20px] top-[42px] z-20 hidden h-px w-10 bg-gradient-to-r from-amber-300/30 to-transparent md:block" />
                )}

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-xs font-black text-slate-950 shadow-lg">
                    {step.number}
                  </div>

                  <div>

                    <h4 className="text-sm font-black text-white sm:text-[15px]">
                      {step.title}
                    </h4>

                    <p className="mt-1.5 text-[10px] leading-5 text-white/40">
                      {step.text}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* =====================================================
            TRUST STRIP
        ===================================================== */}

        <div className="mt-10 grid gap-2 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">

          <div className="flex items-center justify-center gap-2 py-2 text-center">

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
              ✓
            </span>

            <span className="text-[9px] font-bold text-white/50">
              Easy Booking Assistance
            </span>

          </div>

          <div className="flex items-center justify-center gap-2 py-2 text-center">

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
              ✓
            </span>

            <span className="text-[9px] font-bold text-white/50">
              Comfortable Vehicles
            </span>

          </div>

          <div className="flex items-center justify-center gap-2 py-2 text-center">

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
              ✓
            </span>

            <span className="text-[9px] font-bold text-white/50">
              Professional Drivers
            </span>

          </div>

          <div className="flex items-center justify-center gap-2 py-2 text-center">

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
              ✓
            </span>

            <span className="text-[9px] font-bold text-white/50">
              Local & Outstation Travel
            </span>

          </div>

        </div>

        {/* =====================================================
            SEO / CLOSING COPY
        ===================================================== */}

        <div className="mx-auto mt-12 max-w-4xl border-t border-white/10 pt-8 text-center">

          <h3 className="text-lg font-black text-white sm:text-xl">
            Book A Reliable Cab From Raipur, Bilaspur, Korba & Beyond
          </h3>

          <p className="mt-3 text-[10px] leading-6 text-white/35 sm:text-xs sm:leading-6">
            Khatu Rides Travels provides cab booking for Raipur, Bilaspur,
            Korba, Durg, Bhilai and nearby destinations. Book a one-way taxi,
            airport cab, round-trip vehicle, outstation cab or tour package
            for your next journey.
          </p>

        </div>

      </div>

      {/* =====================================================
          BOTTOM ACCENT
      ===================================================== */}

      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />

    </section>
  );
}
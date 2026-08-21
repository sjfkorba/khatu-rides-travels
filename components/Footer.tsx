import Link from "next/link";
import {
  ArrowRight,
  Car,
  ChevronRight,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";

import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";
import TrackedCallButton from "@/components/TrackedCallButton";

import { routeDatabase } from "@/lib/routeDatabase";

export default function Footer() {
  // ============================================================
  // DYNAMIC ROUTES
  // ============================================================

  const allRouteLinks = Object.keys(routeDatabase).map((slug) => ({
    label: routeDatabase[slug].title,
    href: `/routes/${slug}`,
  }));

  // Keep footer clean
  const popularRouteLinks = allRouteLinks.slice(0, 8);

  // ============================================================
  // REGIONAL SERVICES
  // ============================================================

  const regionalLinks = [
    {
      href: "/services/one-way-taxi-raipur",
      label: "Taxi Service in Raipur",
    },
    {
      href: "/services/one-way-taxi-korba",
      label: "Taxi Service in Korba",
    },
    {
      href: "/services/one-way-taxi-bilaspur",
      label: "Taxi Service in Bilaspur",
    },
    {
      href: "/services/one-way-taxi-raigarh",
      label: "One Way Taxi Raigarh",
    },
    {
      href: "/services/one-way-taxi-jharsuguda",
      label: "One Way Taxi Jharsuguda",
    },
    {
      href: "/services/one-way-taxi-ambikapur",
      label: "One Way Taxi Ambikapur",
    },
    {
      href: "/services/one-way-taxi-jagdalpur",
      label: "One Way Taxi Jagdalpur",
    },
    {
      href: "/services/one-way-taxi-durg-bhilai",
      label: "One Way Taxi Durg-Bhilai",
    },
  ];

  // ============================================================
  // COMPANY LINKS
  // ============================================================

  const companyLinks = [
    {
      href: "/about-us",
      label: "About Us",
    },
    {
      href: "/contact-us",
      label: "Contact Us",
    },
    {
      href: "/blog",
      label: "Travel Blog",
    },
  ];

  // ============================================================
  // LEGAL LINKS
  // ============================================================

  const complianceLinks = [
    {
      href: "/privacy-policy",
      label: "Privacy Policy",
    },
    {
      href: "/terms-and-conditions",
      label: "Terms & Conditions",
    },
    {
      href: "/refund-policy",
      label: "Refund Policy",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#07111F] text-white">

      {/* ========================================================
          PREMIUM CTA SECTION
      ========================================================= */}

      <section className="relative border-b border-white/[0.06]">

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#13263D] via-[#0C1B2C] to-[#07111F] shadow-[0_25px_80px_rgba(0,0,0,0.35)]">

            {/* Decorative Glow */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

            {/* CTA Content */}

            <div className="relative z-10 grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">

              <div className="max-w-2xl">

                {/* Badge */}

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1.5">

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">
                    <ShieldCheck size={12} />
                  </span>

                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-300">
                    24×7 Travel Assistance
                  </span>

                </div>

                {/* Heading */}

                <h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                  Ready for your next
                  <span className="block text-orange-400">
                    journey?
                  </span>
                </h2>

                {/* Description */}

                <p className="mt-3 max-w-xl text-xs font-medium leading-relaxed text-slate-400 sm:text-sm">
                  Book reliable cabs across Chhattisgarh and beyond.
                  Transparent fares, comfortable vehicles and trusted
                  driver partners.
                </p>

                {/* Trust Points */}

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">

                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-300">
                    <span className="text-orange-400">✓</span>
                    Transparent Fare
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-300">
                    <span className="text-orange-400">✓</span>
                    Verified Drivers
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-300">
                    <span className="text-orange-400">✓</span>
                    24×7 Support
                  </div>

                </div>

              </div>

              {/* CTA BUTTONS */}

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">

                <TrackedWhatsAppButton
                  href="https://wa.me/919244137353"
                  className="flex h-12 min-w-[210px] items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5 hover:bg-[#20bd5c] active:scale-95"
                >
                  <span className="text-base">
                    💬
                  </span>

                  WhatsApp Booking
                </TrackedWhatsAppButton>

                <TrackedCallButton
                  href="tel:9244137353"
                  className="flex h-12 min-w-[210px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 text-xs font-black uppercase tracking-wider text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/10 active:scale-95"
                >
                  <Phone size={15} />

                  Call 9244137353
                </TrackedCallButton>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================
          MAIN FOOTER
      ========================================================= */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">

        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr_1.05fr_0.72fr]">


          {/* ====================================================
              BRAND / LOGO SECTION
          ==================================================== */}

          <div className="max-w-sm">

            {/* BIG LOGO ONLY */}

            <Link
              href="/"
              aria-label="Khatu Rides Home"
              className="group inline-flex"
            >

              <div
                className="
                  flex
                  h-[105px]
                  w-[190px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-white/10
                  bg-white
                  p-3
                  shadow-[0_15px_40px_rgba(0,0,0,0.30)]
                  transition-all
                  duration-300
                  group-hover:-translate-y-1
                  group-hover:border-orange-400/40
                  group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.40)]
                  sm:h-[115px]
                  sm:w-[210px]
                "
              >

                <img
                  src="/logo.png"
                  alt="Khatu Rides Travels Co."
                  className="h-full w-full object-contain"
                />

              </div>

            </Link>


            {/* DESCRIPTION */}

            <p className="mt-6 max-w-[360px] text-xs font-medium leading-6 text-slate-400">
              Reliable cab and travel services across
              Chhattisgarh, Madhya Pradesh and beyond.
              From airport transfers to long-distance
              journeys, travel comfortably with Khatu Rides.
            </p>


            {/* GOOGLE RATING */}

            <a
              href="https://g.page/r/CbD5nSIGmvz1EBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 transition-all hover:border-orange-500/20 hover:bg-orange-500/[0.03]"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Star
                  size={17}
                  fill="currentColor"
                />
              </div>

              <div>

                <div className="flex items-center gap-1">

                  <span className="text-sm font-black text-white">
                    4.6
                  </span>

                  <span className="text-[9px] font-bold text-slate-500">
                    / 5
                  </span>

                </div>

                <div className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
                  Google Reviews
                </div>

              </div>

            </a>


            {/* LOCATION */}

            <div className="mt-5 flex items-start gap-2">

              <MapPin
                size={15}
                className="mt-0.5 shrink-0 text-orange-400"
              />

              <div>

                <p className="text-xs font-semibold text-slate-300">
                  Korba, Chhattisgarh
                </p>

                <p className="mt-0.5 text-[9px] font-medium text-slate-600">
                  Serving customers across CG & MP
                </p>

              </div>

            </div>

          </div>


          {/* ====================================================
              REGIONAL SERVICES
          ==================================================== */}

          <div>

            <div className="mb-5 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-orange-500" />

              <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-white">
                Regional Services
              </h3>

            </div>


            <ul className="space-y-3">

              {regionalLinks.map((link) => (

                <li key={link.href}>

                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-[11px] font-semibold text-slate-400 transition-colors hover:text-white"
                  >

                    <ArrowRight
                      size={11}
                      className="shrink-0 text-slate-700 transition-all group-hover:translate-x-1 group-hover:text-orange-400"
                    />

                    <span>
                      {link.label}
                    </span>

                  </Link>

                </li>

              ))}

            </ul>

          </div>


          {/* ====================================================
              POPULAR ROUTES
          ==================================================== */}

          <div>

            <div className="mb-5 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-orange-500" />

              <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-white">
                Popular Routes
              </h3>

            </div>


            <ul className="space-y-3">

              {popularRouteLinks.map((link) => (

                <li key={link.href}>

                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-[11px] font-semibold text-slate-400 transition-colors hover:text-white"
                  >

                    <ArrowRight
                      size={11}
                      className="shrink-0 text-slate-700 transition-all group-hover:translate-x-1 group-hover:text-orange-400"
                    />

                    <span className="line-clamp-1">
                      {link.label}
                    </span>

                  </Link>

                </li>

              ))}

            </ul>


            {/* ALL ROUTES */}

            {allRouteLinks.length > 8 && (

              <Link
                href="/routes"
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-orange-500/25 bg-orange-500/5 px-3.5 py-2 text-[9px] font-black uppercase tracking-wider text-orange-400 transition-all hover:border-orange-500/50 hover:bg-orange-500/10"
              >

                View All Routes

                <ChevronRight size={12} />

              </Link>

            )}

          </div>


          {/* ====================================================
              COMPANY + LEGAL
          ==================================================== */}

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">


            {/* COMPANY */}

            <div>

              <div className="mb-5 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-orange-500" />

                <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  Company
                </h3>

              </div>


              <ul className="space-y-3">

                {companyLinks.map((link) => (

                  <li key={link.href}>

                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-[11px] font-semibold text-slate-400 transition-colors hover:text-white"
                    >

                      <ArrowRight
                        size={11}
                        className="shrink-0 text-slate-700 transition-all group-hover:translate-x-1 group-hover:text-orange-400"
                      />

                      {link.label}

                    </Link>

                  </li>

                ))}

              </ul>

            </div>


            {/* LEGAL */}

            <div>

              <div className="mb-5 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-orange-500" />

                <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  Legal
                </h3>

              </div>


              <ul className="space-y-3">

                {complianceLinks.map((link) => (

                  <li key={link.href}>

                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-[11px] font-semibold text-slate-400 transition-colors hover:text-white"
                    >

                      <ArrowRight
                        size={11}
                        className="shrink-0 text-slate-700 transition-all group-hover:translate-x-1 group-hover:text-orange-400"
                      />

                      {link.label}

                    </Link>

                  </li>

                ))}

              </ul>

            </div>

          </div>

        </div>


        {/* ======================================================
            TRUST / SERVICE STRIP
        ======================================================= */}

        <div className="mt-12 grid overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0C1828] sm:grid-cols-3">


          {/* TRUSTED SERVICE */}

          <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4 sm:border-b-0 sm:border-r">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">

              <ShieldCheck size={17} />

            </div>

            <div>

              <p className="text-[10px] font-black uppercase tracking-wider text-white">
                Trusted Service
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                Reliable travel support
              </p>

            </div>

          </div>


          {/* MULTIPLE VEHICLES */}

          <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4 sm:border-b-0 sm:border-r">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">

              <Car size={17} />

            </div>

            <div>

              <p className="text-[10px] font-black uppercase tracking-wider text-white">
                Multiple Vehicles
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                Sedan • Ertiga • Innova
              </p>

            </div>

          </div>


          {/* SUPPORT */}

          <div className="flex items-center gap-3 px-5 py-4">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">

              <Phone size={17} />

            </div>

            <div>

              <p className="text-[10px] font-black uppercase tracking-wider text-white">
                24×7 Support
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                Call or WhatsApp anytime
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================================
          COPYRIGHT
      ========================================================= */}

      <div className="border-t border-white/[0.06] bg-[#050C16]">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <p className="text-center text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600 md:text-left">
            © 2026 Khatu Rides Travels Co. All Rights Reserved.
          </p>


          <div className="flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-wider text-slate-600">

            <span className="flex items-center gap-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              Online

            </span>

            <span className="h-3 w-px bg-slate-800" />

            <span>
              Chhattisgarh
            </span>

            <span className="text-slate-700">
              •
            </span>

            <span>
              Madhya Pradesh
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
}
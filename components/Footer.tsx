import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Car,
  ChevronRight,
  Clock3,
  MapPin,
  Phone,
  Plane,
  ShieldCheck,
  Star,
  Ticket,
  Navigation,
  MessageCircle,
} from "lucide-react";

import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";
import TrackedCallButton from "@/components/TrackedCallButton";

import { PHONE, PHONE_DISPLAY, WHATSAPP } from "@/components/landing/data";
import { routeDatabase } from "@/lib/routeDatabase";

const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/XGzQoFuhnQkefhzo9";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Khatu%20Rides%20Travels%20Co.%2C%20Korba%2C%20Chhattisgarh&output=embed";

export default function Footer() {
  // ============================================================
  // DYNAMIC ROUTES
  // ============================================================

  const allRouteLinks = Object.keys(routeDatabase).map((slug) => ({
    label: routeDatabase[slug].title,
    href: `/routes/${slug}`,
  }));

  const popularRouteLinks = allRouteLinks.slice(0, 8);

  // ============================================================
  // MAIN SERVICES
  // ============================================================

  const serviceLinks = [
    {
      href: "/services/one-way-taxi-raipur",
      label: "One Way Taxi",
    },
    {
      href: "/services/round-trip-cab",
      label: "Round Trip Cab",
    },
    {
      href: "/services/airport-taxi",
      label: "Airport Taxi",
    },
    {
      href: "/services/outstation-cab",
      label: "Outstation Cab",
    },
    {
      href: "/services/local-cab-rental",
      label: "Local Cab Rental",
    },
    {
      href: "/tour-packages",
      label: "Tour Packages",
    },
  ];

  // ============================================================
  // CITY / REGIONAL SERVICES
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
  // TOUR LINKS
  // ============================================================

  const tourLinks = [
    {
      href: "/tour-packages/khatu-shyam",
      label: "Khatu Shyam Tour",
    },
    {
      href: "/tour-packages/ayodhya",
      label: "Ayodhya Tour",
    },
    {
      href: "/tour-packages/ujjain",
      label: "Ujjain Tour",
    },
    {
      href: "/tour-packages/prayagraj",
      label: "Prayagraj Tour",
    },
    {
      href: "/tour-packages/varanasi",
      label: "Varanasi Tour",
    },
    {
      href: "/tour-packages/puri",
      label: "Puri Tour",
    },
  ];

  // ============================================================
  // COMPANY LINKS
  // ============================================================

  const companyLinks = [
    {
      href: "/about-us",
      label: "About Khatu Rides",
    },
    {
      href: "/contact-us",
      label: "Contact Us",
    },
    {
      href: "/fleet",
      label: "Our Fleet",
    },
    {
      href: "/blog",
      label: "Travel Blog",
    },
    {
      href: "/reviews",
      label: "Customer Reviews",
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

  // ============================================================
  // QUICK LINKS
  // ============================================================

  const quickLinks = [
    {
      href: "/fare-calculator",
      label: "Fare Calculator",
      icon: Calculator,
    },
    {
      href: "/routes",
      label: "All Cab Routes",
      icon: Navigation,
    },
    {
      href: "/tour-packages",
      label: "Tour Packages",
      icon: Ticket,
    },
    {
      href: "/contact-us",
      label: "Contact & Booking",
      icon: Phone,
    },
  ];

  return (
    <footer
      id="footer"
      className="relative overflow-hidden bg-[#F8FAFC] text-slate-950"
    >
      {/* ============================================================
          PREMIUM CTA
      ============================================================ */}

      <section className="relative border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-gradient-to-br from-[#FFF9E8] via-white to-[#F8FAFC] shadow-[0_20px_70px_rgba(15,23,42,.08)]">
            {/* Decorative glow */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-orange-200/25 blur-3xl" />

            {/* CTA content */}

            <div className="relative z-10 grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
              <div className="max-w-2xl">
                {/* Badge */}

                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                    <ShieldCheck size={13} />
                  </span>

                  <span className="text-[9px] font-black uppercase tracking-[.18em] text-amber-700">
                    Trusted Cab & Travel Service
                  </span>
                </div>

                {/* Heading */}

                <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
                  Planning A Journey?

                  <span className="block text-amber-500">
                    Let&apos;s Get You There.
                  </span>
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Book a one-way cab, airport taxi, outstation vehicle,
                  round-trip cab or tour package with Khatu Rides Travels.
                </p>

                {/* Trust points */}

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600">
                    <span className="text-amber-500">✓</span>
                    Easy Booking
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600">
                    <span className="text-amber-500">✓</span>
                    Comfortable Vehicles
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600">
                    <span className="text-amber-500">✓</span>
                    Travel Assistance
                  </div>
                </div>
              </div>

              {/* CTA buttons */}

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
                <TrackedCallButton
                  href={`tel:${PHONE}`}
                  className="flex h-13 min-w-[220px] items-center justify-center gap-3 rounded-2xl bg-amber-400 px-6 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_12px_30px_rgba(245,158,11,.20)] transition-all hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-[0_16px_40px_rgba(245,158,11,.25)] active:scale-95"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-amber-300">
                    <Phone size={15} />
                  </span>

                  Call For Booking
                </TrackedCallButton>

                <TrackedWhatsAppButton
                  href={`https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20cab`}
                  className="flex h-13 min-w-[220px] items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 text-xs font-black uppercase tracking-wider text-emerald-700 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 active:scale-95"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
                    <MessageCircle size={15} />
                  </span>

                  WhatsApp Booking
                </TrackedWhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MAIN FOOTER
      ============================================================ */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        {/* ========================================================
            QUICK ACTION CARDS
        ======================================================== */}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => {
            const LinkIcon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-400 group-hover:text-slate-950">
                  <LinkIcon size={17} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-900">
                    {link.label}
                  </span>

                  <span className="mt-0.5 block text-[8px] font-medium text-slate-400">
                    Explore &amp; book
                  </span>
                </span>

                <ChevronRight
                  size={14}
                  className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-amber-500"
                />
              </Link>
            );
          })}
        </div>

        {/* ========================================================
    MAIN GRID
======================================================== */}

<div className="mt-12 grid gap-8 lg:grid-cols-[2.2fr_1fr_1fr_1fr]">

  {/* ======================================================
      BRAND + TRUST + GOOGLE MAP
  ====================================================== */}

  <div className="min-w-0">
    <div className="grid gap-5 sm:grid-cols-[0.95fr_1.05fr]">

      {/* ==================================================
          BRAND / TRUST PANEL
      ================================================== */}

      <div className="min-w-0 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,.06)] sm:p-6">

        {/* Logo */}

        <Link
          href="/"
          aria-label="Khatu Rides Travels Home"
          className="group inline-flex"
        >
          <div className="flex h-[82px] w-[160px] items-center justify-center overflow-hidden rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-amber-300 group-hover:shadow-[0_14px_35px_rgba(245,158,11,.14)]"
          >
            <img
              src="/logo.png"
              alt="Khatu Rides Travels"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        {/* Brand Copy */}

        <p className="mt-5 text-[11px] font-medium leading-5 text-slate-500">
          Reliable cab and travel services for local,
          airport, outstation, family and pilgrimage
          journeys across Chhattisgarh and beyond.
        </p>

        {/* Google Rating */}

        <a
          href="https://g.page/r/CbD5nSIGmvz1EBM/review"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 transition-all hover:border-amber-200 hover:bg-amber-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-500">
            <Star
              size={18}
              fill="currentColor"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-slate-950">
                4.9
              </span>

              <span className="text-[9px] font-bold text-slate-400">
                / 5
              </span>
            </div>

            <p className="text-[8px] font-black uppercase tracking-[.12em] text-slate-400">
              Google Reviews
            </p>
          </div>

          <ChevronRight
            size={14}
            className="text-slate-300"
          />
        </a>

        {/* Trust Points */}

        <div className="mt-5 space-y-2.5">

          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck size={13} />
            </span>

            <div>
              <p className="text-[9px] font-black text-slate-800">
                Direct Booking
              </p>

              <p className="text-[7px] font-medium text-slate-400">
                Call or WhatsApp to book
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Calculator size={13} />
            </span>

            <div>
              <p className="text-[9px] font-black text-slate-800">
                Fare Before Booking
              </p>

              <p className="text-[7px] font-medium text-slate-400">
                Check estimated cab fare
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#063B8F]">
              <Navigation size={13} />
            </span>

            <div>
              <p className="text-[9px] font-black text-slate-800">
                Local Route Expertise
              </p>

              <p className="text-[7px] font-medium text-slate-400">
                Chhattisgarh & nearby destinations
              </p>
            </div>
          </div>

        </div>

        {/* Mini CTA */}

        <div className="mt-5 grid grid-cols-2 gap-2">

          <TrackedCallButton
            href={`tel:${PHONE}`}
            className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#063B8F] px-2 text-[7px] font-black uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#052f70] active:scale-95"
          >
            <Phone size={11} />
            Call
          </TrackedCallButton>

          <TrackedWhatsAppButton
            href={`https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20cab`}
            className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-2 text-[7px] font-black uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#1fbd5b] active:scale-95"
          >
            <MessageCircle size={11} />
            WhatsApp
          </TrackedWhatsAppButton>

        </div>

      </div>

      {/* ==================================================
          GOOGLE MAP / OFFICE PANEL
      ================================================== */}

      <div className="flex min-h-full min-w-0 flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,.07)]">

        {/* Map Top Bar */}

        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-2.5">

            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <MapPin
                size={15}
                fill="currentColor"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-[.16em] text-amber-600">
                Visit Our Office
              </p>

              <p className="mt-0.5 truncate text-[10px] font-black text-slate-950">
                Khatu Rides Travels Co.
              </p>
            </div>

          </div>

          <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-[7px] font-black uppercase tracking-wider text-emerald-600">
            Google Maps
          </span>
        </div>

        {/* Map */}

        <div className="relative min-h-[245px] flex-1 overflow-hidden bg-slate-100">

          <iframe
            title="Khatu Rides Travels Co. Office Location on Google Maps"
            src="https://www.google.com/maps?q=Khatu%20Rides%20Travels%20Co.%2C%20Korba%2C%20Chhattisgarh&output=embed"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          {/* Floating Location Badge */}

          <div className="pointer-events-none absolute left-3 top-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2 shadow-[0_8px_22px_rgba(15,23,42,.18)] backdrop-blur-md">

              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5C400] text-[#071A3A]">
                <MapPin
                  size={13}
                  fill="currentColor"
                />
              </span>

              <div>
                <p className="text-[8px] font-black uppercase tracking-wider text-slate-950">
                  Our Office
                </p>

                <p className="text-[7px] font-semibold text-slate-500">
                  Korba, Chhattisgarh
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Office Details */}

        <div className="border-t border-slate-100 p-4">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <MapPin
                size={15}
                fill="currentColor"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black text-slate-900">
                Korba, Chhattisgarh
              </p>

              <p className="mt-1 text-[8px] font-medium leading-4 text-slate-400">
                Serving Chhattisgarh, Madhya Pradesh & nearby destinations
              </p>
            </div>

          </div>

          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#071A3A] px-4 text-[8px] font-black uppercase tracking-[.12em] text-white shadow-[0_8px_20px_rgba(7,26,58,.18)] transition-all hover:-translate-y-0.5 hover:bg-[#063B8F] active:scale-[.98]"
          >
            <MapPin size={12} />

            Open in Google Maps

            <ArrowRight size={12} />
          </a>

        </div>

      </div>

    </div>
  </div>


  {/* ======================================================
      SERVICES
  ====================================================== */}

  <div>
    <div className="mb-5">
      <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
        Cab Services
      </span>

      <h3 className="mt-1 text-sm font-black text-slate-950">
        Book Your Ride
      </h3>
    </div>

    <ul className="space-y-3">
      {serviceLinks.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="group flex items-center gap-2 text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-950"
          >
            <ArrowRight
              size={11}
              className="shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-amber-500"
            />

            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>


  {/* ======================================================
      POPULAR ROUTES
  ====================================================== */}

  <div>
    <div className="mb-5">
      <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
        Popular Routes
      </span>

      <h3 className="mt-1 text-sm font-black text-slate-950">
        City To City Cabs
      </h3>
    </div>

    <ul className="space-y-3">
      {popularRouteLinks.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="group flex items-center gap-2 text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-950"
          >
            <ArrowRight
              size={11}
              className="shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-amber-500"
            />

            <span className="line-clamp-1">
              {link.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>

    {allRouteLinks.length > 8 && (
      <Link
        href="/routes"
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-[9px] font-black uppercase tracking-wider text-amber-700 transition-all hover:border-amber-300 hover:bg-amber-100"
      >
        View All Routes

        <ChevronRight size={12} />
      </Link>
    )}
  </div>


  {/* ======================================================
      TOURS
  ====================================================== */}

  <div>
    <div className="mb-5">
      <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
        Tours &amp; Travel
      </span>

      <h3 className="mt-1 text-sm font-black text-slate-950">
        Popular Tours
      </h3>
    </div>

    <ul className="space-y-3">
      {tourLinks.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="group flex items-center gap-2 text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-950"
          >
            <ArrowRight
              size={11}
              className="shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-amber-500"
            />

            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>

</div>

        {/* ========================================================
            REGIONAL SEO LINKS
        ======================================================== */}

        <div className="mt-12 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                Service Areas
              </span>

              <h3 className="mt-1 text-lg font-black text-slate-950">
                Cab Services Across Chhattisgarh
              </h3>
            </div>

            <span className="text-[9px] font-semibold text-slate-400">
              Explore local &amp; one-way taxi services
            </span>
          </div>

          <div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {regionalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 text-[10px] font-semibold text-slate-500 transition-all hover:border-amber-100 hover:bg-amber-50 hover:text-amber-700"
              >
                <MapPin
                  size={12}
                  className="shrink-0 text-slate-300 transition-colors group-hover:text-amber-500"
                />

                <span className="line-clamp-1">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ========================================================
            FARE CALCULATOR FEATURE
        ======================================================== */}

        <div className="mt-5 overflow-hidden rounded-[26px] border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-sm">
                <Calculator size={21} />
              </div>

              <div>
                <span className="text-[8px] font-black uppercase tracking-[.2em] text-amber-600">
                  Plan Your Trip
                </span>

                <h3 className="mt-1 text-lg font-black text-slate-950">
                  Check Your Cab Fare
                </h3>

                <p className="mt-1 max-w-xl text-[10px] leading-5 text-slate-500">
                  Estimate your journey fare and explore suitable cab options
                  before booking.
                </p>
              </div>
            </div>

            <Link
              href="/fare-calculator"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-[9px] font-black uppercase tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-amber-400 hover:text-slate-950 active:scale-[.98]"
            >
              <Calculator size={14} />

              Open Fare Calculator

              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ========================================================
            COMPANY + LEGAL + CONTACT
        ======================================================== */}

        <div className="mt-12 grid gap-8 border-t border-slate-200 pt-10 md:grid-cols-3">
          {/* COMPANY */}

          <div>
            <div className="mb-4">
              <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                Company
              </span>
            </div>

            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-[11px] font-semibold text-slate-500 hover:text-slate-950"
                  >
                    <ArrowRight
                      size={11}
                      className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-amber-500"
                    />

                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}

          <div>
            <div className="mb-4">
              <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                Booking Support
              </span>
            </div>

            <div className="space-y-3">
              <a
                href={`tel:${PHONE}`}
                className="group flex items-center gap-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-400 group-hover:text-slate-950">
                  <Phone size={15} />
                </span>

                <span>
                  <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Call Us
                  </span>

                  <span className="text-xs font-black text-slate-800">
                    {PHONE_DISPLAY}
                  </span>
                </span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20cab`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-500 group-hover:text-white">
                  <MessageCircle size={15} />
                </span>

                <span>
                  <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400">
                    WhatsApp
                  </span>

                  <span className="text-xs font-black text-slate-800">
                    Quick Booking Enquiry
                  </span>
                </span>
              </a>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Clock3 size={15} />
                </span>

                <span>
                  <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Travel Assistance
                  </span>

                  <span className="text-xs font-black text-slate-800">
                    Call or WhatsApp for booking
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* LEGAL */}

          <div>
            <div className="mb-4">
              <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                Legal &amp; Policies
              </span>
            </div>

            <ul className="space-y-3">
              {complianceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-[11px] font-semibold text-slate-500 hover:text-slate-950"
                  >
                    <ArrowRight
                      size={11}
                      className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-amber-500"
                    />

                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ========================================================
            TRUST STRIP
        ======================================================== */}

        <div className="mt-10 grid overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm sm:grid-cols-3">
          {/* TRUST */}

          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:border-b-0 sm:border-r">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck size={18} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                Trusted Travel Service
              </p>

              <p className="mt-0.5 text-[9px] text-slate-400">
                Local &amp; outstation assistance
              </p>
            </div>
          </div>

          {/* FLEET */}

          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:border-b-0 sm:border-r">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Car size={18} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                Multiple Cab Options
              </p>

              <p className="mt-0.5 text-[9px] text-slate-400">
                Sedan • MUV • SUV • Premium
              </p>
            </div>
          </div>

          {/* AIRPORT */}

          <div className="flex items-center gap-3 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Plane size={18} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                Airport &amp; Outstation
              </p>

              <p className="mt-0.5 text-[9px] text-slate-400">
                Convenient travel support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          COPYRIGHT
      ============================================================ */}

      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="text-center text-[9px] font-bold uppercase tracking-[.12em] text-slate-400 md:text-left">
            © 2026 Khatu Rides Travels Co. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Travel Service
            </span>

            <span className="h-3 w-px bg-slate-200" />

            <span>
              Chhattisgarh
            </span>

            <span className="text-slate-300">
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
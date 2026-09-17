import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Star,
  Ticket,
  Users,
  X,
} from "lucide-react";

import Footer from "@/components/Footer";
import {
  getRelatedTourPackages,
  getTourPackageBySlug,
  getTourPackageSlugs,
} from "@/lib/tourPackages";

const SITE_URL = "https://www.khaturidescg.in";
const PHONE = "9244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* -------------------------------------------------------------------------- */
/* Static Params                                                              */
/* -------------------------------------------------------------------------- */

export function generateStaticParams() {
  return getTourPackageSlugs().map((slug) => ({
    slug,
  }));
}

/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourPackageBySlug(slug);

  if (!tour) {
    return {
      title: "Tour Package Not Found | Khatu Rides Travels",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${tour.title} from Chhattisgarh | Khatu Rides Travels`;

  const description = `${tour.title} from Chhattisgarh with private cab travel, flexible pickup, sightseeing and customizable itinerary. Book from Korba, Raipur, Bilaspur and other cities.`;

  const url = `${SITE_URL}/tour-packages/${tour.slug}`;

  return {
    title,
    description,

    keywords: [
      tour.title,
      `${tour.destination} tour package`,
      `${tour.destination} tour from Chhattisgarh`,
      `${tour.destination} cab package`,
      `${tour.destination} taxi from Chhattisgarh`,
      `${tour.destination} tour from Korba`,
      `${tour.destination} tour from Raipur`,
      `${tour.destination} tour from Bilaspur`,
      `${tour.destination} private cab`,
      "tour packages from Chhattisgarh",
      "Khatu Rides Travels",
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Khatu Rides Travels",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: tour.image.startsWith("http")
            ? tour.image
            : `${SITE_URL}${tour.image}`,
          width: 1200,
          height: 800,
          alt: tour.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        tour.image.startsWith("http")
          ? tour.image
          : `${SITE_URL}${tour.image}`,
      ],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* WhatsApp Icon                                                              */
/* -------------------------------------------------------------------------- */

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.6 5.96L.08 24l6.28-1.65a11.88 11.88 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.43Z"
        fill="currentColor"
      />
      <path
        d="M17.52 13.9c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.71.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
        fill="white"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Floating Mobile Actions                                                    */
/* -------------------------------------------------------------------------- */

function FloatingActions({ title }: { title: string }) {
  const whatsappText = encodeURIComponent(
    `Hello Khatu Rides Travels, I want to enquire about the ${title}. Please share package details, current price and availability.`
  );

  return (
    <details className="fixed bottom-5 right-4 z-50 md:hidden">
      {/* Main Floating Button */}
      <summary
        className="
          flex h-14 w-14 cursor-pointer list-none
          items-center justify-center
          rounded-full
          bg-[#071A3A]
          text-white
          shadow-[0_12px_35px_rgba(7,26,58,0.35)]
          ring-4 ring-white/80
          transition-all
          duration-300
          hover:scale-105
          [&::-webkit-details-marker]:hidden
        "
        aria-label="Open contact options"
      >
        {/* Phone icon */}
        <Phone
          size={22}
          fill="currentColor"
          className="transition-transform duration-300 group-open:rotate-45"
        />
      </summary>

      {/* Expandable Buttons */}
      <div className="absolute bottom-[68px] right-0 flex flex-col items-center gap-3">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Khatu Rides Travels"
          className="
            flex h-12 w-12 items-center justify-center
            rounded-full
            bg-[#25D366]
            text-white
            shadow-[0_10px_25px_rgba(37,211,102,0.35)]
            transition-all duration-300
            hover:scale-110
          "
        >
          <WhatsAppIcon size={21} />
        </a>

        {/* Call */}
        <a
          href={`tel:+91${PHONE}`}
          aria-label="Call Khatu Rides Travels"
          className="
            flex h-12 w-12 items-center justify-center
            rounded-full
            bg-[#E53935]
            text-white
            shadow-[0_10px_25px_rgba(229,57,53,0.35)]
            transition-all duration-300
            hover:scale-110
          "
        >
          <Phone size={20} fill="currentColor" />
        </a>
      </div>
    </details>
  );
}

/* -------------------------------------------------------------------------- */
/* Booking CTA                                                                */
/* -------------------------------------------------------------------------- */

function BookingButtons({
  title,
  compact = false,
}: {
  title: string;
  compact?: boolean;
}) {
  const whatsappText = encodeURIComponent(
    `Hello Khatu Rides Travels, I want to book/enquire about the ${title}. Please share the current package price, vehicle options, itinerary and availability.`
  );

  return (
    <div
      className={`flex ${
        compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"
      } gap-3`}
    >
      <a
        href={`tel:+91${PHONE}`}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#063B8F] px-6 text-sm font-black text-white shadow-[0_12px_30px_rgba(6,59,143,0.25)] transition hover:-translate-y-0.5 hover:bg-[#052f73]"
      >
        <Phone size={17} fill="currentColor" />
        Call Now
      </a>

      <a
        href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 text-sm font-black text-white shadow-[0_12px_30px_rgba(37,211,102,0.25)] transition hover:-translate-y-0.5"
      >
        <WhatsAppIcon size={19} />
        WhatsApp Enquiry
      </a>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function TourPackageDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const tour = getTourPackageBySlug(slug);

  if (!tour) {
    notFound();
  }

  const relatedPackages = getRelatedTourPackages(slug, 3);

  const pageUrl = `${SITE_URL}/tour-packages/${tour.slug}`;

  const imageUrl = tour.image.startsWith("http")
    ? tour.image
    : `${SITE_URL}${tour.image}`;

  /* ------------------------------------------------------------------------ */
  /* Structured Data                                                          */
  /* ------------------------------------------------------------------------ */

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tour Packages",
        item: `${SITE_URL}/tour-packages`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tour.title,
        item: pageUrl,
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: tour.title,
    description: tour.description,
    url: pageUrl,
    image: imageUrl,

    provider: {
      "@type": "LocalBusiness",
      name: "Khatu Rides Travels Co.",
      url: SITE_URL,
      telephone: `+91${PHONE}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Korba",
        addressRegion: "Chhattisgarh",
        addressCountry: "IN",
      },
    },

    areaServed: tour.pickupCities.map((city) => ({
      "@type": "City",
      name: city,
    })),

    serviceType: `${tour.destination} Tour Package`,
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ------------------------------------------------------------------ */}
      {/* JSON-LD                                                            */}
      {/* ------------------------------------------------------------------ */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <img
              src="/logo.png"
              alt="Khatu Rides Travels"
              className="h-10 w-auto sm:h-11"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className="rounded-xl px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#063B8F]"
            >
              Home
            </Link>

            <Link
              href="/#popular-routes"
              className="rounded-xl px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#063B8F]"
            >
              Popular Routes
            </Link>

            <Link
              href="/tour-packages"
              className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-700"
            >
              Tour Packages
            </Link>

            <Link
              href="/#fleet"
              className="rounded-xl px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#063B8F]"
            >
              Fleet
            </Link>

            <Link
              href="/#services"
              className="rounded-xl px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#063B8F]"
            >
              Services
            </Link>

            <Link
              href="/fare-calculator"
              className="ml-2 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-sm transition hover:bg-amber-300"
            >
              <Ticket size={14} />
              Fare Calculator
            </Link>

            <a
              href={`tel:+91${PHONE}`}
              className="ml-1 inline-flex items-center gap-2 rounded-xl bg-[#063B8F] px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-[#052f73]"
            >
              <Phone size={14} fill="currentColor" />
              Call Now
            </a>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:+91${PHONE}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#063B8F] text-white shadow-md"
              aria-label="Call Now"
            >
              <Phone size={17} fill="currentColor" />
            </a>

            <details className="relative">
              <summary
                className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full bg-slate-100 text-slate-900"
                aria-label="Open menu"
              >
                <span className="flex flex-col gap-1.5">
                  <span className="block h-0.5 w-5 bg-slate-900" />
                  <span className="block h-0.5 w-5 bg-slate-900" />
                  <span className="block h-0.5 w-5 bg-slate-900" />
                </span>
              </summary>

              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                <Link
                  href="/"
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold hover:bg-slate-50"
                >
                  Home
                  <ChevronRight size={15} />
                </Link>

                <Link
                  href="/#popular-routes"
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold hover:bg-slate-50"
                >
                  Popular Routes
                  <ChevronRight size={15} />
                </Link>

                <Link
                  href="/tour-packages"
                  className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-700"
                >
                  Tour Packages
                  <ChevronRight size={15} />
                </Link>

                <Link
                  href="/#fleet"
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold hover:bg-slate-50"
                >
                  Fleet
                  <ChevronRight size={15} />
                </Link>

                <Link
                  href="/#services"
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold hover:bg-slate-50"
                >
                  Services
                  <ChevronRight size={15} />
                </Link>

                <Link
                  href="/fare-calculator"
                  className="mt-1 flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950"
                >
                  <Ticket size={16} />
                  Fare Calculator
                </Link>
              </div>
            </details>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Call Strip                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="bg-[#071A3A] px-4 py-2 text-center text-[22px] font-bold text-white sm:hidden">
        टूर पैकेज बुक करने के लिए कॉल करें{" "}
        <a
          href={`tel:+91${PHONE}`}
          className="font-black text-[22px] text-amber-300"
        >
          {PHONE_DISPLAY}
        </a>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Breadcrumb                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-400"
        >
          <Link href="/" className="hover:text-[#063B8F]">
            Home
          </Link>

          <ChevronRight size={12} />

          <Link
            href="/tour-packages"
            className="hover:text-[#063B8F]"
          >
            Tour Packages
          </Link>

          <ChevronRight size={12} />

          <span className="text-slate-600">{tour.title}</span>
        </nav>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative isolate overflow-hidden bg-[#020B24]">
  {/* ------------------------------------------------------------------ */}
  {/* High Contrast Background                                           */}
  {/* ------------------------------------------------------------------ */}

  <div className="absolute inset-0 bg-[linear-gradient(115deg,#020B24_0%,#052B70_48%,#063B8F_100%)]" />

  {/* Electric blue glow */}
  <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-blue-500/25 blur-[100px]" />

  {/* Yellow glow */}
  <div className="absolute -bottom-40 left-[30%] h-[400px] w-[400px] rounded-full bg-amber-400/15 blur-[110px]" />

  {/* Decorative grid */}
  <div
    className="absolute inset-0 opacity-[0.07]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
      backgroundSize: "42px 42px",
    }}
  />

  {/* ------------------------------------------------------------------ */}
  {/* Content                                                             */}
  {/* ------------------------------------------------------------------ */}

  <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-9 sm:px-6 sm:py-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12 lg:px-8 lg:py-14">
    {/* ---------------------------------------------------------------- */}
    {/* LEFT CONTENT                                                     */}
    {/* ---------------------------------------------------------------- */}

    <div className="text-white">
      {/* Badge Row */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {tour.badge && (
          <span className="inline-flex items-center rounded-full bg-amber-400 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#071A3A] shadow-[0_8px_25px_rgba(251,191,36,0.25)]">
            {tour.badge}
          </span>
        )}

        <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
          {tour.category}
        </span>
      </div>

      {/* Destination */}
      <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-amber-300 sm:text-sm">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-[#071A3A] shadow-lg">
          <MapPin size={14} fill="currentColor" />
        </span>

        {tour.destination}
      </p>

      {/* H1 */}
      <h1 className="max-w-4xl text-[2.35rem] font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl lg:text-[4.15rem]">
        {tour.title}
      </h1>

      {/* Accent line */}
      <div className="mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500" />

      {/* Description */}
      <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-white/90 sm:text-lg sm:leading-8">
        {tour.shortDescription}
      </p>

      {/* ---------------------------------------------------------------- */}
      {/* Info Cards                                                       */}
      {/* ---------------------------------------------------------------- */}

      <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {/* Duration */}
        <div className="group rounded-2xl border border-white/20 bg-white/[0.10] p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:border-amber-300/60 hover:bg-white/[0.15]">
          <Clock3
            size={20}
            className="mb-3 text-amber-300"
          />

          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/60">
            Duration
          </p>

          <p className="mt-1 text-[12px] font-black leading-4 text-white sm:text-sm">
            {tour.duration}
          </p>
        </div>

        {/* Pickup */}
        <div className="group rounded-2xl border border-white/20 bg-white/[0.10] p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:border-amber-300/60 hover:bg-white/[0.15]">
          <Navigation
            size={20}
            className="mb-3 text-amber-300"
          />

          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/60">
            Pickup
          </p>

          <p className="mt-1 text-[12px] font-black leading-4 text-white sm:text-sm">
            {tour.pickup}
          </p>
        </div>

        {/* Travel */}
        <div className="group rounded-2xl border border-white/20 bg-white/[0.10] p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:border-amber-300/60 hover:bg-white/[0.15]">
          <Users
            size={20}
            className="mb-3 text-amber-300"
          />

          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/60">
            Travel
          </p>

          <p className="mt-1 text-[12px] font-black leading-4 text-white sm:text-sm">
            Private Cab
          </p>
        </div>

        {/* Booking */}
        <div className="group rounded-2xl border border-white/20 bg-white/[0.10] p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:border-amber-300/60 hover:bg-white/[0.15]">
          <Star
            size={20}
            className="mb-3 text-amber-300"
            fill="currentColor"
          />

          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/60">
            Booking
          </p>

          <p className="mt-1 text-[12px] font-black leading-4 text-white sm:text-sm">
            Easy Enquiry
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                              */}
      {/* ---------------------------------------------------------------- */}

      <div className="mt-7">
        <BookingButtons title={tour.title} />
      </div>

      <p className="mt-4 flex items-center gap-2 text-[10px] font-bold text-white/65 sm:text-xs">
        <ShieldCheck size={14} className="text-amber-300" />
        Latest price • Vehicle availability • Customized itinerary
      </p>
    </div>

    {/* ---------------------------------------------------------------- */}
    {/* RIGHT IMAGE                                                       */}
    {/* ---------------------------------------------------------------- */}

    <div className="relative">
      {/* Glow behind image */}
      <div className="absolute -inset-5 rounded-[38px] bg-amber-400/20 blur-[45px]" />

      <div className="relative overflow-hidden rounded-[30px] border border-white/25 bg-white/10 p-2 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="relative overflow-hidden rounded-[24px] bg-slate-200">
          <img
            src={tour.image}
            alt={`${tour.title} - Khatu Rides Travels`}
            className="aspect-[4/3] h-auto w-full object-cover transition duration-700 hover:scale-[1.02]"
          />

          {/* Image gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020B24]/95 via-[#020B24]/35 to-transparent" />

          {/* Price Card */}
          <div className="absolute bottom-4 left-4 right-4 rounded-[22px] border border-white/30 bg-[#020B24]/90 p-4 text-white shadow-2xl backdrop-blur-xl sm:p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">
                  Starting From
                </p>

                <p className="mt-1 text-3xl font-black tracking-tight text-amber-300 sm:text-4xl">
                  {tour.startingPrice}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/50">
                  Destination
                </p>

                <p className="mt-1 max-w-[145px] text-xs font-black leading-5 text-white sm:text-sm">
                  {tour.destination}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating image label */}
      <div className="absolute -bottom-4 -left-3 hidden rounded-2xl border border-white/20 bg-white px-4 py-3 shadow-xl sm:block">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-[#071A3A]">
            <Compass size={16} />
          </span>

          <div>
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
              Explore
            </p>

            <p className="text-[11px] font-black text-slate-950">
              Plan Your Journey
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Bottom accent */}
  <div className="relative h-1.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500" />
</section>

      {/* ------------------------------------------------------------------ */}
      {/* Quick Info                                                         */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">
          <div className="p-4 text-center">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Starting Price
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {tour.startingPrice}
            </p>
          </div>

          <div className="p-4 text-center">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Duration
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {tour.duration}
            </p>
          </div>

          <div className="p-4 text-center">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Pickup
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              Chhattisgarh
            </p>
          </div>

          <div className="p-4 text-center">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Travel Type
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              Private Cab
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Main Content                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div>
            {/* Overview */}

            <section>
              <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                  Tour Overview
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {tour.title} — Plan Your Journey
                </h2>
              </div>

              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                {tour.description}
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Khatu Rides Travels offers private cab travel with
                flexible pickup options from major cities across
                Chhattisgarh. Share your travel date, passenger count,
                pickup location and preferred vehicle with our booking
                team to receive the latest quotation.
              </p>
            </section>

            {/* Highlights */}

            <section className="mt-12">
              <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                  Why This Tour
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Tour Highlights
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {tour.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <Check size={16} strokeWidth={3} />
                    </span>

                    <p className="pt-1 text-sm font-bold text-slate-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Places */}

            <section className="mt-12">
              <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                  Explore
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Places Covered
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {tour.places.map((place) => (
                  <div
                    key={place}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#071A3A] text-amber-300">
                      <MapPin size={16} fill="currentColor" />
                    </span>

                    <span className="text-sm font-black text-slate-800">
                      {place}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary */}

            <section className="mt-12">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                  Suggested Plan
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {tour.duration} Itinerary
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The itinerary can be customized according to your
                  pickup city, travel dates and sightseeing requirements.
                </p>
              </div>

              <div className="relative space-y-4">
                <div className="absolute bottom-5 left-[19px] top-5 hidden w-px bg-slate-200 sm:block" />

                {tour.itinerary.map((item, index) => (
                  <div
                    key={`${item.day}-${index}`}
                    className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:pl-6"
                  >
                    <div className="flex gap-4">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-xs font-black text-slate-950 shadow-sm">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-amber-600">
                              {item.day}
                            </p>

                            <h3 className="mt-1 text-base font-black text-slate-950 sm:text-lg">
                              {item.title}
                            </h3>
                          </div>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
                            Private Cab
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.places.map((place) => (
                            <span
                              key={place}
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-600"
                            >
                              <MapPin size={11} />
                              {place}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pickup Cities */}

            <section className="mt-12 rounded-[28px] bg-[#071A3A] p-6 text-white sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
                  <Navigation size={20} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                    Pickup Available
                  </p>

                  <h2 className="mt-2 text-xl font-black sm:text-2xl">
                    Book This Tour From Chhattisgarh
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Pickup can be planned from major cities and nearby
                    areas. Final pickup point depends on your confirmed
                    itinerary.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {tour.pickupCities.map((city) => (
                  <span
                    key={city}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[10px] font-bold text-white/90"
                  >
                    {city}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <BookingButtons title={tour.title} compact />
              </div>
            </section>

            {/* Inclusions / Exclusions */}

            <section className="mt-12">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                      <Check size={18} strokeWidth={3} />
                    </span>

                    <h2 className="text-lg font-black text-slate-950">
                      Package Includes
                    </h2>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {tour.inclusions.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                      >
                        <Check
                          size={16}
                          className="mt-1 shrink-0 text-emerald-600"
                          strokeWidth={3}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white">
                      <X size={18} strokeWidth={3} />
                    </span>

                    <h2 className="text-lg font-black text-slate-950">
                      Not Included
                    </h2>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {tour.exclusions.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                      >
                        <X
                          size={16}
                          className="mt-1 shrink-0 text-red-500"
                          strokeWidth={3}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Suitable For */}

            <section className="mt-12">
              <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                  Perfect For
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Who Can Book This Tour?
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {tour.suitableFor.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>

            {/* SEO Content */}

            <section className="mt-12 rounded-[28px] bg-slate-50 p-6 sm:p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                Travel Guide
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {tour.destination} Tour from Chhattisgarh
              </h2>

              <div className="mt-5 space-y-5 text-sm leading-7 text-slate-600">
                <p>
                  Travelling from Chhattisgarh to{" "}
                  <strong className="font-black text-slate-800">
                    {tour.destination}
                  </strong>{" "}
                  is more convenient when your complete journey is
                  planned around a private cab. Khatu Rides Travels
                  provides private taxi travel for families, devotees,
                  senior citizens and groups looking for flexible
                  long-distance travel.
                </p>

                <p>
                  Depending on your starting location, the booking team
                  can plan pickup from{" "}
                  <strong className="font-black text-slate-800">
                    Korba, Raipur, Bilaspur, Raigarh, Ambikapur, Durg,
                    Bhilai
                  </strong>{" "}
                  and other nearby cities. The exact pickup point,
                  vehicle, route and package cost are confirmed before
                  booking.
                </p>

                <p>
                  This package can also be customized according to the
                  number of passengers, travel dates, preferred vehicle,
                  sightseeing requirements and number of travel days.
                  Contact Khatu Rides Travels to discuss your itinerary
                  and receive the latest quotation.
                </p>
              </div>
            </section>

            {/* FAQ */}

            <section className="mt-12">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                  FAQs
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {tour.faqs.map((faq, index) => (
                  <details
                    key={faq.question}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    open={index === 0}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-slate-900">
                      {faq.question}

                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 transition group-open:rotate-90">
                        <ChevronRight size={15} />
                      </span>
                    </summary>

                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {/* Final CTA */}

            <section className="mt-12 overflow-hidden rounded-[30px] bg-[#071A3A] p-6 text-white sm:p-9">
              <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      size={19}
                      className="text-amber-300"
                    />

                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                      Ready To Travel?
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                    Book Your {tour.destination} Tour
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                    Get the latest package quotation, vehicle options
                    and itinerary details directly from Khatu Rides
                    Travels.
                  </p>
                </div>

                <BookingButtons title={tour.title} />
              </div>
            </section>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Desktop Sidebar                                                   */}
          {/* ---------------------------------------------------------------- */}

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.08)]">
              <div className="bg-[#071A3A] p-6 text-white">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">
                  Book This Package
                </p>

                <h2 className="mt-2 text-xl font-black">
                  {tour.title}
                </h2>

                <div className="mt-5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Starting From
                  </p>

                  <p className="mt-1 text-3xl font-black text-white">
                    {tour.startingPrice}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock3 size={16} />
                  </span>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Duration
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      {tour.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <MapPin size={16} />
                  </span>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Destination
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      {tour.destination}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Users size={16} />
                  </span>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Travel Type
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      Private Cab
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <BookingButtons title={tour.title} compact />
                </div>

                <p className="text-center text-[9px] font-semibold leading-4 text-slate-400">
                  Final fare depends on pickup location, travel date,
                  vehicle and confirmed itinerary.
                </p>
              </div>
            </div>

            {/* Trust Box */}

            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#063B8F] shadow-sm">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-sm font-black text-slate-950">
                    Travel With Confidence
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-slate-500">
                    Private cab • Flexible planning
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Support
                  </p>

                  <p className="mt-1 text-xs font-black">
                    24×7
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Booking
                  </p>

                  <p className="mt-1 text-xs font-black">
                    Direct
                  </p>
                </div>
              </div>
            </div>

            {/* Calculator */}

            <Link
              href="/fare-calculator"
              className="mt-4 flex items-center justify-between rounded-3xl border border-amber-200 bg-amber-50 p-5 transition hover:-translate-y-0.5 hover:bg-amber-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                  <Ticket size={17} />
                </div>

                <div>
                  <p className="text-sm font-black text-slate-950">
                    Check Cab Fare
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-slate-500">
                    Use our fare calculator
                  </p>
                </div>
              </div>

              <ArrowRight size={17} />
            </Link>
          </aside>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Related Packages                                                   */}
      {/* ------------------------------------------------------------------ */}

      {relatedPackages.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                  Explore More
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Related Tour Packages
                </h2>

                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Explore more pilgrimage and private cab tour
                  packages from Khatu Rides Travels.
                </p>
              </div>

              <Link
                href="/tour-packages"
                className="inline-flex items-center gap-2 text-xs font-black text-[#063B8F]"
              >
                View All Packages
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {relatedPackages.map((related) => (
                <Link
                  key={related.slug}
                  href={`/tour-packages/${related.slug}`}
                  className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-800 shadow-sm">
                      {related.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-amber-600">
                      <MapPin size={11} />
                      {related.destination}
                    </p>

                    <h3 className="mt-2 text-lg font-black leading-tight text-slate-950">
                      {related.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                      {related.shortDescription}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                          Starting From
                        </p>

                        <p className="mt-1 text-sm font-black text-slate-950">
                          {related.startingPrice}
                        </p>
                      </div>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#071A3A] text-white transition group-hover:bg-amber-400 group-hover:text-slate-950">
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Final Contact Strip                                                */}
      {/* ------------------------------------------------------------------ */}

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-5 rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-sm sm:flex-row sm:text-left sm:p-7">
            <div>
              <p className="text-lg font-black text-slate-950">
                Need a customized itinerary?
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Call or WhatsApp Khatu Rides Travels for your exact
                travel requirement.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <a
                href={`tel:+91${PHONE}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-5 text-xs font-black text-white"
              >
                <Phone size={15} fill="currentColor" />
                {PHONE_DISPLAY}
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-xs font-black text-white"
              >
                <WhatsAppIcon size={17} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                             */}
      {/* ------------------------------------------------------------------ */}

      <Footer />

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Floating Actions                                            */}
      {/* ------------------------------------------------------------------ */}

      <FloatingActions title={tour.title} />
    </main>
  );
}
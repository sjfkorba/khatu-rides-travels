import Link from "next/link";
import {
  ArrowRight,
  Car,
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";
import TrackedCallButton from "@/components/TrackedCallButton";

import { PHONE, PHONE_DISPLAY, WHATSAPP } from "@/components/landing/data";
import { routeDatabase } from "@/lib/routeDatabase";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/XGzQoFuhnQkefhzo9";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Khatu%20Rides%20Travels%20Co.%2C%20Korba%2C%20Chhattisgarh&output=embed";

const serviceLinks = [
  { href: "/services/one-way-taxi-raipur", label: "One Way Taxi" },
  { href: "/services/round-trip-cab", label: "Round Trip Taxi" },
  { href: "/services/airport-taxi", label: "Airport Transfers" },
  { href: "/services/outstation-cab", label: "Outstation Taxi" },
  { href: "/services/local-cab-rental", label: "Local Cab Rental" },
  { href: "/tour-packages", label: "Tour Packages" },
];

const companyLinks = [
  { href: "/about-us", label: "About Us" },
  { href: "/fleet", label: "Our Fleet" },
  { href: "/reviews", label: "Customer Reviews" },
  { href: "/contact-us", label: "Contact Us" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Cancellation & Refund" },
];

const tourLinks = [
  { href: "/tour-packages/khatu-shyam", label: "Khatu Shyam" },
  { href: "/tour-packages/ayodhya", label: "Ayodhya" },
  { href: "/tour-packages/ujjain", label: "Ujjain" },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 transition-colors hover:text-[#063B8F]"
    >
      <ChevronRight
        size={13}
        className="shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-amber-500"
      />
      <span>{children}</span>
    </Link>
  );
}

export default function Footer() {
  const popularRouteLinks = Object.keys(routeDatabase)
    .slice(0, 6)
    .map((slug) => ({
      label: routeDatabase[slug].title,
      href: `/routes/${slug}`,
    }));

  return (
    <footer id="footer" className="bg-white text-slate-900">
      {/* Booking call-to-action */}
      <section className="border-y border-slate-200 bg-[#F7F9FC]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600">
              Your journey, our priority
            </p>
            <h2 className="mt-1.5 text-xl font-extrabold tracking-tight text-[#10233F] sm:text-2xl">
              Need a cab? Let&apos;s get you moving.
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-slate-500">
              Book one-way, round-trip, airport and outstation taxis with Khatu
              Rides Travels Co.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <TrackedCallButton
              href={`tel:${PHONE}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#052F70] active:scale-[0.98]"
            >
              <Phone size={16} />
              Call to Book
            </TrackedCallButton>
            <TrackedWhatsAppButton
              href={`https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20cab`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 active:scale-[0.98]"
            >
              <MessageCircle size={17} />
              WhatsApp
            </TrackedWhatsAppButton>
          </div>
        </div>
      </section>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.8fr_0.9fr_0.75fr] lg:gap-8">
          {/* Brand and office map */}
          <div className="grid min-w-0 gap-6 sm:grid-cols-[0.9fr_1.1fr] lg:grid-cols-1 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="min-w-0">
              <Link
                href="/"
                aria-label="Khatu Rides Travels home"
                className="inline-flex"
              >
                <img
                  src="/new_logo.png"
                  alt="Khatu Rides Travels Co."
                  className="h-[66px] w-[170px] object-contain object-left"
                />
              </Link>

              <p className="mt-4 max-w-sm text-[13px] leading-6 text-slate-500">
                Cab booking and travel services for local, airport, outstation
                and intercity journeys across Chhattisgarh and nearby states.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600">
                <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
                Direct booking assistance
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <TrackedCallButton
                  href={`tel:${PHONE}`}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#063B8F] px-3.5 text-xs font-bold text-white transition hover:bg-[#052F70]"
                >
                  <Phone size={14} />
                  Call
                </TrackedCallButton>
                <TrackedWhatsAppButton
                  href={`https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20cab`}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#EAF9F0] px-3.5 text-xs font-bold text-emerald-700 transition hover:bg-[#D8F4E3]"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </TrackedWhatsAppButton>
              </div>
            </div>

            {/* Keep the Google map visible */}
            <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-3.5 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <MapPin size={16} className="shrink-0 text-amber-600" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-900">
                      Khatu Rides Travels Co.
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Korba, Chhattisgarh
                    </p>
                  </div>
                </div>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Khatu Rides office in Google Maps"
                  className="shrink-0 text-[10px] font-bold text-[#063B8F] hover:text-amber-600"
                >
                  Directions
                  <ArrowRight size={11} className="ml-1 inline" />
                </a>
              </div>

              <div className="relative h-[190px] bg-slate-100 sm:h-[210px] lg:h-[190px]">
                <iframe
                  title="Khatu Rides Travels Co. office location in Korba on Google Maps"
                  src={GOOGLE_MAPS_EMBED_URL}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Taxi services">
            <h3 className="text-sm font-extrabold text-[#10233F]">
              Taxi Services
            </h3>
            <ul className="mt-4 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
              <li>
                <FooterLink href="/fare-calculator">Fare Calculator</FooterLink>
              </li>
            </ul>
          </nav>

          {/* Routes and tours */}
          <div>
            <nav aria-label="Popular taxi routes">
              <h3 className="text-sm font-extrabold text-[#10233F]">
                Popular Routes
              </h3>
              <ul className="mt-4 space-y-3">
                {popularRouteLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
              <Link
                href="/routes"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#063B8F] transition hover:text-amber-600"
              >
                View all routes <ArrowRight size={13} />
              </Link>
            </nav>

            <nav aria-label="Popular tour packages" className="mt-7">
              <h3 className="text-sm font-extrabold text-[#10233F]">
                Popular Tours
              </h3>
              <ul className="mt-4 space-y-3">
                {tourLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Company, contact and legal */}
          <div>
            <nav aria-label="Company information">
              <h3 className="text-sm font-extrabold text-[#10233F]">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-7">
              <h3 className="text-sm font-extrabold text-[#10233F]">
                Booking Support
              </h3>
              <a
                href={`tel:${PHONE}`}
                className="mt-3 inline-flex items-center gap-2 text-[13px] font-bold text-slate-700 transition hover:text-[#063B8F]"
              >
                <Phone size={15} className="text-slate-400" />
                {PHONE_DISPLAY}
              </a>
              <p className="mt-1 text-[11px] text-slate-500">
                Call or WhatsApp for booking assistance
              </p>
            </div>

            <nav aria-label="Legal policies" className="mt-7">
              <h3 className="text-sm font-extrabold text-[#10233F]">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Service coverage */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Service coverage
          </p>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            Korba · Raipur · Bilaspur · Raigarh · Durg-Bhilai · Ambikapur ·
            Jagdalpur · Jharsuguda · Sambalpur · Nagpur and nearby destinations
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-200 bg-[#F7F9FC]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
          <p className="text-[11px] font-medium text-slate-500">
            © {new Date().getFullYear()} Khatu Rides Travels Co. All rights
            reserved.
          </p>
          <p className="text-[11px] font-medium text-slate-400">
            Serving Chhattisgarh and neighbouring states.
          </p>
        </div>
      </div>
    </footer>
  );
}

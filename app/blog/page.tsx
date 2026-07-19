import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  PhoneCall,
  MessageCircle,
  MapPin,
  Clock3,
  ShieldCheck,
  CarTaxiFront,
  Plane,
  BadgeCheck,
} from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { blogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Taxi Fare Guide & Cab Booking Blog | Khatu Rides Travels",
  description:
    "Book one-way taxi, airport cab and round trip services with Khatu Rides Travels. Explore taxi fare guides, route details and travel tips across Chhattisgarh.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#fffaf5] text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.18),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
              <CarTaxiFront size={16} />
              Trusted Taxi Service Across Chhattisgarh
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Taxi Fare Guides, Cab Booking Tips & Airport Transfer Information
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              Looking for reliable taxi booking from Raipur, Korba, Bilaspur or
              airport routes? Explore detailed fare guides, one-way taxi
              options, airport pickup details and intercity cab booking insights
              by Khatu Rides Travels.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:+919244137353"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <PhoneCall size={18} />
                Call Now
              </a>

              <a
                href="https://wa.me/919244137353"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <MessageCircle size={18} />
                WhatsApp Booking
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-orange-300">
                  <ShieldCheck size={18} />
                  <span className="text-sm font-semibold">Trusted Service</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Transparent pricing and reliable cab support for local and
                  intercity travel.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-orange-300">
                  <Plane size={18} />
                  <span className="text-sm font-semibold">Airport Transfers</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Raipur airport pickup and drop service with comfortable taxi
                  options.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-orange-300">
                  <Clock3 size={18} />
                  <span className="text-sm font-semibold">Quick Response</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Fast booking assistance for one-way cab, round trip and urgent
                  travel plans.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-200/20 bg-white p-6 text-slate-900 shadow-2xl shadow-black/20">
            <div className="rounded-2xl bg-orange-50 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-700">
                Instant Booking Help
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900">
                Need a taxi today?
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Book one-way taxi, airport cab, round trip cab and outstation
                taxi service with Khatu Rides Travels.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <a
                href="tel:+919244137353"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-orange-300 hover:bg-orange-50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Call for Booking
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-900">
                    +91 9244137353
                  </p>
                </div>
                <PhoneCall className="text-orange-600" size={22} />
              </a>

              <a
                href="https://wa.me/919244137353"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-green-300 hover:bg-green-50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    WhatsApp Support
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-900">
                    Chat for Fare & Availability
                  </p>
                </div>
                <MessageCircle className="text-green-600" size={22} />
              </a>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-900">
                Popular Taxi Services
              </p>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <BadgeCheck size={16} className="mt-0.5 text-orange-600" />
                  One-way taxi booking
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck size={16} className="mt-0.5 text-orange-600" />
                  Raipur airport to Korba cab
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck size={16} className="mt-0.5 text-orange-600" />
                  Round-trip family taxi service
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck size={16} className="mt-0.5 text-orange-600" />
                  Corporate and business travel cab
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-orange-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:px-8 md:grid-cols-4">
          <div className="rounded-2xl bg-orange-50 p-5">
            <div className="flex items-center gap-2 text-orange-700">
              <MapPin size={18} />
              <p className="text-sm font-bold">Service Coverage</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Raipur, Korba, Bilaspur, Raigarh and major Chhattisgarh routes.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-5">
            <div className="flex items-center gap-2 text-orange-700">
              <CarTaxiFront size={18} />
              <p className="text-sm font-bold">Cab Options</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Sedan, Ertiga, Innova Crysta and comfortable outstation vehicles.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-5">
            <div className="flex items-center gap-2 text-orange-700">
              <Plane size={18} />
              <p className="text-sm font-bold">Airport Taxi</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Direct airport transfer with luggage-friendly comfortable rides.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-5">
            <div className="flex items-center gap-2 text-orange-700">
              <PhoneCall size={18} />
              <p className="text-sm font-bold">Booking Support</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Fast call and WhatsApp response for fare inquiry and cab booking.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
            Taxi Guides & Booking Content
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
            Explore fare guides and taxi booking articles
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
            These articles are written to help passengers understand taxi fares,
            route distance, travel time, airport transfer options, one-way cab
            availability and practical booking tips before confirming a ride.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              description={post.description}
              slug={post.slug}
              readTime={post.readTime}
            />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
              Why Travelers Choose Us
            </p>
            <h3 className="mt-3 text-3xl font-black text-slate-900">
              Built for real taxi booking intent
            </h3>

            <ul className="mt-6 space-y-4 text-slate-600">
              <li className="flex items-start gap-3">
                <BadgeCheck className="mt-1 text-orange-600" size={18} />
                One-way and round-trip taxi booking assistance
              </li>
              <li className="flex items-start gap-3">
                <BadgeCheck className="mt-1 text-orange-600" size={18} />
                Taxi fare clarity before booking confirmation
              </li>
              <li className="flex items-start gap-3">
                <BadgeCheck className="mt-1 text-orange-600" size={18} />
                Airport taxi support for Raipur arrivals and departures
              </li>
              <li className="flex items-start gap-3">
                <BadgeCheck className="mt-1 text-orange-600" size={18} />
                Useful route-based travel content for passengers
              </li>
              <li className="flex items-start gap-3">
                <BadgeCheck className="mt-1 text-orange-600" size={18} />
                Phone and WhatsApp support for quick bookings
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-slate-950 p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300">
              Book Your Taxi
            </p>
            <h3 className="mt-3 text-3xl font-black leading-tight">
              Ready to book a cab in Chhattisgarh?
            </h3>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-300">
              Contact Khatu Rides Travels for one-way cab booking, airport taxi,
              round trip travel, family travel and business travel assistance.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:+919244137353"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                <PhoneCall size={18} />
                Call for Booking
              </a>

              <a
                href="https://wa.me/919244137353"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <MessageCircle size={18} />
                WhatsApp Now
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">
                Need route-based fare details first?
              </p>
              <Link
                href="/blog/raipur-to-korba-taxi-fare-guide"
                className="mt-3 inline-flex items-center gap-2 text-base font-bold text-orange-300 transition hover:text-orange-200"
              >
                Read Raipur to Korba Taxi Fare Guide
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
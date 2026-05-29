import type { Metadata } from "next";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock3,
  Car,
  Star,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Khatu Rides Travels",
  description:
    "Contact Khatu Rides Travels for taxi booking, airport transfers, one-way taxi and outstation cab services across Chhattisgarh.",
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_40%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-orange-300 text-sm font-semibold">
            <Phone size={16} />
            Booking Support Available
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-black">
            Contact Khatu Rides Travels
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-8">
            Need a taxi in Raipur, Korba, Bilaspur,
            Raigarh or anywhere in Chhattisgarh?
            Contact us for airport transfers,
            one-way taxi, round trips and
            corporate travel bookings.
          </p>

        </div>

      </section>

      {/* CONTACT CARDS */}

      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">

        <div className="grid md:grid-cols-3 gap-6">

          <a
            href="tel:9244137353"
            className="bg-white rounded-3xl border p-8 hover:shadow-xl transition"
          >
            <Phone className="text-orange-600 mb-4" size={36} />

            <h2 className="text-2xl font-black">
              Call Us
            </h2>

            <p className="text-slate-600 mt-3">
              Speak directly with us for
              instant booking assistance.
            </p>

            <p className="mt-5 font-bold text-lg">
              +91 9244137353
            </p>
          </a>

          <a
            href="https://wa.me/919244137353"
            target="_blank"
            className="bg-white rounded-3xl border p-8 hover:shadow-xl transition"
          >
            <MessageCircle
              className="text-green-600 mb-4"
              size={36}
            />

            <h2 className="text-2xl font-black">
              WhatsApp Booking
            </h2>

            <p className="text-slate-600 mt-3">
              Send your travel details and
              receive fare information instantly.
            </p>

            <p className="mt-5 font-bold text-lg">
              Start Chat
            </p>
          </a>

          <div className="bg-white rounded-3xl border p-8">

            <MapPin
              className="text-orange-600 mb-4"
              size={36}
            />

            <h2 className="text-2xl font-black">
              Service Area
            </h2>

            <p className="text-slate-600 mt-3">
              We provide taxi services across
              Chhattisgarh.
            </p>

            <p className="mt-5 font-bold">
              Raipur, Korba, Bilaspur,
              Raigarh & Nearby Areas
            </p>

          </div>

        </div>

      </section>

      {/* BOOKING CTA */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-10 text-white">

          <h2 className="text-4xl font-black">
            Need Immediate Taxi Booking?
          </h2>

          <p className="mt-4 text-white/90 max-w-2xl">
            Share your pickup location,
            destination, travel date and
            passenger count on WhatsApp.
          </p>

          <a
            href="https://wa.me/919244137353?text=Hello%20Khatu%20Rides%20Travels,%20I%20need%20a%20taxi."
            className="inline-flex items-center gap-2 mt-8 bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold"
          >
            Book on WhatsApp
            <ArrowRight size={18} />
          </a>

        </div>

      </section>

      {/* SERVICE AREAS */}

      <section className="max-w-7xl mx-auto px-6 py-8">

        <h2 className="text-4xl font-black text-center mb-12">
          Areas We Serve
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            "Raipur",
            "Korba",
            "Bilaspur",
            "Raigarh",
            "Bhilai",
            "Durg",
            "Ambikapur",
            "Jagdalpur",
            "Raipur Airport",
          ].map((city) => (
            <div
              key={city}
              className="bg-white border rounded-2xl p-6 text-center font-semibold"
            >
              {city}
            </div>
          ))}

        </div>

      </section>

      {/* WHY CONTACT US */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-black text-center mb-12">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-3xl border p-8 text-center">

            <Car
              className="mx-auto text-orange-600 mb-4"
              size={40}
            />

            <h3 className="font-black text-xl">
              Clean Vehicles
            </h3>

            <p className="text-slate-600 mt-3">
              Comfortable and maintained vehicles.
            </p>

          </div>

          <div className="bg-white rounded-3xl border p-8 text-center">

            <ShieldCheck
              className="mx-auto text-orange-600 mb-4"
              size={40}
            />

            <h3 className="font-black text-xl">
              Trusted Service
            </h3>

            <p className="text-slate-600 mt-3">
              Reliable support and transparent pricing.
            </p>

          </div>

          <div className="bg-white rounded-3xl border p-8 text-center">

            <Star
              className="mx-auto text-orange-600 mb-4"
              size={40}
            />

            <h3 className="font-black text-xl">
              Customer Satisfaction
            </h3>

            <p className="text-slate-600 mt-3">
              Focused on providing a smooth travel experience.
            </p>

          </div>

        </div>

      </section>

      {/* BUSINESS HOURS */}

      <section className="max-w-5xl mx-auto px-6 pb-16">

        <div className="bg-white rounded-3xl border p-8">

          <div className="flex items-center gap-3 mb-5">

            <Clock3 className="text-orange-600" />

            <h2 className="text-3xl font-black">
              Business Hours
            </h2>

          </div>

          <p className="text-slate-600 leading-8">
            Booking enquiries are accepted daily.
            For urgent travel requirements,
            please contact us directly via
            phone call or WhatsApp.
          </p>

          <div className="mt-6 bg-orange-50 rounded-2xl p-5 border border-orange-200">

            <p className="font-bold text-orange-700">
              Phone: +91 9244137353
            </p>

            <p className="font-bold text-green-700 mt-2">
              WhatsApp Support Available
            </p>

          </div>

        </div>

      </section>

      {/* REVIEW CTA */}

      <section className="bg-slate-950 text-white">

        <div className="max-w-6xl mx-auto px-6 py-16 text-center">

          <h2 className="text-4xl font-black">
            Share Your Experience
          </h2>

          <p className="mt-4 text-slate-300">
            Your feedback helps us improve and
            serve travelers better.
          </p>

          <a
            href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK"
            target="_blank"
            className="inline-block mt-8 bg-orange-600 px-8 py-4 rounded-2xl font-bold"
          >
            Leave a Google Review
          </a>

        </div>

      </section>

    </main>
  );
}
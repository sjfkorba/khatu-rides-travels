import type { Metadata } from "next";
import Link from "next/link";
import {
  Car,
  ShieldCheck,
  Clock3,
  Phone,
  MapPin,
  Star,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Khatu Rides Travels - Trusted Taxi Service in Chhattisgarh",
  description:
    "Learn about Khatu Rides Travels, a trusted taxi service provider in Chhattisgarh offering airport transfers, outstation cabs, one-way taxi and round trip services across Raipur, Korba, Bilaspur and nearby cities.",
  keywords: [
    "Khatu Rides Travels",
    "Taxi Service in Chhattisgarh",
    "Taxi Service in Raipur",
    "Taxi Service in Korba",
    "Taxi Service in Bilaspur",
    "Airport Taxi Service",
    "Outstation Cab Chhattisgarh",
  ],
};

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_40%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-orange-300 text-sm font-semibold">
            <Car size={16} />
            Trusted Taxi Service Across Chhattisgarh
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-black max-w-4xl">
            About Khatu Rides Travels
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-8">
            Khatu Rides Travels is a customer-focused taxi service
            provider offering reliable airport transfers, one-way
            taxi bookings, round trips and outstation travel across
            Chhattisgarh. Our goal is simple — provide safe,
            comfortable and affordable travel with professional service.
          </p>

        </div>

      </section>

      {/* MAIN CONTENT */}

      <section className="max-w-6xl mx-auto px-6 py-16 space-y-8">

        <div className="bg-white rounded-3xl border p-8 md:p-10">

          <h2 className="text-3xl font-black mb-6">
            Our Story
          </h2>

          <div className="space-y-6 text-slate-600 leading-8">

            <p>
              Khatu Rides Travels was established with a simple vision:
              making intercity and airport travel more reliable,
              transparent and customer-friendly. Many travelers face
              common issues such as last-minute cancellations,
              unclear pricing, poor vehicle conditions and lack of
              communication from drivers.
            </p>

            <p>
              We built our service around solving these problems.
              Whether a customer needs a taxi from Raipur to Korba,
              Bilaspur to Raipur, Raipur Airport to Korba or any
              other destination in Chhattisgarh, our focus remains
              on providing a smooth booking experience and dependable
              transportation.
            </p>

            <p>
              Today, Khatu Rides Travels serves individuals,
              families, corporate clients, travel partners and
              business travelers who need safe and comfortable
              transportation across the state.
            </p>

          </div>

        </div>

        {/* MISSION */}

        <div className="bg-white rounded-3xl border p-8 md:p-10">

          <h2 className="text-3xl font-black mb-6">
            Our Mission
          </h2>

          <p className="text-slate-600 leading-8">
            Our mission is to become one of the most trusted taxi
            service providers in Chhattisgarh by offering transparent
            pricing, punctual service, clean vehicles and responsive
            customer support. We believe that every journey should be
            safe, comfortable and stress-free.
          </p>

        </div>

        {/* WHY CHOOSE US */}

        <div className="bg-white rounded-3xl border p-8 md:p-10">

          <h2 className="text-3xl font-black mb-8">
            Why Choose Khatu Rides Travels?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {[
              "Transparent Pricing",
              "Reliable Airport Transfers",
              "Clean & Comfortable Vehicles",
              "Professional Drivers",
              "One Way & Round Trip Services",
              "Quick WhatsApp Support",
              "Corporate Travel Solutions",
              "Coverage Across Chhattisgarh",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="text-green-600" />
                <span>{item}</span>
              </div>
            ))}

          </div>

        </div>

        {/* SERVICE AREAS */}

        <div className="bg-white rounded-3xl border p-8 md:p-10">

          <h2 className="text-3xl font-black mb-6">
            Areas We Serve
          </h2>

          <div className="space-y-5 text-slate-600 leading-8">

            <p>
              We provide taxi services across major cities and routes
              in Chhattisgarh including:
            </p>

            <ul className="grid md:grid-cols-2 gap-3">
              <li>• Taxi Service in Raipur</li>
              <li>• Taxi Service in Korba</li>
              <li>• Taxi Service in Bilaspur</li>
              <li>• Taxi Service in Raigarh</li>
              <li>• Raipur Airport Taxi Service</li>
              <li>• Bhilai Taxi Service</li>
              <li>• Durg Taxi Service</li>
              <li>• Ambikapur Taxi Service</li>
              <li>• Jagdalpur Taxi Service</li>
            </ul>

            <p>
              We also provide one-way taxi services, round trips,
              outstation cab bookings and airport pickup-drop services
              for travelers across Chhattisgarh.
            </p>

          </div>

        </div>

        {/* POPULAR ROUTES */}

        <div className="bg-white rounded-3xl border p-8 md:p-10">

          <h2 className="text-3xl font-black mb-6">
            Popular Routes
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <Link
              href="/routes/raipur-to-korba-taxi"
              className="border rounded-2xl p-4 hover:border-orange-500"
            >
              Raipur to Korba Taxi
            </Link>

            <Link
              href="/routes/raipur-to-bilaspur-taxi"
              className="border rounded-2xl p-4 hover:border-orange-500"
            >
              Raipur to Bilaspur Taxi
            </Link>

            <Link
              href="/routes/raipur-to-raigarh-taxi"
              className="border rounded-2xl p-4 hover:border-orange-500"
            >
              Raipur to Raigarh Taxi
            </Link>

            <Link
              href="/routes/raipur-airport-taxi"
              className="border rounded-2xl p-4 hover:border-orange-500"
            >
              Raipur Airport Taxi
            </Link>

          </div>

        </div>

        {/* VALUES */}

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-white border rounded-3xl p-6 text-center">
            <ShieldCheck className="mx-auto text-orange-600 mb-3" />
            <h3 className="font-bold">
              Safe Travel
            </h3>
          </div>

          <div className="bg-white border rounded-3xl p-6 text-center">
            <Clock3 className="mx-auto text-orange-600 mb-3" />
            <h3 className="font-bold">
              On-Time Service
            </h3>
          </div>

          <div className="bg-white border rounded-3xl p-6 text-center">
            <Star className="mx-auto text-orange-600 mb-3" />
            <h3 className="font-bold">
              Customer Satisfaction
            </h3>
          </div>

          <div className="bg-white border rounded-3xl p-6 text-center">
            <MapPin className="mx-auto text-orange-600 mb-3" />
            <h3 className="font-bold">
              Statewide Coverage
            </h3>
          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="bg-orange-600 text-white">

        <div className="max-w-6xl mx-auto px-6 py-16 text-center">

          <h2 className="text-4xl font-black">
            Ready To Book Your Taxi?
          </h2>

          <p className="mt-4 text-white/90">
            Airport Transfers • One Way Taxi • Round Trip • Corporate Travel
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">

            <a
              href="https://wa.me/919244137353"
              className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold"
            >
              WhatsApp Now
            </a>

            <a
              href="tel:9244137353"
              className="border border-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2"
            >
              <Phone size={18} />
              Call 9244137353
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import TopBar from "@/components/TopBar";

import {
  Phone,
  MessageCircle,
  Car,
  ShieldCheck,
  Clock3,
  Star,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Building2,
  Plane,
} from "lucide-react";

const vehicles = [
  {
    name: "Dzire",
    type: "Sedan",
    price: "₹11/km onwards",
    seats: "4+1",
    luggage: "2 Bags",
    image:
      "https://content.carlelo.com/media/models/Dzire/base/maruti-suzuki-dzire-1.webp",
  },

  {
    name: "Ertiga",
    type: "7 Seater",
    price: "₹14/km onwards",
    seats: "6+1",
    luggage: "4 Bags",
    image:
      "https://imgd.aeplcdn.com/642x361/n/cw/ec/171147/maruti-suzuki-ertiga-left-rear-three-quarter0.jpeg?isig=0&q=75",
  },

  {
    name: "Innova Crysta",
    type: "Premium SUV",
    price: "₹18/km onwards",
    seats: "7+1",
    luggage: "5 Bags",
    image:
      "https://stimg.cardekho.com/images/expert-review/select-model/20250728_160805/930x620/5_1200x67520250728_160805.jpg",
  },
];

const popularRoutes = [
  {
    title: "Raipur to Korba",
    fare: "₹2800+",
    link: "/routes/raipur-to-korba-taxi",
  },

  {
    title: "Raipur to Bilaspur",
    fare: "₹2200+",
    link: "/routes/raipur-to-bilaspur-taxi",
  },

  {
    title: "Raipur to Raigarh",
    fare: "₹3500+",
    link: "/routes/raipur-to-raigarh-taxi",
  },

  {
    title: "Airport to Korba",
    fare: "₹3000+",
    link: "/routes/raipur-airport-to-korba-taxi",
  },

  {
    title: "Airport to Bilaspur",
    fare: "₹2500+",
    link: "/routes/raipur-airport-to-bilaspur-taxi",
  },

  {
    title: "Korba to Bilaspur",
    fare: "₹1800+",
    link: "/routes/korba-to-bilaspur-taxi",
  },
];

const faqs = [
  {
    q: "What is the Raipur to Korba taxi fare?",
    a: "Taxi fare starts from approximately ₹2800 depending on vehicle type and travel date.",
  },

  {
    q: "Do you provide airport pickup service?",
    a: "Yes. Airport pickup and drop services are available across Chhattisgarh.",
  },

  {
    q: "Can I book one-way taxi?",
    a: "Yes. One-way taxi services are available on most routes.",
  },

  {
    q: "Do you provide GST invoices?",
    a: "Yes. GST invoices can be provided for eligible bookings.",
  },
];
const reviews = [
  {
    name: "Amit Verma",
    city: "Raipur",
    review:
      "Excellent taxi service. Clean vehicle and professional driver.",
  },
  {
    name: "Sanjay Agrawal",
    city: "Korba",
    review:
      "Airport pickup was on time and the journey was comfortable.",
  },
  {
    name: "Rohit Sharma",
    city: "Bilaspur",
    review:
      "Best taxi service for business travel across Chhattisgarh.",
  },
  {
    name: "Deepak Yadav",
    city: "Raigarh",
    review:
      "Transparent fare and quick WhatsApp support.",
  },
  {
    name: "Pooja Singh",
    city: "Raipur",
    review:
      "Family trip was smooth and comfortable.",
  },
  {
    name: "Nitin Gupta",
    city: "Korba",
    review:
      "Booked Ertiga for airport transfer. Great experience.",
  },
  {
    name: "Rajesh Patel",
    city: "Bilaspur",
    review:
      "Professional driver and well maintained vehicle.",
  },
  {
    name: "Mukesh Agrawal",
    city: "Raipur",
    review:
      "Affordable pricing and hassle free booking process.",
  },
  {
    name: "Vivek Sahu",
    city: "Raigarh",
    review:
      "Reliable taxi service for monthly corporate travel.",
  },
  {
    name: "Aakash Jain",
    city: "Korba",
    review:
      "Quick confirmation and smooth journey.",
  },
  {
    name: "Shubham Verma",
    city: "Raipur",
    review:
      "Best option for one way taxi bookings.",
  },
  {
    name: "Ashish Gupta",
    city: "Bilaspur",
    review:
      "Airport taxi service was perfectly managed.",
  },
  {
    name: "Pankaj Sharma",
    city: "Raigarh",
    review:
      "Comfortable trip and transparent billing.",
  },
  {
    name: "Ravi Tiwari",
    city: "Raipur",
    review:
      "Driver was polite and vehicle was very clean.",
  },
  {
    name: "Anjali Soni",
    city: "Korba",
    review:
      "Great support team and timely pickup.",
  },
  {
    name: "Manoj Patel",
    city: "Bilaspur",
    review:
      "Good service for family travel.",
  },
  {
    name: "Rakesh Agrawal",
    city: "Raigarh",
    review:
      "Highly recommended for airport transfers.",
  },
  {
    name: "Harsh Jain",
    city: "Raipur",
    review:
      "Professional and trustworthy service.",
  },
  {
    name: "Abhishek Sahu",
    city: "Korba",
    review:
      "Very convenient booking process.",
  },
  {
    name: "Vikas Verma",
    city: "Bilaspur",
    review:
      "Comfortable long-distance journey.",
  },
];

export default function HomePage() {

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const whatsappUrl = `https://wa.me/919244137353?text=${encodeURIComponent(
    `Hello Khatu Rides Travels,
Pickup: ${pickup}
Drop: ${drop}`
  )}`;

    return (
      <>
      <TopBar />
      
    <main className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}

      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_35%)]" />

        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-24">

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-orange-300 text-sm font-semibold">

                ⭐ Trusted Taxi Service in Chhattisgarh

              </div>

              <h1 className="mt-6 text-4xl md:text-6xl font-black leading-tight">

                Book Reliable Taxi Service Across

                <span className="text-orange-500">
                  {" "}Chhattisgarh
                </span>

              </h1>

              <p className="mt-6 text-lg text-slate-300 leading-8">

                Airport Transfer • One Way Taxi • Round Trip

                <br />

                Raipur • Korba • Bilaspur • Raigarh

              </p>

              <div className="grid grid-cols-2 gap-3 mt-8">

                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  ✓ Transparent Fare
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  ✓ Verified Drivers
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  ✓ Clean Vehicles
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  ✓ 24×7 Support
                </div>

              </div>

              <div className="flex flex-wrap gap-4 mt-8">

                <a
                  href={whatsappUrl}
                  target="_blank"
                  className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl font-bold transition"
                >
                  Get Fare on WhatsApp
                </a>

                <a
                  href="tel:9244137353"
                  className="border border-white px-8 py-4 rounded-2xl font-bold"
                >
                  Call Now
                </a>

              </div>

            </div>

            {/* RIGHT FORM */}

            <div>

              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl">

                <h2 className="text-2xl font-black text-slate-900">

                  Get Instant Fare Quote

                </h2>

                <p className="text-slate-500 mt-2">
                  Get fare & availability in under 2 minutes.
                </p>

                <div className="space-y-4 mt-6">

                  <input
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Pickup Location"
                    className="w-full border rounded-xl px-4 py-4 text-black"
                  />

                  <input
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    placeholder="Drop Location"
                    className="w-full border rounded-xl px-4 py-4 text-black"
                  />

                  <input
                    type="date"
                    className="w-full border rounded-xl px-4 py-4 text-black"
                  />

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    className="block text-center bg-orange-500 text-white py-4 rounded-xl font-bold"
                  >
                    Check Fare Now
                  </a>

                </div>

                <div className="mt-5 text-sm text-slate-500">

                  Example:

                  <span className="font-semibold">
                    {" "}
                    Raipur → Korba
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* TRUST BAR */}

      <section className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">

            <div>

              <p className="text-3xl font-black text-orange-600">
                1000+
              </p>

              <p className="text-slate-600">
                Trips Completed
              </p>

            </div>

            <div>

              <p className="text-3xl font-black text-orange-600">
                24×7
              </p>

              <p className="text-slate-600">
                Support
              </p>

            </div>

            <div>

              <p className="text-3xl font-black text-orange-600">
                100%
              </p>

              <p className="text-slate-600">
                Transparent Fare
              </p>

            </div>

            <div>

              <p className="text-3xl font-black text-orange-600">
                4.9★
              </p>

              <p className="text-slate-600">
                Customer Rating
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* POPULAR ROUTES */}

      <section className="max-w-7xl mx-auto px-4 py-16">

        <div className="text-center mb-12">

          <h2 className="text-4xl font-black">

            Popular Taxi Routes

          </h2>

          <p className="text-slate-600 mt-4">

            Most booked routes across Chhattisgarh

          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {popularRoutes.map((route) => (

            <Link
              key={route.title}
              href={route.link}
              className="bg-white border rounded-3xl p-6 hover:border-orange-500 hover:shadow-lg transition"
            >

              <h3 className="text-xl font-black">
                {route.title}
              </h3>

              <p className="text-orange-600 font-bold mt-3">
                Starting {route.fare}
              </p>

              <p className="mt-4 text-slate-500">
                View Route →
              </p>

            </Link>

          ))}

        </div>

      </section>
            {/* WHY CHOOSE US */}

      <section className="bg-slate-100 py-20">

        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-14">

            <h2 className="text-4xl md:text-5xl font-black">

              Why Choose Khatu Rides Travels?

            </h2>

            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">

              Trusted by travelers across Chhattisgarh for airport transfers,
              one-way taxi bookings, corporate travel and family trips.

            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white rounded-3xl p-6 shadow-sm">

              <ShieldCheck
                className="text-orange-500 mb-4"
                size={40}
              />

              <h3 className="font-black text-xl">
                Safe & Reliable
              </h3>

              <p className="text-slate-600 mt-3">
                Professional service with customer-first approach.
              </p>

            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">

              <Clock3
                className="text-orange-500 mb-4"
                size={40}
              />

              <h3 className="font-black text-xl">
                On-Time Pickup
              </h3>

              <p className="text-slate-600 mt-3">
                Airport and city pickups without delays.
              </p>

            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">

              <Star
                className="text-orange-500 mb-4"
                size={40}
              />

              <h3 className="font-black text-xl">
                Transparent Pricing
              </h3>

              <p className="text-slate-600 mt-3">
                No hidden charges. Clear fare information.
              </p>

            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">

              <Phone
                className="text-orange-500 mb-4"
                size={40}
              />

              <h3 className="font-black text-xl">
                Quick Support
              </h3>

              <p className="text-slate-600 mt-3">
                Call or WhatsApp for instant booking assistance.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* FLEET SECTION */}

      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="text-center mb-14">

          <h2 className="text-4xl md:text-5xl font-black">

            Available Vehicles

          </h2>

          <p className="text-slate-600 mt-4">

            Comfortable vehicles for every travel need

          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {vehicles.map((vehicle) => (

            <div
              key={vehicle.name}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border"
            >

              <div className="relative h-56">

                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-6">

                <h3 className="text-2xl font-black">
                  {vehicle.name}
                </h3>

                <p className="text-orange-600 font-semibold mt-2">
                  {vehicle.type}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-5">

                  <div className="bg-slate-100 rounded-xl p-3">

                    <p className="text-xs text-slate-500">
                      Seats
                    </p>

                    <p className="font-bold">
                      {vehicle.seats}
                    </p>

                  </div>

                  <div className="bg-slate-100 rounded-xl p-3">

                    <p className="text-xs text-slate-500">
                      Luggage
                    </p>

                    <p className="font-bold">
                      {vehicle.luggage}
                    </p>

                  </div>

                </div>

                <div className="mt-5 flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      Starting
                    </p>

                    <p className="text-xl font-black text-orange-600">
                      {vehicle.price}
                    </p>

                  </div>

                  <a
                    href="https://wa.me/919244137353"
                    target="_blank"
                    className="bg-orange-500 text-white px-5 py-3 rounded-xl font-bold"
                  >
                    Book
                  </a>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* AIRPORT TAXI */}

      <section className="bg-slate-950 text-white py-20">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>

              <Plane
                size={60}
                className="text-orange-500"
              />

              <h2 className="text-4xl md:text-5xl font-black mt-6">

                Raipur Airport Taxi Service

              </h2>

              <p className="mt-6 text-slate-300 leading-8">

                Book airport pickup and drop services from
                Swami Vivekananda Airport to Korba, Bilaspur,
                Raigarh and other destinations across Chhattisgarh.

              </p>

              <a
                href="/routes/raipur-airport-taxi"
                className="inline-flex items-center gap-2 mt-8 bg-orange-500 px-8 py-4 rounded-2xl font-bold"
              >
                Explore Airport Taxi
                <ArrowRight size={18} />
              </a>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

              <ul className="space-y-5">

                <li className="flex gap-3">
                  <CheckCircle2 className="text-green-400" />
                  Flight Tracking Support
                </li>

                <li className="flex gap-3">
                  <CheckCircle2 className="text-green-400" />
                  Direct Airport Pickup
                </li>

                <li className="flex gap-3">
                  <CheckCircle2 className="text-green-400" />
                  Comfortable Luggage Space
                </li>

                <li className="flex gap-3">
                  <CheckCircle2 className="text-green-400" />
                  Advance Booking Available
                </li>

              </ul>

            </div>

          </div>

        </div>

      </section>

      {/* CORPORATE TRAVEL */}

      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-10 text-white">

          <Building2 size={52} />

          <h2 className="text-4xl font-black mt-6">

            Corporate Travel Solutions

          </h2>

          <p className="mt-4 max-w-3xl text-white/90 leading-8">

            Dedicated taxi services for businesses, factories,
            project sites, consultants, executives and repeat
            monthly travelers across Chhattisgarh.

          </p>

          <div className="flex flex-wrap gap-4 mt-8">

            <a
              href="tel:9244137353"
              className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold"
            >
              Discuss Corporate Rates
            </a>

            <a
              href="https://wa.me/919244137353"
              className="border border-white px-8 py-4 rounded-2xl font-bold"
            >
              WhatsApp Us
            </a>

          </div>

        </div>

      </section>

      {/* SERVICE AREAS */}

      <section className="bg-slate-100 py-20">

        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-12">

            <h2 className="text-4xl md:text-5xl font-black">

              Areas We Serve

            </h2>

            <p className="text-slate-600 mt-4">

              Taxi services available across major cities of Chhattisgarh

            </p>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

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
              "Champa",
              "Katghora",
              "Pendra",
            ].map((city) => (

              <div
                key={city}
                className="bg-white rounded-2xl p-4 text-center font-semibold border"
              >
                {city}
              </div>

            ))}

          </div>

        </div>

      </section>
 {/* CUSTOMER REVIEWS */}

<section className="py-20 bg-white overflow-hidden">

  <div className="max-w-7xl mx-auto px-4">

    <div className="text-center mb-14">

      <h2 className="text-4xl md:text-5xl font-black">
        What Our Customers Say
      </h2>

      <p className="text-slate-600 mt-4">
        Trusted by travelers across Chhattisgarh
      </p>

    </div>

    <div className="relative overflow-hidden">

      <div className="flex gap-6 animate-[scroll_45s_linear_infinite] w-max">

        {[...reviews, ...reviews].map((review, index) => (

          <div
            key={index}
            className="w-[320px] flex-shrink-0 bg-slate-50 border rounded-3xl p-6 shadow-sm"
          >

            <div className="flex gap-1 text-yellow-500 mb-4">

              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />

            </div>

            <p className="text-slate-600 leading-7">
              {review.review}
            </p>

            <div className="mt-5">

              <h3 className="font-black">
                {review.name}
              </h3>

              <p className="text-sm text-slate-500">
                {review.city}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  </div>

</section>

      {/* FAQ SECTION */}

      <section className="bg-slate-100 py-20">

        <div className="max-w-5xl mx-auto px-4">

          <div className="text-center mb-14">

            <h2 className="text-4xl md:text-5xl font-black">
              Frequently Asked Questions
            </h2>

          </div>

          <div className="space-y-5">

            {faqs.map((faq) => (

              <div
                key={faq.q}
                className="bg-white rounded-2xl border p-6"
              >

                <h3 className="font-black text-lg">
                  {faq.q}
                </h3>

                <p className="mt-3 text-slate-600 leading-7">
                  {faq.a}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* LOCAL SEO CONTENT */}

      <section className="max-w-6xl mx-auto px-4 py-20">

        <div className="bg-white rounded-3xl border p-8 md:p-12">

          <h2 className="text-4xl font-black mb-8">
            Taxi Service Across Chhattisgarh
          </h2>

          <div className="space-y-6 text-slate-600 leading-8">

            <p>
              Khatu Rides Travels provides professional taxi services
              across Chhattisgarh including Raipur, Korba, Bilaspur,
              Raigarh, Bhilai, Durg, Ambikapur and Jagdalpur.
            </p>

            <p>
              Whether you need a one-way taxi, airport transfer,
              round trip booking or corporate travel solution,
              our goal is to provide safe, comfortable and reliable
              transportation at transparent pricing.
            </p>

            <p>
              We serve individual travelers, families, business
              professionals, corporate clients and tourists looking
              for dependable transportation throughout Chhattisgarh.
            </p>

            <p>
              Popular routes include Raipur to Korba Taxi,
              Raipur to Bilaspur Taxi, Raipur Airport Taxi,
              Korba to Bilaspur Taxi and Raipur to Raigarh Taxi.
            </p>

            <p>
              Customers can easily book through phone call
              or WhatsApp and receive quick fare details,
              route guidance and vehicle availability.
            </p>

          </div>

        </div>

      </section>

      {/* FINAL CTA */}

      <section className="bg-slate-950 text-white">

        <div className="max-w-6xl mx-auto px-4 py-20 text-center">

          <h2 className="text-4xl md:text-6xl font-black">

            Ready To Book Your Taxi?

          </h2>

          <p className="mt-6 text-slate-300 text-lg max-w-2xl mx-auto">

            Get fare, availability and booking confirmation
            in less than 2 minutes.

          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">

            <a
              href="https://wa.me/919244137353"
              target="_blank"
              className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl font-bold transition"
            >
              WhatsApp Now
            </a>

            <a
              href="tel:9244137353"
              className="border border-white px-8 py-4 rounded-2xl font-bold"
            >
              Call 9244137353
            </a>

          </div>

        </div>

      </section>

      {/* FLOATING WHATSAPP */}

      <a
        href="https://wa.me/919244137353"
        target="_blank"
        className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white px-5 py-4 rounded-full shadow-2xl flex items-center gap-2 font-bold"
      >
        <MessageCircle size={22} />
        <span className="hidden md:block">
          WhatsApp
        </span>
      </a>

    </main>
    </>
  );
}

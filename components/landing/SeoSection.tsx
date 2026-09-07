"use client";

import { PHONE, WHATSAPP } from "./data";
import Icon from "./Icons";

const SEO_PHONE = PHONE;
const SEO_WHATSAPP = WHATSAPP;

const serviceLinks = [
  {
    title: "One Way Cab",
    description:
      "Convenient one-way taxi service for travelling between cities without paying for an unnecessary return journey.",
    href: "#routes",
    icon: "→",
  },
  {
    title: "Round Trip Cab",
    description:
      "Comfortable return-trip cab options for family travel, business visits, sightseeing and multi-day journeys.",
    href: "#services",
    icon: "↔",
  },
  {
    title: "Raipur Airport Taxi",
    description:
      "Airport pickup and drop cab service from Raipur Airport with convenient travel coordination.",
    href: "#airport",
    icon: "✈",
  },
  {
    title: "Outstation Cab",
    description:
      "Reliable vehicles for long-distance travel from Raipur, Bilaspur, Korba, Durg, Bhilai and nearby cities.",
    href: "#services",
    icon: "🛣",
  },
  {
    title: "Tour Packages",
    description:
      "Comfortable cab travel for spiritual tours, family holidays and popular pilgrimage destinations.",
    href: "#tours",
    icon: "🛕",
  },
  {
    title: "Local Cab Rental",
    description:
      "Flexible local cab options for meetings, shopping, sightseeing, personal travel and city transportation.",
    href: "#services",
    icon: "🚕",
  },
];

const cityLinks = [
  "Raipur",
  "Bilaspur",
  "Korba",
  "Durg",
  "Bhilai",
  "Bastar",
];

const popularRoutes = [
  "Raipur → Korba",
  "Korba → Raipur",
  "Raipur → Bilaspur",
  "Bilaspur → Raipur",
  "Korba → Bilaspur",
  "Raipur → Durg",
  "Raipur → Bhilai",
  "Raipur Airport → Korba",
  "Raipur Airport → Bilaspur",
  "Raipur Airport → Durg",
];

const popularDestinations = [
  "Khatu Shyam",
  "Ujjain",
  "Ayodhya",
  "Varanasi",
  "Prayagraj",
  "Puri",
  "Bastar",
  "Chitrakoot",
  "Tirathgarh",
];

export default function SeoSection() {
  return (
    <section
      id="seo"
      aria-labelledby="seo-heading"
      className="relative overflow-hidden border-y border-slate-200 bg-[#F8FAFC] py-14 sm:py-20"
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute -left-40 top-0 h-[350px] w-[350px] rounded-full bg-amber-100/60 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-orange-100/50 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-50/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1250px] px-4 sm:px-6">

        {/* =====================================================
            HERO SEO HEADER
        ===================================================== */}

        <div className="mx-auto max-w-4xl text-center">

          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[9px] font-black uppercase tracking-[.2em] text-amber-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] text-slate-950">
              ✓
            </span>

            Chhattisgarh Cab & Travel Service
          </span>

          <h2
            id="seo-heading"
            className="mt-5 text-3xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            Reliable Cab Service
            <span className="block text-amber-500">
              Across Chhattisgarh
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-500 sm:text-[15px]">
            Khatu Rides Travels provides convenient cab booking and travel
            support for local, airport, outstation, family and pilgrimage
            journeys. From everyday city travel to long-distance road trips,
            our services connect major cities and popular destinations across
            Chhattisgarh and beyond.
          </p>

        </div>

        {/* =====================================================
            TOP SERVICE STATS
        ===================================================== */}

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-black text-amber-500">
              01
            </div>

            <h3 className="mt-2 text-sm font-black text-slate-950">
              One Way Cab
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              City-to-city travel with convenient one-way booking.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-black text-amber-500">
              02
            </div>

            <h3 className="mt-2 text-sm font-black text-slate-950">
              Airport Transfers
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              Pickup and drop service from Raipur Airport.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-black text-amber-500">
              03
            </div>

            <h3 className="mt-2 text-sm font-black text-slate-950">
              Outstation Travel
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              Comfortable cabs for long-distance journeys.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-black text-amber-500">
              04
            </div>

            <h3 className="mt-2 text-sm font-black text-slate-950">
              Tour & Pilgrimage
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              Family, spiritual and holiday travel by cab.
            </p>
          </div>

        </div>

        {/* =====================================================
            SERVICE SEO GRID
        ===================================================== */}

        <div className="mt-12">

          <div className="mb-6">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              Our Cab Services
            </span>

            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Cab Services For Every Journey
            </h3>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
              Choose the right travel option for your city ride, airport
              transfer, outstation trip, family tour or pilgrimage journey.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {serviceLinks.map((service) => (

              <a
                key={service.title}
                href={service.href}
                className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_18px_45px_rgba(245,158,11,.12)]"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl transition-colors group-hover:bg-amber-400">
                    {service.icon}
                  </div>

                  <span className="text-lg font-black text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-amber-500">
                    →
                  </span>

                </div>

                <h4 className="mt-5 text-lg font-black text-slate-950">
                  {service.title}
                </h4>

                <p className="mt-2 text-[11px] leading-6 text-slate-500">
                  {service.description}
                </p>

                <span className="mt-4 inline-block text-[9px] font-black uppercase tracking-wider text-amber-600">
                  Explore Service →
                </span>

              </a>

            ))}

          </div>

        </div>

        {/* =====================================================
            LOCATION COVERAGE
        ===================================================== */}

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">

          {/* CITY CARD */}

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              Service Areas
            </span>

            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Cab Service Across Major Cities
            </h3>

            <p className="mt-3 text-[11px] leading-6 text-slate-500 sm:text-sm sm:leading-7">
              Khatu Rides Travels serves customers travelling from and to
              major locations across Chhattisgarh. Whether you are booking a
              cab within the city or planning an outstation journey, you can
              contact our team to discuss your travel requirement.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">

              {cityLinks.map((city, index) => (

                <div
                  key={city}
                  className="group rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4 transition hover:border-amber-200 hover:bg-amber-50"
                >

                  <div className="flex items-center gap-2">

                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[9px] font-black text-amber-600 shadow-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-sm font-black text-slate-900">
                      {city}
                    </span>

                  </div>

                  <span className="mt-2 block text-[8px] font-bold text-slate-400">
                    Cab & Travel Service
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* AIRPORT SEO CARD */}

          <div
            id="airport-seo"
            className="relative overflow-hidden rounded-[28px] bg-[#061B32] p-6 text-white shadow-[0_18px_50px_rgba(6,27,50,.15)] sm:p-8"
          >

            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-xl text-slate-950">
                ✈
              </div>

              <span className="mt-5 block text-[9px] font-black uppercase tracking-[.2em] text-amber-300">
                Airport Transfer
              </span>

              <h3 className="mt-2 text-2xl font-black leading-tight">
                Raipur Airport Taxi
                <span className="block text-amber-300">
                  Pickup & Drop
                </span>
              </h3>

              <p className="mt-4 text-[11px] leading-6 text-white/55 sm:text-[13px]">
                Need a cab from Raipur Airport? Book an airport pickup or drop
                for Raipur, Bhilai, Durg, Bilaspur, Korba and nearby
                destinations. For early flights or planned arrivals, contact
                our team in advance for travel coordination.
              </p>

              <div className="mt-6 space-y-2">

                {[
                  "Raipur Airport → Raipur",
                  "Raipur Airport → Bhilai",
                  "Raipur Airport → Durg",
                  "Raipur Airport → Bilaspur",
                  "Raipur Airport → Korba",
                ].map((route) => (

                  <div
                    key={route}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                  >

                    <span className="text-amber-300">
                      ✓
                    </span>

                    <span className="text-[9px] font-bold text-white/70">
                      {route}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            POPULAR ROUTES
        ===================================================== */}

        <div className="mt-12 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                Popular Cab Routes
              </span>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Popular Routes From Chhattisgarh
              </h3>

            </div>

            <a
              href="#routes"
              className="text-[9px] font-black uppercase tracking-wider text-amber-600 transition hover:text-amber-700"
            >
              View All Routes →
            </a>

          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

            {popularRoutes.map((route, index) => (

              <a
                key={route}
                href="#routes"
                className="group flex items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-4 py-3 transition hover:border-amber-200 hover:bg-amber-50"
              >

                <div className="flex min-w-0 items-center gap-3">

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[8px] font-black text-amber-600 shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="truncate text-[10px] font-black text-slate-700">
                    {route}
                  </span>

                </div>

                <span className="ml-2 text-sm font-black text-slate-300 transition group-hover:text-amber-500">
                  →
                </span>

              </a>

            ))}

          </div>

        </div>

        {/* =====================================================
            TOUR / DESTINATION SEO
        ===================================================== */}

        <div className="mt-12 grid gap-5 lg:grid-cols-2">

          {/* PILGRIMAGE */}

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              Spiritual Travel
            </span>

            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Pilgrimage & Spiritual Tour Cabs
            </h3>

            <p className="mt-3 text-[11px] leading-6 text-slate-500 sm:text-sm sm:leading-7">
              Plan a comfortable spiritual journey with family or friends.
              Khatu Rides offers cab travel for popular pilgrimage
              destinations including Khatu Shyam, Ujjain, Ayodhya, Varanasi,
              Prayagraj and Puri.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

              {popularDestinations
                .slice(0, 6)
                .map((destination) => (

                  <span
                    key={destination}
                    className="rounded-full border border-amber-100 bg-amber-50 px-3 py-2 text-[9px] font-bold text-amber-700"
                  >
                    {destination}
                  </span>

                ))}

            </div>

            <a
              href="#tours"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-amber-400 hover:text-slate-950"
            >
              Explore Tour Packages
              <span>→</span>
            </a>

          </div>

          {/* CHHATTISGARH TOURISM */}

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              Explore Chhattisgarh
            </span>

            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Chhattisgarh Tourism By Cab
            </h3>

            <p className="mt-3 text-[11px] leading-6 text-slate-500 sm:text-sm sm:leading-7">
              Discover the natural beauty and popular attractions of
              Chhattisgarh by road. Plan comfortable cab trips to Bastar,
              Chitrakoot, Tirathgarh and other local destinations with a
              suitable vehicle for your group.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

              {popularDestinations
                .slice(6)
                .map((destination) => (

                  <span
                    key={destination}
                    className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-[9px] font-bold text-slate-600"
                  >
                    {destination}
                  </span>

                ))}

            </div>

            <a
              href="#tours"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-800 transition hover:border-amber-300 hover:bg-amber-50"
            >
              Explore Destinations
              <span>→</span>
            </a>

          </div>

        </div>

        {/* =====================================================
            SEO CONTENT
        ===================================================== */}

        <div className="mt-12 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">

          <div className="max-w-4xl">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              Khatu Rides Travels
            </span>

            <h3 className="mt-3 text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl">
              Your Travel Partner For Local, Airport & Outstation Journeys
            </h3>

            <div className="mt-5 space-y-4 text-[11px] leading-6 text-slate-500 sm:text-sm sm:leading-7">

              <p>
                Khatu Rides Travels provides cab services for customers
                travelling across Raipur, Bilaspur, Korba, Durg, Bhilai and
                other destinations in Chhattisgarh. Our services include
                one-way taxi, round-trip cab, local cab rental, airport
                transfer and outstation travel for personal, family and
                business requirements.
              </p>

              <p>
                For travellers looking for a{" "}
                <strong className="font-black text-slate-700">
                  Raipur cab service
                </strong>
                , we provide convenient options for city travel and
                outstation journeys. Customers can also book a{" "}
                <strong className="font-black text-slate-700">
                  Raipur Airport taxi
                </strong>{" "}
                for airport pickup and drop to locations such as Bhilai,
                Durg, Bilaspur, Korba and nearby cities.
              </p>

              <p>
                Our{" "}
                <strong className="font-black text-slate-700">
                  one-way cab service
                </strong>{" "}
                is useful for travellers who need to travel between two
                cities without arranging a return journey. For longer trips,
                family travel and sightseeing, customers can enquire about
                round-trip and outstation cab options.
              </p>

              <p>
                Khatu Rides also supports spiritual and pilgrimage travel to
                destinations such as Khatu Shyam, Ujjain, Ayodhya, Varanasi,
                Prayagraj and Puri. For travellers exploring Chhattisgarh,
                cab journeys can also be planned for Bastar, Chitrakoot,
                Tirathgarh and other local attractions.
              </p>

            </div>

          </div>

          {/* KEYWORD / SERVICE TAGS */}

          <div className="mt-8 border-t border-slate-100 pt-6">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-slate-400">
              Popular Travel Services
            </span>

            <div className="mt-4 flex flex-wrap gap-2">

              {[
                "Raipur Cab Service",
                "Bilaspur Cab",
                "Korba Cab Service",
                "Durg Taxi",
                "Bhilai Cab",
                "Raipur Airport Taxi",
                "Airport Pickup",
                "Airport Drop",
                "One Way Taxi",
                "Round Trip Cab",
                "Outstation Cab",
                "Local Cab Rental",
                "Tour Package",
                "Pilgrimage Cab",
                "Chhattisgarh Tourism",
              ].map((keyword) => (

                <span
                  key={keyword}
                  className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-[8px] font-bold text-slate-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                >
                  {keyword}
                </span>

              ))}

            </div>

          </div>

        </div>

        {/* =====================================================
            FINAL SEO CTA
        ===================================================== */}

        <div className="relative mt-8 overflow-hidden rounded-[30px] bg-gradient-to-r from-amber-400 to-orange-400 p-6 shadow-[0_20px_55px_rgba(245,158,11,.20)] sm:p-8">

          <div className="pointer-events-none absolute -right-10 -top-20 h-60 w-60 rounded-full bg-white/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <span className="text-[9px] font-black uppercase tracking-[.2em] text-slate-950/60">
                Need A Cab?
              </span>

              <h3 className="mt-2 text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl">
                Tell Us Where You Want To Go.
              </h3>

              <p className="mt-2 max-w-xl text-[11px] font-semibold leading-5 text-slate-950/65 sm:text-sm">
                Call Khatu Rides Travels for cab booking, airport transfer,
                one-way taxi, outstation travel or tour requirements.
              </p>

            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <a
                href={`tel:${SEO_PHONE}`}
                aria-label="Call Khatu Rides Travels for booking"
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 text-[9px] font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-slate-800 active:scale-[.98]"
              >
                <Icon
                  name="phone"
                  size={15}
                />

                Call For Booking
              </a>

              <a
                href={`https://wa.me/${SEO_WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20cab`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Khatu Rides Travels"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-950/15 bg-white/90 px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-950 transition hover:bg-white active:scale-[.98]"
              >
                <Icon
                  name="whatsapp"
                  size={15}
                />

                WhatsApp
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
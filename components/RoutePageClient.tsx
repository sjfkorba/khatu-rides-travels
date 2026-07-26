"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Script from "next/script";
import {
  Car,
  ShieldCheck,
  Star,
  Users,
  Zap,
  ArrowRight,
  PhoneCall,
  MapPinned,
  BadgeCheck,
} from "lucide-react";
import FareCalculator from "@/components/FareCalculator";
import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";
import {
  VEHICLES,
  type BookingType,
  type VehicleType,
  type ServiceType,
} from "@/lib/fareCalculator";
import ReviewsCarousel from "./ReviewsCarousel";

type FareOption = {
  id: string;
  vehicleType: VehicleType;
  vehicleLabel: string;
  vehicleImage: string;
  finalFare: number;
  strikeFare?: number;
  fareText: string;
  billedDistance: number;
  durationMinutes: number;
  allowedKmsLimit?: number;
  discountPercent?: number;
};

type PopupData = {
  fareOptions: FareOption[];
  pickup: string;
  drop: string;
  bookingType: BookingType;
  serviceType: ServiceType;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
};

type RouteData = {
  title?: string;
  h1: string;
  desc: string;
  sectionTitle: string;
  sectionParagraphs: string[];
  from?: string;
  to?: string;
  slug?: string;
  distanceText?: string;
};

type RoutePageClientProps = {
  slug: string;
  route: RouteData;
};

const cabOptions = [
  {
    name: "Maruti Dzire",
    img: "/dezire.png",
    tag: "Budget Sedan",
    seats: "4+1 Seats",
    luggage: "2 Bags",
    bestFor: "Best for one way taxi, solo travel, and budget-friendly intercity rides.",
  },
  {
    name: "Maruti Ertiga",
    img: "/ertiga.png",
    tag: "Family MPV",
    seats: "6+1 Seats",
    luggage: "4 Bags",
    bestFor: "Best for family round trip cab booking, group travel, and luggage comfort.",
  },
  {
    name: "Toyota Crysta",
    img: "/crysta.png",
    tag: "Premium SUV",
    seats: "6+1 Seats",
    luggage: "5 Bags",
    bestFor: "Best for premium taxi service, airport transfer, and business-class road travel.",
  },
];

export default function RoutePageClient({ slug, route }: RoutePageClientProps) {
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("sedan");
  const [showUserForm, setShowUserForm] = useState(false);
  const [paymentSplitMode, setPaymentSplitMode] = useState<Record<string, "full" | "half">>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);

  const routeFrom = (route.from || route.h1.split(" to ")[0] || "Korba").split(",")[0].trim();
  const routeTo =
    (route.to || route.h1.split(" to ")[1]?.replace(/taxi|cab|service/gi, "") || "Raipur")
      .split(",")[0]
      .trim();

  const routeSlug =
    slug ||
    route.slug ||
    `${routeFrom.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-to-${routeTo
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-taxi`;

  const oneWayKeywords = [
    `${routeFrom} to ${routeTo} taxi`,
    `${routeFrom} to ${routeTo} cab`,
    `${routeFrom} to ${routeTo} one way cab`,
    `${routeFrom} to ${routeTo} one way taxi`,
    `${routeFrom} to ${routeTo} outstation cab`,
    `${routeFrom} to ${routeTo} outstation taxi`,
    `${routeFrom} to ${routeTo} cab booking`,
    `${routeFrom} to ${routeTo} taxi booking`,
    `book taxi ${routeFrom} to ${routeTo}`,
    `hire cab ${routeFrom} to ${routeTo}`,
    `${routeFrom} to ${routeTo} cab fare`,
    `${routeFrom} to ${routeTo} taxi fare`,
  ];

  const roundTripKeywords = [
    `${routeFrom} to ${routeTo} round trip cab`,
    `${routeFrom} to ${routeTo} round trip taxi`,
    `${routeFrom} to ${routeTo} return cab`,
    `${routeFrom} to ${routeTo} return taxi`,
    `${routeFrom} to ${routeTo} sedan taxi`,
    `${routeFrom} to ${routeTo} Ertiga cab`,
    `${routeFrom} to ${routeTo} Crysta cab`,
    `${routeFrom} to ${routeTo} family cab`,
    `${routeFrom} to ${routeTo} premium taxi`,
    `${routeTo} to ${routeFrom} taxi`,
    `${routeTo} to ${routeFrom} one way cab`,
    `${routeTo} to ${routeFrom} round trip taxi`,
  ];

  const allKeywords = [...oneWayKeywords, ...roundTripKeywords];

  const faqItems = [
    {
      q: `What is the fare for ${routeFrom} to ${routeTo} taxi booking?`,
      a: `The fare for ${routeFrom} to ${routeTo} taxi booking depends on cab category, trip type, route distance, and travel schedule. You can use the calculator on this page to check live pricing for one way and round trip bookings.`,
    },
    {
      q: `Can I book ${routeFrom} to ${routeTo} one way cab online?`,
      a: `Yes, you can book ${routeFrom} to ${routeTo} one way cab online from this page using the fare calculator, WhatsApp booking button, or direct call support.`,
    },
    {
      q: `Is ${routeFrom} to ${routeTo} round trip taxi available?`,
      a: `Yes, round trip taxi service is available for ${routeFrom} to ${routeTo} travel. You can choose round trip while calculating fare and then select the preferred vehicle type.`,
    },
    {
      q: `Which cars are available for ${routeFrom} to ${routeTo} cab service?`,
      a: `Sedan, Ertiga, and Crysta options are available for ${routeFrom} to ${routeTo} cab service depending on seating, luggage, and comfort preference.`,
    },
    {
      q: `How do I confirm my ${routeFrom} to ${routeTo} taxi booking?`,
      a: `After checking fare, you can either continue on WhatsApp for manual booking support or proceed through the online booking flow shown in the fare result screen.`,
    },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${routeFrom} to ${routeTo} Taxi Service`,
    serviceType: `${routeFrom} to ${routeTo} cab booking`,
    description: `${routeFrom} to ${routeTo} one way cab, round trip taxi, premium outstation travel, sedan, Ertiga, and Crysta booking service.`,
    areaServed: ["Chhattisgarh", routeFrom, routeTo],
    provider: {
      "@type": "LocalBusiness",
      name: "Khatu Rides Travels Co",
      telephone: "+91 92441 37353",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Korba",
        addressRegion: "Chhattisgarh",
        addressCountry: "IN",
      },
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://khaturidescg.in" },
      { "@type": "ListItem", position: 2, name: "Routes", item: "https://khaturidescg.in/routes" },
      {
        "@type": "ListItem",
        position: 3,
        name: `${routeFrom} to ${routeTo} Taxi`,
        item: `https://khaturidescg.in/routes/${routeSlug}`,
      },
    ],
  };

  const convertToIndianDate = (dateString: string) => {
    if (!dateString) return "--/--/----";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatTimeToAMPM = (timeString: string) => {
    if (!timeString) return "--:-- --";
    let [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };

  const getDynamicKmsLimitDisplay = (opt: FareOption): number => {
    if (!popupData || popupData.bookingType !== "roundtrip" || !popupData.returnDate || !popupData.returnTime) {
      return opt.billedDistance;
    }

    try {
      const start = new Date(`${popupData.pickupDate}T${popupData.pickupTime}`);
      const end = new Date(`${popupData.returnDate}T${popupData.returnTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const days = Math.max(1, Math.ceil(hours / 24));
      const calculatedLimit = days * 250;
      return calculatedLimit > opt.billedDistance ? calculatedLimit : opt.billedDistance;
    } catch {
      return opt.billedDistance;
    }
  };

  const handleWhatsAppManualRedirect = (option: FareOption) => {
    if (!popupData) return;

    const textPayload = `Hello Khatu Rides Travels Co.,

I would like to book an outstation cab package shortly.

*ROUTE DETAILS*
• From: ${popupData.pickup}
• To: ${popupData.drop}
• Vehicle: ${option.vehicleLabel}
• Trip Type: ${popupData.bookingType.toUpperCase()}
• Pickup: ${convertToIndianDate(popupData.pickupDate)} at ${formatTimeToAMPM(popupData.pickupTime)}

*FARE DETAILS*
• Total Fare: Rs. ${option.finalFare.toLocaleString("en-IN")}.00

Please confirm this taxi booking manually.`;

    const cleanFormattedUrl = `https://wa.me/919244137353?text=${encodeURIComponent(textPayload)}`;
    window.open(cleanFormattedUrl, "_blank");
  };

  const selectedOption = useMemo(
    () => popupData?.fareOptions.find((item) => item.vehicleType === selectedVehicleType),
    [popupData, selectedVehicleType]
  );

  const totalPricingBase = selectedOption ? selectedOption.finalFare : 0;
  const currentSelectedMode =
    selectedOption && paymentSplitMode[selectedOption.id] ? paymentSplitMode[selectedOption.id] : "full";
  const displayPayNowNumber =
    currentSelectedMode === "half" ? Math.round(totalPricingBase / 2) : totalPricingBase;

  const handleDummyOnlineBooking = async (option: FareOption) => {
    if (!popupData) return;

    if (!customerName.trim() || !customerPhone.trim() || customerPhone.length < 10) {
      alert("⚠️ Kripya sahi Naam aur 10-digit Mobile Number darj karein!");
      return;
    }

    try {
      setPaymentLoadingId(option.id);

      const mode = paymentSplitMode[option.id] || "full";
      const payableAmount = mode === "half" ? Math.round(option.finalFare / 2) : option.finalFare;

      alert(
        `Booking request ready!\n\nCustomer: ${customerName}\nPhone: ${customerPhone}\nVehicle: ${option.vehicleLabel}\nPayable Now: ₹${payableAmount.toLocaleString(
          "en-IN"
        )}\n\nAb is function ko Razorpay / booking API se connect kar do.`
      );

      setPaymentLoadingId(null);
    } catch {
      setPaymentLoadingId(null);
      alert("Payment interface failed");
    }
  };

  return (
    <>
      <Script id="route-service-schema" type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </Script>

      <Script id="route-faq-schema" type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>

      <Script id="route-breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-[#07101d] text-slate-100 selection:bg-orange-500 selection:text-white">
        <section className="relative pt-16 pb-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-950/30 via-slate-950 to-slate-950" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(249,115,22,0.08),rgba(2,6,23,0.2),rgba(2,6,23,0.9))]" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-orange-400 font-black tracking-[0.18em] uppercase text-[11px]">
                Premium Cab Service
              </span>

              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black mt-5 text-white leading-tight">
                {route.h1}
              </h1>

              <p className="mt-6 text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-8">
                {route.desc}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
                  One Way Cab Booking
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
                  Round Trip Taxi
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
                  Instant Fare Quote
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
                  Verified Drivers
                </span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto bg-slate-900/50 p-6 sm:p-8 rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-xl">
              <FareCalculator
                onFareCalculated={(data: PopupData) => {
                  setPopupData(data);
                  setSelectedVehicleType("sedan");
                  setShowPopup(true);
                  setShowUserForm(false);
                  setPaymentSplitMode({});
                }}
              />
            </div>

             {/* 👑 5. DYNAMIC REVIEWS SLIDER */}
                    <ReviewsCarousel />

            <div className="max-w-5xl mx-auto mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                  <ShieldCheck size={16} />
                  <span className="font-black text-[11px] uppercase tracking-widest">Trusted Service</span>
                </div>
                <p className="text-sm text-slate-300 text-center">
                  Transparent intercity taxi booking with direct support.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                  <Zap size={16} />
                  <span className="font-black text-[11px] uppercase tracking-widest">Fast Fare</span>
                </div>
                <p className="text-sm text-slate-300 text-center">
                  Calculate route fare for one way and round trip bookings.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                  <BadgeCheck size={16} />
                  <span className="font-black text-[11px] uppercase tracking-widest">Clean Fleet</span>
                </div>
                <p className="text-sm text-slate-300 text-center">
                  Sedan, Ertiga, and Crysta options for every travel need.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                  <PhoneCall size={16} />
                  <span className="font-black text-[11px] uppercase tracking-widest">Direct Booking</span>
                </div>
                <p className="text-sm text-slate-300 text-center">
                  WhatsApp and call-based booking support available 24x7.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-6 px-4">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-orange-400 mb-3">
                <MapPinned size={18} />
                <span className="font-black text-xs uppercase tracking-widest">One Way Search Intent</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                {routeFrom} to {routeTo} One Way Taxi Keywords
              </h2>

              <p className="text-slate-400 mb-6">
                Route-specific one way taxi and cab booking keyword coverage for stronger Google crawl relevance.
              </p>

              <div className="flex flex-wrap gap-3">
                {oneWayKeywords.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-emerald-400 mb-3">
                <ArrowRight size={18} />
                <span className="font-black text-xs uppercase tracking-widest">Round Trip Search Intent</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                {routeFrom} to {routeTo} Round Trip Taxi Keywords
              </h2>

              <p className="text-slate-400 mb-6">
                Return trip, reverse route, and vehicle intent terms to support wider route-based search discovery.
              </p>

              <div className="flex flex-wrap gap-3">
                {roundTripKeywords.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

         {/* Elfsight Widget Integration */}
      <div className="max-w-6xl mx-auto">
        <div 
          className="elfsight-app-befc0f26-20b2-4abc-b941-20a499d14601" 
          data-elfsight-app-lazy
        ></div>
      </div>

      

        <section className="py-20 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">Our Premium Fleet</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {cabOptions.map((cab) => (
              <div
                key={cab.name}
                className="group relative rounded-[32px] border border-white/5 bg-white/[0.03] p-8 hover:border-orange-500/50 hover:bg-orange-950/10 transition-all duration-500"
              >
                <div className="h-40 flex items-center justify-center mb-6">
                  <img
                    src={cab.img}
                    alt={cab.name}
                    className="w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <span className="text-orange-500 font-bold text-xs uppercase">{cab.tag}</span>
                <h3 className="text-2xl font-black mt-2 text-white">{cab.name}</h3>

                <div className="mt-4 flex gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Users size={16} /> {cab.seats}
                  </div>
                  <div className="flex items-center gap-1">
                    <Car size={16} /> {cab.luggage}
                  </div>
                </div>

                <p className="mt-5 text-sm text-slate-300 leading-7">{cab.bestFor}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 bg-slate-900/20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Star className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold">Verified Service · 210+ Reviews</span>
            </div>

            <h2 className="text-3xl font-black">{route.sectionTitle}</h2>

            {route.sectionParagraphs.map((para: string, i: number) => (
              <p key={i} className="mt-6 text-slate-300 leading-8 text-lg">
                {para}
              </p>
            ))}

            <div className="mt-10 grid md:grid-cols-3 gap-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-lg font-black text-white">
                  {routeFrom} to {routeTo} Cab Booking
                </h3>
                <p className="mt-3 text-slate-300 leading-7 text-sm">
                  Book {routeFrom} to {routeTo} cab service for one way drop, return journey, airport travel, and
                  family trips with live fare estimation.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-lg font-black text-white">One Way and Round Trip Taxi</h3>
                <p className="mt-3 text-slate-300 leading-7 text-sm">
                  Compare one way taxi, round trip cab, return fare, and premium vehicle options before confirming
                  your booking.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-lg font-black text-white">Route-Level SEO Content</h3>
                <p className="mt-3 text-slate-300 leading-7 text-sm">
                  This page includes visible keywords, FAQs, and route-rich structured content to improve search
                  relevance and user intent matching.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black text-white">
              {routeFrom} to {routeTo} Taxi Service Information
            </h2>

            <p className="mt-6 text-slate-300 leading-8 text-lg">
              {routeFrom} to {routeTo} taxi service is designed for customers searching for direct intercity
              transportation, one way cab booking, return trip taxi, family ride options, executive cars, and
              route-specific fare visibility. This page combines route content, live fare interaction, cab type
              selection, and booking-ready call to action in a single high-intent layout.
            </p>

            <p className="mt-6 text-slate-300 leading-8 text-lg">
              Customers often search for {allKeywords.slice(0, 10).join(", ")}, and similar variants before selecting a
              provider. By placing route phrases, booking content, FAQs, and vehicle relevance directly on the page,
              the route becomes easier to crawl and more aligned with commercial search intent.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h3 className="text-2xl font-black text-white mb-5">
                Popular Search Terms for {routeFrom} to {routeTo}
              </h3>

              <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-200">
                {allKeywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="rounded-2xl border border-white/8 bg-slate-950/40 px-4 py-3"
                  >
                    {keyword}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-24 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-10">
              {routeFrom} to {routeTo} Taxi Booking FAQs
            </h2>

            <div className="space-y-5">
              {faqItems.map((item, idx) => (
                <div key={idx} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-lg font-black text-white">{item.q}</h3>
                  <p className="mt-3 text-slate-300 leading-8">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
          <TrackedWhatsAppButton
            href="https://wa.me/919244137353"
            className="w-full bg-emerald-600 py-4 rounded-full font-black text-center shadow-2xl"
          >
            BOOK NOW ON WHATSAPP
          </TrackedWhatsAppButton>
        </div>
      </main>

      <AnimatePresence>
        {showPopup && popupData && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh] text-left"
            >
              <div className="bg-slate-100 px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700">
                <div>
                  Route:{" "}
                  <span className="text-slate-950 font-black text-sm block sm:inline">
                    {popupData.pickup.split(",")[0]} - {popupData.drop.split(",")[0]}
                  </span>
                </div>

                <div className="flex gap-4 flex-wrap">
                  <div>
                    Trip:{" "}
                    <span className="text-slate-950 font-black uppercase bg-orange-100 px-2 py-0.5 rounded text-[11px] text-orange-700">
                      {popupData.bookingType}
                    </span>
                  </div>
                  <div>
                    Date: <span className="text-slate-950 font-black">{convertToIndianDate(popupData.pickupDate)}</span>
                  </div>
                  <div>
                    Time: <span className="text-slate-950 font-black">{formatTimeToAMPM(popupData.pickupTime)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPopup(false);
                    setShowUserForm(false);
                  }}
                  className="text-slate-400 hover:text-slate-900 font-black text-sm transition-colors"
                >
                  ✕ Close
                </button>
              </div>

              <div className="bg-slate-900 text-white px-4 py-2.5 text-[10px] sm:text-xs grid grid-cols-3 gap-1 text-center font-black uppercase tracking-wider">
                <div>₹ Pre-Fixed Pricing</div>
                <div className="border-x border-white/20">🛡️ Driver Allowance Inc.</div>
                <div>🎧 24x7 Custom Support</div>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/40">
                {!showUserForm ? (
                  <div className="flex flex-col gap-4">
                    {popupData.fareOptions.map((opt) => {
                      if (!["sedan", "ertiga", "crysta"].includes(opt.vehicleType)) return null;

                      const dynamicLimitKms = getDynamicKmsLimitDisplay(opt);
                      const extraRatePerKm =
                        opt.vehicleType === "sedan" ? 11 : opt.vehicleType === "ertiga" ? 17 : 20.7;

                      return (
                        <div
                          key={opt.id}
                          className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs hover:shadow-md transition flex flex-col"
                        >
                          <div className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] sm:text-xs py-2 px-4 uppercase tracking-wider text-center shadow-xs">
                            🔥 Make Online Advance Payment and Get Upto 10% Discount On Your Booking Instantly
                          </div>

                          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto text-center sm:text-left">
                              <img
                                src={VEHICLES[opt.vehicleType]?.image}
                                alt={opt.vehicleLabel}
                                className="w-32 h-20 sm:w-36 sm:h-24 object-contain flex-shrink-0 mx-auto sm:mx-0"
                              />

                              <div>
                                <h4 className="text-lg font-black text-slate-900">{opt.vehicleLabel}</h4>
                                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                  or equivalent | {opt.vehicleType === "sedan" ? "4" : "6"}+1 Seater AC Cab
                                </p>

                                <div className="mt-2.5 flex flex-wrap gap-1.5 justify-center sm:justify-start text-[10px] font-bold">
                                  <span className="bg-slate-100 text-slate-500 border border-slate-200/50 px-2 py-0.5 rounded">
                                    👤 Allowance Included
                                  </span>
                                  <span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-0.5 rounded">
                                    📦 Kms Limit: {dynamicLimitKms} KM
                                  </span>
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded">
                                    ⚡ Extra Run: ₹{extraRatePerKm}/KM
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-center sm:text-right flex flex-col items-center sm:items-end justify-center min-w-full sm:min-w-[220px] border-t pt-3 sm:pt-0 sm:border-none border-slate-100 w-full sm:w-auto">
                              <div className="mb-2 text-center sm:text-right">
                                <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                                  Estimated Total Fare:
                                </span>
                                <div className="text-3xl font-black text-slate-950 tracking-tight">
                                  ₹{opt.finalFare.toLocaleString("en-IN")}
                                </div>
                              </div>

                              <span className="text-[10px] text-slate-400 font-semibold block mb-3">
                                Includes dynamic toll policies
                              </span>

                              <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[200px]">
                                <button
                                  type="button"
                                  onClick={() => handleWhatsAppManualRedirect(opt)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl shadow-md transition-all text-center w-full flex items-center justify-center gap-1.5"
                                >
                                  💬 Book On WhatsApp
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedVehicleType(opt.vehicleType);
                                    setPaymentSplitMode((p) => ({ ...p, [opt.id]: "half" }));
                                    setShowUserForm(true);
                                  }}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-xs transition-all text-center w-full"
                                >
                                  Book Online
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="w-full bg-slate-900 border-t border-slate-800 py-2 px-4 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5 shadow-inner">
                            <span className="text-[10px] sm:text-[11px] text-orange-500">🛡️</span>
                            <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-300 uppercase tracking-wide">
                              100% Payable Amount On Screen. <span className="text-orange-400">No Any Hidden Charges</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-md text-left w-full">
                    <div className="text-center mb-5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded">
                        Secure Form
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-2">Enter Details to Complete Booking</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                          Customer Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Type customer name..."
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-sm font-bold focus:outline-none focus:border-orange-500 transition shadow-xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                          Mobile Number For Driver SMS
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="Enter 10-digit phone number..."
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))}
                          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-sm font-bold focus:outline-none focus:border-orange-500 transition shadow-xs"
                        />
                      </div>

                      {selectedOption && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                            Split Booking Matrix
                          </span>

                          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-1">
                            <button
                              type="button"
                              onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "half" }))}
                              className={`rounded-lg py-2 text-center text-[11px] font-black uppercase tracking-wide ${
                                currentSelectedMode === "half" ? "bg-orange-600 text-white shadow-xs" : "text-slate-500"
                              }`}
                            >
                              50% Advance
                            </button>

                            <button
                              type="button"
                              onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "full" }))}
                              className={`rounded-lg py-2 text-center text-[11px] font-black uppercase tracking-wide ${
                                currentSelectedMode === "full" ? "bg-slate-900 text-white shadow-xs" : "text-slate-500"
                              }`}
                            >
                              Full Pay
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 block uppercase">Payable Now</span>
                              <span className="text-xl font-black text-slate-900">
                                ₹{displayPayNowNumber.toLocaleString("en-IN")}
                              </span>
                            </div>

                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                              {selectedOption.vehicleLabel}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowUserForm(false)}
                          className="w-full border border-slate-300 bg-slate-100 text-slate-700 font-bold text-xs uppercase py-3.5 rounded-xl transition"
                        >
                          Back
                        </button>

                        <button
                          type="button"
                          onClick={() => selectedOption && handleDummyOnlineBooking(selectedOption)}
                          disabled={paymentLoadingId !== null}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg shadow-orange-600/20 disabled:opacity-50"
                        >
                          {paymentLoadingId ? "Syncing..." : "Book Online"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
// app/cabs/korba/page.tsx
"use client";

import React, { useState } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import {
  Car,
  Factory,
  CheckCircle2,
  Building2,
  Phone,
} from "lucide-react";
import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";
import TrackedCallButton from "@/components/TrackedCallButton";
import FareCalculator from "@/components/FareCalculator";
import {
  calculateFare,
  VEHICLES,
  type BookingType,
  type VehicleType,
  type ServiceType,
} from "@/lib/fareCalculator";

// Firebase initialization
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let db: Firestore | null = null;
if (typeof window !== "undefined") {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

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

type SuccessReceipt = {
  invoiceId: string;
  pickup: string;
  drop: string;
  date: string;
  time: string;
  vehicle: string;
  amount: number;
  paymentMode: "50% ADVANCE" | "FULL PAYMENT";
};

const vehicles = [
  {
    name: "Maruti Suzuki Dzire",
    type: "Premium Sedan (AC)",
    price: "₹11/km onwards",
    image: "/dezire.png",
    specs: ["4 Passengers", "2 Bags", "Climate Control", "Zero Cancel Rate"]
  },
  {
    name: "Maruti Suzuki Ertiga",
    type: "Comfortable MUV (6+1 Seater)",
    price: "₹13/km onwards",
    image: "/ertiga.png",
    specs: ["6 Passengers", "4 Bags", "Dual AC System", "Best for Families"]
  },
  {
    name: "Toyota Innova Crysta",
    type: "Luxury Executive SUV",
    price: "₹20/km onwards",
    image: "/crysta.png",
    specs: ["7 Passengers", "Heavy Luggage", "Captain Seats", "VIP Protocol Standard"]
  },
];

// 👑 MASTER KORBA & REGIONAL INDUSTRIAL MICRO-CORRIDORS WITH UNICODE ARROWS
const MICRO_ROUTES = [
  { from: "NTPC Jamnipali, Korba", to: "Swami Vivekananda Airport (RPR)", dist: "215 KMs", tag: "Airport Transfer" },
  { from: "BALCO Township, Korba", to: "Raipur Railway Station", dist: "210 KMs", tag: "Capital Link" },
  { from: "Gevra / Dipka Mines", to: "Bilaspur Junction", dist: "95 KMs", tag: "Frequent Run" },
  { from: "Kusmunda Area, Korba", to: "Raigarh Industrial Belt", dist: "155 KMs", tag: "Industrial Link" },
  { from: "Transport Nagar, Korba", to: "Champa Junction", dist: "55 KMs", tag: "Railway Connection" },
  { from: "Urga Bypass, Korba", to: "Bilaspur High Court", dist: "85 KMs", tag: "Legal/Business Run" },
  { from: "Katghora Outer, Korba", to: "Ambikapur Surguja", dist: "135 KMs", tag: "Mountain Route" },
  { from: "CSEB Colony, Korba", to: "Janjgir Core", dist: "65 KMs", tag: "Regional Link" },
  { from: "Darri Barrage, Korba", to: "Ratanpur Temple", dist: "60 KMs", tag: "Spiritual Tour" },
  { from: "Korba City Core", to: "Jharsuguda Odisha", dist: "220 KMs", tag: "Interstate Link" }
];

export default function TaxiServiceInKorbaPage() {
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<SuccessReceipt | null>(null);
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("sedan");
  const [paymentSplitMode, setPaymentSplitMode] = useState<Record<string, "full" | "half">>({});

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);

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
    } catch (e) {
      return opt.billedDistance;
    }
  };

  const handleOnlinePaymentCheckout = async (option: FareOption) => {
    if (!popupData) return;
    if (!customerName.trim() || !customerPhone.trim() || customerPhone.length < 10) {
      alert("⚠️ Kripya sahi Naam aur 10-digit Mobile Number darj karein!");
      return;
    }

    setPaymentLoadingId(option.id);
    const mode = paymentSplitMode[option.id] || "full";
    const totalFareValue = option.finalFare; 
    const processAmount = mode === "half" ? Math.round(totalFareValue / 2) : totalFareValue;

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: processAmount, pickup: popupData.pickup, drop: popupData.drop, vehicleLabel: option.vehicleLabel }),
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Order generation error");

      const paymentObject = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: "INR",
        name: "Khatu Rides Travels Co.",
        description: `${option.vehicleLabel} Route Allocation`,
        order_id: orderData.orderId,
        prefill: { name: customerName, contact: customerPhone },
        theme: { color: "#ea580c" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/verify-booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              pickup: popupData.pickup,
              drop: popupData.drop,
              bookingType: popupData.bookingType,
              pickupDate: popupData.pickupDate,
              pickupTime: popupData.pickupTime,
              vehicleLabel: option.vehicleLabel,
              amount: processAmount,
            }),
          });
          const verifyData = await verifyRes.json();
          
          if (verifyRes.ok && verifyData.success) {
            const finalInvoiceId = verifyData.invoiceId || `KR-${Math.floor(100000 + Math.random() * 900000)}`;

            if (db) {
              await addDoc(collection(db, "bookings"), {
                invoiceId: finalInvoiceId,
                customerName: customerName,
                customerPhone: customerPhone,
                pickup: popupData.pickup,
                drop: popupData.drop,
                bookingType: popupData.bookingType,
                serviceType: popupData.serviceType,
                pickupDate: popupData.pickupDate,
                pickupTime: popupData.pickupTime,
                returnDate: popupData.returnDate || null,
                vehicleLabel: option.vehicleLabel,
                amountPaid: processAmount,
                paymentMode: mode === "half" ? "50% ADVANCE" : "FULL PAYMENT",
                razorpayPaymentId: response.razorpay_payment_id,
                createdAt: serverTimestamp()
              });
            }

            setShowPopup(false);
            setShowUserForm(false);
            setSuccessReceipt({
              invoiceId: finalInvoiceId,
              pickup: popupData.pickup,
              drop: popupData.drop,
              date: convertToIndianDate(popupData.pickupDate),
              time: formatTimeToAMPM(popupData.pickupTime),
              vehicle: option.vehicleLabel,
              amount: processAmount,
              paymentMode: mode === "half" ? "50% ADVANCE" : "FULL PAYMENT",
            });
          }
        },
      });
      paymentObject.open();
    } catch (error: any) {
      alert(error.message || "Payment interface failed");
    } finally {
      setPaymentLoadingId(null);
    }
  };

  const handleWhatsAppManualRedirect = (option: FareOption) => {
    if (!popupData) return;

    const textPayload = `Hello Khatu Rides Travels Co., 

I would like to book an outstation cab package shortly from Korba. The route details are listed below:

*ROUTE MANIFEST CARD:*
• From : ${popupData.pickup}
• To: ${popupData.drop}
• Vehicle Segment : ${option.vehicleLabel}
• Trip Type : ${popupData.bookingType.toUpperCase()}
• Date & Time: ${convertToIndianDate(popupData.pickupDate)} at ${formatTimeToAMPM(popupData.pickupTime)}

*PRICING ESTIMATION SHEET:*
• Total Fare: Rs. ${option.finalFare.toLocaleString("en-IN")}.00 (All-Inclusive)

Please register this vehicle booking manually in the control panel desk. Thank you!`;

    const cleanFormattedUrl = `https://wa.me/919244137353?text=${encodeURIComponent(textPayload)}`;
    window.open(cleanFormattedUrl, "_blank");
  };

  const korbaSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Khatu Rides Korba Taxi Service Desk",
    "image": "https://www.khaturidescg.in/dezire.png",
    "description": "Premium industrial outstation car rental, BALCO township transfers, and Raipur Airport drops from Korba, Chhattisgarh.",
    "brand": {
      "@type": "Brand",
      "name": "Khatu Rides Travels Co."
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "1199",
      "highPrice": "4900",
      "offerCount": "25"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "ratingCount": "315"
    }
  };

  const selectedOption = popupData?.fareOptions.find((item) => item.vehicleType === selectedVehicleType);
  const totalPricingBase = selectedOption ? selectedOption.finalFare : 0;
  const currentSelectedMode = selectedOption && paymentSplitMode[selectedOption.id] ? paymentSplitMode[selectedOption.id] : "full";
  const displayPayNowNumber = currentSelectedMode === "half" ? Math.round(totalPricingBase / 2) : totalPricingBase;

  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen">
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(korbaSchema) }}
      />

      {/* 👑 PREMIUM DYNAMIC HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-900 pb-12">
        {/* Backdrop Glow Map Mask */}
        <div className="absolute inset-0 w-full h-full scale-105 opacity-10 blur-xs pointer-events-none">
          <img src="/banner6.png" alt="Route Map Guide" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/5 via-slate-950/90 to-slate-950" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 md:pt-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Verified Industrial Cab Operator
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl text-white">
            Premium Taxi Service in Korba
          </h1>

          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-slate-400">
            Reliable on-time transit for BALCO, NTPC, Gevra, and Kusmunda industrial belts. Book executive Hatchbacks, Sedans, Ertigas, or VIP Innova Crystas with certified local drivers.
          </p>
        </div>

        {/* 👑 FARE CALCULATOR - FLOATING DIRECTLY UNDER HERO */}
        <div className="relative z-20 mx-auto max-w-5xl px-4 mt-10">
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-black/50">
            <h3 className="text-sm font-black text-center text-orange-500 uppercase tracking-widest mb-4">
              Calculate Real-Time Korba Outstation Slabs
            </h3>
            <FareCalculator 
              onFareCalculated={(data) => {
                setPopupData(data);
                setSelectedVehicleType("sedan");
                setShowPopup(true);
                setShowUserForm(false);
                setPaymentSplitMode({});
              }}
            />
          </div>
        </div>
      </section>

      {/* 📊 SERVICES DOCK SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
        <header className="text-center mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block mb-1">
            Operational Pillars
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Professional Travel Core
          </h2>
        </header>

        <div className="grid gap-6 md:grid-cols-4">
          <Feature
            icon={<Factory size={28} />}
            title="Industrial Travel"
            text="Specialized routine corporate runs covering NTPC, BALCO, and SECL coal mines."
          />
          <Feature
            icon={<Car size={28} />}
            title="One-Way Corridor"
            text="Pay strictly for the drop distance. Dedicated outstation lines to Raipur, Bilaspur & Champa."
          />
          <Feature
            icon={<Building2 size={28} />}
            title="Corporate Fleet"
            text="Clean air-conditioned sedans and spacious MUVs ready for executive business delegates."
          />
          <Feature
            icon={<Phone size={28} />}
            title="24/7 Dispatch Control"
            text="Continuous track monitoring and immediate dynamic chauffeur dispatch at any hour."
          />
        </div>
      </section>

      {/* 🚗 HIGH-END GLASSMORPHIC FLEET CONFIGURATOR */}
      <section className="bg-slate-900/40 py-16 border-y border-slate-900">
        <div className="mx-auto max-w-7xl px-4">
          <header className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block mb-1">
              Transparent Fleet Pricing
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Choose Your Korba Car Rental Category
            </h2>
          </header>

          <div className="grid gap-8 md:grid-cols-3">
            {vehicles.map((vehicle) => (
              <article
                key={vehicle.name}
                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-6 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-orange-500/50 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-white">{vehicle.name}</h3>
                    <span className="inline-block rounded-xl bg-orange-500/10 border border-orange-500/25 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-orange-500">
                      {vehicle.type}
                    </span>
                  </div>

                  <div className="relative h-40 w-full flex items-center justify-center rounded-2xl bg-slate-950/50 border border-white/[0.02] my-4 overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.name} - Khatu Rides Korba`}
                      className="max-h-28 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-all duration-300"
                    />
                  </div>

                  <ul className="grid grid-cols-2 gap-2 mt-4">
                    {vehicle.specs.map((spec, index) => (
                      <li key={index} className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span className="h-1 w-1 rounded-full bg-orange-500" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                  <div>
                    <span className="text-[8px] block text-slate-500 font-black uppercase tracking-widest">Base Dynamic Rate</span>
                    <span className="text-lg font-black text-orange-500">{vehicle.price}</span>
                  </div>
                  <TrackedWhatsAppButton
                    href="https://wa.me/919244137353"
                    className="rounded-xl bg-white/5 hover:bg-orange-600 hover:text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    Select Model
                  </TrackedWhatsAppButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 🗺️ HIGH-INTENT HIGHWAY CROWS-NEST MICRO-ROUTES */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <header className="mb-10 text-center md:text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block mb-1">
            Regional Grid Nodes
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Hyper-Local Korba Intercity Corridors
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Dynamic oneway and roundtrip links connecting local micro areas directly to high-traffic destinations.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {MICRO_ROUTES.map((route, idx) => (
            <article
              key={idx}
              className="group rounded-2xl border border-white/5 bg-white/[0.01] p-5 flex items-center justify-between hover:border-orange-500/30 hover:bg-white/[0.03] transition-all duration-300"
            >
              <div className="space-y-1 max-w-[70%]">
                <span className="inline-block rounded-lg bg-orange-500/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-orange-500">
                  {route.tag}
                </span>
                <h4 className="text-xs font-black text-white flex items-center gap-1.5 flex-wrap">
                  <span className="capitalize">{route.from}</span>
                  <span className="text-orange-500 font-bold">→</span>
                  <span className="capitalize">{route.to}</span>
                </h4>
                <p className="text-[10px] text-slate-500">
                  Distance-optimized multi-lane outstation corridor. Flat pricing standards.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] block font-black text-slate-400">{route.dist}</span>
                <TrackedWhatsAppButton
                  href="https://wa.me/919244137353"
                  className="mt-2 inline-block rounded-xl bg-white/5 group-hover:bg-orange-600 group-hover:text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  Quote
                </TrackedWhatsAppButton>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 🏙️ SUB-URBAN AREAS SERVICED GRID */}
      <section className="bg-slate-900/40 py-16 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4">
          <header className="text-center mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block mb-1">
              Local Service Coverage Map
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Areas We Serve in Korba (Energy Capital)
            </h2>
          </header>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
            {[
              "BALCO Nagar Township",
              "NTPC Jamnipali Sector",
              "Gevra Mega Project",
              "Dipka Mining Area",
              "Kusmunda SECL Colony",
              "Darri Block",
              "Transport Nagar Hub",
              "CSEB Colony Blocks",
              "Korba City Core",
              "Urga Bypass Point",
            ].map((area) => (
              <div
                key={area}
                className="rounded-2xl border border-white/5 bg-slate-950 p-4 text-center text-xs font-black text-slate-300 hover:border-orange-500/40 hover:text-white transition cursor-default"
              >
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⭐ WHY CHOOSE KHATU RIDES */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-black tracking-tight text-white text-center mb-10">
          Why Choose Khatu Rides Travels in Korba?
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Clean & Air-Conditioned Sanitized Fleet",
            "Vetted Professional Drivers with Highway Expertise",
            "Completely Transparent Flat Slabs & Zero Hidden Costs",
            "Reliable Feeder Runs to Champa Junction Railway Station",
            "Safe Long-Distance Outstation Lines Across State Borders",
            "Round-the-clock Dedicated Dispatch & Route Supervision Desk",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3.5 rounded-2xl border border-white/5 bg-white/[0.01] p-5 hover:border-orange-500/20 transition"
            >
              <CheckCircle2 className="text-orange-500 shrink-0" size={18} />
              <span className="text-xs font-bold text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-900/40 py-16 border-t border-slate-900">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-black tracking-tight text-white text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Faq
              q="Do you provide Korba to Raipur Airport taxi service?"
              a="Yes, Khatu Rides Travels provides dynamic executive pickups from NTPC Jamnipali, BALCO, and other regions directly to Swami Vivekananda Airport Raipur (RPR)."
            />
            <Faq
              q="Can I book a quick drop from Korba to Champa Railway Station?"
              a="Yes, we run high-frequency feeder lines connecting Transport Nagar and CSEB Colony directly to Champa Junction with flat upfront pricing."
            />
            <Faq
              q="Do you provide specialized corporate cabs for BALCO and NTPC visitors?"
              a="Absolutely. We specialize in outstation corporate car rental contracts and industrial travel packages across SECL networks, Gevra, and Kusmunda mines."
            />
          </div>
        </div>
      </section>

      {/* MOBILE STICKY PANEL */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden pointer-events-none">
        <div className="grid grid-cols-2 gap-3 bg-slate-950/90 backdrop-blur-lg border border-white/10 p-2.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
          
          <TrackedWhatsAppButton 
            href="https://wa.me/919244137353" 
            className="relative flex h-12 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-xs font-black uppercase text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 animate-pulse overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 animate-ping rounded-xl opacity-20 pointer-events-none" />
            <span className="text-sm">💬</span>
            <span>WhatsApp</span>
          </TrackedWhatsAppButton>

          <TrackedCallButton 
            href="tel:9244137353" 
            className="group flex h-12 items-center justify-center gap-1.5 rounded-xl bg-orange-600 text-xs font-black uppercase text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition-all active:scale-95"
          >
            <span className="text-sm animate-[wiggle_1s_ease-in-out_infinite]">
              📞
            </span>
            <span>Call Desk</span>
          </TrackedCallButton>

        </div>
      </div>

      {/* POPUP DRAWER */}
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
                <div>Route: <span className="text-slate-950 font-black text-sm block sm:inline">{popupData.pickup.split(",")[0]} - {popupData.drop.split(",")[0]}</span></div>
                <div className="flex gap-4">
                  <div>Trip: <span className="text-slate-950 font-black uppercase bg-orange-100 px-2 py-0.5 rounded text-[11px] text-orange-700">{popupData.bookingType}</span></div>
                  <div>Date: <span className="text-slate-950 font-black">{convertToIndianDate(popupData.pickupDate)}</span></div>
                  <div>Time: <span className="text-slate-950 font-black">{formatTimeToAMPM(popupData.pickupTime)}</span></div>
                </div>
                <button type="button" onClick={() => setShowPopup(false)} className="text-slate-400 hover:text-slate-900 font-black text-sm transition-colors">✕ Close</button>
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
                      const extraRatePerKm = opt.vehicleType === "sedan" ? 11 : opt.vehicleType === "ertiga" ? 17 : 20.7;

                      return (
                        <div key={opt.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs hover:shadow-md transition flex flex-col">
                          <div className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] sm:text-xs py-2 px-4 uppercase tracking-wider text-center shadow-xs">
                            🔥 Make Online Advance Payment and Get Upto 10% Discount On Your Booking Instantly
                          </div>

                          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto text-center sm:text-left">
                              <img src={VEHICLES[opt.vehicleType]?.image} alt={opt.vehicleLabel} className="w-32 h-20 sm:w-36 sm:h-24 object-contain flex-shrink-0 mx-auto sm:mx-0" />
                              <div>
                                <h4 className="text-lg font-black text-slate-900">{opt.vehicleLabel}</h4>
                                <p className="text-xs text-slate-400 mt-0.5 font-medium">or equivalent | {opt.vehicleType === "sedan" ? "4" : "6"}+1 Seater AC Cab</p>
                                
                                <div className="mt-2.5 flex flex-wrap gap-1.5 justify-center sm:justify-start text-[10px] font-bold">
                                  <span className="bg-slate-100 text-slate-500 border border-slate-200/50 px-2 py-0.5 rounded">👤 Allowance Included</span>
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
                                <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Estimated Total Fare:</span>
                                <div className="text-3xl font-black text-slate-950 tracking-tight">₹{opt.finalFare.toLocaleString("en-IN")}</div>
                              </div>
                              
                              <span className="text-[10px] text-slate-400 font-semibold block mb-3">Includes dynamic toll policies</span>
                              
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
                              100% PAYABLE AMOUNT ON SCREEN. <span className="text-orange-400">NO ANY HIDDEN CHARGES</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-md text-left w-full">
                    <div className="text-center mb-5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded">Secure Form</span>
                      <h4 className="text-base font-black text-slate-900 mt-2">Enter Details to Complete Booking</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Customer Full Name</label>
                        <input 
                          type="text" 
                          placeholder="Type customer name..." 
                          value={customerName} 
                          onChange={(e) => setCustomerName(e.target.value)} 
                          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-sm font-bold focus:outline-none focus:border-orange-500 transition shadow-xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Mobile Number (For Driver SMS)</label>
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
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Split Booking Matrix</span>
                          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-1">
                            <button type="button" onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "half" }))} className={`rounded-lg py-2 text-center text-[11px] font-black uppercase tracking-wide ${currentSelectedMode === "half" ? "bg-orange-600 text-white shadow-xs" : "text-slate-500"}`}>
                              50% Advance
                            </button>
                            <button type="button" onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "full" }))} className={`rounded-lg py-2 text-center text-[11px] font-black uppercase tracking-wide ${currentSelectedMode === "full" ? "bg-slate-900 text-white shadow-xs" : "text-slate-500"}`}>
                              Full Pay
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 block uppercase">Payable Now</span>
                              <span className="text-xl font-black text-slate-900">₹{displayPayNowNumber.toLocaleString("en-IN")}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">{selectedOption.vehicleLabel}</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button type="button" onClick={() => setShowUserForm(false)} className="w-full border border-slate-300 bg-slate-100 text-slate-700 font-bold text-xs uppercase py-3.5 rounded-xl transition">
                          ↩ Back
                        </button>
                        <button
                          type="button"
                          onClick={() => selectedOption && handleOnlinePaymentCheckout(selectedOption)}
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

      {/* SUCCESS RECEIPT */}
      <AnimatePresence>
        {successReceipt && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-xs">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="bg-emerald-50 px-5 py-5 text-center border-b border-emerald-100">
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">✓</div>
                <h3 className="text-lg font-black text-slate-950">Allocation Confirmed</h3>
                <p className="text-xs text-slate-500 mt-1">Your route details have been securely recorded in Firebase.</p>
              </div>
              <div className="p-5 space-y-4 text-left">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2 text-slate-700">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Invoice Summary</div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Invoice ID:</span> <span>{successReceipt.invoiceId}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Vehicle:</span> <span>{successReceipt.vehicle}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Pickup:</span> <span className="truncate max-w-[180px]">{successReceipt.pickup}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Drop Point:</span> <span className="truncate max-w-[180px]">{successReceipt.drop}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Timeline:</span> <span>{successReceipt.date} at {successReceipt.time}</span></div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-slate-950 text-sm">
                    <span>Amount Paid ({successReceipt.paymentMode}):</span> <span>₹{successReceipt.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSuccessReceipt(null)} className="w-full h-11 bg-slate-950 text-xs font-black uppercase tracking-wider text-white rounded-xl shadow">
                    Close Panel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 hover:border-orange-500/20 transition-all">
      <div className="text-orange-500">{icon}</div>
      <h3 className="mt-4 text-lg font-black text-white">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{text}</p>
    </div>
  );
}

function Faq({
  q,
  a,
}: {
  q: string;
  a: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
      <h3 className="text-base font-black text-white">{q}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{a}</p>
    </div>
  );
}
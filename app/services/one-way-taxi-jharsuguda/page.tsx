// app/cabs/jharsuguda/page.tsx
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
  Plane,
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

// Firebase initialization panel
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, Firestore } from "firebase/firestore";
import ReviewsCarousel from "@/components/ReviewsCarousel";

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

// 👑 INTERSTATE DIRECTORY - 10+ MICRO-CORRIDORS FOR CROSS-BORDER SEARCH DOMINATION
const MICRO_ROUTES = [
  { from: "Jharsuguda Airport (JRG)", to: "Raigarh Industrial Town", dist: "75 KMs", tag: "Interstate Link" },
  { from: "Jharsuguda Junction (Station)", to: "BALCO Nagar, Korba", dist: "220 KMs", tag: "Industrial Corridor" },
  { from: "Vedanta Alumina, Jharsuguda", to: "Swami Vivekananda Airport Raipur", dist: "345 KMs", tag: "Long-Haul Corporate" },
  { from: "Brajarajnagar Mining Belt", to: "Gharghoda Coal Hub", dist: "85 KMs", tag: "Cross-Border Link" },
  { from: "Sambalpur Bypass Loop", to: "Bilaspur Vyapar Vihar", dist: "250 KMs", tag: "Business Connection" },
  { from: "SMC Power Industry", to: "Champa Junction Railway Station", dist: "165 KMs", tag: "Feeder Route" },
  { from: "Belpahar Mining Sector", to: "Ambikapur North Hub", dist: "285 KMs", tag: "Regional Highway" },
  { from: "Jharsuguda City Core", to: "Saraipali Bypass Loop", dist: "160 KMs", tag: "Border Feeder" },
  { from: "Jharsuguda Outer Ring Rd", to: "Tatibandh Logistics, Raipur", dist: "340 KMs", tag: "Commercial Corridor" },
  { from: "Beheramal Area, Jharsuguda", to: "Jashpur Hills Plateau", dist: "185 KMs", tag: "North Node Link" }
];

export default function TaxiServiceInJharsugudaPage() {
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

I would like to book an outstation taxi from Jharsuguda. The route details are listed below:

*ROUTE MANIFEST CARD:*
• From : ${popupData.pickup}
• To: ${popupData.drop}
• Vehicle Segment : ${option.vehicleLabel}
• Trip Type : ${popupData.bookingType.toUpperCase()}
• Date & Time: ${convertToIndianDate(popupData.pickupDate)} at ${formatTimeToAMPM(popupData.pickupTime)}

*PRICING ESTIMATION SHEET:*
• Total Fare: Rs. ${option.finalFare.toLocaleString("en-IN")}.00 (All-Inclusive)

Please arrange this interstate taxi profile immediately. Thank you!`;

    const cleanFormattedUrl = `https://wa.me/919244137353?text=${encodeURIComponent(textPayload)}`;
    window.open(cleanFormattedUrl, "_blank");
  };

  const jharsugudaSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Khatu Rides Jharsuguda Interstate Taxi Command Desk",
    "image": "https://www.khaturidescg.in/dezire.png",
    "description": "Premium cross-border outstation cabs from Jharsuguda to Raigarh, Korba, and Raipur Airport. Certified corporate car rentals.",
    "brand": {
      "@type": "Brand",
      "name": "Khatu Rides Travels Co."
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "1499",
      "highPrice": "6500",
      "offerCount": "25"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "ratingCount": "195"
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jharsugudaSchema) }}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-900 pb-12">
        <div className="absolute inset-0 w-full h-full scale-105 opacity-10 blur-xs pointer-events-none">
          <img src="/banner6.png" alt="Interstate Route Guide" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/5 via-slate-950/90 to-slate-950" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 md:pt-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Verified Interstate Cab Network
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl text-white">
            Premium Taxi Service in Jharsuguda
          </h1>

          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-slate-400">
            Seamless cross-border car rentals from Jharsuguda to Chhattisgarh. Safe, verified oneway and roundtrip taxi drops covering Raigarh industrial clusters, Korba mining zones, and Raipur Airport.
          </p>
        </div>

        {/* FARE CALCULATOR */}
        <div className="relative z-20 mx-auto max-w-5xl px-4 mt-10">
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-black/50">
            <h3 className="text-sm font-black text-center text-orange-500 uppercase tracking-widest mb-4">
              Calculate Real-Time Jharsuguda Outstation Slabs
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

     
      {/* 👑 5. DYNAMIC REVIEWS SLIDER */}
             <ReviewsCarousel />

      {/* SERVICES DOCK SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
        <header className="text-center mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block mb-1">
            Operational Excellence
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Cross-Border Fleet Capabilities
          </h2>
        </header>

        <div className="grid gap-6 md:grid-cols-4">
          <Feature
            icon={<Plane size={28} />}
            title="Airport Connections"
            text="Reliable transit syncing Jharsuguda Airport drops directly with Raigarh or Raipur trading sectors."
          />
          <Feature
            icon={<Factory size={28} />}
            title="Industrial Corridors"
            text="Dedicated corporate logistics mapped specifically for Vedanta, SMC, and JSPL steel units."
          />
          <Feature
            icon={<Building2 size={28} />}
            title="Hassle-Free Tolls"
            text="All applicable inter-state taxes, toll taxes, and route permits pre-integrated upfront."
          />
          <Feature
            icon={<Phone size={28} />}
            title="24/7 Route Assistance"
            text="Continuous real-time dispatch tracking and live chauffeur updates at any hour."
          />
        </div>
      </section>

      {/* VEHICLES MATRIX */}
      <section className="bg-slate-900/40 py-16 border-y border-slate-900">
        <div className="mx-auto max-w-7xl px-4">
          <header className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block mb-1">
              Transparent Fleet Matrix
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Choose Your Jharsuguda Outstation Vehicle
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
                      alt={`${vehicle.name} - Khatu Rides Jharsuguda`}
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

      {/* MICRO-ROUTES DIRECTORY */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <header className="mb-10 text-center md:text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block mb-1">
            Cross-Border Active Slabs
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Hyper-Local Jharsuguda Interstate Lines
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Pre-calculated commercial links tracking straight from Odisha industrial points into Chhattisgarh business hubs.
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
                  Distance-optimized multi-lane cross-border network. Flat pricing policies apply.
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

      {/* COVERAGE MAP AREAS */}
      <section className="bg-slate-900/40 py-16 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4">
          <header className="text-center mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block mb-1">
              Odisha-Side Presence Map
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Areas We Serve Across Jharsuguda Hub
            </h2>
          </header>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
            {[
              "Jharsuguda Airport",
              "Jharsuguda Junction RIG",
              "Vedanta Alumina Area",
              "SMC Power Sector",
              "Brajarajnagar Mines",
              "Belpahar Core Hub",
              "Beheramal Sector",
              "Sambalpur Bypass Loop",
              "Sarbahal Residential",
              "Industrial Estate Core",
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

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-black tracking-tight text-white text-center mb-10">
          Why Choose Khatu Rides Travels in Jharsuguda?
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Seamless Interstate Border Clearances & Active Tax Permits",
            "Meticulously Sanitized Air-Conditioned Fleet Slabs",
            "Fixed Upfront Slabs with Absolute Guarantee against Hidden Costing",
            "Chauffeurs highly experienced with Highway Multi-Lane Routing",
            "On-Time Flight-Synced Pickups from Jharsuguda Airport Core",
            "24/7 Continuous Communication Links with Central Control Desk",
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

      {/* FAQS */}
      <section className="bg-slate-900/40 py-16 border-t border-slate-900">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-black tracking-tight text-white text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Faq
              q="Do you provide taxi service from Jharsuguda to Raigarh or Korba?"
              a="Yes, Khatu Rides specializes in providing smooth cross-border one-way and roundtrip cabs connecting Jharsuguda Vedanta, SMC, or Airport directly to Raigarh, Korba, and Raipur."
            />
            <Faq
              q="Are state dynamic road tax permits included in your upfront price?"
              a="Yes, all applicable interstate RTO road taxes, driver allowances, and dynamic highway toll assessments are calculated transparently under our flat upfront pricing sheets."
            />
            <Faq
              q="Can I hire a 7-seater Ertiga or luxury Crysta for family airport pickup?"
              a="Absolutely. We maintain a large premium fleet of clean Maruti Suzuki Ertigas and Toyota Innova Crystas equipped with heavy carrier accessories for luggage drops."
            />
          </div>
        </div>
      </section>

      {/* MOBILE ACTIONS */}
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

      {/* POPUP ENGINE */}
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
                <div className="border-x border-white/20">🛡️ Chauffeur Slabs Inc.</div>
                <div>🎧 24x7 Control Desk</div>
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
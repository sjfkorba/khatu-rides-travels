// app/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import FareCalculator from "@/components/FareCalculator";
import ImageCarousel from "@/components/ImageCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import SeoTextBlock from "@/components/SeoTextBlock";
import {
  calculateFare,
  VEHICLES,
  type BookingType,
  type VehicleType,
  type ServiceType,
} from "@/lib/fareCalculator";

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

const ROUTES = {
  korba: [
    { from: "Korba, Chhattisgarh", to: "Bilaspur, Chhattisgarh", tag: "Popular Route", km: 90 },
    { from: "Korba, Chhattisgarh", to: "Raipur, Chhattisgarh", tag: "Capital Route", km: 215 },
    { from: "Korba, Chhattisgarh", to: "Raigarh, Chhattisgarh", tag: "Business Route", km: 150 },
  ],
  bilaspur: [
    { from: "Bilaspur, Chhattisgarh", to: "Raipur, Chhattisgarh", tag: "Top Booking", km: 115 },
    { from: "Bilaspur, Chhattisgarh", to: "Korba, Chhattisgarh", tag: "Frequent Travel", km: 90 },
    { from: "Bilaspur, Chhattisgarh", to: "Ambikapur, Chhattisgarh", tag: "Long Route", km: 180 },
  ],
  raipur: [
    { from: "Raipur, Chhattisgarh", to: "Bilaspur, Chhattisgarh", tag: "Corporate Route", km: 115 },
    { from: "Raipur, Chhattisgarh", to: "Korba, Chhattisgarh", tag: "Intercity Ride", km: 215 },
    { from: "Raipur, Chhattisgarh", to: "Jagdalpur, Chhattisgarh", tag: "Tour Route", km: 290 },
  ],
} as const;

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"korba" | "bilaspur" | "raipur">("korba");
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<SuccessReceipt | null>(null);
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("sedan");
  const [paymentSplitMode, setPaymentSplitMode] = useState<Record<string, "full" | "half">>({});

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);

  const calculatorSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const handleScrollTrigger = () => {
      if (calculatorSectionRef.current) {
        calculatorSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    window.addEventListener("khatuScrollToCalc", handleScrollTrigger);
    return () => window.removeEventListener("khatuScrollToCalc", handleScrollTrigger);
  }, []);

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

  const triggerQuickBooking = (from: string, to: string, routeDistance: number) => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    const baseDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const baseTime = `${String(now.getHours()).padStart(2, "0")}:00`;

    const vehicleKeys = Object.keys(VEHICLES) as VehicleType[];

    const fareOptions: FareOption[] = vehicleKeys.map((type) => {
      const result = calculateFare({
        distance: routeDistance,
        vehicleType: type,
        bookingType: "oneway",
        serviceType: "outstation",
        pickupDate: baseDate,
        pickupTime: baseTime,
      });

      return {
        id: `quick-${type}`,
        vehicleType: type,
        vehicleLabel: VEHICLES[type].label,
        vehicleImage: VEHICLES[type].image,
        finalFare: result.finalFare,
        fareText: `₹${result.finalFare.toLocaleString("en-IN")}`,
        billedDistance: result.billedDistance,
        durationMinutes: result.durationMinutes,
      };
    });

    setPopupData({ fareOptions, pickup: from, drop: to, bookingType: "oneway", serviceType: "outstation", pickupDate: baseDate, pickupTime: baseTime });
    setSelectedVehicleType("sedan");
    setShowUserForm(false);
    setShowPopup(true);
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

    const textPayload = `🚗 *New Cab Booking Enquiry - Khatu Rides Travels* 🏁

Hello! I am interested in booking an outstation trip. Here are my travel details for your review:

📍 *TRAVEL ITINERARY:*
• *From:* ${popupData.pickup}
• *To:* ${popupData.drop}
• *Trip Type:* ${popupData.bookingType.toUpperCase()}
• *Date & Time:* ${convertToIndianDate(popupData.pickupDate)} | ${formatTimeToAMPM(popupData.pickupTime)}

🚖 *VEHICLE SELECTION:*
• *Category:* ${option.vehicleLabel}
• *Estimated Fare:* Rs. ${option.finalFare.toLocaleString("en-IN")}/- (All-Inclusive)

Kindly let me know about the availability and the booking process. I look forward to traveling with Khatu Rides! ✨`;

    const cleanFormattedUrl = `https://wa.me/919244137353?text=${encodeURIComponent(textPayload)}`;
    window.open(cleanFormattedUrl, "_blank");
  };

  const selectedOption = popupData?.fareOptions.find((item) => item.vehicleType === selectedVehicleType);
  const totalPricingBase = selectedOption ? selectedOption.finalFare : 0;
  const currentSelectedMode = selectedOption && paymentSplitMode[selectedOption.id] ? paymentSplitMode[selectedOption.id] : "full";
  const displayPayNowNumber = currentSelectedMode === "half" ? Math.round(totalPricingBase / 2) : totalPricingBase;

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 md:pb-0 font-sans">
        {/* Navigation Header Block */}
        <header className="w-full bg-orange-600 text-white shadow-md select-none">
          <div className="bg-slate-950 py-1.5 px-4 text-[10px] font-black uppercase tracking-widest flex justify-between sm:px-8 text-orange-400">
            <span>⚡ STATE FLEET NETWORK</span>
            <span className="text-white">🔒 SECURE CHECKOUT INTEGRATED</span>
            <span className="hidden sm:inline">⭐ DESTINATION CHHATTISGARH</span>
          </div>

          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase text-white leading-none">
                Khatu<span className="text-slate-900">Rides</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-200 mt-1">Travels Co.</span>
            </div>
            <div className="hidden lg:flex items-center justify-center text-center">
              <p className="text-xs font-black uppercase tracking-widest bg-slate-900/10 px-4 py-2 rounded-full border border-white/10 text-white shadow-inner">
                ✨ Best Taxi Service Provider In Chhattisgarh
              </p>
            </div>
            <div className="flex gap-2">
              <a href="tel:+919244137353" className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-900 transition-all border border-slate-800 shadow">
                📞 24x7 - 9244137353
              </a>
            </div>
          </div>
        </header>

        <ImageCarousel />

        {/* 👑 COMPACT & SLEEK FARE CALCULATOR SECTION */}
        <section ref={calculatorSectionRef} className="relative z-30 px-4 py-4 sm:py-6 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 w-full h-full scale-105 opacity-40 blur-sm pointer-events-none">
            <img src="/banner6.png" alt="Route Backdrop Map" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 via-slate-950/90 to-slate-950" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-6xl w-full">
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
        </section>

        {/* 👑 POPULAR CHHATTISGARH ROUTES SECTION (GLASSMORPHISM & INTERACTIVE BORDER HIGHLIGHT) */}
        <section className="mt-16 px-4 max-w-7xl mx-auto" aria-labelledby="routes-heading">
          {/* Header Section for SEO - Clean HTML Tags & Semantic Flow */}
          <header className="text-center sm:text-left mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 block mb-1">
              Top Outstation Corridor Deals
            </span>
            <h2 id="routes-heading" className="text-3xl font-black text-slate-900 tracking-tight">
              Popular Chhattisgarh Routes
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Most frequented intercity highway routes with premium oneway dynamic slabs & transparent pricing.
            </p>
          </header>

          {/* Premium Dynamic Horizontal Slide Tabs (Flutter UI Inspired) */}
          <nav className="flex overflow-x-auto gap-2 pb-4 scrollbar-none snap-x sm:justify-start" aria-label="Route Origin Selection">
            {(["korba", "bilaspur", "raipur"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-current={activeTab === tab ? "page" : undefined}
                className={`rounded-2xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 snap-center whitespace-nowrap border-2 ${
                  activeTab === tab
                    ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-[1.02]"
                    : "bg-white/80 backdrop-blur-md text-slate-600 border-white/60 hover:bg-white hover:text-slate-900 hover:border-slate-300/40"
                }`}
              >
                From {tab}
              </button>
            ))}
          </nav>

          {/* Flutter Light Glassmorphic Card Grid with Integrated SEO Schema Elements */}
          <div className="grid gap-6 mt-4 sm:grid-cols-3">
            {ROUTES[activeTab].map((route, index) => {
              const sampleFare = calculateFare({
                distance: route.km,
                vehicleType: "sedan",
                bookingType: "oneway",
                serviceType: "outstation",
                pickupDate: popupData?.pickupDate || new Date().toISOString().split("T")[0],
                pickupTime: popupData?.pickupTime || "06:00",
              });

              // 👑 DYNAMIC ROUTE-WISE SCHEMA MARKUP (For Google Rich Search Results)
              const routeSchema = {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": `One Way Taxi from ${route.from} to ${route.to}`,
                "description": `Premium one-way outstation taxi service from ${route.from} to ${route.to}. Billed distance ${route.km} KMs with zero hidden charges.`,
                "image": "https://khaturides.com/dezire.png",
                "offers": {
                  "@type": "Offer",
                  "price": sampleFare.finalFare,
                  "priceCurrency": "INR",
                  "itemCondition": "https://schema.org/NewCondition",
                  "availability": "https://schema.org/InStock",
                  "url": `https://khaturides.com/cabs/${route.from.toLowerCase().replace(/[^a-z0-9]/g, "")}-to-${route.to.toLowerCase().replace(/[^a-z0-9]/g, "")}`
                }
              };

              return (
                <article
                  key={`${route.from}-${route.to}-${index}`}
                  className="group relative rounded-3xl border border-white/80 bg-white/70 backdrop-blur-md p-6 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_0_rgba(249,115,22,0.08)] hover:bg-white/90 hover:border-orange-500/80 transition-all duration-300 ease-out cursor-pointer"
                >
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(routeSchema) }}
                  />

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-xl bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-orange-600">
                        {route.tag || "Best Seller"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-extrabold tracking-wide">{route.km} KMs Drop</span>
                    </div>

                    <h3 className="mt-4 text-lg font-black text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors duration-200">
                      {route.from.split(",")[0]} to {route.to.split(",")[0]}
                    </h3>
                    
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Premium air-conditioned sedan drop. Fixed flat fare including all applicable state taxes & road guidelines.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100/50 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] block text-slate-400 font-extrabold uppercase tracking-widest">
                        Sedan Rate
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900">
                          ₹{sampleFare.finalFare.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">oneway</span>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerQuickBooking(route.from, route.to, route.km)}
                      className="rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-orange-600 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                    >
                      Book Now
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 👑 DYNAMIC PREMIUM FLEET SERVICES SECTION WITH GLASSMORPHISM & HOVER COLOR HIGHLIGHT */}
        <section className="mt-16 bg-slate-50/50 py-16 px-4 border-y border-slate-200/80" aria-labelledby="fleet-heading">
          <div className="max-w-7xl mx-auto">
            
            <header className="text-center mb-12">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 block mb-1">
                Our Core Commercial Domain
              </span>
              <h2 id="fleet-heading" className="text-3xl font-black text-slate-950 tracking-tight">
                Our Premium Fleet Services
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
                Choose from our meticulously maintained fleet. High-comfort rides managed by verified professional local drivers.
              </p>
            </header>

            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  key: "sedan",
                  title: "Premium Sedans",
                  subtitle: "Maruti Suzuki Dzire (or equivalent)",
                  desc: "Perfect for budget-friendly commercial travel, daily business outstation trips, and cozy family airport runs.",
                  image: "/dezire.png",
                  specs: ["4 Passengers", "2 Bags Capacity", "AC & Music System", "₹11/KM Base Rate"],
                  accent: "from-blue-500/10 to-transparent"
                },
                {
                  key: "ertiga",
                  title: "Executive MUVs",
                  subtitle: "Maruti Suzuki Ertiga (6-Seater)",
                  desc: "Spacious and pocket-friendly option for group trips, family getaways, and highway cruising across state borders.",
                  image: "/ertiga.png",
                  specs: ["6 Passengers", "4 Bags Capacity", "Dual AC Comfort", "₹13/KM Base Rate"],
                  accent: "from-orange-500/10 to-transparent"
                },
                {
                  key: "crysta",
                  title: "VIP Premium SUVs",
                  subtitle: "Toyota Innova Crysta (Luxury)",
                  desc: "Ultimate luxury and absolute reliability. Designed for VIP executives, heavy terrain roads, and supreme riding comfort.",
                  image: "/crysta.png",
                  specs: ["6/7 Passengers", "Heavy Luggage Carrier", "Rear AC Control", "₹20/KM Base Rate"],
                  accent: "from-amber-500/10 to-transparent"
                }
              ].map((fleet) => (
                <article
                  key={fleet.key}
                  className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/60 backdrop-blur-md p-6 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_0_rgba(0,0,0,0.06)] hover:bg-white hover:border-orange-500/80 transition-all duration-300 ease-out cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-tr ${fleet.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative z-10">
                    <header className="mb-4">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">{fleet.title}</h3>
                      <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mt-0.5">{fleet.subtitle}</p>
                    </header>

                    <div className="relative h-40 w-full flex items-center justify-center my-2 overflow-hidden rounded-2xl bg-slate-50/50 border border-slate-100">
                      <img
                        src={fleet.image}
                        alt={`${fleet.title} - Khatu Rides Travels`}
                        className="max-h-28 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] group-hover:drop-shadow-[0_20px_35px_rgba(249,115,22,0.18)] transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 ease-out"
                      />
                    </div>

                    <div className="mt-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Specifications</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {fleet.specs.map((spec, index) => (
                          <li key={index} className="flex items-center gap-1.5 text-slate-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            <span className="text-xs font-bold text-slate-700">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="mt-5 text-xs leading-relaxed text-slate-500 border-t border-slate-100/80 pt-3">
                      {fleet.desc}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 pt-2">
                    <button
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="w-full rounded-2xl border border-slate-200 bg-white hover:bg-slate-950 hover:text-white hover:border-slate-950 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-800 transition-all duration-200"
                    >
                      Configure Ride Model
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 👑 5. DYNAMIC REVIEWS SLIDER */}
        <ReviewsCarousel />

        {/* 👑 6. FULLY SEO ENHANCED CORE TEXT BLOCK WITH ACCORDION ROUTE DIRECTORY */}
        <SeoTextBlock />

        {/* 👑 PREMIUM MOBILE ANIMATED STICKY ACTION PANEL */}
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden pointer-events-none">
          <div className="grid grid-cols-2 gap-3 bg-slate-950/90 backdrop-blur-lg border border-white/10 p-2.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
            
            <a 
              href="https://wa.me/919244137353" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative flex h-12 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-xs font-black uppercase text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 animate-pulse duration-1000 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 animate-ping rounded-xl opacity-20 pointer-events-none" />
              <span className="text-sm">💬</span>
              <span>WhatsApp</span>
            </a>

            <a 
              href="tel:+919244137353" 
              className="group flex h-12 items-center justify-center gap-1.5 rounded-xl bg-orange-600 text-xs font-black uppercase text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition-all active:scale-95"
            >
              <span className="text-sm animate-[wiggle_1s_ease-in-out_infinite]">
                📞
              </span>
              <span>Call Desk</span>
            </a>

          </div>
        </div>
      </main>

      {/* Viewport Adaptive Popup Drawer Node */}
      <AnimatePresence>
        {showPopup && popupData && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-white w-full max-w-[96vw] lg:max-w-[92vw] xl:max-w-7xl rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh] text-left relative"
            >
              {/* Header */}
              <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="bg-slate-100 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700">
                  <div>
                    Route:
                    <span className="text-slate-950 font-black text-sm block sm:inline sm:ml-1">
                      {popupData.pickup.split(",")[0]} - {popupData.drop.split(",")[0]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-6">
                    <div>
                      Trip:
                      <span className="ml-1 text-slate-950 font-black uppercase bg-orange-100 px-2 py-0.5 rounded text-[11px] text-orange-700">
                        {popupData.bookingType}
                      </span>
                    </div>
                    <div>
                      Date:
                      <span className="ml-1 text-slate-950 font-black">
                        {convertToIndianDate(popupData.pickupDate)}
                      </span>
                    </div>
                    <div>
                      Time:
                      <span className="ml-1 text-slate-950 font-black">
                        {formatTimeToAMPM(popupData.pickupTime)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPopup(false)}
                      className="text-slate-400 hover:text-slate-900 font-black text-sm transition-colors px-2 py-1"
                    >
                      ✕ Close
                    </button>
                  </div>
                </div>

                {/* Trust + urgency strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 text-center">
                  <div className="bg-slate-900 text-white px-3 py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    ₹ Pre-Fixed Fare
                  </div>
                  <div className="bg-slate-900 text-white px-3 py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider border-l border-white/10">
                    🛡 Driver Allowance Included
                  </div>
                  <div className="bg-slate-900 text-white px-3 py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider border-l border-white/10">
                    🎧 24x7 Support
                  </div>
                  <div className="bg-orange-500 text-white px-3 py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider border-l border-white/10">
                    Seats Fill Fast - Book Early
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50 pb-28 sm:pb-6">
                {!showUserForm ? (
                  <div className="flex flex-col gap-4">
                    {popupData.fareOptions.map((opt) => {
                      if (!["sedan", "ertiga", "crysta"].includes(opt.vehicleType)) return null;

                      const dynamicLimitKms = getDynamicKmsLimitDisplay(opt);
                      const extraRatePerKm =
                        opt.vehicleType === "sedan" ? 13 : opt.vehicleType === "ertiga" ? 17 : 20.7;

                      return (
                        <div
                          key={opt.id}
                          className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition flex flex-col"
                        >
                          <div className="p-4 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto text-center sm:text-left">
                              {/* Increased Vehicle Image Height */}
                              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-center">
                                <img
                                  src={VEHICLES[opt.vehicleType]?.image}
                                  alt={opt.vehicleLabel}
                                  className="w-36 h-24 sm:w-44 sm:h-32 object-contain flex-shrink-0 mx-auto sm:mx-0"
                                />
                              </div>

                              <div>
                                {/* Properly Aligned Best Fare Badge next to Vehicle Name */}
                                <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
                                  <h4 className="text-lg sm:text-xl font-black text-slate-900">
                                    {opt.vehicleLabel}
                                  </h4>
                                  <img 
                                    src="/fare_badge.png" 
                                    alt="Best Fare Guarantee" 
                                    className="w-24 sm:w-28 object-contain inline-block drop-shadow-sm" 
                                  />
                                </div>

                                <p className="text-xs text-slate-400 mt-1 font-medium">
                                  or equivalent | {opt.vehicleType === "sedan" ? "4" : "6"}+1 Seater AC Cab
                                </p>

                                <div className="mt-2.5 flex flex-wrap gap-1.5 justify-center sm:justify-start text-[10px] sm:text-xs font-bold">
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

                                <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                    Free fare assistance on call
                                  </span>
                                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 border border-slate-200">
                                    No hidden charges
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-center lg:text-right flex flex-col items-center lg:items-end justify-center min-w-full lg:min-w-[280px] border-t pt-4 lg:pt-0 lg:border-none border-slate-100 w-full lg:w-auto">
                              <div className="mb-2 text-center lg:text-right">
                                <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                                  Estimated Total Fare
                                </span>
                                <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                                  ₹{opt.finalFare.toLocaleString("en-IN")}
                                </div>
                              </div>

                              <span className="text-[10px] text-slate-400 font-semibold block mb-3">
                                Includes dynamic toll policies
                              </span>

                              {/* Button Priority: Call Now (Red) -> WhatsApp (Green) -> Book Online (Slate) */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full min-w-[240px]">
                                <a
                                  href="tel:+919244137353"
                                  className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl shadow-md transition-all text-center w-full flex items-center justify-center gap-1.5 min-h-[48px]"
                                  aria-label="Call now on 9244137353"
                                >
                                  📞 Call Now
                                </a>

                                <button
                                  type="button"
                                  onClick={() => handleWhatsAppManualRedirect(opt)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl shadow-md transition-all text-center w-full flex items-center justify-center gap-1.5 min-h-[48px]"
                                >
                                  💬 WhatsApp
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedVehicleType(opt.vehicleType);
                                    setPaymentSplitMode((p) => ({ ...p, [opt.id]: "half" }));
                                    setShowUserForm(true);
                                  }}
                                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl shadow-md transition-all text-center w-full min-h-[48px]"
                                >
                                  Book Online
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="w-full bg-slate-900 border-t border-slate-800 py-2.5 px-6 text-center sm:text-left flex flex-wrap items-center justify-center sm:justify-between gap-2 shadow-inner">
                            <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-300 uppercase tracking-wide">
                              🛡 100% Payable amount on screen. <span className="text-orange-400">No hidden charges.</span>
                            </p>
                            <a
                              href="tel:+919244137353"
                              className="text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition"
                              aria-label="Call now on 9244137353"
                            >
                              Need help? Call now
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md text-left w-full">
                    <div className="text-center mb-5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded">
                        Secure Form
                      </span>
                      <h4 className="text-lg font-black text-slate-900 mt-2">
                        Enter Details to Complete Booking
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Facing issue or urgent booking? Call directly for instant assistance.
                      </p>
                    </div>

                    <a
                      href="tel:+919244137353"
                      className="mb-5 w-full inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-red-700 transition min-h-[48px]"
                      aria-label="Call now on 9244137353"
                    >
                      📞 Call Now: 92441 37353
                    </a>

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
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-sm font-bold focus:outline-none focus:border-orange-500 transition shadow-sm"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                          Mobile Number (For Driver SMS)
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="Enter 10-digit phone number..."
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-sm font-bold focus:outline-none focus:border-orange-500 transition shadow-sm"
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
                              onClick={() =>
                                setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "half" }))
                              }
                              className={`rounded-lg py-2 text-center text-[11px] font-black uppercase tracking-wide ${
                                currentSelectedMode === "half"
                                  ? "bg-orange-600 text-white shadow-sm"
                                  : "text-slate-500"
                              }`}
                            >
                              50% Advance
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "full" }))
                              }
                              className={`rounded-lg py-2 text-center text-[11px] font-black uppercase tracking-wide ${
                                currentSelectedMode === "full"
                                  ? "bg-slate-900 text-white shadow-sm"
                                  : "text-slate-500"
                              }`}
                            >
                              Full Pay
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 block uppercase">
                                Payable Now
                              </span>
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

              {/* Sticky mobile CTA */}
              <div className="sm:hidden sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur px-3 py-3">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+919244137353"
                    className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md"
                    aria-label="Call now on 9244137353"
                  >
                    📞 Call Now
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const firstCab = popupData.fareOptions.find((opt) =>
                        ["sedan", "ertiga", "crysta"].includes(opt.vehicleType)
                      );
                      if (firstCab) handleWhatsAppManualRedirect(firstCab);
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md"
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Receipt Modal Summary */}
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
    </>
  );
}
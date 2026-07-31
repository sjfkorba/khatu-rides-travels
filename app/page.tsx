// app/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import FareCalculator from "@/components/FareCalculator";
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

const ROUTES = [
  { from: "Raipur, Chhattisgarh", to: "Korba, Chhattisgarh", price: "₹3299", time: "~4h 30m", km: "250 KM", image: "/banner6.png" },
  { from: "Korba, Chhattisgarh", to: "Bilaspur, Chhattisgarh", price: "₹1899", time: "~2h 30m", km: "130 KM", image: "/banner6.png" },
  { from: "Bilaspur, Chhattisgarh", to: "Raipur, Chhattisgarh", price: "₹3299", time: "~4h 30m", km: "250 KM", image: "/banner6.png" },
  { from: "Raipur, Chhattisgarh", to: "Bhopal, Madhya Pradesh", price: "₹3499", time: "~7h 00m", km: "450 KM", image: "/banner6.png" },
];

export default function HomePage() {
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<SuccessReceipt | null>(null);
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("sedan");
  const [paymentSplitMode, setPaymentSplitMode] = useState<Record<string, "full" | "half">>({});

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [expandedInclusionsId, setExpandedInclusionsId] = useState<string | null>(null);

  const [showInitialRatingModal, setShowInitialRatingModal] = useState(false);
  const calculatorSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const timer = setTimeout(() => {
      setShowInitialRatingModal(true);
    }, 1000);

    const handleScrollTrigger = () => {
      if (calculatorSectionRef.current) {
        calculatorSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    window.addEventListener("khatuScrollToCalc", handleScrollTrigger);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("khatuScrollToCalc", handleScrollTrigger);
    };
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
        drop: to,
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

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 pb-20 md:pb-0 font-sans selection:bg-orange-500 selection:text-white relative overflow-hidden">
        
        {/* Background Ambient Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 👑 MODERN GLASSMORPHIC NAVBAR */}
        <header className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 select-none shadow-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-white leading-none">
                  Khatu<span className="text-orange-500">Rides</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-orange-400 mt-1">Travels Co.</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <a href="#" className="text-orange-500 hover:text-orange-400 transition">Home</a>
              <a href="#about" className="hover:text-orange-400 transition">About Us</a>
              <a href="#services" className="hover:text-orange-400 transition">Our Services</a>
              <a href="#routes-heading" className="hover:text-orange-400 transition">Popular Routes</a>
              <a href="#offers" className="hover:text-orange-400 transition">Offers</a>
              <a href="#contact" className="hover:text-orange-400 transition">Contact Us</a>
            </div>

            <div className="flex items-center gap-3">
              <a href="tel:+919244137353" className="hidden sm:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-black text-slate-200 hover:bg-slate-800 transition shadow-inner">
                <span className="text-emerald-400">📞</span> Call 24x7: <span className="text-orange-400">92441 37353</span>
              </a>
              <a href="https://wa.me/919244137353" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition scale-100 hover:scale-105">
                <span className="text-lg">💬</span>
              </a>
              <button onClick={() => setShowInitialRatingModal(true)} className="rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:from-orange-500 hover:to-amber-400 transition shadow-lg shadow-orange-600/30">
                Login / Signup
              </button>
            </div>
          </div>
        </header>

        {/* 👑 TICKER BAR */}
        <div className="w-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-orange-500/30 py-2.5 px-4 text-center text-xs font-black text-orange-300 tracking-wide">
          ⚡ Chhattisgarh & Madhya Pradesh ka Fastest Growing Cab Service
        </div>

        {/* 👑 HERO & BOOKING SECTION (Mobile First: Calculator on Top) */}
        <section className="relative px-4 pt-8 pb-16 sm:py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-4 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest">
                <span>🌟 Premium Intercity Cabs</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
                Har Safar,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500">Khatu Rides</span> Ke Saath.
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-400">
                Outstation • Local • Airport • Round Trip with absolute safety & transparent pricing.
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                {[
                  { icon: "🛡️", title: "Best Price", sub: "Guarantee" },
                  { icon: "👨‍✈️", title: "Verified", sub: "Drivers" },
                  { icon: "🎧", title: "24x7", sub: "Support" },
                  { icon: "⏱️", title: "On-Time", sub: "Pickup" },
                ].map((tb, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800/80 shadow-lg">
                    <span className="text-xl">{tb.icon}</span>
                    <div>
                      <div className="text-xs font-black text-slate-200 leading-tight">{tb.title}</div>
                      <div className="text-[10px] font-bold text-slate-400">{tb.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 👑 FARE CALCULATOR CARD EMBEDDED */}
            <div ref={calculatorSectionRef} className="lg:col-span-7 relative z-20 order-1 lg:order-2">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl blur-md opacity-30 animate-pulse" />
              <div className="relative">
                <FareCalculator
                  onFareCalculated={(data) => {
                    const updatedData = {
                      ...data,
                      fareOptions: data.fareOptions.map((opt) => {
                        const recalculated = calculateFare({
                          distance: opt.billedDistance,
                          vehicleType: opt.vehicleType,
                          bookingType: data.bookingType,
                          serviceType: data.serviceType,
                          pickupDate: data.pickupDate,
                          pickupTime: data.pickupTime,
                          returnDate: data.returnDate,
                          returnTime: data.returnTime,
                          drop: data.drop,
                        });
                        return {
                          ...opt,
                          finalFare: recalculated.finalFare,
                          billedDistance: recalculated.billedDistance,
                          durationMinutes: recalculated.durationMinutes,
                        };
                      }),
                    };
                    setPopupData(updatedData);
                    setSelectedVehicleType("sedan");
                    setShowPopup(true);
                    setShowUserForm(false);
                    setPaymentSplitMode({});
                  }}
                />
              </div>
            </div>

          </div>
        </section>

        {/* 👑 SPECIAL OFFER BANNER */}
        <section id="offers" className="px-4 max-w-7xl mx-auto my-12">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 border border-orange-500/30 p-6 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-5 text-center sm:text-left relative z-10">
              <span className="text-5xl sm:text-7xl animate-bounce">🎁</span>
              <div>
                <span className="bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-md">SPECIAL OFFER</span>
                <h3 className="text-xl sm:text-3xl font-black text-white mt-2">Book Round Trip & Get UPTO 15% OFF</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">Limited Time Offer! Applicable on all outstation corridors across Chhattisgarh & MP.</p>
              </div>
            </div>
            <button onClick={() => setShowInitialRatingModal(true)} className="relative z-10 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest px-8 py-4 shadow-xl shadow-orange-600/30 transition shrink-0">
              Claim Discount Now
            </button>
          </div>
        </section>

        {/* 👑 WHY CHOOSE KHATU RIDES */}
        <section className="px-4 max-w-7xl mx-auto my-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Why Choose Khatu Rides?</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">Excellence in intercity travel with absolute safety and transparent operations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🛡️", title: "No Hidden Charges", desc: "100% Transparent Pricing with toll and state taxes included." },
              { icon: "🚗", title: "Well Maintained Cars", desc: "Sedan, SUV, Innova & more inspected thoroughly before every journey." },
              { icon: "👨‍✈️", title: "Professional Drivers", desc: "Verified & experienced local drivers for smooth highway rides." },
              { icon: "🎧", title: "24x7 Customer Support", desc: "Call or WhatsApp anytime for instant trip assistance & tracking." },
            ].map((wc, idx) => (
              <div key={idx} className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-xl hover:border-orange-500/50 transition-all duration-300 text-center flex flex-col items-center group">
                <span className="text-4xl mb-4 group-hover:scale-110 transition duration-300">{wc.icon}</span>
                <h3 className="text-base font-black text-white mb-2">{wc.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{wc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 👑 POPULAR ROUTES SECTION */}
        <section id="routes-heading" className="px-4 max-w-7xl mx-auto my-20" aria-labelledby="routes-heading">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Popular Routes</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Most frequented intercity highway routes with fixed flat fares.</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ROUTES.map((route, index) => (
              <article
                key={index}
                onClick={() => triggerQuickBooking(route.from, route.to, parseInt(route.km))}
                className="group relative rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl hover:shadow-2xl hover:border-orange-500 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="h-44 w-full overflow-hidden relative">
                  <img src={route.image} alt={route.from} className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-orange-400 border border-slate-700">
                    📍 {route.km}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight group-hover:text-orange-400 transition">
                      {route.from.split(",")[0]} ⇄ {route.to.split(",")[0]}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">⏱️ {route.time} approx travel duration</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Starting at</span>
                      <span className="text-xl font-black text-orange-400">{route.price}</span>
                    </div>
                    <span className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-black uppercase text-white group-hover:bg-orange-500 transition shadow-md">
                      Book Now
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <ReviewsCarousel />
        <SeoTextBlock />

        {/* 👑 FLOATING ACTION BUTTON (FAB) COLUMN */}
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 md:hidden pointer-events-auto">
          <a
            href="https://wa.me/919244137353"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-600/50 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">💬</span>
          </a>

          <a
            href="tel:+919244137353"
            aria-label="Call Desk"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-2xl shadow-orange-600/50 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">📞</span>
          </a>
        </div>
      </main>

      {/* 👑 INITIAL GOOGLE RATING & INSTANT DISCOUNT POPUP MODAL */}
      <AnimatePresence>
        {showInitialRatingModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-auto text-left relative p-6 sm:p-8 text-slate-100"
            >
              <button
                type="button"
                onClick={() => setShowInitialRatingModal(false)}
                className="absolute top-5 right-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full h-9 w-9 flex items-center justify-center transition font-bold"
              >
                ✕
              </button>

              <div className="text-center">
                <span className="text-xs font-serif italic text-slate-400">Thank You For Choosing</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase mt-0.5">
                  Khatu <span className="text-orange-500">Rides</span>
                </h3>
                <div className="w-24 h-0.5 bg-slate-800 mx-auto mt-1 mb-4" />

                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  — LOVE OUR SERVICE? —
                </span>
                
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-3">
                  Give 5 Star Rating <br />
                  & Get <span className="text-orange-400">Instant Discount!</span>
                </h4>

                <div className="mt-6 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left w-full sm:w-1/2">
                    <div className="text-xs font-black text-white">Khatu Rides Travels Co.</div>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mt-0.5">
                      <span>4.8</span>
                      <span>★★★★★</span>
                      <span className="text-slate-500 font-normal">(1,246)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Taxi Service • Korba, Chhattisgarh</p>
                    <a
                      href="https://g.page/r/CbD5nSIGmvz1EBM/review"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-[11px] font-black text-blue-400 hover:underline"
                    >
                      ✏️ Write a review
                    </a>
                  </div>

                  <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-4 rounded-2xl text-center w-full sm:w-1/2 shadow-lg">
                    <span className="text-[9px] font-black uppercase tracking-wider block">INSTANT DISCOUNT</span>
                    <div className="text-2xl sm:text-3xl font-black tracking-tighter mt-0.5">₹200*</div>
                    <span className="text-[9px] font-bold block opacity-90">ON YOUR BOOKING</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-left text-xs font-bold text-slate-300 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                    <span>Give 5 Star Rating on our Google Business Profile</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                    <span>Write a Short & Best Review about your experience</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                    <span>Send Screenshot on WhatsApp to get instant discount</span>
                  </div>
                </div>

                <div className="mt-5">
                  <a
                    href="https://wa.me/919244137353?text=Hello%20Khatu%20Rides!%20I%20have%20rated%205-stars%20on%20Google.%20Here%20is%20my%20screenshot%20for%20the%20₹200%20instant%20discount:%20https://g.page/r/CbD5nSIGmvz1EBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowInitialRatingModal(false)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
                  >
                    <span className="text-lg">💬</span> SEND SCREENSHOT ON WHATSAPP
                  </a>
                </div>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => setShowInitialRatingModal(false)}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-300 underline"
                  >
                    Maybe Later
                  </button>
                  <p className="text-[9px] text-slate-500 mt-1">*T&C Apply</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 👑 FARE RESULTS POPUP MODAL */}
      <AnimatePresence>
        {showPopup && popupData && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/85 p-0 sm:p-4 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-none sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col min-h-screen sm:min-h-0 sm:max-h-[96vh] text-left relative text-slate-100"
            >
              <div className="bg-slate-950 text-white px-3 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md border-b border-slate-800">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="bg-orange-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider shrink-0 shadow-inner">
                    {popupData.bookingType}
                  </span>
                  <h3 className="text-xs sm:text-base font-black tracking-tight text-white truncate flex items-center gap-1.5">
                    <span>{popupData.pickup.split(",")[0]}</span>
                    <span className="text-orange-500">➔</span>
                    <span>{popupData.drop.split(",")[0]}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-white rounded-full h-7 w-7 flex items-center justify-center transition border border-slate-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* STATS SUMMARY BAR */}
              {(() => {
                const firstOpt = popupData.fareOptions[0];
                const dist = firstOpt?.billedDistance || 0;
                const mins = firstOpt?.durationMinutes || 120;
                const hoursNum = Math.floor(mins / 60);
                const minsNum = mins % 60;

                return (
                  <div className="bg-slate-950/60 px-3 sm:px-6 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300 sticky top-[53px] z-20 backdrop-blur-md">
                    <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-slate-200">
                        <span className="text-orange-400">📍</span> <strong>{dist} Kms</strong>
                      </span>
                      <span className="text-slate-700">|</span>
                      <span className="flex items-center gap-1.5 text-slate-200">
                        <span className="text-orange-400">⏱️</span> <strong>~{hoursNum}h {minsNum}m</strong>
                      </span>
                    </div>
                    <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-black text-[10px] shrink-0 ml-2">
                      ✓ All-Inclusive
                    </span>
                  </div>
                );
              })()}

              <div className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-950/40 pb-24 sm:pb-6">
                {!showUserForm ? (
                  <div className="flex flex-col gap-3 max-w-4xl mx-auto w-full">
                    {popupData.fareOptions.map((opt) => {
                      if (!["sedan", "ertiga", "crysta"].includes(opt.vehicleType)) return null;

                      const isSelected = selectedVehicleType === opt.vehicleType;
                      const isExpanded = expandedInclusionsId === opt.id;
                      const strikePrice = Math.round(opt.finalFare * 1.15);

                      const fullVehicleTitle = opt.vehicleType === "sedan" ? "DZIRE, ETIOS" : opt.vehicleType === "ertiga" ? "ERTIGA, XYLO" : "INNOVA CRYSTA";

                      // 👑 Dynamic Package Subtext matching your exact requirements
                      const isLocalOrShortTrip = popupData.serviceType === "local" || (popupData.bookingType === "roundtrip" && opt.billedDistance < 80);
                      
                      const packageSubText = isLocalOrShortTrip
                        ? (opt.vehicleType === "sedan" 
                            ? "1200 fixed for 8Hrs & 80Kms + 11 Per Kms + Toll (if required)" 
                            : opt.vehicleType === "ertiga" 
                            ? "1500 fixed for 8Hrs & 80Kms + 12 Per Kms + Toll (if required)" 
                            : "2200 fixed for 8Hrs & 80Kms + 14 Per Kms + Toll (if required)")
                        : `Extra @ ₹${opt.vehicleType === "sedan" ? 13 : opt.vehicleType === "ertiga" ? 17 : 20.7}/Km after limit`;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedVehicleType(opt.vehicleType)}
                          className={`rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 bg-slate-900 p-4 sm:p-6 cursor-pointer relative shadow-xl ${
                            isSelected ? "border-orange-500 ring-4 ring-orange-500/20 bg-orange-500/5" : "border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          {opt.vehicleType === "sedan" && (
                            <div className="absolute -top-2.5 left-6 bg-orange-600 text-white text-[9px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider shadow-md">
                              BEST PRICE
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-3 pt-1">
                            <div className="bg-slate-950 rounded-2xl border border-slate-800 w-28 h-20 sm:w-36 sm:h-24 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                              <img src={VEHICLES[opt.vehicleType]?.image} alt={opt.vehicleLabel} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 min-w-0 px-2">
                              <h4 className="text-sm sm:text-base font-black text-white tracking-tight uppercase truncate">{fullVehicleTitle}</h4>
                              <div className="mt-1.5 space-y-1 text-xs text-slate-300 font-bold">
                                <div className="flex items-center gap-1.5 text-slate-300">
                                  <span>📍</span>
                                  <span>{isLocalOrShortTrip ? "80 Kms Package Limit" : `${opt.billedDistance} Kms Actual Distance`}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-orange-400 font-bold truncate">
                                  <span>⚡</span>
                                  <span className="truncate">{packageSubText}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Estimated Fare</div>
                              <div className="text-xs sm:text-sm font-bold text-red-400 line-through">Rs. {strikePrice.toLocaleString("en-IN")}/-</div>
                              <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white text-sm sm:text-xl font-black px-4 py-1.5 rounded-2xl shadow-lg inline-block tracking-tight mt-1">
                                Rs. {opt.finalFare.toLocaleString("en-IN")}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2">
                            <a
                              href="tel:+919244137353"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-200 font-black text-xs uppercase py-3 rounded-xl shadow-md transition text-center flex items-center justify-center gap-1"
                            >
                              📞 <span className="hidden sm:inline">CALL</span> NOW
                            </a>

                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleWhatsAppManualRedirect(opt); }}
                              className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 font-black text-xs uppercase py-3 rounded-xl shadow-md transition text-center flex items-center justify-center gap-1"
                            >
                              💬 <span className="hidden sm:inline">WHATSAPP</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVehicleType(opt.vehicleType);
                                setPaymentSplitMode((p) => ({ ...p, [opt.id]: "half" }));
                                setShowUserForm(true);
                              }}
                              className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase py-3 rounded-xl shadow-lg shadow-orange-600/30 transition text-center"
                            >
                              🚀 BOOK
                            </button>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">✓ Toll, State Tax & Driver Allowance Included</span>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setExpandedInclusionsId(isExpanded ? null : opt.id); }}
                              className="font-bold text-orange-400 hover:text-orange-300"
                            >
                              {isExpanded ? "Hide ▲" : "Inclusions ▼"}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="mt-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                              <div>✔ <strong>Package Details:</strong> {packageSubText}</div>
                              <div>✔ <strong>Toll & State Tax:</strong> Fully covered in fare.</div>
                              <div>✔ <strong>Driver Allowance:</strong> Included.</div>
                              <div>✔ <strong>Waiting Time:</strong> Upto 45 mins free at pickup.</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left w-full my-auto text-slate-100">
                    <div className="text-center mb-6">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">Secure Booking Form</span>
                      <h4 className="text-xl font-black text-white mt-3">Enter Details to Complete Booking</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-slate-300 uppercase tracking-wider">Customer Full Name</label>
                        <input
                          type="text"
                          placeholder="Type customer name..."
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full border border-slate-800 rounded-2xl px-4 py-3.5 bg-slate-950 text-sm font-bold text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-slate-300 uppercase tracking-wider">Mobile Number (For Driver SMS)</label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="Enter 10-digit phone number..."
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))}
                          className="w-full border border-slate-800 rounded-2xl px-4 py-3.5 bg-slate-950 text-sm font-bold text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
                        />
                      </div>

                      {selectedOption && (
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Split Booking Matrix</span>
                          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1">
                            <button
                              type="button"
                              onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "half" }))}
                              className={`rounded-lg py-2 text-center text-xs font-black uppercase tracking-wide transition ${currentSelectedMode === "half" ? "bg-orange-600 text-white shadow-md" : "text-slate-400"}`}
                            >
                              50% Advance
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "full" }))}
                              className={`rounded-lg py-2 text-center text-xs font-black uppercase tracking-wide transition ${currentSelectedMode === "full" ? "bg-slate-800 text-white shadow-md" : "text-slate-400"}`}
                            >
                              Full Pay
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 block uppercase">Payable Now</span>
                              <span className="text-2xl font-black text-white">₹{displayPayNowNumber.toLocaleString("en-IN")}</span>
                            </div>
                            <span className="text-xs font-bold text-orange-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">{selectedOption.vehicleLabel}</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowUserForm(false)}
                          className="w-full border border-slate-800 bg-slate-950 text-slate-300 font-bold text-xs uppercase py-4 rounded-2xl transition hover:bg-slate-800"
                        >
                          ↩ Back
                        </button>
                        <button
                          type="button"
                          onClick={() => selectedOption && handleOnlinePaymentCheckout(selectedOption)}
                          disabled={paymentLoadingId !== null}
                          className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition shadow-xl shadow-orange-600/30 disabled:opacity-50"
                        >
                          {paymentLoadingId ? "Syncing..." : "Proceed to Pay"}
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
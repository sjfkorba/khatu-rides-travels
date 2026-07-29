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

  // 👑 State for Initial Google Rating Discount Popup Modal
  const [showInitialRatingModal, setShowInitialRatingModal] = useState(false);

  const calculatorSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    // Show initial discount popup on first load after 1 second
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

      <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0 font-sans">
        
        {/* 👑 EXACT MATCH NAVBAR (Matching Home Page UI) */}
        <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 select-none shadow-xs">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-slate-950 leading-none">
                  Khatu<span className="text-orange-600">Rides</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 mt-1">Travels Co.</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <a href="#" className="text-orange-600 hover:text-orange-700 transition">Home</a>
              <a href="#about" className="hover:text-orange-600 transition">About Us</a>
              <a href="#services" className="hover:text-orange-600 transition">Our Services</a>
              <a href="#routes-heading" className="hover:text-orange-600 transition">Popular Routes</a>
              <a href="#offers" className="hover:text-orange-600 transition">Offers</a>
              <a href="#contact" className="hover:text-orange-600 transition">Contact Us</a>
            </div>

            <div className="flex items-center gap-3">
              <a href="tel:+919244137353" className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-800 hover:bg-slate-50 transition shadow-2xs">
                <span className="text-emerald-600">📞</span> Call 24x7: <span className="text-orange-600">92441 37353</span>
              </a>
              <a href="https://wa.me/919244137353" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md hover:bg-emerald-600 transition">
                <span className="text-base sm:text-lg">💬</span>
              </a>
              <button onClick={() => setShowInitialRatingModal(true)} className="rounded-full bg-orange-600 px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-700 transition shadow-md">
                Login / Signup
              </button>
            </div>
          </div>
        </header>

        {/* 👑 TOP FASTEST GROWING TICKER BAR */}
        <div className="w-full bg-amber-50 border-b border-amber-200/60 py-2 px-4 text-center text-xs font-bold text-amber-900">
          ⚡ Chhattisgarh & Madhya Pradesh ka Fastest Growing Cab Service
        </div>

        {/* 👑 HERO & BOOKING SECTION */}
        <section className="relative px-4 pt-6 pb-12 sm:py-12 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            
            {/* Hero Text */}
            <div className="text-center sm:text-left mb-8 max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                Har Safar,<br />
                <span className="text-orange-600">Khatu Rides</span> Ke Saath.
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2">
                Outstation • Local • Airport • Round Trip
              </p>

              {/* Trust badges row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { icon: "🛡️", title: "Best Price", sub: "Guarantee" },
                  { icon: "👨‍✈️", title: "Verified", sub: "Drivers" },
                  { icon: "🎧", title: "24x7", sub: "Support" },
                  { icon: "⏱️", title: "On-Time", sub: "Pickup" },
                ].map((tb, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <span className="text-lg">{tb.icon}</span>
                    <div>
                      <div className="text-[11px] font-black text-slate-900 leading-tight">{tb.title}</div>
                      <div className="text-[9px] font-bold text-slate-500">{tb.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 👑 FARE CALCULATOR CARD EMBEDDED */}
            <div ref={calculatorSectionRef} className="relative z-20">
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
        </section>

        {/* 👑 SPECIAL OFFER BANNER (Matching Home Page UI) */}
        <section id="offers" className="px-4 max-w-7xl mx-auto my-12">
          <div className="rounded-3xl bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 border border-orange-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <span className="text-4xl sm:text-6xl">🎁</span>
              <div>
                <span className="bg-orange-600 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">SPECIAL OFFER</span>
                <h3 className="text-lg sm:text-2xl font-black text-slate-950 mt-1">Book Round Trip & Get UPTO 15% OFF</h3>
                <p className="text-xs text-slate-600 mt-0.5">Limited Time Offer! Applicable on all outstation corridors across Chhattisgarh.</p>
              </div>
            </div>
            <button onClick={() => setShowInitialRatingModal(true)} className="rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest px-8 py-3.5 shadow-md transition shrink-0">
              Book Now
            </button>
          </div>
        </section>

        {/* 👑 WHY CHOOSE KHATU RIDES */}
        <section className="px-4 max-w-7xl mx-auto my-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Why Choose Khatu Rides?</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Excellence in intercity travel with absolute safety and transparency.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🛡️", title: "No Hidden Charges", desc: "100% Transparent Pricing with toll and state taxes included." },
              { icon: "🚗", title: "Well Maintained Cars", desc: "Sedan, SUV, Innova & more inspected before every journey." },
              { icon: "👨‍✈️", title: "Professional Drivers", desc: "Verified & experienced local drivers for smooth highway rides." },
              { icon: "🎧", title: "24x7 Customer Support", desc: "Call or WhatsApp anytime for instant trip assistance." },
            ].map((wc, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs text-center flex flex-col items-center">
                <span className="text-3xl mb-3">{wc.icon}</span>
                <h3 className="text-sm font-black text-slate-900 mb-1">{wc.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{wc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 👑 POPULAR ROUTES SECTION */}
        <section id="routes-heading" className="px-4 max-w-7xl mx-auto my-16" aria-labelledby="routes-heading">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Popular Routes</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Most frequented intercity highway routes with fixed flat fares.</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ROUTES.map((route, index) => (
              <article
                key={index}
                onClick={() => triggerQuickBooking(route.from, route.to, parseInt(route.km))}
                className="group relative rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs hover:shadow-lg hover:border-orange-500 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="h-36 w-full overflow-hidden relative">
                  <img src={route.image} alt={route.from} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-slate-900">
                    {route.km}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-950 tracking-tight group-hover:text-orange-600 transition">
                      {route.from.split(",")[0]} ⇄ {route.to.split(",")[0]}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">{route.time} approx travel duration</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Starting at</span>
                      <span className="text-lg font-black text-orange-600">{route.price}</span>
                    </div>
                    <span className="rounded-xl bg-slate-950 px-4 py-2 text-[10px] font-black uppercase text-white group-hover:bg-orange-600 transition">
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

        {/* 👑 FLUTTER-STYLE FLOATING ACTION BUTTON (FAB) COLUMN */}
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 md:hidden pointer-events-auto">
          <a
            href="https://wa.me/919244137353"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">💬</span>
          </a>

          <a
            href="tel:+919244137353"
            aria-label="Call Desk"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">📞</span>
          </a>
        </div>
      </main>

      {/* 👑 INITIAL GOOGLE RATING & INSTANT DISCOUNT POPUP MODAL */}
      <AnimatePresence>
        {showInitialRatingModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-auto text-left relative p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowInitialRatingModal(false)}
                className="absolute top-5 right-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full h-9 w-9 flex items-center justify-center transition font-bold"
              >
                ✕
              </button>

              <div className="text-center">
                <span className="text-xs font-serif italic text-slate-500">Thank You For Choosing</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tighter uppercase mt-0.5">
                  Khatu <span className="text-orange-600">Rides</span>
                </h3>
                <div className="w-24 h-0.5 bg-slate-300 mx-auto mt-1 mb-4" />

                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  — LOVE OUR SERVICE? —
                </span>
                
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
                  Give 5 Star Rating <br />
                  & Get <span className="text-orange-600">Instant Discount!</span>
                </h4>

                {/* Rating Card Box */}
                <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left w-full sm:w-1/2">
                    <div className="text-xs font-black text-slate-900">Khatu Rides Travels Co.</div>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                      <span>4.8</span>
                      <span>★★★★★</span>
                      <span className="text-slate-400 font-normal">(1,246)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Taxi Service • Korba, Chhattisgarh</p>
                    <a
                      href="https://g.page/r/CbD5nSIGmvz1EBM/review"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-[11px] font-black text-blue-600 hover:underline"
                    >
                      ✏️ Write a review
                    </a>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-2xl text-center w-full sm:w-1/2 shadow-md">
                    <span className="text-[9px] font-black uppercase tracking-wider block">INSTANT DISCOUNT</span>
                    <div className="text-2xl sm:text-3xl font-black tracking-tighter mt-0.5">₹200*</div>
                    <span className="text-[9px] font-bold block opacity-90">ON YOUR BOOKING</span>
                  </div>
                </div>

                {/* Steps */}
                <div className="mt-5 space-y-2 text-left text-xs font-bold text-slate-700 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
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

                {/* Trust Footer Bar inside modal */}
                <div className="grid grid-cols-4 gap-2 mt-5 py-3 border-y border-slate-100 text-center">
                  <div>
                    <span className="text-orange-600 text-base">🏷️</span>
                    <div className="text-[9px] font-black text-slate-700 mt-1">Upto ₹200 Off</div>
                  </div>
                  <div>
                    <span className="text-amber-500 text-base">🛡️</span>
                    <div className="text-[9px] font-black text-slate-700 mt-1">1000+ Happy</div>
                  </div>
                  <div>
                    <span className="text-blue-600 text-base">🔒</span>
                    <div className="text-[9px] font-black text-slate-700 mt-1">Safe Travel</div>
                  </div>
                  <div>
                    <span className="text-purple-600 text-base">🎧</span>
                    <div className="text-[9px] font-black text-slate-700 mt-1">24x7 Support</div>
                  </div>
                </div>

                {/* Same Day Booking Note */}
                <div className="mt-4 bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-center text-[11px] font-bold text-amber-900">
                  📅 Same Day Booking Only — This offer is applicable on same day booking only.
                </div>

                {/* WhatsApp CTA Button */}
                <div className="mt-5">
                  <a
                    href="https://wa.me/919244137353?text=Hello%20Khatu%20Rides!%20I%20have%20rated%205-stars%20on%20Google.%20Here%20is%20my%20screenshot%20for%20the%20₹200%20instant%20discount:%20https://g.page/r/CbD5nSIGmvz1EBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowInitialRatingModal(false)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition"
                  >
                    <span className="text-lg">💬</span> SEND SCREENSHOT ON WHATSAPP (Get Instant Discount)
                  </a>
                </div>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => setShowInitialRatingModal(false)}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 underline"
                  >
                    Maybe Later
                  </button>
                  <p className="text-[9px] text-slate-400 mt-1">*T&C Apply</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 👑 FLUTTER-STYLE COMPACT MOBILE & DESKTOP FARE RESULTS POPUP MODAL */}
      <AnimatePresence>
        {showPopup && popupData && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/80 p-0 sm:p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-slate-100 w-full max-w-4xl rounded-none sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col min-h-screen sm:min-h-0 sm:max-h-[96vh] text-left relative"
            >
              {/* TOP DARK HEADER BAR */}
              <div className="bg-slate-950 text-white px-3 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="bg-orange-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider shrink-0 shadow-2xs">
                    {popupData.bookingType}
                  </span>
                  <h3 className="text-xs sm:text-base font-black tracking-tight text-white truncate flex items-center gap-1.5">
                    <span>{popupData.pickup.split(",")[0]}</span>
                    <span className="text-orange-500">➔</span>
                    <span>{popupData.drop.split(",")[0]}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    <span>📅 {convertToIndianDate(popupData.pickupDate)}</span>
                    <span className="text-slate-600">|</span>
                    <span>⏰ {formatTimeToAMPM(popupData.pickupTime)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-white rounded-full h-7 w-7 flex items-center justify-center transition border border-slate-700 shadow-2xs"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* MOBILE PICKUP DATE SUB-BAR */}
              <div className="bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-orange-400 flex items-center justify-between sm:hidden border-t border-slate-800">
                <span>📅 Pickup: {convertToIndianDate(popupData.pickupDate)} at {formatTimeToAMPM(popupData.pickupTime)}</span>
              </div>

              {/* STATS SUMMARY BAR */}
              {(() => {
                const firstOpt = popupData.fareOptions[0];
                const dist = firstOpt?.billedDistance || 0;
                const mins = firstOpt?.durationMinutes || 120;
                const hoursNum = Math.floor(mins / 60);
                const minsNum = mins % 60;

                let dropDateTimeStr = "Calculated on transit";
                try {
                  const pickupDt = new Date(`${popupData.pickupDate}T${popupData.pickupTime}`);
                  if (!isNaN(pickupDt.getTime())) {
                    const dropDt = new Date(pickupDt.getTime() + mins * 60 * 1000);
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const dStr = `${dropDt.getDate()} ${months[dropDt.getMonth()]}`;
                    let h = dropDt.getHours();
                    const ampm = h >= 12 ? "PM" : "AM";
                    h = h % 12 || 12;
                    const mStr = String(dropDt.getMinutes()).padStart(2, "0");
                    dropDateTimeStr = `${dStr}, ${String(h).padStart(2, "0")}:${mStr} ${ampm}`;
                  }
                } catch (e) {}

                return (
                  <div className="bg-white px-3 sm:px-6 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-800 shadow-2xs sticky top-[49px] sm:top-[57px] z-20">
                    <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-none whitespace-nowrap">
                      <span className="flex items-center gap-1 text-slate-700">
                        <span className="text-blue-600">📍</span> <strong>{dist} Kms</strong>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1 text-slate-700">
                        <span className="text-blue-600">⏱️</span> <strong>~{hoursNum}h {minsNum}m</strong>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1 text-slate-700">
                        <span className="text-blue-600">🏁</span> Est. Drop: <strong>{dropDateTimeStr}</strong>
                      </span>
                    </div>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-black text-[10px] shrink-0 ml-2 hidden sm:inline-block">
                      ✓ All-Inclusive
                    </span>
                  </div>
                );
              })()}

              {/* FLUTTER-STYLE COMPACT CARDS CONTAINER */}
              <div className="p-2.5 sm:p-6 overflow-y-auto flex-1 space-y-3 bg-slate-100 pb-24 sm:pb-6">
                {!showUserForm ? (
                  <div className="flex flex-col gap-3 max-w-4xl mx-auto w-full">
                    {popupData.fareOptions.map((opt) => {
                      if (!["sedan", "ertiga", "crysta"].includes(opt.vehicleType)) return null;

                      const dynamicLimitKms = getDynamicKmsLimitDisplay(opt);
                      const extraRatePerKm = opt.vehicleType === "sedan" ? 13 : opt.vehicleType === "ertiga" ? 17 : 20.7;
                      const isSelected = selectedVehicleType === opt.vehicleType;
                      const isExpanded = expandedInclusionsId === opt.id;
                      const strikePrice = Math.round(opt.finalFare * 1.15);

                      const fullVehicleTitle = opt.vehicleType === "sedan" 
                        ? "DZIRE, ETIOS" 
                        : opt.vehicleType === "ertiga" 
                        ? "ERTIGA, XYLO" 
                        : "INNOVA CRYSTA";

                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedVehicleType(opt.vehicleType)}
                          className={`rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 bg-white p-3 sm:p-5 cursor-pointer relative shadow-2xs ${
                            isSelected ? "border-orange-500 ring-2 ring-orange-500/15 bg-orange-50/5" : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {/* BEST PRICE BADGE */}
                          {opt.vehicleType === "sedan" && (
                            <div className="absolute -top-2.5 left-4 sm:left-6 bg-orange-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-2xs">
                              BEST PRICE
                            </div>
                          )}

                          {/* COMPACT FLUTTER ROW: CAR IMAGE LEFT, TITLE/SPECS CENTER, PRICING RIGHT */}
                          <div className="flex items-center justify-between gap-2.5 pt-0.5">
                            
                            {/* Left: Compact Car Image */}
                            <div className="bg-slate-50 rounded-xl border border-slate-100 w-28 h-18 sm:w-36 sm:h-22 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                              <img
                                src={VEHICLES[opt.vehicleType]?.image}
                                alt={opt.vehicleLabel}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Middle: Title & Compact Specs */}
                            <div className="flex-1 min-w-0 px-1">
                              <h4 className="text-xs sm:text-base font-black text-slate-900 tracking-tight uppercase truncate">
                                {fullVehicleTitle}
                              </h4>

                              <div className="mt-1 space-y-0.5 text-[10px] sm:text-xs text-slate-600 font-bold">
                                <div className="flex items-center gap-1 text-slate-700">
                                  <span>📍</span>
                                  <span>{dynamicLimitKms} Kms Included</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-600 truncate">
                                  <span>⚡</span>
                                  <span className="truncate">Extra @ ₹{extraRatePerKm}/Km after limit</span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Compact Pricing Stack */}
                            <div className="text-right shrink-0">
                              <div className="text-[11px] sm:text-sm font-bold text-red-600 line-through">
                                Rs. {strikePrice.toLocaleString("en-IN")}/-
                              </div>
                              <div className="bg-[#0284c7] text-white text-xs sm:text-lg font-black px-3 py-1 rounded-full shadow-2xs inline-block tracking-tight mt-0.5">
                                Rs. {opt.finalFare.toLocaleString("en-IN")}
                              </div>
                            </div>

                          </div>

                          {/* COMPACT ACTION BUTTONS ROW */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-3 gap-1.5 sm:gap-2">
                            <a
                              href="tel:+919244137353"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-[#581c87] hover:bg-[#4c1d95] text-white font-black text-[10px] sm:text-xs uppercase py-2.5 px-1 rounded-xl shadow-2xs transition text-center flex items-center justify-center gap-1 min-h-[36px]"
                              aria-label="Call now"
                            >
                              📞 <span className="hidden sm:inline">CALL</span> NOW
                            </a>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhatsAppManualRedirect(opt);
                              }}
                              className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-black text-[10px] sm:text-xs uppercase py-2.5 px-1 rounded-xl shadow-2xs transition text-center flex items-center justify-center gap-1 min-h-[36px]"
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
                              className="bg-orange-600 hover:bg-orange-700 text-white font-black text-[10px] sm:text-xs uppercase py-2.5 px-1 rounded-xl shadow-2xs transition text-center min-h-[36px]"
                            >
                              🚀 BOOK
                            </button>
                          </div>

                          {/* COMPACT INCLUSIONS TOGGLE BAR */}
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 font-medium text-[10px] sm:text-xs">
                              ✓ Toll, State Tax & Driver Allowance Included
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedInclusionsId(isExpanded ? null : opt.id);
                              }}
                              className="font-bold text-orange-600 hover:text-orange-700 text-[10px] sm:text-xs shrink-0"
                            >
                              {isExpanded ? "Hide ▲" : "Inclusions ▼"}
                            </button>
                          </div>

                          {/* EXPANDABLE DETAILS BOX */}
                          {isExpanded && (
                            <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px] text-slate-700 animate-fadeIn">
                              <div>✔ <strong>{dynamicLimitKms} Km included:</strong> ₹{extraRatePerKm}/km beyond limit.</div>
                              <div>✔ <strong>Toll & State Tax:</strong> Fully covered in fare.</div>
                              <div>✔ <strong>Driver Allowance:</strong> Included.</div>
                              <div>✔ <strong>Waiting Time:</strong> Upto 45 mins free at pickup.</div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* 👑 TRANSPARENT PRICING & TRUST BADGES SECTION */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3.5 sm:p-5 shadow-2xs space-y-3 mt-1">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-blue-600 text-xl">🛡️</span>
                          <div>
                            <h5 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight">100% Transparent Pricing</h5>
                            <p className="text-[10px] sm:text-xs text-slate-500">No Hidden Charges • Safe & Secure • Verified Drivers</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-0.5">
                        <h5 className="text-[11px] font-black uppercase text-slate-800 tracking-wider mb-2.5">Why Book With Khatu Rides?</h5>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="flex flex-col items-center p-1.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-orange-500 text-base">🏷️</span>
                            <span className="text-[9px] font-bold text-slate-700 mt-1">No Hidden</span>
                          </div>
                          <div className="flex flex-col items-center p-1.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-emerald-600 text-base">👨‍✈️</span>
                            <span className="text-[9px] font-bold text-slate-700 mt-1">Verified</span>
                          </div>
                          <div className="flex flex-col items-center p-1.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-purple-600 text-base">🎧</span>
                            <span className="text-[9px] font-bold text-slate-700 mt-1">24x7 Support</span>
                          </div>
                          <div className="flex flex-col items-center p-1.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-sky-600 text-base">🚗</span>
                            <span className="text-[9px] font-bold text-slate-700 mt-1">Clean Cars</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-md text-left w-full my-auto">
                    <div className="text-center mb-5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded">Secure Form</span>
                      <h4 className="text-lg font-black text-slate-900 mt-2">Enter Details to Complete Booking</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Customer Full Name</label>
                        <input
                          type="text"
                          placeholder="Type customer name..."
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-sm font-bold focus:outline-none focus:border-orange-500 transition shadow-2xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Mobile Number (For Driver SMS)</label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="Enter 10-digit phone number..."
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-sm font-bold focus:outline-none focus:border-orange-500 transition shadow-2xs"
                        />
                      </div>

                      {selectedOption && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Split Booking Matrix</span>
                          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-1">
                            <button
                              type="button"
                              onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "half" }))}
                              className={`rounded-lg py-2 text-center text-[11px] font-black uppercase tracking-wide ${currentSelectedMode === "half" ? "bg-orange-600 text-white shadow-sm" : "text-slate-500"}`}
                            >
                              50% Advance
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "full" }))}
                              className={`rounded-lg py-2 text-center text-[11px] font-black uppercase tracking-wide ${currentSelectedMode === "full" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500"}`}
                            >
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

      {/* SUCCESS RECEIPT MODAL */}
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
                <button type="button" onClick={() => setSuccessReceipt(null)} className="w-full h-11 bg-slate-950 text-xs font-black uppercase tracking-wider text-white rounded-xl shadow">
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
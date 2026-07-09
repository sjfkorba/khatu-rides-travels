// app/page.tsx
"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import SakhaBot from "@/components/SakhaBot";
import FareCalculator from "@/components/FareCalculator";
import ImageCarousel from "@/components/ImageCarousel";
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

const TESTIMONIALS = [
  { name: "Rahul Sahu", role: "Business Traveler", text: "Korba se Raipur regular travel ke liye Khatu Rides ki service best hai. Neat cabs aur professional drivers.", stars: 5 },
  { name: "Priya Sharma", role: "Family Trip", text: "Toll charges pricing me hi included hote hain toh raste me koi extra jhikjhik nahi hoti. Best execution!", stars: 5 },
  { name: "Vinay Agrawal", role: "Local Package", text: "8 hours city package perfect hai business visits ke liye. Clean sedan and polite desk staff support.", stars: 5 },
];

const SERVICE_CARDS = [
  { title: "Outstation Cabs", desc: "One way aur round trip bookings with fixed transparent pricing logic across major routes.", icon: "🚖" },
  { title: "Local Packages", desc: "8 Hours / 80 Km corporate aur family runs package without any extra stress.", icon: "🏙️" },
  { title: "Airport Transfers", desc: "Time sync pick and drop alerts to Raipur airport for stress free travel transitions.", icon: "🛫" },
];

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

  const calculateReachDateTime = (dateStr: string, timeStr: string, durationMinutes: number) => {
    if (!dateStr || !timeStr) return { date: "--/--/----", time: "--:-- --" };
    const combined = new Date(`${dateStr}T${timeStr}`);
    combined.setMinutes(combined.getMinutes() + durationMinutes);
    const dd = String(combined.getDate()).padStart(2, "0");
    const mm = String(combined.getMonth() + 1).padStart(2, "0");
    const yyyy = combined.getFullYear();
    let hrs = combined.getHours();
    const mins = String(combined.getMinutes()).padStart(2, "0");
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;
    return { date: `${dd}/${mm}/${yyyy}`, time: `${String(hrs).padStart(2, "0")}:${mins} ${ampm}` };
  };

  const checkExtraHaltCondition = (): boolean => {
    if (!popupData || popupData.bookingType !== "roundtrip" || !popupData.returnDate || !popupData.returnTime) {
      return false;
    }

    try {
      const pickupDateTime = new Date(`${popupData.pickupDate}T${popupData.pickupTime}`);
      const currentOption = popupData.fareOptions.find(o => o.vehicleType === selectedVehicleType) || popupData.fareOptions[0];
      const transitDurationMinutes = currentOption ? currentOption.durationMinutes : 180;
      
      const reachDestinationTime = new Date(pickupDateTime.getTime() + transitDurationMinutes * 60 * 1000);
      const freeHaltLimitTime = new Date(reachDestinationTime.getTime() + 6 * 60 * 60 * 1000);
      const customerReturnTime = new Date(`${popupData.returnDate}T${popupData.returnTime}`);

      return customerReturnTime.getTime() > freeHaltLimitTime.getTime();
    } catch (e) {
      return false;
    }
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

  const checkBookingMode = () => {
    if (!popupData) return { isOnlineAllowed: true, reason: "" };
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const isSameDay = popupData.pickupDate === todayStr;
    const [hours] = popupData.pickupTime.split(":").map(Number);

    if (isSameDay && (hours >= 22 || hours < 6)) {
      return {
        isOnlineAllowed: false,
        reason: "Night slot booking ke liye direct call support active hai. Immediate vehicle allocation ke liye call desk use karein.",
      };
    }
    return { isOnlineAllowed: true, reason: "" };
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
        strikeFare: result.strikeFare,
        fareText: `₹${result.finalFare.toLocaleString("en-IN")}`,
        billedDistance: result.billedDistance,
        durationMinutes: result.durationMinutes,
        discountPercent: result.discountPercent,
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
    const totalDiscounted = option.finalFare; 
    const processAmount = mode === "half" ? Math.round(totalDiscounted / 2) : totalDiscounted;

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

I would like to instantly book an outstation cab package. The verified route details are listed below:

*ROUTE MANIFEST CARD:*
• Pickup Location : ${popupData.pickup}
• Drop Destination: ${popupData.drop}
• Vehicle Segment : ${option.vehicleLabel}
• Trip Configuration : ${popupData.bookingType.toUpperCase()}
• Scheduled Timing: ${convertToIndianDate(popupData.pickupDate)} at ${formatTimeToAMPM(popupData.pickupTime)}

*COMMERCIAL PRICING SHEET:*
• Actual Net Fare (After Discount): Rs. ${option.finalFare.toLocaleString("en-IN")}.00 (All-Inclusive)

Please register this vehicle booking manually in the control desk panel and assign the driver details shortly. Thank you!`;

    const cleanFormattedUrl = `https://wa.me/919244137353?text=${encodeURIComponent(textPayload)}`;
    window.open(cleanFormattedUrl, "_blank");
  };

  const selectedOption = popupData?.fareOptions.find((item) => item.vehicleType === selectedVehicleType);
  const totalDiscountedPrice = selectedOption ? selectedOption.finalFare : 0;
  const currentSelectedMode = selectedOption && paymentSplitMode[selectedOption.id] ? paymentSplitMode[selectedOption.id] : "full";
  const displayPayNowNumber = currentSelectedMode === "half" ? Math.round(totalDiscountedPrice / 2) : totalDiscountedPrice;
  
  const reach = calculateReachDateTime(popupData?.pickupDate || "", popupData?.pickupTime || "", selectedOption?.durationMinutes || 0);
  const bookingStatus = popupData ? checkBookingMode() : { isOnlineAllowed: true, reason: "" };
  const isMultiDayHaltTriggered = checkExtraHaltCondition();

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
            <a href="tel:+919244137353" className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-900 transition-all border border-slate-800 shadow">
              📞 24x7 - 9244137353
            </a>
          </div>
        </header>

        <ImageCarousel />

        <section ref={calculatorSectionRef} className="relative z-30 px-4 py-14 sm:py-20 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 w-full h-full scale-105 opacity-40 blur-sm pointer-events-none">
            <img src="/banner6.png" alt="Route Backdrop Map" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-orange-600/20 via-slate-950/80 to-slate-950" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-6xl w-full">
            <FareCalculator
              onFareCalculated={(data) => {
                setPopupData(data);
                setSelectedVehicleType("sedan");
                setShowPopup(true);
                setShowUserForm(false);
              }}
            />
          </div>
        </section>

        {/* Popular Routes */}
        <section className="mt-16 px-4 max-w-7xl mx-auto">
          <div className="text-center sm:text-left mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Quick Selection</span>
            <h2 className="text-2xl font-black text-slate-950 mt-1">Popular Chhattisgarh Routes</h2>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-3 scrollbar-none snap-x sm:justify-start">
            {(["korba", "bilaspur", "raipur"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all snap-center whitespace-nowrap ${
                  activeTab === tab ? "bg-orange-600 text-white shadow" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                }`}
              >
                From {tab}
              </button>
            ))}
          </div>

          <div className="grid gap-4 mt-3 sm:grid-cols-3">
            {ROUTES[activeTab].map((route, index) => {
              const sampleFare = calculateFare({
                distance: route.km,
                vehicleType: "sedan",
                bookingType: "oneway",
                serviceType: "outstation",
                pickupDate: popupData?.pickupDate || new Date().toISOString().split("T")[0],
                pickupTime: popupData?.pickupTime || "06:00",
              });

              return (
                <div key={`${route.from}-${route.to}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition">
                  <div>
                    <span className="inline-block rounded-md bg-orange-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-orange-700">
                      {route.tag}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-slate-900">{route.from.split(",")[0]} to {route.to.split(",")[0]}</h3>
                    <p className="text-xs text-slate-500 mt-1">Fixed one-way price including state toll guidelines.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] block text-slate-400 font-bold uppercase tracking-wider">Sedan From</span>
                      <span className="text-lg font-black text-slate-900">₹{sampleFare.finalFare.toLocaleString("en-IN")}</span>
                    </div>
                    <button
                      onClick={() => triggerQuickBooking(route.from, route.to, route.km)}
                      className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-600 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Fleet Premium Services */}
        <section className="mt-16 bg-white py-12 px-4 border-y border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Core Domain</span>
              <h2 className="text-2xl font-black text-slate-950 mt-1">Our Premium Fleet Services</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {SERVICE_CARDS.map((card) => (
                <div key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-xs flex items-start gap-4 hover:border-orange-300 transition">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl">{card.icon}</div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-16 bg-gradient-to-b from-orange-50/40 to-slate-50 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Testimonials</span>
              <h2 className="text-2xl font-black text-slate-950 mt-1">Our Customer Voice</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                  <div className="flex gap-0.5 text-amber-500 text-xs mb-3">{"★".repeat(t.stars)}</div>
                  <p className="text-xs italic text-slate-600 leading-relaxed">"{t.text}"</p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{t.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Text Block */}
        <section className="bg-slate-900 text-slate-300 py-14 px-6 text-xs leading-relaxed border-t border-slate-800 text-left">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                Khatu Rides Travels Co. — Premium Car Rental & Outstation Intercity Taxi Solutions in Chhattisgarh
              </h2>
              <p className="mt-2 text-slate-400 text-[11px]">Comprehensive travel blueprint, route architecture, urban connectivity framework, and operational coverage details.</p>
            </div>
            <p>Welcome to <strong>Khatu Rides Travels Co.</strong>, the premier taxi service provider transforming intercity and local transit frameworks across Chhattisgarh. We build high-reliability car rental loops engineered specifically for commuters, corporate squads, and family units navigating critical routes between <strong>Korba, Raipur, Bilaspur, Durg, Bhilai, Raigarh, and Ambikapur</strong>. By establishing an ecosystem anchored on structural fare transparency, absolute zero-cancellation guarantees, and thoroughly vetted professional drivers, Khatu Rides eliminates the historical friction points typical of traditional regional travel networks. Whether you require a swift one-way outstation taxi, an extended round-trip layout, or a structured 8-hour local package for corporate errantry, our platform dynamically delivers top-tier performance on every booking transition.</p>
          </div>
        </section>

        {/* Mobile Sticky Bottom Menu Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-2 backdrop-blur md:hidden">
          <div className="grid grid-cols-2 gap-2">
            <a href="https://wa.me/919244137353" target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-1 rounded-xl bg-emerald-600 text-xs font-black uppercase text-white shadow">
              💬 WhatsApp
            </a>
            <a href="tel:+919244137353" className="flex h-12 items-center justify-center gap-1 rounded-xl bg-slate-900 text-xs font-black uppercase text-white shadow">
              📞 Call Desk
            </a>
          </div>
        </div>
      </main>

      {/* Viewport Adaptive Popup Drawer Node */}
      <AnimatePresence>
        {showPopup && popupData && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
            <motion.div 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 30, opacity: 0 }} 
              className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh] text-left"
            >
              {/* Summary Header Strip */}
              <div className="bg-slate-100 px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700">
                <div>Route: <span className="text-slate-950 font-black text-sm block sm:inline">{popupData.pickup.split(",")[0]} - {popupData.drop.split(",")[0]}</span></div>
                <div className="flex gap-4">
                  <div>Trip: <span className="text-slate-950 font-black uppercase bg-orange-100 px-2 py-0.5 rounded text-[11px] text-orange-700">{popupData.bookingType}</span></div>
                  <div>Date: <span className="text-slate-950 font-black">{convertToIndianDate(popupData.pickupDate)}</span></div>
                  <div>Time: <span className="text-slate-950 font-black">{formatTimeToAMPM(popupData.pickupTime)}</span></div>
                </div>
                <button type="button" onClick={() => setShowPopup(false)} className="text-slate-400 hover:text-slate-900 font-black text-sm transition-colors">✕ Close</button>
              </div>

              {/* Blue strip */}
              <div className="bg-blue-600 text-white px-4 py-2.5 text-[10px] sm:text-xs grid grid-cols-3 gap-1 text-center font-black uppercase tracking-wider">
                <div>₹ Pre-Fixed Pricing</div>
                <div className="border-x border-white/20">🛡️ Driver Allowance Inc.</div>
                <div>🎧 24x7 Custom Support</div>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/40">
                {!showUserForm ? (
                  <div className="flex flex-col gap-4">
                    {popupData.fareOptions.map((opt) => {
                      if (!["sedan", "ertiga", "crysta"].includes(opt.vehicleType)) return null;
                      
                      const fallbackStrike = Math.round(opt.finalFare * 1.33);
                      const displayStrikePrice = opt.strikeFare || fallbackStrike;
                      const dynamicLimitKms = getDynamicKmsLimitDisplay(opt);
                      const extraRatePerKm = opt.vehicleType === "sedan" ? 15 : opt.vehicleType === "ertiga" ? 20 : 25;
                      
                      // 👑 FIXED DYNAMIC DISCOUNT DISPLAY: Fetches matching percentage dynamically from the calculation engine payload
                      const currentDiscountRate = opt.discountPercent || (popupData.bookingType === "oneway" && opt.billedDistance > 500 ? 10 : 25);

                      return (
                        <div key={opt.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs hover:shadow-md transition flex flex-col">
                          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto text-center sm:text-left">
                              <img src={VEHICLES[opt.vehicleType]?.image} alt={opt.vehicleLabel} className="w-32 h-20 sm:w-36 sm:h-24 object-contain flex-shrink-0 mx-auto sm:mx-0" />
                              <div>
                                <h4 className="text-lg font-black text-slate-900">{opt.vehicleLabel}</h4>
                                <p className="text-xs text-slate-400 mt-0.5 font-medium">or equivalent | {opt.vehicleType === "sedan" ? "4" : "6"}+1 Seater AC Cab</p>
                                
                                <div className="mt-2.5 flex flex-wrap gap-1.5 justify-center sm:justify-start text-[10px] font-bold">
                                  <span className="bg-slate-100 text-slate-500 border border-slate-200/50 px-2 py-0.5 rounded">👤 Allowance Included</span>
                                  <span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-0.5 rounded animate-pulse">
                                    📦 Kms Limit: {dynamicLimitKms} KM
                                  </span>
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded">
                                    ⚡ Extra Run: ₹{extraRatePerKm}/KM
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Right Side Price Breakdown */}
                            <div className="text-center sm:text-right flex flex-col items-center sm:items-end justify-center min-w-full sm:min-w-[200px] border-t pt-3 sm:pt-0 sm:border-none border-slate-100 w-full sm:w-auto">
                              <div className="flex items-center gap-1.5 justify-center sm:justify-end mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Actual Fare:</span>
                                <span className="text-xs font-bold text-slate-400 line-through">₹{displayStrikePrice.toLocaleString("en-IN")}</span>
                                {/* 👑 FIXED BADGE LOGIC: Explicit dynamic string mapping applied */}
                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">-{currentDiscountRate}% DISCOUNT</span>
                              </div>
                              
                              <div className="mb-2 text-center sm:text-right">
                                <span className="text-[10px] font-black text-orange-600 uppercase block tracking-wider">After Discount Price:</span>
                                <div className="text-2xl font-black text-slate-950 tracking-tight">₹{opt.finalFare.toLocaleString("en-IN")}</div>
                              </div>
                              
                              <span className="text-[10px] text-slate-400 font-semibold block mb-3">Includes dynamic toll policies</span>
                              
                              {/* 👑 RE-ENGINEERED TRIPLE TRIGGER GRID CARD INJECTIONS */}
                              <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[200px]">
                                {/* Button 1: Swapped text to Continue for Online Booking */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedVehicleType(opt.vehicleType);
                                    setShowUserForm(true);
                                  }}
                                  className="bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl shadow-md transition-all text-center w-full"
                                >
                                  Continue for Online Booking
                                </button>

                                {/* Button 2: Manual Book On WhatsApp added directly inside card layout view */}
                                <button
                                  type="button"
                                  onClick={() => handleWhatsAppManualRedirect(opt)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl shadow-sm transition-all text-center w-full flex items-center justify-center gap-1.5"
                                >
                                  💬 Book On WhatsApp
                                </button>
                              </div>
                            </div>
                          </div>

                          {isMultiDayHaltTriggered ? (
                            <div className="w-full bg-red-600 border-t border-red-700/50 py-2.5 px-4 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5 shadow-inner">
                              <span className="text-xs animate-pulse">⚠️</span>
                              <p className="text-[10px] sm:text-[11px] font-extrabold text-white uppercase tracking-wide">
                                MULTI-DAY TRIP DETECTED: <span className="text-yellow-300">2 DAYS & 1 NIGHT CHARGE WILL BE PAID EXTRA BY CUSTOMER</span> AS PER ACTUAL RUN.
                              </p>
                            </div>
                          ) : (
                            <div className="w-full bg-red-600 border-t border-red-700/50 py-2 px-4 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5 shadow-inner">
                              <span className="text-[10px] sm:text-[11px] text-white">⚠️</span>
                              <p className="text-[10px] sm:text-[11px] font-extrabold text-white uppercase tracking-wide">
                                100% PAYABLE AMOUNT ON SCREEN. <span className="text-yellow-300">NO ANY HIDDEN CHARGES</span>
                              </p>
                            </div>
                          )}
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
                          
                          {isMultiDayHaltTriggered && (
                            <div className="mt-3 bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-[10px] font-bold">
                              ℹ️ Note: Is booking me Multi-day trip alert lag chuka hai. Extra run allowance status onboarding ke waqt set hoga.
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 block uppercase">Payable Now</span>
                              <span className="text-xl font-black text-slate-900">₹{displayPayNowNumber.toLocaleString("en-IN")}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">{selectedOption.vehicleLabel}</span>
                          </div>
                        </div>
                      )}

                      {/* 👑 SCREEN 2 FORM BUTTONS: Only contains single Book Online trigger (WhatsApp button completely removed here) */}
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
      {/* Sakha Floating Automated AI Assistant Injector */}
    <SakhaBot />
    </>
  
);
}
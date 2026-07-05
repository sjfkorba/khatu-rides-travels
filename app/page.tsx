// app/page.tsx
"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import FareCalculator from "@/components/FareCalculator";
import ImageCarousel from "@/components/ImageCarousel";
import {
  calculateFare,
  VEHICLES,
  type BookingType,
  type VehicleType,
  type ServiceType,
} from "@/lib/fareCalculator";

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
  { title: "Outstation Cabs", desc: "One way aur round trip bookings with fixed transparent pricing logic.", icon: "🚖" },
  { title: "Local Packages", desc: "8 Hours / 80 Km corporate aur family runs package without extra stress.", icon: "🏙️" },
  { title: "Airport Transfers", desc: "Time sync pick and drop alerts for stress free travel transitions.", icon: "🛫" },
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

  const calculatorSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    const handleScrollTrigger = () => {
      if (calculatorSectionRef.current) {
        calculatorSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
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

  const checkBookingMode = () => {
    if (!popupData) return { isOnlineAllowed: true, reason: "" };
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const isSameDay = popupData.pickupDate === todayStr;
    const [hours] = popupData.pickupTime.split(":").map(Number);

    if (isSameDay && (hours >= 22 || hours < 6)) {
      return {
        isOnlineAllowed: false,
        reason: "Night slot booking ke liye direct call support active hai. Immediate vehicle allocation ke liye niche call desk choose karein.",
      };
    }
    return { isOnlineAllowed: true, reason: "" };
  };

  const getWhatsappUrl = (option: FareOption) => {
    const tripLabel = popupData?.serviceType === "local" ? "Local Package" : popupData?.bookingType === "roundtrip" ? "Round Trip" : "One Way";
    const text = `*New Cab Enquiry - Khatu Rides*%0A%0A` +
      `Trip Type: ${tripLabel}%0A` +
      `Vehicle: ${option.vehicleLabel}%0A` +
      `Pickup: ${popupData?.pickup}%0A` +
      `Drop: ${popupData?.drop}%0A` +
      `Date: ${convertToIndianDate(popupData?.pickupDate || "")}%0A` +
      `Time: ${formatTimeToAMPM(popupData?.pickupTime || "")}%0A` +
      `Fare Architecture: ${option.fareText}`;
    return `https://wa.me/919244137353?text=${text}`;
  };

  const triggerQuickBooking = (from: string, to: string, routeDistance: number) => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    const baseDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const baseTime = `${String(now.getHours()).padStart(2, "0")}:00`;

    const fareOptions: FareOption[] = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
      const result = calculateFare({
        distance: routeDistance,
        vehicleType: type,
        bookingType: "oneway",
        serviceType: "outstation",
        pickupLocation: from,
        dropLocation: to,
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
      };
    });

    setPopupData({ fareOptions, pickup: from, drop: to, bookingType: "oneway", serviceType: "outstation", pickupDate: baseDate, pickupTime: baseTime });
    setSelectedVehicleType("sedan");
    setShowPopup(true);
  };

  const handleOnlinePaymentCheckout = async (option: FareOption) => {
    if (!popupData) return;
    setPaymentLoadingId(option.id);
    const activeDiscountPercentage = option.billedDistance <= 150 ? 20 : 10;
    const discountAmount = Math.round(option.finalFare * (activeDiscountPercentage / 100));
    const totalDiscounted = option.finalFare - discountAmount;
    const mode = paymentSplitMode[option.id] || "full";
    const processAmount = mode === "half" ? Math.round(totalDiscounted / 2) : totalDiscounted;

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: processAmount, pickup: popupData.pickup, drop: popupData.drop, vehicleLabel: option.vehicleLabel }),
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.orderId || "Order generation error");

      const paymentObject = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: "INR",
        name: "Khatu Rides Travels Co.",
        description: `${option.vehicleLabel} Route Allocation`,
        order_id: orderData.orderId,
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
            setShowPopup(false);
            setSuccessReceipt({
              invoiceId: verifyData.invoiceId || `KR-${Math.floor(100000 + Math.random() * 900000)}`,
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

  const selectedOption = popupData?.fareOptions.find((item) => item.vehicleType === selectedVehicleType);
  const activeDiscountPercentage = selectedOption ? (selectedOption.billedDistance <= 150 ? 20 : 10) : 10;
  const discountCutAmount = selectedOption ? Math.round(selectedOption.finalFare * (activeDiscountPercentage / 100)) : 0;
  const totalDiscountedPrice = selectedOption ? selectedOption.finalFare - discountCutAmount : 0;
  const currentSelectedMode = selectedOption && paymentSplitMode[selectedOption.id] ? paymentSplitMode[selectedOption.id] : "full";
  const displayPayNowNumber = currentSelectedMode === "half" ? Math.round(totalDiscountedPrice / 2) : totalDiscountedPrice;
  const reach = calculateReachDateTime(popupData?.pickupDate || "", popupData?.pickupTime || "", selectedOption?.durationMinutes || 0);
  const bookingStatus = popupData ? checkBookingMode() : { isOnlineAllowed: true, reason: "" };

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <main className="min-h-screen bg-white text-slate-900 pb-16 md:pb-0 font-sans">
        
        {/* 👑 REALIGNED HEADER: Solves empty center area in orange bar matching image_46bc28.png layout */}
        <header className="w-full bg-orange-600 text-white shadow-md select-none">
          
          {/* Layer 1: Top Compact Dark Info Strip */}
          <div className="bg-slate-950 py-1.5 px-4 text-[10px] font-black uppercase tracking-widest block sm:flex sm:justify-between sm:px-8 text-orange-400">
            <span>⚡ STATE FLEET NETWORK</span>
            <span className="hidden sm:inline text-white">🔒 SECURE CHECKOUT INTEGRATED</span>
            <span className="hidden sm:inline">⭐ DESTINATION CHHATTISGARH</span>
          </div>

          {/* Layer 2: Main Rich Orange Action Grid Bar */}
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 items-center w-full gap-2">
              
              {/* LEFT NODE: Brand Identity */}
              <div className="flex flex-col justify-center items-start">
                <span className="text-xl font-black tracking-tighter uppercase text-white leading-none">
                  Khatu<span className="text-slate-900">Rides</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-200 mt-1">
                  Travels Co.
                </span>
              </div>

              {/* CENTER NODE (DESKTOP ONLY): Tagline precisely aligned in grid center */}
              <div className="hidden lg:flex items-center justify-center text-center">
                <p className="text-xs font-black uppercase tracking-widest bg-slate-900/10 px-4 py-2 rounded-full border border-white/10 text-white shadow-inner">
                  ✨ Best Taxi Service Provider In Chhattisgarh
                </p>
              </div>

              {/* RIGHT NODE: Call Actions */}
              <div className="flex items-center justify-end">
                <a 
                  href="tel:+919244137353" 
                  className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-900 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center gap-1.5 whitespace-nowrap border border-slate-800"
                >
                  <span className="inline-block animate-pulse text-orange-500">📞</span> 
                  24x7 - 9244137353
                </a>
              </div>

            </div>

            {/* MOBILE ONLY TAGLINE: Displayed below identity elements on dynamic viewports */}
            <div className="block lg:hidden text-center mt-3 pt-2.5 border-t border-white/10">
              <p className="text-[10px] font-black uppercase tracking-wider text-orange-100">
                Best Taxi Service Provider In Chhattisgarh
              </p>
            </div>

          </div>
        </header>

        {/* Dynamic Image Carousel Banner */}
        <ImageCarousel />

        {/* GLASSMORPHISM BACKGROUND & PADDING LOOP CONTROLLER */}
        <section 
          ref={calculatorSectionRef}
          className="relative z-30 px-4 py-14 sm:py-20 overflow-hidden min-h-[520px] flex items-center justify-center bg-slate-950 scroll-mt-6"
        >
          {/* Glass Backdrop Background Image Asset */}
          <div className="absolute inset-0 w-full h-full scale-105 opacity-40 blur-sm pointer-events-none">
            <img 
              src="/banner6.png" 
              alt="Route Backdrop Map" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* High Contrast Neon Glow Filters */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-600/20 via-slate-950/80 to-slate-950" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* 80% Desktop Max-Width Sheet Container */}
          <div className="relative z-10 mx-auto max-w-6xl w-full">
            <FareCalculator
              onFareCalculated={(data) => {
                setPopupData(data);
                setSelectedVehicleType("sedan");
                setShowPopup(true);
              }}
            />
          </div>
        </section>

        {/* Popular Routes Section */}
        <section className="mt-12 px-4 max-w-7xl mx-auto">
          <div className="text-center sm:text-left mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Quick Selection</span>
            <h2 className="text-xl font-extrabold text-slate-950 mt-1">Popular Chhattisgarh Routes</h2>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-3 scrollbar-none snap-x mask-linear-r sm:justify-start">
            {(["korba", "bilaspur", "raipur"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all snap-center whitespace-nowrap ${
                  activeTab === tab ? "bg-orange-600 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                From {tab}
              </button>
            ))}
          </div>

          <div className="grid gap-4 mt-2 sm:grid-cols-3">
            {ROUTES[activeTab].map((route, index) => {
              const sampleFare = calculateFare({
                distance: route.km,
                vehicleType: "sedan",
                bookingType: "oneway",
                serviceType: "outstation",
                pickupLocation: route.from,
                dropLocation: route.to,
              });

              return (
                <div key={`${route.from}-${route.to}-${index}`} className="rounded-2xl border border-slate-100 bg-orange-50/40 p-5 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="inline-block rounded-md bg-orange-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-orange-700">
                      {route.tag}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-slate-900">
                      {route.from.split(",")[0]} to {route.to.split(",")[0]}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Fixed one-way price including state toll guidelines.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] block text-slate-400 font-bold uppercase tracking-wider">Sedan From</span>
                      <span className="text-lg font-black text-slate-900">₹{sampleFare.finalFare.toLocaleString("en-IN")}</span>
                    </div>
                    <button
                      onClick={() => triggerQuickBooking(route.from, route.to, route.km)}
                      className="rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-orange-600 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Services Architecture Section */}
        <section className="mt-14 bg-slate-50 py-10 px-4 border-y border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Core Domain</span>
              <h2 className="text-xl font-extrabold text-slate-950 mt-1">Our Premium Fleet Services</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {SERVICE_CARDS.map((card) => (
                <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl">{card.icon}</div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Khatu Rides Section */}
        <section className="mt-14 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Core Value</span>
            <h2 className="text-xl font-extrabold text-slate-950 mt-1">Why Choose Khatu Rides</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-4 text-center">
            {[
              { title: "Verified Drivers", desc: "Sare drivers background checked aur professionally trained hote hain.", icon: "👮‍♂️" },
              { title: "Transparent Billing", desc: "No hidden costs. Jo screen par dikhega, wahi final payment hoga.", icon: "💵" },
              { title: "Clean & Sanitized Cabs", desc: "Har ride se pehle strict clean checks and fresh air guidelines.", icon: "✨" },
              { title: "24x7 Custom Support", desc: "Emergency manual route calls aur direct night support operational.", icon: "📞" }
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 p-5 bg-white shadow-sm">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Customer Voice Section */}
        <section className="mt-14 bg-gradient-to-b from-orange-50/50 to-white py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Testimonials</span>
              <h2 className="text-xl font-extrabold text-slate-950 mt-1">Our Customer Voice</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
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

        {/* Deep SEO Rich Description Content Block */}
        <section className="mt-14 bg-slate-900 text-slate-300 py-12 px-6 text-xs leading-relaxed border-t border-slate-800">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                Khatu Rides Travels Co. — Premium Car Rental & Outstation Intercity Taxi Solutions in Chhattisgarh
              </h2>
              <p className="mt-2 text-slate-400 text-[11px]">
                Comprehensive travel blueprint, route architecture, urban connectivity framework, and operational coverage details.
              </p>
            </div>

            <p>
              Welcome to <strong>Khatu Rides Travels Co.</strong>, the premier taxi service provider transforming intercity and local transit frameworks across Chhattisgarh. We build high-reliability car rental loops engineered specifically for commuters, corporate squads, and family units navigating critical routes between <strong>Korba, Raipur, Bilaspur, Durg, Bhilai, Raigarh, and Ambikapur</strong>. By establishing an ecosystem anchored on structural fare transparency, absolute zero-cancellation guarantees, and thoroughly vetted professional drivers, Khatu Rides eliminates the historical friction points typical of traditional regional travel networks. Whether you require a swift one-way outstation taxi, an extended round-trip layout, or a structured 8-hour local package for corporate errantry, our platform dynamically delivers top-tier performance on every booking transition.
            </p>

            <h3 className="text-white font-bold text-sm uppercase tracking-wide">1. Comprehensive Intercity Route Network Across Chhattisgarh</h3>
            <p>
              Our operations focus intently on the industrial and economic lines of Chhattisgarh. The <strong>Korba to Bilaspur</strong> and <strong>Korba to Raipur</strong> paths serve as critical channels for executives, public sector specialists, and heavy commercial vehicle logistics operators. Recognizing that these travelers demand precision timing, our dispatch mechanics prioritize immediate asset deployment along these highways. Furthermore, our corporate pipelines connecting <strong>Raipur to Bilaspur</strong> support high-frequency enterprise movement, offering seamless transfers between the state capital and the judicial hub. We also extend complete service matrices to growing economic sectors in <strong>Raigarh</strong> and Northern hubs like <strong>Ambikapur</strong>, ensuring that Tier-2 and Tier-3 urban clusters enjoy identical service reliability as tier-1 metropolises.
            </p>

            <h3 className="text-white font-bold text-sm uppercase tracking-wide">2. Algorithmic Fare Architecture & Fixed Toll-Inclusive Structuring</h3>
            <p>
              The defining operational standard of Khatu Rides is our complete rejection of opaque billing strategies. Our integrated <code>FareCalculator</code> framework dynamically analyzes direct physical distances to formulate absolute fixed-price declarations before a customer initiates checkout. This calculation structure maps exact regional routing parameters, ensuring that the fare presented is the final financial obligation. Our pricing tiers explicitly integrate regional highway toll policies where indicated. By delivering toll-inclusive pricing configurations across popular intercity routes, we eliminate mid-transit driver negotiations and out-of-pocket cash requirements during the trip. This transparent structure allows passengers to sit back and enjoy a smooth journey with zero billing surprises.
            </p>

            <h3 className="text-white font-bold text-sm uppercase tracking-wide">3. Rigid Driver Vetting Protocols and Fleet Maintenance Criteria</h3>
            <p>
              Passenger safety and vehicle security form the foundations of our service delivery framework. Every chauffeur operating within the Khatu Rides ecosystem undergoes a rigorous onboarding audit, which includes verifying state documentation, assessing long-form highway driving experience, and evaluating customer service etiquette. Fleet logistics are subjected to strict maintenance schedules. Our selection of sleek Sedans, high-capacity Ertigas, and rugged SUVs are inspected regularly for mechanical health, air conditioning performance, tire safety, and deep interior sanitation. This relentless focus on quality ensures that every customer receives a clean, road-ready vehicle capable of delivering a seamless journey from origin to destination.
            </p>

            <h3 className="text-white font-bold text-sm uppercase tracking-wide">4. Advanced Flexible Payments and Multi-Channel Support Architecture</h3>
            <p>
              To accommodate diverse financial preferences, Khatu Rides provides fully secure, real-time payment checkouts via domestic payment pathways, including instant UPI, credit/debit facilities, and net banking loops. Customers have the flexibility to choose their payment preference: opting for full settlement at checkout or selecting a 50% advance split framework to reserve their vehicle while retaining liquidity until vehicle arrival. For users requiring immediate operational confirmations, off-grid custom routing, or midnight travel arrangements, our platform integrates a direct-to-desktop 24x7 phone desk alongside an instant automated WhatsApp booking assistant. This multi-channel approach guarantees that you remain directly connected to fleet management throughout your entire journey.
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
              {[
                "One way taxi in Raipur", "Bilaspur cab booking", "Korba outstation taxi", "Local cab package Chhattisgarh",
                "Round trip cab service Korba", "Raigarh car rental", "Ambikapur taxi service", "Khatu Rides contact number"
              ].map((tag) => (
                <span key={tag} className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-[10px] font-medium text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Persistent Bottom Bar Navigation Only for Mobile Screens */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-2 backdrop-blur md:hidden">
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://wa.me/919244137353"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-1 rounded-xl bg-emerald-600 text-xs font-black uppercase tracking-wider text-white shadow"
            >
              💬 WhatsApp
            </a>
            <a
              href="tel:+919244137353"
              className="flex h-12 items-center justify-center gap-1 rounded-xl bg-slate-900 text-xs font-black uppercase tracking-wider text-white shadow"
            >
              📞 Call Desk
            </a>
          </div>
        </div>
      </main>

      {/* Main Fare Overview Overlay Modal */}
      <AnimatePresence>
        {showPopup && popupData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-xs sm:items-center sm:p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 220 }} className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[24px] bg-white shadow-2xl sm:rounded-[24px]">
              
              <div className="flex items-center justify-between border-b border-slate-100 bg-orange-50/60 px-5 py-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Select Your Vehicle Fleet</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{popupData.pickup.split(",")[0]} ➔ {popupData.drop.split(",")[0]}</p>
                </div>
                <button onClick={() => setShowPopup(false)} className="rounded-full bg-slate-200/70 p-1.5 text-xs font-bold text-slate-700 w-8 h-8 flex items-center justify-center">✕</button>
              </div>

              <div className="flex flex-col overflow-y-auto p-4 lg:flex-row gap-4">
                <div className="space-y-2.5 flex-1">
                  {popupData.fareOptions.map((opt) => {
                    const active = opt.vehicleType === selectedVehicleType;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedVehicleType(opt.vehicleType)}
                        className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${
                          active ? "border-orange-500 bg-orange-50/60 shadow-xs" : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{opt.vehicleType === "sedan" ? "🚖" : opt.vehicleType === "ertiga" ? "🚘" : "🚙"}</span>
                          <div>
                            <div className="text-xs font-black text-slate-900">{opt.vehicleLabel}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">{opt.billedDistance} Km Billing Radius</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-slate-950">₹{opt.finalFare.toLocaleString("en-IN")}</div>
                          <span className="text-[9px] text-orange-600 font-bold uppercase tracking-wider block mt-0.5">{active ? "Selected" : "Tap Choice"}</span>
                        </div>
                      </button>
                    );
                  })}

                  {!bookingStatus.isOnlineAllowed && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[11px] font-semibold text-red-700 leading-normal">
                      ⚠️ {bookingStatus.reason}
                    </div>
                  )}
                </div>

                {selectedOption && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:w-[360px] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="rounded bg-orange-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Configured Invoice</span>
                          <h4 className="text-base font-black text-slate-900 mt-2">{selectedOption.vehicleLabel}</h4>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{convertToIndianDate(popupData.pickupDate)}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/60">
                        <div>
                          <span className="text-slate-400 font-medium block">Expected Reach</span>
                          <span className="font-bold text-slate-800">{reach.time}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Travel Parameters</span>
                          <span className="font-bold text-slate-800">State Toll Inc.*</span>
                        </div>
                      </div>

                      {bookingStatus.isOnlineAllowed && (
                        <div className="mt-4">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">Payment Architecture</span>
                          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-1">
                            <button
                              type="button"
                              onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "half" }))}
                              className={`rounded-lg py-2 text-center text-[10px] font-black uppercase tracking-wider ${
                                currentSelectedMode === "half" ? "bg-orange-600 text-white shadow-xs" : "text-slate-500"
                              }`}
                            >
                              50% Advance
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "full" }))}
                              className={`rounded-lg py-2 text-center text-[10px] font-black uppercase tracking-wider ${
                                currentSelectedMode === "full" ? "bg-slate-900 text-white shadow-xs" : "text-slate-500"
                              }`}
                            >
                              Full Pay
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 border-t border-slate-200 pt-4 bg-white -mx-4 -mb-4 p-4 rounded-b-2xl lg:m-0 lg:p-0 lg:bg-transparent lg:border-none">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Due Right Now</span>
                          <span className="text-xl font-black text-slate-900">₹{displayPayNowNumber.toLocaleString("en-IN")}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Save {activeDiscountPercentage}% Today</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={getWhatsappUrl(selectedOption)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-11 items-center justify-center rounded-xl border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white shadow-xs"
                        >
                          Enquire
                        </a>
                        {bookingStatus.isOnlineAllowed ? (
                          <button
                            onClick={() => handleOnlinePaymentCheckout(selectedOption)}
                            disabled={paymentLoadingId === selectedOption.id}
                            className="flex h-11 items-center justify-center rounded-xl bg-orange-600 text-xs font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-orange-700 disabled:opacity-50"
                          >
                            {paymentLoadingId === selectedOption.id ? "Syncing..." : "Pay & Book"}
                          </button>
                        ) : (
                          <a
                            href="tel:+919244137353"
                            className="flex h-11 items-center justify-center rounded-xl bg-red-600 text-xs font-black uppercase tracking-wider text-white shadow-sm"
                          >
                            Call Desk
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Success Confirmation Modal */}
      <AnimatePresence>
        {successReceipt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-xs sm:items-center sm:p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="w-full max-w-md overflow-hidden rounded-t-[24px] bg-white shadow-2xl sm:rounded-[24px]">
              <div className="bg-emerald-50 px-5 py-5 text-center border-b border-emerald-100">
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">✓</div>
                <h3 className="text-lg font-black text-slate-950">Allocation Confirmed</h3>
                <p className="text-xs text-slate-500 mt-1">Your route request has been securely dispatched to fleet ops.</p>
              </div>

              <div className="p-5 space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2 text-slate-700">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Invoice Data Summary</div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Invoice ID:</span> <span>{successReceipt.invoiceId}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Fleet Class:</span> <span>{successReceipt.vehicle}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Pickup Location:</span> <span className="text-right truncate max-w-[200px]">{successReceipt.pickup}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Drop Point:</span> <span className="text-right truncate max-w-[200px]">{successReceipt.drop}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Timeline Structure:</span> <span>{successReceipt.date} at {successReceipt.time}</span></div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-slate-950 text-sm">
                    <span>Paid via Checkout:</span> <span>₹{successReceipt.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://wa.me/919244137353"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center rounded-xl bg-emerald-600 text-xs font-black uppercase tracking-wider text-white shadow"
                  >
                    Share Route Info
                  </a>
                  <button
                    onClick={() => setSuccessReceipt(null)}
                    className="flex h-11 items-center justify-center rounded-xl bg-slate-950 text-xs font-black uppercase tracking-wider text-white shadow"
                  >
                    Close Panel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
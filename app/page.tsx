// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import FareCalculator from "@/components/FareCalculator";
import { calculateFare, VEHICLES, type BookingType, type VehicleType } from "@/lib/fareCalculator";

type FareOption = {
  id: string;
  vehicleType: string;
  vehicleLabel: string;
  vehicleImage: string;
  finalFare: number;
  fareText: string;
  billedDistance: number;
  durationMinutes: number;
};

type PopupData = {
  fareOptions: FareOption[];
  pickup: string;
  drop: string;
  bookingType: BookingType;
  pickupDate: string;
  pickupTime: string;
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

const AD_SLIDES = [
  {
    icon: "⚡",
    title: "ऑनलाइन बुकिंग पर 20% तक की तुरंत बचत!",
    desc: "कैशलेस पेमेंट करें और सीधा ₹400 से ₹800 तक का भारी डिस्काउंट तुरंत पाएं।",
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    text: "text-orange-800"
  },
  {
    icon: "🎫",
    title: "100% फिक्स्ड किराया - नो हिडन चार्जेस",
    desc: "नेशनल हाईवे टोल टैक्स, स्टेट टैक्स और फास्टैग चार्ज पहले से ही किराए में शामिल हैं।",
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    text: "text-blue-800"
  }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"korba" | "bilaspur" | "raipur">("korba");
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<SuccessReceipt | null>(null);
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // State tracking for user payment split preferences per vehicle option
  const [paymentSplitMode, setPaymentSplitMode] = useState<Record<string, "full" | "half">>({});

  useEffect(() => {
    const adTimer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % AD_SLIDES.length);
    }, 4500);

    const popupTimer = setTimeout(() => {
      setShowOfferPopup(true);
    }, 1500);

    return () => {
      clearInterval(adTimer);
      clearTimeout(popupTimer);
    };
  }, []);

  const closeOfferPopup = () => setShowOfferPopup(false);

  const convertToIndianDate = (dateString: string) => {
    if (!dateString) return "03/07/2026";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatTimeToAMPM = (timeString: string) => {
    if (!timeString) return "09:00 AM";
    let [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; 
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
    const mns = String(combined.getMinutes()).padStart(2, "0");
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;

    return { date: `${dd}/${mm}/${yyyy}`, time: `${String(hrs).padStart(2, "0")}:${mns} ${ampm}` };
  };

  const checkBookingMode = () => {
    if (!popupData) return { isOnlineAllowed: true, reason: "" };

    const todayStr = new Date().toISOString().split("T")[0];
    const isSameDay = popupData.pickupDate === todayStr;
    const [hours] = popupData.pickupTime.split(":").map(Number);

    if (isSameDay && (hours >= 22 || hours < 6)) {
      return { 
        isOnlineAllowed: false, 
        reason: "🌙 अभी नाइट सेफ्टी मोड एक्टिव है (10 PM - 6 AM)। तुरंत रात की गाड़ी अलॉट कराने के लिए नीचे कॉल करें!" 
      };
    }

    if (isSameDay) {
      const rightNow = new Date();
      const selectedTime = new Date(`${popupData.pickupDate}T${popupData.pickupTime}`);
      const differenceInMs = selectedTime.getTime() - rightNow.getTime();
      const differenceInMinutes = differenceInMs / (1000 * 60);

      if (differenceInMinutes < 60) {
        return { 
          isOnlineAllowed: false, 
          reason: "⚠️ तत्काल गाड़ी लाइनअप करने में कम से कम 1 घंटे का समय लगता है। आपातकालीन रन के लिए सीधे नीचे कॉल करें!" 
        };
      }
    }

    return { isOnlineAllowed: true, reason: "" };
  };

  const handleOnlinePaymentCheckout = async (option: FareOption) => {
    if (!popupData) return;
    setPaymentLoadingId(option.id);

    const activeDiscountPercentage = option.billedDistance <= 150 ? 20 : 10;
    const discountCutAmount = Math.round(option.finalFare * (activeDiscountPercentage / 100));
    const totalDiscountedPrice = option.finalFare - discountCutAmount;

    const mode = paymentSplitMode[option.id] || "full";
    const processAmount = mode === "half" ? Math.round(totalDiscountedPrice / 2) : totalDiscountedPrice;

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: processAmount, 
          pickup: popupData.pickup,
          drop: popupData.drop,
          vehicleLabel: option.vehicleLabel,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Order failed");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: "INR",
        name: "खाटू राइड्स ट्रेवल्स कंपनी",
        description: `${option.vehicleLabel} | Mode: ${mode.toUpperCase()}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
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
                paymentMode: mode === "half" ? "50% ADVANCE" : "FULL PAYMENT"
              });
            }
          } catch (err) {
            console.error(err);
          }
        },
        theme: { color: "#ea580c" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      alert(`भुगतान खिड़की त्रुटि: ${error.message}`);
    } finally {
      setPaymentLoadingId(null);
    }
  };

  const getWhatsappUrl = (option: FareOption) => {
    const tripLabel = popupData?.bookingType === "roundtrip" ? "Round Trip Runs" : "One Way Run";
    const textMessage =
      `✨ *New Taxi Booking Enquiry* ✨\n\n` +
      `🔄 *Trip Type* - ${tripLabel}\n` +
      `🚖 *Vehicle Type* - ${option.vehicleLabel}\n\n` +
      `📍 *Pick-up Location* - ${popupData?.pickup}\n` +
      `📅 *Pickup Date & Time* - ${convertToIndianDate(popupData?.pickupDate || "")} | ${formatTimeToAMPM(popupData?.pickupTime || "")}\n` +
      `🏁 *Drop Location* - ${popupData?.drop}\n` +
      `💰 *Flat Estimated Fare* - *${option.fareText}* (Toll Taxes Fully Included)\n\n` +
      `📡 *Source* - Khatu Rides Travels Co.`;

    return `https://wa.me/919244137353?text=${encodeURIComponent(textMessage)}`;
  };

  const getShareReceiptWhatsappUrl = (receipt: SuccessReceipt) => {
    const textMessage =
      `✅ *KHATU RIDES BOOKING CONFIRMED* ✅\n\n` +
      `🎫 *Invoice ID:* ${receipt.invoiceId}\n` +
      `🚖 *Vehicle:* ${receipt.vehicle}\n` +
      `📍 *From:* ${receipt.pickup.split(",")[0]}\n` +
      `🏁 *To:* ${receipt.drop.split(",")[0]}\n` +
      `📅 *Date/Time:* ${receipt.date} | ${receipt.time}\n\n` +
      `💰 *Payment Status:* ₹${receipt.amount.toLocaleString("en-IN")} (${receipt.paymentMode})\n\n` +
      `🚩 Our driver will call you 30 minutes before schedule. Have a safe journey!`;

    return `https://wa.me/919244137353?text=${encodeURIComponent(textMessage)}`;
  };

  const handleInstantOfferClick = () => {
    closeOfferPopup();
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const triggerQuickBooking = (from: string, to: string) => {
    let routeDistance = 150;
    const pLow = from.toLowerCase();
    const dLow = to.toLowerCase();

    if ((pLow.includes("korba") && dLow.includes("bilaspur")) || (pLow.includes("bilaspur") && dLow.includes("korba"))) routeDistance = 90;
    else if ((pLow.includes("bilaspur") && dLow.includes("raipur")) || (pLow.includes("raipur") && dLow.includes("bilaspur"))) routeDistance = 115;
    else if ((pLow.includes("korba") && dLow.includes("raipur")) || (pLow.includes("raipur") && dLow.includes("korba"))) routeDistance = 215;

    const baseDate = new Date().toISOString().split("T")[0];
    const rightNow = new Date();
    rightNow.setHours(rightNow.getHours() + 2);
    const baseTime = `${String(rightNow.getHours()).padStart(2, "0")}:00`;

    const dynamicOptions: FareOption[] = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
      const coreCalc = calculateFare({
        distance: routeDistance, vehicleType: type, bookingType: "oneway", pickupLocation: from, dropLocation: to,
      });

      return {
        id: `oneway-${type}`,
        vehicleType: type,
        vehicleLabel: VEHICLES[type].label,
        vehicleImage: VEHICLES[type].image,
        finalFare: coreCalc.finalFare,
        fareText: `₹${coreCalc.finalFare.toLocaleString("en-IN")}`,
        billedDistance: coreCalc.billedDistance,
        durationMinutes: coreCalc.durationMinutes
      };
    });

    setPopupData({ fareOptions: dynamicOptions, pickup: from, drop: to, bookingType: "oneway", pickupDate: baseDate, pickupTime: baseTime });
    setShowPopup(true);
  };

  const validationResult = checkBookingMode();

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      {/* ☀️ DESKTOP PREMIUM NAVIGATION BAR */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full h-20 bg-white border-b border-slate-200 px-12 items-center justify-between z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black tracking-tighter text-slate-900">Khatu<span className="text-orange-600">Rides</span></span>
          <span className="text-[10px] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded font-black text-orange-600 uppercase tracking-wider">Premium Cab Service</span>
        </div>
        <div className="flex items-center gap-8 text-xs font-black uppercase text-slate-600 tracking-wide">
          <div className="flex items-center gap-4 border-r pr-6 border-slate-200">
            <span className="flex items-center gap-1 text-slate-900">🛡️ <span className="text-slate-400 font-bold">Trusted Drivers</span></span>
            <span className="flex items-center gap-1 text-slate-900">✨ <span className="text-slate-400 font-bold">Clean Cabs</span></span>
          </div>
          <a href="tel:+919244137353" className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-6 py-3 rounded-xl shadow-md shadow-orange-600/10 hover:opacity-95 transition-opacity">Call Desk: 9244137353</a>
        </div>
      </nav>

      {/* 👑 FIXED TOP MARGIN AND PADDING: FIXED CONTAINER BODY */}
      <main className="min-h-screen bg-slate-50 antialiased pt-0 md:pt-20 pb-24 relative">
        <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/40 via-slate-50 to-white pt-6 md:pt-12 pb-14 border-b border-slate-200">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c02_1px,transparent_1px),linear-gradient(to_bottom,#ea580c02_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="relative mx-auto max-w-7xl px-4 text-center flex flex-col items-center">
            
            {/* Advertisement Dynamic Carousel Block */}
            <div className="w-full max-w-xl min-h-[50px] md:min-h-[72px] flex items-center justify-center overflow-hidden mb-4 md:mb-6">
              <AnimatePresence mode="wait">
                <motion.div key={currentAdIndex} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }} className={`w-full bg-white border ${AD_SLIDES[currentAdIndex].border} p-3 rounded-2xl flex items-center gap-3 shadow-sm text-left`}>
                  <span className="text-xl md:text-2xl filter drop-shadow-sm">{AD_SLIDES[currentAdIndex].icon}</span>
                  <div>
                    <h4 className={`${AD_SLIDES[currentAdIndex].text} text-[11px] sm:text-sm font-black uppercase tracking-wide leading-none`}>{AD_SLIDES[currentAdIndex].title}</h4>
                    <p className="text-slate-600 text-[10px] sm:text-xs font-semibold mt-1 leading-tight">{AD_SLIDES[currentAdIndex].desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <h1 className="text-2xl sm:text-5xl font-black text-slate-900 max-w-5xl tracking-tight leading-tight">
              Premium Outstation One-Way Taxi <br/>
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                Flat Rates • Toll Taxes Fully Included
              </span>
            </h1>
            
            <div className="mt-6 md:mt-10 w-full max-w-4xl">
              <FareCalculator onFareCalculated={(data) => { setPopupData(data); setShowPopup(true); }} />
            </div>
          </div>
        </section>

        {/* POPULAR ROUTE TABS */}
        <section className="py-14 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">🗺️ Popular Outstation Routes</h2>
            <div className="flex justify-center bg-slate-100 p-1 rounded-xl max-w-xs mx-auto mb-8 mt-6 shadow-inner">
              {(["korba", "bilaspur", "raipur"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-[11px] font-black rounded-lg uppercase tracking-wider transition-all ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
              {activeTab === "korba" && [
                { to: "Raipur City", dist: "215 KM", price: "3,799", tag: "Capital Corridor" },
                { to: "Bilaspur High Court", dist: "90 KM", price: "2,399", tag: "Strict Fixed Lock" },
                { to: "Raipur Airport (RPR)", dist: "230 KM", price: "3,999", tag: "Flight Catch Special" },
              ].map((r, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <span className="text-[9px] bg-orange-100 border border-orange-200 text-orange-800 px-2.5 py-0.5 rounded font-black uppercase">{r.tag}</span>
                    <h3 className="text-base font-black text-slate-900 mt-3">Korba ➔ {r.to}</h3>
                  </div>
                  <div className="border-t border-slate-200 mt-5 pt-3 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Flat Sedan Fare</span>
                      <span className="text-lg font-black text-slate-900">₹{r.price}</span>
                    </div>
                    <button onClick={() => triggerQuickBooking("Korba, Chhattisgarh", r.to)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black px-4 py-2.5 rounded-xl uppercase tracking-wider">Book Cab</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 📱 APP MOBILE FIXED STICKY ACTION DOCK */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white/95 backdrop-blur border-t border-slate-200 grid grid-cols-2 p-2 gap-2 z-[999998] shadow-lg">
        <a href="https://wa.me/919244137353" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 uppercase shadow-sm"><span>💬</span> WhatsApp</a>
        <a href="tel:+919244137353" className="bg-slate-900 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 uppercase shadow-sm"><span>📞</span> Call Desk</a>
      </div>

      {/* 🎫 PRICING PASS SCREEN MODAL BLOCK */}
      <AnimatePresence>
        {showPopup && popupData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[999999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="bg-slate-900 px-5 py-4 flex items-center justify-between shrink-0">
                <span className="text-xs font-black text-orange-400 tracking-wider uppercase">🎫 KHATU RIDES OFFICIAL PASS</span>
                <button type="button" onClick={() => setShowPopup(false)} className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 px-3 py-1 rounded-lg">✕ Close</button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 bg-slate-50 space-y-4">
                {!validationResult.isOnlineAllowed && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-[11px] font-bold text-left animate-pulse">{validationResult.reason}</div>
                )}

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 space-y-1 shadow-sm">
                  <div className="text-slate-900 font-black text-sm pb-1 flex justify-between border-b mb-1">
                    <span>🚖 Route Summary</span>
                    <span className="text-orange-600 uppercase text-xs font-black">({popupData.bookingType === "roundtrip" ? "🔄 RoundTrip" : "➔ OneWay"})</span>
                  </div>
                  <div>📍 <span className="text-slate-900 font-extrabold">From:</span> {popupData.pickup.split(",")[0]}</div>
                  <div>🏁 <span className="text-slate-900 font-extrabold">To:</span> {popupData.drop.split(",")[0]}</div>
                  <div>📅 <span className="text-slate-900 font-extrabold">Date/Time:</span> {convertToIndianDate(popupData.pickupDate)} | {formatTimeToAMPM(popupData.pickupTime)}</div>
                </div>

                {popupData.fareOptions.map((option) => {
                  const reach = calculateReachDateTime(popupData.pickupDate, popupData.pickupTime, option.durationMinutes);
                  const isLoading = paymentLoadingId === option.id;
                  
                  const activeDiscountPercentage = option.billedDistance <= 150 ? 20 : 10;
                  const discountCutAmount = Math.round(option.finalFare * (activeDiscountPercentage / 100));
                  const totalDiscountedPrice = option.finalFare - discountCutAmount;

                  const currentSelectedMode = paymentSplitMode[option.id] || "full";
                  const displayPayNowNumber = currentSelectedMode === "half" ? Math.round(totalDiscountedPrice / 2) : totalDiscountedPrice;

                  return (
                    <div key={option.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-4 flex gap-4 items-center">
                        <div className="w-20 h-14 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                          <img src={option.vehicleImage} alt={option.vehicleLabel} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow text-left space-y-0.5">
                          <h4 className="text-xs font-black text-slate-900">{option.vehicleLabel}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">🛣️ Billed Distance: <span className="text-slate-800 font-extrabold">{option.billedDistance} KM</span></p>
                          <p className="text-[11px] text-slate-500 font-medium">⏱️ Est. Reach: <span className="text-emerald-600 font-extrabold">{reach.date} | {reach.time}</span></p>
                        </div>
                      </div>

                      {/* 🛠️ UX DYNAMIC TOGGLE SELECTOR PILL */}
                      {validationResult.isOnlineAllowed && (
                        <div className="px-4 pb-2.5 pt-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Payment Option:</span>
                          <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[10px] font-black shadow-inner">
                            <button type="button" onClick={() => setPaymentSplitMode(prev => ({ ...prev, [option.id]: "half" }))} className={`px-2.5 py-1 rounded-md transition-all ${currentSelectedMode === "half" ? "bg-orange-600 text-white shadow" : "text-slate-500"}`}>50% Advance</button>
                            <button type="button" onClick={() => setPaymentSplitMode(prev => ({ ...prev, [option.id]: "full" }))} className={`px-2.5 py-1 rounded-md transition-all ${currentSelectedMode === "full" ? "bg-slate-900 text-white shadow" : "text-slate-500"}`}>Full Payment</button>
                          </div>
                        </div>
                      )}

                      <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="text-left w-full sm:w-auto">
                          <span className="block text-[9px] font-black text-slate-400 uppercase leading-none">Standard: <span className="line-through">₹{option.finalFare}</span></span>
                          <div className="text-xl font-black text-slate-900 mt-1 leading-none">
                            ₹{displayPayNowNumber.toLocaleString("en-IN")}
                            <span className="text-[9px] text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded font-black uppercase ml-1.5 align-middle">
                              {currentSelectedMode === "half" ? "Advance Pay" : `-${activeDiscountPercentage}% off`}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 w-full sm:w-auto justify-end shrink-0">
                          <a href={popupData ? getWhatsappUrl(option) : "#"} target="_blank" rel="noopener noreferrer" className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-black px-4 py-2.5 rounded-xl uppercase text-center shadow-sm">💬 Offline</a>
                          {validationResult.isOnlineAllowed ? (
                            <button onClick={() => handleOnlinePaymentCheckout(option)} disabled={isLoading} className="bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[11px] font-black px-4 py-2.5 rounded-xl uppercase tracking-wider shadow-md disabled:opacity-50 min-w-[125px]">
                              {isLoading ? "🔄..." : "💳 Pay Online"}
                            </button>
                          ) : (
                            <a href="tel:+919244137353" className="bg-red-600 text-white text-[11px] font-black px-4 py-2.5 rounded-xl uppercase tracking-wider text-center shadow animate-bounce flex items-center justify-center">📞 Call Desk</a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SUCCESS CONFIRMATION RECEIPT SCREEN --- */}
      <AnimatePresence>
        {successReceipt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 overflow-hidden font-sans">
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
              
              <div className="p-6 text-center bg-gradient-to-b from-emerald-50 via-emerald-50/20 to-white border-b border-slate-100 shrink-0">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-2 shadow-inner">✓</div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">बुकिंग सफल! सीट कन्फर्म हो चुकी है</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase mt-0.5">खाटू राइड्स डिजिटल बोर्डिंग पास</p>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto flex-grow bg-slate-50">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-sm text-xs font-bold text-slate-600 relative">
                  <div className="absolute top-4 right-4 bg-emerald-100 border border-emerald-200 text-emerald-800 font-black px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider">{successReceipt.paymentMode}</div>
                  <div className="text-slate-900 font-black text-sm border-b pb-1.5 flex items-center gap-1">🎫 PASS ID: <span className="text-orange-600">{successReceipt.invoiceId}</span></div>
                  <div>🚖 <span className="text-slate-900 font-extrabold">Vehicle Assigned:</span> {successReceipt.vehicle}</div>
                  <div>📍 <span className="text-slate-900 font-extrabold">Pickup Point:</span> {successReceipt.pickup.split(",")[0]}</div>
                  <div>🏁 <span className="text-slate-900 font-extrabold">Drop Destination:</span> {successReceipt.drop.split(",")[0]}</div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t mt-2">
                    <div>📅 <span className="text-slate-900 font-extrabold">Date:</span> {successReceipt.date}</div>
                    <div>⏱️ <span className="text-slate-900 font-extrabold">Time:</span> {successReceipt.time}</div>
                  </div>
                </div>

                <div className="bg-orange-50/60 border border-dashed border-orange-200 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-wider">Total Transaction Processed (Net)</span>
                  <span className="text-2xl font-black text-slate-900">₹{successReceipt.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100 space-y-2 shrink-0">
                <a href={getShareReceiptWhatsappUrl(successReceipt)} target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-4 rounded-xl uppercase tracking-widest text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"><span>💬</span> WhatsApp पर सहेजें (Save)</a>
                <button onClick={() => setSuccessReceipt(null)} className="w-full bg-slate-100 text-slate-600 text-xs font-black py-3 rounded-xl uppercase tracking-wider text-center">✕ Close Pass</button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
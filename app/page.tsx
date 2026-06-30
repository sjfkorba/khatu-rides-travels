// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FareCalculator from "@/components/FareCalculator";
import TopBar from "@/components/TopBar";
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

export default function HomePage() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState<"korba" | "bilaspur" | "raipur">("korba");
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOfferPopup(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const closeOfferPopup = () => {
    setShowOfferPopup(false);
  };

  const convertToIndianDate = (dateString: string) => {
    if (!dateString) return "29/06/2026";
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

    return {
      date: `${dd}/${mm}/${yyyy}`,
      time: `${String(hrs).padStart(2, "0")}:${mns} ${ampm}`
    };
  };

  const getWhatsappUrl = (option: FareOption) => {
    const reach = calculateReachDateTime(popupData?.pickupDate || "", popupData?.pickupTime || "", option.durationMinutes);
    const tripLabel = popupData?.bookingType === "roundtrip" ? "Round Trip Runs" : "One Way Run";
    
    const textMessage =
      `✨ *New Taxi Booking Enquiry* ✨\n\n` +
      `🔄 *Trip Type* - ${tripLabel}\n` +
      `🚖 *Vehicle Type* - ${option.vehicleLabel}\n\n` +
      `📍 *Pick-up Location* - ${popupData?.pickup}\n` +
      `📅 *Pickup Date & Time* - ${convertToIndianDate(popupData?.pickupDate || "")} | ${formatTimeToAMPM(popupData?.pickupTime || "")}\n` +
      `🏁 *Drop Location* - ${popupData?.drop}\n` +
      `⏱️ *Estimated Reach Time* - ${reach.date} | ${reach.time}\n\n` +
      `💰 *Flat Estimated Fare* - *${option.fareText}* (Toll Taxes Fully Included)\n\n` +
      `📡 *Source* - Khatu Rides Travels Co.\n\n` +
      `Please confirm fleet availability and arrange the cab for my journey. 🙏`;

    return `https://wa.me/919244137353?text=${encodeURIComponent(textMessage)}`;
  };

  const handleInstantOfferClick = () => {
    closeOfferPopup();
    window.scrollTo({ top: 180, behavior: "smooth" });
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

    setPopupData({
      fareOptions: dynamicOptions, pickup: from, drop: to, bookingType: "oneway", pickupDate: baseDate, pickupTime: baseTime
    });
    setShowPopup(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 80) setShowNavbar(false);
        else setShowNavbar(true);
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-[100] transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
        <TopBar />
      </div>

      <main className="min-h-screen bg-white antialiased pt-16 relative">
        {/* 🌌 HERO SECTION WITH COMPACT MODERN OVERLAYS */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-8 pb-14 border-b border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-orange-400 backdrop-blur-sm">
                ⚡ CHHATTISGARH'S NO.1 LUXURY ONE-WAY CAB NETWORK
              </div>
              <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-5xl leading-tight">
                Premium One-Way Taxi Service{" "}
                <span className="block bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent mt-1">
                  Zero Hidden Charges • Flat Rates
                </span>
              </h1>
              <p className="mt-2 text-slate-400 text-xs sm:text-sm max-w-2xl font-medium">
                Say goodbye to unverified state tolls, mandatory overnight driver allowances, and app convenience fees. Lock verified intercity loops with pure transparency.
              </p>
              
              {/* Fare Calculator Desk Wrapper */}
              <div className="mt-8 w-full max-w-4xl">
                <div className="bg-slate-100 rounded-[2rem] p-2 border border-slate-200/60 shadow-2xl">
                  <FareCalculator onFareCalculated={(data) => { setPopupData(data); setShowPopup(true); }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORRIDORS GRID TABS — EXPANDED TO 20+ STRATEGIC ROUTES */}
        <section className="py-16 bg-slate-50/60 border-b border-slate-200/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              🗺️ Popular Fixed Route Corridors
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-1 mb-8">Click 'Book Cab' to check live vehicle availabilities instantly without prompts.</p>
            
            <div className="flex justify-center bg-white border border-slate-200 p-1.5 rounded-2xl max-w-md mx-auto mb-10 shadow-sm">
              {(["korba", "bilaspur", "raipur"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2.5 text-xs font-black rounded-xl uppercase tracking-wider transition-all duration-200 ${activeTab === tab ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:text-slate-900"}`}>
                  {tab === "korba" ? "🏭 From Korba" : tab === "bilaspur" ? "⚖️ From Bilaspur" : "🏢 From Raipur"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
              {/* 🏭 CATEGORY 1: FROM KORBA (7 ROUTES) */}
              {activeTab === "korba" && [
                { to: "Raipur City", dist: "215 KM", price: "3,799", tag: "Capital Corridor" },
                { to: "Bilaspur High Court", dist: "90 KM", price: "2,399", tag: "Strict Fixed Lock" },
                { to: "Raipur Airport (RPR)", dist: "230 KM", price: "3,999", tag: "Flight Catch Special" },
                { to: "Champa Junction", dist: "45 KM", price: "1,099", tag: "Railway Sync Connect" },
                { to: "Sakti Town", dist: "75 KM", price: "1,899", tag: "Industrial Loop" },
                { to: "Ambikapur Hub", dist: "165 KM", price: "3,499", tag: "North CG Line" },
                { to: "Raigarh Industrial", dist: "125 KM", price: "2,799", tag: "Business Run" },
              ].map((r, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center"><span className="text-[9px] bg-orange-50 border border-orange-200 text-orange-700 px-2.5 py-0.5 rounded font-black uppercase tracking-wider">{r.tag}</span><span className="text-xs text-slate-400 font-bold">{r.dist}</span></div>
                    <h3 className="text-base font-black text-slate-900 mt-3">Korba ➔ {r.to}</h3>
                  </div>
                  <div className="border-t border-slate-100 mt-5 pt-3 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Flat Sedan Fare</span>
                      <span className="text-lg font-black text-slate-900">₹{r.price}</span>
                    </div>
                    <button onClick={() => triggerQuickBooking("Korba, Chhattisgarh", r.to)} className="bg-slate-900 text-white text-xs font-black px-4 py-2.5 rounded-xl uppercase tracking-wider">Book Cab</button>
                  </div>
                </div>
              ))}

              {/* ⚖️ CATEGORY 2: FROM BILASPUR (7 ROUTES) */}
              {activeTab === "bilaspur" && [
                { to: "Raipur City", dist: "115 KM", price: "2,399", tag: "Express Core" },
                { to: "Korba Industrial", dist: "90 KM", price: "2,399", tag: "Industrial Belt" },
                { to: "Ambikapur Hub", dist: "180 KM", price: "4,149", tag: "North Region Route" },
                { to: "Janjgir-Champa", dist: "55 KM", price: "1,499", tag: "District Connect" },
                { to: "Raigarh Town", dist: "140 KM", price: "2,999", tag: "Coal Corridor East" },
                { to: "Mungeli Node", dist: "52 KM", price: "1,399", tag: "Regional Line" },
                { to: "Pendra Road / Gaurela", dist: "110 KM", price: "2,699", tag: "Hill Loop Run" },
              ].map((r, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center"><span className="text-[9px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded font-black uppercase tracking-wider">{r.tag}</span><span className="text-xs text-slate-400 font-bold">{r.dist}</span></div>
                    <h3 className="text-base font-black text-slate-900 mt-3">Bilaspur ➔ {r.to}</h3>
                  </div>
                  <div className="border-t border-slate-100 mt-5 pt-3 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Flat Sedan Fare</span>
                      <span className="text-lg font-black text-slate-900">₹{r.price}</span>
                    </div>
                    <button onClick={() => triggerQuickBooking("Bilaspur, Chhattisgarh", r.to)} className="bg-slate-900 text-white text-xs font-black px-4 py-2.5 rounded-xl uppercase tracking-wider">Book Cab</button>
                  </div>
                </div>
              ))}

              {/* 🏢 CATEGORY 3: FROM RAIPUR (6 ROUTES) */}
              {activeTab === "raipur" && [
                { to: "Jagdalpur Bastar", dist: "295 KM", price: "5,799", tag: "Premium Long Route" },
                { to: "Rajnandgaon Town", dist: "72 KM", price: "1,899", tag: "Dry Point Corridor" },
                { to: "Korba Power Hub", dist: "215 KM", price: "3,799", tag: "Return Route Run" },
                { to: "Durg / Bhilai Twin City", dist: "40 KM", price: "1,199", tag: "Education Corridor" },
                { to: "Dhamtari Node", dist: "80 KM", price: "1,999", tag: "South Highway Sync" },
                { to: "Mahasamund Corridor", dist: "55 KM", price: "1,499", tag: "Sambalpur Line Border" },
              ].map((r, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center"><span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded font-black uppercase tracking-wider">{r.tag}</span><span className="text-xs text-slate-400 font-bold">{r.dist}</span></div>
                    <h3 className="text-base font-black text-slate-900 mt-3">Raipur ➔ {r.to}</h3>
                  </div>
                  <div className="border-t border-slate-100 mt-5 pt-3 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Flat Sedan Fare</span>
                      <span className="text-lg font-black text-slate-900">₹{r.price}</span>
                    </div>
                    <button onClick={() => triggerQuickBooking("Raipur, Chhattisgarh", r.to)} className="bg-slate-900 text-white text-xs font-black px-4 py-2.5 rounded-xl uppercase tracking-wider">Book Cab</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 👑 --- NEW ATTRACTIVE SEO POWERED RICH CONTENT SECTIONS --- 👑 */}
        
        {/* 📑 SECTION 2: TRUST BENCHMARKS (3-COLUMN INFOGRAPHIC) */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[10px] bg-slate-900 text-white font-black px-3 py-1 rounded-full uppercase tracking-widest">
              🛡️ KHATU RIDES STANDARDS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
              The Most Reliable Outstation Cab Booking Agency In Chhattisgarh
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1 max-w-xl mx-auto">
              We eliminate pricing loopholes commonly practiced by standard commercial rental booking channels.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
              <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[1.5rem] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-lg">💰</div>
                <h3 className="text-base font-black text-slate-900">Pure Fixed Fare Policy</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  The price reflected on your route pass is the final figure. No post-journey modifications, zero peak-time surge inflation, and complete tax transparency.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[1.5rem] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg">🛣️</div>
                <h3 className="text-base font-black text-slate-900">National Highway Toll Inclusive</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  All active National Highway Authority (NHAI) plaza barriers and FastTag costs are fully absorbed into our base pricing layout. Pay nothing at the tolls.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[1.5rem] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-200/20 flex items-center justify-center text-lg">👨‍✈️</div>
                <h3 className="text-base font-black text-slate-900">Zero Driver Allowances</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  We manage and dispatch fully compensated professional outstation chauffeurs. No demands for driver fooding allowances or special late-night operations bhatta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 📑 SECTION 3: SEO RICH LONG-FORM CONTENT COMPONENT */}
        <section className="py-16 bg-slate-50/50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-left space-y-8 text-slate-600 font-medium text-xs leading-relaxed">
            
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                Premium One-Way Car Rental & Outstation Cab Booking System In Chhattisgarh
              </h2>
              <p>
                When it comes to planning safe, economical, and prompt long-distance intercity commutes across Central India, **Khatu Rides Travels Co.** stands as the premier ecosystem. Standard application-based aggregators often display low starting parameters, only to burden passengers with unverified return-toll costs, calculated dynamic surge structures, and unexpected driver convenience bills post-ride. Our structural engineering addresses this massive transport layout gap by delivering a streamlined, highly functional **one-way car hire system** optimized specifically for commercial intercity circuits.
              </p>
              <p>
                Whether you require an efficient **Raipur to Bilaspur taxi service**, industrial **Korba cab rental corridors**, or specialized **Raipur Airport (RPR) taxi drops**, our real-time system sync guarantees flat transparent pricing. By eliminating unneeded broker commission loops, we preserve clear retention pricing, assuring premium vehicle conditions and professional verified operators for every distinct outstation loop.
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-200/80 pt-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Comprehensive Fleet Optimization: Sedan, Ertiga, and Innova Crysta Tariffs
              </h3>
              <p>
                Every distinct business itinerary or family vacation route requires a specific fleet configuration. Khatu Rides manages a verified supply of vehicles segmented into crisp client requirements. Our compact **Sedan segment (Swift Dzire, Toyota Etios)** operates at optimized base rules, making it perfect for executive day runs, short court commutes, and airport transfers. For extended families requiring higher space parameters, our **MUV segment (Suzuki Ertiga 6+1)** offers premium structural comfort paired with high-volume baggage room. 
              </p>
              <p>
                For extreme executive comfort, luxury tours, and long interstate routes across Odisha, Madhya Pradesh, or Jharkhand, our flagship **Premium SUV segment (Toyota Innova Crysta)** provides unmatched stability, isolated cabin cooling, and top-tier safety. Every vehicle undergoes a thorough multi-point checklist before dispatch to guarantee total compliance with our premium transit guidelines.
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-200/80 pt-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Guaranteed Low-Volume Node Protection (Ambikapur, Chirmiri, Jagdalpur & Beyond)
              </h3>
              <p>
                Standard transport providers often refuse or cancel trips toward distant nodes like **Ambikapur, Chirmiri, Sakti, or Jagdalpur Bastar circuits** due to the extreme risk of empty return loops. Khatu Rides explicitly stabilizes these paths by integrating automated zone multipliers directly into our pricing engine. By applying dedicated protection adjustments for distant terminals, we keep drivers motivated and secure booking allocations within 7 minutes, even from high-risk locations. Enjoy stress-free, fully-monitored one-way cab services anywhere across Chhattisgarh with Khatu Rides Travels Co.
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* 👑 --- HINDI DEVANAGARI MODERN LIGHT OFFER POPUP --- */}
      <AnimatePresence>
        {showOfferPopup && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 w-screen h-screen z-[9999999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 overflow-hidden font-sans"
          >
            <motion.div 
              initial={{ scale: 0.96, y: 12, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.96, y: 12, opacity: 0 }} 
              className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(234,88,12,0.35)] overflow-hidden relative border border-orange-200 flex flex-col max-h-[92vh]"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

              <button 
                type="button" 
                onClick={closeOfferPopup} 
                className="absolute top-4 right-4 z-50 bg-slate-100/80 hover:bg-orange-500/10 text-slate-500 hover:text-orange-600 rounded-full transition-all text-xs font-bold w-7 h-7 flex items-center justify-center shadow-sm"
              >
                ✕
              </button>

              <div className="px-5 pt-8 pb-5 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/80 via-amber-50/40 to-white shrink-0 border-b border-slate-100 relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c05_1px,transparent_1px),linear-gradient(to_bottom,#ea580c05_1px,transparent_1px)] bg-[size:14px_14px]" />
                <span className="inline-flex items-center gap-1 text-[10px] bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm relative z-10">
                  ✨ 100% फिक्स्ड किराया गारंटी
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-3.5 relative z-10 tracking-tight">
                  जब किराया फिक्स्ड है, तो <br/>
                  <span className="text-orange-600 underline decoration-wavy decoration-amber-400 underline-offset-4">Toll और Hidden Charges</span> अलग से क्यों देना?
                </h2>
                <p className="text-xs text-slate-600 font-bold mt-2 max-w-xs mx-auto leading-relaxed relative z-10">
                  खाटू राइड्स पर कोई धोखा नहीं! जब आपको पूरी ट्रांसपेरेंसी के साथ हर बुकिंग पर स्पेशल डिस्काउंट मिल रहा है, तो बाकी कंपनियों को फालतू पैसे क्यों देना?
                </p>
              </div>

              <div className="p-5 space-y-4 bg-white flex-grow overflow-y-auto">
                <div className="grid grid-cols-3 gap-2 text-center font-black">
                  <div className="bg-red-50/60 border border-dashed border-red-200/80 rounded-2xl py-2 shadow-sm">
                    <span className="block text-sm">🎫</span>
                    <span className="text-[9px] text-red-600 block mt-0.5 line-through decoration-2">TOLL FEES</span>
                    <span className="text-[8px] text-emerald-600 block font-black uppercase">FREE</span>
                  </div>
                  <div className="bg-red-50/60 border border-dashed border-red-200/80 rounded-2xl py-2 shadow-sm">
                    <span className="block text-sm">👨‍✈️</span>
                    <span className="text-[9px] text-red-600 block mt-0.5 line-through decoration-2">DRIVER BHATTA</span>
                    <span className="text-[8px] text-emerald-600 block font-black uppercase">FREE</span>
                  </div>
                  <div className="bg-red-50/60 border border-dashed border-red-200/80 rounded-2xl py-2 shadow-sm">
                    <span className="block text-sm">🌙</span>
                    <span className="text-[9px] text-red-600 block mt-0.5 line-through decoration-2">NIGHT CHARGES</span>
                    <span className="text-[8px] text-emerald-600 block font-black uppercase">FREE</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:border-indigo-400 transition-all">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg shadow-sm">📅</div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900 tracking-wide">एडवांस बुकिंग स्पेशल पास</h3>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5 leading-tight">यात्रा से <span className="text-indigo-600 font-extrabold">2 दिन पहले</span> बुक करने पर</p>
                      </div>
                    </div>
                    <div className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 rounded-xl shrink-0 shadow-sm">
                      FLAT 15% OFF
                    </div>
                  </div>

                  <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-orange-50/40 via-white to-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:border-orange-400 transition-all">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg shadow-sm">⚡</div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900 tracking-wide">इंस्टेंट कन्फर्मेशन पास</h3>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5 leading-tight">व्हाट्सएप पर <span className="text-orange-600 font-extrabold">अभी तुरंत</span> सीट लॉक करने पर</p>
                      </div>
                    </div>
                    <div className="text-xs font-black text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1.5 rounded-xl shrink-0 shadow-sm">
                      UP TO 10% OFF
                    </div>
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 font-bold text-center leading-normal pt-1">
                  * नोट: ऑफर का लाभ उठाने के लिए व्हाट्सएप पर ही बुकिंग और इंस्टेंट कन्फर्मेशन होना अनिवार्य है।
                </p>

                <button 
                  onClick={handleInstantOfferClick}
                  className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white text-xs font-black py-4 rounded-xl uppercase tracking-widest shadow-[0_6px_25px_rgba(234,88,12,0.3)] transition-all active:scale-[0.99] hover:brightness-105"
                >
                  🎯 अपना स्पेशल डिस्काउंट चेक करें
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Optimized Premium Minimalist Pass Popup Layout --- */}
      <AnimatePresence>
        {showPopup && popupData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[999999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="bg-slate-900 px-5 py-4 flex items-center justify-between shrink-0">
                <span className="text-xs font-black text-orange-400 tracking-wider uppercase">🎫 KHATU RIDES OFFICIAL PASS</span>
                <button type="button" onClick={() => setShowPopup(false)} className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 px-3 py-1 rounded-lg">✕ Close</button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 bg-slate-50 space-y-4">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 space-y-1 shadow-sm">
                  <div className="text-slate-900 font-black text-sm pb-1 flex justify-between border-b mb-1">
                    <span>🚖 Route Dispatch Sheet</span>
                    <span className="text-orange-600 uppercase text-xs font-black">({popupData.bookingType === "roundtrip" ? "🔄 RoundTrip" : "➔ OneWay"})</span>
                  </div>
                  <div>📍 <span className="text-slate-900 font-extrabold">From:</span> {popupData.pickup.split(",")[0]}</div>
                  <div>🏁 <span className="text-slate-900 font-extrabold">To:</span> {popupData.drop.split(",")[0]}</div>
                  <div>📅 <span className="text-slate-900 font-extrabold">Date/Time:</span> {convertToIndianDate(popupData.pickupDate)} | {formatTimeToAMPM(popupData.pickupTime)}</div>
                </div>

                {popupData.fareOptions.map((option) => {
                  const reach = calculateReachDateTime(popupData.pickupDate, popupData.pickupTime, option.durationMinutes);
                  return (
                    <div key={option.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-4 flex gap-4 items-center">
                        <div className="w-20 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                          <img src={option.vehicleImage} alt={option.vehicleLabel} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow text-left space-y-0.5">
                          <h4 className="text-xs font-black text-slate-900">{option.vehicleLabel}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">🛣️ Billed Distance: <span className="text-slate-800 font-extrabold">{option.billedDistance} KM</span></p>
                          <p className="text-[11px] text-slate-500 font-medium">⏱️ Est. Reach: <span className="text-emerald-600 font-extrabold">{reach.date} | {reach.time}</span></p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center justify-between">
                        <div className="text-left">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-slate-900">{option.fareText}</span>
                          </div>
                          <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">🟢 Toll Included</span>
                        </div>
                        <a 
                          href={getWhatsappUrl(option)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-gradient-to-r from-orange-600 to-[#c2511b] text-white text-[11px] font-black px-4 py-2.5 rounded-xl uppercase tracking-wider shadow active:scale-95 transition-transform"
                        >
                          ⚡ WhatsApp Book
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
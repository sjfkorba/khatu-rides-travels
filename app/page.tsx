"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FareCalculator from "@/components/FareCalculator";
import TopBar from "@/components/TopBar";
import { formatCurrency, VEHICLES, type BookingType } from "@/lib/fareCalculator";

type FareOption = {
  id: string;
  vehicleType: string;
  vehicleLabel: string;
  vehicleImage: string;
  baseFareWithoutAddons: number;
  finalFare: number;
  strikeFare: number;
  fareText: string;
  strikeText: string;
  pricingModeLabel: string;
  billedDistance: number;
  calculatedDayHaltCharges: number;
  calculatedNightCharges: number;
  nightChargePercentageApplied: number;
  expectedReachTimeText: string;
  stopManagementCharge: number;
};

type PopupData = {
  fareOptions: FareOption[];
  pickup: string;
  drop: string;
  bookingType: BookingType;
  pickupDate: string;
  pickupTime: string;
  stopsCount: number;
  stopsListText: string;
  tripDays: number;
};

export default function HomePage() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState<"korba" | "bilaspur" | "raipur">("korba");

  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  // HELPER: Convert ISO Date (YYYY-MM-DD) to Indian Standard Format (DD/MM/YYYY)
  const convertToIndianDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // HELPER: Convert 24Hr Time String ("09:30") to AM/PM Fluid Format ("09:30 AM")
  const formatTimeToAMPM = (timeString: string) => {
    if (!timeString) return "";
    let [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };

  // HELPER: Calculate AM/PM Reach Time window explicitly
  const formatReachTimeAMPM = (routeDistanceKm: number, baseDateStr: string, baseTimeStr: string) => {
    if (!baseDateStr || !baseTimeStr || routeDistanceKm <= 0) return "N/A";
    const [hours, minutes] = baseTimeStr.split(":").map(Number);
    const totalDurationMinutes = Math.round((routeDistanceKm / 60) * 60) + 45; 
    const targetDate = new Date(`${baseDateStr}T00:00:00`);
    targetDate.setHours(hours, minutes + totalDurationMinutes, 0, 0);

    const targetDay = String(targetDate.getDate()).padStart(2, "0");
    const targetMonth = String(targetDate.getMonth() + 1).padStart(2, "0");
    const targetYear = targetDate.getFullYear();
    
    let targetHours = targetDate.getHours();
    const targetMinutes = String(targetDate.getMinutes()).padStart(2, "0");
    const ampm = targetHours >= 12 ? "PM" : "AM";
    targetHours = targetHours % 12;
    targetHours = targetHours ? targetHours : 12;

    return `${String(targetHours).padStart(2, "0")}:${targetMinutes} ${ampm} on ${targetDay}/${targetMonth}/${targetYear}`;
  };

  const triggerQuickBooking = (from: string, to: string) => {
    const mockDistance = to.toLowerCase().includes("airport") ? 210 : to.toLowerCase().includes("bilaspur") ? 90 : 230;
    const baseDate = new Date().toISOString().split("T")[0];
    const baseTime = "09:00";
    
    const finalFareAmount = mockDistance * 14 < 2000 ? 1949 : 3449;

    const sampleOptions: FareOption[] = [
      {
        id: `oneway-sedan`,
        vehicleType: "sedan",
        vehicleLabel: "Sedan (Dzire/Etios)",
        vehicleImage: VEHICLES.sedan.image,
        baseFareWithoutAddons: mockDistance * 14,
        finalFare: finalFareAmount,
        strikeFare: finalFareAmount, // Fixed: Strike rate multiplier removed
        fareText: formatCurrency(finalFareAmount),
        strikeText: formatCurrency(finalFareAmount),
        pricingModeLabel: "One Way Economy Pricing",
        billedDistance: mockDistance,
        calculatedDayHaltCharges: 0,
        calculatedNightCharges: 0,
        nightChargePercentageApplied: 0,
        expectedReachTimeText: formatReachTimeAMPM(mockDistance, baseDate, baseTime),
        stopManagementCharge: 0
      }
    ];

    setPopupData({
      fareOptions: sampleOptions,
      pickup: from,
      drop: to,
      bookingType: "oneway",
      pickupDate: baseDate,
      pickupTime: baseTime,
      stopsCount: 0,
      stopsListText: "",
      tripDays: 1
    });
    setTimeLeft(300);
    setShowPopup(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!showPopup) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [showPopup]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    return `${mins}:${(secs % 60).toString().padStart(2, "0")}`;
  };

  const getWhatsappUrl = (option: FareOption) => {
    const stopMsg = popupData?.stopsListText ? `🛑 Mid Stops: ${popupData.stopsListText}\n` : "";
    const textMessage =
      `Hello Khatu Rides, Book my cab slot:\n\n` +
      `📍 From: ${popupData?.pickup}\n` +
      stopMsg +
      `🏁 To: ${popupData?.drop}\n` +
      `🔄 Mode: ${popupData?.bookingType.toUpperCase()}\n` +
      `🚘 Vehicle: ${option.vehicleLabel}\n` +
      `📅 Departure Date: ${convertToIndianDate(popupData?.pickupDate || "")}\n` +
      `⏱️ Departure Time: ${formatTimeToAMPM(popupData?.pickupTime || "")}\n` +
      `💰 NET Payable Fare: ${option.fareText} (Toll Included)\n\n` +
      `Please lock driver assignment right away.`;
    return `https://wa.me/919244137353?text=${encodeURIComponent(textMessage)}`;
  };

  const cheapestFare = popupData?.fareOptions.length 
    ? Math.min(...popupData.fareOptions.map((i) => i.finalFare)) 
    : null;

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-[100] transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
        <TopBar />
      </div>

      <main className="min-h-screen bg-slate-50 text-slate-800 antialiased overflow-x-hidden pt-16 relative">
        
        {/* HERO HEADER SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 pt-5 pb-8 border-b border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-[11px] font-black uppercase tracking-widest text-orange-400 backdrop-blur-sm">
                ⚡ CHHATTISGARH OFFICIAL PREMIER FLEET NETWORK
              </div>
              <h1 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-4xl">
                Premium One-Way Taxi Service{" "}
                <span className="block sm:inline bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                  With Transparent Fixed Fares
                </span>
              </h1>
              
              {/* INTERACTIVE FORM WRAPPER */}
              <div className="mt-6 w-full max-w-5xl">
                <div className="bg-white rounded-3xl p-1.5 md:p-2.5 border border-slate-200/80 shadow-2xl">
                  <FareCalculator 
                    onFareCalculated={(data) => {
                      const customizedOptions = data.fareOptions.map(opt => ({
                        ...opt,
                        expectedReachTimeText: formatReachTimeAMPM(opt.billedDistance, data.pickupDate, data.pickupTime)
                      }));
                      setPopupData({ ...data, fareOptions: customizedOptions });
                      setTimeLeft(300);
                      setShowPopup(true);
                    }} 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CORRIDORS GRID TABS */}
        <section className="py-14 bg-slate-50 border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center bg-white border border-slate-200 p-1 rounded-2xl max-w-md mx-auto mb-8 shadow-sm">
              {(["korba", "bilaspur", "raipur"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2.5 text-xs font-black rounded-xl uppercase tracking-wider transition-all duration-200 ${activeTab === tab ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900"}`}>
                  {tab === "korba" ? "🏭 From Korba" : tab === "bilaspur" ? "⚖️ From Bilaspur" : "🏢 From Raipur"}
                </button>
              ))}
            </div>

            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              <AnimatePresence mode="popLayout">
                {activeTab === "korba" && [
                  { to: "Raipur City", dist: "215 KM", price: "3,449", tag: "Capital Corridor" },
                  { to: "Bilaspur High Court", dist: "90 KM", price: "1,949", tag: "Strict 1949 Fixed Lock" },
                  { to: "Raipur Airport (RPR)", dist: "230 KM", price: "3,699", tag: "Flight Catch Special" },
                ].map((r, i) => (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center"><span className="text-[9px] bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">{r.tag}</span><span className="text-xs text-slate-400 font-bold">{r.dist}</span></div>
                      <h3 className="text-base font-black text-slate-900 mt-2.5">Korba ➔ {r.to}</h3>
                    </div>
                    <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between">
                      <div><span className="block text-[9px] font-bold text-slate-400 uppercase">Est Sedan Fare</span><span className="text-lg font-black text-slate-900">₹{r.price}</span></div>
                      <button onClick={() => triggerQuickBooking("Korba", r.to)} className="bg-slate-900 text-white text-xs font-black px-3.5 py-2 rounded-xl uppercase">Book Cab</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </main>

      {/* 👑 --- FIXED HIGH CTR DIGITAL BOARDING PASS MODAL --- 👑 */}
      <AnimatePresence>
        {showPopup && popupData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[999999] bg-slate-950/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 overflow-hidden">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="w-full max-w-4xl bg-transparent flex flex-col h-[94vh] md:h-auto md:max-h-[95vh] overflow-hidden">
              
              {/* Live Timer Strip (Fixed: Removed "Discount" terminology) */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-3 flex items-center justify-between text-xs font-black text-white rounded-t-3xl shrink-0 shadow-lg border-b border-slate-700">
                <div className="flex items-center gap-1.5">
                  <span className="animate-pulse">🟢</span>
                  <span>LOCKED FIXED RATE VALID FOR: <span className="font-mono bg-white text-slate-900 px-2 py-0.5 rounded ml-1 shadow-sm font-extrabold">{formatTimer(timeLeft)} MINS</span></span>
                </div>
                <button type="button" onClick={() => setShowPopup(false)} className="bg-white/10 hover:bg-white/20 text-white font-black px-3 py-1.5 rounded-xl transition-all border border-white/20 text-xs">✕ Close</button>
              </div>

              {/* Core Pass Body Layout */}
              <div className="flex-grow overflow-y-auto p-4 bg-slate-100 space-y-4 rounded-b-3xl">
                {popupData.fareOptions.map((option) => {
                  const isBest = cheapestFare === option.finalFare;
                  const vConfig = VEHICLES[option.vehicleType as keyof typeof VEHICLES];

                  return (
                    <div key={option.id} className="relative w-full bg-white rounded-2xl border border-slate-300/70 shadow-xl overflow-hidden flex flex-col">
                      
                      {/* Ticket Header Row */}
                      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-500 text-base">🎫</span>
                          <span className="text-xs font-black tracking-widest uppercase">OFFICIAL RIDE CONFIRMATION PASS</span>
                        </div>
                        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded text-[10px] font-black tracking-wider uppercase">
                          ✔ Driver Allocation Ready
                        </div>
                      </div>

                      {/* Main Boarding Split Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-3 items-stretch">
                        
                        {/* Box 1: Route Hub Details */}
                        <div className="p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 relative overflow-hidden group">
                          <div className="space-y-4 relative z-10">
                            <div>
                              <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase block">FROM START STATION</span>
                              <h4 className="text-lg font-black text-slate-900 mt-0.5">{popupData.pickup.split(",")[0]}</h4>
                              <p className="text-[11px] font-bold text-slate-500">CG Commercial Zone Network</p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-orange-500 my-1 font-black text-xs">
                              <span>⬇</span> <span className="tracking-widest font-mono border border-dashed border-orange-300 px-2 py-0.5 rounded bg-orange-50/50">DIRECT ONE WAY RUN</span>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase block">FINAL DESTINATION</span>
                              <h4 className="text-lg font-black text-slate-900 mt-0.5">{popupData.drop.split(",")[0]}</h4>
                              <p className="text-[11px] font-bold text-slate-500">Drop Terminal Verification Locked</p>
                            </div>
                          </div>

                          {/* Fluid Graphic Vehicle Canvas Display Section */}
                          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-3 relative z-10 bg-white/40 backdrop-blur-[2px] p-2 rounded-xl">
                            <div className="w-20 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                              <img src={option.vehicleImage} alt={option.vehicleLabel} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase block">Selected Fleet</span>
                              <span className="text-sm font-black text-slate-800">{option.vehicleLabel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Box 2: Schedule Parameters */}
                        <div className="p-5 flex flex-col justify-between space-y-4 border-b md:border-b-0 md:border-r border-slate-200/80">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] text-slate-400 font-black tracking-wider block">DEPARTURE DATE</span>
                              <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200 block mt-1 text-center">
                                {convertToIndianDate(popupData.pickupDate)}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-black tracking-wider block">DEPARTURE TIME</span>
                              <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200 block mt-1 text-center">
                                {formatTimeToAMPM(popupData.pickupTime)}
                              </span>
                            </div>
                          </div>

                          <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 text-left">
                            <span className="text-[9px] font-black tracking-widest text-slate-400 block uppercase">🚀 ESTIMATED REACH WINDOW</span>
                            <span className="text-xs font-black text-amber-400 mt-0.5 block tracking-wide">
                              {option.expectedReachTimeText}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs font-bold text-slate-600">
                            <div className="flex items-center gap-1.5 text-emerald-600 font-black">🟢 State Toll Taxes Fully Included</div>
                            <div className="flex items-center gap-1.5">🚘 Fleet Category: {option.vehicleLabel}</div>
                            <div className="flex items-center gap-1.5">       Included Cap: {option.billedDistance} KM Buffer</div>
                          </div>
                        </div>

                        {/* Box 3: Premium Invoicing Column (Fixed: Removed line-through and purana markup) */}
                        <div className="p-5 flex flex-col justify-between items-stretch bg-slate-50/70 text-left">
                          <div>
                            <span className="text-[9px] font-black tracking-widest text-slate-400 block uppercase">NET PAYABLE COST</span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-3xl font-black text-slate-900 tracking-tight">{option.fareText}</span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-black block mt-1.5 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50 text-center">🎉 No Hidden Booking Charges Later</span>
                          </div>

                          {/* Quick Micro Invoice Block */}
                          <div className="bg-white border border-dashed rounded-xl p-2.5 my-3 text-[11px] text-slate-500 font-bold space-y-1">
                            <div className="flex justify-between"><span>Base Rate ({option.billedDistance} KM)</span><span className="text-slate-800">{formatCurrency(option.baseFareWithoutAddons)}</span></div>
                            {option.stopManagementCharge > 0 && <div className="flex justify-between text-orange-600"><span>Loop Addon</span><span>+{formatCurrency(option.stopManagementCharge)}</span></div>}
                            <div className="flex justify-between border-t pt-1.5 font-black text-slate-900"><span>Net Cost</span><span>{option.fareText}</span></div>
                          </div>

                          <a href={getWhatsappUrl(option)} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-[#c2511b] hover:from-[#a34213] hover:to-orange-600 py-3.5 text-xs font-black text-white shadow-md uppercase tracking-wider transition-all transform active:scale-95 text-center">
                            ⚡ CONFIRM BOOKING ON WHATSAPP
                          </a>
                        </div>

                      </div>

                      {/* Ticket Footer */}
                      <div className="bg-slate-900 text-slate-400 px-4 py-2.5 text-center text-[10px] font-black tracking-wider uppercase border-t border-slate-200/20">
                        🛡️ Zero Advance Deposit Policy • Pay Direct To Operator After Drop Journey execution
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
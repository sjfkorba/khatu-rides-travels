// app/page.tsx
"use client";

import { useEffect, useState } from "react";
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

  const convertToIndianDate = (dateString: string) => {
    if (!dateString) return "26/05/2026";
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

  const triggerQuickBooking = (from: string, to: string) => {
    const mockDistance = to.toLowerCase().includes("airport") ? 230 : to.toLowerCase().includes("bilaspur") ? 90 : 215;
    const baseDate = new Date().toISOString().split("T")[0];
    const baseTime = "09:00";
    
    // Exact Calibration matched to your verified parameters
    let finalFareAmount = 3149; // Default Korba -> Raipur Real Multiplier
    let strikeFareAmount = 3600;

    if (from.toLowerCase().includes("korba") && to.toLowerCase().includes("bilaspur")) {
      finalFareAmount = 1999;
      strikeFareAmount = 2400;
    } else if (to.toLowerCase().includes("airport")) {
      finalFareAmount = 3499;
      strikeFareAmount = 4200;
    }

    const sampleOptions: FareOption[] = [
      {
        id: `oneway-sedan`,
        vehicleType: "sedan",
        vehicleLabel: "Sedan (Dzire/Etios)",
        vehicleImage: VEHICLES.sedan.image,
        baseFareWithoutAddons: mockDistance * 14,
        finalFare: finalFareAmount,
        strikeFare: strikeFareAmount, 
        fareText: formatCurrency(finalFareAmount),
        strikeText: formatCurrency(strikeFareAmount),
        pricingModeLabel: "One Way Economy Pricing",
        billedDistance: mockDistance <= 100 ? 135 : 260,
        calculatedDayHaltCharges: 0,
        calculatedNightCharges: 0,
        nightChargePercentageApplied: 0,
        expectedReachTimeText: "Estimated Fleet Corridor Window",
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

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-[100] transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
        <TopBar />
      </div>

      <main className="min-h-screen bg-slate-50 text-slate-800 antialiased overflow-x-hidden pt-16 relative">
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 pt-5 pb-8 border-b border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-[11px] font-black uppercase tracking-widest text-orange-400 backdrop-blur-sm">
                ⚡ CHHATTISGARH OFFICIAL PREMIER FLEET NETWORK
              </div>
              <h1 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-4xl">
                Premium One-Way Taxi Service{" "}
                <span className="block sm:inline bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                  With Transparent Fixed Fares
                </span>
              </h1>
              <div className="mt-6 w-full max-w-5xl">
                <div className="bg-white rounded-3xl p-1.5 md:p-2.5 border border-slate-200/80 shadow-2xl">
                  <FareCalculator 
                    onFareCalculated={(data) => {
                      setPopupData(data);
                      setShowPopup(true);
                    }} 
                  />
                </div>
              </div>
            </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {activeTab === "korba" && [
                { to: "Raipur City", dist: "215 KM", price: "3,149", strike: "3,600", tag: "Capital Corridor" },
                { to: "Bilaspur High Court", dist: "90 KM", price: "1,999", strike: "2,400", tag: "Strict Fixed Lock" },
                { to: "Raipur Airport (RPR)", dist: "230 KM", price: "3,499", strike: "4,200", tag: "Flight Catch Special" },
              ].map((r, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center"><span className="text-[9px] bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">{r.tag}</span><span className="text-xs text-slate-400 font-bold">{r.dist}</span></div>
                    <h3 className="text-base font-black text-slate-900 mt-2.5">Korba ➔ {r.to}</h3>
                  </div>
                  <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Est Sedan Fare</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-400 line-through font-bold"> must have item ₹{r.strike}</span>
                        <span className="text-lg font-black text-slate-900">₹{r.price}</span>
                      </div>
                    </div>
                    <button onClick={() => triggerQuickBooking("Korba", r.to)} className="bg-slate-900 text-white text-xs font-black px-3.5 py-2 rounded-xl uppercase">Book Cab</button>
                  </div>
                </div>
              ))}

              {activeTab === "bilaspur" && [
                { to: "Raipur City", dist: "115 KM", price: "1,999", strike: "2,400", tag: "Express Core" },
                { to: "Korba Industrial", dist: "90 KM", price: "1,999", strike: "2,400", tag: "Industrial Belt" },
                { to: "Sakti District Hub", dist: "112 KM", price: "2,299", strike: "2,650", tag: "Milestone Slab" },
              ].map((r, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center"><span className="text-[9px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">{r.tag}</span><span className="text-xs text-slate-400 font-bold">{r.dist}</span></div>
                    <h3 className="text-base font-black text-slate-900 mt-2.5">Bilaspur ➔ {r.to}</h3>
                  </div>
                  <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Est Sedan Fare</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-400 line-through font-bold">₹{r.strike}</span>
                        <span className="text-lg font-black text-slate-900">₹{r.price}</span>
                      </div>
                    </div>
                    <button onClick={() => triggerQuickBooking("Bilaspur", r.to)} className="bg-slate-900 text-white text-xs font-black px-3.5 py-2 rounded-xl uppercase">Book Cab</button>
                  </div>
                </div>
              ))}

              {activeTab === "raipur" && [
                { to: "Jagdalpur Bastar", dist: "295 KM", price: "4,799", strike: "5,400", tag: "Premium Long Route" },
                { to: "Rajnandgaon Town", dist: "72 KM", price: "1,899", strike: "2,200", tag: "Dry Point Corridor" },
                { to: "Korba Power Hub", dist: "215 KM", price: "3,149", strike: "3,600", tag: "Return Route Run" },
              ].map((r, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center"><span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">{r.tag}</span><span className="text-xs text-slate-400 font-bold">{r.dist}</span></div>
                    <h3 className="text-base font-black text-slate-900 mt-2.5">Raipur ➔ {r.to}</h3>
                  </div>
                  <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Est Sedan Fare</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-400 line-through font-bold">₹{r.strike}</span>
                        <span className="text-lg font-black text-slate-900">₹{r.price}</span>
                      </div>
                    </div>
                    <button onClick={() => triggerQuickBooking("Raipur", r.to)} className="bg-slate-900 text-white text-xs font-black px-3.5 py-2 rounded-xl uppercase">Book Cab</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* --- CONFIRMATION TICKET POPUP (MATCHES VERBATIM UI PRINCIPLES) --- */}
      <AnimatePresence>
        {showPopup && popupData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[999999] bg-slate-950/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 overflow-hidden">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="w-full max-w-4xl bg-transparent flex flex-col h-[94vh] md:h-auto md:max-h-[95vh] overflow-hidden">
              
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-3 flex items-center justify-between text-xs font-black text-white rounded-t-3xl shrink-0 shadow-lg border-b border-slate-700">
                <span className="tracking-wide uppercase">🎫 OFFICIAL FLEET BOOKING DISPATCH PASS</span>
                <button type="button" onClick={() => setShowPopup(false)} className="bg-white/10 hover:bg-white/20 text-white font-black px-3 py-1.5 rounded-xl text-xs">✕ Close</button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 bg-slate-100 space-y-4 rounded-b-3xl">
                {popupData.fareOptions.map((option) => {
                  return (
                    <div key={option.id} className="relative w-full bg-white rounded-2xl border border-slate-300/70 shadow-xl overflow-hidden flex flex-col">
                      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                        <span className="text-xs font-black tracking-widest uppercase">OFFICIAL RIDE SELECTION MATRIX</span>
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded text-[10px] font-black uppercase">✔ Driver Deployment Ready</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 items-stretch">
                        <div className="p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50">
                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] text-slate-400 font-black block">FROM START HUB</span>
                              <h4 className="text-lg font-black text-slate-900 mt-0.5">{popupData.pickup.split(",")[0]}</h4>
                            </div>
                            <div className="text-orange-500 font-black text-xs">⬇ DIRECT EXPRESS RUN</div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-black block">FINAL TERMINAL</span>
                              <h4 className="text-lg font-black text-slate-900 mt-0.5">{popupData.drop.split(",")[0]}</h4>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-3">
                            <div className="w-20 h-12 bg-slate-100 rounded-lg overflow-hidden border">
                              <img src={option.vehicleImage} alt={option.vehicleLabel} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm font-black text-slate-800">{option.vehicleLabel}</span>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col justify-between space-y-4 border-b md:border-b-0 md:border-r border-slate-200/80">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] text-slate-400 font-black block">DEPARTURE DATE</span>
                              <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-1 rounded block mt-1 text-center">{convertToIndianDate(popupData.pickupDate)}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-black block">DEPARTURE TIME</span>
                              <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-1 rounded block mt-1 text-center">{formatTimeToAMPM(popupData.pickupTime)}</span>
                            </div>
                          </div>
                          <div className="space-y-1.5 text-xs font-bold text-slate-600">
                            <div className="text-emerald-600 font-black">🟢 Toll Taxes Fully Included</div>
                            <div>Buffer Allocation: Upto {option.billedDistance} KM Included</div>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col justify-between items-stretch bg-slate-50/70 text-left">
                          <div>
                            <span className="text-[9px] font-black text-slate-400 block uppercase">NET PAYABLE FARE</span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-xs font-bold text-slate-400 line-through tracking-tight">{option.strikeText}</span>
                              <span className="text-3xl font-black text-slate-900 tracking-tight">{option.fareText}</span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-black block mt-1 bg-emerald-50 px-2 py-0.5 rounded text-center">🎉 No Hidden Surge Charges Later</span>
                          </div>

                          <div className="bg-white border border-dashed rounded-xl p-2.5 my-3 text-[11px] text-slate-500 font-bold space-y-1">
                            <div className="flex justify-between"><span>Base Route Fee</span><span>{option.strikeText}</span></div>
                            <div className="flex justify-between border-t pt-1.5 font-black text-slate-900"><span>Net Payable Cost</span><span>{option.fareText}</span></div>
                          </div>

                          <a 
                            href={getWhatsappUrl(option)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-[#c2511b] py-3.5 text-xs font-black text-white uppercase tracking-wider text-center shadow transform transition-transform active:scale-[0.98]"
                          >
                            ⚡ CONFIRM BOOKING ON WHATSAPP
                          </a>
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
    </>
  );
}
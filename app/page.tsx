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
  strikeFare: number;
  fareText: string;
  strikeText: string;
  billedDistance: number;
  discountPercent: number;
  durationMinutes: number;
};

type PopupData = {
  fareOptions: FareOption[];
  pickup: string;
  drop: string;
  bookingType: BookingType;
  pickupDate: string;
  pickupTime: string;
  customerName: string;
  customerMobile: string;
};

export default function HomePage() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState<"korba" | "bilaspur" | "raipur">("korba");
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);

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
    
    // 👑 Perfect Aligned High-Conversion WhatsApp Format Template
    const textMessage =
      `✨ *Booking Enquiry* ✨\n\n` +
      `🔄 *Trip Type* - ${tripLabel}\n` +
      `🚖 *Vehicle Type* - ${option.vehicleLabel}\n\n` +
      `📍 *Pick-up Location* - ${popupData?.pickup}\n` +
      `📅 *Pickup Date & Time* - ${convertToIndianDate(popupData?.pickupDate || "")} | ${formatTimeToAMPM(popupData?.pickupTime || "")}\n` +
      `🏁 *Drop Location* - ${popupData?.drop}\n` +
      `⏱️ *Estimated Reach Date & Time* - ${reach.date} | ${reach.time}\n\n` +
      `💰 *Estimated Fare* - *${option.fareText}* (Toll Taxes Fully Included)\n\n` +
      `👤 *Customer Name* - ${popupData?.customerName}\n` +
      `📞 *Customer Contact* - +91 ${popupData?.customerMobile}\n\n` +
      `📡 *Source* - Khatu Rides Travels Co.\n\n` +
      `Please arrange concerned type of cab for my journey. 🙏`;

    return `https://wa.me/919244137353?text=${encodeURIComponent(textMessage)}`;
  };

  const triggerQuickBooking = (from: string, to: string) => {
    const inputName = prompt("👤 Enter Passenger Full Name:");
    if (!inputName) return;
    const inputMobile = prompt("📱 Enter 10-Digit Mobile Number:");
    if (!inputMobile || inputMobile.length < 10) { alert("Invalid Mobile Number Entry"); return; }

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
        strikeFare: coreCalc.strikeFare,
        fareText: `₹${coreCalc.finalFare.toLocaleString("en-IN")}`,
        strikeText: `₹${coreCalc.strikeFare.toLocaleString("en-IN")}`,
        billedDistance: coreCalc.billedDistance,
        discountPercent: coreCalc.discountPercent,
        durationMinutes: coreCalc.durationMinutes
      };
    });

    setPopupData({
      fareOptions: dynamicOptions, pickup: from, drop: to, bookingType: "oneway", pickupDate: baseDate, pickupTime: baseTime, customerName: inputName, customerMobile: inputMobile
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

      <main className="min-h-screen bg-slate-50 antialiased pt-16 relative">
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
                <div className="bg-white rounded-3xl p-2.5 border border-slate-200/80 shadow-2xl">
                  <FareCalculator onFareCalculated={(data) => { setPopupData(data); setShowPopup(true); }} />
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
                        <span className="text-xs text-slate-400 line-through font-bold">₹{r.strike}</span>
                        <span className="text-lg font-black text-slate-900">₹{r.price}</span>
                      </div>
                    </div>
                    <button onClick={() => triggerQuickBooking("Korba, Chhattisgarh", r.to)} className="bg-slate-900 text-white text-xs font-black px-3.5 py-2 rounded-xl uppercase">Book Cab</button>
                  </div>
                </div>
              ))}

              {activeTab === "bilaspur" && [
                { to: "Raipur City", dist: "115 KM", price: "1,999", strike: "2,400", tag: "Express Core" },
                { to: "Korba Industrial", dist: "90 KM", price: "1,999", strike: "2,400", tag: "Industrial Belt" },
                { to: "Ambikapur Hub", dist: "220 KM", price: "3,899", strike: "4,125", tag: "North Region Route" },
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
                    <button onClick={() => triggerQuickBooking("Bilaspur, Chhattisgarh", r.to)} className="bg-slate-900 text-white text-xs font-black px-3.5 py-2 rounded-xl uppercase">Book Cab</button>
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
                    <button onClick={() => triggerQuickBooking("Raipur, Chhattisgarh", r.to)} className="bg-slate-900 text-white text-xs font-black px-3.5 py-2 rounded-xl uppercase">Book Cab</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

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
                  <div>👤 <span className="text-slate-900 font-extrabold">Passenger:</span> {popupData.customerName} (+91 {popupData.customerMobile})</div>
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
                            <span className="text-[10px] text-slate-400 line-through font-bold">{option.strikeText}</span>
                            <span className="text-lg font-black text-slate-900">{option.fareText}</span>
                          </div>
                          <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">🟢 Toll Included</span>
                        </div>
                        <a 
                          href={getWhatsappUrl(option)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-gradient-to-r from-orange-600 to-[#c2511b] text-white text-[11px] font-black px-4 py-2.5 rounded-xl uppercase tracking-wider shadow"
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
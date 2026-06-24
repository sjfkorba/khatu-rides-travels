"use client";

import { useEffect, useState } from "react";
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

  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

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

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
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
      `🛡️ Distance: ${option.billedDistance} KM Included\n` +
      `⏱️ Expected Arrival: ${option.expectedReachTimeText}\n` +
      `💰 NET Payable Fare: ${option.fareText} (Toll Included)\n\n` +
      `Please lock driver assignment right away.`;
    return `https://wa.me/919244137353?text=${encodeURIComponent(textMessage)}`;
  };

  const cheapestFare = popupData?.fareOptions.length 
    ? Math.min(...popupData.fareOptions.map((i) => i.finalFare)) 
    : null;

  return (
    <>
      {/* Animated Sticky Top Header */}
      <div className={`fixed top-0 left-0 w-full z-[100] transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
        <TopBar />
      </div>

      <main className="min-h-screen bg-slate-50 text-slate-800 antialiased overflow-x-hidden pt-16 relative">
        
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 pt-3 pb-6 lg:pt-6 lg:pb-10 border-b border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[250px] w-[750px] bg-gradient-to-b from-indigo-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              
              <div className="inline-flex items-center gap-1 rounded-full border border-orange-500/40 bg-gradient-to-r from-orange-600 to-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
                ✨ One Way Taxi Partner
              </div>

              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-extrabold text-orange-400/90 tracking-widest uppercase">
                <span>Luxury</span>
                <span className="text-slate-700">•</span>
                <span>Reliability</span>
                <span className="text-slate-700">•</span>
                <span>Excellence</span>
              </div>

              <h1 className="mt-1.5 text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Book Safe & Reliable Cabs{" "}
                <span className="block sm:inline bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Across Chhattisgarh
                </span>
              </h1>

              <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-slate-300/80 font-normal hidden sm:block">
                Premium intercity travel with absolute billing transparency. Instantly calculated live fares with standard highway tolls included upfront.
              </p>

              {/* CALCULATOR CONTAINER FRAME */}
              <div className="mt-4 w-full max-w-5xl transition-all duration-300 drop-shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
                <div className="bg-white rounded-2xl md:rounded-3xl p-1 md:p-2 border border-slate-200 shadow-2xl relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-200 rounded-full md:hidden mt-1" />
                  <div className="pt-2 md:pt-0">
                    <FareCalculator 
                      onFareCalculated={(data) => {
                        setPopupData(data);
                        setTimeLeft(300);
                        setShowPopup(true);
                      }} 
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- PREMIUM SERVICE ADVANTAGES --- */}
        <section className="py-12 md:py-16 bg-white relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shadow-inner">🛡️</div>
                <h3 className="text-base font-bold text-slate-900 mt-3">Safe Verified Network</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Every operator in our 35+ member state collective undergoes continuous background tracking.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl shadow-inner">🧾</div>
                <h3 className="text-base font-bold text-slate-900 mt-3">Transparent Fixed Billing</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Fares calculated using the Khatu Rides algorithm are all-inclusive, handling regular tolls upfront.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shadow-inner">🚘</div>
                <h3 className="text-base font-bold text-slate-900 mt-3">Top Fleet Choices</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Select between fuel-efficient Dzire models or heavily spacious premium MPVs like Ertiga and Innova.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- TRAVEL HUBS --- */}
        <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-200 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Our Core Travel Hubs & Cities
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { name: "Raipur", desc: "Capital Transfers & Airport Pickups" },
                { name: "Korba", desc: "Industrial Hub Intercity Travel" },
                { name: "Bilaspur", desc: "High Court & Station Connections" },
                { name: "Raigarh", desc: "Corporate Enterprise Car Rental" },
                { name: "Durg - Bhilai", desc: "Twin City Fast Highway Commutes" },
                { name: "Jagdalpur", desc: "Bastar Heritage & Leisure Tours" },
                { name: "Jharsuguda", desc: "Inter-State Border Connect Deals" },
                { name: "All CG Routes", desc: "35+ Active Fleet Group Coverage" }
              ].map((city, idx) => (
                <div key={idx} className="rounded-xl bg-white border border-slate-200 p-3 sm:p-5 hover:border-indigo-500 hover:shadow-md transition-all group cursor-default">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 sm:px-2 py-0.5 rounded border border-slate-200">HUB 0{idx+1}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-2 sm:mt-3 group-hover:text-indigo-600 transition-colors">{city.name}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1 leading-normal font-medium">{city.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- HIGHWAY SEO CONTENT --- */}
        <section className="py-12 md:py-16 bg-white border-t border-slate-200 mb-12 relative">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none mb-10 md:mb-14">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 text-center mb-4">
                Why Khatu Rides is Chhattisgarh's Preferred Taxi Service
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-center">
                When it comes to booking a taxi service in Raipur, Bilaspur, or Korba, reliability and fair pricing are critical. Khatu Rides was created to bridge the gap between regional travelers and verified local fleet networks. By coordinating an expert group of 35+ professional taxi operators across Chhattisgarh, we bring you structural support, real-time computerized outstation fare quotes, and comfortable long-distance travel without typical highway booking hassles.
              </p>
            </div>
          </div>
        </section>

        {/* --- MOBILE FIXED FLOATING BUTTONS --- */}
        <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 md:hidden">
          <a href="tel:+919244137353" className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl shadow-lg border border-blue-400">
            <span>📞</span>
          </a>
          <a href="https://wa.me/919244137353" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-lg border border-emerald-400">
            <span>💬</span>
          </a>
        </div>

      </main>

      {/* --- GLOBAL PORTAL MODAL LAYER --- */}
      {showPopup && popupData && (
        <div className="fixed inset-0 w-screen h-screen z-[999999] bg-slate-950/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden">
          <div className="w-full max-w-5xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col h-[92vh] md:h-auto md:max-h-[90vh] border border-slate-100 overflow-hidden animate-slide-up">
            
            {/* Top Fixed Notification Header */}
            <div className="bg-amber-50 border-b border-amber-100 px-5 py-4 flex items-center justify-between text-xs md:text-sm font-black text-amber-900 shrink-0 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base">⚡</span>
                <span>Special Fleet Rate Locked! Valid for: <span className="font-mono text-rose-600 bg-white px-2.5 py-0.5 rounded border border-rose-200 shadow-sm ml-1 text-sm">{formatTimer(timeLeft)}</span></span>
              </div>
              <button type="button" onClick={() => setShowPopup(false)} className="text-slate-700 hover:text-slate-900 font-extrabold bg-white border border-slate-300 px-4 py-2 rounded-xl shadow-sm transition-all text-xs md:text-sm">✕ Close Window</button>
            </div>

            {/* Scrollable Body Container */}
            <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-5 bg-slate-50/70 -webkit-overflow-scrolling-touch">
              {popupData.fareOptions.map((option) => {
                const isBest = cheapestFare === option.finalFare;
                const vConfig = VEHICLES[option.vehicleType as keyof typeof VEHICLES];

                return (
                  <div key={option.id} className={`bg-white border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-6 items-stretch relative transition-all ${isBest ? "border-orange-500 shadow-lg ring-2 ring-orange-500/20" : "border-slate-200 shadow-sm"}`} //[cite: 2]
                  >
                    
                    {/* Left Vehicle Detail Profile Column */}
                    <div className="w-full md:w-1/4 flex md:flex-col items-center justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-5 gap-3 shrink-0">
                      <div className="text-left md:text-center">
                        <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight tracking-tight">{option.vehicleLabel}</h3>
                        <span className="mt-1.5 inline-block bg-gradient-to-r from-slate-900 to-slate-800 text-white text-[10px] font-black px-3 py-0.5 rounded-md uppercase tracking-wider shadow-sm">👑 Premium State Fleet</span>
                      </div>
                      
                      {/* --- FIXED: MOUNTED COMPLETE FLUID BOX SCALE TO PREVENT IMAGE SQUEEZING --- */}
                      <div className="bg-slate-50 rounded-xl w-24 h-16 md:w-full md:h-28 flex justify-center items-center border border-slate-200/60 shadow-inner overflow-hidden relative">
                        <img 
                          src={option.vehicleImage} 
                          alt={option.vehicleLabel} 
                          className="w-full h-full object-cover filter drop-shadow-md" /* object-cover utilizes 100% boundary canvas flawlessly without cutting edge curves */
                        />
                      </div>
                    </div>

                    {/* Center Metadata Spec Info Column */}
                    <div className="flex-1 flex flex-col justify-between gap-4 py-0.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 text-xs md:text-sm font-bold text-slate-600 text-left">
                        <div className="flex items-center gap-2">📅 <span className="text-slate-900 font-extrabold">Date: {popupData.pickupDate}</span></div>
                        <div className="text-emerald-600 flex items-center gap-1 font-extrabold">🟢 Toll Taxes Fully Included</div>
                        <div className="flex items-center gap-2">🕒 <span className="text-slate-900 font-extrabold">Time: {popupData.pickupTime} Hrs Departure</span></div>
                        <div className="text-slate-800 flex items-center gap-1 font-extrabold">👤 Verified Professional Driver</div>
                        
                        {popupData.bookingType !== "local" && (
                          <div className="col-span-1 sm:col-span-2 bg-slate-900 text-white rounded-xl px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between border border-slate-800 shadow-md gap-1.5">
                            <span className="text-slate-400 font-black tracking-wider text-[10px] md:text-xs">⏱️ ESTIMATED REACH WINDOW:</span>
                            <span className="font-black text-amber-400 bg-white/10 px-2.5 py-1 rounded text-xs md:text-sm tracking-wide shadow-inner text-center">{option.expectedReachTimeText}</span>
                          </div>
                        )}

                        <div className="col-span-1 sm:col-span-2 flex items-start gap-1.5 bg-slate-100 border border-slate-200 p-3 rounded-xl text-slate-700 text-xs leading-relaxed font-black shadow-inner">
                          <span className="text-orange-500 text-sm">📍</span>
                          <span>Route Map: {popupData.pickup.split(",")[0]} {popupData.stopsListText && `➔ ${popupData.stopsListText}`} ➔ {popupData.drop.split(",")[0]}</span>
                        </div>
                      </div>

                      {/* Explicit Mileage Cap Pill Badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] md:text-xs font-black px-3 py-1 rounded-lg shadow-sm">🛞 Included Route Cap: {option.billedDistance} KM</span>
                        <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[10px] md:text-xs font-black px-3 py-1 rounded-lg shadow-sm">💸 Overextension Rate: {vConfig?.extraPerKm || 14}₹/KM</span>
                        {popupData.bookingType === "roundtrip" && (
                          <span className="bg-orange-50 border border-orange-200 text-orange-800 text-[10px] md:text-xs font-black px-3 py-1 rounded-lg shadow-sm">⏳ {popupData.tripDays} Days Tour Scope</span>
                        )}
                      </div>
                    </div>

                    {/* Right Invoicing Sheet Column */}
                    <div className="w-full md:w-1/3 flex flex-col justify-between items-stretch md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-5 shrink-0">
                      <div className="text-left md:text-right w-full">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">NET PAYABLE TOTAL FARE</div>
                        <div className="flex items-baseline md:justify-end gap-2 mt-0.5">
                          <span className="text-slate-400 text-sm line-through font-extrabold">{option.strikeText}</span>
                          <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{option.fareText}</span>
                        </div>
                      </div>

                      {/* Detailed Invoice Breakdown Box */}
                      <div className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3 my-2.5 text-xs font-bold text-slate-500 space-y-2 shadow-inner text-left">
                        <div className="flex justify-between">
                          <span>Route Base Fare ({option.billedDistance} KM)</span>
                          <span className="text-slate-800 font-black">{formatCurrency(option.baseFareWithoutAddons)}</span>
                        </div>
                        {option.stopManagementCharge > 0 && (
                          <div className="flex justify-between text-[#c2511b] bg-orange-50/40 px-2 py-0.5 rounded border border-dashed border-orange-200">
                            <span>Multi-city loop stops addon</span>
                            <span>+{formatCurrency(option.stopManagementCharge)}</span>
                          </div>
                        )}
                        {popupData.bookingType === "oneway" && option.calculatedNightCharges > 0 && (
                          <div className="flex justify-between text-indigo-700 bg-indigo-50/50 px-2 py-0.5 rounded border border-dashed border-indigo-200">
                            <span>Night Journey Premium (+10%)</span>
                            <span>+{formatCurrency(option.calculatedNightCharges)}</span>
                          </div>
                        )}
                        {popupData.bookingType === "roundtrip" && (
                          <div className="bg-orange-50/20 border border-dashed border-orange-200 p-2 rounded-lg space-y-1 text-[11px]">
                            <div className="flex justify-between text-slate-600"><span>Driver Outstation Halt ({popupData.tripDays} Days)</span><span>+{formatCurrency(option.calculatedDayHaltCharges)}</span></div>
                            <div className="flex justify-between text-indigo-600"><span>Night Stay Allowance ({popupData.tripDays} Nights)</span><span>+{formatCurrency(option.calculatedNightCharges)}</span></div>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-slate-900 text-xs md:text-sm">
                          <span>Net Payable Cost</span>
                          <span className="text-[#c2511b] text-base md:text-lg">{option.fareText}</span>
                        </div>
                      </div>

                      {/* CTA Action Button */}
                      <div className="w-full">
                        <a href={getWhatsappUrl(option)} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#c2511b] hover:bg-[#a34213] px-4 py-3.5 text-xs md:text-sm font-black uppercase tracking-wider text-white shadow-md active:scale-95 transition-all">
                          <span>⚡ LOCK BRANDED FLEET INSTANTLY</span>
                        </a>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom Safe Badge Footer */}
            <div className="bg-slate-950 text-slate-400 px-5 py-3.5 border-t border-slate-800 text-center text-xs font-black flex flex-wrap gap-2.5 justify-center items-center shrink-0">
              <span className="text-amber-400">🛡️ Safe Branded Network Shield:</span>
              <span>Zero Booking Advance Needed</span>
              <span className="text-slate-700">•</span>
              <span>Pay directly to driver post drop execution</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
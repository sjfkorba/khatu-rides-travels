// components/FareCalculator.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { calculateFare, VEHICLES, type VehicleType, type BookingType, type ServiceType } from "../lib/fareCalculator";

interface FareCalculatorProps {
  onFareCalculated: (data: {
    fareOptions: any[];
    pickup: string;
    drop: string;
    bookingType: BookingType;
    serviceType: ServiceType;
    pickupDate: string;
    pickupTime: string;
    returnDate?: string;
    returnTime?: string;
  }) => void;
}

export default function FareCalculator({ onFareCalculated }: FareCalculatorProps) {
  const [serviceType, setMainServiceType] = useState<"outstation" | "local">("outstation");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  
  // 👑 RETURN FIELDS SYNCHRONIZATION
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  
  const [loading, setLoading] = useState(false);

  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");

  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropList, setShowDropList] = useState(false);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    setMinDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`);
    setMinTime(`${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`);
  }, []);

  const fetchLiveSuggestions = async (input: string, type: "pickup" | "drop") => {
    if (input.trim().length < 3) return;
    try {
      const response = await fetch(`/api/places-autocomplete?input=${encodeURIComponent(input)}`);
      const data = await response.json();
      if (data && data.predictions) {
        const results = data.predictions.map((p: any) => p.description);
        if (type === "pickup") { setPickupSuggestions(results); setShowPickupList(true); }
        else { setDropSuggestions(results); setShowDropList(true); }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) setShowPickupList(false);
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) setShowDropList(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSwap = () => {
    const temporaryStorage = pickup;
    setPickup(drop);
    setDrop(temporaryStorage);
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || (serviceType !== "local" && !drop.trim()) || !pickupDate || !pickupTime) {
      alert("⚠️ Error: All fields are mandatory!");
      return;
    }
    if (bookingType === "roundtrip" && (!returnDate || !returnTime)) {
      alert("⚠️ Error: Return Date and Return Time are compulsory for Round Trip bookings!");
      return;
    }

    setLoading(true);
    let mappedDistance = serviceType === "local" ? 80 : 150;

    if (serviceType !== "local") {
      try {
        const response = await fetch("/api/distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origin: pickup, destination: drop }),
        });
        const routeData = await response.json();
        if (response.ok && routeData.distanceKm) {
          mappedDistance = routeData.distanceKm;
        }
      } catch (err) {
        console.error(err);
      }
    }

   const options = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
  // 👑 FIXED: Removed pickupLocation & dropLocation to perfectly match backend schema rules
  const res = calculateFare({
    distance: mappedDistance,
    vehicleType: type,
    bookingType,
    serviceType,
    pickupDate,
    pickupTime,
    returnDate: bookingType === "roundtrip" ? returnDate : undefined,
    returnTime: bookingType === "roundtrip" ? returnTime : undefined,
  });

  return {
    id: `${bookingType}-${type}-${Date.now()}`,
    vehicleType: type,
    vehicleLabel: VEHICLES[type].label,
    vehicleImage: VEHICLES[type].image,
    finalFare: res.finalFare,
    strikeFare: res.strikeFare,
    fareText: `₹${res.finalFare.toLocaleString("en-IN")}`,
    billedDistance: res.billedDistance,
    durationMinutes: res.durationMinutes
  };
});

    onFareCalculated({
      fareOptions: options, 
      pickup, 
      drop: serviceType === "local" ? "Local Full Day Run" : drop, 
      bookingType, 
      serviceType,
      pickupDate, 
      pickupTime,
      returnDate: bookingType === "roundtrip" ? returnDate : undefined,
      returnTime: bookingType === "roundtrip" ? returnTime : undefined
    });
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Tab Switchers Block */}
      <div className="flex bg-slate-950/95 backdrop-blur border border-slate-800 rounded-t-2xl px-2 py-1.5 shadow-lg z-10">
        <button
          type="button"
          onClick={() => { setMainServiceType("outstation"); setBookingType("oneway"); }}
          className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            serviceType === "outstation" && bookingType === "oneway" ? "bg-orange-600 text-white shadow-md shadow-orange-600/30" : "text-slate-400 hover:text-white"
          }`}
        >
          One Way
        </button>
        <button
          type="button"
          onClick={() => { setMainServiceType("outstation"); setBookingType("roundtrip"); }}
          className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            serviceType === "outstation" && bookingType === "roundtrip" ? "bg-orange-600 text-white shadow-md shadow-orange-600/30" : "text-slate-400 hover:text-white"
          }`}
        >
          Round Trip
        </button>
        <button
          type="button"
          onClick={() => { setMainServiceType("local"); setBookingType("oneway"); }}
          className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            serviceType === "local" ? "bg-orange-600 text-white shadow-md shadow-orange-600/30" : "text-slate-400 hover:text-white"
          }`}
        >
          Local Package
        </button>
      </div>

      {/* Main Form Sheet Block */}
      <form 
        onSubmit={handleCalculate} 
        className="w-full bg-white/95 backdrop-blur-md rounded-3xl md:rounded-[2.5rem] border-2 border-orange-500 p-5 md:p-8 text-left font-sans -mt-0.5 relative z-20 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
      >
        {/* 👑 FIXED: Adaptive structural grid dimensions supporting returnTime updates seamlessly */}
        <div className={`grid grid-cols-1 gap-4 items-center w-full ${
          serviceType === "outstation" && bookingType === "roundtrip" 
            ? "lg:grid-cols-[1.2fr_auto_1.2fr_1fr_1fr_1fr_1fr]" 
            : serviceType === "local" 
              ? "lg:grid-cols-[2fr_1fr_1fr]" 
              : "lg:grid-cols-[1.5fr_auto_1.5fr_1fr_1fr]"
        }`}>
          
          {/* FIELD 1: PICKUP */}
          <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-sm transition-all w-full" ref={pickupRef}>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">
              {serviceType === "local" ? "City Location" : "From"}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-sm">📍</span>
              <input required type="text" placeholder="Type pickup city..." value={pickup} onChange={(e) => { setPickup(e.target.value); fetchLiveSuggestions(e.target.value, "pickup"); }} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none placeholder:text-slate-300" />
            </div>
            {showPickupList && pickupSuggestions.length > 0 && (
              <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-3 shadow-2xl max-h-48 overflow-y-auto z-[999999] divide-y divide-slate-100">
                {pickupSuggestions.map((item, idx) => (
                  <li key={idx} onClick={() => { setPickup(item); setShowPickupList(false); }} className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors">🚗 {item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* SWAP ICON */}
          {serviceType !== "local" && (
            <div className="flex justify-center items-center h-full hidden lg:flex">
              <button type="button" onClick={handleLocationSwap} className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 shadow-sm flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white transition-all font-black">⇄</button>
            </div>
          )}

          {/* FIELD 2: DROP */}
          {serviceType !== "local" && (
            <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-sm transition-all w-full" ref={dropRef}>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">To</label>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-sm">🏁</span>
                <input required type="text" placeholder="Type drop point..." value={drop} onChange={(e) => { setDrop(e.target.value); fetchLiveSuggestions(e.target.value, "drop"); }} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none placeholder:text-slate-300" />
              </div>
              {showDropList && dropSuggestions.length > 0 && (
                <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-3 shadow-2xl max-h-48 overflow-y-auto z-[999999] divide-y divide-slate-100">
                  {dropSuggestions.map((item, idx) => (
                    <li key={idx} onClick={() => { setDrop(item); setShowDropList(false); }} className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors">🏁 {item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* FIELD 3: PICKUP DATE */}
          <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-sm transition-all w-full">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Pick Up Date</label>
            <input required type="date" min={minDate} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer text-left" />
          </div>

          {/* FIELD 4: PICKUP TIME */}
          <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-sm transition-all w-full">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Pick Up Time</label>
            <input required type="time" min={pickupDate === minDate ? minTime : undefined} value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer text-left" />
          </div>

          {/* FIELD 5: RETURN DATE (ROUND TRIP ONLY) */}
          {serviceType === "outstation" && bookingType === "roundtrip" && (
            <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-sm transition-all w-full">
              <label className="block text-[10px] font-black text-orange-600 uppercase tracking-wider mb-0.5">Return Date</label>
              <input required type="date" min={pickupDate || minDate} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer text-left" />
            </div>
          )}

          {/* FIELD 6: 👑 RETURN TIME (ROUND TRIP ONLY) */}
          {serviceType === "outstation" && bookingType === "roundtrip" && (
            <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-sm transition-all w-full">
              <label className="block text-[10px] font-black text-orange-600 uppercase tracking-wider mb-0.5">Return Time</label>
              <input required type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer text-left" />
            </div>
          )}
          
        </div>

        {/* Action Button */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full max-w-md bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:brightness-105 active:scale-[0.99] transition-all text-white text-sm font-black uppercase tracking-widest py-4 px-8 rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 min-h-[54px]"
          >
            {loading ? "🔄 Scanning Fleet Hubs..." : "EXPLORE CABS"}
          </button>
        </div>

        {/* Trust Badges Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-200/60 text-center max-w-3xl mx-auto">
          <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-all shadow-xs">
            <span className="text-3xl md:text-4xl animate-bounce duration-1000">🛡️</span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider mt-2">Verified Drivers</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">100% Background Screened</p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-all shadow-xs">
            <span className="text-3xl md:text-4xl">💎</span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider mt-2">Transparent Fares</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Fixed Toll Included Logic</p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-all shadow-xs">
            <span className="text-3xl md:text-4xl">⏱️</span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider mt-2">24x7 Support Desk</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Instant Manual Allocations</p>
          </div>
        </div>

      </form>
    </div>
  );
}
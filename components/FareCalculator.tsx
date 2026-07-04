// components/FareCalculator.tsx
"use50% uicly";
"use client";

import React, { useState, useEffect, useRef } from "react";
import { calculateFare, VEHICLES, type VehicleType, type BookingType } from "../lib/fareCalculator";

interface FareCalculatorProps {
  onFareCalculated: (data: {
    fareOptions: any[];
    pickup: string;
    drop: string;
    bookingType: BookingType;
    pickupDate: string;
    pickupTime: string;
  }) => void;
}

type MainServiceType = "outstation" | "local" | "airport";

export default function FareCalculator({ onFareCalculated }: FareCalculatorProps) {
  // 👑 Savaari-Inspired Service Tabs
  const [serviceType, setMainServiceType] = useState<MainServiceType>("outstation");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
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
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickup.trim() || !drop.trim() || !pickupDate || !pickupTime) {
      alert("⚠️ Error: All fields are mandatory!");
      return;
    }

    const currentDateTime = new Date();
    const selectedDateTime = new Date(`${pickupDate}T${pickupTime}`);
    if (selectedDateTime <= currentDateTime) {
      alert("⚠️ Timeline Invalid: Past bookings cannot be processed.");
      return;
    }

    setLoading(true);
    let mappedDistance = 150;

    // 🚀 1. Fetch Dynamic Distance via Google Matrix API
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
      console.error("Distance API Error, using default 150KM:", err);
    }

    // 🚀 2. FIXED: Local pricing engine loop configuration (No broken API calls)
    const options = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
      const coreCalc = calculateFare({
        distance: mappedDistance,
        vehicleType: type,
        bookingType,
        pickupLocation: pickup,
        dropLocation: drop,
      });

      return {
        id: `${bookingType}-${type}`,
        vehicleType: type,
        vehicleLabel: VEHICLES[type].label,
        vehicleImage: VEHICLES[type].image,
        finalFare: coreCalc.finalFare,
        fareText: `₹${coreCalc.finalFare.toLocaleString("en-IN")}`,
        billedDistance: coreCalc.billedDistance,
        durationMinutes: coreCalc.durationMinutes
      };
    });

    // 🚀 3. Trigger parent state component to show popup safely
    onFareCalculated({
      fareOptions: options,
      pickup,
      drop,
      bookingType,
      pickupDate,
      pickupTime
    });

    setLoading(false);
  };

  return (
    <form onSubmit={handleCalculate} className="w-full bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden text-left font-sans">
      
      {/* 👑 LAYER 1: SAVAARI-INSPIRED PREMIER CORE SERVICE TABS */}
      <div className="grid grid-cols-3 bg-slate-900 text-slate-400 text-xs font-black uppercase tracking-wider text-center shrink-0 border-b border-slate-800">
        {(["outstation", "local", "airport"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setMainServiceType(type)}
            className={`py-4 transition-all relative ${serviceType === type ? "bg-white text-slate-950 font-extrabold" : "hover:text-white hover:bg-slate-800/5"}`}
          >
            {type}
            {serviceType === type && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-orange-600" />
            )}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-6 space-y-5">
        
        {/* 👑 LAYER 2: PILLED DIRECTIONAL TOGGLE SWITCH (ONE WAY vs ROUND TRIP) */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-fit border border-slate-200/50">
          <button type="button" onClick={() => setBookingType("oneway")} className={`flex-1 sm:flex-none px-6 py-2 text-[11px] font-black rounded-lg uppercase tracking-wider transition-all ${bookingType === "oneway" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
            One Way
          </button>
          <button type="button" onClick={() => setBookingType("roundtrip")} className={`px-4 py-2 text-[11px] font-black rounded-lg uppercase tracking-wider transition-all ${bookingType === "roundtrip" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>
            Round Trip
          </button>
        </div>

        {/* 👑 LAYER 3: INNER GEOLOCATION INPUT FIELDS MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          
          {/* Pickup Node block */}
          <div className="relative bg-slate-50 border border-slate-200/80 rounded-2xl p-3 focus-within:bg-white focus-within:border-orange-500 transition-all" ref={pickupRef}>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">📍 Live Pick-Up Location</label>
            <input required type="text" placeholder="Type pickup city or hub location..." value={pickup} onChange={(e) => { setPickup(e.target.value); fetchLiveSuggestions(e.target.value, "pickup"); }} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none placeholder:text-slate-300" />
            {showPickupList && pickupSuggestions.length > 0 && (
              <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-3 shadow-2xl max-h-48 overflow-y-auto z-[999999] divide-y divide-slate-100">
                {pickupSuggestions.map((item, idx) => (
                  <li key={idx} onClick={() => { setPickup(item); setShowPickupList(false); }} className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors">🚗 {item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Dynamic Floating Inversion Toggle Button Circle */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <button type="button" onClick={handleLocationSwap} className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-500 hover:text-orange-600 active:scale-95 transition-transform font-black">
              ⇅
            </button>
          </div>

          {/* Drop Node block */}
          <div className="relative bg-slate-50 border border-slate-200/80 rounded-2xl p-3 focus-within:bg-white focus-within:border-orange-500 transition-all" ref={dropRef}>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">🏁 Live Drop Destination</label>
            <input required type="text" placeholder="Type drop city or destination..." value={drop} onChange={(e) => { setDrop(e.target.value); fetchLiveSuggestions(e.target.value, "drop"); }} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none placeholder:text-slate-300" />
            {showDropList && dropSuggestions.length > 0 && (
              <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-3 shadow-2xl max-h-48 overflow-y-auto z-[999999] divide-y divide-slate-100">
                {dropSuggestions.map((item, idx) => (
                  <li key={idx} onClick={() => { setDrop(item); setShowDropList(false); }} className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors">🏁 {item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 👑 LAYER 4: TIMELINE SCHEDULING INTERFACES BLOCK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 focus-within:bg-white focus-within:border-orange-500 transition-all">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">📅 Journey Start Date</label>
            <input required type="date" min={minDate} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer" />
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 focus-within:bg-white focus-within:border-orange-500 transition-all">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">⏱️ Pickup Departure Time</label>
            <input required type="time" min={pickupDate === minDate ? minTime : undefined} value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer" />
          </div>
        </div>

        {/* 👑 LAYER 5: BIG CORE ACTION LAUNCH TRIGGER BUTTON */}
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:brightness-105 active:scale-[0.99] transition-all text-white text-xs font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2 min-h-[52px]"
        >
          {loading ? "🔄 Verification Active..." : "EXPLORE VERIFIED CABS"}
        </button>

        {/* 👑 LAYER 6: TRUST FOOTER METRICS BADGES */}
        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
          <div className="flex items-center justify-center gap-1">🛡️ Verified Drivers</div>
          <div className="flex items-center justify-center gap-1 border-x border-slate-100">💎 Fixed Pricing</div>
          <div className="flex items-center justify-center gap-1">⏱️ 24x7 Support</div>
        </div>

      </div>
    </form>
  );
}
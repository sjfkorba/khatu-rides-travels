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

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || (serviceType !== "local" && !drop.trim()) || !pickupDate || !pickupTime) {
      alert("⚠️ Error: All fields are mandatory!");
      return;
    }
    if (bookingType === "roundtrip" && (!returnDate || !returnTime)) {
      alert("⚠️ Error: Return details are required for Round Trips!");
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

    // Capture autoCorrection mapping state response parameters directly from core execution engine
    let computedServiceType: ServiceType = serviceType;

    const options = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
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

      computedServiceType = res.autoCorrectedService; // Overwriting category state react mapping parameters dynamically

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

    // Notify user if system over-rides fraud category attempts
    if (computedServiceType !== serviceType) {
      alert(`📢 Note: System has optimized your category selection to "${computedServiceType.toUpperCase()}" based on verified dynamic routing distance coordinates.`);
    }

    onFareCalculated({
      fareOptions: options, 
      pickup, 
      drop: computedServiceType === "local" ? "Local Full Day Run" : drop, 
      bookingType, 
      serviceType: computedServiceType,
      pickupDate, 
      pickupTime,
      returnDate: bookingType === "roundtrip" ? returnDate : undefined,
      returnTime: bookingType === "roundtrip" ? returnTime : undefined
    });
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex bg-slate-950/95 backdrop-blur border border-slate-800 rounded-t-2xl px-2 py-1.5 shadow-lg z-10">
        <button type="button" onClick={() => { setMainServiceType("outstation"); setBookingType("oneway"); }} className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${serviceType === "outstation" && bookingType === "oneway" ? "bg-orange-600 text-white shadow-md shadow-orange-600/30" : "text-slate-400 hover:text-white"}`}>One Way</button>
        <button type="button" onClick={() => { setMainServiceType("outstation"); setBookingType("roundtrip"); }} className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${serviceType === "outstation" && bookingType === "roundtrip" ? "bg-orange-600 text-white shadow-md shadow-orange-600/30" : "text-slate-400 hover:text-white"}`}>Round Trip</button>
        <button type="button" onClick={() => { setMainServiceType("local"); setBookingType("oneway"); }} className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${serviceType === "local" ? "bg-orange-600 text-white shadow-md shadow-orange-600/30" : "text-slate-400 hover:text-white"}`}>Local Package</button>
      </div>

      <form onSubmit={handleCalculate} className="w-full bg-white/95 backdrop-blur-md rounded-3xl md:rounded-[2.5rem] border-2 border-orange-500 p-5 md:p-8 text-left font-sans -mt-0.5 relative z-20 shadow-lg">
        <div className={`grid grid-cols-1 gap-4 items-center w-full ${serviceType === "outstation" && bookingType === "roundtrip" ? "lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_1fr]" : serviceType === "local" ? "lg:grid-cols-[2fr_1fr_1fr]" : "lg:grid-cols-[1.5fr_1.5fr_1fr_1fr]"}`}>
          
          <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 transition-all w-full" ref={pickupRef}>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">{serviceType === "local" ? "City Location" : "From"}</label>
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-sm">📍</span>
              <input required type="text" placeholder="Type pickup city..." value={pickup} onChange={(e) => { setPickup(e.target.value); fetchLiveSuggestions(e.target.value, "pickup"); }} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none" />
            </div>
            {showPickupList && pickupSuggestions.length > 0 && (
              <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-3 shadow-2xl max-h-48 overflow-y-auto z-[999999] divide-y divide-slate-100">
                {pickupSuggestions.map((item, idx) => (
                  <li key={idx} onClick={() => { setPickup(item); setShowPickupList(false); }} className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 cursor-pointer">{item}</li>
                ))}
              </ul>
            )}
          </div>

          {serviceType !== "local" && (
            <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 transition-all w-full" ref={dropRef}>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">To</label>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-sm">🏁</span>
                <input required type="text" placeholder="Type drop point..." value={drop} onChange={(e) => { setDrop(e.target.value); fetchLiveSuggestions(e.target.value, "drop"); }} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none" />
              </div>
              {showDropList && dropSuggestions.length > 0 && (
                <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-3 shadow-2xl max-h-48 overflow-y-auto z-[999999] divide-y divide-slate-100">
                  {dropSuggestions.map((item, idx) => (
                    <li key={idx} onClick={() => { setDrop(item); setShowDropList(false); }} className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 cursor-pointer">{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 transition-all w-full">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Pick Up Date</label>
            <input required type="date" min={minDate} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer" />
          </div>

          <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 transition-all w-full">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Pick Up Time</label>
            <input required type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer" />
          </div>

          {serviceType === "outstation" && bookingType === "roundtrip" && (
            <>
              <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 transition-all w-full">
                <label className="block text-[10px] font-black text-orange-600 uppercase tracking-wider mb-0.5">Return Date</label>
                <input required type="date" min={pickupDate || minDate} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer" />
              </div>
              <div className="relative border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-50/50 focus-within:border-orange-500 transition-all w-full">
                <label className="block text-[10px] font-black text-orange-600 uppercase tracking-wider mb-0.5">Return Time</label>
                <input required type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer" />
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center">
          <button type="submit" disabled={loading} className="w-full max-w-md bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white text-sm font-black uppercase tracking-widest py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-2 min-h-[54px]">
            {loading ? "🔄 Scanning Fleet Hubs..." : "EXPLORE CABS"}
          </button>
        </div>
      </form>
    </div>
  );
}
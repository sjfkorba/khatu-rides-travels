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
  const [passengers, setPassengers] = useState("1 Passenger");
  const [vehiclePreference, setVehiclePreference] = useState("Any");
  
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
    let mappedDistance = serviceType === "local" ? 80 : 45;

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
        drop: drop,
      });

      computedServiceType = res.autoCorrectedService;

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
      <div className="w-full bg-white backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(249,115,22,0.15)] border-2 border-orange-500/80 p-5 sm:p-8 text-left font-sans relative z-20 text-slate-900">
        
        {/* 👑 3 HIGHLIGHTED TABS: ONE WAY, ROUND TRIP, LOCAL */}
        <div className="grid grid-cols-3 gap-3 border-b border-slate-200 pb-5 mb-6">
          <button 
            type="button" 
            onClick={() => { setMainServiceType("outstation"); setBookingType("oneway"); }} 
            className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md ${
              serviceType === "outstation" && bookingType === "oneway" 
                ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-orange-600/40 scale-[1.02]" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-300/80"
            }`}
          >
            <span>🚀</span> One Way
          </button>
          
          <button 
            type="button" 
            onClick={() => { setMainServiceType("outstation"); setBookingType("roundtrip"); }} 
            className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md ${
              serviceType === "outstation" && bookingType === "roundtrip" 
                ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-orange-600/40 scale-[1.02]" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-300/80"
            }`}
          >
            <span>🔄</span> Round Trip
          </button>

          <button 
            type="button" 
            onClick={() => { setMainServiceType("local"); setBookingType("oneway"); }} 
            className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md ${
              serviceType === "local" 
                ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-orange-600/40 scale-[1.02]" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-300/80"
            }`}
          >
            <span>🏙️</span> Local
          </button>
        </div>

        <form onSubmit={handleCalculate}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            
            {/* FROM / PICKUP LOCATION */}
            <div className="relative border-2 border-orange-500/30 rounded-2xl p-4 bg-orange-50/30 hover:border-orange-500/70 focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all w-full shadow-inner" ref={pickupRef}>
              <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">
                {serviceType === "local" ? "City Location" : "From (Pick-up Location)"}
              </label>
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-600 text-sm">📍</span>
                <input 
                  required 
                  type="text" 
                  placeholder="Enter pickup location..." 
                  value={pickup} 
                  onChange={(e) => { setPickup(e.target.value); fetchLiveSuggestions(e.target.value, "pickup"); }} 
                  className="w-full bg-transparent text-xs font-black text-slate-950 focus:outline-none placeholder:text-slate-400" 
                />
              </div>
              {showPickupList && pickupSuggestions.length > 0 && (
                <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-2xl mt-3 shadow-2xl max-h-48 overflow-y-auto z-[999999] divide-y divide-slate-100">
                  {pickupSuggestions.map((item, idx) => (
                    <li key={idx} onClick={() => { setPickup(item); setShowPickupList(false); }} className="px-4 py-3 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer">{item}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* TO / DROP LOCATION */}
            {serviceType !== "local" ? (
              <div className="relative border-2 border-orange-500/30 rounded-2xl p-4 bg-orange-50/30 hover:border-orange-500/70 focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all w-full shadow-inner" ref={dropRef}>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">To (Drop Location)</label>
                <div className="flex items-center gap-2.5">
                  <span className="text-red-500 text-sm">📍</span>
                  <input 
                    required 
                    type="text" 
                    placeholder="Enter drop location..." 
                    value={drop} 
                    onChange={(e) => { setDrop(e.target.value); fetchLiveSuggestions(e.target.value, "drop"); }} 
                    className="w-full bg-transparent text-xs font-black text-slate-950 focus:outline-none placeholder:text-slate-400" 
                  />
                </div>
                {showDropList && dropSuggestions.length > 0 && (
                  <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-2xl mt-3 shadow-2xl max-h-48 overflow-y-auto z-[999999] divide-y divide-slate-100">
                    {dropSuggestions.map((item, idx) => (
                      <li key={idx} onClick={() => { setDrop(item); setShowDropList(false); }} className="px-4 py-3 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="border-2 border-orange-500/30 rounded-2xl p-4 bg-orange-50/30 w-full flex flex-col justify-center shadow-inner">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Package Duration</span>
                <span className="text-xs font-black text-slate-950">8 Hours / 80 Kms Included</span>
              </div>
            )}

            {/* PICK-UP DATE */}
            <div className="border-2 border-orange-500/30 rounded-2xl p-4 bg-orange-50/30 hover:border-orange-500/70 focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all w-full shadow-inner">
              <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Pick-up Date</label>
              <div className="flex items-center gap-2.5">
                <span className="text-slate-500 text-sm">📅</span>
                <input 
                  required 
                  type="date" 
                  min={minDate} 
                  value={pickupDate} 
                  onChange={(e) => setPickupDate(e.target.value)} 
                  className="w-full bg-transparent text-xs font-black text-slate-950 focus:outline-none cursor-pointer" 
                />
              </div>
            </div>

            {/* PICK-UP TIME */}
            <div className="border-2 border-orange-500/30 rounded-2xl p-4 bg-orange-50/30 hover:border-orange-500/70 focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all w-full shadow-inner">
              <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Pick-up Time</label>
              <div className="flex items-center gap-2.5">
                <span className="text-slate-500 text-sm">⏰</span>
                <input 
                  required 
                  type="time" 
                  value={pickupTime} 
                  onChange={(e) => setPickupTime(e.target.value)} 
                  className="w-full bg-transparent text-xs font-black text-slate-950 focus:outline-none cursor-pointer" 
                />
              </div>
            </div>

            {/* PASSENGERS DROPDOWN */}
            <div className="border-2 border-orange-500/30 rounded-2xl p-4 bg-orange-50/30 hover:border-orange-500/70 focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all w-full shadow-inner">
              <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Passengers</label>
              <div className="flex items-center gap-2.5">
                <span className="text-slate-500 text-sm">👤</span>
                <select 
                  value={passengers} 
                  onChange={(e) => setPassengers(e.target.value)}
                  className="bg-transparent text-xs font-black text-slate-950 focus:outline-none cursor-pointer w-full"
                >
                  <option value="1 Passenger" className="bg-white">1 Passenger</option>
                  <option value="2 Passengers" className="bg-white">2 Passengers</option>
                  <option value="3-4 Passengers" className="bg-white">3-4 Passengers</option>
                  <option value="5-7 Passengers" className="bg-white">5-7 Passengers (SUV/MUV)</option>
                </select>
              </div>
            </div>

            {/* VEHICLE PREFERENCE */}
            <div className="border-2 border-orange-500/30 rounded-2xl p-4 bg-orange-50/30 hover:border-orange-500/70 focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all w-full shadow-inner">
              <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Vehicle Preference</label>
              <div className="flex items-center gap-2.5">
                <span className="text-slate-500 text-sm">🚗</span>
                <select 
                  value={vehiclePreference} 
                  onChange={(e) => setVehiclePreference(e.target.value)}
                  className="bg-transparent text-xs font-black text-slate-950 focus:outline-none cursor-pointer w-full"
                >
                  <option value="Any" className="bg-white">Any (Best Available)</option>
                  <option value="Sedan" className="bg-white">Sedan (Dzire / Etios)</option>
                  <option value="SUV / MUV" className="bg-white">SUV / MUV (Ertiga / Xylo)</option>
                  <option value="Luxury SUV" className="bg-white">Luxury SUV (Innova Crysta)</option>
                </select>
              </div>
            </div>

            {/* RETURN DATE & TIME FOR ROUNDTRIP */}
            {serviceType === "outstation" && bookingType === "roundtrip" && (
              <>
                <div className="border-2 border-orange-500 rounded-2xl p-4 bg-orange-100/60 hover:border-orange-600 transition-all w-full shadow-inner">
                  <label className="block text-[10px] font-black text-orange-700 uppercase tracking-widest mb-1.5">Return Date</label>
                  <input required type="date" min={pickupDate || minDate} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-transparent text-xs font-black text-slate-950 focus:outline-none cursor-pointer" />
                </div>
                <div className="border-2 border-orange-500 rounded-2xl p-4 bg-orange-100/60 hover:border-orange-600 transition-all w-full shadow-inner">
                  <label className="block text-[10px] font-black text-orange-700 uppercase tracking-widest mb-1.5">Return Time</label>
                  <input required type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full bg-transparent text-xs font-black text-slate-950 focus:outline-none cursor-pointer" />
                </div>
              </>
            )}

          </div>

          {/* SEARCH BUTTON */}
          <div className="mt-6">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-sm font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-orange-600/40 flex items-center justify-center gap-2 transition-all active:scale-[0.99] min-h-[58px]"
            >
              {loading ? "🔄 Scanning Fleet Hubs..." : "SEARCH CABS →"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
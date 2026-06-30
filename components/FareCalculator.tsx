// components/FareCalculator.tsx
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

export default function FareCalculator({ onFareCalculated }: FareCalculatorProps) {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");
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

  // Sync current date time limitations
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

    if (!pickup.trim() || !drop.trim() || !pickupDate || !pickupTime) {
      alert("⚠️ Error: All route and time fields are strictly mandatory!");
      return;
    }

    const currentDateTime = new Date();
    const selectedDateTime = new Date(`${pickupDate}T${pickupTime}`);
    if (selectedDateTime <= currentDateTime) {
      alert("⚠️ Timeline Invalid: Past bookings cannot be processed. Please configure a future time slot.");
      return;
    }

    setLoading(true);
    let mappedDistance = 150;

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

    const options = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
      const res = calculateFare({
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
        finalFare: res.finalFare,
        strikeFare: res.strikeFare,
        fareText: `₹${res.finalFare.toLocaleString("en-IN")}`,
        strikeText: `₹${res.strikeFare.toLocaleString("en-IN")}`,
        billedDistance: res.billedDistance,
        durationMinutes: res.durationMinutes
      };
    });

    onFareCalculated({
      fareOptions: options, pickup, drop, bookingType, pickupDate, pickupTime
    });
    setLoading(false);
  };

  return (
    <form onSubmit={handleCalculate} className="p-5 text-left space-y-4 bg-white rounded-3xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Live Pickup Input */}
        <div className="relative" ref={pickupRef}>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">📍 Live Pick-Up Location *</label>
          <input required type="text" placeholder="Live Google Search Pickup Point..." value={pickup} onChange={(e) => { setPickup(e.target.value); fetchLiveSuggestions(e.target.value, "pickup"); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-orange-500 focus:outline-none" />
          {showPickupList && pickupSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto z-[999999] divide-y divide-slate-100">
              {pickupSuggestions.map((item, idx) => (
                <li key={idx} onClick={() => { setPickup(item); setShowPickupList(false); }} className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors">🚗 {item}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Live Drop Input */}
        <div className="relative" ref={dropRef}>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">🏁 Live Drop Location *</label>
          <input required type="text" placeholder="Live Google Search Destination..." value={drop} onChange={(e) => { setDrop(e.target.value); fetchLiveSuggestions(e.target.value, "drop"); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-orange-500 focus:outline-none" />
          {showDropList && dropSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto z-[999999] divide-y divide-slate-100">
              {dropSuggestions.map((item, idx) => (
                <li key={idx} onClick={() => { setDrop(item); setShowDropList(false); }} className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors">🏁 {item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trip Type Select */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">🔄 Trip Type *</label>
          <select value={bookingType} onChange={(e) => setBookingType(e.target.value as BookingType)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-orange-500 focus:outline-none">
            <option value="oneway">One Way Run</option>
            <option value="roundtrip">Round Trip Runs</option>
          </select>
        </div>
        
        {/* Pickup Date */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">📅 Pickup Date *</label>
          <input required type="date" min={minDate} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-orange-500 focus:outline-none" />
        </div>
        
        {/* Pickup Time */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">⏱️ Pickup Time *</label>
          <input required type="time" min={pickupDate === minDate ? minTime : undefined} value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-orange-500 focus:outline-none" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-[#d8551b] text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-60">
        {loading ? "🔄 Verification Active..." : "🚀 Calculate Fare Pass"}
      </button>
    </form>
  );
}
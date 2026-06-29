// components/AdminFareCalculator.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  calculateFare, 
  VEHICLES, 
  type VehicleType, 
  type BookingType 
} from "../lib/fareCalculator";

export default function AdminFareCalculator() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  const [loading, setLoading] = useState(false);
  
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropList, setShowDropList] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) setShowPickupList(false);
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) setShowDropList(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📡 Live Google Places Autocomplete API Proxy Request
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
      console.error("Autocomplete backend fetch error:", err);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || !drop.trim()) {
      alert("Please enter both Pick-up and Drop locations.");
      return;
    }

    setLoading(true);
    let mappedDistance = 150; // Balanced generic baseline setup fallback

    try {
      // 🛠️ Fetching Live Dynamic Distance from Google API
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
      console.error("Distance Router Engine Offline, Using internal defaults:", err);
    }

    const options = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
      const res = calculateFare({
        distance: mappedDistance,
        vehicleType: type,
        bookingType,
        pickupLocation: pickup,
        dropLocation: drop,
      });

      // 👑 AUTOPILOT MARGIN REVERSE PUMP LOGIC ENGINE
      // Standard dynamic partner bracket ratio injection context (82% / 68% for dry loops)
      const isPickupDry = ["chirmiri", "baikunthpur", "manendragarh", "ambikapur", "sakti", "kharsia", "kanker", "jagdalpur"].some(kw => pickup.toLowerCase().includes(kw));
      const payoutRatio = (bookingType === "oneway" && isPickupDry) ? 0.68 : 0.82;
      
      const calculatedB2BPayout = Math.round(res.finalFare * payoutRatio);
      const profitAmount = res.finalFare - calculatedB2BPayout;
      const profitPercentage = res.finalFare > 0 ? Math.round((profitAmount / res.finalFare) * 100) : 0;

      return {
        vehicleLabel: VEHICLES[type].label,
        limitKms: res.billedDistance, 
        finalFare: res.finalFare,
        b2bPayout: calculatedB2BPayout,
        profitAmount,
        profitPercentage
      };
    });

    setResults(options);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800">
      <h2 className="text-lg font-bold mb-4 text-slate-900 border-b pb-2">📋 Admin Quick Fare & Margin Desk</h2>
      
      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
        {/* Dynamic Pickup search */}
        <div className="relative" ref={pickupRef}>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">📍 Live Pickup Location</label>
          <input 
            type="text" 
            placeholder="Search pickup city..." 
            value={pickup} 
            onChange={(e) => { setPickup(e.target.value); fetchLiveSuggestions(e.target.value, "pickup"); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-slate-900"
          />
          {showPickupList && pickupSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-xl max-h-48 overflow-y-auto z-50 divide-y divide-slate-100">
              {pickupSuggestions.map((item, idx) => (
                <li 
                  key={idx} 
                  onClick={() => { setPickup(item); setShowPickupList(false); }}
                  className="px-4 py-2.5 text-xs font-bold hover:bg-slate-50 cursor-pointer text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dynamic Drop search */}
        <div className="relative" ref={dropRef}>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">🏁 Live Drop Location</label>
          <input 
            type="text" 
            placeholder="Search drop destination..." 
            value={drop} 
            onChange={(e) => { setDrop(e.target.value); fetchLiveSuggestions(e.target.value, "drop"); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-slate-900"
          />
          {showDropList && dropSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-xl max-h-48 overflow-y-auto z-50 divide-y divide-slate-100">
              {dropSuggestions.map((item, idx) => (
                <li 
                  key={idx} 
                  onClick={() => { setDrop(item); setShowDropList(false); }}
                  className="px-4 py-2.5 text-xs font-bold hover:bg-slate-50 cursor-pointer text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Options Selection Config */}
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">🔄 Trip Type</label>
            <select 
              value={bookingType} 
              onChange={(e) => setBookingType(e.target.value as BookingType)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none"
            >
              <option value="oneway">One Way</option>
              <option value="roundtrip">Round Trip</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="w-1/2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl shadow hover:bg-slate-800 transition-all disabled:opacity-60">
            {loading ? "Syncing..." : "Calculate"}
          </button>
        </div>
      </form>

      {/* Pop-up Results with Profit Matrix */}
      {results && (
        <div className="mt-4 border border-slate-100 rounded-xl bg-slate-50 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-700">
              Live Fare Sheet: <span className="text-orange-600">{pickup.split(',')[0]} ➔ {drop.split(',')[0]}</span> ({bookingType === "oneway" ? "One Way" : "Round Trip"})
            </h3>
            <button onClick={() => setResults(null)} className="text-xs text-slate-400 hover:text-slate-600 font-medium">✕ Clear</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase border-b border-slate-200">
                  <th className="px-4 py-3">Vehicle Type</th>
                  <th className="px-4 py-3">Billed Distance</th>
                  <th className="px-4 py-3 text-emerald-700">Customer Fare</th>
                  <th className="px-4 py-3 text-indigo-700">Est B2B Payout</th>
                  <th className="px-4 py-3 text-right text-orange-700 bg-orange-50/50">Your Net Margin (Profit)</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold divide-y divide-slate-100">
                {results.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-900">{row.vehicleLabel}</td>
                    <td className="px-4 py-3 text-slate-500 font-bold">{row.limitKms} KM</td>
                    <td className="px-4 py-3 text-emerald-600 font-black">₹{row.finalFare.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-indigo-600 font-medium">₹{row.b2bPayout.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-right bg-orange-50/20">
                      <div className="text-orange-600 font-black">₹{row.profitAmount.toLocaleString("en-IN")}</div>
                      <div className="text-[10px] text-orange-500 font-bold">({row.profitPercentage}% Net)</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
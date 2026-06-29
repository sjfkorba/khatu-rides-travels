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

  // Auto-close dropdowns on outside tap click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) setShowPickupList(false);
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) setShowDropList(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📡 Live Google Places Autocomplete API Proxy Connection
  const fetchLiveSuggestions = async (input: string, type: "pickup" | "drop") => {
    if (input.trim().length < 3) return;
    try {
      const response = await fetch(`/api/places-autocomplete?input=${encodeURIComponent(input)}`);
      const data = await response.json();
      if (data && data.predictions) {
        const results = data.predictions.map((p: any) => p.description);
        if (type === "pickup") { 
          setPickupSuggestions(results); 
          setShowPickupList(true); 
        } else { 
          setDropSuggestions(results); 
          setShowDropList(true); 
        }
      }
    } catch (err) {
      console.error("Autocomplete backend lookup failure:", err);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || !drop.trim()) {
      alert("⚠️ Verification Error: Please select both Pickup and Drop points from dynamic lists.");
      return;
    }

    setLoading(true);
    let mappedDistance = 150; // Balanced algorithmic fallback state

    try {
      // 🛠️ Fetching Live Dynamic Road Distance via Google Routes API
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
      console.error("Distance Service Offline, proceeding with static buffer defaults", err);
    }

    // Process all 3 vehicle classes with our exact fixed pricing strategy
    const options = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
      const res = calculateFare({
        distance: mappedDistance,
        vehicleType: type,
        bookingType,
        pickupLocation: pickup,
        dropLocation: drop,
      });

      // 👑 AUTOMATIC VENDOR DEPLOYMENT MARGIN STRATEGY
      // Agar pickup kisi dry segment area se hai, toh payout ratio adjust hoga taaki gaadi easily mil sake
      const isPickupDry = ["chirmiri", "baikunthpur", "manendragarh", "ambikapur", "sakti", "kharsia", "kanker", "jagdalpur"].some(kw => pickup.toLowerCase().includes(kw));
      const payoutRatio = (bookingType === "oneway" && isPickupDry) ? 0.68 : 0.82; // e.g. Korba to Bilaspur (₹1999 * 0.82 = ₹1600 approx target payout)
      
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
    <div className="w-full mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-3xl text-slate-100 text-left">
      <h2 className="text-sm font-black mb-4 text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
        📊 LIVE SUPPLY MANAGEMENT & MARGIN CALCULATION DESK
      </h2>
      
      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
        
        {/* Dynamic Live Pickup Field */}
        <div className="relative" ref={pickupRef}>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">📍 Live Pickup Search</label>
          <input 
            type="text" 
            placeholder="Type any city or location in India..." 
            value={pickup} 
            onChange={(e) => { setPickup(e.target.value); fetchLiveSuggestions(e.target.value, "pickup"); }}
            onFocus={() => pickup.trim().length > 0 && setShowPickupList(true)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {showPickupList && pickupSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto z-50 divide-y divide-slate-800">
              {pickupSuggestions.map((item, idx) => (
                <li 
                  key={idx} 
                  onClick={() => { setPickup(item); setShowPickupList(false); }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white cursor-pointer transition-colors"
                >
                  🚗 {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dynamic Live Drop Field */}
        <div className="relative" ref={dropRef}>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">🏁 Live Drop Search</label>
          <input 
            type="text" 
            placeholder="Type destination city or area..." 
            value={drop} 
            onChange={(e) => { setDrop(e.target.value); fetchLiveSuggestions(e.target.value, "drop"); }}
            onFocus={() => drop.trim().length > 0 && setShowDropList(true)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {showDropList && dropSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto z-50 divide-y divide-slate-800">
              {dropSuggestions.map((item, idx) => (
                <li 
                  key={idx} 
                  onClick={() => { setDrop(item); setShowDropList(false); }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white cursor-pointer transition-colors"
                >
                  🏁 {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Options Selection Config */}
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">🔄 Trip Type</label>
            <select 
              value={bookingType} 
              onChange={(e) => setBookingType(e.target.value as BookingType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="oneway">One Way Run</option>
              <option value="roundtrip">Round Trip</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="w-1/2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg transition-opacity disabled:opacity-50">
            {loading ? "Syncing..." : "Calculate"}
          </button>
        </div>
      </form>

      {/* Pop-up Results with Profit Matrix Data View */}
      {results && (
        <div className="mt-4 border border-slate-800 rounded-2xl bg-slate-950/40 p-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wide">
              📊 Live Sheet Matrix: <span className="text-orange-400 font-extrabold">{pickup.split(',')[0]} ➔ {drop.split(',')[0]}</span> ({bookingType === "oneway" ? "OneWay" : "RoundTrip"})
            </h3>
            <button onClick={() => setResults(null)} className="text-xs text-slate-500 hover:text-slate-300 font-bold bg-slate-900 px-2 py-1 rounded-lg">✕ Clear</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800">
              <thead>
                <tr className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-800">
                  <th className="px-4 py-3.5">Vehicle Type</th>
                  <th className="px-4 py-3.5">Billed Kms</th>
                  <th className="px-4 py-3.5 text-emerald-400">B2C Cust Fare</th>
                  <th className="px-4 py-3.5 text-indigo-400">B2B Vendor Payout</th>
                  <th className="px-4 py-3.5 text-right text-orange-400 bg-orange-500/5">Operator Net Profit Margin</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold divide-y divide-slate-800 text-slate-200">
                {results.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-4 text-white font-black">{row.vehicleLabel}</td>
                    <td className="px-4 py-4 text-slate-400 font-extrabold">{row.limitKms} KM</td>
                    <td className="px-4 py-4 text-emerald-400 font-black text-sm">₹{row.finalFare.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-4 text-indigo-400 font-black text-sm">₹{row.b2bPayout.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-4 text-right bg-orange-500/5">
                      <div className="text-orange-500 font-black text-sm">₹{row.profitAmount.toLocaleString("en-IN")}</div>
                      <div className="text-[10px] text-orange-400/70 font-extrabold">({row.profitPercentage}% Net Net)</div>
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
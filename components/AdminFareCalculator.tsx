"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  calculateFare, 
  VEHICLES, 
  type VehicleType, 
  type BookingType, 
  type CalculateFareResult 
} from "../lib/fareCalculator";

const CG_CITIES = [
  "Raipur, Chhattisgarh",
  "Korba, Chhattisgarh",
  "Bilaspur, Chhattisgarh",
  "Jagdalpur, Bastar, CG",
  "Rajnandgaon, Chhattisgarh",
  "Mahasamund, Chhattisgarh",
  "Chirmiri, Koriya, CG",
  "Sakti, Chhattisgarh",
  "Kharsia, Raigarh, CG",
  "Sarangarh, Chhattisgarh",
  "Janjgir, Chhattisgarh",
  "Champa, Chhattisgarh",
  "Raipur Airport (RPR), CG",
  "Ambikapur, Surguja, CG",
  "Baikunthpur, Chhattisgarh",
  "Manendragarh, CG",
  "Dhamtari, Chhattisgarh",
  "Kawardha, Chhattisgarh",
  "Kanker, Bastar, CG",
  "Kondagaon, Chhattisgarh",
  "Dantewada, Chhattisgarh",
  "Sukma, Chhattisgarh",
  "Dongargarh, Chhattisgarh",
  "Balodabazar, Chhattisgarh",
  "Bhatapara, Chhattisgarh",
  "Bemetara, Chhattisgarh",
  "Surajpur, Chhattisgarh",
  "Durg, Chhattisgarh",
  "Bhilai, Chhattisgarh"
];

export default function AdminFareCalculator() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  
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

  const handlePickupChange = (val: string) => {
    setPickup(val);
    if (val.trim().length > 0) {
      setPickupSuggestions(CG_CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase())));
      setShowPickupList(true);
    } else {
      setShowPickupList(false);
    }
  };

  const handleDropChange = (val: string) => {
    setDrop(val);
    if (val.trim().length > 0) {
      setDropSuggestions(CG_CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase())));
      setShowDropList(true);
    } else {
      setShowDropList(false);
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
  e.preventDefault();
  if (!pickup.trim() || !drop.trim()) {
    alert("Please enter both Pick-up and Drop locations.");
    return;
  }

  const pLow = pickup.toLowerCase();
  const dLow = drop.toLowerCase();

  // Helper lambda function to check two-way route matches
  const isRoute = (c1: string, c2: string) => 
    (pLow.includes(c1) && dLow.includes(c2)) || (pLow.includes(c2) && dLow.includes(c1));

  // 👑 CHHATTISGARH HIGHWAY HIGH-TRAFFIC REAL DISTANCE MATRIX (2026 Updated) 👑
  let simulatedDistance = 150; // Balanced generic fallback state if no route matches

  if (isRoute("korba", "bilaspur")) simulatedDistance = 90;
  else if (isRoute("bilaspur", "raipur")) simulatedDistance = 115;
  else if (isRoute("korba", "raipur")) simulatedDistance = 215; // Via Champa/Nandhaur route
  else if (isRoute("raipur", "jagdalpur")) simulatedDistance = 295; // NH-30 Core route
  else if (isRoute("bilaspur", "chirmiri")) simulatedDistance = 185;
  else if (isRoute("bilaspur", "sakti")) simulatedDistance = 112;
  else if (isRoute("raipur", "rajnandgaon")) simulatedDistance = 72; // NH-53 Expressway slab
  
  // 📍 Core Problem Fix: North Corridor (Surguja Hub) Real Slab Mapping
  else if (isRoute("korba", "ambikapur")) simulatedDistance = 180; // Passes perfectly into the <= 210km slab!
  else if (isRoute("raipur", "ambikapur")) simulatedDistance = 340; // Passes into the <= 360km slab
  else if (isRoute("bilaspur", "ambikapur")) simulatedDistance = 225; // Passes into the <= 260km slab
  else if (isRoute("raipur", "durg") || isRoute("raipur", "bhilai")) simulatedDistance = 40; // Short Loop slab
  else if (isRoute("korba", "champa")) simulatedDistance = 45;
  else if (isRoute("raipur", "mahasamund")) simulatedDistance = 55;
  else if (isRoute("raipur", "dhamtari")) simulatedDistance = 80;
  else if (isRoute("raipur", "janjgir")) simulatedDistance = 155;

  const options = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
    const res: CalculateFareResult = calculateFare({
      distance: simulatedDistance,
      vehicleType: type,
      bookingType,
      pickupLocation: pickup,
      dropLocation: drop,
      pickupTime: "09:00", 
      stopCount: 0
    });

    const profitAmount = res.finalFare - res.b2bPartnerPayout;
    const profitPercentage = res.finalFare > 0 ? Math.round((profitAmount / res.finalFare) * 100) : 0;

    return {
      vehicleLabel: VEHICLES[type].label,
      limitKms: res.distance, // Yields the correct padded slab distance from fareCalculator.ts
      finalFare: res.finalFare,
      b2bPayout: res.b2bPartnerPayout,
      profitAmount,
      profitPercentage
    };
  });

  setResults(options);
};

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800">
      <h2 className="text-lg font-bold mb-4 text-slate-900 border-b pb-2">📋 Admin Quick Fare & Margin Desk</h2>
      
      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
        {/* Pickup */}
        <div className="relative" ref={pickupRef}>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">📍 Pickup Location</label>
          <input 
            type="text" 
            placeholder="Type pickup city..." 
            value={pickup} 
            onChange={(e) => handlePickupChange(e.target.value)}
            onFocus={() => pickup.trim().length > 0 && setShowPickupList(true)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500"
          />
          {showPickupList && pickupSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-xl max-h-48 overflow-y-auto z-50 divide-y divide-slate-100">
              {pickupSuggestions.map((item, idx) => (
                <li 
                  key={idx} 
                  onClick={() => { setPickup(item); setShowPickupList(false); }}
                  className="px-4 py-2 text-sm font-medium hover:bg-slate-50 cursor-pointer text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drop */}
        <div className="relative" ref={dropRef}>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">🏁 Drop Location</label>
          <input 
            type="text" 
            placeholder="Type drop city..." 
            value={drop} 
            onChange={(e) => handleDropChange(e.target.value)}
            onFocus={() => drop.trim().length > 0 && setShowDropList(true)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500"
          />
          {showDropList && dropSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-xl max-h-48 overflow-y-auto z-50 divide-y divide-slate-100">
              {dropSuggestions.map((item, idx) => (
                <li 
                  key={idx} 
                  onClick={() => { setDrop(item); setShowDropList(false); }}
                  className="px-4 py-2 text-sm font-medium hover:bg-slate-50 cursor-pointer text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Trip Type & Action Button Group */}
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">🔄 Trip Type</label>
            <select 
              value={bookingType} 
              onChange={(e) => setBookingType(e.target.value as BookingType)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="oneway">One Way</option>
              <option value="roundtrip">Round Trip</option>
            </select>
          </div>
          
          <button type="submit" className="w-1/2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl shadow hover:bg-slate-800 transition-all">
            Calculate
          </button>
        </div>
      </form>

      {/* Pop-up Results with Profit Matrix */}
      {results && (
        <div className="mt-4 border border-slate-100 rounded-xl bg-slate-50 p-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-700">
              Live Fare Sheet: <span className="text-indigo-600">{pickup.split(',')[0]} ➔ {drop.split(',')[0]}</span> ({bookingType === "oneway" ? "One Way" : "Round Trip"})
            </h3>
            <button onClick={() => setResults(null)} className="text-xs text-slate-400 hover:text-slate-600 font-medium">✕ Clear</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase border-b border-slate-200">
                  <th className="px-4 py-3">Vehicle Type</th>
                  <th className="px-4 py-3">Limit Kms</th>
                  <th className="px-4 py-3 text-emerald-700">Customer Fare</th>
                  <th className="px-4 py-3 text-indigo-700">B2B Payout</th>
                  <th className="px-4 py-3 text-right text-orange-700 bg-orange-50/50">Your Margin (Profit)</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold divide-y divide-slate-100">
                {results.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-900">{row.vehicleLabel}</td>
                    <td className="px-4 py-3 text-slate-500">{row.limitKms} km</td>
                    <td className="px-4 py-3 text-emerald-600 font-bold">₹{row.finalFare.toLocaleString("en-IN")}</td>
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
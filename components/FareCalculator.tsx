// components/FareCalculator.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  calculateFare, 
  VEHICLES, 
  type VehicleType, 
  type BookingType, 
  type CalculateFareResult 
} from "../lib/fareCalculator";

interface FareCalculatorProps {
  onFareCalculated: (data: {
    fareOptions: any[];
    pickup: string;
    drop: string;
    bookingType: BookingType;
    pickupDate: string;
    pickupTime: string;
    stopsCount: number;
    stopsListText: string;
    tripDays: number;
  }) => void;
}

// 👑 CHHATTISGARH TARGET LOCALITIES DICTIONARY FOR HIGH CTR SUGGESTIONS 👑
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
  "Ujjain, Madhya Pradesh",
  "Durg, Chhattisgarh",
  "Bhilai, Chhattisgarh"
];

export default function FareCalculator({ onFareCalculated }: FareCalculatorProps) {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [stops, setStops] = useState("");

  // Suggestion State Handling
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropList, setShowDropList] = useState(false);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Auto close suggestions on outside tap click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setShowPickupList(false);
      }
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setShowDropList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePickupChange = (val: string) => {
    setPickup(val);
    if (val.trim().length > 0) {
      const filtered = CG_CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setPickupSuggestions(filtered);
      setShowPickupList(true);
    } else {
      setPickupSuggestions([]);
      setShowPickupList(false);
    }
  };

  const handleDropChange = (val: string) => {
    setDrop(val);
    if (val.trim().length > 0) {
      const filtered = CG_CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setDropSuggestions(filtered);
      setShowDropList(true);
    } else {
      setDropSuggestions([]);
      setShowDropList(false);
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || !drop.trim()) {
      alert("Please select both Pick-up and Drop locations.");
      return;
    }

    let simulatedDistance = 120; 
    const pLow = pickup.toLowerCase();
    const dLow = drop.toLowerCase();

    if ((pLow.includes("korba") && dLow.includes("bilaspur")) || (pLow.includes("bilaspur") && dLow.includes("korba"))) simulatedDistance = 90;
    else if ((pLow.includes("bilaspur") && dLow.includes("raipur")) || (pLow.includes("raipur") && dLow.includes("bilaspur"))) simulatedDistance = 115;
    else if ((pLow.includes("korba") && dLow.includes("raipur")) || (pLow.includes("raipur") && dLow.includes("korba"))) simulatedDistance = 215;
    else if ((pLow.includes("raipur") && dLow.includes("jagdalpur")) || (pLow.includes("jagdalpur") && dLow.includes("raipur"))) simulatedDistance = 295;
    else if ((pLow.includes("bilaspur") && dLow.includes("chirmiri")) || (pLow.includes("chirmiri") && dLow.includes("bilaspur"))) simulatedDistance = 175;
    else if ((pLow.includes("bilaspur") && dLow.includes("sakti")) || (pLow.includes("sakti") && dLow.includes("bilaspur"))) simulatedDistance = 112;
    else if ((pLow.includes("raipur") && dLow.includes("rajnandgaon")) || (pLow.includes("rajnandgaon") && dLow.includes("raipur"))) simulatedDistance = 72;
    else if (pLow.includes("ujjain") && dLow.includes("durg")) simulatedDistance = 720;

    const stopCount = stops.trim() ? stops.split(",").length : 0;

    const options = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
      const res: CalculateFareResult = calculateFare({
        distance: simulatedDistance,
        vehicleType: type,
        bookingType,
        stopCount,
        pickupTime,
        pickupLocation: pickup,
        dropLocation: drop,
      });

      return {
        id: `${bookingType}-${type}`,
        vehicleType: type,
        vehicleLabel: VEHICLES[type].label,
        vehicleImage: VEHICLES[type].image,
        baseFareWithoutAddons: simulatedDistance * (VEHICLES[type].oldRatePerKm || 14),
        finalFare: res.finalFare,
        strikeFare: res.strikeFare,
        fareText: `₹${res.finalFare.toLocaleString("en-IN")}`,
        strikeText: `₹${res.strikeFare.toLocaleString("en-IN")}`,
        pricingModeLabel: "Standard Corridor Rate Pass",
        billedDistance: res.billedDistance,
        calculatedDayHaltCharges: 0,
        calculatedNightCharges: 0,
        nightChargePercentageApplied: 0,
        expectedReachTimeText: "Estimated Fleet Corridor Window",
        stopManagementCharge: stopCount * 150
      };
    });

    onFareCalculated({
      fareOptions: options,
      pickup,
      drop,
      bookingType,
      pickupDate,
      pickupTime,
      stopsCount: stopCount,
      stopsListText: stops,
      tripDays: 1
    });
  };

  return (
    <form onSubmit={handleCalculate} className="p-4 sm:p-6 text-left space-y-4 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Pickup Form Wrapper */}
        <div className="relative" ref={pickupRef}>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">📍 Pick-Up Location</label>
          <input 
            type="text" 
            placeholder="Type pickup city... (e.g. Raipur)" 
            value={pickup} 
            onChange={(e) => handlePickupChange(e.target.value)}
            onFocus={() => pickup.trim().length > 0 && setShowPickupList(true)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-orange-500"
          />
          {showPickupList && pickupSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-2xl max-h-52 overflow-y-auto z-[999999] divide-y divide-slate-100">
              {pickupSuggestions.map((item, idx) => (
                <li 
                  key={idx} 
                  onClick={() => { setPickup(item); setShowPickupList(false); }}
                  className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors"
                >
                  🚗 {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drop Form Wrapper */}
        <div className="relative" ref={dropRef}>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">🏁 Drop Location</label>
          <input 
            type="text" 
            placeholder="Type drop city... (e.g. Korba)" 
            value={drop} 
            onChange={(e) => handleDropChange(e.target.value)}
            onFocus={() => drop.trim().length > 0 && setShowDropList(true)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-orange-500"
          />
          {showDropList && dropSuggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-2xl max-h-52 overflow-y-auto z-[999999] divide-y divide-slate-100">
              {dropSuggestions.map((item, idx) => (
                <li 
                  key={idx} 
                  onClick={() => { setDrop(item); setShowDropList(false); }}
                  className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors"
                >
                  🏁 {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">🔄 Trip Type</label>
          <select 
            value={bookingType} 
            onChange={(e) => setBookingType(e.target.value as BookingType)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-orange-500"
          >
            <option value="oneway">One Way Run</option>
            <option value="roundtrip">Round Trip Runs</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">📅 Pickup Date</label>
          <input 
            type="date" 
            value={pickupDate} 
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">⏱️ Pickup Time</label>
          <input 
            type="time" 
            value={pickupTime} 
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">🛑 Via Stops (Optional)</label>
        <input 
          type="text" 
          placeholder="e.g. Champa, Janjgir (comma separated)" 
          value={stops} 
          onChange={(e) => setStops(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-orange-500"
        />
      </div>

      <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-[#d8551b] text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:from-[#c2511b] transition-all transform active:scale-[0.99]">
        🚀 Get Verified Corridor Pass
      </button>
    </form>
  );
}
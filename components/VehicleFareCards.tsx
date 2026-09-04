// components/FareCalculator.tsx
"use client";

import React, { useState } from "react";
import { 
  calculateFare, 
  VEHICLES, 
  type BookingType, 
  type VehicleType, 
  type ServiceType,
  type CalculateFareResult 
} from "@/lib/fareCalculator";

interface FareCalculatorProps {
  onFareCalculated: (data: {
    fareOptions: {
      id: string;
      vehicleType: VehicleType;
      vehicleLabel: string;
      vehicleImage: string;
      finalFare: number;
      strikeFare: number;
      billedDistance: number;
      durationMinutes: number;
    }[];
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

const POPULAR_CITIES = [
  "Korba, Chhattisgarh",
  "Raipur, Chhattisgarh",
  "Bilaspur, Chhattisgarh",
  "Durg, Chhattisgarh",
  "Bhilai, Chhattisgarh",
  "Raigarh, Chhattisgarh",
  "Ambikapur, Chhattisgarh",
  "Jagdalpur, Chhattisgarh",
  "Nagpur, Maharashtra",
  "Ranchi, Jharkhand"
];

export default function FareCalculator({ onFareCalculated }: FareCalculatorProps) {
  const [pickup, setPickup] = useState("Korba, Chhattisgarh");
  const [drop, setDrop] = useState("Raipur, Chhattisgarh");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  const [serviceType, setServiceType] = useState<ServiceType>("outstation");
  
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  
  // Date & Time Defaults
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  
  const [pickupDate, setPickupDate] = useState(defaultDateStr);
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnDate, setReturnDate] = useState(defaultDateStr);
  const [returnTime, setReturnTime] = useState("18:00");
  const [loading, setLoading] = useState(false);

  // Filter suggestions based on input
  const filteredPickupSuggestions = POPULAR_CITIES.filter(city => 
    city.toLowerCase().includes(pickup.toLowerCase()) && city.toLowerCase() !== pickup.toLowerCase()
  );

  const filteredDropSuggestions = POPULAR_CITIES.filter(city => 
    city.toLowerCase().includes(drop.toLowerCase()) && city.toLowerCase() !== drop.toLowerCase()
  );

  const handleSwapLocations = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  const handleCalculateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !drop) {
      alert("Kripya Pickup aur Drop locations darj karein!");
      return;
    }

    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      let calculatedDistanceKm = 150; // Fallback distance

      if (apiKey) {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
          pickup
        )}&destination=${encodeURIComponent(drop)}&key=${apiKey}`;
        
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "OK" && data.routes && data.routes.length > 0) {
          calculatedDistanceKm = data.routes[0].legs[0].distance.value / 1000;
        }
      }

      const vehicleKeys = Object.keys(VEHICLES) as VehicleType[];

      const fareOptions = vehicleKeys.map((type) => {
        const result: CalculateFareResult = calculateFare({
          distance: calculatedDistanceKm,
          vehicleType: type,
          bookingType,
          serviceType,
          pickupDate,
          pickupTime,
          returnDate: bookingType === "roundtrip" ? returnDate : "",
          returnTime: bookingType === "roundtrip" ? returnTime : "",
          drop,
          pickup,
        });

        return {
          id: `fare-${type}-${Date.now()}`,
          vehicleType: type,
          vehicleLabel: VEHICLES[type].label,
          vehicleImage: VEHICLES[type].image,
          finalFare: result.finalFare,
          strikeFare: result.strikeFare,
          billedDistance: result.billedDistance,
          durationMinutes: result.durationMinutes,
        };
      });

      onFareCalculated({
        fareOptions,
        pickup,
        drop,
        bookingType,
        serviceType,
        pickupDate,
        pickupTime,
        returnDate: bookingType === "roundtrip" ? returnDate : undefined,
        returnTime: bookingType === "roundtrip" ? returnTime : undefined,
      });

    } catch (err) {
      console.error("Fare calculation error:", err);
      alert("Distance calculation fail ho gayi. Kripya dobara koshish karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl text-left overflow-visible">
      
      {/* Absolute Glow Accent */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-orange-600/20 blur-3xl pointer-events-none rounded-full"></div>

      {/* Trust & Conversion Badges Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-slate-300 tracking-wide">Live Cabs Available</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          <span>⚡ Instant Booking</span>
          <span className="text-slate-600">•</span>
          <span>🛡️ Verified Drivers</span>
        </div>
      </div>
      
      {/* Trip Type Tabs with Icons & Active Glow */}
      <div className="grid grid-cols-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 mb-6 shadow-inner">
        <button
          type="button"
          onClick={() => setBookingType("oneway")}
          className={`relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
            bookingType === "oneway" 
              ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30 scale-[1.02]" 
              : "text-slate-400 hover:text-white hover:bg-slate-900/50"
          }`}
        >
          <span className="text-base">🚗</span>
          <span>One Way Trip</span>
          {bookingType === "oneway" && (
            <span className="absolute -bottom-1 w-6 h-1 bg-amber-300 rounded-full blur-[1px]"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setBookingType("roundtrip")}
          className={`relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
            bookingType === "roundtrip" 
              ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30 scale-[1.02]" 
              : "text-slate-400 hover:text-white hover:bg-slate-900/50"
          }`}
        >
          <span className="text-base">🔄</span>
          <span>Round Trip</span>
          {bookingType === "roundtrip" && (
            <span className="absolute -bottom-1 w-6 h-1 bg-amber-300 rounded-full blur-[1px]"></span>
          )}
        </button>
      </div>

      <form onSubmit={handleCalculateSubmit} className="space-y-4 relative">
        
        {/* Route Inputs with Swap Action */}
        <div className="relative space-y-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60">
          
          {/* Pickup Location Input */}
          <div className="relative flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                Pickup Location
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  setShowPickupSuggestions(true);
                }}
                onFocus={() => setShowPickupSuggestions(true)}
                onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                placeholder="Enter pickup city or area..."
                required
                className="w-full bg-slate-900 border border-slate-800/80 rounded-2xl pl-4 pr-10 py-3.5 text-xs font-bold text-white placeholder:text-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none shadow-inner transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">📍</span>
            </div>

            {/* Suggestions Dropdown */}
            {showPickupSuggestions && filteredPickupSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-h-48 overflow-y-auto">
                {filteredPickupSuggestions.map((city, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setPickup(city);
                      setShowPickupSuggestions(false);
                    }}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-orange-600/20 hover:text-orange-300 cursor-pointer border-b border-slate-800/40 last:border-none transition"
                  >
                    📍 {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button Center Divider */}
          <div className="relative flex items-center justify-center my-[-2px] z-10">
            <button
              type="button"
              onClick={handleSwapLocations}
              title="Swap Locations"
              className="bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white p-2 rounded-full border border-slate-700 shadow-md transition-all transform hover:rotate-180 duration-300 group"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* Drop Destination Input */}
          <div className="relative flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                Drop Destination
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                value={drop}
                onChange={(e) => {
                  setDrop(e.target.value);
                  setShowDropSuggestions(true);
                }}
                onFocus={() => setShowDropSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDropSuggestions(false), 200)}
                placeholder="Enter drop city or destination..."
                required
                className="w-full bg-slate-900 border border-slate-800/80 rounded-2xl pl-4 pr-10 py-3.5 text-xs font-bold text-white placeholder:text-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none shadow-inner transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🎯</span>
            </div>

            {/* Suggestions Dropdown */}
            {showDropSuggestions && filteredDropSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-h-48 overflow-y-auto">
                {filteredDropSuggestions.map((city, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setDrop(city);
                      setShowDropSuggestions(false);
                    }}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-amber-600/20 hover:text-amber-300 cursor-pointer border-b border-slate-800/40 last:border-none transition"
                  >
                    🎯 {city}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <span>📅</span> Pickup Date
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-3.5 text-xs font-bold text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <span>⏰</span> Pickup Time
            </label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-3.5 text-xs font-bold text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Round Trip Return Inputs */}
        {bookingType === "roundtrip" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 bg-amber-950/20 p-3.5 rounded-2xl border border-amber-500/30 animate-fadeIn">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <span>🔄</span> Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <span>⏰</span> Return Time
              </label>
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Conversion Trust Strip */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center">
          <div className="bg-slate-950/60 border border-slate-800/50 p-2 rounded-xl">
            <div className="text-[10px] font-black text-orange-400">0% Hidden</div>
            <div className="text-[9px] font-medium text-slate-400">Toll / State Tax Clear</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/50 p-2 rounded-xl">
            <div className="text-[10px] font-black text-emerald-400">Clean Cabs</div>
            <div className="text-[9px] font-medium text-slate-400">Sanitized Daily</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/50 p-2 rounded-xl">
            <div className="text-[10px] font-black text-amber-400">24/7 Support</div>
            <div className="text-[9px] font-medium text-slate-400">On-Trip Assistance</div>
          </div>
        </div>

        {/* Submit Button with High Conversion Styling */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-[length:200%_auto] p-4 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/30 transition-all duration-500 hover:bg-[position:right_center] hover:shadow-orange-600/50 active:scale-[0.98] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Calculating Best Available Fares...</span>
                </>
              ) : (
                <>
                  <span className="text-base group-hover:scale-125 transition-transform duration-300">🔍</span>
                  <span>Explore Cabs & Lowest Fares</span>
                  <span className="text-amber-200 group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </div>
          </button>
        </div>

      </form>
    </div>
  );
}
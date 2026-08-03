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

export default function FareCalculator({ onFareCalculated }: FareCalculatorProps) {
  const [pickup, setPickup] = useState("Korba, Chhattisgarh");
  const [drop, setDrop] = useState("Raipur, Chhattisgarh");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  const [serviceType, setServiceType] = useState<ServiceType>("outstation");
  
  // Date & Time Defaults
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  
  const [pickupDate, setPickupDate] = useState(defaultDateStr);
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnDate, setReturnDate] = useState(defaultDateStr);
  const [returnTime, setReturnTime] = useState("18:00");
  const [loading, setLoading] = useState(false);

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
      let oneWayAvailableCheck = true;

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

        oneWayAvailableCheck = result.isOneWayAvailable;

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl text-left">
      
      {/* Trip Type Tabs */}
      <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
        <button
          type="button"
          onClick={() => setBookingType("oneway")}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            bookingType === "oneway" ? "bg-orange-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
          }`}
        >
          🚗 One Way Trip
        </button>
        <button
          type="button"
          onClick={() => setBookingType("roundtrip")}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            bookingType === "roundtrip" ? "bg-orange-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
          }`}
        >
          🔄 Round Trip
        </button>
      </div>

      <form onSubmit={handleCalculateSubmit} className="space-y-4">
        
        {/* Pickup Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Pickup Location</label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Enter pickup city or area..."
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-xs font-bold text-white focus:border-orange-500 outline-none shadow-inner transition"
          />
        </div>

        {/* Drop Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Drop Destination</label>
          <input
            type="text"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            placeholder="Enter drop city or destination..."
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-xs font-bold text-white focus:border-orange-500 outline-none shadow-inner transition"
          />
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-xs font-bold text-white focus:border-orange-500 outline-none transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Time</label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-xs font-bold text-white focus:border-orange-500 outline-none transition"
            />
          </div>
        </div>

        {/* Round Trip Return Inputs */}
        {bookingType === "roundtrip" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:border-orange-500 outline-none transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Return Time</label>
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:border-orange-500 outline-none transition"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-orange-600/30 transition disabled:opacity-50"
          >
            {loading ? "Calculating Best Fares..." : "🔍 Explore Cabs & Fares"}
          </button>
        </div>

      </form>
    </div>
  );
}
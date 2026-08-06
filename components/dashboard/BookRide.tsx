// components/dashboard/BookRide.tsx
"use client";

import React, { useState } from "react";
import FareCalculator from "@/components/FareCalculator";
import { calculateFare } from "@/lib/fareCalculator";

export default function BookRide({ 
  setPopupData, 
  setSelectedVehicleType, 
  setShowPopup, 
  setShowUserForm 
}: {
  setPopupData: (data: any) => void;
  setSelectedVehicleType: (vType: any) => void;
  setShowPopup: (show: boolean) => void;
  setShowUserForm: (show: boolean) => void;
}) {
  const [isCalculating, setIsCalculating] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0b101d] via-[#131c31] to-[#0b101d] p-6 sm:p-8 shadow-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between border border-slate-800 gap-4">
        <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <span className="bg-orange-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-sm">
            🛡️ 100% SECURE INTERCITY BOOKINGS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">Book Your Intercity Cab</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Enter your route details below to get instant transparent fares with toll & tax included.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-3xl">🚖</span>
          <div className="text-left text-xs">
            <div className="font-black text-white">Live Fleet Allocation</div>
            <div className="text-slate-400">Sedan • Ertiga • Crysta</div>
          </div>
        </div>
      </div>

      {/* Fare Calculator Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-8 shadow-md relative overflow-hidden">
        {isCalculating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-20 flex items-center justify-center">
            <div className="text-orange-600 font-black text-xs uppercase tracking-widest animate-pulse">
              Calculating Best Routes & Fares...
            </div>
          </div>
        )}

        <FareCalculator
          onFareCalculated={(data: any) => {
            if (!data || !data.fareOptions) return;
            setIsCalculating(true);

            try {
              let oneWayAvail = true;
              let baseSingleRouteDist = 150;

              const updatedFareOptions = data.fareOptions.map((opt: any) => {
                const rawDist = opt.billedDistance || 150;
                const baseSingleDist = data.bookingType === "roundtrip" ? Math.round(rawDist / 2) : rawDist;
                baseSingleRouteDist = baseSingleDist;

                const recalculated = calculateFare({
                  distance: baseSingleDist,
                  vehicleType: opt.vehicleType,
                  bookingType: data.bookingType,
                  serviceType: data.serviceType,
                  pickupDate: data.pickupDate,
                  pickupTime: data.pickupTime,
                  returnDate: data.returnDate,
                  returnTime: data.returnTime,
                  drop: data.drop,
                  pickup: data.pickup,
                });

                if (recalculated && typeof recalculated.isOneWayAvailable === "boolean") {
                  oneWayAvail = recalculated.isOneWayAvailable;
                }

                return { 
                  ...opt, 
                  finalFare: recalculated?.finalFare || opt.finalFare, 
                  billedDistance: recalculated?.billedDistance || baseSingleDist, 
                  durationMinutes: recalculated?.durationMinutes || 180 
                };
              });

              const updatedData = {
                ...data,
                fareOptions: updatedFareOptions,
                isOneWayAvailable: oneWayAvail,
                baseDistance: baseSingleRouteDist
              };

              setPopupData(updatedData);
              setSelectedVehicleType("sedan");
              setShowPopup(true);
              setShowUserForm(false);
            } catch (err) {
              console.error("Fare calculation error in BookRide:", err);
            } finally {
              setIsCalculating(false);
            }
          }}
        />
      </div>

      {/* Trust Badges Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
          <span className="text-2xl">⚡</span>
          <div>
            <div className="text-xs font-black text-slate-900">Instant Confirmation</div>
            <div className="text-[10px] text-slate-500">Get driver details via SMS instantly</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
          <span className="text-2xl">🏷️</span>
          <div>
            <div className="text-xs font-black text-slate-900">No Hidden Charges</div>
            <div className="text-[10px] text-slate-500">Toll, State Tax & GST included</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
          <span className="text-2xl">🛡️</span>
          <div>
            <div className="text-xs font-black text-slate-900">Verified Drivers</div>
            <div className="text-[10px] text-slate-500">Experienced outstation chauffeurs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
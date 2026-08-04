"use client";
import React from "react";
import FareCalculator from "@/components/FareCalculator";
import { calculateFare } from "@/lib/fareCalculator";

export default function BookRide({ setPopupData, setSelectedVehicleType, setShowPopup, setShowUserForm }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
      <h2 className="text-xl font-black text-slate-900 mb-4">Book Your Intercity Cab</h2>
      <FareCalculator
        onFareCalculated={(data: any) => {
          let oneWayAvail = true;
          let baseSingleRouteDist = 150;
          const updatedData = {
            ...data,
            fareOptions: data.fareOptions.map((opt: any) => {
              const rawDist = opt.billedDistance;
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
              oneWayAvail = recalculated.isOneWayAvailable;
              return { ...opt, finalFare: recalculated.finalFare, billedDistance: recalculated.billedDistance, durationMinutes: recalculated.durationMinutes };
            }),
            isOneWayAvailable: oneWayAvail,
            baseDistance: baseSingleRouteDist
          };
          setPopupData(updatedData);
          setSelectedVehicleType("sedan");
          setShowPopup(true);
          setShowUserForm(false);
        }}
      />
    </div>
  );
}
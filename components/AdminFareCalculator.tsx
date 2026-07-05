// components/AdminFareCalculator.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  calculateFare, 
  VEHICLES, 
  type VehicleType, 
  type BookingType,
  type ServiceType
} from "../lib/fareCalculator";

export default function AdminFareCalculator() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  const [fuelPrice, setFuelPrice] = useState<number>(100); 
  const [loading, setLoading] = useState(false);
  
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropList, setShowDropList] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [liveApiToll, setLiveTollCost] = useState<number>(0); 
  const [apiDistanceKm, setApiDistanceKm] = useState<number>(0); 

  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);

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

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || !drop.trim() || !pickupDate || !pickupTime) {
      alert("Please enter all required fields including Pickup Date and Time.");
      return;
    }
    if (bookingType === "roundtrip" && (!returnDate || !returnTime)) {
      alert("Return Date and Return Time are mandatory for Round Trip calculation.");
      return;
    }

    setLoading(true);
    let mappedDistance = 150;
    let computedTollFromApi = 0;

    try {
      const response = await fetch("/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin: pickup, destination: drop }),
      });
      const routeData = await response.json();
      if (response.ok) {
        if (routeData.distanceKm) {
          mappedDistance = routeData.distanceKm;
          setApiDistanceKm(routeData.distanceKm); 
        }
        if (routeData.estimatedTollCost) computedTollFromApi = routeData.estimatedTollCost;
      }
    } catch (err) {
      console.error("Toll Map API retrieval bypass active:", err);
    }

    setLiveTollCost(computedTollFromApi);

    const options = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
      // 👑 FIXED: Removed pickupLocation/dropLocation to strictly align with signature schemas
      const res = calculateFare({
        distance: mappedDistance,
        vehicleType: type,
        bookingType,
        serviceType: "outstation",
        pickupDate,
        pickupTime,
        returnDate: bookingType === "roundtrip" ? returnDate : undefined,
        returnTime: bookingType === "roundtrip" ? returnTime : undefined,
      });

      const isPickupDry = ["chirmiri", "baikunthpur", "manendragarh", "ambikapur", "sakti", "kharsia", "kanker", "jagdalpur"].some(kw => pickup.toLowerCase().includes(kw));
      const payoutRatio = (bookingType === "oneway" && isPickupDry) ? 0.68 : 0.82;
      const calculatedB2BPayout = Math.round(res.finalFare * payoutRatio);

      const agencyProfitMargin = res.finalFare - calculatedB2BPayout;
      const totalKilometersRun = bookingType === "oneway" ? mappedDistance * 2 : res.billedDistance;
      
      let vehicleMileage = 24; 
      if (type === "ertiga") vehicleMileage = 15;
      if (type === "crysta") vehicleMileage = 8; 

      const totalFuelExpense = Math.round((totalKilometersRun / vehicleMileage) * fuelPrice);
      const totalDriverSalary = mappedDistance <= 150 ? 400 : 800;
      const totalDriverFooding = mappedDistance <= 150 ? 150 : 300;

      const isOutsideCG = (!pickup.toLowerCase().includes("chhattisgarh") && !pickup.toLowerCase().includes(", cg")) || 
                          (!drop.toLowerCase().includes("chhattisgarh") && !drop.toLowerCase().includes(", cg"));
      
      const totalTollPermitExpense = computedTollFromApi + (isOutsideCG ? 1500 : 0); 

      // Inject halt charges directly from current calculator metrics pipeline
      const totalOwnerExpense = totalFuelExpense + totalDriverSalary + totalDriverFooding + totalTollPermitExpense + res.haltCharges;
      const ownerNetProfit = calculatedB2BPayout - totalOwnerExpense;

      return {
        vehicleType: type,
        vehicleLabel: VEHICLES[type].label,
        limitKms: res.billedDistance, 
        finalFare: res.finalFare,
        b2bPayout: calculatedB2BPayout,
        agencyProfit: agencyProfitMargin, 
        totalKmsRun: totalKilometersRun,
        mileageUsed: vehicleMileage,
        fuelExpense: totalFuelExpense,
        driverSalary: totalDriverSalary,
        driverFooding: totalDriverFooding,
        tollPermit: totalTollPermitExpense,
        haltCharges: res.haltCharges,
        totalOwnerExpense,
        ownerNetProfit
      };
    });

    setResults(options);
    setExpandedVehicle(null);
    setLoading(false);
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-3xl text-slate-100 text-left">
      <h2 className="text-sm font-black mb-4 text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
        📊 LIVE SUPPLY CALCULATION & FLEET OWNER MARGIN DESK
      </h2>
      
      <form onSubmit={handleCalculate} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative" ref={pickupRef}>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">📍 Live Pickup Search</label>
            <input type="text" placeholder="Search pickup point..." value={pickup} onChange={(e) => { setPickup(e.target.value); fetchLiveSuggestions(e.target.value, "pickup"); }} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-indigo-500" />
            {showPickupList && pickupSuggestions.length > 0 && (
              <ul className="absolute left-0 w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto z-50 divide-y divide-slate-800">
                {pickupSuggestions.map((item, idx) => (
                  <li key={idx} onClick={() => { setPickup(item); setShowPickupList(false); }} className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white cursor-pointer">{item}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative" ref={dropRef}>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">🏁 Live Drop Search</label>
            <input type="text" placeholder="Search drop destination..." value={drop} onChange={(e) => { setDrop(e.target.value); fetchLiveSuggestions(e.target.value, "drop"); }} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-indigo-500" />
            {showDropList && dropSuggestions.length > 0 && (
              <ul className="absolute left-0 w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto z-50 divide-y divide-slate-800">
                {dropSuggestions.map((item, idx) => (
                  <li key={idx} onClick={() => { setDrop(item); setShowDropList(false); }} className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white cursor-pointer">{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">🔄 Trip Type</label>
            <select value={bookingType} onChange={(e) => setBookingType(e.target.value as BookingType)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-sm font-bold text-white focus:outline-none">
              <option value="oneway">One Way Run</option>
              <option value="roundtrip">Round Trip</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 tracking-wider mb-1 uppercase">📅 Pickup Date *</label>
            <input required type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 tracking-wider mb-1 uppercase">⏱️ Pickup Time *</label>
            <input required type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none" />
          </div>
        </div>

        {/* Dynamic Return inputs rows rendering exclusively inside round trip settings */}
        {bookingType === "roundtrip" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideDown">
            <div>
              <label className="block text-xs font-black text-orange-400 tracking-wider mb-1 uppercase">📅 Return Date *</label>
              <input required type="date" min={pickupDate} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-slate-950 border border-orange-900 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-black text-orange-400 tracking-wider mb-1 uppercase">⏱️ Return Time *</label>
              <input required type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full bg-slate-950 border border-orange-900 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 items-end pt-2">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">HN Fuel Rate (₹/Ltr) *</label>
            <input required type="number" placeholder="e.g. 102" value={fuelPrice || ""} onChange={(e) => setFuelPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-[#d8551b] text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-60">
            {loading ? "🔄 Verification Active..." : "🚀 Calculate Fare Pass"}
          </button>
        </div>
      </form>

      {/* Pop-up Dashboard Sheet */}
      {results && (
        <div className="mt-4 border border-slate-800 rounded-2xl bg-slate-950/40 p-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-800 pb-3 mb-4 gap-2">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wide">
                📋 Operator Control Matrix: <span className="text-orange-400 font-extrabold">{pickup.split(',')[0]} ➔ {drop.split(',')[0]}</span>
              </h3>
              <div className="flex gap-4 text-[11px] text-slate-400 mt-1 font-bold">
                <p>🛣️ Map Distance: <span className="text-white font-black">{apiDistanceKm} KM</span></p>
                <p>📡 Live Route Toll: <span className="text-emerald-400 font-black">₹{liveApiToll.toLocaleString("en-IN")}</span></p>
                <p>⛽ Fuel Rate: <span className="text-orange-400 font-black">₹{fuelPrice}/Ltr</span></p>
              </div>
            </div>
            <button onClick={() => setResults(null)} className="text-xs text-slate-500 hover:text-slate-300 font-bold bg-slate-900 h-fit px-2.5 py-1 rounded-lg">✕ Clear Desk</button>
          </div>
          
          <div className="space-y-3">
            {results.map((row, idx) => {
              const isExpanded = expandedVehicle === row.vehicleType;
              return (
                <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/80 shadow-sm">
                  <div 
                    onClick={() => setExpandedVehicle(isExpanded ? null : row.vehicleType)}
                    className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="text-left flex-grow">
                      <span className="text-white font-black text-sm block">{row.vehicleLabel}</span>
                      <span className="text-[10px] text-slate-500 font-bold">Billed Slab Allowance: {row.limitKms} KM Included</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold shrink-0 text-left lg:text-right">
                      <div>
                        <span className="block text-[9px] text-slate-400 uppercase">Customer Fare</span>
                        <span className="text-emerald-400 font-black text-sm">₹{row.finalFare.toLocaleString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-400 uppercase">Vendor Payout</span>
                        <span className="text-indigo-400 font-black text-sm">₹{row.b2bPayout.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <span className="block text-[9px] text-slate-400 uppercase">Owner Cash Profit</span>
                        <span className={`font-black text-sm ${row.ownerNetProfit > 0 ? "text-orange-500" : "text-red-400"}`}>
                          ₹{row.ownerNetProfit.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="text-slate-600 text-xs pl-2">{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Hidden Sub-Card Expense Breakdown Sheet */}
                  {isExpanded && (
                    <div className="bg-slate-900/60 border-t border-slate-800/80 p-4 text-xs font-bold text-slate-400 space-y-2.5 text-left">
                      <div className="text-[10px] text-orange-400 font-black uppercase tracking-wider mb-1">⛽ Real Costing Analysis (One-Way Empty Return Accounted)</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                        <div>
                          <span className="text-[9px] block text-slate-500">1. FUEL COST</span>
                          <span className="text-white font-black">₹{row.fuelExpense.toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-[9px] block text-slate-500">2. DRIVER SALARY</span>
                          <span className="text-white font-black">₹{row.driverSalary.toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-[9px] block text-slate-500">3. DRIVER FOODING</span>
                          <span className="text-white font-black">₹{row.driverFooding.toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-[9px] block text-slate-500">4. TOLLS & HAULT CHARGES</span>
                          <span className="text-white font-black">₹{(row.tollPermit + row.haltCharges).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-1 text-slate-300">
                        <span>Total Pocket Operational Cost Structure:</span>
                        <span className="text-white font-black">₹{row.totalOwnerExpense.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-dashed border-slate-800 pt-2 text-sm">
                        <span className="text-slate-200">Gaadi Maalik Ka Pure Profit:</span>
                        <span className="text-orange-500 font-black text-base">₹{row.ownerNetProfit.toLocaleString("en-IN")} Clear Profit</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
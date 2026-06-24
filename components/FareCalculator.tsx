"use client";

import { useEffect, useMemo, useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import {
  calculateFare,
  formatCurrency,
  getPricingModeLabel,
  getVehicleImage,
  getVehicleLabel,
  type BookingType,
  type VehicleType,
  VEHICLES,
} from "@/lib/fareCalculator";

const libraries: ("places")[] = ["places"];

type StopItem = { id: string; value: string };
type FareOption = {
  id: string;
  vehicleType: VehicleType;
  vehicleLabel: string;
  vehicleImage: string;
  baseFareWithoutAddons: number;
  finalFare: number;
  strikeFare: number;
  fareText: string;
  strikeText: string;
  pricingModeLabel: string;
  billedDistance: number;
  calculatedDayHaltCharges: number;
  calculatedNightCharges: number;
  nightChargePercentageApplied: number;
  expectedReachTimeText: string;
  stopManagementCharge: number;
};

type FareCalculatorProps = {
  onFareCalculated: (data: {
    fareOptions: FareOption[];
    pickup: string;
    drop: string;
    bookingType: BookingType;
    pickupDate: string;
    pickupTime: string;
    stopsCount: number;
    stopsListText: string;
    tripDays: number;
  }) => void;
};

export default function FareCalculator({ onFareCalculated }: FareCalculatorProps) {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [stops, setStops] = useState<StopItem[]>([]);
  const [newStop, setNewStop] = useState("");

  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [dropAutocomplete, setDropAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [stopAutocomplete, setStopAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [loading, setLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    const now = new Date();
    setPickupDate(now.toISOString().split("T")[0]);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setReturnDate(tomorrow.toISOString().split("T")[0]);
    setPickupTime("09:00");
    setReturnTime("21:00");
  }, []);

  const visibleVehicleKeys = useMemo(
    () => (bookingType === "oneway" ? (["sedan", "ertiga"] as VehicleType[]) : (["sedan", "ertiga", "innova", "crysta", "scorpio"] as VehicleType[])),
    [bookingType]
  );

  const canAddStop = bookingType !== "local" && pickup.trim().length > 0 && drop.trim().length > 0;

  const getTripDays = () => {
    if (bookingType !== "roundtrip") return 1;
    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 1;
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const calculateReachTime = (routeDistanceKm: number) => {
    if (!pickupDate || !pickupTime || routeDistanceKm <= 0) return "N/A";
    const [hours, minutes] = pickupTime.split(":").map(Number);
    const totalDurationMinutes = Math.round((routeDistanceKm / 60) * 60) + 45;
    const targetDate = new Date(`${pickupDate}T00:00:00`);
    targetDate.setHours(hours, minutes + totalDurationMinutes, 0, 0);

    const formattedTime = `${String(targetDate.getHours()).padStart(2, "0")}:${String(targetDate.getMinutes()).padStart(2, "0")} Hrs`;
    const dateOptions: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    const dayOptions: Intl.DateTimeFormatOptions = { weekday: "short" };
    const dateStr = targetDate.toLocaleDateString("en-IN", dateOptions).replace(/\//g, "-");
    const dayStr = targetDate.toLocaleDateString("en-IN", dayOptions);

    return `${formattedTime} on ${dateStr} (${dayStr})`;
  };

  const addStop = () => {
    if (!canAddStop || !newStop.trim()) return;
    setStops((prev) => [...prev, { id: `${Date.now()}-${prev.length}`, value: newStop.trim() }]);
    setNewStop("");
  };

  const removeStop = (id: string) => setStops((prev) => prev.filter((item) => item.id !== id));

  const handleCheckBestFare = async () => {
    if (!pickup.trim() || (bookingType !== "local" && !drop.trim())) {
      alert("कृपया आवश्यक लोकेशंस दर्ज करें।");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin: pickup, destination: drop, stops: stops.map(s => s.value) }),
      });
      const data = await response.json();
      const baseDistance = data?.distanceKm || 120; 

      const tripDays = getTripDays();
      const arrivalText = calculateReachTime(baseDistance);

      const options: FareOption[] = visibleVehicleKeys.map((vehicleType) => {
        const baseResult = calculateFare({
          distance: baseDistance,
          vehicleType,
          bookingType,
          tripDays,
          stopCount: stops.length,
          pickupTime: pickupTime,
        });

        const vConfig = VEHICLES[vehicleType];
        let nightAllowanceCost = 0;
        let dayHaltCost = 0;
        let nightChargePercentage = 0;

        const [hours] = pickupTime.split(":").map(Number);
        const isDayTime = hours >= 5 && hours < 22;

        if (bookingType === "oneway" && !isDayTime) {
          nightChargePercentage = 10;
          nightAllowanceCost = Math.round(baseResult.finalFare * 0.10);
        } else if (bookingType === "roundtrip") {
          dayHaltCost = vConfig.dayHalt * tripDays;
          nightAllowanceCost = vConfig.nightHalt * tripDays;
        }

        const netPayable = baseResult.finalFare + (bookingType === "roundtrip" ? 0 : nightAllowanceCost);
        const netStrike = baseResult.strikeFare + (bookingType === "roundtrip" ? 0 : nightAllowanceCost);

        return {
          id: `${bookingType}-${vehicleType}`,
          vehicleType,
          vehicleLabel: getVehicleLabel(vehicleType),
          vehicleImage: getVehicleImage(vehicleType),
          baseFareWithoutAddons: baseResult.finalFare - baseResult.stopCharge,
          finalFare: netPayable,
          strikeFare: netStrike,
          fareText: formatCurrency(netPayable),
          strikeText: formatCurrency(netStrike),
          pricingModeLabel: getPricingModeLabel(baseResult.pricingMode),
          billedDistance: baseResult.billedDistance,
          calculatedDayHaltCharges: dayHaltCost,
          calculatedNightCharges: nightAllowanceCost,
          nightChargePercentageApplied: nightChargePercentage,
          expectedReachTimeText: arrivalText,
          stopManagementCharge: baseResult.stopCharge
        };
      });

      onFareCalculated({
        fareOptions: options.sort((a, b) => a.finalFare - b.finalFare),
        pickup,
        drop: bookingType === "local" ? "Local Operational Limit Run" : drop,
        bookingType,
        pickupDate,
        pickupTime,
        stopsCount: stops.length,
        stopsListText: stops.map(s => s.value.split(',')[0]).join(" ➔ "),
        tripDays
      });

    } catch (e) {
      alert("Error processing location matrices.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-xl shadow-slate-100/50 space-y-5">
      
      {/* 👑 Selector Switcher Tabs 👑 */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-2xl gap-1 border border-slate-200/30">
        {(["oneway", "roundtrip", "local"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => { setBookingType(type); setStops([]); setNewStop(""); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all duration-300 ${
              bookingType === type 
                ? "bg-gradient-to-r from-[#c2511b] to-[#dc682a] text-white shadow-md shadow-orange-700/20 scale-[1.02]" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <span className="text-base">
              {type === "oneway" ? "➔" : type === "roundtrip" ? "📅" : "📍"}
            </span>
            {type === "oneway" ? "One Way" : type === "roundtrip" ? "Round Trip" : "Local Pack"}
          </button>
        ))}
      </div>

      {/* Input Locations Fields Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="group bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left transition-all duration-200 focus-within:border-[#c2511b] focus-within:bg-white focus-within:shadow-md focus-within:shadow-orange-500/5">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-[#c2511b]">
            From Location *
          </label>
          <div className="flex items-center gap-2.5 mt-2">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            {isLoaded ? (
              <Autocomplete onLoad={setPickupAutocomplete} onPlaceChanged={() => setPickup(pickupAutocomplete?.getPlace().formatted_address || "")} className="w-full">
                <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Enter pickup city or terminal" className="w-full bg-transparent text-sm font-bold outline-none text-slate-800 placeholder-slate-400" />
              </Autocomplete>
            ) : (
              <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Loading services..." className="w-full bg-transparent text-sm font-bold outline-none" disabled />
            )}
          </div>
        </div>

        {bookingType !== "local" && (
          <div className="group bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left transition-all duration-200 focus-within:border-[#c2511b] focus-within:bg-white focus-within:shadow-md focus-within:shadow-orange-500/5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-[#c2511b]">
              To Destination *
            </label>
            <div className="flex items-center gap-2.5 mt-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </div>
              {isLoaded ? (
                <Autocomplete onLoad={setDropAutocomplete} onPlaceChanged={() => setDrop(dropAutocomplete?.getPlace().formatted_address || "")} className="w-full">
                  <input value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="Enter destination city" className="w-full bg-transparent text-sm font-bold outline-none text-slate-800 placeholder-slate-400" />
                </Autocomplete>
              ) : (
                <input value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="Loading services..." className="w-full bg-transparent text-sm font-bold outline-none" disabled />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Loops Stoppage Multi-stops Panel */}
      {canAddStop && (
        <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
          <div className="flex gap-2">
            {isLoaded ? (
              <Autocomplete onLoad={setStopAutocomplete} onPlaceChanged={() => setNewStop(stopAutocomplete?.getPlace().formatted_address || "")} className="flex-1">
                <input value={newStop} onChange={(e) => setNewStop(e.target.value)} placeholder="Add Route Stop (e.g. Raigarh, Bilaspur...)" className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-slate-400 transition-colors" />
              </Autocomplete>
            ) : (
              <input value={newStop} onChange={(e) => setNewStop(e.target.value)} placeholder="Loading autocomplete..." className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none" disabled />
            )}
            <button type="button" onClick={addStop} className="bg-slate-900 text-white font-extrabold text-xs px-4 rounded-xl hover:bg-slate-800 transition-colors shadow-sm active:scale-95">
              + Add
            </button>
          </div>
          {stops.length > 0 && (
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar pt-1">
              {stops.map((s, idx) => (
                <span key={s.id} className="bg-white border border-slate-200/80 text-[11px] font-bold text-slate-700 px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 animate-fadeIn">
                  <span className="text-orange-600">🛑 Stop {idx + 1}:</span> {s.value.split(",")[0]}
                  <button type="button" onClick={() => removeStop(s.id)} className="text-slate-400 font-extrabold hover:text-rose-600 ml-1 transition-colors text-xs">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Date & Time Parameters Grids */}
      <div className={`grid gap-4 ${bookingType === "roundtrip" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2"}`}>
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-left focus-within:border-slate-300 transition-colors">
          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Pickup Date</label>
          <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-1 text-slate-800" />
        </div>
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-left focus-within:border-slate-300 transition-colors">
          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Pickup Time</label>
          <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-1 text-slate-800" />
        </div>
        {bookingType === "roundtrip" && (
          <>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-left focus-within:border-slate-300 transition-colors">
              <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Return Date</label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-1 text-slate-800" />
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-left focus-within:border-slate-300 transition-colors">
              <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Return Time</label>
              <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-1 text-slate-800" />
            </div>
          </>
        )}
      </div>

      {/* Main Submit CTA Button */}
      <button 
        type="button" 
        onClick={handleCheckBestFare} 
        disabled={loading} 
        className="w-full rounded-2xl bg-gradient-to-r from-[#c2511b] to-[#e45f1e] hover:from-[#a54314] hover:to-[#c2511b] text-white py-4 text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg shadow-orange-700/10 hover:shadow-xl hover:shadow-orange-700/20 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying Route Mileage...
          </>
        ) : (
          "🔍 Compare Verified Fleet Fares"
        )}
      </button>
    </div>
  );
}
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

        const netPayable = baseResult.finalFare + nightAllowanceCost + dayHaltCost;
        const netStrike = baseResult.strikeFare + nightAllowanceCost + dayHaltCost;

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
    <div className="space-y-3.5">
      
      {/* 👑 RESTORED: One-Way, Round Trip & Local Selection Switcher Tabs 👑 */}
      <div className="flex justify-center gap-2 mb-4 border-b border-slate-100 pb-2.5">
        {(["oneway", "roundtrip", "local"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => { setBookingType(type); setStops([]); setNewStop(""); }}
            className={`px-4 py-2 text-xs font-black rounded-xl border transition-all ${
              bookingType === type 
                ? "bg-[#c2511b] border-[#c2511b] text-white shadow-md shadow-orange-700/20" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {type === "oneway" ? "➔ One Way" : type === "roundtrip" ? "📅 Round Trip" : "📍 Local Pack"}
          </button>
        ))}
      </div>

      {/* Input Locations Fields layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl border border-slate-200/60 px-3.5 py-2 text-left">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">From Location *</label>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-emerald-500 text-xs">🟢</span>
            {isLoaded ? (
              <Autocomplete onLoad={setPickupAutocomplete} onPlaceChanged={() => setPickup(pickupAutocomplete?.getPlace().formatted_address || "")} className="w-full">
                <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Pickup city or terminal" className="w-full bg-transparent text-sm font-bold outline-none text-slate-800" />
              </Autocomplete>
            ) : (
              <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Loading..." className="w-full bg-transparent text-sm font-bold outline-none" />
            )}
          </div>
        </div>

        {bookingType !== "local" && (
          <div className="bg-slate-50 rounded-xl border border-slate-200/60 px-3.5 py-2 text-left">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">To Destination *</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-rose-500 text-xs">🔴</span>
              {isLoaded ? (
                <Autocomplete onLoad={setDropAutocomplete} onPlaceChanged={() => setDrop(dropAutocomplete?.getPlace().formatted_address || "")} className="w-full">
                  <input value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="Drop destination city" className="w-full bg-transparent text-sm font-bold outline-none text-slate-800" />
                </Autocomplete>
              ) : (
                <input value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="Loading..." className="w-full bg-transparent text-sm font-bold outline-none" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Loops Stoppage Multi-stops Panel */}
      {canAddStop && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-2">
          <div className="flex gap-2">
            {isLoaded ? (
              <Autocomplete onLoad={setStopAutocomplete} onPlaceChanged={() => setNewStop(stopAutocomplete?.getPlace().formatted_address || "")} className="flex-1">
                <input value={newStop} onChange={(e) => setNewStop(e.target.value)} placeholder="Add Route Loop Stop (Raigarh, Puri...)" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none" />
              </Autocomplete>
            ) : (
              <input value={newStop} onChange={(e) => setNewStop(e.target.value)} placeholder="Loading autocomplete..." className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none" />
            )}
            <button type="button" onClick={addStop} className="bg-slate-800 text-white font-black text-xs px-3.5 rounded-lg hover:bg-slate-900 transition-colors">+ Add Stop</button>
          </div>
          {stops.length > 0 && (
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pt-0.5">
              {stops.map((s, idx) => (
                <span key={s.id} className="bg-white border text-[10px] font-bold text-slate-700 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  🛑 Stop {idx + 1}: {s.value.split(",")[0]}
                  <button type="button" onClick={() => removeStop(s.id)} className="text-rose-500 font-black hover:text-rose-700 ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Date & Time parameters grids */}
      <div className={`grid gap-3 ${bookingType === "roundtrip" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2"}`}>
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-left">
          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Pickup Date</label>
          <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-0.5" />
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-left">
          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Pickup Time</label>
          <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-0.5" />
        </div>
        {bookingType === "roundtrip" && (
          <>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-left">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Return Date</label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-0.5" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-left">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Return Time</label>
              <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-0.5" />
            </div>
          </>
        )}
      </div>

      <button type="button" onClick={handleCheckBestFare} disabled={loading} className="w-full rounded-2xl bg-[#c2511b] hover:bg-[#a54314] text-white py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
        {loading ? "Verifying Route Mileage..." : "🔍 Compare Verified Fleet Fares"}
      </button>
    </div>
  );
}
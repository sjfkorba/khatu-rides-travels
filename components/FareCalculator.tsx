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
const ADMIN_WHATSAPP_NUMBER = "919244137353";

const ALL_VEHICLE_KEYS: VehicleType[] = ["sedan", "ertiga", "innova", "crysta", "scorpio"];
const ONE_WAY_VEHICLE_KEYS: VehicleType[] = ["sedan", "ertiga"];

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
};

export default function HomeFareCalculator() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [dropAutocomplete, setDropAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fareOptions, setFareOptions] = useState<FareOption[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!showPopup) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [showPopup]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    return `${mins}:${(secs % 60).toString().padStart(2, "0")}`;
  };

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
    () => (bookingType === "oneway" ? ONE_WAY_VEHICLE_KEYS : ALL_VEHICLE_KEYS),
    [bookingType]
  );

  const cheapestFare = useMemo(() => fareOptions.length ? Math.min(...fareOptions.map((i) => i.finalFare)) : null, [fareOptions]);

  const getTripDays = () => {
    if (bookingType !== "roundtrip") return 1;
    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 1;
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const isNightTimeSlot = useMemo(() => {
    if (!pickupTime) return false;
    const [hours] = pickupTime.split(":").map(Number);
    return hours >= 22 || hours < 5;
  }, [pickupTime]);

  const calculateReachTime = (routeDistanceKm: number) => {
    if (!pickupTime || routeDistanceKm <= 0) return "N/A";
    const [hours, minutes] = pickupTime.split(":").map(Number);
    const totalDurationMinutes = Math.round((routeDistanceKm / 60) * 60) + 45;
    const targetDate = new Date();
    targetDate.setHours(hours, minutes + totalDurationMinutes, 0, 0);
    return `${String(targetDate.getHours()).padStart(2, "0")}:${String(targetDate.getMinutes()).padStart(2, "0")} Hrs`;
  };

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
        body: JSON.stringify({ origin: pickup, destination: drop, stops: [] }),
      });
      const data = await response.json();
      const baseDistance = data?.distanceKm || 120; 

      const totalCalculatedDistance = bookingType === "roundtrip" ? baseDistance * 2 : baseDistance;
      setDistance(totalCalculatedDistance);
      const tripDays = getTripDays();
      const arrivalText = calculateReachTime(baseDistance);

      const options: FareOption[] = visibleVehicleKeys.map((vehicleType) => {
        const baseResult = calculateFare({
          distance: baseDistance,
          vehicleType,
          bookingType,
          tripDays,
          stopCount: 0,
        });

        const vConfig = VEHICLES[vehicleType];
        let nightAllowanceCost = 0;
        let dayHaltCost = 0;
        let nightChargePercentage = 0;

        if (bookingType === "oneway" && isNightTimeSlot) {
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
          baseFareWithoutAddons: baseResult.finalFare,
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
        };
      });

      setFareOptions(options.sort((a, b) => a.finalFare - b.finalFare));
      setShowPopup(true);
    } catch (e) {
      alert("Error calculating pricing routing matrices.");
    } finally {
      setLoading(false);
    }
  };

  const getWhatsappUrl = (option: FareOption) => {
    const textMessage =
      `Hello Khatu Rides, Book my cab instant slot:\n\n` +
      `📍 From: ${pickup}\n` +
      `🏁 To: ${drop}\n` +
      `🔄 Mode: ${bookingType.toUpperCase()}\n` +
      `🚘 Vehicle: ${option.vehicleLabel}\n` +
      `🛣️ Total Distance: ${option.billedDistance} KM Included\n` +
      `💰 NET Payable Fare: ${option.fareText} (Toll Included)\n\n` +
      `Please lock driver assignment right away.`;
    return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(textMessage)}`;
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 md:p-6 border border-slate-200/80 shadow-xl text-slate-800">
      
      {/* 1. Booking Mode Switcher Tabs */}
      <div className="flex justify-center gap-2 mb-5 border-b border-slate-100 pb-3">
        {(["oneway", "roundtrip", "local"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => { setBookingType(type); }}
            className={`px-4 py-2.5 text-xs font-black rounded-xl border transition-all ${
              bookingType === type ? "bg-[#c2511b] border-[#c2511b] text-white shadow-md shadow-orange-700/20" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {type === "oneway" ? "➔ One Way" : type === "roundtrip" ? "📅 Round Trip" : "📍 Local Pack"}
          </button>
        ))}
      </div>

      {/* 2. Controls Grid Layout */}
      <div className="space-y-4">
        <div className={`grid gap-4 ${bookingType === "local" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
          <div className="bg-slate-50 rounded-2xl border border-slate-200/60 px-4 py-2.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">From Location *</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-emerald-500 text-xs">🟢</span>
              {isLoaded ? (
                <Autocomplete onLoad={setPickupAutocomplete} onPlaceChanged={() => setPickup(pickupAutocomplete?.getPlace().formatted_address || "")} className="w-full">
                  <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Pickup city, terminal or airport" className="w-full bg-transparent text-sm font-bold outline-none text-slate-800" />
                </Autocomplete>
              ) : (
                <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Loading location matrix..." className="w-full bg-transparent text-sm font-bold outline-none" />
              )}
            </div>
          </div>

          {bookingType !== "local" && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 px-4 py-2.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">To Destination *</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-rose-500 text-xs">🔴</span>
                {isLoaded ? (
                  <Autocomplete onLoad={setDropAutocomplete} onPlaceChanged={() => setDrop(dropAutocomplete?.getPlace().formatted_address || "")} className="w-full">
                    <input value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="Drop terminal, landmark or zone" className="w-full bg-transparent text-sm font-bold outline-none text-slate-800" />
                  </Autocomplete>
                ) : (
                  <input value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="Loading location matrix..." className="w-full bg-transparent text-sm font-bold outline-none" />
                )}
              </div>
            </div>
          )}
        </div>

        <div className={`grid gap-4 ${bookingType === "roundtrip" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2"}`}>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Pickup Date</label>
            <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-0.5" />
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Pickup Time</label>
            <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-0.5" />
          </div>
          {bookingType === "roundtrip" && (
            <>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Return Date</label>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-0.5" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Return Time</label>
                <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none mt-0.5" />
              </div>
            </>
          )}
        </div>

        <button type="button" onClick={handleCheckBestFare} disabled={loading} className="w-full rounded-2xl bg-[#c2511b] hover:bg-[#a54314] text-white py-4 text-sm font-black uppercase tracking-wider shadow-md hover:shadow-xl transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? "Verifying Route Mileage..." : "🔍 Get Best Fare Rates"}
        </button>
      </div>

      {/* 3. POPUP MODAL */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-2 md:p-4 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100">
            
            {/* Urgent top counter */}
            <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 flex items-center justify-between text-xs font-bold text-amber-900">
              <div className="flex items-center gap-1.5 animate-pulse">
                <span>⚡</span>
                <span>Special Authority Fleet Group Rate Locked! Valid for: {formatTimer(timeLeft)} mins.</span>
              </div>
              <button type="button" onClick={() => setShowPopup(false)} className="text-slate-400 hover:text-slate-600 font-bold bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">✕ Close</button>
            </div>

            {/* List Array Scroller Box */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 bg-slate-50/50">
              {fareOptions.map((option) => {
                const isBest = cheapestFare === option.finalFare;
                const vConfig = VEHICLES[option.vehicleType];
                const days = getTripDays();

                return (
                  <div
                    key={option.id}
                    className={`bg-white border rounded-2xl p-4 flex flex-col md:flex-row gap-5 items-stretch relative transition-all ${
                      isBest ? "border-orange-500 shadow-md bg-gradient-to-r from-orange-50/10 to-white" : "border-slate-200 shadow-sm"
                    }`}
                  >
                    
                    {/* Left Frame Profile */}
                    <div className="w-full md:w-1/3 flex md:flex-col items-center justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-4 gap-3">
                      <div className="text-left md:text-center">
                        <h3 className="text-base font-black text-slate-900 leading-tight">{option.vehicleLabel}</h3>
                        <div className="mt-1 inline-flex items-center gap-1 bg-gradient-to-r from-slate-800 to-slate-950 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                          👑 Premium State Fleet
                        </div>
                      </div>
                      <div className="bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-xl p-2 w-24 h-16 md:w-full md:h-28 flex justify-center border border-slate-200/50 shadow-inner">
                        <img src={option.vehicleImage} alt={option.vehicleLabel} className="object-contain filter drop-shadow" />
                      </div>
                    </div>

                    {/* Middle Parameters Grid Frame */}
                    <div className="flex-1 flex flex-col justify-between gap-3">
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] sm:text-xs font-bold text-slate-600">
                        <div className="flex items-center gap-1.5"><span>📅</span><span>{pickupDate}</span></div>
                        <div className="flex items-center gap-1.5"><span>👤</span><span className="text-slate-900">Verified Professional Driver</span></div>
                        <div className="flex items-center gap-1.5"><span>🕒</span><span>{pickupTime} Hrs Departure</span></div>
                        <div className="flex items-center gap-1.5 text-emerald-600"><span>✓</span><span>Toll Taxes Fully Included</span></div>
                        
                        {/* Reach Time Badge */}
                        {bookingType !== "local" && (
                          <div className="col-span-2 bg-slate-900 text-white rounded-xl p-2.5 flex items-center justify-between border border-slate-800 shadow-inner">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400">⏱️ Est Reach Window:</span>
                            <span className="text-xs font-black text-amber-400 bg-white/10 px-2 py-0.5 rounded border border-white/10">{option.expectedReachTimeText}</span>
                          </div>
                        )}

                        <div className="col-span-2 flex items-start gap-1 bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-700 text-[11px]">
                          <span className="text-orange-500">📍</span>
                          <span className="truncate max-w-[280px] sm:max-w-[420px] font-semibold">
                            {pickup.split(",")[0]} ➔ {drop.split(",")[0] || "Local Packages"}
                          </span>
                        </div>
                      </div>

                      {/* Explicit Mileage Caps Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm">
                          🛞 Included Route Cap: {option.billedDistance} KM
                        </span>
                        <span className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm">
                          💸 Overextension Rate: {vConfig.extraPerKm}₹/KM
                        </span>
                        {bookingType === "roundtrip" && (
                          <span className="bg-orange-50 border border-orange-100 text-orange-700 text-[10px] font-black px-2.5 py-1 rounded-md">
                            ⏳ {days} Days Service Frame
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Invoice Grid Frame */}
                    <div className="w-full md:w-1/3 flex flex-col justify-between items-stretch md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                      <div className="text-left md:text-right w-full">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Net Payable Total Fare</div>
                        <div className="flex items-baseline md:justify-end gap-1.5 mt-0.5">
                          <span className="text-slate-400 text-xs line-through font-bold">{option.strikeText}</span>
                          <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{option.fareText}</span>
                        </div>
                      </div>

                      {/* Calculation Matrix Breakdown Sheet */}
                      <div className="w-full bg-slate-50 border border-dashed border-slate-200 rounded-xl p-2.5 my-2 text-[10px] sm:text-[11px] font-bold text-slate-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Route Base Fare {bookingType === "roundtrip" && `(${option.billedDistance} KM)`}</span>
                          <span className="text-slate-800">{formatCurrency(option.baseFareWithoutAddons)}</span>
                        </div>

                        {bookingType === "oneway" && option.calculatedNightCharges > 0 && (
                          <div className="flex justify-between text-indigo-600 bg-indigo-50/50 px-1 py-0.5 rounded border border-dashed border-indigo-200">
                            <span>Night Journey Allowance (+10%)</span>
                            <span>+{formatCurrency(option.calculatedNightCharges)}</span>
                          </div>
                        )}

                        {bookingType === "roundtrip" && (
                          <div className="bg-orange-50/30 border border-dashed border-orange-200 p-1.5 rounded space-y-1 text-[10px]">
                            <div className="flex justify-between text-slate-600">
                              <span>Driver Outstation Halt ({days} Days)</span>
                              <span>+{formatCurrency(option.calculatedDayHaltCharges)}</span>
                            </div>
                            <div className="flex justify-between text-indigo-600">
                              <span>Night Stay Allowance ({days} Nights)</span>
                              <span>+{formatCurrency(option.calculatedNightCharges)}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between border-t border-slate-200 pt-1 font-black text-slate-900 text-[11px]">
                          <span>Net Payable Cost</span>
                          <span className="text-[#c2511b]">{option.fareText}</span>
                        </div>
                      </div>

                      <a
                        href={getWhatsappUrl(option)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#c2511b] hover:bg-[#a34213] px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all group"
                      >
                        <span>⚡ Lock Branded Fleet Instantly</span>
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="bg-slate-900 text-slate-400 px-4 py-3 border-t text-center text-[10px] sm:text-[11px] font-bold flex flex-wrap gap-2 justify-center items-center">
              <span className="text-amber-400">🤝 Network Scope:</span>
              <span>Zero Advance Payment</span>
              <span>•</span>
              <span>35+ Operator Cars In Active Grid</span>
              <span>•</span>
              <span>Pay directly to driver post drop</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
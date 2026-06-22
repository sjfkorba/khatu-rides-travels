"use client";

import { useEffect, useMemo, useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import {
  calculateFare,
  formatCurrency,
  getPricingModeLabel,
  getVehicleLabel,
  VEHICLES,
  type BookingType,
  type VehicleType,
  type PricingMode,
} from "@/lib/fareCalculator";

const libraries: ("places")[] = ["places"];
const ADMIN_WHATSAPP_NUMBER = "919244137353";

const ALL_VEHICLE_KEYS: VehicleType[] = [
  "sedan",
  "ertiga",
  "innova",
  "crysta",
  "scorpio",
];

const ONE_WAY_VEHICLE_KEYS: VehicleType[] = ["sedan", "ertiga"];

function normalizeLocation(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

const routeDistanceMap: Record<string, number> = {
  "raipur-korba": 220,
  "korba-raipur": 220,
  "raipur-bilaspur": 140,
  "bilaspur-raipur": 140,
  "raipur-raigarh": 255,
  "raigarh-raipur": 255,
  "korba-bilaspur": 95,
  "bilaspur-korba": 95,
};

function estimateDistance(pickup: string, drop: string) {
  const from = normalizeLocation(pickup);
  const to = normalizeLocation(drop);

  if (!from || !to) return 0;

  const exactKey = `${from}-${to}`;
  if (routeDistanceMap[exactKey]) return routeDistanceMap[exactKey];
  if (from === to) return 10;

  return 150;
}

type FareOption = {
  id: string;
  vehicleType: VehicleType;
  vehicleLabel: string;
  finalFare: number;
  fareText: string;
  baseFareUsed: number;
  rateUsed: number;
  pricingMode: PricingMode;
  pricingModeLabel: string;
  extraRate: number;
  totalNightHaltCost: number;
  nightHaltDays: number;
  billedDistance: number;
  extraDistance: number;
  actualDistance: number;
  shortRuleApplied: boolean;
  grandTotal: number;
  grandTotalText: string;
  remarks: string[];
};

export default function HomeFareCalculator() {
  const [pickupAutocomplete, setPickupAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [dropAutocomplete, setDropAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [phone, setPhone] = useState("");

  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  const [distance, setDistance] = useState(0);
  const [reachTime, setReachTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [fareOptions, setFareOptions] = useState<FareOption[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setPickupDate(`${yyyy}-${mm}-${dd}`);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tyyyy = tomorrow.getFullYear();
    const tmm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const tdd = String(tomorrow.getDate()).padStart(2, "0");
    setReturnDate(`${tyyyy}-${tmm}-${tdd}`);

    now.setHours(now.getHours() + 1);
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    setPickupTime(`${hh}:${min}`);
    setReturnTime(`${hh}:${min}`);
  }, []);

  const visibleVehicleKeys = useMemo(
    () => (bookingType === "oneway" ? ONE_WAY_VEHICLE_KEYS : ALL_VEHICLE_KEYS),
    [bookingType]
  );

  const cheapestFare = useMemo(() => {
    if (!fareOptions.length) return null;
    return Math.min(...fareOptions.map((item) => item.grandTotal));
  }, [fareOptions]);

  const calculateReachTime = (startHourMin: string, tripDistance: number) => {
    if (!startHourMin || tripDistance <= 0) return "";

    const [hours, minutes] = startHourMin.split(":").map(Number);
    const travelTimeHours = tripDistance / 50;
    const totalMinutesToAdd = Math.round(travelTimeHours * 60);

    const dateObj = new Date();
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes + totalMinutesToAdd);

    let h = dateObj.getHours();
    const m = String(dateObj.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    return `${h}:${m} ${ampm}`;
  };

  const getTripDays = () => {
    if (bookingType !== "roundtrip") return 1;

    const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const endDateTime = new Date(`${returnDate}T${returnTime}`);

    if (
      Number.isNaN(startDateTime.getTime()) ||
      Number.isNaN(endDateTime.getTime())
    ) {
      return 1;
    }

    const diffMs = endDateTime.getTime() - startDateTime.getTime();
    if (diffMs <= 0) return 1;

    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  const handleCheckBestFare = async () => {
    if (!pickup.trim()) {
      alert("कृपया पिकअप लोकेशन दर्ज करें।");
      return;
    }

    if (bookingType !== "local" && !drop.trim()) {
      alert("कृपया ड्रॉप लोकेशन दर्ज करें।");
      return;
    }

    let nightHaltDays = 0;
    let tripDays = 1;

    if (bookingType === "roundtrip") {
      if (!returnDate || !returnTime) {
        alert("कृपया वापसी की तारीख और समय चुनें।");
        return;
      }

      const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
      const endDateTime = new Date(`${returnDate}T${returnTime}`);

      if (endDateTime <= startDateTime) {
        alert("वापसी का समय पिकअप समय के बाद का होना चाहिए।");
        return;
      }

      tripDays = getTripDays();
      nightHaltDays = Math.max(0, tripDays - 1);
    }

    setLoading(true);

    try {
      let tripDistance = 0;

      if (bookingType !== "local") {
        try {
          const response = await fetch("/api/distance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ origin: pickup, destination: drop }),
          });

          const data = await response.json();

          tripDistance =
            typeof data?.distanceKm === "number" && data.distanceKm > 0
              ? Math.round(data.distanceKm)
              : estimateDistance(pickup, drop);
        } catch {
          tripDistance = estimateDistance(pickup, drop);
        }
      } else {
        tripDistance = 80;
      }

      setDistance(tripDistance);

      if (bookingType === "oneway") {
        setReachTime(calculateReachTime(pickupTime, tripDistance));
      } else if (bookingType === "local") {
        setReachTime("Within 8 Hours");
      } else {
        setReachTime("");
      }

      const options: FareOption[] = visibleVehicleKeys.map((vKey) => {
        const result = calculateFare({
          distance: tripDistance,
          vehicleType: vKey,
          bookingType,
          tripDays,
        });

        const totalNightHaltCost =
          bookingType === "roundtrip" ? result.nightHalt * nightHaltDays : 0;

        const grandTotal = result.finalFare + totalNightHaltCost;

        return {
          id: `${bookingType}-${vKey}`,
          vehicleType: vKey,
          vehicleLabel: getVehicleLabel(vKey),
          finalFare: result.finalFare,
          fareText: formatCurrency(result.finalFare),
          baseFareUsed: result.baseFareUsed,
          rateUsed: result.rateUsed,
          pricingMode: result.pricingMode,
          pricingModeLabel: getPricingModeLabel(result.pricingMode),
          extraRate: result.rateUsed || VEHICLES[vKey]?.oldRatePerKm || 0,
          totalNightHaltCost,
          nightHaltDays,
          billedDistance: result.billedDistance,
          extraDistance: result.extraDistance,
          actualDistance: bookingType === "roundtrip" ? tripDistance * 2 : tripDistance,
          shortRuleApplied: result.shortRuleApplied,
          grandTotal,
          grandTotalText: formatCurrency(grandTotal),
          remarks: result.remarks,
        };
      });

      options.sort((a, b) => a.grandTotal - b.grandTotal);

      setFareOptions(options);
      setShowPopup(true);
    } catch (error) {
      console.error(error);
      alert("Fare calculate karne me problem aayi.");
    } finally {
      setLoading(false);
    }
  };

  const getWhatsappUrl = (option: FareOption) => {
    const displayCarLabel =
      bookingType === "oneway"
        ? option.vehicleType === "sedan"
          ? "5 Seater Cab (Sedan)"
          : "7 Seater Cab (Ertiga/SUV)"
        : option.vehicleLabel;

    const textMessage =
      `Hello Khatu Rides Travels, I want to book a cab:\n\n` +
      `📍 Pickup: ${pickup}\n` +
      (bookingType !== "local" ? `🏁 Drop: ${drop}\n` : "") +
      `📱 Contact: ${phone || "Not Provided"}\n` +
      `🔄 Ride Type: ${
        bookingType === "oneway"
          ? "One Way"
          : bookingType === "roundtrip"
          ? "Round Trip (2 Way)"
          : "Local"
      }\n` +
      `🚘 Vehicle: ${displayCarLabel}\n` +
      `📅 Pickup Date/Time: ${pickupDate} @ ${pickupTime}\n` +
      (bookingType === "roundtrip"
        ? `📅 Return Date/Time: ${returnDate} @ ${returnTime}\n`
        : "") +
      (bookingType === "roundtrip"
        ? `📦 Pricing Rule: ${option.pricingModeLabel}\n`
        : "") +
      (bookingType === "roundtrip"
        ? `🧾 Billed Distance: ${option.billedDistance} KM\n`
        : "") +
      `🛣️ Actual Distance: ${
        bookingType === "roundtrip" ? distance * 2 : distance
      } KM\n` +
      `💵 Base Fare: ${formatCurrency(option.finalFare)}\n` +
      (bookingType === "roundtrip"
        ? `🌙 Night Halt: ${option.nightHaltDays} Night(s) (${formatCurrency(
            option.totalNightHaltCost
          )})\n`
        : "") +
      `💰 Grand Total: ${option.grandTotalText}\n` +
      `ℹ️ Toll Tax: Extra\n` +
      `ℹ️ Parking: Extra\n\n` +
      `Please confirm availability.`;

    return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      textMessage
    )}`;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#020617] p-4 font-sans text-slate-200">
      <div className="w-full max-w-lg rounded-[32px] border border-slate-800/80 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 text-center">
          <h2 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-2xl font-black tracking-wide text-transparent">
            Smart Cab Fare Calculator
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Fast estimate, clear pricing, instant WhatsApp booking
          </p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-slate-800/40 bg-slate-950/60 p-1.5">
          {(["oneway", "roundtrip", "local"] as const).map((type) => (
            <button
              key={`booking-${type}`}
              type="button"
              onClick={() => setBookingType(type)}
              className={`rounded-xl py-2.5 text-center text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                bookingType === type
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {type === "oneway"
                ? "One Way"
                : type === "roundtrip"
                ? "Round Trip"
                : "Local"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="group relative flex items-center rounded-2xl border border-slate-800/80 bg-slate-950/40 px-4 py-3.5 transition-all focus-within:border-cyan-500/50">
            <span className="mr-3 text-lg text-cyan-400">📍</span>
            <div className="w-full pr-6">
              {isLoaded ? (
                <Autocomplete
                  onLoad={setPickupAutocomplete}
                  onPlaceChanged={() =>
                    setPickup(
                      pickupAutocomplete?.getPlace().formatted_address || ""
                    )
                  }
                  className="w-full"
                >
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500"
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup location"
                  className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500"
                />
              )}
            </div>

            {pickup && (
              <button
                type="button"
                onClick={() => setPickup("")}
                className="absolute right-4 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800/50 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-700 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {bookingType !== "local" && (
            <div className="group relative flex items-center rounded-2xl border border-slate-800/80 bg-slate-950/40 px-4 py-3.5 transition-all focus-within:border-cyan-500/50">
              <span className="mr-3 text-lg text-indigo-400">🏁</span>
              <div className="w-full pr-6">
                {isLoaded ? (
                  <Autocomplete
                    onLoad={setDropAutocomplete}
                    onPlaceChanged={() =>
                      setDrop(
                        dropAutocomplete?.getPlace().formatted_address || ""
                      )
                    }
                    className="w-full"
                  >
                    <input
                      type="text"
                      value={drop}
                      onChange={(e) => setDrop(e.target.value)}
                      placeholder="Enter drop destination"
                      className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500"
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    placeholder="Enter drop destination"
                    className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500"
                  />
                )}
              </div>

              {drop && (
                <button
                  type="button"
                  onClick={() => setDrop("")}
                  className="absolute right-4 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800/50 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full cursor-pointer rounded-2xl border border-slate-800/80 bg-slate-950/40 px-4 py-3 text-sm font-medium text-white outline-none transition-colors focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="mb-1 block pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pickup Time
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full cursor-pointer rounded-2xl border border-slate-800/80 bg-slate-950/40 px-4 py-3 text-sm font-medium text-white outline-none transition-colors focus:border-cyan-500/50"
              />
            </div>
          </div>

          {bookingType === "roundtrip" && (
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-800/40 bg-slate-950/20 p-3">
              <div>
                <label className="mb-1 block pl-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full cursor-pointer rounded-2xl border border-slate-800/60 bg-slate-950/60 px-4 py-3 text-sm font-medium text-white outline-none transition-colors focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="mb-1 block pl-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Return Time
                </label>
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full cursor-pointer rounded-2xl border border-slate-800/60 bg-slate-950/60 px-4 py-3 text-sm font-medium text-white outline-none transition-colors focus:border-cyan-500/50"
                />
              </div>
            </div>
          )}

          <div className="flex items-center rounded-2xl border border-slate-800/80 bg-slate-950/40 px-4 py-3.5 transition-all focus-within:border-cyan-500/50">
            <span className="mr-3 text-lg text-slate-400">📞</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter mobile number"
              className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <button
            type="button"
            onClick={handleCheckBestFare}
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-600/20 transition-all hover:opacity-95 disabled:opacity-75"
          >
            {loading ? "Calculating Best Fare..." : "See Best Fare"}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-[32px] border border-slate-800 bg-[#0f172a] p-5 shadow-2xl">
            <div className="mb-4 text-center">
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                {bookingType === "roundtrip"
                  ? "Round Trip Fare Breakdown"
                  : "Ride Summary & Rates"}
              </span>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-slate-800/40 bg-slate-950/50 p-3 text-left">
                <div>
                  <span className="block text-[10px] font-semibold uppercase text-slate-400">
                    Actual Distance
                  </span>
                  <span className="text-sm font-bold text-white">
                    {bookingType === "local"
                      ? "80 KM Limit"
                      : `${bookingType === "roundtrip" ? distance * 2 : distance} KM`}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-semibold uppercase text-slate-400">
                    {bookingType === "roundtrip" ? "Trip Days" : "Est. Reach Time"}
                  </span>
                  <span className="text-sm font-bold text-cyan-400">
                    {bookingType === "roundtrip" && fareOptions.length > 0
                      ? `${fareOptions[0].nightHaltDays + 1} Day(s)`
                      : reachTime || "Instant Estimate"}
                  </span>
                </div>
              </div>
            </div>

            <div className="max-h-[48vh] space-y-3 overflow-y-auto pr-1">
              {fareOptions.map((option) => {
                const isCheapest = cheapestFare === option.grandTotal;

                return (
                  <div
                    key={option.id}
                    className={`rounded-2xl border p-3 transition-all ${
                      isCheapest
                        ? "border-cyan-500/40 bg-gradient-to-r from-slate-900 to-slate-900/90"
                        : "border-slate-800/80 bg-slate-900/50"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-2 text-2xl">
                          {["innova", "crysta", "scorpio"].includes(option.vehicleType)
                            ? "🚙"
                            : "🚘"}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            {bookingType === "oneway"
                              ? option.vehicleType === "sedan"
                                ? "5 Seater Cab (Sedan)"
                                : "7 Seater Cab (Ertiga/SUV)"
                              : option.vehicleLabel}
                          </h4>
                          <p className="mt-0.5 text-lg font-black text-white">
                            {option.grandTotalText}
                          </p>
                        </div>
                      </div>

                      {isCheapest && (
                        <span className="rounded-full bg-cyan-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-950">
                          Best Price
                        </span>
                      )}
                    </div>

                    <div className="mb-3 grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                      <div className="rounded-xl bg-slate-950/50 p-2">
                        <span className="block text-slate-500">Pricing Rule</span>
                        <span className="font-semibold text-white">
                          {option.pricingModeLabel}
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-950/50 p-2">
                        <span className="block text-slate-500">Base Fare</span>
                        <span className="font-semibold text-white">
                          {option.fareText}
                        </span>
                      </div>

                      {bookingType === "roundtrip" && (
                        <>
                          <div className="rounded-xl bg-slate-950/50 p-2">
                            <span className="block text-slate-500">Actual KM</span>
                            <span className="font-semibold text-white">
                              {option.actualDistance} KM
                            </span>
                          </div>

                          <div className="rounded-xl bg-slate-950/50 p-2">
                            <span className="block text-slate-500">Billed KM</span>
                            <span className="font-semibold text-white">
                              {option.billedDistance} KM
                            </span>
                          </div>

                          <div className="rounded-xl bg-slate-950/50 p-2">
                            <span className="block text-slate-500">Rate Used</span>
                            <span className="font-semibold text-white">
                              ₹{option.rateUsed}/KM
                            </span>
                          </div>

                          <div className="rounded-xl bg-slate-950/50 p-2">
                            <span className="block text-slate-500">Night Halt</span>
                            <span className="font-semibold text-white">
                              {formatCurrency(option.totalNightHaltCost)}
                            </span>
                          </div>
                        </>
                      )}

                      {bookingType !== "roundtrip" && (
                        <div className="rounded-xl bg-slate-950/50 p-2">
                          <span className="block text-slate-500">Post Limit</span>
                          <span className="font-semibold text-white">
                            ₹{option.extraRate}/KM
                          </span>
                        </div>
                      )}
                    </div>

                    {bookingType === "roundtrip" && option.shortRuleApplied && (
                      <div className="mb-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[10px] font-semibold text-amber-300">
                        Short route protection applied because one-side distance is below 80 KM.
                      </div>
                    )}

                    <div className="mb-3 rounded-xl border border-slate-800/70 bg-slate-950/40 p-3 text-[10px] text-slate-400">
                      <div className="mb-1 font-bold uppercase tracking-wide text-slate-300">
                        Fare Notes
                      </div>
                      <ul className="space-y-1">
                        {option.remarks.slice(0, 4).map((remark) => (
                          <li key={remark}>• {remark}</li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={getWhatsappUrl(option)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block rounded-xl px-4 py-3 text-center text-xs font-black uppercase tracking-wider transition-all ${
                        isCheapest
                          ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                          : "bg-slate-800 text-white hover:bg-slate-700"
                      }`}
                    >
                      Book on WhatsApp
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-around rounded-xl border border-slate-900 bg-slate-950/40 p-3 text-center text-[11px] text-slate-400">
              <div>
                <span className="block font-extrabold uppercase tracking-wide text-rose-400">
                  Toll Tax
                </span>
                Extra
              </div>

              <div className="h-5 w-px bg-slate-800" />

              <div>
                <span className="block font-extrabold uppercase tracking-wide text-amber-500">
                  Parking
                </span>
                Extra
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="mt-3.5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-slate-400 transition-colors hover:text-white"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
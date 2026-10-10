// components/FareCalculator.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  X,
  LocateFixed,
  Navigation,
  ArrowLeft,
  Phone,
  Zap,
  Clock,
} from "lucide-react";
import {
  calculateFare,
  LOCAL_PACKAGES,
  VEHICLES,
  type BookingType,
  type LocalPackageType,
  type ServiceType,
  type VehicleType,
} from "@/lib/fareCalculator";

interface FareCalculatorProps {
  onFareCalculated?: (data: any) => void;
  onBookCall?: (vehicle: any, routeData: any) => void;
  onBookWhatsApp?: (vehicle: any, routeData: any) => void;
}

type MainTab = "oneway" | "roundtrip" | "local" | "airport";
type LocationKind = "pickup" | "drop";

const DEBOUNCE_MS = 350;
const MIN_AUTOCOMPLETE_CHARS = 3;
const MAX_SUGGESTIONS = 6;

const LOCAL_PACKAGE_OPTIONS: Array<{ id: LocalPackageType; label: string }> = [
  { id: "8hr80km", label: "8 Hr / 80 KM" },
  { id: "12hr120km", label: "12 Hr / 120 KM" },
];

function formatINR(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function getLocalDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dateTimeToTimestamp(date: string, time: string) {
  const value = new Date(`${date}T${time}:00`);
  const timestamp = value.getTime();
  return Number.isFinite(timestamp) ? timestamp : NaN;
}

function sanitizeSuggestions(input: unknown) {
  if (!Array.isArray(input)) return [];
  return Array.from(
    new Set(
      input
        .map((item: any) =>
          typeof item === "string"
            ? item.trim()
            : String(item?.description || item?.formatted_address || "").trim()
        )
        .filter(Boolean)
    )
  ).slice(0, MAX_SUGGESTIONS);
}

function formatDuration(totalMinutes: number) {
  if (!totalMinutes || isNaN(totalMinutes)) return "00:00 HRS";
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} HRS`;
}

// Map exact image names from the public folder based on vehicle type or label
function getVehicleImage(type: string, label: string) {
  const lowerLabel = label.toLowerCase();
  const lowerType = type.toLowerCase();
  
  if (lowerLabel.includes('dzire') || lowerType.includes('sedan')) return '/dezire.png';
  if (lowerLabel.includes('ertiga') || lowerType.includes('suv')) return '/ertiga.png';
  if (lowerLabel.includes('crysta') || lowerType.includes('premium')) return '/crysta.png';
  
  // Fallback image handling
  return `/${type}.png`; 
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

function LocationIcon({ type }: { type: LocationKind }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        type === "pickup"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      <MapPin className="h-4 w-4" strokeWidth={2.5} />
    </span>
  );
}

function DateTimeIcon({ type }: { type: "date" | "time" }) {
  return type === "date" ? (
    <CalendarDays className="h-5 w-5 text-gray-500" strokeWidth={2} />
  ) : (
    <Clock3 className="h-5 w-5 text-gray-500" strokeWidth={2} />
  );
}

export default function FareCalculator({ onFareCalculated, onBookCall, onBookWhatsApp }: FareCalculatorProps) {
  const [tab, setTab] = useState<MainTab>("oneway");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [localPackage, setLocalPackage] = useState<LocalPackageType>("8hr80km");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");

  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropList, setShowDropList] = useState(false);

  // Result Overlay State
  const [fareResultData, setFareResultData] = useState<any>(null);

  const [mobileLocationEditor, setMobileLocationEditor] = useState<LocationKind | null>(null);
  const [mobileLocationDraft, setMobileLocationDraft] = useState("");
  const [mobileLocationSuggestions, setMobileLocationSuggestions] = useState<string[]>([]);
  const [mobileLocationLoading, setMobileLocationLoading] = useState(false);
  const mobileLocationRequestRef = useRef(0);
  const mobileLocationAbortRef = useRef<AbortController | null>(null);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropInputRef = useRef<HTMLInputElement>(null);

  const pickupAbortRef = useRef<AbortController | null>(null);
  const dropAbortRef = useRef<AbortController | null>(null);
  const pickupRequestRef = useRef(0);
  const dropRequestRef = useRef(0);

  const pickupSelectedRef = useRef(false);
  const dropSelectedRef = useRef(false);

  const isLocal = tab === "local";
  const isRoundTrip = tab === "roundtrip";
  const isAirport = tab === "airport";
  const serviceType: ServiceType = isLocal ? "local" : "outstation";
  const bookingType: BookingType = isLocal ? "local" : isRoundTrip ? "roundtrip" : "oneway";

  const selectedPackage = useMemo(
    () => LOCAL_PACKAGES.sedan[localPackage],
    [localPackage]
  );

  useEffect(() => {
    const syncClock = () => {
      const now = new Date();
      setMinDate(getLocalDateString(now));
      setMinTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);

      setPickupDate((v) => v || getLocalDateString(now));
      setPickupTime((v) => {
        if (v) return v;
        const suggested = new Date(now.getTime() + 60 * 60 * 1000);
        return `${String(suggested.getHours()).padStart(2, "0")}:00`;
      });
    };

    syncClock();
    const timer = window.setInterval(syncClock, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const value = pickup.trim();
    const requestId = ++pickupRequestRef.current;

    pickupAbortRef.current?.abort();
    pickupAbortRef.current = null;

    if (pickupSelectedRef.current) {
      pickupSelectedRef.current = false;
      setPickupSuggestions([]);
      setShowPickupList(false);
      return;
    }

    if (value.length < MIN_AUTOCOMPLETE_CHARS) {
      setPickupSuggestions([]);
      setShowPickupList(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      const controller = new AbortController();
      pickupAbortRef.current = controller;

      try {
        const response = await fetch(
          `/api/places-autocomplete?input=${encodeURIComponent(value)}`,
          { signal: controller.signal, cache: "no-store", headers: { Accept: "application/json" } }
        );

        const raw = await response.text();
        if (!response.ok || requestId !== pickupRequestRef.current) return;

        let data: any;
        try {
          data = JSON.parse(raw);
        } catch {
          return;
        }

        if (requestId !== pickupRequestRef.current) return;
        const results = sanitizeSuggestions(data?.predictions ?? data?.results);
        setPickupSuggestions(results);
        setShowPickupList(results.length > 0);
      } catch (error: any) {
        if (error?.name !== "AbortError") console.error("Pickup autocomplete error:", error);
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [pickup]);

  useEffect(() => {
    const value = drop.trim();
    const requestId = ++dropRequestRef.current;

    dropAbortRef.current?.abort();
    dropAbortRef.current = null;

    if (dropSelectedRef.current) {
      dropSelectedRef.current = false;
      setDropSuggestions([]);
      setShowDropList(false);
      return;
    }

    if (value.length < MIN_AUTOCOMPLETE_CHARS) {
      setDropSuggestions([]);
      setShowDropList(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      const controller = new AbortController();
      dropAbortRef.current = controller;

      try {
        const response = await fetch(
          `/api/places-autocomplete?input=${encodeURIComponent(value)}`,
          { signal: controller.signal, cache: "no-store", headers: { Accept: "application/json" } }
        );

        const raw = await response.text();
        if (!response.ok || requestId !== dropRequestRef.current) return;

        let data: any;
        try {
          data = JSON.parse(raw);
        } catch {
          return;
        }

        if (requestId !== dropRequestRef.current) return;
        const results = sanitizeSuggestions(data?.predictions ?? data?.results);
        setDropSuggestions(results);
        setShowDropList(results.length > 0);
      } catch (error: any) {
        if (error?.name !== "AbortError") console.error("Drop autocomplete error:", error);
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [drop]);

  useEffect(() => {
    if (!mobileLocationEditor) {
      mobileLocationAbortRef.current?.abort();
      mobileLocationAbortRef.current = null;
      setMobileLocationSuggestions([]);
      setMobileLocationLoading(false);
      return;
    }

    const value = mobileLocationDraft.trim();
    const requestId = ++mobileLocationRequestRef.current;

    mobileLocationAbortRef.current?.abort();
    mobileLocationAbortRef.current = null;

    if (value.length < MIN_AUTOCOMPLETE_CHARS) {
      setMobileLocationSuggestions([]);
      setMobileLocationLoading(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      const controller = new AbortController();
      mobileLocationAbortRef.current = controller;
      setMobileLocationLoading(true);

      try {
        const response = await fetch(
          `/api/places-autocomplete?input=${encodeURIComponent(value)}`,
          { signal: controller.signal, cache: "no-store", headers: { Accept: "application/json" } }
        );

        const raw = await response.text();
        if (!response.ok || requestId !== mobileLocationRequestRef.current) return;

        let data: any;
        try {
          data = JSON.parse(raw);
        } catch {
          return;
        }

        if (requestId !== mobileLocationRequestRef.current) return;
        setMobileLocationSuggestions(
          sanitizeSuggestions(data?.predictions ?? data?.results)
        );
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("Mobile location autocomplete error:", error);
        }
      } finally {
        if (requestId === mobileLocationRequestRef.current) {
          setMobileLocationLoading(false);
        }
      }
    }, 260);

    return () => window.clearTimeout(timer);
  }, [mobileLocationDraft, mobileLocationEditor]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (pickupRef.current && !pickupRef.current.contains(target)) setShowPickupList(false);
      if (dropRef.current && !dropRef.current.contains(target)) setShowDropList(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    return () => {
      pickupAbortRef.current?.abort();
      dropAbortRef.current?.abort();
    };
  }, []);

  const selectTab = (next: MainTab) => {
    setTab(next);
    setErrorMessage("");
    setShowPickupList(false);
    setShowDropList(false);
    setMobileLocationEditor(null);
    setMobileLocationSuggestions([]);

    if (next === "local") {
      setDrop("");
      setDropSuggestions([]);
      setReturnDate("");
      setReturnTime("");
    } else if (next !== "roundtrip") {
      setReturnDate("");
      setReturnTime("");
    }
  };

  const clearPickup = () => {
    pickupSelectedRef.current = false;
    pickupRequestRef.current += 1;
    pickupAbortRef.current?.abort();
    setPickup("");
    setPickupSuggestions([]);
    setShowPickupList(false);
    requestAnimationFrame(() => pickupInputRef.current?.focus());
  };

  const clearDrop = () => {
    dropSelectedRef.current = false;
    dropRequestRef.current += 1;
    dropAbortRef.current?.abort();
    setDrop("");
    setDropSuggestions([]);
    setShowDropList(false);
    requestAnimationFrame(() => dropInputRef.current?.focus());
  };

  const swapLocations = () => {
    if (isLocal) return;
    const oldPickup = pickup;
    const oldDrop = drop;
    pickupSelectedRef.current = true;
    dropSelectedRef.current = true;
    pickupRequestRef.current += 1;
    dropRequestRef.current += 1;
    pickupAbortRef.current?.abort();
    dropAbortRef.current?.abort();
    setPickup(oldDrop);
    setDrop(oldPickup);
    setPickupSuggestions([]);
    setDropSuggestions([]);
    setShowPickupList(false);
    setShowDropList(false);
    setErrorMessage("");
  };

  const selectSuggestion = (kind: LocationKind, value: string) => {
    if (kind === "pickup") {
      pickupSelectedRef.current = true;
      pickupRequestRef.current += 1;
      pickupAbortRef.current?.abort();
      setPickup(value);
      setPickupSuggestions([]);
      setShowPickupList(false);
    } else {
      dropSelectedRef.current = true;
      dropRequestRef.current += 1;
      dropAbortRef.current?.abort();
      setDrop(value);
      setDropSuggestions([]);
      setShowDropList(false);
    }
    setErrorMessage("");
  };

  const openMobileLocationEditor = (kind: LocationKind) => {
    const currentValue = kind === "pickup" ? pickup : drop;
    setMobileLocationEditor(kind);
    setMobileLocationDraft(currentValue);
    setMobileLocationSuggestions([]);
    setMobileLocationLoading(false);
    setErrorMessage("");
  };

  const closeMobileLocationEditor = () => {
    mobileLocationAbortRef.current?.abort();
    mobileLocationAbortRef.current = null;
    setMobileLocationEditor(null);
    setMobileLocationDraft("");
    setMobileLocationSuggestions([]);
    setMobileLocationLoading(false);
  };

  const selectMobileLocation = (value: string) => {
    if (mobileLocationEditor === "pickup") {
      pickupSelectedRef.current = true;
      pickupRequestRef.current += 1;
      pickupAbortRef.current?.abort();
      setPickup(value);
      setPickupSuggestions([]);
      setShowPickupList(false);
    } else if (mobileLocationEditor === "drop") {
      dropSelectedRef.current = true;
      dropRequestRef.current += 1;
      dropAbortRef.current?.abort();
      setDrop(value);
      setDropSuggestions([]);
      setShowDropList(false);
    }

    setErrorMessage("");
    closeMobileLocationEditor();
  };

  const useMobileDraftAsLocation = () => {
    const value = mobileLocationDraft.trim();
    if (value.length < 3) return;
    selectMobileLocation(value);
  };

  const validateDateTime = () => {
    const now = new Date();
    const pickupTimestamp = dateTimeToTimestamp(pickupDate, pickupTime);

    if (!Number.isFinite(pickupTimestamp)) return "Please select a valid pickup date and time.";
    if (pickupTimestamp < now.getTime()) return "Pickup time cannot be in the past.";

    if (!isRoundTrip) return "";

    const returnTimestamp = dateTimeToTimestamp(returnDate, returnTime);
    if (!Number.isFinite(returnTimestamp)) return "Please select a valid return date and time.";
    if (returnTimestamp <= pickupTimestamp) return "Return must be after pickup.";
    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setErrorMessage("");
    const cleanPickup = pickup.trim();
    const cleanDrop = drop.trim();

    if (!cleanPickup) {
      setErrorMessage("Please enter your pickup location.");
      pickupInputRef.current?.focus();
      return;
    }

    if (!isLocal && !cleanDrop) {
      setErrorMessage("Please enter your destination.");
      dropInputRef.current?.focus();
      return;
    }

    if (!pickupDate || !pickupTime) {
      setErrorMessage("Please select pickup date and time.");
      return;
    }

    if (isRoundTrip && (!returnDate || !returnTime)) {
      setErrorMessage("Please select return date and time.");
      return;
    }

    const dateTimeError = validateDateTime();
    if (dateTimeError) {
      setErrorMessage(dateTimeError);
      return;
    }

    if (isLocal && !LOCAL_PACKAGE_OPTIONS.some((x) => x.id === localPackage)) {
      setErrorMessage("Please select a valid local package.");
      return;
    }

    setLoading(true);
    setShowPickupList(false);
    setShowDropList(false);

    try {
      let distanceKm = selectedPackage.kms;

      if (!isLocal) {
        const response = await fetch("/api/distance", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ origin: cleanPickup, destination: cleanDrop }),
          cache: "no-store",
        });

        const raw = await response.text();
        let data: any;
        try {
          data = JSON.parse(raw);
        } catch {
          throw new Error("Distance service returned invalid data.");
        }

        const calculatedDistance = Number(data?.distanceKm);
        if (!response.ok || !Number.isFinite(calculatedDistance) || calculatedDistance <= 0) {
          throw new Error(data?.error || "Unable to determine the route distance. Please try again.");
        }
        distanceKm = calculatedDistance;
      }

      const createdAt = Date.now();

      const fareOptions = (Object.keys(VEHICLES) as VehicleType[]).map((vehicleType) => {
        const packageConfig = isLocal ? LOCAL_PACKAGES[vehicleType][localPackage] : undefined;

        const result = calculateFare({
          distance: distanceKm,
          vehicleType,
          bookingType,
          serviceType,
          pickupDate,
          pickupTime,
          returnDate: isRoundTrip ? returnDate : undefined,
          returnTime: isRoundTrip ? returnTime : undefined,
          drop: cleanDrop,
          pickup: cleanPickup,
          ...(isLocal
            ? {
                localPackage,
                localHours: packageConfig?.hours,
                localKilometers: packageConfig?.kms,
              }
            : {}),
        });

        if (!Number.isFinite(Number(result.finalFare))) {
          throw new Error(`Unable to calculate fare for ${VEHICLES[vehicleType].label}.`);
        }

        const localFare = result.localFare;

        return {
          id: `${bookingType}-${vehicleType}-${createdAt}`,
          vehicleType,
          vehicleLabel: VEHICLES[vehicleType].label,
          vehicleImage: VEHICLES[vehicleType].image,
          finalFare: result.finalFare,
          strikeFare: isLocal ? result.finalFare : result.strikeFare,
          fareText: formatINR(result.finalFare),
          billedDistance: result.billedDistance,
          actualDistance: result.actualDistance,
          durationMinutes: result.durationMinutes,
          localPackage: isLocal ? localPackage : undefined,
          packageLabel: isLocal ? localFare?.package.label : undefined,
          packageHours: isLocal ? localFare?.package.hours : undefined,
          packageKms: isLocal ? localFare?.package.kms : undefined,
          packageFare: isLocal ? localFare?.packageFare : undefined,
          extraHours: isLocal ? localFare?.extraHours : undefined,
          extraKilometers: isLocal ? localFare?.extraKilometers : undefined,
          extraHourRate: isLocal ? localFare?.package.extraHourRate : undefined,
          extraKmRate: isLocal ? localFare?.package.extraKmRate : undefined,
          extraHourCharges: isLocal ? localFare?.extraHourCharges : undefined,
          extraKmCharges: isLocal ? localFare?.extraKmCharges : undefined,
          totalExtraCharges: isLocal ? localFare?.totalExtraCharges : undefined,
          driverAllowanceIncluded: isLocal ? true : undefined,
          fuelIncluded: true,
          tollParkingExcluded: isLocal ? true : undefined,
          cancellationText: "Free cancellation before 6 hours from journey time",
        };
      });

      const packageLabel = LOCAL_PACKAGE_OPTIONS.find((item) => item.id === localPackage)?.label;

      const payload = {
        fareOptions,
        pickup: cleanPickup,
        drop: isLocal ? "Local Cab Rental" : cleanDrop,
        bookingType,
        serviceType,
        pickupDate,
        pickupTime,
        returnDate: isRoundTrip ? returnDate : undefined,
        returnTime: isRoundTrip ? returnTime : undefined,
        localPackage: isLocal ? localPackage : undefined,
        packageLabel: isLocal ? packageLabel : undefined,
      };

      setFareResultData(payload);
      if (onFareCalculated) onFareCalculated(payload);

    } catch (error: any) {
      console.error("Fare calculation error:", error);
      setErrorMessage(error?.message || "Unable to calculate fare right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabItems: Array<{ id: MainTab; label: string; icon: React.ReactNode }> = [
    { id: "oneway", label: "One Way", icon: <ArrowLeftRight className="h-5 w-5" /> },
    { id: "roundtrip", label: "Round Trip", icon: <ArrowLeftRight className="h-5 w-5" /> },
    { id: "airport", label: "Airport", icon: <Plane className="h-5 w-5" /> },
    { id: "local", label: "Local", icon: <CarFront className="h-5 w-5" /> },
  ];

  return (
    <>
      <div className="w-full">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          
          {/* Header Area */}
          <div className="bg-white px-5 py-6 sm:px-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                  Book Your Ride
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Enter your details to check transparent fares and book instantly.
                </p>
              </div>
            </div>

            {/* Business Clean Tabs */}
            <div className="mt-6 flex space-x-1 sm:space-x-2 rounded-xl bg-gray-100 p-1.5 overflow-x-auto">
              {tabItems.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectTab(item.id)}
                    aria-pressed={active}
                    className={`flex flex-1 min-w-[100px] items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-bold transition-all ${
                      active
                        ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`${active ? "text-amber-500" : "text-gray-400"}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-8">
            
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
              
              {/* ONEWAY / ROUNDTRIP / AIRPORT LAYOUT */}
              {!isLocal && (
                <>
                  {/* Mobile Locations */}
                  <div className="flex flex-col gap-4 lg:hidden">
                    <MobileLocationField
                      type="pickup"
                      value={pickup}
                      placeholder="Tap to enter pickup city or airport"
                      onOpen={() => openMobileLocationEditor("pickup")}
                      onClear={clearPickup}
                    />
                    <MobileLocationField
                      type="drop"
                      value={drop}
                      placeholder="Tap to enter destination"
                      onOpen={() => openMobileLocationEditor("drop")}
                      onClear={clearDrop}
                    />
                  </div>

                  {/* Desktop Locations */}
                  <div className="hidden lg:col-span-12 relative lg:grid lg:grid-cols-2 lg:gap-5">
                    <LocationField
                      ref={pickupRef}
                      inputRef={pickupInputRef}
                      type="pickup"
                      id="kr-pickup"
                      value={pickup}
                      suggestions={pickupSuggestions}
                      showSuggestions={showPickupList}
                      placeholder="Pickup city, airport or address"
                      onChange={(value) => {
                        pickupSelectedRef.current = false;
                        setPickup(value);
                        setErrorMessage("");
                        if (value.trim().length < MIN_AUTOCOMPLETE_CHARS) setShowPickupList(false);
                      }}
                      onFocus={() => {
                        if (!pickupSelectedRef.current && pickupSuggestions.length > 0) setShowPickupList(true);
                      }}
                      onClear={clearPickup}
                      onSelect={(value) => selectSuggestion("pickup", value)}
                    />

                    <button
                      type="button"
                      onClick={swapLocations}
                      aria-label="Swap pickup and destination"
                      className="absolute left-1/2 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition hover:bg-gray-50 active:scale-95"
                    >
                      <ArrowLeftRight className="h-5 w-5" />
                    </button>

                    <LocationField
                      ref={dropRef}
                      inputRef={dropInputRef}
                      type="drop"
                      id="kr-drop"
                      value={drop}
                      suggestions={dropSuggestions}
                      showSuggestions={showDropList}
                      placeholder="Destination city or airport"
                      onChange={(value) => {
                        dropSelectedRef.current = false;
                        setDrop(value);
                        setErrorMessage("");
                        if (value.trim().length < MIN_AUTOCOMPLETE_CHARS) setShowDropList(false);
                      }}
                      onFocus={() => {
                        if (!dropSelectedRef.current && dropSuggestions.length > 0) setShowDropList(true);
                      }}
                      onClear={clearDrop}
                      onSelect={(value) => selectSuggestion("drop", value)}
                    />
                  </div>
                </>
              )}

              {/* LOCAL CAB LAYOUT */}
              {isLocal && (
                <>
                  <div className="lg:col-span-8">
                    <div className="lg:hidden">
                      <MobileLocationField
                        type="pickup"
                        value={pickup}
                        placeholder="Tap to select city"
                        onOpen={() => openMobileLocationEditor("pickup")}
                        onClear={clearPickup}
                      />
                    </div>
                    <div className="hidden lg:block">
                      <LocationField
                        ref={pickupRef}
                        inputRef={pickupInputRef}
                        type="pickup"
                        id="kr-pickup-local"
                        value={pickup}
                        suggestions={pickupSuggestions}
                        showSuggestions={showPickupList}
                        placeholder="Pickup city or address"
                        onChange={(value) => {
                          pickupSelectedRef.current = false;
                          setPickup(value);
                          setErrorMessage("");
                          if (value.trim().length < MIN_AUTOCOMPLETE_CHARS) setShowPickupList(false);
                        }}
                        onFocus={() => {
                          if (!pickupSelectedRef.current && pickupSuggestions.length > 0) setShowPickupList(true);
                        }}
                        onClear={clearPickup}
                        onSelect={(value) => selectSuggestion("pickup", value)}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-4 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-colors">
                    <label htmlFor="kr-local-package" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Select Package
                    </label>
                    <div className="flex items-center gap-3">
                      <Clock3 className="h-5 w-5 text-gray-400" />
                      <select
                        id="kr-local-package"
                        value={localPackage}
                        onChange={(e) => {
                          setLocalPackage(e.target.value as LocalPackageType);
                          setErrorMessage("");
                        }}
                        className="w-full text-base sm:text-lg font-bold text-gray-900 outline-none bg-transparent appearance-none cursor-pointer"
                      >
                        {LOCAL_PACKAGE_OPTIONS.map((item) => (
                          <option key={item.id} value={item.id}>{item.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}

              {/* DateTime Row */}
              <div className={`grid grid-cols-2 gap-4 ${isRoundTrip ? 'lg:col-span-6' : 'lg:col-span-6'}`}>
                <JourneyField
                  id="kr-pickup-date"
                  label="Pickup Date"
                  icon={<DateTimeIcon type="date" />}
                  type="date"
                  min={minDate}
                  value={pickupDate}
                  onChange={(value) => { setPickupDate(value); setErrorMessage(""); }}
                />
                <JourneyField
                  id="kr-pickup-time"
                  label="Pickup Time"
                  icon={<DateTimeIcon type="time" />}
                  type="time"
                  min={pickupDate === minDate ? minTime : undefined}
                  value={pickupTime}
                  onChange={(value) => { setPickupTime(value); setErrorMessage(""); }}
                />
              </div>

              {/* Return DateTime (Round Trip Only) */}
              {isRoundTrip && (
                <div className="grid grid-cols-2 gap-4 lg:col-span-6">
                  <JourneyField
                    id="kr-return-date"
                    label="Return Date"
                    icon={<DateTimeIcon type="date" />}
                    type="date"
                    min={pickupDate || minDate}
                    value={returnDate}
                    onChange={(value) => { setReturnDate(value); setErrorMessage(""); }}
                  />
                  <JourneyField
                    id="kr-return-time"
                    label="Return Time"
                    icon={<DateTimeIcon type="time" />}
                    type="time"
                    value={returnTime}
                    onChange={(value) => { setReturnTime(value); setErrorMessage(""); }}
                  />
                </div>
              )}

              {/* Big Action Button */}
              <div className={`mt-2 ${isRoundTrip ? 'lg:col-span-12' : 'lg:col-span-6'}`}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[72px] flex items-center justify-center gap-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-lg sm:text-xl font-extrabold transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <span className="h-6 w-6 animate-spin rounded-full border-4 border-gray-900/20 border-t-gray-900" />
                      <span>Calculating Fares...</span>
                    </>
                  ) : (
                    <>
                      <span>Explore Cabs & Fares</span>
                      <ArrowLeftRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Messages */}
            {errorMessage && (
              <div role="alert" className="mt-5 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-200 font-bold">!</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {isLocal && (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
                <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>{LOCAL_PACKAGE_OPTIONS.find((x) => x.id === localPackage)?.label} includes fuel and driver allowance. Tolls & parking extra.</span>
              </div>
            )}

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-gray-100 pt-6">
              <TrustItem icon={<ShieldCheck className="h-5 w-5" />} title="Transparent Pricing" />
              <TrustItem icon={<MapPin className="h-5 w-5" />} title="Exact Distance Fares" />
              <TrustItem icon={<Check className="h-5 w-5" />} title="Verified Drivers" />
            </div>
          </form>

          {/* Mobile Location Editor */}
          {mobileLocationEditor && (
            <MobileLocationPicker
              type={mobileLocationEditor}
              value={mobileLocationDraft}
              suggestions={mobileLocationSuggestions}
              loading={mobileLocationLoading}
              onChange={(value) => setMobileLocationDraft(value)}
              onSelect={selectMobileLocation}
              onUseDraft={useMobileDraftAsLocation}
              onClose={closeMobileLocationEditor}
            />
          )}
        </div>
      </div>

      {/* Internal Fare Results Overlay */}
      {fareResultData && (
        <FareResultsScreen
          data={fareResultData}
          onClose={() => setFareResultData(null)}
          onBookCall={onBookCall}
          onBookWhatsApp={onBookWhatsApp}
        />
      )}
    </>
  );
}

// --- MAIN SUB-COMPONENTS ---

function FareResultsScreen({ data, onClose, onBookCall, onBookWhatsApp }: any) {
  if (!data || !data.fareOptions) return null;
  const isLocal = data.bookingType === "local";

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col bg-gray-50 overflow-y-auto">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 flex items-center gap-4 bg-white px-4 py-4 shadow-sm sm:px-8 border-b border-gray-100">
        <button
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <ArrowLeft className="h-6 w-6 text-gray-900" />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 sm:text-2xl">Select a Vehicle</h1>
          <p className="text-sm font-semibold text-gray-500 mt-0.5 flex items-center">
            <span className="max-w-[150px] sm:max-w-xs truncate inline-block">{data.pickup}</span>
            <ArrowLeftRight className="h-3 w-3 mx-2 shrink-0" />
            <span className="max-w-[150px] sm:max-w-xs truncate inline-block">{data.drop}</span>
          </p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.fareOptions.map((option: any, index: number) => {
            const originalPrice = option.strikeFare > option.finalFare ? option.strikeFare : Math.round(option.finalFare * 1.05);
            const savings = originalPrice - option.finalFare;
            
            return (
              <div key={option.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-xl">
                
                {/* Vehicle Image Section with New Logic */}
                <div className="relative h-56 w-full bg-[#f4f5f7]">
                  {index === 0 && (
                    <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-yellow-400 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-sm">
                      <span>★</span> RECOMMENDED
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                     <img 
                        src={getVehicleImage(option.vehicleType, option.vehicleLabel)}
                        alt={option.vehicleLabel}
                        className="max-h-full max-w-full object-contain drop-shadow-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x250/f4f5f7/a0a0a0?text=Car+Image';
                        }}
                     />
                  </div>
                  
                  {/* Floating Vehicle Name Badge */}
                  <div className="absolute -bottom-4 left-4 rounded-xl border border-gray-100 bg-white px-4 py-2 shadow-lg z-10">
                    <div className="text-[9px] font-black uppercase tracking-wider text-gray-400">Vehicle</div>
                    <div className="text-sm font-black text-gray-900">{option.vehicleLabel}</div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 pt-8">
                  {/* Pricing Section */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Payable Now</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-4xl font-black text-[#1a365d]">
                          {option.fareText}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
                        <span className="text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                        <span className="text-emerald-600">5% OFF</span>
                      </div>
                      <div className="mt-1 text-xs font-semibold text-gray-500">
                        {isLocal ? option.packageLabel : `${option.actualDistance || option.billedDistance} km billed distance`}
                      </div>
                    </div>

                    {savings > 0 && (
                      <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-50 px-3 py-2 text-center border border-emerald-100">
                        <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600">You Save</span>
                        <span className="mt-0.5 text-base font-black text-emerald-700">₹{savings}</span>
                      </div>
                    )}
                  </div>

                  {/* Booking Benefit Banner */}
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-yellow-900">
                      <Zap className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-yellow-900">Online booking benefit</div>
                      <div className="mt-0.5 text-[10px] font-semibold text-yellow-800/80">Save 5% on this displayed fare</div>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-semibold text-gray-600">
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                      <Check className="h-4 w-4 text-emerald-500" /> {option.fuelIncluded ? "Fuel Included" : "Fuel Extra"}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                      <Check className="h-4 w-4 text-emerald-500" /> {option.driverAllowanceIncluded ? "Driver Included" : "Driver Included"}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                      <Check className="h-4 w-4 text-emerald-500" /> 24x7 support
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                      <Check className="h-4 w-4 text-emerald-500" /> 6h+ cancellation
                    </div>
                  </div>

                  <div className="mb-6 mt-6 flex items-center justify-between border-t border-gray-100 pt-5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {isLocal ? option.packageKms + " KM" : option.billedDistance + " KM"}</div>
                    {/* Yahan par ab duration hh:mm HRS format me dikhega */}
                    <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {isLocal ? option.packageHours + " HOURS" : formatDuration(option.durationMinutes)}</div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onBookCall ? onBookCall(option, data) : window.location.href = `tel:+919999999999`}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1a365d] text-xs font-black uppercase tracking-wide text-white transition-transform active:scale-95 sm:text-sm"
                    >
                      <Phone className="h-4 w-4" fill="currentColor" /> Book By Call
                    </button>
                    <button
                      onClick={() => {
                        if (onBookWhatsApp) {
                          onBookWhatsApp(option, data);
                        } else {
                          const text = `Hi, I want to book a ${option.vehicleLabel} from ${data.pickup} to ${data.drop} on ${data.pickupDate}. Fare shown: ${option.fareText}.`;
                          window.open(`https://wa.me/919999999999?text=${encodeURIComponent(text)}`, "_blank");
                        }
                      }}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-xs font-black uppercase tracking-wide text-white transition-transform active:scale-95 sm:text-sm"
                    >
                      <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- HELPER SUB-COMPONENTS ---

function MobileLocationField({
  type, value, placeholder, onOpen, onClear,
}: {
  type: LocationKind; value: string; placeholder: string; onOpen: () => void; onClear: () => void;
}) {
  return (
    <div className="relative flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-white p-4 transition-colors active:border-gray-300">
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-4 text-left outline-none">
        <LocationIcon type={type} />
        <div className="min-w-0 flex-1">
          <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            {type === "pickup" ? "Pickup Location" : "Destination"}
          </span>
          <span className={`mt-1 block truncate text-base sm:text-lg font-bold ${value ? "text-gray-900" : "text-gray-400"}`}>
            {value || placeholder}
          </span>
        </div>
      </button>

      {value && (
        <button
          type="button"
          aria-label={`Clear ${type}`}
          onClick={onClear}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

function MobileLocationPicker({
  type, value, suggestions, loading, onChange, onSelect, onUseDraft, onClose,
}: {
  type: LocationKind; value: string; suggestions: string[]; loading: boolean;
  onChange: (value: string) => void; onSelect: (value: string) => void;
  onUseDraft: () => void; onClose: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-white md:hidden">
      <div className="shrink-0 bg-white px-4 pb-4 pt-[max(14px,env(safe-area-inset-top))] shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <X className="h-5 w-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">
            {type === "pickup" ? "Enter Pickup" : "Enter Destination"}
          </h2>
        </div>

        <div className="flex items-center gap-3 rounded-xl border-2 border-gray-900 bg-white p-2">
          <Search className="ml-2 h-6 w-6 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={type === "pickup" ? "Search city or airport..." : "Search destination..."}
            className="min-w-0 flex-1 bg-transparent py-2 text-lg font-bold text-gray-900 outline-none placeholder:text-gray-400 placeholder:font-medium"
          />
          {value && (
            <button type="button" onClick={() => onChange("")} className="mr-1 rounded-full bg-gray-200 p-1.5 text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {loading && (
          <div className="p-4 text-center text-sm font-bold text-gray-500">Searching...</div>
        )}

        {suggestions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {suggestions.map((item, index) => (
              <button
                key={index}
                onClick={() => onSelect(item)}
                className="w-full flex items-center gap-4 px-4 py-4 text-left active:bg-gray-50"
              >
                <MapPin className="h-6 w-6 text-gray-400 shrink-0" />
                <span className="text-base font-semibold text-gray-900">{item}</span>
              </button>
            ))}
          </div>
        ) : value.trim().length >= 3 && !loading ? (
          <div className="p-8 text-center">
            <p className="text-base font-bold text-gray-900">No locations found</p>
            <p className="mt-1 text-sm text-gray-500">Try a different search term</p>
          </div>
        ) : null}
      </div>

      <div className="border-t border-gray-100 p-4 pb-[max(16px,env(safe-area-inset-bottom))] bg-white">
        <button
          type="button"
          disabled={value.trim().length < 3}
          onClick={onUseDraft}
          className="w-full h-14 rounded-xl bg-gray-900 text-white text-lg font-bold disabled:bg-gray-200 disabled:text-gray-400"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}

interface LocationFieldProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  type: LocationKind;
  id: string;
  value: string;
  suggestions: string[];
  showSuggestions: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
  onSelect: (value: string) => void;
}

const LocationField = React.forwardRef<HTMLDivElement, LocationFieldProps>(({
  inputRef, type, id, value, suggestions, showSuggestions, placeholder,
  onChange, onFocus, onClear, onSelect,
}, ref) => {
  return (
    <div ref={ref} className="relative rounded-xl border-2 border-gray-200 bg-white px-4 py-3 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-colors w-full">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
        {type === "pickup" ? "Pickup Location" : "Destination"}
      </label>
      <div className="flex items-center gap-3">
        <LocationIcon type={type} />
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full text-base sm:text-lg font-bold text-gray-900 outline-none placeholder:text-gray-400 placeholder:font-medium bg-transparent"
        />
        {value && (
          <button type="button" onClick={onClear} className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 shrink-0">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <SuggestionList type={type} items={suggestions} onSelect={onSelect} />
      )}
    </div>
  );
});
LocationField.displayName = "LocationField";

interface SuggestionListProps {
  items: string[];
  type: LocationKind;
  onSelect: (value: string) => void;
}

function SuggestionList({ items, type, onSelect }: SuggestionListProps) {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
      <ul className="max-h-60 overflow-y-auto">
        {items.map((item: string, index: number) => (
          <li key={index}>
            <button
              type="button"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-50 last:border-0"
            >
              <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
              <span className="text-sm font-bold text-gray-900">{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface JourneyFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: "date" | "time";
  min?: string;
  value: string;
  onChange: (value: string) => void;
}

function JourneyField({
  id, label, icon, type, min, value, onChange,
}: JourneyFieldProps) {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white px-4 py-3 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-colors w-full">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {icon}
        <input
          id={id}
          type={type}
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-base sm:text-lg font-bold text-gray-900 outline-none bg-transparent cursor-pointer [color-scheme:light]"
        />
      </div>
    </div>
  );
}

function TrustItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      {icon}
      <span className="text-xs sm:text-sm font-semibold">{title}</span>
    </div>
  );
}
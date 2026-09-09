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
  Sparkles,
  X,
  LocateFixed,
  Navigation,
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
  onFareCalculated: (data: {
    fareOptions: any[];
    pickup: string;
    drop: string;
    bookingType: BookingType;
    serviceType: ServiceType;
    pickupDate: string;
    pickupTime: string;
    returnDate?: string;
    returnTime?: string;
    localPackage?: LocalPackageType;
    packageLabel?: string;
  }) => void;
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

function LocationIcon({ type }: { type: LocationKind }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
        type === "pickup"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-rose-50 text-rose-600"
      }`}
    >
      <MapPin className="h-5 w-5" strokeWidth={2.5} />
    </span>
  );
}

function DateTimeIcon({ type }: { type: "date" | "time" }) {
  return type === "date" ? (
    <CalendarDays className="h-4 w-4" strokeWidth={2.5} />
  ) : (
    <Clock3 className="h-4 w-4" strokeWidth={2.5} />
  );
}

export default function FareCalculator({ onFareCalculated }: FareCalculatorProps) {
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

  // Mobile location experience: tapping a location field opens a dedicated
  // full-screen location picker. The real form value is only committed when
  // the user selects one suggestion, so the picker closes immediately.
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

  // Critical autocomplete fix:
  // selecting a suggestion marks the value as committed, aborts the old request,
  // clears the list and prevents the new state value from immediately querying again.
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

      onFareCalculated({
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
      });
    } catch (error: any) {
      console.error("Fare calculation error:", error);
      setErrorMessage(error?.message || "Unable to calculate fare right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabItems: Array<{ id: MainTab; label: string; sub: string; icon: React.ReactNode }> = [
    { id: "oneway", label: "One Way", sub: "Outstation", icon: <ArrowLeftRight className="h-4 w-4" /> },
    { id: "roundtrip", label: "Round Trip", sub: "Return journey", icon: <ArrowLeftRight className="h-4 w-4" /> },
    { id: "airport", label: "Airport", sub: "Pickup / Drop", icon: <Plane className="h-4 w-4" /> },
    { id: "local", label: "Local", sub: "Hourly rental", icon: <CarFront className="h-4 w-4" /> },
  ];

  const fieldClass =
    "relative min-w-0 rounded-[18px] border border-slate-200 bg-white px-3.5 py-2.5 transition focus-within:border-[#F59E0B] focus-within:ring-4 focus-within:ring-amber-400/10";

  return (
    <div className="w-full">
      <div className="overflow-visible rounded-[28px] border border-slate-200/90 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
        <div className="relative overflow-hidden rounded-t-[28px] bg-[#071B33] px-4 py-4 sm:px-6 lg:px-7">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                Khatu Rides · Smart Fare
              </div>
              <h1 className="mt-1 text-xl font-black tracking-[-0.035em] text-white sm:text-2xl">
                Calculate your cab fare
              </h1>
              <p className="mt-1 max-w-2xl text-[10px] font-medium leading-4 text-blue-100/75 sm:text-[11px]">
                Enter your route and journey details. We calculate the road distance first, then show available vehicle fares.
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 sm:flex">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <div>
                <div className="text-[9px] font-black uppercase tracking-wider text-white">Transparent</div>
                <div className="text-[8px] font-semibold text-blue-100/60">No fake distance fallback</div>
              </div>
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-2 gap-1.5 rounded-[18px] bg-white/8 p-1.5 md:grid-cols-4">
            {tabItems.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectTab(item.id)}
                  aria-pressed={active}
                  className={`flex min-h-[48px] min-w-0 items-center justify-center gap-2 rounded-[14px] px-2 text-left transition ${
                    active
                      ? "bg-[#FBBF24] text-[#071B33] shadow-[0_10px_25px_rgba(251,191,36,0.22)]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${active ? "bg-white/55" : "bg-white/10"}`}>
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[9px] font-black uppercase tracking-[0.03em] sm:text-[10px]">{item.label}</span>
                    <span className={`mt-0.5 block truncate text-[7px] font-bold ${active ? "text-slate-700/70" : "text-white/45"}`}>{item.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-3 sm:p-5 lg:p-6">
          <div
            className={`grid min-w-0 grid-cols-2 gap-2.5 lg:items-stretch ${
              isLocal
                ? "lg:grid-cols-[minmax(230px,1.65fr)_minmax(160px,1fr)_minmax(145px,.9fr)_minmax(125px,.8fr)_minmax(175px,auto)]"
                : isRoundTrip
                  ? "lg:grid-cols-[minmax(380px,2.7fr)_minmax(135px,.8fr)_minmax(120px,.7fr)_minmax(135px,.8fr)_minmax(120px,.7fr)_minmax(175px,auto)]"
                  : "lg:grid-cols-[minmax(420px,3.3fr)_minmax(145px,.9fr)_minmax(125px,.8fr)_minmax(175px,auto)]"
            }`}
          >
            {!isLocal && (
              <>
                {/* MOBILE: pickup and destination are full-width stacked fields. */}
                <div className="col-span-2 grid grid-cols-1 gap-2.5 md:hidden">
                  <MobileLocationField
                    type="pickup"
                    value={pickup}
                    placeholder="Tap to select pickup location"
                    onOpen={() => openMobileLocationEditor("pickup")}
                    onClear={clearPickup}
                  />
                  <MobileLocationField
                    type="drop"
                    value={drop}
                    placeholder="Tap to select destination"
                    onOpen={() => openMobileLocationEditor("drop")}
                    onClear={clearDrop}
                  />
                </div>

                {/* DESKTOP: compact side-by-side location fields. */}
                <div className="relative hidden min-w-0 lg:col-span-1 md:grid md:grid-cols-2 md:gap-2.5">
                  <LocationField
                    ref={pickupRef}
                    inputRef={pickupInputRef}
                    type="pickup"
                    id="kr-pickup"
                    value={pickup}
                    suggestions={pickupSuggestions}
                    showSuggestions={showPickupList}
                    placeholder="City, airport or pickup point"
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

                  <LocationField
                    ref={dropRef}
                    inputRef={dropInputRef}
                    type="drop"
                    id="kr-drop"
                    value={drop}
                    suggestions={dropSuggestions}
                    showSuggestions={showDropList}
                    placeholder={isAirport ? "Airport or destination" : "City, airport or destination"}
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

                  <button
                    type="button"
                    onClick={swapLocations}
                    aria-label="Swap pickup and destination"
                    className="absolute left-1/2 top-1/2 z-[60] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#F59E0B] text-[#071B33] shadow-[0_6px_16px_rgba(245,158,11,0.30)] transition hover:scale-105 hover:bg-[#FBBF24] active:scale-95"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" strokeWidth={2.8} />
                  </button>
                </div>

                <JourneyField
                  id="kr-pickup-date"
                  label="Pickup date"
                  icon={<DateTimeIcon type="date" />}
                  type="date"
                  min={minDate}
                  value={pickupDate}
                  onChange={(value) => {
                    setPickupDate(value);
                    setErrorMessage("");
                  }}
                />

                <JourneyField
                  id="kr-pickup-time"
                  label="Pickup time"
                  icon={<DateTimeIcon type="time" />}
                  type="time"
                  min={pickupDate === minDate ? minTime : undefined}
                  value={pickupTime}
                  onChange={(value) => {
                    setPickupTime(value);
                    setErrorMessage("");
                  }}
                />

                {isRoundTrip && (
                  <>
                    <JourneyField
                      id="kr-return-date"
                      label="Return date"
                      icon={<DateTimeIcon type="date" />}
                      type="date"
                      min={pickupDate || minDate}
                      value={returnDate}
                      onChange={(value) => {
                        setReturnDate(value);
                        setErrorMessage("");
                      }}
                    />
                    <JourneyField
                      id="kr-return-time"
                      label="Return time"
                      icon={<DateTimeIcon type="time" />}
                      type="time"
                      value={returnTime}
                      onChange={(value) => {
                        setReturnTime(value);
                        setErrorMessage("");
                      }}
                    />
                  </>
                )}
              </>
            )}

            {isLocal && (
              <>
                <div className="col-span-2 md:hidden">
                  <MobileLocationField
                    type="pickup"
                    value={pickup}
                    placeholder="Tap to select city or pickup area"
                    onOpen={() => openMobileLocationEditor("pickup")}
                    onClear={clearPickup}
                  />
                </div>

                <div className="hidden md:block">
                <LocationField
                  ref={pickupRef}
                  inputRef={pickupInputRef}
                  type="pickup"
                  id="kr-pickup-local"
                  value={pickup}
                  suggestions={pickupSuggestions}
                  showSuggestions={showPickupList}
                  placeholder="City or pickup area"
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

                <div className={fieldClass}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <label htmlFor="kr-local-package" className="truncate text-[8px] font-black uppercase tracking-[0.12em] text-amber-600">Package</label>
                    <span className="text-[7px] font-black uppercase tracking-wider text-slate-400">Hourly</span>
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Clock3 className="h-4 w-4" />
                    </span>
                    <select
                      id="kr-local-package"
                      value={localPackage}
                      onChange={(e) => {
                        setLocalPackage(e.target.value as LocalPackageType);
                        setErrorMessage("");
                      }}
                      className="min-w-0 flex-1 appearance-none bg-transparent text-[11px] font-black text-slate-950 outline-none"
                    >
                      {LOCAL_PACKAGE_OPTIONS.map((item) => (
                        <option key={item.id} value={item.id}>{item.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                  </div>
                </div>

                <JourneyField
                  id="kr-local-date"
                  label="Pickup date"
                  icon={<DateTimeIcon type="date" />}
                  type="date"
                  min={minDate}
                  value={pickupDate}
                  onChange={(value) => {
                    setPickupDate(value);
                    setErrorMessage("");
                  }}
                />
                <JourneyField
                  id="kr-local-time"
                  label="Pickup time"
                  icon={<DateTimeIcon type="time" />}
                  type="time"
                  min={pickupDate === minDate ? minTime : undefined}
                  value={pickupTime}
                  onChange={(value) => {
                    setPickupTime(value);
                    setErrorMessage("");
                  }}
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group col-span-2 flex min-h-[66px] min-w-0 items-center justify-center gap-2 rounded-[18px] lg:col-span-1 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] px-4 text-[#071B33] shadow-[0_14px_30px_rgba(245,158,11,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(245,158,11,0.32)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/25 border-t-slate-950" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Checking fares</span>
                </>
              ) : (
                <>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-950/10">
                    <Search className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block truncate text-[10px] font-black uppercase tracking-[0.04em]">
                      {isLocal ? "See package fare" : "Check fare"}
                    </span>
                    <span className="hidden text-[7px] font-bold text-slate-800/60 sm:block">Compare available cars</span>
                  </span>
                  <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
                </>
              )}
            </button>
          </div>

          {isRoundTrip && (
            <div className="mt-2.5 rounded-2xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-[8px] font-bold text-blue-700">
              Round trip selected · pickup and return date/time are shown together on desktop and in two columns on mobile.
            </div>
          )}

          {isLocal && (
            <div className="mt-2.5 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/80 px-3 py-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="text-[8px] font-black text-emerald-800">
                {LOCAL_PACKAGE_OPTIONS.find((x) => x.id === localPackage)?.label} · Fuel included · Driver allowance included · Toll & parking at actuals
              </span>
            </div>
          )}

          {errorMessage && (
            <div role="alert" className="mt-2.5 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[9px] font-bold text-rose-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 font-black">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/80">
            <TrustItem icon={<ShieldCheck className="h-4 w-4" />} title="Transparent fare" sub="See before booking" />
            <TrustItem icon={<MapPin className="h-4 w-4" />} title="Route based" sub="Road distance first" />
            <TrustItem icon={<Check className="h-4 w-4" />} title="24×7 support" sub="Direct assistance" />
          </div>
        </form>

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
  );
}

function MobileLocationField({
  type,
  value,
  placeholder,
  onOpen,
  onClear,
}: {
  type: LocationKind;
  value: string;
  placeholder: string;
  onOpen: () => void;
  onClear: () => void;
}) {
  return (
    <div className="relative flex min-h-[76px] items-center gap-3 rounded-[20px] border border-slate-200 bg-white px-3.5 py-3 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition active:scale-[0.995]">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none"
      >
        <LocationIcon type={type} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
            {type === "pickup" ? "From · Pickup" : "To · Destination"}
            <span className={`h-1.5 w-1.5 rounded-full ${type === "pickup" ? "bg-emerald-500" : "bg-rose-500"}`} />
          </span>
          <span className={`mt-1 block truncate text-[12px] font-black ${value ? "text-slate-950" : "text-slate-400"}`}>
            {value || placeholder}
          </span>
          <span className="mt-0.5 block text-[7px] font-semibold text-slate-400">Tap to search & select location</span>
        </span>
        <Navigation className="h-4 w-4 shrink-0 text-slate-300" />
      </button>

      {value && (
        <button
          type="button"
          aria-label={`Clear ${type} location`}
          onClick={onClear}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function MobileLocationPicker({
  type,
  value,
  suggestions,
  loading,
  onChange,
  onSelect,
  onUseDraft,
  onClose,
}: {
  type: LocationKind;
  value: string;
  suggestions: string[];
  loading: boolean;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  onUseDraft: () => void;
  onClose: () => void;
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
    <div className="fixed inset-0 z-[10000] flex flex-col bg-[#F7F9FC] md:hidden">
      <div className="shrink-0 bg-[#071B33] px-4 pb-4 pt-[max(14px,env(safe-area-inset-top))] text-white shadow-[0_8px_30px_rgba(7,27,51,0.20)]">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location search"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white active:scale-95"
          >
            <ArrowLeftRight className="h-4 w-4 rotate-180" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="text-[8px] font-black uppercase tracking-[0.16em] text-amber-300">
              {type === "pickup" ? "Pickup location" : "Destination"}
            </div>
            <div className="mt-0.5 truncate text-base font-black">
              Search your location
            </div>
          </div>

          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${type === "pickup" ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"}`}>
            <MapPin className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-[16px] border border-white/10 bg-white p-2 text-slate-950 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <Search className="ml-2 h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={type === "pickup" ? "Type pickup city, airport or area..." : "Type destination city, airport or area..."}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-[13px] font-black outline-none placeholder:font-semibold placeholder:text-slate-400"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
        {loading && (
          <div className="mb-2 flex items-center gap-3 rounded-[16px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Searching locations...</span>
          </div>
        )}

        {suggestions.length > 0 ? (
          <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <MapPin className={`h-4 w-4 ${type === "pickup" ? "text-emerald-600" : "text-rose-600"}`} />
              <span className="text-[8px] font-black uppercase tracking-[0.14em] text-slate-500">
                Select a location
              </span>
            </div>

            {suggestions.map((item, index) => (
              <button
                key={`${type}-mobile-${item}-${index}`}
                type="button"
                onClick={() => onSelect(item)}
                className="flex min-h-[64px] w-full items-center gap-3 border-b border-slate-100 px-4 text-left last:border-b-0 active:bg-amber-50"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${type === "pickup" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-black leading-4 text-slate-800">{item}</span>
                  <span className="mt-0.5 block text-[7px] font-semibold text-slate-400">Tap to select</span>
                </span>
                <span className="text-lg font-light text-slate-300">›</span>
              </button>
            ))}
          </div>
        ) : value.trim().length >= MIN_AUTOCOMPLETE_CHARS && !loading ? (
          <div className="rounded-[20px] border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="mt-3 text-[11px] font-black text-slate-800">No suggestions found</div>
            <div className="mt-1 text-[8px] font-semibold leading-4 text-slate-400">Try adding the city, airport or nearby area name.</div>
          </div>
        ) : (
          <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <LocateFixed className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-800">Search and choose your exact location</div>
                <div className="mt-1 text-[8px] font-semibold leading-4 text-slate-400">Type at least 3 characters to see location suggestions.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(15,23,42,0.07)]">
        <button
          type="button"
          disabled={value.trim().length < 3}
          onClick={onUseDraft}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-[#063B8F] px-4 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_10px_25px_rgba(6,59,143,0.20)] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          <Check className="h-4 w-4" />
          Use this location
        </button>
      </div>
    </div>
  );
}

const LocationField = React.forwardRef<HTMLDivElement, {
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
}>(({
  inputRef, type, id, value, suggestions, showSuggestions, placeholder,
  onChange, onFocus, onClear, onSelect,
}, ref) => {
  return (
    <div ref={ref} className="relative min-w-0 rounded-[18px] border border-slate-200 bg-white px-3.5 py-2.5 transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/10">
      <div className="mb-1 flex items-center justify-between gap-2">
        <label htmlFor={id} className="truncate text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
          {type === "pickup" ? "From · Pickup" : "To · Destination"}
        </label>
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${type === "pickup" ? "bg-emerald-500" : "bg-rose-500"}`} />
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <LocationIcon type={type} />
        <input
          id={id}
          ref={inputRef}
          type="text"
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[11px] font-black text-slate-950 outline-none placeholder:text-slate-400 sm:text-[12px]"
        />
        {value && (
          <button
            type="button"
            aria-label={`Clear ${type} location`}
            onPointerDown={(e) => e.preventDefault()}
            onClick={onClear}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-300 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
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

function SuggestionList({
  items, type, onSelect,
}: {
  items: string[];
  type: LocationKind;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[9999] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
        <MapPin className={`h-3.5 w-3.5 ${type === "pickup" ? "text-emerald-600" : "text-rose-600"}`} />
        <span className="text-[7px] font-black uppercase tracking-[0.14em] text-slate-400">
          {type === "pickup" ? "Suggested pickup locations" : "Suggested destinations"}
        </span>
      </div>
      <ul className="max-h-56 overflow-y-auto overscroll-contain">
        {items.map((item, index) => (
          <li key={`${type}-${item}-${index}`}>
            <button
              type="button"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-2.5 border-b border-slate-50 px-3 py-2.5 text-left transition hover:bg-amber-50 active:bg-amber-100"
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${type === "pickup" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                <MapPin className="h-3 w-3" />
              </span>
              <span className="min-w-0 flex-1 text-[10px] font-bold leading-4 text-slate-700">{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function JourneyField({
  id, label, icon, type, min, value, onChange,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: "date" | "time";
  min?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0 rounded-[18px] border border-slate-200 bg-white px-3.5 py-2.5 transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/10">
      <label htmlFor={id} className="mb-1 flex items-center gap-1.5 truncate text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
        <span className="text-amber-500">{icon}</span>
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 w-full bg-transparent text-[11px] font-black text-slate-950 outline-none [color-scheme:light]"
      />
    </div>
  );
}

function TrustItem({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-2 px-2 py-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">{icon}</span>
      <div className="min-w-0">
        <div className="truncate text-[8px] font-black text-slate-800 sm:text-[9px]">{title}</div>
        <div className="hidden truncate text-[7px] font-semibold text-slate-400 sm:block">{sub}</div>
      </div>
    </div>
  );
}

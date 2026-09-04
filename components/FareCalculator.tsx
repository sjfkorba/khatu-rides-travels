// components/FareCalculator.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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

const LOCAL_PACKAGE_OPTIONS: Array<{
  id: LocalPackageType;
  label: string;
}> = [
  { id: "8hr80km", label: "8 Hours / 80 KM" },
  { id: "12hr120km", label: "12 Hours / 120 KM" },
];

const iconClass = "h-5 w-5";

function LocationIcon({ type }: { type: "pickup" | "drop" }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
        type === "pickup"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-rose-50 text-rose-600"
      }`}
      aria-hidden="true"
    >
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s7-6.1 7-12a7 7 0 10-14 0c0 5.9 7 12 7 12Z"
        />
        <circle cx="12" cy="9" r="2.2" />
      </svg>
    </span>
  );
}

function CalendarIcon() {
  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M16 2v4M8 2v4M3 9h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 2" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-4-4" />
    </svg>
  );
}

function formatINR(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function getLocalDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function getLocalTimeString(date = new Date()) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
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
        .map((item: any) => {
          if (typeof item === "string") return item.trim();
          return String(item?.description || item?.formatted_address || "").trim();
        })
        .filter(Boolean)
    )
  ).slice(0, MAX_SUGGESTIONS);
}

export default function FareCalculator({
  onFareCalculated,
}: FareCalculatorProps) {
  const [tab, setTab] = useState<MainTab>("oneway");

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  const [localPackage, setLocalPackage] =
    useState<LocalPackageType>("8hr80km");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");

  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropList, setShowDropList] = useState(false);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropInputRef = useRef<HTMLInputElement>(null);

  const pickupAbortRef = useRef<AbortController | null>(null);
  const dropAbortRef = useRef<AbortController | null>(null);

  const pickupRequestRef = useRef(0);
  const dropRequestRef = useRef(0);

  const isLocal = tab === "local";
  const isRoundTrip = tab === "roundtrip";
  const isAirport = tab === "airport";

  const serviceType: ServiceType = isLocal ? "local" : "outstation";

  const bookingType: BookingType = isLocal
    ? "local"
    : isRoundTrip
      ? "roundtrip"
      : "oneway";

  const selectedPackage = useMemo(() => {
    return LOCAL_PACKAGES.sedan[localPackage];
  }, [localPackage]);

  /*
   * Keep the minimum date/time synchronized with the browser's local time.
   * We intentionally do not force the user's selected date/time to change
   * every minute; validation below handles stale selections safely.
   */
  useEffect(() => {
    const syncClock = () => {
      const now = new Date();
      setMinDate(getLocalDateString(now));
      setMinTime(getLocalTimeString(now));

      setPickupDate((current) => current || getLocalDateString(now));

      setPickupTime((current) => {
        if (current) return current;

        const suggested = new Date(now.getTime() + 60 * 60 * 1000);
        return `${String(suggested.getHours()).padStart(2, "0")}:00`;
      });
    };

    syncClock();

    const timer = window.setInterval(syncClock, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  /*
   * Pickup autocomplete.
   * - Debounced
   * - Abortable
   * - Request-id protected
   * - Does not run from onChange
   */
  useEffect(() => {
    const value = pickup.trim();
    const requestId = ++pickupRequestRef.current;

    pickupAbortRef.current?.abort();
    pickupAbortRef.current = null;

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
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const raw = await response.text();

        if (!response.ok) {
          if (requestId === pickupRequestRef.current) {
            setPickupSuggestions([]);
            setShowPickupList(false);
          }
          return;
        }

        let data: any = null;

        try {
          data = JSON.parse(raw);
        } catch {
          console.error("Pickup autocomplete returned invalid JSON.");
          return;
        }

        if (requestId !== pickupRequestRef.current) return;

        const results = sanitizeSuggestions(data?.predictions ?? data?.results);

        setPickupSuggestions(results);
        setShowPickupList(results.length > 0);
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("Pickup autocomplete error:", error);
        }
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [pickup]);

  /*
   * Drop autocomplete.
   */
  useEffect(() => {
    const value = drop.trim();
    const requestId = ++dropRequestRef.current;

    dropAbortRef.current?.abort();
    dropAbortRef.current = null;

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
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const raw = await response.text();

        if (!response.ok) {
          if (requestId === dropRequestRef.current) {
            setDropSuggestions([]);
            setShowDropList(false);
          }
          return;
        }

        let data: any = null;

        try {
          data = JSON.parse(raw);
        } catch {
          console.error("Drop autocomplete returned invalid JSON.");
          return;
        }

        if (requestId !== dropRequestRef.current) return;

        const results = sanitizeSuggestions(data?.predictions ?? data?.results);

        setDropSuggestions(results);
        setShowDropList(results.length > 0);
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("Drop autocomplete error:", error);
        }
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [drop]);

  /*
   * Global cleanup.
   */
  useEffect(() => {
    return () => {
      pickupAbortRef.current?.abort();
      dropAbortRef.current?.abort();
    };
  }, []);

  /*
   * Close autocomplete only when clicking outside the corresponding field.
   */
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (pickupRef.current && !pickupRef.current.contains(target)) {
        setShowPickupList(false);
      }

      if (dropRef.current && !dropRef.current.contains(target)) {
        setShowDropList(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const selectTab = (next: MainTab) => {
    setTab(next);
    setErrorMessage("");
    setShowPickupList(false);
    setShowDropList(false);

    if (next === "local") {
      setDrop("");
      setDropSuggestions([]);
      setShowDropList(false);
      setReturnDate("");
      setReturnTime("");
    }

    if (next !== "roundtrip") {
      setReturnDate("");
      setReturnTime("");
    }
  };

  const clearPickup = () => {
    setPickup("");
    setPickupSuggestions([]);
    setShowPickupList(false);

    window.requestAnimationFrame(() => {
      pickupInputRef.current?.focus();
    });
  };

  const clearDrop = () => {
    setDrop("");
    setDropSuggestions([]);
    setShowDropList(false);

    window.requestAnimationFrame(() => {
      dropInputRef.current?.focus();
    });
  };

  const swapLocations = () => {
    if (isLocal) return;

    const oldPickup = pickup;
    const oldDrop = drop;

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
      setPickup(value);
      setPickupSuggestions([]);
      setShowPickupList(false);

      window.requestAnimationFrame(() => {
        pickupInputRef.current?.focus();
      });
    } else {
      setDrop(value);
      setDropSuggestions([]);
      setShowDropList(false);

      window.requestAnimationFrame(() => {
        dropInputRef.current?.focus();
      });
    }
  };

  const validateDateTime = () => {
    const now = new Date();

    const pickupTimestamp = dateTimeToTimestamp(pickupDate, pickupTime);

    if (!Number.isFinite(pickupTimestamp)) {
      return "Please select a valid pickup date and time.";
    }

    if (pickupTimestamp < now.getTime()) {
      return "Pickup time cannot be in the past. Please select a future time.";
    }

    if (!isRoundTrip) return "";

    const returnTimestamp = dateTimeToTimestamp(returnDate, returnTime);

    if (!Number.isFinite(returnTimestamp)) {
      return "Please select a valid return date and time.";
    }

    if (returnTimestamp <= pickupTimestamp) {
      return "Return date and time must be after the pickup date and time.";
    }

    return "";
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
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
      setErrorMessage("Please enter your drop destination.");
      dropInputRef.current?.focus();
      return;
    }

    if (!pickupDate || !pickupTime) {
      setErrorMessage("Please select your pickup date and time.");
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

      /*
       * IMPORTANT:
       * Never silently calculate an outstation fare using a fake fallback
       * distance when the distance service fails. That can create a wrong fare.
       */
      if (!isLocal) {
        const response = await fetch("/api/distance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            origin: cleanPickup,
            destination: cleanDrop,
          }),
          cache: "no-store",
        });

        const raw = await response.text();

        let data: any = null;

        try {
          data = JSON.parse(raw);
        } catch {
          throw new Error("Distance service returned invalid data.");
        }

        const calculatedDistance = Number(data?.distanceKm);

        if (
          !response.ok ||
          !Number.isFinite(calculatedDistance) ||
          calculatedDistance <= 0
        ) {
          throw new Error(
            data?.error ||
              "Unable to determine the route distance. Please try again."
          );
        }

        distanceKm = calculatedDistance;
      }

      const createdAt = Date.now();

      const fareOptions = (Object.keys(VEHICLES) as VehicleType[]).map(
        (vehicleType) => {
          const packageConfig = isLocal
            ? LOCAL_PACKAGES[vehicleType][localPackage]
            : undefined;

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
            throw new Error(
              `Unable to calculate fare for ${VEHICLES[vehicleType].label}.`
            );
          }

          const localFare = result.localFare;

          return {
            id: `${bookingType}-${vehicleType}-${createdAt}`,

            vehicleType,
            vehicleLabel: VEHICLES[vehicleType].label,
            vehicleImage: VEHICLES[vehicleType].image,

            finalFare: result.finalFare,
            strikeFare: isLocal
              ? result.finalFare
              : result.strikeFare,

            fareText: formatINR(result.finalFare),

            billedDistance: result.billedDistance,
            actualDistance: result.actualDistance,
            durationMinutes: result.durationMinutes,

            /*
             * Local package information.
             * These fields are intentionally added without changing the
             * existing parent page contract because fareOptions is any[].
             */
            localPackage: isLocal ? localPackage : undefined,
            packageLabel: isLocal
              ? localFare?.package.label
              : undefined,
            packageHours: isLocal
              ? localFare?.package.hours
              : undefined,
            packageKms: isLocal
              ? localFare?.package.kms
              : undefined,

            packageFare: isLocal
              ? localFare?.packageFare
              : undefined,

            extraHours: isLocal
              ? localFare?.extraHours
              : undefined,
            extraKilometers: isLocal
              ? localFare?.extraKilometers
              : undefined,

            extraHourRate: isLocal
              ? localFare?.package.extraHourRate
              : undefined,
            extraKmRate: isLocal
              ? localFare?.package.extraKmRate
              : undefined,

            extraHourCharges: isLocal
              ? localFare?.extraHourCharges
              : undefined,
            extraKmCharges: isLocal
              ? localFare?.extraKmCharges
              : undefined,

            totalExtraCharges: isLocal
              ? localFare?.totalExtraCharges
              : undefined,

            driverAllowanceIncluded: isLocal
              ? true
              : undefined,

            fuelIncluded: true,

            tollParkingExcluded: isLocal
              ? true
              : undefined,

            cancellationText:
              "Free cancellation before 6 hours from journey time",
          };
        }
      );

      const packageLabel = LOCAL_PACKAGE_OPTIONS.find(
        (item) => item.id === localPackage
      )?.label;

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

      setErrorMessage(
        error?.message ||
          "Unable to calculate fare right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const field =
    "group relative min-w-0 min-h-[72px] rounded-[20px] border border-slate-200 bg-white transition-all duration-200 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10 focus-within:shadow-[0_10px_30px_rgba(249,115,22,0.08)]";

  const tabButton = (active: boolean) =>
    `relative flex min-h-[58px] items-center justify-center gap-2 rounded-[15px] px-1.5 text-[9px] font-black uppercase tracking-[0.04em] transition-all duration-200 sm:px-3 sm:text-[10px] ${
      active
        ? "bg-slate-950 text-white shadow-[0_10px_25px_rgba(15,23,42,0.18)]"
        : "text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm"
    }`;

  return (
    <div className="w-full min-w-0">
      <div className="overflow-visible rounded-[28px] border border-slate-200/90 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.14)] ring-1 ring-black/[0.02]">
        <div className="border-b border-slate-100 bg-white px-3 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4">
          <div className="mb-3 flex items-end justify-between gap-4 px-1">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-600">Khatu Rides · Online booking</p>
              <h2 className="mt-1 text-base font-black tracking-[-0.02em] text-slate-950 sm:text-lg">Plan your ride</h2>
            </div>
            <div className="hidden items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-slate-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live fare check
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 rounded-[20px] bg-slate-100/90 p-1.5 sm:grid-cols-4">
            <button type="button" onClick={() => selectTab("oneway")} className={tabButton(tab === "oneway")} aria-pressed={tab === "oneway"}>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-sm">→</span>
              <span className="leading-tight">One Way<span className="mt-0.5 block text-[7px] font-bold normal-case tracking-normal opacity-60">Outstation</span></span>
            </button>
            <button type="button" onClick={() => selectTab("roundtrip")} className={tabButton(tab === "roundtrip")} aria-pressed={tab === "roundtrip"}>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-sm">⇄</span>
              <span className="leading-tight">Round Trip<span className="mt-0.5 block text-[7px] font-bold normal-case tracking-normal opacity-60">Outstation</span></span>
            </button>
            <button type="button" onClick={() => selectTab("local")} className={tabButton(tab === "local")} aria-pressed={tab === "local"}>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-sm">◷</span>
              <span className="leading-tight">Local<span className="mt-0.5 block text-[7px] font-bold normal-case tracking-normal opacity-60">Hourly package</span></span>
            </button>
            <button type="button" onClick={() => selectTab("airport")} className={tabButton(tab === "airport")} aria-pressed={tab === "airport"}>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-sm">✈</span>
              <span className="leading-tight">Airport<span className="mt-0.5 block text-[7px] font-bold normal-case tracking-normal opacity-60">Transfer</span></span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfe_100%)] p-3 sm:p-5 lg:p-6">
          {!isLocal && (
            <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1.75fr)_minmax(205px,1fr)_minmax(205px,1fr)]">
              <div className="relative grid min-w-0 gap-3 lg:col-span-2 lg:grid-cols-2">
                <div ref={pickupRef} className={`${field} z-40 min-w-0`}>
                  <label htmlFor="kr-pickup" className="block px-5 pt-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">Pickup Location</label>
                  <div className="flex min-w-0 items-center gap-3 px-4 pb-3 pt-1">
                    <LocationIcon type="pickup" />
                    <input id="kr-pickup" ref={pickupInputRef} type="text" required autoComplete="off" autoCorrect="off" autoCapitalize="words" spellCheck={false} value={pickup}
                      onChange={(e) => { setPickup(e.target.value); setErrorMessage(""); if (e.target.value.trim().length < MIN_AUTOCOMPLETE_CHARS) setShowPickupList(false); }}
                      onFocus={() => pickupSuggestions.length > 0 && setShowPickupList(true)}
                      placeholder="Enter city, airport or pickup point"
                      className="min-w-0 flex-1 bg-transparent text-[14px] font-black text-slate-950 outline-none placeholder:text-slate-400" />
                    {pickup && <button type="button" tabIndex={-1} aria-label="Clear pickup location" onPointerDown={(e) => e.preventDefault()} onClick={clearPickup} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg leading-none text-slate-300 hover:bg-slate-100 hover:text-slate-600">×</button>}
                  </div>
                  {showPickupList && pickupSuggestions.length > 0 && <SuggestionList items={pickupSuggestions} type="pickup" onSelect={(value) => selectSuggestion("pickup", value)} />}
                </div>

                <div ref={dropRef} className={`${field} z-30 min-w-0`}>
                  <label htmlFor="kr-drop" className="block px-5 pt-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">Drop Destination</label>
                  <div className="flex min-w-0 items-center gap-3 px-4 pb-3 pt-1">
                    <LocationIcon type="drop" />
                    <input id="kr-drop" ref={dropInputRef} type="text" required autoComplete="off" autoCorrect="off" autoCapitalize="words" spellCheck={false} value={drop}
                      onChange={(e) => { setDrop(e.target.value); setErrorMessage(""); if (e.target.value.trim().length < MIN_AUTOCOMPLETE_CHARS) setShowDropList(false); }}
                      onFocus={() => dropSuggestions.length > 0 && setShowDropList(true)}
                      placeholder={isAirport ? "Enter airport or destination" : "Enter city, airport or destination"}
                      className="min-w-0 flex-1 bg-transparent text-[14px] font-black text-slate-950 outline-none placeholder:text-slate-400" />
                    {drop && <button type="button" tabIndex={-1} aria-label="Clear drop destination" onPointerDown={(e) => e.preventDefault()} onClick={clearDrop} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg leading-none text-slate-300 hover:bg-slate-100 hover:text-slate-600">×</button>}
                  </div>
                  {showDropList && dropSuggestions.length > 0 && <SuggestionList items={dropSuggestions} type="drop" onSelect={(value) => selectSuggestion("drop", value)} />}
                </div>

                <button type="button" onClick={swapLocations} aria-label="Swap pickup and destination" className="absolute left-1/2 top-1/2 z-[70] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-orange-500 text-white shadow-[0_9px_24px_rgba(249,115,22,0.30)] transition hover:scale-105 hover:bg-orange-600 active:scale-95">
                  <SwapIcon />
                </button>
              </div>

              <JourneyDateTimeCard id="kr-pickup-journey" label="Pickup" minDate={minDate} minTime={pickupDate === minDate ? minTime : undefined} date={pickupDate} time={pickupTime}
                onDateChange={(value) => { setPickupDate(value); setErrorMessage(""); }} onTimeChange={(value) => { setPickupTime(value); setErrorMessage(""); }} />

              {isRoundTrip ? (
                <JourneyDateTimeCard id="kr-return-journey" label="Return" minDate={pickupDate || minDate} date={returnDate} time={returnTime}
                  onDateChange={(value) => { setReturnDate(value); setErrorMessage(""); }} onTimeChange={(value) => { setReturnTime(value); setErrorMessage(""); }} />
              ) : (
                <div className="hidden min-h-[96px] rounded-[20px] border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 lg:flex lg:flex-col lg:justify-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.13em] text-slate-400">One-way journey</p>
                  <p className="mt-1 text-[10px] font-semibold leading-4 text-slate-500">Select your date and time. Your fare is shown before booking.</p>
                </div>
              )}
            </div>
          )}

          {isLocal && (
            <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(320px,1.75fr)_minmax(230px,1.15fr)_minmax(205px,1fr)]">
              <div ref={pickupRef} className={`${field} z-40 min-w-0`}>
                <label htmlFor="kr-pickup-local" className="block px-5 pt-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">Pickup Location</label>
                <div className="flex min-w-0 items-center gap-3 px-4 pb-3 pt-1">
                  <LocationIcon type="pickup" />
                  <input id="kr-pickup-local" ref={pickupInputRef} type="text" required autoComplete="off" autoCorrect="off" autoCapitalize="words" spellCheck={false} value={pickup}
                    onChange={(e) => { setPickup(e.target.value); setErrorMessage(""); if (e.target.value.trim().length < MIN_AUTOCOMPLETE_CHARS) setShowPickupList(false); }}
                    onFocus={() => pickupSuggestions.length > 0 && setShowPickupList(true)} placeholder="Enter pickup city or area"
                    className="min-w-0 flex-1 bg-transparent text-[14px] font-black text-slate-950 outline-none placeholder:text-slate-400" />
                  {pickup && <button type="button" tabIndex={-1} aria-label="Clear pickup location" onPointerDown={(e) => e.preventDefault()} onClick={clearPickup} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg leading-none text-slate-300 hover:bg-slate-100">×</button>}
                </div>
                {showPickupList && pickupSuggestions.length > 0 && <SuggestionList items={pickupSuggestions} type="pickup" onSelect={(value) => selectSuggestion("pickup", value)} />}
              </div>

              <div className={`${field} z-20 min-w-0`}>
                <label htmlFor="kr-local-package" className="block px-5 pt-3 text-[9px] font-black uppercase tracking-[0.14em] text-orange-600">Local Package</label>
                <div className="flex min-w-0 items-center gap-3 px-4 pb-3 pt-1">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-lg text-orange-600">◷</span>
                  <select id="kr-local-package" value={localPackage} onChange={(e) => { setLocalPackage(e.target.value as LocalPackageType); setErrorMessage(""); }} className="min-w-0 flex-1 appearance-none bg-transparent text-[13px] font-black text-slate-950 outline-none">
                    {LOCAL_PACKAGE_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                  <span className="pointer-events-none text-slate-400">⌄</span>
                </div>
              </div>

              <JourneyDateTimeCard id="kr-local-journey" label="Pickup" minDate={minDate} minTime={pickupDate === minDate ? minTime : undefined} date={pickupDate} time={pickupTime}
                onDateChange={(value) => { setPickupDate(value); setErrorMessage(""); }} onTimeChange={(value) => { setPickupTime(value); setErrorMessage(""); }} />
            </div>
          )}

          {isRoundTrip && (
            <div className="mt-4 rounded-[20px] border border-orange-100 bg-orange-50/60 px-4 py-3 lg:hidden">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">⇄</span>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-orange-700">Round trip</p>
                  <p className="text-[9px] font-semibold text-slate-500">Pickup and return times are selected under their dates.</p>
                </div>
              </div>
            </div>
          )}

          {isLocal && (
            <div className="mt-4 flex flex-col gap-3 rounded-[20px] border border-emerald-100 bg-emerald-50/70 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">✓</span><div><p className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-800">Package selected</p><p className="mt-0.5 text-[10px] font-semibold text-emerald-700">{LOCAL_PACKAGE_OPTIONS.find((x) => x.id === localPackage)?.label} · Fuel included</p></div></div>
              <p className="text-[9px] font-bold text-emerald-700 sm:text-right">Driver allowance included · Toll & parking at actuals</p>
            </div>
          )}

          {errorMessage && (
            <div role="alert" className="mt-3 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[10px] font-bold leading-4 text-rose-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 font-black">!</span><span>{errorMessage}</span>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2.5 px-1">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.8-3 8.2-7 10-4-1.8-7-5.2-7-10V6l7-3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" /></svg>
              </span>
              <div className="min-w-0"><p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-700">Upfront fare. No guesswork.</p><p className="text-[8px] font-semibold text-slate-400">Compare available cars before you book.</p></div>
            </div>
            <SearchButton loading={loading} isLocal={isLocal} />
          </div>
        </form>

        <div className="grid grid-cols-3 divide-x border-t border-slate-100 bg-slate-50/80 py-3.5">
          <div className="px-2 text-center"><div className="text-[10px] font-black text-slate-800">Transparent</div><div className="text-[8px] font-bold text-slate-400">See fare before booking</div></div>
          <div className="px-2 text-center"><div className="text-[10px] font-black text-slate-800">24×7</div><div className="text-[8px] font-bold text-slate-400">Booking support</div></div>
          <div className="px-2 text-center"><div className="text-[10px] font-black text-slate-800">6h+</div><div className="text-[8px] font-bold text-slate-400">Free cancellation</div></div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   AUTOCOMPLETE SUGGESTIONS
================================================================ */

function SuggestionList({
  items,
  type,
  onSelect,
}: {
  items: string[];
  type: "pickup" | "drop";
  onSelect: (value: string) => void;
}) {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[9999] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.2)]">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">
        {type === "pickup"
          ? "Suggested pickup locations"
          : "Suggested destinations"}
      </div>

      <ul className="max-h-64 overflow-y-auto overscroll-contain">
        {items.map((item, index) => (
          <li key={`${type}-${item}-${index}`}>
            <button
              type="button"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3 text-left text-[11px] font-bold text-slate-700 transition hover:bg-orange-50 active:bg-orange-100"
            >
              <span
                className={
                  type === "pickup"
                    ? "text-emerald-600"
                    : "text-rose-600"
                }
              >
                ●
              </span>

              <span className="min-w-0 flex-1">{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================================================================
   COMBINED DATE + TIME CARD
   Date first, time directly below — compact OTA-style journey selector.
================================================================ */

function JourneyDateTimeCard({
  id,
  label,
  minDate,
  minTime,
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  id: string;
  label: "Pickup" | "Return";
  minDate: string;
  minTime?: string;
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}) {
  const field =
    "group relative min-w-0 min-h-[96px] rounded-[20px] border border-slate-200 bg-white transition-all duration-200 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10 focus-within:shadow-[0_10px_30px_rgba(249,115,22,0.08)]";

  return (
    <div className={field}>
      <div className="flex items-center justify-between gap-2 px-4 pt-3">
        <span className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
          {label} Date & Time
        </span>
        <span className="rounded-full bg-orange-50 px-2 py-1 text-[7px] font-black uppercase tracking-[0.12em] text-orange-600">
          Required
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(86px,0.85fr)] divide-x divide-slate-100 px-1 pb-1 pt-1">
        <label htmlFor={`${id}-date`} className="min-w-0 px-2.5 py-1.5">
          <span className="mb-1 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-slate-400">
            <span className="text-orange-500"><CalendarIcon /></span>
            Date
          </span>
          <input
            id={`${id}-date`}
            type="date"
            required
            min={minDate}
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="min-w-0 w-full bg-transparent text-[12px] font-black text-slate-950 outline-none [color-scheme:light]"
          />
        </label>

        <label htmlFor={`${id}-time`} className="min-w-0 px-3 py-1.5">
          <span className="mb-1 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-slate-400">
            <span className="text-orange-500"><ClockIcon /></span>
            Time
          </span>
          <input
            id={`${id}-time`}
            type="time"
            required
            min={minTime}
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="min-w-0 w-full bg-transparent text-[12px] font-black text-slate-950 outline-none [color-scheme:light]"
          />
        </label>
      </div>
    </div>
  );
}

/* ================================================================
   REUSABLE SEARCH BUTTON
================================================================ */

function SearchButton({
  loading,
  isLocal,
}: {
  loading: boolean;
  isLocal: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group min-h-[62px] w-full rounded-[20px] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-6 text-white shadow-[0_14px_30px_rgba(249,115,22,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(249,115,22,0.30)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-[64px] sm:max-w-[360px]"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest sm:text-[11px]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Checking fares
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest sm:text-[11px]">
          <SearchIcon />
          <span>
            {isLocal ? "See Package Fare" : "Check Fare & Available Cars"}
          </span>
          <span className="text-base transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      )}
    </button>
  );
}

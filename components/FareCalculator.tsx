"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  calculateFare,
  VEHICLES,
  type VehicleType,
  type BookingType,
  type ServiceType,
} from "../lib/fareCalculator";

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
  }) => void;
}

type MainTab = "outstation" | "airport" | "local";
type LocationKind = "pickup" | "drop";

const DEBOUNCE_MS = 350;

export default function FareCalculator({
  onFareCalculated,
}: FareCalculatorProps) {
  const [mainTab, setMainTab] = useState<MainTab>("outstation");
  const [serviceType, setServiceType] = useState<ServiceType>("outstation");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setMinDate(date);
      setMinTime(time);
    };

    updateDateTime();
    const timer = window.setInterval(updateDateTime, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const value = pickup.trim();
    const requestId = ++pickupRequestRef.current;

    pickupAbortRef.current?.abort();

    if (value.length < 3) {
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
          { signal: controller.signal, cache: "no-store" }
        );

        if (!response.ok) {
          if (requestId === pickupRequestRef.current) {
            setPickupSuggestions([]);
            setShowPickupList(false);
          }
          return;
        }

        const data = await response.json();
        if (requestId !== pickupRequestRef.current) return;

        const results = Array.isArray(data?.predictions)
          ? data.predictions
              .map((item: any) => String(item?.description || "").trim())
              .filter(Boolean)
              .slice(0, 5)
          : [];

        setPickupSuggestions(results);
        setShowPickupList(results.length > 0);
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("Pickup autocomplete error:", error);
          if (requestId === pickupRequestRef.current) {
            setPickupSuggestions([]);
            setShowPickupList(false);
          }
        }
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [pickup]);

  useEffect(() => {
    const value = drop.trim();
    const requestId = ++dropRequestRef.current;

    dropAbortRef.current?.abort();

    if (value.length < 3) {
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
          { signal: controller.signal, cache: "no-store" }
        );

        if (!response.ok) {
          if (requestId === dropRequestRef.current) {
            setDropSuggestions([]);
            setShowDropList(false);
          }
          return;
        }

        const data = await response.json();
        if (requestId !== dropRequestRef.current) return;

        const results = Array.isArray(data?.predictions)
          ? data.predictions
              .map((item: any) => String(item?.description || "").trim())
              .filter(Boolean)
              .slice(0, 5)
          : [];

        setDropSuggestions(results);
        setShowDropList(results.length > 0);
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("Drop autocomplete error:", error);
          if (requestId === dropRequestRef.current) {
            setDropSuggestions([]);
            setShowDropList(false);
          }
        }
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [drop]);

  useEffect(() => {
    return () => {
      pickupAbortRef.current?.abort();
      dropAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (pickupRef.current && !pickupRef.current.contains(target)) {
        setShowPickupList(false);
      }

      if (dropRef.current && !dropRef.current.contains(target)) {
        setShowDropList(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const handleMainTabChange = (tab: MainTab) => {
    setMainTab(tab);
    setShowPickupList(false);
    setShowDropList(false);

    if (tab === "local") {
      setServiceType("local");
      setBookingType("oneway");
      setDrop("");
      setDropSuggestions([]);
      setReturnDate("");
      setReturnTime("");
      return;
    }

    setServiceType("outstation");

    if (tab === "airport") {
      setBookingType("oneway");
      setReturnDate("");
      setReturnTime("");
    }
  };

  const handleDesktopModeChange = (
    mode: "oneway" | "roundtrip" | "local" | "airport"
  ) => {
    if (mode === "local") {
      handleMainTabChange("local");
      return;
    }

    if (mode === "airport") {
      handleMainTabChange("airport");
      return;
    }

    handleMainTabChange("outstation");
    setBookingType(mode);

    if (mode === "oneway") {
      setReturnDate("");
      setReturnTime("");
    }
  };

  const handleBookingTypeChange = (type: BookingType) => {
    setBookingType(type);

    if (type === "oneway") {
      setReturnDate("");
      setReturnTime("");
    }
  };

  const showError = (message: string) => {
    window.alert(`⚠️ ${message}`);
  };

  const handleCalculate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanPickup = pickup.trim();
    const cleanDrop = drop.trim();

    if (
      !cleanPickup ||
      (serviceType !== "local" && !cleanDrop) ||
      !pickupDate ||
      !pickupTime
    ) {
      showError("Please fill all required booking details.");
      return;
    }

    if (
      serviceType === "outstation" &&
      bookingType === "roundtrip" &&
      (!returnDate || !returnTime)
    ) {
      showError("Return date and time are required for a round trip.");
      return;
    }

    setLoading(true);
    setShowPickupList(false);
    setShowDropList(false);

    try {
      let mappedDistance = serviceType === "local" ? 80 : 45;

      if (serviceType !== "local") {
        try {
          const response = await fetch("/api/distance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              origin: cleanPickup,
              destination: cleanDrop,
            }),
          });

          const routeData = await response.json();

          if (response.ok && Number(routeData?.distanceKm) > 0) {
            mappedDistance = Number(routeData.distanceKm);
          }
        } catch (error) {
          console.error("Distance API error:", error);
        }
      }

      let computedServiceType: ServiceType = serviceType;
      const createdAt = Date.now();

      const options = (Object.keys(VEHICLES) as VehicleType[]).map((type) => {
        const result = calculateFare({
          distance: mappedDistance,
          vehicleType: type,
          bookingType,
          serviceType,
          pickupDate,
          pickupTime,
          returnDate: bookingType === "roundtrip" ? returnDate : undefined,
          returnTime: bookingType === "roundtrip" ? returnTime : undefined,
          drop: cleanDrop,
          pickup: cleanPickup,
        });

        computedServiceType = result.autoCorrectedService;

        return {
          id: `${bookingType}-${type}-${createdAt}`,
          vehicleType: type,
          vehicleLabel: VEHICLES[type].label,
          vehicleImage: VEHICLES[type].image,
          finalFare: result.finalFare,
          strikeFare: result.strikeFare,
          fareText: `₹${result.finalFare.toLocaleString("en-IN")}`,
          billedDistance: result.billedDistance,
          durationMinutes: result.durationMinutes,
        };
      });

      onFareCalculated({
        fareOptions: options,
        pickup: cleanPickup,
        drop: computedServiceType === "local" ? "Local Full Day Run" : cleanDrop,
        bookingType,
        serviceType: computedServiceType,
        pickupDate,
        pickupTime,
        returnDate: bookingType === "roundtrip" ? returnDate : undefined,
        returnTime: bookingType === "roundtrip" ? returnTime : undefined,
      });
    } catch (error) {
      console.error("Fare calculation error:", error);
      showError("Unable to calculate fare right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearPickup = () => {
    setPickup("");
    setPickupSuggestions([]);
    setShowPickupList(false);
    window.requestAnimationFrame(() => pickupInputRef.current?.focus());
  };

  const clearDrop = () => {
    setDrop("");
    setDropSuggestions([]);
    setShowDropList(false);
    window.requestAnimationFrame(() => dropInputRef.current?.focus());
  };

  const swapLocations = () => {
    if (!pickup && !drop) return;

    setPickup(drop);
    setDrop(pickup);
    setPickupSuggestions([]);
    setDropSuggestions([]);
    setShowPickupList(false);
    setShowDropList(false);
  };

  const selectSuggestion = (kind: LocationKind, value: string) => {
    if (kind === "pickup") {
      setPickup(value);
      setPickupSuggestions([]);
      setShowPickupList(false);
      window.requestAnimationFrame(() => dropInputRef.current?.focus());
      return;
    }

    setDrop(value);
    setDropSuggestions([]);
    setShowDropList(false);
  };

  const fieldClass =
    "relative min-w-0 overflow-visible rounded-2xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition duration-200 focus-within:z-[100] focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10 lg:rounded-none lg:border-0 lg:border-r lg:border-slate-200 lg:shadow-none";

  const tabClass = (active: boolean) =>
    `relative min-h-[60px] rounded-[18px] px-2 py-2 transition-all duration-200 ${
      active
        ? "bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 text-white shadow-[0_9px_22px_rgba(249,115,22,0.28)]"
        : "text-slate-500 hover:bg-white hover:text-slate-900"
    }`;

  const displayTitle =
    mainTab === "local"
      ? "Local Package Fare"
      : mainTab === "airport"
      ? "Airport Transfer Fare"
      : bookingType === "roundtrip"
      ? "Outstation Round Trip"
      : "Outstation One Way";

  return (
    <section className="relative z-10 w-full min-w-0">
      <div className="mx-auto w-full max-w-[1280px] min-w-0 px-2 sm:px-3 lg:px-4">
        <div className="mb-3 hidden items-center justify-between gap-4 lg:flex">
          <div className="inline-flex items-center rounded-full bg-white p-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
            <button
              type="button"
              onClick={() => handleDesktopModeChange("oneway")}
              className={`rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                mainTab === "outstation" && bookingType === "oneway"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Outstation One Way
            </button>
            <button
              type="button"
              onClick={() => handleDesktopModeChange("roundtrip")}
              className={`rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                mainTab === "outstation" && bookingType === "roundtrip"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Outstation Round Trip
            </button>
            <button
              type="button"
              onClick={() => handleDesktopModeChange("local")}
              className={`rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                mainTab === "local"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Local Package
            </button>
            <button
              type="button"
              onClick={() => handleDesktopModeChange("airport")}
              className={`rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                mainTab === "airport"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Airport Transfer
            </button>
          </div>

          <div className="text-[20px] font-black tracking-tight text-slate-900">
            Book Online Cab
          </div>
        </div>

        <div className="mb-3 rounded-[24px] border border-slate-200 bg-slate-100 p-1.5 shadow-[0_8px_28px_rgba(15,23,42,0.07)] lg:hidden">
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleMainTabChange("outstation")}
              className={tabClass(mainTab === "outstation")}
            >
              <span className="flex flex-col items-center gap-1">
                <span className="text-[21px] leading-none">🚗</span>
                <span className="text-[10px] font-black tracking-wide sm:text-xs">
                  Outstation
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleMainTabChange("airport")}
              className={tabClass(mainTab === "airport")}
            >
              <span className="flex flex-col items-center gap-1">
                <span className="text-[21px] leading-none">✈️</span>
                <span className="text-[10px] font-black tracking-wide sm:text-xs">
                  Airport
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleMainTabChange("local")}
              className={tabClass(mainTab === "local")}
            >
              <span className="flex flex-col items-center gap-1">
                <span className="text-[21px] leading-none">🏙️</span>
                <span className="text-[10px] font-black tracking-wide sm:text-xs">
                  Local
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="relative z-10 w-full overflow-visible rounded-[24px] border border-slate-200 bg-white shadow-[0_24px_75px_rgba(15,23,42,0.12)] sm:rounded-[30px]">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-orange-500 to-amber-400 text-xl shadow-[0_8px_22px_rgba(249,115,22,0.24)]">
                  🚕
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-[19px] font-black tracking-tight text-slate-950 sm:text-2xl">
                    {displayTitle}
                  </h2>
                  <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-500 sm:text-xs">
                    Instant fare • Transparent pricing • Easy booking
                  </p>
                </div>
              </div>
              <div className="hidden rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 sm:block">
                <p className="text-[8px] font-black uppercase tracking-wider text-emerald-700">
                  Transparent fare
                </p>
                <p className="text-[9px] font-bold text-slate-700">No hidden charges</p>
              </div>
            </div>
          </div>

          {serviceType === "outstation" && (
            <div className="px-5 pt-4 sm:px-7 sm:pt-5 lg:hidden">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                Journey Type
              </p>
              <div className="grid grid-cols-2 gap-2 rounded-[20px] bg-slate-100 p-1.5">
                <button
                  type="button"
                  onClick={() => handleBookingTypeChange("oneway")}
                  className={`min-h-[46px] rounded-[15px] text-[11px] font-black transition-all ${
                    bookingType === "oneway"
                      ? "bg-white text-orange-600 shadow-sm ring-1 ring-orange-200"
                      : "text-slate-500"
                  }`}
                >
                  → ONE WAY
                </button>
                <button
                  type="button"
                  disabled={mainTab === "airport"}
                  onClick={() => handleBookingTypeChange("roundtrip")}
                  className={`min-h-[46px] rounded-[15px] text-[11px] font-black transition-all ${
                    bookingType === "roundtrip"
                      ? "bg-white text-orange-600 shadow-sm ring-1 ring-orange-200"
                      : mainTab === "airport"
                      ? "cursor-not-allowed text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  ⇄ ROUND TRIP
                </button>
              </div>
            </div>
          )}

          {serviceType === "local" && (
            <div className="px-5 pt-4 sm:px-7 sm:pt-5 lg:hidden">
              <div className="grid grid-cols-3 gap-2 rounded-[20px] border border-orange-100 bg-orange-50 p-2.5">
                <div className="rounded-[15px] bg-white px-2 py-2.5 text-center shadow-sm">
                  <span className="block text-base">⏱️</span>
                  <span className="mt-0.5 block text-[8px] font-black uppercase text-slate-400">
                    Duration
                  </span>
                  <span className="block text-[10px] font-black text-slate-900">8 Hours</span>
                </div>
                <div className="rounded-[15px] bg-white px-2 py-2.5 text-center shadow-sm">
                  <span className="block text-base">🛣️</span>
                  <span className="mt-0.5 block text-[8px] font-black uppercase text-slate-400">
                    Included
                  </span>
                  <span className="block text-[10px] font-black text-slate-900">80 KM</span>
                </div>
                <div className="rounded-[15px] bg-white px-2 py-2.5 text-center shadow-sm">
                  <span className="block text-base">🚕</span>
                  <span className="mt-0.5 block text-[8px] font-black uppercase text-slate-400">
                    Service
                  </span>
                  <span className="block text-[10px] font-black text-slate-900">Local</span>
                </div>
              </div>
            </div>
          )}

          <form
            onSubmit={handleCalculate}
            className="relative z-20 px-5 pb-5 pt-4 sm:px-7 sm:pb-7 sm:pt-5 lg:rounded-[24px] lg:bg-gradient-to-r lg:from-sky-500 lg:via-blue-500 lg:to-cyan-400 lg:p-2.5 lg:shadow-[0_18px_45px_rgba(37,99,235,0.18)]"
          >
            <div
              className={`grid min-w-0 grid-cols-1 gap-2.5 md:grid-cols-2 lg:items-stretch lg:gap-0 lg:rounded-[18px] lg:bg-white ${
                serviceType === "local"
                  ? "lg:grid-cols-[minmax(300px,2fr)_minmax(180px,1fr)_minmax(180px,1fr)_190px]"
                  : "lg:grid-cols-[minmax(220px,1.7fr)_48px_minmax(220px,1.7fr)_minmax(150px,1fr)_minmax(150px,1fr)_190px]"
              }`}
            >
              <div ref={pickupRef} className={`${fieldClass} z-[80]`}>
                <label
                  htmlFor="kr-pickup"
                  className="block px-4 pt-3 text-[8px] font-black uppercase tracking-[0.16em] text-slate-400 lg:pt-2.5 lg:text-[9px]"
                >
                  {serviceType === "local"
                    ? "Pickup Location"
                    : mainTab === "airport"
                    ? "Pickup / Airport"
                    : "From • Pickup Location"}
                </label>
                <div className="flex min-w-0 items-center gap-3 px-4 pb-3 pt-1 lg:pb-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-base">
                    📍
                  </span>
                  <input
                    id="kr-pickup"
                    ref={pickupInputRef}
                    required
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="words"
                    spellCheck={false}
                    value={pickup}
                    placeholder={
                      serviceType === "local"
                        ? "Enter your pickup location"
                        : mainTab === "airport"
                        ? "Enter airport or pickup point"
                        : "Enter pickup location"
                    }
                    onFocus={() => {
                      if (pickupSuggestions.length > 0) setShowPickupList(true);
                    }}
                    onChange={(event) => setPickup(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-[13px] font-bold text-slate-950 outline-none placeholder:text-slate-400 sm:text-sm"
                  />
                  {pickup && (
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Clear pickup location"
                      onClick={clearPickup}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 transition hover:bg-slate-200"
                    >
                      ×
                    </button>
                  )}
                </div>

                {showPickupList && pickupSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[9999] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.24)]">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
                        Suggested locations
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">
                        Google Maps
                      </span>
                    </div>
                    <ul className="max-h-64 overflow-y-auto overscroll-contain">
                      {pickupSuggestions.map((item, index) => (
                        <li key={`pickup-${item}-${index}`}>
                          <button
                            type="button"
                            onClick={() => selectSuggestion("pickup", item)}
                            className="flex min-h-[62px] w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-orange-50 active:bg-orange-100"
                          >
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm">
                              📍
                            </span>
                            <span className="min-w-0 text-[12px] font-semibold leading-5 text-slate-700">
                              {item}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {serviceType !== "local" && (
                <div className="relative z-[70] flex min-h-[54px] items-center justify-center bg-white lg:min-h-0 lg:border-r lg:border-slate-200">
                  <button
                    type="button"
                    aria-label="Swap pickup and drop locations"
                    onClick={swapLocations}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-lg font-black text-orange-500 shadow-[0_5px_15px_rgba(15,23,42,0.14)] ring-1 ring-slate-200 transition hover:scale-110 hover:bg-orange-50"
                  >
                    ⇅
                  </button>
                </div>
              )}

              {serviceType !== "local" && (
                <div ref={dropRef} className={`${fieldClass} z-[60]`}>
                  <label
                    htmlFor="kr-drop"
                    className="block px-4 pt-3 text-[8px] font-black uppercase tracking-[0.16em] text-slate-400 lg:pt-2.5 lg:text-[9px]"
                  >
                    {mainTab === "airport" ? "Drop / Destination" : "To • Drop Location"}
                  </label>
                  <div className="flex min-w-0 items-center gap-3 px-4 pb-3 pt-1 lg:pb-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-base">
                      📍
                    </span>
                    <input
                      id="kr-drop"
                      ref={dropInputRef}
                      required
                      type="text"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="words"
                      spellCheck={false}
                      value={drop}
                      placeholder={
                        mainTab === "airport"
                          ? "Enter destination"
                          : "Enter drop location"
                      }
                      onFocus={() => {
                        if (dropSuggestions.length > 0) setShowDropList(true);
                      }}
                      onChange={(event) => setDrop(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-[13px] font-bold text-slate-950 outline-none placeholder:text-slate-400 sm:text-sm"
                    />
                    {drop && (
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label="Clear drop location"
                        onClick={clearDrop}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 transition hover:bg-slate-200"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {showDropList && dropSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[9999] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.24)]">
                      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
                          Suggested destinations
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          Google Maps
                        </span>
                      </div>
                      <ul className="max-h-64 overflow-y-auto overscroll-contain">
                        {dropSuggestions.map((item, index) => (
                          <li key={`drop-${item}-${index}`}>
                            <button
                              type="button"
                              onClick={() => selectSuggestion("drop", item)}
                              className="flex min-h-[62px] w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-orange-50 active:bg-orange-100"
                            >
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm">
                                📍
                              </span>
                              <span className="min-w-0 text-[12px] font-semibold leading-5 text-slate-700">
                                {item}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className={fieldClass}>
                <label
                  htmlFor="kr-pickup-date"
                  className="block px-4 pt-3 text-[8px] font-black uppercase tracking-[0.16em] text-slate-400 lg:pt-2.5 lg:text-[9px]"
                >
                  Pickup Date
                </label>
                <div className="flex items-center gap-2 px-4 pb-3 pt-1 lg:pb-2.5">
                  <span className="text-base">📅</span>
                  <input
                    id="kr-pickup-date"
                    required
                    type="date"
                    min={minDate}
                    value={pickupDate}
                    onChange={(event) => setPickupDate(event.target.value)}
                    className="min-w-0 w-full bg-transparent text-[11px] font-bold text-slate-900 outline-none sm:text-sm [color-scheme:light]"
                  />
                </div>
              </div>

              <div className={fieldClass}>
                <label
                  htmlFor="kr-pickup-time"
                  className="block px-4 pt-3 text-[8px] font-black uppercase tracking-[0.16em] text-slate-400 lg:pt-2.5 lg:text-[9px]"
                >
                  Pickup Time
                </label>
                <div className="flex items-center gap-2 px-4 pb-3 pt-1 lg:pb-2.5">
                  <span className="text-base">⏰</span>
                  <input
                    id="kr-pickup-time"
                    required
                    type="time"
                    min={pickupDate === minDate ? minTime : undefined}
                    value={pickupTime}
                    onChange={(event) => setPickupTime(event.target.value)}
                    className="min-w-0 w-full bg-transparent text-[11px] font-bold text-slate-900 outline-none sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-[68px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 px-5 text-center text-sm font-black text-white shadow-[0_10px_28px_rgba(249,115,22,0.30)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(249,115,22,0.38)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 lg:rounded-none lg:rounded-r-[18px] lg:shadow-none"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Checking fares...
                  </>
                ) : (
                  <>
                    <span className="text-base">🚕</span>
                    <span>Check Best Fare</span>
                    <span className="text-base transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </>
                )}
              </button>
            </div>

            {serviceType === "outstation" && bookingType === "roundtrip" && (
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-2">
                <div className={fieldClass}>
                  <label
                    htmlFor="kr-return-date"
                    className="block px-4 pt-3 text-[8px] font-black uppercase tracking-[0.16em] text-slate-400"
                  >
                    Return Date
                  </label>
                  <div className="flex items-center gap-2 px-4 pb-3 pt-1">
                    <span className="text-base">📅</span>
                    <input
                      id="kr-return-date"
                      required
                      type="date"
                      min={pickupDate || minDate}
                      value={returnDate}
                      onChange={(event) => setReturnDate(event.target.value)}
                      className="min-w-0 w-full bg-transparent text-sm font-bold text-slate-900 outline-none [color-scheme:light]"
                    />
                  </div>
                </div>
                <div className={fieldClass}>
                  <label
                    htmlFor="kr-return-time"
                    className="block px-4 pt-3 text-[8px] font-black uppercase tracking-[0.16em] text-slate-400"
                  >
                    Return Time
                  </label>
                  <div className="flex items-center gap-2 px-4 pb-3 pt-1">
                    <span className="text-base">⏰</span>
                    <input
                      id="kr-return-time"
                      required
                      type="time"
                      value={returnTime}
                      onChange={(event) => setReturnTime(event.target.value)}
                      className="min-w-0 w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="border-t border-slate-100 bg-slate-50/75 px-5 py-3.5 sm:px-7 lg:hidden">
            <div className="grid grid-cols-3 divide-x divide-slate-200">
              <div className="px-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-500">
                🛡️ Transparent Fare
              </div>
              <div className="px-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-500">
                🚕 Verified Cabs
              </div>
              <div className="px-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-500">
                ☎️ 24×7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

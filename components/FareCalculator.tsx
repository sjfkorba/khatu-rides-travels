// components/FareCalculator.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
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

export default function FareCalculator({
  onFareCalculated,
}: FareCalculatorProps) {
  /* =========================================================
     SERVICE / BOOKING STATE
  ========================================================= */

  const [serviceType, setMainServiceType] =
    useState<"outstation" | "local">("outstation");

  const [bookingType, setBookingType] =
    useState<BookingType>("oneway");

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  /* =========================================================
     UI STATE
  ========================================================= */

  const [loading, setLoading] = useState(false);

  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");

  const [pickupSuggestions, setPickupSuggestions] =
    useState<string[]>([]);

  const [dropSuggestions, setDropSuggestions] =
    useState<string[]>([]);

  const [showPickupList, setShowPickupList] =
    useState(false);

  const [showDropList, setShowDropList] =
    useState(false);

  const [pickupFocused, setPickupFocused] =
    useState(false);

  const [dropFocused, setDropFocused] =
    useState(false);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     CURRENT DATE / TIME
  ========================================================= */

  useEffect(() => {
    const updateDateTime = () => {
      const today = new Date();

      const dateValue = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(
        today.getDate()
      ).padStart(2, "0")}`;

      const timeValue = `${String(
        today.getHours()
      ).padStart(2, "0")}:${String(
        today.getMinutes()
      ).padStart(2, "0")}`;

      setMinDate(dateValue);
      setMinTime(timeValue);
    };

    updateDateTime();
  }, []);

  /* =========================================================
     GOOGLE PLACES AUTOCOMPLETE
     BACKEND LOGIC UNCHANGED
  ========================================================= */

  const fetchLiveSuggestions = async (
    input: string,
    type: "pickup" | "drop"
  ) => {
    if (input.trim().length < 3) {
      if (type === "pickup") {
        setPickupSuggestions([]);
        setShowPickupList(false);
      } else {
        setDropSuggestions([]);
        setShowDropList(false);
      }

      return;
    }

    try {
      const response = await fetch(
        `/api/places-autocomplete?input=${encodeURIComponent(
          input
        )}`
      );

      const data = await response.json();

      if (data && data.predictions) {
        const results = data.predictions.map(
          (p: any) => p.description
        );

        if (type === "pickup") {
          setPickupSuggestions(results);
          setShowPickupList(results.length > 0);
        } else {
          setDropSuggestions(results);
          setShowDropList(results.length > 0);
        }
      }
    } catch (err) {
      console.error(
        "Autocomplete error:",
        err
      );
    }
  };

  /* =========================================================
     CLICK OUTSIDE
  ========================================================= */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        pickupRef.current &&
        !pickupRef.current.contains(target)
      ) {
        setShowPickupList(false);
      }

      if (
        dropRef.current &&
        !dropRef.current.contains(target)
      ) {
        setShowDropList(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     SWAP LOCATIONS
  ========================================================= */

  const swapLocations = () => {
    const oldPickup = pickup;

    setPickup(drop);
    setDrop(oldPickup);

    setShowPickupList(false);
    setShowDropList(false);
  };

  /* =========================================================
     CLEAR PICKUP
  ========================================================= */

  const clearPickup = () => {
    setPickup("");
    setPickupSuggestions([]);
    setShowPickupList(false);
  };

  /* =========================================================
     CLEAR DROP
  ========================================================= */

  const clearDrop = () => {
    setDrop("");
    setDropSuggestions([]);
    setShowDropList(false);
  };

  /* =========================================================
     BOOKING TYPE CHANGE
  ========================================================= */

  const handleBookingTypeChange = (
    type: BookingType
  ) => {
    setBookingType(type);

    if (type === "oneway") {
      setReturnDate("");
      setReturnTime("");
    }
  };

  /* =========================================================
     MAIN SERVICE CHANGE
  ========================================================= */

  const handleServiceChange = (
    type: "outstation" | "local"
  ) => {
    setMainServiceType(type);

    if (type === "local") {
      setBookingType("oneway");

      setDrop("");
      setReturnDate("");
      setReturnTime("");

      setDropSuggestions([]);
      setShowDropList(false);
    } else {
      setBookingType("oneway");
    }
  };

  /* =========================================================
     ERROR HANDLER
  ========================================================= */

  const showError = (message: string) => {
    alert(`⚠️ ${message}`);
  };

  /* =========================================================
     CALCULATE FARE
     EXISTING FARE LOGIC PRESERVED
  ========================================================= */

  const handleCalculate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    /* -------------------------------------------------------
       BASIC VALIDATION
    ------------------------------------------------------- */

    if (
      !pickup.trim() ||
      (serviceType !== "local" &&
        !drop.trim()) ||
      !pickupDate ||
      !pickupTime
    ) {
      showError(
        "All fields are mandatory!"
      );

      return;
    }

    /* -------------------------------------------------------
       ROUND TRIP VALIDATION
    ------------------------------------------------------- */

    if (
      bookingType === "roundtrip" &&
      (!returnDate || !returnTime)
    ) {
      showError(
        "Return details are required for Round Trips!"
      );

      return;
    }

    /* -------------------------------------------------------
       START LOADING
    ------------------------------------------------------- */

    setLoading(true);

    try {
      /* -----------------------------------------------------
         LOCAL DEFAULT DISTANCE
      ----------------------------------------------------- */

      let mappedDistance =
        serviceType === "local"
          ? 80
          : 45;

      /* -----------------------------------------------------
         GOOGLE ROUTE DISTANCE
         BACKEND ENDPOINT UNCHANGED
      ----------------------------------------------------- */

      if (serviceType !== "local") {
        try {
          const response = await fetch(
            "/api/distance",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                origin: pickup,
                destination: drop,
              }),
            }
          );

          const routeData =
            await response.json();

          if (
            response.ok &&
            routeData.distanceKm
          ) {
            mappedDistance =
              routeData.distanceKm;
          }
        } catch (err) {
          console.error(
            "Distance API error:",
            err
          );
        }
      }

      /* -----------------------------------------------------
         FARE CALCULATION
      ----------------------------------------------------- */

      let computedServiceType: ServiceType =
        serviceType;

      const options = (
        Object.keys(VEHICLES) as VehicleType[]
      ).map((type) => {
        const res = calculateFare({
          distance: mappedDistance,

          vehicleType: type,

          bookingType,

          serviceType,

          pickupDate,

          pickupTime,

          returnDate:
            bookingType === "roundtrip"
              ? returnDate
              : undefined,

          returnTime:
            bookingType === "roundtrip"
              ? returnTime
              : undefined,

          drop,

          pickup,
        });

        computedServiceType =
          res.autoCorrectedService;

        return {
          id: `${bookingType}-${type}-${Date.now()}`,

          vehicleType: type,

          vehicleLabel:
            VEHICLES[type].label,

          vehicleImage:
            VEHICLES[type].image,

          finalFare: res.finalFare,

          strikeFare: res.strikeFare,

          fareText: `₹${res.finalFare.toLocaleString(
            "en-IN"
          )}`,

          billedDistance:
            res.billedDistance,

          durationMinutes:
            res.durationMinutes,
        };
      });

      /* -----------------------------------------------------
         SEND RESULT TO PARENT
      ----------------------------------------------------- */

      onFareCalculated({
        fareOptions: options,

        pickup,

        drop:
          computedServiceType ===
          "local"
            ? "Local Full Day Run"
            : drop,

        bookingType,

        serviceType:
          computedServiceType,

        pickupDate,

        pickupTime,

        returnDate:
          bookingType === "roundtrip"
            ? returnDate
            : undefined,

        returnTime:
          bookingType === "roundtrip"
            ? returnTime
            : undefined,
      });
    } catch (error) {
      console.error(
        "Fare calculation error:",
        error
      );

      showError(
        "Unable to calculate fare right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SHARED FIELD CLASS
  ========================================================= */

  const fieldClass = (
    active = false
  ) =>
    [
      "rounded-[20px]",
      "border",
      "bg-white",
      "transition-all",
      "duration-200",
      active
        ? "border-orange-400 ring-4 ring-orange-500/10 shadow-[0_10px_30px_rgba(249,115,22,0.10)]"
        : "border-slate-200 shadow-[0_4px_18px_rgba(15,23,42,0.045)]",
    ].join(" ");

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="w-full px-0">

      <div className="mx-auto w-full max-w">

        {/* ===================================================
            SERVICE SWITCH
        =================================================== */}

        <div className="mb-3 rounded-[20px] border border-slate-200 bg-white p-1.5 shadow-[0_7px_25px_rgba(15,23,42,0.07)]">

          <div className="grid grid-cols-3 gap-1.5">

            {/* OUTSTATION */}

            <button
              type="button"
              onClick={() =>
                handleServiceChange(
                  "outstation"
                )
              }
              className={`relative min-h-[52px] rounded-[16px] px-2 transition-all duration-200 ${
                serviceType ===
                "outstation"
                  ? "bg-gradient-to-br from-orange-600 to-amber-500 text-white shadow-[0_7px_18px_rgba(249,115,22,0.28)]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >

              <div className="flex items-center justify-center gap-2">

                <span className="text-lg leading-none">
                  🚗
                </span>

                <span className="text-[10px] font-black tracking-wide sm:text-xs">
                  Outstation
                </span>

              </div>

              {serviceType ===
                "outstation" && (
                <span className="absolute bottom-[-4px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-amber-500" />
              )}

            </button>

            {/* ROUND TRIP */}

            <button
              type="button"
              onClick={() => {
                setMainServiceType(
                  "outstation"
                );

                setBookingType(
                  "roundtrip"
                );
              }}
              className={`relative min-h-[52px] rounded-[16px] px-2 transition-all duration-200 ${
                serviceType ===
                  "outstation" &&
                bookingType ===
                  "roundtrip"
                  ? "bg-gradient-to-br from-orange-600 to-amber-500 text-white shadow-[0_7px_18px_rgba(249,115,22,0.28)]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >

              <div className="flex items-center justify-center gap-2">

                <span className="text-lg leading-none">
                  ⇄
                </span>

                <span className="text-[10px] font-black tracking-wide sm:text-xs">
                  Round Trip
                </span>

              </div>

              {serviceType ===
                  "outstation" &&
                bookingType ===
                  "roundtrip" && (
                  <span className="absolute bottom-[-4px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-amber-500" />
                )}

            </button>

            {/* LOCAL */}

            <button
              type="button"
              onClick={() =>
                handleServiceChange(
                  "local"
                )
              }
              className={`relative min-h-[52px] rounded-[16px] px-2 transition-all duration-200 ${
                serviceType ===
                "local"
                  ? "bg-gradient-to-br from-orange-600 to-amber-500 text-white shadow-[0_7px_18px_rgba(249,115,22,0.28)]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >

              <div className="flex items-center justify-center gap-2">

                <span className="text-lg leading-none">
                  🏙️
                </span>

                <span className="text-[10px] font-black tracking-wide sm:text-xs">
                  Local
                </span>

              </div>

              {serviceType ===
                "local" && (
                <span className="absolute bottom-[-4px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-amber-500" />
              )}

            </button>

          </div>

        </div>

        {/* ===================================================
            MAIN CARD
        =================================================== */}

        <div className="overflow-visible rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)]">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="border-b border-slate-100 px-5 py-4 sm:px-7">

            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-gradient-to-br from-orange-500 to-amber-400 text-lg shadow-[0_7px_18px_rgba(249,115,22,0.23)]">
                  🧮
                </div>

                <div className="min-w-0">

                  <h2 className="truncate text-[18px] font-black tracking-tight text-slate-950 sm:text-xl">

                    {serviceType ===
                    "local"
                      ? "Local Package Fare"
                      : bookingType ===
                        "roundtrip"
                      ? "Round Trip Fare"
                      : "Get Your Fare"}

                  </h2>

                  <p className="mt-0.5 text-[9px] font-semibold text-slate-500 sm:text-[10px]">
                    Instant fare • Simple booking • Transparent pricing
                  </p>

                </div>

              </div>

              {/* TRUST BADGE */}

              <div className="hidden shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:block">

                <span className="text-[8px] font-black uppercase tracking-wide text-emerald-700">
                  ✓ Transparent Fare
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              LOCAL PACKAGE
          ================================================= */}

          {serviceType ===
            "local" && (
            <div className="px-5 pt-3 sm:px-7">

              <div className="rounded-[17px] border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-2">

                <div className="grid grid-cols-3 gap-2">

                  {/* DURATION */}

                  <div className="rounded-[13px] bg-white px-2 py-2 text-center shadow-sm">

                    <span className="block text-sm">
                      ⏱️
                    </span>

                    <span className="block text-[7px] font-bold uppercase tracking-wide text-slate-400">
                      Duration
                    </span>

                    <span className="block text-[10px] font-black text-slate-900">
                      8 Hours
                    </span>

                  </div>

                  {/* KM */}

                  <div className="rounded-[13px] bg-white px-2 py-2 text-center shadow-sm">

                    <span className="block text-sm">
                      🛣️
                    </span>

                    <span className="block text-[7px] font-bold uppercase tracking-wide text-slate-400">
                      Included
                    </span>

                    <span className="block text-[10px] font-black text-slate-900">
                      80 KM
                    </span>

                  </div>

                  {/* SERVICE */}

                  <div className="rounded-[13px] bg-white px-2 py-2 text-center shadow-sm">

                    <span className="block text-sm">
                      🚕
                    </span>

                    <span className="block text-[7px] font-bold uppercase tracking-wide text-slate-400">
                      Service
                    </span>

                    <span className="block text-[10px] font-black text-slate-900">
                      Local
                    </span>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleCalculate}
          >

            <div className="space-y-3 px-5 pb-4 pt-4 sm:px-7 sm:pt-4">

              {/* =================================================
                  JOURNEY TYPE
              ================================================= */}

              {serviceType ===
                "outstation" && (
                <div>

                  <div className="mb-1.5 flex items-center justify-between">

                    <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Journey Type
                    </span>

                    <span className="text-[8px] font-bold text-slate-400">
                      Choose your trip
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-[17px] bg-slate-100 p-1.5">

                    {/* ONE WAY */}

                    <button
                      type="button"
                      onClick={() =>
                        handleBookingTypeChange(
                          "oneway"
                        )
                      }
                      className={`min-h-[42px] rounded-[13px] text-[10px] font-black transition-all sm:text-xs ${
                        bookingType ===
                        "oneway"
                          ? "bg-white text-orange-600 shadow-sm ring-1 ring-orange-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >

                      <span className="mr-1.5">
                        →
                      </span>

                      ONE WAY

                    </button>

                    {/* ROUND TRIP */}

                    <button
                      type="button"
                      onClick={() =>
                        handleBookingTypeChange(
                          "roundtrip"
                        )
                      }
                      className={`min-h-[42px] rounded-[13px] text-[10px] font-black transition-all sm:text-xs ${
                        bookingType ===
                        "roundtrip"
                          ? "bg-white text-orange-600 shadow-sm ring-1 ring-orange-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >

                      <span className="mr-1.5">
                        ⇄
                      </span>

                      ROUND TRIP

                    </button>

                  </div>

                </div>
              )}

              {/* =================================================
                  LOCATIONS

                  DESKTOP:
                  PICKUP | SWAP | DROP

                  MOBILE:
                  PICKUP
                     ⇅
                  DROP
              ================================================= */}

              {serviceType !==
              "local" ? (
                <div className="relative">

                  <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[minmax(0,1fr)_52px_minmax(0,1fr)] lg:items-center lg:gap-0">

                    {/* =========================================
                        PICKUP
                    ========================================= */}

                    <div
                      ref={pickupRef}
                      className={`${fieldClass(
                        pickupFocused
                      )} relative z-30`}
                    >

                      <label className="block px-3.5 pt-2.5 text-[7px] font-black uppercase tracking-[0.16em] text-slate-400 sm:px-4 sm:pt-3 sm:text-[8px]">
                        From • Pickup Location
                      </label>

                      <div className="flex items-center gap-2.5 px-3.5 pb-2.5 pt-1 sm:px-4 sm:pb-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50 text-sm">
                          📍
                        </div>

                        <input
                          required
                          type="text"
                          value={pickup}
                          placeholder="Enter pickup location"
                          onFocus={() =>
                            setPickupFocused(
                              true
                            )
                          }
                          onBlur={() =>
                            setPickupFocused(
                              false
                            )
                          }
                          onChange={(e) => {
                            setPickup(
                              e.target.value
                            );

                            fetchLiveSuggestions(
                              e.target.value,
                              "pickup"
                            );
                          }}
                          className="min-w-0 flex-1 bg-transparent text-[12px] font-bold text-slate-950 outline-none placeholder:text-slate-400 sm:text-sm"
                        />

                        {pickup && (
                          <button
                            type="button"
                            onClick={
                              clearPickup
                            }
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500 transition hover:bg-slate-200"
                            aria-label="Clear pickup"
                          >
                            ×
                          </button>
                        )}

                      </div>

                      {/* PICKUP SUGGESTIONS */}

                      {showPickupList &&
                        pickupSuggestions.length >
                          0 && (
                          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[1000] overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">

                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3.5 py-2">

                              <span className="text-[7px] font-black uppercase tracking-[0.15em] text-slate-400">
                                Suggested Locations
                              </span>

                              <span className="text-[7px] font-bold text-slate-300">
                                Google Maps
                              </span>

                            </div>

                            <ul className="max-h-52 overflow-y-auto">

                              {pickupSuggestions.map(
                                (
                                  item,
                                  idx
                                ) => (
                                  <li
                                    key={`${item}-${idx}`}
                                  >

                                    <button
                                      type="button"
                                      onMouseDown={(
                                        e
                                      ) =>
                                        e.preventDefault()
                                      }
                                      onClick={() => {
                                        setPickup(
                                          item
                                        );

                                        setShowPickupList(
                                          false
                                        );
                                      }}
                                      className="flex w-full items-start gap-2.5 border-b border-slate-50 px-3.5 py-2.5 text-left transition hover:bg-orange-50"
                                    >

                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs">
                                        📍
                                      </span>

                                      <span className="text-[10px] font-semibold leading-4 text-slate-700">
                                        {item}
                                      </span>

                                    </button>

                                  </li>
                                )
                              )}

                            </ul>

                          </div>
                        )}

                    </div>

                    {/* =========================================
                        SWAP BUTTON
                    ========================================= */}

                    <div className="relative z-[200] flex h-7 items-center justify-center lg:h-full">

                      {/* Desktop connector */}

                      <div className="absolute hidden h-px w-full bg-orange-200 lg:block" />

                      <button
                        type="button"
                        onClick={
                          swapLocations
                        }
                        aria-label="Swap pickup and drop locations"
                        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[2px] border-white bg-gradient-to-br from-orange-500 to-amber-400 text-sm font-black text-white shadow-[0_5px_16px_rgba(249,115,22,0.38)] transition-all duration-200 hover:scale-110 hover:shadow-[0_7px_20px_rgba(249,115,22,0.45)] active:scale-95 sm:h-9 sm:w-9"
                      >
                        ⇅
                      </button>

                    </div>

                    {/* =========================================
                        DROP
                    ========================================= */}

                    <div
                      ref={dropRef}
                      className={`${fieldClass(
                        dropFocused
                      )} relative z-20`}
                    >

                      <label className="block px-3.5 pt-2.5 text-[7px] font-black uppercase tracking-[0.16em] text-slate-400 sm:px-4 sm:pt-3 sm:text-[8px]">
                        To • Drop Location
                      </label>

                      <div className="flex items-center gap-2.5 px-3.5 pb-2.5 pt-1 sm:px-4 sm:pb-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-red-50 text-sm">
                          📍
                        </div>

                        <input
                          required
                          type="text"
                          value={drop}
                          placeholder="Enter drop location"
                          onFocus={() =>
                            setDropFocused(
                              true
                            )
                          }
                          onBlur={() =>
                            setDropFocused(
                              false
                            )
                          }
                          onChange={(e) => {
                            setDrop(
                              e.target.value
                            );

                            fetchLiveSuggestions(
                              e.target.value,
                              "drop"
                            );
                          }}
                          className="min-w-0 flex-1 bg-transparent text-[12px] font-bold text-slate-950 outline-none placeholder:text-slate-400 sm:text-sm"
                        />

                        {drop && (
                          <button
                            type="button"
                            onClick={
                              clearDrop
                            }
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500 transition hover:bg-slate-200"
                            aria-label="Clear drop"
                          >
                            ×
                          </button>
                        )}

                      </div>

                      {/* DROP SUGGESTIONS */}

                      {showDropList &&
                        dropSuggestions.length >
                          0 && (
                          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[1000] overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">

                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3.5 py-2">

                              <span className="text-[7px] font-black uppercase tracking-[0.15em] text-slate-400">
                                Suggested Destinations
                              </span>

                              <span className="text-[7px] font-bold text-slate-300">
                                Google Maps
                              </span>

                            </div>

                            <ul className="max-h-52 overflow-y-auto">

                              {dropSuggestions.map(
                                (
                                  item,
                                  idx
                                ) => (
                                  <li
                                    key={`${item}-${idx}`}
                                  >

                                    <button
                                      type="button"
                                      onMouseDown={(
                                        e
                                      ) =>
                                        e.preventDefault()
                                      }
                                      onClick={() => {
                                        setDrop(
                                          item
                                        );

                                        setShowDropList(
                                          false
                                        );
                                      }}
                                      className="flex w-full items-start gap-2.5 border-b border-slate-50 px-3.5 py-2.5 text-left transition hover:bg-orange-50"
                                    >

                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-50 text-xs">
                                        📍
                                      </span>

                                      <span className="text-[10px] font-semibold leading-4 text-slate-700">
                                        {item}
                                      </span>

                                    </button>

                                  </li>
                                )
                              )}

                            </ul>

                          </div>
                        )}

                    </div>

                  </div>

                </div>
              ) : (
                /* =================================================
                   LOCAL LOCATION
                ================================================= */

                <div className="rounded-[18px] border border-orange-100 bg-orange-50/60 px-4 py-2.5">

                  <div className="flex items-center gap-2.5">

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-sm shadow-sm">
                      📍
                    </span>

                    <div className="min-w-0">

                      <p className="text-[7px] font-black uppercase tracking-[0.15em] text-orange-600">
                        Pickup Location
                      </p>

                      <p className="truncate text-[11px] font-bold text-slate-800">
                        {pickup ||
                          "Enter your pickup location above"}
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* =================================================
                  DATE / TIME
              ================================================= */}

              <div className="grid grid-cols-2 gap-3">

                {/* PICKUP DATE */}

                <div
                  className={fieldClass()}
                >

                  <label className="block px-3.5 pt-2.5 text-[7px] font-black uppercase tracking-[0.16em] text-slate-400 sm:px-4 sm:pt-3 sm:text-[8px]">
                    Pickup Date
                  </label>

                  <div className="flex items-center gap-2 px-3.5 pb-2.5 pt-1 sm:px-4 sm:pb-3">

                    <span className="text-sm">
                      📅
                    </span>

                    <input
                      required
                      type="date"
                      min={minDate}
                      value={pickupDate}
                      onChange={(e) =>
                        setPickupDate(
                          e.target.value
                        )
                      }
                      className="min-w-0 w-full bg-transparent text-[11px] font-bold text-slate-900 outline-none sm:text-sm"
                    />

                  </div>

                </div>

                {/* PICKUP TIME */}

                <div
                  className={fieldClass()}
                >

                  <label className="block px-3.5 pt-2.5 text-[7px] font-black uppercase tracking-[0.16em] text-slate-400 sm:px-4 sm:pt-3 sm:text-[8px]">
                    Pickup Time
                  </label>

                  <div className="flex items-center gap-2 px-3.5 pb-2.5 pt-1 sm:px-4 sm:pb-3">

                    <span className="text-sm">
                      ⏰
                    </span>

                    <input
                      required
                      type="time"
                      min={
                        pickupDate ===
                        minDate
                          ? minTime
                          : undefined
                      }
                      value={pickupTime}
                      onChange={(e) =>
                        setPickupTime(
                          e.target.value
                        )
                      }
                      className="min-w-0 w-full bg-transparent text-[11px] font-bold text-slate-900 outline-none sm:text-sm"
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  ROUND TRIP RETURN DETAILS
              ================================================= */}

              {serviceType ===
                "outstation" &&
                bookingType ===
                  "roundtrip" && (
                  <div className="rounded-[18px] border border-orange-100 bg-orange-50/60 p-2.5">

                    <div className="mb-2 flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-xs">
                          ⇄
                        </span>

                        <span className="text-[8px] font-black uppercase tracking-[0.14em] text-orange-700">
                          Return Journey
                        </span>

                      </div>

                      <span className="rounded-full bg-white px-2 py-1 text-[7px] font-black uppercase tracking-wide text-orange-600 shadow-sm">
                        Required
                      </span>

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      {/* RETURN DATE */}

                      <div className="rounded-[15px] border border-orange-100 bg-white">

                        <label className="block px-3.5 pt-2.5 text-[7px] font-black uppercase tracking-[0.16em] text-slate-400 sm:px-4 sm:pt-3 sm:text-[8px]">
                          Return Date
                        </label>

                        <div className="flex items-center gap-2 px-3 pb-2 pt-1">

                          <span className="text-sm">
                            📅
                          </span>

                          <input
                            required
                            type="date"
                            min={
                              pickupDate ||
                              minDate
                            }
                            value={
                              returnDate
                            }
                            onChange={(e) =>
                              setReturnDate(
                                e.target
                                  .value
                              )
                            }
                            className="min-w-0 w-full bg-transparent text-[11px] font-bold text-slate-900 outline-none sm:text-sm"
                          />

                        </div>

                      </div>

                      {/* RETURN TIME */}

                      <div className="rounded-[15px] border border-orange-100 bg-white">

                        <label className="block px-3.5 pt-2.5 text-[7px] font-black uppercase tracking-[0.16em] text-slate-400 sm:px-4 sm:pt-3 sm:text-[8px]">
                          Return Time
                        </label>

                        <div className="flex items-center gap-2 px-3 pb-2 pt-1">

                          <span className="text-sm">
                            ⏰
                          </span>

                          <input
                            required
                            type="time"
                            value={
                              returnTime
                            }
                            onChange={(e) =>
                              setReturnTime(
                                e.target
                                  .value
                              )
                            }
                            className="min-w-0 w-full bg-transparent text-[11px] font-bold text-slate-900 outline-none sm:text-sm"
                          />

                        </div>

                      </div>

                    </div>

                  </div>
                )}

              {/* =================================================
                  LOCAL INFO
              ================================================= */}

              {serviceType ===
                "local" && (
                <div className="flex items-center gap-2.5 rounded-[16px] border border-emerald-100 bg-emerald-50 px-3 py-2">

                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                    ✓
                  </span>

                  <p className="text-[9px] font-bold leading-4 text-emerald-700 sm:text-[10px]">
                    8 Hours / 80 KM package included.
                    Fare is calculated according to the selected vehicle.
                  </p>

                </div>
              )}

              {/* =================================================
                  OUTSTATION INFO
              ================================================= */}

              {serviceType ===
                "outstation" && (
                <div className="flex items-center gap-2.5 rounded-[16px] border border-blue-100 bg-blue-50 px-3 py-2">

                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs">
                    ℹ️
                  </span>

                  <p className="text-[9px] font-semibold leading-4 text-blue-700 sm:text-[10px]">
                    Final fare is calculated using the actual route distance and selected journey type.
                  </p>

                </div>
              )}

              {/* =================================================
                  CTA
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="group relative mt-1 flex min-h-[56px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-[18px] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 px-5 text-[11px] font-black uppercase tracking-[0.13em] text-white shadow-[0_11px_28px_rgba(249,115,22,0.30)] transition-all duration-200 hover:shadow-[0_15px_34px_rgba(249,115,22,0.38)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-80 sm:text-sm"
              >

                {/* SHINE */}

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    <span>
                      CALCULATING FARE...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">
                      🧮
                    </span>

                    <span>
                      {serviceType ===
                      "local"
                        ? "CALCULATE PACKAGE FARE"
                        : "SEARCH CABS"}
                    </span>

                    <span className="text-lg transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}

              </button>

            </div>

          </form>

          {/* =================================================
              TRUST FOOTER
          ================================================= */}

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-7">

            <div className="grid grid-cols-3 divide-x divide-slate-200">

              {/* TRANSPARENT */}

              <div className="flex items-center justify-center gap-1.5 px-2 text-center">

                <span className="text-sm">
                  🛡️
                </span>

                <span className="text-[7px] font-black uppercase tracking-wide text-slate-500 sm:text-[8px]">
                  Transparent
                </span>

              </div>

              {/* VERIFIED */}

              <div className="flex items-center justify-center gap-1.5 px-2 text-center">

                <span className="text-sm">
                  🚕
                </span>

                <span className="text-[7px] font-black uppercase tracking-wide text-slate-500 sm:text-[8px]">
                  Verified Cabs
                </span>

              </div>

              {/* SUPPORT */}

              <div className="flex items-center justify-center gap-1.5 px-2 text-center">

                <span className="text-sm">
                  ☎️
                </span>

                <span className="text-[7px] font-black uppercase tracking-wide text-slate-500 sm:text-[8px]">
                  Support
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
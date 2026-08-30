// components/FareCalculator.tsx
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

type CalculatorMode =
  | "outstation"
  | "airport"
  | "local";

export default function FareCalculator({
  onFareCalculated,
}: FareCalculatorProps) {
  /* =========================================================
     SERVICE / BOOKING
  ========================================================= */

  const [serviceType, setMainServiceType] =
    useState<"outstation" | "local">(
      "outstation"
    );

  const [calculatorMode, setCalculatorMode] =
    useState<CalculatorMode>(
      "outstation"
    );

  const [bookingType, setBookingType] =
    useState<BookingType>("oneway");

  /* =========================================================
     FORM
  ========================================================= */

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [pickupDate, setPickupDate] =
    useState("");

  const [pickupTime, setPickupTime] =
    useState("");

  const [returnDate, setReturnDate] =
    useState("");

  const [returnTime, setReturnTime] =
    useState("");

  /* =========================================================
     UI
  ========================================================= */

  const [loading, setLoading] =
    useState(false);

  const [minDate, setMinDate] =
    useState("");

  const [minTime, setMinTime] =
    useState("");

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

  const pickupRef =
    useRef<HTMLDivElement>(null);

  const dropRef =
    useRef<HTMLDivElement>(null);

  /* =========================================================
     DATE / TIME
  ========================================================= */

  useEffect(() => {
    const now = new Date();

    const dateValue =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}`;

    const timeValue =
      `${String(
        now.getHours()
      ).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

    setMinDate(dateValue);
    setMinTime(timeValue);
  }, []);

  /* =========================================================
     GOOGLE PLACES AUTOCOMPLETE
     EXISTING API PRESERVED
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

      /*
       * Do not blindly call response.json()
       * on an HTML 404/500 response.
       *
       * This also prevents:
       * Unexpected token '<'
       */

      const text = await response.text();

      if (!response.ok) {
        console.error(
          `[places-autocomplete] HTTP ${response.status}`,
          text.slice(0, 300)
        );

        return;
      }

      let data: any;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error(
          "Places API returned invalid JSON:",
          text.slice(0, 300)
        );

        return;
      }

      if (
        data &&
        Array.isArray(data.predictions)
      ) {
        const results =
          data.predictions.map(
            (p: any) =>
              p.description
          );

        if (type === "pickup") {
          setPickupSuggestions(results);
          setShowPickupList(
            results.length > 0
          );
        } else {
          setDropSuggestions(results);
          setShowDropList(
            results.length > 0
          );
        }
      }
    } catch (error) {
      console.error(
        "Autocomplete error:",
        error
      );
    }
  };

  /* =========================================================
     CLICK OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      const target =
        event.target as Node;

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
    };

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
     SERVICE BUTTONS
  ========================================================= */

  const selectOutstation = () => {
    setCalculatorMode(
      "outstation"
    );

    setMainServiceType(
      "outstation"
    );

    setBookingType("oneway");

    setReturnDate("");
    setReturnTime("");
  };

  const selectAirport = () => {
    /*
     * Airport mode uses the existing
     * one-way/outstation fare flow.
     *
     * No backend/service contract is changed.
     */

    setCalculatorMode("airport");

    setMainServiceType(
      "outstation"
    );

    setBookingType("oneway");

    setReturnDate("");
    setReturnTime("");
  };

  const selectLocal = () => {
    setCalculatorMode("local");

    setMainServiceType("local");

    setBookingType("oneway");

    setDrop("");

    setReturnDate("");
    setReturnTime("");

    setDropSuggestions([]);
    setShowDropList(false);
  };

  /* =========================================================
     BOOKING TYPE
  ========================================================= */

  const selectBookingType = (
    type: BookingType
  ) => {
    setBookingType(type);

    if (type === "oneway") {
      setReturnDate("");
      setReturnTime("");
    }
  };

  /* =========================================================
     CLEAR
  ========================================================= */

  const clearPickup = () => {
    setPickup("");
    setPickupSuggestions([]);
    setShowPickupList(false);
  };

  const clearDrop = () => {
    setDrop("");
    setDropSuggestions([]);
    setShowDropList(false);
  };

  /* =========================================================
     SWAP
  ========================================================= */

  const swapLocations = () => {
    const currentPickup =
      pickup;

    setPickup(drop);
    setDrop(currentPickup);

    setShowPickupList(false);
    setShowDropList(false);
  };

  /* =========================================================
     SHARED FIELD STYLE
  ========================================================= */

  const fieldClass = (
    active = false
  ) =>
    [
      "rounded-[18px]",
      "border",
      "bg-white",
      "transition-all",
      "duration-200",
      "overflow-visible",

      active
        ? "border-orange-400 ring-4 ring-orange-500/10 shadow-[0_8px_25px_rgba(249,115,22,0.10)]"
        : "border-slate-200 shadow-[0_4px_16px_rgba(15,23,42,0.045)]",
    ].join(" ");

  /* =========================================================
     CALCULATE
     EXISTING FARE LOGIC PRESERVED
  ========================================================= */

  const handleCalculate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !pickup.trim() ||
      (serviceType !== "local" &&
        !drop.trim()) ||
      !pickupDate ||
      !pickupTime
    ) {
      alert(
        "⚠️ Error: All fields are mandatory!"
      );

      return;
    }

    if (
      bookingType === "roundtrip" &&
      (!returnDate || !returnTime)
    ) {
      alert(
        "⚠️ Error: Return details are required for Round Trips!"
      );

      return;
    }

    setLoading(true);

    try {
      let mappedDistance =
        serviceType === "local"
          ? 80
          : 45;

      /* =====================================================
         DISTANCE API
         EXISTING BACKEND PRESERVED
      ===================================================== */

      if (
        serviceType !== "local"
      ) {
        try {
          const response =
            await fetch(
              "/api/distance",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  origin: pickup,
                  destination:
                    drop,
                }),
              }
            );

          const text =
            await response.text();

          if (response.ok) {
            try {
              const routeData =
                JSON.parse(text);

              if (
                routeData &&
                routeData.distanceKm
              ) {
                mappedDistance =
                  routeData.distanceKm;
              }
            } catch (error) {
              console.error(
                "Distance API returned invalid JSON:",
                text.slice(0, 300)
              );
            }
          } else {
            console.error(
              `[distance] HTTP ${response.status}`,
              text.slice(0, 300)
            );
          }
        } catch (error) {
          console.error(
            "Distance API error:",
            error
          );
        }
      }

      /* =====================================================
         FARE CALCULATION
      ===================================================== */

      let computedServiceType:
        ServiceType =
        serviceType;

      const options = (
        Object.keys(
          VEHICLES
        ) as VehicleType[]
      ).map((type) => {
        const res =
          calculateFare({
            distance:
              mappedDistance,

            vehicleType:
              type,

            bookingType,

            serviceType,

            pickupDate,

            pickupTime,

            returnDate:
              bookingType ===
              "roundtrip"
                ? returnDate
                : undefined,

            returnTime:
              bookingType ===
              "roundtrip"
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

          finalFare:
            res.finalFare,

          strikeFare:
            res.strikeFare,

          fareText:
            `₹${res.finalFare.toLocaleString(
              "en-IN"
            )}`,

          billedDistance:
            res.billedDistance,

          durationMinutes:
            res.durationMinutes,
        };
      });

      /* =====================================================
         SEND RESULT
      ===================================================== */

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
          bookingType ===
          "roundtrip"
            ? returnDate
            : undefined,

        returnTime:
          bookingType ===
          "roundtrip"
            ? returnTime
            : undefined,
      });
    } catch (error) {
      console.error(
        "Fare calculation error:",
        error
      );

      alert(
        "⚠️ Unable to calculate fare right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SERVICE BUTTON COMPONENT
  ========================================================= */

  const ServiceButton = ({
    active,
    icon,
    label,
    onClick,
  }: {
    active: boolean;
    icon: string;
    label: string;
    onClick: () => void;
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative flex min-h-[46px] flex-1 items-center justify-center gap-1.5 rounded-[14px] px-2 text-[9px] font-black tracking-wide transition-all duration-200 sm:min-h-[50px] sm:text-[11px] ${
          active
            ? "bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 text-white shadow-[0_6px_16px_rgba(249,115,22,0.28)]"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <span className="text-sm sm:text-base">
          {icon}
        </span>

        <span>
          {label}
        </span>

        {active && (
          <span className="absolute -bottom-[4px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-amber-400" />
        )}
      </button>
    );
  };

  /* =========================================================
     LOCATION FIELD
  ========================================================= */

  const LocationField = ({
    type,
  }: {
    type: "pickup" | "drop";
  }) => {
    const isPickup =
      type === "pickup";

    const value = isPickup
      ? pickup
      : drop;

    const focused =
      isPickup
        ? pickupFocused
        : dropFocused;

    const suggestions =
      isPickup
        ? pickupSuggestions
        : dropSuggestions;

    const showList =
      isPickup
        ? showPickupList
        : showDropList;

    const setFocused =
      isPickup
        ? setPickupFocused
        : setDropFocused;

    const setValue = isPickup
      ? setPickup
      : setDrop;

    const clear = isPickup
      ? clearPickup
      : clearDrop;

    return (
      <div
        ref={
          isPickup
            ? pickupRef
            : dropRef
        }
        className={`${fieldClass(
          focused
        )} relative z-30`}
      >
        <label className="block px-3.5 pt-2.5 text-[7px] font-black uppercase tracking-[0.15em] text-slate-400 sm:px-4 sm:pt-3 sm:text-[8px]">
          {isPickup
            ? "From • Pickup Location"
            : "To • Drop Location"}
        </label>

        <div className="flex items-center gap-2 px-3.5 pb-2.5 pt-1 sm:px-4 sm:pb-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-sm ${
              isPickup
                ? "bg-emerald-50"
                : "bg-red-50"
            }`}
          >
            📍
          </div>

          <input
            required
            type="text"
            value={value}
            placeholder={
              isPickup
                ? "Enter pickup location"
                : "Enter drop location"
            }
            onFocus={() =>
              setFocused(true)
            }
            onBlur={() =>
              setFocused(false)
            }
            onChange={(e) => {
              setValue(
                e.target.value
              );

              fetchLiveSuggestions(
                e.target.value,
                type
              );
            }}
            className="min-w-0 flex-1 bg-transparent text-[12px] font-bold text-slate-950 outline-none placeholder:text-slate-400 sm:text-sm"
          />

          {value && (
            <button
              type="button"
              onClick={clear}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500 transition hover:bg-slate-200"
              aria-label={
                isPickup
                  ? "Clear pickup"
                  : "Clear drop"
              }
            >
              ×
            </button>
          )}
        </div>

        {/* SUGGESTIONS */}

        {showList &&
          suggestions.length >
            0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[1000] overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3.5 py-2">
                <span className="text-[7px] font-black uppercase tracking-[0.15em] text-slate-400">
                  {isPickup
                    ? "Suggested Locations"
                    : "Suggested Destinations"}
                </span>

                <span className="text-[7px] font-bold text-slate-300">
                  Google Maps
                </span>
              </div>

              <ul className="max-h-48 overflow-y-auto">
                {suggestions.map(
                  (
                    item,
                    index
                  ) => (
                    <li
                      key={`${item}-${index}`}
                    >
                      <button
                        type="button"
                        onMouseDown={(
                          e
                        ) =>
                          e.preventDefault()
                        }
                        onClick={() => {
                          setValue(
                            item
                          );

                          if (
                            isPickup
                          ) {
                            setShowPickupList(
                              false
                            );
                          } else {
                            setShowDropList(
                              false
                            );
                          }
                        }}
                        className="flex w-full items-start gap-2.5 border-b border-slate-50 px-3.5 py-2.5 text-left transition hover:bg-orange-50"
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs ${
                            isPickup
                              ? "bg-emerald-50"
                              : "bg-red-50"
                          }`}
                        >
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
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full px-0">

      <div className="mx-auto w-full max-w-[1180px]">

        {/* =====================================================
            MAIN CALCULATOR CARD
        ===================================================== */}

        <div className="overflow-visible rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_55px_rgba(15,23,42,0.10)]">

          {/* ===================================================
              SERVICE TABS
              OUTSTATION / AIRPORT / LOCAL
          =================================================== */}

          <div className="border-b border-slate-100 p-1.5 sm:p-2">

            <div className="flex w-full gap-1.5 rounded-[18px] bg-slate-50 p-1">

              <ServiceButton
                active={
                  calculatorMode ===
                  "outstation"
                }
                icon="🚕"
                label="Outstation"
                onClick={
                  selectOutstation
                }
              />

              <ServiceButton
                active={
                  calculatorMode ===
                  "airport"
                }
                icon="✈️"
                label="Airport Dropping"
                onClick={
                  selectAirport
                }
              />

              <ServiceButton
                active={
                  calculatorMode ===
                  "local"
                }
                icon="🏙️"
                label="Local Package"
                onClick={
                  selectLocal
                }
              />

            </div>

          </div>

          {/* ===================================================
              HEADER
          =================================================== */}

          <div className="border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-3.5">

            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-2.5">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-br from-orange-500 to-amber-400 text-base shadow-[0_6px_15px_rgba(249,115,22,0.23)]">
                  🧮
                </div>

                <div className="min-w-0">

                  <h2 className="truncate text-[16px] font-black tracking-tight text-slate-950 sm:text-[18px]">

                    {calculatorMode ===
                    "local"
                      ? "Local Package Fare"
                      : calculatorMode ===
                        "airport"
                      ? "Airport Dropping Fare"
                      : bookingType ===
                        "roundtrip"
                      ? "Round Trip Fare"
                      : "Outstation Fare"}

                  </h2>

                  <p className="mt-0.5 text-[8px] font-semibold text-slate-500 sm:text-[9px]">
                    Instant fare • Simple booking • Transparent pricing
                  </p>

                </div>

              </div>

              <div className="hidden shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:block">

                <span className="text-[7px] font-black uppercase tracking-wide text-emerald-700">
                  ✓ Transparent Fare
                </span>

              </div>

            </div>

          </div>

          {/* ===================================================
              LOCAL PACKAGE SUMMARY
          =================================================== */}

          {serviceType ===
            "local" && (
            <div className="px-4 pt-2.5 sm:px-6">

              <div className="rounded-[16px] border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-1.5">

                <div className="grid grid-cols-3 gap-1.5">

                  <div className="rounded-[12px] bg-white px-1.5 py-1.5 text-center shadow-sm">

                    <span className="block text-xs">
                      ⏱️
                    </span>

                    <span className="block text-[6px] font-bold uppercase tracking-wide text-slate-400">
                      Duration
                    </span>

                    <span className="block text-[9px] font-black text-slate-900">
                      8 Hours
                    </span>

                  </div>

                  <div className="rounded-[12px] bg-white px-1.5 py-1.5 text-center shadow-sm">

                    <span className="block text-xs">
                      🛣️
                    </span>

                    <span className="block text-[6px] font-bold uppercase tracking-wide text-slate-400">
                      Included
                    </span>

                    <span className="block text-[9px] font-black text-slate-900">
                      80 KM
                    </span>

                  </div>

                  <div className="rounded-[12px] bg-white px-1.5 py-1.5 text-center shadow-sm">

                    <span className="block text-xs">
                      🚕
                    </span>

                    <span className="block text-[6px] font-bold uppercase tracking-wide text-slate-400">
                      Service
                    </span>

                    <span className="block text-[9px] font-black text-slate-900">
                      Local
                    </span>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ===================================================
              FORM
          =================================================== */}

          <form
            onSubmit={
              handleCalculate
            }
          >

            <div className="space-y-2.5 px-4 pb-3.5 pt-3 sm:px-6">

              {/* =================================================
                  OUTSTATION / AIRPORT JOURNEY TYPE
              ================================================= */}

              {serviceType ===
                "outstation" && (
                <div>

                  <div className="mb-1 flex items-center justify-between">

                    <span className="text-[7px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Journey Type
                    </span>

                    <span className="text-[7px] font-bold text-slate-400">
                      Choose your trip
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-1.5 rounded-[15px] bg-slate-100 p-1">

                    {/* ONE WAY */}

                    <button
                      type="button"
                      onClick={() =>
                        selectBookingType(
                          "oneway"
                        )
                      }
                      className={`min-h-[36px] rounded-[11px] text-[9px] font-black transition-all sm:text-[10px] ${
                        bookingType ===
                        "oneway"
                          ? "bg-white text-orange-600 shadow-sm ring-1 ring-orange-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="mr-1">
                        →
                      </span>
                      ONE WAY
                    </button>

                    {/* ROUND TRIP */}

                    <button
                      type="button"
                      onClick={() =>
                        selectBookingType(
                          "roundtrip"
                        )
                      }
                      className={`min-h-[36px] rounded-[11px] text-[9px] font-black transition-all sm:text-[10px] ${
                        bookingType ===
                        "roundtrip"
                          ? "bg-white text-orange-600 shadow-sm ring-1 ring-orange-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="mr-1">
                        ⇄
                      </span>
                      ROUND TRIP
                    </button>

                  </div>

                </div>
              )}

              {/* =================================================
                  LOCATIONS
              ================================================= */}

              {serviceType !==
                "local" ? (
                <div className="relative">

                  {/* DESKTOP:
                      PICKUP | SWAP | DROP

                      MOBILE:
                      PICKUP
                      SWAP
                      DROP
                  */}

                  <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[minmax(0,1fr)_46px_minmax(0,1fr)] lg:items-center lg:gap-0">

                    {/* PICKUP */}

                    <LocationField
                      type="pickup"
                    />

                    {/* =================================================
                        CENTER SWAP
                    ================================================= */}

                    <div className="relative z-[200] flex h-7 items-center justify-center lg:h-full">

                      {/* desktop connecting line */}

                      <span className="pointer-events-none absolute hidden h-px w-full bg-orange-200 lg:block" />

                      <button
                        type="button"
                        onClick={
                          swapLocations
                        }
                        aria-label="Swap pickup and drop locations"
                        className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-orange-500 to-amber-400 text-sm font-black text-white shadow-[0_5px_15px_rgba(249,115,22,0.35)] transition-all duration-200 hover:scale-110 hover:shadow-[0_7px_20px_rgba(249,115,22,0.45)] active:scale-95 sm:h-9 sm:w-9"
                      >
                        ⇅
                      </button>

                    </div>

                    {/* DROP */}

                    <LocationField
                      type="drop"
                    />

                  </div>

                </div>
              ) : (
                /* =================================================
                   LOCAL PICKUP
                ================================================= */

                <LocationField
                  type="pickup"
                />
              )}

              {/* =================================================
                  PICKUP DATE + TIME
              ================================================= */}

              <div className="grid grid-cols-2 gap-2">

                {/* DATE */}

                <div
                  className={fieldClass()}
                >

                  <label className="block px-3.5 pt-2.5 text-[7px] font-black uppercase tracking-[0.15em] text-slate-400 sm:px-4 sm:pt-3 sm:text-[8px]">
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
                      value={
                        pickupDate
                      }
                      onChange={(e) =>
                        setPickupDate(
                          e.target.value
                        )
                      }
                      className="min-w-0 w-full bg-transparent text-[10px] font-bold text-slate-900 outline-none sm:text-xs"
                    />

                  </div>

                </div>

                {/* TIME */}

                <div
                  className={fieldClass()}
                >

                  <label className="block px-3.5 pt-2.5 text-[7px] font-black uppercase tracking-[0.15em] text-slate-400 sm:px-4 sm:pt-3 sm:text-[8px]">
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
                      value={
                        pickupTime
                      }
                      onChange={(e) =>
                        setPickupTime(
                          e.target.value
                        )
                      }
                      className="min-w-0 w-full bg-transparent text-[10px] font-bold text-slate-900 outline-none sm:text-xs"
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  ROUND TRIP RETURN
              ================================================= */}

              {serviceType ===
                "outstation" &&
                bookingType ===
                  "roundtrip" && (
                  <div className="rounded-[16px] border border-orange-100 bg-orange-50/60 p-2">

                    <div className="mb-1.5 flex items-center justify-between">

                      <div className="flex items-center gap-1.5">

                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-100 text-[10px]">
                          ⇄
                        </span>

                        <span className="text-[7px] font-black uppercase tracking-[0.14em] text-orange-700">
                          Return Journey
                        </span>

                      </div>

                      <span className="rounded-full bg-white px-1.5 py-0.5 text-[6px] font-black uppercase tracking-wide text-orange-600 shadow-sm">
                        Required
                      </span>

                    </div>

                    <div className="grid grid-cols-2 gap-2">

                      {/* RETURN DATE */}

                      <div className="rounded-[13px] border border-orange-100 bg-white">

                        <label className="block px-2.5 pt-2 text-[6px] font-black uppercase tracking-wide text-slate-400">
                          Return Date
                        </label>

                        <div className="flex items-center gap-1.5 px-2.5 pb-2 pt-0.5">

                          <span className="text-xs">
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
                                e.target.value
                              )
                            }
                            className="min-w-0 w-full bg-transparent text-[9px] font-bold text-slate-900 outline-none"
                          />

                        </div>

                      </div>

                      {/* RETURN TIME */}

                      <div className="rounded-[13px] border border-orange-100 bg-white">

                        <label className="block px-2.5 pt-2 text-[6px] font-black uppercase tracking-wide text-slate-400">
                          Return Time
                        </label>

                        <div className="flex items-center gap-1.5 px-2.5 pb-2 pt-0.5">

                          <span className="text-xs">
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
                                e.target.value
                              )
                            }
                            className="min-w-0 w-full bg-transparent text-[9px] font-bold text-slate-900 outline-none"
                          />

                        </div>

                      </div>

                    </div>

                  </div>
                )}

              {/* =================================================
                  INFO
              ================================================= */}

              {serviceType ===
                "local" ? (
                <div className="flex items-center gap-2 rounded-[14px] border border-emerald-100 bg-emerald-50 px-2.5 py-1.5">

                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-black text-emerald-700">
                    ✓
                  </span>

                  <p className="text-[7px] font-bold leading-3.5 text-emerald-700 sm:text-[8px]">
                    8 Hours / 80 KM package included.
                    Fare is calculated according to the selected vehicle.
                  </p>

                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-[14px] border border-blue-100 bg-blue-50 px-2.5 py-1.5">

                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[9px]">
                    ℹ️
                  </span>

                  <p className="text-[7px] font-semibold leading-3.5 text-blue-700 sm:text-[8px]">
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
                className="group relative flex min-h-[50px] w-full items-center justify-center gap-2 overflow-hidden rounded-[16px] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 px-4 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-[0_9px_24px_rgba(249,115,22,0.28)] transition-all duration-200 hover:shadow-[0_12px_30px_rgba(249,115,22,0.36)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-80 sm:min-h-[52px] sm:text-xs"
              >

                {/* shine */}

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    <span>
                      CALCULATING FARE...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-base">
                      🧮
                    </span>

                    <span>
                      {serviceType ===
                      "local"
                        ? "CALCULATE PACKAGE FARE"
                        : calculatorMode ===
                          "airport"
                        ? "CALCULATE AIRPORT FARE"
                        : bookingType ===
                          "roundtrip"
                        ? "SEARCH ROUND TRIP CABS"
                        : "SEARCH CABS"}
                    </span>

                    <span className="text-base transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}

              </button>

            </div>
          </form>

          {/* ===================================================
              TRUST FOOTER
          =================================================== */}

          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 sm:px-6">

            <div className="grid grid-cols-3 divide-x divide-slate-200">

              <div className="flex items-center justify-center gap-1.5 px-1 text-center">

                <span className="text-xs">
                  🛡️
                </span>

                <span className="text-[6px] font-black uppercase tracking-wide text-slate-500 sm:text-[7px]">
                  Transparent Fare
                </span>

              </div>

              <div className="flex items-center justify-center gap-1.5 px-1 text-center">

                <span className="text-xs">
                  🚕
                </span>

                <span className="text-[6px] font-black uppercase tracking-wide text-slate-500 sm:text-[7px]">
                  Verified Cabs
                </span>

              </div>

              <div className="flex items-center justify-center gap-1.5 px-1 text-center">

                <span className="text-xs">
                  ☎️
                </span>

                <span className="text-[6px] font-black uppercase tracking-wide text-slate-500 sm:text-[7px]">
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
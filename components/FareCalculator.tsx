// components/FareCalculator.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  ArrowLeft,
  CalendarDays,
  CarFront,
  MapPin,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  MessageCircle,
  Pencil,
  LoaderCircle,
  X,
  Clock3,
  Route as RouteIcon,
} from "lucide-react";
import {
  calculateFare,
  LOCAL_PACKAGES,
  VEHICLES,
  type BookingType,
  type LocalPackageType,
  type VehicleType,
} from "@/lib/fareCalculator";

interface FareCalculatorProps {
  onFareCalculated?: (data: any) => void;
  onBookCall?: (vehicle: any, routeData: any) => void;
  onBookWhatsApp?: (vehicle: any, routeData: any) => void;
  /** Connect only to a secure server-side Razorpay order/payment workflow. */
  onBookNow?: (vehicle: any, routeData: any) => void;
}

type MainTab = "oneway" | "roundtrip" | "local";
type SelectedLocation = { placeId: string; description: string };
type Suggestion = { place_id: string; description: string };

const localPackages: { id: LocalPackageType; label: string }[] = [
  { id: "4hr40km", label: "4 Hr / 40 KM" },
  { id: "8hr80km", label: "8 Hr / 80 KM" },
  { id: "12hr120km", label: "12 Hr / 120 KM" },
];

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDuration(minutes: number) {
  if (!minutes || minutes <= 0) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h
    ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} Hr`
    : `${m} Min`;
}

const KHATU_RIDES_PHONE = "9244137353";
const KHATU_RIDES_WHATSAPP = "919244137353";

function formatBookingDate(value: string) {
  if (!value) return "Not selected";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function buildBookingEnquiryMessage(
  vehicle: any,
  routeData: any,
  option: any,
) {
  const bookingLabel =
    routeData.bookingType === "oneway"
      ? "One Way"
      : routeData.bookingType === "roundtrip"
        ? "Round Trip"
        : "Local Rental";

  const lines = [
    " नमस्कार Khatu Rides Travels Co.!",
    "",
    "I would like to enquire about a cab booking.",
    "",
    " *TRIP DETAILS*",
    `Booking Type: ${bookingLabel}`,
    `Pickup: ${routeData.pickup || "Not specified"}`,
    ...(routeData.drop ? [`Drop: ${routeData.drop}`] : []),
    `Pickup Date: ${formatBookingDate(routeData.pickupDate)}`,
    `Pickup Time: ${routeData.pickupTime || "As discussed"}`,
    ...(routeData.bookingType === "roundtrip"
      ? [
          `Return Date: ${formatBookingDate(routeData.returnDate)}`,
          `Return Time: ${routeData.returnTime || "As discussed"}`,
        ]
      : []),
    ...(routeData.bookingType === "local" && routeData.localPackageLabel
      ? [`Package: ${routeData.localPackageLabel}`]
      : []),
    ...(Number(routeData.distanceKm) > 0
      ? [`Distance: ${routeData.distanceKm} KM${routeData.bookingType === "oneway" ? " (one side)" : ""}`]
      : []),
    "",
    " *VEHICLE & FARE*",
    `Vehicle: ${vehicle?.label || option?.vehicle?.label || option?.vehicleType || "As selected"}`,
    `Estimated Fare: ${money(Number(option?.finalFare || 0))}`,
    "",
    "Please confirm vehicle availability and the final payable amount.",
    "Thank you.",
    "",
    "Khatu Rides Travels Co.",
    "Call / WhatsApp: 9244137353",
    "https://khaturidescg.in",
  ];

  return lines.join("\n").replace(/^ /gm, "");
}

function today() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function inputShellClass() {
  return "flex min-h-[58px] w-full min-w-0 items-center gap-2.5 rounded-xl border-2 border-blue-300 bg-white px-3.5 transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 sm:min-h-[68px] sm:gap-3 sm:rounded-2xl sm:px-4";
}

function fieldLabelClass() {
  return "mb-1.5 block text-[10px] font-extrabold tracking-[0.12em] text-slate-600 sm:mb-2 sm:text-xs";
}

export default function FareCalculator({
  onFareCalculated,
  onBookCall,
  onBookWhatsApp,
  onBookNow,
}: FareCalculatorProps) {
  const [tab, setTab] = useState<MainTab>("oneway");
  const [pickup, setPickup] = useState<SelectedLocation | null>(null);
  const [drop, setDrop] = useState<SelectedLocation | null>(null);
  const [pickupText, setPickupText] = useState("");
  const [dropText, setDropText] = useState("");
  const [activeField, setActiveField] = useState<"pickup" | "drop" | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [pickupDate, setPickupDate] = useState(today());
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnDate, setReturnDate] = useState(today());
  const [returnTime, setReturnTime] = useState("18:00");
  const [localPackage, setLocalPackage] = useState<LocalPackageType>("8hr80km");
  const [route, setRoute] = useState<any>(null);
  const [fareOptions, setFareOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [bookingOption, setBookingOption] = useState<any | null>(null);
  const [passenger, setPassenger] = useState({ name: "", mobile: "", email: "" });
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showRouteMap, setShowRouteMap] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!activeField) {
      setSuggestions([]);
      return;
    }

    const value = activeField === "pickup" ? pickupText : dropText;
    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setSearching(true);
        const response = await fetch(
          `/api/places-autocomplete?input=${encodeURIComponent(value)}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Location search failed");
        setSuggestions(
          Array.isArray(data.predictions) ? data.predictions.slice(0, 6) : []
        );
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pickupText, dropText, activeField]);

  function chooseSuggestion(item: Suggestion) {
    const selected = {
      placeId: item.place_id,
      description: item.description,
    };

    if (activeField === "pickup") {
      setPickup(selected);
      setPickupText(item.description);
    } else if (activeField === "drop") {
      setDrop(selected);
      setDropText(item.description);
    }

    setSuggestions([]);
    setActiveField(null);
  }

  function updateLocationText(field: "pickup" | "drop", value: string) {
    if (field === "pickup") {
      setPickupText(value);
      setPickup(null);
    } else {
      setDropText(value);
      setDrop(null);
    }
    setActiveField(field);
  }

  function swapLocations() {
    setPickup(drop);
    setDrop(pickup);
    setPickupText(dropText);
    setDropText(pickupText);
  }

  function makeMapUrl() {
    const origin = encodeURIComponent(pickup?.description || pickupText);
    const destination = encodeURIComponent(drop?.description || dropText);

    if (tab === "local" || !destination) {
      return `https://www.google.com/maps?q=${origin}&output=embed`;
    }

    return `https://www.google.com/maps?output=embed&saddr=${origin}&daddr=${destination}`;
  }

  async function calculate() {
    setError("");

    if (tab !== "local" && (!pickup || !drop)) {
      setError("कृपया Pickup और Drop दोनों जगह Google suggestions से location चुनें।");
      return;
    }
    if (tab === "local" && !pickup) {
      setError("कृपया Pickup location चुनें।");
      return;
    }
    if (tab === "roundtrip" && returnDate < pickupDate) {
      setError("Return date, pickup date से पहले नहीं हो सकती।");
      return;
    }

    setLoading(true);
    try {
      let distanceKm = 0;
      let routeData: any = null;

      if (tab !== "local") {
        const response = await fetch("/api/distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin: pickup!.description,
            destination: drop!.description,
            originPlaceId: pickup!.placeId,
            destinationPlaceId: drop!.placeId,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Route calculate नहीं हो पाया।");
        }
        distanceKm = Number(data.distanceKm || 0);
        routeData = data;
      } else {
        distanceKm = LOCAL_PACKAGES.sedan[localPackage].kms;
      }

      const bookingType: BookingType = tab;
      const options = (Object.keys(VEHICLES) as VehicleType[]).map(
        (vehicleType) => {
          const result = calculateFare({
            distance: distanceKm,
            vehicleType,
            bookingType,
            serviceType: tab === "local" ? "local" : "outstation",
            pickup: pickup?.description || "",
            drop: drop?.description || "",
            pickupDate,
            pickupTime,
            returnDate: tab === "roundtrip" ? returnDate : undefined,
            returnTime: tab === "roundtrip" ? returnTime : undefined,
            localPackage,
          });

          return {
            vehicleType,
            vehicle: VEHICLES[vehicleType],
            ...result,
          };
        }
      );

      const resultPayload = {
        pickup: pickup?.description || "",
        drop: drop?.description || "",
        pickupPlaceId: pickup?.placeId || "",
        dropPlaceId: drop?.placeId || "",
        bookingType,
        serviceType: tab === "local" ? "local" : "outstation",
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        distanceKm,
        route: routeData,
        fareOptions: options,
      };

      setRoute(routeData);
      setFareOptions(options);
      setShowRouteMap(false);
      setShowResults(true);
      onFareCalculated?.(resultPayload);
    } catch (e: any) {
      setError(e?.message || "Fare calculate करते समय समस्या हुई।");
    } finally {
      setLoading(false);
    }
  }

  const resultData = {
    pickup: pickup?.description || "",
    drop: drop?.description || "",
    pickupPlaceId: pickup?.placeId || "",
    dropPlaceId: drop?.placeId || "",
    bookingType: tab,
    serviceType: tab === "local" ? "local" : "outstation",
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    distanceKm:
      tab === "local"
        ? LOCAL_PACKAGES.sedan[localPackage].kms
        : route?.distanceKm || 0,
    durationMinutes: route?.durationMinutes || 0,
    localPackageLabel:
      tab === "local"
        ? localPackages.find((item) => item.id === localPackage)?.label || ""
        : "",
    route,
  };

  function handleCallEnquiry(vehicle: any, routeData: any) {
    if (onBookCall) {
      onBookCall(vehicle, routeData);
      return;
    }
    window.location.href = `tel:+91${KHATU_RIDES_PHONE}`;
  }

  function handleWhatsAppEnquiry(vehicle: any, routeData: any, option: any) {
    if (onBookWhatsApp) {
      onBookWhatsApp(vehicle, routeData);
      return;
    }

    const message = buildBookingEnquiryMessage(
      vehicle?.vehicle || vehicle,
      routeData,
      option || vehicle,
    );
    const whatsappUrl =
      `https://wa.me/${KHATU_RIDES_WHATSAPP}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  
async function startRazorpayPayment() {
  if (!bookingOption || paymentBusy) return;

  setPaymentError("");

  const name = passenger.name.trim();
  const mobile = passenger.mobile.replace(/\D/g, "");
  const email = passenger.email.trim();

  if (
    name.length < 2 ||
    !/^[6-9]\d{9}$/.test(mobile) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    setPaymentError(
      "Please enter your name, valid 10-digit mobile number and email."
    );
    return;
  }

  setPaymentBusy(true);

  // Safely parse JSON, including HTML error responses.
  async function readApiResponse(response: Response) {
    const raw = await response.text();

    try {
      return JSON.parse(raw);
    } catch {
      console.error("Non-JSON API response:", {
        url: response.url,
        status: response.status,
        response: raw.slice(0, 1000),
      });

      throw new Error(
        `Server returned an invalid response (${response.status}). Please contact Khatu Rides.`
      );
    }
  }

  try {
    // Load Razorpay checkout.
    if (!(window as any).Razorpay) {
      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(
          'script[data-khatu-razorpay]'
        ) as HTMLScriptElement | null;

        if (existing) {
          existing.addEventListener("load", () => resolve(), {
            once: true,
          });
          existing.addEventListener(
            "error",
            () => reject(new Error("Razorpay checkout could not load.")),
            { once: true }
          );
          return;
        }

        const script = document.createElement("script");
        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";
        script.dataset.khatuRazorpay = "true";
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Razorpay checkout could not load."));

        document.body.appendChild(script);
      });
    }

    const booking = {
      ...resultData,
      vehicleType: bookingOption.vehicleType,
      vehicleLabel:
        bookingOption.vehicle?.label || bookingOption.vehicleType,
      totalFare: Number(bookingOption.finalFare),
      passenger: { name, mobile, email },
    };

    // Create server-side order.
    const orderResponse = await fetch(
      "/api/online-bookings/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking }),
      }
    );

    const order = await readApiResponse(orderResponse);

    if (!orderResponse.ok || !order.success ||
        !order.orderId || !order.keyId || !order.bookingId) {
      throw new Error(
        order.error || "Unable to create payment order."
      );
    }

    // Open Razorpay checkout.
    const checkout = new (window as any).Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "Khatu Rides Travels Co.",
      description:
        `${booking.vehicleLabel} · ${booking.pickup} to ${booking.drop}`,
      prefill: { name, contact: mobile, email },
      theme: { color: "#b91c1c" },

      modal: {
        ondismiss: () => setPaymentBusy(false),
      },

      handler: async (payment: any) => {
        try {
          // Verify payment on our server.
          const verifyResponse = await fetch(
            "/api/online-bookings/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: order.bookingId,
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature,
              }),
            }
          );

          const verified = await readApiResponse(verifyResponse);

          if (!verifyResponse.ok || !verified.success) {
            throw new Error(
              verified.error ||
              "Payment verification failed. Please contact support with your payment ID."
            );
          }

          // Redirect only after server-side confirmation.
          window.location.assign(
            `/booking/success?id=${encodeURIComponent(
              verified.bookingId || order.bookingId
            )}`
          );
        } catch (err: any) {
          console.error("Payment verification error:", err);

          setPaymentError(
            `${err?.message || "Payment verification failed."} Payment ID: ${payment.razorpay_payment_id}`
          );

          setPaymentBusy(false);
        }
      },
    });

    checkout.on("payment.failed", (failure: any) => {
      setPaymentError(
        failure?.error?.description || "Payment failed. Please retry."
      );
      setPaymentBusy(false);
    });

    checkout.open();
  } catch (err: any) {
    console.error("Payment initiation error:", err);

    setPaymentError(
      err?.message || "Unable to initiate payment."
    );

    setPaymentBusy(false);
  }
}


  if (bookingOption) {
    const total = Number(bookingOption.finalFare || 0);
    return (
      <main className="min-h-screen bg-slate-50 px-3 py-6 text-slate-900 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-5">
          <button type="button" onClick={() => { setBookingOption(null); setPaymentError(""); }}
            className="inline-flex items-center gap-2 font-bold text-blue-800">
            <ArrowLeft size={17} /> Back to cab options
          </button>
          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
            <p className="text-xs font-extrabold uppercase tracking-widest text-red-700">Khatu Rides · Online Booking</p>
            <h1 className="mt-2 text-2xl font-black">Confirm Your Cab Booking</h1>
            <div className="mt-5 grid gap-3 rounded-2xl bg-blue-50 p-4 text-sm sm:grid-cols-2">
              <div><span className="text-slate-500">Pickup</span><p className="font-bold">{resultData.pickup}</p></div>
              <div><span className="text-slate-500">Drop</span><p className="font-bold">{resultData.drop}</p></div>
              <div><span className="text-slate-500">Journey Date & Time</span><p className="font-bold">{formatBookingDate(pickupDate)} · {pickupTime}</p></div>
              <div><span className="text-slate-500">Booking Date</span><p className="font-bold">{new Date().toLocaleDateString("en-IN")}</p></div>
              <div><span className="text-slate-500">Trip Type</span><p className="font-bold">{tab === "oneway" ? "One Way" : tab === "roundtrip" ? "Round Trip" : "Local Rental"}</p></div>
              <div><span className="text-slate-500">Selected Cab</span><p className="font-bold">{bookingOption.vehicle?.label}</p></div>
              {tab === "roundtrip" && <div><span className="text-slate-500">Return Date & Time</span><p className="font-bold">{formatBookingDate(returnDate)} · {returnTime}</p></div>}
              <div><span className="text-slate-500">Total Fare</span><p className="text-xl font-black text-red-700">{money(total)}</p></div>
            </div>
            <h2 className="mt-7 text-lg font-extrabold">Fill Your Details</h2>
            <form onSubmit={(e) => { e.preventDefault(); void startRazorpayPayment(); }} className="mt-4 space-y-4">
              <label className="block text-sm font-semibold">Passenger Full Name *
                <input required minLength={2} autoComplete="name" value={passenger.name}
                  onChange={(e) => setPassenger((v) => ({...v, name:e.target.value}))}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" placeholder="Enter full name" />
              </label>
              <label className="block text-sm font-semibold">Mobile Number *
                <input required inputMode="numeric" type="tel" maxLength={10} pattern="[6-9][0-9]{9}" autoComplete="tel-national" value={passenger.mobile}
                  onChange={(e) => setPassenger((v) => ({...v, mobile:e.target.value.replace(/\D/g, "").slice(0,10)}))}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" placeholder="10-digit mobile number" />
              </label>
              <label className="block text-sm font-semibold">Email Address *
                <input required type="email" autoComplete="email" value={passenger.email}
                  onChange={(e) => setPassenger((v) => ({...v, email:e.target.value}))}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" placeholder="name@example.com" />
              </label>
              {paymentError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{paymentError}</p>}
              <p className="text-xs text-slate-500">Pay 25% advance of your total fare and rest amount paid to driver.</p>
              <button type="submit" disabled={paymentBusy} className="w-full rounded-xl bg-red-700 px-5 py-4 text-base font-extrabold text-white hover:bg-red-800 disabled:opacity-60">
                {paymentBusy ? "Processing..." : "Continue to Secure Payment"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (showResults) {
    const mapSrc = makeMapUrl();

    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setShowResults(false);
                setShowRouteMap(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-blue-200 bg-white px-4 py-2.5 text-sm font-bold hover:bg-blue-50"
            >
              <ArrowLeft size={17} /> Edit Search
            </button>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-red-700 sm:text-xs">
              Khatu Rides · Fare Results
            </p>
          </div>

          {/* Trip summary is deliberately the first section on the result screen. */}
          <section className="rounded-3xl border-2 border-blue-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-extrabold text-red-700 sm:text-xs">
                    {tab === "oneway"
                      ? "ONE WAY"
                      : tab === "roundtrip"
                        ? "ROUND TRIP"
                        : "LOCAL RENTAL"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {pickupDate} · {pickupTime}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full border-[3px] border-green-600 bg-white" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold tracking-wider text-slate-400">PICKUP</p>
                      <p className="break-words text-sm font-extrabold sm:text-base">
                        {pickup?.description}
                      </p>
                    </div>
                  </div>
                  <div className="hidden text-slate-300 sm:block">⟶</div>
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-red-600" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold tracking-wider text-slate-400">
                        {tab === "local" ? "PACKAGE" : "DROP"}
                      </p>
                      <p className="break-words text-sm font-extrabold sm:text-base">
                        {tab === "local"
                          ? localPackages.find((x) => x.id === localPackage)?.label
                          : drop?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {tab === "roundtrip" && (
                  <p className="mt-3 text-xs text-slate-500">
                    Return: {returnDate} · {returnTime}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                {tab !== "local" && (
                  <>
                    <div className="min-w-[112px] rounded-2xl bg-blue-50 px-3 py-3">
                      <p className="text-[10px] font-bold text-blue-700">TOTAL DISTANCE</p>
                      <p className="text-lg font-black sm:text-xl">{route?.distanceKm} KM</p>
                    </div>
                    <div className="min-w-[112px] rounded-2xl bg-blue-50 px-3 py-3">
                      <p className="text-[10px] font-bold text-blue-700">TRAVEL TIME</p>
                      <p className="text-lg font-black sm:text-xl">
                        {formatDuration(route?.durationMinutes || 0)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRouteMap((v) => !v)}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-800"
                    >
                      <Navigation size={17} />
                      {showRouteMap ? "Hide Route" : "View Route"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {showRouteMap && (
              <div className="mt-5 overflow-hidden rounded-2xl border-2 border-blue-200">
                <div className="flex items-center justify-between bg-blue-50 px-4 py-3">
                  <p className="text-sm font-bold text-blue-950">Your route on Google Maps</p>
                  <button
                    type="button"
                    onClick={() => setShowRouteMap(false)}
                    aria-label="Close map"
                    className="rounded-lg p-1 text-blue-900 hover:bg-blue-100"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="h-[280px] sm:h-[420px]">
                  <iframe
                    title="Google Maps route"
                    src={mapSrc}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="border-t border-blue-100 bg-white px-4 py-2 text-xs text-slate-500">
                  Google Maps route preview · Directions may open in Google Maps for navigation.
                </div>
              </div>
            )}
          </section>

          <div className="mb-4 mt-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-red-700">
                Choose your vehicle
              </p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">Available cab options</h1>
              <p className="mt-1 text-sm text-slate-500">
                Transparent customer fare · No hidden discounts
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowResults(false)}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800"
            >
              <Pencil size={15} /> Change trip details
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {fareOptions.map((option) => {
              const fare = Number(option.finalFare || 0);
              const advance = Math.round(fare * 0.25);
              const remaining = fare - advance;

              return (
                <article
                  key={option.vehicleType}
                  className="overflow-hidden rounded-3xl border-2 border-blue-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-40 items-center justify-center bg-gradient-to-b from-blue-50 to-white p-5 sm:h-44">
                    {option.vehicle?.image ? (
                      <img
                        src={option.vehicle.image}
                        alt={option.vehicle.label}
                        className="h-full max-w-full object-contain"
                      />
                    ) : (
                      <CarFront className="h-16 w-16 text-slate-300" />
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      {option.vehicleType}
                    </p>
                    <h2 className="mt-1 text-lg font-extrabold sm:text-xl">
                      {option.vehicle.label}
                    </h2>

                    <div className="mt-4 rounded-2xl bg-red-700 p-4 text-white">
                      <p className="text-xs font-semibold text-red-100">TOTAL TRIP FARE</p>
                      <p className="mt-1 text-3xl font-black">{money(fare)}</p>
                    </div>

                    <div className="mt-4 space-y-3 rounded-2xl bg-blue-50 p-4 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-600">Standard advance (25%)</span>
                        <strong>{money(advance)}</strong>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-600">Standard balance (75%)</span>
                        <strong>{money(remaining)}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setBookingOption(option); setPaymentError(""); }}
                      className="mt-5 w-full rounded-xl bg-red-700 px-4 py-3.5 font-bold text-white hover:bg-red-800"
                    >
                      Book Your Cab
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Complete your passenger details before secure Razorpay payment. Booking is confirmed only after server-side payment verification.
            Toll, parking, permit and other route-specific charges follow the applicable fare rules.
          </p>
        </div>
      </main>
    );
  }

  const suggestionsFor = (field: "pickup" | "drop") =>
    activeField === field ? suggestions : [];

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-3 text-slate-900 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Compact title keeps the complete mobile calculator visible above the fold. */}
        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-5">
          <div className="min-w-0">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-red-700 sm:text-xs sm:tracking-[0.22em]">
              Khatu Rides Travels Co.
            </p>
            <h1 className="mt-0.5 text-xl font-black tracking-tight sm:mt-1 sm:text-3xl">
              Book your cab
            </h1>
            <p className="hidden text-sm text-slate-500 sm:mt-1 sm:block">
              Choose your trip details and check the fare instantly.
            </p>
          </div>
          <div className="hidden items-center gap-4 rounded-2xl border-2 border-blue-100 bg-white px-4 py-3 text-xs font-semibold text-slate-600 shadow-sm lg:flex">
            <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-green-600" /> Transparent fare</span>
            <span className="flex items-center gap-2"><CarFront size={17} className="text-blue-700" /> Multiple vehicles</span>
            <span className="flex items-center gap-2"><Phone size={16} className="text-blue-700" /> 24×7 support</span>
          </div>
        </div>

        <section className="rounded-[22px] border-2 border-blue-200 bg-white p-3 shadow-lg shadow-blue-100/60 sm:rounded-[28px] sm:p-6 lg:p-7">
          {/* Trip type */}
          <div className="mb-3 grid grid-cols-3 gap-1.5 rounded-xl border border-blue-100 bg-blue-50 p-1 sm:mb-5 sm:gap-2 sm:rounded-2xl sm:p-1.5">
            {([
              ["oneway", "One Way"],
              ["roundtrip", "Round Trip"],
              ["local", "Local Rental"],
            ] as [MainTab, string][]).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTab(id);
                  setError("");
                  setSuggestions([]);
                  setActiveField(null);
                }}
                className={`min-h-10 rounded-lg px-1.5 py-2 text-[11px] font-extrabold transition sm:min-h-12 sm:rounded-xl sm:px-3 sm:text-sm ${
                  tab === id
                    ? "bg-blue-700 text-white shadow-md"
                    : "text-blue-950 hover:bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* First row: wider pickup/drop fields; on mobile they share the row without shrinking input height. */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-[minmax(280px,1.45fr)_52px_minmax(280px,1.45fr)_minmax(170px,0.8fr)_minmax(150px,0.72fr)] lg:items-end lg:gap-3">
            <div className="relative min-w-0">
              <label className={fieldLabelClass()}>PICKUP LOCATION</label>
              <div className={inputShellClass()}>
                <MapPin className="h-5 w-5 shrink-0 text-green-600 sm:h-6 sm:w-6" />
                <input
                  value={pickupText}
                  onChange={(e) => updateLocationText("pickup", e.target.value)}
                  onFocus={() => setActiveField("pickup")}
                  placeholder="Enter pickup city"
                  className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-slate-400 sm:text-base"
                  aria-label="Pickup location"
                />
                {pickupText && (
                  <button
                    type="button"
                    onClick={() => { setPickup(null); setPickupText(""); }}
                    aria-label="Clear pickup"
                    className="shrink-0 text-slate-400 hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {suggestionsFor("pickup").length > 0 && (
                <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-56 overflow-auto rounded-xl border-2 border-blue-200 bg-white p-1.5 shadow-2xl sm:mt-2 sm:rounded-2xl sm:p-2">
                  {suggestionsFor("pickup").map((item) => (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => chooseSuggestion(item)}
                      className="flex w-full gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs hover:bg-blue-50 sm:gap-3 sm:px-3 sm:py-3 sm:text-sm"
                    >
                      <MapPin size={16} className="mt-0.5 shrink-0 text-green-600" />
                      <span>{item.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={swapLocations}
              disabled={tab === "local"}
              aria-label="Swap pickup and drop"
              className="hidden min-h-[54px] items-center justify-center self-end rounded-full border-2 border-blue-200 bg-white text-blue-700 shadow-sm hover:bg-blue-50 disabled:opacity-30 lg:flex"
            >
              <ArrowLeftRight size={20} />
            </button>

            <div className={`relative min-w-0 ${tab === "local" ? "opacity-45" : ""}`}>
              <label className={fieldLabelClass()}>DROP LOCATION</label>
              <div className={inputShellClass()}>
                <Navigation className="h-5 w-5 shrink-0 text-red-600 sm:h-6 sm:w-6" />
                <input
                  value={dropText}
                  disabled={tab === "local"}
                  onChange={(e) => updateLocationText("drop", e.target.value)}
                  onFocus={() => setActiveField("drop")}
                  placeholder="Enter destination"
                  className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-slate-400 disabled:cursor-not-allowed sm:text-base"
                  aria-label="Drop location"
                />
                {dropText && (
                  <button
                    type="button"
                    onClick={() => { setDrop(null); setDropText(""); }}
                    aria-label="Clear drop"
                    className="shrink-0 text-slate-400 hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {suggestionsFor("drop").length > 0 && (
                <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-56 overflow-auto rounded-xl border-2 border-blue-200 bg-white p-1.5 shadow-2xl sm:mt-2 sm:rounded-2xl sm:p-2">
                  {suggestionsFor("drop").map((item) => (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => chooseSuggestion(item)}
                      className="flex w-full gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs hover:bg-blue-50 sm:gap-3 sm:px-3 sm:py-3 sm:text-sm"
                    >
                      <MapPin size={16} className="mt-0.5 shrink-0 text-red-600" />
                      <span>{item.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <label className={fieldLabelClass()}>PICKUP DATE</label>
              <div className={inputShellClass()}>
                <CalendarDays className="hidden h-5 w-5 shrink-0 text-blue-700 sm:block" />
                <input
                  type="date"
                  min={today()}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full min-w-0 bg-transparent text-[12px] font-semibold outline-none sm:text-sm"
                  aria-label="Pickup date"
                />
              </div>
            </div>

            {tab === "local" ? (
              <div className="min-w-0">
                <label className={fieldLabelClass()}>PACKAGE</label>
                <div className={inputShellClass()}>
                  <CarFront className="hidden h-5 w-5 shrink-0 text-blue-700 sm:block" />
                  <select
                    value={localPackage}
                    onChange={(e) => setLocalPackage(e.target.value as LocalPackageType)}
                    className="w-full min-w-0 bg-transparent text-xs font-bold outline-none sm:text-sm"
                    aria-label="Local rental package"
                  >
                    {localPackages.map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="min-w-0">
                <label className={fieldLabelClass()}>
                  {tab === "roundtrip" ? "RETURN DATE" : "PICKUP TIME"}
                </label>
                <div className={inputShellClass()}>
                  {tab === "roundtrip" ? (
                    <>
                      <CalendarDays className="hidden h-5 w-5 shrink-0 text-blue-700 sm:block" />
                      <input
                        type="date"
                        min={pickupDate}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full min-w-0 bg-transparent text-[12px] font-semibold outline-none sm:text-sm"
                        aria-label="Return date"
                      />
                    </>
                  ) : (
                    <>
                      <Clock3 className="hidden h-5 w-5 shrink-0 text-blue-700 sm:block" />
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none"
                        aria-label="Pickup time"
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Second row: return time when round-trip, plus a prominent centered Check Fare action. */}
          <div className="mt-3 flex flex-col items-center gap-2.5 border-t border-blue-100 pt-3 sm:mt-5 sm:gap-3 sm:pt-5">
            {tab === "roundtrip" && (
              <div className="grid w-full grid-cols-2 gap-2 sm:max-w-md sm:gap-3">
                <div>
                  <label className={fieldLabelClass()}>RETURN TIME</label>
                  <div className={inputShellClass()}>
                    <Clock3 className="hidden h-5 w-5 shrink-0 text-blue-700 sm:block" />
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none"
                      aria-label="Return time"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <p className="pb-2 text-[10px] leading-4 text-slate-500 sm:text-xs">
                    Return time is used to plan your round trip.
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={calculate}
              disabled={loading || searching}
              className="flex min-h-[54px] w-full max-w-[320px] items-center justify-center gap-2.5 rounded-2xl border-2 border-blue-700 bg-blue-700 px-8 py-3 text-base font-black text-white shadow-lg shadow-blue-200 transition hover:border-blue-800 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[62px] sm:max-w-[360px] sm:text-lg"
            >
              {loading ? (
                <LoaderCircle className="animate-spin" size={21} />
              ) : (
                <Search size={21} />
              )}
              {loading ? "Calculating Fare..." : "Check Fare"}
            </button>

            <div className="flex w-full flex-wrap items-center justify-between gap-1 text-[10px] text-slate-500 sm:text-xs">
              <span>{searching ? "Searching locations…" : "Secure booking · Transparent pricing"}</span>
              <span>24×7 Booking Support · 9244137353</span>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-semibold text-red-700 sm:text-sm">
              {error}
            </p>
          )}
        </section>

        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400 sm:mt-4 sm:text-xs">
          <ShieldCheck size={14} className="text-green-600" />
          Transparent pricing · Multiple vehicle options · 24×7 support
        </div>
      </div>
    </main>
  );
}

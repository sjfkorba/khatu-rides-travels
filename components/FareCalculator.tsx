// components/FareCalculator.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
  ChevronDown,
  ChevronUp,
  Zap,
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
type FestivalRecord = { id: string; name: string; increasePercent: number; startAt: string; endAt: string; isActive: boolean };
type CouponRecord = { id: string; code: string; from: string; to: string; fromNormalized?: string; toNormalized?: string; discountPercent: number; startAt: string; endAt: string; isActive: boolean };

const normalizePlace = (value: string) => value.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
const roundFare = (value: number) => Math.max(0, Math.round(value / 100) * 100);
const inValidity = (start: string, end: string, date: string) => {
  const journey = new Date(`${date}T12:00:00`).getTime();
  return Number.isFinite(journey) && journey >= new Date(start).getTime() && journey <= new Date(end).getTime();
};

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
  const [expandedConditions, setExpandedConditions] = useState<Record<string, boolean>>({});
  const [festivalRule, setFestivalRule] = useState<FestivalRecord | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<CouponRecord[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponRecord | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
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

      // Load current promotion records from Firestore for this journey date.
      // Final promotion validation must also happen inside the trusted order API.
      const [festivalSnapshot, couponSnapshot] = await Promise.all([
        getDocs(collection(db, "festival_fares")),
        getDocs(collection(db, "route_coupons")),
      ]);
      const festivals = festivalSnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FestivalRecord));
      const coupons = couponSnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CouponRecord));
      const activeFestival = festivals
        .filter((x) => x.isActive && Number(x.increasePercent) > 0 && inValidity(x.startAt, x.endAt, pickupDate))
        .sort((a, b) => Number(b.increasePercent) - Number(a.increasePercent))[0] || null;
      setFestivalRule(activeFestival);
      setAvailableCoupons(coupons.filter((x) => {
        const from = normalizePlace(pickup?.description || "");
        const to = normalizePlace(drop?.description || "");
        const couponFrom = normalizePlace(x.fromNormalized || x.from);
        const couponTo = normalizePlace(x.toNormalized || x.to);
        return x.isActive && Number(x.discountPercent) > 0 && inValidity(x.startAt, x.endAt, pickupDate) &&
          tab !== "local" && from.includes(couponFrom) && to.includes(couponTo);
      }));
      setAppliedCoupon(null);
      setCouponMessage("");

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

          const baseFare = Number(result.finalFare || 0);
          const festivalAmount = activeFestival ? baseFare * Number(activeFestival.increasePercent) / 100 : 0;
          const festivalAdjustedFare = roundFare(baseFare + festivalAmount);
          return {
            vehicleType,
            vehicle: VEHICLES[vehicleType],
            ...result,
            baseFare,
            festivalPercent: activeFestival ? Number(activeFestival.increasePercent) : 0,
            festivalAmount: festivalAdjustedFare - baseFare,
            festivalAdjustedFare,
            couponCode: "",
            couponPercent: 0,
            couponAmount: 0,
            finalFare: festivalAdjustedFare,
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
        festivalRule: activeFestival,
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

  function applyRouteCoupon(found: CouponRecord) {
    setCouponMessage("");
    if (tab === "local" || !pickup || !drop) { setCouponMessage("Coupon sirf matching pickup-drop route par apply hoga."); return; }
    if (!found.isActive || !inValidity(found.startAt, found.endAt, pickupDate)) {
      setAppliedCoupon(null);
      setCouponMessage("Yeh coupon ab active ya valid nahi hai.");
      return;
    }
    const from = normalizePlace(pickup.description);
    const to = normalizePlace(drop.description);
    const couponFrom = normalizePlace(found.fromNormalized || found.from);
    const couponTo = normalizePlace(found.toNormalized || found.to);
    if (!from.includes(couponFrom) || !to.includes(couponTo)) {
      setAppliedCoupon(null);
      setCouponMessage(`Yeh coupon sirf ${found.from} se ${found.to} route ke liye hai.`);
      return;
    }
    setAppliedCoupon(found);
    setCouponMessage(`${found.discountPercent}% discount coupon successfully applied.`);
    setFareOptions((current) => current.map((option) => {
      const beforeDiscount = Number(option.festivalAdjustedFare ?? option.finalFare ?? 0);
      const discounted = roundFare(beforeDiscount * (1 - Number(found.discountPercent) / 100));
      return { ...option, couponCode: found.code, couponPercent: Number(found.discountPercent), couponAmount: beforeDiscount - discounted, finalFare: discounted };
    }));
  }

  function removeRouteCoupon() {
    setAppliedCoupon(null);
    setCouponMessage("Coupon remove kar diya gaya.");
    setFareOptions((current) => current.map((option) => ({
      ...option,
      couponCode: "", couponPercent: 0, couponAmount: 0,
      finalFare: Number(option.festivalAdjustedFare ?? option.baseFare ?? option.finalFare ?? 0),
    })));
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
    festivalRule,
    appliedCoupon: appliedCoupon ? { code: appliedCoupon.code, discountPercent: appliedCoupon.discountPercent } : null,
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
    if (name.length < 2 || !/^[6-9]\d{9}$/.test(mobile) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setPaymentError("Please enter your name, valid 10-digit mobile number and email.");
      return;
    }
    setPaymentBusy(true);
    try {
      if (!(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector('script[data-khatu-razorpay]') as HTMLScriptElement | null;
          if (existing && (window as any).Razorpay) return resolve();
          const script = existing || document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.dataset.khatuRazorpay = "true";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Razorpay checkout could not load."));
          if (!existing) document.body.appendChild(script);
        });
      }
      const booking = {
        ...resultData,
        vehicleType: bookingOption.vehicleType,
        vehicleLabel: bookingOption.vehicle?.label || bookingOption.vehicleType,
        totalFare: Number(bookingOption.finalFare),
        fareBreakdown: {
          baseFare: bookingOption.baseFare,
          festivalPercent: bookingOption.festivalPercent,
          festivalAmount: bookingOption.festivalAmount,
          festivalAdjustedFare: bookingOption.festivalAdjustedFare,
          couponCode: bookingOption.couponCode || "",
          couponPercent: bookingOption.couponPercent || 0,
          couponAmount: bookingOption.couponAmount || 0,
          finalFare: bookingOption.finalFare,
        },
        passenger: { name, mobile, email },
      };
      const orderResponse = await fetch("/api/online-bookings/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok || !order.orderId || !order.keyId) {
        throw new Error(order.error || "Unable to create payment order.");
      }
      const checkout = new (window as any).Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: "INR",
        name: "Khatu Rides Travels Co.",
        description: `${booking.vehicleLabel} · ${booking.pickup} to ${booking.drop}`,
        prefill: { name, contact: mobile, email },
        theme: { color: "#b91c1c" },
        modal: { ondismiss: () => setPaymentBusy(false) },
        handler: async (payment: any) => {
          try {
            const verifyResponse = await fetch("/api/online-bookings/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: order.bookingId,
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature,
              }),
            });
            const verified = await verifyResponse.json();
            if (!verifyResponse.ok || !verified.success) {
              throw new Error(verified.error || "Payment verification failed.");
            }
            window.location.assign(`/booking/success?id=${encodeURIComponent(order.bookingId)}`);
          } catch (err: any) {
            setPaymentError(err?.message || "Payment verification failed. Please contact support with your payment ID.");
            setPaymentBusy(false);
          }
        },
      });
      checkout.on("payment.failed", (failure: any) => {
        setPaymentError(failure?.error?.description || "Payment failed. Please retry.");
        setPaymentBusy(false);
      });
      checkout.open();
    } catch (err: any) {
      setPaymentError(err?.message || "Unable to initiate payment.");
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
              <p className="text-xs text-slate-500">The secure payment amount is determined by the server. Demo mode: ₹1; production: 25% advance.</p>
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
                Transparent customer fare · Clear trip conditions
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

          {/* Mobile-first fare comparison: all vehicle fares stay visible without scrolling. */}
          <section className="mb-4 space-y-2.5 lg:hidden" aria-label="Quick vehicle fare comparison">
            {fareOptions.map((option) => {
              const fare = Number(option.finalFare || 0);
              const advance = Math.round(fare * 0.25);
              const remaining = fare - advance;
              const isExpanded = Boolean(expandedConditions[option.vehicleType]);
              const localConfig = tab === "local"
                ? LOCAL_PACKAGES[option.vehicleType as VehicleType][localPackage]
                : null;
              const conditions = tab === "oneway"
                ? [
                    ["Toll Charges", "Included"],
                    ["Driver Fooding", "Included"],
                    ["Parking Charges", "Extra — customer payable"],
                    ["Night Halt", "If applicable, confirm before booking"],
                    ["Distance", `${Number(route?.distanceKm || 0)} KM (one side)`],
                  ]
                : tab === "roundtrip"
                  ? [
                      ["Toll Charges", "Included"],
                      ["Driver Fooding", "Extra — customer payable"],
                      ["Parking Charges", "Extra — customer payable"],
                      ["Night Halt", "Extra if applicable; confirm before booking"],
                      ["Distance", `${Number(route?.distanceKm || 0)} KM one-side route distance`],
                    ]
                  : [
                      ["Toll Charges", "Extra — customer payable"],
                      ["Driver Fooding", "Extra — customer payable"],
                      ["Parking Charges", "Extra — customer payable"],
                      ["Package Limit", `${localConfig?.hours} Hours / ${localConfig?.kms} KM`],
                      ["Extra KM", `${money(Number(localConfig?.b2cExtraKmRate || 0))} / KM`],
                      ["Extra Hour", `${money(Number(localConfig?.b2cExtraHourRate || 0))} / Hour`],
                      ["Night Halt", "Not included; confirm if required"],
                    ];

              return (
                <article key={`mobile-${option.vehicleType}`} className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
                  <div className="flex min-h-[76px] items-center gap-3 px-3 py-2.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      {option.vehicle?.image ? (
                        <img src={option.vehicle.image} alt="" className="h-10 w-10 object-contain" />
                      ) : <CarFront size={25} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">{option.vehicleType}</p>
                      <h2 className="truncate text-sm font-extrabold text-slate-900">{option.vehicle?.label || option.vehicleType}</h2>
                      {option.couponPercent > 0 && <p className="text-[10px] font-bold text-green-700">{option.couponCode} · {option.couponPercent}% OFF</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Final Fare</p>
                      <p className="text-xl font-black leading-tight text-red-700">{money(fare)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setExpandedConditions((current) => ({ ...current, [option.vehicleType]: !current[option.vehicleType] }))}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setBookingOption(option); setPaymentError(""); }}
                      className="rounded-lg bg-red-700 px-4 py-2 text-xs font-extrabold text-white"
                    >
                      Book Cab
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="space-y-3 border-t border-blue-100 bg-blue-50/60 p-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs">
                        <p className="mb-2 font-extrabold text-slate-900">Fare Breakdown</p>
                        <div className="flex justify-between gap-3"><span className="text-slate-600">Base Fare</span><strong>{money(Number(option.baseFare ?? fare))}</strong></div>
                        {option.festivalPercent > 0 && <div className="mt-1 flex justify-between gap-3 text-amber-700"><span>{festivalRule?.name || "Festival Increase"} (+{option.festivalPercent}%)</span><strong>+{money(Number(option.festivalAmount || 0))}</strong></div>}
                        {option.couponPercent > 0 && <div className="mt-1 flex justify-between gap-3 text-green-700"><span>Coupon Discount ({option.couponPercent}%)</span><strong>−{money(Number(option.couponAmount || 0))}</strong></div>}
                        <div className="mt-2 flex justify-between gap-3 border-t pt-2 font-black"><span>Final Payable</span><strong>{money(fare)}</strong></div>
                        <div className="mt-2 flex justify-between gap-3 text-slate-600"><span>Advance (25%)</span><strong>{money(advance)}</strong></div>
                        <div className="flex justify-between gap-3 text-slate-600"><span>Balance (75%)</span><strong>{money(remaining)}</strong></div>
                      </div>
                      <div className="rounded-xl border border-blue-200 bg-white p-3 text-xs">
                        <p className="mb-2 font-extrabold text-slate-900">Trip Inclusions & Conditions</p>
                        <div className="space-y-2">
                          {conditions.map(([label, value]) => <div key={label} className="flex items-start justify-between gap-3"><span className="text-slate-600">{label}</span><strong className="max-w-[60%] text-right text-slate-900">{value}</strong></div>)}
                        </div>
                        <p className="mt-3 border-t border-slate-100 pt-2 leading-5 text-[10px] text-slate-500">Any additional applicable charge will be communicated before booking confirmation.</p>
                      </div>
                      <button type="button" onClick={() => { setBookingOption(option); setPaymentError(""); }} className="w-full rounded-xl bg-red-700 px-4 py-3 text-sm font-extrabold text-white">Book Your Cab</button>
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          {availableCoupons.length > 0 && tab !== "local" && (
            <section className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-black text-green-950">Exclusive Route Discount</h2>
                  <p className="text-xs text-green-800">Aapke selected route ke liye live coupon automatically mil gaya hai.</p>
                </div>
                {appliedCoupon && <span className="rounded-full bg-green-700 px-3 py-1 text-xs font-bold text-white">{appliedCoupon.discountPercent}% Applied</span>}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableCoupons.map((coupon) => {
                  const isApplied = appliedCoupon?.id === coupon.id;
                  return (
                    <div key={coupon.id} className="rounded-xl border border-green-200 bg-white p-3 sm:p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-700">Route coupon</span>
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-800">{coupon.discountPercent}% OFF</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xl font-black tracking-[0.18em] text-slate-900">{coupon.code}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-600">{coupon.from} → {coupon.to}</p>
                        </div>
                        {isApplied ? (
                          <button type="button" onClick={removeRouteCoupon} className="rounded-lg border border-green-700 px-4 py-2.5 text-sm font-bold text-green-800">Remove</button>
                        ) : (
                          <button type="button" onClick={() => applyRouteCoupon(coupon)} disabled={!!appliedCoupon} className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50">Apply Coupon</button>
                        )}
                      </div>
                      <p className="mt-2 text-[10px] text-slate-500">Valid till {formatBookingDate(coupon.endAt.slice(0, 10))}</p>
                    </div>
                  );
                })}
              </div>
              {couponMessage && <p className="mt-2 text-xs font-semibold text-green-900">{couponMessage}</p>}
            </section>
          )}
          {festivalRule && <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><strong>{festivalRule.name}:</strong> {festivalRule.increasePercent}% festival fare increase automatically applied for this journey date.</div>}

          <div className="hidden grid-cols-1 gap-4 sm:gap-5 lg:grid lg:grid-cols-3">
            {fareOptions.map((option) => {
              const fare = Number(option.finalFare || 0);
              const advance = Math.round(fare * 0.25);
              const remaining = fare - advance;

             
return (
  <article
    key={option.vehicleType}
    className="group overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_35px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
  >
    {/* VEHICLE IMAGE */}
    <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 sm:h-60">
      <div className="absolute right-4 top-4 rounded-full border border-white bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 shadow-sm">
        Premium Fleet
      </div>

      {option.vehicle?.image ? (
        <img
          src={option.vehicle.image}
          alt={option.vehicle.label}
          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <CarFront className="h-20 w-20 text-slate-300" />
      )}

      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />
    </div>

    <div className="p-5 sm:p-6">

      {/* VEHICLE DETAILS */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-700">
            {option.vehicleType}
          </p>
          <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-green-700">
            Available for Booking
          </span>
        </div>

        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          {option.vehicle.label}
        </h2>
      </div>

      {/* FINAL FARE */}
      <div className="relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-red-700 via-red-700 to-rose-800 p-5 text-white shadow-lg shadow-red-900/15">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[18px] border-white/5" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold tracking-[0.18em] text-red-100">
              YOUR FINAL TRAVEL FARE
            </p>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold text-white">
              ALL INCLUSIVE*
            </span>
          </div>

          {option.festivalPercent > 0 && (
            <p className="mt-2 text-sm text-red-200 line-through">
              Base Fare: {money(option.baseFare)}
            </p>
          )}

          <div className="mt-1 flex items-end justify-between gap-2">
            <p className="text-3xl font-black tracking-tight sm:text-4xl">
              {money(fare)}
            </p>
            <span className="pb-1 text-[10px] font-medium text-red-100">
              Final Payable
            </span>
          </div>

          {option.couponPercent > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-xs font-bold text-white">
              <span>✓</span>
              <span>
                {option.couponCode} Applied · {option.couponPercent}% OFF
              </span>
            </div>
          )}
        </div>
      </div>

      {/* FARE BREAKDOWN */}
      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <p className="mb-3 text-sm font-extrabold text-slate-900">
          Fare Summary
        </p>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Base Fare</span>
            <strong className="text-slate-800">
              {money(Number(option.baseFare ?? fare))}
            </strong>
          </div>

          {option.festivalPercent > 0 && (
            <div className="flex justify-between gap-3 text-amber-700">
              <span>
                {festivalRule?.name || "Festival Fare Increase"} (+{option.festivalPercent}%)
              </span>
              <strong>
                +{money(Number(option.festivalAmount || 0))}
              </strong>
            </div>
          )}

          {option.couponPercent > 0 && (
            <div className="flex justify-between gap-3 text-green-700">
              <span>Coupon Discount ({option.couponPercent}%)</span>
              <strong>
                −{money(Number(option.couponAmount || 0))}
              </strong>
            </div>
          )}

          <div className="flex justify-between gap-3 border-t border-slate-200 pt-3 font-black">
            <span className="text-slate-900">Total Payable</span>
            <strong className="text-red-700">{money(fare)}</strong>
          </div>
        </div>
      </div>

      {/* TRIP CONDITIONS */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-white">
        <button
          type="button"
          onClick={() =>
            setExpandedConditions((current) => ({
              ...current,
              [option.vehicleType]: !current[option.vehicleType],
            }))
          }
          aria-expanded={Boolean(expandedConditions[option.vehicleType])}
          aria-controls={`trip-conditions-${option.vehicleType}`}
          className="flex min-h-14 w-full items-center justify-between gap-3 bg-blue-50/60 px-4 py-3 text-left transition hover:bg-blue-50"
        >
          <span className="text-sm font-extrabold text-slate-800">
            Trip Inclusions & Conditions
          </span>

          <span className="flex shrink-0 items-center gap-2 text-xs font-bold text-blue-700">
            {expandedConditions[option.vehicleType] ? "Hide" : "Details"}
            {expandedConditions[option.vehicleType] ? (
              <ChevronUp size={17} />
            ) : (
              <ChevronDown size={17} />
            )}
          </span>
        </button>

        {expandedConditions[option.vehicleType] && (
          <div
            id={`trip-conditions-${option.vehicleType}`}
            className="border-t border-blue-100 px-4 pb-4 pt-3"
          >
            <div className="space-y-3 text-xs">
              {(tab === "oneway"
                ? [
                    ["Toll Charges", "Included"],
                    ["Driver Fooding", "Included"],
                    ["Parking Charges", "Extra — customer payable"],
                    ["Night Halt", "If applicable, confirm before booking"],
                    ["Distance", `${Number(route?.distanceKm || 0)} KM (one side)`],
                    ["KM / Hours Limit", "Route-distance based; no fixed hourly package"],
                    ["Extra KM / Extra Hour", "Confirmed before booking"],
                  ]
                : tab === "roundtrip"
                ? [
                    ["Toll Charges", "Included"],
                    ["Driver Fooding", "Extra — customer payable"],
                    ["Parking Charges", "Extra — customer payable"],
                    ["Night Halt", "If applicable, separately payable"],
                    ["Distance", `${Number(route?.distanceKm || 0)} KM one-side route distance; return included`],
                    ["Daily KM / Hours Limit", "As per confirmed itinerary"],
                    ["Extra KM / Extra Hour", "Confirmed before booking"],
                  ]
                : [
                    ["Toll Charges", "Extra — customer payable"],
                    ["Driver Fooding", "Extra — customer payable"],
                    ["Parking Charges", "Extra — customer payable"],
                    [
                      "Package Limit",
                      `${LOCAL_PACKAGES[option.vehicleType as VehicleType][localPackage].hours} Hours / ${LOCAL_PACKAGES[option.vehicleType as VehicleType][localPackage].kms} KM`,
                    ],
                    [
                      "Extra KM",
                      `${money(LOCAL_PACKAGES[option.vehicleType as VehicleType][localPackage].b2cExtraKmRate)} / KM`,
                    ],
                    [
                      "Extra Hour",
                      `${money(LOCAL_PACKAGES[option.vehicleType as VehicleType][localPackage].b2cExtraHourRate)} / Hour`,
                    ],
                    ["Night Halt", "Not included; confirm if required"],
                  ]
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-3"
                >
                  <span className="text-slate-500">{label}</span>
                  <strong className="max-w-[60%] text-right text-slate-800">
                    {value}
                  </strong>
                </div>
              ))}
            </div>

            <p className="mt-4 border-t border-slate-100 pt-3 text-[10px] leading-5 text-slate-500">
              Any extra charge will be communicated before booking confirmation.
              Parking is payable separately in all trip types. Additional
              charges and night-halt rates must be confirmed for the specific
              itinerary.
            </p>
          </div>
        )}
      </div>

      {/* ADVANCE PAYMENT */}
      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Payment Details
        </p>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-slate-600">Advance (25%)</span>
            <strong className="text-slate-900">{money(advance)}</strong>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-600">Balance (75%)</span>
            <strong className="text-slate-900">{money(remaining)}</strong>
          </div>
        </div>
      </div>

      {/* BOOKING BUTTONS */}
      <div className="mt-5 space-y-3">

        {/* FAST BOOKING */}
        <button
          type="button"
          onClick={() => {
            setBookingOption(option);
            setPaymentError("");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-4 text-sm font-extrabold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-blue-700 active:scale-[0.98]"
        >
          <Zap size={19} />
          Quick Booking – Book Now
          <ChevronDown size={17} className="-rotate-90" />
        </button>

        

        <p className="text-center text-[10px] font-medium text-slate-400">
          Secure Booking · Instant Assistance · 24×7 Support
        </p>
      </div>
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

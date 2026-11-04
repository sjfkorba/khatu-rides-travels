// components/FareCalculator.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import FareSearchingScreen from "@/components/FareSearchingScreen";
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
import { chooseBestAutomaticPromotion, calculatePromotionDiscount, getPromotionEligibilityReason, type FarePromotion } from "@/lib/fare-promotions";

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
  return "flex min-h-[42px] w-full min-w-0 items-center gap-2 border-b border-slate-300 bg-white px-1.5 transition focus-within:border-orange-500 focus-within:ring-0 sm:min-h-[44px] sm:gap-2.5 sm:px-2 lg:min-h-[42px]";
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
  const [automaticCampaigns, setAutomaticCampaigns] = useState<FarePromotion[]>([]);
  const [appliedCampaign, setAppliedCampaign] = useState<FarePromotion | null>(null);
  const [campaignCouponCode, setCampaignCouponCode] = useState("");
  const [campaignBusy, setCampaignBusy] = useState(false);
  const [campaignMessage, setCampaignMessage] = useState("");
  const [couponEntryVehicle, setCouponEntryVehicle] = useState<string | null>(null);
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
      setAppliedCoupon(null); setCouponMessage(""); setAppliedCampaign(null); setCampaignMessage(""); setCampaignCouponCode("");
      const campaignQuery = new URLSearchParams({ bookingType: tab, pickupDate, pickupTime, pickup: pickup?.description || "", drop: drop?.description || "" });
      const campaignResponse = await fetch(`/api/fare-promotions?${campaignQuery.toString()}`, { cache: "no-store" });
      const campaignData = await campaignResponse.json();
      if (!campaignResponse.ok || campaignData.success !== true) throw new Error(campaignData.error || "Discount campaigns load nahi ho paye.");
      const autoCampaigns = Array.isArray(campaignData.campaigns) ? campaignData.campaigns as FarePromotion[] : [];
      setAutomaticCampaigns(autoCampaigns);

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

          // Fare engine finalFare already includes the eligible night surcharge.
          // Keep the pre-night base separate so every adjustment is visible to customers.
          const fareAfterNight = Number(result.finalFare || 0);
          const nightSurchargeAmount = Number(result.nightSurchargeAmount || 0);
          const baseFare = Math.max(0, fareAfterNight - nightSurchargeAmount);
          const festivalPercent = activeFestival ? Number(activeFestival.increasePercent) : 0;
          const festivalRawAmount = fareAfterNight * festivalPercent / 100;
          const festivalAdjustedFare = roundFare(fareAfterNight + festivalRawAmount);
          const bestCampaign = chooseBestAutomaticPromotion(autoCampaigns, { bookingType, pickupDate, pickupTime, pickup: pickup?.description || "", drop: drop?.description || "", fare: festivalAdjustedFare });
          const campaignDiscount = bestCampaign?.discountAmount || 0;
          const campaignFinalFare = bestCampaign ? Math.max(0, festivalAdjustedFare - campaignDiscount) : festivalAdjustedFare;
          return {
            vehicleType,
            vehicle: VEHICLES[vehicleType],
            ...result,
            baseFare,
            nightSurchargePercent: Number(result.nightSurchargePercent || 0),
            nightSurchargeAmount,
            fareAfterNight,
            festivalPercent,
            festivalAmount: festivalAdjustedFare - fareAfterNight,
            festivalAdjustedFare,
            couponCode: "",
            couponPercent: 0,
            couponAmount: 0,
            campaignId: bestCampaign?.campaign.id || "", campaignName: bestCampaign?.campaign.name || "",
            campaignDiscountType: bestCampaign?.campaign.discountType || "", campaignDiscountValue: bestCampaign?.campaign.discountValue || 0,
            campaignDiscountAmount: campaignDiscount, campaignPriority: bestCampaign?.campaign.priority || 0,
            campaignOfferMode: bestCampaign?.campaign.offerMode || "", finalFare: campaignFinalFare,
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
        appliedCampaign: options.find((x) => x.campaignId)?.campaignId || null,
      };

      setRoute(routeData);
      setFareOptions(options);
      const firstAppliedCampaignId = options.find((x) => x.campaignId)?.campaignId;
      setAppliedCampaign(firstAppliedCampaignId ? autoCampaigns.find((c) => c.id === firstAppliedCampaignId) || null : null);
      setShowRouteMap(false);
      setShowResults(true);
      onFareCalculated?.(resultPayload);
    } catch (e: any) {
      setError(e?.message || "Fare calculate करते समय समस्या हुई।");
    } finally {
      setLoading(false);
    }
  }

  function applyBestOfferForVehicle(vehicleType: VehicleType) {
    const option = fareOptions.find((item) => item.vehicleType === vehicleType);
    if (!option) return;

    // Route-specific coupons take priority when available and valid for this route.
    const routeCoupon = [...availableCoupons].sort(
      (a, b) => Number(b.discountPercent || 0) - Number(a.discountPercent || 0)
    )[0];

    if (routeCoupon && !appliedCoupon && !option.campaignDiscountAmount) {
      applyRouteCoupon(routeCoupon);
      return;
    }

    const before = Number(option.festivalAdjustedFare || option.finalFare || 0);
    const best = chooseBestAutomaticPromotion(automaticCampaigns, {
      bookingType: tab,
      pickupDate,
      pickupTime,
      pickup: pickup?.description || "",
      drop: drop?.description || "",
      fare: before,
    });

    if (!best || !(best.discountAmount > 0)) {
      setCampaignMessage("Is cab ke liye abhi koi eligible discount offer available nahi hai.");
      return;
    }

    setFareOptions((current) => current.map((item) =>
      item.vehicleType === vehicleType
        ? {
            ...item,
            campaignId: best.campaign.id,
            campaignName: best.campaign.name,
            campaignDiscountType: best.campaign.discountType,
            campaignDiscountValue: best.campaign.discountValue,
            campaignDiscountAmount: best.discountAmount,
            campaignPriority: best.campaign.priority || 0,
            campaignOfferMode: best.campaign.offerMode || "automatic",
            campaignCode: best.campaign.couponCode || "",
            finalFare: Math.max(0, before - best.discountAmount),
          }
        : item
    ));
    setAppliedCampaign(best.campaign);
    setCampaignMessage(`${best.campaign.name}: ${money(best.discountAmount)} discount applied on ${option.vehicle?.label || vehicleType}.`);
  }

  async function applyVehicleCouponCode(vehicleType: VehicleType) {
    const code = campaignCouponCode.trim().toUpperCase();
    if (!code) {
      setCampaignMessage("Coupon code enter karein.");
      return;
    }

    const routeCoupon = availableCoupons.find((item) => item.code.toUpperCase() === code);
    if (routeCoupon) {
      applyRouteCoupon(routeCoupon);
      setCouponEntryVehicle(null);
      return;
    }

    await applyDiscountCampaignCoupon();
    setCouponEntryVehicle(null);
  }

  async function applyDiscountCampaignCoupon() {
    const code = campaignCouponCode.trim().toUpperCase();
    if (!code) { setCampaignMessage("Coupon code enter karein."); return; }
    setCampaignBusy(true); setCampaignMessage("");
    try {
      const response = await fetch("/api/fare-promotions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, bookingType: tab, pickupDate, pickupTime, pickup: pickup?.description || "", drop: drop?.description || "", fare: Math.max(...fareOptions.map((x) => Number(x.festivalAdjustedFare || 0))) }) });
      const data = await response.json();
      if (!response.ok || data.success !== true || !data.campaign) throw new Error(data.error || "Coupon apply nahi ho paya.");
      const campaign = data.campaign as FarePromotion;
      let couponWon = false;
      const next = fareOptions.map((option) => {
        const before = Number(option.festivalAdjustedFare || option.finalFare || 0);
        const reason = getPromotionEligibilityReason(campaign, { bookingType: tab, pickupDate, pickupTime, pickup: pickup?.description || "", drop: drop?.description || "", fare: before, offerMode: "coupon" });
        const couponDiscount = reason ? 0 : calculatePromotionDiscount(campaign, before);
        const currentDiscount = Number(option.campaignDiscountAmount || 0);
        const couponWins = couponDiscount > currentDiscount || (couponDiscount === currentDiscount && couponDiscount > 0 && Number(campaign.priority || 0) > Number(option.campaignPriority || 0));
        if (couponWins) couponWon = true;
        if (!couponWins) return option;
        return { ...option, campaignId: campaign.id, campaignName: campaign.name, campaignDiscountType: campaign.discountType, campaignDiscountValue: campaign.discountValue, campaignDiscountAmount: couponDiscount, campaignPriority: campaign.priority, campaignOfferMode: "coupon", campaignCode: campaign.couponCode || "", finalFare: Math.max(0, before - couponDiscount) };
      });
      if (!next.some((x) => x.campaignId)) throw new Error("Is fare/vehicle par coupon eligible nahi hai.");
      setAppliedCoupon(null);
      const retained = next.some((x) => x.campaignId !== campaign.id);
      setAppliedCampaign(couponWon ? campaign : (automaticCampaigns.find((x) => x.id === next.find((o) => o.campaignId)?.campaignId) || campaign));
      setFareOptions(next);
      setCampaignMessage(retained ? "Best eligible discount policy: is cab par pehle se zyada saving wala offer rakha gaya hai." : `${campaign.name}: discount successfully applied.`);
    } catch (e: any) { setCampaignMessage(e?.message || "Coupon validation failed."); } finally { setCampaignBusy(false); }
  }

  function applyRouteCoupon(found: CouponRecord) {
    setCouponMessage("");
    if (appliedCampaign || fareOptions.some((option) => Number(option.campaignDiscountAmount || 0) > 0)) {
      setCouponMessage("Best eligible offer policy: ek booking par ek hi discount offer apply hoga.");
      return;
    }
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
      finalFare: Number(option.campaignDiscountAmount || 0) > 0
        ? Number(option.festivalAdjustedFare ?? option.baseFare ?? option.finalFare ?? 0) - Number(option.campaignDiscountAmount || 0)
        : Number(option.festivalAdjustedFare ?? option.baseFare ?? option.finalFare ?? 0),
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
    appliedCampaign: appliedCampaign ? { id: appliedCampaign.id, name: appliedCampaign.name, couponCode: appliedCampaign.couponCode || "", offerMode: appliedCampaign.offerMode } : null,
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
          nightSurchargePercent: bookingOption.nightSurchargePercent || 0,
          nightSurchargeAmount: bookingOption.nightSurchargeAmount || 0,
          fareAfterNight: bookingOption.fareAfterNight ?? bookingOption.baseFare,
          festivalPercent: bookingOption.festivalPercent,
          festivalAmount: bookingOption.festivalAmount,
          festivalAdjustedFare: bookingOption.festivalAdjustedFare,
          couponCode: bookingOption.couponCode || "",
          couponPercent: bookingOption.couponPercent || 0,
          couponAmount: bookingOption.couponAmount || 0,
          campaignId: bookingOption.campaignId || "", campaignName: bookingOption.campaignName || "", campaignCode: bookingOption.campaignCode || "",
          campaignDiscountType: bookingOption.campaignDiscountType || "", campaignDiscountValue: bookingOption.campaignDiscountValue || 0, campaignDiscountAmount: bookingOption.campaignDiscountAmount || 0,
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
        theme: { color: "#f97316" },
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

  if (loading) {
    return (
      <FareSearchingScreen
        pickup={pickup?.description || "Pickup location"}
        drop={tab === "local"
          ? (localPackages.find((item) => item.id === localPackage)?.label || "Local package")
          : (drop?.description || "Destination")}
      />
    );
  }

  if (bookingOption) {
    const total = Number(bookingOption.finalFare || 0);
    const advance = Math.round(total * 0.25);
    const balance = Math.max(0, total - advance);
    const tripLabel = tab === "oneway" ? "One Way" : tab === "roundtrip" ? "Round Trip" : "Local Rental";
    const inclusionItems = [
      "Base fare and fuel charges",
      "Driver allowance",
      "GST and applicable taxes as shown",
      "Toll, state tax and permit as per fare conditions",
      "Air-conditioned vehicle",
    ];

    return (
      <main className="min-h-screen bg-[#fffaf5] px-3 py-3 text-slate-900 sm:px-5 sm:py-5">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-3 flex items-center gap-3 border-b border-slate-200 pb-3">
            <button type="button" onClick={() => { setBookingOption(null); setPaymentError(""); }}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-orange-50 hover:text-orange-700" aria-label="Back to cab options">
              <ArrowLeft size={19} />
            </button>
            <h1 className="text-lg font-extrabold sm:text-xl">Review Your Booking</h1>
          </div>

          <div className="mb-3 grid gap-3 rounded-xl bg-[#eaf8fc] px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold sm:text-base">{pickup?.description || "Pickup"} <span className="text-orange-500">→</span> {tab === "local" ? "Local Rental" : drop?.description || "Destination"}</p>
              <p className="mt-0.5 text-xs text-slate-600">{formatBookingDate(pickupDate)} · {pickupTime} · {tripLabel}</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
              <div><span className="text-slate-500">Selected cab</span><p className="font-bold">{bookingOption.vehicle?.label || bookingOption.vehicleType}</p></div>
              {tab !== "local" && <div><span className="text-slate-500">Distance</span><p className="font-bold">{route?.distanceKm || "—"} KM</p></div>}
              <button type="button" onClick={() => setBookingOption(null)} className="self-center rounded-full bg-white px-4 py-2 font-semibold text-orange-700 shadow-sm hover:bg-orange-50">Modify Booking</button>
            </div>
          </div>

          <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
            <div className="space-y-3">
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3">
                  <h2 className="text-sm font-extrabold">Inclusions / Exclusions</h2>
                </div>
                <div className="grid gap-4 px-4 py-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-extrabold text-green-700">✓ Inclusions</p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {inclusionItems.map((item) => <li key={item} className="flex gap-2"><span className="text-green-600">✓</span>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-extrabold text-red-600">× Exclusions / Conditions</p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex gap-2"><span className="text-red-500">×</span>Extra running beyond package / included distance, if applicable</li>
                      <li className="flex gap-2"><span className="text-red-500">×</span>Additional stops or route changes not in the booking</li>
                      <li className="flex gap-2"><span className="text-red-500">×</span>Any separately stated parking or special charges</li>
                    </ul>
                  </div>
                </div>
                <details className="border-t border-slate-100 px-4 py-2.5 text-xs">
                  <summary className="cursor-pointer font-semibold text-slate-700">Read Terms and Conditions</summary>
                  <p className="mt-2 leading-5 text-slate-600">Final inclusions, extra kilometre charges, waiting, toll, parking, permits and halt charges are governed by the applicable fare rules and booking details. Any change to the route or trip details may change the fare.</p>
                </details>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-sm font-extrabold">Contact & Pickup Details</h2>
                <form id="khatu-booking-payment-form" onSubmit={(e) => { e.preventDefault(); void startRazorpayPayment(); }} className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-slate-700 sm:col-span-2">Passenger Full Name *
                    <input required minLength={2} autoComplete="name" value={passenger.name}
                      onChange={(e) => setPassenger((v) => ({...v, name:e.target.value}))}
                      className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-orange-400 focus:bg-white" placeholder="Full name" />
                  </label>
                  <label className="block text-xs font-semibold text-slate-700">Mobile Number *
                    <input required inputMode="numeric" type="tel" maxLength={10} pattern="[6-9][0-9]{9}" autoComplete="tel-national" value={passenger.mobile}
                      onChange={(e) => setPassenger((v) => ({...v, mobile:e.target.value.replace(/\D/g, "").slice(0,10)}))}
                      className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-orange-400 focus:bg-white" placeholder="10-digit mobile number" />
                  </label>
                  <label className="block text-xs font-semibold text-slate-700">Email Address *
                    <input required type="email" autoComplete="email" value={passenger.email}
                      onChange={(e) => setPassenger((v) => ({...v, email:e.target.value}))}
                      className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-orange-400 focus:bg-white" placeholder="Email address" />
                  </label>
                  <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:col-span-2">
                    <span className="font-bold text-slate-800">Pickup:</span> {pickup?.description || "—"}
                    {tab !== "local" && <><span className="mx-2 text-slate-300">|</span><span className="font-bold text-slate-800">Drop:</span> {drop?.description || "—"}</>}
                  </div>
                </form>
              </section>
            </div>

            <aside className="space-y-3 lg:sticky lg:top-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                <strong>Free cancellation:</strong> Contact our team as early as possible for cancellation assistance.
              </div>
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-base font-extrabold">Payment Options</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-orange-300 bg-orange-50/70 p-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-3.5 w-3.5 rounded-full border-[4px] border-orange-500 bg-white" />
                      <div><p className="text-xs font-extrabold">Part Pay</p><p className="text-[10px] text-slate-500">Pay 25% now and rest later to the driver</p></div>
                    </div>
                    <strong className="text-sm">{money(advance)}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <div><p className="text-xs font-extrabold">Full Fare</p><p className="text-[10px] text-slate-500">Total booking amount</p></div>
                    <strong className="text-sm">{money(total)}</strong>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <h3 className="mb-2 text-xs font-extrabold">Coupon & Offers</h3>
                  <p className="text-[10px] text-slate-500">Eligible route discounts have already been applied to your fare.</p>
                </div>

                <div className="mt-4 space-y-2 rounded-lg bg-slate-50 p-3 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Total trip fare</span><strong>{money(total)}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Pay 25% now</span><strong className="text-orange-700">{money(advance)}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Pay later</span><strong>{money(balance)}</strong></div>
                </div>

                {paymentError && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700">{paymentError}</p>}
                <button form="khatu-booking-payment-form" type="submit" disabled={paymentBusy}
                  className="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg bg-orange-500 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60">
                  {paymentBusy ? "Processing..." : `PROCEED · ${money(advance)}`}
                </button>
                <p className="mt-2 text-center text-[10px] text-slate-500">Secure payment powered by Razorpay</p>
                <button type="button" onClick={() => { setBookingOption(null); setPaymentError(""); }} className="mt-2 w-full text-left text-[10px] font-semibold text-orange-700 underline">Back to fare options</button>
              </section>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  if (showResults) {
    const mapSrc = makeMapUrl();

    return (
      <main className="min-h-screen bg-[#fffaf5] text-slate-900">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setShowResults(false);
                setShowRouteMap(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-bold hover:bg-orange-50"
            >
              <ArrowLeft size={17} /> Edit Search
            </button>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-700 sm:text-xs">
              Khatu Rides · Fare Results
            </p>
          </div>

          {/* Trip summary is deliberately the first section on the result screen. */}
          <section className="rounded-3xl border-2 border-orange-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-extrabold text-orange-700 sm:text-xs">
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
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-orange-600" />
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
                    <div className="min-w-[112px] rounded-2xl bg-orange-50 px-3 py-3">
                      <p className="text-[10px] font-bold text-orange-700">TOTAL DISTANCE</p>
                      <p className="text-lg font-black sm:text-xl">{route?.distanceKm} KM</p>
                    </div>
                    <div className="min-w-[112px] rounded-2xl bg-orange-50 px-3 py-3">
                      <p className="text-[10px] font-bold text-orange-700">TRAVEL TIME</p>
                      <p className="text-lg font-black sm:text-xl">
                        {formatDuration(route?.durationMinutes || 0)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRouteMap((v) => !v)}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-orange-800"
                    >
                      <Navigation size={17} />
                      {showRouteMap ? "Hide Route" : "View Route"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {showRouteMap && (
              <div className="mt-5 overflow-hidden rounded-2xl border-2 border-orange-200">
                <div className="flex items-center justify-between bg-orange-50 px-4 py-3">
                  <p className="text-sm font-bold text-orange-950">Your route on Google Maps</p>
                  <button
                    type="button"
                    onClick={() => setShowRouteMap(false)}
                    aria-label="Close map"
                    className="rounded-lg p-1 text-orange-900 hover:bg-orange-100"
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
                <div className="border-t border-orange-100 bg-white px-4 py-2 text-xs text-slate-500">
                  Google Maps route preview · Directions may open in Google Maps for navigation.
                </div>
              </div>
            )}
          </section>

          <div className="mb-4 mt-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-700">
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
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-700 hover:text-orange-800"
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
                <article key={`mobile-${option.vehicleType}`} className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">
                  <div className="flex min-h-[76px] items-center gap-3 px-3 py-2.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
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
                      <p className="text-xl font-black leading-tight text-orange-700">{money(fare)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 border-t border-green-100 bg-green-50/50 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => applyBestOfferForVehicle(option.vehicleType as VehicleType)}
                      className="inline-flex min-h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-green-700 px-2.5 py-1.5 text-[10px] font-extrabold text-white"
                    >
                      <Zap size={12} /> Apply Offer
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponEntryVehicle((current) => current === option.vehicleType ? null : option.vehicleType)}
                      className="inline-flex min-h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-green-300 bg-white px-2.5 py-1.5 text-[10px] font-extrabold text-green-800"
                    >
                      Enter Coupon
                    </button>
                    {couponEntryVehicle === option.vehicleType && (
                      <div className="flex w-full gap-1.5">
                        <input
                          value={campaignCouponCode}
                          onChange={(e) => setCampaignCouponCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => { if (e.key === "Enter") void applyVehicleCouponCode(option.vehicleType as VehicleType); }}
                          placeholder="Enter coupon code"
                          className="h-8 min-w-0 flex-1 rounded-md border border-green-300 bg-white px-2 text-xs outline-none focus:border-green-600"
                          aria-label={`Coupon code for ${option.vehicle?.label || option.vehicleType}`}
                        />
                        <button type="button" disabled={campaignBusy} onClick={() => void applyVehicleCouponCode(option.vehicleType as VehicleType)} className="rounded-md bg-green-700 px-3 text-[10px] font-bold text-white disabled:opacity-50">
                          {campaignBusy ? "..." : "Apply"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setExpandedConditions((current) => ({ ...current, [option.vehicleType]: !current[option.vehicleType] }))}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-700"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setBookingOption(option); setPaymentError(""); }}
                      className="rounded-lg bg-orange-700 px-4 py-2 text-xs font-extrabold text-white"
                    >
                      Book Cab
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="space-y-3 border-t border-orange-100 bg-orange-50/60 p-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs">
                        <p className="mb-2 font-extrabold text-slate-900">Fare Breakdown</p>
                        <div className="flex justify-between gap-3"><span className="text-slate-600">Base Fare</span><strong>{money(Number(option.baseFare ?? fare))}</strong></div>
                        {Number(option.nightSurchargePercent || 0) > 0 && <div className="mt-1 flex justify-between gap-3 text-orange-700"><span>Night Surcharge (+{option.nightSurchargePercent}%)</span><strong>+{money(Number(option.nightSurchargeAmount || 0))}</strong></div>}
                        {option.festivalPercent > 0 && <div className="mt-1 flex justify-between gap-3 text-amber-700"><span>{festivalRule?.name || "Festival Fare Increase"} (+{option.festivalPercent}%)</span><strong>+{money(Number(option.festivalAmount || 0))}</strong></div>}
                        <div className="mt-1 flex justify-between gap-3 border-t border-slate-100 pt-2 text-slate-700"><span>Fare before coupon</span><strong>{money(Number(option.festivalAdjustedFare ?? option.fareAfterNight ?? fare))}</strong></div>
                        {option.campaignDiscountAmount > 0 && <div className="mt-1 flex justify-between gap-3 text-green-700"><span>{option.campaignName || "Campaign Discount"} ({option.campaignDiscountType === "percentage" ? `${option.campaignDiscountValue}%` : "Fixed"})</span><strong>−{money(Number(option.campaignDiscountAmount || 0))}</strong></div>}
                        {option.couponPercent > 0 && <div className="mt-1 flex justify-between gap-3 text-green-700"><span>Coupon Discount · {option.couponCode} ({option.couponPercent}%)</span><strong>−{money(Number(option.couponAmount || 0))}</strong></div>}
                        <div className="mt-2 flex justify-between gap-3 border-t pt-2 font-black"><span>Final Payable</span><strong>{money(fare)}</strong></div>
                        <div className="mt-2 flex justify-between gap-3 text-slate-600"><span>Advance (25%)</span><strong>{money(advance)}</strong></div>
                        <div className="flex justify-between gap-3 text-slate-600"><span>Balance (75%)</span><strong>{money(remaining)}</strong></div>
                      </div>
                      <div className="rounded-xl border border-orange-200 bg-white p-3 text-xs">
                        <p className="mb-2 font-extrabold text-slate-900">Trip Inclusions & Conditions</p>
                        <div className="space-y-2">
                          {conditions.map(([label, value]) => <div key={label} className="flex items-start justify-between gap-3"><span className="text-slate-600">{label}</span><strong className="max-w-[60%] text-right text-slate-900">{value}</strong></div>)}
                        </div>
                        <p className="mt-3 border-t border-slate-100 pt-2 leading-5 text-[10px] text-slate-500">Any additional applicable charge will be communicated before booking confirmation.</p>
                      </div>
                      <button type="button" onClick={() => { setBookingOption(option); setPaymentError(""); }} className="w-full rounded-xl bg-orange-700 px-4 py-3 text-sm font-extrabold text-white">Book Your Cab</button>
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          {festivalRule && <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-[10px] leading-4 text-amber-900 sm:text-xs"><span className="inline-flex h-5 items-center rounded-full bg-amber-100 px-2 font-extrabold uppercase tracking-wide">Seasonal fare</span><strong>{festivalRule.name}</strong><span>+{festivalRule.increasePercent}% automatically applied for this journey date.</span></div>}
          {(campaignMessage || couponMessage) && (
            <p role="status" className="mb-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-[10px] font-semibold text-green-800">
              {campaignMessage || couponMessage}
            </p>
          )}

          <div className="hidden lg:block">
            {/* Desktop trip summary strip */}
            <div className="mb-2 grid grid-cols-[1.4fr_0.45fr_0.55fr_0.55fr_auto] items-center gap-5 rounded-t-xl bg-[#effbff] px-5 py-2.5 text-xs">
              <div>
                <p className="text-[11px] text-slate-500">Home › Select Car</p>
                <p className="mt-1 text-sm font-extrabold text-slate-900">{pickup?.description?.split(",")[0]} - {drop?.description?.split(",")[0] || "Local Rental"}</p>
              </div>
              <div><p className="text-xs text-slate-500">Trip Type</p><p className="font-bold">{tab === "oneway" ? "One way" : tab === "roundtrip" ? "Round trip" : "Local"}</p></div>
              <div><p className="text-xs text-slate-500">Pick up</p><p className="font-bold">{formatBookingDate(pickupDate)}</p></div>
              <div><p className="text-xs text-slate-500">Time</p><p className="font-bold">{pickupTime}</p></div>
              <button type="button" onClick={() => setShowResults(false)} className="rounded-full bg-white px-5 py-2 font-semibold text-orange-600 shadow-sm hover:bg-orange-50">Modify Booking</button>
            </div>

            {/* Trust banner */}
            <div className="mb-3 grid grid-cols-3 items-center gap-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-700 px-6 py-2.5 text-white shadow-md">
              <div className="flex items-center justify-center gap-3"><span className="text-3xl font-light">₹</span><span className="text-xs font-bold leading-4">Transparent<br/>Fare</span></div>
              <div className="flex items-center justify-center gap-3"><ShieldCheck size={30}/><span className="text-xs font-bold leading-4">Verified Drivers<br/>Trusted Service</span></div>
              <div className="flex items-center justify-center gap-3"><Phone size={28}/><span className="text-xs font-bold leading-4">24×7 Customer<br/>Support</span></div>
            </div>

            {/* Horizontal desktop vehicle cards */}
            <div className="space-y-3">
              {fareOptions.map((option) => {
                const fare = Number(option.finalFare || 0);
                const advance = Math.round(fare * 0.25);
                const remaining = fare - advance;
                const isExpanded = Boolean(expandedConditions[option.vehicleType]);
                const crossedFare = Number(option.festivalAdjustedFare || option.fareAfterNight || option.baseFare || fare);
                const hasDiscount = Number(option.couponAmount || 0) > 0 || Number(option.campaignDiscountAmount || 0) > 0;
                const discountAmount = Number(option.couponAmount || 0) + Number(option.campaignDiscountAmount || 0);
                const discountPercent = hasDiscount && crossedFare > 0 ? Math.round((discountAmount / crossedFare) * 100) : 0;

                return (
                  <article key={`desktop-${option.vehicleType}`} className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition hover:border-orange-300 hover:shadow-md">
                    <div className="grid min-h-[230px] grid-cols-[235px_minmax(0,1fr)_220px] items-center gap-4 px-5 py-4">
                      <div className="flex h-[170px] items-center justify-center rounded-lg bg-white">
                        {option.vehicle?.image ? <img src={option.vehicle.image} alt={option.vehicle.label} className="max-h-full w-full object-contain p-2"/> : <CarFront size={82} className="text-slate-300"/>}
                      </div>

                      <div className="min-w-0 self-center">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-bold text-slate-800">{option.vehicle?.label || option.vehicleType}</h2>
                          <span className="text-xs italic text-slate-500">or similar</span>
                          <span className="rounded bg-slate-950 px-2 py-0.5 text-[10px] font-bold text-white">4.8 ★</span>
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">Available</span>
                        </div>
                        <p className="mt-1 text-xs italic text-slate-500">{option.vehicleType === "sedan" ? "4 seater AC Cab" : option.vehicleType === "ertiga" ? "6+1 seater AC Cab" : "Premium AC Cab"}</p>
                        <div className="mt-3 space-y-2 text-xs text-slate-700">
                          <p className="flex items-center gap-2"><ShieldCheck size={16} className="text-orange-500"/> Driver details confirmed before journey</p>
                          <p className="flex items-center gap-2"><RouteIcon size={16} className="text-orange-500"/> {tab === "local" ? `${LOCAL_PACKAGES[option.vehicleType as VehicleType][localPackage].kms} KM package included` : `${Number(route?.distanceKm || 0)} KM ${tab === "oneway" ? "one side" : "one-side route distance"}`}</p>
                          {option.couponPercent > 0 && <p className="font-bold text-green-700">Coupon {option.couponCode} applied · {option.couponPercent}% OFF</p>}
                          {festivalRule && <p className="font-semibold text-orange-700">{festivalRule.name}: {festivalRule.increasePercent}% seasonal fare adjustment</p>}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => applyBestOfferForVehicle(option.vehicleType as VehicleType)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-green-700 px-3 text-[10px] font-extrabold text-white hover:bg-green-800"
                          >
                            <Zap size={13} /> Apply Offer
                          </button>
                          <button
                            type="button"
                            onClick={() => setCouponEntryVehicle((current) => current === option.vehicleType ? null : option.vehicleType)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-green-300 bg-white px-3 text-[10px] font-extrabold text-green-800 hover:bg-green-50"
                          >
                            Enter Coupon
                          </button>
                        </div>
                        {couponEntryVehicle === option.vehicleType && (
                          <div className="mt-2 flex max-w-[390px] gap-1.5">
                            <input
                              value={campaignCouponCode}
                              onChange={(e) => setCampaignCouponCode(e.target.value.toUpperCase())}
                              onKeyDown={(e) => { if (e.key === "Enter") void applyVehicleCouponCode(option.vehicleType as VehicleType); }}
                              placeholder="Enter coupon code"
                              aria-label={`Coupon code for ${option.vehicle?.label || option.vehicleType}`}
                              className="h-8 min-w-0 flex-1 rounded-md border border-green-300 bg-white px-2.5 text-xs outline-none focus:border-green-600"
                            />
                            <button type="button" disabled={campaignBusy} onClick={() => void applyVehicleCouponCode(option.vehicleType as VehicleType)} className="rounded-md bg-green-700 px-3 text-[10px] font-bold text-white disabled:opacity-50">
                              {campaignBusy ? "..." : "Apply"}
                            </button>
                          </div>
                        )}
                        <button type="button" onClick={() => setExpandedConditions((current) => ({...current, [option.vehicleType]: !current[option.vehicleType]}))} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700">
                          Inclusions and Exclusions {isExpanded ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
                        </button>
                      </div>

                      <div className="flex h-full flex-col items-end justify-center border-l border-slate-100 pl-5 text-right">
                        {hasDiscount && <p className="text-xs font-bold text-green-600">● {discountPercent}% OFF <span className="font-normal text-slate-400 line-through">{money(crossedFare)}</span></p>}
                        <p className="mt-1 text-3xl font-black tracking-tight text-sky-500">{money(fare)}</p>
                        <p className="mt-1 text-[11px] text-slate-500">Final payable fare</p>
                        {option.festivalPercent > 0 && <p className="mt-1 text-[10px] text-slate-400">Includes festival pricing</p>}
                        <button type="button" onClick={() => { setBookingOption(option); setPaymentError(""); }} className="mt-3 min-w-[155px] rounded-md bg-orange-500 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-orange-600">
                          SELECT CAB
                        </button>
                      </div>
                    </div>

                    <div className="flex min-h-8 items-center gap-2 bg-sky-100 px-3 py-2 text-xs font-semibold text-slate-700">
                      <CarFront size={17} className="text-orange-600"/> Khatu Rides trusted fleet · 24×7 booking assistance
                    </div>

                    {isExpanded && (
                      <div className="grid gap-4 border-t border-orange-100 bg-orange-50/50 p-5 xl:grid-cols-2">
                        <div className="rounded-xl border border-orange-100 bg-white p-4">
                          <h3 className="mb-3 text-sm font-extrabold">Fare Breakdown</h3>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between"><span>Base Fare</span><strong>{money(Number(option.baseFare ?? fare))}</strong></div>
                            {Number(option.nightSurchargeAmount || 0) > 0 && <div className="flex justify-between text-orange-700"><span>Night Surcharge</span><strong>+{money(Number(option.nightSurchargeAmount))}</strong></div>}
                            {option.festivalPercent > 0 && <div className="flex justify-between text-orange-700"><span>{festivalRule?.name || "Festival Increase"} ({option.festivalPercent}%)</span><strong>+{money(Number(option.festivalAmount || 0))}</strong></div>}
                            <div className="flex justify-between border-t pt-2"><span>Fare before coupon</span><strong>{money(Number(option.festivalAdjustedFare ?? fare))}</strong></div>
                            {option.campaignDiscountAmount > 0 && <div className="flex justify-between text-green-700"><span>{option.campaignName || "Campaign Discount"}</span><strong>−{money(Number(option.campaignDiscountAmount))}</strong></div>}
                            {option.couponPercent > 0 && <div className="flex justify-between text-green-700"><span>Coupon · {option.couponCode}</span><strong>−{money(Number(option.couponAmount))}</strong></div>}
                            <div className="flex justify-between border-t pt-2 text-sm font-black"><span>Total Payable</span><strong>{money(fare)}</strong></div>
                            <div className="flex justify-between"><span>Advance (25%)</span><strong>{money(advance)}</strong></div>
                            <div className="flex justify-between"><span>Balance (75%)</span><strong>{money(remaining)}</strong></div>
                          </div>
                        </div>
                        <div className="rounded-xl border border-orange-100 bg-white p-4">
                          <h3 className="mb-3 text-sm font-extrabold">Trip Inclusions & Conditions</h3>
                          <p className="text-xs leading-6 text-slate-600">Toll, parking, driver fooding, night halt and package limits follow the selected trip type and applicable route conditions. Any additional charge will be communicated before booking confirmation.</p>
                          <button type="button" onClick={() => { setBookingOption(option); setPaymentError(""); }} className="mt-4 w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-600">SELECT THIS CAB</button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
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
    <main className="w-full bg-[#fffaf5] px-3 py-2 text-slate-900 sm:px-5 sm:py-3 lg:px-6 lg:py-4">
      <div className="mx-auto max-w-[1500px]">
        
        

        <section className="h-auto rounded-[18px] border border-orange-100 bg-white p-3 shadow-md shadow-orange-100/40 sm:rounded-[22px] sm:p-4 lg:p-5">
          {/* Trip type */}
          <div className="mx-auto mb-3 grid max-w-[520px] grid-cols-3 gap-1 rounded-lg border border-orange-200 bg-white p-1 sm:mb-3 sm:gap-0">
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
                className={`min-h-10 rounded-md border-r border-slate-200 px-2 py-2 text-[11px] font-extrabold uppercase transition last:border-r-0 sm:min-h-9 sm:px-5 sm:text-xs ${
                  tab === id
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-800 hover:bg-orange-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* First row: wider pickup/drop fields; on mobile they share the row without shrinking input height. */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-[minmax(180px,1.2fr)_42px_minmax(180px,1.2fr)_minmax(150px,1fr)_minmax(130px,0.9fr)] lg:items-end lg:gap-5">
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
                <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-56 overflow-auto rounded-xl border-2 border-orange-200 bg-white p-1.5 shadow-2xl sm:mt-2 sm:rounded-2xl sm:p-2">
                  {suggestionsFor("pickup").map((item) => (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => chooseSuggestion(item)}
                      className="flex w-full gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs hover:bg-orange-50 sm:gap-3 sm:px-3 sm:py-3 sm:text-sm"
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
              className="hidden min-h-[54px] items-center justify-center self-end rounded-full border-2 border-orange-200 bg-white text-orange-700 shadow-sm hover:bg-orange-50 disabled:opacity-30 lg:flex"
            >
              <ArrowLeftRight size={20} />
            </button>

            <div className={`relative min-w-0 ${tab === "local" ? "opacity-45" : ""}`}>
              <label className={fieldLabelClass()}>DROP LOCATION</label>
              <div className={inputShellClass()}>
                <Navigation className="h-5 w-5 shrink-0 text-orange-600 sm:h-6 sm:w-6" />
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
                <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-56 overflow-auto rounded-xl border-2 border-orange-200 bg-white p-1.5 shadow-2xl sm:mt-2 sm:rounded-2xl sm:p-2">
                  {suggestionsFor("drop").map((item) => (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => chooseSuggestion(item)}
                      className="flex w-full gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs hover:bg-orange-50 sm:gap-3 sm:px-3 sm:py-3 sm:text-sm"
                    >
                      <MapPin size={16} className="mt-0.5 shrink-0 text-orange-600" />
                      <span>{item.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <label className={fieldLabelClass()}>PICKUP DATE</label>
              <div className={inputShellClass()}>
                <CalendarDays className="hidden h-5 w-5 shrink-0 text-orange-700 sm:block" />
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
                  <CarFront className="hidden h-5 w-5 shrink-0 text-orange-700 sm:block" />
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
                      <CalendarDays className="hidden h-5 w-5 shrink-0 text-orange-700 sm:block" />
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
                      <Clock3 className="hidden h-5 w-5 shrink-0 text-orange-700 sm:block" />
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
          <div className="mt-2 flex flex-col items-center gap-2 border-t border-orange-100 pt-2 sm:mt-3 sm:gap-2.5 sm:pt-3">
            {tab === "roundtrip" && (
              <div className="grid w-full grid-cols-2 gap-2 sm:max-w-md sm:gap-3">
                <div>
                  <label className={fieldLabelClass()}>RETURN TIME</label>
                  <div className={inputShellClass()}>
                    <Clock3 className="hidden h-5 w-5 shrink-0 text-orange-700 sm:block" />
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
              className="flex min-h-[44px] w-full max-w-[280px] items-center justify-center gap-2 rounded-md border-2 border-orange-500 bg-orange-500 px-6 py-2.5 text-sm font-black uppercase text-white shadow-md shadow-orange-200 transition hover:border-orange-600 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[46px] sm:max-w-[280px] sm:text-base"
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
            <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs font-semibold text-orange-700 sm:text-sm">
              {error}
            </p>
          )}
        </section>

        <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-slate-400 sm:mt-2 sm:text-xs">
          <ShieldCheck size={14} className="text-green-600" />
          Transparent pricing · Multiple vehicle options · 24×7 support
        </div>
      </div>
    </main>
  );
}

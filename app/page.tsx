"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import TopBar from "@/components/TopBar";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import {
  calculateFare,
  VEHICLES,
  type BookingType,
  type VehicleType,
} from "@/lib/fareCalculator";
import {
  Phone,
  MessageCircle,
  ShieldCheck,
  Clock3,
  Star,
  ArrowRight,
  CheckCircle2,
  Building2,
  Gift,
  X,
  MapPin,
  CarFront,
  CalendarDays,
  Clock4,
  CarTaxiFront,
  BadgeCheck,
  Ticket,
  Users,
  Route,
  MoonStar,
} from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const libraries: "places"[] = ["places"];
const GOOGLE_REVIEW_LINK = "https://g.page/r/CbD5nSIGmvz1EBM/review";
const ADMIN_WHATSAPP_NUMBER = "919244137353";

const vehicles = [
  {
    name: "Dzire",
    type: "Sedan",
    value: "sedan" as VehicleType,
    price: "₹11/km onwards",
    seats: "4+1",
    luggage: "2 Bags",
    image:
      "https://content.carlelo.com/media/models/Dzire/base/maruti-suzuki-dzire-1.webp",
  },
  {
    name: "Ertiga",
    type: "6+1",
    value: "ertiga" as VehicleType,
    price: "₹13/km onwards",
    seats: "6+1",
    luggage: "4 Bags",
    image:
      "https://imgd.aeplcdn.com/642x361/n/cw/ec/171147/maruti-suzuki-ertiga-left-rear-three-quarter0.jpeg?isig=0&q=75",
  },
  {
    name: "Innova",
    type: "7+1",
    value: "innova" as VehicleType,
    price: "₹18/km onwards",
    seats: "7+1",
    luggage: "5 Bags",
    image:
      "https://stimg.cardekho.com/images/expert-review/select-model/20250728_160805/930x620/5_1200x67520250728_160805.jpg",
  },
  {
    name: "Innova Crysta",
    type: "Premium",
    value: "crysta" as VehicleType,
    price: "₹20/km onwards",
    seats: "7+1",
    luggage: "5 Bags",
    image:
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/51435/innova-crysta-exterior-right-front-three-quarter-2.jpeg?q=75",
  },
  {
    name: "Scorpio",
    type: "SUV",
    value: "scorpio" as VehicleType,
    price: "₹17/km onwards",
    seats: "6+1",
    luggage: "4 Bags",
    image:
      "https://stimg.cardekho.com/images/carexteriorimages/930x620/Mahindra/Scorpio-Classic/10764/1690185761481/front-left-side-47.jpg",
  },
];

const popularRoutes = [
  { title: "Raipur to Korba", fare: "₹2800+", link: "/routes/raipur-to-korba-taxi" },
  { title: "Raipur to Bilaspur", fare: "₹2200+", link: "/routes/raipur-to-bilaspur-taxi" },
  { title: "Raipur to Raigarh", fare: "₹3500+", link: "/routes/raipur-to-raigarh-taxi" },
  { title: "Airport to Korba", fare: "₹3000+", link: "/routes/raipur-airport-to-korba-taxi" },
  { title: "Airport to Bilaspur", fare: "₹2500+", link: "/routes/raipur-airport-to-bilaspur-taxi" },
  { title: "Korba to Bilaspur", fare: "₹1800+", link: "/routes/korba-to-bilaspur-taxi" },
];

const faqs = [
  {
    q: "What is the Raipur to Korba taxi fare?",
    a: "Taxi fare starts from approximately ₹2800 depending on vehicle type and travel date.",
  },
  {
    q: "Do you provide airport pickup service?",
    a: "Yes. Airport pickup and drop services are available across Chhattisgarh.",
  },
  {
    q: "Can I book one-way taxi?",
    a: "Yes. One-way taxi services are available on most routes.",
  },
  {
    q: "Do you provide GST invoices?",
    a: "Yes. GST invoices can be provided for eligible bookings.",
  },
];

const reviews = [
  { name: "Amit Verma", city: "Raipur", review: "Excellent taxi service. Clean vehicle and professional driver." },
  { name: "Sanjay Agrawal", city: "Korba", review: "Airport pickup was on time and the journey was comfortable." },
  { name: "Rohit Sharma", city: "Bilaspur", review: "Best taxi service for business travel across Chhattisgarh." },
  { name: "Deepak Yadav", city: "Raigarh", review: "Transparent fare and quick WhatsApp support." },
  { name: "Pooja Singh", city: "Raipur", review: "Family trip was smooth and comfortable." },
  { name: "Nitin Gupta", city: "Korba", review: "Booked Ertiga for airport transfer. Great experience." },
];

const routeDistanceMap: Record<string, number> = {
  "raipur-korba": 220,
  "korba-raipur": 220,
  "raipur-bilaspur": 140,
  "bilaspur-raipur": 140,
  "raipur-raigarh": 255,
  "raigarh-raipur": 255,
  "raipur airport-korba": 230,
  "korba-raipur airport": 230,
  "raipur airport-bilaspur": 150,
  "bilaspur-raipur airport": 150,
  "korba-bilaspur": 95,
  "bilaspur-korba": 95,
};

function normalizeLocation(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function estimateDistance(pickup: string, drop: string) {
  const from = normalizeLocation(pickup);
  const to = normalizeLocation(drop);
  if (!from || !to) return 0;
  const exactKey = `${from}-${to}`;
  if (routeDistanceMap[exactKey]) return routeDistanceMap[exactKey];
  if (from === to) return 10;
  if (from.includes("airport") || to.includes("airport")) return 160;
  return 120;
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function formatDisplayDate(date: string) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDisplayTime(time: string) {
  if (!time) return "-";
  const [hours, minutes] = time.split(":");
  const h = Number(hours);
  const suffix = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 || 12;
  return `${formattedHour}:${minutes} ${suffix}`;
}

function buildDateTime(date: string, time: string) {
  if (!date || !time) return null;
  const dt = new Date(`${date}T${time}`);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function calculateTripEngagement(
  pickupDate: string,
  pickupTime: string,
  returnDate: string,
  returnTime: string
) {
  const start = buildDateTime(pickupDate, pickupTime);
  const end = buildDateTime(returnDate, returnTime);

  if (!start || !end || end <= start) {
    return {
      engagedDays: 0,
      engagedNights: 0,
      durationHours: 0,
    };
  }

  const diffMs = end.getTime() - start.getTime();
  const durationHours = diffMs / (1000 * 60 * 60);
  const engagedDays = Math.max(1, Math.ceil(durationHours / 24));
  const engagedNights = Math.max(0, engagedDays - 1);

  return {
    engagedDays,
    engagedNights,
    durationHours,
  };
}

function shouldSkipFirstNightHalt(pickupTime: string, distance: number) {
  if (!pickupTime) return false;
  const [hours = 0] = pickupTime.split(":").map(Number);
  return hours >= 17 && distance >= 300;
}

export default function HomePage() {
  const [pickupAutocomplete, setPickupAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [dropAutocomplete, setDropAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [vehicleType, setVehicleType] = useState<VehicleType>("sedan");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [passengerCount, setPassengerCount] = useState(1);
  const [pricingMode, setPricingMode] = useState<"fixed" | "running">("running");

  const [loadingFare, setLoadingFare] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isFormLocked, setIsFormLocked] = useState(false);

  const [mapDistance, setMapDistance] = useState(0);
  const [totalRunningDistance, setTotalRunningDistance] = useState(0);
  const [fare, setFare] = useState(0);
  const [finalFare, setFinalFare] = useState(0);
  const [fareRemarks, setFareRemarks] = useState<string[]>([]);
  const [engagedDays, setEngagedDays] = useState(0);
  const [engagedNights, setEngagedNights] = useState(0);

  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [showFarePopup, setShowFarePopup] = useState(false);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const farePopupRef = useRef<HTMLDivElement | null>(null);
  const triggerButtonRef = useRef<HTMLAnchorElement | null>(null);

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.value === vehicleType)?.name || vehicleType,
    [vehicleType]
  );

  const selectedVehicleConfig = VEHICLES[vehicleType];

  

  const tripLabelMap: Record<BookingType, string> = {
    oneway: "🚖 One Way",
    roundtrip: "🔁 Round Trip",
    airporttransfer: "✈ Airport",
    local: "🏙 Local",
  };

  const isRoundTrip = bookingType === "roundtrip";

  const displayDistance = useMemo(() => {
    if (isRoundTrip) return totalRunningDistance || mapDistance * 2 || 0;
    return mapDistance || 0;
  }, [isRoundTrip, totalRunningDistance, mapDistance]);

  const displayFare = useMemo(() => finalFare || fare || 0, [finalFare, fare]);

  const totalDaysDisplay = useMemo(
    () => (isRoundTrip ? engagedDays : 0),
    [isRoundTrip, engagedDays]
  );

  const totalNightsDisplay = useMemo(
    () => (isRoundTrip ? engagedNights : 0),
    [isRoundTrip, engagedNights]
  );

  const whatsappMessage = useMemo(() => {
    const lines = [
      "Hello Khatu Rides Travels Co, please confirm my booking request:",
      `Pickup Location : ${pickup || "-"}`,
      `Drop Location : ${drop || "-"}`,
      `Pickup Date : ${pickupDate || "-"}`,
      `Pickup Time : ${pickupTime || "-"}`,
      isRoundTrip ? `Return Date : ${returnDate || "-"}` : "",
      isRoundTrip ? `Return Time : ${returnTime || "-"}` : "",
      `Trip Type : ${tripLabelMap[bookingType]}`,
      `Vehicle Type : ${selectedVehicle}`,
      `Passengers : ${passengerCount}`,
      `Distance Limit : ${displayDistance} KM`,
      isRoundTrip
        ? `Vehicle Booking Duration : ${totalDaysDisplay} Day(s), ${totalNightsDisplay} Night(s)`
        : "",
      `Best Available Fare : ${formatCurrency(displayFare)}`,
    ];
    return lines.filter(Boolean).join("\n");
  }, [
    pickup,
    drop,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    bookingType,
    selectedVehicle,
    passengerCount,
    displayDistance,
    isRoundTrip,
    totalDaysDisplay,
    totalNightsDisplay,
    displayFare,
  ]);

  const whatsappUrl = useMemo(() => {
    return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
  }, [whatsappMessage]);

  useEffect(() => {
    if (bookingType === "local") setPricingMode("fixed");
    else setPricingMode("running");
  }, [bookingType]);

  

  useEffect(() => {
    if (!showReviewPopup && !showFarePopup) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const activePopup = showFarePopup ? farePopupRef.current : popupRef.current;
    const focusable = activePopup?.querySelector<HTMLButtonElement | HTMLAnchorElement>(
      "button, a[href]"
    );
    focusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showFarePopup) setShowFarePopup(false);
        if (showReviewPopup) setShowReviewPopup(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerButtonRef.current?.focus();
    };
  }, [showReviewPopup, showFarePopup]);

  const onPickupLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setPickupAutocomplete(autocomplete);
  };

  const onDropLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setDropAutocomplete(autocomplete);
  };

  const onPickupPlaceChanged = () => {
    if (!pickupAutocomplete) return;
    const place = pickupAutocomplete.getPlace();
    const address = place.formatted_address || place.name || "";
    setPickup(address);
  };

  const onDropPlaceChanged = () => {
    if (!dropAutocomplete) return;
    const place = dropAutocomplete.getPlace();
    const address = place.formatted_address || place.name || "";
    setDrop(address);
  };

  const resetFareState = () => {
    setMapDistance(0);
    setTotalRunningDistance(0);
    setFare(0);
    setFinalFare(0);
    setFareRemarks([]);
    setEngagedDays(0);
    setEngagedNights(0);
  };

  const handleBookingTypeChange = (value: BookingType) => {
    setBookingType(value);
    if (value !== "roundtrip") {
      setReturnDate("");
      setReturnTime("");
      setEngagedDays(0);
      setEngagedNights(0);
    }
  };

  const applyFareResult = (actualTripDistance: number) => {
    let autoDayHalts = 0;
    let autoNightHalts = 0;
    let tripDays = 1;
    const popupNotes: string[] = [];

    if (bookingType === "roundtrip" && pricingMode === "running") {
      const engagement = calculateTripEngagement(
        pickupDate,
        pickupTime,
        returnDate,
        returnTime
      );

      tripDays = Math.max(1, engagement.engagedDays);
      autoDayHalts = engagement.engagedDays;

      const skipFirstNight = shouldSkipFirstNightHalt(pickupTime, actualTripDistance);

      autoNightHalts = skipFirstNight
        ? Math.max(0, engagement.engagedNights - 1)
        : engagement.engagedNights;

      setEngagedDays(autoDayHalts);
      setEngagedNights(autoNightHalts);

      popupNotes.push(`Vehicle booked for ${autoDayHalts} day(s) and ${autoNightHalts} night(s)`);
    } else {
      setEngagedDays(0);
      setEngagedNights(0);
    }

    const result = calculateFare({
      distance: actualTripDistance,
      vehicleType,
      bookingType,
    });

    setMapDistance(result.actualDistance ?? actualTripDistance);
    setTotalRunningDistance(result.distance ?? actualTripDistance);
    setFare(result.fare);
    setFinalFare(result.finalFare);
    setFareRemarks([...popupNotes, ...result.remarks]);
    setHasCalculated(true);
    setIsFormLocked(true);
    setShowFarePopup(true);
  };

  const handleFareCalculation = async () => {
    if (!pickup || !drop || !pickupDate || !pickupTime) {
      alert("Please fill pickup, drop, pickup date and pickup time.");
      return;
    }

    if (bookingType === "roundtrip" && (!returnDate || !returnTime)) {
      alert("Please fill return date and return time for round trip.");
      return;
    }

    if (bookingType === "roundtrip") {
      const start = buildDateTime(pickupDate, pickupTime);
      const end = buildDateTime(returnDate, returnTime);
      if (!start || !end || end <= start) {
        alert("Return date and time must be after pickup date and time.");
        return;
      }
    }

    setLoadingFare(true);

    try {
      const response = await fetch("/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: pickup,
          destination: drop,
        }),
      });

      const data = await response.json();
      const tripDistance =
        typeof data?.distanceKm === "number" && data.distanceKm > 0
          ? Math.round(data.distanceKm)
          : estimateDistance(pickup, drop);

      applyFareResult(tripDistance);
    } catch (error) {
      console.error(error);
      applyFareResult(estimateDistance(pickup, drop));
    } finally {
      setLoadingFare(false);
    }
  };

  const handleRecalculate = () => {
    setIsFormLocked(false);
    setHasCalculated(false);
    setShowFarePopup(false);
    resetFareState();
  };

  const openReviewPopup = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    triggerButtonRef.current = e.currentTarget;
    setShowReviewPopup(true);
  };

  const closeReviewPopup = () => setShowReviewPopup(false);
  const closeFarePopup = () => setShowFarePopup(false);

  const continueToWhatsApp = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-18196199181/x3CpCMzKx70cEI3uz-RD",
        value: 1.0,
        currency: "INR",
        event_callback: () => {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        },
      });

      setTimeout(() => {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }, 1000);
    } else {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }

    setShowReviewPopup(false);
  };

  const trackCallConversion = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-18196199181/1OB8CJ0zTbgcEI3uz-RD",
        value: 1.0,
        currency: "INR",
      });
    }
  };

  const renderLocationField = ({
    label,
    value,
    setValue,
    placeholder,
    onLoad,
    onPlaceChanged,
    clearLabel,
  }: {
    label: string;
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    onLoad: (autocomplete: google.maps.places.Autocomplete) => void;
    onPlaceChanged: () => void;
    clearLabel: string;
  }) => {
    const inputClassName =
      "h-11 w-full rounded-xl border border-slate-300 bg-white px-3 pr-11 text-sm text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100";

    const inputElement = (
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={isFormLocked}
        className={inputClassName}
      />
    );

    return (
      <div className="space-y-1.5">
        <label className="block text-[12px] font-semibold text-slate-800">
          {label}
        </label>
        <div className="relative">
          {loadError ? (
            inputElement
          ) : isLoaded ? (
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
              options={{
                fields: ["formatted_address", "name", "geometry"],
                componentRestrictions: { country: "in" },
              }}
            >
              {inputElement}
            </Autocomplete>
          ) : (
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Loading ${label.toLowerCase()} suggestions...`}
              disabled={isFormLocked}
              className={inputClassName}
            />
          )}
          {value && !isFormLocked && (
            <button
              type="button"
              onClick={() => setValue("")}
              aria-label={clearLabel}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <TopBar />

      <main className="min-h-screen overflow-x-hidden bg-slate-50">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.24),transparent_36%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.76),rgba(2,6,23,0.95))]" />

          <div className="relative mx-auto max-w-7xl px-4 py-6 md:py-14 lg:py-20">
            <div className="mb-4 overflow-hidden rounded-2xl border border-orange-200 bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 px-3 py-2 text-white shadow-lg md:hidden">
              <div className="whitespace-nowrap text-[11px] font-extrabold tracking-wide animate-[marquee_12s_linear_infinite]">
                One Way • Round Trip • Local • Airport Transfer • Instant WhatsApp Booking
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-orange-300 md:text-sm">
                  <BadgeCheck size={14} />
                  Trusted Taxi Booking in Chhattisgarh
                </div>

                <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Book Safe & Reliable Taxi
                  <span className="text-orange-500"> & Airport Taxi in Chhattisgarh</span>
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg md:leading-8">
                  Lowest fare guarantee with verified drivers.
                  Get instant taxi fare and quick WhatsApp confirmation.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm">⭐ 4.9 Rating</span>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm">🚖 5000+ Trips</span>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm">✓ Verified Drivers</span>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm">⚡ Instant Confirmation</span>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={whatsappUrl}
                    onClick={openReviewPopup}
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600 sm:min-h-13 sm:px-6 sm:py-4"
                  >
                    Check Lowest Fare
                  </a>
                  <a
                    href="tel:9244137353"
                    onClick={trackCallConversion}
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white px-5 py-3 text-center text-sm font-bold text-white sm:min-h-13 sm:px-6 sm:py-4"
                  >
                    Call For Instant Booking
                  </a>
                </div>
              </div>

              <div>
                <div className="rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-black/5 sm:p-4 md:rounded-[30px] md:p-5">
                  <div className="mb-4 sm:mb-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">
                      <CarFront size={14} />
                      Instant Taxi Fare
                    </div>
                    <h2 className="mt-2 text-[clamp(1.1rem,2vw,1.75rem)] font-black leading-tight text-slate-900">
                      Get Best Taxi Price
                    </h2>
                    <p className="mt-1.5 text-[13px] sm:text-sm leading-5 sm:leading-6 text-slate-600">
                      Enter route details and get your fare in seconds.
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-green-50 p-2 text-center">
                      <div className="font-bold text-green-700">4.9★</div>
                      <div className="text-xs">Rating</div>
                    </div>
                    <div className="rounded-xl bg-orange-50 p-2 text-center">
                      <div className="font-bold text-orange-700">5000+</div>
                      <div className="text-xs">Trips</div>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-2 text-center">
                      <div className="font-bold text-blue-700">24×7</div>
                      <div className="text-xs">Support</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(["oneway", "roundtrip", "local", "airporttransfer"] as BookingType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        disabled={isFormLocked}
                        onClick={() => handleBookingTypeChange(type)}
                        className={`min-h-11 rounded-xl border px-2 py-2 text-[11px] sm:text-sm font-bold leading-tight transition ${
                          bookingType === type
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-orange-300"
                        } ${isFormLocked ? "cursor-not-allowed opacity-60" : ""}`}
                      >
                        {tripLabelMap[type]}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 space-y-3 sm:space-y-4">
                    {renderLocationField({
                      label: "Pickup Location",
                      value: pickup,
                      setValue: setPickup,
                      placeholder: "Enter pickup location",
                      onLoad: onPickupLoad,
                      onPlaceChanged: onPickupPlaceChanged,
                      clearLabel: "Clear pickup location",
                    })}

                    {renderLocationField({
                      label: "Drop Location",
                      value: drop,
                      setValue: setDrop,
                      placeholder: "Enter drop location",
                      onLoad: onDropLoad,
                      onPlaceChanged: onDropPlaceChanged,
                      clearLabel: "Clear drop location",
                    })}

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[12px] font-semibold text-slate-800">
                          Pickup Date
                        </label>
                        <input
                          type="date"
                          value={pickupDate}
                          disabled={isFormLocked}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[12px] font-semibold text-slate-800">
                          Pickup Time
                        </label>
                        <input
                          type="time"
                          value={pickupTime}
                          disabled={isFormLocked}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                      </div>
                    </div>

                    {bookingType === "roundtrip" && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-[12px] font-semibold text-slate-800">
                            Return Date
                          </label>
                          <input
                            type="date"
                            value={returnDate}
                            disabled={isFormLocked}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[12px] font-semibold text-slate-800">
                            Return Time
                          </label>
                          <input
                            type="time"
                            value={returnTime}
                            disabled={isFormLocked}
                            onChange={(e) => setReturnTime(e.target.value)}
                            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block text-[12px] font-semibold text-slate-800">
                        Select Vehicle
                      </label>

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {vehicles.map((vehicle) => (
                          <button
                            key={vehicle.value}
                            type="button"
                            disabled={isFormLocked}
                            onClick={() => setVehicleType(vehicle.value)}
                            className={`rounded-2xl border p-3 text-left transition ${
                              vehicleType === vehicle.value
                                ? "border-orange-500 bg-orange-50"
                                : "border-slate-200 bg-white hover:border-orange-300"
                            }`}
                          >
                            <div className="font-bold text-slate-900">{vehicle.name}</div>
                            <div className="mt-1 text-xs text-slate-500">{vehicle.seats}</div>
                            <div className="mt-2 text-xs font-semibold text-orange-600">
                              {vehicle.price}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    

                    <div className="grid gap-2 sm:grid-cols-2">
                      {!hasCalculated ? (
                        <button
                          type="button"
                          onClick={handleFareCalculation}
                          disabled={loadingFare}
                          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {loadingFare ? "Finding Best Fare..." : "Check Lowest Fare"}
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowFarePopup(true)}
                            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                          >
                            View Ticket
                          </button>

                          <button
                            type="button"
                            onClick={handleRecalculate}
                            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-orange-300 hover:text-orange-600"
                          >
                            Recalculate
                          </button>
                        </>
                      )}
                    </div>

                    <div className="rounded-xl bg-slate-100 px-3 py-2.5 text-[11px] sm:text-xs leading-5 text-slate-600">
                      ✓ Instant Fare Estimate, ✓ Verified Drivers, ✓ Quick WhatsApp Confirmation,
                      ✓ Toll & Parking Extra
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <ShieldCheck className="mb-3 text-orange-500" size={28} />
              <h3 className="text-lg font-bold text-slate-900">Safe & Verified</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Professional drivers and well-maintained vehicles for business and family travel.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <Clock3 className="mb-3 text-orange-500" size={28} />
              <h3 className="text-lg font-bold text-slate-900">Quick Response</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Instant fare estimate and quick booking confirmation over call or WhatsApp.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <Star className="mb-3 text-orange-500" size={28} />
              <h3 className="text-lg font-bold text-slate-900">Transparent Pricing</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Clean estimate flow with route, vehicle and travel summary shown in one ticket-style card.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6 md:py-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
                Choose Your Vehicle
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Select the right cab for solo, family or business travel.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.value}
                className={`overflow-hidden rounded-3xl bg-white shadow-sm ring-1 transition ${
                  vehicleType === vehicle.value
                    ? "ring-orange-500"
                    : "ring-slate-200 hover:ring-orange-300"
                }`}
              >
                <div className="relative h-44 bg-slate-100">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 20vw"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{vehicle.name}</h3>
                      <p className="text-sm text-slate-500">{vehicle.type}</p>
                    </div>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                      {vehicle.price}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="font-semibold text-slate-900">{vehicle.seats}</div>
                      <div>Seats</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="font-semibold text-slate-900">{vehicle.luggage}</div>
                      <div>Luggage</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setVehicleType(vehicle.value)}
                    className={`mt-4 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-bold transition ${
                      vehicleType === vehicle.value
                        ? "bg-orange-500 text-white"
                        : "border border-slate-300 text-slate-800 hover:border-orange-300 hover:text-orange-600"
                    }`}
                  >
                    {vehicleType === vehicle.value ? "Selected" : "Choose Vehicle"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
              Popular Routes
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Fast booking for frequently travelled routes across Chhattisgarh.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularRoutes.map((route) => (
              <Link
                key={route.title}
                href={route.link}
                className="group rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:ring-orange-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{route.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">Starting fare {route.fare}</p>
                  </div>
                  <ArrowRight className="text-slate-400 transition group-hover:text-orange-500" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 py-14 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-2xl font-black md:text-3xl">What Customers Say</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Trusted by families, business travellers and airport transfer customers.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="mb-3 flex items-center gap-1 text-orange-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm leading-7 text-slate-200">“{item.review}”</p>
                  <div className="mt-4 text-sm font-bold text-white">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.city}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                <Gift size={14} />
                Why book with us
              </div>

              <h2 className="mt-4 text-2xl font-black text-slate-900 md:text-3xl">
                Taxi service designed for quick booking
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  "Instant ticket-style fare estimate",
                  "WhatsApp confirmation support",
                  "One way, local and round trip options",
                  "Business, family and airport travel",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 text-orange-500" size={18} />
                    <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-4xl bg-linear-to-br from-orange-500 to-amber-500 p-6 text-white shadow-xl md:p-8">
              <h2 className="text-2xl font-black md:text-3xl">Need quick booking help?</h2>
              <p className="mt-3 text-sm leading-7 text-orange-50">
                Call now or message on WhatsApp for fast confirmation and vehicle availability.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href="tel:9244137353"
                  onClick={trackCallConversion}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-bold text-orange-600"
                >
                  <Phone size={18} />
                  Call 9244137353
                </a>

                <a
                  href={whatsappUrl}
                  onClick={openReviewPopup}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/40 px-5 py-4 font-bold text-white"
                >
                  <MessageCircle size={18} />
                  Book on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 md:text-3xl">FAQs</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Common booking questions from our customers.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <h3 className="text-lg font-bold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showFarePopup && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-slate-950/70 p-2 sm:p-4">
          <div
            ref={farePopupRef}
            role="dialog"
            aria-modal="true"
            aria-label="Lowest Fare Available"
            className="relative flex max-h-[96vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={closeFarePopup}
              className="absolute right-3 top-3 z-20 rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
              aria-label="Close fare popup"
            >
              <X size={16} />
            </button>

            <div className="bg-slate-950 px-4 py-4 text-white sm:px-5 sm:py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300 sm:text-[11px]">
                    <Ticket size={14} />
                    Fare Estimate Ticket
                  </div>
                  <h3 className="mt-2 text-[clamp(1.05rem,2vw,1.6rem)] font-black leading-tight">
                    {tripLabelMap[bookingType]}
                  </h3>
                </div>

                <div className="shrink-0 rounded-2xl bg-orange-500 px-3 py-2 text-right sm:px-4 sm:py-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-orange-100 sm:text-[11px]">
                    Estimated Fare
                  </div>
                  <div className="text-lg font-black leading-none sm:text-2xl">
                    {formatCurrency(displayFare)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.10),transparent_36%)] p-3 sm:p-4 md:p-5">
              <div className="grid gap-3 md:grid-cols-[1.08fr_0.92fr]">
                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 text-orange-500" size={18} />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
                          Route
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-900 sm:text-[15px]">
                          {pickup || "-"}
                        </p>
                        <div className="my-2 h-px w-full bg-slate-200" />
                        <p className="break-words text-sm font-semibold leading-6 text-slate-900 sm:text-[15px]">
                          {drop || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                      <div className="flex items-center gap-2 text-orange-500">
                        <CalendarDays size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
                          Pickup
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-slate-900 sm:text-[15px]">
                        {formatDisplayDate(pickupDate)}
                      </p>
                      <p className="text-[12px] text-slate-600 sm:text-sm">
                        {formatDisplayTime(pickupTime)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                      <div className="flex items-center gap-2 text-orange-500">
                        <Clock4 size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
                          Vehicle
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-slate-900 sm:text-[15px]">
                        {selectedVehicle}
                      </p>
                     
                    </div>
                  </div>

                  {isRoundTrip && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                        <div className="flex items-center gap-2 text-orange-500">
                          <CalendarDays size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
                            Return
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-bold text-slate-900 sm:text-[15px]">
                          {formatDisplayDate(returnDate)}
                        </p>
                        <p className="text-[12px] text-slate-600 sm:text-sm">
                          {formatDisplayTime(returnTime)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-100 sm:p-4">
                        <div className="flex items-center gap-2 text-orange-600">
                          <Building2 size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-700 sm:text-xs">
                            Duration
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-black text-slate-900 sm:text-[15px]">
                          {totalDaysDisplay} Day(s) / {totalNightsDisplay} Night(s)
                        </p>
                        <p className="text-[12px] text-slate-600 sm:text-sm">
                          Vehicle booked for full trip duration
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-950 p-5 text-white">
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-widest text-orange-300">
                        Estimated Fare
                      </div>
                      <div className="mt-2 text-4xl font-black text-orange-400">
                        {formatCurrency(displayFare)}
                      </div>
                      <div className="mt-2 text-sm text-slate-300">{selectedVehicle}</div>
                      <div className="mt-1 text-sm text-slate-400">{displayDistance} KM</div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-950 p-4 text-white sm:p-5">
                    <div className="grid gap-2.5 sm:gap-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-[12px] text-slate-300 sm:text-sm">
                          <Route size={15} />
                          Net Distance
                        </span>
                        <span className="text-[12px] font-bold sm:text-sm">
                          {displayDistance} KM
                        </span>
                      </div>

                      {isRoundTrip && (
                        <>
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 text-[12px] text-slate-300 sm:text-sm">
                              <CalendarDays size={15} />
                              Total Days
                            </span>
                            <span className="text-[12px] font-bold sm:text-sm">
                              {totalDaysDisplay}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 text-[12px] text-slate-300 sm:text-sm">
                              <MoonStar size={15} />
                              Total Nights
                            </span>
                            <span className="text-[12px] font-bold sm:text-sm">
                              {totalNightsDisplay}
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-[12px] text-slate-300 sm:text-sm">
                          <Users size={15} />
                          Passengers
                        </span>
                        <span className="text-[12px] font-bold sm:text-sm">
                          {passengerCount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-[12px] text-slate-300 sm:text-sm">
                          <CarTaxiFront size={15} />
                          Trip
                        </span>
                        <span className="text-[12px] font-bold sm:text-sm">
                          {tripLabelMap[bookingType]}
                        </span>
                      </div>

                      <div className="h-px bg-white/10" />

                      <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
                        <div className="space-y-2 text-sm text-slate-700">
                          <div>✓ Transparent Fare</div>
                          <div>✓ Verified Driver</div>
                          <div>✓ Instant Confirmation</div>
                          <div>✓ Toll & Parking Extra</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <p className="font-bold text-slate-900">🔥 Limited Vehicles Available</p>
                <p className="mt-1 text-sm text-slate-600">
                  Book now on WhatsApp to confirm vehicle availability and final fare.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 mt-3 grid gap-2 bg-white/95 pb-1 pt-2 backdrop-blur sm:grid-cols-2">
              <a
                href={whatsappUrl}
                onClick={openReviewPopup}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                <MessageCircle size={16} />
                Confirm Booking
              </a>

              <button
                type="button"
                onClick={handleRecalculate}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-orange-300 hover:text-orange-600"
              >
                Modify Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewPopup && (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-slate-950/70 p-4">
          <div
            ref={popupRef}
            role="dialog"
            aria-modal="true"
            aria-label="Review request"
            className="relative w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={closeReviewPopup}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
              aria-label="Close popup"
            >
              <X size={18} />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Star size={26} />
            </div>

            <h3 className="mt-4 text-2xl font-black text-slate-900">
              Please rate your experience
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Before continuing to WhatsApp booking, please share a quick Google review. Your support helps us serve more customers.
            </p>

            <div className="mt-6 grid gap-3">
              <a
                href={GOOGLE_REVIEW_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-13 items-center justify-center rounded-2xl bg-orange-500 px-6 py-4 text-center font-bold text-white transition hover:bg-orange-600"
              >
                Give Google Review
              </a>

              <button
                type="button"
                onClick={continueToWhatsApp}
                className="inline-flex min-h-13 items-center justify-center rounded-2xl border border-slate-300 px-6 py-4 text-center font-bold text-slate-800 transition hover:border-orange-300 hover:text-orange-600"
              >
                Continue to WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
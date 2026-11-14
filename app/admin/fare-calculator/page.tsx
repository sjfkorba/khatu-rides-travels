"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  calculateFare,
  inferRouteClassification,
  VEHICLES,
  type BookingType,
  type VehicleType,
  type LocalPackageType,
} from "@/lib/fareCalculator";
import {
  chooseBestAutomaticPromotion,
  type FarePromotion,
} from "@/lib/fare-promotions";
import { auth, db } from "@/lib/firebase";
import {
  Calculator,
  MapPin,
  CalendarDays,
  Clock3,
  Route,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";

type FestivalRecord = {
  id: string;
  name: string;
  increasePercent: number;
  startAt: string;
  endAt: string;
  isActive: boolean;
};
type CouponRecord = {
  id: string;
  code: string;
  from: string;
  to: string;
  fromNormalized?: string;
  toNormalized?: string;
  discountPercent: number;
  startAt: string;
  endAt: string;
  isActive: boolean;
};
type PickupLocationFareRule = {
  id: string;
  pickupLocation: string;
  pickupNormalized?: string;
  increasePercent: number;
  isActive: boolean;
  startedAt?: any;
  expiresAt: any;
};

const VEHICLE_ORDER: VehicleType[] = ["sedan", "ertiga", "crysta"];
const B2B_RATE_SLABS: Record<VehicleType, { upTo150: number; upTo300: number; above300: number }> = {
  sedan: { upTo150: 12, upTo300: 10.5, above300: 10 },
  ertiga: { upTo150: 14, upTo300: 12.5, above300: 12 },
  crysta: { upTo150: 17, upTo300: 15.5, above300: 15 },
};
const LOCAL_B2B_PACKAGE_RATES: Record<VehicleType, Record<LocalPackageType, number>> = {
  sedan: { "4hr40km": 500, "8hr80km": 800, "12hr120km": 1100 },
  ertiga: { "4hr40km": 650, "8hr80km": 950, "12hr120km": 1300 },
  crysta: { "4hr40km": 900, "8hr80km": 1300, "12hr120km": 1750 },
};
const LOCAL_PACKAGES: { id: LocalPackageType; label: string; kms: number }[] = [
  { id: "4hr40km", label: "4 Hr / 40 KM", kms: 40 },
  { id: "8hr80km", label: "8 Hr / 80 KM", kms: 80 },
  { id: "12hr120km", label: "12 Hr / 120 KM", kms: 120 },
];

const normalizePlace = (value: string) => value.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
const pickupLocationKey = (value: string) => normalizePlace(value)
  .split(",")[0]
  .replace(/\b(city|district)\b/g, "")
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim();
const roundFare = (value: number) => Math.max(0, Math.round(value / 100) * 100);
const ceilFare = (value: number) => Math.max(0, Math.ceil(value / 100) * 100);
const inValidity = (start: string, end: string, date: string) => {
  const journey = new Date(`${date}T12:00:00`).getTime();
  return Number.isFinite(journey) && journey >= new Date(start).getTime() && journey <= new Date(end).getTime();
};
const timestampMillis = (value: any): number => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};
const money = (value: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(Math.round(value));
const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

function getB2BRate(vehicleType: VehicleType, billedKm: number) {
  const slab = B2B_RATE_SLABS[vehicleType];
  if (billedKm <= 150) return slab.upTo150;
  if (billedKm <= 300) return slab.upTo300;
  return slab.above300;
}

function normalizeSuggestions(data: any): string[] {
  const rows = data?.predictions ?? data?.results ?? data?.suggestions ?? [];
  if (!Array.isArray(rows)) return [];
  return rows.map((item: any) => typeof item === "string" ? item : item?.description ?? item?.formatted_address ?? item?.text?.text ?? "")
    .filter(Boolean).slice(0, 6);
}

export default function AdminFareCalculatorPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
  const [activeSuggestions, setActiveSuggestions] = useState<"pickup" | "drop" | null>(null);
  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  const [pickupDate, setPickupDate] = useState(today());
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("18:00");
  const [localPackage, setLocalPackage] = useState<LocalPackageType>("8hr80km");
  const [sharedPassengerCount, setSharedPassengerCount] = useState(1);
  const [sharedDepartureTime, setSharedDepartureTime] = useState("06:00");
  const [distanceFallback, setDistanceFallback] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!mounted) return;
      if (user) setAuthReady(true);
      else {
        setAuthReady(false);
        router.replace("/admin/login");
      }
    });
    return () => { mounted = false; unsubscribe(); };
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    const value = pickup.trim();
    if (value.length < 2 || activeSuggestions !== "pickup") { setPickupSuggestions([]); return; }
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/places-autocomplete?input=${encodeURIComponent(value)}`, { cache: "no-store" });
        const data = await response.json();
        if (!cancelled && response.ok) setPickupSuggestions(normalizeSuggestions(data));
      } catch { if (!cancelled) setPickupSuggestions([]); }
    }, 250);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [pickup, activeSuggestions]);

  useEffect(() => {
    let cancelled = false;
    const value = drop.trim();
    if (value.length < 2 || activeSuggestions !== "drop") { setDropSuggestions([]); return; }
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/places-autocomplete?input=${encodeURIComponent(value)}`, { cache: "no-store" });
        const data = await response.json();
        if (!cancelled && response.ok) setDropSuggestions(normalizeSuggestions(data));
      } catch { if (!cancelled) setDropSuggestions([]); }
    }, 250);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [drop, activeSuggestions]);

  const mapSrc = useMemo(() => {
    const origin = encodeURIComponent(pickup);
    const destination = encodeURIComponent(drop);
    if (bookingType === "local" || !destination) return `https://www.google.com/maps?q=${origin}&output=embed`;
    return `https://www.google.com/maps?output=embed&saddr=${origin}&daddr=${destination}`;
  }, [pickup, drop, bookingType]);

  const calculate = async () => {
    setError("");
    if (!pickup.trim() || (bookingType !== "local" && !drop.trim())) {
      setError("Please enter pickup and drop locations.");
      return;
    }
    if (!pickupDate || (bookingType !== "shared" && !pickupTime)) {
      setError("Please select pickup date and time.");
      return;
    }
    if (bookingType === "roundtrip" && (!returnDate || !returnTime || returnDate < pickupDate)) {
      setError("Please select a valid return date and time.");
      return;
    }
    if (bookingType === "shared" && pickupDate < (() => { const d = new Date(); d.setDate(d.getDate() + 7); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); })()) {
      setError("KR-SHARED booking ke liye journey date kam-se-kam 7 din advance honi chahiye.");
      return;
    }

    setLoading(true);
    try {
      let distanceKm = bookingType === "local"
        ? LOCAL_PACKAGES.find((x) => x.id === localPackage)!.kms
        : distanceFallback;

      if (bookingType !== "local") {
        const response = await fetch("/api/distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origin: pickup.trim(), destination: drop.trim() }),
        });
        const data = await response.json();
        if (response.ok && Number(data?.distanceKm) > 0) distanceKm = Number(data.distanceKm);
        else if (!response.ok) throw new Error(data?.error || "Route calculate nahi ho paya.");
      }

      const oneWayDiscountEligible = bookingType !== "oneway" || distanceKm >= 70;
      const [festivalSnapshot, couponSnapshot, pickupRuleSnapshot] = await Promise.all([
        getDocs(collection(db, "festival_fares")),
        getDocs(collection(db, "route_coupons")),
        getDocs(collection(db, "pickup_location_fare_rules")),
      ]);
      const festivals = festivalSnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FestivalRecord));
      // Load route coupons exactly as Customer Portal does. They remain available for
      // manual customer application and are not silently auto-applied to this quote.
      const coupons = couponSnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CouponRecord));
      void coupons;
      const now = Date.now();
      const pickupNormalized = pickupLocationKey(pickup);
      const activePickupRule = pickupRuleSnapshot.docs
        .map((d) => ({ id: d.id, ...d.data() } as PickupLocationFareRule))
        .filter((rule) => {
          const ruleLocation = pickupLocationKey(rule.pickupNormalized || rule.pickupLocation || "");
          const startsAt = rule.startedAt ? timestampMillis(rule.startedAt) : 0;
          const expiresAt = timestampMillis(rule.expiresAt);
          return rule.isActive === true && Number(rule.increasePercent) > 0 && Number(rule.increasePercent) <= 100 &&
            startsAt <= now && expiresAt > now && Boolean(ruleLocation) && ruleLocation === pickupNormalized;
        })
        .sort((a, b) => Number(b.increasePercent) - Number(a.increasePercent))[0] || null;

      const activeFestival = bookingType === "shared" ? null : festivals
        .filter((x) => x.isActive && Number(x.increasePercent) > 0 && inValidity(x.startAt, x.endAt, pickupDate))
        .sort((a, b) => Number(b.increasePercent) - Number(a.increasePercent))[0] || null;

      let autoCampaigns: FarePromotion[] = [];
      if (bookingType !== "shared") {
        const campaignQuery = new URLSearchParams({
          bookingType,
          pickupDate,
          pickupTime,
          pickup,
          drop,
        });
        const campaignResponse = await fetch(`/api/fare-promotions?${campaignQuery.toString()}`, { cache: "no-store" });
        const campaignData = await campaignResponse.json();
        if (!campaignResponse.ok || campaignData.success !== true) {
          throw new Error(campaignData.error || "Discount campaigns load nahi ho paye.");
        }
        autoCampaigns = oneWayDiscountEligible && Array.isArray(campaignData.campaigns)
          ? campaignData.campaigns as FarePromotion[] : [];
      }

      const engineBookingType: BookingType = bookingType;
      const next = VEHICLE_ORDER.map((vehicleType) => {
        const result = calculateFare({
          distance: distanceKm,
          vehicleType,
          bookingType: engineBookingType,
          serviceType: bookingType === "local" ? "local" : "outstation",
          pickup,
          drop,
          routeClassification: inferRouteClassification({ pickup, drop }),
          pickupDate,
          pickupTime: bookingType === "shared" ? sharedDepartureTime : pickupTime,
          bookingDate: today(),
          returnDate: bookingType === "roundtrip" ? returnDate : undefined,
          returnTime: bookingType === "roundtrip" ? returnTime : undefined,
          localPackage,
          sharedPassengerCount: bookingType === "shared" ? sharedPassengerCount : undefined,
          sharedDepartureTime: bookingType === "shared" ? sharedDepartureTime : undefined,
        });

        // Keep the same Customer Portal sequence: engine -> restore discount only
        // for pickup surge -> festival -> pickup margin floor -> automatic campaign.
        const engineFareAfterNight = Number(result.finalFare || 0);
        const engineNightSurchargeAmount = Number(result.nightSurchargeAmount || 0);
        const engineBaseDiscountPercent = Number(result.baseDiscountPercent ?? (oneWayDiscountEligible ? 10 : 0));
        const engineBaseDiscountAmount = Number(result.baseDiscountAmount || 0);
        const nightSurchargePercent = Number(result.nightSurchargePercent || 0);
        const undiscountedBaseFare = activePickupRule
          ? Math.max(0, engineFareAfterNight - engineNightSurchargeAmount + engineBaseDiscountAmount)
          : Math.max(0, engineFareAfterNight - engineNightSurchargeAmount);
        const nightSurchargeAmount = activePickupRule
          ? Math.round(undiscountedBaseFare * nightSurchargePercent / 100)
          : engineNightSurchargeAmount;
        const fareAfterNight = activePickupRule
          ? undiscountedBaseFare + nightSurchargeAmount
          : engineFareAfterNight;
        const baseDiscountPercent = activePickupRule ? 0 : engineBaseDiscountPercent;
        const baseDiscountAmount = activePickupRule ? 0 : engineBaseDiscountAmount;
        const discountedBaseFare = Math.max(0, fareAfterNight - nightSurchargeAmount);
        const baseFare = discountedBaseFare + baseDiscountAmount;
        const festivalPercent = activeFestival ? Number(activeFestival.increasePercent) : 0;
        const festivalRawAmount = fareAfterNight * festivalPercent / 100;
        const festivalAdjustedFare = bookingType === "shared"
          ? fareAfterNight
          : activePickupRule
            ? ceilFare(fareAfterNight + festivalRawAmount)
            : roundFare(fareAfterNight + festivalRawAmount);
        const locationIncreasePercent = activePickupRule ? Number(activePickupRule.increasePercent) : 0;
        const locationPercentageFare = activePickupRule
          ? ceilFare(festivalAdjustedFare * (1 + locationIncreasePercent / 100))
          : festivalAdjustedFare;
        const vendorCostForMargin = Number(result.b2bMaxFare ?? result.b2bMinFare);
        const hasVendorCost = Number.isFinite(vendorCostForMargin) && vendorCostForMargin > 0;
        const locationMarginFloor = activePickupRule && hasVendorCost ? ceilFare(vendorCostForMargin + 500) : 0;
        const pickupLocationMinimumFare = activePickupRule
          ? Math.max(locationPercentageFare, locationMarginFloor)
          : festivalAdjustedFare;
        const bestCampaign = activePickupRule || bookingType === "shared" ? null : chooseBestAutomaticPromotion(autoCampaigns, {
          bookingType,
          pickupDate,
          pickupTime,
          pickup,
          drop,
          fare: festivalAdjustedFare,
        });
        const campaignDiscount = bestCampaign?.discountAmount || 0;
        const campaignDiscountedFare = bestCampaign ? Math.max(0, festivalAdjustedFare - campaignDiscount) : festivalAdjustedFare;
        const campaignFinalFare = activePickupRule
          ? Math.max(campaignDiscountedFare, pickupLocationMinimumFare)
          : campaignDiscountedFare;

        const b2cFinalFare = Math.max(0, Number(campaignFinalFare || 0));
        const billedKm = Math.max(0, Number(result.billedDistance || distanceKm));
        const b2bRate = getB2BRate(vehicleType, billedKm);
        const b2b = bookingType === "local"
          ? LOCAL_B2B_PACKAGE_RATES[vehicleType][localPackage]
          : Math.round(billedKm * b2bRate);

        return {
          vehicleType,
          label: VEHICLES[vehicleType].label,
          distance: Number(result.billedDistance || distanceKm),
          durationMinutes: Number(result.durationMinutes || 0),
          b2cFinalFare,
          b2cMin: b2cFinalFare,
          b2cMax: b2cFinalFare,
          b2b,
          estimatedMarginAtMin: Math.max(0, b2cFinalFare - b2b),
          estimatedMarginAtMax: Math.max(0, b2cFinalFare - b2b),
          rawFare: Number(result.finalFare || 0),
          baseFare,
          baseDiscountPercent,
          baseDiscountAmount,
          nightSurchargePercent,
          nightSurchargeAmount,
          festivalPercent,
          festivalAmount: festivalAdjustedFare - fareAfterNight,
          festivalName: activeFestival?.name || "",
          pickupLocationRuleApplied: Boolean(activePickupRule),
          pickupLocationName: activePickupRule?.pickupLocation || "",
          pickupLocationIncreasePercent: locationIncreasePercent,
          pickupLocationMarginFloor: locationMarginFloor,
          campaignId: bestCampaign?.campaign.id || "",
          campaignName: bestCampaign?.campaign.name || "",
          campaignDiscountAmount: Math.max(0, festivalAdjustedFare - campaignFinalFare),
          routeClassification: result.routeClassification || inferRouteClassification({ pickup, drop }),
          sharedPerPersonFare: result.sharedPerPersonFare,
          sharedTotalFare: result.sharedTotalFare,
          sharedPolicy: result.sharedPolicy,
        };
      });

      if (bookingType === "shared" && !next[0]?.sharedPolicy?.routeEligible) {
        throw new Error("KR-SHARED केवल Korba, Bilaspur और Raipur के बीच approved routes पर उपलब्ध है।");
      }

      const payload = {
        pickup,
        drop: bookingType === "local" ? "" : drop,
        bookingType,
        serviceType: bookingType === "local" ? "local" : "outstation",
        pickupDate,
        pickupTime: bookingType === "shared" ? sharedDepartureTime : pickupTime,
        returnDate,
        returnTime,
        distance: distanceKm,
        results: next,
      };
      const params = new URLSearchParams({
        pickup: payload.pickup,
        drop: payload.drop,
        bookingType,
        serviceType: payload.serviceType,
        distance: String(distanceKm),
        pickupDate,
        pickupTime: payload.pickupTime,
        returnDate,
        returnTime,
        results: JSON.stringify(next),
      });
      router.push(`/admin/fare-calculator/results?${params.toString()}`);
    } catch (e: any) {
      console.error("Admin fare calculation failed:", e);
      setError(e?.message || "Fare calculate nahi ho paya. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!authReady) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <LoaderCircle className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-900" />
        <p className="font-bold">Checking admin login…</p>
      </div>
    </main>;
  }

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950 text-white"><Calculator className="h-5 w-5" /></div>
        <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">Khatu Rides · Admin</p><h1 className="text-xl font-black">Fare Calculator</h1></div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800"><ShieldCheck className="h-4 w-4" /> Admin only</span>
      </div>
    </header>

    <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black">Trip details</h2>
        <p className="mt-1 text-sm text-slate-500">Customer Portal ke same route aur fare engine ke through quote calculate karein.</p>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(["oneway", "roundtrip", "local", "shared"] as BookingType[]).map((type) => <button key={type} type="button" onClick={() => { setBookingType(type); setError(""); }} className={`rounded-xl px-2 py-3 text-xs font-extrabold capitalize ${bookingType === type ? "bg-blue-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{type === "oneway" ? "One Way" : type === "roundtrip" ? "Round Trip" : type === "shared" ? "KR-SHARED" : "Local"}</button>)}
        </div>

        <div className="mt-5 space-y-4">
          <div className="relative">
            <label className="mb-1.5 block text-xs font-bold text-slate-700">Pickup location</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3"><MapPin className="h-4 w-4 shrink-0 text-emerald-600" /><input value={pickup} onFocus={() => setActiveSuggestions("pickup")} onChange={(e) => setPickup(e.target.value)} placeholder="City, State, India" className="w-full min-w-0 py-3 text-sm outline-none" /></div>
            {activeSuggestions === "pickup" && pickupSuggestions.length > 0 && <div className="absolute z-30 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">{pickupSuggestions.map((s, i) => <button key={`${s}-${i}`} type="button" onClick={() => { setPickup(s); setPickupSuggestions([]); setActiveSuggestions(null); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm hover:bg-blue-50">{s}</button>)}</div>}
          </div>

          {bookingType !== "local" && <div className="relative">
            <label className="mb-1.5 block text-xs font-bold text-slate-700">Drop location</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3"><MapPin className="h-4 w-4 shrink-0 text-rose-600" /><input value={drop} onFocus={() => setActiveSuggestions("drop")} onChange={(e) => setDrop(e.target.value)} placeholder="City, State, India" className="w-full min-w-0 py-3 text-sm outline-none" /></div>
            {activeSuggestions === "drop" && dropSuggestions.length > 0 && <div className="absolute z-30 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">{dropSuggestions.map((s, i) => <button key={`${s}-${i}`} type="button" onClick={() => { setDrop(s); setDropSuggestions([]); setActiveSuggestions(null); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm hover:bg-blue-50">{s}</button>)}</div>}
          </div>}

          {bookingType === "local" && <div><label className="mb-1.5 block text-xs font-bold text-slate-700">Local package</label><select value={localPackage} onChange={(e) => setLocalPackage(e.target.value as LocalPackageType)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">{LOCAL_PACKAGES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select></div>}

          {bookingType === "shared" && <div><label className="mb-1.5 block text-xs font-bold text-slate-700">Passengers</label><input type="number" min={1} max={6} value={sharedPassengerCount} onChange={(e) => setSharedPassengerCount(Math.max(1, Math.min(6, Number(e.target.value) || 1)))} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></div>}

          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-700"><CalendarDays className="h-3.5 w-3.5" /> Pickup date</label><input type="date" value={pickupDate} min={bookingType === "shared" ? (() => { const d = new Date(); d.setDate(d.getDate() + 7); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); })() : today()} onChange={(e) => setPickupDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></div>
            <div><label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-700"><Clock3 className="h-3.5 w-3.5" /> Pickup time</label>{bookingType === "shared" ? <select value={sharedDepartureTime} onChange={(e) => setSharedDepartureTime(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="06:00">06:00 AM</option><option value="08:00">08:00 AM</option><option value="16:00">04:00 PM</option><option value="18:00">06:00 PM</option></select> : <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" />}</div>
          </div>

          {bookingType === "roundtrip" && <div className="grid grid-cols-2 gap-3"><div><label className="mb-1.5 block text-xs font-bold text-slate-700">Return date</label><input type="date" min={pickupDate} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></div><div><label className="mb-1.5 block text-xs font-bold text-slate-700">Return time</label><input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></div></div>}

          {bookingType !== "local" && <div><div className="mb-2 flex items-center justify-between"><label className="text-xs font-bold text-slate-700">Distance fallback</label><span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black">{distanceFallback} km</span></div><input type="range" min={10} max={1000} step={5} value={distanceFallback} onChange={(e) => setDistanceFallback(Number(e.target.value))} className="w-full accent-blue-950" /><p className="mt-1 text-[11px] text-slate-500">Google route distance API available hone par actual route distance use hoga.</p></div>}
        </div>

        {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <button type="button" onClick={calculate} disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-4 text-sm font-black text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Calculating…</> : <><Calculator className="h-4 w-4" /> Calculate B2C & B2B Fare</>}</button>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4"><Route className="h-5 w-5 text-blue-900" /><div><h2 className="font-black">Route preview</h2><p className="text-xs text-slate-500">Google Maps route overview</p></div></div>
        <iframe title="Google Maps route preview" src={mapSrc} className="h-[420px] w-full border-0 bg-slate-100" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        <div className="grid grid-cols-2 gap-3 p-4 text-sm"><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pickup</p><p className="mt-1 break-words font-bold">{pickup || "Not selected"}</p></div><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Drop</p><p className="mt-1 break-words font-bold">{bookingType === "local" ? "Local package" : drop || "Not selected"}</p></div></div>
      </section>
    </div>
  </main>;
}

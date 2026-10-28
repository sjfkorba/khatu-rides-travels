"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Calculator, CarFront, CheckCircle2, Clock3, LockKeyhole,
  MapPin, Minus, Plus, RefreshCw, Route, ShieldCheck, Wallet,
} from "lucide-react";
import {
  calculateFare,
  VEHICLES,
  type BookingType,
  type VehicleType,
  type ServiceType,
  type LocalPackageType,
} from "@/lib/fareCalculator";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const POPULAR_HUBS = [
  "Raipur", "Korba", "Raigarh", "Champa", "Durg", "Bhilai",
  "Bilaspur", "Jharsuguda", "Sambalpur", "Jagdalpur", "Kharsia", "Nagpur",
];
const VEHICLE_ORDER: VehicleType[] = ["sedan", "ertiga", "crysta"];
const INR = (amount: number) => `₹${Math.round(amount).toLocaleString("en-IN")}`;

function cityPart(value: string) {
  // Google Places normally returns "City, State, Country". Compare the first part,
  // but also remove punctuation and repeated whitespace to tolerate formatting differences.
  return (value.split(",")[0] || "").trim().toLocaleLowerCase("en-IN").replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, " ");
}
function isPopularHub(value: string) {
  const city = cityPart(value);
  return POPULAR_HUBS.some((hub) => city === cityPart(hub));
}
function normalizeSuggestions(data: any): string[] {
  const rows = data?.predictions ?? data?.results ?? data?.suggestions ?? [];
  if (!Array.isArray(rows)) return [];
  return rows.map((item: any) => typeof item === "string" ? item : item?.description ?? item?.formatted_address ?? item?.text?.text ?? "").filter(Boolean).slice(0, 6);
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
  const [serviceType, setServiceType] = useState<ServiceType>("outstation");
  const [distance, setDistance] = useState(100);
  const [nightCharge, setNightCharge] = useState(0);
  const [remoteAdjustment, setRemoteAdjustment] = useState(0);
  const [localPackage, setLocalPackage] = useState<LocalPackageType>("8hr80km");
  const [journeyDate, setJourneyDate] = useState("");
  const [journeyTime, setJourneyTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("18:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [resolvedDistance, setResolvedDistance] = useState<number | null>(null);

  useEffect(() => {
    // Use the same Firebase Authentication session created by /admin/login.
    // Do not require a Firebase custom claim here: if the admin account has
    // successfully signed in but has no `admin: true` claim, that extra check
    // would immediately send the user back to the login page.
    let mounted = true;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!mounted) return;

      if (user) {
        setAuthReady(true);
        return;
      }

      setAuthReady(false);
      router.replace("/admin/login");
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    const value = pickup.trim();
    if (value.length < 2 || (activeSuggestions !== "pickup")) { setPickupSuggestions([]); return; }
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
    if (value.length < 2 || (activeSuggestions !== "drop")) { setDropSuggestions([]); return; }
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/places-autocomplete?input=${encodeURIComponent(value)}`, { cache: "no-store" });
        const data = await response.json();
        if (!cancelled && response.ok) setDropSuggestions(normalizeSuggestions(data));
      } catch { if (!cancelled) setDropSuggestions([]); }
    }, 250);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [drop, activeSuggestions]);

  const pickupPopular = useMemo(() => isPopularHub(pickup), [pickup]);
  const dropPopular = useMemo(() => isPopularHub(drop), [drop]);
  const nonPopularRoute = !pickupPopular || !dropPopular;

  const calculate = async () => {
    setError("");
    if (!pickup.trim() || (serviceType !== "local" && !drop.trim())) {
      setError("Please enter pickup and drop locations."); return;
    }
    setLoading(true);
    try {
      let km = serviceType === "local" ? 80 : distance;
      if (serviceType !== "local") {
        try {
          const response = await fetch("/api/distance", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ origin: pickup.trim(), destination: drop.trim() }),
          });
          const data = await response.json();
          if (response.ok && Number(data?.distanceKm) > 0) km = Math.round(Number(data.distanceKm));
        } catch { /* Use the admin-adjustable distance slider as fallback. */ }
      }
      setResolvedDistance(km);
      const next = VEHICLE_ORDER.map((vehicleType) => {
        const result = calculateFare({
          distance: km,
          vehicleType,
          bookingType: serviceType === "local" ? "local" : bookingType,
          serviceType,
          pickupDate: journeyDate,
          pickupTime: journeyTime,
          returnDate: bookingType === "roundtrip" ? returnDate : "",
          returnTime: bookingType === "roundtrip" ? returnTime : "",
          pickup: pickup.trim(), drop: drop.trim(), localPackage,
        });
        const base = result.finalFare;
        const b2cMinBase = result.b2cMinFare ?? Math.max(0, base - 100);
        const b2cMaxBase = result.b2cMaxFare ?? base;
        const hubMultiplier = nonPopularRoute && serviceType !== "local" ? 1.2 : 1;
        const additions = nightCharge + remoteAdjustment;
        const b2cMin = Math.round(b2cMinBase * hubMultiplier + additions);
        const b2cMax = Math.round(b2cMaxBase * hubMultiplier + additions);
        // One-way B2B estimate removes the existing ₹200–₹300 B2C margin from the
        // same pre-margin base. For other trip modes this is a provisional internal
        // estimate (final vendor cost should be confirmed before quoting).
        const b2bBase = result.b2cMinFare != null
          ? Math.max(0, result.b2cMinFare - 200)
          : Math.max(0, base - 300);
        const b2b = Math.round(b2bBase * hubMultiplier + additions);
        return {
          vehicleType, label: VEHICLES[vehicleType].label,
          distance: result.billedDistance || km,
          durationMinutes: result.durationMinutes,
          b2cMin, b2cMax, b2b,
          estimatedMarginAtMin: Math.max(0, b2cMin - b2b),
          estimatedMarginAtMax: Math.max(0, b2cMax - b2b),
          rawFare: base,
        };
      });
      setResults(next);
    } catch (e) {
      console.error(e); setError("Fare calculate nahi ho paya. Please try again.");
    } finally { setLoading(false); }
  };

  if (!authReady) return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><div className="rounded-2xl border bg-white p-6 text-center shadow-sm"><LockKeyhole className="mx-auto mb-3 h-8 w-8 text-blue-800"/><p className="font-bold text-slate-800">Checking admin login…</p></div></main>;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-white sm:h-11 sm:w-11 sm:rounded-2xl"><Calculator className="h-5 w-5 sm:h-6 sm:w-6"/></div><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-orange-600 sm:text-xs sm:tracking-[0.18em]">Khatu Rides · Internal Tool</p><h1 className="text-base font-black leading-tight sm:text-2xl">Admin Fare Calculator</h1></div></div>
          <button onClick={() => router.push("/admin")} className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-bold hover:bg-slate-50 sm:gap-2 sm:px-4 sm:text-sm"><ArrowLeft className="h-4 w-4"/><span className="hidden sm:inline">Admin Dashboard</span><span className="sm:hidden">Dashboard</span></button>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-2 text-[11px] font-bold text-emerald-800 sm:gap-2 sm:px-3 sm:text-xs"><ShieldCheck className="h-4 w-4"/> Admin Only</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-8">
        <section className="h-fit min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-6">
          <div className="mb-5"><h2 className="text-lg font-black">Trip details</h2><p className="mt-1 text-sm text-slate-500">Google Maps location suggestions ke saath route select karein.</p></div>
          <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
            {([{ id: "oneway", label: "One Way" }, { id: "roundtrip", label: "Round Trip" }, { id: "local", label: "Local" }] as const).map((item) => <button key={item.id} onClick={() => { setBookingType(item.id); setServiceType(item.id === "local" ? "local" : "outstation"); setResults(null); }} className={`rounded-xl px-1.5 py-3 text-xs font-extrabold transition sm:px-2 sm:text-sm ${bookingType === item.id ? "bg-blue-950 text-white shadow" : "text-slate-600 hover:bg-white"}`}>{item.label}</button>)}
          </div>
          <div className="space-y-4">
            <div className="relative"><label className="mb-1.5 block text-sm font-bold text-slate-700">Pickup location</label><div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3"><MapPin className="h-5 w-5 shrink-0 text-emerald-600"/><input value={pickup} onFocus={() => setActiveSuggestions("pickup")} onChange={(e) => { setPickup(e.target.value); setResults(null); }} placeholder="e.g. Raipur, Chhattisgarh, India" className="min-w-0 w-full bg-transparent py-3.5 text-sm outline-none"/></div>{activeSuggestions === "pickup" && pickupSuggestions.length > 0 && <div className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-2xl border bg-white p-1 shadow-xl">{pickupSuggestions.map((s, i) => <button key={`${s}-${i}`} onClick={() => { setPickup(s); setPickupSuggestions([]); setActiveSuggestions(null); }} className="block w-full rounded-xl px-3 py-3 text-left text-sm hover:bg-blue-50">{s}</button>)}</div>}</div>
            {serviceType !== "local" && <div className="relative"><label className="mb-1.5 block text-sm font-bold text-slate-700">Drop location</label><div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3"><MapPin className="h-5 w-5 shrink-0 text-rose-600"/><input value={drop} onFocus={() => setActiveSuggestions("drop")} onChange={(e) => { setDrop(e.target.value); setResults(null); }} placeholder="e.g. Korba, Chhattisgarh, India" className="min-w-0 w-full bg-transparent py-3.5 text-sm outline-none"/></div>{activeSuggestions === "drop" && dropSuggestions.length > 0 && <div className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-2xl border bg-white p-1 shadow-xl">{dropSuggestions.map((s, i) => <button key={`${s}-${i}`} onClick={() => { setDrop(s); setDropSuggestions([]); setActiveSuggestions(null); }} className="block w-full rounded-xl px-3 py-3 text-left text-sm hover:bg-blue-50">{s}</button>)}</div>}</div>}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><div><label className="mb-1.5 block text-sm font-bold text-slate-700">Journey date</label><input type="date" value={journeyDate} onChange={(e) => setJourneyDate(e.target.value)} className="min-w-0 w-full rounded-xl border border-slate-200 px-2.5 py-3 text-sm outline-none focus:border-blue-500 sm:rounded-2xl sm:px-3"/></div><div><label className="mb-1.5 block text-sm font-bold text-slate-700">Pickup time</label><input type="time" value={journeyTime} onChange={(e) => setJourneyTime(e.target.value)} className="min-w-0 w-full rounded-xl border border-slate-200 px-2.5 py-3 text-sm outline-none focus:border-blue-500 sm:rounded-2xl sm:px-3"/></div></div>
            {bookingType === "roundtrip" && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><div><label className="mb-1.5 block text-sm font-bold text-slate-700">Return date</label><input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="min-w-0 w-full rounded-xl border border-slate-200 px-2.5 py-3 text-sm outline-none sm:rounded-2xl sm:px-3"/></div><div><label className="mb-1.5 block text-sm font-bold text-slate-700">Return time</label><input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="min-w-0 w-full rounded-xl border border-slate-200 px-2.5 py-3 text-sm outline-none sm:rounded-2xl sm:px-3"/></div></div>}
            {serviceType === "local" && <div><label className="mb-1.5 block text-sm font-bold text-slate-700">Local package</label><select value={localPackage} onChange={(e) => setLocalPackage(e.target.value as LocalPackageType)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm sm:rounded-2xl"><option value="4hr40km">4 Hours / 40 KM</option><option value="8hr80km">8 Hours / 80 KM</option><option value="12hr120km">12 Hours / 120 KM</option></select></div>}
            {serviceType !== "local" && <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><label className="text-sm font-bold">Distance fallback</label><span className="rounded-lg bg-white px-3 py-1.5 text-sm font-black">{distance} km</span></div><input type="range" min={10} max={1000} step={5} value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-blue-950"/><div className="mt-1 flex justify-between text-xs text-slate-500"><span>10 km</span><span>1,000 km</span></div><p className="mt-2 text-xs text-slate-500">Route API distance available hone par actual Google route distance use hoga.</p></div>}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><div><label className="mb-1.5 block text-sm font-bold text-slate-700">Night charge (₹)</label><input type="number" min={0} value={nightCharge} onChange={(e) => setNightCharge(Math.max(0, Number(e.target.value) || 0))} className="min-w-0 w-full rounded-xl border border-slate-200 px-2.5 py-3 text-sm sm:rounded-2xl sm:px-3"/></div><div><label className="mb-1.5 block text-sm font-bold text-slate-700">Remote pickup/drop (₹)</label><input type="number" min={0} value={remoteAdjustment} onChange={(e) => setRemoteAdjustment(Math.max(0, Number(e.target.value) || 0))} className="min-w-0 w-full rounded-xl border border-slate-200 px-2.5 py-3 text-sm sm:rounded-2xl sm:px-3"/></div></div>
            <div className={`rounded-2xl border p-3 text-sm ${nonPopularRoute && serviceType !== "local" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}><div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0"/><p>{serviceType === "local" ? "Local package: hub surcharge is not applied." : nonPopularRoute ? "Non-popular pickup/drop detected: 20% hub surcharge will be applied." : "Both locations match popular hubs: no hub surcharge."}</p></div><p className="mt-1 text-xs opacity-80">Popular hubs: {POPULAR_HUBS.join(", ")}</p></div>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
            <button onClick={calculate} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-950 px-5 py-4 font-black text-white shadow-lg shadow-blue-950/15 transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <RefreshCw className="h-5 w-5 animate-spin"/> : <Calculator className="h-5 w-5"/>}{loading ? "Calculating fare…" : "Get B2C & B2B Fare"}</button>
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h2 className="text-lg font-black">Fare comparison</h2><p className="mt-1 text-sm text-slate-500">Internal quote range · B2B values confidential</p></div>{results && <button onClick={() => { setResults(null); setResolvedDistance(null); }} className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-bold"><RefreshCw className="h-4 w-4"/> Reset</button>}</div>
          {!results ? <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center sm:rounded-3xl sm:p-8"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-950"><Route className="h-8 w-8"/></div><h3 className="text-lg font-black">Ready to calculate</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Pickup aur drop select karke Get Fare dabayein. Sedan, Ertiga aur Innova Crysta ke B2C range aur internal B2B estimate yahan dikhenge.</p></div> : <div className="space-y-4"> <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4"><div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start"><div className="min-w-0"><p className="max-w-full break-words font-extrabold">{pickup}</p><p className="my-1 text-xs font-bold text-slate-400">TO</p><p className="max-w-full break-words font-extrabold">{serviceType === "local" ? "Local package" : drop}</p></div><div className="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-right"><p className="text-xs text-slate-500">Distance</p><p className="font-black">{resolvedDistance ?? distance} km</p></div></div></div>
              {results.map((r) => <article key={r.vehicleType} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl"><div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:p-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-950"><CarFront className="h-6 w-6"/></div><div><h3 className="font-black">{r.label}</h3><p className="text-xs text-slate-500">{r.distance} km · approx. {Math.floor(r.durationMinutes / 60)}h {r.durationMinutes % 60}m</p></div></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{nonPopularRoute && serviceType !== "local" ? "+20% hub" : "Standard hub"}</span></div><div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4"><div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4"><p className="text-xs font-extrabold uppercase tracking-wide text-blue-800">B2C customer quote</p><p className="mt-2 break-words text-lg font-black text-blue-950 sm:text-xl">{INR(r.b2cMin)} – {INR(r.b2cMax)}</p><p className="mt-1 text-xs text-slate-500">Suggested quote range</p></div><div className="rounded-2xl border border-orange-200 bg-orange-50 p-4"><p className="text-xs font-extrabold uppercase tracking-wide text-orange-800">B2B internal rate</p><p className="mt-2 break-words text-lg font-black text-orange-950 sm:text-xl">{INR(r.b2b)}</p><p className="mt-1 text-xs text-orange-800">Confidential · do not share</p></div></div><div className="flex flex-col items-start justify-between gap-2 border-t border-slate-100 bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:px-4"><div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><Wallet className="h-4 w-4"/> Estimated margin room</div><p className="text-sm font-black text-emerald-700">{INR(r.estimatedMarginAtMin)} – {INR(r.estimatedMarginAtMax)}</p></div></article>)}
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950"><p className="font-black">Internal pricing note</p><p className="mt-1">B2B one-way estimate derives from the current fare engine's pre-margin base. Round-trip/local B2B is a provisional estimate using a ₹300 deduction from the existing calculated fare; confirm the vendor quote before committing. Tolls, parking, permits or other actual charges may need separate confirmation.</p></div>
            </div>}
        </section>
      </div>
    </main>
  );
}

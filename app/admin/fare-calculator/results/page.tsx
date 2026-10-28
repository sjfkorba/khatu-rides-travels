"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CarFront, MapPin, Route, ShieldCheck, Wallet } from "lucide-react";

const roundToHundred = (amount: number) => Math.round(amount / 100) * 100;
const INR = (amount: number) => `₹${roundToHundred(amount).toLocaleString("en-IN")}`;
type FareRow = {
  vehicleType: string;
  label: string;
  distance: number;
  durationMinutes: number;
  b2cMin: number;
  b2cMax: number;
  b2b: number;
  estimatedMarginAtMin: number;
  estimatedMarginAtMax: number;
};

function FareResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") ?? "";
  const drop = searchParams.get("drop") ?? "";
  const bookingType = searchParams.get("bookingType") ?? "oneway";
  const serviceType = searchParams.get("serviceType") ?? "outstation";
  const distance = Number(searchParams.get("distance") ?? 0);
  const results = useMemo<FareRow[]>(() => {
    try {
      const parsed = JSON.parse(searchParams.get("results") ?? "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }, [searchParams]);

  const mapSrc = useMemo(() => {
    if (serviceType === "local" || !drop) {
      return `https://www.google.com/maps?q=${encodeURIComponent(pickup)}&output=embed`;
    }
    return `https://www.google.com/maps?output=embed&saddr=${encodeURIComponent(pickup)}&daddr=${encodeURIComponent(drop)}`;
  }, [pickup, drop, serviceType]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-white"><Route className="h-5 w-5" /></div><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">Khatu Rides · Admin</p><h1 className="text-lg font-black sm:text-xl">Fare Results</h1></div></div>
          <button onClick={() => router.push("/admin/fare-calculator")} className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50"><ArrowLeft className="h-4 w-4"/><span className="hidden sm:inline">Edit Route</span><span className="sm:hidden">Back</span></button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5"><div><h2 className="text-base font-black sm:text-lg">Google Maps Route</h2><p className="mt-1 text-xs text-slate-500">Route overview · {distance || "—"} km calculated distance</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800"><ShieldCheck className="h-4 w-4"/> Internal</span></div>
          <div className="grid grid-cols-1 gap-0 md:grid-cols-[0.8fr_1.2fr]">
            <div className="order-2 space-y-3 border-t border-slate-100 p-4 md:order-1 md:border-r md:border-t-0 sm:p-5">
              <div className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"/><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pickup</p><p className="break-words text-sm font-extrabold">{pickup || "Not provided"}</p></div></div>
              <div className="ml-2.5 h-5 border-l-2 border-dashed border-slate-300" />
              <div className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rose-600"/><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{serviceType === "local" ? "Service" : "Drop"}</p><p className="break-words text-sm font-extrabold">{serviceType === "local" ? "Local package" : (drop || "Not provided")}</p></div></div>
              <div className="grid grid-cols-2 gap-2 pt-1"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] text-slate-500">Trip type</p><p className="mt-1 text-sm font-black">{serviceType === "local" ? "Local" : bookingType === "roundtrip" ? "Round Trip" : "One Way"}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] text-slate-500">Distance</p><p className="mt-1 text-sm font-black">{distance} km</p></div></div>
            </div>
            <div className="order-1 h-64 bg-slate-100 md:order-2 md:h-full md:min-h-[300px]"><iframe title="Google Maps route" src={mapSrc} className="h-full min-h-[256px] w-full border-0 md:min-h-[340px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
          </div>
        </section>

        <section>
          <div className="mb-3"><h2 className="text-lg font-black sm:text-xl">Vehicle-wise fare comparison</h2><p className="mt-1 text-sm text-slate-500">Customer quote range aur confidential vendor cost range ek hi card mein.</p></div>
          {results.length === 0 ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">Fare details URL mein nahi mile. <button onClick={() => router.push("/admin/fare-calculator")} className="font-black underline">Calculator par wapas jaayein</button> aur dobara calculate karein.</div> : <div className="space-y-4">{results.map((r) => {
            // Vendor negotiation range is shown as ±5% around the independent B2B base estimate.
            const vendorMin = roundToHundred(r.b2b * 0.95);
            const vendorMax = roundToHundred(r.b2b * 1.05);
            const customerMin = roundToHundred(r.b2cMin);
            const customerMax = roundToHundred(r.b2cMax);
            return <article key={r.vehicleType} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4 sm:px-5"><div className="flex min-w-0 items-center gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-950"><CarFront className="h-6 w-6"/></div><div className="min-w-0"><h3 className="font-black sm:text-lg">{r.label}</h3><p className="text-xs font-bold text-slate-600">{r.distance} km · Expected travel duration: {String(Math.floor(r.durationMinutes / 60)).padStart(2, "0")}:{String(r.durationMinutes % 60).padStart(2, "0")} hr</p></div></div><span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600">{serviceType === "local" ? "Local package" : bookingType === "roundtrip" ? "Round trip" : "One way"}</span></div>
              <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4">
                <div className="rounded-2xl border border-red-950 bg-red-900 p-4 text-white shadow-sm"><p className="text-xs font-black uppercase tracking-wide text-white">Customer Rate (B2C)</p><p className="mt-2 text-xl font-black text-white sm:text-2xl">{INR(customerMin)} – {INR(customerMax)}</p><p className="mt-1 text-xs font-bold text-white">Minimum – Maximum customer quote</p></div>
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4"><p className="text-xs font-extrabold uppercase tracking-wide text-orange-800">Vendor Rate (B2B)</p><p className="mt-2 text-xl font-black text-orange-950 sm:text-2xl">{INR(vendorMin)} – {INR(vendorMax)}</p><p className="mt-1 text-xs text-orange-800">Confidential · estimated negotiation range</p></div>
              </div>
              <div className="flex flex-col gap-1 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><Wallet className="h-4 w-4"/> Indicative margin room</div><p className="text-sm font-black text-emerald-700">{INR(Math.max(0, customerMin - vendorMax))} – {INR(Math.max(0, customerMax - vendorMin))}</p></div>
            </article>;
          })}</div>}
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950"><p className="font-black">Pricing note</p><p className="mt-1">Customer aur vendor dono fare nearest ₹100 par round off kiye jaate hain. Vendor minimum–maximum is an indicative ±5% negotiation band around the independent B2B estimate, not a confirmed supplier quote. Update the rate master using actual vendor agreements. Toll, parking, permits and other actual charges may be additional.</p></div>
        </section>
      </div>
    </main>
  );
}


export default function FareResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
            <p className="font-black">Loading fare results…</p>
            <p className="mt-1 text-sm text-slate-500">Khatu Rides</p>
          </div>
        </main>
      }
    >
      <FareResultsContent />
    </Suspense>
  );
}

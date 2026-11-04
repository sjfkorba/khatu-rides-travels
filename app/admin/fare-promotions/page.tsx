"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query,
  serverTimestamp, updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type BookingType = "one-way" | "round-trip" | "local";
type DiscountType = "percentage" | "fixed";
type OfferMode = "automatic" | "coupon";
type RouteScope = "all" | "selected";
type Festival = { id: string; name: string; increasePercent: number; startAt: string; endAt: string; isActive: boolean };
type Coupon = { id: string; code: string; from: string; to: string; fromNormalized: string; toNormalized: string; discountPercent: number; startAt: string; endAt: string; isActive: boolean; usageCount?: number };
type Campaign = {
  id: string; name: string; discountType: DiscountType; discountValue: number;
  bookingTypes: BookingType[]; routeScope: RouteScope; selectedRoutes: Array<{ from: string; to: string; fromNormalized: string; toNormalized: string }>;
  offerMode: OfferMode; couponCode?: string; startAt: string; endAt: string; activeDays: number[];
  minimumFare: number; maximumDiscount: number | null; usageLimit: number | null;
  usageCount: number; perCustomerLimit: number | null; allowStacking: boolean; priority: number; isActive: boolean;
};

const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-100";
const normalize = (s: string) => s.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
const validDates = (a: string, b: string) => !!a && !!b && new Date(a).getTime() < new Date(b).getTime();
const iso = (s: string) => new Date(s).toISOString();
const dateLabel = (s: string) => new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
const code6 = () => String(100000 + Math.floor(Math.random() * 900000));
const dayOptions = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const tripLabels: Record<BookingType, string> = { "one-way": "One Way", "round-trip": "Round Trip", local: "Local Rental" };

export default function FarePromotionsAdminPage() {
  const [tab, setTab] = useState<"festival" | "campaign" | "coupon">("campaign");
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [newCode, setNewCode] = useState("");

  const [festivalName, setFestivalName] = useState("");
  const [festivalPercent, setFestivalPercent] = useState("10");
  const [festivalStart, setFestivalStart] = useState("");
  const [festivalEnd, setFestivalEnd] = useState("");

  const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [discount, setDiscount] = useState("10"); const [couponStart, setCouponStart] = useState(""); const [couponEnd, setCouponEnd] = useState("");

  const [campaignName, setCampaignName] = useState("");
  const [campaignDiscountType, setCampaignDiscountType] = useState<DiscountType>("percentage");
  const [campaignDiscount, setCampaignDiscount] = useState("10");
  const [bookingTypes, setBookingTypes] = useState<BookingType[]>(["one-way", "round-trip"]);
  const [routeScope, setRouteScope] = useState<RouteScope>("all");
  const [routeFrom, setRouteFrom] = useState(""); const [routeTo, setRouteTo] = useState("");
  const [offerMode, setOfferMode] = useState<OfferMode>("automatic");
  const [campaignStart, setCampaignStart] = useState(""); const [campaignEnd, setCampaignEnd] = useState("");
  const [activeDays, setActiveDays] = useState<number[]>([0,1,2,3,4,5,6]);
  const [minimumFare, setMinimumFare] = useState("0"); const [maximumDiscount, setMaximumDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState(""); const [perCustomerLimit, setPerCustomerLimit] = useState("1");
  const [priority, setPriority] = useState("1");

  useEffect(() => {
    let ready = [false, false, false];
    const finish = () => { if (ready.every(Boolean)) setLoading(false); };
    const subscribe = (name: string, index: number, setter: (v: any[]) => void) => onSnapshot(
      query(collection(db, name), orderBy("createdAt", "desc")),
      s => { setter(s.docs.map(d => ({ id: d.id, ...d.data() }))); ready[index] = true; finish(); },
      e => { setError(e.message); ready[index] = true; finish(); }
    );
    const u1 = subscribe("festival_fares", 0, setFestivals);
    const u2 = subscribe("route_coupons", 1, setCoupons);
    const u3 = subscribe("fare_promotions", 2, setCampaigns);
    return () => { u1(); u2(); u3(); };
  }, []);

  const stats = useMemo(() => ({ active: campaigns.filter(c => c.isActive && Date.now() >= new Date(c.startAt).getTime() && Date.now() <= new Date(c.endAt).getTime()).length }), [campaigns]);
  const resetMessages = () => { setError(""); setMessage(""); };

  const saveFestival = async (e: FormEvent) => {
    e.preventDefault(); resetMessages(); const pct = Number(festivalPercent);
    if (!festivalName.trim()) return setError("Festival / season ka naam enter karein.");
    if (!(pct > 0 && pct <= 100)) return setError("Increase 1% se 100% ke beech hona chahiye.");
    if (!validDates(festivalStart, festivalEnd)) return setError("End date/time, start date/time ke baad honi chahiye.");
    setBusy(true);
    try { await addDoc(collection(db, "festival_fares"), { name: festivalName.trim(), increasePercent: pct, startAt: iso(festivalStart), endAt: iso(festivalEnd), isActive: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      setFestivalName(""); setFestivalPercent("10"); setFestivalStart(""); setFestivalEnd(""); setMessage("Festival fare rule Firebase mein save ho gaya.");
    } catch (e) { setError(e instanceof Error ? e.message : "Save failed."); } finally { setBusy(false); }
  };

  const createCampaign = async (e: FormEvent) => {
    e.preventDefault(); resetMessages(); const value = Number(campaignDiscount);
    if (!campaignName.trim()) return setError("Campaign name enter karein.");
    if (!(value > 0 && value <= (campaignDiscountType === "percentage" ? 100 : 100000))) return setError("Discount value valid nahi hai.");
    if (!bookingTypes.length) return setError("Kam se kam ek booking type select karein.");
    if (!validDates(campaignStart, campaignEnd)) return setError("End date/time, start date/time ke baad honi chahiye.");
    if (!activeDays.length) return setError("Kam se kam ek active day select karein.");
    if (routeScope === "selected" && (!routeFrom.trim() || !routeTo.trim() || normalize(routeFrom) === normalize(routeTo))) return setError("Selected route ke liye valid From aur To enter karein.");
    if (Number(minimumFare) < 0 || (maximumDiscount && Number(maximumDiscount) <= 0) || (usageLimit && Number(usageLimit) <= 0) || (perCustomerLimit && Number(perCustomerLimit) <= 0)) return setError("Minimum fare aur usage limits check karein.");
    setBusy(true);
    try {
      let couponCode: string | undefined;
      if (offerMode === "coupon") {
        const existing = new Set([...coupons.map(c => c.code), ...campaigns.map(c => c.couponCode).filter(Boolean)]);
        for (let i = 0; i < 30; i++) { const candidate = code6(); if (!existing.has(candidate)) { couponCode = candidate; break; } }
        if (!couponCode) throw new Error("Unique coupon code generate nahi hua. Dobara try karein.");
      }
      const selectedRoutes = routeScope === "selected" ? [{ from: routeFrom.trim(), to: routeTo.trim(), fromNormalized: normalize(routeFrom), toNormalized: normalize(routeTo) }] : [];
      await addDoc(collection(db, "fare_promotions"), {
        name: campaignName.trim(), discountType: campaignDiscountType, discountValue: value,
        bookingTypes, routeScope, selectedRoutes, offerMode, ...(couponCode ? { couponCode } : {}),
        startAt: iso(campaignStart), endAt: iso(campaignEnd), activeDays,
        minimumFare: Number(minimumFare) || 0, maximumDiscount: maximumDiscount ? Number(maximumDiscount) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null, usageCount: 0,
        perCustomerLimit: perCustomerLimit ? Number(perCustomerLimit) : null,
        allowStacking: false, priority: Number(priority) || 1, isActive: true,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setNewCode(couponCode || ""); setCampaignName(""); setCampaignDiscount("10"); setRouteFrom(""); setRouteTo("");
      setCampaignStart(""); setCampaignEnd(""); setMaximumDiscount(""); setUsageLimit(""); setMessage(couponCode ? `Campaign save ho gaya. Coupon code: ${couponCode}` : "Automatic discount campaign Firebase mein save ho gaya.");
    } catch (e) { setError(e instanceof Error ? e.message : "Campaign create failed."); } finally { setBusy(false); }
  };

  const createCoupon = async (e: FormEvent) => {
    e.preventDefault(); resetMessages(); const pct = Number(discount), f = normalize(from), t = normalize(to);
    if (!f || !t || f === t) return setError("Valid aur alag From / To city enter karein.");
    if (!(pct > 0 && pct <= 100)) return setError("Discount 1% se 100% ke beech hona chahiye.");
    if (!validDates(couponStart, couponEnd)) return setError("Expiry, start date/time ke baad honi chahiye.");
    setBusy(true);
    try {
      const existing = new Set([...coupons.map(c => c.code), ...campaigns.map(c => c.couponCode).filter(Boolean)]);
      let saved = "";
      for (let i = 0; i < 30; i++) { const candidate = code6(); if (existing.has(candidate)) continue;
        await addDoc(collection(db, "route_coupons"), { code: candidate, from: from.trim(), to: to.trim(), fromNormalized: f, toNormalized: t, discountPercent: pct, startAt: iso(couponStart), endAt: iso(couponEnd), isActive: true, usageCount: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); saved = candidate; break;
      }
      if (!saved) throw new Error("Unique coupon generate nahi hua.");
      setNewCode(saved); setFrom(""); setTo(""); setDiscount("10"); setCouponStart(""); setCouponEnd(""); setMessage(`Route coupon ${saved} Firebase mein save ho gaya.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Coupon create failed."); } finally { setBusy(false); }
  };

  const toggle = async (type: "festival" | "coupon" | "campaign", id: string, active: boolean) => {
    const path = type === "festival" ? "festival_fares" : type === "coupon" ? "route_coupons" : "fare_promotions";
    try { await updateDoc(doc(db, path, id), { isActive: !active, updatedAt: serverTimestamp() }); }
    catch (e) { setError(e instanceof Error ? e.message : "Status update failed."); }
  };
  const remove = async (type: "festival" | "coupon" | "campaign", id: string) => {
    if (!window.confirm("Kya aap is record ko delete karna chahte hain?")) return;
    const path = type === "festival" ? "festival_fares" : type === "coupon" ? "route_coupons" : "fare_promotions";
    try { await deleteDoc(doc(db, path, id)); } catch (e) { setError(e instanceof Error ? e.message : "Delete failed."); }
  };
  const status = (active: boolean, start: string, end: string) => {
    const now = Date.now(); if (!active) return ["Paused", "bg-slate-100 text-slate-600"];
    if (now < new Date(start).getTime()) return ["Scheduled", "bg-blue-50 text-blue-700"];
    if (now > new Date(end).getTime()) return ["Expired", "bg-amber-50 text-amber-700"];
    return ["Active", "bg-green-50 text-green-700"];
  };
  const toggleBooking = (v: BookingType) => setBookingTypes(old => old.includes(v) ? old.filter(x => x !== v) : [...old, v]);
  const toggleDay = (v: number) => setActiveDays(old => old.includes(v) ? old.filter(x => x !== v) : [...old, v].sort());

  return <main className="min-h-screen bg-slate-50 px-3 py-5 text-slate-900 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[.2em] text-red-700">Khatu Rides · Admin</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">Fare & Offers Management</h1><p className="mt-1 text-sm text-slate-500">Festival pricing, automatic campaigns aur coupon offers ek jagah manage karein.</p></div><div className="grid grid-cols-3 gap-2"><div className="rounded-xl border bg-white p-3"><p className="text-xs text-slate-500">Festival rules</p><b className="text-2xl">{festivals.length}</b></div><div className="rounded-xl border bg-white p-3"><p className="text-xs text-slate-500">Campaigns</p><b className="text-2xl">{campaigns.length}</b></div><div className="rounded-xl border bg-white p-3"><p className="text-xs text-slate-500">Live campaigns</p><b className="text-2xl text-green-700">{stats.active}</b></div></div></header>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}{message && <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}{newCode && <button type="button" className="ml-3 font-black underline" onClick={() => navigator.clipboard.writeText(newCode)}>Copy {newCode}</button>}</div>}
    <nav className="grid grid-cols-3 rounded-xl border bg-white p-1.5"><button onClick={() => {setTab("campaign");resetMessages();}} className={`rounded-lg p-3 text-xs font-bold sm:text-sm ${tab === "campaign" ? "bg-red-700 text-white" : "text-slate-600"}`}>Discount Campaigns</button><button onClick={() => {setTab("festival");resetMessages();}} className={`rounded-lg p-3 text-xs font-bold sm:text-sm ${tab === "festival" ? "bg-red-700 text-white" : "text-slate-600"}`}>Festival Fare Increase</button><button onClick={() => {setTab("coupon");resetMessages();}} className={`rounded-lg p-3 text-xs font-bold sm:text-sm ${tab === "coupon" ? "bg-red-700 text-white" : "text-slate-600"}`}>Route Coupons</button></nav>

    {tab === "campaign" && <div className="grid gap-5 lg:grid-cols-[390px_1fr]"><form onSubmit={createCampaign} className="h-fit space-y-4 rounded-2xl border bg-white p-5 shadow-sm"><div><h2 className="text-lg font-black">Create discount campaign</h2><p className="text-xs text-slate-500">Route, trip type ya all routes par time-bound offer.</p></div>
      <label className="block space-y-1.5 text-sm font-semibold">Campaign Name<input className={input} value={campaignName} onChange={e=>setCampaignName(e.target.value)} placeholder="Weekend Special" maxLength={60}/></label>
      <div className="grid grid-cols-2 gap-3"><label className="block space-y-1.5 text-sm font-semibold">Discount Type<select className={input} value={campaignDiscountType} onChange={e=>setCampaignDiscountType(e.target.value as DiscountType)}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed Amount (₹)</option></select></label><label className="block space-y-1.5 text-sm font-semibold">Discount Value<input className={input} type="number" min="1" max={campaignDiscountType === "percentage" ? 100 : 100000} step="0.5" value={campaignDiscount} onChange={e=>setCampaignDiscount(e.target.value)}/></label></div>
      <fieldset className="space-y-2"><legend className="text-sm font-semibold">Applicable Trip Types</legend><div className="grid grid-cols-3 gap-2">{(["one-way","round-trip","local"] as BookingType[]).map(v=><label key={v} className={`cursor-pointer rounded-lg border p-2 text-center text-xs font-bold ${bookingTypes.includes(v)?"border-red-600 bg-red-50 text-red-700":"border-slate-200"}`}><input className="sr-only" type="checkbox" checked={bookingTypes.includes(v)} onChange={()=>toggleBooking(v)}/>{tripLabels[v]}</label>)}</div></fieldset>
      <fieldset className="space-y-2"><legend className="text-sm font-semibold">Route Coverage</legend><div className="grid grid-cols-2 gap-2"><label className={`rounded-lg border p-3 text-sm font-bold ${routeScope === "all"?"border-red-600 bg-red-50 text-red-700":""}`}><input className="mr-2" type="radio" checked={routeScope === "all"} onChange={()=>setRouteScope("all")}/>All Routes</label><label className={`rounded-lg border p-3 text-sm font-bold ${routeScope === "selected"?"border-red-600 bg-red-50 text-red-700":""}`}><input className="mr-2" type="radio" checked={routeScope === "selected"} onChange={()=>setRouteScope("selected")}/>Specific Route</label></div>{routeScope === "selected" && <div className="grid grid-cols-2 gap-2"><input className={input} value={routeFrom} onChange={e=>setRouteFrom(e.target.value)} placeholder="From city"/><input className={input} value={routeTo} onChange={e=>setRouteTo(e.target.value)} placeholder="To city"/></div>}</fieldset>
      <fieldset className="space-y-2"><legend className="text-sm font-semibold">Offer Mode</legend><div className="grid grid-cols-2 gap-2"><label className={`rounded-lg border p-3 text-sm font-bold ${offerMode === "automatic"?"border-red-600 bg-red-50 text-red-700":""}`}><input className="mr-2" type="radio" checked={offerMode === "automatic"} onChange={()=>setOfferMode("automatic")}/>Auto Apply</label><label className={`rounded-lg border p-3 text-sm font-bold ${offerMode === "coupon"?"border-red-600 bg-red-50 text-red-700":""}`}><input className="mr-2" type="radio" checked={offerMode === "coupon"} onChange={()=>setOfferMode("coupon")}/>Coupon Code</label></div>{offerMode === "coupon" && <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">Save karte hi unique 6-digit coupon code generate hoga.</p>}</fieldset>
      <div className="grid grid-cols-2 gap-3"><label className="block space-y-1.5 text-sm font-semibold">Start Date & Time<input className={input} type="datetime-local" value={campaignStart} onChange={e=>setCampaignStart(e.target.value)}/></label><label className="block space-y-1.5 text-sm font-semibold">End Date & Time<input className={input} type="datetime-local" value={campaignEnd} onChange={e=>setCampaignEnd(e.target.value)}/></label></div>
      <fieldset className="space-y-2"><legend className="text-sm font-semibold">Active Days</legend><div className="grid grid-cols-7 gap-1">{dayOptions.map((d,i)=><button type="button" key={d} onClick={()=>toggleDay(i)} className={`rounded-lg border py-2 text-xs font-bold ${activeDays.includes(i)?"border-red-600 bg-red-700 text-white":"bg-white text-slate-500"}`}>{d}</button>)}</div></fieldset>
      <div className="grid grid-cols-2 gap-3"><label className="block space-y-1.5 text-sm font-semibold">Minimum Fare (₹)<input className={input} type="number" min="0" value={minimumFare} onChange={e=>setMinimumFare(e.target.value)}/></label><label className="block space-y-1.5 text-sm font-semibold">Max Discount (₹)<input className={input} type="number" min="1" value={maximumDiscount} onChange={e=>setMaximumDiscount(e.target.value)} placeholder="No limit"/></label></div>
      <div className="grid grid-cols-2 gap-3"><label className="block space-y-1.5 text-sm font-semibold">Total Usage Limit<input className={input} type="number" min="1" value={usageLimit} onChange={e=>setUsageLimit(e.target.value)} placeholder="Unlimited"/></label><label className="block space-y-1.5 text-sm font-semibold">Per Customer Limit<input className={input} type="number" min="1" value={perCustomerLimit} onChange={e=>setPerCustomerLimit(e.target.value)}/></label></div>
      <label className="block space-y-1.5 text-sm font-semibold">Priority (higher wins)<input className={input} type="number" min="1" value={priority} onChange={e=>setPriority(e.target.value)}/></label>
      <button disabled={busy} className="w-full rounded-xl bg-red-700 p-3 font-bold text-white hover:bg-red-800 disabled:opacity-60">{busy?"Saving...":"Create Discount Campaign"}</button><p className="text-[11px] leading-5 text-slate-500">Route aur Trip dono eligible hone par policy BEST DISCOUNT hai: customer ko ek hi highest saving milegi. Campaign save hone se pehle customer-side/API integration required hai.</p>
    </form>
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-black">Discount campaigns</h2><p className="text-xs text-slate-500">Live Firestore records · best eligible offer policy</p></div>{loading?<p className="p-5 text-sm text-slate-500">Loading...</p>:campaigns.length===0?<p className="p-5 text-sm text-slate-500">Abhi koi campaign nahi hai.</p>:campaigns.map(c=>{const [s,cl]=status(c.isActive,c.startAt,c.endAt);return <article key={c.id} className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><b>{c.name}</b><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${cl}`}>{s}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-[11px]">{c.offerMode === "automatic"?"AUTO":"COUPON"}</span></div><p className="mt-1 text-lg font-black text-green-700">{c.discountType === "percentage"?`${c.discountValue}% OFF`:`₹${c.discountValue} OFF`}{c.maximumDiscount?` · Max ₹${c.maximumDiscount}`:""}</p><p className="text-xs text-slate-600">{c.bookingTypes.map(x=>tripLabels[x]).join(", ")} · {c.routeScope === "all"?"All routes":c.selectedRoutes?.map(r=>`${r.from} → ${r.to}`).join(", ")}</p>{c.couponCode&&<p className="mt-1 font-mono text-sm font-black tracking-widest">CODE: {c.couponCode}</p>}<p className="text-xs text-slate-500">{dateLabel(c.startAt)} — {dateLabel(c.endAt)} · Used {c.usageCount||0}{c.usageLimit?` / ${c.usageLimit}`:""} · Active: {c.activeDays?.map(d=>dayOptions[d]).join(", ")}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={()=>toggle("campaign",c.id,c.isActive)} className="rounded-lg border px-3 py-2 text-xs font-bold">{c.isActive?"Pause":"Activate"}</button><button type="button" onClick={()=>remove("campaign",c.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700">Delete</button></div></article>;})}</section></div>}

    {tab === "festival" && <div className="grid gap-5 lg:grid-cols-[360px_1fr]"><form onSubmit={saveFestival} className="h-fit space-y-4 rounded-2xl border bg-white p-5 shadow-sm"><div><h2 className="text-lg font-black">New festival rule</h2><p className="text-xs text-slate-500">Selected period mein fare percentage increase.</p></div><label className="block space-y-1.5 text-sm font-semibold">Festival / Season Name<input className={input} value={festivalName} onChange={e=>setFestivalName(e.target.value)} placeholder="Diwali Special" maxLength={60}/></label><label className="block space-y-1.5 text-sm font-semibold">Fare Increase (%)<input className={input} type="number" min="0.5" max="100" step="0.5" value={festivalPercent} onChange={e=>setFestivalPercent(e.target.value)}/></label><label className="block space-y-1.5 text-sm font-semibold">Start Date & Time<input className={input} type="datetime-local" value={festivalStart} onChange={e=>setFestivalStart(e.target.value)}/></label><label className="block space-y-1.5 text-sm font-semibold">End Date & Time<input className={input} type="datetime-local" value={festivalEnd} onChange={e=>setFestivalEnd(e.target.value)}/></label><button disabled={busy} className="w-full rounded-xl bg-red-700 p-3 font-bold text-white">{busy?"Saving...":"Save Festival Rule"}</button></form><section className="overflow-hidden rounded-2xl border bg-white"><div className="border-b p-5"><h2 className="font-black">Festival rules</h2></div>{loading?<p className="p-5">Loading...</p>:festivals.map(x=>{const [s,c]=status(x.isActive,x.startAt,x.endAt);return <article key={x.id} className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center"><div><b>{x.name}</b><span className={`ml-2 rounded-full px-2 py-1 text-xs ${c}`}>{s}</span><p className="text-xl font-black text-red-700">+{x.increasePercent}%</p><p className="text-xs text-slate-500">{dateLabel(x.startAt)} — {dateLabel(x.endAt)}</p></div><div className="flex gap-2"><button type="button" onClick={()=>toggle("festival",x.id,x.isActive)} className="rounded-lg border px-3 py-2 text-xs">{x.isActive?"Deactivate":"Activate"}</button><button type="button" onClick={()=>remove("festival",x.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-700">Delete</button></div></article>;})}</section></div>}

    {tab === "coupon" && <div className="grid gap-5 lg:grid-cols-[360px_1fr]"><form onSubmit={createCoupon} className="h-fit space-y-4 rounded-2xl border bg-white p-5 shadow-sm"><div><h2 className="text-lg font-black">Generate route coupon</h2><p className="text-xs text-slate-500">Specific route ke liye legacy 6-digit coupon.</p></div><div className="grid grid-cols-2 gap-3"><label className="block space-y-1.5 text-sm font-semibold">From<input className={input} value={from} onChange={e=>setFrom(e.target.value)} placeholder="Raipur" maxLength={80}/></label><label className="block space-y-1.5 text-sm font-semibold">To<input className={input} value={to} onChange={e=>setTo(e.target.value)} placeholder="Bilaspur" maxLength={80}/></label></div><label className="block space-y-1.5 text-sm font-semibold">Discount (%)<input className={input} type="number" min="0.5" max="100" step="0.5" value={discount} onChange={e=>setDiscount(e.target.value)}/></label><label className="block space-y-1.5 text-sm font-semibold">Coupon Start Date & Time<input className={input} type="datetime-local" value={couponStart} onChange={e=>setCouponStart(e.target.value)}/></label><label className="block space-y-1.5 text-sm font-semibold">Coupon Expiry Date & Time<input className={input} type="datetime-local" value={couponEnd} onChange={e=>setCouponEnd(e.target.value)}/></label><button disabled={busy} className="w-full rounded-xl bg-red-700 p-3 font-bold text-white">{busy?"Generating...":"Generate 6-Digit Coupon"}</button></form><section className="overflow-hidden rounded-2xl border bg-white"><div className="border-b p-5"><h2 className="font-black">Route coupons</h2></div>{loading?<p className="p-5">Loading...</p>:coupons.map(x=>{const [s,c]=status(x.isActive,x.startAt,x.endAt);return <article key={x.id} className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center"><div><code className="rounded-lg bg-slate-100 px-3 py-1.5 text-lg font-black tracking-widest">{x.code}</code><span className={`ml-2 rounded-full px-2 py-1 text-xs ${c}`}>{s}</span><p className="mt-2 font-bold">{x.from} → {x.to}</p><p className="font-black text-green-700">{x.discountPercent}% OFF</p><p className="text-xs text-slate-500">{dateLabel(x.startAt)} — {dateLabel(x.endAt)} · Used {x.usageCount||0}</p></div><div className="flex gap-2"><button type="button" onClick={()=>toggle("coupon",x.id,x.isActive)} className="rounded-lg border px-3 py-2 text-xs">{x.isActive?"Deactivate":"Activate"}</button><button type="button" onClick={()=>remove("coupon",x.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-700">Delete</button></div></article>;})}</section></div>}
    <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">Important: Yeh admin page promotions ko Firestore mein create/manage karta hai. Customer fare-result par automatic offer display, coupon apply, booking limits ki atomic enforcement aur Razorpay order amount validation ke liye server-side integration alag se add karna zaroori hai. Is page ko deploy karne bhar se discounts customer booking mein apply nahi honge.</p>
  </div></main>;
}

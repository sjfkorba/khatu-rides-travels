"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query,
  serverTimestamp, updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Festival = { id: string; name: string; increasePercent: number; startAt: string; endAt: string; isActive: boolean };
type Coupon = { id: string; code: string; from: string; to: string; fromNormalized: string; toNormalized: string; discountPercent: number; startAt: string; endAt: string; isActive: boolean; usageCount?: number };

const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-100";
const normalize = (s: string) => s.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
const validDates = (a: string, b: string) => !!a && !!b && new Date(a).getTime() < new Date(b).getTime();
const iso = (s: string) => new Date(s).toISOString();
const dateLabel = (s: string) => new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
const code6 = () => String(100000 + Math.floor(Math.random() * 900000));

export default function FarePromotionsAdminPage() {
  const [tab, setTab] = useState<"festival" | "coupon">("festival");
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [festivalName, setFestivalName] = useState("");
  const [festivalPercent, setFestivalPercent] = useState("10");
  const [festivalStart, setFestivalStart] = useState("");
  const [festivalEnd, setFestivalEnd] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [discount, setDiscount] = useState("10");
  const [couponStart, setCouponStart] = useState("");
  const [couponEnd, setCouponEnd] = useState("");
  const [newCode, setNewCode] = useState("");

  useEffect(() => {
    let a = false, b = false;
    const finish = () => { if (a && b) setLoading(false); };
    const u1 = onSnapshot(query(collection(db, "festival_fares"), orderBy("createdAt", "desc")), s => {
      setFestivals(s.docs.map(d => ({ id: d.id, ...d.data() } as Festival))); a = true; finish();
    }, e => { setError(e.message); a = true; finish(); });
    const u2 = onSnapshot(query(collection(db, "route_coupons"), orderBy("createdAt", "desc")), s => {
      setCoupons(s.docs.map(d => ({ id: d.id, ...d.data() } as Coupon))); b = true; finish();
    }, e => { setError(e.message); b = true; finish(); });
    return () => { u1(); u2(); };
  }, []);

  const saveFestival = async (e: FormEvent) => {
    e.preventDefault(); setError(""); setMessage("");
    const pct = Number(festivalPercent);
    if (!festivalName.trim()) return setError("Festival / season ka naam enter karein.");
    if (!(pct > 0 && pct <= 100)) return setError("Increase 1% se 100% ke beech hona chahiye.");
    if (!validDates(festivalStart, festivalEnd)) return setError("End date/time, start date/time ke baad honi chahiye.");
    setBusy(true);
    try {
      await addDoc(collection(db, "festival_fares"), {
        name: festivalName.trim(), increasePercent: pct, startAt: iso(festivalStart),
        endAt: iso(festivalEnd), isActive: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setFestivalName(""); setFestivalPercent("10"); setFestivalStart(""); setFestivalEnd("");
      setMessage("Festival fare rule save ho gaya.");
    } catch (e) { setError(e instanceof Error ? e.message : "Save failed."); }
    finally { setBusy(false); }
  };

  const createCoupon = async (e: FormEvent) => {
    e.preventDefault(); setError(""); setMessage("");
    const pct = Number(discount), f = normalize(from), t = normalize(to);
    if (!f || !t) return setError("From aur To city enter karein.");
    if (f === t) return setError("From aur To alag hone chahiye.");
    if (!(pct > 0 && pct <= 100)) return setError("Discount 1% se 100% ke beech hona chahiye.");
    if (!validDates(couponStart, couponEnd)) return setError("Expiry, start date/time ke baad honi chahiye.");
    setBusy(true);
    try {
      let saved = "";
      // Firestore document ID is the generated code, preventing duplicate IDs.
      for (let i = 0; i < 12; i++) {
        const candidate = code6();
        if (coupons.some(c => c.code === candidate)) continue;
        try {
          await addDoc(collection(db, "route_coupons"), {
            code: candidate, from: from.trim(), to: to.trim(), fromNormalized: f, toNormalized: t,
            discountPercent: pct, startAt: iso(couponStart), endAt: iso(couponEnd),
            isActive: true, usageCount: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
          });
          saved = candidate; break;
        } catch (err) { throw err; }
      }
      if (!saved) throw new Error("Unique coupon generate nahi hua. Dobara try karein.");
      setNewCode(saved); setFrom(""); setTo(""); setDiscount("10"); setCouponStart(""); setCouponEnd("");
      setMessage("Coupon generate aur Firebase mein save ho gaya.");
    } catch (e) { setError(e instanceof Error ? e.message : "Coupon create failed."); }
    finally { setBusy(false); }
  };

  const toggle = async (type: "festival" | "coupon", id: string, active: boolean) => {
    try { await updateDoc(doc(db, type === "festival" ? "festival_fares" : "route_coupons", id), { isActive: !active, updatedAt: serverTimestamp() }); }
    catch (e) { setError(e instanceof Error ? e.message : "Status update failed."); }
  };
  const remove = async (type: "festival" | "coupon", id: string) => {
    if (!window.confirm("Kya aap is record ko delete karna chahte hain?")) return;
    try { await deleteDoc(doc(db, type === "festival" ? "festival_fares" : "route_coupons", id)); }
    catch (e) { setError(e instanceof Error ? e.message : "Delete failed."); }
  };
  const status = (active: boolean, start: string, end: string) => {
    const now = Date.now();
    if (!active) return ["Inactive", "bg-slate-100 text-slate-600"];
    if (now < new Date(start).getTime()) return ["Scheduled", "bg-blue-50 text-blue-700"];
    if (now > new Date(end).getTime()) return ["Expired", "bg-amber-50 text-amber-700"];
    return ["Active", "bg-green-50 text-green-700"];
  };

  return <main className="min-h-screen bg-slate-50 px-3 py-5 text-slate-900 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-black uppercase tracking-[.2em] text-red-700">Khatu Rides · Admin</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">Fare & Offers Management</h1>
          <p className="mt-1 text-sm text-slate-500">Festival fare increase aur route-specific coupons manage karein.</p></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border bg-white p-3"><p className="text-xs text-slate-500">Festival rules</p><b className="text-2xl">{festivals.length}</b></div>
          <div className="rounded-xl border bg-white p-3"><p className="text-xs text-slate-500">Route coupons</p><b className="text-2xl">{coupons.length}</b></div>
        </div>
      </header>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</p>}
      <nav className="flex rounded-xl border bg-white p-1.5">
        <button onClick={() => { setTab("festival"); setError(""); setMessage(""); }} className={`flex-1 rounded-lg p-3 text-sm font-bold ${tab === "festival" ? "bg-red-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>Festival Fare Increase</button>
        <button onClick={() => { setTab("coupon"); setError(""); setMessage(""); }} className={`flex-1 rounded-lg p-3 text-sm font-bold ${tab === "coupon" ? "bg-red-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>Route Discount Coupons</button>
      </nav>

      {tab === "festival" ? <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <form onSubmit={saveFestival} className="h-fit space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
          <div><h2 className="text-lg font-black">New festival rule</h2><p className="text-xs text-slate-500">Selected period mein fare percentage increase.</p></div>
          <label className="block space-y-1.5 text-sm font-semibold">Festival / Season Name<input className={input} value={festivalName} onChange={e => setFestivalName(e.target.value)} placeholder="Diwali Special" maxLength={60}/></label>
          <label className="block space-y-1.5 text-sm font-semibold">Fare Increase (%)<input className={input} type="number" min="0.5" max="100" step="0.5" value={festivalPercent} onChange={e => setFestivalPercent(e.target.value)}/></label>
          <label className="block space-y-1.5 text-sm font-semibold">Start Date & Time<input className={input} type="datetime-local" value={festivalStart} onChange={e => setFestivalStart(e.target.value)}/></label>
          <label className="block space-y-1.5 text-sm font-semibold">End Date & Time<input className={input} type="datetime-local" value={festivalEnd} onChange={e => setFestivalEnd(e.target.value)}/></label>
          <button disabled={busy} className="w-full rounded-xl bg-red-700 p-3 font-bold text-white hover:bg-red-800 disabled:opacity-60">{busy ? "Saving..." : "Save Festival Rule"}</button>
          <p className="text-[11px] leading-5 text-slate-500">Yeh page rule ko Firebase mein save/manage karta hai. Customer fare aur payment par apply karne ke liye fare-result/API integration alag step hai.</p>
        </form>
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-black">Festival rules</h2><p className="text-xs text-slate-500">Live Firebase records</p></div>
          {loading ? <p className="p-5 text-sm text-slate-500">Loading...</p> : festivals.length === 0 ? <p className="p-5 text-sm text-slate-500">Koi festival rule nahi hai.</p> : festivals.map(x => { const [s, c] = status(x.isActive, x.startAt, x.endAt); return <article key={x.id} className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><b>{x.name}</b><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${c}`}>{s}</span></div><p className="mt-1 text-xl font-black text-red-700">+{x.increasePercent}%</p><p className="text-xs text-slate-500">{dateLabel(x.startAt)} — {dateLabel(x.endAt)}</p></div><div className="flex gap-2"><button type="button" onClick={() => toggle("festival", x.id, x.isActive)} className="rounded-lg border px-3 py-2 text-xs font-bold">{x.isActive ? "Deactivate" : "Activate"}</button><button type="button" onClick={() => remove("festival", x.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700">Delete</button></div></article>; })}
        </section>
      </div> : <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <form onSubmit={createCoupon} className="h-fit space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
          <div><h2 className="text-lg font-black">Generate route coupon</h2><p className="text-xs text-slate-500">Specific route ke liye 6-digit code.</p></div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5 text-sm font-semibold">From<input className={input} value={from} onChange={e => setFrom(e.target.value)} placeholder="Raipur" maxLength={80}/></label>
            <label className="block space-y-1.5 text-sm font-semibold">To<input className={input} value={to} onChange={e => setTo(e.target.value)} placeholder="Bilaspur" maxLength={80}/></label>
          </div>
          <label className="block space-y-1.5 text-sm font-semibold">Discount (%)<input className={input} type="number" min="0.5" max="100" step="0.5" value={discount} onChange={e => setDiscount(e.target.value)}/></label>
          <label className="block space-y-1.5 text-sm font-semibold">Coupon Start Date & Time<input className={input} type="datetime-local" value={couponStart} onChange={e => setCouponStart(e.target.value)}/></label>
          <label className="block space-y-1.5 text-sm font-semibold">Coupon Expiry Date & Time<input className={input} type="datetime-local" value={couponEnd} onChange={e => setCouponEnd(e.target.value)}/></label>
          <button disabled={busy} className="w-full rounded-xl bg-red-700 p-3 font-bold text-white hover:bg-red-800 disabled:opacity-60">{busy ? "Generating..." : "Generate 6-Digit Coupon"}</button>
          {newCode && <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center"><p className="text-xs font-bold text-green-800">Generated coupon</p><p className="my-1 text-3xl font-black tracking-[.2em] text-green-900">{newCode}</p><button type="button" onClick={() => navigator.clipboard.writeText(newCode)} className="text-xs font-bold text-green-800 underline">Copy code</button></div>}
          <p className="text-[11px] leading-5 text-slate-500">Coupon record Firebase mein save hota hai. Customer side automatic apply aur payment validation next integration step hai.</p>
        </form>
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-black">Route coupons</h2><p className="text-xs text-slate-500">Live Firebase records</p></div>
          {loading ? <p className="p-5 text-sm text-slate-500">Loading...</p> : coupons.length === 0 ? <p className="p-5 text-sm text-slate-500">Koi coupon nahi hai.</p> : coupons.map(x => { const [s, c] = status(x.isActive, x.startAt, x.endAt); return <article key={x.id} className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><code className="rounded-lg bg-slate-100 px-3 py-1.5 text-lg font-black tracking-widest">{x.code}</code><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${c}`}>{s}</span></div><p className="mt-2 font-bold">{x.from} <span className="text-slate-400">→</span> {x.to}</p><p className="font-black text-green-700">{x.discountPercent}% OFF</p><p className="text-xs text-slate-500">{dateLabel(x.startAt)} — {dateLabel(x.endAt)} · Used {x.usageCount || 0} times</p></div><div className="flex gap-2"><button type="button" onClick={() => toggle("coupon", x.id, x.isActive)} className="rounded-lg border px-3 py-2 text-xs font-bold">{x.isActive ? "Deactivate" : "Activate"}</button><button type="button" onClick={() => remove("coupon", x.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700">Delete</button></div></article>; })}
        </section>
      </div>}
    </div>
  </main>;
}

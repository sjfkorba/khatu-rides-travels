"use client";

import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, CalendarCheck, CarFront,
  CircleHelp, Gauge, MapPin, MessageSquareText, Settings2, Wallet, Zap
} from "lucide-react";

const quickActions = [
  { label: "Create booking", href: "/admin/bookings", icon: CalendarCheck, tone: "orange" },
  { label: "Open fare engine", href: "/admin/fare-calculator", icon: Gauge, tone: "blue" },
  { label: "View enquiries", href: "/admin/leads", icon: MessageSquareText, tone: "violet" },
  { label: "Manage advance bookings", href: "/admin/advance-bookings", icon: CarFront, tone: "green" },
];

function MetricCard({ title, value, note, icon: Icon, tint }: {
  title: string; value: string; note: string;
  icon: React.ElementType; tint: "blue" | "orange" | "green" | "violet";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };
  return <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tint]}`}><Icon size={20}/></div>
      <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-400">Live data pending</span>
    </div>
    <p className="mt-4 text-xs font-semibold text-slate-500">{title}</p>
    <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">{value}</p>
    <p className="mt-1 text-[11px] text-slate-400">{note}</p>
  </div>;
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> ADMIN WORKSPACE
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Good day, Khatu Rides <span className="inline-block">👋</span></h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">Your operations, pricing and customer activity at a glance.</p>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#102B50] via-[#163D6C] to-[#1557A3] p-5 text-white shadow-xl shadow-blue-950/10 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10"/>
        <div className="pointer-events-none absolute -right-2 -top-12 h-52 w-52 rounded-full border border-white/10"/>
        <div className="pointer-events-none absolute bottom-0 right-20 h-32 w-32 rounded-full bg-orange-400/10 blur-3xl"/>
        <div className="relative">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-100">
                <Zap size={13} className="text-amber-300"/> Default workspace · Fare engine
              </div>
              <h2 className="mt-4 text-xl font-black tracking-tight sm:text-2xl">Fare Calculator Engine</h2>
              <p className="mt-1 max-w-xl text-xs leading-5 text-blue-100/80 sm:text-sm">Open the central fare workspace for route pricing, vehicle-wise B2C/B2B estimates and applicable fare rules.</p>
            </div>
            <Link href="/admin/fare-calculator" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-xs font-extrabold text-white shadow-lg transition hover:bg-orange-400">Launch fare engine <ArrowRight size={16}/></Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4"><div className="flex items-center gap-2 text-blue-100"><MapPin size={16}/><span className="text-[11px] font-bold">Route-based pricing</span></div><p className="mt-2 text-xs text-white/70">One Way · Round Trip · Local</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4"><div className="flex items-center gap-2 text-blue-100"><Wallet size={16}/><span className="text-[11px] font-bold">Dual fare view</span></div><p className="mt-2 text-xs text-white/70">Customer B2C · Vendor B2B</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4"><div className="flex items-center gap-2 text-blue-100"><Settings2 size={16}/><span className="text-[11px] font-bold">Fare intelligence</span></div><p className="mt-2 text-xs text-white/70">Pickup rules · Coupons · Surcharges</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between"><div><h2 className="text-sm font-black text-slate-900">Business snapshot</h2><p className="mt-0.5 text-[11px] text-slate-400">Connect your Firebase collections to show live totals.</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">Awaiting live data</span></div>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <MetricCard title="New enquiries" value="—" note="Lead pipeline" icon={MessageSquareText} tint="blue"/>
          <MetricCard title="Confirmed bookings" value="—" note="Booking operations" icon={CalendarCheck} tint="green"/>
          <MetricCard title="Payments received" value="—" note="Advance + balance" icon={Wallet} tint="orange"/>
          <MetricCard title="Active fleet" value="—" note="Vehicle availability" icon={CarFront} tint="violet"/>
        </div>
      </section>

      <section>
        <div className="mb-3"><h2 className="text-sm font-black text-slate-900">Quick actions</h2><p className="mt-0.5 text-[11px] text-slate-400">Jump directly to your most-used workflows.</p></div>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {quickActions.map((action) => { const Icon = action.icon; const tone = action.tone === "orange" ? "bg-orange-50 text-orange-600" : action.tone === "blue" ? "bg-blue-50 text-blue-600" : action.tone === "violet" ? "bg-violet-50 text-violet-600" : "bg-emerald-50 text-emerald-600"; return <Link key={action.label} href={action.href} className="group flex min-h-[88px] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon size={19}/></span><span className="min-w-0 flex-1 text-xs font-extrabold text-slate-700">{action.label}</span><ArrowUpRight size={15} className="shrink-0 text-slate-300 group-hover:text-blue-600"/></Link>; })}
        </div>
      </section>

      <section className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <CircleHelp size={18} className="mt-0.5 shrink-0 text-amber-600"/>
        <div><p className="text-xs font-extrabold text-amber-900">Live data integration</p><p className="mt-1 text-[11px] leading-5 text-amber-800/80">KPI values are deliberately shown as dashes until connected to actual Firestore collections.</p></div>
      </section>
      <footer className="pb-2 text-center text-[10px] text-slate-400">Khatu Rides Travels Co. · Admin Control Center</footer>
    </div>
  );
}

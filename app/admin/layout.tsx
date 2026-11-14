"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Activity, CalendarCheck, CarFront, FileText,
  Gauge, LayoutDashboard, LogOut, Menu, MessageSquareText,
  TicketPercent, Wallet, X, ClipboardList
} from "lucide-react";

const navigation = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Advance Bookings", href: "/admin/advance-bookings", icon: ClipboardList },
  { label: "Enquiries & Leads", href: "/admin/leads", icon: MessageSquareText },
  { label: "Customers", href: "/admin/customers", icon: CarFront },
  { label: "Fare Calculator", href: "/admin/fare-calculator", icon: Gauge },
  { label: "Fare Desk", href: "/admin/fare-desk", icon: Activity },
  { label: "Offers", href: "/admin/offers", icon: TicketPercent },
  { label: "Fare Promotions", href: "/admin/fare-promotions", icon: TicketPercent },
  { label: "Payments", href: "/admin/payments", icon: Wallet },
  { label: "Invoices", href: "/admin/invoices", icon: FileText },
];

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).format(now)
    : "--:--:-- --";
  const date = now
    ? new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(now)
    : "Loading date…";

  return (
    <div className="flex min-w-0 flex-col items-end leading-tight">
      <div className="flex items-center gap-1.5 font-mono text-sm font-black tabular-nums text-slate-900 sm:text-base">
        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]"/>
        {time}
      </div>
      <span className="mt-1 max-w-[190px] truncate text-[9px] font-semibold text-slate-500 sm:max-w-none sm:text-[10px]">{date} · IST</span>
    </div>
  );
}

function Sidebar({ pathname, close }: { pathname: string; close?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" onClick={close} className="flex items-center gap-3 px-2 py-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-200"><CarFront size={24}/></span>
        <span><span className="block text-[15px] font-black tracking-tight text-slate-950">Khatu Rides</span><span className="mt-0.5 block text-[9px] font-extrabold uppercase tracking-[0.2em] text-blue-600">Business CRM</span></span>
      </Link>
      <p className="mb-2 mt-7 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Admin workspace</p>
      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(item.href + "/");
          return <Link key={item.href} href={item.href} onClick={close} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>
            <Icon size={18} className={active ? "text-white" : "text-slate-400 group-hover:text-blue-600"}/>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {active && <span className="h-1.5 w-1.5 rounded-full bg-white"/>}
          </Link>;
        })}
      </nav>
      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-extrabold text-slate-800">One connected workspace</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">Switch modules without losing the dashboard navigation or live clock.</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [checkingAuth, setCheckingAuth] = useState(!isLoginPage);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (isLoginPage) { setCheckingAuth(false); return; }
    setCheckingAuth(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setCheckingAuth(false);
        router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin")}`);
        return;
      }
      setUser(currentUser);
      setCheckingAuth(false);
    }, (error) => {
      console.error("ADMIN AUTH CHECK ERROR:", error);
      setUser(null);
      setCheckingAuth(false);
      router.replace("/admin/login");
    });
    return () => unsubscribe();
  }, [isLoginPage, pathname, router]);

  const pageTitle = useMemo(() => navigation.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(item.href + "/")
  )?.label || "Admin Workspace", [pathname]);

  if (isLoginPage) return <>{children}</>;
  if (checkingAuth || !user) return <main className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-5"><div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"/><p className="mt-4 text-sm font-bold text-slate-800">Verifying admin session</p><p className="mt-1 text-xs text-slate-500">Please wait while we securely check your login.</p></div></main>;

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try { await signOut(auth); router.replace("/admin/login"); }
    catch (error) { console.error("ADMIN LOGOUT ERROR:", error); setLoggingOut(false); }
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-slate-200 bg-white px-4 pb-5 pt-4 xl:flex"><Sidebar pathname={pathname}/></aside>
      {mobileMenuOpen && <div className="fixed inset-0 z-50 xl:hidden"><button aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"/><aside className="absolute inset-y-0 left-0 w-[min(86vw,310px)] overflow-y-auto bg-white px-4 pb-5 pt-4 shadow-2xl"><div className="mb-2 flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Navigation</span><button onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={20}/></button></div><Sidebar pathname={pathname} close={() => setMobileMenuOpen(false)}/></aside></div>}
      <div className="min-h-screen xl:pl-[264px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[68px] max-w-[1600px] items-center gap-3 px-3 sm:px-6 lg:px-8">
            <button onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 xl:hidden"><Menu size={20}/></button>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold text-slate-900">{pageTitle}</p><p className="hidden text-[11px] text-slate-400 sm:block">Khatu Rides Travels Co. · Admin Control Center</p></div>
            <LiveClock/>
            <button onClick={logout} disabled={loggingOut} className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50" title="Logout"><LogOut size={16}/><span className="hidden sm:inline">{loggingOut ? "Logging out…" : "Logout"}</span></button>
          </div>
        </header>
        <div className="mx-auto max-w-[1600px] px-3 py-5 pb-8 sm:px-6 sm:py-7 lg:px-8">{children}</div>
      </div>
    </main>
  );
}

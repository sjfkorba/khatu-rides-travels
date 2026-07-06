"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Email aur password enter karein.");
      return;
    }

    setLoading(true);

    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");

      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/admin/bookings");
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      alert(error?.code || error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f5f7] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100">
        {/* Left Branding */}
        <section className="hidden md:flex flex-col justify-between bg-slate-950 text-white p-10">
          <div>
            <div className="h-14 w-14 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-900/30">
              <Car size={28} />
            </div>

            <h1 className="mt-8 text-4xl font-black leading-tight">
              Khatu Rides CRM
            </h1>

            <p className="mt-4 text-white/60 leading-7">
              Leads, B2B partners, follow-up aur booking management ke liye
              secure admin dashboard.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-bold">Active Lead Tracking</p>
              <p className="text-xs text-white/50 mt-1">
                Call, WhatsApp aur follow-up status ek jagah.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-bold">B2B Ertiga Broadcast</p>
              <p className="text-xs text-white/50 mt-1">
                Travel partners ko professional message quickly bhejein.
              </p>
            </div>
          </div>
        </section>

        {/* Login Form */}
        <section className="p-6 md:p-10">
          <div className="md:hidden mb-8 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center">
              <Car size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black">Khatu Rides CRM</h1>
              <p className="text-xs text-slate-500">Secure admin login</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
            <ShieldCheck size={16} />
            Secure Admin Access
          </div>

          <h2 className="mt-6 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
            Welcome Back
          </h2>

          <p className="mt-3 text-slate-500">
            Khatu Rides Leads Dashboard access karne ke liye login karein.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-500 focus-within:bg-white transition">
              <label className="text-xs font-bold text-slate-400">
                Email Address
              </label>
              <div className="mt-1 flex items-center gap-3">
                <Mail size={18} className="text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none font-semibold text-slate-900 placeholder:text-slate-400"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") login();
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-500 focus-within:bg-white transition">
              <label className="text-xs font-bold text-slate-400">
                Password
              </label>
              <div className="mt-1 flex items-center gap-3">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none font-semibold text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") login();
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="w-full rounded-2xl bg-orange-600 hover:bg-orange-700 text-white py-4 font-black shadow-lg shadow-orange-200 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            <p className="font-bold text-slate-700">Security Note</p>
            <p className="mt-1">
              Ye page sirf Khatu Rides Travels Co. admin team ke liye hai.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
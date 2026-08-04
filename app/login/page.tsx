// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider, db } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [needsPhoneModal, setNeedsPhoneModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const customerRef = doc(db, "customers", user.uid);
      const customerSnap = await getDoc(customerRef);

      if (!customerSnap.exists() || !customerSnap.data().phone) {
        // If first time or phone missing, prompt for phone number
        setPendingUser(user);
        setNeedsPhoneModal(true);
        setLoading(false);
        return;
      }

      // Existing customer login sync
      await setDoc(customerRef, {
        lastLoginAt: serverTimestamp(),
      }, { merge: true });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google login error:", error);
      alert("Login failed: " + error.message);
      setLoading(false);
    }
  };

  const handleSavePhoneAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length < 10) {
      alert("Kripya sahi 10-digit mobile number darj karein.");
      return;
    }

    setLoading(true);
    try {
      const user = pendingUser;
      const customerRef = doc(db, "customers", user.uid);

      // Professional Travel Agency Customer Schema
      await setDoc(customerRef, {
        uid: user.uid,
        name: user.displayName || "Valued Customer",
        email: user.email || "",
        phone: phoneInput.trim(),
        photoURL: user.photoURL || "",
        totalTrips: 0,
        walletBalance: 0,
        membershipTier: "Standard",
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      }, { merge: true });

      router.push("/dashboard");
    } catch (err: any) {
      alert("Error saving profile: " + err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 flex items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
      
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 text-center"
      >
        {/* Brand Header */}
        <div className="mb-8">
          <div className="inline-block p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-2xl mb-3">
            🚖
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-white">
            Khatu<span className="text-orange-500">Rides</span>
          </h1>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-400 block mt-1">Travels Co. Customer Portal</span>
        </div>

        {!needsPhoneModal ? (
          <div className="space-y-6">
            <div className="text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <h2 className="text-sm font-black text-white">Welcome Traveler!</h2>
              <p className="text-xs text-slate-400 mt-0.5">Sign in to manage bookings, track live cab allocation, and download instant tax invoices.</p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-xl transition disabled:opacity-50"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              {loading ? "Connecting..." : "Continue with Google"}
            </button>

            <p className="text-[10px] text-slate-500">
              By continuing, you agree to Khatu Rides <span className="underline cursor-pointer">Terms & Conditions</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSavePhoneAndProceed} className="space-y-5 text-left">
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl text-center">
              <span className="text-xs font-black text-orange-400 uppercase tracking-widest block">One Last Step</span>
              <h3 className="text-sm font-black text-white mt-1">Verify Mobile Number</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Driver details & trip updates will be sent via SMS/WhatsApp.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Mobile Number *</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden focus-within:border-orange-500 transition">
                <span className="bg-slate-900 px-4 py-3.5 text-xs font-bold text-slate-400 border-r border-slate-800">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
                  required
                  className="w-full bg-transparent px-4 py-3.5 text-xs font-bold text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-orange-600/30 transition disabled:opacity-50"
            >
              {loading ? "Creating Profile..." : "Complete Signup & Enter Dashboard"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <a href="/" className="hover:text-white transition">← Back to Home</a>
          <a href="tel:+919244137353" className="text-orange-400 hover:underline">Need Help?</a>
        </div>
      </motion.div>
    </main>
  );
}
"use client";
import React from "react";

export default function ProfileSettings({ currentUser }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
      <h3 className="text-xl font-black text-slate-900">Profile Settings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-slate-400 uppercase tracking-widest text-[10px] block">Full Name</span>
          <span className="text-slate-900 text-sm mt-1 block">{currentUser?.displayName || "Rahul Sharma"}</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-slate-400 uppercase tracking-widest text-[10px] block">Email Address</span>
          <span className="text-slate-900 text-sm mt-1 block">{currentUser?.email || "rahul@example.com"}</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-slate-400 uppercase tracking-widest text-[10px] block">Phone Number</span>
          <span className="text-slate-900 text-sm mt-1 block">{currentUser?.phoneNumber || "+91 98765 43210"}</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-slate-400 uppercase tracking-widest text-[10px] block">Membership Status</span>
          <span className="text-orange-600 text-sm mt-1 block">👑 Verified Elite Pro (₹1,101 Signup Bonus Active)</span>
        </div>
      </div>
    </div>
  );
}
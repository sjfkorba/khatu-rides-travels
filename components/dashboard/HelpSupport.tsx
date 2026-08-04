"use client";
import React from "react";

export default function HelpSupport() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-center">
      <h3 className="text-xl font-black text-slate-900">24x7 Customer Help Desk</h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto">Need help with your upcoming booking or invoice? Connect instantly with our senior travel coordinator desk.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <a href="https://wa.me/919244137353" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase py-4 px-8 rounded-2xl shadow-md transition">
          💬 Chat on WhatsApp
        </a>
        <a href="tel:+919244137353" className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase py-4 px-8 rounded-2xl shadow-md transition">
          📞 Call 9244137353
        </a>
      </div>
    </div>
  );
}
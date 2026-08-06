// components/dashboard/HelpSupport.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I get my driver and cab details?",
      a: "Driver name, mobile number, and cab number are sent via SMS and WhatsApp 30 minutes before your scheduled pickup time. You can also view them anytime under 'My Bookings'."
    },
    {
      q: "Are toll charges, state tax, and parking included?",
      a: "Yes! All standard intercity fares quoted on Khatu Rides include toll taxes and state border taxes as per your selected package."
    },
    {
      q: "How can I use my ₹1,101 Signup Wallet balance?",
      a: "When booking any intercity cab, you can check the 'Use Signup Wallet' box on the secure checkout screen to instantly save up to ₹200 on your trip."
    },
    {
      q: "What is the cancellation and refund policy?",
      a: "You can cancel your booking for free up to 1 hour before pickup time. Advance trial payments or wallet deductions are fully refunded to your account or original payment method."
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-br from-[#0b101d] via-[#111827] to-[#1f2937] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <span className="bg-orange-600 text-white text-[9px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest shadow-sm">
          🎧 24X7 DEDICATED DESK
        </span>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-3">How Can We Help You Today?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1 leading-relaxed">
          Need assistance with your ongoing trip, invoice download, or route allocation? Connect with our senior coordinators instantly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 relative z-10">
          <a 
            href="https://wa.me/919244137353" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider py-4 px-8 rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <span>💬</span> Chat on WhatsApp Desk
          </a>
          <a 
            href="tel:+919244137353" 
            className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider py-4 px-8 rounded-2xl shadow-lg shadow-orange-600/30 transition flex items-center justify-center gap-2"
          >
            <span>📞</span> Call: +91 92441 37353
          </a>
        </div>
      </div>

      {/* Support Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 p-5 rounded-3xl shadow-md text-center space-y-2">
          <span className="text-3xl">⏰</span>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Operating Hours</h4>
          <p className="text-xs text-slate-500">24 Hours Open • 7 Days a week across Chhattisgarh & MP</p>
        </div>
        <div className="bg-white border border-slate-200/90 p-5 rounded-3xl shadow-md text-center space-y-2">
          <span className="text-3xl">⚡</span>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Average Response</h4>
          <p className="text-xs text-slate-500">Under 2 minutes via WhatsApp or direct phone call</p>
        </div>
        <div className="bg-white border border-slate-200/90 p-5 rounded-3xl shadow-md text-center space-y-2">
          <span className="text-3xl">🛡️</span>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Verified Safety</h4>
          <p className="text-xs text-slate-500">100% secure ride tracking & verified chauffeur records</p>
        </div>
      </div>

      {/* Frequently Asked Questions Section */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md space-y-4 text-left">
        <div className="border-b border-slate-100 pb-3">
          <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <span>💡</span> Frequently Asked Questions (FAQ)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">Quick answers to common booking & travel queries</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50 transition hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between font-black text-xs sm:text-sm text-slate-900 transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-orange-600 text-lg transition-transform duration-200" style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
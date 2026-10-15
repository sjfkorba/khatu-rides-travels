"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PHONE, PHONE_DISPLAY, WHATSAPP } from "./data";
import Icon from "./Icons";

export default function Hero() {
  // Form State for Lead Capture
  const [tripType, setTripType] = useState("One-Way");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  // Reuse the same places-autocomplete API and behaviour as FareCalculator.
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  const pickupAbortRef = useRef<AbortController | null>(null);
  const dropAbortRef = useRef<AbortController | null>(null);
  const pickupRequestRef = useRef(0);
  const dropRequestRef = useRef(0);
  const pickupSelectedRef = useRef(false);
  const dropSelectedRef = useRef(false);
  const pickupFieldRef = useRef<HTMLDivElement>(null);
  const dropFieldRef = useRef<HTMLDivElement>(null);

  const MIN_AUTOCOMPLETE_CHARS = 3;
  const DEBOUNCE_MS = 350;
  const sanitizeSuggestions = (input: unknown): string[] => {
    if (!Array.isArray(input)) return [];
    return Array.from(new Set(input.map((item: any) =>
      typeof item === "string" ? item.trim() : String(item?.description || item?.formatted_address || "").trim()
    ).filter(Boolean))).slice(0, 6);
  };

  useEffect(() => {
    const value = pickup.trim();
    const requestId = ++pickupRequestRef.current;
    pickupAbortRef.current?.abort();
    pickupAbortRef.current = null;

    if (pickupSelectedRef.current) {
      pickupSelectedRef.current = false;
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
      return;
    }
    if (value.length < MIN_AUTOCOMPLETE_CHARS) {
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      const controller = new AbortController();
      pickupAbortRef.current = controller;
      try {
        const response = await fetch(`/api/places-autocomplete?input=${encodeURIComponent(value)}`, {
          signal: controller.signal, cache: "no-store", headers: { Accept: "application/json" },
        });
        const raw = await response.text();
        if (!response.ok || requestId !== pickupRequestRef.current) return;
        let data: any;
        try { data = JSON.parse(raw); } catch { return; }
        if (requestId !== pickupRequestRef.current) return;
        const results = sanitizeSuggestions(data?.predictions ?? data?.results);
        setPickupSuggestions(results);
        setShowPickupSuggestions(results.length > 0);
      } catch (error: any) {
        if (error?.name !== "AbortError") console.error("Hero pickup autocomplete error:", error);
      }
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [pickup]);

  useEffect(() => {
    const value = drop.trim();
    const requestId = ++dropRequestRef.current;
    dropAbortRef.current?.abort();
    dropAbortRef.current = null;

    if (dropSelectedRef.current) {
      dropSelectedRef.current = false;
      setDropSuggestions([]);
      setShowDropSuggestions(false);
      return;
    }
    if (value.length < MIN_AUTOCOMPLETE_CHARS) {
      setDropSuggestions([]);
      setShowDropSuggestions(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      const controller = new AbortController();
      dropAbortRef.current = controller;
      try {
        const response = await fetch(`/api/places-autocomplete?input=${encodeURIComponent(value)}`, {
          signal: controller.signal, cache: "no-store", headers: { Accept: "application/json" },
        });
        const raw = await response.text();
        if (!response.ok || requestId !== dropRequestRef.current) return;
        let data: any;
        try { data = JSON.parse(raw); } catch { return; }
        if (requestId !== dropRequestRef.current) return;
        const results = sanitizeSuggestions(data?.predictions ?? data?.results);
        setDropSuggestions(results);
        setShowDropSuggestions(results.length > 0);
      } catch (error: any) {
        if (error?.name !== "AbortError") console.error("Hero drop autocomplete error:", error);
      }
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [drop]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (pickupFieldRef.current && !pickupFieldRef.current.contains(target)) setShowPickupSuggestions(false);
      if (dropFieldRef.current && !dropFieldRef.current.contains(target)) setShowDropSuggestions(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => () => {
    pickupAbortRef.current?.abort();
    dropAbortRef.current?.abort();
  }, []);

  const selectPickupSuggestion = (value: string) => {
    pickupSelectedRef.current = true;
    pickupRequestRef.current += 1;
    pickupAbortRef.current?.abort();
    setPickup(value);
    setPickupSuggestions([]);
    setShowPickupSuggestions(false);
  };

  const selectDropSuggestion = (value: string) => {
    dropSelectedRef.current = true;
    dropRequestRef.current += 1;
    dropAbortRef.current?.abort();
    setDrop(value);
    setDropSuggestions([]);
    setShowDropSuggestions(false);
  };
  const [travelDate, setTravelDate] = useState("");
  const [car, setCar] = useState("Ertiga (6-seater)");
  const [note, setNote] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state for Thank You screen

  const telUrl = `tel:${PHONE}`;

  // Pre-generate WhatsApp URL for the success screen
  const whatsappMessage = `Hello Khatu Rides, I need an enquiry:\n*Trip Type:* ${tripType}\n*Name:* ${name}\n*Mobile:* ${mobile}\n*From:* ${pickup}\n*To:* ${drop}\n*Date:* ${travelDate || "Flexible"}\n*Car:* ${car}\n*Note:* ${note || "-"}\n\nPlease share the best fare.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

  // Handle Form Submit -> Send Email & Show Thank You Screen
  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !drop || !name || !mobile) return;
    setIsSubmitting(true);

    const enquiryData = {
      tripType,
      name,
      mobile,
      pickup,
      drop,
      travelDate: travelDate || "Flexible",
      car,
      note: note || "-"
    };

    try {
      // 1. Send data to Next.js API route to trigger email
      await fetch("/api/send-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryData),
      });
    } catch (error) {
      console.error("Failed to send email", error);
    } finally {
      setIsSubmitting(false);
      // 2. Show Success Screen instead of redirecting directly
      setIsSubmitted(true);
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && typeof (window as any).gtag_report_conversion === "function") {
      (window as any).gtag_report_conversion(telUrl);
    } else {
      window.location.href = telUrl;
    }
  };

  // Reset form to submit a new enquiry
  const handleReset = () => {
    setIsSubmitted(false);
    setPickup("");
    setDrop("");
    setName("");
    setMobile("");
    setNote("");
  };

  return (
    <section className="relative bg-slate-50 overflow-hidden font-sans pt-4 pb-12 lg:py-12">
      {/* -------------------------------------------------------------
          1. TOP HINDI MARQUEE TICKER 
      -------------------------------------------------------------- */}
      <div className="absolute top-0 w-full bg-slate-900 border-b-4 border-amber-400 z-20">
        <div className="flex h-10 items-center overflow-hidden max-w-7xl mx-auto px-4">
          <div className="flex shrink-0 animate-marquee items-center gap-12 text-[13px] font-medium tracking-wide text-white">
            <span className="inline-flex items-center gap-2">
              <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900 uppercase">Discount</span>
              कोरबा से रायपुर / बिलासपुर वन-वे टैक्सी. एडवांस बुकिंग पर विशेष छूट!
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            <span className="inline-flex items-center gap-2">
              <span className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">24/7 Service</span>
              छत्तीसगढ़ में एयरपोर्ट ड्रॉप और कमर्शियल बुकिंग के लिए तुरंत कॉल करें.
            </span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 mt-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          
          {/* -------------------------------------------------------------
              LEFT COLUMN: HIGH-IMPACT BUSINESS PITCH & TRUST SIGNALS
          -------------------------------------------------------------- */}
          <div className="space-y-7 z-10 lg:col-span-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800 mb-4 border border-amber-200">
                ⭐ 4.9/5 Top Rated Travel Firm in CG
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] leading-[1.1]">
                KHATU RIDES <br />
                <span className="text-amber-500">TRAVELS CO.</span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 font-semibold max-w-lg">
                Premium Cabs for One-Way, Round Trips & Airport Transfers. <br className="hidden sm:block"/> 
                <span className="text-slate-900">Zero Hidden Cost. Pay After Drop.</span>
              </p>
            </div>

            {/* Quick Action Buttons (Primary CTAs) */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={telUrl}
                onClick={handleCall}
                className="group flex flex-1 items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-4 font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon name="phone" size={24} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wider text-amber-400 font-bold">Call Dispatch Desk</span>
                  <span className="text-xl tracking-wide">{PHONE_DISPLAY || "Call Us Now"}</span>
                </div>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello`}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-1 items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 font-bold text-white shadow-lg shadow-green-200 transition-all hover:bg-[#20bd5a] hover:shadow-xl hover:-translate-y-1"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon name="whatsapp" size={24} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wider text-green-100 font-bold">Fastest Reply</span>
                  <span className="text-xl tracking-wide">WhatsApp Us</span>
                </div>
              </a>
            </div>

            {/* Trust Badges - Crucial for Conversion */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 max-w-lg">
              <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl mb-1">🛡️</span>
                <span className="text-xs font-bold text-slate-800">Verified Drivers</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl mb-1">₹</span>
                <span className="text-xs font-bold text-slate-800">No Advance</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl mb-1">❄️</span>
                <span className="text-xs font-bold text-slate-800">Clean AC Cabs</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              RIGHT COLUMN: LEAD CAPTURE FORM OR SUCCESS MESSAGE
          -------------------------------------------------------------- */}
          <div className="lg:col-span-5 z-10 w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 p-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/pattern.png')] mix-blend-overlay"></div>
                <h3 className="text-xl font-extrabold text-white relative z-10">Get Instant Fare Quote</h3>
                <p className="text-amber-400 text-sm font-semibold relative z-10 mt-1">100% Assured Cab Availability</p>
              </div>
              
              {isSubmitted ? (
                /* SUCCESS MESSAGE SCREEN */
                <div className="p-8 text-center space-y-5 animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">Thank You, {name}!</h4>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Your enquiry for <span className="font-bold text-slate-800">{pickup} to {drop}</span> has been received successfully. Our team will contact you shortly with the best fare.
                  </p>
                  
                  <div className="w-full h-px bg-slate-100 my-4"></div>
                  
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">For Instant Response:</p>
                  
                  <div className="flex flex-col gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
                    >
                      Chat on WhatsApp <Icon name="whatsapp" size={20} />
                    </a>
                    
                    <a
                      href={telUrl}
                      onClick={handleCall}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-3.5 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
                    >
                      Call Us Now <Icon name="phone" size={20} />
                    </a>
                  </div>

                  <button 
                    onClick={handleReset}
                    className="text-slate-400 hover:text-amber-500 text-sm font-semibold mt-4 transition-colors"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                /* LEAD CAPTURE FORM */
                <form onSubmit={handleQuickBook} className="p-6 space-y-4">
                  {/* Trip Type Selector */}
                  <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
                    {["One-Way", "Round Trip", "Airport"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTripType(type)}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                          tripType === type 
                            ? "bg-white text-slate-900 shadow-sm" 
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                    
                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile</label>
                      <input 
                        type="tel" 
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>

                    <div className="relative col-span-2 sm:col-span-1" ref={pickupFieldRef}>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pickup</label>
                      <input
                        type="text"
                        placeholder="e.g. Korba"
                        required
                        autoComplete="off"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={showPickupSuggestions && pickupSuggestions.length > 0}
                        value={pickup}
                        onFocus={() => { if (pickupSuggestions.length > 0) setShowPickupSuggestions(true); }}
                        onChange={(e) => { pickupSelectedRef.current = false; setPickup(e.target.value); if (e.target.value.trim().length < MIN_AUTOCOMPLETE_CHARS) setShowPickupSuggestions(false); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                      {showPickupSuggestions && pickupSuggestions.length > 0 && (
                        <ul role="listbox" className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                          {pickupSuggestions.map((suggestion, index) => (
                            <li key={`${suggestion}-${index}`}>
                              <button type="button" role="option" aria-selected={false} onClick={() => selectPickupSuggestion(suggestion)} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-slate-900 focus:bg-amber-50 focus:outline-none">{suggestion}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <div className="relative col-span-2 sm:col-span-1" ref={dropFieldRef}>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Drop</label>
                      <input
                        type="text"
                        placeholder="e.g. Bilaspur"
                        required
                        autoComplete="off"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={showDropSuggestions && dropSuggestions.length > 0}
                        value={drop}
                        onFocus={() => { if (dropSuggestions.length > 0) setShowDropSuggestions(true); }}
                        onChange={(e) => { dropSelectedRef.current = false; setDrop(e.target.value); if (e.target.value.trim().length < MIN_AUTOCOMPLETE_CHARS) setShowDropSuggestions(false); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                      {showDropSuggestions && dropSuggestions.length > 0 && (
                        <ul role="listbox" className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                          {dropSuggestions.map((suggestion, index) => (
                            <li key={`${suggestion}-${index}`}>
                              <button type="button" role="option" aria-selected={false} onClick={() => selectDropSuggestion(suggestion)} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-slate-900 focus:bg-amber-50 focus:outline-none">{suggestion}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Travel Date</label>
                      <input 
                        type="date" 
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>

                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Car Type</label>
                      <select 
                        value={car}
                        onChange={(e) => setCar(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      >
                        <option>Sedan (4-seater)</option>
                        <option>Ertiga (6-seater)</option>
                        <option>Innova (7-seater)</option>
                      </select>
                    </div>
                    
                    <div className="relative col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Note (Optional)</label>
                      <input 
                        type="text" 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Any specific requirement?"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-lg py-4 rounded-xl shadow-[0_4px_14px_0_rgba(251,191,36,0.39)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.23)] hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? "Sending..." : "Submit Enquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-amber-300/20 rounded-full blur-[80px] -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] -z-10" />

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PHONE, WHATSAPP } from "./data";
import Icon from "./Icons";

// TypeScript interface updated to accept titleText and subtitleText
interface RouteHeroProps {
  initialPickup?: string;
  initialDrop?: string;
  titleText?: string;
  subtitleText?: string;
}

export default function RouteHero({ 
  initialPickup = "", 
  initialDrop = "",
  titleText,
  subtitleText
}: RouteHeroProps) {
  const [tripType, setTripType] = useState("One-Way");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pickup, setPickup] = useState(initialPickup);
  const [drop, setDrop] = useState(initialDrop);

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
  const [isSubmitted, setIsSubmitted] = useState(false);

  const telUrl = `tel:${PHONE}`;
  const whatsappMessage = `Hello Khatu Rides, I need an enquiry:\n*Trip Type:* ${tripType}\n*Name:* ${name}\n*Mobile:* ${mobile}\n*From:* ${pickup}\n*To:* ${drop}\n*Date:* ${travelDate || "Flexible"}\n*Car:* ${car}\n*Note:* ${note || "-"}\n\nPlease share the best fare.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !drop || !name || !mobile) return;
    setIsSubmitting(true);

    const enquiryData = { tripType, name, mobile, pickup, drop, travelDate: travelDate || "Flexible", car, note: note || "-" };

    try {
      await fetch("/api/send-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryData),
      });
    } catch (error) {
      console.error("Failed to send email", error);
    } finally {
      setIsSubmitting(false);
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

  const handleReset = () => {
    setIsSubmitted(false);
    setPickup(initialPickup);
    setDrop(initialDrop);
    setName("");
    setMobile("");
    setNote("");
  };

  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-[#06142d] pt-4 pb-12 font-sans lg:py-12">
      <div className="absolute inset-0 -z-20 kr-hero-bg-enter">
        <Image
          src="/hero/main%20image.png"
          alt="Khatu Rides premium taxi travel background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[#06142d]/75" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#041027]/95 via-[#071a38]/80 to-[#06142d]/65" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#06142d]/60 via-transparent to-[#020817]/90" />
      <div className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-80 w-80 rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-amber-400/10 blur-[130px]" />
      
      <div className="absolute top-0 z-20 w-full border-b border-amber-400/70 bg-[#041027]/85 shadow-lg shadow-black/20 backdrop-blur-md">
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

      <div className="relative mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8 lg:mt-16">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          
          <div className="z-10 space-y-7 lg:col-span-7 lg:pr-8 kr-hero-left-enter">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-white/10 px-4 py-2 text-sm font-bold text-amber-200 shadow-lg shadow-black/10 backdrop-blur-md kr-hero-badge-enter">
                ⭐ 4.9/5 Top Rated Travel Firm in CG
              </div>
              
              {/* Conditional Title Rendering */}
              {titleText ? (
                <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-[54px] xl:text-[60px] kr-hero-title-enter">
                  {titleText}
                </h1>
              ) : (
                <h1 className="text-4xl font-black leading-[1.04] tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-[64px] xl:text-[72px] kr-hero-title-enter">
                  KHATU RIDES <br />
                  <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">TRAVELS CO.</span>
                </h1>
              )}

              {/* Conditional Subtitle Rendering */}
              <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-blue-50/90 sm:text-xl kr-hero-copy-enter">
                {subtitleText || "Book reliable cabs across Chhattisgarh for one-way drops, outstation round trips, and seamless airport transfers. Enjoy 100% transparent pricing, doorstep pickup, premium AC vehicles, and verified chauffeurs with instant WhatsApp booking support."} 
                <br className="hidden sm:block"/> 
                <span className="font-bold text-white mt-1 block">Zero Hidden Cost. Pay After Drop.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 kr-hero-actions-enter">
              <a
                href={telUrl}
                onClick={handleCall}
                className="kr-call-glow group flex flex-1 items-center justify-center gap-3 rounded-2xl border border-yellow-200/90 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 px-6 py-4 font-bold text-[#07162f] shadow-[0_0_22px_rgba(250,204,21,0.48),0_12px_32px_rgba(234,179,8,0.28)] transition-all duration-300 hover:-translate-y-1 hover:from-yellow-200 hover:via-amber-300 hover:to-yellow-400"
              >
                <div className="rounded-xl bg-white/55 p-2 text-[#07162f] shadow-inner transition-transform duration-300 group-hover:scale-110">
                  <Icon name="phone" size={24} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wider text-[#5a3900] font-extrabold">Talk To Our Team</span>
                  <span className="text-xl tracking-wide text-[#07162f]">BOOK VIA CALL</span>
                </div>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello`}
                target="_blank"
                rel="noreferrer"
                className="kr-whatsapp-glow group flex flex-1 items-center justify-center gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#b9ffd2] via-[#91f5b7] to-[#70e99c] px-6 py-4 font-bold text-[#063b24] shadow-[0_0_22px_rgba(74,222,128,0.42),0_12px_32px_rgba(34,197,94,0.22)] transition-all duration-300 hover:-translate-y-1 hover:from-[#d0ffe0] hover:via-[#a7f8c3] hover:to-[#83efaa]"
              >
                <div className="rounded-xl bg-white/65 p-2 text-[#087443] shadow-inner transition-transform duration-300 group-hover:scale-110">
                  <Icon name="whatsapp" size={24} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wider text-[#17633e] font-extrabold">Fastest Reply</span>
                  <span className="text-xl tracking-wide text-[#063b24]">WHATSAPP US</span>
                </div>
              </a>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3 border-t border-white/20 pt-5 kr-hero-trust-enter">
              <div className="kr-trust-item flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.09] p-3 text-center shadow-lg shadow-black/10 backdrop-blur-md">
                <span className="text-2xl mb-1">🛡️</span>
                <span className="text-xs font-bold text-white">Verified Drivers</span>
              </div>
              <div className="kr-trust-item flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.09] p-3 text-center shadow-lg shadow-black/10 backdrop-blur-md">
                <span className="text-2xl mb-1">₹</span>
                <span className="text-xs font-bold text-white">No Advance</span>
              </div>
              <div className="kr-trust-item flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.09] p-3 text-center shadow-lg shadow-black/10 backdrop-blur-md">
                <span className="text-2xl mb-1">❄️</span>
                <span className="text-xs font-bold text-white">Clean AC Cabs</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 z-10 w-full max-w-md mx-auto lg:mx-0 kr-hero-form-enter">
            <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.45)] ring-1 ring-black/10 kr-form-shell-enter">
              <div className="relative overflow-hidden bg-gradient-to-br from-[#06142d] via-[#0b2850] to-[#102f5a] p-5 text-center kr-form-header-enter">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_45%)]"></div>
                <h3 className="text-xl font-extrabold text-white relative z-10">Get Instant Fare Quote</h3>
                <p className="text-amber-400 text-sm font-semibold relative z-10 mt-1">100% Assured Cab Availability</p>
              </div>
              
              {isSubmitted ? (
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
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="kr-whatsapp-glow w-full bg-gradient-to-r from-[#b9ffd2] via-[#91f5b7] to-[#70e99c] text-[#063b24] font-extrabold text-lg py-3.5 rounded-xl border border-emerald-100 flex justify-center items-center gap-2">
                      Chat on WhatsApp <Icon name="whatsapp" size={20} />
                    </a>
                    
                    <a href={telUrl} onClick={handleCall} className="kr-call-glow w-full bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-[#07162f] font-extrabold text-lg py-3.5 rounded-xl border border-yellow-200 flex justify-center items-center gap-2">
                      Call Us Now <Icon name="phone" size={20} />
                    </a>
                  </div>

                  <button onClick={handleReset} className="text-slate-400 hover:text-amber-500 text-sm font-semibold mt-4 transition-colors">
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickBook} className="space-y-4 p-5 sm:p-6 kr-form-fields-enter">
                  <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
                    {["One-Way", "Round Trip", "Airport"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTripType(type)}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tripType === type ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/15" />
                    </div>
                    
                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile</label>
                      <input type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/15" />
                    </div>

                    <div className="relative col-span-2 sm:col-span-1" ref={pickupFieldRef}>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pickup</label>
                      <input type="text" placeholder="e.g. Korba" required autoComplete="off" value={pickup} onFocus={() => { if (pickupSuggestions.length > 0) setShowPickupSuggestions(true); }} onChange={(e) => { pickupSelectedRef.current = false; setPickup(e.target.value); if (e.target.value.trim().length < MIN_AUTOCOMPLETE_CHARS) setShowPickupSuggestions(false); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/15" />
                      {showPickupSuggestions && pickupSuggestions.length > 0 && (
                        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                          {pickupSuggestions.map((suggestion, index) => (
                            <li key={`${suggestion}-${index}`}>
                              <button type="button" onClick={() => selectPickupSuggestion(suggestion)} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-amber-50">{suggestion}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <div className="relative col-span-2 sm:col-span-1" ref={dropFieldRef}>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Drop</label>
                      <input type="text" placeholder="e.g. Bilaspur" required autoComplete="off" value={drop} onFocus={() => { if (dropSuggestions.length > 0) setShowDropSuggestions(true); }} onChange={(e) => { dropSelectedRef.current = false; setDrop(e.target.value); if (e.target.value.trim().length < MIN_AUTOCOMPLETE_CHARS) setShowDropSuggestions(false); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/15" />
                      {showDropSuggestions && dropSuggestions.length > 0 && (
                        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                          {dropSuggestions.map((suggestion, index) => (
                            <li key={`${suggestion}-${index}`}>
                              <button type="button" onClick={() => selectDropSuggestion(suggestion)} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-amber-50">{suggestion}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Travel Date</label>
                      <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/15" />
                    </div>

                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Car Type</label>
                      <select value={car} onChange={(e) => setCar(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/15">
                        <option>Sedan (4-seater)</option>
                        <option>Ertiga (6-seater)</option>
                        <option>Innova (7-seater)</option>
                      </select>
                    </div>
                    
                    <div className="relative col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Note (Optional)</label>
                      <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any specific requirement?" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/15" />
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full mt-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-lg py-4 rounded-xl flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
                    {isSubmitting ? "Sending..." : "Submit Enquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        @keyframes krCallGlow { 0%, 100% { box-shadow: 0 0 18px rgba(250, 204, 21, 0.38), 0 12px 30px rgba(234, 179, 8, 0.20); } 50% { box-shadow: 0 0 30px rgba(250, 204, 21, 0.68), 0 12px 38px rgba(234, 179, 8, 0.34); } }
        @keyframes krWhatsappGlow { 0%, 100% { box-shadow: 0 0 18px rgba(74, 222, 128, 0.32), 0 12px 30px rgba(34, 197, 94, 0.16); } 50% { box-shadow: 0 0 30px rgba(74, 222, 128, 0.58), 0 12px 38px rgba(34, 197, 94, 0.28); } }
        .kr-call-glow { animation: krCallGlow 2.6s ease-in-out infinite; }
        .kr-whatsapp-glow { animation: krWhatsappGlow 2.8s ease-in-out infinite; }
        @keyframes krHeroFadeUp { from { opacity: 0; transform: translate3d(0, 24px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
        @keyframes krHeroSlideLeft { from { opacity: 0; transform: translate3d(-34px, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
        @keyframes krHeroSlideRight { from { opacity: 0; transform: translate3d(34px, 12px, 0) scale(0.985); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
        @keyframes krHeroBackgroundReveal { from { opacity: 0.55; transform: scale(1.045); } to { opacity: 1; transform: scale(1); } }
        .kr-hero-bg-enter { animation: krHeroBackgroundReveal 1.2s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
        .kr-hero-left-enter { animation: krHeroSlideLeft 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.08s both; }
        .kr-hero-badge-enter { animation: krHeroFadeUp 0.55s ease-out 0.2s both; }
        .kr-hero-title-enter { animation: krHeroFadeUp 0.75s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s both; }
        .kr-hero-copy-enter { animation: krHeroFadeUp 0.65s ease-out 0.44s both; }
        .kr-hero-actions-enter { animation: krHeroFadeUp 0.65s ease-out 0.56s both; }
        .kr-hero-trust-enter { animation: krHeroFadeUp 0.65s ease-out 0.68s both; }
        .kr-hero-form-enter { animation: krHeroSlideRight 0.85s cubic-bezier(0.2, 0.7, 0.2, 1) 0.22s both; }
        .kr-form-shell-enter { transform-origin: center right; }
        .kr-form-header-enter { animation: krHeroFadeUp 0.6s ease-out 0.45s both; }
        .kr-form-fields-enter > div { animation: krHeroFadeUp 0.48s ease-out both; }
        .kr-form-fields-enter > div:first-child { animation-delay: 0.5s; }
        .kr-form-fields-enter > div:nth-child(2) > div:nth-child(1) { animation-delay: 0.57s; }
        .kr-form-fields-enter > div:nth-child(2) > div:nth-child(2) { animation-delay: 0.64s; }
        .kr-form-fields-enter > div:nth-child(2) > div:nth-child(3) { animation-delay: 0.71s; }
        .kr-form-fields-enter > div:nth-child(2) > div:nth-child(4) { animation-delay: 0.78s; }
        .kr-form-fields-enter > div:nth-child(2) > div:nth-child(5) { animation-delay: 0.85s; }
        .kr-form-fields-enter > div:nth-child(2) > div:nth-child(6) { animation-delay: 0.9s; }
        .kr-form-fields-enter > button { animation: krHeroFadeUp 0.5s ease-out 0.92s both; }
        .kr-trust-item:nth-child(1) { animation: krHeroFadeUp 0.5s ease-out 0.72s both; }
        .kr-trust-item:nth-child(2) { animation: krHeroFadeUp 0.5s ease-out 0.82s both; }
        .kr-trust-item:nth-child(3) { animation: krHeroFadeUp 0.5s ease-out 0.92s both; }
        @media (prefers-reduced-motion: reduce) {
          .kr-call-glow, .kr-whatsapp-glow, .kr-hero-bg-enter, .kr-hero-left-enter, .kr-hero-badge-enter,
          .kr-hero-title-enter, .kr-hero-copy-enter, .kr-hero-actions-enter, .kr-hero-trust-enter, .kr-hero-form-enter, .kr-form-header-enter,
          .kr-form-fields-enter > div, .kr-form-fields-enter > button, .kr-trust-item { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
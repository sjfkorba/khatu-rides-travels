"use client";

import { useState } from "react";
import Image from "next/image";
import { PHONE, WHATSAPP } from "./data";
import Icon from "./Icons";

export default function CorporateHero({ initialCity = "" }: { initialCity?: string }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [mobile, setMobile] = useState("");
  const [serviceType, setServiceType] = useState("Monthly Car Rental");
  const [note, setNote] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const telUrl = `tel:${PHONE}`;
  const whatsappMessage = `Hello Khatu Rides, I need a corporate transport proposal for ${initialCity}:\n*Company:* ${company}\n*Name:* ${name}\n*Mobile:* ${mobile}\n*Service:* ${serviceType}\n*Details:* ${note || "-"}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !mobile) return;
    setIsSubmitting(true);

    const enquiryData = { type: "Corporate", name, company, mobile, city: initialCity, serviceType, note: note || "-" };

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

  return (
    <section className="relative isolate min-h-[700px] overflow-hidden bg-slate-900 pt-4 pb-12 font-sans lg:py-12">
      <div className="absolute inset-0 -z-20 opacity-40 mix-blend-overlay">
        <Image
          src="/hero/main%20image.png"
          alt="Corporate Taxi Fleet"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center grayscale"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-900/75" />
      <div className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />
      
      <div className="relative mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          
          {/* LEFT COLUMN - EXECUTIVE PITCH */}
          <div className="z-10 space-y-7 lg:col-span-7 lg:pr-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300 backdrop-blur-md">
                💼 B2B Commercial Travel Partner
              </div>
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[60px]">
                Corporate Car Rental in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{initialCity}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-300">
                Streamline your business travel with Khatu Rides. We provide premium fleet solutions, monthly car attachments, and executive transfers with complete <strong className="text-white">GST Billing & Monthly Credit Facilities</strong> for registered companies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a href={telUrl} onClick={handleCall} className="group flex flex-1 items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-4 font-bold text-white hover:bg-slate-700 hover:border-slate-500 transition-all shadow-lg backdrop-blur-md">
                <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
                  <Icon name="phone" size={24} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wider text-slate-400">Speak to B2B Expert</span>
                  <span className="text-lg tracking-wide text-white">CALL NOW</span>
                </div>
              </a>

              <a href={`https://wa.me/${WHATSAPP}?text=Hello B2B Team`} target="_blank" rel="noreferrer" className="group flex flex-1 items-center justify-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-900/40 px-6 py-4 font-bold text-white hover:bg-emerald-800/60 transition-all shadow-lg backdrop-blur-md">
                <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
                  <Icon name="whatsapp" size={24} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wider text-emerald-200">Share Requirements</span>
                  <span className="text-lg tracking-wide text-white">WHATSAPP</span>
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN - B2B LEAD FORM */}
          <div className="lg:col-span-5 z-10 w-full max-w-md mx-auto lg:mx-0 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="overflow-hidden rounded-[24px] border border-slate-700 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
              <div className="bg-slate-800/80 p-5 text-center border-b border-slate-700">
                <h3 className="text-xl font-black text-white">Request a Proposal</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Get customized B2B rates in 30 minutes</p>
              </div>
              
              {isSubmitted ? (
                <div className="p-8 text-center space-y-5">
                  <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-2xl font-black text-white">Proposal Request Sent!</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Thank you, <strong className="text-white">{name}</strong>. Our B2B account manager will contact you shortly with a customized quote for <strong className="text-white">{company}</strong>.
                  </p>
                  <button onClick={() => setIsSubmitted(false)} className="text-blue-400 hover:text-blue-300 text-sm font-semibold mt-4">
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickBook} className="space-y-4 p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Company Name</label>
                      <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 font-semibold text-white focus:border-amber-400 focus:outline-none" placeholder="e.g. Reliance Ind." />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Your Name</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 font-semibold text-white focus:border-amber-400 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mobile</label>
                        <input type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 font-semibold text-white focus:border-amber-400 focus:outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Service Required</label>
                      <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 font-semibold text-white focus:border-amber-400 focus:outline-none">
                        <option>Monthly Car Rental</option>
                        <option>Executive Airport Transfer</option>
                        <option>Employee Pickup/Drop</option>
                        <option>Ad-hoc Commercial Booking</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Additional Details (Optional)</label>
                      <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Need 2 Innovas for 15 days" className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 font-semibold text-white focus:border-amber-400 focus:outline-none" />
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 font-black text-lg py-4 rounded-xl shadow-lg transition-all disabled:opacity-70">
                    {isSubmitting ? "Sending..." : "Request Proposal"}
                  </button>
                  <p className="text-center text-[10px] text-slate-500 mt-2 flex items-center justify-center gap-1">
                    <Icon name="phone" size={10} /> Fast Response Guaranteed
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
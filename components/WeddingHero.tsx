"use client";

import { useState } from "react";
import Image from "next/image";
import { PHONE, WHATSAPP } from "./data";
import Icon from "./Icons";

export default function WeddingHero({ initialCity = "" }: { initialCity?: string }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState(initialCity);
  const [requirement, setRequirement] = useState("Bridal / Groom Car (Decorated)");
  const [travelDate, setTravelDate] = useState("");
  const [car, setCar] = useState("Premium SUV (Innova Crysta)");
  const [note, setNote] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const telUrl = `tel:${PHONE}`;
  const whatsappMessage = `Hello Khatu Rides, I need Wedding Car Rental in ${city}:\n*Requirement:* ${requirement}\n*Name:* ${name}\n*Mobile:* ${mobile}\n*Date:* ${travelDate}\n*Car:* ${car}\n*Note:* ${note || "-"}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !city) return;
    setIsSubmitting(true);

    const enquiryData = { 
      tripType: "Wedding Rental", 
      name, 
      mobile, 
      pickup: city, 
      drop: requirement, // Using drop field for requirement type
      travelDate: travelDate || "Not Decided", 
      car, 
      note: note || "-" 
    };

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
    <section className="relative isolate min-h-[720px] overflow-hidden bg-slate-900 pt-4 pb-12 font-sans lg:py-12">
      <div className="absolute inset-0 -z-20 opacity-50 sepia-[0.3]">
        <Image
          src="/hero/main%20image.png"
          alt="Luxury Wedding Cars"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-950/95 via-purple-900/80 to-slate-900/70" />
      
      <div className="relative mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8 lg:mt-16">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          
          <div className="z-10 space-y-7 lg:col-span-7 lg:pr-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/20 px-4 py-2 text-sm font-bold text-amber-200 backdrop-blur-md">
                👑 Premium Wedding Transport
              </div>
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[60px]">
                Luxury Wedding Cars in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{initialCity}</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-purple-100">
                Make your special day truly royal! We provide beautifully decorated bridal cars, luxury fleets for groom entries, and bulk transport solutions for your Baarat and wedding guests in {initialCity}.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a href={telUrl} onClick={handleCall} className="group flex flex-1 items-center justify-center gap-3 rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-500 to-amber-600 px-6 py-4 font-bold text-slate-900 shadow-lg hover:-translate-y-1 transition-all">
                <div className="rounded-xl bg-white/30 p-2 text-slate-900">
                  <Icon name="phone" size={24} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wider text-slate-800">Discuss Packages</span>
                  <span className="text-xl tracking-wide text-slate-900">CALL NOW</span>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 z-10 w-full max-w-md mx-auto lg:mx-0 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="overflow-hidden rounded-[28px] border border-amber-500/30 bg-white/10 shadow-2xl backdrop-blur-xl ring-1 ring-white/20">
              <div className="bg-gradient-to-r from-amber-600 to-yellow-500 p-5 text-center">
                <h3 className="text-xl font-extrabold text-slate-900">Book Wedding Fleet</h3>
                <p className="text-amber-900 text-sm font-bold mt-1">Get customized quotes for {initialCity}</p>
              </div>
              
              {isSubmitted ? (
                <div className="p-8 text-center space-y-5 bg-slate-900/70">
                  <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-2xl font-black text-white">Congratulations!</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Thank you {name}, we have received your wedding transport request for {city}. Our event manager will contact you soon with the best fleet options!
                  </p>
                  <button onClick={() => setIsSubmitted(false)} className="text-amber-400 hover:text-amber-300 text-sm font-semibold mt-4">
                    Send another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickBook} className="space-y-4 p-5 sm:p-6 bg-slate-900/70">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-amber-200 uppercase mb-1">Your Name</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:border-amber-400 focus:outline-none" />
                    </div>
                    
                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-amber-200 uppercase mb-1">Mobile</label>
                      <input type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:border-amber-400 focus:outline-none" />
                    </div>

                    <div className="relative col-span-2">
                      <label className="block text-xs font-bold text-amber-200 uppercase mb-1">Requirement</label>
                      <select value={requirement} onChange={(e) => setRequirement(e.target.value)} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:border-amber-400 focus:outline-none">
                        <option>Bridal / Groom Car (Decorated)</option>
                        <option>Baarat / Guest Transport (Bulk)</option>
                        <option>Pre-Wedding Shoot Transport</option>
                        <option>Complete Wedding Package</option>
                      </select>
                    </div>

                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-amber-200 uppercase mb-1">Event Date</label>
                      <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:border-amber-400 focus:outline-none" />
                    </div>

                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-amber-200 uppercase mb-1">Car Preference</label>
                      <select value={car} onChange={(e) => setCar(e.target.value)} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:border-amber-400 focus:outline-none">
                        <option>Premium SUV (Innova)</option>
                        <option>Luxury Sedan (Honda City/Ciaz)</option>
                        <option>Standard SUV (Ertiga)</option>
                        <option>Multiple Cars</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full mt-2 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-900 font-black text-lg py-4 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
                    {isSubmitting ? "Processing..." : "Get Free Quote"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
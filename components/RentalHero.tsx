"use client";

import { useState } from "react";
import Image from "next/image";
import { PHONE, WHATSAPP } from "./data";
import Icon from "./Icons";

export default function RentalHero({ initialCity = "" }: { initialCity?: string }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState(initialCity);
  const [packageType, setPackageType] = useState("8 Hours / 80 Kms");
  const [travelDate, setTravelDate] = useState("");
  const [car, setCar] = useState("Sedan (4-seater)");
  const [note, setNote] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const telUrl = `tel:${PHONE}`;
  const whatsappMessage = `Hello Khatu Rides, I need a local car rental in ${city}:\n*Package:* ${packageType}\n*Name:* ${name}\n*Mobile:* ${mobile}\n*Date:* ${travelDate || "Flexible"}\n*Car:* ${car}\n*Note:* ${note || "-"}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !city) return;
    setIsSubmitting(true);

    // Hum drop location ki jagah package type pass kar rahe hain API ko
    const enquiryData = { 
      tripType: "Local Hourly Rental", 
      name, 
      mobile, 
      pickup: city, 
      drop: packageType, 
      travelDate: travelDate || "Flexible", 
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
      <div className="absolute inset-0 -z-20 opacity-60">
        <Image
          src="/hero/main%20image.png"
          alt="Local Car Rental Services"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/60" />
      
      <div className="relative mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8 lg:mt-16">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          
          <div className="z-10 space-y-7 lg:col-span-7 lg:pr-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-2 text-sm font-bold text-pink-300 backdrop-blur-md">
                ⏱️ Book by the Hour, Travel Anywhere
              </div>
              <h1 className="text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[64px]">
                Local Car Rental in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">{initialCity}</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-slate-300">
                Need a car for the whole day? Book our premium local hourly cabs in {initialCity} for business meetings, shopping, city tours, or hospital visits. <strong className="text-white">Keep the car with you for 4, 8 or 12 hours.</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a href={telUrl} onClick={handleCall} className="group flex flex-1 items-center justify-center gap-3 rounded-2xl border border-rose-500/50 bg-gradient-to-br from-rose-500 to-pink-600 px-6 py-4 font-bold text-white shadow-lg hover:-translate-y-1 transition-all">
                <div className="rounded-xl bg-white/20 p-2 text-white">
                  <Icon name="phone" size={24} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wider text-rose-200">Talk To Us</span>
                  <span className="text-xl tracking-wide text-white">CALL NOW</span>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 z-10 w-full max-w-md mx-auto lg:mx-0 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl ring-1 ring-white/20">
              <div className="bg-gradient-to-r from-rose-900/80 to-pink-900/80 p-5 text-center">
                <h3 className="text-xl font-extrabold text-white">Book Your Hourly Cab</h3>
                <p className="text-pink-200 text-sm font-semibold mt-1">Instant confirmation in {initialCity}</p>
              </div>
              
              {isSubmitted ? (
                <div className="p-8 text-center space-y-5 bg-slate-900/60">
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-2xl font-black text-white">Booking Received!</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Thanks {name}, your local rental request for {packageType} in {city} is confirmed. Our team will contact you.
                  </p>
                  <button onClick={() => setIsSubmitted(false)} className="text-pink-400 hover:text-pink-300 text-sm font-semibold mt-4">
                    Book another car
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickBook} className="space-y-4 p-5 sm:p-6 bg-slate-900/60">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Your Name</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:border-pink-500 focus:outline-none" />
                    </div>
                    
                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mobile</label>
                      <input type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:border-pink-500 focus:outline-none" />
                    </div>

                    <div className="relative col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">City Location</label>
                      <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:border-pink-500 focus:outline-none" />
                    </div>

                    <div className="relative col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Hourly Package</label>
                      <select value={packageType} onChange={(e) => setPackageType(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:border-pink-500 focus:outline-none">
                        <option>4 Hours / 40 Kms (Half Day)</option>
                        <option>8 Hours / 80 Kms (Full Day)</option>
                        <option>12 Hours / 120 Kms (Extended Day)</option>
                      </select>
                    </div>

                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Travel Date</label>
                      <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:border-pink-500 focus:outline-none" />
                    </div>

                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Car Type</label>
                      <select value={car} onChange={(e) => setCar(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:border-pink-500 focus:outline-none">
                        <option>Sedan (Dzire)</option>
                        <option>SUV (Ertiga)</option>
                        <option>Premium SUV (Innova)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full mt-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-lg py-4 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
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
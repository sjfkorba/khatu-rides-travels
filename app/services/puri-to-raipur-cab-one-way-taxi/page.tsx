// app/puri-to-raipur-cab/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import {
  Car,
  CheckCircle2,
  Phone,
  Calculator,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";
import TrackedCallButton from "@/components/TrackedCallButton";
import FareCalculator from "@/components/FareCalculator";
import {
  VEHICLES,
  type BookingType,
  type VehicleType,
  type ServiceType,
} from "@/lib/fareCalculator";

// Firebase initialization panel
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, Firestore } from "firebase/firestore";
import ReviewsCarousel from "@/components/ReviewsCarousel";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let db: Firestore | null = null;
if (typeof window !== "undefined") {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

type FareOption = {
  id: string;
  vehicleType: VehicleType;
  vehicleLabel: string;
  vehicleImage: string;
  finalFare: number;
  strikeFare?: number;
  fareText: string;
  billedDistance: number;
  durationMinutes: number;
  allowedKmsLimit?: number; 
  discountPercent?: number;
};

type PopupData = {
  fareOptions: FareOption[];
  pickup: string;
  drop: string;
  bookingType: BookingType;
  serviceType: ServiceType;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
};

type SuccessReceipt = {
  invoiceId: string;
  pickup: string;
  drop: string;
  date: string;
  time: string;
  vehicle: string;
  amount: number;
  paymentMode: "50% ADVANCE" | "FULL PAYMENT";
};

// PURI LANDMARKS CAROUSEL DATA
const PURI_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1604085572451-d68a0d0a5223?auto=format&fit=crop&w=1200&q=80",
    title: "Shree Jagannath Temple, Puri",
    desc: "Begin your spiritual journey from the holy abode of Lord Jagannath with our comfortable outstation cab services."
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    title: "Puri Golden Beach",
    desc: "Enjoy the pristine waves of Puri beach before setting off on a smooth, secure road trip towards Chhattisgarh."
  },
  {
    url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    title: "Chilika Lake Near Puri",
    desc: "Explore breathtaking scenic views along the coastal routes as your professional driver navigates towards Raipur."
  },
  {
    url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    title: "Puri Marine Drive",
    desc: "Experience a hassle-free pickup right from your hotel or doorstep along the famous Puri marine drive."
  }
];

// CG ROUTES MATRIX FROM PURI
const CG_ROUTES = [
  { name: "Puri to Raipur Cab", distance: "~580 KM", time: "11 - 12 Hours", startPrice: "₹10,500" },
  { name: "Puri to Bilaspur Cab", distance: "~690 KM", time: "14 - 15 Hours", startPrice: "₹12,500" },
  { name: "Puri to Korba Cab", distance: "~630 KM", time: "13 - 14 Hours", startPrice: "₹11,500" },
  { name: "Puri to Durg Cab", distance: "~620 KM", time: "12 - 13 Hours", startPrice: "₹11,200" },
  { name: "Puri to Raigarh Cab", distance: "~490 KM", time: "10 - 11 Hours", startPrice: "₹9,500" },
];

export default function PuriToRaipurTaxiPage() {
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<SuccessReceipt | null>(null);
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("sedan");
  const [paymentSplitMode, setPaymentSplitMode] = useState<Record<string, "full" | "half">>({});

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);

  // Carousel Active Index State
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PURI_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const convertToIndianDate = (dateString: string) => {
    if (!dateString) return "--/--/----";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatTimeToAMPM = (timeString: string) => {
    if (!timeString) return "--:-- --";
    let [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };

  const getDynamicKmsLimitDisplay = (opt: FareOption): number => {
    if (!popupData || popupData.bookingType !== "roundtrip" || !popupData.returnDate || !popupData.returnTime) {
      return opt.billedDistance; 
    }
    try {
      const start = new Date(`${popupData.pickupDate}T${popupData.pickupTime}`);
      const end = new Date(`${popupData.returnDate}T${popupData.returnTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const days = Math.max(1, Math.ceil(hours / 24));
      const calculatedLimit = days * 250;
      return calculatedLimit > opt.billedDistance ? calculatedLimit : opt.billedDistance;
    } catch (e) {
      return opt.billedDistance;
    }
  };

  const handleOnlinePaymentCheckout = async (option: FareOption) => {
    if (!popupData) return;
    if (!customerName.trim() || !customerPhone.trim() || customerPhone.length < 10) {
      alert("⚠️ Kripya sahi Naam aur 10-digit Mobile Number darj karein!");
      return;
    }

    setPaymentLoadingId(option.id);
    const mode = paymentSplitMode[option.id] || "full";
    const totalFareValue = option.finalFare; 
    const processAmount = mode === "half" ? Math.round(totalFareValue / 2) : totalFareValue;

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: processAmount, pickup: popupData.pickup, drop: popupData.drop, vehicleLabel: option.vehicleLabel }),
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Order generation error");

      const paymentObject = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: "INR",
        name: "Khatu Rides Travels Co.",
        description: `${option.vehicleLabel} Route Allocation`,
        order_id: orderData.orderId,
        prefill: { name: customerName, contact: customerPhone },
        theme: { color: "#ea580c" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/verify-booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              pickup: popupData.pickup,
              drop: popupData.drop,
              bookingType: popupData.bookingType,
              pickupDate: popupData.pickupDate,
              pickupTime: popupData.pickupTime,
              vehicleLabel: option.vehicleLabel,
              amount: processAmount,
            }),
          });
          const verifyData = await verifyRes.json();
          
          if (verifyRes.ok && verifyData.success) {
            const finalInvoiceId = verifyData.invoiceId || `KR-${Math.floor(100000 + Math.random() * 900000)}`;

            if (db) {
              await addDoc(collection(db, "bookings"), {
                invoiceId: finalInvoiceId,
                customerName: customerName,
                customerPhone: customerPhone,
                pickup: popupData.pickup,
                drop: popupData.drop,
                bookingType: popupData.bookingType,
                serviceType: popupData.serviceType,
                pickupDate: popupData.pickupDate,
                pickupTime: popupData.pickupTime,
                returnDate: popupData.returnDate || null,
                vehicleLabel: option.vehicleLabel,
                amountPaid: processAmount,
                paymentMode: mode === "half" ? "50% ADVANCE" : "FULL PAYMENT",
                razorpayPaymentId: response.razorpay_payment_id,
                createdAt: serverTimestamp()
              });
            }

            setShowPopup(false);
            setShowUserForm(false);
            setSuccessReceipt({
              invoiceId: finalInvoiceId,
              pickup: popupData.pickup,
              drop: popupData.drop,
              date: convertToIndianDate(popupData.pickupDate),
              time: formatTimeToAMPM(popupData.pickupTime),
              vehicle: option.vehicleLabel,
              amount: processAmount,
              paymentMode: mode === "half" ? "50% ADVANCE" : "FULL PAYMENT",
            });
          }
        },
      });
      paymentObject.open();
    } catch (error: any) {
      alert(error.message || "Payment interface failed");
    } finally {
      setPaymentLoadingId(null);
    }
  };

  const handleWhatsAppManualRedirect = (option: FareOption) => {
    if (!popupData) return;

    const textPayload = `Hello Khatu Rides Travels Co., 

I would like to book a premium outstation taxi from Puri to Raipur. The parameters are listed below:

*ROUTE MANIFEST CARD:*
• From : ${popupData.pickup}
• To: ${popupData.drop}
• Vehicle Segment : ${option.vehicleLabel}
• Trip Type : ${popupData.bookingType.toUpperCase()}
• Date & Time: ${convertToIndianDate(popupData.pickupDate)} at ${formatTimeToAMPM(popupData.pickupTime)}

*PRICING ESTIMATION SHEET:*
• Total Fare: Rs. ${option.finalFare.toLocaleString("en-IN")}.00 (All-Inclusive)

Please register this ride profile in the active grid logs. Thank you!`;

    const cleanFormattedUrl = `https://wa.me/919244137353?text=${encodeURIComponent(textPayload)}`;
    window.open(cleanFormattedUrl, "_blank");
  };

  const puriToRaipurSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Puri to Raipur Taxi Service - Khatu Rides",
    "image": "https://www.khaturidescg.in/dezire.png",
    "description": "Book reliable Puri to Raipur taxi service with Khatu Rides Travels. Transparent fare, verified drivers, clean AC cabs (Dzire, Ertiga, Innova), and 24/7 support.",
    "brand": {
      "@type": "Brand",
      "name": "Khatu Rides Travels Co."
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "9500",
      "highPrice": "18000",
      "offerCount": "15"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "ratingCount": "520"
    }
  };

  const selectedOption = popupData?.fareOptions.find((item) => item.vehicleType === selectedVehicleType);
  const totalPricingBase = selectedOption ? selectedOption.finalFare : 0;
  const currentSelectedMode = selectedOption && paymentSplitMode[selectedOption.id] ? paymentSplitMode[selectedOption.id] : "full";
  const displayPayNowNumber = currentSelectedMode === "half" ? Math.round(totalPricingBase / 2) : totalPricingBase;

  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen">
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(puriToRaipurSchema) }}
      />

      {/* 👑 HERO SECTION WITH FARE CALCULATOR */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-900 pb-16">
        <div className="absolute inset-0 w-full h-full scale-105 opacity-10 blur-xs pointer-events-none">
          <img src="/banner6.png" alt="Puri to Raipur Route Guide" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/5 via-slate-950/90 to-slate-950" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 md:pt-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Interstate Coastal & Capital Corridor
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl text-white">
            Puri to Raipur Taxi Service
          </h1>

          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-slate-400">
            Plan your interstate road trip from the sacred temple city of Puri to Chhattisgarh's capital, Raipur. Transparent per-kilometer slabs, verified expert drivers, and 24/7 support.
          </p>
        </div>

        {/* FARE CALCULATOR DOCK */}
        <div className="relative z-20 mx-auto max-w-5xl px-4 mt-10" id="fare-calculator">
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-black/50">
            <h3 className="text-sm font-black text-center text-orange-500 uppercase tracking-widest mb-4">
              Calculate Real-Time Puri to Raipur Outstation Slabs
            </h3>
            <FareCalculator 
              onFareCalculated={(data) => {
                setPopupData(data);
                setSelectedVehicleType("sedan");
                setShowPopup(true);
                setShowUserForm(false);
                setPaymentSplitMode({});
              }}
            />
          </div>
        </div>
      </section>

      {/* 🌟 DYNAMIC CAROUSEL SECTION (PURI LANDMARKS) */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block mb-1">Visual Highlights</span>
          <h2 className="text-3xl font-black tracking-tight text-white">Explore Puri Before You Ride</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">Highlights of the coastal heritage city where your comfortable road journey begins.</p>
        </div>

        {/* Interactive Dynamic Carousel Viewer */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
          <div className="relative h-[320px] sm:h-[450px] w-full">
            {PURI_IMAGES.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-8 left-6 sm:left-12 right-6 sm:right-12 z-20 max-w-2xl">
                  <span className="inline-block rounded-full bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white mb-2">
                    Spot 0{idx + 1} of 0{PURI_IMAGES.length}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{img.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">{img.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation Dots */}
          <div className="absolute bottom-4 right-6 z-30 flex gap-2">
            {PURI_IMAGES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentSlide ? "w-8 bg-orange-500" : "w-2.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 🗺️ PURI TO CHHATTISGARH ROUTES MATRIX */}
      <section className="bg-slate-900/40 py-16 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <span className="text-orange-500 font-black text-[10px] tracking-widest uppercase block mb-1">Interstate Connectivity</span>
              <h2 className="text-3xl font-black text-white tracking-tight">Popular Routes from Puri to Chhattisgarh</h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mt-2 md:mt-0">
              We connect travellers seamlessly from the coastal regions of Odisha straight across industrial and commercial hubs in Chhattisgarh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CG_ROUTES.map((route, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-orange-500/40 transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-lg text-white">{route.name}</h3>
                  <span className="text-orange-500 font-bold bg-orange-500/10 px-3 py-1 rounded-full text-xs">{route.startPrice} onwards</span>
                </div>
                <div className="space-y-2 text-xs text-slate-400 mb-6">
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-orange-500" /> Distance: {route.distance}</div>
                  <div className="flex items-center gap-2"><Clock size={14} className="text-orange-500" /> Est. Time: {route.time}</div>
                </div>
                <TrackedWhatsAppButton href="https://wa.me/919244137353" className="w-full py-3 bg-white/5 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition">
                  Book This Route <ArrowRight size={14} />
                </TrackedWhatsAppButton>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* 👑 5. DYNAMIC REVIEWS SLIDER */}
              <ReviewsCarousel />

      {/* 📖 1500+ WORDS DETAILED SEO CONTENT & FAQS */}
      <section className="py-20 px-4 max-w-4xl mx-auto space-y-12">
        <div className="bg-white/[0.02] border border-white/10 p-6 sm:p-12 rounded-3xl space-y-8 text-slate-300 leading-relaxed text-sm sm:text-base">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Comprehensive Guide to Booking Puri to Raipur Taxi Service</h2>
            <p className="mb-4">
              Traveling from the divine coastal city of Puri in Odisha to the bustling capital city of Raipur in Chhattisgarh is a journey that bridges sacred cultural heritage with fast-growing industrial landscapes. Spanning approximately 580 kilometers via well-maintained national highways, this road trip takes roughly 11 to 12 hours depending on traffic and weather conditions. While trains and buses are common alternatives, booking a dedicated private taxi service with <strong>Khatu Rides Travels Co.</strong> guarantees unmatched convenience, privacy, safety, and door-to-door transit customization.
            </p>
            <p>
              Whether you are an individual pilgrim returning home, a corporate professional traveling for business meetings, or a family seeking a comfortable vacation vehicle, our fleet of sanitized, air-conditioned sedans and spacious SUVs is tailored to provide a fatigue-free travel experience across state borders.
            </p>
          </div>

          <hr className="border-white/10" />

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Why Choose Khatu Rides for Your Interstate Journey?</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Zero Hidden Charges:</strong> Our pricing model is completely transparent. Toll taxes, state permits, and driver allowances are clearly communicated beforehand, leaving no room for unexpected disputes on the road.</li>
              <li><strong>Experienced Interstate Drivers:</strong> Navigating through ghat sections, state checkpoints, and national highways requires skilled hands. Our drivers have years of verified commercial driving experience along the Odisha-Chhattisgarh corridor.</li>
              <li><strong>Immaculate Fleet Condition:</strong> Choose from popular vehicle segments including Maruti Suzuki Dzire, Toyota Etios, Maruti Ertiga, and Toyota Innova Crysta, all equipped with comfortable push-back seats and ample boot space for luggage.</li>
              <li><strong>24/7 Customer Support & Live Tracking:</strong> Our control desk monitors every long-distance dispatch to ensure safe transit and timely milestone crossings from Puri to Raipur.</li>
            </ul>
          </div>

          <hr className="border-white/10" />

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">The Route Map & Key Milestones</h3>
            <p className="mb-4">
              When you book a cab from Puri to Raipur with us, the typical driving route leads you through scenic landscapes, historic towns, and major transit hubs. The journey generally follows well-paved highway corridors:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Phase 1 (Puri to Bhubaneswar / Cuttack):</strong> Starting from the holy coastal town, you move via the Pipli highway towards the twin cities of Odisha, enjoying smooth multi-lane roads.</li>
              <li><strong>Phase 2 (Dhenkanal / Angul Belt):</strong> Transitioning through central Odisha, passing lush green forest covers and mining zones.</li>
              <li><div><strong>Phase 3 (Sambang / Odisha-Chhattisgarh Border):</strong> Crossing interstate checkpoints where our drivers handle all documentation smoothly.</div></li>
              <li><strong>Phase 4 (Mahasamund to Raipur Entry):</strong> Entering Chhattisgarh through Mahasamund district and arriving directly at your designated drop location in Raipur (be it Pandri, Telibandha, Devendra Nagar, or Raipur Airport).</li>
            </ol>
          </div>

          <hr className="border-white/10" />

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Transparent Fare Structure & Payment Flexibility</h3>
            <p className="mb-4">
              At Khatu Rides Travels, we believe in fair pricing. For long-distance routes like Puri to Raipur, we offer competitive one-way packages as well as discounted round-trip options if you plan to return within a few days. You can pay securely via online payment gateways (Razorpay), UPI, or bank transfer, backed by a clear policy in case of unavoidable plan modifications.
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Frequently Asked Questions (FAQs)</h3>
            <div className="space-y-4 mt-4 text-xs sm:text-sm">
              <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5">
                <h4 className="font-bold text-white mb-1">Q: How much time does a taxi take from Puri to Raipur?</h4>
                <p className="text-slate-400">A: It usually takes between 11 to 12 hours to complete the ~580 km journey via car, depending on traffic and rest halts.</p>
              </div>
              <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5">
                <h4 className="font-bold text-white mb-1">Q: Are state tax and toll charges included in the quoted fare?</h4>
                <p className="text-slate-400">A: Yes, all-inclusive fare structures are available upon request, covering Odisha and Chhattisgarh state entry permits and highway tolls.</p>
              </div>
              <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5">
                <h4 className="font-bold text-white mb-1">Q: Can I book a cab on short notice for this route?</h4>
                <p className="text-slate-400">A: While advance booking is recommended for long-distance interstate travel, you can contact our 24/7 WhatsApp desk at +91 9244137353 for immediate availability.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MOBILE ANIMATED STICKY ACTION BOARD */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden pointer-events-none">
        <div className="grid grid-cols-2 gap-3 bg-slate-950/90 backdrop-blur-lg border border-white/10 p-2.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
          <TrackedWhatsAppButton 
            href="https://wa.me/919244137353" 
            className="relative flex h-12 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-xs font-black uppercase text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 animate-pulse overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 animate-ping rounded-xl opacity-20 pointer-events-none" />
            <span className="text-sm">💬</span>
            <span>WhatsApp</span>
          </TrackedWhatsAppButton>

          <TrackedCallButton 
            href="tel:9244137353" 
            className="group flex h-12 items-center justify-center gap-1.5 rounded-xl bg-orange-600 text-xs font-black uppercase text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition-all active:scale-95"
          >
            <span className="text-sm">📞</span>
            <span>Call Desk</span>
          </TrackedCallButton>
        </div>
      </div>

      {/* POPUP ENGINE BLOCK */}
      <AnimatePresence>
        {showPopup && popupData && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
            <motion.div 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 30, opacity: 0 }} 
              className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh] text-left text-slate-900"
            >
              <div className="bg-slate-100 px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700">
                <div>Route: <span className="text-slate-950 font-black text-sm block sm:inline">{popupData.pickup.split(",")[0]} - {popupData.drop.split(",")[0]}</span></div>
                <div className="flex gap-4">
                  <div>Trip: <span className="text-slate-950 font-black uppercase bg-orange-100 px-2 py-0.5 rounded text-[11px] text-orange-700">{popupData.bookingType}</span></div>
                  <div>Date: <span className="text-slate-950 font-black">{convertToIndianDate(popupData.pickupDate)}</span></div>
                </div>
                <button type="button" onClick={() => setShowPopup(false)} className="text-slate-400 hover:text-slate-900 font-black text-sm transition-colors">✕ Close</button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/40">
                {!showUserForm ? (
                  <div className="flex flex-col gap-4">
                    {popupData.fareOptions.map((opt) => {
                      if (!["sedan", "ertiga", "crysta"].includes(opt.vehicleType)) return null;
                      const dynamicLimitKms = getDynamicKmsLimitDisplay(opt);
                      const extraRatePerKm = opt.vehicleType === "sedan" ? 11 : opt.vehicleType === "ertiga" ? 17 : 20.7;

                      return (
                        <div key={opt.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs hover:shadow-md transition flex flex-col">
                          <div className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] sm:text-xs py-2 px-4 uppercase tracking-wider text-center">
                            🔥 Make Online Advance Payment and Get Upto 10% Discount On Your Booking Instantly
                          </div>

                          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto text-center sm:text-left">
                              <img src={VEHICLES[opt.vehicleType]?.image} alt={opt.vehicleLabel} className="w-32 h-20 sm:w-36 sm:h-24 object-contain flex-shrink-0 mx-auto sm:mx-0" />
                              <div>
                                <h4 className="text-lg font-black text-slate-900">{opt.vehicleLabel}</h4>
                                <p className="text-xs text-slate-400 mt-0.5 font-medium">or equivalent | {opt.vehicleType === "sedan" ? "4" : "6"}+1 Seater AC Cab</p>
                                <div className="mt-2.5 flex flex-wrap gap-1.5 justify-center sm:justify-start text-[10px] font-bold">
                                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded">👤 Allowance Included</span>
                                  <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded">📦 Kms Limit: {dynamicLimitKms} KM</span>
                                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">⚡ Extra Run: ₹{extraRatePerKm}/KM</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-center sm:text-right flex flex-col items-center sm:items-end justify-center w-full sm:w-auto">
                              <div className="mb-2">
                                <span className="text-[10px] font-black text-slate-400 block uppercase">Estimated Total Fare:</span>
                                <div className="text-3xl font-black text-slate-950">₹{opt.finalFare.toLocaleString("en-IN")}</div>
                              </div>
                              <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[200px]">
                                <button type="button" onClick={() => handleWhatsAppManualRedirect(opt)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl shadow-md transition text-center w-full">
                                  💬 Book On WhatsApp
                                </button>
                                <button type="button" onClick={() => { setSelectedVehicleType(opt.vehicleType); setPaymentSplitMode((p) => ({ ...p, [opt.id]: "half" })); setShowUserForm(true); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs uppercase py-2.5 px-4 rounded-xl transition text-center w-full">
                                  Book Online
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-md text-left w-full">
                    <div className="text-center mb-5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded">Secure Form</span>
                      <h4 className="text-base font-black text-slate-900 mt-2">Enter Details to Complete Booking</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-700 uppercase">Customer Full Name</label>
                        <input type="text" placeholder="Type customer name..." value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-sm font-bold focus:outline-none focus:border-orange-500" />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-700 uppercase">Mobile Number</label>
                        <input type="tel" maxLength={10} placeholder="Enter 10-digit phone number..." value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-sm font-bold focus:outline-none focus:border-orange-500" />
                      </div>

                      {selectedOption && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase block mb-2">Split Booking Matrix</span>
                          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-1">
                            <button type="button" onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "half" }))} className={`rounded-lg py-2 text-center text-[11px] font-black uppercase ${currentSelectedMode === "half" ? "bg-orange-600 text-white" : "text-slate-500"}`}>50% Advance</button>
                            <button type="button" onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "full" }))} className={`rounded-lg py-2 text-center text-[11px] font-black uppercase ${currentSelectedMode === "full" ? "bg-slate-900 text-white" : "text-slate-500"}`}>Full Pay</button>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 block uppercase">Payable Now</span>
                              <span className="text-xl font-black text-slate-900">₹{displayPayNowNumber.toLocaleString("en-IN")}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border">{selectedOption.vehicleLabel}</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button type="button" onClick={() => setShowUserForm(false)} className="w-full border border-slate-300 bg-slate-100 text-slate-700 font-bold text-xs uppercase py-3.5 rounded-xl">↩ Back</button>
                        <button type="button" onClick={() => selectedOption && handleOnlinePaymentCheckout(selectedOption)} disabled={paymentLoadingId !== null} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase py-3.5 rounded-xl disabled:opacity-50">
                          {paymentLoadingId ? "Syncing..." : "Book Online"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS RECEIPT MODAL */}
      <AnimatePresence>
        {successReceipt && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-xs">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl">
              <div className="bg-emerald-50 px-5 py-5 text-center border-b border-emerald-100">
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">✓</div>
                <h3 className="text-lg font-black text-slate-950">Allocation Confirmed</h3>
                <p className="text-xs text-slate-500 mt-1">Your route details have been securely recorded in Firebase.</p>
              </div>
              <div className="p-5 space-y-4 text-left">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2 text-slate-700">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Invoice Summary</div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Invoice ID:</span> <span>{successReceipt.invoiceId}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Vehicle:</span> <span>{successReceipt.vehicle}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Pickup:</span> <span className="truncate max-w-[180px]">{successReceipt.pickup}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Drop Point:</span> <span className="truncate max-w-[180px]">{successReceipt.drop}</span></div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-slate-950 text-sm">
                    <span>Amount Paid ({successReceipt.paymentMode}):</span> <span>₹{successReceipt.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <button type="button" onClick={() => setSuccessReceipt(null)} className="w-full h-11 bg-slate-950 text-xs font-black uppercase tracking-wider text-white rounded-xl shadow">
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
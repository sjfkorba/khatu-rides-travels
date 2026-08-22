// app/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import FareCalculator from "@/components/FareCalculator";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import SeoTextBlock from "@/components/SeoTextBlock";
import SlidingTicker from "@/components/SlidingTicker";
import {
  calculateFare,
  VEHICLES,
  type BookingType,
  type VehicleType,
  type ServiceType,
} from "@/lib/fareCalculator";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Firestore, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, User, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import PremiumSplashScreen from "@/components/PremiumSplashScreen";
import CarCursor from "@/components/CarCursor";

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
  isOneWayAvailable?: boolean;
  baseDistance?: number;
};

type TollData = {
  totalTolls: number;
  totalAmount: number;
  plazas: { name: string; amount: number }[];
  encodedPolyline?: string;
};

type SpecialOffer = {
  id: string;
  fromCity: string;
  toCity: string;
  vehicleType: string;
  tripType: string;
  strikeFare: number;
  offerFare: number;
  offerAvailable: boolean;
};

const ROUTES = [
  { from: "Raipur, Chhattisgarh", to: "Korba, Chhattisgarh", price: "₹3299", time: "~4h 30m", km: "250 KM", image: "/banner6.png" },
  { from: "Korba, Chhattisgarh", to: "Bilaspur, Chhattisgarh", price: "₹1899", time: "~2h 30m", km: "130 KM", image: "/banner6.png" },
  { from: "Bilaspur, Chhattisgarh", to: "Raipur, Chhattisgarh", price: "₹3299", time: "~4h 30m", km: "250 KM", image: "/banner6.png" },
  { from: "Raipur, Chhattisgarh", to: "Bhopal, Madhya Pradesh", price: "₹3499", time: "~7h 00m", km: "450 KM", image: "/banner6.png" },
];

const CORPORATE_CLIENTS = [
  { name: "BALCO", logo: "/images/clients/BALCO.jpg", subtitle: "Bharat Aluminium Co." },
  { name: "SECL", logo: "/images/clients/SECL.webp", subtitle: "South Eastern Coalfields" },
  { name: "ADANI Raipur", logo: "/images/clients/ADANI.webp", subtitle: "Adani Power & Infra" },
  { name: "SSPARK", logo: "/images/clients/SSPARK.webp", subtitle: "SSPARK Sport Services" },
  { name: "Prem Travels", logo: "/images/clients/PREMTRAVELS.png", subtitle: "Partner Fleet Network", link: "https://www.premtravelsonline.com/" },
];

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  
  const [loginLoading, setLoginLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [needsPhoneModal, setNeedsPhoneModal] = useState(false);

  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("sedan");
  const [paymentSplitMode, setPaymentSplitMode] = useState<Record<string, "full" | "half">>({});

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [expandedInclusionsId, setExpandedInclusionsId] = useState<string | null>(null);

  const [tollData, setTollData] = useState<TollData | null>(null);
  const [showTollModal, setShowTollModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [tollLoading, setTollLoading] = useState(false);

  const [activeOffers, setActiveOffers] = useState<SpecialOffer[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [showAllOffersModal, setShowAllOffersModal] = useState(false);

  const calculatorSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecking(false);
    });

    let unsubscribeOffers: (() => void) | undefined;
        if (db) {
      const q = query(collection(db, "special_offers"), orderBy("createdAt", "desc"));
      unsubscribeOffers = onSnapshot(q, (snapshot) => {
        const fetched: SpecialOffer[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.offerAvailable) {
            fetched.push({ id: doc.id, ...data } as SpecialOffer);
          }
        });
        setActiveOffers(fetched);
      });
    }

    return () => {
      unsubscribeAuth();
      if (unsubscribeOffers) unsubscribeOffers();
    };
  }, []);

  useEffect(() => {
    if (activeOffers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % activeOffers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeOffers.length]);

  const handleGoogleLoginInline = async () => {
    if (!db) return;
    setLoginLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const customerRef = doc(db, "customers", user.uid);
      const customerSnap = await getDoc(customerRef);

      if (!customerSnap.exists() || !customerSnap.data().phone) {
        setPendingUser(user);
        setNeedsPhoneModal(true);
        setLoginLoading(false);
        return;
      }

      await setDoc(customerRef, {
        lastLoginAt: serverTimestamp(),
      }, { merge: true });

      setLoginLoading(false);
      router.push("/customer/home");
    } catch (error: any) {
      console.error("Google login error:", error);
      alert("Login failed: " + error.message);
      setLoginLoading(false);
    }
  };

  const handleSavePhoneAndProceedInline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length < 10) {
      alert("Kripya sahi 10-digit mobile number darj karein.");
      return;
    }
    if (!db) return;

    setLoginLoading(true);
    try {
      const user = pendingUser;
      const customerRef = doc(db, "customers", user.uid);

      await setDoc(customerRef, {
        uid: user.uid,
        name: user.displayName || "Valued Customer",
        email: user.email || "",
        phone: phoneInput.trim(),
        photoURL: user.photoURL || "",
        totalTrips: 0,
        walletBalance: 1101, 
        membershipTier: "Premium",
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      }, { merge: true });

      setNeedsPhoneModal(false);
      setLoginLoading(false);
      router.push("/customer/home");
    } catch (err: any) {
      alert("Error saving profile: " + err.message);
      setLoginLoading(false);
    }
  };
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

  const triggerQuickBooking = (from: string, to: string, routeDistance: number) => {
    if (!currentUser) {
      // Show minimal login modal instead of full alert
      setNeedsPhoneModal(true);
      return;
    }

    const now = new Date();
    now.setHours(now.getHours() + 2);
    const baseDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const baseTime = `${String(now.getHours()).padStart(2, "0")}:00`;

    const vehicleKeys = Object.keys(VEHICLES) as VehicleType[];
    let oneWayAvailableCheck = true;

    const fareOptions: FareOption[] = vehicleKeys.map((type) => {
      const result = calculateFare({
        distance: routeDistance,
        vehicleType: type,
        bookingType: "oneway",
        serviceType: "outstation",
        pickupDate: baseDate,
        pickupTime: baseTime,
        drop: to,
        pickup: from,
      });

      oneWayAvailableCheck = result.isOneWayAvailable;

      return {
        id: `quick-${type}`,
        vehicleType: type,
        vehicleLabel: VEHICLES[type].label,
        vehicleImage: VEHICLES[type].image,
        finalFare: result.finalFare,
        fareText: `₹${result.finalFare.toLocaleString("en-IN")}`,
        billedDistance: result.billedDistance,
        durationMinutes: result.durationMinutes,
      };
    });

    setPopupData({ fareOptions, pickup: from, drop: to, bookingType: "oneway", serviceType: "outstation", pickupDate: baseDate, pickupTime: baseTime, isOneWayAvailable: oneWayAvailableCheck, baseDistance: routeDistance });
    setSelectedVehicleType("sedan");
    setShowUserForm(false);
    setShowPopup(true);
  };

  const handleOnlinePaymentCheckout = async (option: FareOption) => {
    if (!currentUser) {
      setNeedsPhoneModal(true);
      return;
    }
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
    const textPayload = `🚗 *New Cab Booking Enquiry - Khatu Rides Travels* 🏁
Hello! I am interested in booking an outstation trip:
• *From:* ${popupData.pickup}
• *To:* ${popupData.drop}
• *Trip Type:* ${popupData.bookingType.toUpperCase()}
• *Vehicle:* ${option.vehicleLabel}
• *Estimated Fare:* Rs. ${option.finalFare.toLocaleString("en-IN")}/-`;

    window.open(`https://wa.me/919244137353?text=${encodeURIComponent(textPayload)}`, "_blank");
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

  const selectedOption = popupData?.fareOptions.find((item) => item.vehicleType === selectedVehicleType);
  const totalPricingBase = selectedOption ? selectedOption.finalFare : 0;
  const currentSelectedMode = selectedOption && paymentSplitMode[selectedOption.id] ? paymentSplitMode[selectedOption.id] : "full";
  const displayPayNowNumber = currentSelectedMode === "half" ? Math.round(totalPricingBase / 2) : totalPricingBase;

  if (authChecking) {
    return (
      <PremiumSplashScreen></PremiumSplashScreen>
    );
  }

  return (
    <>
    <CarCursor></CarCursor>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <main className="min-h-screen bg-[#06101d] text-white pb-20 md:pb-0 font-sans selection:bg-amber-500 selection:text-white">
        {/* PREMIUM NAVBAR */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06101d]/90 backdrop-blur-2xl shadow-[0_8px_35px_rgba(0,0,0,0.25)]">
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-[76px] items-center justify-between gap-4">
              <a href="/" className="flex shrink-0 items-center">
                <img
                  src="/nav_logo.png"
                  alt="Khatu Rides Travels Co."
                  className="h-14 w-auto object-contain sm:h-[68px]"
                />
              </a>

              <nav className="hidden xl:flex items-center gap-7 text-[12px] font-extrabold text-white/75">
                <a href="/" className="hover:text-amber-600 transition">Home</a>
                <a href="#services" className="hover:text-amber-600 transition">Outstation</a>
                <a href="#airport" className="hover:text-amber-600 transition">Airport Taxi</a>
                <a href="#services" className="hover:text-amber-600 transition">Local Taxi</a>
                <a href="#fleet" className="hover:text-amber-600 transition">Car Rental</a>
                <a href="#corporate" className="hover:text-amber-600 transition">Corporate</a>
                <a href="#routes-heading" className="hover:text-amber-600 transition">Tour Packages</a>
                <a href="#contact" className="hover:text-amber-600 transition">Contact Us</a>
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <a href="tel:+919244137353" className="hidden sm:flex items-center gap-2 text-right">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 text-lg">☎</span>
                  <span className="leading-tight">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-white/45">24×7 Support</span>
                    <span className="block text-sm font-black text-white">+91 92441 37353</span>
                  </span>
                </a>
                <a
                  href="https://wa.me/919244137353"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white shadow-lg hover:bg-amber-500 hover:text-slate-950 transition"
                >
                  <span className="text-base">◉</span> WhatsApp Us
                </a>
                {currentUser ? (
                  <button onClick={() => router.push("/customer/home")} className="rounded-xl bg-emerald-600 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                    Dashboard
                  </button>
                ) : (
                  <button onClick={() => setNeedsPhoneModal(true)} className="rounded-xl bg-amber-500 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-md hover:bg-amber-400 transition">
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
          <SlidingTicker />
        </header>

        {/* HERO / BOOKING ENGINE */}
        <section className="relative min-h-[760px] overflow-hidden bg-[#06101d]">
          <div className="absolute inset-0 bg-[url('/splash-bg.png')] bg-cover bg-center opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06101d]/95 via-[#06101d]/70 to-[#06101d]/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06101d]/40 via-transparent to-[#06101d]" />
          <div className="relative mx-auto max-w-[1500px] px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
            <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] xl:gap-12">
              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-amber-300 backdrop-blur">
                  ✦ Chhattisgarh & MP's trusted cab partner
                </div>

                <h1 className="max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                  Your Journey.
                  <br />
                  <span className="text-amber-500">Our Responsibility.</span>
                </h1>

                <p className="mt-5 max-w-xl text-sm font-semibold leading-7 text-white/65 sm:text-base">
                  Reliable cab service across Chhattisgarh & beyond with transparent fares,
                  comfortable cars, experienced drivers and 24×7 travel support.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="tel:+919244137353" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xl backdrop-blur hover:bg-white/15 transition">
                    ☎ Call Now
                  </a>
                  <button
                    type="button"
                    onClick={() => calculatorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-amber-500/20 hover:bg-amber-400 transition"
                  >
                    Check Fare →
                  </button>
                </div>

                <div className="mt-8 grid max-w-xl grid-cols-3 gap-2">
                  {[
                    ["◷", "24×7", "Support"],
                    ["♢", "Verified", "Drivers"],
                    ["▣", "Clean", "Cars"],
                  ].map(([icon, title, sub]) => (
                    <div key={title} className="rounded-xl border border-white/10 bg-white/10 p-3 shadow-lg backdrop-blur-xl">
                      <div className="text-lg font-black text-amber-500">{icon}</div>
                      <div className="mt-1 text-[10px] font-black text-white">{title}</div>
                      <div className="text-[8px] font-bold uppercase tracking-wide text-white/45">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[390px] lg:min-h-[520px]">
                <div className="absolute right-0 top-5 h-[82%] w-[82%] rounded-full bg-amber-500/20 blur-3xl" />
                <div className="absolute bottom-12 left-1/2 h-2 w-[90%] -translate-x-1/2 rounded-full bg-slate-950/15 blur-md" />
                <img
                  src="/crysta_hero.png"
                  alt="Innova Crysta"
                  className="absolute inset-x-0 bottom-8 z-10 mx-auto w-[92%] max-w-[680px] object-contain drop-shadow-[0_30px_35px_rgba(15,23,42,0.22)] lg:bottom-12"
                />
                <div className="absolute right-0 top-10 z-20 w-44 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white shadow-2xl sm:w-52">
                  <div className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-400">Get Instant Fare</div>
                  <div className="mt-1 text-xs font-bold text-white/80">No hidden charges</div>
                  <div className="mt-3 text-3xl font-black text-amber-400">₹</div>
                  <div className="mt-2 text-[10px] font-black leading-4">Transparent Pricing<br />Before You Book!</div>
                </div>
              </div>
            </div>

            {/* BOOKING CARD */}
            <div ref={calculatorSectionRef} className="relative z-30 -mt-2 sm:-mt-8">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1a2c]/90 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                

                <div className="bg-transparent p-3 sm:p-5">
                  <FareCalculator
                    onFareCalculated={(data) => {
                      let oneWayAvail = true;
                      let baseSingleRouteDist = 150;

                      const updatedData = {
                        ...data,
                        fareOptions: data.fareOptions.map((opt) => {
                          const rawDist = opt.billedDistance;
                          const baseSingleDist = data.bookingType === "roundtrip" ? Math.round(rawDist / 2) : rawDist;
                          baseSingleRouteDist = baseSingleDist;

                          const recalculated = calculateFare({
                            distance: baseSingleDist,
                            vehicleType: opt.vehicleType,
                            bookingType: data.bookingType,
                            serviceType: data.serviceType,
                            pickupDate: data.pickupDate,
                            pickupTime: data.pickupTime,
                            returnDate: data.returnDate,
                            returnTime: data.returnTime,
                            drop: data.drop,
                            pickup: data.pickup,
                          });
                          oneWayAvail = recalculated.isOneWayAvailable;
                          return {
                            ...opt,
                            finalFare: recalculated.finalFare,
                            billedDistance: recalculated.billedDistance,
                            durationMinutes: recalculated.durationMinutes,
                          };
                        }),
                        isOneWayAvailable: oneWayAvail,
                        baseDistance: baseSingleRouteDist
                      };
                      setPopupData(updatedData);
                      setSelectedVehicleType("sedan");
                      setShowPopup(true);
                      setShowUserForm(false);
                      setPaymentSplitMode({});
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[9px] font-black uppercase tracking-wide text-white/55 shadow-sm backdrop-blur">
                <span>✓ No hidden charges</span>
                <span>✓ Instant estimate</span>
                <span>✓ 24×7 support</span>
                <span>✓ WhatsApp confirmation</span>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="mx-auto max-w-[1500px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#0b1a2c]/90 text-white shadow-2xl backdrop-blur-xl sm:grid-cols-5">
            {[
              ["60+", "Fleet Partners"],
              ["10K+", "Happy Customers"],
              ["24×7", "Customer Support"],
              ["100+", "Popular Routes"],
              ["4.9★", "Google Rating"],
            ].map(([value, label], i) => (
              <div key={label} className={`px-4 py-5 text-center ${i !== 4 ? "border-b sm:border-b-0 sm:border-r border-white/10" : ""}`}>
                <div className="text-2xl font-black text-amber-400 sm:text-3xl">{value}</div>
                <div className="mt-1 text-[9px] font-black uppercase tracking-wider text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CORPORATE CLIENTS */}
        <section className="border-y border-white/10 bg-[#081522] py-10 overflow-hidden">
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-amber-700">Trusted Industry Partners</span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white">Corporate Clients & Fleet Partners</h2>
            </div>
            <div className="mt-7 relative w-full overflow-hidden">
              <div className="flex w-max animate-marquee items-center gap-4 py-2">
                {[...CORPORATE_CLIENTS, ...CORPORATE_CLIENTS].map((client, idx) => (
                  <a
                    key={idx}
                    href={client.link || "#"}
                    target={client.link ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="group flex min-w-[205px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition hover:border-amber-300 hover:bg-amber-50"
                  >
                    <div className="flex h-11 w-14 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-1">
                      <img src={client.logo} alt={client.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-950 group-hover:text-amber-600 transition">{client.name}</div>
                      <div className="text-[9px] font-bold text-slate-500">{client.subtitle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FLEET */}
        <section id="fleet" className="bg-[#06101d] py-14 sm:py-20">
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-amber-700">Our Premium Garage</span>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Choose Your Perfect Ride</h2>
                <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-white/50">Comfortable, clean and reliable vehicles for family trips, airport transfers and corporate travel.</p>
              </div>
              <button onClick={() => calculatorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} className="w-fit rounded-xl bg-slate-950 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-white hover:bg-amber-500 hover:text-slate-950 transition">View All Vehicles →</button>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { title: "Swift Dzire", type: "Sedan", seats: "4+1", img: "/dezire.png", rate: "₹11/KM", tag: "Popular" },
                { title: "Ertiga", type: "MUV", seats: "6+1", img: "/ertiga.png", rate: "₹13/KM", tag: "Family Choice" },
                { title: "Innova", type: "SUV", seats: "6+1", img: "/ertiga.png", rate: "₹17/KM", tag: "Comfort" },
                { title: "Innova Crysta", type: "Luxury SUV", seats: "6+1", img: "/crysta.png", rate: "₹20/KM", tag: "Premium" },
                { title: "Scorpio", type: "SUV", seats: "6+1", img: "/scorpio.png", rate: "₹18/KM", tag: "Adventure" },
              ].map((car) => (
                <div key={car.title} className="group overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1a2c] shadow-[0_15px_45px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-[0_22px_55px_rgba(0,0,0,0.32)]">
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#12263b] to-[#2a1b0a]">
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur">{car.tag}</span>
                    <img src={car.img} alt={car.title} className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <div className="text-[8px] font-black uppercase tracking-widest text-amber-600">{car.type}</div>
                    <h3 className="mt-1 text-lg font-black text-white">{car.title}</h3>
                    <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                      <div className="rounded-lg border border-white/5 bg-white/5 px-1 py-2"><div className="text-xs">👥</div><div className="text-[7px] font-bold text-white/45">{car.seats} Seats</div></div>
                      <div className="rounded-lg border border-white/5 bg-white/5 px-1 py-2"><div className="text-xs">❄</div><div className="text-[7px] font-bold text-white/45">AC</div></div>
                      <div className="rounded-lg border border-white/5 bg-white/5 px-1 py-2"><div className="text-xs">🧳</div><div className="text-[7px] font-bold text-white/45">Luggage</div></div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div><div className="text-[8px] font-black uppercase tracking-wide text-slate-400">Starting Rate</div><div className="text-base font-black text-white">{car.rate}</div></div>
                      <button onClick={() => calculatorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} className="rounded-lg bg-slate-950 px-3 py-2 text-[8px] font-black uppercase tracking-wider text-white hover:bg-amber-500 hover:text-slate-950 transition">Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="bg-[#081522] py-14 sm:py-20">
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-amber-700">What We Offer</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Everything You Need To Travel</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">From one-way city transfers to multi-day family journeys and corporate mobility.</p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["↗", "One Way Taxi", "Travel one city to another without paying for the return journey."],
                ["↔", "Round Trip", "Dedicated cab and driver for family and multi-day outstation travel."],
                ["✈", "Airport Taxi", "On-time airport pickup and drop with reliable travel support."],
                ["◷", "Local Rental", "Flexible 4/8/12 hour city packages for business and sightseeing."],
                ["▣", "Car Rental", "Choose a sedan, MUV or premium SUV for your trip."],
                ["⌂", "Family Trips", "Comfortable vehicles and practical packages for family vacations."],
                ["◆", "Corporate Travel", "Employee, client, hotel and business transportation solutions."],
                ["◎", "Multi-City", "Explore multiple destinations with one vehicle and one booking."],
              ].map(([icon, title, desc]) => (
                <div key={title} className="group rounded-2xl border border-white/10 bg-[#0b1a2c] p-5 shadow-xl transition hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-2xl">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-xl font-black text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">{icon}</div>
                  <h3 className="mt-4 text-sm font-black text-white">{title}</h3>
                  <p className="mt-1.5 text-[11px] leading-5 text-white/50">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AIRPORT */}
        <section id="airport" className="relative overflow-hidden bg-slate-950 py-14 text-white sm:py-20">
          <div className="absolute inset-0 bg-[url('/banner6.png')] bg-cover bg-center opacity-20" />
          <div className="relative mx-auto grid max-w-[1500px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-amber-300">Airport Transfer</span>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Never Miss Your Flight.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">Reliable airport pickup and drop services with comfortable cars, experienced drivers and round-the-clock assistance.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {["Flight-friendly pickup", "Clean vehicles", "24×7 assistance", "Transparent fare"].map((x) => <span key={x} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[9px] font-black uppercase tracking-wide">{x}</span>)}
              </div>
              <button onClick={() => calculatorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} className="mt-7 rounded-xl bg-amber-500 px-5 py-3.5 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-xl hover:bg-amber-400 transition">Book Airport Taxi →</button>
            </div>
            <div className="relative flex min-h-[280px] items-center justify-center">
              <div className="absolute h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
              <div className="relative rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
                <div className="text-5xl">✈</div>
                <div className="mt-4 text-2xl font-black">Airport → Home</div>
                <div className="mt-2 text-xs font-bold text-white/60">On-time pickup • Comfortable ride • 24×7 support</div>
              </div>
            </div>
          </div>
        </section>

        {/* CORPORATE */}
        <section id="corporate" className="bg-[#06101d] py-14 sm:py-20">
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-7 sm:p-10 lg:p-14">
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-amber-700">Business Travel Solutions</span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Corporate & Hotel Partners</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">Need a dependable travel partner for your employees, clients or hotel guests? Khatu Rides can support recurring and on-demand transportation requirements.</p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {["Airport & client transfers", "Employee transportation", "Monthly cab contracts", "Dedicated support", "Guest pickup & drop", "Corporate billing"].map((x) => (
                      <div key={x} className="flex items-center gap-2 text-xs font-black text-slate-700"><span className="text-amber-500">✓</span>{x}</div>
                    ))}
                  </div>
                  <a href="https://wa.me/919244137353?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20discuss%20a%20corporate%20or%20hotel%20travel%20partnership." target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-xl bg-slate-950 px-5 py-3.5 text-[10px] font-black uppercase tracking-wider text-white hover:bg-amber-500 hover:text-slate-950 transition">Become Our Partner →</a>
                </div>
                <div className="relative min-h-[300px] bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-900/70" />
                  <div className="relative flex h-full flex-col justify-center p-8 text-white sm:p-12">
                    <div className="text-5xl text-amber-400">◆</div>
                    <div className="mt-5 text-3xl font-black">One Partner.<br />Every Journey.</div>
                    <p className="mt-3 max-w-sm text-xs leading-6 text-white/60">Reliable transportation support for companies, hotels, travel agencies and business travellers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="bg-[#081522] py-14 sm:py-20">
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-amber-700">Customer Voice</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Real Journeys. Real Experiences.</h2>
            </div>
            <ReviewsCarousel />
          </div>
        </section>

        {/* ROUTES */}
        <section id="routes-heading" className="bg-[#06101d] py-14 sm:py-20" aria-labelledby="routes-title">
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
            <div className="mb-9 text-center">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-amber-700">Top Corridors</span>
              <h2 id="routes-title" className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Popular Routes</h2>
              <p className="mt-2 text-sm text-white/50">Frequently booked intercity routes with transparent starting fares.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ROUTES.map((route, index) => (
                <article key={index} onClick={() => triggerQuickBooking(route.from, route.to, parseInt(route.km))} className="group cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1a2c] shadow-xl transition hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-2xl">
                  <div className="relative h-40 overflow-hidden">
                    <img src={route.image} alt={`${route.from} to ${route.to}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2.5 py-1 text-[9px] font-black text-slate-950">{route.km}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-black tracking-tight text-white group-hover:text-amber-400 transition">{route.from.split(",")[0]} → {route.to.split(",")[0]}</h3>
                    <p className="mt-1 text-[10px] font-bold text-white/45">⏱ {route.time} approx.</p>
                    <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
                      <div><div className="text-[8px] font-black uppercase tracking-wider text-slate-400">Starting from</div><div className="text-lg font-black text-amber-600">{route.price}</div></div>
                      <span className="rounded-lg bg-slate-950 px-3 py-2 text-[9px] font-black uppercase tracking-wider text-white group-hover:bg-amber-500 group-hover:text-slate-950 transition">Book</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-[#081522] py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-amber-700">Simple Booking</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Book In 3 Simple Steps</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                ["01", "Enter Your Route", "Pickup, destination, date and time."],
                ["02", "Check Fare & Choose", "Compare the estimated fare and select your vehicle."],
                ["03", "Confirm Your Booking", "Pay securely or connect on WhatsApp for assistance."],
              ].map(([num, title, desc]) => (
                <div key={num} className="relative rounded-[24px] border border-white/10 bg-[#0b1a2c] p-6 text-center shadow-xl">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-amber-400">{num}</div>
                  <h3 className="mt-5 text-base font-black text-slate-950">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SeoTextBlock />

        {/* FINAL CTA */}
        <section className="bg-slate-950 py-14 text-center text-white sm:py-16">
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">Ready for your next journey?</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Your Destination Is Waiting.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/60">Get your fare estimate and book a comfortable ride in minutes.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => calculatorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} className="rounded-xl bg-amber-500 px-6 py-3.5 text-[10px] font-black uppercase tracking-wider text-slate-950 hover:bg-amber-400 transition">Check Fare & Book</button>
              <a href="https://wa.me/919244137353" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-[10px] font-black uppercase tracking-wider text-white hover:bg-white/10 transition">WhatsApp Us</a>
            </div>
          </div>
        </section>

        {/* MOBILE ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-[900] grid grid-cols-3 border-t border-slate-200 bg-white/95 p-2 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
          <a href="tel:+919244137353" className="flex items-center justify-center gap-1 rounded-xl py-3 text-[9px] font-black uppercase tracking-wider text-slate-900">☎ Call</a>
          <a href="https://wa.me/919244137353" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-3 text-[9px] font-black uppercase tracking-wider text-white">◉ WhatsApp</a>
          <button onClick={() => calculatorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} className="flex items-center justify-center gap-1 rounded-xl bg-amber-500 py-3 text-[9px] font-black uppercase tracking-wider text-slate-950">🚕 Book Now</button>
        </div>
      </main>


      {/* 👑 PREMIUM GOOGLE LOGIN / PHONE VERIFICATION MODAL */}
      <AnimatePresence>
        {needsPhoneModal && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white text-slate-900 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => { setNeedsPhoneModal(false); setPendingUser(null); setPhoneInput(""); }}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                aria-label="Close login"
              >
                ✕
              </button>

              <div className="bg-gradient-to-br from-slate-950 via-[#10233f] to-slate-950 px-6 pb-7 pt-8 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1 shadow-lg">
                    <img src="/logo.png" alt="Khatu Rides" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-amber-400">Khatu Rides</p>
                    <h3 className="mt-1 text-xl font-black tracking-tight">{pendingUser ? "Almost there!" : "Sign in to continue"}</h3>
                  </div>
                </div>
                <p className="mt-4 max-w-sm text-xs leading-5 text-white/65">
                  {pendingUser
                    ? "Add your mobile number so we can send driver details and trip updates."
                    : "Use your Google account to securely access bookings, trip history and customer benefits."}
                </p>
              </div>

              <div className="p-6 sm:p-7">
                {!pendingUser ? (
                  <>
                    <button
                      type="button"
                      onClick={handleGoogleLoginInline}
                      disabled={loginLoading}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-black">G</span>
                      {loginLoading ? "Connecting to Google..." : "Continue with Google"}
                    </button>

                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Secure Login</span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-slate-50 px-2 py-3"><div className="text-lg">🔐</div><p className="mt-1 text-[8px] font-black uppercase text-slate-500">Secure</p></div>
                      <div className="rounded-xl bg-slate-50 px-2 py-3"><div className="text-lg">🚕</div><p className="mt-1 text-[8px] font-black uppercase text-slate-500">Bookings</p></div>
                      <div className="rounded-xl bg-slate-50 px-2 py-3"><div className="text-lg">🎁</div><p className="mt-1 text-[8px] font-black uppercase text-slate-500">Benefits</p></div>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSavePhoneAndProceedInline} className="space-y-4">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Google verified</p>
                          <p className="truncate text-xs font-bold text-slate-700">{pendingUser.email || pendingUser.displayName || "Google account"}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">Mobile Number *</label>
                      <div className="flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10">
                        <span className="border-r border-slate-200 bg-slate-100 px-4 py-3.5 text-xs font-black text-slate-600">+91</span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
                          required
                          className="w-full bg-transparent px-4 py-3.5 text-sm font-bold text-slate-900 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading || phoneInput.length !== 10}
                      className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-[#d99a22] py-4 text-xs font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loginLoading ? "Creating Profile..." : "Continue to Customer Dashboard"}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPendingUser(null); setPhoneInput(""); }}
                      className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition hover:text-slate-700"
                    >
                      ← Use another Google account
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 👑 FARE RESULTS POPUP MODAL - MINIMUM SIDE SCREEN */}
      <AnimatePresence>
        {showPopup && popupData && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/80 p-0 sm:p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-slate-100 w-full max-w-4xl rounded-none sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col min-h-screen sm:min-h-0 sm:max-h-[96vh] text-left relative"
            >
              <div className="bg-slate-950 text-white px-3 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="bg-orange-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded tracking-wider shrink-0">
                    {popupData.bookingType}
                  </span>
                  <h3 className="text-xs sm:text-base font-black tracking-tight text-white truncate flex items-center gap-1.5">
                    <span>{popupData.pickup.split(",")[0]}</span>
                    <span className="text-orange-500">➔</span>
                    <span>{popupData.drop.split(",")[0]}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-white rounded-full h-8 w-8 flex items-center justify-center transition border border-slate-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* STATS SUMMARY BAR */}
              {(() => {
                const firstOpt = popupData.fareOptions[0];
                const dist = firstOpt?.billedDistance || 0;
                const mins = firstOpt?.durationMinutes || 120;
                const hoursNum = Math.floor(mins / 60);
                const minsNum = mins % 60;

                let dropDateTimeStr = "Calculated on transit";
                try {
                  const pickupDt = new Date(`${popupData.pickupDate}T${popupData.pickupTime}`);
                  if (!isNaN(pickupDt.getTime())) {
                    const dropDt = new Date(pickupDt.getTime() + mins * 60 * 1000);
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const dStr = `${dropDt.getDate()} ${months[dropDt.getMonth()]}`;
                    let h = dropDt.getHours();
                    const ampm = h >= 12 ? "PM" : "AM";
                    h = h % 12 || 12;
                    const mStr = String(dropDt.getMinutes()).padStart(2, "0");
                    dropDateTimeStr = `${dStr}, ${String(h).padStart(2, "0")}:${mStr} ${ampm}`;
                  }
                } catch (e) {}

                return (
                  <div className="bg-white px-3 sm:px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 shadow-2xs sticky top-[57px] z-20">
                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-none whitespace-nowrap text-xs">
                      <span className="flex items-center gap-1 text-slate-700">
                        <span className="text-blue-600">📍</span> <strong>{dist} Kms</strong>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1 text-slate-700">
                        <span className="text-blue-600">⏱️</span> <strong>~{hoursNum}h {minsNum}m</strong>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1 text-slate-700">
                        <span className="text-blue-600">🏁</span> Est. Drop: <strong>{dropDateTimeStr}</strong>
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="p-2.5 sm:p-6 overflow-y-auto flex-1 space-y-3 bg-slate-100 pb-24 sm:pb-6">
                {!showUserForm ? (
                  <div className="flex flex-col gap-3 max-w-4xl mx-auto w-full">
                    {popupData.fareOptions.map((opt) => {
                      if (!["sedan", "ertiga", "crysta"].includes(opt.vehicleType)) return null;

                      const dynamicLimitKms = getDynamicKmsLimitDisplay(opt);
                      const extraRatePerKm = opt.vehicleType === "sedan" ? 13 : opt.vehicleType === "ertiga" ? 17 : 20.7;
                      const isSelected = selectedVehicleType === opt.vehicleType;
                      const isExpanded = expandedInclusionsId === opt.id;
                      const strikePrice = Math.round(opt.finalFare * 1.15);

                      const fullVehicleTitle = opt.vehicleType === "sedan" 
                        ? "DZIRE, ETIOS" 
                        : opt.vehicleType === "ertiga" 
                        ? "ERTIGA, XYLO" 
                        : "INNOVA CRYSTA";

                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedVehicleType(opt.vehicleType)}
                          className={`rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 bg-white p-4 sm:p-5 cursor-pointer relative shadow-sm ${
                            isSelected ? "border-orange-500 ring-2 ring-orange-500/15 bg-orange-50/5" : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {opt.vehicleType === "sedan" && (
                            <div className="absolute -top-3 left-6 bg-orange-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                              BEST PRICE
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-3 pt-1">
                            <div className="bg-slate-50 rounded-2xl border border-slate-100 w-32 h-20 sm:w-40 sm:h-24 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                              <img
                                src={VEHICLES[opt.vehicleType]?.image}
                                alt={opt.vehicleLabel}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0 px-2">
                              <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase truncate">
                                {fullVehicleTitle}
                              </h4>

                              <div className="mt-1 space-y-0.5 text-xs text-slate-600 font-bold">
                                <div className="flex items-center gap-1 text-slate-700">
                                  <span>📍</span>
                                  <span>{dynamicLimitKms} Kms Included</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-600 truncate">
                                  <span>⚡</span>
                                  <span className="truncate">Extra @ ₹{extraRatePerKm}/Km after limit</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-xs sm:text-sm font-bold text-red-600 line-through">
                                Rs. {strikePrice.toLocaleString("en-IN")}/-
                              </div>
                              <div className="bg-[#0284c7] text-white text-base sm:text-xl font-black px-4 py-1.5 rounded-full shadow-md inline-block tracking-tight mt-1">
                                Rs. {opt.finalFare.toLocaleString("en-IN")}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                            <a
                              href="tel:+919244137353"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-[#581c87] hover:bg-[#4c1d95] text-white font-black text-[11px] sm:text-xs uppercase py-3 px-2 rounded-xl shadow-md transition text-center flex items-center justify-center gap-1 min-h-[42px]"
                              aria-label="Call now"
                            >
                              📞 <span className="hidden sm:inline">CALL</span> NOW
                            </a>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhatsAppManualRedirect(opt);
                              }}
                              className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-black text-[11px] sm:text-xs uppercase py-3 px-2 rounded-xl shadow-md transition text-center flex items-center justify-center gap-1 min-h-[42px]"
                            >
                              💬 <span className="hidden sm:inline">WHATSAPP</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVehicleType(opt.vehicleType);
                                setPaymentSplitMode((p) => ({ ...p, [opt.id]: "half" }));
                                setShowUserForm(true);
                              }}
                              className="bg-orange-600 hover:bg-orange-700 text-white font-black text-[11px] sm:text-xs uppercase py-3 px-2 rounded-xl shadow-md transition text-center min-h-[42px]"
                            >
                              🚀 BOOK
                            </button>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-700 font-bold flex items-center gap-1 text-xs">
                              <span className="text-emerald-600">✓</span> Toll, State Tax & Driver Allowance Included
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedInclusionsId(isExpanded ? null : opt.id);
                              }}
                              className="font-black text-orange-600 hover:text-orange-700 text-xs shrink-0"
                            >
                              {isExpanded ? "Hide ▲" : "Inclusions ▼"}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700 animate-fadeIn">
                              <div>✔ <strong>{dynamicLimitKms} Km included:</strong> ₹{extraRatePerKm}/km beyond limit.</div>
                              <div>✔ <strong>Toll & State Tax:</strong> Fully covered in fare.</div>
                              <div>✔ <strong>Driver Allowance:</strong> Included.</div>
                              <div>✔ <strong>Waiting Time:</strong> Upto 45 mins free at pickup.</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-md text-left w-full my-auto">
                    <div className="text-center mb-5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded">Secure Form</span>
                      <h4 className="text-lg font-black text-slate-900 mt-2">Enter Details to Complete Booking</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Customer Full Name</label>
                        <input
                          type="text"
                          placeholder="Type customer name..."
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-sm font-bold focus:outline-none focus:border-orange-500 transition shadow-xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Mobile Number (For Driver SMS)</label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="Enter 10-digit phone number..."
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-sm font-bold focus:outline-none focus:border-orange-500 transition shadow-xs"
                        />
                      </div>

                      {selectedOption && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Split Booking Matrix</span>
                          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-1">
                            <button
                              type="button"
                              onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "half" }))}
                              className={`rounded-lg py-2 text-center text-[11px] font-black uppercase tracking-wide ${currentSelectedMode === "half" ? "bg-orange-600 text-white shadow-sm" : "text-slate-500"}`}
                            >
                              50% Advance
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "full" }))}
                              className={`rounded-lg py-2 text-center text-[11px] font-black uppercase tracking-wide ${currentSelectedMode === "full" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500"}`}
                            >
                              Full Pay
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 block uppercase">Payable Now</span>
                              <span className="text-xl font-black text-slate-900">₹{displayPayNowNumber.toLocaleString("en-IN")}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">{selectedOption.vehicleLabel}</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowUserForm(false)}
                          className="w-full border border-slate-300 bg-slate-100 text-slate-700 font-bold text-xs uppercase py-3.5 rounded-xl transition"
                        >
                          ↩ Back
                        </button>
                        <button
                          type="button"
                          onClick={() => selectedOption && handleOnlinePaymentCheckout(selectedOption)}
                          disabled={paymentLoadingId !== null}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg shadow-orange-600/20 disabled:opacity-50"
                        >
                          {paymentLoadingId ? "Syncing..." : "Proceed to Pay"}
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

      <AnimatePresence>
        {successReceipt && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-xs">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
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
                  <div className="flex justify-between"><span className="font-bold text-slate-900">Timeline:</span> <span>{successReceipt.date} at {successReceipt.time}</span></div>
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
    </>
  );
}
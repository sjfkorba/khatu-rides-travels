// app/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import FareCalculator from "@/components/FareCalculator";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import SeoTextBlock from "@/components/SeoTextBlock";
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

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginAlertModal, setShowLoginAlertModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [needsPhoneModal, setNeedsPhoneModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

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

  // Special Offers States
  const [activeOffers, setActiveOffers] = useState<SpecialOffer[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [showAllOffersModal, setShowAllOffersModal] = useState(false);

  const [showInitialRatingModal, setShowInitialRatingModal] = useState(false);
  const calculatorSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Auth State Observer with Automatic Redirection for Logged-In Users
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecking(false);
      if (user) {
        router.replace("/customer/home");
      }
    });

    const timer = setTimeout(() => {
      setShowInitialRatingModal(true);
    }, 1000);

    const handleScrollTrigger = () => {
      if (calculatorSectionRef.current) {
        calculatorSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    window.addEventListener("khatuScrollToCalc", handleScrollTrigger);

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
      clearTimeout(timer);
      unsubscribeAuth();
      window.removeEventListener("khatuScrollToCalc", handleScrollTrigger);
      if (unsubscribeOffers) unsubscribeOffers();
    };
  }, [router]);

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
        setShowLoginAlertModal(false);
        setNeedsPhoneModal(true);
        setLoginLoading(false);
        return;
      }

      await setDoc(customerRef, {
        lastLoginAt: serverTimestamp(),
      }, { merge: true });

      setShowLoginAlertModal(false);
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
        walletBalance: 0,
        membershipTier: "Standard",
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

  const getVehicleImageByName = (vType: string) => {
    const lower = vType.toLowerCase();
    if (lower.includes("crysta") || lower.includes("innova")) return "/crysta.png";
    if (lower.includes("ertiga") || lower.includes("suv") || lower.includes("xylo")) return "/ertiga.png";
    return "/dezire.png";
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

  const fetchTollInformation = async (pickup: string, drop: string) => {
    setTollLoading(true);
    try {
      const res = await fetch("/api/toll-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, drop }),
      });
      const data = await res.json();
      if (data.success) {
        setTollData(data.tollDetails);
        setShowTollModal(true);
      } else {
        alert(data.error || "Could not fetch toll details");
      }
    } catch (err) {
      console.error("Toll fetch error:", err);
    } finally {
      setTollLoading(false);
    }
  };

  const triggerQuickBooking = (from: string, to: string, routeDistance: number) => {
    if (!currentUser) {
      setShowLoginAlertModal(true);
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

  const handleConvertToRoundTrip = () => {
    if (!popupData) return;
    const vehicleKeys = Object.keys(VEHICLES) as VehicleType[];
    const routeBaseDist = popupData.baseDistance || 150;

    const fareOptions: FareOption[] = vehicleKeys.map((type) => {
      const result = calculateFare({
        distance: routeBaseDist,
        vehicleType: type,
        bookingType: "roundtrip",
        serviceType: popupData.serviceType,
        pickupDate: popupData.pickupDate,
        pickupTime: popupData.pickupTime,
        drop: popupData.drop,
        pickup: popupData.pickup,
      });

      return {
        id: `rt-${type}-${Date.now()}`,
        vehicleType: type,
        vehicleLabel: VEHICLES[type].label,
        vehicleImage: VEHICLES[type].image,
        finalFare: result.finalFare,
        strikeFare: result.strikeFare,
        fareText: `₹${result.finalFare.toLocaleString("en-IN")}`,
        billedDistance: result.billedDistance,
        durationMinutes: result.durationMinutes,
      };
    });

    setPopupData({
      ...popupData,
      bookingType: "roundtrip",
      fareOptions,
      isOneWayAvailable: true
    });
  };

  const handleOnlinePaymentCheckout = async (option: FareOption) => {
    if (!currentUser) {
      setShowLoginAlertModal(true);
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

  const selectedOption = popupData?.fareOptions.find((item) => item.vehicleType === selectedVehicleType);
  const totalPricingBase = selectedOption ? selectedOption.finalFare : 0;
  const currentSelectedMode = selectedOption && paymentSplitMode[selectedOption.id] ? paymentSplitMode[selectedOption.id] : "full";
  const displayPayNowNumber = currentSelectedMode === "half" ? Math.round(totalPricingBase / 2) : totalPricingBase;

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-orange-500 font-bold text-xs uppercase tracking-widest animate-pulse">
        Loading Khatu Rides...
      </div>
    );
  }

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 pb-20 md:pb-0 font-sans selection:bg-orange-500 selection:text-white relative overflow-hidden">
        
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <header className="w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 select-none shadow-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
            
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-white leading-none">
                  Khatu<span className="text-orange-500">Rides</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-orange-400 mt-1">Travels Co.</span>
              </div>
            </div>

            <nav className="hidden xl:flex items-center gap-6 text-[11px] font-extrabold text-slate-300 uppercase tracking-widest">
              <a href="#" className="text-orange-500 hover:text-orange-400 transition">Home</a>
              <a href="#about" className="hover:text-orange-400 transition">About Us</a>
              <a href="#services" className="hover:text-orange-400 transition">Our Services</a>
              <a href="#routes-heading" className="hover:text-orange-400 transition">Popular Routes</a>
              <a href="#offers" className="hover:text-orange-400 transition">Offers</a>
              <a href="#contact" className="hover:text-orange-400 transition">Contact Us</a>
            </nav>

          <div className="flex items-center gap-2.5 shrink-0">
  <a href="tel:+919244137353" className="hidden md:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-[11px] font-black text-slate-200 hover:bg-slate-800 transition shadow-inner">
    <span className="text-emerald-400 text-xs">📞</span> Call: <span className="text-orange-400">92441 37353</span>
  </a>
  <a href="https://wa.me/919244137353" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-500 transition">
    <span className="text-base">💬</span>
  </a>
  {currentUser ? (
    <button onClick={() => router.push("/customer/home")} className="rounded-full bg-emerald-600 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-white hover:bg-emerald-500 transition shadow-lg">
      Dashboard
    </button>
  ) : (
    <button onClick={() => router.push("/login")} className="rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-white hover:from-orange-500 hover:to-amber-400 transition shadow-lg shadow-orange-600/30">
      Login
    </button>
  )}
</div>
          </div>
        </header>

        {/* Chhattisgarh & Madhya Pradesh Fastest Growing Banner */}
        <div className="w-full bg-linear-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-orange-500/30 py-2.5 px-4 text-center text-xs font-black text-orange-300 tracking-wide">
          ⚡ Chhattisgarh & Madhya Pradesh ka Fastest Growing Cab Service
        </div>

        {/* 👑 MOBILE FIRST ORDER: OFFER CARD FIRST, THEN FARE CALCULATOR */}
        <section className="relative px-4 pt-6 pb-16 sm:py-12 max-w-7xl mx-auto">
          
          {/* Mobile First Wrapper for Offer Card */}
          <div className="max-w-4xl mx-auto space-y-3 mb-8 block lg:hidden order-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-orange-400 flex items-center gap-1.5">
                <span>🔥</span> TODAY'S SPECIAL OFFER
              </span>
              <button
                type="button"
                onClick={() => setShowAllOffersModal(true)}
                className="text-[11px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm"
              >
                View All Running Offer
              </button>
            </div>

            {activeOffers.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-lg text-slate-900">
                <span className="text-xl mb-0.5 block">🏷️</span>
                <p className="text-xs font-black uppercase tracking-wide">Presently no any offer are available</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Check back soon for exciting discount packages across CG & MP corridors.</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-white border border-orange-200 px-4 py-3 sm:px-6 sm:py-3.5 shadow-xl text-slate-900">
                <AnimatePresence mode="wait">
                  {activeOffers[currentOfferIndex] && (() => {
                    const offer = activeOffers[currentOfferIndex];
                    const diff = Math.max(0, offer.strikeFare - offer.offerFare);
                    return (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col sm:flex-row items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3.5 text-center sm:text-left w-full sm:w-auto">
                          <div className="w-14 h-12 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                            <img
                              src={getVehicleImageByName(offer.vehicleType)}
                              alt="Vehicle"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                              <span className="bg-orange-100 text-orange-700 text-[8px] font-black uppercase px-2 py-0.2 rounded border border-orange-200">
                                {offer.tripType}
                              </span>
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">● LIVE DEAL</span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900 tracking-tight">
                              {offer.fromCity} ➔ {offer.toCity}
                            </h4>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold flex-wrap">
                              <span className="text-slate-500 capitalize text-[11px]">{offer.vehicleType}</span>
                              <span className="text-slate-300">|</span>
                              <span className="text-red-500 line-through text-xs font-bold">₹{offer.strikeFare}</span>
                              <span className="text-emerald-600 font-black text-sm">₹{offer.offerFare}</span>
                              {diff > 0 && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded ml-1">
                                  Save Rs. {diff.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="w-full sm:w-auto shrink-0">
                          <a
                            href="tel:+919244137353"
                            className="block w-full sm:w-auto text-center bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition shadow-orange-600/30"
                          >
                            📞 CALL NOW FOR BOOK
                          </a>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                {activeOffers.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-2">
                    {activeOffers.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentOfferIndex(idx)}
                        className={`h-1 rounded-full transition-all ${idx === currentOfferIndex ? "w-5 bg-orange-600" : "w-1 bg-slate-300"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            
            <div className="lg:col-span-5 text-center lg:text-left space-y-4 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest">
                <span>🌟 Premium Intercity Cabs</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
                Har Safar,<br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 via-amber-400 to-orange-500">Khatu Rides</span> Ke Saath.
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-400">
                Outstation • Local • Airport • Round Trip with absolute safety & transparent pricing.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4">
                {[
                  { icon: "🛡️", title: "Best Price", sub: "Guarantee" },
                  { icon: "👨‍✈️", title: "Verified", sub: "Drivers" },
                  { icon: "🎧", title: "24x7", sub: "Support" },
                  { icon: "⏱️", title: "On-Time", sub: "Pickup" },
                ].map((tb, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800/80 shadow-lg">
                    <span className="text-xl">{tb.icon}</span>
                    <div>
                      <div className="text-xs font-black text-slate-200 leading-tight">{tb.title}</div>
                      <div className="text-[10px] font-bold text-slate-400">{tb.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div ref={calculatorSectionRef} className="lg:col-span-7 relative z-20 order-1 lg:order-2 space-y-6">
              
              {/* Desktop Offer Card Wrapper */}
              <div className="max-w-4xl mx-auto space-y-3 hidden lg:block">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-orange-400 flex items-center gap-1.5">
                    <span>🔥</span> TODAY'S SPECIAL OFFER
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAllOffersModal(true)}
                    className="text-[11px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm"
                  >
                    View All Running Offer
                  </button>
                </div>

                {activeOffers.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-lg text-slate-900">
                    <span className="text-xl mb-0.5 block">🏷️</span>
                    <p className="text-xs font-black uppercase tracking-wide">Presently no any offer are available</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Check back soon for exciting discount packages across CG & MP corridors.</p>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden bg-white border border-orange-200 px-4 py-3 sm:px-6 sm:py-3.5 shadow-xl text-slate-900">
                    <AnimatePresence mode="wait">
                      {activeOffers[currentOfferIndex] && (() => {
                        const offer = activeOffers[currentOfferIndex];
                        const diff = Math.max(0, offer.strikeFare - offer.offerFare);
                        return (
                          <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="flex flex-col sm:flex-row items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3.5 text-center sm:text-left w-full sm:w-auto">
                              <div className="w-14 h-12 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                                <img
                                  src={getVehicleImageByName(offer.vehicleType)}
                                  alt="Vehicle"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                  <span className="bg-orange-100 text-orange-700 text-[8px] font-black uppercase px-2 py-0.2 rounded border border-orange-200">
                                    {offer.tripType}
                                  </span>
                                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">● LIVE DEAL</span>
                                </div>
                                <h4 className="text-sm font-black text-slate-900 tracking-tight">
                                  {offer.fromCity} ➔ {offer.toCity}
                                </h4>
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold flex-wrap">
                                  <span className="text-slate-500 capitalize text-[11px]">{offer.vehicleType}</span>
                                  <span className="text-slate-300">|</span>
                                  <span className="text-red-500 line-through text-xs font-bold">₹{offer.strikeFare}</span>
                                  <span className="text-emerald-600 font-black text-sm">₹{offer.offerFare}</span>
                                  {diff > 0 && (
                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded ml-1">
                                      Save Rs. {diff.toLocaleString("en-IN")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="w-full sm:w-auto shrink-0">
                              <a
                                href="tel:+919244137353"
                                className="block w-full sm:w-auto text-center bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition shadow-orange-600/30"
                              >
                                📞 CALL NOW FOR BOOK
                              </a>
                            </div>
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>

                    {activeOffers.length > 1 && (
                      <div className="flex justify-center gap-1.5 mt-2">
                        {activeOffers.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentOfferIndex(idx)}
                            className={`h-1 rounded-full transition-all ${idx === currentOfferIndex ? "w-5 bg-orange-600" : "w-1 bg-slate-300"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
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

          </div>
        </section>

        <section id="offers" className="px-4 max-w-7xl mx-auto my-12">
          <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-orange-950 via-slate-900 to-amber-950 border border-orange-500/30 p-6 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-5 text-center sm:text-left relative z-10">
              <span className="text-5xl sm:text-7xl animate-bounce">🎁</span>
              <div>
                <span className="bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-md">SPECIAL OFFER</span>
                <h3 className="text-xl sm:text-3xl font-black text-white mt-2">Book Round Trip & Get UPTO 15% OFF</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">Limited Time Offer! Applicable on all outstation corridors across Chhattisgarh & MP.</p>
              </div>
            </div>
            <button onClick={() => setShowInitialRatingModal(true)} className="relative z-10 rounded-2xl bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest px-8 py-4 shadow-xl shadow-orange-600/30 transition shrink-0">
              Claim Discount Now
            </button>
          </div>
        </section>

        <section className="px-4 max-w-7xl mx-auto my-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Why Choose Khatu Rides?</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">Excellence in intercity travel with absolute safety and transparent operations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🛡️", title: "No Hidden Charges", desc: "100% Transparent Pricing with toll and state taxes included." },
              { icon: "🚗", title: "Well Maintained Cars", desc: "Sedan, SUV, Innova & more inspected thoroughly before every journey." },
              { icon: "👨‍✈️", title: "Professional Drivers", desc: "Verified & experienced local drivers for smooth highway rides." },
              { icon: "🎧", title: "24x7 Customer Support", desc: "Call or WhatsApp anytime for instant trip assistance & tracking." },
            ].map((wc, idx) => (
              <div key={idx} className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-xl hover:border-orange-500/50 transition-all duration-300 text-center flex flex-col items-center group">
                <span className="text-4xl mb-4 group-hover:scale-110 transition duration-300">{wc.icon}</span>
                <h3 className="text-base font-black text-white mb-2">{wc.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{wc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="routes-heading" className="px-4 max-w-7xl mx-auto my-20" aria-labelledby="routes-heading">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Popular Routes</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Most frequented intercity highway routes with fixed flat fares.</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ROUTES.map((route, index) => (
              <article
                key={index}
                onClick={() => triggerQuickBooking(route.from, route.to, parseInt(route.km))}
                className="group relative rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl hover:shadow-2xl hover:border-orange-500 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="h-44 w-full overflow-hidden relative">
                  <img src={route.image} alt={route.from} className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-orange-400 border border-slate-700">
                    📍 {route.km}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight group-hover:text-orange-400 transition">
                      {route.from.split(",")[0]} ⇄ {route.to.split(",")[0]}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">⏱️ {route.time} approx travel duration</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Starting at</span>
                      <span className="text-xl font-black text-orange-400">{route.price}</span>
                    </div>
                    <span className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-black uppercase text-white group-hover:bg-orange-500 transition shadow-md">
                      Book Now
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <ReviewsCarousel />
        <SeoTextBlock />

        <div className="fixed bottom-6 right-6 z-999 flex flex-col gap-3 md:hidden pointer-events-auto">
          <a
            href="https://wa.me/919244137353"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-600/50 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">💬</span>
          </a>

          <a
            href="tel:+919244137353"
            aria-label="Call Desk"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-2xl shadow-orange-600/50 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">📞</span>
          </a>
        </div>
      </main>

      {/* 👑 CUSTOMIZED "LOGIN TO CONTINUE" MODAL */}
      <AnimatePresence>
        {showLoginAlertModal && (
          <div className="fixed inset-0 z-999999 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-6 sm:p-8 text-center text-slate-900 shadow-2xl relative">
              <button onClick={() => setShowLoginAlertModal(false)} className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full h-8 w-8 flex items-center justify-center font-bold">✕</button>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl text-orange-600 border border-orange-100 shadow-inner">🔒</div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Login To Continue</h3>
              <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">Please sign in securely with your Google account to complete your online booking.</p>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleLoginInline}
                  disabled={loginLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-sm transition disabled:opacity-50"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  {loginLoading ? "Authenticating..." : "Continue with Google"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLoginAlertModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase py-3 rounded-2xl transition"
                >
                  Cancel
                </button>
              </div>
              <p className="text-[9px] text-slate-400 mt-5">Protected by Khatu Rides Secure Auth & Privacy Protocols.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 👑 PHONE VERIFICATION MODAL FOR FIRST TIME GOOGLE LOGIN */}
      <AnimatePresence>
        {needsPhoneModal && (
          <div className="fixed inset-0 z-999999 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl relative text-left">
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl text-center mb-5">
                <span className="text-xs font-black text-orange-600 uppercase tracking-widest block">One Last Step</span>
                <h3 className="text-sm font-black text-slate-900 mt-1">Verify Mobile Number</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Driver details & trip updates will be sent via SMS/WhatsApp.</p>
              </div>

              <form onSubmit={handleSavePhoneAndProceedInline} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Mobile Number *</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-orange-500 transition">
                    <span className="bg-slate-100 px-4 py-3.5 text-xs font-bold text-slate-600 border-r border-slate-200">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
                      required
                      className="w-full bg-transparent px-4 py-3.5 text-xs font-bold text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-orange-600/30 transition disabled:opacity-50"
                >
                  {loginLoading ? "Creating Profile..." : "Complete Signup & Continue"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ALL OFFERS MODAL */}
      <AnimatePresence>
        {showAllOffersModal && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 text-slate-900 shadow-2xl relative max-h-[85vh] overflow-y-auto">
              <button type="button" onClick={() => setShowAllOffersModal(false)} className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full h-8 w-8 flex items-center justify-center font-bold">✕</button>
              <h3 className="text-lg font-black text-slate-900 mb-1">🎁 All Running Route Offers</h3>
              <p className="text-xs text-slate-500 mb-4">Direct active discounts curated by Khatu Rides admin desk.</p>

              {activeOffers.length === 0 ? (
                <div className="text-center py-10 text-xs font-bold text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                  Presently no any offer are available.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeOffers.map((o) => {
                    const diff = Math.max(0, o.strikeFare - o.offerFare);
                    return (
                      <div key={o.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <img src={getVehicleImageByName(o.vehicleType)} alt="car" className="w-12 h-10 object-cover rounded-xl" />
                          <div>
                            <h4 className="text-xs font-black text-slate-900">{o.fromCity} ➔ {o.toCity}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs">
                              <span className="text-red-500 line-through">₹{o.strikeFare}</span>
                              <span className="text-emerald-600 font-black">₹{o.offerFare}</span>
                              {diff > 0 && <span className="text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Save ₹{diff}</span>}
                            </div>
                          </div>
                        </div>
                        <a href="tel:+919244137353" className="bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black uppercase px-3.5 py-2 rounded-xl transition shadow-sm">
                          Book
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInitialRatingModal && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-auto text-left relative p-6 sm:p-8 text-slate-100"
            >
              <button
                type="button"
                onClick={() => setShowInitialRatingModal(false)}
                className="absolute top-5 right-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full h-9 w-9 flex items-center justify-center transition font-bold"
              >
                ✕
              </button>

              <div className="text-center">
                <span className="text-xs font-serif italic text-slate-400">Thank You For Choosing</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase mt-0.5">
                  Khatu <span className="text-orange-500">Rides</span>
                </h3>
                <div className="w-24 h-0.5 bg-slate-800 mx-auto mt-1 mb-4" />

                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  — LOVE OUR SERVICE? —
                </span>
                
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-3">
                  Give 5 Star Rating <br />
                  & Get <span className="text-orange-400">Instant Discount!</span>
                </h4>

                <div className="mt-6 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left w-full sm:w-1/2">
                    <div className="text-xs font-black text-white">Khatu Rides Travels Co.</div>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mt-0.5">
                      <span>4.8</span>
                      <span>★★★★★</span>
                      <span className="text-slate-500 font-normal">(1,246)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Taxi Service • Korba, Chhattisgarh</p>
                    <a
                      href="https://g.page/r/CbD5nSIGmvz1EBM/review"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-[11px] font-black text-blue-400 hover:underline"
                    >
                      ✏️ Write a review
                    </a>
                  </div>

                  <div className="bg-linear-to-r from-orange-600 to-amber-500 text-white p-4 rounded-2xl text-center w-full sm:w-1/2 shadow-lg">
                    <span className="text-[9px] font-black uppercase tracking-wider block">INSTANT DISCOUNT</span>
                    <div className="text-2xl sm:text-3xl font-black tracking-tighter mt-0.5">₹200*</div>
                    <span className="text-[9px] font-bold block opacity-90">ON YOUR BOOKING</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-left text-xs font-bold text-slate-300 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                    <span>Give 5 Star Rating on our Google Business Profile</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                    <span>Write a Short & Best Review about your experience</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                    <span>Send Screenshot on WhatsApp to get instant discount</span>
                  </div>
                </div>

                <div className="mt-5">
                  <a
                    href="https://wa.me/919244137353?text=Hello%20Khatu%20Rides!%20I%20have%20rated%205-stars%20on%20Google.%20Here%20is%20my%20screenshot%20for%20the%20₹200%20instant%20discount:%20https://g.page/r/CbD5nSIGmvz1EBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowInitialRatingModal(false)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
                  >
                    <span className="text-lg">💬</span> SEND SCREENSHOT ON WHATSAPP
                  </a>
                </div>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => setShowInitialRatingModal(false)}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-300 underline"
                  >
                    Maybe Later
                  </button>
                  <p className="text-[9px] text-slate-500 mt-1">*T&C Apply</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPopup && popupData && (
          <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-950/85 p-0 sm:p-4 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-none sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col min-h-screen sm:min-h-0 sm:max-h-[96vh] text-left relative text-slate-100"
            >
              <div className="bg-slate-950 text-white px-3 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md border-b border-slate-800">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="bg-orange-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider shrink-0 shadow-inner">
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
                    className="bg-slate-800 hover:bg-slate-700 text-white rounded-full h-7 w-7 flex items-center justify-center transition border border-slate-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {(() => {
                const firstOpt = popupData.fareOptions[0];
                const dist = firstOpt?.billedDistance || 0;
                const mins = firstOpt?.durationMinutes || 120;
                const hoursNum = Math.floor(mins / 60);
                const minsNum = mins % 60;

                return (
                  <div className="bg-slate-950/60 px-3 sm:px-6 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300 sticky top-13.25 z-20 backdrop-blur-md">
                    <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto scrollbar-none whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-slate-200">
                        <span className="text-orange-400">📍</span> <strong>{dist} Kms</strong>
                      </span>
                      <span className="text-slate-700">|</span>
                      <span className="flex items-center gap-1.5 text-slate-200">
                        <span className="text-orange-400">⏱️</span> <strong>~{hoursNum}h {minsNum}m</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={() => fetchTollInformation(popupData.pickup, popupData.drop)}
                        disabled={tollLoading}
                        className="bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition flex items-center gap-1 shadow-sm"
                      >
                        <span>🛣️</span> {tollLoading ? "Checking..." : "View Tolls"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowMapModal(true)}
                        className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition flex items-center gap-1 shadow-sm"
                      >
                        <span>🗺️</span> View on Map
                      </button>
                    </div>
                  </div>
                );
              })()}

              {popupData.bookingType === "oneway" && popupData.isOneWayAvailable === false ? (
                <div className="p-8 text-center space-y-6 my-auto">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 text-4xl mb-2 border border-orange-500/30">
                    ⚠️
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Currently One Way Taxi Service Not Available For Your Selected Route
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    Will you want to book cab with round trip fare for a safe, luxury, and reliable taxi experience?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <button
                      type="button"
                      onClick={handleConvertToRoundTrip}
                      className="bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-orange-600/30 transition"
                    >
                      🔄 Book With Round Trip Fare
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPopup(false)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase px-6 py-4 rounded-2xl transition"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-950/40 pb-24 sm:pb-6">
                  {!showUserForm ? (
                    <div className="flex flex-col gap-3 max-w-4xl mx-auto w-full">
                      {popupData.fareOptions.map((opt) => {
                        if (!["sedan", "ertiga", "crysta"].includes(opt.vehicleType)) return null;

                        const isSelected = selectedVehicleType === opt.vehicleType;
                        const isExpanded = expandedInclusionsId === opt.id;
                        const strikePrice = Math.round(opt.finalFare * 1.15);

                        const fullVehicleTitle = opt.vehicleType === "sedan" ? "DZIRE, ETIOS" : opt.vehicleType === "ertiga" ? "ERTIGA, XYLO" : "INNOVA CRYSTA";

                        const isLocalOrShortTrip = popupData.serviceType === "local" || (popupData.bookingType === "roundtrip" && opt.billedDistance < 80);
                        
                        const packageSubText = isLocalOrShortTrip
                          ? (opt.vehicleType === "sedan" 
                              ? "1200 fixed for 8Hrs & 80Kms + 11 Per Kms + Toll (if required)" 
                              : opt.vehicleType === "ertiga" 
                              ? "1500 fixed for 8Hrs & 80Kms + 12 Per Kms + Toll (if required)" 
                              : "2200 fixed for 8Hrs & 80Kms + 14 Per Kms + Toll (if required)")
                          : `Extra @ ₹${opt.vehicleType === "sedan" ? 13 : opt.vehicleType === "ertiga" ? 17 : 20.7}/Km after limit`;

                        return (
                          <div
                            key={opt.id}
                            onClick={() => setSelectedVehicleType(opt.vehicleType)}
                            className={`rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 bg-slate-900 p-4 sm:p-6 cursor-pointer relative shadow-xl ${
                              isSelected ? "border-orange-500 ring-4 ring-orange-500/20 bg-orange-500/5" : "border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            {opt.vehicleType === "sedan" && (
                              <div className="absolute -top-2.5 left-6 bg-orange-600 text-white text-[9px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider shadow-md">
                                BEST PRICE
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-3 pt-1">
                              <div className="bg-slate-950 rounded-2xl border border-slate-800 w-28 h-20 sm:w-36 sm:h-24 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                                <img src={VEHICLES[opt.vehicleType]?.image} alt={opt.vehicleLabel} className="w-full h-full object-cover" />
                              </div>

                              <div className="flex-1 min-w-0 px-2">
                                <h4 className="text-sm sm:text-base font-black text-white tracking-tight uppercase truncate">{fullVehicleTitle}</h4>
                                <div className="mt-1.5 space-y-1 text-xs text-slate-300 font-bold">
                                  <div className="flex items-center gap-1.5 text-slate-300">
                                    <span>📍</span>
                                    <span>{isLocalOrShortTrip ? "80 Kms Package Limit" : `${opt.billedDistance} Kms Actual Distance`}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-orange-400 font-bold truncate">
                                    <span>⚡</span>
                                    <span className="truncate">{packageSubText}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Estimated Fare</div>
                                <div className="text-xs sm:text-sm font-bold text-red-400 line-through">Rs. {strikePrice.toLocaleString("en-IN")}/-</div>
                                <div className="bg-linear-to-r from-orange-600 to-amber-500 text-white text-sm sm:text-xl font-black px-4 py-1.5 rounded-2xl shadow-lg inline-block tracking-tight mt-1">
                                  Rs. {opt.finalFare.toLocaleString("en-IN")}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2">
                              <a
                                href="tel:+919244137353"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-200 font-black text-xs uppercase py-3 rounded-xl shadow-md transition text-center flex items-center justify-center gap-1"
                              >
                                📞 <span className="hidden sm:inline">CALL</span> NOW
                              </a>

                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleWhatsAppManualRedirect(opt); }}
                                className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 font-black text-xs uppercase py-3 rounded-xl shadow-md transition text-center flex items-center justify-center gap-1"
                              >
                                💬 <span className="hidden sm:inline">WHATSAPP</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!currentUser) {
                                    setShowLoginAlertModal(true);
                                    return;
                                  }
                                  setSelectedVehicleType(opt.vehicleType);
                                  setPaymentSplitMode((p) => ({ ...p, [opt.id]: "half" }));
                                  setShowUserForm(true);
                                }}
                                className="bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase py-3 rounded-xl shadow-lg shadow-orange-600/30 transition text-center"
                              >
                                🚀 BOOK
                              </button>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-medium">✓ Toll, State Tax & Driver Allowance Included</span>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setExpandedInclusionsId(isExpanded ? null : opt.id); }}
                                className="font-bold text-orange-400 hover:text-orange-300"
                              >
                                {isExpanded ? "Hide ▲" : "Inclusions ▼"}
                              </button>
                            </div>

                            {isExpanded && (
                              <div className="mt-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                                <div>✔ <strong>Package Details:</strong> {packageSubText}</div>
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
                    <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left w-full my-auto text-slate-100">
                      <div className="text-center mb-6">
                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">Secure Booking Form</span>
                        <h4 className="text-xl font-black text-white mt-3">Enter Details to Complete Booking</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-black text-slate-300 uppercase tracking-wider">Customer Full Name</label>
                          <input
                            type="text"
                            placeholder="Type customer name..."
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full border border-slate-800 rounded-2xl px-4 py-3.5 bg-slate-950 text-sm font-bold text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-black text-slate-300 uppercase tracking-wider">Mobile Number (For Driver SMS)</label>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="Enter 10-digit phone number..."
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))}
                            className="w-full border border-slate-800 rounded-2xl px-4 py-3.5 bg-slate-950 text-sm font-bold text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
                          />
                        </div>

                        {selectedOption && (
                          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Split Booking Matrix</span>
                            <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1">
                              <button
                                type="button"
                                onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "half" }))}
                                className={`rounded-lg py-2 text-center text-xs font-black uppercase tracking-wide transition ${currentSelectedMode === "half" ? "bg-orange-600 text-white shadow-md" : "text-slate-400"}`}
                              >
                                50% Advance
                              </button>
                              <button
                                type="button"
                                onClick={() => setPaymentSplitMode((p) => ({ ...p, [selectedOption.id]: "full" }))}
                                className={`rounded-lg py-2 text-center text-xs font-black uppercase tracking-wide transition ${currentSelectedMode === "full" ? "bg-slate-800 text-white shadow-md" : "text-slate-400"}`}
                              >
                                Full Pay
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                              <div>
                                <span className="text-[10px] font-black text-slate-400 block uppercase">Payable Now</span>
                                <span className="text-2xl font-black text-white">₹{displayPayNowNumber.toLocaleString("en-IN")}</span>
                              </div>
                              <span className="text-xs font-bold text-orange-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">{selectedOption.vehicleLabel}</span>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-3">
                          <button
                            type="button"
                            onClick={() => setShowUserForm(false)}
                            className="w-full border border-slate-800 bg-slate-950 text-slate-300 font-bold text-xs uppercase py-4 rounded-2xl transition hover:bg-slate-800"
                          >
                            ↩ Back
                          </button>
                          <button
                            type="button"
                            onClick={() => selectedOption && handleOnlinePaymentCheckout(selectedOption)}
                            disabled={paymentLoadingId !== null}
                            className="w-full bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition shadow-xl shadow-orange-600/30 disabled:opacity-50"
                          >
                            {paymentLoadingId ? "Syncing..." : "Proceed to Pay"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTollModal && tollData && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 text-slate-100 shadow-2xl relative">
              <button onClick={() => setShowTollModal(false)} className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full h-8 w-8 flex items-center justify-center">✕</button>
              <h3 className="text-lg font-black text-white mb-1">🛣️ Route Toll Breakdown</h3>
              <p className="text-xs text-slate-400 mb-4">{popupData?.pickup.split(",")[0]} to {popupData?.drop.split(",")[0]}</p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 mb-5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Estimated Toll Plazas:</span>
                  <span className="text-orange-400">{tollData.totalTolls} Plazas</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-300 pt-2 border-t border-slate-800">
                  <span>Total Toll Expense:</span>
                  <span className="text-emerald-400 font-black">₹{tollData.totalAmount}</span>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {tollData.plazas.map((plaza, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                    <span className="text-slate-300 font-bold">{plaza.name}</span>
                    <span className="text-orange-400 font-black">₹{plaza.amount}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowTollModal(false)} className="w-full mt-5 bg-linear-to-r from-orange-600 to-amber-500 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg">
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMapModal && popupData && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 text-slate-100 shadow-2xl relative">
              <button onClick={() => setShowMapModal(false)} className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full h-8 w-8 flex items-center justify-center">✕</button>
              <h3 className="text-lg font-black text-white mb-1">🗺️ Live Route Map Preview</h3>
              <p className="text-xs text-slate-400 mb-4">{popupData.pickup} ➔ {popupData.drop}</p>

              <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(popupData.pickup)}&destination=${encodeURIComponent(popupData.drop)}`}
                ></iframe>
              </div>

              <button onClick={() => setShowMapModal(false)} className="w-full mt-5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl">
                Back to Fare Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successReceipt && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100">
              <div className="bg-emerald-950/60 px-6 py-6 text-center border-b border-emerald-900/50">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-2xl text-emerald-400 border border-emerald-500/30">✓</div>
                <h3 className="text-xl font-black text-white">Allocation Confirmed</h3>
                <p className="text-xs text-slate-400 mt-1">Your route details have been securely recorded in Firebase (`bookings` collection).</p>
              </div>
              <div className="p-6 space-y-4 text-left">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs space-y-2.5 text-slate-300">
                  <div className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2">Invoice Summary</div>
                  <div className="flex justify-between"><span className="font-bold text-slate-400">Invoice ID:</span> <span className="text-white font-mono">{successReceipt.invoiceId}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-400">Vehicle:</span> <span className="text-white">{successReceipt.vehicle}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-400">Pickup:</span> <span className="truncate max-w-45 text-white">{successReceipt.pickup}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-400">Drop Point:</span> <span className="truncate max-w-45 text-white">{successReceipt.drop}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-slate-400">Timeline:</span> <span className="text-white">{successReceipt.date} at {successReceipt.time}</span></div>
                  <div className="flex justify-between pt-3 border-t border-slate-800 font-black text-white text-sm">
                    <span>Amount Paid ({successReceipt.paymentMode}):</span> <span className="text-orange-400">₹{successReceipt.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <button type="button" onClick={() => setSuccessReceipt(null)} className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase tracking-wider text-white rounded-2xl shadow-lg transition">
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
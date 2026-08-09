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
import SlidingTicker from "@/components/SlidingTicker";

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
  { from: "Raipur, Chhattisgarh", to: "Korba, Chhattisgarh", price: "₹3299", time: "~4h 30m", km: "250 KM", image: "/images/raipur-korba.png", },
  { from: "Korba, Chhattisgarh", to: "Bilaspur, Chhattisgarh", price: "₹1899", time: "~2h 30m", km: "130 KM", image: "/images/korba-bilaspur.png", },
  { from: "Bilaspur, Chhattisgarh", to: "Raipur, Chhattisgarh", price: "₹3299", time: "~4h 30m", km: "250 KM", image: "/images/korba-bilaspur.png", },
  { from: "Raipur, Chhattisgarh", to: "Bhopal, Madhya Pradesh", price: "₹9999", time: "~7h 00m", km: "450 KM", image: "/banner6.png" },
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

  const [activeOffers, setActiveOffers] = useState<SpecialOffer[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [showAllOffersModal, setShowAllOffersModal] = useState(false);

  const [showInitialRatingModal, setShowInitialRatingModal] = useState(false);
  const calculatorSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecking(false);
      if (user) {
        router.replace("/customer/home");
      }
    });

    const timer = setTimeout(() => {
      setShowInitialRatingModal(true);
    }, 1200);

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
      <div className="min-h-screen bg-white flex items-center justify-center text-orange-600 font-bold text-xs uppercase tracking-widest animate-pulse">
        Loading Khatu Rides...
      </div>
    );
  }

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 md:pb-0 font-sans selection:bg-orange-500 selection:text-white relative overflow-hidden">
        
       {/* 👑 PREMIUM RESPONSIVE TOP NAVBAR */}
<header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_2px_15px_rgba(15,23,42,0.06)] select-none">

  <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">

    {/* ================= MAIN NAVBAR ================= */}
    <div className="flex h-[68px] items-center justify-between gap-2 sm:h-[76px]">

      {/* LEFT — BRAND */}
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

        {/* CALL BUTTON */}
        <a
          href="tel:+919244137353"
          aria-label="Call Khatu Rides"
          className="
            group flex h-10 w-10 shrink-0 items-center justify-center
            rounded-full border border-orange-200
            bg-orange-50 text-orange-600
            shadow-sm transition-all duration-200
            hover:-translate-y-0.5 hover:bg-orange-100 hover:shadow-md
            active:scale-95
            sm:h-11 sm:w-11
          "
        >
          <span className="text-lg transition-transform duration-200 group-hover:scale-110">
            📞
          </span>
        </a>

        {/* BRAND */}
        <div className="min-w-0 leading-none">

          <div className="flex items-baseline whitespace-nowrap">
            <span className="text-[19px] font-black tracking-tight text-slate-950 sm:text-2xl">
              Khatu
            </span>

            <span className="text-[19px] font-black tracking-tight text-orange-600 sm:text-2xl">
              Rides
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[7px] font-black uppercase tracking-[0.25em] text-slate-500 sm:text-[9px]">
              Travels Co.
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-orange-500 sm:block" />

            <span className="hidden text-[8px] font-bold text-slate-400 sm:block">
              24×7
            </span>
          </div>

        </div>

      </div>


      {/* CENTER — SERVICE BADGE */}
      <div className="hidden md:flex items-center justify-center">

        <div className="
          flex items-center gap-2
          rounded-full border border-slate-200
          bg-slate-50 px-4 py-2
          shadow-sm
        ">

          <span className="
            flex h-7 w-7 items-center justify-center
            rounded-full bg-orange-100 text-sm
          ">
            🚕
          </span>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Premium Cab Service
            </span>

            <span className="text-xs font-black text-slate-900">
              One Way Taxi Service
            </span>
          </div>

        </div>

      </div>


      {/* RIGHT — RATING + LOGIN */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* GOOGLE RATING */}
        <a
          href="https://g.page/r/CbD5nSIGmvz1EBM/review"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Google Reviews"
          className="
            group flex items-center gap-1.5
            rounded-full border border-amber-200
            bg-amber-50 px-2.5 py-1.5
            transition-all duration-200
            hover:border-amber-300 hover:bg-amber-100
            hover:shadow-sm
            sm:px-3
          "
        >

          <span className="text-sm sm:text-base">
            ⭐
          </span>

          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-black text-slate-900 sm:text-xs">
              4.6
            </span>

            <span className="hidden text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:block">
              Google
            </span>
          </div>

        </a>


        {/* LOGIN / DASHBOARD */}
        {currentUser ? (

          <button
            onClick={() => router.push("/customer/home")}
            className="
              flex items-center gap-2
              rounded-full bg-emerald-600
              px-3.5 py-2.5
              text-[10px] font-black uppercase tracking-wider
              text-white shadow-md
              transition-all duration-200
              hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg
              active:scale-95
              sm:px-5 sm:text-xs
            "
          >
            <span className="text-sm">👤</span>
            <span>Dashboard</span>
          </button>

        ) : (

          <button
            onClick={() => router.push("/login")}
            className="
              flex items-center gap-1.5
              rounded-full
              bg-orange-600
              px-3.5 py-2.5
              text-[10px] font-black uppercase tracking-wider
              text-white shadow-md
              transition-all duration-200
              hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-lg
              active:scale-95
              sm:gap-2 sm:px-5 sm:text-xs
            "
          >
            <span className="text-sm">👤</span>

            <span className="hidden xs:inline sm:inline">
              Login
            </span>

            <span className="hidden sm:inline">
              / Signup
            </span>
          </button>

        )}

      </div>

    </div>
    <SlidingTicker></SlidingTicker>




    

  </div>
</header>



        

      {/* 👑 PREMIUM TRUST & SAFETY STRIP */}
<section className="mx-auto max-w-7xl px-3 py-4 sm:px-5 lg:px-8">

  <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-3">

    {/* VERIFIED DRIVERS */}
    <div className="
      group flex items-center gap-3.5
      border-b border-slate-100
      px-4 py-4
      transition-all duration-200
      hover:bg-slate-50
      sm:border-b-0 sm:border-r
      sm:px-5
    ">

      <div className="
        flex h-11 w-11 shrink-0 items-center justify-center
        rounded-xl
        bg-emerald-50
        text-xl
        ring-1 ring-emerald-100
        transition-transform duration-200
        group-hover:scale-105
      ">
        👨‍✈️
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black text-slate-950 sm:text-sm">
          Verified Drivers
        </p>

        <p className="mt-0.5 text-[10px] font-medium text-slate-500">
          Police Verified • Experienced
        </p>
      </div>

      <span className="ml-auto text-emerald-500">
        ✓
      </span>

    </div>


    {/* TRUSTED SERVICE */}
    <div className="
      group flex items-center gap-3.5
      border-b border-slate-100
      px-4 py-4
      transition-all duration-200
      hover:bg-slate-50
      sm:border-b-0 sm:border-r
      sm:px-5
    ">

      <div className="
        flex h-11 w-11 shrink-0 items-center justify-center
        rounded-xl
        bg-orange-50
        text-xl
        ring-1 ring-orange-100
        transition-transform duration-200
        group-hover:scale-105
      ">
        🛡️
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black text-slate-950 sm:text-sm">
          10,000+ Trips
        </p>

        <p className="mt-0.5 text-[10px] font-medium text-slate-500">
          Trusted Intercity Service
        </p>
      </div>

      <span className="ml-auto text-orange-500">
        ✓
      </span>

    </div>


    {/* 24x7 SUPPORT */}
    <div className="
      group flex items-center gap-3.5
      px-4 py-4
      transition-all duration-200
      hover:bg-slate-50
      sm:px-5
    ">

      <div className="
        flex h-11 w-11 shrink-0 items-center justify-center
        rounded-xl
        bg-blue-50
        text-xl
        ring-1 ring-blue-100
        transition-transform duration-200
        group-hover:scale-105
      ">
        🎧
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black text-slate-950 sm:text-sm">
          24×7 Support
        </p>

        <p className="mt-0.5 text-[10px] font-medium text-slate-500">
          Always Available
        </p>
      </div>

      <span className="ml-auto text-blue-500">
        ✓
      </span>

    </div>

  </div>

</section>

{/* 👑 HIGH-CONVERSION HERO + FARE CALCULATOR */}

<section className="w-full bg-white">

  {/* =========================================================
      🚕 HERO BOOKING CONVERSION AREA
  ========================================================= */}
  <div className="relative overflow-hidden">

    {/* PREMIUM BACKGROUND */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50" />

    {/* SOFT GLOW EFFECTS */}
    <div className="
      pointer-events-none
      absolute
      -right-24
      -top-24
      h-72
      w-72
      rounded-full
      bg-orange-300/20
      blur-3xl
    " />

    <div className="
      pointer-events-none
      absolute
      -bottom-32
      -left-24
      h-72
      w-72
      rounded-full
      bg-amber-300/20
      blur-3xl
    " />


    <div className="
      relative
      mx-auto
      flex
      max-w-7xl
      flex-col
      px-4
      pb-7
      pt-6
      sm:px-6
      sm:pb-10
      sm:pt-10
      lg:px-8
    ">

      {/* =====================================================
          TOP BADGE
      ===================================================== */}
      <div className="mx-auto text-center">

        <div className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-orange-200
          bg-white/90
          px-3.5
          py-1.5
          shadow-sm
        ">

          <span className="
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-orange-100
            text-[10px]
          ">
            ⚡
          </span>

          <span className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.16em]
            text-orange-700
          ">
            One Way Taxi • No Return Fare
          </span>

        </div>

      </div>


      {/* =====================================================
          HERO CONTENT
      ===================================================== */}
      <div className="
        mx-auto
        mt-4
        w-full
        max-w-4xl
        text-center
        sm:mt-5
      ">

        <h1 className="
          text-[30px]
          font-black
          leading-[1.08]
          tracking-[-0.04em]
          text-slate-950
          sm:text-5xl
          lg:text-6xl
        ">

          Book Your Cab
          <br />

          <span className="
            bg-gradient-to-r
            from-orange-600
            via-orange-500
            to-amber-500
            bg-clip-text
            text-transparent
          ">
            In Just 30 Seconds
          </span>

        </h1>


        <p className="
          mx-auto
          mt-3
          max-w-xl
          text-[11px]
          font-semibold
          leading-relaxed
          text-slate-500
          sm:text-sm
        ">
          Transparent fare. Verified drivers. Clean cars.
          <br className="hidden sm:block" />
          Book your ride directly with Khatu Rides.
        </p>


        {/* =====================================================
            DIRECT CALL CTA
        ===================================================== */}
        <div className="
          mx-auto
          mt-5
          w-full
          max-w-xl
        ">

          <a
            href="tel:+919244137353"
            className="
              relative
              flex
              min-h-[68px]
              w-full
              items-center
              justify-between
              overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-slate-950
              via-slate-900
              to-slate-950
              px-4
              shadow-[0_12px_35px_rgba(15,23,42,0.22)]
              ring-1
              ring-slate-800
            "
          >

            {/* ORANGE GLOW */}
            <div className="
              pointer-events-none
              absolute
              -right-8
              top-1/2
              h-24
              w-24
              -translate-y-1/2
              rounded-full
              bg-orange-600/25
              blur-2xl
            " />


            {/* PHONE ICON */}
            <div className="
              relative
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-orange-500
              to-orange-700
              text-xl
              shadow-lg
              shadow-orange-600/30
            ">
              📞
            </div>


            {/* PHONE DETAILS */}
            <div className="
              relative
              min-w-0
              flex-1
              px-3
              text-left
            ">

              <p className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.16em]
                text-orange-400
              ">
                Instant Booking
              </p>

              <p className="
                mt-0.5
                text-base
                font-black
                tracking-tight
                text-white
                sm:text-lg
              ">
                92441 37353
              </p>

            </div>


            {/* CALL BUTTON */}
            <div className="
              relative
              flex
              min-h-[42px]
              shrink-0
              items-center
              justify-center
              gap-1.5
              rounded-xl
              bg-orange-600
              px-3
              text-[9px]
              font-black
              uppercase
              tracking-wider
              text-white
              shadow-lg
              shadow-orange-600/30
              sm:px-5
            ">
              Call Now
              <span>→</span>
            </div>

          </a>


          {/* CALL TRUST LINE */}
          <div className="
            mt-2.5
            flex
            items-center
            justify-center
            gap-2
            text-[8px]
            font-bold
            text-slate-400
          ">
            <span className="text-emerald-600">●</span>
            Available 24×7
            <span className="text-slate-300">•</span>
            Instant Response
            <span className="text-slate-300">•</span>
            Direct Booking
          </div>

        </div>


        {/* =====================================================
            ONLINE BOOKING CTA
        ===================================================== */}
        <button
          type="button"
          onClick={() => {
            calculatorSectionRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="
            mx-auto
            mt-4
            flex
            min-h-[52px]
            w-full
            max-w-xl
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-orange-200
            bg-gradient-to-r
            from-orange-600
            to-amber-500
            px-5
            text-[10px]
            font-black
            uppercase
            tracking-[0.13em]
            text-white
            shadow-[0_10px_25px_rgba(234,88,12,0.22)]
          "
        >

          <span className="text-base">
            🚕
          </span>

          <span>
            Check Fare & Book Online
          </span>

          <span className="ml-1">
            →
          </span>

        </button>


        {/* =====================================================
            MINI TRUST STRIP
        ===================================================== */}
        <div className="
          mx-auto
          mt-5
          grid
          max-w-2xl
          grid-cols-3
          gap-2
        ">

          <div className="
            rounded-xl
            border
            border-slate-200
            bg-white/80
            px-2
            py-2.5
          ">
            <p className="text-xs">🛡️</p>
            <p className="
              mt-1
              text-[8px]
              font-black
              uppercase
              tracking-wider
              text-slate-700
            ">
              Verified
            </p>
          </div>


          <div className="
            rounded-xl
            border
            border-slate-200
            bg-white/80
            px-2
            py-2.5
          ">
            <p className="text-xs">💰</p>
            <p className="
              mt-1
              text-[8px]
              font-black
              uppercase
              tracking-wider
              text-slate-700
            ">
              Fair Price
            </p>
          </div>


          <div className="
            rounded-xl
            border
            border-slate-200
            bg-white/80
            px-2
            py-2.5
          ">
            <p className="text-xs">🎧</p>
            <p className="
              mt-1
              text-[8px]
              font-black
              uppercase
              tracking-wider
              text-slate-700
            ">
              24×7 Support
            </p>
          </div>

        </div>

      </div>

    </div>

  </div>


  {/* =========================================================
      🚕 FARE CALCULATOR
  ========================================================= */}
  <div
    ref={calculatorSectionRef}
    className="
      scroll-mt-[65px]
      w-full
      bg-slate-950
      px-2
      py-5
      sm:px-5
      sm:py-8
    "
  >

    <div className="
      mx-auto
      w-full
      max-w-7xl
    ">


      {/* =====================================================
          CALCULATOR HEADER
      ===================================================== */}
      <div className="
        mb-4
        flex
        items-center
        justify-between
        gap-3
        px-1
        sm:px-0
      ">

        <div>

          <div className="
            flex
            items-center
            gap-2
          ">

            <span className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.18em]
              text-orange-400
            ">
              Khatu Rides
            </span>

            <span className="
              h-1
              w-1
              rounded-full
              bg-orange-500
            " />

            <span className="
              text-[8px]
              font-bold
              uppercase
              tracking-wider
              text-slate-500
            ">
              Instant Booking
            </span>

          </div>


          <h2 className="
            mt-1
            text-lg
            font-black
            tracking-tight
            text-white
            sm:text-2xl
          ">
            Check Your Best Fare
          </h2>

        </div>


        {/* 24x7 */}
        <div className="
          flex
          shrink-0
          items-center
          gap-1.5
          rounded-full
          border
          border-emerald-500/20
          bg-emerald-500/10
          px-2.5
          py-1.5
          text-[8px]
          font-black
          uppercase
          tracking-wider
          text-emerald-400
        ">

          <span className="
            h-1.5
            w-1.5
            rounded-full
            bg-emerald-400
          " />

          24×7

        </div>

      </div>


      {/* =====================================================
          CALCULATOR CARD
      ===================================================== */}
      <div className="
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        sm:rounded-[30px]
      ">

        <FareCalculator
          onFareCalculated={(data) => {

            let oneWayAvail = true;
            let baseSingleRouteDist = 150;

            const updatedData = {
              ...data,

              fareOptions: data.fareOptions.map((opt) => {

                const rawDist = opt.billedDistance;

                const baseSingleDist =
                  data.bookingType === "roundtrip"
                    ? Math.round(rawDist / 2)
                    : rawDist;

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
              baseDistance: baseSingleRouteDist,
            };


            setPopupData(updatedData);
            setSelectedVehicleType("sedan");
            setShowPopup(true);
            setShowUserForm(false);
            setPaymentSplitMode({});

          }}
        />

      </div>


      {/* =====================================================
          CALCULATOR BOTTOM TRUST
      ===================================================== */}
      <div className="
        mt-3
        flex
        flex-wrap
        items-center
        justify-center
        gap-x-4
        gap-y-1
        text-center
      ">

        <span className="
          text-[8px]
          font-bold
          text-slate-500
        ">
          ✓ No Hidden Charges
        </span>

        <span className="
          text-[8px]
          font-bold
          text-slate-500
        ">
          ✓ Verified Drivers
        </span>

        <span className="
          text-[8px]
          font-bold
          text-slate-500
        ">
          ✓ Instant Confirmation
        </span>

      </div>

    </div>

  </div>

</section>

       {/* 👑 PREMIUM FLEET SECTION */}
<section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

  {/* SECTION HEADER */}
  <div className="mb-7 sm:mb-8">

    <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5">
      <span className="text-xs">🚕</span>
      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-600">
        Our Fleet
      </span>
    </div>

    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
      Our Premium Garage
    </h2>

    <p className="mt-1.5 max-w-xl text-xs font-medium leading-relaxed text-slate-500 sm:text-sm">
      Comfortable, clean and well-maintained vehicles for every journey.
    </p>

  </div>


  {/* FLEET GRID */}
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

    {[
      {
        title: "Maruti Suzuki Dzire",
        type: "Sedan • 4+1 Seater",
        img: "/dezire.png",
        rate: "₹11/KM",
        tag: "Popular",
      },
      {
        title: "Maruti Suzuki Ertiga",
        type: "MUV • 6+1 Seater",
        img: "/ertiga.png",
        rate: "₹13/KM",
        tag: "Family Choice",
      },
      {
        title: "Toyota Innova Crysta",
        type: "Luxury SUV • 6+1 Seater",
        img: "/crysta.png",
        rate: "₹20/KM",
        tag: "Premium",
      },
    ].map((car, idx) => (

      <div
        key={idx}
        className="
          relative overflow-hidden
          rounded-[28px]
          border border-slate-200
          bg-white
          shadow-[0_6px_24px_rgba(15,23,42,0.06)]
        "
      >

        {/* VEHICLE IMAGE */}
        <div className="
          relative
          h-56
          overflow-hidden
          bg-gradient-to-b
          from-slate-50
          via-white
          to-slate-100
          sm:h-52
          lg:h-56
        ">

          {/* IMAGE TAG */}
          <div className="
            absolute left-4 top-4 z-10
            rounded-full
            border border-slate-200
            bg-white
            px-3 py-1.5
            text-[9px]
            font-black
            uppercase
            tracking-wider
            text-slate-700
            shadow-sm
          ">
            {car.tag}
          </div>


          {/* SOFT BACKGROUND CIRCLE */}
          <div className="
            absolute
            left-1/2
            top-1/2
            h-44
            w-44
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-orange-100/60
            blur-3xl
          " />


          {/* FULL VEHICLE IMAGE */}
          <img
            src={car.img}
            alt={car.title}
            className="
              absolute
              bottom-0
              left-1/2
              w-[112%]
              max-w-none
              -translate-x-1/2
              object-contain
              drop-shadow-[0_16px_16px_rgba(15,23,42,0.16)]
            "
          />


          {/* IMAGE BOTTOM BLEND */}
          <div className="
            pointer-events-none
            absolute inset-x-0 bottom-0
            h-12
            bg-gradient-to-t
            from-white
            to-transparent
          " />

        </div>


        {/* CARD DETAILS */}
        <div className="px-5 pb-5 pt-4">

          {/* VEHICLE NAME */}
          <h3 className="
            text-base
            font-black
            tracking-tight
            text-slate-950
          ">
            {car.title}
          </h3>


          {/* VEHICLE TYPE */}
          <p className="
            mt-1
            text-[10px]
            font-bold
            uppercase
            tracking-wider
            text-orange-600
          ">
            {car.type}
          </p>


          {/* DIVIDER */}
          <div className="my-4 h-px bg-slate-100" />


          {/* BOTTOM INFORMATION */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2.5">

              <div className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                bg-slate-50
                text-base
              ">
                🚕
              </div>

              <div className="leading-none">

                <p className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                ">
                  Starting Rate
                </p>

                <p className="
                  mt-1
                  text-[10px]
                  font-bold
                  text-slate-600
                ">
                  Per Kilometer
                </p>

              </div>

            </div>


            {/* PRICE */}
            <div className="text-right">

              <p className="
                text-xl
                font-black
                tracking-tight
                text-slate-950
              ">
                {car.rate}
              </p>

            </div>

          </div>

        </div>


        {/* STATIC BRAND ACCENT */}
        <div className="
          absolute
          bottom-0
          left-0
          h-1
          w-full
          bg-gradient-to-r
          from-orange-600
          to-amber-400
        " />

      </div>

    ))}

  </div>

</section>

    {/* 👑 SERVICES CATALOGUE SECTION */}
<section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

  {/* ================= SECTION HEADER ================= */}
  <div className="mb-7 sm:mb-9">

    <div className="
      inline-flex items-center gap-2
      rounded-full
      border border-orange-200
      bg-orange-50
      px-3 py-1.5
    ">
      <span className="text-xs">✦</span>

      <span className="
        text-[9px]
        font-black
        uppercase
        tracking-[0.18em]
        text-orange-600
      ">
        What We Offer
      </span>
    </div>


    <h2 className="
      mt-2
      text-2xl
      font-black
      tracking-tight
      text-slate-950
      sm:text-3xl
    ">
      Our Services
    </h2>

    <p className="
      mt-1.5
      max-w-2xl
      text-xs
      font-medium
      leading-relaxed
      text-slate-500
      sm:text-sm
    ">
      Choose the ride that fits your journey.
    </p>

  </div>


  {/* ================= SERVICES GRID ================= */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

    {[
      {
        icon: "🚀",
        title: "One Way Taxi",
        short: "One-side travel",
        desc: "Pay for your journey in one direction.",
        badge: "Best Value",
        bg: "bg-orange-50",
        iconBg: "bg-orange-100",
        border: "border-orange-200",
        text: "text-orange-600",
      },

      {
        icon: "🔄",
        title: "Round Trip",
        short: "Complete journey",
        desc: "Keep the same cab and driver for your trip.",
        badge: "Popular",
        bg: "bg-blue-50",
        iconBg: "bg-blue-100",
        border: "border-blue-200",
        text: "text-blue-600",
      },

      {
        icon: "🏙️",
        title: "Local Rental",
        short: "City travel",
        desc: "Flexible packages for meetings and city travel.",
        badge: "Flexible",
        bg: "bg-emerald-50",
        iconBg: "bg-emerald-100",
        border: "border-emerald-200",
        text: "text-emerald-600",
      },

      {
        icon: "✈️",
        title: "Airport Taxi",
        short: "Pickup & drop",
        desc: "Reliable airport transfers with timely pickup.",
        badge: "24×7",
        bg: "bg-violet-50",
        iconBg: "bg-violet-100",
        border: "border-violet-200",
        text: "text-violet-600",
      },
    ].map((srv, idx) => (

      <div
        key={idx}
        className={`
          group
          relative
          overflow-hidden
          rounded-[26px]
          border
          ${srv.border}
          ${srv.bg}
          p-5
          shadow-[0_5px_20px_rgba(15,23,42,0.04)]
        `}
      >

        {/* TOP ROW */}
        <div className="flex items-start justify-between">

          {/* ICON */}
          <div className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            ${srv.iconBg}
            text-2xl
            shadow-sm
          `}>
            {srv.icon}
          </div>


          {/* BADGE */}
          <span className="
            rounded-full
            border border-white/80
            bg-white/80
            px-2.5
            py-1
            text-[8px]
            font-black
            uppercase
            tracking-wider
            text-slate-600
            shadow-sm
          ">
            {srv.badge}
          </span>

        </div>


        {/* SERVICE CONTENT */}
        <div className="mt-5">

          <h3 className="
            text-[15px]
            font-black
            tracking-tight
            text-slate-950
          ">
            {srv.title}
          </h3>


          <p className={`
            mt-1
            text-[9px]
            font-black
            uppercase
            tracking-wider
            ${srv.text}
          `}>
            {srv.short}
          </p>


          <p className="
            mt-2
            min-h-[38px]
            text-[11px]
            font-medium
            leading-relaxed
            text-slate-600
          ">
            {srv.desc}
          </p>

        </div>


        {/* BOTTOM ACTION */}
        <div className="
          mt-5
          flex
          items-center
          justify-between
          border-t
          border-white/80
          pt-3.5
        ">

          <span className="
            text-[9px]
            font-bold
            uppercase
            tracking-wider
            text-slate-400
          ">
            Khatu Rides
          </span>

          <span className={`
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white
            ${srv.text}
            text-sm
            shadow-sm
          `}>
            →
          </span>

        </div>


        {/* STATIC BOTTOM ACCENT */}
        <div className={`
          absolute
          bottom-0
          left-0
          h-1
          w-full
          ${srv.text.replace("text-", "bg-")}
        `} />

      </div>

    ))}

  </div>


  {/* ================= BOTTOM CTA ================= */}
  <div className="
    mt-6
    flex
    flex-col
    items-center
    justify-between
    gap-3
    rounded-2xl
    border
    border-slate-200
    bg-white
    px-4
    py-4
    shadow-sm
    sm:flex-row
    sm:px-5
  ">

    <div className="flex items-center gap-3">

      <div className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-orange-50
        text-base
      ">
        🚕
      </div>

      <div>

        <p className="
          text-xs
          font-black
          text-slate-900
        ">
          Ready to plan your ride?
        </p>

        <p className="
          mt-0.5
          text-[9px]
          font-medium
          text-slate-500
        ">
          Check your fare and book instantly.
        </p>

      </div>

    </div>


    <button
      type="button"
      onClick={() => {
        calculatorSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
      className="
        flex
        min-h-[42px]
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-orange-600
        px-5
        text-[9px]
        font-black
        uppercase
        tracking-wider
        text-white
        shadow-md
        sm:w-auto
      "
    >
      Check Fare & Book
      <span>→</span>
    </button>

  </div>

</section>

        {/* 👑 WHAT OUR CUSTOMERS SAYING */}
        <ReviewsCarousel />

       {/* 👑 HIGH-CONVERSION POPULAR ROUTES SECTION */}
<section className="relative overflow-hidden bg-slate-50 py-12 sm:py-16">

  {/* TOP BRAND ACCENT */}
  <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600" />

  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* ================= HEADER ================= */}
    <div className="mb-7 sm:mb-9">

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>

          {/* LABEL */}
          <div className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-orange-200
            bg-orange-50
            px-3
            py-1.5
          ">
            <span className="text-xs">🛣️</span>

            <span className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.18em]
              text-orange-600
            ">
              Top Corridors
            </span>
          </div>


          {/* TITLE */}
          <h2 className="
            mt-3
            text-2xl
            font-black
            tracking-tight
            text-slate-950
            sm:text-3xl
            lg:text-4xl
          ">
            Popular Routes
          </h2>


          {/* SUBTITLE */}
          <p className="
            mt-2
            max-w-2xl
            text-xs
            font-medium
            leading-relaxed
            text-slate-500
            sm:text-sm
          ">
            Book our most travelled routes with transparent fares and
            reliable intercity service.
          </p>

        </div>


        {/* RIGHT TRUST BADGE */}
        <div className="
          flex
          w-fit
          items-center
          gap-2.5
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-4
          py-3
          shadow-sm
        ">

          <div className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-orange-50
            text-base
          ">
            🚕
          </div>

          <div>

            <p className="
              text-[9px]
              font-black
              uppercase
              tracking-wider
              text-slate-400
            ">
              Quick Booking
            </p>

            <p className="
              mt-0.5
              text-xs
              font-black
              text-slate-900
            ">
              Choose a route & book
            </p>

          </div>

        </div>

      </div>

    </div>


    {/* ================= ROUTES GRID ================= */}
    <div className="
      grid
      grid-cols-1
      gap-5
      sm:grid-cols-2
      lg:grid-cols-4
    ">

      {ROUTES.map((route, index) => (

        <article
          key={index}
          onClick={() =>
            triggerQuickBooking(
              route.from,
              route.to,
              parseInt(route.km)
            )
          }
          className="
            group
            relative
            cursor-pointer
            overflow-hidden
            rounded-[26px]
            border
            border-slate-200
            bg-white
            shadow-[0_6px_24px_rgba(15,23,42,0.06)]
          "
        >

          {/* ================= ROUTE IMAGE ================= */}
          <div className="
            relative
            h-48
            w-full
            overflow-hidden
            bg-slate-100
            sm:h-44
            lg:h-48
          ">

            <img
              src={route.image}
              alt={`${route.from} to ${route.to} taxi`}
              className="
                h-full
                w-full
                object-cover
              "
            />


            {/* IMAGE OVERLAY */}
            <div className="
              absolute
              inset-0
              bg-gradient-to-t
              from-slate-950/80
              via-slate-950/10
              to-transparent
            " />


            {/* ROUTE NUMBER */}
            <div className="
              absolute
              left-4
              top-4
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-xl
              border
              border-white/30
              bg-slate-950/70
              text-[10px]
              font-black
              text-white
              backdrop-blur-md
            ">
              {String(index + 1).padStart(2, "0")}
            </div>


            {/* DISTANCE */}
            <div className="
              absolute
              bottom-4
              left-4
              flex
              items-center
              gap-1.5
              rounded-xl
              border
              border-white/20
              bg-white/95
              px-3
              py-1.5
              text-[9px]
              font-black
              text-slate-900
              shadow-lg
              backdrop-blur
            ">
              📍 {route.km}
            </div>


            {/* POPULAR BADGE */}
            {index === 0 && (
              <div className="
                absolute
                right-4
                top-4
                rounded-full
                bg-orange-600
                px-3
                py-1.5
                text-[8px]
                font-black
                uppercase
                tracking-wider
                text-white
                shadow-lg
              ">
                🔥 Popular
              </div>
            )}

          </div>


          {/* ================= ROUTE CONTENT ================= */}
          <div className="p-5">

            {/* ROUTE NAME */}
            <div>

              <p className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.15em]
                text-orange-600
              ">
                One Way Taxi
              </p>

              <h3 className="
                mt-1.5
                text-[17px]
                font-black
                tracking-tight
                text-slate-950
              ">
                {route.from.split(",")[0]}
                <span className="mx-1.5 text-orange-500">
                  →
                </span>
                {route.to.split(",")[0]}
              </h3>

            </div>


            {/* ROUTE META */}
            <div className="
              mt-3
              flex
              items-center
              gap-2
              text-[10px]
              font-bold
              text-slate-500
            ">

              <span className="
                rounded-lg
                bg-slate-50
                px-2.5
                py-1.5
              ">
                📍 {route.km}
              </span>

              <span className="
                rounded-lg
                bg-slate-50
                px-2.5
                py-1.5
              ">
                ⏱️ {route.time}
              </span>

            </div>


            {/* ================= PRICE BOX ================= */}
            <div className="
              mt-4
              rounded-2xl
              border
              border-orange-100
              bg-orange-50/70
              p-3.5
            ">

              <div className="
                flex
                items-end
                justify-between
                gap-3
              ">

                <div>

                  <p className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-400
                  ">
                    Starting Fare
                  </p>

                  <p className="
                    mt-0.5
                    text-2xl
                    font-black
                    tracking-tight
                    text-slate-950
                  ">
                    {route.price}
                  </p>

                </div>


                <span className="
                  pb-1
                  text-[8px]
                  font-bold
                  text-slate-400
                ">
                  One Way
                </span>

              </div>

            </div>


            {/* ================= BOOK CTA ================= */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();

                triggerQuickBooking(
                  route.from,
                  route.to,
                  parseInt(route.km)
                );
              }}
              className="
                mt-3
                flex
                min-h-[50px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-slate-950
                px-4
                text-[10px]
                font-black
                uppercase
                tracking-widest
                text-white
                shadow-md
              "
            >
              <span>🚕</span>
              Book This Route
              <span className="ml-auto">→</span>
            </button>


            {/* TRUST LINE */}
            <div className="
              mt-3
              flex
              items-center
              justify-center
              gap-2
              text-[8px]
              font-bold
              text-slate-400
            ">
              <span>✓ Transparent Fare</span>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <span>✓ 24×7 Support</span>
            </div>

          </div>


          {/* STATIC BOTTOM BRAND ACCENT */}
          <div className="
            absolute
            bottom-0
            left-0
            h-1
            w-full
            bg-gradient-to-r
            from-orange-600
            to-amber-400
          " />

        </article>

      ))}

    </div>


    {/* ================= BOTTOM CONVERSION BAR ================= */}
    <div className="
      mt-6
      overflow-hidden
      rounded-2xl
      border
      border-slate-200
      bg-slate-950
      px-4
      py-4
      shadow-xl
      sm:px-6
    ">

      <div className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      ">

        {/* MESSAGE */}
        <div className="flex items-center gap-3">

          <div className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-orange-600
            text-lg
          ">
            🚕
          </div>

          <div>

            <p className="
              text-xs
              font-black
              text-white
              sm:text-sm
            ">
              Your route isn't listed?
            </p>

            <p className="
              mt-0.5
              text-[9px]
              font-medium
              text-slate-400
              sm:text-[10px]
            ">
              Check fare for any destination across CG & MP.
            </p>

          </div>

        </div>


        {/* CTA */}
        <button
          type="button"
          onClick={() => {
            calculatorSectionRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="
            flex
            min-h-[46px]
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-orange-600
            px-5
            text-[9px]
            font-black
            uppercase
            tracking-widest
            text-white
            sm:w-auto
          "
        >
          Check Any Route
          <span>→</span>
        </button>

      </div>

    </div>

  </div>

</section>

        <SeoTextBlock />

        {/* 👑 FLUTTER-STYLE FLOATING ACTION BUTTON (FAB) COLUMN */}
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 md:hidden pointer-events-auto">
          <a
            href="https://wa.me/919244137353"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">💬</span>
          </a>

          <a
            href="tel:+919244137353"
            aria-label="Call Desk"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">📞</span>
          </a>
        </div>
      </main>

      {/* 👑 CUSTOMIZED "LOGIN TO CONTINUE" MODAL */}
      <AnimatePresence>
        {showLoginAlertModal && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
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
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
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

      {/* 👑 INITIAL GOOGLE RATING & INSTANT DISCOUNT POPUP MODAL (Matching 'pop-up screen.png') */}
      <AnimatePresence>
        {showInitialRatingModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-auto text-left relative p-6 sm:p-8 text-slate-900"
            >
              <button
                type="button"
                onClick={() => setShowInitialRatingModal(false)}
                className="absolute top-5 right-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full h-9 w-9 flex items-center justify-center transition font-bold"
              >
                ✕
              </button>

              <div className="text-center">
                <span className="text-xs font-serif italic text-slate-500">Thank You For Choosing</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tighter uppercase mt-0.5">
                  Khatu <span className="text-orange-600">Rides</span>
                </h3>
                <div className="w-24 h-0.5 bg-slate-200 mx-auto mt-1 mb-4" />

                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  — LOVE OUR SERVICE? —
                </span>
                
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-3">
                  Give 5 Star Rating <br />
                  & Get <span className="text-orange-600">Instant Discount!</span>
                </h4>

                <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left w-full sm:w-1/2">
                    <div className="text-xs font-black text-slate-900">Khatu Rides Travels Co.</div>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                      <span>4.6</span>
                      <span>★★★★★</span>
                      <span className="text-slate-400 font-normal">(1,200+)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Taxi Service • Korba, Chhattisgarh</p>
                    <a
                      href="https://g.page/r/CbD5nSIGmvz1EBM/review"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-[11px] font-black text-blue-600 hover:underline"
                    >
                      ✏️ Write a review
                    </a>
                  </div>

                  <div className="bg-linear-to-r from-orange-600 to-amber-500 text-white p-4 rounded-2xl text-center w-full sm:w-1/2 shadow-md">
                    <span className="text-[9px] font-black uppercase tracking-wider block">INSTANT DISCOUNT</span>
                    <div className="text-2xl sm:text-3xl font-black tracking-tighter mt-0.5">₹200*</div>
                    <span className="text-[9px] font-bold block opacity-90">ON YOUR BOOKING</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-left text-xs font-bold text-slate-700 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
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
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition"
                  >
                    <span className="text-lg">💬</span> SEND SCREENSHOT ON WHATSAPP
                  </a>
                </div>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => setShowInitialRatingModal(false)}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 underline"
                  >
                    Maybe Later
                  </button>
                  <p className="text-[9px] text-slate-400 mt-1">*T&C Apply</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 👑 FARE RESULTS POPUP MODAL */}
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
// app/customer/home/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, setDoc, addDoc, orderBy, Timestamp, onSnapshot, serverTimestamp } from "firebase/firestore";
import { 
  calculateFare, 
  VEHICLES, 
  type BookingType, 
  type VehicleType, 
  type ServiceType 
} from "@/lib/fareCalculator";

// Import Modular Dashboard Components
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import BookRide from "@/components/dashboard/BookRide";
import MyBookings from "@/components/dashboard/MyBookings";
import UpcomingRides from "@/components/dashboard/UpcomingRides";
import PastRides from "@/components/dashboard/PastRides";
import Cancellations from "@/components/dashboard/Cancellations";
import Invoices from "@/components/dashboard/Invoices";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import HelpSupport from "@/components/dashboard/HelpSupport";
import BookingPopupModal from "@/components/dashboard/BookingPopupModal";
import { generateTravelInvoicePdf } from "@/lib/generateInvoicePdf";

type UserBooking = {
  id: string;
  invoiceId: string;
  pickup: string;
  drop: string;
  bookingType: string;
  vehicleLabel: string;
  amountPaid: number;
  totalBilledAmount?: number;
  walletDiscountUsed?: number;
  paymentMode: string;
  pickupDate: string;
  pickupTime: string;
  status?: string;
  customerUid?: string;
  createdAt?: Timestamp;
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

export default function CustomerDashboardHome() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "book" | "trips" | "upcoming" | "past" | "cancellations" | "invoices" | "profile" | "support"
  >("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeOffers, setActiveOffers] = useState<SpecialOffer[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [applyWalletDiscount, setApplyWalletDiscount] = useState(false);

  // Popup & Checkout states
  const [popupData, setPopupData] = useState<any | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("sedan");
  const [paymentSplitMode, setPaymentSplitMode] = useState<Record<string, "full" | "half">>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      setCurrentUser(user);
      setCustomerName(user.displayName || "");

      try {
        if (db) {
          const customerRef = doc(db, "customers", user.uid);
          const customerSnap = await getDoc(customerRef);

          if (!customerSnap.exists()) {
            const newCustomerPayload = {
              uid: user.uid,
              name: user.displayName || "Valued Customer",
              email: user.email || "",
              phone: user.phoneNumber || "",
              walletBalance: 1101, // ₹1,101 Signup Bonus
              totalTrips: 0,
              membershipTier: "Elite Pro",
              createdAt: Timestamp.now(),
            };
            await setDoc(customerRef, newCustomerPayload);
            setCustomerData(newCustomerPayload);
          } else {
            setCustomerData(customerSnap.data());
          }

          // 👑 SECURE QUERY: Fetch bookings strictly from `online_bookings` using customerUid
          const q = query(collection(db, "online_bookings"), where("customerUid", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const trips: UserBooking[] = [];
          querySnapshot.forEach((docSnap) => {
            trips.push({ id: docSnap.id, ...docSnap.data() } as UserBooking);
          });
          setUserBookings(trips);

          const offersQuery = query(collection(db, "special_offers"), orderBy("createdAt", "desc"));
          const unsubscribeOffers = onSnapshot(offersQuery, (snapshot) => {
            const offersList: SpecialOffer[] = [];
            snapshot.forEach((oDoc) => {
              const oData = oDoc.data();
              if (oData.offerAvailable) {
                offersList.push({ id: oDoc.id, ...oData } as SpecialOffer);
              }
            });
            setActiveOffers(offersList);
          });

          return () => unsubscribeOffers();
        }
      } catch (err) {
        console.error("Error initializing customer dashboard:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (activeOffers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % activeOffers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeOffers.length]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (err) {
      console.error("Logout error:", err);
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

  const getVehicleImageByName = (vType: string) => {
    const lower = (vType || "").toLowerCase();
    if (lower.includes("crysta") || lower.includes("innova")) return "/crysta.png";
    if (lower.includes("ertiga") || lower.includes("suv") || lower.includes("xylo")) return "/ertiga.png";
    return "/dezire.png";
  };

  // 👑 FOOLPROOF RAZORPAY CHECKOUT & DEDICATED `online_bookings` SAVE WORKFLOW
  const handleOnlinePaymentCheckout = async (option: any) => {
    if (!popupData || !currentUser) return;
    if (!customerName.trim() || !customerPhone.trim() || customerPhone.length < 10) {
      alert("⚠️ Kripya sahi Naam aur 10-digit Mobile Number darj karein!");
      return;
    }

    setPaymentLoadingId(option.id);
    
    // 👑 LIVE BUSINESS LOGIC: Receiving exact calculated values from Modal
    const processAmount = option.calculatedPayableNow || option.finalFare;
    const discountApplied = option.appliedWalletDiscount || 0;
    const balanceDue = option.calculatedBalanceDue !== undefined ? option.calculatedBalanceDue : Math.max(0, option.finalFare - processAmount - discountApplied);
    const percentSelected = option.paymentSplitPercentage || 100;
    const paymentModeLabel = percentSelected === 100 ? "FULL PAYMENT" : `${percentSelected}% ADVANCE`;

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the exact calculated payable amount to Razorpay Order API
        body: JSON.stringify({ amount: processAmount, pickup: popupData.pickup, drop: popupData.drop, vehicleLabel: option.vehicleLabel }),
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Order generation error");

      const paymentObject = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount, // Order API returns amount * 100 (paise)
        currency: "INR",
        name: "Khatu Rides Travels Co.",
        description: `${option.vehicleLabel} Route Allocation`,
        order_id: orderData.orderId,
        prefill: { name: customerName, contact: customerPhone },
        theme: { color: "#ea580c" },
        handler: async (response: any) => {
          try {
            const finalInvoiceId = `KR-${Math.floor(100000 + Math.random() * 900000)}`;

            if (db) {
              const onlineBookingPayload = {
                invoiceId: finalInvoiceId,
                customerUid: currentUser.uid, 
                customerName: customerName,
                customerPhone: customerPhone,
                pickup: popupData.pickup,
                drop: popupData.drop,
                bookingType: popupData.bookingType,
                serviceType: popupData.serviceType,
                pickupDate: popupData.pickupDate,
                pickupTime: popupData.pickupTime,
                vehicleLabel: option.vehicleLabel,
                vehicleType: option.vehicleType,
                billedDistance: option.billedDistance,
                amountPaid: processAmount,
                totalBilledAmount: option.finalFare,
                balanceDueToDriver: balanceDue,
                walletDiscountUsed: discountApplied,
                paymentMode: paymentModeLabel,
                razorpayOrderId: response.razorpay_order_id || "N/A",
                razorpayPaymentId: response.razorpay_payment_id || "ONLINE_SUCCESS",
                status: "CONFIRMED",
                createdAt: serverTimestamp()
              };

              // 👑 Save document strictly to `online_bookings` collection
              const docRef = await addDoc(collection(db, "online_bookings"), onlineBookingPayload);
              setUserBookings((prev) => [{ id: docRef.id, ...onlineBookingPayload } as any, ...prev]);

              // 👑 Deduct wallet balance if discount was used
              if (discountApplied > 0) {
                const newBalance = Math.max(0, customerData.walletBalance - discountApplied);
                const custRef = doc(db, "customers", currentUser.uid);
                await setDoc(custRef, { walletBalance: newBalance }, { merge: true });
                setCustomerData((prev: any) => ({ ...prev, walletBalance: newBalance }));
              }
            }

            // 👑 Success Trigger: Dismiss popup and show modern success screen
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
              totalFare: option.finalFare,
              discountUsed: discountApplied,
              paymentMode: paymentModeLabel,
              customerName: customerName,
              customerPhone: customerPhone,
            });

          } catch (saveErr) {
            console.error("Error saving online booking record:", saveErr);
            alert("Payment was successful, but booking record saving failed. Please contact support.");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-orange-600 font-bold text-xs uppercase tracking-widest animate-pulse">
        Loading Professional Dashboard...
      </div>
    );
  }

  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "book", label: "Book a Ride", icon: "🚗" },
    { id: "trips", label: "My Bookings", icon: "📦" },
    { id: "upcoming", label: "Upcoming Rides", icon: "⏰" },
    { id: "past", label: "Past Rides", icon: "🏁" },
    { id: "cancellations", label: "Cancellations", icon: "❌" },
    { id: "invoices", label: "Invoices & Receipts", icon: "📄" },
    { id: "profile", label: "Profile Settings", icon: "👤" },
    { id: "support", label: "Help & Support", icon: "🎧" },
  ];

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <main className="min-h-screen bg-[#f4f7fb] text-slate-800 font-sans pb-16 selection:bg-orange-500 selection:text-white flex flex-col md:flex-row relative">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col justify-between shrink-0 select-none shadow-sm z-30 sticky top-0 h-screen">
          <div>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between cursor-pointer" onClick={() => setActiveTab("dashboard")}>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter uppercase text-slate-900 leading-none">
                  KHATU<span className="text-orange-600">RIDES</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">TRAVELS CO.</span>
              </div>
            </div>

            <nav className="p-4 space-y-1 text-xs font-bold text-slate-600 overflow-y-auto max-h-[calc(100vh-220px)]">
              {sidebarLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition ${activeTab === item.id ? "bg-orange-600 text-white shadow-md shadow-orange-600/20 font-black" : "hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 text-center space-y-2 relative overflow-hidden shadow-sm">
            <div className="text-[9px] font-black uppercase tracking-wider text-orange-600">SIGNUP BONUS ACTIVE</div>
            <div className="text-xs font-black text-slate-900">₹1,101 Credited to Wallet</div>
            <img src="/banner6.png" alt="Fleet" className="w-full h-20 object-cover rounded-xl mt-1 border border-orange-100 shadow-inner" />
          </div>
        </aside>

        {/* MOBILE TOP HEADER */}
        <div className="md:hidden w-full bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-lg">
              ☰
            </button>
            <span className="text-lg font-black uppercase text-slate-900 tracking-tighter">KHATU<span className="text-orange-600">RIDES</span></span>
          </div>

          <div className="flex items-center gap-2">
            <a href="tel:+919244137353" className="bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-full text-xs font-black">
              📞 Call
            </a>
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-orange-500 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.displayName?.[0] || "U"}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/60 backdrop-blur-xs">
              <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="w-72 bg-white h-full shadow-2xl flex flex-col justify-between p-4 overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <span className="text-lg font-black text-slate-900 uppercase">Menu</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="bg-slate-100 text-slate-700 rounded-full h-8 w-8 font-bold">✕</button>
                  </div>
                  <nav className="space-y-1 mt-4 text-xs font-bold text-slate-700">
                    {sidebarLinks.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === item.id ? "bg-orange-600 text-white font-black shadow-sm" : "hover:bg-slate-50"}`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-bold mt-4 border-t border-slate-100">
                      <span>🚪</span> <span>Logout Account</span>
                    </button>
                  </nav>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0">
          
          <header className="hidden md:flex bg-white/95 backdrop-blur-xl border-b border-slate-200 px-8 py-4 items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="space-y-0.5">
              <h2 className="text-base font-black text-slate-900 tracking-tight">Welcome back, {currentUser?.displayName || "Rahul Sharma"} 👋</h2>
              <p className="text-xs font-bold text-slate-500">Welcome back to Khatu Rides Portal</p>
            </div>

            <div className="flex items-center gap-4">
              <a href="tel:+919244137353" className="flex items-center gap-2 bg-[#0b101d] text-white px-4 py-2.5 rounded-full text-xs font-black shadow-sm hover:bg-slate-900 transition">
                <span>📞</span> 24x7 Support
              </a>
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover shadow-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-black text-white text-sm shadow-sm">
                    {currentUser?.displayName?.[0] || "R"}
                  </div>
                )}
                <div className="text-left">
                  <div className="text-xs font-black text-slate-900 leading-tight">{currentUser?.displayName || "Rahul Sharma"}</div>
                  <div className="text-[10px] font-bold text-slate-500">Signup Bonus: ₹1,101 Active</div>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 text-xs font-bold ml-2">Logout</button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
            
            {activeTab === "dashboard" && (
              <DashboardOverview
                currentUser={currentUser}
                activeOffers={activeOffers}
                currentOfferIndex={currentOfferIndex}
                customerData={customerData}
                userBookings={userBookings}
                setActiveTab={setActiveTab}
                setPopupData={setPopupData}
                setSelectedVehicleType={setSelectedVehicleType}
                setShowPopup={setShowPopup}
                setShowUserForm={setShowUserForm}
                getVehicleImageByName={getVehicleImageByName}
                calculateFare={calculateFare}
              />
            )}

            {activeTab === "book" && (
              <BookRide
                setPopupData={setPopupData}
                setSelectedVehicleType={setSelectedVehicleType}
                setShowPopup={setShowPopup}
                setShowUserForm={setShowUserForm}
              />
            )}

            {activeTab === "trips" && (
              <MyBookings userBookings={userBookings} setActiveTab={setActiveTab} />
            )}

            {activeTab === "upcoming" && (
              <UpcomingRides userBookings={userBookings} setActiveTab={setActiveTab} />
            )}

            {activeTab === "past" && (
              <PastRides userBookings={userBookings} setActiveTab={setActiveTab} />
            )}

            {activeTab === "cancellations" && (
              <Cancellations userBookings={userBookings} setActiveTab={setActiveTab} />
            )}

            {activeTab === "invoices" && (
              <Invoices userBookings={userBookings} setActiveTab={setActiveTab} />
            )}

            {activeTab === "profile" && (
              <ProfileSettings currentUser={currentUser} />
            )}

            {activeTab === "support" && (
              <HelpSupport />
            )}

          </div>

          <footer className="mt-auto border-t border-slate-200 bg-white px-8 py-4 text-center text-xs font-bold text-slate-500 flex flex-col sm:flex-row items-center justify-between">
            <div>© 2026 Khatu Rides Travels Co. All rights reserved.</div>
            <div className="flex gap-4 mt-2 sm:mt-0 text-[11px]">
              <a href="#" className="hover:text-slate-900">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900">Terms & Conditions</a>
              <a href="#" className="hover:text-slate-900">Refund Policy</a>
            </div>
          </footer>
        </div>

        {/* BOOKING POPUP MODAL */}
        <BookingPopupModal
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          popupData={popupData}
          selectedVehicleType={selectedVehicleType}
          setSelectedVehicleType={setSelectedVehicleType}
          showUserForm={showUserForm}
          setShowUserForm={setShowUserForm}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          customerData={customerData}
          applyWalletDiscount={applyWalletDiscount}
          setApplyWalletDiscount={setApplyWalletDiscount}
          paymentSplitMode={paymentSplitMode}
          setPaymentSplitMode={setPaymentSplitMode}
          paymentLoadingId={paymentLoadingId}
          handleOnlinePaymentCheckout={handleOnlinePaymentCheckout}
          getVehicleImageByName={getVehicleImageByName}
        />

        {/* SUCCESS TICKET INVOICE SCREEN WITH DISCOUNT BREAKDOWN & PDF */}
        <AnimatePresence>
          {successReceipt && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }} 
                className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl relative text-left my-auto space-y-6"
              >
                <div className="text-center pb-4 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 text-2xl flex items-center justify-center mx-auto border border-emerald-200 mb-2">✓</div>
                  <h3 className="text-2xl font-black text-slate-900">Cab Booking Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Recorded successfully in `online_bookings` collection.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs font-bold text-slate-700">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider">Khatu Rides E-Ticket</span>
                    <span className="font-mono text-slate-900">{successReceipt.invoiceId}</span>
                  </div>
                  <div className="flex justify-between"><span>Passenger:</span> <span className="text-slate-900">{successReceipt.customerName}</span></div>
                  <div className="flex justify-between"><span>Route:</span> <span className="text-slate-900">{successReceipt.pickup} ➔ {successReceipt.drop}</span></div>
                  <div className="flex justify-between"><span>Vehicle Type:</span> <span className="text-slate-900 uppercase">{successReceipt.vehicle}</span></div>
                  <div className="flex justify-between"><span>Journey Date:</span> <span className="text-slate-900">{successReceipt.date} at {successReceipt.time}</span></div>
                  
                  {successReceipt.discountUsed > 0 && (
                    <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <span>Wallet Discount (Signup Bonus):</span> 
                      <span className="font-black">-₹{successReceipt.discountUsed}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-1">
                    <span>Advance Paid Online:</span> 
                    <span className="text-slate-900 font-black">₹{successReceipt.amount.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-orange-600">
                    <span>Balance Due to Driver:</span> 
                    <span>₹{Math.max(0, successReceipt.totalFare - successReceipt.amount - successReceipt.discountUsed).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => generateTravelInvoicePdf(successReceipt)} 
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition"
                  >
                    <span>📥</span> DOWNLOAD YOUR TRAVEL CAB TICKET (PDF)
                  </button>

                  <button 
                    onClick={() => { setSuccessReceipt(null); setActiveTab("trips"); }} 
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase py-3.5 rounded-2xl transition"
                  >
                    Close & View My Bookings
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </>
  );
}
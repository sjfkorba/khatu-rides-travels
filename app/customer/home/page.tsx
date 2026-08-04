// app/customer/home/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, setDoc, orderBy, Timestamp, onSnapshot } from "firebase/firestore";
import { 
  calculateFare, 
  VEHICLES, 
  type BookingType, 
  type VehicleType, 
  type ServiceType 
} from "@/lib/fareCalculator";

// 👑 Import Modular Dashboard Components
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import BookRide from "@/components/dashboard/BookRide";
import MyBookings from "@/components/dashboard/MyBookings";
import UpcomingRides from "@/components/dashboard/UpcomingRides";
import PastRides from "@/components/dashboard/PastRides";
import Cancellations from "@/components/dashboard/Cancellations";
import Invoices from "@/components/dashboard/Invoices";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import HelpSupport from "@/components/dashboard/HelpSupport";

type UserBooking = {
  id: string;
  invoiceId: string;
  pickup: string;
  drop: string;
  bookingType: string;
  vehicleLabel: string;
  amountPaid: number;
  paymentMode: string;
  pickupDate: string;
  pickupTime: string;
  status?: string;
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
              walletBalance: 1101,
              totalTrips: 0,
              membershipTier: "Elite Pro",
              createdAt: Timestamp.now(),
            };
            await setDoc(customerRef, newCustomerPayload);
            setCustomerData(newCustomerPayload);
          } else {
            setCustomerData(customerSnap.data());
          }

          const q = query(collection(db, "bookings"), where("customerPhone", "==", user.phoneNumber || ""));
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

  const handleOnlinePaymentCheckout = async (option: any) => {
    if (!popupData || !currentUser) return;
    if (!customerName.trim() || !customerPhone.trim() || customerPhone.length < 10) {
      alert("⚠️ Kripya sahi Naam aur 10-digit Mobile Number darj karein!");
      return;
    }

    setPaymentLoadingId(option.id);
    const mode = paymentSplitMode[option.id] || "full";
    let baseFare = option.finalFare;

    let discountApplied = 0;
    if (applyWalletDiscount && customerData && customerData.walletBalance > 0) {
      discountApplied = Math.min(200, customerData.walletBalance, baseFare);
      baseFare -= discountApplied;
    }

    const processAmount = mode === "half" ? Math.round(baseFare / 2) : baseFare;

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

            if (db && discountApplied > 0) {
              const newBalance = Math.max(0, customerData.walletBalance - discountApplied);
              const custRef = doc(db, "customers", currentUser.uid);
              await setDoc(custRef, { walletBalance: newBalance }, { merge: true });
              setCustomerData((prev: any) => ({ ...prev, walletBalance: newBalance }));
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
              discountUsed: discountApplied,
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
              <h2 className="text-base font-black text-slate-900 tracking-tight">Good Morning, {currentUser?.displayName || "Rahul Sharma"} 👋</h2>
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
        <AnimatePresence>
          {showPopup && popupData && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 p-0 sm:p-4 backdrop-blur-xs overflow-y-auto">
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="bg-white border border-slate-200 w-full max-w-4xl rounded-none sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col min-h-screen sm:min-h-0 sm:max-h-[96vh] text-left relative text-slate-900">
                <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase text-white">{popupData.pickup.split(",")[0]} ➔ {popupData.drop.split(",")[0]}</h3>
                  <button onClick={() => setShowPopup(false)} className="bg-slate-800 hover:bg-slate-700 text-white rounded-full h-7 w-7 flex items-center justify-center">✕</button>
                </div>

                <div className="p-4 overflow-y-auto space-y-4 bg-slate-50">
                  {!showUserForm ? (
                    <div className="space-y-3">
                      {popupData.fareOptions.map((opt: any) => {
                        if (!["sedan", "ertiga", "crysta"].includes(opt.vehicleType)) return null;
                        const isSelected = selectedVehicleType === opt.vehicleType;
                        return (
                          <div key={opt.id} onClick={() => setSelectedVehicleType(opt.vehicleType)} className={`rounded-2xl border-2 bg-white p-4 cursor-pointer shadow-sm ${isSelected ? "border-orange-500 bg-orange-50/50" : "border-slate-200"}`}>
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase">{opt.vehicleLabel}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Distance: {opt.billedDistance} Kms | Includes Toll & Tax</p>
                              </div>
                              <div className="text-right">
                                <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white text-base font-black px-4 py-1.5 rounded-xl shadow-xs">
                                  ₹{opt.finalFare.toLocaleString("en-IN")}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                              <button onClick={() => { setSelectedVehicleType(opt.vehicleType); setShowUserForm(true); }} className="bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase px-6 py-2.5 rounded-xl shadow-xs">
                                Proceed to Booking ➔
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-lg">
                      <h4 className="text-base font-black text-slate-900">Enter Booking Details</h4>
                      <div>
                        <label className="text-xs font-black text-slate-700 uppercase">Passenger Name</label>
                        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 mt-1" />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-700 uppercase">Mobile Number</label>
                        <input type="tel" maxLength={10} value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 mt-1" placeholder="10-digit number" />
                      </div>

                      {customerData && customerData.walletBalance > 0 && (
                        <div className="bg-orange-50 border border-orange-200 p-3.5 rounded-2xl flex items-center justify-between">
                          <div>
                            <div className="text-xs font-black text-orange-900">Use Signup Wallet (Balance: ₹{customerData.walletBalance})</div>
                            <div className="text-[10px] text-slate-600">Save up to ₹200 on this trip</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={applyWalletDiscount}
                            onChange={(e) => setApplyWalletDiscount(e.target.checked)}
                            className="w-5 h-5 accent-orange-600 cursor-pointer"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button onClick={() => setShowUserForm(false)} className="bg-slate-100 text-slate-700 font-bold text-xs uppercase py-3 rounded-xl border border-slate-200">Back</button>
                        <button onClick={() => {
                          const opt = popupData.fareOptions.find((o: any) => o.vehicleType === selectedVehicleType);
                          if (opt) handleOnlinePaymentCheckout(opt);
                        }} className="bg-orange-600 text-white font-black text-xs uppercase py-3 rounded-xl shadow-md">Pay & Book</button>
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
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-4 shadow-2xl text-slate-900">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 text-2xl flex items-center justify-center mx-auto border border-emerald-200">✓</div>
                <h3 className="text-xl font-black text-slate-900">Booking Confirmed!</h3>
                <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2 text-left font-bold text-slate-700 border border-slate-200">
                  <div className="flex justify-between"><span>Invoice ID:</span> <span className="text-slate-900 font-mono">{successReceipt.invoiceId}</span></div>
                  <div className="flex justify-between"><span>Route:</span> <span className="text-slate-900">{successReceipt.pickup} ➔ {successReceipt.drop}</span></div>
                  <div className="flex justify-between"><span>Vehicle:</span> <span className="text-slate-900">{successReceipt.vehicle}</span></div>
                  {successReceipt.discountUsed > 0 && (
                    <div className="flex justify-between text-orange-600"><span>Wallet Discount:</span> <span>-₹{successReceipt.discountUsed}</span></div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-orange-600"><span>Paid:</span> <span>₹{successReceipt.amount.toLocaleString("en-IN")}</span></div>
                </div>
                <button onClick={() => { setSuccessReceipt(null); setActiveTab("invoices"); }} className="w-full bg-[#0b101d] hover:bg-slate-900 text-white font-black text-xs uppercase py-3.5 rounded-2xl shadow-md">
                  View & Download PDF Invoice
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </>
  );
}
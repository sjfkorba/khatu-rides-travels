// app/admin/bookings/page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  Firestore,
  limit
} from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let db: Firestore | null = null;
try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase admin initialization error:", error);
}

interface FirestoreBooking {
  id: string;
  invoiceId: string;
  customerName: string;
  customerPhone: string;
  pickup: string;
  drop: string;
  bookingType: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string | null;
  returnTime?: string | null;
  vehicleLabel: string;
  amountPaid: number;
  paymentMode: "50% ADVANCE" | "FULL PAYMENT";
  razorpayPaymentId: string;
  status: string;
  createdAt: any;
  billedDistance?: number;
}

export default function AdminBookingsDashboard() {
  const [bookings, setBookings] = useState<FirestoreBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); 
  const [dateFilter, setDateFilter] = useState(""); 
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    const bookingsCollectionRef = collection(db, "bookings");
    const orderedQueryStream = query(bookingsCollectionRef, orderBy("createdAt", "desc"), limit(250));

    const unsubscribeStreamRoute = onSnapshot(orderedQueryStream, (snapshot) => {
      const liveBookingPayload: FirestoreBooking[] = [];
      snapshot.forEach((doc) => {
        const incomingData = doc.data();
        liveBookingPayload.push({
          id: doc.id,
          invoiceId: incomingData.invoiceId || `KR-${Math.floor(100000 + Math.random() * 900000)}`,
          customerName: incomingData.customerName || "Guest Passenger",
          customerPhone: incomingData.customerPhone || "0000000000",
          pickup: incomingData.pickup || "",
          drop: incomingData.drop || "",
          bookingType: incomingData.bookingType || "oneway",
          serviceType: incomingData.serviceType || "outstation",
          pickupDate: incomingData.pickupDate || "",
          pickupTime: incomingData.pickupTime || "",
          returnDate: incomingData.returnDate || null,
          returnTime: incomingData.returnTime || null,
          vehicleLabel: incomingData.vehicleLabel || "Cab Fleet",
          amountPaid: Number(incomingData.amountPaid) || 0,
          paymentMode: incomingData.paymentMode || "FULL PAYMENT",
          razorpayPaymentId: incomingData.razorpayPaymentId || "RPX-" + Math.random().toString(36).substring(7).toUpperCase(),
          status: incomingData.status || "CONFIRMED_ONLINE",
          createdAt: incomingData.createdAt,
          billedDistance: incomingData.billedDistance || 150,
        });
      });
      setBookings(liveBookingPayload);
      setLoading(false);
    }, () => setLoading(false));

    return () => unsubscribeStreamRoute();
  }, []);

  // 🔍 PIPELINE FILTER ENGINE
  const filteredBookingsArray = useMemo(() => {
    return bookings.filter((item) => {
      const matchSearchText = 
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerPhone.includes(searchTerm) ||
        item.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.drop.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatusTab = 
        statusFilter === "ALL" || 
        (statusFilter === "ADVANCE" && item.paymentMode === "50% ADVANCE") ||
        (statusFilter === "FULL" && item.paymentMode === "FULL PAYMENT");

      const matchDateSelector = !dateFilter || item.pickupDate === dateFilter;
      return matchSearchText && matchStatusTab && matchDateSelector;
    });
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  // 📊 METRICS METADATA
  const analyticsCounters = useMemo(() => {
    let totalRevenuePaid = 0;
    let totalExpectedCollections = 0;
    bookings.forEach((item) => {
      totalRevenuePaid += item.amountPaid;
      totalExpectedCollections += item.paymentMode === "50% ADVANCE" ? item.amountPaid * 2 : item.amountPaid;
    });
    return {
      grossCollections: totalRevenuePaid,
      pendingDebt: totalExpectedCollections - totalRevenuePaid,
      grossTripsCount: filteredBookingsArray.length
    };
  }, [bookings, filteredBookingsArray]);

  // 👑 PIXEL-PERFECT FLUTTER STYLE APP NATIVE PDF GENERATOR
  const generateNativeFlutterLookPDF = (bk: FirestoreBooking) => {
    setGeneratingId(bk.id);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const grossFare = bk.paymentMode === "50% ADVANCE" ? bk.amountPaid * 2 : bk.amountPaid;
      const balanceDue = bk.paymentMode === "50% ADVANCE" ? bk.amountPaid : 0;

      // Premium Brand Identity Palette (Navy Blue Deep Accent)
      doc.setFillColor(30, 58, 138); 
      doc.rect(0, 0, 210, 38, "F");

      // Brand Title Text
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("KHATU RIDES TRAVELS CO.", 15, 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("PREMIUM TAXI SERVICES & FLEET NETWORK", 15, 22);
      doc.text("Korba, Chhattisgarh, India | Support: +91 8319376115", 15, 27);

      // Invoice Target Metadata Right Side
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("TRAVEL INVOICE", 150, 15, { align: "left" });
      doc.setFontSize(10);
      doc.text(`Invoice No: ${bk.invoiceId}`, 150, 21, { align: "left" });
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 150, 26, { align: "left" });

      // Client / Vendor Info Section Layout
      doc.setTextColor(30, 58, 138);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("SERVICE PROVIDER DETAILS", 15, 50);
      doc.text("PASSENGER BILLING INFO", 115, 50);

      // Horizontal Border Line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(15, 52, 95, 52);
      doc.line(115, 52, 195, 52);

      // Body Text Labels Info
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      
      // Provider Data columns
      doc.setFont("helvetica", "bold");
      doc.text("Khatu Rides Travels Co.", 15, 58);
      doc.setFont("helvetica", "normal");
      doc.text("Authorized Logistics & Cab Partner", 15, 63);
      doc.text("Email: bookings@khaturides.com", 15, 68);

      // Customer Details columns
      doc.setFont("helvetica", "bold");
      doc.text(bk.customerName, 115, 58);
      doc.setFont("helvetica", "normal");
      doc.text(`Phone: +91 ${bk.customerPhone}`, 115, 63);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      doc.text("Status: Secured & Confirmed", 115, 68);

      // Journey Manifest Details Header
      doc.setTextColor(30, 58, 138);
      doc.setFont("helvetica", "bold");
      doc.text("JOURNEY ROUTE MANIFEST", 15, 82);

      // Flutter style clean dynamic auto table injections
      (doc as any).autoTable({
        startY: 85,
        theme: "striped",
        headStyles: { fillColor: [248, 250, 252], textColor: [30, 58, 138], fontStyle: "bold" },
        head: [["Route (From - To)", "Vehicle Fleet", "Category", "Departure Schedule"]],
        body: [[
          `From: ${bk.pickup.split(",")[0]}\nTo: ${bk.drop.split(",")[0]}`,
          bk.vehicleLabel,
          bk.bookingType.toUpperCase(),
          `${bk.pickupDate.split("-").reverse().join("/")}\n${bk.pickupTime}`
        ]],
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 40 }, 2: { cellWidth: 30 } }
      });

      const finalY = (doc as any).lastAutoTable.finalY + 12;

      // Settlement Fare Breakdown section Title
      doc.setTextColor(30, 58, 138);
      doc.setFont("helvetica", "bold");
      doc.text("FINANCIAL SETTLEMENT BREAKDOWN", 15, finalY);

      // Calculation pricing matrix mapping block
      (doc as any).autoTable({
        startY: finalY + 3,
        theme: "grid",
        headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] },
        head: [["Fare Description", "Billed Units", "Total Gross Value"]],
        body: [
          ["Standard Distance Package (Incl. 25% Flat Discount)", `${bk.billedDistance || 150} KM Base`, `INR ${grossFare.toLocaleString("en-IN")}.00`],
          ["Total Gross Amount Due", "", `INR ${grossFare.toLocaleString("en-IN")}.00`],
          ["Online Advance Payment Received", "", `INR ${bk.amountPaid.toLocaleString("en-IN")}.00`],
          ["Outstanding Balance (Payable to Driver)", "", `INR ${balanceDue.toLocaleString("en-IN")}.00`]
        ],
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: { 2: { halign: "right", fontStyle: "bold" } },
        didParseCell: function(data: any) {
          if (data.row.index === 3) {
            data.cell.styles.fillColor = [254, 242, 242];
            data.cell.styles.textColor = [153, 27, 27];
            data.cell.styles.fontStyle = "bold";
          }
          if (data.row.index === 2) {
            data.cell.styles.fillColor = [224, 242, 254];
            data.cell.styles.textColor = [3, 105, 161];
          }
        }
      });

      const termsY = (doc as any).lastAutoTable.finalY + 10;

      // Technical bottom logs declarations
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.rect(15, termsY, 180, 22);
      
      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("TERMS & COMMERCIAL RIDE GUIDELINES:", 18, termsY + 5);
      doc.setFont("helvetica", "normal");
      doc.text("1. Toll Taxes, State Border Taxes, and Airport Parking charges are payable extra as per actual receipts.", 18, termsY + 10);
      doc.text(`2. Electronic Transaction Ref token payload verified online securely via Razorpay ID: ${bk.razorpayPaymentId}`, 18, termsY + 15);

      // Core Footer greeting closing string tag
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("THANK YOU FOR TRAVELING WITH KHATU RIDES TRAVELS CO!", 105, termsY + 32, { align: "center" });

      // Direct device save trigger loop
      doc.save(`Invoice_${bk.invoiceId}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error generating invoice payload matrix.");
    } finally {
      setGeneratingId(null);
    }
  };

  const convertToIndianDate = (dateString: string) => {
    if (!dateString) return "--/--/----";
    const bits = dateString.split("-");
    if (bits.length !== 3) return dateString;
    return `${bits[2]}/${bits[1]}/${bits[0]}`;
  };

  const formatTimeToAMPM = (timeString: string) => {
    if (!timeString) return "--:-- --";
    let [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-3 sm:p-6 lg:p-8 select-none">
      
      {/* Header Panel */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5 mb-6 text-left">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h1 className="text-lg font-black uppercase tracking-wider text-white">KHATU RIDES COMMAND CONTROL</h1>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase mt-1">Live Fleet Operational Pipeline & Invoice Receipts Tracker</p>
        </div>
        <div className="bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800/80 flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">Live Firestore Connected</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Quick Counters row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-left">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Total Received</span>
            <div className="text-xl font-black text-emerald-400 tracking-tight mt-1">₹{analyticsCounters.grossCollections.toLocaleString("en-IN")}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-left">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">On-Road Pending</span>
            <div className="text-xl font-black text-amber-500 tracking-tight mt-1">₹{analyticsCounters.pendingDebt.toLocaleString("en-IN")}</div>
          </div>
          <div className="bg-gradient-to-r from-orange-600 to-[#d8551b] p-4 rounded-2xl text-left">
            <span className="text-[10px] font-black text-white/70 uppercase tracking-wider">Filtered Trips</span>
            <div className="text-xl font-black text-white tracking-tight mt-1">{analyticsCounters.grossTripsCount} Trips</div>
          </div>
        </div>

        {/* Filters Desk */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <div className="md:col-span-2">
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Search Keywords</label>
              <input 
                type="text" 
                placeholder="Search Passenger Name, Phone, Invoice ID..." 
                value={searchTerm}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-orange-500 placeholder:text-slate-600 shadow-inner"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">📅 Filter by Journey Date</label>
                {dateFilter && (
                  <button type="button" onClick={() => setDateFilter("")} className="text-[9px] font-black text-red-400 hover:text-red-300 uppercase transition">✕ Clear</button>
                )}
              </div>
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"/>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-900 pt-3 flex-wrap gap-3">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wide">
              Filtered Result Stack: <span className="text-white">{filteredBookingsArray.length} entries</span>
            </div>
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl overflow-x-auto">
              {[
                { id: "ALL", label: "All Logs" },
                { id: "ADVANCE", label: "50% Advance" },
                { id: "FULL", label: "100% Paid" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-4 py-2 text-center text-[10px] font-black uppercase rounded-lg tracking-wider transition whitespace-nowrap ${
                    statusFilter === tab.id ? "bg-orange-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Listing Loop */}
        {loading ? (
          <div className="py-20 text-center text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">🔄 Syncing Live Database...</div>
        ) : filteredBookingsArray.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl py-14 text-center text-xs font-bold text-slate-500 uppercase">📭 No matching records found.</div>
        ) : (
          <div className="space-y-4">
            {filteredBookingsArray.map((bk) => (
              <div key={bk.id} className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col shadow-md">
                
                <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-5 text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left w-full sm:w-auto">
                    <span className="text-3xl shrink-0 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      {bk.vehicleLabel.toLowerCase().includes("dzire") ? "🚖" : "🚘"}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h3 className="text-base font-black text-white">{bk.customerName}</h3>
                        <span className="bg-slate-900 px-2 py-0.5 rounded text-[9px] font-black text-orange-400 uppercase border border-slate-800 tracking-wider">{bk.invoiceId}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2.5 text-[11px] font-bold text-slate-400">
                        <p>📞 <span className="text-slate-600 font-medium">Contact:</span> <a href={`tel:${bk.customerPhone}`} className="text-indigo-400 underline">{bk.customerPhone}</a></p>
                        <p>🚖 <span className="text-slate-600 font-medium">Fleet:</span> <span className="text-white">{bk.vehicleLabel}</span></p>
                        <p>📍 <span className="text-slate-600 font-medium">From:</span> <span className="text-slate-200">{bk.pickup.split(",")[0]}</span></p>
                        <p>🏁 <span className="text-slate-600 font-medium">To:</span> <span className="text-slate-200">{bk.drop.split(",")[0]}</span></p>
                        <p>📅 <span className="text-slate-600 font-medium">Schedule:</span> <span className="text-slate-200">{convertToIndianDate(bk.pickupDate)} ({formatTimeToAMPM(bk.pickupTime)})</span></p>
                        <p>🔄 <span className="text-slate-600 font-medium">Category:</span> <span className="text-orange-400 font-extrabold uppercase">{bk.bookingType}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-between md:justify-end border-t md:border-none border-slate-900 pt-4 md:pt-0">
                    <div className="text-center sm:text-left md:text-right min-w-[120px]">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Transacted</span>
                      <div className="text-xl font-black text-emerald-400 tracking-tight mt-0.5">₹{bk.amountPaid.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="text-center sm:text-right min-w-[140px] w-full sm:w-auto">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Status Flag</span>
                      <div className={`border rounded-xl p-1.5 text-center font-black text-[10px] uppercase tracking-wide ${
                        bk.paymentMode === "50% ADVANCE" ? "bg-amber-950/40 border-amber-800 text-amber-400" : "bg-emerald-950/40 border-emerald-800 text-emerald-400"
                      }`}>
                        {bk.paymentMode === "50% ADVANCE" ? "💸 50% Advance" : "💎 100% Paid"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 📄 NEW BULLETPROOF DIRECT DOWNLOAD TRIGGER BLOCK */}
                <div className="w-full bg-slate-900/60 border-t border-slate-950 py-3 px-5 flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-[10px] font-medium text-slate-500">
                    Razorpay ID: <span className="text-slate-400 font-mono font-bold">{bk.razorpayPaymentId}</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => generateNativeFlutterLookPDF(bk)}
                    disabled={generatingId === bk.id}
                    className="bg-orange-600 hover:bg-orange-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl transition shadow-md flex items-center gap-1.5"
                  >
                    {generatingId === bk.id ? "🔄 Building Canvas..." : "📄 Save Travel Invoice"}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
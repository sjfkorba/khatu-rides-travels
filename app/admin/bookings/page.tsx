// app/admin/bookings/page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query, 
  Firestore,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import { Plus, X, Search, CalendarDays, Loader2, User, Phone, Car, MapPin } from "lucide-react";

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
  paymentMode: "50% ADVANCE" | "FULL PAYMENT" | "MANUAL_OFFLINE";
  razorpayPaymentId: string;
  status: string;
  createdAt: any;
  billedDistance?: number;
  driverName?: string;
  vehicleNo?: string;
  driverPhone?: string;
  totalBilledAmount?: number;
}

// =========================================================================
// 👑 HELPER FUNCTION: NUMBER TO ENGLISH WORDS CONVERTER
// =========================================================================
const convertNumberToWords = (num: number): string => {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero Rupees Only";

  const g = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + g(n % 100) : "");
    return "";
  };

  let words = "";
  if (Math.floor(num / 100000) > 0) {
    words += g(Math.floor(num / 100000)) + " Lakh ";
    num %= 100000;
  }
  if (Math.floor(num / 1000) > 0) {
    words += g(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }
  if (num > 0) {
    words += g(num);
  }

  return words.trim() + " Rupees Only";
};

export default function AdminBookingsDashboard() {
  const router = useRouter(); 
  const [bookings, setBookings] = useState<FirestoreBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); 
  const [dateFilter, setDateFilter] = useState(""); 
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Manual Form States
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [pickupLoc, setPickupLoc] = useState("");
  const [dropLoc, setDropLoc] = useState("");
  const [bType, setBType] = useState("oneway");
  const [pDate, setPDate] = useState("");
  const [pTime, setPTime] = useState("");
  const [vLabel, setVLabel] = useState("Maruti Suzuki Dzire");
  const [dName, setDName] = useState("");
  const [vNo, setVNo] = useState("");
  const [dPhone, setDPhone] = useState("");
  const [totalFare, setTotalFare] = useState("");
  const [amtPaid, setAmtPaid] = useState("");
  const [pMode, setPMode] = useState("MANUAL_OFFLINE");

  useEffect(() => {
    let unsubscribeStreamRoute: (() => void) | undefined;

    async function checkAuthAndLoadData() {
      try {
        const { onAuthStateChanged } = await import("firebase/auth");
        const { auth } = await import("@/lib/firebase");

        onAuthStateChanged(auth, (user) => {
          if (!user) {
            setLoading(false);
            router.push("/admin/login");
          } else {
            if (!db) return;
            const bookingsCollectionRef = collection(db, "bookings");
            const uncompiledQueryStream = query(bookingsCollectionRef);

            unsubscribeStreamRoute = onSnapshot(uncompiledQueryStream, (snapshot) => {
              const liveBookingPayload: FirestoreBooking[] = [];
              
              snapshot.forEach((doc) => {
                const incomingData = doc.data();
                liveBookingPayload.push({
                  id: doc.id,
                  invoiceId: incomingData.invoiceId || `KRT/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
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
                  paymentMode: incomingData.paymentMode || "MANUAL_OFFLINE",
                  razorpayPaymentId: incomingData.razorpayPaymentId || "OFFLINE_RECORD",
                  status: incomingData.status || "CONFIRMED",
                  createdAt: incomingData.createdAt,
                  billedDistance: incomingData.billedDistance || 150,
                  driverName: incomingData.driverName || "Not Assigned",
                  vehicleNo: incomingData.vehicleNo || "N/A",
                  driverPhone: incomingData.driverPhone || "N/A",
                  totalBilledAmount: incomingData.totalBilledAmount || Number(incomingData.amountPaid) || 0
                });
              });

              liveBookingPayload.sort((firstNode, secondNode) => {
                let dateA = 0; let dateB = 0;
                if (firstNode.createdAt?.seconds) {
                  dateA = firstNode.createdAt.seconds * 1000;
                } else if (typeof firstNode.createdAt === "string") {
                  const normalizedStrA = firstNode.createdAt.replace(/ at /i, " ").replace(/UTC\+.*$/i, "").trim();
                  dateA = new Date(normalizedStrA).getTime() || 0;
                }
                if (secondNode.createdAt?.seconds) {
                  dateB = secondNode.createdAt.seconds * 1000;
                } else if (typeof secondNode.createdAt === "string") {
                  const normalizedStrB = secondNode.createdAt.replace(/ at /i, " ").replace(/UTC\+.*$/i, "").trim();
                  dateB = new Date(normalizedStrB).getTime() || 0;
                }
                return dateB - dateA;
              });

              setBookings(liveBookingPayload);
              setLoading(false);
            }, (error) => {
              console.error("Firestore loading error:", error);
              setLoading(false);
            });
          }
        });
      } catch (err) {
        console.error("Auth initialization block failed:", err);
        router.push("/admin/login");
      }
    }

    checkAuthAndLoadData();
    return () => { if (unsubscribeStreamRoute) unsubscribeStreamRoute(); };
  }, [router]);

  const handleSaveManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !pickupLoc || !dropLoc || !pDate || !pTime || !totalFare) {
      alert("⚠️ Kripya saari details register karein!");
      return;
    }
    if (!db) return;

    setFormLoading(true);
    try {
      const generatedInvoiceNumber = `KRT/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`;
      const calculatedTotal = Number(totalFare) || 0;
      const calculatedPaid = Number(amtPaid) || 0;

      await addDoc(collection(db, "bookings"), {
        invoiceId: generatedInvoiceNumber,
        customerName: custName,
        customerPhone: custPhone,
        pickup: pickupLoc,
        drop: dropLoc,
        bookingType: bType,
        serviceType: "outstation",
        pickupDate: pDate,
        pickupTime: pTime,
        vehicleLabel: vLabel,
        amountPaid: calculatedPaid,
        totalBilledAmount: calculatedTotal,
        paymentMode: pMode,
        razorpayPaymentId: "OFFLINE_MANUAL",
        status: "CONFIRMED",
        driverName: dName || "Not Assigned",
        vehicleNo: vNo || "N/A",
        driverPhone: dPhone || "N/A",
        billedDistance: bType === "roundtrip" ? 300 : 150,
        createdAt: serverTimestamp() 
      });

      setCustName(""); setCustPhone(""); setPickupLoc(""); setDropLoc("");
      setPDate(""); setPTime(""); setDName(""); setVNo(""); setDPhone("");
      setTotalFare(""); setAmtPaid("");
      setShowManualForm(false);
      alert("🎉 Offline Booking successfully register ho gayi!");
    } catch (err) {
      alert("Error saving manual entry.");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredBookingsArray = useMemo(() => {
    return bookings.filter((item) => {
      const matchSearchText = 
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerPhone.includes(searchTerm) ||
        item.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.drop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.driverName && item.driverName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatusTab = 
        statusFilter === "ALL" || 
        (statusFilter === "MANUAL" && item.paymentMode === "MANUAL_OFFLINE") ||
        (statusFilter === "ONLINE" && item.paymentMode !== "MANUAL_OFFLINE");

      const matchDateSelector = !dateFilter || item.pickupDate === dateFilter;
      return matchSearchText && matchStatusTab && matchDateSelector;
    });
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const analyticsCounters = useMemo(() => {
    let totalCollected = 0;
    let totalManualCount = 0;
    let totalOnlineCount = 0;

    bookings.forEach((item) => {
      totalCollected += item.amountPaid;
      if (item.paymentMode === "MANUAL_OFFLINE") {
        totalManualCount++;
      } else {
        totalOnlineCount++;
      }
    });

    return {
      grossCollections: totalCollected,
      manualCount: totalManualCount,
      onlineCount: totalOnlineCount,
      grossTripsCount: filteredBookingsArray.length
    };
  }, [bookings, filteredBookingsArray]);

  // =========================================================================
  // 👑 PREMIUM TRAVEL INVOICE PDF DESIGN
  // =========================================================================
  const generateTravelInvoicePDF = (bk: FirestoreBooking) => {
    setGeneratingId(bk.id);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const totalGrossFare = bk.totalBilledAmount || bk.amountPaid;

      // Base canvas white
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, "F");

      // Right Side Slanted Banner
      doc.setFillColor(11, 41, 107);
      doc.rect(148, 0, 62, 34, "F"); 
      doc.triangle(130, 0, 148, 0, 148, 34, "F"); 

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("TRAVEL BILL", 158, 12);

      doc.setFillColor(234, 131, 0); 
      doc.roundedRect(156, 17, 44, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text("CUSTOMER COPY", 165, 21.2);

      // Left Brand Panel
      doc.setTextColor(11, 41, 107);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("KHATU", 15, 16);
      
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text("RIDES TRAVELS CO.", 15, 21);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(234, 131, 0);
      doc.text("Branch - ", 15, 27);
      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "normal");
      doc.text("Transport Nagar, Korba (CG)", 29, 27);

      doc.text("www.khaturidescg.in", 15, 32);
      doc.setFont("helvetica", "bold");
      doc.text("Call: +91 9244137353", 15, 37);

      // Metadata Row
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice No.  :  ${bk.invoiceId}`, 145, 44);
      doc.text(`Date             :  ${bk.pickupDate.split("-").reverse().join("/") || "07/07/2026"}`, 145, 49);

      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.4);
      doc.line(15, 54, 195, 54);

      doc.setTextColor(15, 23, 42);
      doc.setFont("times", "italic");
      doc.setFontSize(11);
      doc.text("Safe Journey, Happy Memories", 105, 59, { align: "center" });

      doc.line(15, 63, 195, 63);

      // Customer Details Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 68, 86, 42, 2, 2, "FD");
      
      doc.setFillColor(11, 41, 107);
      doc.roundedRect(15, 68, 45, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("CUSTOMER DETAILS", 19, 72);

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal"); doc.text("Customer Name", 18, 81); doc.text(":", 46, 81); doc.setFont("helvetica", "bold"); doc.text(bk.customerName, 49, 81);
      doc.setFont("helvetica", "normal"); doc.text("Customer Contact", 18, 88); doc.text(":", 46, 88); doc.setFont("helvetica", "bold"); doc.text("+91 " + bk.customerPhone, 49, 88);
      doc.setFont("helvetica", "normal"); doc.text("Pick up Location", 18, 95); doc.text(":", 46, 95); doc.setFont("helvetica", "bold"); doc.text(bk.pickup, 49, 95);
      doc.setFont("helvetica", "normal"); doc.text("Pickup Date & Time", 18, 102); doc.text(":", 46, 102); doc.setFont("helvetica", "bold"); doc.text(`${bk.pickupDate.split("-").reverse().join("/")} / ${bk.pickupTime}`, 49, 102);

      // Trip Details Card
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(109, 68, 86, 42, 2, 2, "FD");

      doc.setFillColor(11, 41, 107);
      doc.roundedRect(109, 68, 40, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("TRIP DETAILS", 114, 72);

      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal"); doc.text("Drop Location", 112, 81); doc.text(":", 140, 81); doc.setFont("helvetica", "bold"); doc.text(bk.drop, 143, 81);
      doc.setFont("helvetica", "normal"); doc.text("Vehicle Type", 112, 88); doc.text(":", 140, 88); doc.setFont("helvetica", "bold"); doc.text(bk.vehicleLabel.replace(/ \(.*\)/, ""), 143, 88);
      doc.setFont("helvetica", "normal"); doc.text("Driver Allocated", 112, 95); doc.text(":", 140, 95); doc.setFont("helvetica", "bold"); doc.text(bk.driverName || "Not Assigned", 143, 95);
      doc.setFont("helvetica", "normal"); doc.text("Vehicle Reg No", 112, 102); doc.text(":", 140, 102); doc.setFont("helvetica", "bold"); doc.text(bk.vehicleNo || "N/A", 143, 102);

      // Fare Table
      doc.setFillColor(11, 41, 107);
      doc.roundedRect(15, 117, 38, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("FARE SUMMARY", 19, 121);

      autoTable(doc, {
        startY: 124,
        theme: "grid",
        headStyles: { fillColor: [11, 41, 107], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
        head: [["PARTICULARS DESCRIPTION", "AMOUNT (INR)"]],
        body: [
          [`Contract Fleet Fare Booking Model (${bk.bookingType === "oneway" ? "One Way" : "Round Trip"})`, `${totalGrossFare.toLocaleString("en-IN")}.00`],
          ["State Toll Taxes & Border Entry Clearance Charges", "INCLUDED IN THE CONTRACT"],
          ["Night Halting Allowances & Driver Perks Costing Packages", "INCLUDED IN THE CONTRACT"]
        ],
        styles: { fontSize: 8.5, cellPadding: 3.5, textColor: [30, 41, 59] },
        columnStyles: { 1: { halign: "right", cellWidth: 45, fontStyle: "bold" } }
      });

      let finalTableY = (doc as any).lastAutoTable.finalY;

      // Total Fare Border Box
      doc.setDrawColor(234, 131, 0);
      doc.setLineWidth(0.5);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(131, finalTableY + 4, 64, 11, 1.5, 1.5, "FD");
      
      doc.setTextColor(11, 41, 107);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`Rs. ${totalGrossFare.toLocaleString("en-IN")}.00`, 191, finalTableY + 11.2, { align: "right" });

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.text("TOTAL FARE (All-Inclusive Contract Price)", 15, finalTableY + 10.5);

      // Amount in English Words Strip Box
      let wordsBoxY = finalTableY + 19;
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(255, 255, 255);
      doc.rect(15, wordsBoxY, 180, 12, "S");

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.text("AMOUNT IN WORDS (ENGLISH)", 18, wordsBoxY + 4);
      
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(convertNumberToWords(totalGrossFare), 18, wordsBoxY + 8.5);

      // Split Total blocks
      doc.setLineWidth(0.3);
      doc.line(131, wordsBoxY, 131, wordsBoxY + 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text("NET PAYABLE", 134, wordsBoxY + 4);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(`Rs. ${totalGrossFare.toLocaleString("en-IN")}.00`, 134, wordsBoxY + 8.5);

      // Terms & Signature blocks
      let bottomY = wordsBoxY + 18;
      
      doc.setFillColor(241, 245, 249);
      doc.rect(58, bottomY, 94, 5, "F");
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("Note: This is a computer generated bill. No GST applicable.", 105, bottomY + 3.8, { align: "center" });

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.text("TERMS & CONDITIONS", 45, bottomY + 14, { align: "center" });
      
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.text("• This bill is valid for the mentioned trip manifest only.", 15, bottomY + 20);
      doc.text("• No refund for final milestone drop cancellations.", 15, bottomY + 24);
      doc.text("• Extra custom route deviations apply flat adjustments.", 15, bottomY + 28);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("AUTHORIZED SIGNATURE", 165, bottomY + 14, { align: "center" });

      doc.setTextColor(11, 41, 107);
      doc.setFont("times", "italic");
      doc.setFontSize(16);
      doc.text("Raman", 165, bottomY + 24, { align: "center" });

      // Bottom Base Strip Band Line Accent
      doc.setFillColor(11, 41, 107);
      doc.rect(0, 291, 210, 6, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.2);
      doc.text("✔ Trusted Rides. On Time. Every Time.", 15, 295);
      doc.text("24x7 Customer Support", 105, 295, { align: "center" });
      doc.text("www.khaturidescg.in", 195, 295, { align: "right" });

      // 👑 FIXED FILENAME: Cleans strings to match customer name and raw invoice format safely
      const cleanCustomerName = bk.customerName.replace(/[^a-zA-Z0-9]/g, "_");
      const cleanInvoiceId = bk.invoiceId.replace(/[^a-zA-Z0-9]/g, "_");
      doc.save(`Khatu_Rides_Bill_${cleanCustomerName}_${cleanInvoiceId}.pdf`);

    } catch (err) {
      console.error(err);
      alert("Error building premium canvas layout.");
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
            <h1 className="text-lg font-black uppercase tracking-wider text-white">KHATU RIDES CONTROL DESK</h1>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase mt-1">Manual Dispatching Matrix & Live Online Transaction Logs</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button type="button" onClick={() => setShowManualForm(true)} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-widest py-3 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2">
            <Plus size={16} /> Create Manual Booking
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Quick Counters row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Cash Transacted</span>
            <div className="text-xl font-black text-emerald-400 tracking-tight mt-1">₹{analyticsCounters.grossCollections.toLocaleString("en-IN")}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Manual Entries</span>
            <div className="text-xl font-black text-indigo-400 tracking-tight mt-1">{analyticsCounters.manualCount} Trips</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Website Online Logs</span>
            <div className="text-xl font-black text-amber-500 tracking-tight mt-1">{analyticsCounters.onlineCount} Leads</div>
          </div>
          <div className="bg-gradient-to-r from-orange-600 to-[#d8551b] p-4 rounded-2xl text-left col-span-2 lg:col-span-1">
            <span className="text-[10px] font-black text-white/80 uppercase tracking-wider">Filtered Trips</span>
            <div className="text-xl font-black text-white tracking-tight mt-1">{analyticsCounters.grossTripsCount} Trips Listed</div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:max-w-xl">
            <div>
              <input type="text" placeholder="Search Name, Phone, Invoice, Driver..." value={searchTerm} onChange={(e) => setSearchFilter(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-orange-500 placeholder:text-slate-600 shadow-inner" />
            </div>
            <div>
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"/>
            </div>
          </div>

          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
            {[
              { id: "ALL", label: "All Records" },
              { id: "MANUAL", label: "Manual Offline Only" },
              { id: "ONLINE", label: "Website Online" }
            ].map((tab) => (
              <button key={tab.id} type="button" onClick={() => setStatusFilter(tab.id)} className={`px-4 py-2 text-center text-[10px] font-black uppercase rounded-lg tracking-wider transition whitespace-nowrap ${statusFilter === tab.id ? "bg-orange-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Records Listing Container */}
        {loading ? (
          <div className="py-20 text-center text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">🔄 Loading Travel Data Feeds...</div>
        ) : filteredBookingsArray.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl py-14 text-center text-xs font-bold text-slate-500 uppercase">📭 Matrix empty. Create manual bookings or wait for user actions.</div>
        ) : (
          <div className="space-y-4">
            {filteredBookingsArray.map((bk) => (
              <div key={bk.id} className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col shadow-md">
                <div className="p-5 flex flex-col lg:flex-row items-center justify-between gap-5 text-left">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full lg:w-auto">
                    <span className="text-3xl shrink-0 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      {bk.paymentMode === "MANUAL_OFFLINE" ? "📝" : "⚡"}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-black text-white">{bk.customerName}</h3>
                        <span className="bg-slate-900 px-2 py-0.5 rounded text-[9px] font-black text-orange-400 uppercase border border-slate-800 tracking-wider">{bk.invoiceId}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${bk.paymentMode === "MANUAL_OFFLINE" ? "bg-indigo-950/40 border-indigo-800 text-indigo-400" : "bg-emerald-950/40 border-emerald-800 text-emerald-400"}`}>{bk.paymentMode === "MANUAL_OFFLINE" ? "MANUAL ENTRY" : "ONLINE GATEWAY"}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 mt-3 text-[11px] font-bold text-slate-400">
                        <p>📞 <span className="text-slate-600 font-medium">Passenger Phone:</span> <a href={`tel:${bk.customerPhone}`} className="text-indigo-400 underline">{bk.customerPhone}</a></p>
                        <p>🚖 <span className="text-slate-600 font-medium">Fleet Segment:</span> <span className="text-white">{bk.vehicleLabel}</span></p>
                        <p>📍 <span className="text-slate-600 font-medium">From:</span> <span className="text-slate-200">{bk.pickup}</span></p>
                        <p>🏁 <span className="text-slate-600 font-medium">To:</span> <span className="text-slate-200">{bk.drop}</span></p>
                        <p>📅 <span className="text-slate-600 font-medium">Journey Schedule:</span> <span className="text-slate-200">{convertToIndianDate(bk.pickupDate)} at {formatTimeToAMPM(bk.pickupTime)}</span></p>
                        <p>🔄 <span className="text-slate-600 font-medium">Trip Type Model:</span> <span className="text-orange-400 uppercase">{bk.bookingType}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-none border-slate-900 pt-4 lg:pt-0">
                    <div className="text-left bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 text-[11px] font-bold space-y-0.5 min-w-[180px] w-full sm:w-auto">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">👨‍✈️ Driver Allocation</span>
                      <p><span className="text-slate-500">Driver:</span> <span className="text-white font-black">{bk.driverName}</span></p>
                      <p><span className="text-slate-500">Cab No:</span> <span className="text-white font-black">{bk.vehicleNo}</span></p>
                      <p><span className="text-slate-500">Phone:</span> <span className="text-indigo-400 underline">{bk.driverPhone}</span></p>
                    </div>
                    <div className="text-center sm:text-right min-w-[120px]">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Total Taye rate</span>
                      <div className="text-xl font-black text-white tracking-tight mt-0.5">₹{(bk.totalBilledAmount || bk.amountPaid).toLocaleString("en-IN")}</div>
                      <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">Paid: ₹{bk.amountPaid.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-900/40 border-t border-slate-950 py-2.5 px-5 flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-[10px] font-medium text-slate-500">System Token Ref ID: <span className="text-slate-400 font-mono">{bk.id.substring(0,14).toUpperCase()}</span></div>
                  <button type="button" onClick={() => generateTravelInvoicePDF(bk)} disabled={generatingId === bk.id} className="bg-orange-600 hover:bg-orange-700 disabled:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl transition shadow-md flex items-center gap-1.5">
                    {generatingId === bk.id ? "🔄 Generating Bill..." : "📄 Share Travel Bill PDF"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Booking Input Form Sheet */}
      {showManualForm && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <form onSubmit={handleSaveManualBooking} className="w-full max-w-2xl bg-slate-950 border border-slate-800 text-slate-100 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl text-left my-auto max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-white">Create Manual Offline Registry</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Darj karein offline phone bookings aur customized pricing tariffs</p>
              </div>
              <button type="button" onClick={() => setShowManualForm(false)} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 text-sm font-bold">✕</button>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 space-y-3">
              <span className="text-[9px] font-black uppercase text-orange-400 tracking-widest block">👤 Customer Identity Logs</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Passenger Name *</label>
                  <input type="text" value={custName} onChange={(e) => setCustName(e.target.value)} required className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-orange-500 placeholder:text-slate-600" placeholder="Type passenger full name..." />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Mobile Number *</label>
                  <input type="tel" maxLength={10} value={custPhone} onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, ""))} required className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-orange-500" placeholder="10-digit number..." />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 space-y-3">
              <span className="text-[9px] font-black uppercase text-orange-400 tracking-widest block">📍 Journey Trajectory & Fleet Settings</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">From (Pickup Location) *</label>
                  <input type="text" value={pickupLoc} onChange={(e) => setPickupLoc(e.target.value)} required className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none" placeholder="e.g. Korba" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">To (Drop Destination) *</label>
                  <input type="text" value={dropLoc} onChange={(e) => setDropLoc(e.target.value)} required className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none" placeholder="e.g. Raipur" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Pickup Date *</label>
                  <input type="date" value={pDate} onChange={(e) => setPDate(e.target.value)} required className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Pickup Time *</label>
                  <input type="time" value={pTime} onChange={(e) => setPTime(e.target.value)} required className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Vehicle Segment Choice</label>
                  <select value={vLabel} onChange={(e) => setVLabel(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none">
                    <option value="Maruti Suzuki Dzire (Sedan)">Maruti Suzuki Dzire (Sedan)</option>
                    <option value="Maruti Suzuki Ertiga (SUV)">Maruti Suzuki Ertiga (SUV)</option>
                    <option value="Toyota Innova Crysta (Premium)">Toyota Innova Crysta (Premium)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Trip Category</label>
                  <select value={bType} onChange={(e) => setBType(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none">
                    <option value="oneway">One Way Run</option>
                    <option value="roundtrip">Round Trip</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 space-y-3">
              <span className="text-[9px] font-black uppercase text-orange-400 tracking-widest block">👨‍✈️ Driver & Asset Sheet (Optional)</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Driver Full Name</label>
                  <input type="text" value={dName} onChange={(e) => setDName(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none" placeholder="Kamlesh Kumar" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Vehicle Registration No</label>
                  <input type="text" value={vNo} onChange={(e) => setVNo(e.target.value.toUpperCase())} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none" placeholder="CG10CC8807" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Driver Contact Number</label>
                  <input type="tel" maxLength={10} value={dPhone} onChange={(e) => setDPhone(e.target.value.replace(/\D/g, ""))} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none" placeholder="Driver mobile no..." />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 space-y-3">
              <span className="text-[9px] font-black uppercase text-orange-400 tracking-widest block">💰 Financial Contract Ledger</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Total Gross Rate *</label>
                  <input type="number" value={totalFare} onChange={(e) => setTotalFare(e.target.value)} required className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none text-emerald-400" placeholder="e.g. 1900" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Advance Token Paid</label>
                  <input type="number" value={amtPaid} onChange={(e) => setAmtPaid(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none text-white" placeholder="e.g. 500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Booking Status Model</label>
                  <select value={pMode} onChange={(e) => setPMode(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none">
                    <option value="MANUAL_OFFLINE">MANUAL OFFLINE (Cash/Pending)</option>
                    <option value="50% ADVANCE">50% ADVANCE RECEIVED ONLINE</option>
                    <option value="FULL PAYMENT">100% ADVANCE RECEIVED ONLINE</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button type="button" onClick={() => setShowManualForm(false)} className="w-full border border-slate-800 bg-slate-900 text-slate-400 font-bold text-xs uppercase py-3.5 rounded-xl transition">Cancel</button>
              <button type="submit" disabled={formLoading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-1.5">
                {formLoading ? <Loader2 className="animate-spin" size={14} /> : null}
                {formLoading ? "Saving entry..." : "Dispatch & Save Entry"}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
// components/SakhaBot.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type BotStep = "language" | "triptype" | "vehicle" | "datetime" | "route" | "confirm_details" | "final";

export default function SakhaBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<BotStep>("language");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Namaste Bhaiya! Khatu Rides Travels Co. me aapka swagat hai, Chhattisgarh ki sabse best taxi service. 🙏\n\nKripya apni bhasha select karein / Please select your language:" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");

  const [bookingState, setBookingData] = useState({
    language: "",
    tripType: "",
    vehicle: "",
    dateTime: "",
    pickup: "",
    drop: "",
    finalAmount: 0 
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const resetChatbot = () => {
    setCurrentStep("language");
    setCustName("");
    setCustPhone("");
    setBookingData({
      language: "",
      tripType: "",
      vehicle: "",
      dateTime: "",
      pickup: "",
      drop: "",
      finalAmount: 0 
    });
    setMessages([
      { id: "welcome", role: "assistant", content: "Namaste Bhaiya! Khatu Rides Travels Co. me aapka swagat hai, Chhattisgarh ki sabse best taxi service. 🙏\n\nKripya apni bhasha select karein / Please select your language:" }
    ]);
  };

  // Dynamic Dynamic Robust Pricing Engine Engine
  const evaluateFaresWithMargins = (routeText: string, vehicleType: string) => {
    const text = routeText.toLowerCase();
    const vehicle = vehicleType.toLowerCase();

    // Long Outstation State (like Ujjain to Raipur, Jagdalpur etc.)
    const isLongRoute = text.includes("ujjain") || text.includes("raipur") || text.includes("jagdalpur") || text.includes("indore");
    
    // Default Fares Calculation Matrix
    let finalFare = 2200; 

    if (isLongRoute) {
      if (text.includes("ujjain") && text.includes("raipur")) {
        // Ujjain to Raipur distance is approx 800Kms, calculation based on dynamic commercial slabs
        if (vehicle.includes("dzire") || vehicle.includes("sedan")) finalFare = 14500;
        else if (vehicle.includes("ertiga")) finalFare = 18500;
        else if (vehicle.includes("crysta")) finalFare = 24000;
      } else {
        // General long routes dynamic slab
        if (vehicle.includes("dzire") || vehicle.includes("sedan")) finalFare = 4500;
        else if (vehicle.includes("ertiga")) finalFare = 6200;
        else if (vehicle.includes("crysta")) finalFare = 8500;
      }
    } else {
      // Local/Short Interstate runs inside CG
      if (vehicle.includes("dzire") || vehicle.includes("sedan")) finalFare = 2400;
      else if (vehicle.includes("ertiga")) finalFare = 3500;
      else if (vehicle.includes("crysta")) finalFare = 5500;
    }

    return finalFare;
  };

  const executeDirectPayment = async () => {
    if (!custName.trim() || custPhone.length < 10) {
      alert("⚠️ Kripya valid Name aur 10-digit Mobile Number dalein!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: bookingState.finalAmount,
          pickup: bookingState.pickup,
          drop: bookingState.drop,
          vehicleLabel: bookingState.vehicle
        }),
      });
      const orderData = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Khatu Rides Travels Co.",
        description: `Sakha AI Booking`,
        order_id: orderData.orderId,
        prefill: { name: custName, contact: custPhone },
        theme: { color: "#ea580c" },
        handler: async (response: any) => {
          await addDoc(collection(db, "bookings"), {
            invoiceId: `KRT/SAKHA/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
            customerName: custName,
            customerPhone: custPhone,
            pickup: bookingState.pickup,
            drop: bookingState.drop,
            vehicleLabel: bookingState.vehicle,
            amountPaid: bookingState.finalAmount,
            paymentMode: "FULL PAYMENT",
            source: "AI_CHATBOT_SAKHA",
            createdAt: serverTimestamp()
          });

          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), role: "assistant", content: `🎉 Mubarak ho ${custName}! Payment successfully received ho gaya hai. Aapki booking Khatu Rides me confirmed hai!` }
          ]);
          setCurrentStep("final");
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepSelection = async (selectionValue: string) => {
    let nextStep: BotStep = currentStep;
    let updatedBookingData = { ...bookingState };

    if (currentStep === "language") {
      updatedBookingData.language = selectionValue;
      nextStep = "triptype";
    } else if (currentStep === "triptype") {
      updatedBookingData.tripType = selectionValue;
      nextStep = "vehicle";
    } else if (currentStep === "vehicle") {
      updatedBookingData.vehicle = selectionValue;
      nextStep = "datetime";
    } else if (currentStep === "datetime") {
      updatedBookingData.dateTime = selectionValue;
      nextStep = "route";
    } else if (currentStep === "route") {
      updatedBookingData.pickup = selectionValue.split("-")[0] || selectionValue;
      updatedBookingData.drop = selectionValue.split("-")[1] || "Destination";
      updatedBookingData.finalAmount = evaluateFaresWithMargins(selectionValue, updatedBookingData.vehicle);
      nextStep = "confirm_details";
    }

    setBookingData(updatedBookingData);
    setCurrentStep(nextStep);

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: selectionValue };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMsg], 
          currentStep: currentStep,
          bookingData: updatedBookingData 
        }),
      });
      const data = await response.json();
      let cleanReply = data.reply;

      if (cleanReply.includes("[TRIGGER_CHECKOUT:")) {
        cleanReply = cleanReply.replace(/\[TRIGGER_CHECKOUT:.*?\]/g, "");
      }

      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: cleanReply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleStepSelection(input);
    setInput("");
  };

  return (
    <>
      {/* FLOATING ACTION ICON MATRIX */}
      <div className="fixed bottom-24 right-4 z-[9999] md:bottom-6 md:right-6 flex flex-col items-center gap-1.5 select-none">
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
              className="bg-slate-950 text-white font-black text-[10px] md:text-[11px] px-3 py-1 rounded-full border border-orange-500 shadow-[0_4px_12px_rgba(0,0,0,0.3)] tracking-wide uppercase whitespace-nowrap text-center relative"
            >
              Book with KRT Sakha
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-950" />
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 text-white shadow-[0_0_22px_rgba(234,88,12,0.65)] hover:scale-110 transition-all duration-300 group"
        >
          <span className="absolute inset-0 rounded-full bg-orange-500/30 scale-115 animate-ping group-hover:hidden" />
          <span className="text-2xl filter drop-shadow-md">{isOpen ? "✕" : "🤖"}</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.95 }} 
            // FIXED HEADER CLIPPING: Changed positioning from absolute-bottom stack to accurate top safe viewport tracking on desktop
            className="fixed inset-y-0 right-0 z-[9999] w-full h-[100dvh] md:inset-y-auto md:bottom-24 md:right-6 md:w-[390px] md:h-[580px] bg-white md:rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col text-left text-slate-900 transition-all"
          >
            {/* CONTROL DESK HEADER BAR */}
            <div className="bg-slate-950 px-4 py-4 flex flex-shrink-0 items-center justify-between border-b border-orange-500 shadow-md z-10">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Sakha AI: Control Desk</h3>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={resetChatbot} 
                  title="Restart Conversation" 
                  className="p-1 text-slate-400 hover:text-orange-400 text-sm transition-colors"
                >
                  🔄
                </button>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)} 
                  title="Minimize / Close" 
                  className="p-1 text-slate-400 hover:text-red-500 text-base font-black transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* CHAT MESSAGES BODY STREAM CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/80 text-xs min-h-0">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 font-bold whitespace-pre-line leading-relaxed shadow-xs ${m.role === "user" ? "bg-orange-600 text-white rounded-tr-xs" : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              
              {/* STRICT VERIFICATION BOX MATRIX */}
              {currentStep === "confirm_details" && (
                <div className="bg-white border-2 border-orange-500 rounded-2xl p-4 space-y-3 shadow-md mx-2 animate-fade-in">
                  <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded">Verification Box</span>
                  <p className="text-xs font-bold text-slate-800">Booking lock karne ke liye details fill karein:</p>
                  
                  <input 
                    type="text" 
                    placeholder="Customer Full Name" 
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold text-xs focus:outline-none focus:border-orange-500"
                  />
                  <input 
                    type="tel" 
                    maxLength={10}
                    placeholder="10-Digit Phone Number" 
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold text-xs focus:outline-none focus:border-orange-500"
                  />

                  <div className="bg-slate-950 text-white p-3 rounded-xl text-center space-y-1">
                    <span className="text-[9px] font-black uppercase text-orange-400 tracking-widest block">Total Calculated Fare</span>
                    <span className="text-xl font-black block text-white">₹{bookingState.finalAmount}.00</span>
                    <span className="text-[9px] text-slate-400 font-bold block">Best price guaranteed by Khatu Rides</span>
                  </div>

                  <button 
                    onClick={executeDirectPayment}
                    className="w-full bg-orange-600 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-orange-700 shadow-md transition-all active:scale-98"
                  >
                    🚀 Confirm & Pay Now
                  </button>
                </div>
              )}

              {isLoading && <div className="text-slate-400 font-bold animate-pulse pl-1">Sakha processing step...</div>}
              <div ref={chatEndRef} />
            </div>

            {/* DYNAMIC SELECTION CONTROLLER MODULE */}
            <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-1.5 justify-center flex-shrink-0">
              {currentStep === "language" && (
                <>
                  <button type="button" onClick={() => handleStepSelection("Hindi 🇮🇳")} className="bg-white border border-slate-300 px-3.5 py-2 rounded-xl font-bold text-[11px] hover:bg-orange-50 shadow-xs">Hindi 🇮🇳</button>
                  <button type="button" onClick={() => handleStepSelection("English 🇬🇧")} className="bg-white border border-slate-300 px-3.5 py-2 rounded-xl font-bold text-[11px] hover:bg-orange-50 shadow-xs">English 🇬🇧</button>
                </>
              )}
              {currentStep === "triptype" && (
                <>
                  <button type="button" onClick={() => handleStepSelection("oneway")} className="bg-white border border-slate-300 px-4 py-2 rounded-xl font-bold text-[11px] uppercase hover:bg-orange-50 shadow-xs">One-way Run</button>
                  <button type="button" onClick={() => handleStepSelection("roundtrip")} className="bg-white border border-slate-300 px-4 py-2 rounded-xl font-bold text-[11px] uppercase hover:bg-orange-50 shadow-xs">Round Trip</button>
                </>
              )}
              {currentStep === "vehicle" && (
                <>
                  <button type="button" onClick={() => handleStepSelection("Maruti Suzuki Dzire (Sedan)")} className="bg-white border border-slate-300 px-2.5 py-2 rounded-xl font-bold text-[10px] hover:bg-orange-50 shadow-xs">Sedan (Dzire)</button>
                  <button type="button" onClick={() => handleStepSelection("Maruti Suzuki Ertiga (SUV)")} className="bg-white border border-slate-300 px-2.5 py-2 rounded-xl font-bold text-[10px] hover:bg-orange-50 shadow-xs">Ertiga (SUV)</button>
                  <button type="button" onClick={() => handleStepSelection("Toyota Innova Crysta")} className="bg-white border border-slate-300 px-2.5 py-2 rounded-xl font-bold text-[10px] hover:bg-orange-50 shadow-xs">Crysta Premium</button>
                </>
              )}
            </div>

            {/* TEXT FORM BAR ENTRY ENTRY FIELD */}
            <form onSubmit={handleSubmitText} className="p-2 border-t border-slate-200 bg-white flex gap-1.5 pb-safe-bottom flex-shrink-0">
              <input
                type="text"
                value={input}
                disabled={currentStep === "confirm_details" || currentStep === "final"}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentStep === "datetime" ? "e.g. 15th July, 10:00 AM" : currentStep === "route" ? "e.g. Ujjain-Raipur" : "Type your response..."}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
              <button 
                type="submit" 
                disabled={currentStep === "confirm_details" || currentStep === "final"}
                className="bg-slate-950 text-white font-black text-[10px] px-4 rounded-xl uppercase tracking-wider hover:bg-orange-600 transition disabled:opacity-40"
              >
                Next
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
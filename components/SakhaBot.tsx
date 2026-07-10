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
  stepContext?: BotStep; 
};

type BotStep = "language" | "pickup_loc" | "drop_loc" | "triptype" | "vehicle" | "datetime" | "confirm_details" | "final";

export default function SakhaBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<BotStep>("language");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Namaste Bhaiya! Khatu Rides Travels Co. me aapka swagat hai, Chhattisgarh ki sabse best taxi service. 🙏\n\nKripya apni bhasha select karein / Please select your language:", stepContext: "language" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);

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

  // GOOGLE PLACES NATIVE INTERCEPTOR
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).google && (currentStep === "pickup_loc" || currentStep === "drop_loc") && autocompleteRef.current) {
      const autocomplete = new (window as any).google.maps.places.Autocomplete(autocompleteRef.current, {
        componentRestrictions: { country: "in" },
        fields: ["formatted_address"],
        types: ["(cities)"]
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setInput(place.formatted_address);
        }
      });
    }
  }, [currentStep, isOpen]);

  const resetChatbot = () => {
    setCurrentStep("language");
    setCustName("");
    setCustPhone("");
    setBookingData({ language: "", tripType: "", vehicle: "", dateTime: "", pickup: "", drop: "", finalAmount: 0 });
    setMessages([
      { id: "welcome", role: "assistant", content: "Namaste Bhaiya! Khatu Rides Travels Co. me aapka swagat hai, Chhattisgarh ki sabse best taxi service. 🙏\n\nKripya apni bhasha select karein / Please select your language:", stepContext: "language" }
    ]);
  };

  const executeDirectPayment = async () => {
    if (!custName.trim() || custPhone.length < 10) {
      alert("⚠️ Valid details enter karein!");
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
        order_id: orderData.orderId,
        prefill: { name: custName, contact: custPhone },
        theme: { color: "#ea580c" },
        handler: async () => {
          const invoiceNum = `KRT/SAKHA/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`;
          await addDoc(collection(db, "bookings"), {
            invoiceId: invoiceNum,
            customerName: custName,
            customerPhone: custPhone,
            pickup: bookingState.pickup,
            drop: bookingState.drop,
            vehicleLabel: bookingState.vehicle,
            amountPaid: bookingState.finalAmount,
            source: "AI_CHATBOT_SAKHA",
            createdAt: serverTimestamp()
          });

          // Triggers final Ticket generation payload
          setIsLoading(true);
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              messages: [...messages, { role: "user", content: "Payment successful" }], 
              currentStep: "final", 
              bookingData: { ...bookingState, invoiceNum, custName } 
            }),
          });
          const data = await response.json();

          setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: data.reply }]);
          setCurrentStep("final");
          setIsLoading(false);
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleStepSelection = async (selectionValue: string) => {
    if (isLoading) return;

    let nextStep: BotStep = currentStep;
    let updatedBookingData = { ...bookingState };

    // 👑 STRICT CORRECT SHIFT FLOW SEQUENCE ORDER
    if (currentStep === "language") { updatedBookingData.language = selectionValue; nextStep = "pickup_loc"; }
    else if (currentStep === "pickup_loc") { updatedBookingData.pickup = selectionValue; nextStep = "drop_loc"; }
    else if (currentStep === "drop_loc") { updatedBookingData.drop = selectionValue; nextStep = "triptype"; }
    else if (currentStep === "triptype") { updatedBookingData.tripType = selectionValue; nextStep = "vehicle"; }
    else if (currentStep === "vehicle") { updatedBookingData.vehicle = selectionValue; nextStep = "datetime"; }
    else if (currentStep === "datetime") { updatedBookingData.dateTime = selectionValue; nextStep = "confirm_details"; }

    setBookingData(updatedBookingData);
    setCurrentStep(nextStep);

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: selectionValue };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: updatedMessages, 
          currentStep: nextStep, 
          bookingData: updatedBookingData 
        }),
      });
      const data = await response.json();
      let cleanReply = data.reply;

      if (cleanReply.includes("[TRIGGER_CHECKOUT:")) {
        cleanReply = cleanReply.replace(/\[TRIGGER_CHECKOUT:.*?\]/g, "");
      }

      const fareRegexExtractor = cleanReply.match(/Rs\.\s*(\d+)/i) || cleanReply.match(/₹\s*(\d+)/);
      if (fareRegexExtractor && fareRegexExtractor[1]) {
        const extractedAmount = parseInt(fareRegexExtractor[1], 10);
        setBookingData(prev => ({ ...prev, finalAmount: extractedAmount }));
      }

      setMessages((prev) => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: cleanReply,
        stepContext: nextStep 
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleStepSelection(input);
    setInput("");
  };

  return (
    <>
      <div className="fixed bottom-24 right-4 z-[9999] md:bottom-6 md:right-6 flex flex-col items-center gap-1.5 select-none">
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-slate-950 text-white font-black text-[11px] px-3 py-1 rounded-full border border-orange-500 shadow-md uppercase tracking-wide">
              Book with KRT Sakha
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setIsOpen(!isOpen)} className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 text-white shadow-xl hover:scale-110 transition-all duration-300">
          <span className="text-2xl">{isOpen ? "✕" : "🤖"}</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-0 right-0 z-[9999] w-full h-[100dvh] md:bottom-24 md:right-6 md:w-[390px] md:h-[580px] bg-white md:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-900 text-left">
            <div className="bg-slate-950 px-4 py-4 flex flex-shrink-0 items-center justify-between border-b border-orange-500 shadow-md">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Sakha AI: Control Desk</h3>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={resetChatbot} className="p-1 text-slate-400 hover:text-orange-400">🔄</button>
                <button type="button" onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-red-500 font-black">✕</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/80 text-xs min-h-0">
              {messages.map((m) => (
                <div key={m.id} className="space-y-2">
                  <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 font-bold whitespace-pre-line leading-relaxed shadow-sm ${m.role === "user" ? "bg-orange-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"}`}>
                      {m.content}
                    </div>
                  </div>

                  {/* INLINE ROW SYNCHRONIZED OPTIONS BUTTONS */}
                  {m.role === "assistant" && m.stepContext === "language" && currentStep === "language" && (
                    <div className="flex gap-2 pl-2 animate-fade-in">
                      <button type="button" onClick={() => handleStepSelection("Hindi 🇮🇳")} className="bg-white border border-slate-300 px-3 py-1.5 rounded-xl font-bold hover:bg-orange-50 shadow-sm">Hindi 🇮🇳</button>
                      <button type="button" onClick={() => handleStepSelection("English 🇬🇧")} className="bg-white border border-slate-300 px-3 py-1.5 rounded-xl font-bold hover:bg-orange-50 shadow-sm">English 🇬🇧</button>
                    </div>
                  )}
                  {m.role === "assistant" && m.stepContext === "triptype" && currentStep === "triptype" && (
                    <div className="flex gap-2 pl-2 animate-fade-in">
                      <button type="button" onClick={() => handleStepSelection("One-way")} className="bg-white border border-slate-300 px-3 py-1.5 rounded-xl font-bold uppercase hover:bg-orange-50 shadow-sm">One-way</button>
                      <button type="button" onClick={() => handleStepSelection("Round Trip")} className="bg-white border border-slate-300 px-3 py-1.5 rounded-xl font-bold uppercase hover:bg-orange-50 shadow-sm">Round Trip</button>
                    </div>
                  )}
                  {m.role === "assistant" && m.stepContext === "vehicle" && currentStep === "vehicle" && (
                    <div className="flex flex-wrap gap-2 pl-2 animate-fade-in">
                      <button type="button" onClick={() => handleStepSelection("Sedan (Dzire)")} className="bg-white border border-slate-300 px-3 py-1.5 rounded-xl font-bold text-[10px] hover:bg-orange-50 shadow-sm">Sedan (Dzire)</button>
                      <button type="button" onClick={() => handleStepSelection("Ertiga (SUV)")} className="bg-white border border-slate-300 px-3 py-1.5 rounded-xl font-bold text-[10px] hover:bg-orange-50 shadow-sm">Ertiga (SUV)</button>
                      <button type="button" onClick={() => handleStepSelection("Innova Crysta")} className="bg-white border border-slate-300 px-3 py-1.5 rounded-xl font-bold text-[10px] hover:bg-orange-50 shadow-sm">Innova Crysta</button>
                    </div>
                  )}
                </div>
              ))}
              
              {currentStep === "confirm_details" && (
                <div className="bg-white border-2 border-orange-500 rounded-2xl p-4 space-y-3 shadow-md mx-2">
                  <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded">Verification Box</span>
                  <input type="text" placeholder="Customer Full Name" value={custName} onChange={(e) => setCustName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs bg-slate-50 focus:border-orange-500 outline-none" />
                  <input type="tel" maxLength={10} placeholder="10-Digit Phone Number" value={custPhone} onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, ""))} className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs bg-slate-50 focus:border-orange-500 outline-none" />
                  <div className="bg-slate-950 text-white p-3 rounded-xl text-center"><span className="text-xl font-black">₹{bookingState.finalAmount}.00</span></div>
                  <button onClick={executeDirectPayment} className="w-full bg-orange-600 text-white font-black py-3 rounded-xl text-xs uppercase hover:bg-orange-700 shadow-md transition-all">🚀 Confirm & Pay Now</button>
                </div>
              )}
              {isLoading && <div className="text-slate-400 font-bold animate-pulse pl-1">Sakha processing step...</div>}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSubmitText} className="p-2 border-t border-slate-200 bg-white flex gap-1.5 pb-safe-bottom flex-shrink-0">
              <input
                ref={autocompleteRef}
                type="text"
                value={input}
                disabled={currentStep === "confirm_details" || currentStep === "final" || isLoading}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isLoading ? "Sakha is thinking..." :
                  currentStep === "pickup_loc" ? "Type Pickup City..." : 
                  currentStep === "drop_loc" ? "Type Drop Destination..." : 
                  currentStep === "datetime" ? "e.g. 15th July, 10:00 AM" : "Type response here..."
                }
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500 disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={currentStep === "confirm_details" || currentStep === "final" || isLoading || !input.trim()} 
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
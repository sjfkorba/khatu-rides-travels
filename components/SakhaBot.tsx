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

type BotStep =
  | "language"
  | "pickup_loc"
  | "drop_loc"
  | "triptype"
  | "vehicle"
  | "datetime"
  | "confirm_details"
  | "final";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  stepContext?: BotStep;
  ticketData?: {
    pickup: string;
    drop: string;
    vehicle: string;
    tripType: string;
    totalFare: number;
    advanceFare: number;
  };
};

export default function SakhaBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<BotStep>("language");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Namaste Bhaiya! Khatu Rides Travels Co. me aapka swagat hai. 🙏\n\nKripya apni bhasha select karein / Please select your language:",
      stepContext: "language",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);

  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");

  const [bookingState, setBookingData] = useState({
    language: "",
    tripType: "",
    vehicle: "",
    dateTime: "",
    pickup: "",
    drop: "",
    finalAmount: 0,
    advanceAmount: 0,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const fetchLiveSuggestions = async (val: string) => {
    if (val.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestionsList(false);
      return;
    }

    try {
      const response = await fetch(`/api/places-autocomplete?input=${encodeURIComponent(val)}`);
      const data = await response.json();

      if (data?.predictions) {
        const results = data.predictions.map((p: any) => p.description);
        setSuggestions(results);
        setShowSuggestionsList(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setShowSuggestionsList(false);
      }
    }

    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const resetChatbot = () => {
    setCurrentStep("language");
    setCustName("");
    setCustPhone("");
    setInput("");
    setSuggestions([]);
    setShowSuggestionsList(false);
    setBookingData({
      language: "",
      tripType: "",
      vehicle: "",
      dateTime: "",
      pickup: "",
      drop: "",
      finalAmount: 0,
      advanceAmount: 0,
    });
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Namaste Bhaiya! Khatu Rides Travels Co. me aapka swagat hai. 🙏\n\nKripya apni bhasha select karein / Please select your language:",
        stepContext: "language",
      },
    ]);
  };

  const executeDirectPayment = async () => {
    if (!custName.trim() || custPhone.length < 10) {
      alert("⚠️ Valid details fill karein!");
      return;
    }

    if (!bookingState.advanceAmount || bookingState.advanceAmount <= 0) {
      alert("⚠️ Fare load nahi hua hai. Please dobara confirm karein.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: bookingState.advanceAmount,
          pickup: bookingState.pickup,
          drop: bookingState.drop,
          vehicleLabel: bookingState.vehicle,
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
        theme: { color: "#f97316" },
        handler: async () => {
          const invoiceNum = `KRT/SAKHA/${new Date().getFullYear()}/${Math.floor(
            10000 + Math.random() * 90000
          )}`;

          await addDoc(collection(db, "bookings"), {
            invoiceId: invoiceNum,
            customerName: custName,
            customerPhone: custPhone,
            pickup: bookingState.pickup,
            drop: bookingState.drop,
            vehicleLabel: bookingState.vehicle,
            totalAmount: bookingState.finalAmount,
            advancePaid: bookingState.advanceAmount,
            source: "AI_CHATBOT_SAKHA",
            createdAt: serverTimestamp(),
          });

          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [...messages, { role: "user", content: "Payment successful" }],
              currentStep: "final",
              bookingData: {
                ...bookingState,
                invoiceNum,
                custName,
              },
            }),
          });

          const data = await response.json();

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: data.reply,
              stepContext: "final",
            },
          ]);

          setCurrentStep("final");
          setIsLoading(false);
        },
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

    setShowSuggestionsList(false);

    let nextStep: BotStep = currentStep;
    let updatedBookingData = { ...bookingState };

    if (currentStep === "language") {
      updatedBookingData.language = selectionValue.includes("Hindi") ? "Hindi" : "English";
      nextStep = "pickup_loc";
    } else if (currentStep === "pickup_loc") {
      updatedBookingData.pickup = selectionValue;
      nextStep = "drop_loc";
    } else if (currentStep === "drop_loc") {
      updatedBookingData.drop = selectionValue;
      nextStep = "triptype";
    } else if (currentStep === "triptype") {
      updatedBookingData.tripType = selectionValue;
      nextStep = "vehicle";
    } else if (currentStep === "vehicle") {
      updatedBookingData.vehicle = selectionValue;
      nextStep = "datetime";
    } else if (currentStep === "datetime") {
      updatedBookingData.dateTime = selectionValue;
      nextStep = "confirm_details";
    }

    if (currentStep === "confirm_details" && selectionValue.trim().toLowerCase() !== "confirm") {
      nextStep = "confirm_details";
    }

    setBookingData(updatedBookingData);
    setCurrentStep(nextStep);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: selectionValue,
    };

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
          bookingData: updatedBookingData,
        }),
      });

      const data = await response.json();
      let cleanReply = data.reply || "Bhaiya, please continue.";

      if (cleanReply.includes("[TRIGGER_CHECKOUT:")) {
        cleanReply = cleanReply.replace(/\[TRIGGER_CHECKOUT:.*?\]/g, "").trim();
      }

      if (data.finalAmount && data.finalAmount > 0) {
        updatedBookingData.finalAmount = Number(data.finalAmount);
        updatedBookingData.advanceAmount = Number(data.advanceAmount || 0);

        setBookingData((prev) => ({
          ...prev,
          finalAmount: Number(data.finalAmount),
          advanceAmount: Number(data.advanceAmount || 0),
        }));
      }

      let ticketObj = undefined;

      if (nextStep === "confirm_details" && Number(data.finalAmount) > 0) {
        ticketObj = {
          pickup: updatedBookingData.pickup,
          drop: updatedBookingData.drop,
          vehicle: updatedBookingData.vehicle,
          tripType: updatedBookingData.tripType,
          totalFare: Number(data.finalAmount),
          advanceFare: Number(data.advanceAmount || 0),
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: cleanReply,
          stepContext: nextStep,
          ticketData: ticketObj,
        },
      ]);
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
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-2 select-none font-sans">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-700 shadow-lg"
            >
              Book Taxi via Sakha
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_12px_30px_rgba(249,115,22,0.35)] transition-all duration-300 hover:scale-105 hover:bg-orange-600"
        >
          <span className="text-2xl font-black">{isOpen ? "✕" : "🤖"}</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-0 right-0 z-[9999] flex h-[100dvh] w-full flex-col overflow-hidden border border-slate-200 bg-[#fcfcfb] font-sans shadow-[0_20px_60px_rgba(15,23,42,0.12)] md:bottom-24 md:right-8 md:h-[85vh] md:max-h-[680px] md:w-[440px] md:rounded-[28px]"
          >
            <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div>
                  <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-800">
                    Sakha Concierge Desk
                  </h3>
                  <p className="text-[11px] text-slate-500">Instant outstation fare assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetChatbot}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-orange-300 hover:text-orange-600"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-gradient-to-b from-orange-50/30 via-[#fcfcfb] to-white p-5 text-[13px]">
              {messages.map((m) => (
                <div key={m.id} className="space-y-3">
                  <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[82%] whitespace-pre-line rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                        m.role === "user"
                          ? "rounded-tr-md border border-orange-100 bg-orange-50 text-slate-900"
                          : "rounded-tl-md border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>

                  {m.role === "assistant" && m.ticketData && (
                    <div className="mx-1 max-w-[86%] rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
                      <div className="mb-3 flex items-center justify-between border-b border-amber-200 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        <span>Fare Estimation</span>
                        <span className="text-orange-600">{m.ticketData.vehicle}</span>
                      </div>

                      <div className="space-y-1.5 text-[12px] text-slate-700">
                        <div>
                          <span className="font-medium text-slate-400">From:</span> {m.ticketData.pickup}
                        </div>
                        <div>
                          <span className="font-medium text-slate-400">To:</span> {m.ticketData.drop}
                        </div>
                        <div>
                          <span className="font-medium text-slate-400">Type:</span> {m.ticketData.tripType}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-900 p-3 text-white">
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-slate-400">
                            Total Fare
                          </div>
                          <div className="text-sm font-bold">₹{m.ticketData.totalFare}.00</div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] uppercase tracking-wide text-orange-300">
                            20% Advance
                          </div>
                          <div className="text-base font-bold text-orange-400">
                            ₹{m.ticketData.advanceFare}.00
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {m.role === "assistant" &&
                    m.stepContext === "language" &&
                    currentStep === "language" && (
                      <div className="flex gap-2.5 pl-2">
                        <button
                          type="button"
                          onClick={() => handleStepSelection("Hindi 🇮🇳")}
                          className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
                        >
                          Hindi 🇮🇳
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStepSelection("English 🇬🇧")}
                          className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
                        >
                          English 🇬🇧
                        </button>
                      </div>
                    )}

                  {m.role === "assistant" &&
                    m.stepContext === "triptype" &&
                    currentStep === "triptype" && (
                      <div className="flex gap-2.5 pl-2">
                        <button
                          type="button"
                          onClick={() => handleStepSelection("One-way")}
                          className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
                        >
                          One-way
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStepSelection("Round Trip")}
                          className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
                        >
                          Round Trip
                        </button>
                      </div>
                    )}

                  {m.role === "assistant" &&
                    m.stepContext === "vehicle" &&
                    currentStep === "vehicle" && (
                      <div className="flex flex-wrap gap-2.5 pl-2">
                        <button
                          type="button"
                          onClick={() => handleStepSelection("Sedan (Dzire)")}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
                        >
                          Sedan (Dzire)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStepSelection("Ertiga (SUV)")}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
                        >
                          Ertiga (SUV)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStepSelection("Innova Crysta")}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
                        >
                          Innova Crysta
                        </button>
                      </div>
                    )}
                </div>
              ))}

              {currentStep === "confirm_details" &&
                bookingState.advanceAmount > 0 &&
                !isLoading && (
                  <div className="mx-0.5 space-y-4 rounded-3xl border border-orange-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                    <span className="inline-block rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-600">
                      Secure Gateway
                    </span>

                    <input
                      type="text"
                      placeholder="Customer Full Name"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />

                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-Digit Phone Number"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />

                    <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-center text-white shadow-sm">
                      <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                        Total Fare: ₹{bookingState.finalAmount}.00
                      </div>
                      <div className="mt-1 text-xl font-bold text-orange-400">
                        Advance 20%: ₹{bookingState.advanceAmount}.00
                      </div>
                    </div>

                    <button
                      onClick={executeDirectPayment}
                      className="w-full rounded-2xl bg-orange-500 py-4 text-xs font-bold uppercase tracking-[0.22em] text-white shadow-[0_10px_24px_rgba(249,115,22,0.28)] transition-all hover:bg-orange-600"
                    >
                      Pay Advance Now
                    </button>
                  </div>
                )}

              {isLoading && (
                <div className="flex items-center gap-3 py-1 pl-1.5 font-semibold text-slate-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                  Sakha fare compile kar raha hai...
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSubmitText}
              className="relative flex flex-shrink-0 flex-col gap-2 border-t border-slate-200 bg-white p-4 shadow-sm"
              ref={formRef}
            >
              {showSuggestionsList &&
                suggestions.length > 0 &&
                (currentStep === "pickup_loc" || currentStep === "drop_loc") && (
                  <ul className="absolute bottom-full left-4 right-4 z-[2147483647] mb-2 max-h-44 overflow-y-auto divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-[0_-15px_35px_rgba(0,0,0,0.12)]">
                    {suggestions.map((item, idx) => (
                      <li
                        key={idx}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setInput("");
                          setShowSuggestionsList(false);
                          handleStepSelection(item);
                        }}
                        className="flex cursor-pointer items-center gap-2 px-4 py-3.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                      >
                        {currentStep === "pickup_loc" ? "🚗" : "🏁"} {item}
                      </li>
                    ))}
                  </ul>
                )}

              <div className="flex w-full gap-2.5">
                <input
                  type="text"
                  value={input}
                  disabled={currentStep === "final" || isLoading}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (currentStep === "pickup_loc" || currentStep === "drop_loc") {
                      fetchLiveSuggestions(e.target.value);
                    }
                  }}
                  onFocus={() => {
                    if (
                      input.trim().length >= 3 &&
                      (currentStep === "pickup_loc" || currentStep === "drop_loc")
                    ) {
                      setShowSuggestionsList(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestionsList(false), 200);
                  }}
                  placeholder={
                    isLoading
                      ? "Fare calculation in progress..."
                      : currentStep === "pickup_loc"
                      ? "Type Pickup City..."
                      : currentStep === "drop_loc"
                      ? "Type Drop Destination..."
                      : currentStep === "datetime"
                      ? "e.g. 15th July, 5:00 PM"
                      : currentStep === "confirm_details"
                      ? "Type 'CONFIRM' to proceed..."
                      : "Type your message..."
                  }
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={currentStep === "final" || isLoading || !input.trim()}
                  className="rounded-2xl bg-slate-900 px-5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-all duration-200 hover:bg-orange-500 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
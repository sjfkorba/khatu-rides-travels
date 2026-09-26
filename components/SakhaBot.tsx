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

const SUPPORT_PHONE = "+919244137353";
const SUPPORT_PHONE_DISPLAY = "+91 92441 37353";

type BotStep = "service" | "date" | "time" | "cab_type" | "contact_details" | "final";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  stepContext?: BotStep;
};

const SERVICES = [
  "Share One Way Cab",
  "One Way Cab",
  "Local Package",
  "Outstation Cab",
];

const CAB_TYPES = [
  "Sedan (Dzire / Etios)",
  "SUV (Ertiga)",
  "Innova Crysta",
];

export default function SakhaBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<BotStep>("service");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [bookingQuery, setBookingQuery] = useState({
    service: "",
    journeyDate: "",
    pickupTime: "",
    cabType: "",
    custName: "",
    custPhone: "",
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to Khatu Rides 'Sakha Bot'. We are here to assist you! 🙏\n\nPlease select below options to continue:",
      stepContext: "service",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const resetChatbot = () => {
    setCurrentStep("service");
    setInput("");
    setBookingQuery({
      service: "",
      journeyDate: "",
      pickupTime: "",
      cabType: "",
      custName: "",
      custPhone: "",
    });
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Welcome to Khatu Rides 'Sakha Bot'. We are here to assist you! 🙏\n\nPlease select below options to continue:",
        stepContext: "service",
      },
    ]);
  };

  const handleStep = async (value: string) => {
    if (isLoading || !value.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: value,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let nextStep: BotStep = currentStep;
    let replyText = "";
    let updatedQuery = { ...bookingQuery };

    if (currentStep === "service") {
      updatedQuery.service = value;
      nextStep = "date";
      replyText = "Dhanyawad! Please enter your Date of Journey (e.g., 28 Sept ya Kal subah):";
    } else if (currentStep === "date") {
      updatedQuery.journeyDate = value;
      nextStep = "time";
      replyText = "Please enter your preferred Pickup Time (e.g., 08:30 AM ya Shaam 5 baje):";
    } else if (currentStep === "time") {
      updatedQuery.pickupTime = value;
      nextStep = "cab_type";
      replyText = "Great! Please select your Cab Type:";
    } else if (currentStep === "cab_type") {
      updatedQuery.cabType = value;
      nextStep = "contact_details";
      replyText =
        "Aapki ride requirements save hone wali hai. Kripya apna Naam aur 10-digit Mobile Number share karein taaki hum confirm kar sakein:";
    }

    setBookingQuery(updatedQuery);
    setCurrentStep(nextStep);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: replyText,
          stepContext: nextStep,
        },
      ]);
      setIsLoading(false);
    }, 400);
  };

  // Final confirmation save to firestore
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingQuery.custName.trim() || bookingQuery.custPhone.length < 10) {
      alert("Kripya sahi Naam aur 10-digit Mobile number bharein!");
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "customer_queries"), {
        service: bookingQuery.service,
        journeyDate: bookingQuery.journeyDate,
        pickupTime: bookingQuery.pickupTime,
        cabType: bookingQuery.cabType,
        customerName: bookingQuery.custName,
        customerPhone: bookingQuery.custPhone,
        source: "SAKHA_BOT_QUERY",
        createdAt: serverTimestamp(),
      });

      const finalGreeting = `Namaste ${bookingQuery.custName} ji! 🙏\n\nHumne aapki query save kar li hai. Hamare customer care officer jald hi aapse sampark karenge.\n\nYadi aap fast response chahte hain, toh turant niche diye gaye button se call karein:\n📞 ${SUPPORT_PHONE_DISPLAY}`;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: finalGreeting,
          stepContext: "final",
        },
      ]);

      setCurrentStep("final");
    } catch (err) {
      console.error(err);
      alert("Technical error. Direct call karein: " + SUPPORT_PHONE_DISPLAY);
    } finally {
      setIsLoading(false);
    }
  };

  // User puchhe gaye random questions (General Support without revealing fare)
  const handleGeneralQuery = async (queryText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: queryText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          instruction:
            "Aap Khatu Rides ke AI bot Sakha hain. Sirf taxi service policies, luggage, car availability, pickup rules ka answer dein. STRICT RULE: Koi bhi specific fare/price quote mat kijiye. Customer care executive connect karne ya direct call karne ko bolein.",
        }),
      });

      const data = await response.json();
      const reply =
        data.reply ||
        `Hamari team aapse jald connect karegi. Exact fare aur confirm booking ke liye call karein: ${SUPPORT_PHONE_DISPLAY}`;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Aapki sahayata ke liye hamare direct helpline par sampark karein: ${SUPPORT_PHONE_DISPLAY}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (currentStep === "date" || currentStep === "time") {
      handleStep(input);
    } else {
      handleGeneralQuery(input);
    }
    setInput("");
  };

  return (
    <>
      {/* -------------------------------------------------------------
          FLOATING TRIGGER: Mobile Right Center (Flicking) / Desktop Bottom Right
      -------------------------------------------------------------- */}
      <div className="fixed z-[9999] select-none font-sans top-1/2 -translate-y-1/2 right-2 md:top-auto md:translate-y-0 md:bottom-5 md:right-5">
        <motion.div
          animate={
            !isOpen
              ? {
                  scale: [1, 1.08, 0.96, 1.05, 1],
                  rotate: [0, -6, 6, -3, 0],
                  boxShadow: [
                    "0px 0px 0px 0px rgba(249,115,22,0.4)",
                    "0px 0px 14px 4px rgba(249,115,22,0.55)",
                    "0px 0px 0px 0px rgba(249,115,22,0.4)",
                  ],
                }
              : {}
          }
          transition={{
            repeat: Infinity,
            repeatDelay: 2.8,
            duration: 1.2,
            ease: "easeInOut",
          }}
          className="relative flex items-center justify-center"
        >
          {!isOpen && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60 md:hidden" />
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open Sakha AI"
            className="group relative flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all active:scale-90
              h-10 w-10 p-0 md:h-11 md:w-auto md:px-3.5 md:py-2 md:gap-2"
          >
            <span className="text-lg md:text-base leading-none">
              {isOpen ? "✕" : "🤖"}
            </span>

            <span className="hidden md:inline-flex flex-col text-left leading-none">
              <span className="text-[12px] font-black uppercase tracking-wider text-white">
                Sakha Bot
              </span>
              <span className="text-[9px] font-bold text-orange-100">
                Book Cab
              </span>
            </span>

            {!isOpen && (
              <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-white ring-1 ring-white md:hidden">
                AI
              </span>
            )}
          </button>
        </motion.div>
      </div>

      {/* -------------------------------------------------------------
          COMPACT CHAT WINDOW (Size small & 14px text)
      -------------------------------------------------------------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed z-[9999] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white font-sans shadow-[0_12px_40px_rgba(0,0,0,0.18)]
              right-3 bottom-3 w-[calc(100vw-24px)] max-w-[340px] h-[75vh] max-h-[480px]
              md:right-6 md:bottom-20 md:w-[340px] md:h-[480px]"
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h3 className="text-[13px] font-bold tracking-tight text-slate-800 leading-tight">
                    Khatu Rides 'Sakha Bot'
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-none">Cab Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetChatbot}
                  className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-3 text-[14px]">
              {messages.map((m) => (
                <div key={m.id} className="space-y-2">
                  <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[88%] whitespace-pre-line rounded-xl px-3 py-2 leading-snug shadow-sm text-[14px] ${
                        m.role === "user"
                          ? "rounded-tr-xs bg-orange-500 text-white font-medium"
                          : "rounded-tl-xs border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>

                  {/* 1. Services Options */}
                  {m.role === "assistant" &&
                    m.stepContext === "service" &&
                    currentStep === "service" && (
                      <div className="flex flex-col gap-1.5 pt-1">
                        {SERVICES.map((srv, idx) => {
                          const letters = ["A", "B", "C", "D"];
                          return (
                            <button
                              key={srv}
                              type="button"
                              onClick={() => handleStep(srv)}
                              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-[14px] font-semibold text-slate-700 shadow-xs transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 active:scale-98"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-black text-orange-600">
                                {letters[idx]}
                              </span>
                              <span>{srv}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                  {/* 4. Cab Type Selection */}
                  {m.role === "assistant" &&
                    m.stepContext === "cab_type" &&
                    currentStep === "cab_type" && (
                      <div className="flex flex-col gap-1.5 pt-1">
                        {CAB_TYPES.map((cab) => (
                          <button
                            key={cab}
                            type="button"
                            onClick={() => handleStep(cab)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-[14px] font-semibold text-slate-700 shadow-xs hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 active:scale-98"
                          >
                            🚗 {cab}
                          </button>
                        ))}
                      </div>
                    )}

                  {/* 5. Final Greetings Quick Call/WhatsApp */}
                  {m.stepContext === "final" && (
                    <div className="flex flex-col gap-2 pt-1">
                      <a
                        href={`tel:${SUPPORT_PHONE}`}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 text-[14px] font-bold text-white shadow-sm transition hover:opacity-95"
                      >
                        📞 Call Now (+91 92441 37353)
                      </a>
                      <a
                        href={`https://wa.me/${SUPPORT_PHONE.replace("+", "")}?text=Hello%20Khatu%20Rides%2C%20maine%20website%20par%20query%20ki%20thi.`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-50 py-2 text-[13px] font-bold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        💬 Connect on WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              ))}

              {/* Contact Form Step */}
              {currentStep === "contact_details" && (
                <form
                  onSubmit={handleFinalSubmit}
                  className="space-y-2 rounded-xl border border-orange-200 bg-white p-3 shadow-xs"
                >
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-orange-600">
                    Contact Information
                  </span>

                  <input
                    type="text"
                    required
                    placeholder="Aapka Naam (Full Name)"
                    value={bookingQuery.custName}
                    onChange={(e) =>
                      setBookingQuery((prev) => ({ ...prev, custName: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[14px] text-slate-900 outline-none focus:border-orange-400 focus:bg-white"
                  />

                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-Digit Mobile Number"
                    value={bookingQuery.custPhone}
                    onChange={(e) =>
                      setBookingQuery((prev) => ({
                        ...prev,
                        custPhone: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[14px] text-slate-900 outline-none focus:border-orange-400 focus:bg-white"
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-orange-500 py-2.5 text-[14px] font-bold text-white shadow-xs transition hover:bg-orange-600 disabled:opacity-50"
                  >
                    {isLoading ? "Saving details..." : "Submit Query & Get Callback"}
                  </button>
                </form>
              )}

              {isLoading && (
                <div className="flex items-center gap-2 py-1 pl-1 text-[13px] text-slate-500">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                  Sakha is assisting...
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleInputSubmit}
              className="flex flex-shrink-0 items-center gap-1.5 border-t border-slate-100 bg-white p-2.5"
            >
              <input
                type="text"
                value={input}
                disabled={isLoading || currentStep === "contact_details"}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  currentStep === "date"
                    ? "Enter date (e.g. 28 Sept)..."
                    : currentStep === "time"
                    ? "Enter pickup time (e.g. 9 AM)..."
                    : currentStep === "contact_details"
                    ? "Please fill contact box above"
                    : "Puchhiye ya type kijiye..."
                }
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[14px] text-slate-900 outline-none focus:border-orange-400 focus:bg-white disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim() || currentStep === "contact_details"}
                className="rounded-lg bg-orange-500 px-3 py-1.5 text-[14px] font-bold text-white transition hover:bg-orange-600 disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
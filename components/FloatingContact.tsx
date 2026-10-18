// components/FloatingContact.tsx
"use client";

import { useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";
import { PHONE, WHATSAPP } from "./data";

export default function FloatingContact({ origin, destination }: { origin: string; destination: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const telUrl = `tel:${PHONE}`;
  const whatsappMessage = `Hi Khatu Rides! I want to book a cab from ${origin} to ${destination}. Please share the fare details.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed bottom-6 right-4 z-[99] md:hidden">
      {/* Expanded Buttons */}
      <div 
        className={`flex flex-col gap-3 mb-4 items-center transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3.5 rounded-full shadow-[0_4px_15px_rgba(34,197,94,0.4)] hover:bg-green-600 transition flex items-center justify-center"
          aria-label="WhatsApp Us"
        >
          {/* Custom WhatsApp Icon SVG */}
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M16 3.2C9 3.2 3.3 8.8 3.3 15.8c0 2.2.6 4.4 1.7 6.3L3.2 28.8l6.9-1.8c1.8 1 3.8 1.5 5.9 1.5 7 0 12.7-5.7 12.7-12.7S23 3.2 16 3.2Zm0 23.1c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4a10.6 10.6 0 0 1-1.6-5.5C5.4 10.9 10.2 6.1 16 6.1s10.6 4.8 10.6 10.7S21.8 26.3 16 26.3Zm5.8-7.9c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-1.9-.9-3.1-1.7-4.3-3.7-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.3 3.6 5.7 5 2.1.9 2.9 1 4 .8.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4 0-.2-.2-.3-.5-.5Z"/>
          </svg>
        </a>
        <a
          href={telUrl}
          className="bg-blue-600 text-white p-3.5 rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.4)] hover:bg-blue-700 transition flex items-center justify-center"
          aria-label="Call Us"
        >
          <Phone className="w-6 h-6" fill="currentColor" />
        </a>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-400 text-slate-900 p-4 rounded-full shadow-[0_8px_20px_rgba(251,191,36,0.5)] hover:bg-amber-500 hover:scale-105 transition-all duration-300 flex items-center justify-center relative"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </button>
    </div>
  );
}
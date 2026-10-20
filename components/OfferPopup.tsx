"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, Car } from "lucide-react";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Apna correct Firebase path yahan dalein

export default function OfferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersRef = collection(db, "special_offers");
        // Ab 'limit(1)' hata diya hai taaki saare active offers fetch ho sakein
        const q = query(
          offersRef, 
          where("offerAvailable", "==", true)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Saare offers array me store kar rahe hain
          const data = querySnapshot.docs.map(doc => doc.data());
          setOffers(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error fetching special offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // ==========================================
  // Auto-Slide Logic (Har 4 second me change hoga)
  // ==========================================
  useEffect(() => {
    if (offers.length <= 1 || !isOpen) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 4000); // 4000ms = 4 seconds

    return () => clearInterval(interval);
  }, [offers.length, isOpen]);

  if (!isOpen || isLoading || offers.length === 0) return null;

  // Current Slide/Offer ka data
  const offer = offers[currentIndex];
  const bookUrl = `/${offer.tripType === 'oneway' ? 'outstation-cabs' : 'cab-service'}/${offer.fromCity.toLowerCase()}-to-${offer.toCity.toLowerCase()}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-500">
      
      {/* PREMIUM GLOWING CARD */}
      <div className="relative w-full max-w-[340px] overflow-hidden rounded-[2.5rem] border-[3px] border-white/50 bg-gradient-to-b from-pink-50 to-pink-100 p-7 shadow-[0_0_50px_rgba(244,114,182,0.25)] animate-in zoom-in-95 duration-500">
        
        {/* CSS Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] mix-blend-multiply pointer-events-none"></div>

        {/* Inner white glow at the top */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-32 w-48 rounded-full bg-white/70 blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-all hover:bg-[#ff1476] hover:text-white hover:rotate-90 hover:scale-110"
        >
          <X size={16} strokeWidth={3} />
        </button>

        {/* Card Main Container */}
        <div className="relative z-10 flex flex-col items-center text-center mt-3">
          
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-transparent px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#e8146e]">
            <Sparkles size={14} className="animate-pulse" />
            Today's Offer
          </div>

          {/* SLIDER CONTENT (Jo change hoga) */}
          <div 
            key={currentIndex} 
            className="flex flex-col items-center w-full animate-in slide-in-from-right-4 fade-in duration-500"
          >
            <h3 className="mb-2 text-[26px] font-black leading-tight text-[#0f172a] drop-shadow-sm capitalize">
              {offer.fromCity} To {offer.toCity}
            </h3>
            
            <div className="mb-3 flex items-center gap-2 text-[15px] font-bold text-slate-500 capitalize">
               <Car size={16} className="text-[#e8146e]" /> 
               {offer.vehicleType} AC Cab
            </div>
            
            <div className="mb-7 flex flex-col items-center mt-2">
              {offer.strikeFare && (
                <span className="text-[15px] font-extrabold text-slate-400 line-through mb-0.5">
                  ₹{offer.strikeFare}
                </span>
              )}
              
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#f7116e]">₹</span>
                <span className="text-[64px] leading-none font-black tracking-tighter text-[#f7116e] drop-shadow-sm">
                  {offer.offerFare}
                </span>
                <span className="text-sm font-bold text-slate-600 ml-1 capitalize">
                  / {offer.tripType}
                </span>
              </div>
            </div>

            {/* Glowing Book Now Button */}
            <Link 
              href={bookUrl}
              onClick={() => setIsOpen(false)}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[1.25rem] bg-gradient-to-r from-[#f7116e] to-[#fb1d58] px-6 py-4 font-bold text-white shadow-[0_10px_35px_rgba(247,17,110,0.5)] transition-all hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(247,17,110,0.7)] active:scale-95"
            >
              <span className="relative z-10 text-[20px]">Book Now</span>
              <ArrowRight size={22} className="relative z-10 transition-transform group-hover:translate-x-1" />
              
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer"></div>
            </Link>
          </div>

          {/* DOTS & VIEW MORE LINK (Sirf tab dikhega jab 1 se zyada offers honge) */}
          {offers.length > 1 && (
            <div className="mt-5 w-full flex flex-col items-center">
              
              {/* Slider Dots */}
              <div className="flex gap-1.5 mb-3">
                {offers.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-5 bg-[#f7116e]' : 'w-2 bg-pink-200'
                    }`}
                  />
                ))}
              </div>
              
              {/* View More Offers Link */}
              <Link 
                href="/offers" // <-- Aap apne offers page ka link yahan daal sakte hain
                onClick={() => setIsOpen(false)}
                className="text-[13px] font-bold text-slate-500 hover:text-[#f7116e] transition-colors underline-offset-4 hover:underline"
              >
                View All Offers ({offers.length})
              </Link>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
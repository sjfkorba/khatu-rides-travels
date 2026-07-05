// components/ImageCarousel.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  { id: 1, src: "/banner1.png", alt: "One Way Car Service - Khatu Rides" },
  { id: 2, src: "/banner2.png", alt: "One Way Taxi Service Offer" },
  { id: 3, src: "/banner3.png", alt: "Premium Taxi 20% Off" },
  { id: 4, src: "/banner4.png", alt: "Chhattisgarh Route Fleet" },
  { id: 5, src: "/banner5.png", alt: "Happy Customers Family Travel" },
  { id: 6, src: "/banner6.png", alt: "Chhattisgarh's Fastest Growing Service" },
  { id: 7, src: "/banner7.png", alt: "100% Satisfaction Guarantee" },
  { id: 8, src: "/banner8.png", alt: "Best Taxi Service Network" },
];

export default function ImageCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 border-b border-orange-600/20 z-0 select-none py-4 px-4 sm:px-8">
      
      {/* Symmetrical Centered View Area */}
      <div className="mx-auto max-w-5xl flex items-center justify-center w-full">
        
        {/* 👑 GLOWING BORDER CONTAINER: Added dynamic drop-shadow and vibrant solid orange ring wrapper */}
        <div className="relative w-full aspect-[2.3/1] sm:aspect-[2.6/1] lg:h-[400px] rounded-2xl md:rounded-[2rem] border-2 border-orange-500 shadow-[0_0_30px_rgba(234,88,12,0.45),inset_0_0_15px_rgba(234,88,12,0.2)] overflow-hidden bg-slate-950">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              /* 👑 RIGHT TO LEFT ANIMATION LOGIC: Initiates from positive x (right) and shifts to negative x (left) on exit */
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Layer 1: Blurred Backdrop Layer */}
              <div className="absolute inset-0 w-full h-full scale-105 blur-lg opacity-20 pointer-events-none">
                <Image src={BANNERS[current].src} alt="Blur-Back" fill className="object-fill" />
              </div>

              {/* Layer 2: Color Shading Filter Overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/10 via-transparent to-slate-950/10" />

              {/* Layer 3: Main Sharp Core Flyer Image */}
              <div className="absolute inset-0 z-20 w-full h-full flex items-center justify-center">
                <Image 
                  src={BANNERS[current].src} 
                  alt={BANNERS[current].alt} 
                  fill 
                  priority 
                  className="object-contain w-full h-full p-1" 
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Indicators (Dots Layer) */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-30 bg-gradient-to-t from-black/40 via-black/10 to-transparent pt-4 pb-1">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  current === idx ? "w-5 bg-orange-500 shadow-md" : "w-1.5 bg-white/40"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
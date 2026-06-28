// components/SplashScreen.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1.5 seconds standard elegant look timing parameter loop
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 1600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 w-screen h-screen z-[9999999] bg-gradient-to-br from-slate-50 via-white to-orange-50/20 flex flex-col items-center justify-center text-center select-none"
        >
          {/* Main Logo & Ripple Box */}
          <div className="relative flex flex-col items-center justify-center">
            
            {/* Soft Premium Ring Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute w-24 h-24 rounded-full border-2 border-orange-500/20 pointer-events-none"
            />

            {/* Glowing Brand Mark Graphic Box */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="w-20 h-20 bg-gradient-to-tr from-[#c2511b] to-[#dc682a] rounded-2xl flex items-center justify-center shadow-xl shadow-orange-700/10 text-white font-black text-3xl tracking-tighter"
            >
              KR
            </motion.div>
          </div>

          {/* Core Animated Typography */}
          <div className="mt-5 space-y-1">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-black text-slate-900 tracking-wide uppercase"
            >
              Khatu Rides
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
            >
              Premium Outstation Collective Network
            </motion.p>
          </div>

          {/* Sleek Line Loading Indicator */}
          <div className="w-32 h-1 bg-slate-200/80 rounded-full mt-6 overflow-hidden relative">
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="absolute w-1/2 h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
            />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
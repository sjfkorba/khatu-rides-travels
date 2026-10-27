'use client'; 

import { useState, useEffect } from 'react';
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import QuickServices from "@/components/landing/QuickServices";
import PopularRoutes from "@/components/landing/PopularRoutes";
import TourPackages from "@/components/landing/TourPackages";
import Fleet from "@/components/landing/Fleet";
import TrustSection from "@/components/landing/TrustSection";
import Services from "@/components/landing/Services";
import AirportSection from "@/components/landing/AirportSection";
import SeoSection from "@/components/landing/SeoSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import MobileActionBar from "@/components/landing/MobileActionBar";
import ImageCarousel from "@/components/ImageCarousel";
import EnquiryForm from "@/components/landing/EnquiryForm";
import Reviews from "@/components/Reviews";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2 seconds timer for the loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  // Premium Loading Screen UI
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#010614] overflow-hidden relative">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Special Premium Loading Animation */}
        <div className="relative flex items-center justify-center">
          {/* Outer rotating dashed ring - Gold/Amber */}
          <div className="h-28 w-28 animate-spin rounded-full border-4 border-dashed border-amber-500/50"></div>
          
          {/* Inner pulsating circle */}
          <div className="absolute h-20 w-20 animate-pulse rounded-full bg-linear-to-tr from-amber-400 to-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center">
            {/* Car/Travel Icon inside */}
            <svg className="h-10 w-10 text-[#010614]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
        </div>
        
        <h2 className="mt-10 text-lg font-black tracking-[0.2em] text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-amber-200 animate-pulse uppercase drop-shadow-lg">
          Preparing Your Ride...
        </h2>
        <p className="mt-2 text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
          Khatu Rides Travels Co.
        </p>
      </div>
    );
  }

  // Actual Page UI
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f7f9fc] text-[#0b1b33]">
      <Navbar />
      <Hero />
      <QuickServices />
      {/* <EnquiryForm/> */}
      <ImageCarousel/>
      <PopularRoutes />
      <TourPackages />
      <Fleet />
      <Reviews/>
      {/* <TrustSection /> */}
      <Services />
      <AirportSection />
      <SeoSection />
      <FinalCTA />
      <Footer />
      <MobileActionBar />
      {/* <SakhaBot/> */}
    </main>
  );
}
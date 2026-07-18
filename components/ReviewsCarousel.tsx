"use client";
import React from "react";
import Script from "next/script";

export default function ReviewsCarousel() {
  return (
    <section className="relative mt-16 bg-slate-950 py-16 px-4 border-t border-slate-900">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider">
          Trusted By Our Riders
        </h2>
      </div>

      {/* Elfsight Widget Integration */}
      <div className="max-w-6xl mx-auto">
        <div 
          className="elfsight-app-befc0f26-20b2-4abc-b941-20a499d14601" 
          data-elfsight-app-lazy
        ></div>
      </div>

      {/* External Script Loading with Next.js Script component */}
      <Script 
        src="https://elfsightcdn.com/platform.js" 
        strategy="lazyOnload" 
      />
    </section>
  );
}
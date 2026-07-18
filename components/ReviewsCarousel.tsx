"use client";
import React, { useState, useEffect } from "react";

export default function ReviewsCarousel() {
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        // Debugging: Yahan check karein ki data ke andar 'reviews' kahan hai
        console.log("Full API Response:", data);
        setReviewsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-500">Loading reviews...</div>;

  // FIX: Reviews array ko dynamic dhoondna
  const reviews = reviewsData?.reviews || reviewsData?.result?.reviews || [];

  if (reviews.length === 0) {
    return <div className="text-center py-20 text-slate-500">No public reviews found on Google.</div>;
  }

  return (
    <section className="relative mt-16 bg-slate-950 py-20 px-4 overflow-hidden border-t border-slate-900">
      <div className="flex gap-6 animate-marquee-slow">
        {reviews.map((t: any, idx: number) => (
          <article key={idx} className="w-[340px] shrink-0 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-3 mb-4">
               {t.profile_photo_url && <img src={t.profile_photo_url} className="w-10 h-10 rounded-full" alt={t.author_name} />}
               <div>
                 <h4 className="text-sm font-black text-white">{t.author_name}</h4>
                 <div className="text-amber-400 text-[10px]">{"★".repeat(t.rating || 0)}</div>
               </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">"{t.text}"</p>
          </article>
        ))}
      </div>
    </section>
  );
}
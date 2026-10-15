'use client';

import React, { useRef, useEffect, useState } from 'react';

interface Reviewer {
  displayName: string;
}

interface Review {
  reviewId: string;
  reviewer: Reviewer;
  starRating: string;
  comment?: string;
}

interface ReviewsData {
  reviews: Review[];
  avg: number;
  total: number;
}

export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const reviewsData: ReviewsData = { 
    avg: 4.7, 
    total: 46,
    reviews: [
      { reviewId: "AbFvOqnmaY", reviewer: { displayName: "Tarun Soni" }, starRating: "FIVE", comment: "Well services by driver and services provider overall excellent experience." },
      { reviewId: "AbFvOqnU3U5", reviewer: { displayName: "Aman Sahu" }, starRating: "FIVE", comment: "Korba best taxi service khatu rides travels co. Best service nid and celn car good dr service" },
      { reviewId: "AbFvOqmEfSd", reviewer: { displayName: "Radha Yadav" }, starRating: "FIVE", comment: "my family dont know about this typ of service.. and we need this in hurrryyy,,, so not only me ..my family also like and appreciate ☺️😊" },
      { reviewId: "AbFvOqm_TyE", reviewer: { displayName: "Ashish Thakur" }, starRating: "FIVE", comment: "Shatrughn is a honest person. Very good network . Services are excellent with reasonable rates. Everyone must book with him only" },
      { reviewId: "AbFvOqknwqF", reviewer: { displayName: "Ask Ashish" }, starRating: "FIVE", comment: "On time reporting and excellent vehicle. Thanks for your prompt service." },
      { reviewId: "AbFvOqnf-1e", reviewer: { displayName: "Azharkhar Azhar" }, starRating: "FIVE", comment: "Good service" },
      { reviewId: "AbFvOqlx2Pk", reviewer: { displayName: "Viksh Yadav" }, starRating: "FIVE", comment: "Service is best,👍" },
      { reviewId: "AbFvOqk0ILb", reviewer: { displayName: "Raman Prasad" }, starRating: "FIVE", comment: "Best service" },
      { reviewId: "AbFvOqmly9X", reviewer: { displayName: "tarun soni" }, starRating: "FIVE", comment: "Excellent service" },
      { reviewId: "AbFvOqmDaFZ", reviewer: { displayName: "Sujit Mandavi" }, starRating: "FIVE", comment: "We really thanks to khatu rides travels for their politely behaviour and extreme supports during our family trips from korba to kanker" },
      { reviewId: "AbFvOqlA9RA", reviewer: { displayName: "Jdhdhd Dndjd" }, starRating: "FIVE", comment: "Best taxi service provider in korba and also their fare charges is affordable" },
      { reviewId: "AbFvOql999T", reviewer: { displayName: "Sakshi Tiwari" }, starRating: "FIVE", comment: "Best service and enaka behaviour bahut achcha tha help full teams driver is best" },
      { reviewId: "AbFvOqmyMSp", reviewer: { displayName: "Anshu Agrawal" }, starRating: "FIVE", comment: "Best service" },
      { reviewId: "AbFvOqkPq4G", reviewer: { displayName: "Subham sahu" }, starRating: "FIVE", comment: "Nice Sarvesh" },
      { reviewId: "AbFvOqn_ohw", reviewer: { displayName: "Ghanshyam Verma" }, starRating: "FIVE", comment: "Bahut ache se call me baat kiye bhaiya ne" },
      { reviewId: "AbFvOqmwe2L", reviewer: { displayName: "deepak singh" }, starRating: "FIVE", comment: "Best experience safe drive 👌" },
      { reviewId: "AbFvOqm5kKd", reviewer: { displayName: "Poonam chouhan" }, starRating: "FIVE", comment: "Very nice" },
      { reviewId: "AbFvOqkG8mZ", reviewer: { displayName: "Ashok Sahu" }, starRating: "FIVE", comment: "Safely and maintined Shedule travelling experience, everything is ok pickup &drop" },
      { reviewId: "AbFvOqmpw1m", reviewer: { displayName: "Shubh Kadao" }, starRating: "FOUR", comment: "Good experience fast pick up and drop facility" },
      { reviewId: "AbFvOql8B20", reviewer: { displayName: "wellwisher" }, starRating: "FIVE", comment: "Best service I have ever experienced. Keep it up." }
    ]
  };

  // Automatic Slide Logic (useEffect)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isHovered && scrollRef.current) {
      interval = setInterval(() => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current!;
        
        // Agar scroll last tak pahuch gaya hai, toh start par wapas le aao
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current!.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Varna ek card ki width jitna (approx 350px) aage badhao
          scrollRef.current!.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }, 3000); // 3000ms = 3 Seconds (Minimum optimal reading speed)
    }

    // Cleanup interval jab component unmount ho ya hover state change ho
    return () => clearInterval(interval);
  }, [isHovered]);

  const renderStars = (rating: string) => {
    const starCount = rating === 'FIVE' ? 5 : rating === 'FOUR' ? 4 : rating === 'THREE' ? 3 : rating === 'TWO' ? 2 : 1;
    return [...Array(starCount)].map((_, i) => (
      <svg key={i} className="w-5 h-5 text-[#fbc02d] fill-current drop-shadow-sm" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const slideLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
  };

  const slideRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Header Section */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-[#0d1b2a] sm:text-4xl tracking-tight">
            What Our Customers Say
          </h2>
          <div className="mt-5 flex justify-center items-center gap-3">
            <span className="text-5xl font-black text-[#0d1b2a]">
              {Number(reviewsData.avg).toFixed(1)}
            </span>
            <div className="flex flex-col items-start">
              <div className="flex gap-1">{renderStars('FIVE')}</div>
              <span className="text-gray-500 font-medium text-sm mt-1">
                Based on {reviewsData.total} Google Reviews
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Container (with Hover Pause Logic) */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Left Arrow */}
          <button 
            onClick={slideLeft} 
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur shadow-lg border border-gray-100 p-3 rounded-full text-gray-700 hover:text-black hover:scale-110 transition-all hidden md:flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* Cards Scroll View */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-10 pt-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {reviewsData.reviews.map((review) => (
              <div 
                key={review.reviewId} 
                className="relative flex-none w-[85vw] md:w-[350px] snap-center bg-white rounded-3xl p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_15px_40px_rgb(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 overflow-hidden group/card flex flex-col justify-between"
              >
                {/* Flutter style Subtle Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#fbc02d]/0 to-[#fbc02d]/0 group-hover/card:from-[#fffde7]/50 group-hover/card:to-transparent transition-all duration-500 z-0 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-14 w-14 bg-gradient-to-tr from-[#fbc02d] to-[#ffd54f] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md ring-4 ring-[#fff8e1]">
                      {review.reviewer.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0d1b2a] text-lg line-clamp-1">
                        {review.reviewer.displayName}
                      </h3>
                      <div className="flex mt-1 gap-1">
                        {renderStars(review.starRating)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <svg className="absolute -top-2 -left-2 w-8 h-8 text-gray-100 -z-10 transform -scale-x-100" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    <p className="text-gray-600 font-medium leading-relaxed z-10 relative">
                      "{review.comment ? review.comment : 'Excellent service and highly recommended!'}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={slideRight} 
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur shadow-lg border border-gray-100 p-3 rounded-full text-gray-700 hover:text-black hover:scale-110 transition-all hidden md:flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        
        {/* Action Button */}
        <div className="mt-6 text-center">
          <a 
            href="https://maps.google.com/maps?cid=17725211584564689328" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] text-[#0d1b2a] bg-[#fbc02d] hover:bg-[#f9a825] hover:shadow-[0_6px_20px_rgba(251,192,45,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            View All {reviewsData.total} Reviews on Google
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>

      </div>
    </section>
  );
}
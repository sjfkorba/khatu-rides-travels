'use client';

import React, { useEffect, useState } from 'react';

// TypeScript Interfaces for Google Business Profile API Data
interface Reviewer {
  displayName: string;
  profilePhotoUrl?: string;
}

interface Review {
  reviewId: string;
  reviewer: Reviewer;
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE' | string;
  comment?: string;
  createTime?: string;
}

interface ReviewsData {
  reviews: Review[];
  avg: number | string;
  total: number;
}

export default function Reviews() {
  const [reviewsData, setReviewsData] = useState<ReviewsData>({ 
    reviews: [], 
    avg: 0, 
    total: 0 
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        if (data.success) {
          setReviewsData({
            reviews: data.reviews,
            avg: data.averageRating,
            total: data.totalReviewCount
          });
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Helper function to render stars based on string rating
  const renderStars = (rating: string) => {
    const starCount = 
      rating === 'FIVE' ? 5 : 
      rating === 'FOUR' ? 4 : 
      rating === 'THREE' ? 3 : 
      rating === 'TWO' ? 2 : 1;
      
    return [...Array(starCount)].map((_, i) => (
      <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Customers Say
          </h2>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {Number(reviewsData.avg).toFixed(1)}
            </span>
            <div className="flex">{renderStars('FIVE')}</div>
            <span className="text-gray-600 font-medium">
              Based on {reviewsData.total} Google Reviews
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsData.reviews.slice(0, 9).map((review, index) => (
            <div 
              key={review.reviewId || index} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold text-lg">
                  {review.reviewer.displayName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.reviewer.displayName}
                  </h3>
                  <div className="flex mt-1">
                    {renderStars(review.starRating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic line-clamp-4">
                "{review.comment ? review.comment : 'Excellent service and highly recommended!'}"
              </p>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-10 text-center">
          <a 
            href="https://maps.google.com/maps?cid=17725211584564689328" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 transition-colors"
          >
            View All {reviewsData.total} Reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
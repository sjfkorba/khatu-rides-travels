"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; // adjust path as needed
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function SmartReviewPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isRedirected, setIsRedirected] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Aapke Google Business Profile ke Review Links
  const GOOGLE_PROFILE_LINK = "https://g.page/r/CbD5nSIGmvz1EBM/review";

  // Jab user wapas aapki tab me aaye, usko detect karne ke liye
  useEffect(() => {
    const handleVisibilityChange = async () => {
      // Agar user wapas tab me aaya (visible) aur pehle redirect ho chuka tha
      if (document.visibilityState === "visible" && isRedirected && !isSaved) {
        
        // 1. Firebase me data save karein
        try {
          await addDoc(collection(db, "reviews"), {
            rating: rating,
            comment: comment,
            createdAt: serverTimestamp(),
            source: "Google Redirect Trick"
          });
          console.log("Data saved to Firebase after returning from Google");
        } catch (error) {
          console.error("Firebase error:", error);
        }

        // 2. Success screen dikhayein
        setIsSaved(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Cleanup listener
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRedirected, isSaved, rating, comment]);

  const handlePostToGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating first.");
      return;
    }

    // Comment ko clipboard me copy kar dete hain taaki user wahan paste kar sake
    if (comment) {
      navigator.clipboard.writeText(comment).catch(() => {});
    }

    // State update karein ki user Google par ja chuka hai
    setIsRedirected(true);

    // User ko naye tab me Google par bhej dein
    window.open(GOOGLE_PROFILE_LINK, "_blank");
  };

  // Agar user ko direct Firebase me save karna hai (below 4 stars ke liye)
  const handleDirectSave = async () => {
    try {
      await addDoc(collection(db, "reviews"), {
        rating: rating,
        comment: comment,
        createdAt: serverTimestamp(),
        source: "Direct Save (Low Rating)"
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Firebase error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        <div className="bg-slate-900 p-6 text-center">
          <h1 className="text-2xl font-black text-white">Khatu Rides</h1>
          <p className="text-amber-400 text-sm font-semibold mt-1">Rate Your Travel Experience</p>
        </div>

        <div className="p-6">
          {isSaved ? (
            /* SUCCESS SCREEN (Wapas aane ke baad) */
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300 py-6">
              <div className="text-6xl mb-4">🎉</div>
              <h4 className="text-2xl font-black text-green-600">Successfully Recorded!</h4>
              <p className="text-slate-600 text-md font-medium">
                Thank you for your valuable feedback and supporting Khatu Rides.
              </p>
            </div>
          ) : isRedirected ? (
            /* WAITING SCREEN (Jab user dusre tab me Google par hai) */
            <div className="text-center space-y-4 py-8">
              <div className="animate-spin text-4xl mx-auto w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full"></div>
              <h4 className="text-xl font-bold text-slate-800">Awaiting your review...</h4>
              <p className="text-slate-500 text-sm">
                Please post your review on the Google tab that just opened. <br/> Come back to this page to complete the process.
              </p>
              <button 
                onClick={() => setIsSaved(true)} 
                className="mt-4 text-xs font-bold text-slate-400 underline"
              >
                I have posted it, finish now.
              </button>
            </div>
          ) : (
            /* RATING FORM */
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-slate-600 font-bold mb-4">How was your ride?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-5xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      <span className={star <= rating ? "text-amber-400" : "text-slate-200"}>★</span>
                    </button>
                  ))}
                </div>
              </div>

              {rating > 0 && (
                <div className="animate-in fade-in duration-300">
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a quick comment..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
                  ></textarea>

                  {rating >= 4 ? (
                    // HIGH RATING -> Send to Google Trick
                    <div className="space-y-3">
                      <p className="text-xs text-amber-600 font-bold text-center">
                        *Your comment will be copied automatically so you can paste it on Google.
                      </p>
                      <button
                        onClick={handlePostToGoogle}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-lg py-4 rounded-xl shadow-lg transition-all"
                      >
                        Post on Google & Submit
                      </button>
                    </div>
                  ) : (
                    // LOW RATING -> Direct Firebase Save (No Google)
                    <button
                      onClick={handleDirectSave}
                      className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-lg py-4 rounded-xl shadow-lg transition-all"
                    >
                      Submit Feedback
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
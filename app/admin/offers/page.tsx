// app/admin/offers/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from "firebase/firestore";

interface OfferItem {
  id: string;
  fromCity: string;
  toCity: string;
  vehicleType: string;
  tripType: string;
  strikeFare: number;
  offerFare: number;
  offerAvailable: boolean;
  createdAt?: any;
}

const VEHICLE_OPTIONS = [
  { id: "sedan", label: "Maruti Dzire / Etios (Sedan)" },
  { id: "ertiga", label: "Maruti Ertiga (MUV)" },
  { id: "crysta", label: "Innova Crysta (Premium)" }
];

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  // Form States
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [vehicleType, setVehicleType] = useState("sedan");
  const [tripType, setTripType] = useState("oneway");
  const [strikeFare, setStrikeFare] = useState("");
  const [offerFare, setOfferFare] = useState("");
  const [offerAvailable, setOfferAvailable] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "special_offers"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as OfferItem[];
      setOffers(list);
    } catch (err) {
      console.error("Error fetching offers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCity || !toCity || !strikeFare || !offerFare) {
      alert("Kripya sabhi zaroori fields bhartein!");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "special_offers"), {
        fromCity: fromCity.trim(),
        toCity: toCity.trim(),
        vehicleType,
        tripType,
        strikeFare: Number(strikeFare),
        offerFare: Number(offerFare),
        offerAvailable,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setFromCity("");
      setToCity("");
      setStrikeFare("");
      setOfferFare("");
      setOfferAvailable(true);

      fetchOffers();
      alert("🎉 Offer successfully live ho gaya!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const docRef = doc(db, "special_offers", id);
      await updateDoc(docRef, { offerAvailable: !currentStatus });
      fetchOffers();
    } catch (err) {
      alert("Status update fail ho gaya.");
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm("Kya aap is offer ko permanently delete karna chahte hain?")) return;
    try {
      await deleteDoc(doc(db, "special_offers", id));
      fetchOffers();
    } catch (err) {
      alert("Delete fail ho gaya.");
    }
  };

  // Filter logic: Admin can view active only or all offers
  const displayedOffers = filterActiveOnly 
    ? offers.filter(o => o.offerAvailable) 
    : offers;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div>
            <span className="bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-orange-500/20">
              Admin Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">Special Offers Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">Route-wise discount aur promotional fares manage karein.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterActiveOnly(!filterActiveOnly)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition border ${
                filterActiveOnly 
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30" 
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              {filterActiveOnly ? "🟢 Showing: Active Only" : "📋 Showing: All Offers"}
            </button>
          </div>
        </div>

        {/* Create Offer Form (Mobile Optimized Grid) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <span>➕</span> Add New Special Route Offer
          </h2>

          <form onSubmit={handleCreateOffer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">From City (Pickup)</label>
              <input
                type="text"
                placeholder="e.g. Korba"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                required
                className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white focus:border-orange-500 outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">To City (Drop)</label>
              <input
                type="text"
                placeholder="e.g. Ambikapur"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                required
                className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white focus:border-orange-500 outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white focus:border-orange-500 outline-none transition"
              >
                {VEHICLE_OPTIONS.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">Trip Type</label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white focus:border-orange-500 outline-none transition"
              >
                <option value="oneway">One Way Trip</option>
                <option value="roundtrip">Round Trip</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">Strike Fare (Original Price ₹)</label>
              <input
                type="number"
                placeholder="e.g. 3500"
                value={strikeFare}
                onChange={(e) => setStrikeFare(e.target.value)}
                required
                className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white focus:border-orange-500 outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-orange-400">Offer Fare (Discounted Price ₹)</label>
              <input
                type="number"
                placeholder="e.g. 2999"
                value={offerFare}
                onChange={(e) => setOfferFare(e.target.value)}
                required
                className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white focus:border-orange-500 outline-none transition"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between bg-slate-950 border border-slate-800 px-5 py-4 rounded-2xl">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-white block">Offer Availability Status</span>
                <span className="text-[10px] text-slate-400">Enable to make this offer visible to customers immediately.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={offerAvailable}
                  onChange={(e) => setOfferAvailable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-orange-600/30 transition disabled:opacity-50"
              >
                {submitting ? "Publishing Offer..." : "🚀 Publish Special Offer"}
              </button>
            </div>

          </form>
        </div>

        {/* Offers Listing (Fully Mobile Responsive Cards & Table) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-white">Live & Configured Offers List</h2>
            <span className="text-xs font-bold text-slate-400">{displayedOffers.length} Offers Found</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs font-bold">Loading offers...</div>
          ) : displayedOffers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-bold bg-slate-950/50 rounded-2xl border border-slate-800">
              No offers available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedOffers.map((item) => (
                <div 
                  key={item.id} 
                  className={`rounded-2xl border p-5 bg-slate-950/80 flex flex-col justify-between shadow-lg transition ${
                    item.offerAvailable ? "border-slate-800 hover:border-orange-500/50" : "border-red-950/50 opacity-60"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="bg-orange-500/10 text-orange-400 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md border border-orange-500/20">
                        {item.tripType}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md border ${
                        item.offerAvailable ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {item.offerAvailable ? "● ACTIVE" : "○ INACTIVE"}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white mt-3 flex items-center gap-1.5 truncate">
                      <span>{item.fromCity}</span>
                      <span className="text-orange-500">➔</span>
                      <span>{item.toCity}</span>
                    </h3>
                    
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase">
                      Vehicle: <span className="text-slate-200">{item.vehicleType}</span>
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Original / Offer</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-red-400 line-through">₹{item.strikeFare}</span>
                          <span className="text-base font-black text-emerald-400">₹{item.offerFare}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-900 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleToggleStatus(item.id, item.offerAvailable)}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition ${
                        item.offerAvailable 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      }`}
                    >
                      {item.offerAvailable ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(item.id)}
                      className="py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
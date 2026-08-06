// components/dashboard/BookingPopupModal.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingPopupModal({
  showPopup,
  setShowPopup,
  popupData,
  selectedVehicleType,
  setSelectedVehicleType,
  showUserForm,
  setShowUserForm,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerData,
  applyWalletDiscount,
  setApplyWalletDiscount,
  paymentSplitMode,
  setPaymentSplitMode,
  paymentLoadingId,
  handleOnlinePaymentCheckout,
  getVehicleImageByName
}: any) {
  if (!showPopup || !popupData) return null;

  const selectedOption = popupData.fareOptions.find((item: any) => item.vehicleType === selectedVehicleType) || popupData.fareOptions[0];
  
  // 👑 LIVE BUSINESS LOGIC: Dynamic Calculations (Trial ₹1 logic completely removed)
  const baseFare = selectedOption?.finalFare || 0;
  
  // Wallet Logic: Minimum ₹100 required to use wallet, Max discount allowed per trip is ₹200
  const userWallet = customerData?.walletBalance || 0;
  const isWalletUsable = userWallet >= 100;
  
  const maxWalletDiscount = isWalletUsable ? Math.min(userWallet, 200) : 0; 
  const walletDiscountAmount = (applyWalletDiscount && isWalletUsable) ? maxWalletDiscount : 0;
  
  // Net Fare after applying wallet
  const netFare = Math.max(0, baseFare - walletDiscountAmount);

  // Payment Percentage Logic (Default to 25% if not set)
  const selectedPercent = Number(paymentSplitMode[selectedOption?.id]) || 25;
  
  const payableNow = Math.round((netFare * selectedPercent) / 100);
  const balanceDue = netFare - payableNow;

  // Handler for percentage selection
  const handlePercentChange = (percent: number) => {
    setPaymentSplitMode({
      ...paymentSplitMode,
      [selectedOption?.id]: percent
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/75 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }} 
          className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] text-left relative text-slate-900"
        >
          {/* Modal Header */}
          <div className="bg-[#0b101d] text-white px-6 py-4 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400 block">Select Cab & Fare</span>
              <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-tight flex items-center gap-2 mt-0.5">
                <span>{popupData.pickup?.split(",")[0]}</span>
                <span className="text-orange-500">➔</span>
                <span>{popupData.drop?.split(",")[0]}</span>
              </h3>
            </div>
            <button 
              type="button"
              onClick={() => setShowPopup(false)} 
              className="bg-slate-800 hover:bg-slate-700 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm transition"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50 flex-1">
            {!showUserForm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Available Cab Options ({popupData.fareOptions?.length || 0})</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">✓ Toll & State Tax Included</span>
                </div>

                <div className="space-y-3">
                  {popupData.fareOptions?.map((opt: any) => {
                    if (!["sedan", "ertiga", "crysta"].includes(opt.vehicleType)) return null;
                    const isSelected = selectedVehicleType === opt.vehicleType;
                    const strikePrice = Math.round(opt.finalFare * 1.15);

                    return (
                      <div 
                        key={opt.id} 
                        onClick={() => setSelectedVehicleType(opt.vehicleType)} 
                        className={`rounded-2xl border-2 transition-all duration-200 bg-white p-4 sm:p-5 cursor-pointer relative shadow-xs ${
                          isSelected ? "border-orange-500 ring-4 ring-orange-500/10 bg-orange-50/30" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {opt.vehicleType === "sedan" && (
                          <span className="absolute -top-3 left-6 bg-orange-600 text-white text-[8px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider shadow-xs">
                            MOST POPULAR
                          </span>
                        )}

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-16 bg-slate-100 rounded-2xl border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-inner">
                              <img src={getVehicleImageByName(opt.vehicleType)} alt="Car" className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <div>
                              <h4 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">{opt.vehicleLabel}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Distance: <strong className="text-slate-700">{opt.billedDistance} Kms</strong> | AC Sedan/SUV
                              </p>
                            </div>
                          </div>

                          <div className="text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                            <div>
                              <span className="text-xs text-red-500 line-through font-bold">₹{strikePrice.toLocaleString("en-IN")}</span>
                              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">₹{opt.finalFare.toLocaleString("en-IN")}</div>
                            </div>
                            <button 
                              type="button" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setSelectedVehicleType(opt.vehicleType); 
                                setShowUserForm(true); 
                              }} 
                              className="mt-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition"
                            >
                              Proceed to Booking ➔
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
                <div className="text-center pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">Secure Checkout</span>
                  <h4 className="text-lg font-black text-slate-900 mt-2">Complete Your Booking</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Selected: <strong className="text-slate-800 uppercase">{selectedOption?.vehicleLabel}</strong></p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide block mb-1">Passenger Full Name *</label>
                    <input 
                      type="text" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)} 
                      placeholder="Enter full name"
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 outline-none focus:border-orange-500 transition" 
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide block mb-1">Mobile Number (For Driver SMS) *</label>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      value={customerPhone} 
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))} 
                      placeholder="10-digit mobile number" 
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 outline-none focus:border-orange-500 transition" 
                    />
                  </div>

                  {/* Dynamic Payment Option Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">Advance Payment Option</label>
                    <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                      {[25, 50, 100].map((percent) => {
                        const isActive = selectedPercent === percent;
                        return (
                          <button
                            key={percent}
                            type="button"
                            onClick={() => handlePercentChange(percent)}
                            className={`py-3 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                              isActive 
                                ? "bg-orange-600 text-white shadow-md" 
                                : "text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {percent === 100 ? "Full Pay" : `${percent}% Pay`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 👑 Wallet Option: Always Visible, Disabled if Balance < 100 */}
                  {customerData !== undefined && (
                    <div className={`border p-4 rounded-2xl flex items-center justify-between transition-colors ${
                      !isWalletUsable ? 'bg-slate-100 border-slate-200 opacity-75' :
                      applyWalletDiscount ? 'bg-orange-50 border-orange-300' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <div className={`text-xs font-black ${!isWalletUsable ? 'text-slate-500' : 'text-slate-800'}`}>
                          Use Wallet Balance <span className={!isWalletUsable ? 'text-slate-500' : 'text-orange-600'}>(₹{userWallet} available)</span>
                        </div>
                        
                        {isWalletUsable ? (
                          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                            Save up to ₹{maxWalletDiscount} instantly on this booking
                          </div>
                        ) : (
                          <div className="text-[10px] text-red-500 font-bold mt-0.5">
                            Minimum ₹100 wallet balance required to use.
                          </div>
                        )}
                      </div>
                      
                      <label className={`relative flex items-center ${isWalletUsable ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                        <input
                          type="checkbox"
                          checked={applyWalletDiscount && isWalletUsable}
                          disabled={!isWalletUsable}
                          onChange={(e) => setApplyWalletDiscount(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          !isWalletUsable 
                            ? 'bg-slate-300 after:border-slate-300' 
                            : 'bg-slate-300 peer-checked:bg-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:border-slate-300'
                        }`}></div>
                      </label>
                    </div>
                  )}

                  {/* Payable Summary Box */}
                  <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col gap-3 shadow-md">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Trip Fare</span>
                      <span className="text-sm font-bold text-white">₹{baseFare.toLocaleString("en-IN")}</span>
                    </div>
                    
                    {applyWalletDiscount && walletDiscountAmount > 0 && (
                      <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Wallet Discount Applied</span>
                        <span className="text-sm font-bold text-emerald-400">- ₹{walletDiscountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-end pt-1">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 block mb-1">Total Payable Now</span>
                        <span className="text-3xl font-black text-white leading-none">₹{payableNow.toLocaleString("en-IN")}</span>
                      </div>
                      
                      {selectedPercent !== 100 && (
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Balance to Driver</span>
                          <span className="text-sm font-bold text-red-400">₹{balanceDue.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowUserForm(false)} 
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase py-4 rounded-2xl border border-slate-200 transition"
                    >
                      ↩ Back
                    </button>
                    <button 
                      type="button"
                      disabled={paymentLoadingId !== null}
                      onClick={() => {
                        if (selectedOption) {
                          // Dynamic values correctly passed to parent function
                          handleOnlinePaymentCheckout({
                            ...selectedOption,
                            calculatedPayableNow: payableNow,
                            calculatedBalanceDue: balanceDue,
                            appliedWalletDiscount: walletDiscountAmount,
                            paymentSplitPercentage: selectedPercent
                          });
                        }
                      }} 
                      className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-orange-600/30 transition disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {paymentLoadingId ? (
                        <>Processing...</>
                      ) : (
                        <>Pay ₹{payableNow.toLocaleString("en-IN")}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
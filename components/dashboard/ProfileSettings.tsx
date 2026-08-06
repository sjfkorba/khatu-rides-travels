"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Camera,
  Save,
  Calendar,
  Clock,
  BadgeCheck,
  Star,
  MapPin,
  Globe,
  TrendingUp,
  Award,
  CheckCircle2,
  Edit2,
  X,
} from "lucide-react";

interface Props {
  currentUser: any;
}

export default function ProfileSettings({ currentUser }: Props) {
  const [name, setName] = useState(currentUser?.displayName || "");
  const [phone, setPhone] = useState(currentUser?.phoneNumber || "");
  const [location, setLocation] = useState(currentUser?.location || "");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Calculate profile completion dynamically
  const calculateProfileCompletion = () => {
    let score = 0;
    if (currentUser?.displayName) score += 25;
    if (currentUser?.email) score += 25;
    if (currentUser?.phoneNumber) score += 25;
    if (currentUser?.photoURL) score += 25;
    return score;
  };

  const profileComplete = calculateProfileCompletion();

  const handleSave = async () => {
    try {
      setLoading(true);
      // Firebase Update Logic Here
      // await updateProfile(currentUser.uid, { displayName: name, phoneNumber: phone, location });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Profile Updated Successfully");
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      console.error("Profile update error:", err);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(currentUser?.displayName || "");
    setPhone(currentUser?.phoneNumber || "");
    setLocation(currentUser?.location || "");
    setIsEditing(false);
  };

  // Format date dynamically
  const formatDate = (timestamp: any) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format time dynamically
  const formatTime = (timestamp: any) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if user is verified
  const isVerified = currentUser?.emailVerified || currentUser?.phoneNumberVerified;

  // Get membership tier dynamically
  const getMembershipTier = () => {
    if (currentUser?.membershipTier) return currentUser.membershipTier;
    if (currentUser?.isPremium) return "Premium";
    return "Standard";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-orange-50/30 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden mb-6">
          
          {/* Premium Header Banner */}
          <div className="relative bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 p-6 sm:p-10 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                
                {/* Profile Image with Status */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-orange-400 to-amber-400 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative">
                    <img
                      src={
                        currentUser?.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || "User")}&background=ffffff&color=ff6b00&size=200`
                      }
                      alt="Profile"
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-2xl object-cover"
                    />
                    {currentUser?.isOnline && (
                      <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white hover:bg-orange-50 transition-all rounded-full p-2.5 shadow-lg group-hover:scale-110">
                    <Camera size={18} className="text-orange-600" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                    <h2 className="text-3xl sm:text-4xl font-black text-white">
                      {currentUser?.displayName || "User"}
                    </h2>
                    {isVerified && <BadgeCheck className="text-white" size={28} />}
                  </div>
                  <p className="text-orange-100 text-base sm:text-lg font-medium mb-4">
                    {getMembershipTier()} Member {isVerified && "• Verified Traveler"}
                  </p>
                  
                  {/* Badges */}
                  <div className="flex gap-3 justify-center lg:justify-start flex-wrap">
                    {isVerified && (
                      <span className="bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 text-white hover:bg-white/35 transition">
                        <BadgeCheck size={16} />
                        Verified Account
                      </span>
                    )}
                    {currentUser?.isPremium && (
                      <span className="bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 text-white hover:bg-white/35 transition">
                        <Star size={16} />
                        Premium
                      </span>
                    )}
                    {currentUser?.isPartner && (
                      <span className="bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 text-white hover:bg-white/35 transition">
                        <Award size={16} />
                        National Partner
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Stats - Desktop Only (Dynamic) */}
                {currentUser?.stats && (
                  <div className="hidden lg:flex gap-6 text-white">
                    <div className="text-center">
                      <div className="text-2xl font-black">{currentUser.stats.totalTrips || 0}</div>
                      <div className="text-xs text-orange-100 font-medium">Trips</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black">{currentUser.stats.totalSaved || "₹0"}</div>
                      <div className="text-xs text-orange-100 font-medium">Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black">{currentUser.stats.rating || "N/A"}</div>
                      <div className="text-xs text-orange-100 font-medium">Rating</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Profile Completion Bar */}
            <div className="bg-linear-to-r from-slate-50 to-orange-50/50 rounded-2xl p-5 border border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-orange-600" size={20} />
                  <span className="text-sm font-bold text-slate-700">Profile Completion</span>
                </div>
                <span className="text-sm font-black text-orange-600">{profileComplete}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${profileComplete}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Complete your profile to unlock exclusive travel deals and priority support
              </p>
            </div>

            {/* Personal Information Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <User className="text-orange-600" size={22} />
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-orange-600 hover:text-orange-700 font-bold text-sm flex items-center gap-2 transition"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                ) : null}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-orange-600" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full border-2 rounded-2xl pl-12 pr-4 py-4 font-semibold transition-all outline-none ${
                        isEditing
                          ? "border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 bg-white"
                          : "border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {/* Email - Always Disabled */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={currentUser?.email || ""}
                      disabled
                      className="w-full border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 bg-slate-50 text-slate-500 font-semibold cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Managed through Google Account</p>
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-orange-600" size={18} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full border-2 rounded-2xl pl-12 pr-4 py-4 font-semibold transition-all outline-none ${
                        isEditing
                          ? "border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 bg-white"
                          : "border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-orange-600" size={18} />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full border-2 rounded-2xl pl-12 pr-4 py-4 font-semibold transition-all outline-none ${
                        isEditing
                          ? "border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 bg-white"
                          : "border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Card - Dynamic */}
            {currentUser?.membership && (
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-400 via-orange-500 to-red-500 p-6 sm:p-8 shadow-2xl">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-300/30 rounded-full translate-y-1/3 -translate-x-1/3 blur-xl"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/25 backdrop-blur-sm p-3 rounded-2xl">
                        <ShieldCheck className="text-white" size={40} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-2xl text-white">
                            {currentUser.membership.tier || "Membership"}
                          </h3>
                          <Star className="text-amber-300 fill-amber-300" size={24} />
                        </div>
                        <p className="text-white/90 text-sm mt-1 font-medium">
                          {currentUser.membership.description || "Unlock premium travel benefits nationwide"}
                        </p>
                        {currentUser.membership.benefits && (
                          <div className="flex gap-3 mt-3 flex-wrap">
                            {currentUser.membership.benefits.map((benefit: string, index: number) => (
                              <span key={index} className="bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5">
                                <CheckCircle2 size={14} />
                                {benefit}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {currentUser.membership.bonus && (
                      <div className="text-right">
                        <div className="text-3xl font-black text-white">{currentUser.membership.bonus}</div>
                        <p className="text-white/90 text-sm font-medium">Signup Bonus Active</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Account Security - Dynamic */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="border-2 border-slate-200 rounded-2xl p-5 hover:border-orange-300 transition-colors">
                <div className="flex gap-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <ShieldCheck className="text-green-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-800 text-lg">Account Security</h4>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      Your account is protected with Google&apos;s advanced security
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {currentUser?.emailVerified && (
                        <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          Email Verified
                        </span>
                      )}
                      {currentUser?.phoneNumberVerified && (
                        <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          Phone Verified
                        </span>
                      )}
                      {currentUser?.twoFactorEnabled && (
                        <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          2FA Enabled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-slate-200 rounded-2xl p-5 hover:border-orange-300 transition-colors">
                <div className="flex gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Globe className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-800 text-lg">Google Account</h4>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      Manage password and security settings in your Google Account
                    </p>
                    <button className="mt-3 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition">
                      Manage Google Account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline - Dynamic */}
            {(currentUser?.createdAt || currentUser?.lastLoginAt) && (
              <div className="grid md:grid-cols-2 gap-5">
                {currentUser?.createdAt && (
                  <div className="border-2 border-slate-200 rounded-2xl p-5 hover:border-orange-300 transition-colors">
                    <div className="flex gap-4">
                      <div className="bg-orange-100 p-3 rounded-xl">
                        <Calendar className="text-orange-600" size={24} />
                      </div>
                      <div>
                        <h5 className="font-black text-slate-800 text-lg">Account Created</h5>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                          {formatDate(currentUser.createdAt)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                          Joining the national travel network
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentUser?.lastLoginAt && (
                  <div className="border-2 border-slate-200 rounded-2xl p-5 hover:border-orange-300 transition-colors">
                    <div className="flex gap-4">
                      <div className="bg-purple-100 p-3 rounded-xl">
                        <Clock className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h5 className="font-black text-slate-800 text-lg">Last Login</h5>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                          {formatDate(currentUser.lastLoginAt)} • {formatTime(currentUser.lastLoginAt)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                          Active sessions across devices
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-4 justify-end border-t-2 border-slate-200 pt-6">
                <button
                  onClick={handleCancel}
                  className="px-8 py-4 rounded-2xl font-black text-slate-600 hover:bg-slate-100 transition flex items-center justify-center gap-2 border-2 border-slate-200"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-8 py-4 rounded-2xl font-black text-white bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 hover:scale-105 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Save size={18} />
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400 font-medium mt-6">
          Your data is secured with enterprise-grade encryption and Google&apos;s security infrastructure
        </p>
      </div>
    </div>
  );
}
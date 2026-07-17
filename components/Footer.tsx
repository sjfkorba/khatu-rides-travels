import Link from "next/link";
import {
  Car,
  Phone,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";
import TrackedCallButton from "@/components/TrackedCallButton";

// Import your route data
import { routeDatabase } from "@/lib/routeDatabase";

export default function Footer() {
  
  // ERROR FIX: AllRouteLinks yahan define kiya gaya hai
  const allRouteLinks = Object.keys(routeDatabase).map((slug) => ({
    label: routeDatabase[slug].title,
    href: `/routes/${slug}`,
  }));

  // Limit to 10 for UI clean-up
  const popularRouteLinks = allRouteLinks.slice(0, 10);

  return (
    <footer className="bg-slate-950 text-white relative z-20 border-t border-slate-900">
      
      {/* 👑 1. PREMIUM BRAND CTA CONVERSION CARD */}
      <div className="border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-white/5 shadow-2xl shadow-black/80">
            <div className="absolute inset-0 scale-105 opacity-15 pointer-events-none mix-blend-luminosity">
              <img src="/banner6.png" alt="Chhattisgarh Transit Network" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-600/95 to-amber-600/90 mix-blend-multiply" />
            
            <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left space-y-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                  <ShieldCheck size={12} /> Live Route Fleet Allocations Active
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
                  Need a Taxi in Chhattisgarh?
                </h2>
                <p className="text-white/80 font-bold text-xs sm:text-sm tracking-wide">
                  Swami Vivekananda Airport Transfers • Fixed One Way Cabs • Outstation Round Trips
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full sm:w-auto justify-center min-w-[280px]">
                <TrackedWhatsAppButton
                  href="https://wa.me/919244137353"
                  className="w-full sm:w-auto relative flex h-14 items-center justify-center gap-2 rounded-2xl bg-white text-orange-600 text-sm font-black uppercase tracking-wider shadow-xl transition-all active:scale-95 px-8"
                >
                  💬 WhatsApp
                </TrackedWhatsAppButton>
                <TrackedCallButton
                  href="tel:9244137353"
                  className="w-full sm:w-auto flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950/40 text-white text-sm font-black uppercase tracking-wider border border-white/30 backdrop-blur-xs shadow-lg hover:bg-slate-950 transition-all active:scale-95 px-8"
                >
                  📞 Call
                </TrackedCallButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 2. STRUCTURAL KNOWLEDGE LINK CLUSTERS */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5 text-left">
          
          {/* Brand Metadata Block */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Car className="text-orange-500" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight uppercase leading-none">
                  Khatu<span className="text-orange-500">Rides</span>
                </h2>
                <span className="text-[8px] font-black tracking-widest text-slate-500 block uppercase mt-0.5">Travels Co.</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs font-semibold">
              The premier intercity car rental architecture dominating Chhattisgarh. Delivering pre-fixed transparent dispatch systems.
            </p>
          </div>

          {/* Regional Cab Booking Services Index */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-white mb-5 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Regional Hubs
            </h3>
            <ul className="space-y-3 text-slate-400 text-xs font-bold">
              {[
                { href: "/services/one-way-taxi-raipur", label: "Taxi Service in Raipur" },
                { href: "/services/one-way-taxi-korba", label: "Taxi Service in Korba" },
                { href: "/services/one-way-taxi-bilaspur", label: "Taxi Service in Bilaspur" },
                { href: "/services/one-way-taxi-raigarh", label: "One Way Taxi Raigarh" },
                { href: "/services/one-way-taxi-jharsuguda", label: "One Way Taxi Jharsuguda" },
                { href: "/services/one-way-taxi-ambikapur", label: "One Way Taxi Ambikapur" },
                { href: "/services/one-way-taxi-jagdalpur", label: "One Way Taxi Jagdalpur" },
                { href: "/services/one-way-taxi-durg-bhilai", label: "One Way Taxi Durg-Bhilai" }
              ].map((link) => (
                <li key={link.href} className="flex items-center gap-1 group">
                  <ArrowRight size={10} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
                  <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Corridors Index (FIXED) */}
          <div>
            <h3 className="mb-5 flex items-center gap-1.5 border-b border-slate-900 pb-2 text-xs font-black uppercase tracking-widest text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Popular Routes
            </h3>
            <ul className="space-y-3 text-xs font-bold text-slate-400">
              {popularRouteLinks.map((link) => (
                <li key={link.href} className="group flex items-center gap-1">
                  <ArrowRight size={10} className="text-slate-700 transition-colors group-hover:text-orange-500" />
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-white mb-5 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Company
            </h3>
            <ul className="space-y-3 text-slate-400 text-xs font-bold">
              {["about-us", "contact-us", "blog"].map((slug) => (
                <li key={slug} className="flex items-center gap-1 group capitalize">
                  <ArrowRight size={10} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
                  <Link href={`/${slug}`} className="hover:text-white transition-colors">
                    {slug.replace("-", " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance Block */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-white mb-5 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Compliance
            </h3>
            <ul className="space-y-3 text-slate-400 text-xs font-bold">
              {["privacy-policy", "terms-and-conditions", "refund-policy"].map((slug) => (
                <li key={slug} className="flex items-center gap-1 group capitalize">
                  <ArrowRight size={10} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
                  <Link href={`/${slug}`} className="hover:text-white transition-colors">
                    {slug.replace("-", " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 🏢 3. COPYRIGHT STRIP */}
      <div className="border-t border-white/[0.02] bg-black/20 py-6 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        <p>© 2026 Khatu Rides Travels Co. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
// components/Footer.tsx
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

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white relative z-20 border-t border-slate-900">
      
      {/* 👑 1. PREMIUM BRAND CTA CONVERSION CARD WITH OVERLAY PATTERN */}
      <div className="border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-white/5 shadow-2xl shadow-black/80">
            
            {/* Background Image asset with absolute dark gradient overlay shielding */}
            <div className="absolute inset-0 scale-105 opacity-15 pointer-events-none mix-blend-luminosity">
              <img src="/banner6.png" alt="Chhattisgarh Transit Network" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-600/95 to-amber-600/90 mix-blend-multiply" />
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* Inner Contents Node layout grid mapping */}
            <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left space-y-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                  <ShieldCheck size={12} /> Live Route Fleet Allocations Active
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
                  Need a Taxi in Chhattisgarh?
                </h2>
                <p className="text-white/80 font-bold text-xs sm:text-sm tracking-wide">
                  Swami Vivekananda Airport Transfers • Fixed One Way Cabs • Outstation Round Trips • Corporate Protocol
                </p>
              </div>

              {/* Attractive Animated Buttons Hub panel */}
              <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full sm:w-auto justify-center min-w-[280px]">
                <TrackedWhatsAppButton
                  href="https://wa.me/919244137353"
                  className="w-full sm:w-auto relative flex h-14 items-center justify-center gap-2 rounded-2xl bg-white text-orange-600 text-sm font-black uppercase tracking-wider shadow-xl transition-all active:scale-95 animate-bounce duration-1000 px-8"
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

      {/* 📊 2. STRUCTURAL KNOWLEDGE LINK CLUSTERS (SEO ANCHORS HUB) */}
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
              The premier intercity car rental loop architecture dominating Chhattisgarh. Delivering pre-fixed transparent dispatch systems.
            </p>

            <div className="space-y-2 pt-2 text-xs font-bold text-slate-400">
              <div className="flex items-center gap-2 hover:text-white transition">
                <Phone size={14} className="text-orange-500" />
                <span>+91 9244137353</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-orange-500" />
                <span>Korba / Raipur Corridor, CG</span>
              </div>
            </div>
          </div>

          {/* Regional Cab Booking Services Index */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-white mb-5 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Regional Hubs
            </h3>
            <ul className="space-y-3 text-slate-400 text-xs font-bold">
              {[
                { href: "/cabs/raipur", label: "Taxi Service in Raipur" },
                { href: "/cabs/korba", label: "Taxi Service in Korba" },
                { href: "/cabs/bilaspur", label: "Taxi Service in Bilaspur" },
                { href: "/cabs/raigarh", label: "One Way Taxi Raigarh" },
                { href: "/cabs/jharsuguda", label: "One Way Taxi Jharsuguda" },
                { href: "/cabs/ambikapur", label: "One Way Taxi Ambikapur" },
                { href: "/cabs/jagdalpur", label: "One Way Taxi Jagdalpur" },
                { href: "/cabs/durg-bhilai", label: "One Way Taxi Durg-Bhilai" }
              ].map((link) => (
                <li key={link.href} className="flex items-center gap-1 group">
                  <ArrowRight size={10} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
                  <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Corridors Index */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-white mb-5 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Popular Routes
            </h3>
            <ul className="space-y-3 text-slate-400 text-xs font-bold">
              {[
                { href: "/routes/raipur-to-korba-taxi", label: "Raipur to Korba Cab" },
                { href: "/routes/raipur-to-bilaspur-taxi", label: "Raipur to Bilaspur Cab" },
                { href: "/routes/raipur-to-raigarh-taxi", label: "Raipur to Raigarh Cab" },
                // { href: "/cabs/raipur", label: "Swami Vivekananda Airport Taxi" }
              ].map((link, idx) => (
                <li key={idx} className="flex items-center gap-1 group">
                  <ArrowRight size={10} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
                  <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Profile Links */}
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

          {/* Strict Legal Matrix Block */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-white mb-5 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Compliance
            </h3>
            <ul className="space-y-3 text-slate-400 text-xs font-bold">
              {["privacy-policy", "terms-and-conditions", "refund-policy", "payment-terms"].map((slug) => (
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

      {/* 🏢 3. COPYRIGHT STRIP NODE */}
      <div className="border-t border-white/[0.02] bg-black/20 select-none">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <p>© 2026 Khatu Rides Travels Co. All Rights Reserved. Regd. commercial carriage operators.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-slate-300">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-slate-300">Terms Slabs</Link>
            <Link href="/refund-policy" className="hover:text-slate-300">Refunds Matrix</Link>
            <a href="https://www.khaturidescg.in" className="text-orange-500 hover:underline flex items-center gap-0.5">
              Official Portal <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}
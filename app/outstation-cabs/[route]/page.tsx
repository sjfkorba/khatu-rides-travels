import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import RouteHero from "@/components/RouteHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar"; 
import FloatingContact from "@/components/FloatingContact";
import { MapPin, ShieldCheck, Clock, CheckCircle2, CarFront, Search, Navigation, Map, Users, Luggage, Star, ChevronRight, Info, Route as RouteIcon } from "lucide-react";

// Master Data List for Outstation Routes
const ORIGINS = ["raipur", "bilaspur", "durg", "bhilai", "korba", "raigarh", "ambikapur", "jagdalpur"];
// Inter-state and major long-distance destinations
const DESTINATIONS = ["nagpur", "jabalpur", "ranchi", "jharsuguda", "sambalpur", "varanasi", "prayagraj", "gondia", "patna", "bhubaneswar", "rourkela"];

const createRouteSlug = (from: string, to: string) => `${from}-to-${to}`;
const formatName = (str: string) => str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// 1. Generate Static Pages
export async function generateStaticParams() {
  const routes: { route: string }[] = [];
  for (const origin of ORIGINS) {
    for (const dest of DESTINATIONS) {
      if (origin !== dest) {
        routes.push({ route: createRouteSlug(origin, dest) });
      }
    }
  }
  return routes;
}

// 2. Outstation Specific SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ route: string }> }): Promise<Metadata> {
  const { route } = await params;
  const parts = route.split("-to-");
  
  if (parts.length !== 2) return {};

  const origin = formatName(parts[0]);
  const destination = formatName(parts[1]);

  return {
    title: `${origin} to ${destination} Outstation Cab | One-Way Taxi | Khatu Rides`,
    description: `Book outstation taxi from ${origin} to ${destination}. We offer one-way drops, round trips, and intercity car rentals with verified drivers and zero advance payment.`,
    keywords: `outstation cab ${origin} to ${destination}, one way taxi ${origin} to ${destination}, intercity cab ${destination}, ${origin} to ${destination} drop, hire innova for outstation, outstation taxi fare`,
    alternates: {
      canonical: `https://www.khaturidescg.in/outstation-cabs/${route}`,
    },
    openGraph: {
      title: `${origin} to ${destination} Outstation Taxi`,
      description: `Seamless intercity travel from ${origin} to ${destination}. Zero return fare for one-way drops.`,
      url: `https://www.khaturidescg.in/outstation-cabs/${route}`,
      siteName: "Khatu Rides Travels Co.",
      images: [{ url: "/hero/main%20image.png", width: 1200, height: 630 }],
      type: "website",
    }
  };
}

export default async function OutstationRoutePage({ params }: { params: Promise<{ route: string }> }) {
  const { route } = await params;
  const parts = route.split("-to-");

  if (parts.length !== 2) return notFound();

  const origin = formatName(parts[0]);
  const destination = formatName(parts[1]);

  // PRO SEO: Multi-Schema Strategy
  const schemaOrgJSONLD = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Outstation Taxi",
      "name": `${origin} to ${destination} Outstation Cab`,
      "description": `Intercity cab service providing one-way and round-trip transfers from ${origin} to ${destination}.`,
      "provider": {
        "@type": "LocalBusiness",
        "name": "Khatu Rides Travels Co.",
        "telephone": PHONE,
        "image": "https://www.khaturidescg.in/hero/main%20image.png"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.khaturidescg.in/" },
        { "@type": "ListItem", "position": 2, "name": "Outstation Cabs", "item": "https://www.khaturidescg.in/outstation-cabs" },
        { "@type": "ListItem", "position": 3, "name": `${origin} to ${destination}` }
      ]
    }
  ];

  const seoKeywords = [
    `Outstation taxi to ${destination}`, `${origin} to ${destination} one way cab`, `Intercity cab ${origin}`,
    `Hire Innova for ${destination}`, `${origin} to ${destination} car rental`, `${origin} to ${destination} distance`,
    `Outstation cab fare ${origin}`, `Drop taxi ${destination}`, `State to state taxi ${origin}`
  ];

  return (
    <>
      <Navbar />
      <FloatingContact origin={origin} destination={destination} />

      <main className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }} />

        {/* SEO Breadcrumbs */}
        <div className="bg-slate-900 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span>Outstation Cabs</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-400 font-semibold">{origin} to {destination}</span>
        </div>

        <RouteHero initialPickup={origin} initialDrop={destination} />

        {/* OUTSTATION TRUST BAR */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white py-6 border-b-4 border-amber-400 shadow-xl relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-white/10">
              <div className="px-2 group">
                <Navigation className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">All India Permit</p>
              </div>
              <div className="px-2 group">
                <ShieldCheck className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">GPS Tracked</p>
              </div>
              <div className="px-2 group">
                <RouteIcon className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">One-Way Fares</p>
              </div>
              <div className="px-2 group">
                <Clock className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">24/7 Dispatch</p>
              </div>
            </div>
          </div>
        </div>

        {/* ROUTE OVERVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs font-black uppercase tracking-wider">
                <RouteIcon className="w-4 h-4" /> Premium Intercity Travel
              </div>
              <h1 className="text-3xl md:text-[42px] font-black text-slate-900 leading-[1.15]">
                Outstation Cab from <span className="text-amber-500">{origin}</span> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">{destination}</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Long-distance travel made comfortable! Book a highly reliable outstation cab from <strong className="text-slate-900">{origin}</strong> to <strong className="text-slate-900">{destination}</strong> with Khatu Rides. We offer transparent per-km rates, meaning you only pay for the distance you travel on one-way drops. No empty return fare!
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-200">
                {[
                  "Pay Only For One-Way Drop",
                  "Inter-State Taxes Included",
                  "Door-to-Door Pickup/Drop",
                  "Verified Highway Drivers"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Card */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-indigo-100 to-transparent rounded-full -z-0"></div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-8 relative z-10 flex items-center gap-3">
                  <MapPin className="text-amber-500" /> Journey Details
                </h3>
                
                <div className="relative border-l-[3px] border-dashed border-indigo-200 ml-5 pl-8 space-y-12 py-2">
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup City</p>
                    <p className="text-2xl font-black text-slate-900">{origin}</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Drop Location</p>
                    <p className="text-2xl font-black text-slate-900">{destination}</p>
                  </div>
                </div>

                <div className="mt-12 p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl flex items-center gap-4 border border-slate-200">
                  <Info className="w-8 h-8 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">One-Way Policy</p>
                    <p className="text-slate-800 font-semibold text-sm mt-0.5">Why pay return fares? Book our one-way drop to {destination} and save up to 40% on your travel cost.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FLEET & FARE GUIDE */}
        <section className="bg-white py-16 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Outstation Fleet Options</h2>
              <p className="text-slate-600 mt-4 text-lg">Well-maintained cars for long-distance highway travel.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:border-amber-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Sedan</h3>
                    <p className="text-slate-500 text-sm font-semibold">Swift Dzire, Toyota Etios</p>
                  </div>
                  <CarFront className="w-10 h-10 text-slate-300 group-hover:text-amber-400 transition-colors" />
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Users className="w-4 h-4"/> 4 Seats</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Luggage className="w-4 h-4"/> 2 Bags</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Cost Effective</p>
                  <p className="text-sm font-semibold text-slate-800">Best for solo travelers or small families on a budget.</p>
                </div>
              </div>

              <div className="border border-amber-400 bg-amber-50/30 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                  Highway Favorite
                </div>
                <div className="flex justify-between items-start mb-6 mt-2">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">SUV</h3>
                    <p className="text-slate-500 text-sm font-semibold">Maruti Ertiga, Kia Carens</p>
                  </div>
                  <CarFront className="w-10 h-10 text-amber-400" />
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Users className="w-4 h-4"/> 6 Seats</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Luggage className="w-4 h-4"/> 3 Bags</span>
                </div>
                <div className="bg-white border border-amber-200 p-4 rounded-2xl">
                  <p className="text-xs text-amber-600 font-bold uppercase mb-1">Comfort Choice</p>
                  <p className="text-sm font-semibold text-slate-800">Extra legroom and luggage space for longer intercity trips.</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:border-indigo-400 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Premium SUV</h3>
                    <p className="text-slate-500 text-sm font-semibold">Toyota Innova Crysta</p>
                  </div>
                  <CarFront className="w-10 h-10 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Users className="w-4 h-4"/> 7 Seats</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Luggage className="w-4 h-4"/> 4 Bags</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Premium Class</p>
                  <p className="text-sm font-semibold text-slate-800">Ultimate ride quality and safety for long interstate journeys.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Intercity Travel FAQs</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-indigo-600">Q.</span> Are toll taxes and state permits included in the fare?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  Yes, when you book an outstation cab from {origin} to {destination}, our custom quote clearly mentions if Fastag tolls and inter-state border taxes are included, ensuring a smooth ride without stopping for cash payments.
                </p>
              </div>
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-indigo-600">Q.</span> Can I book a cab for late-night travel to {destination}?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  Absolutely. We operate 24/7. Our drivers are specially trained for night-time highway driving between {origin} and {destination}, and our vehicles are GPS tracked for your complete safety.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KEYWORD CLOUD */}
        <section className="py-12 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Search className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-white">Popular Outstation Searches</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {seoKeywords.map((keyword, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-xs sm:text-sm font-semibold text-slate-400 hover:border-amber-400 hover:text-white transition-colors cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
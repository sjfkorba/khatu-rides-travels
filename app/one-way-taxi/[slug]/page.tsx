import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import RouteHero from "@/components/RouteHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar"; 
import FloatingContact from "@/components/FloatingContact";
import { 
  MapPin, ShieldCheck, Clock, CheckCircle2, CarFront, 
  Search, Navigation, Users, Luggage, ChevronRight, 
  Info, Route as RouteIcon, IndianRupee, ThumbsUp, 
  PhoneCall, CalendarCheck, MessageCircle, Star
} from "lucide-react";

// Master Data List for One-Way SEO
const CITIES = ["raipur", "bilaspur", "durg", "bhilai", "korba", "nagpur", "jabalpur", "ranchi", "jharsuguda"];

// Helper functions
const formatName = (str: string) => str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// Dynamic Content Generators
const generateDistanceMock = (origin: string, dest: string) => {
  // Mock distance logic for SEO content depth
  const hash = origin.length + dest.length;
  return `${200 + (hash * 15)} km`; 
};

const generateTimeMock = (origin: string, dest: string) => {
  const hash = origin.length + dest.length;
  return `${4 + (hash % 4)} to ${5 + (hash % 4)} hours`;
};

// 1. Generate Static Pages
export async function generateStaticParams() {
  const routes: { slug: string }[] = [];
  
  for (const city of CITIES) {
    routes.push({ slug: city });
  }

  for (const origin of CITIES) {
    for (const dest of CITIES) {
      if (origin !== dest) {
        routes.push({ slug: `${origin}-to-${dest}` });
      }
    }
  }
  return routes;
}

// 2. High-Intent Dynamic SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const isRoute = slug.includes("-to-");
  
  let title, description, keywords;

  if (isRoute) {
    const [originSlug, destSlug] = slug.split("-to-");
    const origin = formatName(originSlug);
    const dest = formatName(destSlug);
    title = `Book ${origin} to ${dest} One Way Taxi | Zero Return Fare | Khatu Rides`;
    description = `Need a drop? Hire a one-way cab from ${origin} to ${dest}. Pay only for one side. Verified drivers, instant booking, and doorstep pickup. Call ${PHONE} now!`;
    keywords = `one way taxi ${origin} to ${dest}, book drop cab ${origin} to ${dest}, zero return fare taxi ${origin}, intercity drop ${dest}, half price taxi ${origin} to ${dest}, outstation cab fare ${origin} to ${dest}`;
  } else {
    const city = formatName(slug);
    title = `Top One Way Taxi Service in ${city} | Outstation Drop Cabs & Rentals`;
    description = `Looking for an outstation drop from ${city}? Hire affordable one-way taxis with Khatu Rides. Pay only one-way fare for all major routes. Book instantly!`;
    keywords = `one way cab ${city}, drop taxi service ${city}, outstation drop from ${city}, no return fare cab ${city}, intercity one way travel ${city}, taxi hire in ${city}`;
  }

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://www.khaturidescg.in/one-way-taxi/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.khaturidescg.in/one-way-taxi/${slug}`,
      siteName: "Khatu Rides Travels Co.",
      images: [{ url: "/hero/one-way-banner.png", width: 1200, height: 630 }],
      type: "website",
    }
  };
}

export default async function OneWayTaxiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isRoute = slug.includes("-to-");
  
  let origin = "";
  let destination = "";
  let pageType: "route" | "city" = "city";

  if (isRoute) {
    const parts = slug.split("-to-");
    if (parts.length !== 2) return notFound();
    origin = formatName(parts[0]);
    destination = formatName(parts[1]);
    pageType = "route";
  } else {
    origin = formatName(slug);
    pageType = "city";
  }

  const schemaName = pageType === "route" ? `${origin} to ${destination} One Way Drop` : `One Way Taxi from ${origin}`;
  const schemaOrgJSONLD = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "One Way Taxi",
      "name": schemaName,
      "description": `Premium one-way drop taxi service ${pageType === "route" ? `from ${origin} to ${destination}` : `from ${origin}`}. No empty return fare.`,
      "provider": {
        "@type": "LocalBusiness",
        "name": "Khatu Rides Travels Co.",
        "telephone": PHONE,
        "image": "https://www.khaturidescg.in/hero/one-way-banner.png"
      }
    }
  ];

  // Dynamic Keyword Generator for deep SEO linking
  const generateDynamicKeywords = () => {
    if (pageType === "route") {
      return [
        `Cab booking ${origin} to ${destination}`, `Drop taxi to ${destination}`, 
        `Half fare taxi from ${origin}`, `No return fare cab ${destination}`, 
        `Car rental drop ${origin}`, `${origin} to ${destination} distance taxi`,
        `Cheapest cab ${origin} to ${destination}`, `Innova drop ${destination}`,
        `Night cab ${origin} to ${destination}`, `Intercity taxi ${origin}`
      ];
    }
    return [
      `One way cab in ${origin}`, `Outstation drop from ${origin}`, 
      `${origin} one side taxi`, `Best drop cabs ${origin}`, 
      `Zero return fare ${origin}`, `Airport drop from ${origin}`,
      `Long distance taxi ${origin}`, `Hire SUV ${origin}`,
      `Interstate cab service ${origin}`, `Reliable taxis in ${origin}`
    ];
  };
  
  const seoKeywords = generateDynamicKeywords();

  return (
    <>
      <Navbar />
      <FloatingContact origin={origin} destination={destination} />

      <main className="flex flex-col min-h-screen bg-slate-50 font-sans pb-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }} />

        {/* SEO Breadcrumbs */}
        <div className="bg-slate-900 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/one-way-taxi" className="hover:text-emerald-400 transition-colors">One-Way Taxi</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-400 font-semibold">
            {pageType === "route" ? `${origin} to ${destination}` : origin}
          </span>
        </div>

        {/* Dynamic Hero Section - Passed props for localized context */}
        <RouteHero 
          initialPickup={origin} 
          initialDrop={destination} 
          titleText={pageType === "route" ? `One-Way Drop: ${origin} to ${destination}` : `Outstation Drops from ${origin}`}
          subtitleText="Pay only one side. Save up to 40% instantly."
        />

        {/* HIGH INTENT TRUST BAR */}
        <div className="bg-emerald-600 text-white py-4 border-b-4 border-emerald-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 text-sm font-bold">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>100% Verified Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                <span>Zero Hidden Fares</span>
              </div>
              {/* Immediate CTA on Trust Bar */}
              <a href={`tel:${PHONE}`} className="bg-slate-900 text-emerald-400 px-4 py-1.5 rounded-full hover:bg-slate-800 transition-colors flex items-center gap-2">
                <PhoneCall className="w-4 h-4" /> Quick Quote
              </a>
            </div>
          </div>
        </div>

        {/* 1. MAIN CONVERSION SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-[55%] space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <IndianRupee className="w-4 h-4" /> Save Big on {pageType === "route" ? "This Route" : "Outstation"}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.15]">
                {pageType === "route" ? (
                  <>Book One-Way Cab from <span className="text-emerald-600 underline decoration-amber-400 underline-offset-4">{origin}</span> to <span className="text-emerald-600">{destination}</span></>
                ) : (
                  <>Top-Rated One-Way Taxi from <span className="text-emerald-600 underline decoration-amber-400 underline-offset-4">{origin}</span></>
                )}
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {pageType === "route" 
                  ? `Don't pay return fares for a one-way trip! Our dedicated drop taxi service from ${origin} to ${destination} guarantees seamless intercity travel at flat rates. Experience doorstep pickup in ${origin} and direct drop-off anywhere in ${destination}.`
                  : `Starting your journey from ${origin}? Hire our outstation drop cabs and pay strictly for the distance you travel. No empty return charges. Perfect for airport transfers, corporate travel, or family relocations.`}
              </p>

              {/* High Intent Business CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href={`tel:${PHONE}`} className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-1">
                  <PhoneCall className="w-5 h-5" /> Call Now to Book
                </a>
                <a href={`https://wa.me/91${PHONE}?text=Hi Khatu Rides, I need a one-way cab ${pageType === 'route' ? `from ${origin} to ${destination}` : `from ${origin}`}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-[#20bd5a] shadow-lg shadow-[#25D366]/30 transition-all hover:-translate-y-1">
                  <MessageCircle className="w-5 h-5" /> WhatsApp Us
                </a>
              </div>
            </div>

            {/* Smart Pricing & USP Card */}
            <div className="lg:w-[45%] w-full">
              <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0"></div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 relative z-10">Why Pay Double?</h3>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-60">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <span className="text-red-600 font-bold">X</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 line-through">Standard Cabs (Round Trip Fare)</p>
                      <p className="text-xs text-slate-500 mt-1">Paying for driver's empty return.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 shadow-md transform scale-[1.02]">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-emerald-900 text-lg">Khatu Rides (Drop Fare)</p>
                      <p className="text-sm text-emerald-700 mt-1 font-medium">You pay ONLY for the actual drop distance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. DYNAMIC CITY / ROUTE INSIGHTS (SEO GOLDMINE) */}
        <section className="bg-emerald-900 text-white py-16 relative overflow-hidden">
          <div className="absolute opacity-5 -top-24 -left-24"><MapPin className="w-96 h-96" /></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-black mb-6">
                  {pageType === "route" ? `Journey Info: ${origin} to ${destination}` : `Outstation Travel from ${origin}`}
                </h2>
                <div className="prose prose-invert prose-lg text-emerald-100">
                  {pageType === "route" ? (
                    <p>
                      Traveling from the heart of <strong>{origin}</strong> to the bustling streets of <strong>{destination}</strong> is now highly convenient. The estimated driving distance is approximately <strong>{generateDistanceMock(origin, destination)}</strong>, taking around <strong>{generateTimeMock(origin, destination)}</strong> via the fastest highway routes. Our expert drivers are highly familiar with the inter-state borders, ensuring a smooth, uninterrupted ride without hidden toll-tax surprises.
                    </p>
                  ) : (
                    <p>
                      As a major transit hub, <strong>{origin}</strong> sees thousands of travelers requiring outstation drops daily. Whether you are heading to a neighboring state, an airport, or a remote industrial town, booking a dedicated one-way taxi from {origin} ensures safety and immense cost savings. We provide door-to-door pickups from any locality in {origin}.
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-800/50 p-6 rounded-2xl border border-emerald-700/50 backdrop-blur-sm text-center">
                  <Clock className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <h4 className="font-bold text-lg">On-Time Pickup</h4>
                  <p className="text-xs text-emerald-200 mt-2">Zero delays from {origin}</p>
                </div>
                <div className="bg-emerald-800/50 p-6 rounded-2xl border border-emerald-700/50 backdrop-blur-sm text-center">
                  <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <h4 className="font-bold text-lg">Safe Highway Drive</h4>
                  <p className="text-xs text-emerald-200 mt-2">GPS tracked fleet</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS (Booking Process for Leads) */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">How to Book Your Cab</h2>
              <p className="text-slate-600 mt-3 font-medium">3 simple steps to secure your ride in under 2 minutes.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-dashed bg-slate-200 z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center mb-6">
                  <PhoneCall className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">1. Request Quote</h3>
                <p className="text-sm text-slate-600">Call us or use WhatsApp to share your pickup in {origin} {pageType === "route" && `and drop in ${destination}`}.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-white shadow-xl flex items-center justify-center mb-6">
                  <CarFront className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">2. Choose Car</h3>
                <p className="text-sm text-slate-600">Select from our Sedans, SUVs, or Premium Innovas based on your luggage.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center mb-6">
                  <CalendarCheck className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">3. Ride & Pay</h3>
                <p className="text-sm text-slate-600">Driver arrives at your doorstep. Pay only the agreed drop fare after the journey.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FLEET OPTIONS */}
        <section className="bg-slate-50 py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Choose Your Drop Cab</h2>
              <p className="text-slate-600 mt-4 text-lg">Well-maintained cars for comfortable outstation drops.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:border-emerald-400 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Sedan Drop</h3>
                    <p className="text-slate-500 text-sm font-semibold">Swift Dzire / Etios</p>
                  </div>
                  <CarFront className="w-10 h-10 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
                <div className="flex gap-4 mb-6 border-b border-slate-100 pb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Users className="w-4 h-4"/> 4 Seats</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Luggage className="w-4 h-4"/> 2 Bags</span>
                </div>
                <button className="w-full py-3 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-emerald-600 hover:text-white transition-colors">
                  Check Sedan Fare
                </button>
              </div>

              <div className="bg-white border border-amber-400 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                  Best Seller
                </div>
                <div className="flex justify-between items-start mb-6 mt-2">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">SUV Drop</h3>
                    <p className="text-slate-500 text-sm font-semibold">Ertiga / Carens</p>
                  </div>
                  <CarFront className="w-10 h-10 text-amber-500" />
                </div>
                <div className="flex gap-4 mb-6 border-b border-slate-100 pb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Users className="w-4 h-4"/> 6 Seats</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Luggage className="w-4 h-4"/> 3 Bags</span>
                </div>
                <button className="w-full py-3 rounded-xl bg-amber-400 text-slate-900 font-bold hover:bg-emerald-600 hover:text-white transition-colors">
                  Check SUV Fare
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:border-slate-400 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Premium SUV</h3>
                    <p className="text-slate-500 text-sm font-semibold">Innova Crysta</p>
                  </div>
                  <CarFront className="w-10 h-10 text-slate-300 group-hover:text-slate-700 transition-colors" />
                </div>
                <div className="flex gap-4 mb-6 border-b border-slate-100 pb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Users className="w-4 h-4"/> 7 Seats</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Luggage className="w-4 h-4"/> 4 Bags</span>
                </div>
                <button className="w-full py-3 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-emerald-600 hover:text-white transition-colors">
                  Check Innova Fare
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DYNAMIC KEYWORD CLOUD FOR SEO */}
        <section className="py-12 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Search className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Popular Search Routes & Categories</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {seoKeywords.map((keyword, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-xs sm:text-sm font-semibold text-slate-400 hover:border-emerald-400 hover:text-white transition-colors cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FINAL HIGH-INTENT LEAD BANNER */}
        <section className="fixed bottom-0 left-0 right-0 md:static md:bottom-auto bg-amber-400 md:bg-amber-400 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] md:shadow-none z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-900 text-center md:text-left hidden md:block">
              <h4 className="font-black text-xl">Ready for your drop {pageType === "route" ? `to ${destination}` : `from ${origin}`}?</h4>
              <p className="text-sm font-semibold opacity-90">Call now and get flat 10% off on advance bookings.</p>
            </div>
            <a href={`tel:${PHONE}`} className="w-full md:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black text-lg text-center hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <PhoneCall className="w-5 h-5 animate-pulse text-amber-400" /> Book Instantly
            </a>
          </div>
        </section>

      </main>
    </>
  );
}
import { Metadata } from "next";
import { notFound } from "next/navigation";
import RouteHero from "@/components/RouteHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar"; // Ensure path is correct based on your folder structure
import FloatingContact from "@/components/FloatingContact";
import { MapPin, ShieldCheck, Clock, CreditCard, CheckCircle2, CarFront, Search, Phone } from "lucide-react";

const HUBS = [
  // 1. Major Cities & Commercial Hubs (Highest Volume)
  "Raipur", "Naya Raipur", "Bilaspur", "Durg", "Bhilai", "Korba", 
  "Raigarh", "Ambikapur", "Jagdalpur", "Rajnandgaon",

  // 2. Industrial & Mining Belts (Corporate/Contract Leads)
  "Champa", "Kharsia", "Katghora", "Dipka", "Gevra", "Kusmunda", 
  "Balco", "Jamnipali", "NTPC Sipat", "Akaltara", "Janjgir", 
  "Sakti", "Bhatapara", "Tilda", "Baloda Bazar",

  // 3. District Headquarters & Mid-Size Towns (Regular Travel)
  "Mahasamund", "Dhamtari", "Gariaband", "Kawardha", "Bemetara", 
  "Balod", "Kanker", "Kondagaon", "Dantewada", "Sukma", "Bijapur", 
  "Narayanpur", "Mungeli", "Pendra", "Gaurela", "Baikunthpur", 
  "Surajpur", "Balrampur", "Jashpur", "Pathalgaon", "Manendragarh",

  // 4. Tourist & Pilgrimage Spots (High Margin Round-Trips)
  "Dongargarh", "Mainpat", "Chitrakote", "Tirathgarh", "Sirpur", 
  "Ratanpur", "Bhoramdeo", "Gangrel Dam", "Amarkantak", "Bastar",

  // 5. Inter-State Border Hubs (Long Distance Outstation)
  "Jharsuguda", "Sambalpur", "Bargarh", "Rourkela", "Nagpur", 
  "Gondia", "Jabalpur", "Ranchi", "Patna", "Varanasi", "Prayagraj", 
  "Deoghar", "Ujjain"
];

const createRouteSlug = (from: string, to: string) => 
  `${from.toLowerCase()}-to-${to.toLowerCase()}`;

export async function generateStaticParams() {
  const routes: { route: string }[] = [];
  for (let i = 0; i < HUBS.length; i++) {
    for (let j = 0; j < HUBS.length; j++) {
      if (i !== j) {
        routes.push({ route: createRouteSlug(HUBS[i], HUBS[j]) });
      }
    }
  }
  return routes;
}

export async function generateMetadata({ params }: { params: Promise<{ route: string }> }): Promise<Metadata> {
  const { route } = await params;
  
  const parts = route.split("-to-");
  if (parts.length !== 2) return {};

  const from = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  const to = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);

  return {
    title: `${from} to ${to} Taxi | Outstation Cab & One-Way Drop | Khatu Rides`,
    description: `Looking for a cab from ${from} to ${to}? Book reliable outstation taxis, one-way cabs, and round-trip rides with Khatu Rides. Clean AC cars & Verified Drivers.`,
    keywords: `${from} to ${to} taxi, one way cab ${from} to ${to}, outstation cab ${from}, ${from} to ${to} round trip, cab service in ${from}, book taxi ${from} to ${to}, Khatu Rides`,
    alternates: {
      canonical: `https://www.khaturidescg.in/cab-service/${route}`,
    },
  };
}

export default async function DynamicRoutePage({ params }: { params: Promise<{ route: string }> }) {
  const { route } = await params;
  const parts = route.split("-to-");

  if (parts.length !== 2) return notFound();

  const origin = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  const destination = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);

  // Enhanced LocalBusiness & Service Schema for Pro SEO
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Outstation Taxi Service",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Khatu Rides Travels Co.",
      "telephone": PHONE,
      "image": "https://www.khaturidescg.in/hero/main%20image.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Korba",
        "addressRegion": "Chhattisgarh",
        "addressCountry": "IN"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1250"
      }
    },
    "areaServed": [
      { "@type": "City", "name": origin },
      { "@type": "City", "name": destination }
    ],
    "description": `Book premium one-way, round-trip, and outstation cab services from ${origin} to ${destination}. Lowest fares guaranteed.`,
  };

  // SEO Keywords Array dynamically generated based on Route
  const seoKeywords = [
    `${origin} to ${destination} taxi service`,
    `One way cab from ${origin} to ${destination}`,
    `${origin} to ${destination} round trip cab`,
    `Outstation taxi ${origin} to ${destination}`,
    `Cheapest cab fare ${origin} to ${destination}`,
    `Book Innova from ${origin} to ${destination}`,
    `${origin} to ${destination} Ertiga taxi`,
    `Sedan cab ${origin} to ${destination}`,
    `Airport drop ${origin} to ${destination}`,
    `Car rental ${origin} to ${destination}`,
    `Hire taxi ${origin} to ${destination}`,
    `${origin} to ${destination} distance by cab`,
    `Reliable taxi in ${origin}`
  ];

  return (
    <>
      <Navbar />
      
      <FloatingContact origin={origin} destination={destination} />

      <main className="flex flex-col min-h-screen bg-slate-50 font-sans">
        {/* SEO JSON-LD Script */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }} />

        {/* Dynamic Hero Section */}
        <RouteHero initialPickup={origin} initialDrop={destination} />

        {/* TRUST BAR */}
        <div className="bg-slate-900 text-white py-6 border-b-4 border-amber-400 shadow-lg relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-white/20">
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">10K+</p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">Happy Customers</p>
              </div>
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">4.9/5</p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">Google Ratings</p>
              </div>
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">0₹</p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">Advance Payment</p>
              </div>
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">24/7</p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">Booking Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* ROUTE OVERVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-bold">
                <MapPin className="w-4 h-4" /> Top Searched Route
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Reliable Cab Service from <span className="text-amber-500">{origin}</span> to <span className="text-amber-500">{destination}</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Traveling between <strong>{origin}</strong> and <strong>{destination}</strong> has never been easier. At Khatu Rides Travels Co., we specialize in premium intercity travel. Whether you need a <strong className="text-slate-800">One-Way Drop</strong>, a <strong className="text-slate-800">Round Trip</strong>, or an <strong className="text-slate-800">Airport Transfer</strong>, we provide top-condition AC taxis at highly transparent, per-kilometer pricing.
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  `Direct One-Way Taxis from ${origin} to ${destination}`,
                  "Flexible Round-Trip Outstation Packages",
                  "Verified, Experienced & Polite Chauffeurs",
                  "Doorstep Pickup and Exact Drop Locations"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    <span className="font-semibold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Route Card */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full -z-0"></div>
                <h3 className="text-2xl font-black text-slate-900 mb-8 relative z-10">Route Highlights</h3>
                
                <div className="relative border-l-4 border-dashed border-slate-200 ml-4 pl-8 space-y-10 py-2">
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pickup Origin</p>
                    <p className="text-xl font-black text-slate-900">{origin}</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-slate-900" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Drop Destination</p>
                    <p className="text-xl font-black text-slate-900">{destination}</p>
                  </div>
                </div>

                <div className="mt-10 p-5 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                  <CarFront className="w-10 h-10 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-500">Available Fleet</p>
                    <p className="text-slate-900 font-semibold">Sedan (Dzire) | SUV (Ertiga/Innova)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OUR FEATURES */}
        <section className="bg-slate-900 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.1),transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white">Why Choose Us for {origin} to {destination}?</h2>
              <p className="text-slate-400 mt-4 text-lg">We focus on your safety, comfort, and pocket. Experience standard cab services elevated to a premium level.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-amber-400/20 rounded-2xl flex items-center justify-center mb-6">
                  <CreditCard className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Transparent Billing</h3>
                <p className="text-slate-400">No hidden tolls or driver allowances at the end of the trip. The fare quote you get for the {destination} drop is final.</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Safe & Verified</h3>
                <p className="text-slate-400">All our vehicles undergo regular maintenance and sanitation. Our drivers are police-verified and trained for highway routes.</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">On-Time Always</h3>
                <p className="text-slate-400">Whether it's an early morning airport drop or a late-night arrival at {destination}, our cabs report to your location 15 mins early.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO FAQs SECTION */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
              <div className="h-1.5 w-20 bg-amber-400 mx-auto mt-4 rounded-full" />
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-amber-500">Q.</span> Do you provide one-way cabs from {origin} to {destination}?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  Yes, we absolutely do! Our primary service is offering dedicated one-way drops. You will only be charged for the one-way distance between {origin} and {destination}, saving you from paying return journey charges.
                </p>
              </div>

              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-amber-500">Q.</span> Do I need to pay any advance to book a taxi?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  No, Khatu Rides Travels Co. operates on a strict zero-advance policy. You can easily book your cab via Call or WhatsApp, enjoy your ride, and pay the driver directly once you reach {destination}.
                </p>
              </div>

              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-amber-500">Q.</span> What types of cars are available for this route?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  Depending on your family size and luggage, you can choose from our clean and AC fleet: 4-seater Sedans (Swift Dzire, Etios), 6-seater SUVs (Maruti Ertiga), or premium 7-seater SUVs (Toyota Innova).
                </p>
              </div>
            </div>
            
            {/* CTA inside FAQ */}
            <div className="mt-12 text-center bg-amber-50 p-8 rounded-3xl border border-amber-200">
              <h4 className="text-2xl font-bold text-slate-900 mb-4">Ready to book your ride?</h4>
              <p className="text-slate-600 mb-6">Get an instant quote for {origin} to {destination} in 2 minutes.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href={`tel:${PHONE}`} className="bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 transition shadow-lg flex justify-center items-center gap-2">
                  <Phone className="w-5 h-5" /> Call Now to Book
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5. POPULAR SEARCHES (SEO KEYWORDS CLOUD) */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-800">Popular Searches for this Route</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {seoKeywords.map((keyword, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-500 shadow-sm hover:border-amber-300 hover:text-slate-800 hover:bg-amber-50 transition-colors cursor-default"
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
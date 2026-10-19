import { Metadata } from "next";
import { notFound } from "next/navigation";
import RouteHero from "@/components/RouteHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar"; 
import FloatingContact from "@/components/FloatingContact";
import { MapPin, ShieldCheck, Clock, CheckCircle2, CarFront, Search, PlaneTakeoff, Luggage } from "lucide-react";

// Master Data List
const AIRPORTS = ["raipur-airport", "bilaspur-airport", "jharsuguda-airport"];
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

const createRouteSlug = (from: string, to: string) => `${from}-to-${to}`;
const formatName = (str: string) => str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// 1. Generate Static Pages (Airport -> Hub) & (Hub -> Airport)
export async function generateStaticParams() {
  const routes: { route: string }[] = [];
  
  for (const hub of HUBS) {
    for (const airport of AIRPORTS) {
      // Hub to Airport
      routes.push({ route: createRouteSlug(hub, airport) });
      // Airport to Hub
      routes.push({ route: createRouteSlug(airport, hub) });
    }
  }
  return routes;
}

// 2. Pro-Level Airport SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ route: string }> }): Promise<Metadata> {
  const { route } = await params;
  const parts = route.split("-to-");
  
  if (parts.length !== 2) return {};

  const origin = formatName(parts[0]);
  const destination = formatName(parts[1]);

  return {
    title: `${origin} to ${destination} Taxi | Airport Drop & Pickup | Khatu Rides`,
    description: `Book reliable airport taxi from ${origin} to ${destination}. On-time guarantee, flight tracking, and spacious AC cabs for luggage. Zero advance booking!`,
    keywords: `airport taxi ${origin} to ${destination}, cab to ${destination}, ${origin} airport drop, ${origin} to ${destination} taxi fare, prepaid taxi ${origin}, airport transfer Khatu Rides`,
    alternates: {
      canonical: `https://www.khaturidescg.in/airport-taxi/${route}`,
    },
  };
}

export default async function AirportRoutePage({ params }: { params: Promise<{ route: string }> }) {
  const { route } = await params;
  const parts = route.split("-to-");

  if (parts.length !== 2) return notFound();

  const origin = formatName(parts[0]);
  const destination = formatName(parts[1]);

  const isAirportPickup = parts[0].includes("airport");

  // Specialized Airport Transfer Schema
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Airport Transfer Taxi",
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
      }
    },
    "areaServed": [
      { "@type": "City", "name": origin },
      { "@type": "City", "name": destination }
    ],
    "description": `Premium airport transfer cab service from ${origin} to ${destination} featuring flight tracking and spacious vehicles.`
  };

  const seoKeywords = [
    `${origin} to ${destination} airport cab`,
    `Taxi fare ${origin} to ${destination}`,
    `Book Innova for ${destination}`,
    `Airport drop ${origin}`,
    `Prepaid taxi ${origin} to ${destination}`,
    `Night cab ${origin} to ${destination}`,
    `Cheapest airport taxi ${origin}`,
    `${origin} to ${destination} Ertiga cab`,
    `Outstation taxi to ${destination}`,
    `Reliable airport transfer`
  ];

  return (
    <>
      <Navbar />
      
      <FloatingContact origin={origin} destination={destination} />

      <main className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }} />

        {/* Dynamic Hero Section */}
        <RouteHero initialPickup={origin} initialDrop={destination} />

        {/* AIRPORT TRUST BAR */}
        <div className="bg-slate-900 text-white py-6 border-b-4 border-amber-400 shadow-lg relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-white/20">
              <div className="px-2">
                <PlaneTakeoff className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-300">Flight Tracking</p>
              </div>
              <div className="px-2">
                <Clock className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-300">Zero Wait Time</p>
              </div>
              <div className="px-2">
                <Luggage className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-300">Extra Boot Space</p>
              </div>
              <div className="px-2">
                <MapPin className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-300">Doorstep Drop</p>
              </div>
            </div>
          </div>
        </div>

        {/* ROUTE OVERVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-bold">
                <PlaneTakeoff className="w-4 h-4" /> Airport Transfer Special
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Seamless Airport Taxi from <span className="text-amber-500">{origin}</span> to <span className="text-amber-500">{destination}</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Never miss a flight or wait in long queues after landing. Khatu Rides Travels Co. provides premium, highly-punctual airport cab services between <strong>{origin}</strong> and <strong>{destination}</strong>. 
                {isAirportPickup 
                  ? ` Our driver will track your flight status and wait for you at the arrival gate, ready to assist with your luggage.` 
                  : ` We guarantee an on-time doorstep pickup so you reach the airport completely stress-free.`}
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  "No Cancellation Fees for Flight Delays",
                  "Spacious Sedans & SUVs for Heavy Luggage",
                  "Verified Drivers Experienced in Night Travel",
                  "100% Transparent Point-to-Point Billing"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Route Card */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-0"></div>
                <h3 className="text-2xl font-black text-slate-900 mb-8 relative z-10">Trip Itinerary</h3>
                
                <div className="relative border-l-4 border-dashed border-slate-200 ml-4 pl-8 space-y-10 py-2">
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg">
                      {isAirportPickup ? <PlaneTakeoff className="w-4 h-4 text-amber-400" /> : <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>}
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pickup Origin</p>
                    <p className="text-xl font-black text-slate-900">{origin}</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                      {!isAirportPickup ? <PlaneTakeoff className="w-4 h-4 text-slate-900" /> : <MapPin className="w-4 h-4 text-slate-900" />}
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Drop Destination</p>
                    <p className="text-xl font-black text-slate-900">{destination}</p>
                  </div>
                </div>

                <div className="mt-10 p-5 bg-blue-50 rounded-2xl flex items-center gap-4 border border-blue-100">
                  <Luggage className="w-10 h-10 text-blue-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-600">Need more luggage space?</p>
                    <p className="text-slate-900 font-semibold">Book an Ertiga or Innova SUV</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-slate-900 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white">The Best Airport Travel Experience</h2>
              <p className="text-slate-400 mt-4 text-lg">We understand the urgency and comfort required for airport transfers.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-amber-400/20 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Punctuality First</h3>
                <p className="text-slate-400">Our drivers reach the pickup point 15-30 minutes early. We guarantee you will never miss a flight or wait after landing.</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <PlaneTakeoff className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Flight Tracking</h3>
                <p className="text-slate-400">Flight delayed? Don't worry! We track your PNR/Flight status and adjust your pickup time automatically at no extra cost.</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Safe Night Travel</h3>
                <p className="text-slate-400">Most flights operate at odd hours. Our vehicles are GPS-enabled and our chauffeurs are trained for safe night-time highway driving.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
              <div className="h-1.5 w-20 bg-blue-500 mx-auto mt-4 rounded-full" />
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-blue-600">Q.</span> What happens if my flight to {isAirportPickup ? origin : destination} gets delayed?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  We monitor your flight status in real-time. If your flight is delayed, we automatically adjust your pickup time. You will not be charged any waiting fees or cancellation penalties for flight delays.
                </p>
              </div>

              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-blue-600">Q.</span> Does the fare include parking and toll charges?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  When you request a quote, we provide a 100% transparent final price. Depending on the route between {origin} and {destination}, we clearly mention if airport parking and highway tolls are included.
                </p>
              </div>

              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-blue-600">Q.</span> Which car should I book if I have heavy luggage?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  If you have 2-3 standard bags, a Sedan (Dzire/Etios) is perfect. For 4+ large bags or if you are traveling with a group/family, we highly recommend booking our 6-seater Ertiga or 7-seater Innova SUVs for maximum comfort.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KEYWORD CLOUD */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-800">Popular Searches for Airport Transfers</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {seoKeywords.map((keyword, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-500 shadow-sm hover:border-blue-400 hover:text-slate-800 hover:bg-blue-50 transition-colors cursor-default"
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
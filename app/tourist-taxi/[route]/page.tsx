import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import RouteHero from "@/components/RouteHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar"; 
import FloatingContact from "@/components/FloatingContact";
import { MapPin, ShieldCheck, Clock, CheckCircle2, CarFront, Search, Mountain, Camera, Sunrise, Map, Users, Luggage, Star, ChevronRight, Info } from "lucide-react";

// Master Data List for Tourist Routes
const ORIGINS = ["raipur", "bilaspur", "durg", "bhilai", "korba", "raigarh", "ambikapur", "jagdalpur"];
const DESTINATIONS = ["mainpat", "chitrakote", "dongargarh", "bhoramdeo", "amarkantak", "sirpur", "ratanpur", "bastar", "deoghar"];

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

// 2. Advanced Pro-Level Metadata with OpenGraph
export async function generateMetadata({ params }: { params: Promise<{ route: string }> }): Promise<Metadata> {
  const { route } = await params;
  const parts = route.split("-to-");
  
  if (parts.length !== 2) return {};

  const origin = formatName(parts[0]);
  const destination = formatName(parts[1]);

  return {
    title: `${origin} to ${destination} Tour Package & Taxi | Khatu Rides`,
    description: `Book a premium outstation cab from ${origin} to ${destination}. Enjoy customized tour packages, local sightseeing, verified drivers, and transparent per-km billing.`,
    keywords: `${origin} to ${destination} taxi, ${destination} tour package, ${origin} to ${destination} round trip, outstation cab ${destination}, hire innova for ${destination}, family trip to ${destination}`,
    alternates: {
      canonical: `https://www.khaturidescg.in/tourist-taxi/${route}`,
    },
    openGraph: {
      title: `${origin} to ${destination} Premium Taxi Package`,
      description: `Seamless outstation trips and sightseeing packages to ${destination} from ${origin}.`,
      url: `https://www.khaturidescg.in/tourist-taxi/${route}`,
      siteName: "Khatu Rides Travels Co.",
      images: [{ url: "/hero/main%20image.png", width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${origin} to ${destination} Taxi Package`,
      description: `Book your comfortable outstation ride today with Khatu Rides.`,
    }
  };
}

export default async function TouristRoutePage({ params }: { params: Promise<{ route: string }> }) {
  const { route } = await params;
  const parts = route.split("-to-");

  if (parts.length !== 2) return notFound();

  const origin = formatName(parts[0]);
  const destination = formatName(parts[1]);

  // PRO SEO: Multi-Schema Strategy (TouristTrip + LocalBusiness + BreadcrumbList)
  const schemaOrgJSONLD = [
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": `${origin} to ${destination} Sightseeing Tour`,
      "description": `Multi-day outstation taxi and tour package from ${origin} to ${destination} covering major local attractions.`,
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
        { "@type": "ListItem", "position": 2, "name": "Tourist Taxi", "item": "https://www.khaturidescg.in/tourist-taxi" },
        { "@type": "ListItem", "position": 3, "name": `${origin} to ${destination}` }
      ]
    }
  ];

  const seoKeywords = [
    `${destination} tour package`, `${origin} to ${destination} cab fare`, `Round trip taxi to ${destination}`,
    `Hire Innova for ${destination} trip`, `Weekend getaway from ${origin}`, `${origin} to ${destination} distance`,
    `${destination} sightseeing cab`, `Family cab to ${destination}`, `Outstation taxi packages ${origin}`
  ];

  return (
    <>
      <Navbar />
      <FloatingContact origin={origin} destination={destination} />

      <main className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }} />

        {/* SEO Breadcrumbs (Visual) */}
        <div className="bg-slate-900 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span>Tourist Taxi Packages</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-400 font-semibold">{origin} to {destination}</span>
        </div>

        {/* Dynamic Hero Section */}
        <RouteHero initialPickup={origin} initialDrop={destination} />

        {/* TOURIST TRUST BAR (Pro Level Design) */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white py-6 border-b-4 border-amber-400 shadow-xl relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-white/10">
              <div className="px-2 group">
                <Mountain className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">Sightseeing Included</p>
              </div>
              <div className="px-2 group">
                <ShieldCheck className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">Family Safe</p>
              </div>
              <div className="px-2 group">
                <Camera className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">Driver as Guide</p>
              </div>
              <div className="px-2 group">
                <Map className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">Custom Itinerary</p>
              </div>
            </div>
          </div>
        </div>

        {/* CORPORATE ROUTE OVERVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <Sunrise className="w-4 h-4" /> Recommended Holiday Route
              </div>
              <h1 className="text-3xl md:text-[42px] font-black text-slate-900 leading-[1.15]">
                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{destination}</span> with our Premium Outstation Taxi from <span className="text-amber-500">{origin}</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Planning a trip to <strong className="text-slate-900">{destination}</strong>? Leave the driving to us! Khatu Rides offers highly customized outstation tour packages starting from <strong className="text-slate-900">{origin}</strong>. Experience a stress-free holiday with our top-condition AC vehicles and polite chauffeurs who know every scenic spot.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-200">
                {[
                  "Complete Local Sightseeing Coverage",
                  "Flexible Night Halt Options",
                  "Premium SUVs for Extra Comfort",
                  "Zero Hidden Toll/Driver Charges"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Tour Card (Elevated Design) */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-emerald-100 to-transparent rounded-full -z-0"></div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-8 relative z-10 flex items-center gap-3">
                  <MapPin className="text-amber-500" /> Route Highlights
                </h3>
                
                <div className="relative border-l-[3px] border-dashed border-emerald-200 ml-5 pl-8 space-y-12 py-2">
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Journey Starts</p>
                    <p className="text-2xl font-black text-slate-900">{origin}</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination & Sightseeing</p>
                    <p className="text-2xl font-black text-slate-900">{destination}</p>
                  </div>
                </div>

                <div className="mt-12 p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl flex items-center gap-4 border border-slate-200">
                  <Info className="w-8 h-8 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Travel Tip</p>
                    <p className="text-slate-800 font-semibold text-sm mt-0.5">Start your journey early morning to avoid traffic and enjoy maximum sightseeing time in {destination}.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRO FLEET & FARE GUIDE (Huge Conversion Booster) */}
        <section className="bg-white py-16 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Choose Your Perfect Ride</h2>
              <p className="text-slate-600 mt-4 text-lg">We offer a highly maintained fleet for the {origin} to {destination} route. Choose based on your family size.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Fleet Card 1 */}
              <div className="border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:border-amber-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Sedan</h3>
                    <p className="text-slate-500 text-sm font-semibold">Dzire, Etios, Amaze</p>
                  </div>
                  <CarFront className="w-10 h-10 text-slate-300 group-hover:text-amber-400 transition-colors" />
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Users className="w-4 h-4"/> 4 Seats</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Luggage className="w-4 h-4"/> 2 Bags</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Ideal For</p>
                  <p className="text-sm font-semibold text-slate-800">Couples, Small Families, Business Trips.</p>
                </div>
              </div>

              {/* Fleet Card 2 */}
              <div className="border border-amber-400 bg-amber-50/30 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                  Most Popular
                </div>
                <div className="flex justify-between items-start mb-6 mt-2">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">SUV</h3>
                    <p className="text-slate-500 text-sm font-semibold">Maruti Ertiga, Carens</p>
                  </div>
                  <CarFront className="w-10 h-10 text-amber-400" />
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Users className="w-4 h-4"/> 6 Seats</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Luggage className="w-4 h-4"/> 3 Bags</span>
                </div>
                <div className="bg-white border border-amber-200 p-4 rounded-2xl mb-6">
                  <p className="text-xs text-amber-600 font-bold uppercase mb-1">Ideal For</p>
                  <p className="text-sm font-semibold text-slate-800">Families, Hill Stations, Extra Luggage.</p>
                </div>
              </div>

              {/* Fleet Card 3 */}
              <div className="border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:border-emerald-400 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Premium SUV</h3>
                    <p className="text-slate-500 text-sm font-semibold">Toyota Innova Crysta</p>
                  </div>
                  <CarFront className="w-10 h-10 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Users className="w-4 h-4"/> 7 Seats</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600"><Luggage className="w-4 h-4"/> 4 Bags</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Ideal For</p>
                  <p className="text-sm font-semibold text-slate-800">Large Groups, Luxury Comfort, Long Tours.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl hover:bg-slate-800 transition shadow-lg">
                Get Exact Fare Quote for this Fleet
              </a>
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS (Social Proof for Conversion) */}
        <section className="bg-slate-50 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">What Our Travelers Say</h2>
              <div className="h-1.5 w-20 bg-amber-400 mx-auto mt-4 rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Rahul S.", text: `Booked an Ertiga from ${origin} to ${destination}. The driver was very polite and knew all the local food joints. Made our family trip memorable!` },
                { name: "Priya M.", text: `Zero hidden charges! The quote they gave on WhatsApp was the exact amount I paid after completing the ${destination} sightseeing tour.` },
                { name: "Amit Verma", text: `Highly recommend Khatu Rides. The Innova was super clean and the AC worked perfectly throughout our long journey. Safe driving by the chauffeur.` }
              ].map((review, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-slate-600 font-medium italic mb-6">"{review.text}"</p>
                  <p className="font-bold text-slate-900">- {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white border-y border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Trip & Booking FAQs</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-emerald-600">Q.</span> What are the Driver Night Halt charges?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  For multi-day trips to {destination}, a nominal driver night allowance (usually ₹300 per night) is applicable. However, when we give you a final quote, we clearly breakdown all these charges so there are no surprises later.
                </p>
              </div>
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-emerald-600">Q.</span> Will the cab take us for local sightseeing in {destination}?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  Yes, absolutely. Once you book a round-trip or outstation package, the cab stays with you. You get a daily kilometer limit (e.g., 250 km/day minimum billing) which you can comfortably use for local sightseeing in {destination}.
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
              <h3 className="text-lg font-bold text-white">Popular Searches for this Route</h3>
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
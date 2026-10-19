import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import RentalHero from "@/components/RentalHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar"; 
import FloatingContact from "@/components/FloatingContact";
import { Briefcase, ShoppingBag, Map, Clock, CheckCircle2, CarFront, ChevronRight, Info, Users, Luggage, Search } from "lucide-react";

// Same Mega List of Cities
const HUBS = [
  "raipur", "bilaspur", "durg", "bhilai", "korba", "raigarh", 
  "ambikapur", "jagdalpur", "champa", "kharsia", "katghora"
];

const formatName = (str: string) => str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function generateStaticParams() {
  return HUBS.map(city => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const cityName = formatName(city);

  return {
    title: `Local Car Rental & Hourly Cab Service in ${cityName} | Khatu Rides`,
    description: `Book 8 hours / 80 kms local full-day taxi in ${cityName}. Best for city sightseeing, hospital visits, and business meetings. Premium AC cabs available.`,
    keywords: `car rental ${cityName}, local taxi in ${cityName}, hourly cab ${cityName}, 8 hours 80 km taxi ${cityName}, rent a car ${cityName}, full day cab ${cityName}`,
    alternates: {
      canonical: `https://www.khaturidescg.in/car-rental/${city}`,
    },
  };
}

export default async function CarRentalPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  
  if (!HUBS.includes(city.toLowerCase())) return notFound();

  const cityName = formatName(city);

  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Local Car Rental",
    "name": `Local Hourly Cab Rental in ${cityName}`,
    "description": `Full day and half day car rental packages in ${cityName} including 4hr/40km and 8hr/80km options.`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Khatu Rides Travels Co.",
      "telephone": PHONE,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": cityName,
        "addressRegion": "Chhattisgarh",
        "addressCountry": "IN"
      }
    },
    "areaServed": { "@type": "City", "name": cityName }
  };

  const seoKeywords = [
    `Local taxi in ${cityName}`, `Full day cab ${cityName}`, `Half day taxi ${cityName}`,
    `8 hours 80 km cab ${cityName}`, `Car hire in ${cityName}`, `City tour taxi ${cityName}`,
    `Hospital visit cab ${cityName}`, `Innova rental ${cityName}`, `Ertiga full day fare ${cityName}`
  ];

  return (
    <>
      <Navbar />
      <FloatingContact origin={cityName} destination="Local Hourly Rental" />

      <main className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }} />

        {/* SEO Breadcrumbs */}
        <div className="bg-slate-950 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link href="/" className="hover:text-pink-400 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span>Local Car Rental</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-semibold">{cityName}</span>
        </div>

        {/* Rental Hero Section */}
        <RentalHero initialCity={cityName} />

        {/* HOURLY PACKAGES TABLE SECTION */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Flexible Hourly Packages in {cityName}</h2>
              <p className="text-slate-600 mt-4 text-lg">No more booking multiple rides. Keep the car with you as long as you need.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Package 1 */}
              <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-200 hover:shadow-xl hover:border-pink-300 transition-all text-center">
                <div className="bg-pink-100 text-pink-700 font-bold px-4 py-1.5 rounded-full inline-block mb-6 text-sm">Half Day</div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">4 Hrs</h3>
                <p className="text-xl font-bold text-slate-500 mb-6">40 Kms Limit</p>
                <p className="text-slate-600 text-sm font-medium mb-8">Perfect for short business meetings, quick shopping trips, or airport pick/drop with waiting time.</p>
                <div className="border-t border-slate-200 pt-6">
                  <a href={`tel:${PHONE}`} className="text-pink-600 font-bold hover:text-pink-700 flex items-center justify-center gap-2">Get Quote <ChevronRight className="w-4 h-4"/></a>
                </div>
              </div>

              {/* Package 2 */}
              <div className="bg-gradient-to-b from-rose-50 to-pink-50 rounded-[32px] p-8 border-2 border-rose-400 shadow-lg relative text-center scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black px-6 py-1.5 rounded-full text-sm shadow-md uppercase tracking-wider">Most Popular</div>
                <div className="bg-rose-200 text-rose-800 font-bold px-4 py-1.5 rounded-full inline-block mt-4 mb-6 text-sm">Full Day</div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">8 Hrs</h3>
                <p className="text-xl font-bold text-rose-600 mb-6">80 Kms Limit</p>
                <p className="text-slate-700 text-sm font-medium mb-8">The standard choice for local city tours, multiple business visits, or attending family functions.</p>
                <div className="border-t border-rose-200 pt-6">
                  <a href={`tel:${PHONE}`} className="bg-rose-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-600 transition-colors inline-block w-full">Book Full Day Cab</a>
                </div>
              </div>

              {/* Package 3 */}
              <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-200 hover:shadow-xl hover:border-pink-300 transition-all text-center">
                <div className="bg-indigo-100 text-indigo-700 font-bold px-4 py-1.5 rounded-full inline-block mb-6 text-sm">Extended Day</div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">12 Hrs</h3>
                <p className="text-xl font-bold text-slate-500 mb-6">120 Kms Limit</p>
                <p className="text-slate-600 text-sm font-medium mb-8">Ideal for weddings, long full-day commitments, or trips to outskirts of {cityName}.</p>
                <div className="border-t border-slate-200 pt-6">
                  <a href={`tel:${PHONE}`} className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center justify-center gap-2">Get Quote <ChevronRight className="w-4 h-4"/></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.15),transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black">Why Rent a Local Cab in {cityName}?</h2>
              <p className="text-slate-400 mt-4 text-lg">Your personal chauffeur-driven car for all your local needs.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                <Briefcase className="w-10 h-10 text-pink-400 mb-4" />
                <h4 className="text-xl font-bold mb-2">Business Meetings</h4>
                <p className="text-slate-400 text-sm">Attend multiple client meetings across {cityName} without worrying about parking or booking multiple autos.</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                <ShoppingBag className="w-10 h-10 text-pink-400 mb-4" />
                <h4 className="text-xl font-bold mb-2">Shopping Spree</h4>
                <p className="text-slate-400 text-sm">Shop till you drop. Keep all your heavy shopping bags safely in the car while you visit different malls.</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                <Map className="w-10 h-10 text-pink-400 mb-4" />
                <h4 className="text-xl font-bold mb-2">City Sightseeing</h4>
                <p className="text-slate-400 text-sm">Explore local temples, parks, and tourist spots of {cityName} at your own pace with your family.</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                <Clock className="w-10 h-10 text-pink-400 mb-4" />
                <h4 className="text-xl font-bold mb-2">Hospital Visits</h4>
                <p className="text-slate-400 text-sm">Comfortable and hygienic AC rides for senior citizens or patients who need to wait at clinics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Hourly Rental FAQs</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-xl text-slate-900 mb-3">What happens if I exceed the 8 Hours / 80 Kms limit?</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Don't worry! If your trip extends beyond the package limit, you will simply be charged an extra per-kilometer and extra per-hour rate (e.g., ₹12/Km & ₹100/Hour extra). The final bill will be calculated automatically by the driver.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-xl text-slate-900 mb-3">Can I take this cab outside {cityName}?</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Hourly packages are exclusively designed for travel within the local city limits of {cityName}. If you wish to travel to a different city or state, you should book our "Outstation Cab" service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KEYWORD CLOUD */}
        <section className="py-12 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Search className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-slate-800">Popular Searches in {cityName}</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {seoKeywords.map((keyword, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-500 hover:border-rose-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-default"
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
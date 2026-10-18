import { Metadata } from "next";
import { notFound } from "next/navigation";
import RouteHero from "@/components/RouteHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar"; 
import FloatingContact from "@/components/FloatingContact";
import { MapPin, ShieldCheck, Clock, CreditCard, CheckCircle2, CarFront, Search, Navigation } from "lucide-react";

const HUBS = [
  "Korba", "Champa", "Kharsia", "Raigarh", "Katghora", "Dipka", 
  "Ambikapur", "Bilaspur", "Raipur", "Durg", "Bhilai", "Rajnandgaon", 
  "Jagdalpur", "Sambalpur", "Dhamtari", "Jharsuguda", "Ranchi", 
  "Patna", "Aourangabad", "Prayagraj", "Varanasi", "Ujjain"
];

// 1. Generate Static Pages for each City (Total 22 Pages)
export async function generateStaticParams() {
  return HUBS.map((hub) => ({
    city: hub.toLowerCase(),
  }));
}

// 2. SEO Meta Tags tailored for "Taxi in City"
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  return {
    title: `Best Taxi Service in ${cityName} | Outstation & Local Cabs | Khatu Rides`,
    description: `Looking for reliable cab service in ${cityName}? Book premium outstation taxis, one-way drops, and airport transfers with Khatu Rides. Zero advance, 24/7 support.`,
    keywords: `taxi service in ${cityName}, cab service in ${cityName}, book taxi ${cityName}, outstation cab ${cityName}, ${cityName} taxi contact number, rent a car in ${cityName}, Khatu Rides`,
    alternates: {
      canonical: `https://www.khaturidescg.in/taxi-service-in-${city.toLowerCase()}`,
    },
  };
}

export default async function CityTaxiPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  
  // Validation: Check if the URL city exists in our HUBS list
  const isValidCity = HUBS.some(h => h.toLowerCase() === city.toLowerCase());
  if (!isValidCity) return notFound();

  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  // LocalBusiness Schema optimized for a specific city
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "name": `Khatu Rides Travels Co. - ${cityName}`,
    "telephone": PHONE,
    "image": "https://www.khaturidescg.in/hero/main%20image.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": "Chhattisgarh",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "City",
      "name": cityName
    },
    "priceRange": "₹₹",
    "description": `Top-rated taxi and cab service provider in ${cityName} offering outstation, one-way, and round-trip rides.`
  };

  // Dynamic SEO Keywords for the City
  const seoKeywords = [
    `Taxi service in ${cityName}`,
    `Cab booking ${cityName}`,
    `Outstation taxi from ${cityName}`,
    `Airport drop from ${cityName}`,
    `Cheapest cab in ${cityName}`,
    `Hire Innova in ${cityName}`,
    `${cityName} to outstation cab`,
    `One way taxi ${cityName}`,
    `Car rental in ${cityName}`,
    `Local taxi contact ${cityName}`
  ];

  return (
    <>
      <Navbar />
      
      {/* Floating Button: Pickup is the city, destination is open */}
      <FloatingContact origin={cityName} destination="Anywhere" />

      <main className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }} />

        {/* Hero: Prefill only the Pickup location as the City */}
        <RouteHero initialPickup={cityName} initialDrop="" />

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
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">Available in {cityName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CITY OVERVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-bold">
                <Navigation className="w-4 h-4" /> Top Rated in {cityName}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Premium Cab Service in <span className="text-amber-500">{cityName}</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Need a reliable ride from <strong>{cityName}</strong>? Khatu Rides Travels Co. is your trusted travel partner. We provide seamless <strong className="text-slate-800">Outstation Cabs</strong>, <strong className="text-slate-800">One-Way Drops</strong>, and <strong className="text-slate-800">Airport Transfers</strong> starting right from your doorstep in {cityName}.
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  `Doorstep Pickup anywhere in ${cityName}`,
                  "Zero Return Fare for One-Way Outstation Trips",
                  "Verified, Local & Experienced Chauffeurs",
                  "Instant Booking with No Advance Payments"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    <span className="font-semibold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual City Card */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full -z-0"></div>
                <h3 className="text-2xl font-black text-slate-900 mb-8 relative z-10">Start Your Journey</h3>
                
                <div className="relative border-l-4 border-dashed border-slate-200 ml-4 pl-8 space-y-10 py-2">
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Location</p>
                    <p className="text-xl font-black text-slate-900">{cityName}</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-slate-900" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Any Destination</p>
                    <p className="text-xl font-black text-slate-400 italic">Where do you want to go?</p>
                  </div>
                </div>

                <div className="mt-10 p-5 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                  <CarFront className="w-10 h-10 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-500">Fleet Available in {cityName}</p>
                    <p className="text-slate-900 font-semibold">Sedan, Ertiga, Innova</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-slate-900 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.1),transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white">Why Choose Our Cabs in {cityName}?</h2>
              <p className="text-slate-400 mt-4 text-lg">Experience hassle-free travel across Chhattisgarh with our top-rated fleet.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-amber-400/20 rounded-2xl flex items-center justify-center mb-6">
                  <CreditCard className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Clear Pricing</h3>
                <p className="text-slate-400">Get an exact fare quote before you travel from {cityName}. No hidden charges, no sudden surges.</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Trusted Drivers</h3>
                <p className="text-slate-400">We assign highly professional chauffeurs who know the routes from {cityName} like the back of their hand.</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">On-Time Pickup</h3>
                <p className="text-slate-400">We respect your time. Expect our cab at your doorstep in {cityName} 15 minutes prior to departure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
              <div className="h-1.5 w-20 bg-amber-400 mx-auto mt-4 rounded-full" />
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-amber-500">Q.</span> Do you provide outstation cabs from {cityName}?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  Yes! We provide both One-Way Drops and Round-Trip outstation cabs starting from {cityName} to anywhere in Chhattisgarh and nearby states.
                </p>
              </div>

              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition duration-300">
                <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                  <span className="text-amber-500">Q.</span> How fast can I get a taxi in {cityName}?
                </h3>
                <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                  We highly recommend booking in advance, but we can typically arrange an outstation cab in {cityName} within 1 to 2 hours of your call based on availability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KEYWORD CLOUD */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-800">Popular Searches in {cityName}</h3>
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
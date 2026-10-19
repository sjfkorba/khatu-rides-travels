import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import WeddingHero from "@/components/WeddingHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar"; 
import FloatingContact from "@/components/FloatingContact";
import { Gem, Heart, Users, MapPin, CheckCircle2, CarFront, ChevronRight, Search, Sparkles, Clock, ShieldCheck, Camera } from "lucide-react";

// Mega List of Cities
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
    title: `Wedding Car Rental & Bridal Taxi in ${cityName} | Khatu Rides`,
    description: `Book luxury wedding cars, decorated bridal taxis, and guest transport fleets in ${cityName}. Premium chauffeurs, on-time arrivals, and bulk booking discounts.`,
    keywords: `wedding car rental ${cityName}, bridal car ${cityName}, luxury car for marriage ${cityName}, baarat transport ${cityName}, rent innova for wedding ${cityName}, wedding taxi ${cityName}`,
    alternates: {
      canonical: `https://www.khaturidescg.in/wedding-taxi/${city}`,
    },
  };
}

export default async function WeddingRentalPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  
  if (!HUBS.includes(city.toLowerCase())) return notFound();

  const cityName = formatName(city);

  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Wedding Car Rental",
    "name": `Luxury Wedding Cabs in ${cityName}`,
    "description": `Premium car rental services for weddings, bridal transport, and guest logistics in ${cityName}.`,
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
    `Wedding car ${cityName}`, `Bridal taxi ${cityName}`, `Luxury car for marriage ${cityName}`,
    `Baarat transport cab ${cityName}`, `Rent Innova for wedding ${cityName}`, `Decorated car rental ${cityName}`,
    `Pre-wedding shoot taxi ${cityName}`, `Guest transport services ${cityName}`, `Premium wedding cabs`
  ];

  return (
    <>
      <Navbar />
      <FloatingContact origin={cityName} destination="Wedding Booking" />

      <main className="flex flex-col min-h-screen bg-[#faf8fc] font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }} />

        {/* SEO Breadcrumbs */}
        <div className="bg-slate-950 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span>Wedding Rentals</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-semibold">{cityName}</span>
        </div>

        {/* Wedding Hero Section */}
        <WeddingHero initialCity={cityName} />

        {/* LUXURY TRUST BAR */}
        <div className="bg-purple-950 text-amber-200 py-6 border-b-4 border-amber-500 shadow-xl relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-purple-800/50">
              <div className="px-2 group">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-black uppercase tracking-widest text-amber-100">Decorated Cars</p>
              </div>
              <div className="px-2 group">
                <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-black uppercase tracking-widest text-amber-100">On-Time Arrival</p>
              </div>
              <div className="px-2 group">
                <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-black uppercase tracking-widest text-amber-100">Trained Chauffeurs</p>
              </div>
              <div className="px-2 group">
                <Users className="w-8 h-8 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-black uppercase tracking-widest text-amber-100">Bulk Guest Transport</p>
              </div>
            </div>
          </div>
        </div>

        {/* WEDDING SERVICES SECTION */}
        <section className="py-20 md:py-28 bg-white border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Make Your Big Day Perfect in {cityName}</h2>
              <p className="text-slate-600 mt-6 text-lg">From a grand groom entry to ensuring your relatives reach the venue comfortably, Khatu Rides handles all your wedding transport logistics with elegance.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="bg-purple-50 rounded-[32px] p-8 border border-purple-100 hover:shadow-xl hover:border-purple-300 transition-all text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Gem className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Bridal & Groom Cars</h3>
                <p className="text-slate-600 font-medium mb-6">
                  Arrive in style! We provide premium SUVs and Sedans which can be professionally decorated with fresh flowers (optional) for the perfect D-Day entry.
                </p>
              </div>

              {/* Service 2 */}
              <div className="bg-amber-50 rounded-[32px] p-8 border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Users className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Baarat & Guest Logistics</h3>
                <p className="text-slate-600 font-medium mb-6">
                  Manage your guests effortlessly. Book multiple Ertigas, Innovas, or Sedans to transport your relatives from the railway station/airport to the hotel and wedding venue.
                </p>
              </div>

              {/* Service 3 */}
              <div className="bg-rose-50 rounded-[32px] p-8 border border-rose-100 hover:shadow-xl hover:border-rose-300 transition-all text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Camera className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Pre-Wedding Shoots</h3>
                <p className="text-slate-600 font-medium mb-6">
                  Planning a shoot at scenic locations around {cityName}? Hire our comfortable cabs for the whole day to carry your outfits, equipment, and crew easily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US (Royal Theme) */}
        <section className="py-20 bg-purple-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.15),transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> The Khatu Rides Promise
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  Zero Transport Stress on Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Wedding Day</span>
                </h2>
                <p className="text-lg text-purple-200 leading-relaxed font-medium">
                  We know that during Indian weddings, managing cars and drivers is the most stressful job. Let us handle it! Our dedicated Wedding Transport Coordinator ensures every cab arrives on time, clean, and ready to serve your guests in {cityName}.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-purple-800">
                  {[
                    "Chauffeurs in Formal Attire",
                    "Impeccably Clean & Odor-free Cabs",
                    "Dedicated Coordinator for Bulk Bookings",
                    "Transparent Pricing (No Last-Minute Surprises)"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="font-bold text-sm text-purple-100">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Fleet Highlight */}
              <div className="md:w-1/2 w-full">
                <div className="bg-white/10 backdrop-blur-md rounded-[32px] p-8 md:p-10 border border-white/20 shadow-2xl relative overflow-hidden">
                  <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <CarFront className="text-amber-500" /> Recommended Wedding Fleet
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                      <div>
                        <h4 className="text-xl font-bold text-amber-400">Toyota Innova Crysta</h4>
                        <p className="text-sm text-purple-200 mt-1">For Groom Entry & VIP Relatives (7 Seater)</p>
                      </div>
                      <CarFront className="w-8 h-8 text-white/50" />
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                      <div>
                        <h4 className="text-xl font-bold text-amber-400">Maruti Ertiga / Carens</h4>
                        <p className="text-sm text-purple-200 mt-1">For Baarat & Family Logistics (6 Seater)</p>
                      </div>
                      <CarFront className="w-8 h-8 text-white/50" />
                    </div>

                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                      <div>
                        <h4 className="text-xl font-bold text-amber-400">Premium Sedans</h4>
                        <p className="text-sm text-purple-200 mt-1">Ciaz / Dzire for quick errands & couples</p>
                      </div>
                      <CarFront className="w-8 h-8 text-white/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-white border-t border-purple-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Wedding Booking FAQs</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-purple-50 p-8 rounded-3xl border border-purple-100 shadow-sm">
                <h3 className="font-black text-xl text-slate-900 mb-3">Do you provide car decoration services?</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  We provide the premium vehicles, and we can arrange standard floral decorations at an additional market cost. Alternatively, you can have your own decorators dress the car at your venue in {cityName}.
                </p>
              </div>
              <div className="bg-purple-50 p-8 rounded-3xl border border-purple-100 shadow-sm">
                <h3 className="font-black text-xl text-slate-900 mb-3">Can we book 5-10 cars together for our guests?</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Yes, absolutely! We specialize in bulk logistics. We can provide a mix of Innovas, Ertigas, and Sedans to ensure all your relatives are comfortably transported. We also offer special discounted packages for bulk bookings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KEYWORD CLOUD */}
        <section className="py-12 bg-purple-950 border-t border-purple-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Search className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-white">Popular Wedding Searches in {cityName}</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {seoKeywords.map((keyword, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-purple-900 border border-purple-800 rounded-full text-xs sm:text-sm font-semibold text-purple-200 hover:border-amber-400 hover:text-amber-300 transition-colors cursor-default"
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
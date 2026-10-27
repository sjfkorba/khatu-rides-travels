import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Star,
  Ticket,
  Users,
  X,
  Map,
  Car,
  Landmark
} from "lucide-react";

import Footer from "@/components/Footer";
import {
  getRelatedTourPackages,
  getTourPackageBySlug,
  getTourPackageSlugs,
} from "@/lib/tourPackages";
import Navbar from "@/components/landing/Navbar";

const SITE_URL = "https://www.khaturidescg.in";
const PHONE = "9244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* -------------------------------------------------------------------------- */
/* Static Params                                                              */
/* -------------------------------------------------------------------------- */

export function generateStaticParams() {
  return getTourPackageSlugs().map((slug) => ({
    slug,
  }));
}

/* -------------------------------------------------------------------------- */
/* Dynamic Slug Parser (SEO Magic for Infinite URLs)                          */
/* -------------------------------------------------------------------------- */

function parseDynamicSlug(slug: string) {
  const cleanSlug = slug.replace(/-/g, " ");
  let source = "Chhattisgarh";
  let destination = "Central India";
  let isRoute = slug.includes("-to-");
  let title = "";

  if (isRoute) {
    const parts = slug.split("-to-");
    source = parts[0].replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    destination = parts[1].replace(/-/g, " ").replace(/tour|package|taxi|cab/gi, "").trim().replace(/\b\w/g, (l) => l.toUpperCase());
    title = `${source} To ${destination} Premium Taxi & Tour Package`;
  } else {
    destination = cleanSlug.replace(/tour|package|taxi|cab/gi, "").trim().replace(/\b\w/g, (l) => l.toUpperCase()) || "Chhattisgarh";
    title = cleanSlug.replace(/\b\w/g, (l) => l.toUpperCase());
    if (!title.toLowerCase().includes("tour") && !title.toLowerCase().includes("taxi")) {
      title += " Taxi & Tour Package";
    }
  }

  // Generate dynamic extensive content for SEO padding
  return {
    slug,
    title,
    source,
    destination,
    description: `Book premium ${title} with Khatu Rides Travels. Expert drivers, flexible pickup from ${source}, Raipur, Korba, and Bilaspur. Customized itineraries for your journey to ${destination}. Enjoy safe, reliable, and affordable outstation cabs across Chhattisgarh.`,
    shortDescription: `Experience a hassle-free journey to ${destination} with our premium outstation taxi and private cab service. Book reliable cabs from ${source} today.`,
    category: isRoute ? "Outstation Route" : "Tour Package",
    badge: "Bestseller",
    startingPrice: "Enquire for Best Fare",
    duration: "Flexible (1 to Multiple Days)",
    pickup: source,
    image: "/hero/main%20image.png",
    pickupCities: [source, "Raipur", "Korba", "Bilaspur", "Bhilai", "Durg", "Raigarh", "Ambikapur"],
    highlights: [
      `Direct private cab from ${source} to ${destination}`,
      "Door-step pickup and drop facility",
      "Clean, sanitized, and air-conditioned vehicles",
      "Experienced route-expert drivers for long distance",
      "Transparent pricing with no hidden charges",
      "24/7 dedicated customer support"
    ],
    places: [destination, "Local Sightseeing points", "Major Transit Hubs", "Highway Stopovers", "Nearby Tourist Attractions"],
    itinerary: [
      {
        day: "Day 1",
        title: `Departure from ${source}`,
        description: `Your journey begins as our professional driver picks you up from your preferred location in ${source}. Enjoy a comfortable and scenic drive towards ${destination} in our premium private cab.`,
        places: [source, "Highway Transit", "Mid-way Stops"]
      },
      {
        day: "Day 2",
        title: `Explore ${destination}`,
        description: `Reach ${destination} and explore the key attractions. Your private cab remains at your disposal for local sightseeing, business meetings, or family visits.`,
        places: [destination, "Local Markets", "Key Landmarks"]
      },
      {
        day: "Day 3",
        title: `Return Journey to ${source}`,
        description: `After concluding your visit at ${destination}, begin your safe and relaxing return journey back to ${source} or your designated drop-off city in Chhattisgarh.`,
        places: ["Return Route", source]
      }
    ],
    inclusions: [
      "Private AC Cab (Innova, Ertiga, or Dzire)",
      "Experienced and verified driver",
      "Fuel and driver allowance",
      "Door-to-door pickup and drop",
      "Toll taxes (if included in custom quote)"
    ],
    exclusions: [
      "Monument entry fees and camera charges",
      "Personal expenses, meals, and shopping",
      "Hotel accommodations (unless requested)",
      "Parking charges (charged at actuals)"
    ],
    suitableFor: ["Families", "Corporate Travelers", "Solo Explorers", "Pilgrimage Groups", "Couples"],
    faqs: [
      {
        question: `How can I book a cab from ${source} to ${destination}?`,
        answer: `You can easily book by calling our 24/7 helpline at ${PHONE_DISPLAY} or sending a message on WhatsApp. We will provide you with the latest fare and instantly confirm your vehicle.`
      },
      {
        question: `Which vehicles are available for the ${destination} trip?`,
        answer: `We offer a wide range of well-maintained cabs including Sedans (Swift Dzire, Etios), SUVs (Maruti Ertiga), and Premium SUVs (Toyota Innova Crysta) based on your group size.`
      },
      {
        question: `Is it safe to travel from ${source} to ${destination} at night?`,
        answer: `Absolutely. All our drivers are highly experienced, police-verified, and familiar with the highway routes across Chhattisgarh and neighboring states, ensuring a 100% safe journey.`
      },
      {
        question: `Does Khatu Rides offer custom tour packages?`,
        answer: `Yes! Our itineraries are highly flexible. You can add extra days, include nearby tourist spots, or change your drop location. Just let our team know your preferences.`
      }
    ]
  };
}

/* -------------------------------------------------------------------------- */
/* Metadata Generator (Dynamic SEO Tags)                                      */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbTour = getTourPackageBySlug(slug);
  const tour = dbTour || parseDynamicSlug(slug);

  const title = `${tour.title} from Chhattisgarh | Khatu Rides Travels`;
  const url = `${SITE_URL}/tour-packages/${slug}`;

  return {
    title,
    description: tour.description,
    keywords: [
      tour.title,
      `${tour.destination} tour package`,
      `${tour.destination} taxi service`,
      `taxi for ${tour.destination} from Korba`,
      `cab from Raipur to ${tour.destination}`,
      `Chhattisgarh to ${tour.destination} cab`,
      "tour packages from Chhattisgarh",
      "Khatu Rides Travels",
      "Bilaspur outstation taxi",
      "Korba to Raipur travel"
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description: tour.description,
      url,
      siteName: "Khatu Rides Travels",
      type: "website",
      locale: "en_IN",
      images: [{ url: tour.image.startsWith("http") ? tour.image : `${SITE_URL}${tour.image}` }],
    },
    robots: { index: true, follow: true },
  };
}

/* -------------------------------------------------------------------------- */
/* Icons & Floating Buttons                                                   */
/* -------------------------------------------------------------------------- */

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.6 5.96L.08 24l6.28-1.65a11.88 11.88 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.43Z" fill="currentColor"/>
      <path d="M17.52 13.9c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.71.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" fill="white"/>
    </svg>
  );
}

function FloatingActions({ title }: { title: string }) {
  const whatsappText = encodeURIComponent(`Hello Khatu Rides, I want to enquire about "${title}". Please share details, current price, and cab availability.`);
  return (
    <details className="fixed bottom-6 right-4 z-50 group">
      <summary
        className="flex h-16 w-16 cursor-pointer list-none items-center justify-center rounded-full bg-[#063B8F] text-white shadow-[0_10px_40px_rgba(6,59,143,0.5)] ring-4 ring-white/90 transition-all duration-300 hover:scale-105 [&::-webkit-details-marker]:hidden"
        aria-label="Contact Options"
      >
        <MessageCircle size={26} fill="currentColor" className="transition-transform duration-300 group-open:rotate-45 group-open:scale-0 absolute" />
        <X size={26} className="transition-transform duration-300 scale-0 group-open:scale-100 group-open:rotate-90 absolute" />
      </summary>
      <div className="absolute bottom-20 right-1 flex flex-col items-center gap-4 opacity-0 transition-opacity duration-300 group-open:opacity-100">
        <a href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110">
          <WhatsAppIcon size={26} />
        </a>
        <a href={`tel:+91${PHONE}`} className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-slate-900 shadow-lg transition-transform hover:scale-110">
          <Phone size={24} fill="currentColor" />
        </a>
      </div>
    </details>
  );
}

function BookingButtons({ title, compact = false }: { title: string; compact?: boolean }) {
  const whatsappText = encodeURIComponent(`Hello Khatu Rides, I want to book/enquire about ${title}. Share pricing & vehicle options.`);
  return (
    <div className={`flex w-full ${compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"} gap-3`}>
      <a href={`tel:+91${PHONE}`} className="inline-flex flex-1 min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#063B8F] px-6 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#052f73]">
        <Phone size={17} fill="currentColor" /> Call Now
      </a>
      <a href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5">
        <WhatsAppIcon size={19} /> WhatsApp Enquiry
      </a>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN PAGE RENDER                                                           */
/* -------------------------------------------------------------------------- */

export default async function TourPackageDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // DB Check or Dynamic Fallback Generation
  const dbTour = getTourPackageBySlug(slug);
  const tour = dbTour || parseDynamicSlug(slug);
  const relatedPackages = getRelatedTourPackages(slug, 3);
  const pageUrl = `${SITE_URL}/tour-packages/${slug}`;
  const imageUrl = tour.image.startsWith("http") ? tour.image : `${SITE_URL}${tour.image}`;

  // Structured Data for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tour Packages", item: `${SITE_URL}/tour-packages` },
      { "@type": "ListItem", position: 3, name: tour.title, item: pageUrl },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: tour.title,
    description: tour.description,
    url: pageUrl,
    image: imageUrl,
    provider: {
      "@type": "LocalBusiness",
      name: "Khatu Rides Travels Co.",
      telephone: `+91${PHONE}`,
      address: { "@type": "PostalAddress", addressLocality: "Korba", addressRegion: "Chhattisgarh", addressCountry: "IN" },
    },
    areaServed: tour.pickupCities.map((city) => ({ "@type": "City", name: city })),
    serviceType: `${tour.destination} Tour Package & Taxi`,
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-300 selection:text-slate-900 overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* Header Placeholder */}
      <Navbar/>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#020B24]">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#020B24_0%,#052B70_48%,#063B8F_100%)]" />
        <div className="absolute -right-32 -top-32 h-105 w-105 rounded-full bg-blue-500/25 blur-[100px]" />
        <div className="absolute -bottom-40 left-[30%] h-100 w-100 rounded-full bg-amber-400/15 blur-[110px]" />
        
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-20">
          
          <div className="text-white z-10">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-amber-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#071A3A] shadow-[0_5px_20px_rgba(251,191,36,0.3)]">{tour.badge}</span>
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">{tour.category}</span>
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl capitalize">{tour.title.toLowerCase()}</h1>
            <div className="mt-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-300 to-orange-500" />
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/90 sm:text-lg">{tour.shortDescription}</p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {[
                { icon: Clock3, label: "Duration", val: tour.duration },
                { icon: Navigation, label: "Pickup", val: tour.pickup },
                { icon: Car, label: "Travel", val: "Private Cab" },
                { icon: Star, label: "Reviews", val: "4.9/5" }
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <stat.icon size={22} className="mb-2 text-amber-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{stat.label}</p>
                  <p className="mt-1 text-sm font-black text-white">{stat.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code-Generated Dynamic Graphic */}
          <div className="relative z-10 hidden lg:block">
            <div className="absolute -inset-4 rounded-[40px] bg-amber-400/20 blur-[40px]" />
            <div className="relative h-[480px] w-full overflow-hidden rounded-[32px] border-4 border-white/10 bg-gradient-to-br from-[#052B70] via-[#020B24] to-[#071A3A] shadow-2xl flex items-center justify-center">

              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/30 blur-[60px]" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-500/20 blur-[60px]" />

              <div className="relative w-full max-w-[320px]">
                <div className="absolute left-[27px] top-12 bottom-12 w-1 border-l-2 border-dashed border-amber-400/40" />

                <div className="relative flex items-center gap-5 mb-20">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)] z-10">
                    <MapPin size={24} className="text-blue-300" />
                  </div>
                  <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm shadow-lg transition-transform hover:scale-105">
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-300">Pickup Location</p>
                    <p className="mt-0.5 text-lg font-black text-white truncate">{tour.pickup}</p>
                  </div>
                </div>

                <div className="absolute left-[15px] top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] z-20">
                  <Car size={14} className="text-slate-900" />
                </div>

                <div className="relative flex items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)] z-10">
                    <MapPin size={24} className="text-slate-900" fill="currentColor" />
                  </div>
                  <div className="flex-1 rounded-2xl bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-400/30 p-3.5 backdrop-blur-sm shadow-lg transition-transform hover:scale-105">
                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-400">Destination Hub</p>
                    <p className="mt-0.5 text-xl font-black text-white truncate">{tour.destination}</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md shadow-xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <div>
                    <p className="text-[9px] font-bold uppercase text-white/50">Verified Route</p>
                    <p className="text-xs font-black text-white">Safe & Secure Travel</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-bold uppercase text-white/50">Travel Mode</p>
                   <p className="text-xs font-black text-amber-400">Private Cab</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          
          <div className="space-y-16">
            
            {/* Overview & Travel Guide */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Travel Guide</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">Tour Overview: {tour.title}</h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                <p>
                  Planning a journey for <strong className="text-slate-900">{tour.title}</strong>? Khatu Rides Travels provides premium private cab and taxi services to ensure your trip to <strong className="text-slate-900">{tour.destination}</strong> is safe, luxurious, and highly reliable. Whether you are traveling for a family vacation, corporate events, or pilgrimage, our extensive fleet guarantees the perfect ride.
                </p>
                <p>
                  We operate extensively across Chhattisgarh's major hubs. You can conveniently schedule your pickup from <strong className="text-slate-900">Raipur, Korba, Bilaspur, Bhilai, Durg, Raigarh, and Ambikapur</strong>. The final itinerary, vehicle choice, and exact cost are fully transparent and confirmed prior to your booking.
                </p>
              </div>
            </section>

            {/* Highlights */}
            <section>
              <h3 className="text-2xl font-black text-slate-900">Why Choose This Package?</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {tour.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Check size={16} strokeWidth={3} />
                    </span>
                    <p className="pt-1 text-sm font-bold text-slate-700">{h}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Chhattisgarh Tourism Integration (SEO Booster) */}
            <section className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6 sm:p-8">
              <h3 className="flex items-center gap-3 text-2xl font-black text-[#063B8F]">
                <Map size={28} className="text-amber-500" /> Explore Chhattisgarh Tourism
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Enhance your journey by connecting through Chhattisgarh's top tourist destinations. Khatu Rides Travels offers intercity outstation cabs connecting major spots:
              </p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                <li className="flex gap-3">
                  <Landmark size={20} className="shrink-0 text-amber-500 mt-1" />
                  <p className="text-sm text-slate-700"><strong className="text-slate-900">Raipur & Sirpur:</strong> The capital transit hub connecting to the ancient archaeological marvels.</p>
                </li>
                <li className="flex gap-3">
                  <Landmark size={20} className="shrink-0 text-amber-500 mt-1" />
                  <p className="text-sm text-slate-700"><strong className="text-slate-900">Bastar & Chitrakote:</strong> Book outstation cabs from Raipur/Korba to witness the Niagara Falls of India.</p>
                </li>
                <li className="flex gap-3">
                  <Landmark size={20} className="shrink-0 text-amber-500 mt-1" />
                  <p className="text-sm text-slate-700"><strong className="text-slate-900">Mainpat (Shimla of CG):</strong> Enjoy scenic hill station travel easily accessible via cab from Korba.</p>
                </li>
                <li className="flex gap-3">
                  <Landmark size={20} className="shrink-0 text-amber-500 mt-1" />
                  <p className="text-sm text-slate-700"><strong className="text-slate-900">Bhoramdeo Temple:</strong> Known as the Khajuraho of Chhattisgarh, a perfect cultural detour.</p>
                </li>
              </ul>
            </section>

            {/* Itinerary */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Suggested Plan</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">Sample Itinerary</h2>
              <p className="mt-2 text-sm text-slate-500">This itinerary is fully customizable based on your pickup city, travel dates, and sightseeing needs.</p>
              
              <div className="relative mt-8 space-y-6">
                <div className="absolute bottom-5 left-[19px] top-5 hidden w-px bg-slate-200 sm:block" />
                {tour.itinerary.map((item, index) => (
                  <div key={index} className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:pl-8">
                    <div className="flex gap-5">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-sm font-black text-slate-950 shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">{item.day}</p>
                        <h3 className="mt-1 text-lg font-black text-slate-950">{item.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.places.map((place) => (
                            <span key={place} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-600">
                              <MapPin size={11} /> {place}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white"><Check size={18} strokeWidth={3} /></span>
                  <h3 className="text-xl font-black text-slate-950">What's Included</h3>
                </div>
                <ul className="space-y-3">
                  {tour.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                      <Check size={16} className="mt-1 shrink-0 text-emerald-600" strokeWidth={3} /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white"><X size={18} strokeWidth={3} /></span>
                  <h3 className="text-xl font-black text-slate-950">Not Included</h3>
                </div>
                <ul className="space-y-3">
                  {tour.exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                      <X size={16} className="mt-1 shrink-0 text-red-500" strokeWidth={3} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
              <div className="mt-8 space-y-4">
                {tour.faqs.map((faq, index) => (
                  <details key={index} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" open={index === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black text-slate-900">
                      {faq.question}
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 transition group-open:rotate-90">
                        <ChevronRight size={16} />
                      </span>
                    </summary>
                    <p className="mt-4 text-sm leading-7 text-slate-600 pr-8">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[30px] border border-slate-200 bg-white shadow-xl overflow-hidden">
              <div className="bg-[#071A3A] p-8 text-center text-white">
                <p className="text-xs font-black uppercase tracking-widest text-amber-400">Secure Your Ride</p>
                <h3 className="mt-2 text-2xl font-black">{tour.title}</h3>
                <p className="mt-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Starting Price</p>
                <p className="text-4xl font-black text-amber-400 mt-1">{tour.startingPrice}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                     <Car size={20} className="text-amber-500" />
                     <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Available Fleet</p>
                        <p className="text-sm font-black text-slate-900">Innova, Ertiga, Dzire</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                     <MapPin size={20} className="text-amber-500" />
                     <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Pickup Cities</p>
                        <p className="text-sm font-black text-slate-900">Raipur, Korba, Bilaspur +</p>
                     </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <BookingButtons title={tour.title} compact={false} />
                </div>
                
                <Link href="/fare-calculator" className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-50 py-4 text-sm font-black text-slate-900 transition hover:bg-amber-100">
                  <Ticket size={18} /> Calculate Custom Fare
                </Link>
              </div>
            </div>

            {/* Trust Box */}
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#063B8F] shadow-sm"><ShieldCheck size={22} /></div>
                <div>
                  <p className="text-base font-black text-slate-950">100% Secure Travel</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">Verified Drivers • 24/7 Support</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Packages (If available) */}
      {relatedPackages.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900">Related Routes & Packages</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedPackages.map((related) => (
                <Link key={related.slug} href={`/tour-packages/${related.slug}`} className="group block overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img src={related.image} alt={related.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur-sm">{related.category}</span>
                  </div>
                  <div className="p-6">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600"><MapPin size={12} /> {related.destination}</p>
                    <h3 className="mt-2 text-xl font-black leading-tight text-slate-900">{related.title}</h3>
                    <p className="mt-4 text-[10px] font-black uppercase text-slate-400 border-t border-slate-100 pt-4">Starting From</p>
                    <p className="text-lg font-black text-slate-900">{related.startingPrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <FloatingActions title={tour.title} />
    </main>
  );
}
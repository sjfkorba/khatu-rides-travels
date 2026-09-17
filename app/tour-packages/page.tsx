import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  MapPin,
  Phone,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  WalletCards,
  Waypoints,
} from "lucide-react";

import Footer from "@/components/Footer";

const SITE_URL = "https://www.khaturidescg.in";
const PAGE_URL = `${SITE_URL}/tour-packages`;

const PHONE = "9244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

/* =========================================================
   HELPERS
========================================================= */

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/* =========================================================
   WHATSAPP ICON
========================================================= */

function WhatsAppIcon({ size = 19 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 3.25C9.04 3.25 3.4 8.89 3.4 15.85c0 2.22.58 4.31 1.69 6.14L3.25 28.75l6.94-1.8a12.5 12.5 0 0 0 5.81 1.43h.01c6.95 0 12.59-5.64 12.59-12.6C28.6 8.89 22.96 3.25 16 3.25Z"
        fill="currentColor"
      />

      <path
        d="M11.05 9.85c.25-.28.53-.3.77-.3.2 0 .42 0 .61.01.2.01.46-.08.72.47.26.56.9 2.19.98 2.35.08.16.13.35.02.56-.1.2-.15.35-.3.54-.15.18-.31.4-.45.53-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12.99 2.07 1.3 2.37 1.45.3.15.48.13.66-.08.18-.2.76-.89.96-1.2.2-.31.4-.25.67-.15.28.1 1.75.83 2.05.98.3.15.5.23.57.36.08.13.08.77-.18 1.5-.25.72-1.47 1.38-2.03 1.46-.52.08-1.18.12-1.9-.12-.44-.15-1-.32-1.72-.64-3.03-1.3-5-4.33-5.15-4.53-.15-.2-1.23-1.64-1.23-3.13 0-1.48.77-2.2 1.05-2.5Z"
        fill="white"
      />
    </svg>
  );
}

/* =========================================================
   TOUR PACKAGE DATA
========================================================= */

const TOUR_PACKAGES = [
  {
    slug: "khatu-shyam-ji-tour",
    title: "Khatu Shyam Ji Tour Package",
    destination: "Khatu Shyam Ji, Rajasthan",
    category: "Pilgrimage",
    badge: "Most Popular",
    image: "/tour/khatu.png",
    duration: "3 Days / 2 Nights",
    price: "₹7,999",
    pickup: "Chhattisgarh Pickup",
    description:
      "Plan a comfortable Khatu Shyam Ji pilgrimage from Chhattisgarh with cab travel, route planning and flexible family-friendly options.",
    places: [
      "Khatu Shyam Ji Temple",
      "Salasar Balaji",
      "Rajasthan",
    ],
  },
  {
    slug: "prayagraj-tour",
    title: "Prayagraj Tour Package",
    destination: "Prayagraj, Uttar Pradesh",
    category: "Pilgrimage",
    badge: "Popular",
    image: "/tour/prayagraj.png",
    duration: "3 Days / 2 Nights",
    price: "₹8,499",
    pickup: "Chhattisgarh Pickup",
    description:
      "Explore Prayagraj with a comfortable outstation cab tour covering important spiritual and cultural attractions.",
    places: [
      "Triveni Sangam",
      "Prayagraj",
      "Allahabad Fort Area",
    ],
  },
  {
    slug: "ayodhya-tour",
    title: "Ayodhya Tour Package",
    destination: "Ayodhya, Uttar Pradesh",
    category: "Pilgrimage",
    badge: "Trending",
    image: "/tour/ayodhya.png",
    duration: "3 Days / 2 Nights",
    price: "₹8,999",
    pickup: "Chhattisgarh Pickup",
    description:
      "Visit Ayodhya's major spiritual attractions with a planned road trip from Chhattisgarh in a comfortable cab.",
    places: [
      "Ram Mandir",
      "Hanuman Garhi",
      "Saryu River",
    ],
  },
  {
    slug: "varanasi-tour",
    title: "Varanasi Tour Package",
    destination: "Varanasi, Uttar Pradesh",
    category: "Pilgrimage",
    badge: "Popular",
    image: "/tour/varanasi.png",
    duration: "3 Days / 2 Nights",
    price: "₹8,999",
    pickup: "Chhattisgarh Pickup",
    description:
      "Experience Varanasi's temples and ghats with an organized road trip, local sightseeing and comfortable cab travel.",
    places: [
      "Kashi Vishwanath",
      "Dashashwamedh Ghat",
      "Ganga Aarti",
    ],
  },
  {
    slug: "mathura-vrindavan-tour",
    title: "Mathura Vrindavan Tour Package",
    destination: "Mathura & Vrindavan",
    category: "Pilgrimage",
    badge: "Family Favorite",
    image: "/tour/mathura-vrindavan.png",
    duration: "4 Days / 3 Nights",
    price: "₹11,999",
    pickup: "Chhattisgarh Pickup",
    description:
      "A family-friendly pilgrimage tour covering the major Krishna temples and spiritual attractions of Mathura and Vrindavan.",
    places: [
      "Mathura",
      "Vrindavan",
      "Banke Bihari",
      "Prem Mandir",
    ],
  },
  {
    slug: "chitrakoot-tour",
    title: "Chitrakoot Tour Package",
    destination: "Chitrakoot, Madhya Pradesh",
    category: "Pilgrimage",
    badge: "Nearby",
    image: "/tour/chitrakut.png",
    duration: "2 Days / 1 Night",
    price: "₹5,999",
    pickup: "Chhattisgarh Pickup",
    description:
      "Take a peaceful spiritual road trip to Chitrakoot with comfortable cab transportation and local sightseeing.",
    places: [
      "Ramghat",
      "Kamdagiri",
      "Hanuman Dhara",
    ],
  },
  {
    slug: "ujjain-tour",
    title: "Ujjain Mahakal Tour Package",
    destination: "Ujjain, Madhya Pradesh",
    category: "Pilgrimage",
    badge: "Devotional",
    image: "/tour/ujjain.png",
    duration: "3 Days / 2 Nights",
    price: "₹8,999",
    pickup: "Chhattisgarh Pickup",
    description:
      "Plan a Mahakal pilgrimage to Ujjain with comfortable outstation cab travel and a flexible sightseeing itinerary.",
    places: [
      "Mahakaleshwar Temple",
      "Mahakal Lok",
      "Ram Ghat",
    ],
  },
  {
    slug: "omkareshwar-tour",
    title: "Omkareshwar Tour Package",
    destination: "Omkareshwar, Madhya Pradesh",
    category: "Pilgrimage",
    badge: "Jyotirlinga",
    image: "/tour/omkareshwar-tour.png",
    duration: "3 Days / 2 Nights",
    price: "₹9,499",
    pickup: "Chhattisgarh Pickup",
    description:
      "Visit Omkareshwar Jyotirlinga with a planned family pilgrimage tour and comfortable road transportation.",
    places: [
      "Omkareshwar Temple",
      "Narmada Ghat",
      "Mamleshwar",
    ],
  },
  {
    slug: "dwarka-somnath-tour",
    title: "Dwarka Somnath Tour Package",
    destination: "Gujarat",
    category: "Pilgrimage",
    badge: "Long Journey",
    image: "/tour/dwarka-somnath-tour.png",
    duration: "7 Days / 6 Nights",
    price: "₹24,999",
    pickup: "Chhattisgarh Pickup",
    description:
      "Explore the major pilgrimage destinations of Gujarat with a long-distance road tour designed for families and groups.",
    places: [
      "Dwarkadhish Temple",
      "Somnath Temple",
      "Nageshwar",
    ],
  },
  {
    slug: "rajasthan-pilgrimage-tour",
    title: "Rajasthan Pilgrimage Tour",
    destination: "Rajasthan",
    category: "Pilgrimage",
    badge: "Multi-City",
    image: "/tour/rajasthan-tour.png",
    duration: "6 Days / 5 Nights",
    price: "₹19,999",
    pickup: "Chhattisgarh Pickup",
    description:
      "A multi-destination Rajasthan pilgrimage road trip combining temple visits, sightseeing and comfortable intercity travel.",
    places: [
      "Khatu Shyam Ji",
      "Salasar Balaji",
      "Rajasthan",
    ],
  },
  {
    slug: "north-india-pilgrimage-tour",
    title: "North India Pilgrimage Tour",
    destination: "North India",
    category: "Pilgrimage",
    badge: "Grand Tour",
    image: "/tour/north-india-tour.png",
    duration: "8 Days / 7 Nights",
    price: "₹29,999",
    pickup: "Chhattisgarh Pickup",
    description:
      "A longer pilgrimage road journey covering multiple spiritual destinations with private cab transportation.",
    places: [
      "Ayodhya",
      "Prayagraj",
      "Varanasi",
      "Mathura",
    ],
  },
  {
    slug: "chhattisgarh-temple-tour",
    title: "Chhattisgarh Temple Tour",
    destination: "Chhattisgarh",
    category: "Family Tours",
    badge: "Local",
    image: "/tour/chhattisgarh-tour.png",
    duration: "Custom",
    price: "On Request",
    pickup: "Multiple Chhattisgarh Cities",
    description:
      "Discover important temples and spiritual destinations across Chhattisgarh with a flexible private cab tour.",
    places: [
      "Raipur",
      "Ratanpur",
      "Dongargarh",
      "Bastar",
    ],
  },
] as const;

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = [
  "All Tours",
  "Pilgrimage",
  "Family Tours",
  "Holiday Tours",
  "Multi-City",
];

/* =========================================================
   PICKUP CITIES
========================================================= */

const PICKUP_CITIES = [
  "Korba",
  "Raipur",
  "Bilaspur",
  "Raigarh",
  "Ambikapur",
  "Jagdalpur",
  "Durg",
  "Bhilai",
  "Rajnandgaon",
  "Dhamtari",
  "Mahasamund",
  "Jharsuguda",
];

/* =========================================================
   FAQ
========================================================= */

const FAQS = [
  {
    q: "What types of tour packages does Khatu Rides offer?",
    a: "Khatu Rides offers pilgrimage, family and multi-destination road tour packages with private cab transportation. Popular destinations include Khatu Shyam Ji, Prayagraj, Ayodhya, Varanasi, Mathura-Vrindavan and destinations across central and northern India.",
  },
  {
    q: "From which cities can I start a tour package?",
    a: "Tour enquiries can be made from major Chhattisgarh cities including Korba, Raipur, Bilaspur, Raigarh, Ambikapur, Jagdalpur, Durg, Bhilai and other nearby locations. Share your exact pickup location for route planning.",
  },
  {
    q: "Are the tour packages private cab tours?",
    a: "The packages are designed around private cab travel. Vehicle selection can depend on passenger count, luggage, route and trip requirements.",
  },
  {
    q: "Can I customize the tour itinerary?",
    a: "Yes. Tour requirements can be discussed before booking. You can share the number of travellers, preferred destinations, pickup city, travel dates and vehicle preference.",
  },
  {
    q: "Do tour packages include the cab?",
    a: "Package inclusions can vary by tour. Check the individual package detail page for the specific itinerary, inclusions, exclusions and pricing information.",
  },
  {
    q: "Can families book these tour packages?",
    a: "Yes. Several packages are suitable for families and groups. Vehicle selection can be discussed according to the number of passengers and luggage.",
  },
  {
    q: "Can I book a tour from Korba or Bilaspur?",
    a: "Yes. Tour enquiries can be made from Korba, Bilaspur and other major Chhattisgarh cities. The pickup location can be discussed according to the selected destination.",
  },
  {
    q: "How can I enquire about a tour package?",
    a: "Open the package you are interested in and use the booking or WhatsApp enquiry option. You can also call Khatu Rides directly at +91 92441 37353.",
  },
];

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  title:
    "Tour Packages from Chhattisgarh | Pilgrimage & Family Tours | Khatu Rides",
  description:
    "Explore tour packages from Chhattisgarh to Khatu Shyam Ji, Prayagraj, Ayodhya, Varanasi, Mathura-Vrindavan, Ujjain and other pilgrimage destinations. Private cab tours from Korba, Raipur, Bilaspur and major cities.",
  keywords: [
    "tour packages from Chhattisgarh",
    "Chhattisgarh tour packages",
    "pilgrimage tour packages from Chhattisgarh",
    "family tour packages from Chhattisgarh",
    "tour package from Korba",
    "tour package from Raipur",
    "tour package from Bilaspur",
    "tour package from Raigarh",
    "Khatu Shyam Ji tour package",
    "Prayagraj tour package",
    "Ayodhya tour package",
    "Varanasi tour package",
    "Mathura Vrindavan tour package",
    "Ujjain tour package",
    "Omkareshwar tour package",
    "private cab tour Chhattisgarh",
    "outstation tour packages",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title:
      "Tour Packages from Chhattisgarh | Khatu Rides Travels",
    description:
      "Explore pilgrimage, family and multi-city tour packages from Chhattisgarh with private cab travel.",
    url: PAGE_URL,
    siteName: "Khatu Rides Travels Co.",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Khatu Rides Travels Tour Packages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Tour Packages from Chhattisgarh | Khatu Rides",
    description:
      "Explore pilgrimage and family tour packages with private cab travel from Chhattisgarh.",
    images: [`${SITE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* =========================================================
   STRUCTURED DATA
========================================================= */

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Khatu Rides Tour Packages",
  url: PAGE_URL,
  itemListElement: TOUR_PACKAGES.map((tour, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tour.title,
    url: `${PAGE_URL}/${tour.slug}`,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tour Packages",
      item: PAGE_URL,
    },
  ],
};

/* =========================================================
   MOBILE FLOATING ACTION
========================================================= */

function FloatingActions() {
  const message = waLink(
    "Hello Khatu Rides, I want to enquire about your tour packages. Please share the available packages and details."
  );

  return (
    <details className="fixed bottom-5 right-4 z-50 md:hidden">
      <summary className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-full border-2 border-white bg-[#FF1726] text-white shadow-[0_10px_30px_rgba(255,23,38,.45),0_0_35px_rgba(255,23,38,.25)] transition hover:scale-105">
        <Phone
          size={25}
          strokeWidth={2.8}
          fill="currentColor"
        />
      </summary>

      <div className="absolute bottom-[68px] right-0 flex w-[190px] flex-col gap-2">
        <a
          href={`tel:+91${PHONE}`}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#FF1726] px-4 text-[12px] font-black text-white shadow-xl"
        >
          <Phone
            size={17}
            fill="currentColor"
          />
          Call Now
        </a>

        <a
          href={message}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 text-[12px] font-black text-white shadow-xl"
        >
          <WhatsAppIcon size={19} />
          WhatsApp
        </a>
      </div>
    </details>
  );
}

/* =========================================================
   PACKAGE CARD
========================================================= */

function TourCard({
  tour,
  featured = false,
}: {
  tour: (typeof TOUR_PACKAGES)[number];
  featured?: boolean;
}) {
  const message = waLink(
    `Hello Khatu Rides, I am interested in the ${tour.title}. Please share the complete itinerary, inclusions, available dates, vehicle options and current package price.`
  );

  return (
    <article
      className={`group overflow-hidden rounded-[28px] border bg-white shadow-[0_10px_35px_rgba(15,23,42,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(15,23,42,.12)] ${
        featured
          ? "border-[#FFC400]/70 ring-1 ring-[#FFC400]/20"
          : "border-slate-200"
      }`}
    >
      {/* IMAGE */}

      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={tour.image}
          alt={`${tour.title} from Chhattisgarh`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-[#FFC400] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-950 shadow-lg">
            {tour.badge}
          </span>

          <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md">
            {tour.category}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FFC400]">
              Explore
            </p>

            <p className="mt-1 text-sm font-black text-white">
              {tour.destination}
            </p>
          </div>

          <div className="rounded-xl bg-white/95 px-3 py-2 text-right shadow-lg">
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
              Starting
            </p>

            <p className="text-sm font-black text-slate-950">
              {tour.price}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div className="p-5">
        <h3 className="text-xl font-black leading-tight tracking-[-0.025em] text-slate-950">
          {tour.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-slate-600">
          {tour.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
            <Clock3
              size={14}
              className="shrink-0 text-[#063B8F]"
            />

            <span className="text-[10px] font-bold text-slate-600">
              {tour.duration}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
            <MapPin
              size={14}
              className="shrink-0 text-[#063B8F]"
            />

            <span className="truncate text-[10px] font-bold text-slate-600">
              {tour.pickup}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
            Places Covered
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {tour.places.map((place) => (
              <span
                key={place}
                className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-[9px] font-bold text-slate-600"
              >
                {place}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
          <Link
            href={`/tour-packages/${tour.slug}`}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#071A3A] text-xs font-black text-white transition hover:bg-[#063B8F]"
          >
            View Package
            <ArrowRight size={14} />
          </Link>

          <a
            href={message}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire about ${tour.title} on WhatsApp`}
            className="flex h-11 w-12 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm transition hover:scale-[1.03]"
          >
            <WhatsAppIcon size={20} />
          </a>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function TourPackagesPage() {
  const whatsappMessage = waLink(
    "Hello Khatu Rides, I want to explore your tour packages from Chhattisgarh. Please suggest suitable packages based on my destination, travel dates and number of travellers."
  );

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      {/* =====================================================
          JSON-LD
      ===================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center"
          >
            <img
              src="/logo.png"
              alt="Khatu Rides Travels Co."
              className="h-12 w-auto object-contain sm:h-14"
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              href="/"
              className="text-sm font-bold text-slate-600 transition hover:text-[#063B8F]"
            >
              Home
            </Link>

            <Link
              href="/#popular-routes"
              className="text-sm font-bold text-slate-600 transition hover:text-[#063B8F]"
            >
              Popular Routes
            </Link>

            <Link
              href="/tour-packages"
              className="text-sm font-black text-[#063B8F]"
            >
              Tour Packages
            </Link>

            <Link
              href="/#services"
              className="text-sm font-bold text-slate-600 transition hover:text-[#063B8F]"
            >
              Services
            </Link>

            <Link
              href="/fare-calculator"
              className="rounded-xl bg-[#FFC400] px-4 py-2.5 text-sm font-black text-slate-950 shadow-sm transition hover:bg-[#f2b900]"
            >
              Fare Calculator
            </Link>
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <a
              href={`tel:+91${PHONE}`}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#FF1726] px-4 text-xs font-black text-white shadow-[0_8px_20px_rgba(255,23,38,.22)] transition hover:-translate-y-0.5"
            >
              <Phone
                size={16}
                fill="currentColor"
              />
              Call Now
            </a>

            <a
              href={whatsappMessage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-4 text-xs font-black text-white shadow-[0_8px_20px_rgba(37,211,102,.22)] transition hover:-translate-y-0.5"
            >
              <WhatsAppIcon size={18} />
              WhatsApp
            </a>
          </div>

          {/* CSS MOBILE MENU ICON */}

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071A3A] lg:hidden">
            <div className="flex w-5 flex-col gap-1">
              <span className="h-0.5 w-5 rounded-full bg-white" />
              <span className="h-0.5 w-4 rounded-full bg-white" />
              <span className="h-0.5 w-5 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* MOBILE HINDI LINE */}

        <div className="border-t border-slate-100 bg-[#071A3A] px-4 py-2.5 text-center sm:hidden">
          <p className="text-[12px] font-black leading-5 text-white">
            टूर पैकेज बुक करने के लिए कॉल करें{" "}
            <a
              href={`tel:+91${PHONE}`}
              className="text-[#FFC400] underline underline-offset-2"
            >
              {PHONE}
            </a>
          </p>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#061735]">
        <div className="absolute inset-0">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#FFC400]/15 blur-[120px]" />

          <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-[#063B8F]/40 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_.85fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#FFC400] backdrop-blur">
                <Sparkles size={13} />
                Curated Road Trips from Chhattisgarh
              </div>

              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                Tour Packages from Chhattisgarh
                <span className="mt-2 block text-[#FFC400]">
                  Travel More. Plan Better.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-300 sm:text-lg">
                Explore pilgrimage, family and multi-city tour packages from
                Korba, Raipur, Bilaspur, Raigarh, Ambikapur and major cities
                across Chhattisgarh with comfortable private cab travel.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#tour-packages"
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#FFC400] px-7 text-sm font-black text-slate-950 shadow-[0_15px_35px_rgba(255,196,0,.18)] transition hover:-translate-y-0.5"
                >
                  Explore Tour Packages
                  <ArrowRight size={18} />
                </a>

                <a
                  href={whatsappMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-7 text-sm font-black text-white shadow-[0_15px_35px_rgba(37,211,102,.2)] transition hover:-translate-y-0.5"
                >
                  <WhatsAppIcon size={20} />
                  Plan My Trip
                </a>
              </div>

              <div className="mt-7 grid max-w-xl grid-cols-3 gap-2">
                {[
                  ["12+", "Tour Options"],
                  ["12+", "Pickup Cities"],
                  ["AC", "Private Cabs"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur"
                  >
                    <p className="text-lg font-black text-white">
                      {value}
                    </p>

                    <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[40px] bg-[#FFC400]/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.07] p-2 shadow-2xl">
                <div className="relative overflow-hidden rounded-[26px]">
                  <img
                    src="/hero/01.png"
                    alt="Tour packages from Chhattisgarh by Khatu Rides"
                    className="h-[300px] w-full object-cover sm:h-[390px]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061735]/90 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-[#061735]/85 p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFC400] text-slate-950">
                        <Compass size={21} />
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FFC400]">
                          Private Cab Tours
                        </p>

                        <p className="mt-1 text-sm font-black text-white">
                          Your Journey Starts Here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORY BAR
      ===================================================== */}

      <section className="sticky top-[72px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 scrollbar-hide sm:px-6 lg:px-8">
          {CATEGORIES.map((category, index) => (
            <a
              key={category}
              href="#tour-packages"
              className={`shrink-0 rounded-full border px-4 py-2.5 text-[10px] font-black transition ${
                index === 0
                  ? "border-[#071A3A] bg-[#071A3A] text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-[#FFC400] hover:bg-amber-50"
              }`}
            >
              {category}
            </a>
          ))}
        </div>
      </section>

      {/* =====================================================
          PACKAGE GRID
      ===================================================== */}

      <section
        id="tour-packages"
        className="bg-[#f7f9fc] py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
                Explore Our Tours
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Choose Your{" "}
                <span className="text-[#063B8F]">
                  Perfect Tour Package
                </span>
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-600 sm:text-base">
                Discover curated pilgrimage and family road trips from
                Chhattisgarh. Open any package to see the detailed itinerary,
                places covered, travel information and booking options.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Route
                size={17}
                className="text-[#063B8F]"
              />

              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Available Packages
                </p>

                <p className="text-sm font-black text-slate-950">
                  {TOUR_PACKAGES.length} Tour Options
                </p>
              </div>
            </div>
          </div>

          {/* FEATURED */}

          <div className="mt-9">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFC400] text-slate-950">
                <Star
                  size={14}
                  fill="currentColor"
                />
              </span>

              <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                Featured Tour Packages
              </h3>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {TOUR_PACKAGES.slice(0, 3).map((tour) => (
                <TourCard
                  key={tour.slug}
                  tour={tour}
                  featured
                />
              ))}
            </div>
          </div>

          {/* ALL PACKAGES */}

          <div className="mt-12">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-950">
                  All Tour Packages
                </h3>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Explore destinations and open the package for complete
                  details.
                </p>
              </div>

              <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-500 sm:block">
                {TOUR_PACKAGES.length} Packages
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {TOUR_PACKAGES.slice(3).map((tour) => (
                <TourCard
                  key={tour.slug}
                  tour={tour}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY BOOK
      ===================================================== */}

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
              Why Book With Khatu Rides
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
              More Than a Cab.{" "}
              <span className="text-[#063B8F]">
                A Better Road Trip.
              </span>
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
              Our tour package experience is designed around comfortable
              transportation, practical route planning and direct booking
              assistance.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Car,
                title: "Private Cab Travel",
                text: "Travel with your family or group in a dedicated vehicle.",
              },
              {
                icon: Waypoints,
                title: "Route Planning",
                text: "Plan multi-city journeys around your selected destinations.",
              },
              {
                icon: ShieldCheck,
                title: "Direct Assistance",
                text: "Discuss your package requirements directly before booking.",
              },
              {
                icon: WalletCards,
                title: "Transparent Planning",
                text: "Understand the package details before confirming your trip.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.05)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-base font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          PICKUP CITIES
      ===================================================== */}

      <section className="bg-[#f5f7fb] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
                Pickup Locations
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Start Your Tour From{" "}
                <span className="text-[#063B8F]">
                  Chhattisgarh
                </span>
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                Our tour package enquiries are designed for travellers across
                major Chhattisgarh cities. Tell us your pickup location,
                destination, travel dates and number of passengers.
              </p>

              <a
                href={whatsappMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-xs font-black text-white shadow-sm"
              >
                <WhatsAppIcon size={17} />
                Ask About My Pickup
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PICKUP_CITIES.map((city) => (
                <a
                  key={city}
                  href={waLink(
                    `Hello Khatu Rides, I want to start a tour package from ${city}. Please suggest available tour packages.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#FFC400]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#071A3A] text-[#FFC400]">
                    <MapPin
                      size={15}
                      fill="currentColor"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-black text-slate-950">
                      {city}
                    </p>

                    <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                      Tour Pickup
                    </p>
                  </div>

                  <ChevronRight
                    size={14}
                    className="ml-auto text-slate-300 transition group-hover:text-[#063B8F]"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
              Simple Booking Process
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Book Your Tour in 4 Steps
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              {
                number: "01",
                icon: Compass,
                title: "Choose a Tour",
                text: "Select the destination and package that matches your travel plan.",
              },
              {
                number: "02",
                icon: CalendarDays,
                title: "Share Dates",
                text: "Tell us your travel dates, pickup city and number of travellers.",
              },
              {
                number: "03",
                icon: Car,
                title: "Select Vehicle",
                text: "Choose a suitable cab according to passengers and luggage.",
              },
              {
                number: "04",
                icon: CheckCircle2,
                title: "Confirm Trip",
                text: "Finalize the itinerary and booking details directly with us.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A3A] text-[#FFC400]">
                      <Icon size={19} />
                    </div>

                    <span className="text-3xl font-black text-slate-200">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-black text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          SEO CONTENT
      ===================================================== */}

      <section className="bg-[#f5f7fb] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
            Tour Package Guide
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Tour Packages from Chhattisgarh for Pilgrimage & Family Travel
          </h2>

          <p className="mt-5 text-sm font-medium leading-7 text-slate-600">
            Travellers from Chhattisgarh often plan long-distance road journeys
            for pilgrimage, family visits, sightseeing and multi-city travel.
            A private cab tour provides flexibility to choose the pickup point,
            travel dates, vehicle and destinations according to the group's
            requirements.
          </p>

          <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
            Khatu Rides tour packages are designed around popular pilgrimage
            and holiday destinations that can be reached by road from
            Chhattisgarh. Travellers can explore individual package details,
            compare destinations and contact the booking team for itinerary and
            vehicle requirements.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Pilgrimage Tour Packages from Chhattisgarh
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Pilgrimage travel is one of the most common reasons families book
            long-distance cabs from Chhattisgarh. Destinations such as Khatu
            Shyam Ji, Prayagraj, Ayodhya, Varanasi, Mathura-Vrindavan, Ujjain
            and Omkareshwar can be planned as dedicated pilgrimage journeys.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Khatu Shyam Ji Tour Package
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Khatu Shyam Ji is a popular pilgrimage destination for devotees
            travelling from different parts of India. A dedicated Khatu Shyam
            Ji tour package can combine comfortable road transportation with
            planned temple visits and optional nearby pilgrimage destinations.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Prayagraj, Ayodhya & Varanasi Tour Packages
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Prayagraj, Ayodhya and Varanasi are important spiritual and
            cultural destinations in Uttar Pradesh. Travellers can choose
            individual packages or plan a multi-city road journey depending on
            available travel days and preferred itinerary.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Family Tour Packages from Korba, Raipur & Bilaspur
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Families travelling from Korba, Raipur, Bilaspur, Raigarh,
            Ambikapur and other Chhattisgarh cities may prefer private cab
            tours because the journey can be planned around their own schedule.
            Vehicle selection can also be based on the number of passengers and
            luggage.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Private Cab Tour Packages
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Private cab tours are useful when travellers want direct
            transportation instead of joining a fixed group. Families and
            small groups can discuss vehicle requirements, pickup location,
            destinations and itinerary before confirming their trip.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Customized Tour Itineraries
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Every traveller may have different requirements. Some groups may
            want additional sightseeing, while others may prefer a shorter
            pilgrimage itinerary. Share your travel dates, passenger count,
            pickup location and destinations to discuss the available options.
          </p>

          <div className="mt-10 rounded-[26px] border border-[#FFC400]/40 bg-amber-50 p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFC400] text-slate-950">
                <Waypoints size={20} />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-950">
                  Can't Find Your Destination?
                </h3>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                  Send your destination, pickup city, travel dates and number
                  of travellers. We can discuss the suitable tour option.
                </p>

                <a
                  href={whatsappMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-xs font-black text-white"
                >
                  <WhatsAppIcon size={17} />
                  Plan Custom Tour
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
              Frequently Asked Questions
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Tour Package FAQs
            </h2>
          </div>

          <div className="mt-9 space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-slate-950">
                  {faq.q}

                  <ChevronRight
                    size={17}
                    className="shrink-0 transition group-open:rotate-90"
                  />
                </summary>

                <p className="mt-3 border-t border-slate-100 pt-3 text-xs font-medium leading-6 text-slate-600">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-[#061735] py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-7 text-center backdrop-blur sm:p-10">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#FFC400]/10 blur-3xl" />

            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[#063B8F]/30 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFC400] text-slate-950">
                <Compass size={25} />
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                Ready to Plan Your Next Journey?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-300">
                Choose a tour package or tell us where you want to go. Share
                your pickup city, travel dates and number of travellers and
                start planning your road trip with Khatu Rides.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={`tel:+91${PHONE}`}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#FF1726] px-7 text-sm font-black text-white shadow-[0_15px_35px_rgba(255,23,38,.25)]"
                >
                  <Phone
                    size={19}
                    fill="currentColor"
                  />
                  Call {PHONE_DISPLAY}
                </a>

                <a
                  href={whatsappMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-7 text-sm font-black text-white shadow-[0_15px_35px_rgba(37,211,102,.22)]"
                >
                  <WhatsAppIcon size={20} />
                  WhatsApp Booking
                </a>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] font-bold text-slate-400">
                <span>✓ Pilgrimage Tours</span>
                <span>✓ Family Tours</span>
                <span>✓ Private Cabs</span>
                <span>✓ Multi-City Trips</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

      {/* =====================================================
          MOBILE ACTIONS
      ===================================================== */}

      <FloatingActions />
    </main>
  );
}
// app/corporate-taxi/[city]/page.tsx

import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";

import CorporateHero from "@/components/CorporateHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar";
import FloatingContact from "@/components/FloatingContact";

import {
  Briefcase,
  FileCheck,
  Building2,
  UserCheck,
  CheckCircle2,
  FileText,
  ShieldCheck,
  CarFront,
  ChevronRight,
  Settings,
  PhoneCall,
  Users,
  MapPin,
  Search,
  ArrowRight,
} from "lucide-react";

/* =========================================================
   SITE CONFIGURATION (SYNCED WITH app/layout.tsx)
========================================================= */

const SITE_URL = "https://khaturidescg.in";
const BUSINESS_NAME = "Khatu Rides Travels Co.";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";
const OG_IMAGE = `${SITE_URL}/hero/main%20image.png`;

/* =========================================================
   CORPORATE & INDUSTRIAL HUB MASTER DATA (28 SYNCED HUBS)
========================================================= */

type CorporateCity = {
  slug: string;
  name: string;
  state: string;
  zones: string[];
};

const CORPORATE_CITIES: CorporateCity[] = [
  {
    slug: "korba",
    name: "Korba",
    state: "Chhattisgarh",
    zones: [
      "NTPC Jamnipali",
      "BALCO Plant & Township",
      "SECL Korba Area",
      "CSEB East & West",
      "Transport Nagar",
      "Dipka, Gevra & Kusmunda Belt",
    ],
  },
  {
    slug: "raipur",
    name: "Raipur",
    state: "Chhattisgarh",
    zones: [
      "Swami Vivekananda Airport (Mana)",
      "Siltara Industrial Area",
      "Urla Industrial Area",
      "VIP Road & Telibandha",
      "Pandri Commercial Hub",
      "Nava Raipur (Atal Nagar)",
    ],
  },
  {
    slug: "naya-raipur",
    name: "Naya Raipur",
    state: "Chhattisgarh",
    zones: [
      "Mahanadi Bhawan (Mantralaya)",
      "Indravati Bhawan",
      "Atal Nagar Corporate Sectors",
      "IIIT & IIM Naya Raipur",
      "Mana Airport Corridor",
    ],
  },
  {
    slug: "bilaspur",
    name: "Bilaspur",
    state: "Chhattisgarh",
    zones: [
      "SECL Headquarters",
      "NTPC Sipat",
      "Chhattisgarh High Court (Bodri)",
      "Sirgitti Industrial Area",
      "Vyapar Vihar",
      "Uslapur & Bilaspur Junction",
    ],
  },
  {
    slug: "raigarh",
    name: "Raigarh",
    state: "Chhattisgarh",
    zones: [
      "JSPL Jindal Nagar",
      "Tamnar Coal & Power Belt",
      "Gharghoda",
      "Punjipathra Industrial Area",
      "Kharsia Corridor",
      "Raigarh Railway Station",
    ],
  },
  {
    slug: "bhilai",
    name: "Bhilai",
    state: "Chhattisgarh",
    zones: [
      "Bhilai Steel Plant (BSP)",
      "Heavy Industrial Area (Hathkhoj)",
      "Civic Centre",
      "Supela & Nehru Nagar",
      "IIT Bhilai",
    ],
  },
  {
    slug: "durg",
    name: "Durg",
    state: "Chhattisgarh",
    zones: [
      "Borai Industrial Area",
      "Durg Junction",
      "Malviya Nagar",
      "Bhilai-Durg Commercial Corridor",
    ],
  },
  {
    slug: "ambikapur",
    name: "Ambikapur",
    state: "Chhattisgarh",
    zones: [
      "SECL Bishrampur & Bhatgaon Belt",
      "Darima Airport",
      "Ambikapur Railway Station",
      "Gandhi Chowk & Banaras Road",
      "Surajpur Industrial Corridor",
    ],
  },
  {
    slug: "jagdalpur",
    name: "Jagdalpur",
    state: "Chhattisgarh",
    zones: [
      "NMDC Nagarnar Steel Plant",
      "Jagdalpur Airport",
      "Bastar Mining Corridor",
      "Geedam & Kirandul Route",
    ],
  },
  {
    slug: "champa",
    name: "Champa",
    state: "Chhattisgarh",
    zones: [
      "CSPGCL Marwa & Madwa Power Plants",
      "Champa Junction",
      "Kosa & Industrial Belt",
      "Janjgir-Naila Corridor",
    ],
  },
  {
    slug: "kharsia",
    name: "Kharsia",
    state: "Chhattisgarh",
    zones: [
      "Kharsia Railway Station",
      "Raigarh-Sakti Industrial Highway",
      "Power Plant Contractor Hub",
    ],
  },
  {
    slug: "katghora",
    name: "Katghora",
    state: "Chhattisgarh",
    zones: [
      "NH-130 Industrial Corridor",
      "Dipka-Gevra Mining Approach",
      "Ambikapur-Korba Highway Hub",
    ],
  },
  {
    slug: "dipka",
    name: "Dipka",
    state: "Chhattisgarh",
    zones: [
      "SECL Dipka Expansion Project",
      "Dipka Colony",
      "Gevra & Kusmunda Mining Belt",
    ],
  },
  {
    slug: "gevra",
    name: "Gevra",
    state: "Chhattisgarh",
    zones: [
      "SECL Gevra Mega Project",
      "Gevra Road Station",
      "Urja Nagar & Dipka",
    ],
  },
  {
    slug: "kusmunda",
    name: "Kusmunda",
    state: "Chhattisgarh",
    zones: [
      "SECL Kusmunda Area",
      "Kusmunda Colony",
      "Korba Industrial Bypass",
    ],
  },
  {
    slug: "balco",
    name: "Balco",
    state: "Chhattisgarh",
    zones: [
      "Vedanta BALCO Aluminium Plant",
      "BALCO Township Sectors 1-5",
      "Parsabhata & Korba City",
    ],
  },
  {
    slug: "ntpc-sipat",
    name: "NTPC Sipat",
    state: "Chhattisgarh",
    zones: [
      "NTPC Sipat Super Thermal Power Station",
      "Ujjwal Nagar Township",
      "Bilaspur City & Station Corridor",
    ],
  },
  {
    slug: "tamnar",
    name: "Tamnar",
    state: "Chhattisgarh",
    zones: [
      "Jindal Power Limited (JPL) Tamnar",
      "Gare Palma Coal Blocks",
      "Raigarh Industrial Road",
    ],
  },
  {
    slug: "gharghoda",
    name: "Gharghoda",
    state: "Chhattisgarh",
    zones: [
      "Gharghoda Coal & Logistics Belt",
      "SECL & Private Mining Sites",
      "Raigarh-Ambikapur Highway",
    ],
  },
  {
    slug: "bishrampur",
    name: "Bishrampur",
    state: "Chhattisgarh",
    zones: [
      "SECL Bishrampur Area",
      "Surajpur & Ambikapur Corridor",
      "Bishrampur Railway Station",
    ],
  },
  {
    slug: "jharsuguda",
    name: "Jharsuguda",
    state: "Odisha",
    zones: [
      "Vedanta Aluminium Jharsuguda",
      "Veer Surendra Sai Airport (JRG)",
      "MCL IB Valley & Brajrajnagar",
      "Belpahar & Jharsuguda Junction",
    ],
  },
  {
    slug: "sambalpur",
    name: "Sambalpur",
    state: "Odisha",
    zones: [
      "MCL Headquarters Burla",
      "Hindalco Hirakud",
      "Ainthapali Commercial Hub",
      "Sambalpur Junction",
    ],
  },
  {
    slug: "ranchi",
    name: "Ranchi",
    state: "Jharkhand",
    zones: [
      "Birsa Munda Airport (IXR)",
      "CCL Headquarters & CMPDI",
      "HEC & Hatia Industrial Area",
      "Lalpur & Main Road Corporate Hub",
    ],
  },
  {
    slug: "garhwa",
    name: "Garhwa",
    state: "Jharkhand",
    zones: [
      "Garhwa Road Junction",
      "Ranka More & Rehla Industrial Belt",
      "Chhattisgarh-UP Border Logistics Hub",
    ],
  },
  {
    slug: "renukoot",
    name: "Renukoot",
    state: "Uttar Pradesh",
    zones: [
      "Hindalco Industries Renukoot",
      "Renukoot Railway Station",
      "Pipri & Sonbhadra Power Corridor",
    ],
  },
  {
    slug: "shaktinagar",
    name: "Shaktinagar",
    state: "Uttar Pradesh",
    zones: [
      "NTPC Singrauli (Shaktinagar)",
      "NCL Coal Projects",
      "Anpara & Obra Power Belt",
    ],
  },
  {
    slug: "sonbhadra",
    name: "Sonbhadra",
    state: "Uttar Pradesh",
    zones: [
      "Robertsganj & Chopan",
      "Anpara, Obra & Renukoot Belt",
      "Singrauli-Varanasi Highway",
    ],
  },
  {
    slug: "rajnandgaon",
    name: "Rajnandgaon",
    state: "Chhattisgarh",
    zones: [
      "Industrial Estate Rajnandgaon",
      "G.E. Road Commercial Corridor",
      "Durg-Nagpur NH-53 Highway",
    ],
  },
];

/* =========================================================
   UTILITIES & RESOLUTION
========================================================= */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveCity(cityParam: string): CorporateCity | null {
  const cleanSlug = slugify(decodeURIComponent(cityParam));
  return CORPORATE_CITIES.find((c) => c.slug === cleanSlug) ?? null;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return CORPORATE_CITIES.map((city) => ({ city: city.slug }));
}

function getRelatedCorporateCities(current: CorporateCity) {
  const sameState = CORPORATE_CITIES.filter(
    (c) => c.slug !== current.slug && c.state === current.state
  );
  const otherState = CORPORATE_CITIES.filter(
    (c) => c.slug !== current.slug && c.state !== current.state
  );
  const pool = [...sameState, ...otherState];
  const idx = CORPORATE_CITIES.findIndex((c) => c.slug === current.slug);
  const offset = idx >= 0 ? (idx * 3) % pool.length : 0;

  const result: CorporateCity[] = [];
  for (let i = 0; i < 6 && i < pool.length; i++) {
    result.push(pool[(offset + i) % pool.length]);
  }
  return result;
}

/* =========================================================
   METADATA (SEO, AEO & GEO)
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: cityParam } = await params;
  const cityInfo = resolveCity(cityParam);

  if (!cityInfo) {
    return {
      title: "Corporate Car Rental & B2B Taxi Service",
      robots: { index: false, follow: true },
    };
  }

  const cityName = cityInfo.name;
  // Uses layout.tsx template: "%s | Khatu Rides Travels Co."
  const title = `Corporate Car Rental & B2B Taxi Service in ${cityName}`;
  const fullTitle = `${title} | ${BUSINESS_NAME}`;
  const description = `24/7 corporate taxi services, monthly car attachments, GST-compliant invoicing, and executive airport transfers in ${cityName}, ${cityInfo.state}. Clean AC Swift Dzire, Ertiga & Innova Crysta for plants, offices & VIP visits.`;
  const canonical = `${SITE_URL}/corporate-taxi/${cityInfo.slug}`;

  const keywords = [
    `corporate car rental ${cityName}`,
    `corporate taxi service in ${cityName}`,
    `monthly cab rental ${cityName}`,
    `monthly car attachment ${cityName}`,
    `commercial taxi ${cityName}`,
    `B2B taxi service ${cityName}`,
    `corporate travel ${cityName}`,
    `executive cab service ${cityName}`,
    `industrial plant visitor taxi ${cityName}`,
    `GST billing cab service ${cityName}`,
    `Innova Crysta corporate hire ${cityName}`,
    `company car rental ${cityName}`,
    BUSINESS_NAME,
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonical,
      siteName: BUSINESS_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `Corporate Car Rental & B2B Taxi Service in ${cityName} - ${BUSINESS_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}

/* =========================================================
   MAIN PAGE COMPONENT
========================================================= */

export default async function CorporateTaxiPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: cityParam } = await params;
  const cityInfo = resolveCity(cityParam);

  if (!cityInfo) {
    notFound();
  }

  // Redirect legacy uppercase or space URLs cleanly
  if (cityParam !== cityInfo.slug) {
    permanentRedirect(`/corporate-taxi/${cityInfo.slug}`);
  }

  const cityName = cityInfo.name;
  const canonical = `${SITE_URL}/corporate-taxi/${cityInfo.slug}`;
  const relatedCities = getRelatedCorporateCities(cityInfo);

  const faqs = [
    {
      question: `How does the monthly corporate credit facility work in ${cityName}?`,
      answer: `Once your company is onboarded with ${BUSINESS_NAME}, employees and visiting executives can book cabs cashlessly. A digital or signed duty slip is maintained for every trip, and a consolidated GST invoice is shared fortnightly or monthly as per agreed credit terms.`,
    },
    {
      question: `Can we get a dedicated car exclusively for our company on a monthly basis in ${cityName}?`,
      answer: `Yes! Our Monthly Car Attachment model provides a dedicated commercial-plated AC car (Swift Dzire, Maruti Ertiga, or Toyota Innova Crysta) with a verified driver—commonly on 2,500 km / 30 days or customized site packages—with replacement vehicle support.`,
    },
    {
      question: `Do you provide GST-compliant invoices for corporate cab bookings?`,
      answer: `Yes, we provide 100% GST-compliant corporate invoicing suitable for company accounts and vendor audits across ${cityName} and ${cityInfo.state}.`,
    },
    {
      question: `Are your corporate drivers trained for executive, plant, and airport duties?`,
      answer: `Yes. Our corporate chauffeurs are background-verified, punctual, familiar with industrial plant safety norms (NTPC, BALCO, SECL, JSPL, Vedanta, BSP), and experienced in early morning and late-night airport transfers.`,
    },
  ];

  // Unified SEO + AEO + GEO Knowledge Graph (@graph)
  // Linked directly to layout.tsx #organization and #website
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `Corporate Car Rental & B2B Taxi Service in ${cityName} | ${BUSINESS_NAME}`,
        description: `Corporate taxi services, monthly car attachments, GST billing, and executive airport transfers in ${cityName}, ${cityInfo.state}.`,
        inLanguage: "en-IN",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${canonical}#service`,
        },
        breadcrumb: {
          "@id": `${canonical}#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
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
            name: "Corporate Solutions",
            item: `${SITE_URL}/corporate-taxi`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `Corporate Taxi ${cityName}`,
            item: canonical,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        serviceType: "Corporate Car Rental & B2B Taxi Service",
        name: `Corporate Car Rental & Monthly Cab Attachment in ${cityName}`,
        description: `Dedicated monthly car rentals, GST-billed corporate taxis, industrial site commute fleets, and VIP executive airport transfers in ${cityName}, ${cityInfo.state}.`,
        url: canonical,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        areaServed: [
          { "@type": "City", name: cityName },
          { "@type": "State", name: cityInfo.state },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${cityName} Corporate Mobility Solutions`,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Monthly Car Attachment in ${cityName} (2500 Km / 30 Days)`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Executive & CXO Chauffeur Travel in ${cityName}`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Corporate Airport, Hotel & Industrial Plant Transfers (${cityName})`,
              },
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  const seoKeywords = [
    `Corporate taxi service in ${cityName}`,
    `Monthly car rental ${cityName}`,
    `B2B cab service ${cityName}`,
    `Commercial vehicle on rent ${cityName}`,
    `Company cab attachment ${cityName}`,
    `Executive Innova Crysta hire ${cityName}`,
    `Corporate airport transfer ${cityName}`,
    `GST billed taxi service ${cityName}`,
    `Plant visitor cab ${cityName}`,
    `Employee transport service ${cityName}`,
    `Long term car rental with driver ${cityName}`,
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello ${BUSINESS_NAME}, we have a corporate taxi / monthly car rental requirement in ${cityName}.\n\nPlease share your B2B tariff card and onboarding details.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${whatsappMessage}`;

  return (
    <>
      <Navbar />
      <FloatingContact origin={cityName} destination="Corporate Travel" />

      <main className="flex flex-col min-h-screen bg-slate-50 font-sans">
        {/* Unified SEO + AEO + GEO JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

        {/* Corporate Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="bg-slate-950 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span>Corporate Solutions</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-semibold">{cityName}</span>
        </nav>

        {/* Dynamic B2B Hero Section */}
        <CorporateHero initialCity={cityName} />

        {/* SECTION 1: B2B VALUE PROPOSITION */}
        <div className="bg-white border-b border-slate-200 py-10 shadow-sm relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200">
              <div className="px-4 hover:-translate-y-1 transition-transform">
                <FileCheck className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h2 className="font-black text-slate-900 text-lg">
                  100% GST Compliant
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Input Tax Credit (ITC) Ready Bills for your accounts
                </p>
              </div>
              <div className="px-4 hover:-translate-y-1 transition-transform">
                <Building2 className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h2 className="font-black text-slate-900 text-lg">
                  Credit Facility
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Flexible Fortnightly or Monthly Invoicing cycles
                </p>
              </div>
              <div className="px-4 hover:-translate-y-1 transition-transform">
                <UserCheck className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h2 className="font-black text-slate-900 text-lg">
                  Dedicated Manager
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Single Point of Contact for all your bookings
                </p>
              </div>
              <div className="px-4 hover:-translate-y-1 transition-transform">
                <ShieldCheck className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h2 className="font-black text-slate-900 text-lg">
                  Verified Drivers
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Highly trained &amp; background-checked chauffeurs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: TRUSTED BY SECTORS */}
        <section className="py-12 bg-slate-100 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">
              Serving Leading Industries &amp; Corporate Sectors in{" "}
              {cityInfo.state}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-75">
              <div className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Building2 /> Mining &amp; Coal Vendors
              </div>
              <div className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Settings /> Power &amp; Steel Plants
              </div>
              <div className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Briefcase /> Banking &amp; EPC Firms
              </div>
              <div className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Building2 /> Healthcare &amp; Pharma
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SERVICES OFFERED */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Comprehensive Business Transport in {cityName}
              </h2>
              <p className="text-slate-600 mt-6 text-lg">
                From daily employee commutes and industrial site visits to VIP
                executive airport transfers, we manage your company&apos;s
                mobility needs with reliable precision.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <CarFront className="w-7 h-7 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Monthly Car Attachment
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Hire commercial cars on a monthly retention basis (e.g., 2,500
                  Kms / 30 Days). Ideal for project engineers, sales teams, and
                  regional managers in {cityName}.
                </p>
                <ul className="space-y-3 text-sm font-bold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />{" "}
                    Fixed Monthly Budgeting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />{" "}
                    Replacement Car Guarantee
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />{" "}
                    Maintenance &amp; Permits Included
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="w-7 h-7 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Executive &amp; CXO Travel
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Premium AC fleet (Toyota Innova Crysta, Maruti Ertiga, Swift
                  Dzire) with disciplined, experienced chauffeurs for VIP guests
                  and senior management.
                </p>
                <ul className="space-y-3 text-sm font-bold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />{" "}
                    Clean &amp; Sanitized Cabins
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />{" "}
                    Strict Punctuality Standards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />{" "}
                    24/7 Priority Dispatch Support
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Hotel, Plant &amp; Airport Transfers
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Seamless point-to-point transfers for corporate conferences,
                  industrial plant audits, and early morning flight arrivals in
                  and around {cityName}.
                </p>
                <ul className="space-y-3 text-sm font-bold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />{" "}
                    Flight-Tracked Airport Pickups
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />{" "}
                    Bulk &amp; Multi-Car Management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />{" "}
                    Intercity One-Way Corporate Drops
                  </li>
                </ul>
              </div>
            </div>

            {/* HYPERLOCAL CORPORATE & INDUSTRIAL COVERAGE ZONES (GEO SIGNAL) */}
            {cityInfo.zones.length > 0 && (
              <div className="mt-14 rounded-3xl bg-blue-50/70 border border-blue-100 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-700 shrink-0" />
                  <h3 className="text-lg font-black text-slate-900">
                    Key Corporate &amp; Industrial Zones Covered in {cityName}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {cityInfo.zones.map((zone) => (
                    <span
                      key={zone}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-blue-200 text-xs font-semibold text-slate-700"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: HOW IT WORKS (The Process) */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                How to Partner With Us
              </h2>
              <p className="text-slate-400">
                A simple, transparent 4-step onboarding process for corporate
                clients in {cityName}.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Share Needs</h3>
                <p className="text-slate-400 text-sm">
                  Tell us your fleet size, routes, and monthly usage in{" "}
                  {cityName}.
                </p>
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] border-t-2 border-dashed border-slate-600" />
              </div>
              <div className="text-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Get Proposal</h3>
                <p className="text-slate-400 text-sm">
                  We provide a customized B2B tariff card with GST &amp; credit
                  terms.
                </p>
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] border-t-2 border-dashed border-slate-600" />
              </div>
              <div className="text-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Sign Agreement</h3>
                <p className="text-slate-400 text-sm">
                  Quick vendor registration and SLA sign-off.
                </p>
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] border-t-2 border-dashed border-slate-600" />
              </div>
              <div className="text-center relative">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Start Booking</h3>
                <p className="text-slate-400 text-sm">
                  Book cabs instantly via phone or WhatsApp with your dedicated
                  account manager.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: OUR CORPORATE FLEET */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                  Our Corporate Fleet in {cityName}
                </h2>
                <p className="text-slate-600 text-lg">
                  Well-maintained, commercial-plated AC vehicles ready for your
                  business.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <h3 className="text-2xl font-black text-slate-900">
                  Executive Sedan
                </h3>
                <p className="text-blue-600 font-bold text-sm mb-6">
                  Maruti Swift Dzire / Hyundai Aura
                </p>
                <div className="bg-slate-50 p-4 rounded-xl mb-4 text-sm text-slate-600 font-medium">
                  Ideal for regular site visits, daily official commuting, and
                  sales team movements. Cost-effective and highly reliable.
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all border-t-4 border-t-blue-500 relative">
                <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                  Most Demanded
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  MUV / SUV
                </h3>
                <p className="text-blue-600 font-bold text-sm mb-6">
                  Maruti Ertiga (7-Seater)
                </p>
                <div className="bg-slate-50 p-4 rounded-xl mb-4 text-sm text-slate-600 font-medium">
                  Perfect for engineering teams (up to 6 passengers), airport
                  transfers with luggage, and intercity branch visits.
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <h3 className="text-2xl font-black text-slate-900">
                  Premium SUV
                </h3>
                <p className="text-blue-600 font-bold text-sm mb-6">
                  Toyota Innova Crysta
                </p>
                <div className="bg-slate-50 p-4 rounded-xl mb-4 text-sm text-slate-600 font-medium">
                  The preferred choice for VIPs, Directors, auditors, and
                  long-distance corporate highway travel with maximum comfort.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: B2B FAQs */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                Corporate Billing &amp; FAQs
              </h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-slate-50 p-8 rounded-3xl border border-slate-100"
                >
                  <h3 className="font-black text-xl text-slate-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: FINAL CALL TO ACTION */}
        <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to upgrade your company&apos;s transport in {cityName}?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Get in touch with our B2B dispatch desk today. We will review your
              monthly usage and share a competitive corporate tariff card.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`tel:${PHONE}`}
                className="bg-white text-blue-700 font-black text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5" /> Call {PHONE_DISPLAY}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                WhatsApp B2B Desk <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="mailto:khaturides@gmail.com"
                className="bg-blue-800 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" /> Email Requirements
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 8: POPULAR B2B SEARCHES */}
        <section className="py-12 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Search className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">
                Popular Corporate Cab Searches in {cityName}
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {seoKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9: INTERNAL LINKING TO OTHER CORPORATE HUBS */}
        <section className="py-12 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-slate-900">
              Explore Corporate Taxi Services in Other Industrial Hubs
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Dedicated B2B monthly car rentals and GST-compliant fleets across
              Chhattisgarh, Odisha, Jharkhand &amp; UP.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCities.map((other) => (
                <Link
                  key={other.slug}
                  href={`/corporate-taxi/${other.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <span className="text-sm font-bold text-slate-800">
                    Corporate Car Rental in {other.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-600 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
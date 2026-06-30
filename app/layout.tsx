// app/layout.tsx
import Script from "next/script";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

// Load professional layout typography to avoid string overlap bugs on short devices
const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const siteUrl = "https://khaturidescg.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Khatu Rides Travels Co. | Best Taxi Service in Chhattisgarh",
    template: "%s | Khatu Rides Travels Co.",
  },
  description:
    "Book trusted taxi service in Chhattisgarh with Khatu Rides Travels Co. We provide affordable one way taxi, round trip cab, outstation taxi, airport transfer, local cab, corporate travel and commercial car rental across Chhattisgarh. Popular routes include Raipur to Bilaspur, Bilaspur to Raipur, Raipur to Korba, Korba to Raipur, Raipur to Raigarh, Raigarh to Raipur, Raipur to Durg, Durg to Raipur, Raipur to Bhilai, Bhilai to Raipur, Bilaspur to Korba, Korba to Bilaspur, Bilaspur to Raigarh, Raigarh to Bilaspur, Raipur to Ambikapur, Ambikapur to Raipur, Raipur to Jagdalpur, Jagdalpur to Raipur, Raipur to Champa, Champa to Raipur, Raipur to Janjgir, Janjgir to Raipur, Raipur to Sakti, Sakti to Raipur, Raipur to Kawardha, Kawardha to Raipur, Raipur to Dhamtari, Dhamtari to Raipur, Raipur to Mahasamund, Mahasamund to Raipur, Raipur to Baloda Bazar, Baloda Bazar to Raipur, Raipur to Kanker, Kanker to Raipur, Raipur to Rajnandgaon, Rajnandgaon to Raipur, Raipur to Dongargarh, Dongargarh to Raipur, Raipur to Korba Airport, Raipur Airport Taxi, Swami Vivekananda Airport pickup and drop, Bilaspur Airport taxi and intercity cab services. Travel comfortably in Swift Dzire, Ertiga, Innova, Innova Crysta, Sedan and SUV taxis with experienced drivers, transparent pricing, 24×7 booking, doorstep pickup, safe travel and instant booking support.",
 keywords: [
  // Primary Business Keywords
  "taxi service in chhattisgarh",
  "best taxi service in chhattisgarh",
  "cab booking chhattisgarh",
  "online taxi booking chhattisgarh",
  "one way taxi chhattisgarh",
  "outstation taxi chhattisgarh",
  "outstation cab chhattisgarh",
  "car rental chhattisgarh",
  "commercial taxi service",
  "corporate taxi service",
  "24x7 taxi service",
  "airport taxi service",
  "intercity taxi service",

  // Raipur
  "raipur taxi service",
  "cab booking raipur",
  "book taxi in raipur",
  "raipur airport taxi",
  "raipur airport pickup",
  "raipur airport drop",
  "raipur to bilaspur taxi",
  "raipur to korba taxi",
  "raipur to raigarh taxi",
  "raipur to ambikapur taxi",
  "raipur to durg taxi",
  "raipur to bhilai taxi",
  "raipur to jagdalpur taxi",

  // Bilaspur
  "bilaspur taxi service",
  "cab booking bilaspur",
  "book taxi in bilaspur",
  "bilaspur to raipur taxi",
  "bilaspur to korba taxi",
  "bilaspur to raigarh taxi",
  "bilaspur airport taxi",

  // Korba
  "korba taxi service",
  "cab booking korba",
  "book taxi in korba",
  "korba to raipur taxi",
  "korba to bilaspur taxi",
  "korba to raigarh taxi",
  "korba to jharsuguda taxi",
  "korba to amarkantak taxi",
  "korba to varanasi taxi",

  // Raigarh
  "raigarh taxi service",
  "cab booking raigarh",
  "raigarh to raipur taxi",
  "raigarh to bilaspur taxi",
  "raigarh to korba taxi",

  // Airport
  "swami vivekananda airport taxi",
  "raipur airport cab",
  "airport pickup raipur",
  "airport drop raipur",

  // Long Distance
  "one way taxi booking",
  "one way cab booking",
  "round trip taxi",
  "long distance taxi",
  "intercity cab booking",

  // Vehicle Intent
  "swift dzire taxi",
  "ertiga taxi",
  "innova taxi",
  "innova crysta taxi",
  "sedan taxi",
  "suv taxi",
  "7 seater taxi",

  // Commercial Intent
  "book taxi online",
  "hire taxi online",
  "online cab booking",
  "instant taxi booking",
  "cheap taxi booking",
  "affordable taxi service",
  "reliable taxi service",
  "professional taxi service",
  "24 hour taxi booking",
  "doorstep taxi service"
],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Khatu Rides Travels Co. | Best Taxi Service in Chhattisgarh",
    description:
      "Trusted cab booking in Chhattisgarh for one way, round trip, outstation tour and commercial booking.",
    url: siteUrl,
    siteName: "Khatu Rides Travels Co.",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Khatu Rides Travels Co.",
    url: siteUrl,
    telephone: ["+919244137353", "+918319376115"],
    areaServed: [
      "Chhattisgarh",
      "Raipur",
      "Korba",
      "Bilaspur",
      "Jagdalpur",
      "Ambikapur",
      "Durg",
      "Bhilai",
    ],
    priceRange: "₹₹",
    description:
      "Khatu Rides Travels Co. Chhattisgarh ki trusted taxi aur cab booking service hai, jo Korba, Raipur, Bilaspur, Durg, Bhilai, Jagdalpur, Ambikapur aur nearby areas me reliable travel service provide karti hai. Dzire, Ertiga, Innova Crysta aur Sedan cars ke saath one way taxi, round trip cab, outstation tour, airport/railway pickup-drop aur commercial booking available hai.",
    serviceType: [
      "One Way Taxi",
      "Round Trip Taxi",
      "Outstation Cab",
      "Commercial Cab Booking",
      "Airport Taxi",
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: {
        "@type": "ContactPoint",
        telephone: "+919244137353",
        contactType: "booking",
        areaServed: "IN",
        availableLanguage: ["Hindi", "English"],
      },
    },
  };

  return (
    <html lang="hi" className={`${sansFont.variable} scroll-smooth`}>
      <body className="antialiased bg-slate-50 text-slate-800 min-h-screen flex flex-col overflow-x-hidden">
        
        {/* Google Analytics Tag Scripts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FXZZCTGQ4R"
          strategy="afterInteractive"
        />

        <Script id="google-tags" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-FXZZCTGQ4R');
            gtag('config', 'AW-18196199181');
          `}
        </Script>

        {/* Structured Local JSON-LD Schema Matrix */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema),
          }}
        />

        {/* Central Viewport Grid Component Mount */}
        <main className="flex-grow w-full flex flex-col">
          {children}
        </main>
        
        <Footer />

      </body>
    </html>
  );
}
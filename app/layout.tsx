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
    "Book reliable taxi service in Chhattisgarh with Khatu Rides Travels Co. Dzire, Ertiga, Innova Crysta and Sedan available for one way, round trip, outstation and commercial booking.",
  keywords: [
    "rahul travels korba",
    "rahul travels raipur",
    "rahul travels bilaspur",
    "one way service at korba",
    "rahul travels one way taxi service",
    "dezire car on rent at korba",
    "dezire car on rent at raipur",
    "raipur airport to korba taxi",
    "raipur airport to bilaspur taxi",
    "raipur airport to ambikapur taxi",
    "raipur airport to raigarh taxi",
    "korba to banaras taxi on rent",
    "korba to amarkantak car",
    "katghora to raipur car",
    "taxi service in Chhattisgarh",
    "best taxi service in Chhattisgarh",
    "cab booking Chhattisgarh",
    "taxi booking Chhattisgarh",
    "taxi near me Chhattisgarh",
    "cab service near me Chhattisgarh",
    "one way taxi Chhattisgarh",
    "outstation cab Chhattisgarh",
    "car rental in Chhattisgarh",
    "7 seater car on rent Chhattisgarh",
    "Raipur taxi service",
    "cab service in Raipur",
    "taxi service in Raipur",
    "Raipur cab booking",
    "Korba taxi service",
    "cab service in Korba",
    "taxi service in Korba",
    "Korba cab booking",
    "Bilaspur taxi service",
    "cab service in Bilaspur",
    "Durg taxi service",
    "Bhilai taxi service",
    "Raipur airport taxi",
    "Innova Crysta taxi Chhattisgarh",
    "Ertiga taxi Chhattisgarh",
    "Dzire taxi Chhattisgarh",
    "commercial cab booking Chhattisgarh",
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
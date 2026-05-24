import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Khatu Rides Travels Co. | Taxi Service in Chhattisgarh | Cab Booking",
  description:
    "Khatu Rides Travels Co. provides Dzire, Ertiga, Innova Crysta and Sedan cab service in Chhattisgarh for one way, round trip, outstation tour and commercial booking.",
  keywords: [
    "taxi service in chhattisgarh",
    "cab booking chhattisgarh",
    "korba taxi service",
    "raipur taxi service",
    "bilaspur taxi service",
    "outstation cab chhattisgarh",
    "innova crysta booking chhattisgarh",
    "ertiga taxi chhattisgarh",
    "one way taxi chhattisgarh",
  ],
  openGraph: {
    title: "Khatu Rides Travels Co. | Chhattisgarh Cab Service",
    description:
      "Book Dzire, Ertiga, Innova Crysta and Sedan for one way, round trip, outstation and commercial travel.",
    type: "website",
    locale: "en_IN",
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
    areaServed: "Chhattisgarh, India",
    telephone: ["+919244137353", "+918319376115"],
    priceRange: "₹₹",
    description:
      "Taxi and cab booking service in Chhattisgarh for one way, round trip, outstation tour and commercial booking.",
    serviceType: [
      "One Way Taxi",
      "Round Trip Taxi",
      "Outstation Cab",
      "Commercial Cab Booking",
    ],
  };

  return (
    <html lang="hi">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const phone1 = "9244137353";
const phone2 = "8319376115";
const siteUrl = "https://khatu-rides-travels.vercel.app";

const routeData: Record<
  string,
  {
    title: string;
    from: string;
    to: string;
    distance: string;
    duration: string;
    description: string;
    keywords: string[];
  }
> = {
  "raipur-to-korba-taxi": {
    title: "Raipur to Korba Taxi Service",
    from: "Raipur",
    to: "Korba",
    distance: "Approx. 200–220 km",
    duration: "Approx. 4.5–5.5 hours",
    description:
      "Book reliable Raipur to Korba taxi service with Khatu Rides Travels Co. Dzire, Ertiga, Innova Crysta and Sedan available for one way and round trip booking.",
    keywords: [
      "Raipur to Korba taxi",
      "Raipur to Korba cab",
      "taxi service Raipur to Korba",
      "one way taxi Raipur to Korba",
    ],
  },

  "korba-to-raipur-taxi": {
    title: "Korba to Raipur Taxi Service",
    from: "Korba",
    to: "Raipur",
    distance: "Approx. 200–220 km",
    duration: "Approx. 4.5–5.5 hours",
    description:
      "Book safe and affordable Korba to Raipur taxi service for airport drop, railway station drop, business travel, family trip and one way cab booking.",
    keywords: [
      "Korba to Raipur taxi",
      "Korba to Raipur cab",
      "taxi service Korba to Raipur",
      "Korba to Raipur one way taxi",
    ],
  },

  "raipur-to-bilaspur-taxi": {
    title: "Raipur to Bilaspur Taxi Service",
    from: "Raipur",
    to: "Bilaspur",
    distance: "Approx. 115–130 km",
    duration: "Approx. 2.5–3.5 hours",
    description:
      "Book Raipur to Bilaspur taxi service with clean cars, experienced drivers and transparent fare. Available for one way, round trip and commercial booking.",
    keywords: [
      "Raipur to Bilaspur taxi",
      "Raipur to Bilaspur cab",
      "taxi service Raipur to Bilaspur",
      "Raipur Bilaspur taxi booking",
    ],
  },

  "raipur-airport-taxi": {
    title: "Raipur Airport Taxi Service",
    from: "Raipur Airport",
    to: "Chhattisgarh",
    distance: "As per destination",
    duration: "As per route",
    description:
      "Book Raipur Airport taxi service for pickup and drop across Chhattisgarh. Dzire, Ertiga, Innova Crysta and Sedan available for airport transfer.",
    keywords: [
      "Raipur airport taxi",
      "Raipur airport cab booking",
      "airport taxi Raipur",
      "Raipur airport pickup drop taxi",
    ],
  },
};

const vehicles = [
  { name: "Dzire", type: "Sedan", price: "₹11/km se" },
  { name: "Ertiga", type: "7 Seater", price: "₹14/km se" },
  { name: "Innova Crysta", type: "Premium SUV", price: "₹18/km se" },
  { name: "Sedan", type: "Comfort Ride", price: "₹12/km se" },
];

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(routeData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = routeData[slug];

  if (!route) {
    return {
      title: "Route Not Found",
    };
  }

  return {
    title: `${route.title} | Best Cab Booking in Chhattisgarh`,
    description: route.description,
    keywords: route.keywords,
    alternates: {
      canonical: `${siteUrl}/routes/${slug}`,
    },
    openGraph: {
      title: `${route.title} | Khatu Rides Travels Co.`,
      description: route.description,
      url: `${siteUrl}/routes/${slug}`,
      siteName: "Khatu Rides Travels Co.",
      locale: "en_IN",
      type: "website",
    },
  };
}

export default async function RoutePage({ params }: PageProps) {
  const { slug } = await params;
  const route = routeData[slug];

  if (!route) {
    notFound();
  }

  const whatsappText = `Namaste Khatu Rides Travels Co.

Mujhe ${route.title} ke liye cab booking enquiry karni hai.

Pickup: ${route.from}
Drop: ${route.to}
Date:
Time:
Vehicle:
Trip Type:

Please mujhe best fare bata dijiye.`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${route.from} se ${route.to} taxi kaise book karein?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Aap Khatu Rides Travels Co. ko call ya WhatsApp karke ${route.from} se ${route.to} taxi book kar sakte hain.`,
        },
      },
      {
        "@type": "Question",
        name: `${route.title} ke liye kaunsi gaadi available hai?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dzire, Ertiga, Innova Crysta aur Sedan available hain.",
        },
      },
      {
        "@type": "Question",
        name: "Kya one way taxi available hai?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Haan, one way aur round trip dono booking available hai.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/">
            <h1 className="text-xl font-bold text-orange-600">
              Khatu Rides Travels Co.
            </h1>
            <p className="text-xs text-gray-500">Chhattisgarh Taxi Service</p>
          </a>

          <div className="hidden md:flex gap-3">
            <a
              href={`tel:${phone1}`}
              className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
            >
              Call Now
            </a>
            <a
              href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
                whatsappText
              )}`}
              className="px-4 py-2 rounded-full bg-green-600 text-white text-sm"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-orange-600 font-semibold mb-3">
              Trusted Route Taxi Service
            </p>

            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              {route.title}
            </h2>

            <p className="mt-5 text-gray-700 text-lg">{route.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border">
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-bold">{route.distance}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border">
                <p className="text-sm text-gray-500">Travel Time</p>
                <p className="font-bold">{route.duration}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`tel:${phone1}`}
                className="px-6 py-3 rounded-full bg-orange-600 text-white font-semibold shadow-lg"
              >
                Call {phone1}
              </a>
              <a
                href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
                  whatsappText
                )}`}
                className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold shadow-lg"
              >
                Get Fare on WhatsApp
              </a>
            </div>
          </div>

          {/* Enquiry Box */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 border">
            <h3 className="text-2xl font-bold text-gray-900">
              Quick Booking Enquiry
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-5">
              WhatsApp par fare aur availability confirm karein.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gray-50 border">
                <p className="text-sm text-gray-500">Pickup</p>
                <p className="font-bold">{route.from}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border">
                <p className="text-sm text-gray-500">Drop</p>
                <p className="font-bold">{route.to}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border">
                <p className="text-sm text-gray-500">Available Vehicles</p>
                <p className="font-bold">
                  Dzire, Ertiga, Innova Crysta, Sedan
                </p>
              </div>

              <a
                href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
                  whatsappText
                )}`}
                className="block text-center bg-green-600 hover:bg-green-700 text-white rounded-full py-3 font-bold shadow-lg transition"
              >
                WhatsApp Fare Enquiry
              </a>

              <a
                href={`tel:${phone2}`}
                className="block text-center bg-orange-600 hover:bg-orange-700 text-white rounded-full py-3 font-bold shadow-lg transition"
              >
                Call {phone2}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Choose Khatu Rides Travels Co. for {route.from} to {route.to}?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Clean & Comfortable Cars",
            "Experienced Local Drivers",
            "One Way & Round Trip Available",
            "Transparent Fare Estimate",
            "Family & Business Travel",
            "Fast WhatsApp Booking",
          ].map((item) => (
            <div
              key={item}
              className="p-6 rounded-2xl border shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-orange-600">{item}</h3>
              <p className="mt-3 text-gray-600">
                Safe, reliable aur comfortable cab service ke liye trusted
                option.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Vehicles */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Available Cars for {route.title}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((car) => (
              <div
                key={car.name}
                className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold">{car.name}</h3>
                <p className="text-gray-500">{car.type}</p>
                <p className="mt-3 font-semibold text-orange-600">
                  {car.price}
                </p>
                <a
                  href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
                    `Namaste, mujhe ${route.title} ke liye ${car.name} booking ka fare chahiye.`
                  )}`}
                  className="mt-4 block text-center bg-gray-900 text-white rounded-full py-2"
                >
                  Get Fare
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl border">
            <h3 className="font-bold">
              {route.from} se {route.to} taxi kaise book karein?
            </h3>
            <p className="text-gray-600 mt-2">
              Aap direct call ya WhatsApp enquiry ke through booking kar sakte
              hain.
            </p>
          </div>

          <div className="p-6 rounded-2xl border">
            <h3 className="font-bold">Kya one way taxi available hai?</h3>
            <p className="text-gray-600 mt-2">
              Haan, one way aur round trip dono booking available hai.
            </p>
          </div>

          <div className="p-6 rounded-2xl border">
            <h3 className="font-bold">Kaunsi gaadiyan available hain?</h3>
            <p className="text-gray-600 mt-2">
              Dzire, Ertiga, Innova Crysta aur Sedan available hain.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          {route.title} ke liye abhi booking enquiry karein
        </h2>
        <p className="mt-4 text-gray-300">
          Best fare aur vehicle availability ke liye direct WhatsApp karein.
        </p>

        <div className="mt-8 flex justify-center flex-wrap gap-4">
          <a
            href={`tel:${phone1}`}
            className="px-7 py-3 bg-orange-600 rounded-full font-semibold"
          >
            Call {phone1}
          </a>
          <a
            href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
              whatsappText
            )}`}
            className="px-7 py-3 bg-green-600 rounded-full font-semibold"
          >
            WhatsApp Now
          </a>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-500">
        © 2026 Khatu Rides Travels Co. | Taxi Service in Chhattisgarh
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
        <a
          href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
            whatsappText
          )}`}
          className="bg-green-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold"
        >
          WhatsApp
        </a>
        <a
          href={`tel:${phone1}`}
          className="bg-orange-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold"
        >
          Call
        </a>
      </div>
    </main>
  );
}
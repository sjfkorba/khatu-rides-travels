import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";
import TrackedCallButton from "@/components/TrackedCallButton";

const phone1 = "9244137353";
const phone2 = "8319376115";
const siteUrl = "https://khaturidescg.in";

const routeData = {
  // ==========================
  // RAIPUR ROUTES
  // ==========================

  "raipur-to-korba-taxi": {
    title: "Raipur to Korba Taxi Service",
    from: "Raipur",
    to: "Korba",
    distance: 210,
    duration: "4.5 - 5 Hours",
    fare: "₹2800 Onwards",
    description:
    "Book Raipur to Korba taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",

  },

  "korba-to-raipur-taxi": {
    title: "Korba to Raipur Taxi Service",
    from: "Korba",
    to: "Raipur",
    distance: 210,
    duration: "4.5 - 5 Hours",
    fare: "₹2800 Onwards",
    description:
    "Book Korba to Raipur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "raipur-to-bilaspur-taxi": {
    title: "Raipur to Bilaspur Taxi Service",
    from: "Raipur",
    to: "Bilaspur",
    distance: 125,
    duration: "2.5 - 3 Hours",
    fare: "₹2200 Onwards",
    description:
    "Book Raipur to Bilaspur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "bilaspur-to-raipur-taxi": {
    title: "Bilaspur to Raipur Taxi Service",
    from: "Bilaspur",
    to: "Raipur",
    distance: 125,
    duration: "2.5 - 3 Hours",
    fare: "₹2200 Onwards",
    description:
    "Book Bilaspur to Raipur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",

  },

  "raipur-to-raigarh-taxi": {
    title: "Raipur to Raigarh Taxi Service",
    from: "Raipur",
    to: "Raigarh",
    distance: 255,
    duration: "5 - 6 Hours",
    fare: "₹3500 Onwards",description:
    "Book Raipur to Raigarh taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "raigarh-to-raipur-taxi": {
    title: "Raigarh to Raipur Taxi Service",
    from: "Raigarh",
    to: "Raipur",
    distance: 255,
    duration: "5 - 6 Hours",
    fare: "₹3500 Onwards",
    description:
    "Book Raigarh to Raipur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "raipur-to-bhilai-taxi": {
    title: "Raipur to Bhilai Taxi Service",
    from: "Raipur",
    to: "Bhilai",
    distance: 35,
    duration: "45 Minutes",
    fare: "₹900 Onwards",
    description:
    "Book Raipur to Bhilai taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "bhilai-to-raipur-taxi": {
    title: "Bhilai to Raipur Taxi Service",
    from: "Bhilai",
    to: "Raipur",
    distance: 35,
    duration: "45 Minutes",
    fare: "₹900 Onwards",
    description:
    "Book Bhilai to Raipur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "raipur-to-durg-taxi": {
    title: "Raipur to Durg Taxi Service",
    from: "Raipur",
    to: "Durg",
    distance: 40,
    duration: "1 Hour",
    fare: "₹1000 Onwards",
    description:
    "Book Raipur to Durg taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "durg-to-raipur-taxi": {
    title: "Durg to Raipur Taxi Service",
    from: "Durg",
    to: "Raipur",
    distance: 40,
    duration: "1 Hour",
    fare: "₹1000 Onwards",
    description:
    "Book Durg to Raipur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "raipur-to-ambikapur-taxi": {
    title: "Raipur to Ambikapur Taxi Service",
    from: "Raipur",
    to: "Ambikapur",
    distance: 350,
    duration: "7 - 8 Hours",
    fare: "₹5000 Onwards",
    description:
     "Book Raipur to Ambikapur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares."
},

  "ambikapur-to-raipur-taxi": {
    title: "Ambikapur to Raipur Taxi Service",
    from: "Ambikapur",
    to: "Raipur",
    distance: 350,
    duration: "7 - 8 Hours",
    fare: "₹5000 Onwards",
    description:
     "Book Ambikapur to Raipur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares."
},

  "raipur-to-jagdalpur-taxi": {
    title: "Raipur to Jagdalpur Taxi Service",
    from: "Raipur",
    to: "Jagdalpur",
    distance: 300,
    duration: "6 - 7 Hours",
    fare: "₹4500 Onwards",
    description:
     "Book Raipur to Jagdalpur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "jagdalpur-to-raipur-taxi": {
    title: "Jagdalpur to Raipur Taxi Service",
    from: "Jagdalpur",
    to: "Raipur",
    distance: 300,
    duration: "6 - 7 Hours",
    fare: "₹4500 Onwards",
    description:
     "Book Jagdalpur to Raipur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  // ==========================
  // AIRPORT ROUTES
  // ==========================

  "raipur-airport-taxi": {
    title: "Raipur Airport Taxi Service",
    from: "Raipur Airport",
    to: "Chhattisgarh",
    distance: 0,
    duration: "As Per Destination",
    fare: "₹800 Onwards",
    description:
     "Book taxi from Raipur Airport for all over Chhattisgarh like Raipur intercity, Bilaspur, Durg, Bhilai, Champa, Ambikapur, Raigarh, Bhatapara, Korba, NTPC, Sipat, Katghora, Dhramjaigarh with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "raipur-airport-to-korba-taxi": {
    title: "Raipur Airport to Korba Taxi",
    from: "Raipur Airport",
    to: "Korba",
    distance: 220,
    duration: "5 Hours",
    fare: "₹3000 Onwards",
    description:
     "Book Raipur Airport to Korba taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "raipur-airport-to-bilaspur-taxi": {
    title: "Raipur Airport to Bilaspur Taxi",
    from: "Raipur Airport",
    to: "Bilaspur",
    distance: 140,
    duration: "3 Hours",
    fare: "₹2500 Onwards",
    description:
     "Book Raipur Airport to Bilaspur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "raipur-airport-to-raigarh-taxi": {
    title: "Raipur Airport to Raigarh Taxi",
    from: "Raipur Airport",
    to: "Raigarh",
    distance: 270,
    duration: "5.5 - 6 Hours",
    fare: "₹3800 Onwards",
    description:
     "Book Raipur Airport to Raigarh taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "raipur-airport-to-ambikapur-taxi": {
    title: "Raipur Airport to Ambikapur Taxi",
    from: "Raipur Airport",
    to: "Ambikapur",
    distance: 360,
    duration: "7 - 8 Hours",
    fare: "₹5200 Onwards",
    description:
     "Book Raipur Airport to Ambikapur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  // ==========================
  // KORBA LOCAL SEO
  // ==========================

  "korba-to-bilaspur-taxi": {
    title: "Korba to Bilaspur Taxi Service",
    from: "Korba",
    to: "Bilaspur",
    distance: 90,
    duration: "2 Hours",
    fare: "₹1800 Onwards",
    description:
     "Book Korba to Bilaspur taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},

  "bilaspur-to-korba-taxi": {
    title: "Bilaspur to Korba Taxi Service",
    from: "Bilaspur",
    to: "Korba",
    distance: 90,
    duration: "2 Hours",
    fare: "₹1800 Onwards",
    description:
     "Book Bilaspur to Korba taxi service with Khatu Rides Travels. One way taxi, round trip cab, airport transfer and outstation travel available with professional drivers and affordable fares.",
},
} as const;

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
  const route =
  routeData[slug as keyof typeof routeData];

  if (!route) {
    return {
      title: "Route Not Found",
    };
  }

  return {
    title: `${route.title} | Best Cab Booking in Chhattisgarh`,
    description: route.description,
    keywords: route.title,
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
  const route =
  routeData[slug as keyof typeof routeData];

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
           <TrackedCallButton
  href={`tel:${phone1}`}
  className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
>
  Call Now
</TrackedCallButton>
            <TrackedWhatsAppButton
  href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
    whatsappText
  )}`}
  className="px-4 py-2 rounded-full bg-green-600 text-white text-sm"
>
  WhatsApp
</TrackedWhatsAppButton>
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
              <TrackedCallButton
  href={`tel:${phone1}`}
  className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
>
  Call Now
</TrackedCallButton>
              <TrackedWhatsAppButton
  href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
    whatsappText
  )}`}
  className="px-4 py-2 rounded-full bg-green-600 text-white text-sm"
>
  Get Fare On WhatsApp
</TrackedWhatsAppButton>
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

              <TrackedCallButton
  href={`tel:${phone1}`}
  className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
>
  Call Now
</TrackedCallButton>
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
         <TrackedCallButton
  href={`tel:${phone1}`}
  className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
>
  Call Now
</TrackedCallButton>
          <TrackedWhatsAppButton
  href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
    whatsappText
  )}`}
  className="px-4 py-2 rounded-full bg-green-600 text-white text-sm"
>
  WhatsApp
</TrackedWhatsAppButton>
        </div>
      </section>

      {/* Floating Buttons */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
        <TrackedWhatsAppButton
  href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
    whatsappText
  )}`}
  className="px-4 py-2 rounded-full bg-green-600 text-white text-sm"
>
  WhatsApp
</TrackedWhatsAppButton>
        <TrackedCallButton
  href={`tel:${phone1}`}
  className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
>
  Call Now
</TrackedCallButton>
      </div>
    </main>
  );
}
import Link from "next/link";
import {
  Car,
  Factory,
  Building2,
  Star,
  MapPin,
  CheckCircle2,
  Phone,
} from "lucide-react";
import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";
import TrackedCallButton from "@/components/TrackedCallButton";

export const metadata = {
  title:
    "Taxi Service in Korba | Best Cab Booking in Korba | Khatu Rides Travels",
  description:
    "Book reliable taxi service in Korba for BALCO, NTPC, Gevra, Dipka, Kusmunda, airport transfer, one way taxi and outstation cab booking across Chhattisgarh.",
  keywords: [
    "Taxi Service in Korba",
    "Cab Service in Korba",
    "Korba Taxi",
    "Korba Cab Booking",
    "Korba to Raipur Taxi",
    "Airport Taxi Korba",
    "BALCO Taxi Service",
    "NTPC Taxi Service",
    "Gevra Taxi",
    "Dipka Taxi",
    "Outstation Taxi Korba",
  ],
};

const vehicles = [
  {
    name: "Dzire",
    type: "Sedan",
    price: "₹11/km se",
    image:
      "https://content.carlelo.com/media/models/Dzire/base/maruti-suzuki-dzire-1.webp",
  },
  {
    name: "Ertiga",
    type: "7 Seater",
    price: "₹14/km se",
    image:
      "https://imgd.aeplcdn.com/642x361/n/cw/ec/171147/maruti-suzuki-ertiga-left-rear-three-quarter0.jpeg?isig=0&q=75",
  },
  {
    name: "Innova Crysta",
    type: "Premium SUV",
    price: "₹18/km se",
    image:
      "https://stimg.cardekho.com/images/expert-review/select-model/20250728_160805/930x620/5_1200x67520250728_160805.jpg",
  },
];

export default function TaxiServiceInKorbaPage() {
  return (
    <main className="bg-white">
      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img
          src="https://imgd.aeplcdn.com/642x361/n/cw/ec/171147/maruti-suzuki-ertiga-left-rear-three-quarter0.jpeg?isig=0&q=75"
          alt="Taxi Service in Korba"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-sm font-bold text-orange-300">
            <Star size={16} />
            Trusted Taxi Service in Korba
          </span>

          <h1 className="mt-6 text-5xl font-black md:text-6xl">
            Best Taxi Service in Korba
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-white/80">
            Khatu Rides Travels provides reliable taxi service in Korba
            for BALCO, NTPC, Gevra, Dipka, Kusmunda, airport transfer,
            one way taxi, round trip and outstation travel.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
           <TrackedWhatsAppButton
  href="https://wa.me/919244137353"
  className="rounded-full bg-orange-600 px-8 py-4 font-black text-white"
>
  Book on WhatsApp
</TrackedWhatsAppButton>

<TrackedCallButton
  href="tel:9244137353"
  className="rounded-full border border-white/30 px-8 py-4 font-black text-white"
>
  Call Now
</TrackedCallButton>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-5 md:grid-cols-4">
          <Feature
            icon={<Factory size={28} />}
            title="Industrial Travel"
            text="BALCO, NTPC and SECL routes."
          />

          <Feature
            icon={<Car size={28} />}
            title="Outstation Taxi"
            text="One way and round trip booking."
          />

          <Feature
            icon={<Building2 size={28} />}
            title="Corporate Travel"
            text="Business and company trips."
          />

          <Feature
            icon={<Phone size={28} />}
            title="24×7 Support"
            text="Quick response and booking help."
          />
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-4xl font-black">
          Cab Booking Service in Korba
        </h2>

        <div className="mt-6 space-y-6 text-slate-700 leading-8">
          <p>
            Khatu Rides Travels offers professional taxi service in Korba
            for local rides, airport pickup-drop, railway station
            transfers and outstation travel across Chhattisgarh.
          </p>

          <p>
            We regularly provide taxi service for BALCO employees,
            NTPC visitors, industrial travel, family trips and
            business travel between Korba, Raipur, Bilaspur,
            Raigarh and Ambikapur.
          </p>

          <p>
            One way taxi booking, round trip cab service,
            airport taxi and corporate travel solutions
            are available at affordable pricing.
          </p>
        </div>
      </section>

      {/* VEHICLES */}

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-4xl font-black">
            Available Vehicles
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.name}
                className="overflow-hidden rounded-3xl border bg-white"
              >
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="text-2xl font-black">
                    {vehicle.name}
                  </h3>

                  <p className="mt-2 text-slate-600">
                    {vehicle.type}
                  </p>

                  <p className="mt-4 font-black text-orange-600">
                    {vehicle.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AREAS */}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-4xl font-black">
          Areas We Serve in Korba
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "BALCO Nagar",
            "NTPC Korba",
            "Gevra",
            "Dipka",
            "Kusmunda",
            "Darri",
            "Transport Nagar",
            "CSEB Colony",
            "Korba City",
          ].map((area) => (
            <div
              key={area}
              className="rounded-2xl border bg-white p-4 text-center font-bold"
            >
              {area}
            </div>
          ))}
        </div>
      </section>

      {/* ROUTES */}

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-black">
            Popular Taxi Routes
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <RouteCard
              href="/routes/korba-to-raipur-taxi"
              title="Korba to Raipur Taxi"
            />

            <RouteCard
              href="/routes/raipur-to-korba-taxi"
              title="Raipur to Korba Taxi"
            />

            <RouteCard
              href="/routes/raipur-airport-to-korba-taxi"
              title="Raipur Airport to Korba Taxi"
            />

            <RouteCard
              href="/services/taxi-service-in-bilaspur"
              title="Taxi Service in Bilaspur"
            />
          </div>
        </div>
      </section>

      {/* WHY US */}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-4xl font-black">
          Why Choose Khatu Rides Travels?
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            "Clean & Sanitized Vehicles",
            "Professional Drivers",
            "Affordable Pricing",
            "Airport Pickup & Drop",
            "One Way & Round Trip",
            "24×7 Customer Support",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border p-4"
            >
              <CheckCircle2 className="text-green-600" />
              <span className="font-semibold">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-4xl font-black">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-8">
            <Faq
              q="Do you provide Korba to Raipur Airport taxi service?"
              a="Yes, airport pickup and drop service is available with advance booking."
            />

            <Faq
              q="Can I book a one way taxi from Korba?"
              a="Yes, one way and round trip taxi booking both are available."
            />

            <Faq
              q="Do you provide taxi service for BALCO and NTPC?"
              a="Yes, we provide corporate and industrial travel service."
            />
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-orange-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-black">
            Need Taxi in Korba?
          </h2>

          <p className="mt-4 text-lg text-white/90">
            Call or WhatsApp now for instant cab booking.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
           <TrackedWhatsAppButton
  href="https://wa.me/919244137353"
  className="rounded-full bg-white px-8 py-4 font-black text-orange-600"
>
  WhatsApp Now
</TrackedWhatsAppButton>

<TrackedCallButton
  href="tel:9244137353"
  className="rounded-full border border-white px-8 py-4 font-black"
>
  Call 9244137353
</TrackedCallButton>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border p-6">
      <div className="text-orange-600">{icon}</div>
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mt-2 text-slate-600">{text}</p>
    </div>
  );
}

function RouteCard({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border bg-white p-5 hover:bg-slate-50"
    >
      <div className="flex items-center gap-3">
        <MapPin className="text-orange-600" />
        <span className="font-bold">{title}</span>
      </div>
    </Link>
  );
}

function Faq({
  q,
  a,
}: {
  q: string;
  a: string;
}) {
  return (
    <div>
      <h3 className="text-xl font-black">{q}</h3>
      <p className="mt-2 text-slate-600">{a}</p>
    </div>
  );
}
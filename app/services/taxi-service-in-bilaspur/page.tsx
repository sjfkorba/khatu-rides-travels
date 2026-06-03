import Link from "next/link";
import {
  Car,
  Plane,
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  Building2,
} from "lucide-react";
import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";
import TrackedCallButton from "@/components/TrackedCallButton";


export const metadata = {
  title:
    "Taxi Service in Bilaspur | Best Cab Booking in Bilaspur | Khatu Rides Travels",
  description:
    "Book reliable taxi service in Bilaspur for airport transfer, railway station pickup, one way taxi, round trip cab and outstation travel across Chhattisgarh.",
  keywords: [
    "Taxi Service in Bilaspur",
    "Cab Service in Bilaspur",
    "Best Taxi in Bilaspur",
    "Bilaspur Cab Booking",
    "Bilaspur Taxi",
    "Bilaspur Airport Taxi",
    "Bilaspur to Raipur Taxi",
    "Outstation Taxi Bilaspur",
    "One Way Taxi Bilaspur",
    "Cab Booking Bilaspur",
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

export default function TaxiServiceInBilaspurPage() {
  return (
    <main className="bg-white">
      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img
          src="https://imgd.aeplcdn.com/642x361/n/cw/ec/171147/maruti-suzuki-ertiga-left-rear-three-quarter0.jpeg?isig=0&q=75"
          alt="Taxi Service in Bilaspur"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-sm font-bold text-orange-300">
            <Star size={16} />
            Trusted Taxi Service in Bilaspur
          </span>

          <h1 className="mt-6 text-5xl font-black md:text-6xl">
            Best Taxi Service in Bilaspur
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-white/80">
            Khatu Rides Travels provides reliable taxi service in Bilaspur
            for airport transfers, railway station pickup, one way taxi,
            round trip booking and outstation travel across Chhattisgarh.
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
            icon={<Plane size={28} />}
            title="Airport Taxi"
            text="Airport pickup and drop service."
          />

          <Feature
            icon={<Car size={28} />}
            title="Outstation Cab"
            text="One way and round trip booking."
          />

          <Feature
            icon={<Building2 size={28} />}
            title="Corporate Travel"
            text="Business and office travel."
          />

          <Feature
            icon={<Phone size={28} />}
            title="24×7 Support"
            text="Instant booking assistance."
          />
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-4xl font-black">
          Cab Booking Service in Bilaspur
        </h2>

        <div className="mt-6 space-y-6 text-slate-700 leading-8">
          <p>
            Khatu Rides Travels provides comfortable and affordable
            taxi service in Bilaspur for local rides, railway station
            pickup, airport transfers and outstation travel.
          </p>

          <p>
            We regularly serve customers travelling between Bilaspur,
            Raipur, Korba, Raigarh, Ambikapur and Jagdalpur.
          </p>

          <p>
            Whether you need a one way taxi, round trip cab,
            family travel vehicle or corporate transportation,
            we provide professional and reliable service.
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

      {/* ROUTES */}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-4xl font-black">
          Popular Taxi Routes
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <RouteCard
            href="/routes/raipur-to-bilaspur-taxi"
            title="Raipur to Bilaspur Taxi"
          />

          <RouteCard
            href="/routes/raipur-airport-to-bilaspur-taxi"
            title="Raipur Airport to Bilaspur Taxi"
          />

          <RouteCard
            href="/routes/raipur-to-korba-taxi"
            title="Bilaspur to Korba Taxi"
          />

          <RouteCard
            href="/routes/raipur-to-raigarh-taxi"
            title="Bilaspur to Raigarh Taxi"
          />
        </div>
      </section>

      {/* AREAS */}

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-black">
            Areas We Serve in Bilaspur
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Vyapar Vihar",
              "Sarkanda",
              "Mangla",
              "Tifra",
              "Link Road",
              "Bus Stand Area",
              "Railway Station",
              "High Court Road",
              "Bilasa Airport Area",
            ].map((area) => (
              <div
                key={area}
                className="rounded-2xl border bg-white p-4 text-center font-bold"
              >
                {area}
              </div>
            ))}
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
              q="Do you provide Bilaspur Airport taxi service?"
              a="Yes, airport pickup and drop service is available with advance booking."
            />

            <Faq
              q="Can I book one way taxi from Bilaspur?"
              a="Yes, one way and round trip taxi booking both are available."
            />

            <Faq
              q="Do you provide outstation cab service?"
              a="Yes, Raipur, Korba, Raigarh, Ambikapur and Jagdalpur routes are available."
            />
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-orange-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-black">
            Need Taxi in Bilaspur?
          </h2>

          <p className="mt-4 text-lg text-white/90">
            Contact Khatu Rides Travels for instant booking.
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
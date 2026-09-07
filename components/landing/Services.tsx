import { SERVICES } from "./data";
import { PHONE, WHATSAPP } from "./data";
import Icon from "./Icons";

const SERVICE_DETAILS = [
  {
    icon: "route",
    eyebrow: "CITY TO CITY",
    title: "One Way Cab Service",
    seoTitle: "Reliable One Way Taxi Across Chhattisgarh",
    description:
      "Travel from one city to another with a comfortable cab and professional driver. Ideal for travellers who need a simple point-to-point journey without an unnecessary return booking.",
    benefits: [
      "City-to-city travel",
      "Comfortable AC cabs",
      "Professional drivers",
    ],
    accent: "yellow",
    featured: true,
    href: "#routes",
  },
  {
    icon: "route",
    eyebrow: "OUTSTATION TRAVEL",
    title: "Round Trip Cab",
    seoTitle: "Comfortable Round Trip & Outstation Cabs",
    description:
      "Plan family trips, business travel or multi-day journeys with a dedicated vehicle and driver for your complete travel schedule.",
    benefits: [
      "Dedicated vehicle",
      "Flexible travel plans",
      "Family-friendly options",
    ],
    accent: "orange",
    featured: false,
    href: "#fleet",
  },
  {
    icon: "plane",
    eyebrow: "RAIPUR AIRPORT",
    title: "Airport Taxi",
    seoTitle: "Raipur Airport Pickup & Drop",
    description:
      "Book a reliable airport taxi for pickup and drop between Raipur Airport and Raipur, Bhilai, Durg, Bilaspur, Korba and nearby destinations.",
    benefits: [
      "Scheduled pickup",
      "Airport transfer",
      "Flight-friendly coordination",
    ],
    accent: "blue",
    featured: false,
    href: "#airport",
  },
  {
    icon: "car",
    eyebrow: "CITY TRAVEL",
    title: "Local Cab Rental",
    seoTitle: "Local Cab & Car Rental Service",
    description:
      "Need a cab for meetings, sightseeing, shopping, personal work or a full-day city schedule? Choose a practical local cab option.",
    benefits: [
      "Hourly & local use",
      "Business travel",
      "City sightseeing",
    ],
    accent: "purple",
    featured: false,
    href: "#contact",
  },
  {
    icon: "temple",
    eyebrow: "SPIRITUAL TRAVEL",
    title: "Tour & Pilgrimage Cabs",
    seoTitle: "Spiritual & Pilgrimage Tour Packages",
    description:
      "Travel comfortably to popular spiritual destinations including Khatu Shyam, Ujjain, Ayodhya, Prayagraj, Varanasi and Puri.",
    benefits: [
      "Family pilgrimage travel",
      "Multi-day journeys",
      "Comfortable vehicles",
    ],
    accent: "red",
    featured: false,
    href: "#tours",
  },
  {
    icon: "driver",
    eyebrow: "BUSINESS TRAVEL",
    title: "Corporate Travel",
    seoTitle: "Corporate Cab & Business Travel",
    description:
      "Dependable transportation for employees, clients, meetings, hotels, airport transfers and business travel requirements.",
    benefits: [
      "Client transportation",
      "Employee travel",
      "Airport coordination",
    ],
    accent: "green",
    featured: false,
    href: "#contact",
  },
];

const accentClasses: Record<
  string,
  {
    icon: string;
    badge: string;
    button: string;
    soft: string;
  }
> = {
  yellow: {
    icon: "bg-amber-100 text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    button: "bg-amber-400 hover:bg-amber-300",
    soft: "bg-amber-50",
  },
  orange: {
    icon: "bg-orange-100 text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    button: "bg-orange-500 hover:bg-orange-400",
    soft: "bg-orange-50",
  },
  blue: {
    icon: "bg-blue-100 text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    button: "bg-blue-600 hover:bg-blue-500",
    soft: "bg-blue-50",
  },
  purple: {
    icon: "bg-purple-100 text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    button: "bg-purple-600 hover:bg-purple-500",
    soft: "bg-purple-50",
  },
  red: {
    icon: "bg-red-100 text-red-600",
    badge: "bg-red-100 text-red-700",
    button: "bg-red-600 hover:bg-red-500",
    soft: "bg-red-50",
  },
  green: {
    icon: "bg-emerald-100 text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    button: "bg-emerald-600 hover:bg-emerald-500",
    soft: "bg-emerald-50",
  },
};

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative overflow-hidden bg-[#F7F9FC] py-14 sm:py-20"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[360px] w-[360px] rounded-full bg-amber-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[400px] w-[400px] rounded-full bg-orange-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-[1350px] px-4 sm:px-6">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[9px] font-black uppercase tracking-[0.22em] text-amber-700">
            Our Cab & Travel Services
          </span>

          <h2
            id="services-heading"
            className="mt-4 text-3xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            One Travel Partner.
            <span className="block text-amber-500">
              Every Journey Covered.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px] sm:leading-7">
            From a quick city transfer to a long-distance outstation journey,
            airport pickup, family holiday or spiritual tour, Khatu Rides
            provides practical cab and travel solutions designed around your
            journey.
          </p>

          {/* Quick trust indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              "✓ Professional Drivers",
              "✓ Clean AC Vehicles",
              "✓ 24×7 Support",
              "✓ Chhattisgarh Routes",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[9px] font-bold text-slate-600 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* =====================================================
            FEATURED SERVICE
        ===================================================== */}
        <div className="mt-10">

          {SERVICE_DETAILS
            .filter((service) => service.featured)
            .map((service) => {
              const colors = accentClasses[service.accent];

              return (
                <article
                  key={service.title}
                  className="relative overflow-hidden rounded-[30px] border border-amber-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,.08)]"
                >
                  <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-amber-100/50 blur-3xl" />

                  <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:p-10">

                    {/* LEFT */}
                    <div>

                      <div className="flex items-center gap-4">

                        <div
                          className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[22px] ${colors.icon} shadow-sm`}
                        >
                          <Icon
                            name={service.icon as any}
                            size={34}
                            strokeWidth={2}
                          />
                        </div>

                        <div>
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[.16em] ${colors.badge}`}
                          >
                            Most Popular
                          </span>

                          <span className="mt-1 block text-[9px] font-black uppercase tracking-[.16em] text-slate-400">
                            {service.eyebrow}
                          </span>
                        </div>
                      </div>

                      <h3 className="mt-6 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
                        {service.title}
                      </h3>

                      <p className="mt-1 text-sm font-bold text-amber-600 sm:text-base">
                        {service.seoTitle}
                      </p>

                      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-[15px]">
                        {service.description}
                      </p>

                      <div className="mt-5 grid gap-2 sm:grid-cols-3">
                        {service.benefits.map((benefit) => (
                          <div
                            key={benefit}
                            className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-[10px] font-bold text-slate-600"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[9px] font-black text-amber-700">
                              ✓
                            </span>
                            {benefit}
                          </div>
                        ))}
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">

                        <a
                          href={`tel:${PHONE}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-[0_8px_22px_rgba(251,191,36,.25)] transition hover:-translate-y-0.5 hover:bg-amber-300"
                        >
                          <Icon name="phone" size={15} />
                          Call For Booking
                        </a>

                        <a
                          href={`https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20one-way%20cab.`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100"
                        >
                          <Icon name="whatsapp" size={16} />
                          WhatsApp Us
                        </a>

                      </div>
                    </div>

                    {/* RIGHT VISUAL */}
                    <div className="relative min-h-[230px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#061B32] to-[#0A3555] p-6 text-white sm:min-h-[280px]">

                      <div className="absolute right-[-50px] top-[-60px] h-48 w-48 rounded-full bg-amber-400/15 blur-3xl" />

                      <div className="relative flex h-full flex-col justify-between">

                        <div className="flex items-start justify-between">
                          <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-300">
                            Why One Way?
                          </span>

                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                            <Icon name="route" size={17} />
                          </span>
                        </div>

                        <div className="mt-8">
                          <div className="text-5xl font-black tracking-tight text-white">
                            Easy
                          </div>

                          <div className="text-5xl font-black tracking-tight text-amber-300">
                            Point-to-Point
                          </div>

                          <p className="mt-3 max-w-sm text-[11px] leading-5 text-white/55">
                            Ideal for Raipur ↔ Korba, Raipur ↔ Bilaspur,
                            Korba ↔ Bilaspur and other popular Chhattisgarh
                            travel routes.
                          </p>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {[
                            "Raipur",
                            "Bilaspur",
                            "Korba",
                            "Durg",
                            "Bhilai",
                          ].map((city) => (
                            <span
                              key={city}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] font-bold text-white/70"
                            >
                              {city}
                            </span>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>

        {/* =====================================================
            OTHER SERVICES
        ===================================================== */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {SERVICE_DETAILS.filter(
            (service) => !service.featured
          ).map((service, index) => {
            const colors = accentClasses[service.accent];

            return (
              <article
                key={service.title}
                className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_7px_25px_rgba(15,23,42,.045)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,.10)]"
              >

                {/* Card number */}
                <span className="absolute right-5 top-5 text-5xl font-black tracking-tighter text-slate-100 transition group-hover:text-slate-200">
                  {String(index + 2).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div
                  className={`relative flex h-[64px] w-[64px] items-center justify-center rounded-[20px] ${colors.icon} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon
                    name={service.icon as any}
                    size={29}
                    strokeWidth={2}
                  />
                </div>

                {/* Eyebrow */}
                <span
                  className={`mt-5 inline-flex rounded-full px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[.16em] ${colors.badge}`}
                >
                  {service.eyebrow}
                </span>

                {/* Title */}
                <h3 className="mt-3 text-xl font-black leading-tight tracking-tight text-slate-950">
                  {service.title}
                </h3>

                {/* SEO title */}
                <p className="mt-1 text-[11px] font-bold text-amber-600">
                  {service.seoTitle}
                </p>

                {/* Description */}
                <p className="mt-3 text-[12px] leading-5 text-slate-500">
                  {service.description}
                </p>

                {/* Benefits */}
                <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  {service.benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-2 text-[10px] font-bold text-slate-600"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] text-emerald-600">
                        ✓
                      </span>

                      {benefit}
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">

                  <a
                    href={service.href}
                    className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-[9px] font-black uppercase tracking-wider text-white transition ${colors.button}`}
                  >
                    Explore Service
                    <Icon name="arrow" size={13} />
                  </a>

                  <a
                    href={`tel:${PHONE}`}
                    aria-label={`Call for ${service.title}`}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600"
                  >
                    <Icon name="phone" size={15} />
                  </a>

                </div>
              </article>
            );
          })}
        </div>

        {/* =====================================================
            SEO CONTENT + CTA
        ===================================================== */}
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">

          {/* SEO TEXT */}
          <div className="rounded-[26px] border border-slate-200 bg-white p-6 sm:p-8">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              Local & Outstation Cab Service
            </span>

            <h3 className="mt-3 text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl">
              Cab Services Designed for
              <span className="text-amber-500">
                {" "}Chhattisgarh Travellers
              </span>
            </h3>

            <p className="mt-4 text-[12px] leading-6 text-slate-500 sm:text-sm sm:leading-7">
              Khatu Rides Travels offers cab services for local and outstation
              travel across Chhattisgarh. Whether you are searching for a
              reliable{" "}
              <strong className="font-black text-slate-700">
                Raipur cab service
              </strong>
              ,{" "}
              <strong className="font-black text-slate-700">
                Bilaspur taxi
              </strong>
              ,{" "}
              <strong className="font-black text-slate-700">
                Korba cab
              </strong>
              ,{" "}
              <strong className="font-black text-slate-700">
                Durg or Bhilai cab service
              </strong>
              , we provide practical travel options for different journey
              requirements.
            </p>

            <p className="mt-3 text-[12px] leading-6 text-slate-500 sm:text-sm sm:leading-7">
              Our services also cover{" "}
              <strong className="font-black text-slate-700">
                Raipur Airport taxi
              </strong>
              , one-way cabs, round-trip taxis, local rentals, outstation
              journeys and spiritual travel to popular destinations such as
              Khatu Shyam, Ujjain, Ayodhya, Prayagraj, Varanasi and Puri.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Raipur Cab",
                "Bilaspur Taxi",
                "Korba Cab",
                "Durg Taxi",
                "Bhilai Cab",
                "Airport Taxi",
                "One Way Cab",
                "Outstation Taxi",
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-slate-50 px-3 py-2 text-[9px] font-bold text-slate-500"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* QUICK CTA */}
          <div className="relative overflow-hidden rounded-[26px] bg-[#061B32] p-6 text-white sm:p-8">

            <div className="absolute right-[-60px] top-[-60px] h-48 w-48 rounded-full bg-amber-400/15 blur-3xl" />

            <div className="relative">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
                <Icon name="phone" size={22} />
              </div>

              <h3 className="mt-5 text-2xl font-black leading-tight">
                Not Sure Which
                <span className="block text-amber-300">
                  Cab You Need?
                </span>
              </h3>

              <p className="mt-3 text-[11px] leading-5 text-white/55">
                Tell us your route, date and travel requirement. Our team can
                help you choose a suitable vehicle and service.
              </p>

              <div className="mt-6 grid gap-2">

                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-[10px] font-black uppercase tracking-wider text-slate-950 transition hover:bg-amber-300"
                >
                  <Icon name="phone" size={15} />
                  Call {PHONE.replace("+91", "")}
                </a>

                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20need%20help%20choosing%20a%20cab.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3.5 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-white/10"
                >
                  <Icon name="whatsapp" size={16} />
                  Ask on WhatsApp
                </a>

              </div>

              <div className="mt-5 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-[9px] font-bold text-white/40">
                <Icon name="clock" size={13} />
                24×7 Customer Support
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
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
    button: "bg-amber-400 hover:bg-amber-300 text-slate-900",
    soft: "bg-amber-50",
  },
  orange: {
    icon: "bg-orange-100 text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    button: "bg-orange-500 hover:bg-orange-400 text-white",
    soft: "bg-orange-50",
  },
  blue: {
    icon: "bg-blue-100 text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    button: "bg-blue-600 hover:bg-blue-500 text-white",
    soft: "bg-blue-50",
  },
  purple: {
    icon: "bg-purple-100 text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    button: "bg-purple-600 hover:bg-purple-500 text-white",
    soft: "bg-purple-50",
  },
  red: {
    icon: "bg-red-100 text-red-600",
    badge: "bg-red-100 text-red-700",
    button: "bg-red-600 hover:bg-red-500 text-white",
    soft: "bg-red-50",
  },
  green: {
    icon: "bg-emerald-100 text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
    soft: "bg-emerald-50",
  },
};

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative overflow-hidden bg-[#F7F9FC] py-16 sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-amber-200/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[500px] w-[500px] rounded-full bg-orange-200/30 blur-[120px]" />

      <div className="relative mx-auto max-w-[1350px] px-4 sm:px-6">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100/50 px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-amber-800 shadow-sm backdrop-blur-sm">
            Our Cab & Travel Services
          </span>

          <h2
            id="services-heading"
            className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            One Travel Partner.
            <span className="block mt-2 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent drop-shadow-sm">
              Every Journey Covered.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
            From a quick city transfer to a long-distance outstation journey,
            airport pickup, family holiday or spiritual tour, Khatu Rides
            provides practical cab and travel solutions designed around your
            journey.
          </p>

          {/* Quick trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              "✓ Professional Drivers",
              "✓ Clean AC Vehicles",
              "✓ 24×7 Support",
              "✓ Chhattisgarh Routes",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* =====================================================
            FEATURED SERVICE - Big Glass Card
        ===================================================== */}
        <div className="mt-14">

          {SERVICE_DETAILS
            .filter((service) => service.featured)
            .map((service) => {
              const colors = accentClasses[service.accent];

              return (
                <article
                  key={service.title}
                  className="relative overflow-hidden rounded-[40px] border border-amber-200/50 bg-white shadow-[0_20px_60px_rgba(15,23,42,.08)] transition-all duration-500 hover:shadow-[0_30px_80px_rgba(15,23,42,.12)] group"
                >
                  <div className="absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-amber-100/60 blur-[80px] transition-transform duration-700 group-hover:scale-150" />

                  <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-16">

                    {/* LEFT CONTENT */}
                    <div className="relative z-10">

                      <div className="flex items-center gap-5">

                        <div
                          className={`flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-[24px] ${colors.icon} shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}
                        >
                          <Icon
                            name={service.icon as any}
                            size={40}
                            strokeWidth={1.8}
                          />
                        </div>

                        <div>
                          <span
                            className={`inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] shadow-sm ${colors.badge}`}
                          >
                            Most Popular
                          </span>

                          <span className="mt-2 block text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                            {service.eyebrow}
                          </span>
                        </div>
                      </div>

                      <h3 className="mt-8 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
                        {service.title}
                      </h3>

                      <p className="mt-3 text-base font-bold text-amber-600 sm:text-lg">
                        {service.seoTitle}
                      </p>

                      <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                        {service.description}
                      </p>

                      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {service.benefits.map((benefit) => (
                          <div
                            key={benefit}
                            className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-xs sm:text-sm font-bold text-slate-700 shadow-sm border border-slate-100"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-inner">
                              {/* Replaced Icon with SVG Check */}
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            {benefit}
                          </div>
                        ))}
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                        <a
                          href={`tel:${PHONE}`}
                          className="group/btn inline-flex items-center justify-center gap-3 rounded-2xl bg-amber-400 px-8 py-5 text-sm sm:text-base font-black uppercase tracking-widest text-slate-900 shadow-[0_15px_30px_rgba(251,191,36,.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-[0_20px_40px_rgba(251,191,36,.4)] active:scale-95"
                        >
                          <span className="transition-transform group-hover/btn:scale-110">
                            <Icon name="phone" size={20} />
                          </span>
                          Call For Booking
                        </a>

                        <a
                          href={`https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20a%20one-way%20cab.`}
                          target="_blank"
                          rel="noreferrer"
                          className="group/btn inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-8 py-5 text-sm sm:text-base font-black uppercase tracking-widest text-emerald-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-100 hover:shadow-md active:scale-95"
                        >
                          <span className="transition-transform group-hover/btn:scale-110">
                            <Icon name="whatsapp" size={22} />
                          </span>
                          WhatsApp Us
                        </a>

                      </div>
                    </div>

                    {/* RIGHT VISUAL - Modern Data Card Look */}
                    <div className="relative min-h-[300px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#061B32] to-[#0A3555] p-8 text-white shadow-2xl sm:min-h-[350px] lg:h-full lg:min-h-[400px]">

                      <div className="absolute right-[-20%] top-[-20%] h-[300px] w-[300px] rounded-full bg-amber-400/20 blur-[80px]" />

                      <div className="relative z-10 flex h-full flex-col justify-between">

                        <div className="flex items-start justify-between">
                          <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                            Why One Way?
                          </span>

                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-inner">
                            <Icon name="route" size={24} />
                          </span>
                        </div>

                        <div className="mt-12">
                          <div className="text-6xl font-black tracking-tight text-white drop-shadow-md">
                            Easy
                          </div>
                          <div className="text-5xl font-black tracking-tight text-amber-300 drop-shadow-md mt-1">
                            Point-to-Point
                          </div>

                          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70 font-medium">
                            Ideal for Raipur ↔ Korba, Raipur ↔ Bilaspur,
                            Korba ↔ Bilaspur and other popular Chhattisgarh
                            travel routes.
                          </p>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3">
                          {[
                            "Raipur", "Bilaspur", "Korba", "Durg", "Bhilai",
                          ].map((city) => (
                            <span
                              key={city}
                              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white shadow-sm backdrop-blur-md transition-colors hover:bg-white/20 hover:border-white/30"
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
            OTHER SERVICES - Grid Cards
        ===================================================== */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {SERVICE_DETAILS.filter(
            (service) => !service.featured
          ).map((service, index) => {
            const colors = accentClasses[service.accent];

            return (
              <article
                key={service.title}
                className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,.05)] transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_25px_50px_rgba(15,23,42,.12)]"
              >

                {/* Card number watermark */}
                <span className="absolute right-6 top-6 text-7xl font-black tracking-tighter text-slate-50 transition-colors duration-500 group-hover:text-slate-100 select-none pointer-events-none">
                  {String(index + 2).padStart(2, "0")}
                </span>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`flex h-[80px] w-[80px] items-center justify-center rounded-[24px] ${colors.icon} shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md`}
                  >
                    <Icon
                      name={service.icon as any}
                      size={36}
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Eyebrow */}
                  <span
                    className={`mt-8 inline-flex rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[.16em] shadow-sm ${colors.badge}`}
                  >
                    {service.eyebrow}
                  </span>

                  {/* Title */}
                  <h3 className="mt-4 text-2xl sm:text-3xl font-black leading-tight tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
                    {service.title}
                  </h3>

                  {/* SEO title */}
                  <p className={`mt-2 text-sm font-bold ${colors.icon.split(' ')[1]}`}>
                    {service.seoTitle}
                  </p>

                  {/* Description */}
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
                    {service.description}
                  </p>

                  {/* Benefits */}
                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                    {service.benefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="flex items-center gap-3 text-sm font-bold text-slate-700"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] text-emerald-600 shadow-inner">
                          {/* Replaced Icon with SVG Check */}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                        </span>
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="mt-8 grid grid-cols-[1fr_auto] gap-3">
                    <a
                      href={service.href}
                      className={`flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 ${colors.button}`}
                    >
                      Explore Service
                      <Icon name="arrow" size={16} />
                    </a>

                    <a
                      href={`tel:${PHONE}`}
                      aria-label={`Call for ${service.title}`}
                      className="group/call flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 hover:shadow-md active:scale-95"
                    >
                      <span className="transition-transform group-hover/call:scale-110">
                        <Icon name="phone" size={20} />
                      </span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* =====================================================
            SEO CONTENT + CTA
        ===================================================== */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">

          {/* SEO TEXT - Clean White Card */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 sm:p-12 shadow-[0_10px_30px_rgba(15,23,42,.03)]">

            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-amber-600">
              Local & Outstation Cab Service
            </span>

            <h3 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Cab Services Designed for
              <span className="text-amber-500">
                {" "}Chhattisgarh Travellers
              </span>
            </h3>

            <div className="mt-6 space-y-5">
              <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                Khatu Rides Travels offers premium cab services for local and outstation travel across Chhattisgarh. Whether you are searching for a reliable{" "}
                <strong className="font-black text-slate-800">Raipur cab service</strong>,{" "}
                <strong className="font-black text-slate-800">Bilaspur taxi</strong>,{" "}
                <strong className="font-black text-slate-800">Korba cab</strong>, or{" "}
                <strong className="font-black text-slate-800">Durg/Bhilai cab service</strong>, 
                we provide practical and comfortable travel options for all journey requirements.
              </p>

              <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                Our extensive services also cover <strong className="font-black text-slate-800">Raipur Airport taxi</strong>, one-way cabs, round-trip taxis, local city rentals, outstation journeys, and spiritual travel to popular destinations such as Khatu Shyam, Ujjain, Ayodhya, Prayagraj, Varanasi and Puri.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Raipur Cab", "Bilaspur Taxi", "Korba Cab", "Durg Taxi", 
                "Bhilai Cab", "Airport Taxi", "One Way Cab", "Outstation Taxi",
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-slate-100 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* QUICK CTA - Deep App Card */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#061B32] to-[#0A3555] p-8 text-white shadow-2xl sm:p-12">

            <div className="absolute right-[-20%] top-[-20%] h-[300px] w-[300px] rounded-full bg-amber-400/20 blur-[80px]" />

            <div className="relative z-10 flex h-full flex-col justify-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 shadow-[0_10px_20px_rgba(251,191,36,0.3)]">
                <Icon name="phone" size={28} />
              </div>

              <h3 className="mt-8 text-3xl sm:text-4xl font-black leading-tight tracking-tight">
                Not Sure Which
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                  Cab You Need?
                </span>
              </h3>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/70">
                Tell us your route, date and travel requirement. Our team will help you choose the most suitable vehicle and service plan.
              </p>

              <div className="mt-8 flex flex-col gap-4">

                <a
                  href={`tel:${PHONE}`}
                  className="group flex items-center justify-center gap-3 rounded-2xl bg-amber-400 py-5 text-sm sm:text-base font-black uppercase tracking-widest text-slate-900 shadow-[0_10px_30px_rgba(251,191,36,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-[0_15px_40px_rgba(251,191,36,0.3)] active:scale-95"
                >
                  <span className="transition-transform group-hover:scale-110">
                    <Icon name="phone" size={20} />
                  </span>
                  Call {PHONE.replace("+91", "")}
                </a>

                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20need%20help%20choosing%20a%20cab.`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md py-5 text-sm sm:text-base font-black uppercase tracking-widest text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:border-white/30 active:scale-95"
                >
                  <span className="transition-transform group-hover:scale-110">
                    <Icon name="whatsapp" size={22} />
                  </span>
                  Ask on WhatsApp
                </a>

              </div>

              <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/10 pt-6 text-xs sm:text-sm font-bold text-white/60">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                  <Icon name="clock" size={12} />
                </span>
                24×7 Customer Support Available
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
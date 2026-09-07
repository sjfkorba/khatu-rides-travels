import Icon from "./Icons";

const AIRPORT_PHONE = "9244137353";
const AIRPORT_WHATSAPP = "919244137353";

const airportServices = [
  {
    icon: "plane",
    title: "Airport Pickup",
    description:
      "Arriving at Raipur Airport? Pre-book a comfortable cab for a smooth transfer to your home, hotel, office or next destination.",
  },
  {
    icon: "route",
    title: "Airport Drop",
    description:
      "Schedule a cab from Raipur, Bhilai, Durg, Bilaspur, Korba and nearby areas for a convenient airport drop.",
  },
  {
    icon: "car",
    title: "Airport + Outstation",
    description:
      "Need to continue your journey outside Raipur? Travel directly from the airport to your preferred Chhattisgarh destination.",
  },
];

const airportRoutes = [
  "Raipur Airport → Raipur",
  "Raipur Airport → Bhilai",
  "Raipur Airport → Durg",
  "Raipur Airport → Bilaspur",
  "Raipur Airport → Korba",
  "Raipur Airport → Nearby Cities",
];

const benefits = [
  ["clock", "Scheduled Pickup", "Plan your airport transfer around your flight schedule."],
  ["car", "Clean AC Cabs", "Comfortable vehicles for individuals and families."],
  ["driver", "Professional Drivers", "Experienced drivers focused on smooth travel."],
  ["shield", "Travel Assistance", "Easy coordination before and during your journey."],
];

export default function AirportSection() {
  return (
    <section
      id="airport"
      aria-labelledby="airport-heading"
      className="relative overflow-hidden bg-[#061B32] py-14 text-white sm:py-20"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-180px] top-[-160px] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-[-150px] bottom-[-160px] h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-3xl" />

        <div className="absolute inset-0 opacity-[0.035]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "38px 38px",
            }}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1350px] px-4 sm:px-6">

        {/* =====================================================
            MAIN HERO CARD
        ===================================================== */}

        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0A2D4C] via-[#082641] to-[#061B32] shadow-[0_25px_80px_rgba(0,0,0,.25)]">

          {/* decorative circles */}
          <div className="pointer-events-none absolute right-[-100px] top-[-120px] h-[360px] w-[360px] rounded-full border border-white/5" />
          <div className="pointer-events-none absolute right-[-45px] top-[-65px] h-[250px] w-[250px] rounded-full border border-white/5" />

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_.85fr] lg:p-12">

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="relative">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3.5 py-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                  <Icon name="plane" size={11} />
                </span>

                <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-300">
                  Airport Transfer Service
                </span>
              </div>

              {/* Heading */}
              <h2
                id="airport-heading"
                className="mt-5 max-w-3xl text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl"
              >
                Raipur Airport Taxi
                <span className="block text-amber-300">
                  On Time. Comfortable. Reliable.
                </span>
              </h2>

              {/* SEO subheading */}
              <p className="mt-3 text-sm font-bold text-white/80 sm:text-base">
                Reliable Raipur Airport Pickup & Drop Cab Service
              </p>

              {/* Description */}
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-[15px]">
                Book a comfortable airport taxi for pickup and drop between
                Swami Vivekananda Airport, Raipur and major destinations across
                Chhattisgarh. Ideal for families, business travellers,
                tourists and passengers with scheduled flights.
              </p>

              {/* CTA */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <a
                  href={`tel:+91${AIRPORT_PHONE}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-[0_10px_30px_rgba(251,191,36,.25)] transition hover:-translate-y-0.5 hover:bg-amber-300"
                >
                  <Icon name="phone" size={16} />
                  Call For Airport Taxi
                </a>

                <a
                  href={`https://wa.me/${AIRPORT_WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20need%20a%20Raipur%20Airport%20taxi.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-6 py-4 text-[10px] font-black uppercase tracking-wider text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-500/20"
                >
                  <Icon name="whatsapp" size={17} />
                  WhatsApp Booking
                </a>

              </div>

              {/* Trust points */}
              <div className="mt-7 grid gap-2 border-t border-white/10 pt-6 sm:grid-cols-3">

                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-amber-300">
                    <Icon name="clock" size={14} />
                  </span>

                  <div>
                    <b className="block text-[10px] font-black">
                      Flight Friendly
                    </b>
                    <span className="text-[8px] text-white/40">
                      Scheduled coordination
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-amber-300">
                    <Icon name="car" size={14} />
                  </span>

                  <div>
                    <b className="block text-[10px] font-black">
                      AC Vehicles
                    </b>
                    <span className="text-[8px] text-white/40">
                      Comfortable travel
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-amber-300">
                    <Icon name="driver" size={14} />
                  </span>

                  <div>
                    <b className="block text-[10px] font-black">
                      Professional Drivers
                    </b>
                    <span className="text-[8px] text-white/40">
                      Reliable service
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* =================================================
                RIGHT VISUAL
            ================================================= */}

            <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-6">

              {/* Airport graphic */}
              <div className="absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-3xl" />
              </div>

              <div className="relative z-10 w-full">

                {/* Main icon */}
                <div className="mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-[32px] border border-amber-300/20 bg-amber-400/10 text-amber-300 shadow-[0_20px_50px_rgba(251,191,36,.08)]">
                  <Icon name="plane" size={50} strokeWidth={1.6} />
                </div>

                <div className="mt-6 text-center">
                  <span className="text-[9px] font-black uppercase tracking-[.22em] text-amber-300">
                    Airport Transfer
                  </span>

                  <div className="mt-2 text-2xl font-black tracking-tight text-white">
                    Raipur Airport
                  </div>

                  <p className="mt-1 text-[10px] text-white/45">
                    Swami Vivekananda Airport
                  </p>
                </div>

                {/* Route visual */}
                <div className="mx-auto mt-7 flex max-w-[310px] items-center gap-2">

                  <div className="flex-1 text-right">
                    <span className="block text-[9px] font-black uppercase text-white/40">
                      Pickup
                    </span>
                    <span className="text-xs font-black text-white">
                      Airport
                    </span>
                  </div>

                  <div className="relative flex h-9 w-20 items-center">
                    <div className="h-px w-full bg-white/15" />

                    <span className="absolute left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                      <Icon name="car" size={13} />
                    </span>
                  </div>

                  <div>
                    <span className="block text-[9px] font-black uppercase text-white/40">
                      Drop
                    </span>
                    <span className="text-xs font-black text-white">
                      Destination
                    </span>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SERVICE OPTIONS
        ===================================================== */}

        <div className="mt-5 grid gap-3 md:grid-cols-3">

          {airportServices.map((service) => (
            <article
              key={service.title}
              className="group rounded-[22px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 transition group-hover:bg-amber-400 group-hover:text-slate-950">
                  <Icon name={service.icon as any} size={23} />
                </div>

                <div>
                  <h3 className="text-base font-black text-white">
                    {service.title}
                  </h3>

                  <p className="mt-1.5 text-[10px] leading-5 text-white/45">
                    {service.description}
                  </p>
                </div>

              </div>
            </article>
          ))}

        </div>

        {/* =====================================================
            ROUTES + BENEFITS
        ===================================================== */}

        <div className="mt-5 grid gap-5 lg:grid-cols-[.85fr_1.15fr]">

          {/* Routes */}
          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-6 sm:p-7">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-300">
              Airport Cab Routes
            </span>

            <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
              Popular Raipur Airport Transfers
            </h3>

            <p className="mt-2 text-[11px] leading-5 text-white/40">
              Airport taxi options for major cities and travel destinations
              around Raipur.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {airportRoutes.map((route) => (
                <div
                  key={route}
                  className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.035] px-3 py-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
                    <Icon name="route" size={11} />
                  </span>

                  <span className="text-[9px] font-bold text-white/65">
                    {route}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-6 sm:p-7">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-emerald-300">
              Why Choose Our Airport Taxi?
            </span>

            <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
              Designed Around Your Flight
            </h3>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

              {benefits.map(([icon, title, description]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/5 bg-white/[0.035] p-4"
                >
                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                      <Icon name={icon as any} size={18} />
                    </span>

                    <h4 className="text-[11px] font-black text-white">
                      {title}
                    </h4>

                  </div>

                  <p className="mt-2 text-[9px] leading-4 text-white/40">
                    {description}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* =====================================================
            SEO CONTENT
        ===================================================== */}

        <div className="mt-6 rounded-[26px] border border-white/10 bg-[#082641] p-6 sm:p-8">

          <div className="max-w-4xl">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-300">
              Raipur Airport Cab Service
            </span>

            <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
              Reliable Airport Taxi Service in Raipur & Chhattisgarh
            </h3>

            <p className="mt-4 text-[11px] leading-6 text-white/45 sm:text-[12px] sm:leading-7">
              Khatu Rides Travels provides airport taxi services for travellers
              looking for convenient pickup and drop facilities from
              <strong className="text-white/70">
                {" "}Raipur Airport
              </strong>
              . Our airport cab service is suitable for local transfers,
              business travel, family journeys and onward outstation trips.
            </p>

            <p className="mt-3 text-[11px] leading-6 text-white/45 sm:text-[12px] sm:leading-7">
              Travellers can book airport transfers between Raipur and
              important destinations such as
              <strong className="text-white/70">
                {" "}Bhilai, Durg, Bilaspur and Korba
              </strong>
              , along with nearby cities and outstation destinations. Choose a
              suitable cab and coordinate your airport journey with our travel
              support team.
            </p>

            {/* Keyword/service chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Raipur Airport Taxi",
                "Airport Pickup",
                "Airport Drop",
                "Raipur Airport Cab",
                "Airport Transfer",
                "Outstation Airport Cab",
                "Bhilai Airport Taxi",
                "Durg Airport Taxi",
                "Bilaspur Airport Cab",
                "Korba Airport Taxi",
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[8px] font-bold text-white/50"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <div className="mt-6 flex flex-col gap-5 rounded-[26px] border border-amber-300/15 bg-gradient-to-r from-amber-400/10 to-orange-400/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">

          <div>
            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-300">
              Need an Airport Cab?
            </span>

            <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">
              Your Airport Ride Is Just a Call Away.
            </h3>

            <p className="mt-1 text-[10px] text-white/40">
              Tell us your pickup, drop location and travel date.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">

            <a
              href={`tel:+91${AIRPORT_PHONE}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-[10px] font-black uppercase tracking-wider text-slate-950 transition hover:bg-amber-300"
            >
              <Icon name="phone" size={15} />
              Call Now
            </a>

            <a
              href={`https://wa.me/${AIRPORT_WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20an%20airport%20cab.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-6 py-3.5 text-[10px] font-black uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20"
            >
              <Icon name="whatsapp" size={16} />
              WhatsApp
            </a>

          </div>
        </div>

      </div>
    </section>
  );
}
import Icon from "./Icons";

const stats = [
  {
    value: "10+",
    label: "Years Experience",
    description: "Serving travellers with dependable cab & travel solutions.",
    icon: "clock",
  },
  {
    value: "10K+",
    label: "Happy Travellers",
    description: "Thousands of journeys completed across cities & destinations.",
    icon: "driver",
  },
  {
    value: "100%",
    label: "Customer Focus",
    description: "Every booking is handled with comfort, clarity and care.",
    icon: "star",
  },
  {
    value: "24×7",
    label: "Customer Support",
    description: "Our team stays available when your journey needs us.",
    icon: "phone",
  },
];

const reasons = [
  {
    number: "01",
    icon: "shield",
    title: "Transparent Cab Pricing",
    shortTitle: "Clear & Transparent",
    description:
      "Know what you are booking before your journey begins. We believe clear communication about routes, vehicles and fares creates better travel experiences.",
    points: ["Clear booking communication", "No confusing packages", "Route-focused service"],
  },
  {
    number: "02",
    icon: "driver",
    title: "Professional & Experienced Drivers",
    shortTitle: "Professional Drivers",
    description:
      "Your driver plays an important role in your journey. Our focus is on polite behaviour, responsible driving and dependable pickup coordination.",
    points: ["Experienced drivers", "Polite & customer-focused", "On-time coordination"],
  },
  {
    number: "03",
    icon: "car",
    title: "Clean & Comfortable Cabs",
    shortTitle: "Comfortable Cars",
    description:
      "Choose from practical sedans, family MUVs and premium SUVs for local travel, outstation trips and long-distance journeys.",
    points: ["AC vehicles", "Multiple vehicle categories", "Family-friendly options"],
  },
  {
    number: "04",
    icon: "clock",
    title: "On-Time Pickup & Drop",
    shortTitle: "On-Time Service",
    description:
      "Whether you are catching a flight, reaching a meeting or starting a pilgrimage, dependable pickup coordination can make your journey much easier.",
    points: ["Scheduled pickups", "Airport transfers", "Planned outstation trips"],
  },
  {
    number: "05",
    icon: "whatsapp",
    title: "24×7 Travel Assistance",
    shortTitle: "Always Available",
    description:
      "Need help before or during your journey? Connect with Khatu Rides through phone or WhatsApp for booking and travel assistance.",
    points: ["Phone support", "WhatsApp assistance", "Booking guidance"],
  },
  {
    number: "06",
    icon: "route",
    title: "Strong Outstation Route Knowledge",
    shortTitle: "Route Expertise",
    description:
      "From major Chhattisgarh cities to popular spiritual destinations, we help travellers plan practical point-to-point cab journeys.",
    points: ["City-to-city travel", "Outstation cabs", "Pilgrimage journeys"],
  },
];

const coverage = [
  "Raipur Cab Service",
  "Bilaspur Cab Service",
  "Korba Cab Service",
  "Durg Cab Service",
  "Bhilai Cab Service",
  "Raipur Airport Taxi",
  "Outstation Cab Service",
  "One Way Taxi",
  "Round Trip Cab",
  "Spiritual Tour Cabs",
];

function LargeFeatureIcon({
  icon,
  accent = "yellow",
}: {
  icon: string;
  accent?: "yellow" | "orange" | "green";
}) {
  const colors = {
    yellow: "bg-amber-100 text-amber-600 ring-amber-200",
    orange: "bg-orange-100 text-orange-600 ring-orange-200",
    green: "bg-emerald-100 text-emerald-600 ring-emerald-200",
  };

  return (
    <div
      className={`relative flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-[20px] ring-1 ${colors[accent]}`}
    >
      <div className="absolute inset-1 rounded-[16px] border border-current opacity-10" />
      <Icon name={icon as any} size={28} strokeWidth={2.1} />
    </div>
  );
}

export default function TrustSection() {
  return (
    <>
      {/* =========================================================
          TRUST HERO
      ========================================================= */}
      <section
        id="trust"
        aria-labelledby="trust-heading"
        className="relative isolate overflow-hidden bg-[#061B32] py-12 text-white sm:py-16"
      >
        {/* Background */}
        <div className="absolute inset-0 -z-20">
          <img
            src="/banner7.png"
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
        </div>

        {/* Brand overlays */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,#061B32_0%,rgba(6,27,50,.94)_38%,rgba(8,43,73,.78)_68%,rgba(6,27,50,.94)_100%)]" />

        <div className="absolute -right-32 top-[-120px] h-[360px] w-[360px] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -left-32 bottom-[-150px] h-[320px] w-[320px] rounded-full bg-orange-500/10 blur-3xl" />

        <div className="mx-auto max-w-[1350px] px-4 sm:px-6">

          {/* Top heading */}
          <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-center">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-white/5 px-3 py-2 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,.8)]" />
                <span className="text-[9px] font-black uppercase tracking-[.22em] text-amber-300">
                  Trusted Travel Partner
                </span>
              </div>

              <h2
                id="trust-heading"
                className="mt-4 max-w-xl text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl"
              >
                10+ Years of
                <span className="text-amber-300"> Trusted Journeys</span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-white/65 sm:text-[15px]">
                Khatu Rides Travels is focused on making cab travel simpler,
                safer and more comfortable for travellers across Chhattisgarh
                and popular destinations beyond the state.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-bold text-white/75">
                  ✓ Reliable Service
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-bold text-white/75">
                  ✓ Customer First
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-bold text-white/75">
                  ✓ Local Route Knowledge
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.06] backdrop-blur-xl sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`relative p-5 sm:p-6 ${
                    index < 2
                      ? "border-b border-white/10 sm:border-b-0"
                      : ""
                  } ${
                    index % 2 === 0
                      ? "border-r border-white/10 sm:border-r-0"
                      : ""
                  } ${
                    index !== 0
                      ? "sm:border-l sm:border-white/10"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                    <Icon name={stat.icon as any} size={19} />
                  </div>

                  <div className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {stat.value}
                  </div>

                  <div className="mt-1 text-[10px] font-black uppercase tracking-wider text-amber-300">
                    {stat.label}
                  </div>

                  <p className="mt-2 text-[9px] leading-4 text-white/45 sm:text-[10px]">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom trust strip */}
          <div className="mt-8 grid gap-3 border-t border-white/10 pt-7 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                <Icon name="shield" size={18} />
              </span>
              <div>
                <b className="block text-xs font-black">
                  Travel With Confidence
                </b>
                <span className="text-[9px] text-white/50">
                  Service designed around traveller needs
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                <Icon name="route" size={18} />
              </span>
              <div>
                <b className="block text-xs font-black">
                  Chhattisgarh & Beyond
                </b>
                <span className="text-[9px] text-white/50">
                  Local and outstation travel solutions
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Icon name="whatsapp" size={18} />
              </span>
              <div>
                <b className="block text-xs font-black">
                  Easy Travel Assistance
                </b>
                <span className="text-[9px] text-white/50">
                  Call or WhatsApp our support team
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY CHOOSE KHATU RIDES
      ========================================================= */}
      <section
        aria-labelledby="why-khatu-rides"
        className="bg-white py-14 sm:py-20"
      >
        <div className="mx-auto max-w-[1350px] px-4 sm:px-6">

          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.2em] text-amber-700">
              Why Choose Khatu Rides
            </span>

            <h2
              id="why-khatu-rides"
              className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
            >
              More Than Just a Cab.
              <span className="block text-amber-500">
                A Better Travel Experience.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-[15px]">
              From booking your cab to reaching your destination, our focus is
              on dependable service, comfortable vehicles, experienced drivers
              and helpful travel support.
            </p>
          </div>

          {/* Feature cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, index) => {
              const accent =
                index === 4
                  ? "green"
                  : index === 1 || index === 5
                    ? "orange"
                    : "yellow";

              return (
                <article
                  key={reason.number}
                  className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:bg-white hover:shadow-[0_18px_45px_rgba(15,23,42,.09)]"
                >
                  {/* Number */}
                  <span className="absolute right-5 top-5 text-4xl font-black tracking-tighter text-slate-100 transition-colors group-hover:text-amber-100">
                    {reason.number}
                  </span>

                  <div className="relative">
                    <LargeFeatureIcon
                      icon={reason.icon}
                      accent={accent as "yellow" | "orange" | "green"}
                    />

                    <span className="mt-5 block text-[9px] font-black uppercase tracking-[.18em] text-amber-600">
                      {reason.shortTitle}
                    </span>

                    <h3 className="mt-1.5 max-w-[270px] text-xl font-black leading-tight tracking-tight text-slate-950">
                      {reason.title}
                    </h3>

                    <p className="mt-3 text-[12px] leading-5 text-slate-500 sm:text-[13px]">
                      {reason.description}
                    </p>

                    <div className="mt-5 border-t border-slate-200 pt-4">
                      <div className="grid gap-2">
                        {reason.points.map((point) => (
                          <div
                            key={point}
                            className="flex items-center gap-2 text-[10px] font-bold text-slate-600 sm:text-[11px]"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[9px] font-black text-amber-700">
                              ✓
                            </span>
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          SEO / SERVICE COVERAGE
      ========================================================= */}
      <section
        aria-labelledby="service-coverage"
        className="relative overflow-hidden bg-[#F7F9FC] py-14 sm:py-20"
      >
        <div className="absolute right-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-amber-100/60 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-100px] h-[280px] w-[280px] rounded-full bg-orange-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-[1150px] px-4 sm:px-6">

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">

            {/* SEO heading */}
            <div>
              <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-[.2em] text-orange-600 shadow-sm">
                Cab Service Coverage
              </span>

              <h2
                id="service-coverage"
                className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl"
              >
                Your Trusted Cab Partner
                <span className="block text-amber-500">
                  Across Chhattisgarh
                </span>
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Looking for a reliable cab service in Chhattisgarh? Khatu Rides
                Travels provides one-way taxi, round-trip cab, airport taxi,
                local cab and outstation travel options for individuals,
                families, business travellers and pilgrimage groups.
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Popular travel routes include Raipur, Bilaspur, Korba, Durg
                and Bhilai, along with airport transfers and long-distance
                journeys to major spiritual destinations across India.
              </p>
            </div>

            {/* Coverage box */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_15px_45px_rgba(15,23,42,.06)] sm:p-8">

              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <Icon name="route" size={23} />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-950">
                    Popular Travel Services
                  </h3>

                  <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                    Built around real traveller requirements
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {coverage.map((item) => (
                  <div
                    key={item}
                    className="group rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 transition hover:border-amber-200 hover:bg-amber-50"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-[10px] font-black text-amber-500">
                        ✓
                      </span>

                      <span className="text-[10px] font-black leading-4 text-slate-700 group-hover:text-slate-950">
                        {item}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* SEO internal links */}
              <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                <a
                  href="#routes"
                  className="rounded-full bg-slate-950 px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-amber-400 hover:text-slate-950"
                >
                  Popular Routes →
                </a>

                <a
                  href="#tours"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
                >
                  Tour Packages →
                </a>
              </div>
            </div>
          </div>

          {/* Bottom keyword-rich statement */}
          <div className="mt-10 rounded-[24px] border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-6 text-center sm:p-8">
            <h3 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
              From Local Rides to Long-Distance Journeys
            </h3>

            <p className="mx-auto mt-2 max-w-3xl text-xs leading-6 text-slate-500 sm:text-sm">
              Whether you need a{" "}
              <strong className="font-black text-slate-700">
                Raipur cab
              </strong>
              ,{" "}
              <strong className="font-black text-slate-700">
                Bilaspur taxi
              </strong>
              ,{" "}
              <strong className="font-black text-slate-700">
                Korba outstation cab
              </strong>
              ,{" "}
              <strong className="font-black text-slate-700">
                Raipur Airport taxi
              </strong>
              , one-way cab or a comfortable vehicle for a spiritual tour,
              Khatu Rides helps you choose a practical travel solution for
              your journey.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
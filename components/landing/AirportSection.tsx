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
      className="relative overflow-hidden bg-[#061B32] py-16 text-white sm:py-24"
    >
      {/* =====================================================
          BACKGROUND - Deep App-like Gradients
      ===================================================== */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
        
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1350px] px-4 sm:px-6">

        {/* =====================================================
            MAIN HERO CARD - Flutter Glass Card Style
        ===================================================== */}
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0A2D4C]/90 via-[#082641]/90 to-[#061B32]/90 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
          
          {/* Decorative elements */}
          <div className="pointer-events-none absolute right-[-50px] top-[-50px] h-[400px] w-[400px] rounded-full border-[1px] border-white/5 bg-gradient-to-tr from-transparent to-white/5" />
          
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.2fr_.8fr] lg:p-16">
            
            {/* LEFT CONTENT */}
            <div className="relative z-10 flex flex-col justify-center">
              
              {/* Premium Badge */}
              <div className="inline-flex items-center self-start gap-3 rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-2.5 shadow-[0_0_20px_rgba(251,191,36,0.15)] backdrop-blur-md">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-sm">
                  <Icon name="plane" size={14} />
                </span>
                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] text-amber-300">
                  Airport Transfer Service
                </span>
              </div>

              {/* Huge Readable Heading */}
              <h2
                id="airport-heading"
                className="mt-8 max-w-3xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl text-white"
              >
                Raipur Airport Taxi
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 drop-shadow-sm">
                  On Time. Comfortable. Reliable.
                </span>
              </h2>

              <p className="mt-5 text-lg sm:text-xl font-bold text-white/90 tracking-wide">
                Premium Raipur Airport Pickup & Drop Cab Service
              </p>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                Book a comfortable airport taxi for pickup and drop between Swami Vivekananda Airport, Raipur and major destinations across Chhattisgarh. Ideal for families, business travellers, and scheduled flights.
              </p>

              {/* Big Interactive Buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href={`tel:+91${AIRPORT_PHONE}`}
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 px-8 py-5 text-sm sm:text-base font-black uppercase tracking-widest text-slate-950 shadow-[0_15px_35px_rgba(251,191,36,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(251,191,36,0.5)] active:scale-95"
                >
                  <span className="flex items-center justify-center transition-transform group-hover:scale-110">
                    <Icon name="phone" size={20} />
                  </span>
                  Call For Airport Taxi
                </a>

                <a
                  href={`https://wa.me/${AIRPORT_WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20need%20a%20Raipur%20Airport%20taxi.`}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 backdrop-blur-md px-8 py-5 text-sm sm:text-base font-black uppercase tracking-widest text-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.1)] transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500/20 hover:shadow-[0_15px_40px_rgba(16,185,129,0.2)] active:scale-95"
                >
                  <span className="flex items-center justify-center transition-transform group-hover:scale-110">
                    <Icon name="whatsapp" size={22} />
                  </span>
                  WhatsApp Booking
                </a>
              </div>

              {/* Trust Features (Bigger Text) */}
              <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
                {[
                  { icon: "clock", title: "Flight Friendly", sub: "Scheduled coordination" },
                  { icon: "car", title: "AC Vehicles", sub: "Comfortable travel" },
                  { icon: "driver", title: "Pro Drivers", sub: "Reliable service" }
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-amber-400 ring-1 ring-white/10 shadow-inner">
                      <Icon name={item.icon as any} size={20} />
                    </span>
                    <div>
                      <b className="block text-sm sm:text-base font-bold text-white tracking-wide">
                        {item.title}
                      </b>
                      <span className="text-xs sm:text-sm text-white/50">
                        {item.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT VISUAL - 3D App Card Feeling */}
            <div className="relative flex min-h-[400px] w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-8 shadow-2xl backdrop-blur-lg lg:min-h-full">
              
              <div className="absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/15 blur-[80px]" />
              </div>

              <div className="relative z-10 w-full max-w-sm text-center">
                
                <div className="mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-[40px] border border-amber-300/30 bg-gradient-to-br from-amber-400/20 to-amber-500/5 text-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.15)] backdrop-blur-xl transition-transform duration-500 hover:scale-105 hover:rotate-3">
                  <Icon name="plane" size={60} strokeWidth={1.5} />
                </div>

                <div className="mt-8">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-400/90">
                    Airport Transfer
                  </span>
                  <div className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white">
                    Raipur Airport
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-white/60 font-medium">
                    Swami Vivekananda Airport
                  </p>
                </div>

                {/* Route Visual App-like Element */}
                <div className="mx-auto mt-10 flex w-full items-center justify-between rounded-2xl bg-black/20 p-5 border border-white/5 backdrop-blur-md">
                  <div className="text-right">
                    <span className="block text-xs font-bold uppercase tracking-wider text-white/50">Pickup</span>
                    <span className="text-base sm:text-lg font-black text-white">Airport</span>
                  </div>
                  <div className="relative flex flex-1 items-center justify-center px-4">
                    <div className="h-[2px] w-full border-t-2 border-dashed border-white/20" />
                    <span className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                      <Icon name="car" size={18} />
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold uppercase tracking-wider text-white/50">Drop</span>
                    <span className="text-base sm:text-lg font-black text-white">Destination</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SERVICE OPTIONS - Flutter Style Grids
        ===================================================== */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {airportServices.map((service) => (
            <article
              key={service.title}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.06] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-transparent to-amber-400/0 opacity-0 transition-opacity duration-500 group-hover:from-amber-400/5 group-hover:opacity-100" />
              
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-900 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] ring-1 ring-white/5">
                  <Icon name={service.icon as any} size={28} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/60">
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
        <div className="mt-8 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          
          {/* Routes Card */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10 backdrop-blur-lg hover:bg-white/[0.04] transition-colors duration-300">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-amber-400">
              Airport Cab Routes
            </span>
            <h3 className="mt-3 text-2xl sm:text-3xl font-black text-white leading-tight">
              Popular Raipur Airport Transfers
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/60">
              Airport taxi options for major cities and travel destinations around Raipur.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {airportRoutes.map((route) => (
                <div
                  key={route}
                  className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-4 transition-all hover:border-amber-400/30 hover:bg-amber-400/5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors">
                    <Icon name="route" size={18} />
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white/80 group-hover:text-white transition-colors">
                    {route}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Card */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10 backdrop-blur-lg hover:bg-white/[0.04] transition-colors duration-300">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-emerald-400">
              Why Choose Our Airport Taxi?
            </span>
            <h3 className="mt-3 text-2xl sm:text-3xl font-black text-white leading-tight">
              Designed Around Your Flight
            </h3>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {benefits.map(([icon, title, description]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/5 bg-black/20 p-6 transition-transform hover:-translate-y-1 hover:border-emerald-500/20 hover:bg-white/[0.02] hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <Icon name={icon as any} size={22} />
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      {title}
                    </h4>
                  </div>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/60">
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
        <div className="mt-8 rounded-[32px] border border-white/10 bg-[#082641]/80 p-8 sm:p-12 backdrop-blur-md">
          <div className="max-w-4xl">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-amber-400">
              Raipur Airport Cab Service
            </span>
            <h3 className="mt-4 text-3xl sm:text-4xl font-black leading-tight text-white">
              Reliable Airport Taxi Service in Raipur & Chhattisgarh
            </h3>
            
            <div className="mt-6 space-y-4">
              <p className="text-base sm:text-lg leading-relaxed text-white/70">
                Khatu Rides Travels provides premium airport taxi services for travellers looking for convenient pickup and drop facilities from <strong className="text-white font-bold tracking-wide">Raipur Airport</strong>. Our airport cab service is suitable for local transfers, business travel, family journeys and onward outstation trips.
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-white/70">
                Travellers can book airport transfers between Raipur and important destinations such as <strong className="text-white font-bold tracking-wide">Bhilai, Durg, Bilaspur and Korba</strong>, along with nearby cities and outstation destinations. Choose a suitable cab and coordinate your airport journey with our 24/7 travel support team.
              </p>
            </div>

            {/* Keyword/service chips */}
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Raipur Airport Taxi", "Airport Pickup", "Airport Drop", 
                "Raipur Airport Cab", "Airport Transfer", "Outstation Airport Cab", 
                "Bhilai Airport Taxi", "Durg Airport Taxi", "Bilaspur Airport Cab", 
                "Korba Airport Taxi",
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-default"
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
        <div className="mt-8 flex flex-col gap-8 rounded-[32px] border border-amber-400/20 bg-gradient-to-r from-amber-400/10 via-amber-500/5 to-orange-500/10 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12 shadow-[0_20px_50px_rgba(251,191,36,0.05)] backdrop-blur-xl">
          <div className="flex-1">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-amber-400">
              Need an Airport Cab?
            </span>
            <h3 className="mt-3 text-3xl sm:text-4xl font-black text-white leading-tight">
              Your Airport Ride Is Just a Call Away.
            </h3>
            <p className="mt-3 text-base sm:text-lg text-white/70">
              Tell us your pickup, drop location and travel date. We will handle the rest.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-4 sm:flex-row">
            <a
              href={`tel:+91${AIRPORT_PHONE}`}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-amber-400 px-8 py-5 text-sm sm:text-base font-black uppercase tracking-widest text-slate-900 shadow-[0_10px_30px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-1 hover:bg-amber-300 hover:shadow-[0_15px_40px_rgba(251,191,36,0.4)] active:scale-95"
            >
              <span className="flex items-center justify-center transition-transform group-hover:scale-110">
                <Icon name="phone" size={20} />
              </span>
              Call Now
            </a>

            <a
              href={`https://wa.me/${AIRPORT_WHATSAPP}?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20an%20airport%20cab.`}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-8 py-5 text-sm sm:text-base font-black uppercase tracking-widest text-emerald-400 backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-emerald-500/20 hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)] active:scale-95"
            >
              <span className="flex items-center justify-center transition-transform group-hover:scale-110">
                <Icon name="whatsapp" size={20} />
              </span>
              WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Keyword = {
  keyword: string;
  intent: "Very High" | "High";
  hub: string;
  type: "Route" | "Airport" | "Local" | "Outstation";
  href: string;
};

const HIGH_INTENT_CG_KEYWORDS: Keyword[] = [
  { keyword: "Korba to Raipur cab", intent: "Very High", hub: "Korba", type: "Route", href: "/routes/korba-to-raipur-taxi" },
  { keyword: "Korba to Raipur taxi", intent: "Very High", hub: "Korba", type: "Route", href: "/routes/korba-to-raipur-taxi" },
  { keyword: "Raipur to Korba cab", intent: "Very High", hub: "Raipur", type: "Route", href: "/routes/raipur-to-korba-taxi" },
  { keyword: "Raipur to Korba taxi", intent: "Very High", hub: "Raipur", type: "Route", href: "/routes/raipur-to-korba-taxi" },

  { keyword: "Korba to Bilaspur cab", intent: "Very High", hub: "Korba", type: "Route", href: "/routes/korba-to-bilaspur-taxi" },
  { keyword: "Bilaspur to Korba taxi", intent: "Very High", hub: "Bilaspur", type: "Route", href: "/routes/bilaspur-to-korba-taxi" },
  { keyword: "Raipur to Bilaspur cab", intent: "Very High", hub: "Raipur", type: "Route", href: "/routes/raipur-to-bilaspur-taxi" },
  { keyword: "Bilaspur to Raipur taxi", intent: "Very High", hub: "Bilaspur", type: "Route", href: "/routes/bilaspur-to-raipur-taxi" },

  { keyword: "Korba to Raipur airport cab", intent: "Very High", hub: "Korba", type: "Airport", href: "/routes/korba-to-raipur-airport-cab" },
  { keyword: "Raipur airport to Korba cab", intent: "Very High", hub: "Raipur Airport", type: "Airport", href: "/routes/raipur-airport-to-korba-cab" },
  { keyword: "Bilaspur to Raipur airport cab", intent: "Very High", hub: "Bilaspur", type: "Airport", href: "/routes/bilaspur-to-raipur-airport-cab" },
  { keyword: "Raipur airport to Bilaspur taxi", intent: "Very High", hub: "Raipur Airport", type: "Airport", href: "/routes/raipur-airport-to-bilaspur-cab" },

  { keyword: "Raipur to Raigarh cab", intent: "High", hub: "Raipur", type: "Route", href: "/routes/raipur-to-raigarh-taxi" },
  { keyword: "Raigarh to Raipur taxi", intent: "High", hub: "Raigarh", type: "Route", href: "/routes/raigarh-to-raipur-taxi" },
  { keyword: "Korba to Raigarh cab", intent: "High", hub: "Korba", type: "Route", href: "/routes/korba-to-raigarh-taxi" },
  { keyword: "Raigarh to Korba taxi", intent: "High", hub: "Raigarh", type: "Route", href: "/routes/raigarh-to-korba-taxi" },

  { keyword: "Raipur to Ambikapur taxi", intent: "High", hub: "Raipur", type: "Outstation", href: "/routes/raipur-to-ambikapur-taxi" },
  { keyword: "Ambikapur to Raipur cab", intent: "High", hub: "Ambikapur", type: "Outstation", href: "/routes/ambikapur-to-raipur-taxi" },
  { keyword: "Korba to Ambikapur taxi", intent: "High", hub: "Korba", type: "Outstation", href: "/routes/korba-to-ambikapur-taxi" },
  { keyword: "Ambikapur to Korba cab", intent: "High", hub: "Ambikapur", type: "Outstation", href: "/routes/ambikapur-to-korba-taxi" },

  { keyword: "Raipur to Jagdalpur cab", intent: "High", hub: "Raipur", type: "Outstation", href: "/routes/raipur-to-jagdalpur-taxi" },
  { keyword: "Jagdalpur to Raipur taxi", intent: "High", hub: "Jagdalpur", type: "Outstation", href: "/routes/jagdalpur-to-raipur-taxi" },
  { keyword: "Raipur to Durg cab", intent: "High", hub: "Raipur", type: "Local", href: "/routes/raipur-to-durg-taxi" },
  { keyword: "Durg to Raipur taxi", intent: "High", hub: "Durg", type: "Local", href: "/routes/durg-to-raipur-taxi" },

  { keyword: "Raipur to Bhilai cab", intent: "Very High", hub: "Raipur", type: "Local", href: "/routes/raipur-to-bhilai-taxi" },
  { keyword: "Bhilai to Raipur taxi", intent: "Very High", hub: "Bhilai", type: "Local", href: "/routes/bhilai-to-raipur-taxi" },
  { keyword: "Raipur to Dhamtari cab", intent: "High", hub: "Raipur", type: "Local", href: "/routes/raipur-to-dhamtari-taxi" },
  { keyword: "Dhamtari to Raipur taxi", intent: "High", hub: "Dhamtari", type: "Local", href: "/routes/dhamtari-to-raipur-taxi" },

  { keyword: "Korba to Champa taxi", intent: "High", hub: "Korba", type: "Route", href: "/routes/korba-to-champa-taxi" },
  { keyword: "Champa to Korba cab", intent: "High", hub: "Champa", type: "Route", href: "/routes/champa-to-korba-taxi" },
  { keyword: "Raipur to Champa cab", intent: "High", hub: "Raipur", type: "Route", href: "/routes/raipur-to-champa-taxi" },
  { keyword: "Champa to Raipur taxi", intent: "High", hub: "Champa", type: "Route", href: "/routes/champa-to-raipur-taxi" },

  { keyword: "Korba to Bilaspur airport cab", intent: "High", hub: "Korba", type: "Airport", href: "/routes/korba-to-bilaspur-airport-cab" },
  { keyword: "Bilaspur airport to Korba taxi", intent: "High", hub: "Bilaspur Airport", type: "Airport", href: "/routes/bilaspur-airport-to-korba-cab" },
  { keyword: "Korba to Bilaspur railway station cab", intent: "High", hub: "Korba", type: "Local", href: "/routes/korba-to-bilaspur-railway-station-cab" },
  { keyword: "Bilaspur railway station to Korba taxi", intent: "High", hub: "Bilaspur", type: "Local", href: "/routes/bilaspur-railway-station-to-korba-cab" },

  { keyword: "Raipur airport to Raigarh cab", intent: "High", hub: "Raipur Airport", type: "Airport", href: "/routes/raipur-airport-to-raigarh-cab" },
  { keyword: "Raigarh to Raipur airport taxi", intent: "High", hub: "Raigarh", type: "Airport", href: "/routes/raigarh-to-raipur-airport-cab" },
];

const HUBS = [
  "Raipur",
  "Korba",
  "Bilaspur",
  "Raigarh",
  "Ambikapur",
  "Jagdalpur",
  "Durg",
  "Bhilai",
  "Champa",
  "Dhamtari",
];

export default function ChhattisgarhHighIntentRoutes() {
  return (
    <section
      id="popular-cab-routes"
      aria-labelledby="popular-cab-routes-title"
      className="relative overflow-hidden border-y border-slate-200 bg-white py-16 sm:py-20"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-slate-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-orange-700">
            <Sparkles size={13} />
            Popular Cab Routes
          </div>

          <h2
            id="popular-cab-routes-title"
            className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl"
          >
            Book a Cab Across Chhattisgarh
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
            One-way cabs, outstation taxis and airport transfers between
            Chhattisgarh&apos;s major travel and business hubs.
          </p>
        </div>

        {/* Hub chips */}
        <div className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-2">
          {HUBS.map((hub) => (
            <span
              key={hub}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-600"
            >
              <MapPin size={12} className="text-orange-500" />
              {hub}
            </span>
          ))}
        </div>

        {/* Route cards */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {HIGH_INTENT_CG_KEYWORDS.map((route) => (
            <Link
              key={route.keyword}
              href={route.href}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                  {route.type === "Airport" ? (
                    <Plane size={16} />
                  ) : route.type === "Route" ? (
                    <Route size={16} />
                  ) : (
                    <MapPin size={16} />
                  )}
                </div>

                <span
                  className={[
                    "rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-wider",
                    route.intent === "Very High"
                      ? "bg-orange-50 text-orange-700"
                      : "bg-slate-100 text-slate-600",
                  ].join(" ")}
                >
                  {route.intent}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-extrabold leading-5 text-slate-950 group-hover:text-orange-600">
                {route.keyword}
              </h3>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {route.type} • {route.hub}
                </span>

                <ArrowRight
                  size={15}
                  className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-orange-500"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Trust / conversion strip */}
        <div className="mt-10 rounded-3xl bg-slate-950 p-5 text-white sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-orange-400">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                  Booking-first travel service
                </span>
              </div>

              <h3 className="mt-2 text-xl font-black sm:text-2xl">
                Can&apos;t find your route?
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Enter your pickup and destination above to check the fare for
                your exact journey.
              </p>
            </div>

            <a
              href="#fare-calculator"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
            >
              Check Fare & Available Cars
              <ArrowRight size={15} />
            </a>
          </div>
        </div>

        {/* SEO-supporting copy */}
        <div className="mx-auto mt-8 max-w-5xl text-center">
          <p className="text-xs leading-6 text-slate-500">
            Search and book cabs for major Chhattisgarh corridors including
            Raipur, Korba, Bilaspur, Raigarh, Ambikapur, Jagdalpur, Durg,
            Bhilai, Champa and Dhamtari. Choose one-way, round-trip,
            outstation or airport transfer based on your journey.
          </p>
        </div>
      </div>
    </section>
  );
}

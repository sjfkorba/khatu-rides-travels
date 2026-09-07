import { FLEET } from "./data";
import Icon from "./Icons";

const BOOKING_PHONE = "9244137353";

export default function Fleet() {
  return (
    <section id="fleet" className="bg-[#f7f9fc] py-12 sm:py-16">
      <div className="mx-auto max-w-[1350px] px-4 sm:px-6">

        {/* SECTION HEADER */}
        <div className="flex items-end justify-between gap-5">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-600">
              Our Fleet
            </span>

            <h2 className="mt-1.5 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Choose Your Perfect Ride
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-[15px]">
              Clean, comfortable vehicles for every kind of journey.
            </p>
          </div>

          {/* DESKTOP FEATURES */}
          <div className="hidden flex-wrap justify-end gap-2 md:flex">
            {[
              "AC Vehicles",
              "Clean & Sanitized",
              "Experienced Drivers",
              "Luggage Space",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[10px] font-black text-slate-600 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* VEHICLE GRID */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {FLEET.map((car) => (
            <article
              key={car.name}
              className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_5px_20px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_16px_35px_rgba(15,23,42,0.12)]"
            >

              {/* VEHICLE IMAGE */}
              <div className="relative h-[205px] w-full overflow-hidden bg-gradient-to-b from-slate-100 via-white to-white sm:h-[190px] lg:h-[185px]">

                {/* subtle background glow */}
                <div className="absolute left-1/2 top-1/2 h-32 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/50 blur-3xl" />

                {/* BADGE */}
                <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-100 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-amber-700 shadow-sm">
                  {car.tag}
                </span>

                {/* VEHICLE */}
                <img
                  src={car.image}
                  alt={`${car.name} ${car.type} cab`}
                  className="relative z-[1] h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />

                {/* Bottom soft fade */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-12 bg-gradient-to-t from-white/80 to-transparent" />
              </div>

              {/* CARD CONTENT */}
              <div className="p-4 sm:p-5">

                {/* TYPE + SEATS */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-600">
                    {car.type}
                  </span>

                  <span className="text-[10px] font-bold text-slate-400">
                    {car.seats}
                  </span>
                </div>

                {/* NAME */}
                <h3 className="mt-1.5 text-lg font-black tracking-tight text-slate-950">
                  {car.name}
                </h3>

                {/* FEATURES */}
                <div className="mt-4 grid grid-cols-3 gap-1.5">

                  <div className="flex items-center justify-center gap-1 rounded-xl bg-slate-50 py-2.5 text-[9px] font-bold text-slate-600">
                    <span className="text-[10px]">❄</span>
                    AC
                  </div>

                  <div className="flex items-center justify-center gap-1 rounded-xl bg-slate-50 py-2.5 text-[9px] font-bold text-slate-600">
                    <span className="text-[10px]">♟</span>
                    {car.seats.split(" ")[0]}
                  </div>

                  <div className="flex items-center justify-center gap-1 rounded-xl bg-slate-50 py-2.5 text-[9px] font-bold text-slate-600">
                    <span className="text-[10px]">▮</span>
                    Bag
                  </div>

                </div>

                {/* CALL BUTTON */}
                <a
                  href={`tel:+91${BOOKING_PHONE}`}
                  className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-[0_7px_18px_rgba(251,191,36,0.20)] transition-all duration-200 hover:bg-amber-300 hover:shadow-[0_10px_24px_rgba(251,191,36,0.30)] active:scale-[0.98]"
                >
                  <Icon name="phone" size={14} />
                  Check Availability
                </a>

              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
import { ROUTES } from "./data";
import Icon from "./Icons";

export default function PopularRoutes() {
  return (
    <section id="routes" className="bg-[#f7f9fc] py-10 sm:py-14">
      <div className="mx-auto max-w-[1350px] px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[.2em] text-amber-600">Most Booked</span>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Popular Cab Routes</h2>
            <p className="mt-1 text-sm text-slate-500">Best-selling routes with transparent starting fares.</p>
          </div>
          <a href="/popular-routes" className="hidden items-center gap-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[10px] font-black sm:flex">View All Routes <Icon name="arrow" size={14} /></a>
        </div>

        <div className="mt-7 flex snap-x gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {ROUTES.map((route) => (
            <article key={`${route.from}-${route.to}`} className="group min-w-[245px] snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:min-w-0">
              <div className="relative h-32 overflow-hidden">
                <img src={route.image} alt={`${route.from} to ${route.to} cab`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-black text-slate-950">{route.from} <span className="text-amber-500">→</span> {route.to}</h3>
                <p className="mt-1 text-[10px] font-semibold text-slate-500">{route.meta}</p>
                <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
                  <div><span className="block text-[8px] font-black uppercase tracking-wider text-slate-400">Starting</span><b className="text-lg font-black text-slate-950">{route.price}</b></div>
                  <a href={`https://wa.me/919244137353?text=Hello%20Khatu%20Rides%2C%20I%20want%20to%20book%20${encodeURIComponent(route.from)}%20to%20${encodeURIComponent(route.to)}.`} target="_blank" rel="noreferrer" className="rounded-xl bg-amber-400 px-4 py-2.5 text-[9px] font-black uppercase text-slate-950 transition hover:bg-amber-300">Book <span>→</span></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

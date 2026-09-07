import { DESTINATIONS, TOURS } from "./data";
import Icon from "./Icons";

function Card({ item }: { item: { title: string; type: string; image: string; href?: string } }) {
  return (
    <a href={item.href || "#contact"} className="group relative block h-[180px] min-w-[135px] overflow-hidden rounded-2xl bg-slate-900 shadow-sm sm:h-[195px]">
      <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <b className="block text-sm font-black">{item.title}</b>
        <span className="mt-0.5 block text-[9px] font-semibold text-white/70">{item.type}</span>
      </div>
      <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-950"><Icon name="arrow" size={13} /></span>
    </a>
  );
}

export default function TourPackages() {
  return (
    <section id="tours" className="bg-white py-10 sm:py-14">
      <div className="mx-auto grid max-w-[1350px] gap-10 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="flex items-end justify-between">
            <div><span className="text-[10px] font-black uppercase tracking-[.2em] text-amber-600">Spiritual Travel</span><h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Divine Journeys</h2><p className="text-sm text-slate-500">Comfortable trips to the holiest destinations.</p></div>
            <a href="/tour-packages" className="hidden items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-[9px] font-black sm:flex">View All <Icon name="arrow" size={13} /></a>
          </div>
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {TOURS.map((item) => <Card key={item.title} item={item} />)}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[.2em] text-amber-600">Explore Local</span>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Chhattisgarh</h2>
          <p className="text-sm text-slate-500">Discover natural beauty and local destinations.</p>
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {DESTINATIONS.map((item) => <Card key={item.title} item={item} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

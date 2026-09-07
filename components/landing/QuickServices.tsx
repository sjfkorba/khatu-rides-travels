import { QUICK_SERVICES } from "./data";
import Icon from "./Icons";

export default function QuickServices() {
  return (
    <section className="relative z-10 -mt-2 bg-[#f7f9fc] py-5 sm:py-7">
      <div className="mx-auto grid max-w-[1350px] gap-3 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {QUICK_SERVICES.map((item) => (
          <a key={item.title} href={item.href} className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,.05)] transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_14px_35px_rgba(15,23,42,.10)]">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl">{item.icon}</span>
            <span className="min-w-0 flex-1">
              <b className="block text-sm font-black text-slate-950">{item.title}</b>
              <small className="text-[10px] font-semibold text-slate-500">{item.text}</small>
            </span>
            <Icon name="arrow" size={17} />
          </a>
        ))}
      </div>
    </section>
  );
}

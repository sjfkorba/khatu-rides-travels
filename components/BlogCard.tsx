import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

export default function BlogCard({
  title,
  description,
  slug,
  readTime,
}: {
  title: string;
  description: string;
  slug: string;
  readTime: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-2xl sm:p-7">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-white to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">
            <Clock3 size={16} className="shrink-0" />
            <span>{readTime}</span>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Blog
          </span>
        </div>

        <h2 className="mt-5 line-clamp-2 text-2xl font-black leading-tight text-slate-900 transition-colors duration-300 group-hover:text-orange-700 sm:text-[28px]">
          {title}
        </h2>

        <p className="mt-4 line-clamp-3 text-[15px] leading-7 text-slate-600">
          {description}
        </p>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-orange-200 via-slate-200 to-transparent" />

        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Continue reading
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Open full article
            </p>
          </div>

          <Link
            href={`/blog/${slug}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:bg-orange-700 hover:shadow-xl hover:shadow-orange-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            Read Article
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
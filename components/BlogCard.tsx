import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <div className="bg-white border rounded-3xl p-6 hover:shadow-xl transition">

      <div className="text-sm text-orange-600 font-semibold">
        {readTime}
      </div>

      <h2 className="mt-3 text-2xl font-black">
        {title}
      </h2>

      <p className="mt-4 text-slate-600">
        {description}
      </p>

      <Link
        href={`/blog/${slug}`}
        className="inline-flex items-center gap-2 mt-6 font-bold text-orange-600"
      >
        Read Article
        <ArrowRight size={18} />
      </Link>

    </div>
  );
}
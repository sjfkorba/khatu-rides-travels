import Link from "next/link";
import { blogs } from "@/lib/blogs";

export default function RelatedPosts(
  { currentSlug }: { currentSlug: string }
) {
  const related = blogs
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3);

  if (!related.length) return null;

  return (
    <section className="mt-16">

      <h2 className="text-3xl font-black mb-8">
        Related Articles
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="bg-white border rounded-2xl p-5"
          >
            {post.title}
          </Link>
        ))}

      </div>

    </section>
  );
}
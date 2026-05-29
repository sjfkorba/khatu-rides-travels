import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import { blogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Travel Blog | Khatu Rides Travels",
  description:
    "Taxi booking guides, airport transfer tips and travel information for Chhattisgarh.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      <section className="bg-slate-950 text-white py-24">

        <div className="max-w-7xl mx-auto px-6">

          <h1 className="text-5xl md:text-6xl font-black">
            Travel Blog
          </h1>

          <p className="mt-6 max-w-3xl text-slate-300 text-lg">
            Taxi fare guides, travel tips and local
            insights for travelers across Chhattisgarh.
          </p>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {blogs.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              description={post.description}
              slug={post.slug}
              readTime={post.readTime}
            />
          ))}

        </div>

      </section>

    </main>
  );
}
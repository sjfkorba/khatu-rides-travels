import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { blogs } from "@/lib/blogs";
import BlogCTA from "@/components/BlogCTA";
import RelatedPosts from "@/components/RelatedPosts";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return blogs.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { slug } = await params;

  const post = blogs.find(
    (p) => p.slug === slug
  );

  if (!post) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
  };
}

export default async function BlogPostPage(
  { params }: Props
) {
  const { slug } = await params;

  const post = blogs.find(
    (p) => p.slug === slug
  );

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">

      <article className="max-w-4xl mx-auto px-6 py-16">

        <div className="text-sm text-orange-600 font-semibold">
          {post.readTime}
        </div>

        <h1 className="text-5xl font-black mt-4">
          {post.title}
        </h1>

        <p className="mt-6 text-xl text-slate-600">
          {post.description}
        </p>

        <div className="prose prose-lg max-w-none mt-12">
          {post.content}
        </div>

        <div className="mt-16">
          <BlogCTA />
        </div>

        <RelatedPosts
          currentSlug={post.slug}
        />

      </article>

    </main>
  );
}
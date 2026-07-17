import { notFound } from "next/navigation";
import { routeDatabase } from "@/lib/routeDatabase";

import type { Metadata } from "next";
import RoutePageClient from "@/components/RoutePageClient";

// SEO: Generate all routes dynamically
export async function generateStaticParams() {
  return Object.keys(routeDatabase).map((slug) => ({ slug }));
}

// SEO: Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = routeDatabase[slug];
  if (!route) return { title: "Route Not Found" };
  return {
    title: route.title,
    description: route.desc,
    alternates: { canonical: `https://khaturidescg.in/routes/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = routeDatabase[slug];
  if (!route) notFound();

  return <RoutePageClient slug={slug} route={route} />;
}
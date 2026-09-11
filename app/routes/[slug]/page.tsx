import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { routeDatabase } from "@/lib/routeDatabase";
import RoutePageClient from "@/components/RoutePageClient";

const SITE_URL = "https://khaturidescg.in";

export async function generateStaticParams() {
  return Object.keys(routeDatabase).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const route = routeDatabase[slug];

  if (!route) {
    return {
      title: "Route Not Found | Khatu Rides Travels",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title:
      route.title ||
      `${route.h1} | Khatu Rides Travels`,

    description:
      route.desc ||
      `Book ${route.h1} with Khatu Rides Travels for one-way taxi, round-trip cab and outstation travel.`,

    keywords: [
      route.h1,
      `${route.from || ""} to ${route.to || ""} taxi`,
      `${route.from || ""} to ${route.to || ""} cab`,
      `${route.from || ""} to ${route.to || ""} taxi service`,
      `${route.from || ""} to ${route.to || ""} cab service`,
      `${route.from || ""} to ${route.to || ""} taxi booking`,
      `${route.from || ""} to ${route.to || ""} cab booking`,
      `${route.from || ""} to ${route.to || ""} one way taxi`,
      `${route.from || ""} to ${route.to || ""} one way cab`,
      `${route.from || ""} to ${route.to || ""} round trip taxi`,
      `${route.from || ""} to ${route.to || ""} round trip cab`,
      `${route.from || ""} to ${route.to || ""} outstation taxi`,
      `${route.from || ""} to ${route.to || ""} outstation cab`,
    ].filter(Boolean),

    alternates: {
      canonical: `${SITE_URL}/routes/${slug}`,
    },

    openGraph: {
      title:
        route.title ||
        `${route.h1} | Khatu Rides Travels`,

      description:
        route.desc ||
        `Book ${route.h1} with Khatu Rides Travels.`,

      url: `${SITE_URL}/routes/${slug}`,

      siteName: "Khatu Rides Travels Co.",

      type: "website",

      images: [
        {
          url: `${SITE_URL}/logo.png`,
          width: 1200,
          height: 630,
          alt: "Khatu Rides Travels Co.",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title:
        route.title ||
        `${route.h1} | Khatu Rides Travels`,

      description:
        route.desc ||
        `Book ${route.h1} with Khatu Rides Travels.`,

      images: [`${SITE_URL}/logo.png`],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const route = routeDatabase[slug];

  if (!route) {
    notFound();
  }

  return (
    <RoutePageClient
      slug={slug}
      route={route}
    />
  );
}
import type { MetadataRoute } from "next";

const siteUrl = "https://khaturidescg.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    // Home
    "",

    // Service Pages
    "/services/taxi-service-in-raipur",
    "/services/taxi-service-in-korba",
    "/services/taxi-service-in-bilaspur",

    // Route Pages
    "/routes/raipur-to-korba-taxi",
    "/routes/korba-to-raipur-taxi",

    "/routes/raipur-to-bilaspur-taxi",
    "/routes/bilaspur-to-raipur-taxi",

    "/routes/raipur-to-raigarh-taxi",
    "/routes/raigarh-to-raipur-taxi",

    "/routes/raipur-to-bhilai-taxi",
    "/routes/bhilai-to-raipur-taxi",

    "/routes/raipur-to-durg-taxi",
    "/routes/durg-to-raipur-taxi",

    "/routes/raipur-to-ambikapur-taxi",
    "/routes/ambikapur-to-raipur-taxi",

    "/routes/raipur-to-jagdalpur-taxi",
    "/routes/jagdalpur-to-raipur-taxi",

    "/routes/raipur-airport-taxi",

    "/routes/raipur-airport-to-korba-taxi",
    "/routes/raipur-airport-to-bilaspur-taxi",
    "/routes/raipur-airport-to-raigarh-taxi",
    "/routes/raipur-airport-to-ambikapur-taxi",

    "/routes/korba-to-bilaspur-taxi",
    "/routes/bilaspur-to-korba-taxi",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority:
      route === ""
        ? 1.0
        : route.startsWith("/services/")
        ? 0.9
        : 0.8,
  }));
}
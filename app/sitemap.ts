import type { MetadataRoute } from "next";

const siteUrl = "https://khatu-rides-travels.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/routes/raipur-to-korba-taxi",
    "/routes/korba-to-raipur-taxi",
    "/routes/raipur-to-bilaspur-taxi",
    "/routes/bilaspur-to-raipur-taxi",
    "/routes/raipur-airport-taxi",
    "/routes/korba-to-bilaspur-taxi",
    "/routes/raipur-to-jagdalpur-taxi",
    "/routes/raipur-to-ambikapur-taxi",
    "/services/one-way-taxi-chhattisgarh",
    "/services/outstation-cab-chhattisgarh",
    "/services/commercial-cab-booking-chhattisgarh",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
import type { MetadataRoute } from "next";

const siteUrl = "https://khaturidescg.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },

    // Main Pages
    {
      url: `${siteUrl}/about-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Legal Pages
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/payment-terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },

    // Service Pages
    {
      url: `${siteUrl}/services/taxi-service-in-raipur`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/taxi-service-in-korba`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/taxi-service-in-bilaspur`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Route Pages
    {
      url: `${siteUrl}/routes/raipur-to-korba-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/routes/korba-to-raipur-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/routes/raipur-to-bilaspur-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/routes/bilaspur-to-raipur-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/routes/raipur-to-raigarh-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/routes/raigarh-to-raipur-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/routes/raipur-airport-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // Blog Posts
    {
      url: `${siteUrl}/blog/raipur-to-korba-taxi-fare-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
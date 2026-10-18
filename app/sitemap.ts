import type { MetadataRoute } from "next";

const siteUrl = "https://khaturidescg.in";

// 1. Hubs list for dynamic generation
const HUBS = [
  "Korba", "Champa", "Kharsia", "Raigarh", "Katghora", "Dipka", 
  "Ambikapur", "Bilaspur", "Raipur", "Durg", "Bhilai", "Rajnandgaon", 
  "Jagdalpur", "Sambalpur", "Dhamtari", "Jharsuguda", "Ranchi", 
  "Patna", "Aourangabad", "Prayagraj", "Varanasi", "Ujjain"
];

const createRouteSlug = (from: string, to: string) => 
  `${from.toLowerCase()}-to-${to.toLowerCase()}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 2. Generate all 462 dynamic cab-service routes automatically
  const dynamicCabRoutes: MetadataRoute.Sitemap = [];
  for (let i = 0; i < HUBS.length; i++) {
    for (let j = 0; j < HUBS.length; j++) {
      if (i !== j) {
        dynamicCabRoutes.push({
          url: `${siteUrl}/cab-service/${createRouteSlug(HUBS[i], HUBS[j])}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8, // Priority set for SEO
        });
      }
    }
  }

  // 3. Your existing static routes
  const staticRoutes: MetadataRoute.Sitemap = [
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
      url: `${siteUrl}/services/one-way-taxi-raipur`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/one-way-taxi-korba`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/one-way-taxi-bilaspur`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/one-way-taxi-raigarh`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/one-way-taxi-jharsuguda`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/one-way-taxi-ambikapur`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/one-way-taxi-jagdalpur`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/one-way-taxi-durg-bhilai`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/puri-to-raipur-cab-one-way-taxi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // Old Static Route Pages
    {
      url: `${siteUrl}/routes/raipur-to-korba-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/routes/chakarbhata-airport-to-korba-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/routes/korba-to-chakarbhata-airport-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/routes/bilaspur-to-raipur-airport-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/routes/raipur-airport-to-bilaspur-taxi`,
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
    {
      url: `${siteUrl}/blog/deoghar-sawan-yatra-taxi-service`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 4. Combine and return all routes (Static + Dynamic)
  return [...staticRoutes, ...dynamicCabRoutes];

  // Generate 22 dynamic City Taxi pages
  const dynamicCityRoutes: MetadataRoute.Sitemap = HUBS.map((hub) => ({
    url: `${siteUrl}/taxi-service-in/${hub.toLowerCase()}`, // <-- Yahan '-' ki jagah '/' aayega
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));
}
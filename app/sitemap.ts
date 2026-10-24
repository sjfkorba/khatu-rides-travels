import type { MetadataRoute } from "next";

const siteUrl = "https://khaturidescg.in";

// ==========================================
// 1. MASTER DATA LISTS
// ==========================================
const HUBS = [
  "Korba", "Champa", "Kharsia", "Raigarh", "Katghora", "Dipka", 
  "Ambikapur", "Bilaspur", "Raipur", "Durg", "Bhilai", "Rajnandgaon", 
  "Jagdalpur", "Sambalpur", "Dhamtari", "Jharsuguda", "Ranchi", 
  "Patna", "Aourangabad", "Prayagraj", "Varanasi", "Ujjain"
];

const AIRPORTS = ["raipur-airport", "bilaspur-airport", "jharsuguda-airport"];

const TOURIST_ORIGINS = ["raipur", "bilaspur", "durg", "bhilai", "korba", "raigarh", "ambikapur", "jagdalpur"];
const TOURIST_DESTS = ["mainpat", "chitrakote", "dongargarh", "bhoramdeo", "amarkantak", "sirpur", "ratanpur", "bastar", "deoghar"];

const OUTSTATION_ORIGINS = ["raipur", "bilaspur", "durg", "bhilai", "korba", "raigarh", "ambikapur", "jagdalpur"];
const OUTSTATION_DESTS = ["nagpur", "jabalpur", "ranchi", "jharsuguda", "sambalpur", "varanasi", "prayagraj", "gondia", "patna", "bhubaneswar", "rourkela"];

// Cities for B2B, Rentals, and Weddings
const PREMIUM_HUBS = [
  "raipur", "bilaspur", "durg", "bhilai", "korba", "raigarh", 
  "ambikapur", "jagdalpur", "champa", "kharsia", "katghora"
];

// One-Way Taxi Cities (From your new One-Way page setup)
const ONE_WAY_CITIES = [
  "raipur", "bilaspur", "durg", "bhilai", "korba", "nagpur", 
  "jabalpur", "ranchi", "jharsuguda"
];

const createRouteSlug = (from: string, to: string) => `${from.toLowerCase()}-to-${to.toLowerCase()}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ==========================================
  // 2. GENERATE ALL DYNAMIC ROUTES
  // ==========================================

  // A. Cab Service Routes (Point to Point)
  const dynamicCabRoutes: MetadataRoute.Sitemap = [];
  for (let i = 0; i < HUBS.length; i++) {
    for (let j = 0; j < HUBS.length; j++) {
      if (i !== j) {
        dynamicCabRoutes.push({
          url: `${siteUrl}/cab-service/${createRouteSlug(HUBS[i], HUBS[j])}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  // B. City Taxi Pages
  const dynamicCityRoutes: MetadataRoute.Sitemap = HUBS.map((hub) => ({
    url: `${siteUrl}/taxi-service-in/${hub.toLowerCase()}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // C. Airport Transfer Routes (Both directions)
  const dynamicAirportRoutes: MetadataRoute.Sitemap = [];
  for (const hub of HUBS) {
    for (const airport of AIRPORTS) {
      dynamicAirportRoutes.push({
        url: `${siteUrl}/airport-taxi/${createRouteSlug(hub, airport)}`,
        lastModified: now, changeFrequency: "weekly", priority: 0.85,
      });
      dynamicAirportRoutes.push({
        url: `${siteUrl}/airport-taxi/${createRouteSlug(airport, hub)}`,
        lastModified: now, changeFrequency: "weekly", priority: 0.85,
      });
    }
  }

  // D. Tourist Routes
  const dynamicTouristRoutes: MetadataRoute.Sitemap = [];
  for (const origin of TOURIST_ORIGINS) {
    for (const dest of TOURIST_DESTS) {
      if (origin !== dest) {
        dynamicTouristRoutes.push({
          url: `${siteUrl}/tourist-taxi/${createRouteSlug(origin, dest)}`,
          lastModified: now, changeFrequency: "weekly", priority: 0.85,
        });
      }
    }
  }

  // E. Outstation Routes
  const dynamicOutstationRoutes: MetadataRoute.Sitemap = [];
  for (const origin of OUTSTATION_ORIGINS) {
    for (const dest of OUTSTATION_DESTS) {
      if (origin !== dest) {
        dynamicOutstationRoutes.push({
          url: `${siteUrl}/outstation-cabs/${createRouteSlug(origin, dest)}`,
          lastModified: now, changeFrequency: "weekly", priority: 0.85,
        });
      }
    }
  }

  // F. Corporate B2B Pages
  const dynamicCorporateRoutes: MetadataRoute.Sitemap = PREMIUM_HUBS.map((city) => ({
    url: `${siteUrl}/corporate-taxi/${city}`,
    lastModified: now, changeFrequency: "weekly", priority: 0.9,
  }));

  // G. Local Car Rental (Hourly) Pages
  const dynamicRentalRoutes: MetadataRoute.Sitemap = PREMIUM_HUBS.map((city) => ({
    url: `${siteUrl}/car-rental/${city}`,
    lastModified: now, changeFrequency: "weekly", priority: 0.85,
  }));

  // H. Wedding Taxi Pages
  const dynamicWeddingRoutes: MetadataRoute.Sitemap = PREMIUM_HUBS.map((city) => ({
    url: `${siteUrl}/wedding-taxi/${city}`,
    lastModified: now, changeFrequency: "monthly", priority: 0.8,
  }));

  // I. NEW: One-Way Taxi Routes (Both City-based and Route-based)
  const dynamicOneWayRoutes: MetadataRoute.Sitemap = [];
  
  // I.1. City-based One-Way (e.g., /one-way-taxi/raipur)
  for (const city of ONE_WAY_CITIES) {
    dynamicOneWayRoutes.push({
      url: `${siteUrl}/one-way-taxi/${city}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9, // High priority for top-level city drop pages
    });
  }

  // I.2. Route-based One-Way (e.g., /one-way-taxi/raipur-to-nagpur)
  for (const origin of ONE_WAY_CITIES) {
    for (const dest of ONE_WAY_CITIES) {
      if (origin !== dest) {
        dynamicOneWayRoutes.push({
          url: `${siteUrl}/one-way-taxi/${createRouteSlug(origin, dest)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }
  }


  // ==========================================
  // 3. EXISTING STATIC ROUTES
  // ==========================================
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact-us`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/terms-and-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/payment-terms`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    
    // Service Pages
    { url: `${siteUrl}/services/one-way-taxi-raipur`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/services/one-way-taxi-korba`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/services/one-way-taxi-bilaspur`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/services/one-way-taxi-raigarh`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/services/one-way-taxi-jharsuguda`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/services/one-way-taxi-ambikapur`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/services/one-way-taxi-jagdalpur`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/services/one-way-taxi-durg-bhilai`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/services/puri-to-raipur-cab-one-way-taxi`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Old Routes
    { url: `${siteUrl}/routes/raipur-to-korba-taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/routes/chakarbhata-airport-to-korba-taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/routes/korba-to-chakarbhata-airport-taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/routes/bilaspur-to-raipur-airport-taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/routes/raipur-airport-to-bilaspur-taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/routes/korba-to-raipur-taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/routes/raipur-to-bilaspur-taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/routes/bilaspur-to-raipur-taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/routes/raipur-to-raigarh-taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/routes/raigarh-to-raipur-taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/routes/raipur-airport-taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    // Blogs
    { url: `${siteUrl}/blog/raipur-to-korba-taxi-fare-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/deoghar-sawan-yatra-taxi-service`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // ==========================================
  // 4. COMBINE ALL ARRAYS INTO ONE RETURN
  // ==========================================
  return [
    ...staticRoutes, 
    ...dynamicCabRoutes, 
    ...dynamicCityRoutes,
    ...dynamicAirportRoutes,
    ...dynamicTouristRoutes,
    ...dynamicOutstationRoutes,
    ...dynamicCorporateRoutes,
    ...dynamicRentalRoutes,
    ...dynamicWeddingRoutes,
    ...dynamicOneWayRoutes // Added One-Way Routes here
  ];
}
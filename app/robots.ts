import type { MetadataRoute } from "next";

const siteUrl = "https://khaturidescg.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",       // Admin panel ko hide karne ke liye
        "/api/",         // API routes (jaise /api/send-enquiry) ko bots se bachane ke liye
        "/private/"      // Agar future me koi private folder banate hain
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
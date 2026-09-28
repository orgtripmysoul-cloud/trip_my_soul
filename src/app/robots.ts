import type { MetadataRoute } from "next";

import { BASE_URL } from "@/app/sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/auth",
        "/dashboard",
        "/login",
        "/signup",
        "/checkout",
        "/pay",
        "/api",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

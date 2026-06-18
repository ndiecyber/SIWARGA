import type { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoConfig.name,
    short_name: seoConfig.shortName,
    description: seoConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2f908f",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

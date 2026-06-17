const DEFAULT_SITE_URL = "http://localhost:3000";

function resolveSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.APP_URL ??
    process.env.SITE_URL ??
    process.env.BETTER_AUTH_URL ??
    DEFAULT_SITE_URL;

  const normalizedUrl = configuredUrl.trim().replace(/\/$/, "");

  try {
    return new URL(normalizedUrl);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export const seoConfig = {
  name: "SIWARGA",
  shortName: "SIWARGA",
  description:
    "Portal digital untuk warga dan pengurus RT 04 Arjamukti dalam mengelola iuran, data warga, pengumuman, dan laporan lingkungan secara terpadu.",
  keywords: [
    "SIWARGA",
    "sistem informasi warga",
    "portal warga",
    "administrasi RT",
    "pengumuman RT",
    "iuran warga",
    "RT 04 Arjamukti",
    "Perum Arjamukti Kencana Raya",
    "Tasikmalaya",
  ],
  ogImage: "/images/arjamukti.png",
  locale: "id_ID",
} as const;

export function getSiteUrl() {
  return resolveSiteUrl();
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

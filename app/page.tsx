import type { Metadata } from "next";
import PublicLayout from "@/components/layouts/public-layout";
import LandingPage from "@/features/landing/pages/landing-page";
import { absoluteUrl, seoConfig } from "@/lib/seo";

const homeTitle = "Portal Digital Warga RT 04 Arjamukti";
const homeDescription =
  "SIWARGA membantu warga dan pengurus RT 04 Arjamukti mengelola iuran, pengumuman, data warga, dan informasi lingkungan dalam satu portal digital yang rapi dan transparan.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  keywords: [
    ...seoConfig.keywords,
    "portal RT 04 Arjamukti",
    "sistem informasi RT Tasikmalaya",
  ],
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: "/",
    images: [seoConfig.ogImage],
  },
  twitter: {
    title: homeTitle,
    description: homeDescription,
    images: [seoConfig.ogImage],
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.name,
    url: absoluteUrl("/"),
    description: homeDescription,
    inLanguage: "id-ID",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo/logo-versi-1.png"),
    description: homeDescription,
    areaServed: "Tasikmalaya, Jawa Barat, Indonesia",
  },
];

export default function Home() {
  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPage />
    </PublicLayout>
  );
}

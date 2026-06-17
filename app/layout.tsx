import type { Metadata } from "next";
import { Fraunces, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/providers/react-query-provider";
import { getSiteUrl, seoConfig } from "@/lib/seo";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const jakartaPlus = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: seoConfig.name,
    template: `%s | ${seoConfig.name}`,
  },
  description: seoConfig.description,
  applicationName: seoConfig.name,
  keywords: [...seoConfig.keywords],
  creator: seoConfig.name,
  publisher: seoConfig.name,
  category: "community management",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: seoConfig.locale,
    siteName: seoConfig.name,
    title: seoConfig.name,
    description: seoConfig.description,
    images: [seoConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.name,
    description: seoConfig.description,
    images: [seoConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        outfit.variable,
        fraunces.variable,
        jakartaPlus.variable,
        "h-full antialiased font-sans",
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

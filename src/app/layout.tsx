import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://indiartodev.vercel.app";

const googleVerificationRaw =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  "VOg_OWFRaVYnJvwO-Q2qmz8Ky_SvzYvktqk4DR92Hvw";
const googleVerification = googleVerificationRaw
  .replace(/^google-site-verification=/i, "")
  .replace(/.*content=["']([^"']+)["'].*/i, "$1")
  .trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Danendra Athallah Indiarto | Junior Backend Developer",
    template: "%s | Danendra Athallah Indiarto",
  },
  description:
    "Portofolio profesional Danendra Athallah Indiarto - Junior Backend Developer yang berfokus pada perancangan RESTful API, pengelolaan database MySQL & PostgreSQL di dalam Docker, Directus, Node-RED, serta manajemen server Linux Ubuntu dan PM2.",
  applicationName: "Danendra Athallah Indiarto Portfolio",
  authors: [{ name: "Danendra Athallah Indiarto", url: siteUrl }],
  creator: "Danendra Athallah Indiarto",
  publisher: "Danendra Athallah Indiarto",
  keywords: [
    "Danendra Athallah Indiarto",
    "Danendra Athallah",
    "Danendra Indiarto",
    "Junior Backend Developer",
    "Backend Developer Indonesia",
    "Backend Developer Malang",
    "Node.js Developer",
    "Express.js Developer",
    "NestJS Developer",
    "PostgreSQL Docker",
    "Docker",
    "Directus",
    "Node-RED",
    "MySQL Database",
    "RESTful API",
    "Linux Ubuntu Server",
    "PM2 Process Manager",
    "GitHub Actions CI/CD",
    "Supabase",
    "Portofolio Backend Developer",
    "Web Developer Malang",
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/icon.svg?v=2",
        type: "image/svg+xml",
      },
      {
        url: "/icon.png?v=2",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-light.png?v=2",
        sizes: "192x192",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon.ico?v=2",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/icon.png?v=2",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Danendra Athallah Indiarto Portfolio",
    title: "Danendra Athallah Indiarto | Junior Backend Developer",
    description:
      "Portofolio profesional Danendra Athallah Indiarto - Junior Backend Developer. Spesialisasi perancangan RESTful API yang efisien, arsitektur database MySQL, dan manajemen server Linux Ubuntu serta PM2.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Danendra Athallah Indiarto | Junior Backend Developer",
    description:
      "Portofolio profesional Danendra Athallah Indiarto - Junior Backend Developer. Mengkhususkan diri pada RESTful API, database MySQL, server Linux Ubuntu, dan PM2.",
    creator: "@danendra",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(googleVerification
    ? {
        verification: {
          google: googleVerification,
        },
      }
    : {}),
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Danendra Athallah Indiarto",
        alternateName: ["Danendra Athallah", "Danendra"],
        jobTitle: "Junior Backend Developer",
        description:
          "Danendra Athallah Indiarto - Junior Backend Developer yang berfokus pada perancangan RESTful API efisien, database MySQL, dan manajemen server Linux Ubuntu & PM2.",
        url: siteUrl,
        sameAs: [
          "https://github.com",
          "https://linkedin.com",
          "https://instagram.com",
        ],
        knowsAbout: [
          "Node.js",
          "NestJS",
          "Express.js",
          "PostgreSQL",
          "MySQL",
          "Docker",
          "Directus",
          "Node-RED",
          "RESTful API",
          "Linux Ubuntu",
          "PM2",
          "GitHub Actions CI/CD",
          "Supabase",
          "TypeScript",
          "Database Normalization",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Malang",
          addressRegion: "Jawa Timur",
          addressCountry: "ID",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Danendra Athallah Indiarto",
        url: "https://indiartodev.vercel.app/",
        description:
          "Portofolio resmi Danendra Athallah Indiarto - Junior Backend Developer.",
        publisher: {
          "@id": `${siteUrl}/#person`,
        },
        inLanguage: "id-ID",
      },
    ],
  };

  const themeInitScript = `(function(){try{var saved=localStorage.getItem('portfolio_theme');var theme=saved==='light'||saved==='dark'?saved:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=theme;document.documentElement.classList.toggle('dark',theme==='dark');}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.classList.add('dark');}})();`;

  return (
    <html
      lang="id"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth dark`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased selection:bg-indigo-500/25 selection:text-indigo-400">
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}

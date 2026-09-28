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
    "Portofolio profesional Danendra Athallah Indiarto - Junior Backend Developer yang berfokus pada perancangan RESTful API yang efisien, pengelolaan database MySQL, serta manajemen server menggunakan Linux Ubuntu dan PM2.",
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
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
          "MySQL",
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
        url: siteUrl,
        name: "Danendra Athallah Indiarto - Junior Backend Developer Portfolio",
        description:
          "Portofolio resmi Danendra Athallah Indiarto - Junior Backend Developer.",
        publisher: {
          "@id": `${siteUrl}/#person`,
        },
        inLanguage: "id-ID",
      },
    ],
  };

  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#070b12] text-slate-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Subtle Cyber Grid & Ambient Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}

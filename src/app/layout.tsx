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

export const metadata: Metadata = {
  title: "Danendra Athallah Indiarto | Junior Backend Developer Portfolio",
  description: "Portofolio profesional Danendra Athallah Indiarto - Junior Backend Developer yang berfokus pada perancangan RESTful API yang efisien, pengelolaan database MySQL, serta manajemen server menggunakan Linux Ubuntu dan PM2.",
  keywords: [
    "Danendra Athallah Indiarto",
    "Junior Backend Developer",
    "Node.js",
    "Express.js",
    "NestJS",
    "MySQL",
    "Linux Ubuntu",
    "PM2",
    "GitHub Actions",
    "Web Developer Malang"
  ],
  authors: [{ name: "Danendra Athallah Indiarto" }],
  openGraph: {
    title: "Danendra Athallah Indiarto | Junior Backend Developer",
    description: "Perancangan RESTful API yang efisien, pengelolaan database MySQL, serta manajemen server menggunakan Linux Ubuntu dan PM2.",
    type: "website",
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
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth dark`}
    >
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

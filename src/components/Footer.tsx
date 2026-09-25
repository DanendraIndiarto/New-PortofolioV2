"use client";

import Link from "next/link";
import { Database, Shield, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-900 bg-[#05080e] py-12 relative z-10 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">

          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                Danendra Indiarto<span className="text-emerald-400">.dev</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Junior Backend Developer &amp; Database Management
              </div>
            </div>
          </div>

          {/* System Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold">MYSQL DATABASE ACTIVE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Server Online (Ubuntu &amp; PM2)</span>
          </div>

          {/* Admin link & Back to Top */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Portal</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Kembali ke atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            &copy; 2026 Danendra Athallah Indiarto. Built with Next.js App Router, Tailwind CSS &amp; Supabase.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <Link href="#about" className="hover:text-emerald-400 transition-colors">Tentang</Link>
            <Link href="#tech-stack" className="hover:text-emerald-400 transition-colors">Tech Stack</Link>
            <Link href="#projects" className="hover:text-emerald-400 transition-colors">Proyek</Link>
            <Link href="#certificates" className="hover:text-emerald-400 transition-colors">Sertifikat</Link>
            <Link href="#contact" className="hover:text-emerald-400 transition-colors">Kontak</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

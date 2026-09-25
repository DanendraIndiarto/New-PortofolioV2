"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Database, Shield, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Tentang", href: "#about" },
    { name: "Tech Stack", href: "#tech-stack" },
    { name: "Pengalaman", href: "#experience" },
    { name: "Proyek", href: "#projects" },
    { name: "Sertifikat", href: "#certificates" },
    { name: "Kontak", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "py-2.5 bg-[#070b12]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40"
        : "py-4 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* SISI KIRI: Brand & Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 group-hover:scale-105 transition-all shrink-0">
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 font-mono text-sm sm:text-base font-bold text-white tracking-tight">
                <span>Danendra Indiarto</span>
                <span className="text-emerald-400">.dev</span>
              </div>
              <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono tracking-tight truncate">
                Junior Backend Developer &amp; Database Management
              </span>
            </div>
          </Link>

          {/* SISI TENGAH: Menu Navigasi Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/70 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 rounded-full transition-all whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* SISI KANAN: Status DB & Tombol Admin (Desktop & Mobile) */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Status Pill - Hanya tampil di desktop (lg) agar tidak bertumpuk */}
            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden xl:inline">MySQL Database Active &amp; Server Online</span>
              <span className="xl:hidden">MySQL Active</span>
            </div>

            {/* Tombol Admin Desktop */}
            <Link
              href="/admin"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg transition-all whitespace-nowrap"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin</span>
            </Link>

            {/* Tombol Admin Mobile / Tablet */}
            <Link
              href="/admin"
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-colors"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
            </Link>

            {/* Tombol Hamburger Mobile / Tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 mx-4 p-4 bg-[#0a0f1d] border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 rounded-xl transition-all"
              >
                {link.name}
              </Link>
            ))}

            {/* Status sistem di dalam menu mobile */}
            <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                MySQL Active &amp; Server Online
              </span>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
              >
                Admin <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

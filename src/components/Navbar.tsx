"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { BrandLogo } from "@/components/Icons";
import { Profile } from "@/types";

interface NavbarProps {
  profile?: Profile;
}

function subscribeTheme(onStoreChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === "portfolio_theme" && (e.newValue === "light" || e.newValue === "dark")) {
      document.documentElement.dataset.theme = e.newValue;
      document.documentElement.classList.toggle("dark", e.newValue === "dark");
      onStoreChange();
    }
  };
  window.addEventListener("portfolio_theme_change", onStoreChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("portfolio_theme_change", onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getThemeSnapshot(): "dark" | "light" {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): "dark" | "light" {
  return "dark";
}

export default function Navbar({ profile }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("portfolio_theme", next);
    } catch {}
    window.dispatchEvent(new Event("portfolio_theme_change"));
  };

  const navLinks = [
    { name: "Tentang", href: "#about" },
    { name: "Keahlian", href: "#tech-stack" },
    { name: "Proyek", href: "#projects" },
    { name: "Sertifikat", href: "#certificates" },
    { name: "Kontak", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "px-3 sm:px-6 pt-2.5" : "px-3 sm:px-6 pt-4"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`prism-card rounded-2xl px-4 sm:px-5 h-15 flex items-center justify-between gap-3 transition-all ${
            scrolled ? "shadow-xl" : ""
          }`}
        >
          {/* Left: Adaptive Cyber Wing DI Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group cursor-pointer"
          >
            <BrandLogo className="w-9 h-9 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-[var(--prism-ink)]">
                DanendraIndiarto<span className="prism-grad-text">.dev</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono tracking-tight truncate text-[var(--prism-ink-muted)]">
                {profile?.title || "Junior Backend Developer"}
              </span>
            </div>
          </Link>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-[var(--prism-ink-soft)] hover:text-[var(--prism-ink)] hover:bg-[var(--prism-surface-soft)] transition-colors whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right: Theme Switch + CTA + Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Ganti tema gelap atau terang"
              title={
                theme === "dark"
                  ? "Beralih ke Mode Terang"
                  : "Beralih ke Mode Gelap"
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] text-xs font-mono font-semibold hover:border-[var(--prism-border-strong)] transition-colors cursor-pointer"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Gelap</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Terang</span>
                </>
              )}
            </button>

            <Link
              href="#contact"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold prism-grad-btn whitespace-nowrap"
            >
              Hire Me
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 prism-card rounded-2xl space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-semibold rounded-xl text-[var(--prism-ink-soft)] hover:text-[var(--prism-ink)] hover:bg-[var(--prism-surface-soft)] transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-[var(--prism-border)] flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-[var(--prism-ink-muted)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Backend · Docker · DB Online
              </span>
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold prism-grad-btn"
              >
                Hubungi Saya
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

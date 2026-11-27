"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { BrandLogo } from "@/components/Icons";
import { Profile } from "@/types";

interface FooterProps {
  profile?: Profile;
}

export default function Footer({ profile }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 pt-6 pb-12 text-xs font-mono">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="h-px w-full mb-8 opacity-40"
          style={{ background: "var(--prism-grad-btn)" }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[var(--prism-border)]">
          {/* Adaptive Logo & Identity */}
          <div className="flex items-center gap-3">
            <BrandLogo className="w-9 h-9 rounded-xl shrink-0" />
            <div>
              <div className="font-bold text-sm text-[var(--prism-ink)]">
                DanendraIndiarto<span className="prism-grad-text">.dev</span>
              </div>
              <div className="text-[11px] text-[var(--prism-ink-muted)]">
                {profile?.tagline ||
                  profile?.title ||
                  "Junior Backend Developer & Database Management"}
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full prism-card text-[var(--prism-ink-soft)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-semibold text-[var(--prism-ink)]">
              BACKEND READY
            </span>
            <span className="opacity-35">|</span>
            <span>Docker · PostgreSQL · MySQL · Ubuntu</span>
          </div>

          {/* Back to Top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="prism-card prism-card-hover px-4 py-2 rounded-xl text-[var(--prism-ink)] flex items-center gap-2 font-semibold cursor-pointer"
            title="Kembali ke atas"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5 text-[var(--prism-accent)]" />
          </button>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[var(--prism-ink-muted)]">
          <div>
            &copy; {new Date().getFullYear()}{" "}
            <strong className="text-[var(--prism-ink)]">
              {profile?.name || "Danendra Athallah Indiarto"}
            </strong>
            . Built with Next.js App Router, Tailwind CSS &amp; Supabase.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[var(--prism-ink-soft)]">
            <Link
              href="#about"
              className="hover:text-[var(--prism-ink)] transition-colors"
            >
              Tentang
            </Link>
            <Link
              href="#tech-stack"
              className="hover:text-[var(--prism-ink)] transition-colors"
            >
              Keahlian
            </Link>
            <Link
              href="#projects"
              className="hover:text-[var(--prism-ink)] transition-colors"
            >
              Proyek
            </Link>
            <Link
              href="#certificates"
              className="hover:text-[var(--prism-ink)] transition-colors"
            >
              Sertifikat
            </Link>
            <Link
              href="#contact"
              className="hover:text-[var(--prism-ink)] transition-colors"
            >
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

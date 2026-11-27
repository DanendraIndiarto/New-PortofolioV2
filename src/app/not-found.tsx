"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Sun, Moon, Home, FolderGit2, Mail } from "lucide-react";
import { BrandLogo } from "@/components/Icons";

function subscribeTheme(onStoreChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (
      e.key === "portfolio_theme" &&
      (e.newValue === "light" || e.newValue === "dark")
    ) {
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

export default function NotFound() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("portfolio_theme", next);
    } catch {}
    window.dispatchEvent(new Event("portfolio_theme_change"));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8">
      {/* Top Minimal Bar */}
      <header className="max-w-5xl w-full mx-auto">
        <div className="prism-card rounded-2xl px-4 sm:px-5 h-15 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandLogo className="w-9 h-9 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-[var(--prism-ink)]">
              DanendraIndiarto<span className="prism-grad-text">.dev</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Ganti tema gelap atau terang"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] text-xs font-mono font-semibold hover:border-[var(--prism-border-strong)] transition-colors cursor-pointer"
          >
            {theme === "light" ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Gelap</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Terang</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Center Prism Studio 404 Stage */}
      <main className="max-w-5xl w-full mx-auto my-10">
        <div className="prism-card rounded-3xl overflow-hidden">
          <div
            className="h-1.5 w-full"
            style={{ background: "var(--prism-grad-btn)" }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left 7 Cols: Message & Navigation */}
            <div className="lg:col-span-7 p-7 sm:p-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-xs font-mono font-bold text-[var(--prism-accent)]">
                <Compass className="w-3.5 h-3.5" />
                <span>HTTP 404 · ROUTE NOT FOUND</span>
              </div>

              <div>
                <div className="text-6xl sm:text-7xl font-black tracking-tighter prism-grad-text leading-none">
                  404
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--prism-ink)] mt-3">
                  Halaman Tidak Ditemukan
                </h1>
                <p className="text-sm text-[var(--prism-ink-soft)] leading-relaxed mt-2.5 max-w-lg">
                  Alamat URL yang Anda masukkan tidak tersedia, sudah
                  dipindahkan, atau tidak memiliki akses publik. Silakan kembali
                  ke halaman utama atau pilih bagian portofolio di bawah.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/"
                  className="prism-grad-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Beranda</span>
                </Link>

                <Link
                  href="/#projects"
                  className="prism-card prism-card-hover inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-[var(--prism-ink)]"
                >
                  <FolderGit2 className="w-4 h-4 text-[var(--prism-accent)]" />
                  <span>Lihat Proyek</span>
                </Link>

                <Link
                  href="/#contact"
                  className="prism-card prism-card-hover inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-[var(--prism-ink)]"
                >
                  <Mail className="w-4 h-4 text-[var(--prism-accent-2)]" />
                  <span>Kontak</span>
                </Link>
              </div>
            </div>

            {/* Right 5 Cols: Backend Diagnostic Console */}
            <div
              className="lg:col-span-5 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-[var(--prism-border)] flex flex-col justify-center"
              style={{ background: "var(--prism-grad-proj-1)" }}
            >
              <div
                className="rounded-2xl overflow-hidden border border-white/10 shadow-xl"
                style={{
                  background: "var(--prism-code-bg)",
                  color: "var(--prism-code-ink)",
                }}
              >
                <div
                  className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400"
                  style={{ background: "var(--prism-code-surface)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span>router.response.json</span>
                </div>

                <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto m-0">
                  <code>{`{
  "status": 404,
  "error": "Not Found",
  "message": "Endpoint tidak tersedia",
  "redirect": {
    "home": "/",
    "projects": "/#projects",
    "contact": "/#contact"
  }
}`}</code>
                </pre>

                <div className="px-4 py-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-white/[0.02]">
                  <span className="inline-flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-indigo-400" />
                    indiartodev.vercel.app
                  </span>
                  <span className="text-rose-400 font-semibold">404</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Minimal Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs font-mono text-[var(--prism-ink-muted)]">
        &copy; {new Date().getFullYear()} Danendra Athallah Indiarto ·
        DanendraIndiarto.dev
      </footer>
    </div>
  );
}

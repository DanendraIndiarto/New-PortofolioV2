"use client";

import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  actionHref?: string;
  actionLabel?: string;
  onClose: () => void;
}

export default function ImageLightbox({
  src,
  alt,
  title,
  subtitle,
  badge,
  actionHref,
  actionLabel,
  onClose,
}: ImageLightboxProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || alt}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full rounded-3xl overflow-hidden border border-[var(--prism-border)] shadow-2xl"
        style={{ background: "var(--prism-surface-solid)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1.5 w-full"
          style={{ background: "var(--prism-grad-btn)" }}
        />

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[var(--prism-border)] flex items-start justify-between gap-4">
          <div className="min-w-0">
            {badge && (
              <span className="inline-block text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-accent)] mb-1.5">
                {badge}
              </span>
            )}
            {title && (
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--prism-ink)] leading-snug truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs font-mono text-[var(--prism-ink-muted)] mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup tampilan foto"
            className="p-2 rounded-xl bg-[var(--prism-surface-soft)] text-[var(--prism-ink-soft)] hover:text-[var(--prism-ink)] border border-[var(--prism-border)] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Crisp Full-Resolution Image Container */}
        <div className="p-3 sm:p-5 bg-[var(--prism-surface-soft)] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="eager"
            decoding="sync"
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-md"
          />
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[var(--prism-border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span className="text-[var(--prism-ink-muted)]">
            Tekan ESC atau klik luar foto untuk menutup
          </span>

          <div className="flex items-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] hover:border-[var(--prism-border-strong)] transition-colors"
            >
              Buka Resolusi Asli
            </a>
            {actionHref && (
              <a
                href={actionHref}
                target="_blank"
                rel="noreferrer"
                className="prism-grad-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold"
              >
                <span>{actionLabel || "Buka Tautan"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

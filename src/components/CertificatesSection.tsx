"use client";

import { useState } from "react";
import { Award, ExternalLink, Calendar, ShieldCheck, ZoomIn } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";
import { Certificate } from "@/types";

interface CertificatesSectionProps {
  certificates: Certificate[];
}

const FALLBACK_CERT_IMG =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80";

export default function CertificatesSection({
  certificates,
}: CertificatesSectionProps) {
  const [activeModalCert, setActiveModalCert] = useState<Certificate | null>(
    null
  );

  return (
    <section id="certificates" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest prism-grad-text mb-2">
              03 // SERTIFIKASI &amp; LISENSI
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--prism-ink)]">
              Kompetensi Terverifikasi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--prism-ink-muted)] max-w-sm">
            Validasi kompetensi dalam pengembangan backend, basis data
            relasional, algoritma, dan administrasi server Linux.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl prism-card max-w-xl mx-auto">
            <Award className="w-10 h-10 text-[var(--prism-ink-muted)] mx-auto mb-3" />
            <p className="text-[var(--prism-ink-muted)] text-sm font-mono">
              Daftar sertifikat akan segera diperbarui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="prism-card prism-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Crisp Uncropped Full Certificate Frame */}
                  <button
                    type="button"
                    onClick={() => setActiveModalCert(cert)}
                    title="Klik untuk memperbesar sertifikat"
                    className="relative w-full aspect-[16/11] overflow-hidden bg-[var(--prism-surface-soft)] border-b border-[var(--prism-border)] cursor-pointer text-left flex items-center justify-center p-3 group/cert"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cert.image_url || FALLBACK_CERT_IMG}
                      alt={cert.title}
                      loading="lazy"
                      className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-sm"
                    />
                    <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/65 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-white bg-black/70 px-2.5 py-1 rounded-md">
                      <ZoomIn className="w-3 h-3" />
                      <span>Klik perbesar</span>
                    </div>
                  </button>

                  {/* Certificate Details */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-accent)]">
                        <Calendar className="w-3 h-3" />
                        {cert.issue_date}
                      </span>
                    </div>

                    <h3
                      onClick={() => setActiveModalCert(cert)}
                      className="text-base sm:text-lg font-extrabold tracking-tight text-[var(--prism-ink)] leading-snug mb-1 cursor-pointer hover:underline"
                    >
                      {cert.title}
                    </h3>
                    <p className="text-xs font-mono text-[var(--prism-ink-muted)] mb-3.5">
                      {cert.issuer}
                    </p>

                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-ink-soft)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-4 border-t border-[var(--prism-border)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalCert(cert)}
                    className="text-xs font-mono font-semibold text-[var(--prism-ink-soft)] hover:text-[var(--prism-ink)] cursor-pointer"
                  >
                    Perbesar Sertifikat
                  </button>

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold prism-grad-text hover:underline"
                    >
                      <span>Verifikasi</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--prism-accent)]" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeModalCert && (
        <ImageLightbox
          src={activeModalCert.image_url || FALLBACK_CERT_IMG}
          alt={activeModalCert.title}
          title={activeModalCert.title}
          subtitle={`ID: ${activeModalCert.id}`}
          badge={`${activeModalCert.issuer} · ${activeModalCert.issue_date}`}
          actionHref={activeModalCert.credential_url}
          actionLabel="Buka Verifikasi Asli"
          onClose={() => setActiveModalCert(null)}
        />
      )}
    </section>
  );
}

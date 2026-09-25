"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ExternalLink, Calendar, ShieldCheck, X } from "lucide-react";
import { Certificate } from "@/types";

interface CertificatesSectionProps {
  certificates: Certificate[];
}

export default function CertificatesSection({ certificates }: CertificatesSectionProps) {
  const [activeModalCert, setActiveModalCert] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-24 relative border-t border-slate-900 bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>04 // SERTIFIKASI &amp; LISENSI RESMI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Sertifikasi &amp; <span className="text-gradient-emerald">Lisensi Terverifikasi</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Validasi kompetensi resmi dari berbagai platform terkemuka dalam pengembangan backend, basis data, dan pemecahan masalah (problem solving).
          </p>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl glass-card border border-slate-800 max-w-xl mx-auto">
            <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-mono mb-2">Belum ada sertifikat yang ditampilkan.</p>
            <Link
              href="/admin"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono underline"
            >
              + Tambah sertifikat baru melalui Admin Portal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-emerald-500/40 flex flex-col justify-between group transition-all"
              >
                <div>
                  {/* Certificate Preview Image */}
                  <div 
                    onClick={() => setActiveModalCert(cert)}
                    className="relative w-full h-44 bg-slate-900 overflow-hidden cursor-pointer group-hover:opacity-90"
                  >
                    <Image
                      src={cert.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80"}
                      alt={cert.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
                    
                    <div className="absolute top-3 right-3 bg-slate-950/80 border border-slate-800 p-1.5 rounded-lg text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>

                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                      Klik untuk preview
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Diterbitkan: {cert.issue_date}</span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight mb-1 group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mb-4">
                      {cert.issuer}
                    </p>

                    {/* Skills tags */}
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {cert.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 pt-0">
                  {cert.credential_url ? (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-emerald-400 border border-slate-800 hover:border-emerald-500/40 transition-colors"
                    >
                      <span>Verifikasi Kredensial</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      onClick={() => setActiveModalCert(cert)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-800 transition-colors"
                    >
                      <span>Lihat Sertifikat</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for full certificate view */}
        {activeModalCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative max-w-3xl w-full bg-[#0e1524] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6">
              <button
                onClick={() => setActiveModalCert(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="pr-12">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    {activeModalCert.issuer} • {activeModalCert.issue_date}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">
                    {activeModalCert.title}
                  </h3>
                </div>

                <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <Image
                    src={activeModalCert.image_url}
                    alt={activeModalCert.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-400 font-mono">
                    ID: {activeModalCert.id}
                  </div>
                  {activeModalCert.credential_url && (
                    <a
                      href={activeModalCert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold font-mono transition-colors"
                    >
                      <span>Buka Verifikasi Asli</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

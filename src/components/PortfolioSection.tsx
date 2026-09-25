"use client";

import Image from "next/image";
import Link from "next/link";
import { FolderGit2, ExternalLink, Sparkles, Activity } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { Project } from "@/types";

interface PortfolioSectionProps {
  projects: Project[];
}

export default function PortfolioSection({ projects }: PortfolioSectionProps) {
  return (
    <section id="projects" className="py-24 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>03 // KARYA &amp; PROYEK PILIHAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Karya &amp; <span className="text-gradient-emerald">Proyek Backend</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Kumpulan proyek backend, pengelolaan database MySQL, konfigurasi server, serta otomatisasi deployment yang saya kembangkan.
          </p>
        </div>

        {/* Direct Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl glass-card border border-slate-800 max-w-xl mx-auto">
            <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-mono mb-2">Belum ada proyek yang ditampilkan.</p>
            <Link
              href="/admin"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono underline"
            >
              + Tambah proyek baru melalui Admin Portal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {projects.map((project, idx) => {
              const isWide = (idx % 3 === 0) || project.featured;
              return (
                <div
                  key={project.id}
                  className={`${
                    isWide ? "lg:col-span-8" : "lg:col-span-4"
                  } glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-emerald-500/40 flex flex-col justify-between group transition-all duration-300`}
                >
                  <div>
                    {/* Project Screenshot / Visual */}
                    <div className="relative w-full h-52 sm:h-64 overflow-hidden bg-slate-900 border-b border-slate-800/80">
                      <Image
                        src={project.image_url || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1421] via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-emerald-400 backdrop-blur-md">
                          {project.category || "Aplikasi Web"}
                        </span>
                        {project.featured && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Performance metrics pill if present */}
                      {project.metrics && (
                        <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/90 border border-emerald-500/30 text-emerald-300 text-xs font-mono backdrop-blur-md shadow-lg">
                          <Activity className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{project.metrics}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {project.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-6">
                        {project.tech_stack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-mono text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Links */}
                  <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white hover:underline transition-colors"
                        >
                          <GithubIcon className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                          <span>Repository</span>
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Preview / Demo</span>
                        </a>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-600">
                      #{project.id.slice(-4)}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Admin hint button */}
        <div className="mt-12 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 text-xs font-mono border border-slate-800 transition-colors"
          >
            <span>+ Kelola atau tambah proyek via Admin Dashboard</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

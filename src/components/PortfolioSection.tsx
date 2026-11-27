"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FolderGit2,
  ExternalLink,
  Sparkles,
  Activity,
  ZoomIn,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import ImageLightbox from "@/components/ImageLightbox";
import { Project } from "@/types";

interface PortfolioSectionProps {
  projects: Project[];
}

const GRAD_STAGES = [
  "var(--prism-grad-proj-1)",
  "var(--prism-grad-proj-2)",
  "var(--prism-grad-proj-3)",
];

const FALLBACK_PROJECT_IMG =
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80";

export default function PortfolioSection({ projects }: PortfolioSectionProps) {
  const [activeProjectImg, setActiveProjectImg] = useState<Project | null>(
    null
  );
  const [spotlightProject, ...otherProjects] = projects;

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest prism-grad-text mb-2">
              02 // PROYEK PILIHAN
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--prism-ink)]">
              Karya yang Dibangun untuk Produksi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--prism-ink-muted)] max-w-sm">
            Kumpulan proyek backend, database MySQL &amp; PostgreSQL, Docker,
            Directus, Node-RED, dan otomatisasi server Linux.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl prism-card max-w-xl mx-auto">
            <FolderGit2 className="w-10 h-10 text-[var(--prism-ink-muted)] mx-auto mb-3" />
            <p className="text-[var(--prism-ink-muted)] text-sm font-mono">
              Daftar proyek akan segera diperbarui.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Spotlight Project #01 */}
            {spotlightProject && (
              <article className="prism-card prism-card-hover rounded-3xl overflow-hidden group">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Left Visual Gradient Stage with Crisp Clickable Image */}
                  <div
                    className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between gap-4"
                    style={{ background: GRAD_STAGES[0] }}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full prism-card font-bold text-[var(--prism-ink)]">
                        <Sparkles className="w-3 h-3 text-[var(--prism-accent)]" />
                        FEATURED #01
                      </span>
                      <span className="font-semibold text-[var(--prism-ink-soft)]">
                        {spotlightProject.category || "Aplikasi Web"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveProjectImg(spotlightProject)}
                      title="Klik untuk melihat gambar proyek secara penuh"
                      className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--prism-border)] bg-[var(--prism-surface-solid)] shadow-lg cursor-pointer group/img block"
                    >
                      <Image
                        src={
                          spotlightProject.image_url || FALLBACK_PROJECT_IMG
                        }
                        alt={spotlightProject.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover/img:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 text-white text-xs font-mono font-semibold">
                          <ZoomIn className="w-3.5 h-3.5" />
                          Lihat Penuh
                        </span>
                      </div>
                    </button>

                    {spotlightProject.metrics && (
                      <div className="inline-flex items-center gap-2 text-xs font-mono font-bold prism-grad-text">
                        <Activity className="w-3.5 h-3.5 text-[var(--prism-accent)]" />
                        <span>{spotlightProject.metrics}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Details */}
                  <div className="lg:col-span-7 p-7 sm:p-8 flex flex-col justify-between gap-6">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--prism-ink)] mb-3">
                        {spotlightProject.title}
                      </h3>
                      <p className="text-sm sm:text-base leading-relaxed text-[var(--prism-ink-soft)] mb-6">
                        {spotlightProject.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {spotlightProject.tech_stack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-xs font-mono px-3 py-1 rounded-lg bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-ink)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-5 border-t border-[var(--prism-border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex flex-wrap items-center gap-4">
                        {spotlightProject.github_url && (
                          <a
                            href={spotlightProject.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-[var(--prism-ink)] hover:underline"
                          >
                            <GithubIcon className="w-4 h-4" />
                            <span>Repository</span>
                          </a>
                        )}
                        {spotlightProject.demo_url && (
                          <a
                            href={spotlightProject.demo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold prism-grad-text hover:underline"
                          >
                            <ExternalLink className="w-4 h-4 text-[var(--prism-accent)]" />
                            <span>Live Preview / Demo</span>
                          </a>
                        )}
                      </div>
                      <span className="text-[var(--prism-ink-muted)]">
                        #{spotlightProject.id.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Secondary 2-Column Showcase Deck */}
            {otherProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherProjects.map((project, idx) => {
                  const stageGrad =
                    GRAD_STAGES[(idx + 1) % GRAD_STAGES.length];
                  const orderNum = String(idx + 2).padStart(2, "0");

                  return (
                    <article
                      key={project.id}
                      className="prism-card prism-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        {/* Gradient Header + Crisp Clickable Image */}
                        <div
                          className="p-5 space-y-4"
                          style={{ background: stageGrad }}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs font-mono">
                            <span className="px-2.5 py-1 rounded-full prism-card font-bold text-[var(--prism-ink)]">
                              #{orderNum} · {project.category || "Aplikasi Web"}
                            </span>
                            {project.featured && (
                              <span className="inline-flex items-center gap-1 font-semibold text-[var(--prism-accent)]">
                                <Sparkles className="w-3 h-3" />
                                Featured
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveProjectImg(project)}
                            title="Klik untuk melihat gambar proyek secara penuh"
                            className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--prism-border)] bg-[var(--prism-surface-solid)] shadow-md cursor-pointer group/img block"
                          >
                            <Image
                              src={project.image_url || FALLBACK_PROJECT_IMG}
                              alt={project.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center">
                              <span className="opacity-0 group-hover/img:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 text-white text-xs font-mono font-semibold">
                                <ZoomIn className="w-3.5 h-3.5" />
                                Lihat Penuh
                              </span>
                            </div>
                          </button>

                          {project.metrics && (
                            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold prism-grad-text">
                              <Activity className="w-3.5 h-3.5 text-[var(--prism-accent)]" />
                              <span>{project.metrics}</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-extrabold tracking-tight text-[var(--prism-ink)] mb-2">
                            {project.title}
                          </h3>
                          <p className="text-xs sm:text-sm leading-relaxed text-[var(--prism-ink-soft)] mb-5">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {project.tech_stack.map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-ink)]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Links */}
                      <div className="px-6 py-4 border-t border-[var(--prism-border)] flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-4">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 font-bold text-[var(--prism-ink)] hover:underline"
                            >
                              <GithubIcon className="w-4 h-4" />
                              <span>Repository</span>
                            </a>
                          )}
                          {project.demo_url && (
                            <a
                              href={project.demo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 font-bold prism-grad-text hover:underline"
                            >
                              <ExternalLink className="w-4 h-4 text-[var(--prism-accent)]" />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>
                        <span className="text-[var(--prism-ink-muted)]">
                          #{project.id.slice(-4)}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {activeProjectImg && (
        <ImageLightbox
          src={activeProjectImg.image_url || FALLBACK_PROJECT_IMG}
          alt={activeProjectImg.title}
          title={activeProjectImg.title}
          subtitle={activeProjectImg.metrics || activeProjectImg.category}
          badge={activeProjectImg.category || "PROYEK"}
          actionHref={activeProjectImg.demo_url || activeProjectImg.github_url}
          actionLabel={
            activeProjectImg.demo_url ? "Buka Live Demo" : "Buka Repository"
          }
          onClose={() => setActiveProjectImg(null)}
        />
      )}
    </section>
  );
}

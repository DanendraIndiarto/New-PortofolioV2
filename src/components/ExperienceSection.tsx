"use client";

import { Briefcase, Calendar, MapPin, CheckCircle2, ChevronRight } from "lucide-react";
import { Experience } from "@/types";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-24 relative border-t border-slate-900 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Briefcase className="w-3.5 h-3.5" />
            <span>02 // CAREER TIMELINE & ENGINEERING IMPACT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Pengalaman <span className="text-gradient-emerald">Kerja & Dampak</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Jejak rekam merancang, mengoptimalkan, dan mengoperasikan sistem backend pada lingkungan production berskala tinggi.
          </p>
        </div>

        {/* Experience Timeline Cards */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/40 before:via-slate-800 before:to-transparent before:-translate-x-1/2 hidden sm:block" />

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 hover:border-emerald-500/30 transition-all relative overflow-hidden group"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {exp.period}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {exp.type}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-400 font-mono mt-1">
                    <span className="text-emerald-400 font-semibold">{exp.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-500 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800/90 self-start lg:self-auto">
                  EXP_ID: #{index + 1}
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {exp.description}
              </p>

              {/* Key Achievements Bullet Points */}
              <div className="space-y-2 mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Key Accomplishments & Metrics:
                </div>
                {exp.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Technologies Applied */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
                <span className="text-xs font-mono text-slate-400 mr-1">Stack:</span>
                {exp.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-xs font-mono text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

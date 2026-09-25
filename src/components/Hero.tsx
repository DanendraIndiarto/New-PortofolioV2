"use client";

import Link from "next/link";
import { ArrowRight, Database, Server, Terminal, Cpu, GitBranch, CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/Icons";
import { Profile } from "@/types";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const cleanWaNumber = profile.whatsapp_number.replace(/\D/g, "");

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Single Main Column - Clean, Elegant & Modern */}
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-mono text-emerald-400 backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold">{profile.title}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Open for Opportunities &amp; Projects</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Membangun Solusi <span className="text-gradient-emerald">Backend &amp; Database MySQL</span> yang Efisien.
            </h1>
            <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl mx-auto">
              Halo, saya <span className="text-white font-semibold">{profile.name}</span>. Berfokus pada perancangan RESTful API yang efisien, pengelolaan database MySQL, serta manajemen server menggunakan Linux Ubuntu dan PM2.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02]"
            >
              <span>Jelajahi Proyek</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${cleanWaNumber}?text=Halo%20${encodeURIComponent(profile.name)},%20saya%20tertarik%20berdiskusi%20tentang%20proyek%20backend`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-sm transition-all hover:border-emerald-500/40"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              <span>Chat WhatsApp</span>
            </a>

            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3.5 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              <span>Hubungi Saya</span>
              <span className="text-emerald-400 font-mono">→</span>
            </Link>
          </div>

          {/* Bento Strip: Core Backend Focus */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full pt-8 max-w-4xl">
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-left">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-mono">MySQL Database</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Relational Schema &amp; SQL Query</div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-left">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-2">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-mono">Node.js &amp; NestJS</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Express.js &amp; Modular REST API</div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-left">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
                <Server className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-mono">Linux &amp; PM2</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Ubuntu Server &amp; Process Manager</div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                <GitBranch className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white font-mono">CI/CD Actions</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Automated Git Pipeline</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

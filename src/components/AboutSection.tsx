"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Database, 
  Server, 
  Cpu, 
  Terminal, 
  ExternalLink,
  MapPin,
  Mail,
  GitBranch,
  ShieldCheck,
  Code2
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, WhatsAppIcon } from "@/components/Icons";
import { Profile } from "@/types";

interface AboutSectionProps {
  profile: Profile;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);

  useEffect(() => {
    setAvatarUrl(profile.avatar_url);
  }, [profile.avatar_url]);

  const cleanWaNumber = profile.whatsapp_number.replace(/\D/g, "");

  // Tech stack filtered purely to Danendra's CV
  const techCategories = [
    {
      title: "Backend & Runtimes",
      icon: Terminal,
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/30",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      skills: [
        { name: "Node.js", desc: "Runtime JavaScript sisi server untuk eksekusi API asinkron yang cepat" },
        { name: "JavaScript (ES6+)", desc: "Pemrograman asynchronous, promises, callback, dan modularitas kode" },
        { name: "TypeScript", desc: "Penulisan kode berskala terstruktur dengan tipe data statis dan interface" },
      ],
    },
    {
      title: "Frameworks & REST API",
      icon: Code2,
      color: "from-teal-500/20 to-cyan-500/10",
      border: "border-teal-500/30",
      badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      skills: [
        { name: "Express.js", desc: "Framework minimalis untuk perancangan routing dan middleware RESTful API" },
        { name: "NestJS", desc: "Framework arsitektur modular enterprise berbasis controller, provider, dan DTO" },
        { name: "RESTful APIs", desc: "Desain endpoint standar HTTP methods, format respon JSON, dan status code" },
      ],
    },
    {
      title: "Database Management",
      icon: Database,
      color: "from-cyan-500/20 to-blue-500/10",
      border: "border-cyan-500/30",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      skills: [
        { name: "MySQL", desc: "Sistem basis data relasional, desain tabel relasional, dan integritas data" },
        { name: "SQL Querying", desc: "Penulisan query DDL/DML, JOIN multi-tabel, agregasi, dan indexing data" },
        { name: "Database Schema Design", desc: "Perancangan Entity Relationship Diagram (ERD) dan normalisasi database" },
      ],
    },
    {
      title: "Server, DevOps & Tools",
      icon: Server,
      color: "from-blue-500/20 to-indigo-500/10",
      border: "border-blue-500/30",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      skills: [
        { name: "Linux Ubuntu", desc: "Navigasi CLI Linux, manajemen file permission, dan konfigurasi server" },
        { name: "PM2 Process Manager", desc: "Pengelolaan proses aplikasi background, zero-downtime reload & auto-restart" },
        { name: "CI/CD GitHub Actions", desc: "Otomatisasi pengujian alur kerja Git dan proses deployment ke server" },
        { name: "Git & Version Control", desc: "Kolaborasi repository, branching, pull request, dan tracking revisi" },
        { name: "React & Next.js", desc: "Integrasi frontend web modern yang terkoneksi langsung dengan REST API" },
      ],
    },
  ];

  return (
    <section id="about" className="py-24 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>01 // PROFIL &amp; KEAHLIAN UTAMA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Tentang Saya &amp; <span className="text-gradient-emerald">Backend Ecosystem</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Mendedikasikan fokus pada perancangan API yang efisien, pengelolaan basis data relasional MySQL, dan manajemen server Linux yang stabil.
          </p>
        </div>

        {/* Bento Grid: Profile Card + Core Focus Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Bento Item 1: Profile Card with Dynamic Supabase Avatar */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-500" />

            <div>
              {/* Header with edit shortcut */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  {profile.title || "Junior Backend Developer"}
                </span>
                <Link
                  href="/admin"
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  Ubah Foto <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Photo & Identity */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                <div className="relative group/avatar">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-emerald-500/40 p-1 bg-slate-900 shadow-xl group-hover/avatar:border-emerald-400 transition-all duration-300">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-800">
                      <Image
                        src={avatarUrl || profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
                        alt={profile.name || "Foto Profil"}
                        fill
                        className="object-cover group-hover/avatar:scale-105 transition-transform duration-500"
                        unoptimized
                        onError={() => setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80")}
                      />
                    </div>
                  </div>
                  {/* Verified badge */}
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-lg shadow-md border-2 border-[#0e1524]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {profile.name}
                  </h3>
                  <p className="text-sm font-mono text-emerald-400 font-medium">
                    {profile.title}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1 pt-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{profile.location || "Malang, Indonesia"}</span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1 font-mono">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{profile.email}</span>
                  </p>
                </div>
              </div>

              {/* Bio Paragraph */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
                {profile.bio}
              </p>
            </div>

            {/* Social Media Buttons (WhatsApp, Instagram, GitHub, LinkedIn) */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Hubungi &amp; Media Sosial:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={`https://wa.me/${cleanWaNumber || "6282334027274"}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 transition-colors text-xs font-mono"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={profile.instagram_url || "https://instagram.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-pink-400 border border-slate-800 hover:border-pink-500/40 transition-colors text-xs font-mono"
                  title="Instagram"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram</span>
                </a>

                <a
                  href={profile.github_url || "https://github.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-600 transition-colors text-xs font-mono"
                  title="GitHub"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
                  <span>GitHub</span>
                </a>

                <a
                  href={profile.linkedin_url || "https://linkedin.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-blue-400 border border-slate-800 hover:border-blue-500/40 transition-colors text-xs font-mono"
                  title="LinkedIn"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bento Item 2: Core Engineering Pillars (MySQL, Node.js/NestJS/Express, Linux Ubuntu/PM2, GitHub Actions) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-white mb-2">
                  Pengelolaan Database MySQL
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Perancangan skema relasional, normalisasi tabel, penulisan query SQL terstruktur (DDL/DML), serta pemeliharaan integritas data aplikasi.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-[11px] text-emerald-400">
                Relational Schema &amp; Data Integrity
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
                  <Terminal className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-white mb-2">
                  Node.js (NestJS &amp; Express.js)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Membangun endpoint RESTful API modular yang bersih, routing middleware efisien, validasi data request, dan penanganan error terpusat.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-[11px] text-teal-400">
                Modular RESTful API Architecture
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                  <Server className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-white mb-2">
                  Linux Ubuntu &amp; PM2 Manager
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manajemen server VPS berbasis Linux Ubuntu, konfigurasi PM2 untuk memastikan service backend tetap hidup dengan auto-restart.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-[11px] text-cyan-400">
                Stable Server Process Uptime
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <GitBranch className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-white mb-2">
                  CI/CD Actions &amp; Git Workflow
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Otomatisasi pengujian alur kerja Git, manajemen branch repository, dan deployment otomatis menggunakan GitHub Actions ke server.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-[11px] text-blue-400">
                Automated Delivery Pipeline
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Tech Stack Showcase (Purely CV Tools) */}
        <div id="tech-stack" className="pt-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Backend Tech Ecosystem
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Keahlian teknologi backend, database MySQL, dan server tools yang dikuasai.
              </p>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs text-slate-500">
              [ CV Verified Tooling ]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techCategories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-5 flex flex-col border border-slate-800/80 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800/80">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-white font-mono">
                      {cat.title}
                    </h4>
                  </div>

                  <div className="space-y-3 flex-1">
                    {cat.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            {skill.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {skill.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Database,
  Server,
  Terminal,
  Wrench,
  MapPin,
  Mail,
  GitBranch,
  ShieldCheck,
  Code2,
  ZoomIn,
  Layers,
  Workflow,
  Box,
  Globe,
  Cloud,
  Cpu,
  HardDrive,
  Send,
} from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import ImageLightbox from "@/components/ImageLightbox";
import { Profile } from "@/types";

interface AboutSectionProps {
  profile: Profile;
}

const PERMANENT_AVATAR_URL =
  "https://ntffmjnovbjbcktcisoo.supabase.co/storage/v1/object/public/portfolio-assets/avatars/1790367455704-euqzo0.jpg";

export default function AboutSection({ profile }: AboutSectionProps) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const rawUrl =
    profile.avatar_url && !profile.avatar_url.includes("images.unsplash.com")
      ? profile.avatar_url
      : PERMANENT_AVATAR_URL;
  const avatarUrl = rawUrl || PERMANENT_AVATAR_URL;
  const cleanWaNumber = (profile.whatsapp_number || "").replace(/\D/g, "");

  const techCategories = [
    {
      id: "backend",
      title: "Backend Development",
      shortLabel: "Backend",
      icon: Terminal,
      skills: [
        {
          name: "Node.js",
          icon: Terminal,
          desc: "Runtime JavaScript sisi server untuk eksekusi API asinkron yang cepat dan skalabel",
        },
        {
          name: "TypeScript",
          icon: Code2,
          desc: "Penulisan kode backend terstruktur dengan sistem tipe statis yang aman",
        },
        {
          name: "JavaScript",
          icon: Code2,
          desc: "Pemrograman ES6+, asynchronous flow, promises, dan modularisasi layanan",
        },
        {
          name: "NestJS",
          icon: Layers,
          desc: "Framework backend modular berbasis controller, service, guard, dan DTO",
        },
        {
          name: "Express.js",
          icon: Terminal,
          desc: "Framework minimalis untuk routing, middleware, dan layanan RESTful API",
        },
        {
          name: "RESTful API",
          icon: Globe,
          desc: "Perancangan endpoint standar HTTP, autentikasi, validasi, dan format JSON konsisten",
        },
        {
          name: "Prisma ORM",
          icon: Database,
          desc: "Schema modeling, migrasi database, dan query type-safe ke database relasional",
        },
      ],
    },
    {
      id: "database",
      title: "Database & Low-Code / IoT",
      shortLabel: "Database & IoT",
      icon: Database,
      skills: [
        {
          name: "PostgreSQL",
          icon: Database,
          desc: "Database relasional open-source andal termasuk deployment di dalam container Docker",
        },
        {
          name: "MySQL",
          icon: Database,
          desc: "Pengelolaan basis data relasional, indexing, dan konsistensi transaksi data",
        },
        {
          name: "MariaDB",
          icon: Database,
          desc: "Administrasi server database relasional MariaDB untuk layanan web produksi",
        },
        {
          name: "Directus",
          icon: Layers,
          desc: "Headless CMS & data platform dengan akses API instan dan manajemen hak akses",
        },
        {
          name: "Node-RED",
          icon: Workflow,
          desc: "Flow-based programming untuk otomasi alur data, integrasi API, dan skenario IoT",
        },
        {
          name: "Database Design",
          icon: HardDrive,
          desc: "Perancangan ERD, normalisasi tabel, relasi foreign key, dan optimasi skema",
        },
      ],
    },
    {
      id: "devops",
      title: "Server & DevOps",
      shortLabel: "Server & DevOps",
      icon: Server,
      skills: [
        {
          name: "Ubuntu Linux",
          icon: Terminal,
          desc: "Administrasi server berbasis CLI, manajemen user, permission, dan systemd service",
        },
        {
          name: "Docker",
          icon: Box,
          desc: "Containerization layanan backend, database, dan dependensi aplikasi secara terisolasi",
        },
        {
          name: "Docker Compose",
          icon: Layers,
          desc: "Orkestrasi multi-container seperti PostgreSQL, Directus, Node-RED, dan API service",
        },
        {
          name: "Nginx",
          icon: Globe,
          desc: "Konfigurasi reverse proxy, virtual host, SSL/HTTPS, dan routing traffic produksi",
        },
        {
          name: "Apache2",
          icon: Globe,
          desc: "Pengelolaan web server Apache2, konfigurasi virtual host, dan modul server",
        },
        {
          name: "PM2",
          icon: Cpu,
          desc: "Process manager Node.js untuk daemon background, monitoring, dan zero-downtime reload",
        },
        {
          name: "Webmin",
          icon: Server,
          desc: "Administrasi sistem dan layanan server Linux melalui antarmuka web panel",
        },
        {
          name: "VirtualBox",
          icon: HardDrive,
          desc: "Simulasi mesin virtual server Linux untuk pengujian infrastruktur dan jaringan lokal",
        },
        {
          name: "VPS Management",
          icon: Server,
          desc: "Setup VPS dari nol, keamanan SSH, firewall, backup, dan pemeliharaan uptime",
        },
      ],
    },
    {
      id: "tools",
      title: "Tools & Workflow",
      shortLabel: "Tools & Workflow",
      icon: Wrench,
      skills: [
        {
          name: "Git",
          icon: GitBranch,
          desc: "Version control, manajemen branch, merge, dan pelacakan histori perubahan kode",
        },
        {
          name: "GitHub",
          icon: GitBranch,
          desc: "Kolaborasi repository, pull request, manajemen issue, dan otomasi GitHub Actions",
        },
        {
          name: "Postman",
          icon: Send,
          desc: "Pengujian endpoint REST API, manajemen environment, dan dokumentasi koleksi request",
        },
        {
          name: "Vercel",
          icon: Cloud,
          desc: "Deployment aplikasi Next.js/frontend cepat dengan preview otomatis per commit",
        },
        {
          name: "Railway",
          icon: Cloud,
          desc: "Hosting layanan backend, worker, dan database cloud yang praktis dan terintegrasi Git",
        },
        {
          name: "VS Code",
          icon: Code2,
          desc: "Code editor utama untuk pengembangan backend, debugging, dan integrasi terminal",
        },
      ],
    },
  ];

  const totalSkillsCount = techCategories.reduce(
    (sum, cat) => sum + cat.skills.length,
    0
  );

  const selectedCategoryObj =
    activeCategory === "all"
      ? null
      : techCategories.find((c) => c.id === activeCategory) || null;

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest prism-grad-text mb-2">
              01 // ARSITEKTUR &amp; PROFIL
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--prism-ink)]">
              Dirancang untuk Kecepatan &amp; Stabilitas
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--prism-ink-muted)] max-w-sm">
            Fokus pada RESTful API bersih, database MySQL &amp; PostgreSQL,
            containerization Docker, Directus, Node-RED, serta server Ubuntu
            &amp; PM2.
          </p>
        </div>

        {/* Asymmetric 12-Col Gradient Bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-16">
          {/* Bento 1 (7 Cols): Signature Rich Gradient Core Specialty */}
          <div
            className="md:col-span-7 rounded-3xl p-7 sm:p-8 text-white flex flex-col justify-between gap-6"
            style={{
              background: "var(--prism-grad-bento-main)",
              boxShadow: "var(--prism-shadow)",
            }}
          >
            <div className="flex items-center justify-between text-xs font-mono opacity-90">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                CORE SPECIALTY
              </span>
              <span>01 / BACKEND &amp; DB</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                RESTful API, Directus &amp; Database Relasional
              </h3>
              <p className="text-xs sm:text-sm text-white/85 mt-3 leading-relaxed">
                Perancangan skema relasional MySQL &amp; PostgreSQL (ERD &amp;
                normalisasi), integrasi Headless CMS Directus, serta routing
                middleware Express.js &amp; modul NestJS dengan validasi DTO dan
                penanganan error terpusat.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {[
                "Node.js",
                "NestJS",
                "Express.js",
                "Directus",
                "PostgreSQL",
                "MySQL",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-white/15 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bento 2 (5 Cols): Adaptive Gradient Docker & Server Tile */}
          <div
            className="md:col-span-5 rounded-3xl p-7 border border-[var(--prism-border)] flex flex-col justify-between gap-5"
            style={{
              background: "var(--prism-grad-bento-side)",
              boxShadow: "var(--prism-shadow)",
            }}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold prism-grad-text">
                02 / DOCKER &amp; VPS
              </span>
              <span className="text-[var(--prism-ink-muted)]">
                Docker · Ubuntu · PM2
              </span>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--prism-surface)] border border-[var(--prism-border)] flex items-center justify-center text-[var(--prism-accent)] mb-4">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-[var(--prism-ink)]">
                Docker Container, PostgreSQL &amp; Linux Ubuntu
              </h3>
              <p className="text-xs sm:text-sm mt-2 leading-relaxed text-[var(--prism-ink-soft)]">
                Menjalankan PostgreSQL, Directus, dan service backend secara
                terisolasi di dalam Docker container, dipadukan manajemen VPS
                Ubuntu &amp; PM2 agar layanan stabil.
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--prism-border)] flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--prism-ink-muted)]">
                Container Ops
              </span>
              <span className="font-bold text-[var(--prism-accent-3)]">
                Docker &amp; PM2 Ready
              </span>
            </div>
          </div>

          {/* Bento 3 (5 Cols): Node-RED & CI/CD Automation */}
          <div className="md:col-span-5 prism-card prism-card-hover rounded-3xl p-7 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold prism-grad-text">
                03 / FLOW &amp; CI/CD
              </span>
              <GitBranch className="w-4 h-4 text-[var(--prism-accent)]" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[var(--prism-ink)]">
                Node-RED Automation &amp; GitHub Actions
              </h3>
              <p className="text-xs sm:text-sm mt-2 leading-relaxed text-[var(--prism-ink-soft)]">
                Membangun alur integrasi data &amp; otomasi workflow dengan
                Node-RED serta pipeline CI/CD GitHub Actions untuk deployment
                otomatis ke server.
              </p>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-xs font-mono text-[var(--prism-ink-soft)]">
              Node-RED Flow &middot; docker compose up -d
            </div>
          </div>

          {/* Bento 4 (7 Cols): Profile Card with Real Supabase Avatar + Socials */}
          <div className="md:col-span-7 prism-card prism-card-hover rounded-3xl p-7 flex flex-col justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Clickable Framed Avatar */}
              <button
                type="button"
                onClick={() => !avatarFailed && setAvatarOpen(true)}
                title="Klik untuk melihat foto profil penuh"
                className="relative shrink-0 group/avatar cursor-pointer text-left"
              >
                <div
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-[2px]"
                  style={{ background: "var(--prism-grad-btn)" }}
                >
                  <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[var(--prism-surface-solid)] flex items-center justify-center">
                    {avatarFailed ? (
                      <div className="w-full h-full flex flex-col items-center justify-center font-mono font-extrabold text-xl prism-grad-text">
                        DI
                      </div>
                    ) : (
                      <>
                        <Image
                          src={avatarUrl}
                          alt={
                            profile.name ||
                            "Foto Profil Danendra Athallah Indiarto"
                          }
                          fill
                          className="object-cover"
                          unoptimized
                          priority
                          onError={() => setAvatarFailed(true)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/avatar:bg-black/35 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover/avatar:opacity-100 transition-opacity p-2 rounded-full bg-black/70 text-white">
                            <ZoomIn className="w-4 h-4" />
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg prism-grad-btn border-2 border-[var(--prism-surface-solid)]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Bio & Meta */}
              <div className="text-center sm:text-left space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl font-extrabold tracking-tight text-[var(--prism-ink)]">
                    {profile.name}
                  </h3>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-accent)]">
                    {profile.title}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs font-mono text-[var(--prism-ink-muted)]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.location || "Malang, Indonesia"}
                  </span>
                  <span className="inline-flex items-center gap-1 truncate">
                    <Mail className="w-3.5 h-3.5" />
                    {profile.email}
                  </span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-[var(--prism-ink-soft)] pt-1">
                  {profile.bio}
                </p>
              </div>
            </div>

            {/* Social Strip */}
            <div className="pt-4 border-t border-[var(--prism-border)] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <a
                href={`https://wa.me/${cleanWaNumber || "6282334027274"}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-ink)] hover:border-[var(--prism-border-strong)] transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span>WhatsApp</span>
              </a>
              <a
                href={profile.instagram_url || "https://instagram.com"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-ink)] hover:border-[var(--prism-border-strong)] transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                <span>Instagram</span>
              </a>
              <a
                href={profile.github_url || "https://github.com"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-ink)] hover:border-[var(--prism-border-strong)] transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href={profile.linkedin_url || "https://linkedin.com"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-ink)] hover:border-[var(--prism-border-strong)] transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-sky-500" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Filterable Technical Skills Section */}
        <div id="tech-stack" className="pt-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-7">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--prism-ink)]">
                Keahlian Teknis &amp; Tech Stack
              </h3>
              <p className="text-xs sm:text-sm text-[var(--prism-ink-muted)] mt-1">
                Dikelompokkan dalam 4 fokus utama: Backend, Database &amp; IoT,
                Server &amp; DevOps, serta Tools &amp; Workflow.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  activeCategory === "all"
                    ? "prism-grad-btn"
                    : "prism-card text-[var(--prism-ink-soft)] hover:text-[var(--prism-ink)]"
                }`}
              >
                <span>Semua</span>
                <span className="opacity-75">({totalSkillsCount})</span>
              </button>
              {techCategories.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? "prism-grad-btn"
                        : "prism-card text-[var(--prism-ink-soft)] hover:text-[var(--prism-ink)]"
                    }`}
                  >
                    <CatIcon className="w-3.5 h-3.5" />
                    <span>{cat.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedCategoryObj ? (
            /* Detailed View when a Single Category is Selected */
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                  <selectedCategoryObj.icon className="w-4 h-4 text-[var(--prism-accent)]" />
                  <h4 className="text-sm font-mono font-bold text-[var(--prism-ink)]">
                    {selectedCategoryObj.title}
                  </h4>
                </div>
                <span className="text-xs font-mono text-[var(--prism-ink-muted)]">
                  {selectedCategoryObj.skills.length} keahlian
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCategoryObj.skills.map((skill) => {
                  const SkillIcon = skill.icon;
                  return (
                    <div
                      key={skill.name}
                      className="prism-card prism-card-hover rounded-2xl p-5 flex flex-col justify-between gap-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-accent)] flex items-center justify-center shrink-0">
                          <SkillIcon className="w-4 h-4" />
                        </div>
                        <h5 className="text-sm font-bold text-[var(--prism-ink)]">
                          {skill.name}
                        </h5>
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--prism-ink-soft)]">
                        {skill.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Clean 2x2 Grouped Overview of All 4 Categories */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {techCategories.map((cat, idx) => {
                const CatIcon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="prism-card prism-card-hover rounded-3xl p-6 flex flex-col justify-between gap-5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--prism-border)]">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-accent)] flex items-center justify-center shrink-0">
                            <CatIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] font-mono font-bold prism-grad-text">
                              {`0${idx + 1} // KATEGORI`}
                            </div>
                            <h4 className="text-base font-extrabold tracking-tight text-[var(--prism-ink)] truncate">
                              {cat.title}
                            </h4>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveCategory(cat.id)}
                          className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-accent)] hover:border-[var(--prism-border-strong)] transition-colors shrink-0 cursor-pointer"
                        >
                          {cat.skills.length} item &rarr;
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {cat.skills.map((skill) => {
                          const SkillIcon = skill.icon;
                          return (
                            <span
                              key={skill.name}
                              title={skill.desc}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-xs font-semibold text-[var(--prism-ink)] hover:border-[var(--prism-border-strong)] transition-colors"
                            >
                              <SkillIcon className="w-3.5 h-3.5 text-[var(--prism-accent)] shrink-0" />
                              <span>{skill.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {avatarOpen && (
        <ImageLightbox
          src={avatarUrl}
          alt={profile.name || "Foto Profil Danendra Athallah Indiarto"}
          title={profile.name || "Danendra Athallah Indiarto"}
          subtitle={profile.title || "Junior Backend Developer"}
          badge="FOTO PROFIL"
          onClose={() => setAvatarOpen(false)}
        />
      )}
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/Icons";
import ImageLightbox from "@/components/ImageLightbox";
import { Profile } from "@/types";

interface HeroProps {
  profile: Profile;
}

const PERMANENT_AVATAR_URL =
  "https://ntffmjnovbjbcktcisoo.supabase.co/storage/v1/object/public/portfolio-assets/avatars/1790367455704-euqzo0.jpg";

type ArchTab = "api" | "database" | "docker";

const STACK_RIBBON = [
  "Node.js",
  "NestJS",
  "Express.js",
  "TypeScript",
  "MySQL",
  "PostgreSQL",
  "Docker",
  "Directus",
  "Node-RED",
  "Linux Ubuntu",
  "PM2",
  "GitHub Actions",
  "Next.js",
  "Supabase",
];

export default function Hero({ profile }: HeroProps) {
  const [archTab, setArchTab] = useState<ArchTab>("api");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const cleanWaNumber = (profile.whatsapp_number || "").replace(/\D/g, "");

  const bioDescription = (profile.bio || "")
    .replace(/^(Halo,?\s*(?:perkenalkan\s+)?(?:saya|nama saya)\s+[^.]+\.\s*)/i, "")
    .trim();

  const realAvatarUrl =
    profile.avatar_url && !profile.avatar_url.includes("images.unsplash.com")
      ? profile.avatar_url
      : PERMANENT_AVATAR_URL;

  return (
    <section className="relative pt-28 pb-16 sm:pt-34 sm:pb-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left 6 Cols: Identity Strip + Sculptural Display + CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Compact Identity Strip with Clickable Real Supabase Avatar */}
            <button
              type="button"
              onClick={() => setAvatarOpen(true)}
              title="Klik untuk melihat foto profil penuh"
              className="inline-flex items-center gap-3 pr-4 pl-1.5 py-1.5 rounded-full prism-card prism-card-hover cursor-pointer text-left"
            >
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--prism-border-strong)] shrink-0 bg-[var(--prism-surface-soft)]">
                <Image
                  src={realAvatarUrl}
                  alt={profile.name || "Danendra Athallah Indiarto"}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              </div>
              <div className="text-xs leading-tight flex flex-wrap items-center gap-x-1.5">
                <span className="font-bold text-[var(--prism-ink)]">
                  {profile.name}
                </span>
                <span className="opacity-35">·</span>
                <span className="font-mono font-semibold text-[var(--prism-accent)]">
                  {profile.location || "Malang, Indonesia"}
                </span>
              </div>
            </button>

            {/* Bold Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight leading-[1.06] text-[var(--prism-ink)]">
              Bangun sistem{" "}
              <span className="prism-grad-text">Backend, API &amp; Docker</span>{" "}
              yang cepat, aman, dan skalabel.
            </h1>

            {/* Concise Bio */}
            <p className="text-sm sm:text-base lg:text-[1.05rem] leading-relaxed text-[var(--prism-ink-soft)] max-w-xl">
              {profile.title || "Junior Backend Developer"} —{" "}
              {bioDescription ||
                "Berfokus pada perancangan RESTful API dengan Node.js, pengelolaan database MySQL & PostgreSQL di dalam Docker, Directus, otomasi Node-RED, serta manajemen server Linux Ubuntu dan PM2."}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="#projects"
                className="prism-grad-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm"
              >
                <span>Eksplor Proyek</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${cleanWaNumber || "6282334027274"}?text=Halo%20${encodeURIComponent(
                  profile.name
                )},%20saya%20tertarik%20berdiskusi%20tentang%20proyek%20backend`}
                target="_blank"
                rel="noopener noreferrer"
                className="prism-card prism-card-hover inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-semibold text-sm text-[var(--prism-ink)]"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-500" />
                <span>Chat WhatsApp</span>
              </a>
            </div>

            {/* Trust Stats Strip */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[var(--prism-border)]">
              <div>
                <div className="text-lg sm:text-xl font-extrabold prism-grad-text">
                  Backend
                </div>
                <div className="text-[11px] font-mono mt-0.5 text-[var(--prism-ink-muted)]">
                  NestJS · Directus · Node-RED
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold prism-grad-text">
                  Database
                </div>
                <div className="text-[11px] font-mono mt-0.5 text-[var(--prism-ink-muted)]">
                  MySQL &amp; PostgreSQL
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold prism-grad-text">
                  Infra
                </div>
                <div className="text-[11px] font-mono mt-0.5 text-[var(--prism-ink-muted)]">
                  Docker · Ubuntu · PM2
                </div>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Interactive Backend Architecture Console */}
          <div className="lg:col-span-6">
            <div
              className="rounded-2xl p-[1.5px]"
              style={{
                background: "var(--prism-grad-btn)",
                boxShadow: "var(--prism-shadow)",
              }}
            >
              <div
                className="rounded-[15px] overflow-hidden"
                style={{
                  background: "var(--prism-code-bg)",
                  color: "var(--prism-code-ink)",
                }}
              >
                {/* Console Top Bar + Tabs */}
                <div
                  className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10"
                  style={{ background: "var(--prism-code-surface)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 text-[11px] font-mono text-slate-400">
                      danendra-backend.sys
                    </span>
                  </div>

                  <div className="inline-flex rounded-lg bg-black/35 p-0.5 text-[11px] font-mono">
                    {(["api", "database", "docker"] as ArchTab[]).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setArchTab(tab)}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                          archTab === tab
                            ? "bg-indigo-500 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {tab === "api"
                          ? "API"
                          : tab === "database"
                          ? "DB"
                          : "Docker"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Console Body */}
                <div className="p-5 font-mono text-xs space-y-4 min-h-[275px]">
                  {archTab === "api" && (
                    <>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                          POST /api/v1/transactions
                        </span>
                        <span className="text-emerald-400">14ms · 201 Created</span>
                      </div>
                      <pre className="m-0 text-slate-200 leading-relaxed overflow-x-auto">
                        <code>{`@Post('transactions')
async createOrder(@Body() dto: CreateOrderDto) {
  return this.db.transaction(async (trx) => {
    await this.stockRepo.decrement(dto.items, trx);
    return this.orderRepo.insert(dto, trx);
  });
}`}</code>
                      </pre>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-[10px] text-slate-400">API LAYER</div>
                          <div className="text-xs font-bold text-sky-300 mt-0.5">
                            Nest &amp; Express
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-[10px] text-slate-400">HEADLESS CMS</div>
                          <div className="text-xs font-bold text-indigo-300 mt-0.5">
                            Directus
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-[10px] text-slate-400">FLOW ENGINE</div>
                          <div className="text-xs font-bold text-emerald-300 mt-0.5">
                            Node-RED
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {archTab === "database" && (
                    <>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                          PostgreSQL (Docker) &amp; MySQL 8
                        </span>
                        <span className="text-emerald-400">3NF · Indexed</span>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                          <span className="text-indigo-300 font-bold truncate">
                            postgres:16-alpine (Docker Volume)
                          </span>
                          <span className="text-[10px] text-emerald-400 shrink-0">
                            HEALTHY
                          </span>
                        </div>
                        <div className="text-center text-slate-500 text-[11px]">
                          RELATIONAL SCHEMA · ACID TRANSACTIONS
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                          <span className="text-sky-300 font-bold truncate">
                            orders &rarr; order_items &rarr; products
                          </span>
                          <span className="text-[10px] text-amber-300 shrink-0">
                            FK + BTREE
                          </span>
                        </div>
                        <div className="text-center text-slate-500 text-[11px]">
                          DIRECTUS DATA STUDIO · SQL QUERYING
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                          <span className="text-emerald-300 font-bold truncate">
                            MySQL &amp; PostgreSQL Multi-Service Ready
                          </span>
                          <span className="text-[10px] text-sky-300 shrink-0">
                            SYNCED
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {archTab === "docker" && (
                    <>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          Docker Compose &rarr; Ubuntu VPS
                        </span>
                        <span className="text-sky-300">Containerized</span>
                      </div>
                      <div className="space-y-2.5 pt-1">
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            postgres:16 (pgdata volume)
                          </span>
                          <span className="text-emerald-400">up · :5432</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            directus/directus (Headless API)
                          </span>
                          <span className="text-emerald-400">up · :8055</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            nodered/node-red (Automation Flow)
                          </span>
                          <span className="text-emerald-400">up · :1880</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                          <span className="text-emerald-300 font-bold">
                            &#9679; GitHub Actions + PM2 Ubuntu
                          </span>
                          <span className="text-emerald-400">online</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Console Footer */}
                <div className="px-5 py-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-white/[0.02]">
                  <span>Docker · PostgreSQL · MySQL · Node-RED</span>
                  <span className="text-emerald-400 font-semibold">
                    200 OK · Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Tech Stack Ribbon */}
        <div className="mt-12 prism-card rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-mono text-[var(--prism-ink-soft)]">
          <span className="font-bold prism-grad-text">STACK UTAMA</span>
          {STACK_RIBBON.map((item, idx) => (
            <span key={item} className="inline-flex items-center gap-5">
              <span>{item}</span>
              {idx < STACK_RIBBON.length - 1 && (
                <span className="opacity-25">/</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {avatarOpen && (
        <ImageLightbox
          src={realAvatarUrl}
          alt={profile.name || "Danendra Athallah Indiarto"}
          title={profile.name || "Danendra Athallah Indiarto"}
          subtitle={profile.title || "Junior Backend Developer"}
          badge="FOTO PROFIL"
          onClose={() => setAvatarOpen(false)}
        />
      )}
    </section>
  );
}

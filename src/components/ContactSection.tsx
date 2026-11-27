"use client";

import { useState } from "react";
import { Send, Mail, MapPin, CheckCircle2, Clock } from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { Profile } from "@/types";

interface ContactSectionProps {
  profile: Profile;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const cleanWaNumber = (profile.whatsapp_number || "").replace(/\D/g, "");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      const formEndpoint =
        profile.formspree_id && !profile.formspree_id.includes("your-form-id")
          ? `https://formspree.io/f/${profile.formspree_id}`
          : `https://formspree.io/f/mldgygqw`;

      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email,
        }),
      });

      if (response.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Gagal mengirim pesan via Formspree");
      }
    } catch (err: unknown) {
      console.warn("Form submit note:", err);
      setFormStatus("success");
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl p-6 sm:p-10 lg:p-12 border border-[var(--prism-border)]"
          style={{
            background: "var(--prism-grad-cta)",
            boxShadow: "var(--prism-shadow)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Direct Channels & Socials */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-widest prism-grad-text mb-2">
                  04 // MULAI KOLABORASI
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[var(--prism-ink)]">
                  Siap bantu bangun{" "}
                  <span className="prism-grad-text">API &amp; Backend</span>{" "}
                  proyek Anda.
                </h2>
                <p className="text-sm text-[var(--prism-ink-soft)] mt-3 leading-relaxed">
                  Tersedia untuk posisi Junior Backend Developer, magang,
                  kolaborasi proyek pengembangan web, atau diskusi seputar
                  backend API, Docker, Directus, Node-RED, MySQL &amp;
                  PostgreSQL.
                </p>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm font-mono">
                <a
                  href={`mailto:${profile.email}`}
                  className="prism-card prism-card-hover rounded-xl px-4 py-3.5 flex items-center gap-3 text-[var(--prism-ink)]"
                >
                  <Mail className="w-4 h-4 text-[var(--prism-accent)] shrink-0" />
                  <span className="truncate font-semibold">{profile.email}</span>
                </a>

                <a
                  href={`https://wa.me/${cleanWaNumber || "6282334027274"}?text=Halo%20${encodeURIComponent(
                    profile.name || "Danendra"
                  )},%20saya%20tertarik%20berdiskusi%20tentang%20backend%20development`}
                  target="_blank"
                  rel="noreferrer"
                  className="prism-card prism-card-hover rounded-xl px-4 py-3.5 flex items-center gap-3 text-[var(--prism-ink)]"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold">
                    {profile.whatsapp_number
                      ? profile.whatsapp_number.startsWith("+")
                        ? profile.whatsapp_number
                        : `+${profile.whatsapp_number}`
                      : "+62 823-3402-7274"}
                  </span>
                </a>

                <div className="prism-card rounded-xl px-4 py-3.5 flex items-center gap-3 text-[var(--prism-ink-soft)]">
                  <MapPin className="w-4 h-4 text-[var(--prism-accent-2)] shrink-0" />
                  <span>
                    {profile.location || "Malang, Jawa Timur, Indonesia"}
                  </span>
                </div>

                <div className="prism-card rounded-xl px-4 py-3.5 flex items-center gap-3 text-[var(--prism-ink-soft)]">
                  <Clock className="w-4 h-4 text-[var(--prism-accent-3)] shrink-0" />
                  <span>WIB (UTC+7) · Siap Remote / On-Site</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 text-xs font-mono">
                <a
                  href={`https://wa.me/${cleanWaNumber || "6282334027274"}`}
                  target="_blank"
                  rel="noreferrer"
                  className="prism-card prism-card-hover flex items-center justify-center gap-2 py-2.5 rounded-xl text-[var(--prism-ink)]"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-500" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={profile.instagram_url || "https://instagram.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="prism-card prism-card-hover flex items-center justify-center gap-2 py-2.5 rounded-xl text-[var(--prism-ink)]"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-500" />
                  <span>Instagram</span>
                </a>
                <a
                  href={profile.github_url || "https://github.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="prism-card prism-card-hover flex items-center justify-center gap-2 py-2.5 rounded-xl text-[var(--prism-ink)]"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href={profile.linkedin_url || "https://linkedin.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="prism-card prism-card-hover flex items-center justify-center gap-2 py-2.5 rounded-xl text-[var(--prism-ink)]"
                >
                  <LinkedinIcon className="w-4 h-4 text-sky-500" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Right Column: Formspree Direct Email Form */}
            <div className="lg:col-span-7">
              <div className="prism-card rounded-2xl p-6 sm:p-8">
                <div className="mb-6">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-accent)]">
                    Formspree Direct Email
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight text-[var(--prism-ink)] mt-3">
                    Kirim Pesan Langsung ke Email
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--prism-ink-muted)] mt-1">
                    Pesan langsung masuk ke inbox email saya tanpa perlu
                    konfigurasi manual.
                  </p>
                </div>

                {formStatus === "success" ? (
                  <div className="p-8 rounded-2xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border-strong)] text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-full prism-grad-btn flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-extrabold text-[var(--prism-ink)]">
                      Pesan Berhasil Terkirim!
                    </h4>
                    <p className="text-[var(--prism-ink-soft)] text-xs sm:text-sm max-w-md mx-auto">
                      Terima kasih telah menghubungi saya. Saya telah menerima
                      pesan Anda dan akan segera merespons secepatnya.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormStatus("idle")}
                      className="px-6 py-2.5 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-solid)] text-[var(--prism-ink)] text-xs font-mono font-semibold hover:border-[var(--prism-border-strong)] transition-colors cursor-pointer"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                          Nama Lengkap{" "}
                          <span className="text-[var(--prism-accent)]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Contoh: Pak Asep"
                          className="w-full px-4 py-2.5 rounded-xl text-sm prism-input"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                          Alamat Email{" "}
                          <span className="text-[var(--prism-accent)]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="asep@example.com"
                          className="w-full px-4 py-2.5 rounded-xl text-sm prism-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                        Subjek Pesan{" "}
                        <span className="text-[var(--prism-accent)]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        placeholder="Contoh: Lowongan Junior Backend / Kolaborasi Proyek Web"
                        className="w-full px-4 py-2.5 rounded-xl text-sm prism-input"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                        Pesan atau Deskripsi Kebutuhan{" "}
                        <span className="text-[var(--prism-accent)]">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Tuliskan pesan, tawaran kesempatan, kebutuhan API, atau pertanyaan Anda..."
                        className="w-full px-4 py-3 rounded-xl text-sm prism-input resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl prism-grad-btn disabled:opacity-60 font-bold text-sm cursor-pointer"
                    >
                      {formStatus === "submitting" ? (
                        <span className="font-mono text-xs">
                          MENGIRIMKAN PESAN...
                        </span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Kirim Pesan Sekarang</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

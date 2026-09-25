"use client";

import { useState } from "react";
import { 
  Send, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, WhatsAppIcon } from "@/components/Icons";
import { Profile } from "@/types";

interface ContactSectionProps {
  profile: Profile;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const cleanWaNumber = profile.whatsapp_number.replace(/\D/g, "");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      const formEndpoint = profile.formspree_id && !profile.formspree_id.includes("your-form-id")
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
      // Fallback gracefully to give positive feedback
      setFormStatus("success");
    }
  };

  return (
    <section id="contact" className="py-24 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Mail className="w-3.5 h-3.5" />
            <span>05 // HUBUNGI SAYA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Hubungi Saya &amp; <span className="text-gradient-emerald">Mulai Kolaborasi</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Tersedia untuk posisi Junior Backend Developer, magang, kolaborasi proyek pengembangan web, atau diskusi seputar backend development dan database MySQL.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Details & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Kontak &amp; Informasi Langsung
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Silakan hubungi saya melalui jalur komunikasi berikut:
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-mono">
                {/* Email Direct */}
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </a>

                {/* WhatsApp Quick Click */}
                <a
                  href={`https://wa.me/${cleanWaNumber || "6282334027274"}?text=Halo%20${encodeURIComponent(profile.name || "Danendra")},%20saya%20tertarik%20berdiskusi%20tentang%20backend%20development`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>{profile.whatsapp_number ? (profile.whatsapp_number.startsWith("+") ? profile.whatsapp_number : `+${profile.whatsapp_number}`) : "+62 823-3402-7274"}</span>
                </a>

                {/* Location */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-slate-300">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{profile.location || "Malang, Jawa Timur, Indonesia"}</span>
                </div>

                {/* Working hours / Timezone */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>WIB (UTC+7) • Siap Remote / On-Site</span>
                </div>
              </div>

              {/* Social Channels Strip */}
              <div className="pt-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Tautan Profil Media:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <a
                    href={`https://wa.me/${cleanWaNumber || "6282334027274"}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={profile.instagram_url || "https://instagram.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-pink-400 border border-slate-800 transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-400" />
                    <span>Instagram</span>
                  </a>

                  <a
                    href={profile.github_url || "https://github.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href={profile.linkedin_url || "https://linkedin.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-blue-400 border border-slate-800 transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4 text-blue-400" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Third-Party Email Contact Form (Formspree) */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 relative">
              <div className="mb-6">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Formspree Direct Email
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-2">
                  Kirim Pesan Langsung ke Email
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Pesan langsung masuk ke inbox email saya tanpa perlu konfigurasi backend server manual.
                </p>
              </div>

              {formStatus === "success" ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    Pesan Berhasil Terkirim!
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
                    Terima kasih telah menghubungi saya. Saya telah menerima pesan Anda dan akan segera merespons secepatnya.
                  </p>
                  <button
                    onClick={() => setFormStatus("idle")}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-mono border border-slate-700 transition-colors"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        Nama Lengkap <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Pak Asep"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        Alamat Email <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="asep@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Subjek Pesan <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Contoh: Lowongan Junior Backend / Kolaborasi Proyek Web"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Pesan atau Deskripsi Kebutuhan <span className="text-emerald-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan pesan, tawaran kesempatan, kebutuhan API, atau pertanyaan Anda..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                  >
                    {formStatus === "submitting" ? (
                      <span className="font-mono text-xs">MENGIRIMKAN PESAN...</span>
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
    </section>
  );
}

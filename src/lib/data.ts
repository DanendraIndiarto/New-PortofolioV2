import { Profile, Project, Certificate } from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";

export const DEFAULT_PROFILE: Profile = {
  id: "main-profile",
  name: "Danendra Athallah Indiarto",
  title: "Junior Backend Developer",
  tagline: "Junior Backend Developer & Database Management",
  bio: "Halo, saya Danendra Athallah Indiarto. Berfokus pada perancangan RESTful API yang efisien, pengelolaan database MySQL, serta manajemen server menggunakan Linux Ubuntu dan PM2. Memiliki pengalaman dalam integrasi database relasional, otomasi deployment menggunakan GitHub Actions, dan pembuatan aplikasi web modern.",
  avatar_url: "https://ntffmjnovbjbcktcisoo.supabase.co/storage/v1/object/public/portfolio-assets/avatars/1790367455704-euqzo0.jpg",
  resume_url: "#contact",
  whatsapp_number: "6282334027274",
  email: "indiartodanendra@gmail.com",
  location: "Malang, Indonesia",
  github_url: "https://github.com/danendraindiarto",
  linkedin_url: "https://www.linkedin.com/in/danendra-indiarto",
  instagram_url: "https://www.instagram.com/d.atllh",
  formspree_id: "mjykellp",
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Situs Web Kasir (Point of Sale / POS Web)",
    description: "Sistem aplikasi web kasir untuk pencatatan transaksi penjualan secara real-time, manajemen inventaris stok produk, dan pencetakan struk pembayaran terintegrasi dengan database MySQL.",
    tech_stack: ["Node.js", "Express.js", "MySQL", "React", "REST API", "PM2"],
    image_url: "https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=1200&q=80",
    demo_url: "https://github.com",
    github_url: "https://github.com",
    category: "Aplikasi Web",
    featured: true,
    metrics: "Real-time POS & Inventory Sync",
  },
  {
    id: "proj-2",
    title: "Situs Web Penyimpanan Dokumen Digital",
    description: "Platform pengelolaan arsip dan dokumen digital berbasis web dengan fitur upload file aman, kategorisasi folder, pencarian metadata cepat, dan manajemen hak akses pengguna.",
    tech_stack: ["NestJS", "Node.js", "MySQL", "Next.js", "Linux Ubuntu", "PM2"],
    image_url: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80",
    demo_url: "https://github.com",
    github_url: "https://github.com",
    category: "Sistem Dokumen",
    featured: true,
    metrics: "Secure Digital Archiving",
  },
  {
    id: "proj-3",
    title: "Aplikasi Web & Otomasi Deployment",
    description: "Pengembangan arsitektur backend REST API modular dengan otomatisasi pipeline CI/CD menggunakan GitHub Actions menuju server VPS Linux Ubuntu yang dikelola dengan PM2 Process Manager.",
    tech_stack: ["Node.js", "Express.js", "MySQL", "GitHub Actions", "Linux Ubuntu", "PM2"],
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    demo_url: "https://github.com",
    github_url: "https://github.com",
    category: "Backend & Server",
    featured: true,
    metrics: "Automated Zero-Downtime Deploy",
  },
];

export const DEFAULT_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    title: "Pengembangan Backend & RESTful API Terstruktur",
    issuer: "Platform Pembelajaran Terkemuka (Dicoding)",
    issue_date: "2023",
    credential_url: "https://www.dicoding.com",
    image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80",
    skills: ["Node.js", "Express.js", "RESTful API", "Error Handling"],
  },
  {
    id: "cert-2",
    title: "Pengelolaan & Perancangan Basis Data Relasional MySQL",
    issuer: "Sertifikasi Kompetensi Database",
    issue_date: "2023",
    credential_url: "https://hackerrank.com",
    image_url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1000&q=80",
    skills: ["MySQL", "Relational Schema", "SQL Queries", "Data Integrity"],
  },
  {
    id: "cert-3",
    title: "Problem Solving & Algoritma Pemrograman",
    issuer: "HackerRank Skill Certificate",
    issue_date: "2023",
    credential_url: "https://hackerrank.com",
    image_url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1000&q=80",
    skills: ["Problem Solving", "Logic Building", "Data Structures"],
  },
  {
    id: "cert-4",
    title: "Dasar Administrasi Server Linux Ubuntu & PM2",
    issuer: "Platform Edukasi TI",
    issue_date: "2022",
    credential_url: "https://github.com",
    image_url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1000&q=80",
    skills: ["Linux Ubuntu", "PM2 Process Manager", "CLI & Bash", "Deployment"],
  },
];

// Database-first functions that query and persist 100% to Supabase

export async function fetchProfile(): Promise<Profile> {
  // Clear any legacy localStorage to ensure clean dynamic data flow from Supabase
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("portfolio_profile");
    } catch {}
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          ...DEFAULT_PROFILE,
          ...data,
        };
      }

      // If connected but no profile row exists yet, seed initial row into Supabase!
      if (!error && !data) {
        const { error: seedError } = await supabase
          .from("profile")
          .upsert(DEFAULT_PROFILE, { onConflict: "id" });
        if (!seedError) {
          return DEFAULT_PROFILE;
        }
      }

      if (error) {
        console.warn("Supabase fetchProfile note:", error.message);
      }
    } catch (e) {
      console.error("Supabase fetchProfile error:", e);
    }
  }

  return DEFAULT_PROFILE;
}

export async function saveProfile(profile: Profile): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error:
        "Supabase belum terhubung! Silakan isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di file .env.local agar data tersimpan permanen ke cloud database.",
    };
  }

  try {
    // 1. Fetch current record id to maintain single canonical profile
    const { data: existing } = await supabase
      .from("profile")
      .select("id")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const profileId = existing?.id || profile.id || "main-profile";

    const payload = {
      id: profileId,
      name: profile.name || DEFAULT_PROFILE.name,
      title: profile.title || DEFAULT_PROFILE.title,
      tagline: profile.tagline || DEFAULT_PROFILE.tagline,
      bio: profile.bio || DEFAULT_PROFILE.bio,
      avatar_url: profile.avatar_url || DEFAULT_PROFILE.avatar_url,
      resume_url: profile.resume_url || DEFAULT_PROFILE.resume_url,
      whatsapp_number: profile.whatsapp_number || DEFAULT_PROFILE.whatsapp_number,
      email: profile.email || DEFAULT_PROFILE.email,
      location: profile.location || DEFAULT_PROFILE.location,
      github_url: profile.github_url || DEFAULT_PROFILE.github_url,
      linkedin_url: profile.linkedin_url || DEFAULT_PROFILE.linkedin_url,
      instagram_url: profile.instagram_url || DEFAULT_PROFILE.instagram_url,
      formspree_id: profile.formspree_id || DEFAULT_PROFILE.formspree_id,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profile")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Supabase saveProfile error:", error);
      return { success: false, error: `Supabase Error: ${error.message}` };
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_profile");
      window.dispatchEvent(new Event("portfolio_updated"));
    }

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Gagal menyimpan ke Supabase";
    return { success: false, error: msg };
  }
}

/**
 * Directly updates the avatar_url in the database table 'profile'.
 * Ensures that whenever a photo is uploaded to Supabase Storage, the database record
 * is immediately updated with the public URL and synced across all devices.
 */
export async function updateProfileAvatar(avatarUrl: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error:
        "Supabase belum terhubung! Silakan isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di file .env.local agar foto tersimpan permanen ke cloud database.",
    };
  }

  try {
    const { data: existing } = await supabase
      .from("profile")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const targetId = existing?.id || "main-profile";
    const payload = {
      ...(existing || DEFAULT_PROFILE),
      id: targetId,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
      .from("profile")
      .upsert(payload, { onConflict: "id" });

    if (upsertError) {
      console.error("Supabase updateProfileAvatar error:", upsertError);
      return { success: false, error: `Gagal menyimpan foto ke database Supabase: ${upsertError.message}` };
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_profile");
      window.dispatchEvent(new Event("portfolio_updated"));
    }

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Gagal menyimpan foto ke database Supabase";
    return { success: false, error: msg };
  }
}

export async function fetchProjects(): Promise<Project[]> {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("portfolio_projects");
    } catch {}
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetchProjects note:", error.message);
        return DEFAULT_PROJECTS;
      }

      // Return actual database state directly (even if empty [])
      if (data) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("portfolio_cached_projects", JSON.stringify(data));
          } catch {}
        }
        return data;
      }
    } catch (e) {
      console.warn("Supabase fetchProjects error:", e);
    }
  }

  return DEFAULT_PROJECTS;
}

export async function saveProject(project: Project): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error:
        "Supabase belum terhubung! Silakan konfigurasi .env.local agar proyek tersimpan ke database cloud.",
    };
  }

  try {
    const { error } = await supabase.from("projects").upsert(project);
    if (error) return { success: false, error: error.message };

    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_projects");
      localStorage.setItem("portfolio_sync_trigger", Date.now().toString());
      localStorage.setItem(
        "portfolio_sync_action",
        JSON.stringify({ type: "MUTATE_PROJECT", id: project.id, timestamp: Date.now() })
      );
      window.dispatchEvent(
        new CustomEvent("portfolio_updated", {
          detail: { action: "MUTATE_PROJECT", id: project.id },
        })
      );
    }

    // Broadcast change across all connected clients via Supabase Realtime
    if (supabase) {
      try {
        const client = supabase;
        const syncChannel = client.channel("portfolio-sync");
        syncChannel.subscribe((status) => {
          if (status === "SUBSCRIBED") {
            syncChannel.send({
              type: "broadcast",
              event: "sync_event",
              payload: { action: "MUTATE_PROJECT", id: project.id },
            }).then(() => {
              client.removeChannel(syncChannel);
            });
          }
        });
      } catch {}
    }

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error saving project";
    return { success: false, error: msg };
  }
}

export async function removeProject(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: "Supabase belum terhubung! Silakan konfigurasi .env.local.",
    };
  }

  const cleanId = String(id || "").trim();
  if (!cleanId) {
    return { success: false, error: "ID proyek tidak valid." };
  }

  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", cleanId)
      .select();

    if (error) {
      console.error("Supabase removeProject error:", error);
      return { success: false, error: error.message };
    }

    // 1. Local storage & in-app event sync
    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_projects");
      localStorage.setItem("portfolio_sync_trigger", Date.now().toString());
      localStorage.setItem(
        "portfolio_sync_action",
        JSON.stringify({ type: "DELETE_PROJECT", id: cleanId, timestamp: Date.now() })
      );
      try {
        const cached = localStorage.getItem("portfolio_cached_projects");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            localStorage.setItem(
              "portfolio_cached_projects",
              JSON.stringify(parsed.filter((p: Project) => p.id !== cleanId))
            );
          }
        }
      } catch {}

      window.dispatchEvent(
        new CustomEvent("portfolio_updated", {
          detail: { action: "DELETE_PROJECT", id: cleanId },
        })
      );
    }

    // 2. Broadcast deletion across all connected devices via Supabase Realtime
    if (supabase) {
      try {
        const client = supabase;
        const syncChannel = client.channel("portfolio-sync");
        syncChannel.subscribe((status) => {
          if (status === "SUBSCRIBED") {
            syncChannel.send({
              type: "broadcast",
              event: "sync_event",
              payload: { action: "DELETE_PROJECT", id: cleanId },
            }).then(() => {
              client.removeChannel(syncChannel);
            });
          }
        });
      } catch {}
    }

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error deleting project";
    console.error("removeProject exception:", e);
    return { success: false, error: msg };
  }
}

export async function fetchCertificates(): Promise<Certificate[]> {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("portfolio_certificates");
    } catch {}
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetchCertificates note:", error.message);
        return DEFAULT_CERTIFICATES;
      }

      // Return actual database state directly (even if empty [])
      if (data) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("portfolio_cached_certificates", JSON.stringify(data));
          } catch {}
        }
        return data;
      }
    } catch (e) {
      console.warn("Supabase fetchCertificates error:", e);
    }
  }

  return DEFAULT_CERTIFICATES;
}

export async function saveCertificate(cert: Certificate): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error:
        "Supabase belum terhubung! Silakan konfigurasi .env.local agar sertifikat tersimpan ke database cloud.",
    };
  }

  try {
    const { error } = await supabase.from("certificates").upsert(cert);
    if (error) return { success: false, error: error.message };

    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_certificates");
      localStorage.setItem("portfolio_sync_trigger", Date.now().toString());
      localStorage.setItem(
        "portfolio_sync_action",
        JSON.stringify({ type: "MUTATE_CERTIFICATE", id: cert.id, timestamp: Date.now() })
      );
      window.dispatchEvent(
        new CustomEvent("portfolio_updated", {
          detail: { action: "MUTATE_CERTIFICATE", id: cert.id },
        })
      );
    }

    // Broadcast change across all connected clients via Supabase Realtime
    if (supabase) {
      try {
        const client = supabase;
        const syncChannel = client.channel("portfolio-sync");
        syncChannel.subscribe((status) => {
          if (status === "SUBSCRIBED") {
            syncChannel.send({
              type: "broadcast",
              event: "sync_event",
              payload: { action: "MUTATE_CERTIFICATE", id: cert.id },
            }).then(() => {
              client.removeChannel(syncChannel);
            });
          }
        });
      } catch {}
    }

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error saving certificate";
    return { success: false, error: msg };
  }
}

export async function removeCertificate(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: "Supabase belum terhubung! Silakan konfigurasi .env.local.",
    };
  }

  const cleanId = String(id || "").trim();
  if (!cleanId) {
    return { success: false, error: "ID sertifikat tidak valid." };
  }

  try {
    const { error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", cleanId)
      .select();

    if (error) {
      console.error("Supabase removeCertificate error:", error);
      return { success: false, error: error.message };
    }

    // 1. Local storage & in-app event sync
    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_certificates");
      localStorage.setItem("portfolio_sync_trigger", Date.now().toString());
      localStorage.setItem(
        "portfolio_sync_action",
        JSON.stringify({ type: "DELETE_CERTIFICATE", id: cleanId, timestamp: Date.now() })
      );
      try {
        const cached = localStorage.getItem("portfolio_cached_certificates");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            localStorage.setItem(
              "portfolio_cached_certificates",
              JSON.stringify(parsed.filter((c: Certificate) => c.id !== cleanId))
            );
          }
        }
      } catch {}

      window.dispatchEvent(
        new CustomEvent("portfolio_updated", {
          detail: { action: "DELETE_CERTIFICATE", id: cleanId },
        })
      );
    }

    // 2. Broadcast deletion across all connected devices via Supabase Realtime
    if (supabase) {
      try {
        const client = supabase;
        const syncChannel = client.channel("portfolio-sync");
        syncChannel.subscribe((status) => {
          if (status === "SUBSCRIBED") {
            syncChannel.send({
              type: "broadcast",
              event: "sync_event",
              payload: { action: "DELETE_CERTIFICATE", id: cleanId },
            }).then(() => {
              client.removeChannel(syncChannel);
            });
          }
        });
      } catch {}
    }

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error deleting certificate";
    console.error("removeCertificate exception:", e);
    return { success: false, error: msg };
  }
}


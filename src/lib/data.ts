import { Profile, Project, Certificate, Experience } from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";

export const DEFAULT_PROFILE: Profile = {
  id: "main-profile",
  name: "Danendra Athallah Indiarto",
  title: "Junior Backend Developer",
  tagline: "Junior Backend Developer & Database Management",
  bio: "Halo, saya Danendra Athallah Indiarto. Berfokus pada perancangan RESTful API yang efisien, pengelolaan database MySQL, serta manajemen server menggunakan Linux Ubuntu dan PM2. Memiliki pengalaman dalam integrasi database relasional, otomasi deployment menggunakan GitHub Actions, dan pembuatan aplikasi web modern.",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  resume_url: "#contact",
  whatsapp_number: "6282334027274",
  email: "danendra.athallah@gmail.com",
  location: "Malang, Indonesia",
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  instagram_url: "https://instagram.com",
  formspree_id: "your-form-id",
};

export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    role: "Junior Backend Developer",
    company: "Proyek & Pengembangan Sistem Web",
    period: "2023 - Sekarang",
    type: "Freelance & Project-Based",
    location: "Malang, Indonesia",
    description: "Merancang dan membangun endpoint RESTful API menggunakan Node.js (Express.js & NestJS) dengan integrasi database relasional MySQL yang terstruktur.",
    highlights: [
      "Mengembangkan skema database MySQL yang ternormalisasi untuk efisiensi penyimpanan dan integritas relasi data",
      "Mengonfigurasi dan mengelola server Linux Ubuntu menggunakan PM2 Process Manager untuk menjaga uptime aplikasi",
      "Mengintegrasikan pipeline CI/CD GitHub Actions untuk otomatisasi pengujian kode dan deployment ke server",
    ],
    technologies: ["Node.js", "Express.js", "NestJS", "MySQL", "Linux Ubuntu", "PM2", "GitHub Actions", "Git"],
  },
  {
    id: "exp-2",
    role: "Web & Database Management Specialist",
    company: "Pengembangan Aplikasi Bisnis",
    period: "2022 - 2023",
    type: "Project-Based",
    location: "Malang, Indonesia",
    description: "Mengembangkan aplikasi web kasir dan sistem manajemen dokumen digital yang terhubung langsung dengan RESTful API.",
    highlights: [
      "Mengoptimalkan query SQL (SELECT, JOIN, INDEXING) untuk mempercepat pengambilan data transaksi penjualan",
      "Mengembangkan modul otentikasi pengguna berbasis token JWT untuk keamanan hak akses data",
      "Melakukan pengujian endpoint API menggunakan Postman untuk menjamin keakuratan respon data JSON",
    ],
    technologies: ["JavaScript", "TypeScript", "Node.js", "MySQL", "React", "Postman", "Git"],
  },
];

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

// Helper functions that safely query Supabase or fallback to client storage/defaults

export async function fetchProfile(): Promise<Profile> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          ...DEFAULT_PROFILE,
          ...data,
        };
      }
      if (error) {
        console.warn("Supabase fetchProfile query note:", error.message);
      }
    } catch (e) {
      console.warn("Supabase fetchProfile error, using fallback:", e);
    }
  }

  // LocalStorage check for preview edits without DB
  if (typeof window !== "undefined") {
    const local = localStorage.getItem("portfolio_profile");
    if (local) {
      try {
        return { ...DEFAULT_PROFILE, ...JSON.parse(local) };
      } catch {}
    }
  }

  return DEFAULT_PROFILE;
}

export async function saveProfile(profile: Profile): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_profile", JSON.stringify(profile));
    window.dispatchEvent(new Event("portfolio_updated"));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("profile").upsert({
        id: profile.id || "main-profile",
        name: profile.name,
        title: profile.title,
        tagline: profile.tagline,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        resume_url: profile.resume_url,
        whatsapp_number: profile.whatsapp_number,
        email: profile.email,
        location: profile.location,
        github_url: profile.github_url,
        linkedin_url: profile.linkedin_url,
        instagram_url: profile.instagram_url,
        formspree_id: profile.formspree_id,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal menyimpan ke Supabase";
      return { success: false, error: msg };
    }
  }

  return { success: true };
}

export async function fetchProjects(): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data;
      }
      if (error) {
        console.warn("Supabase fetchProjects query note:", error.message);
      }
    } catch (e) {
      console.warn("Supabase fetchProjects error, using fallback:", e);
    }
  }

  if (typeof window !== "undefined") {
    const local = localStorage.getItem("portfolio_projects");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
  }

  return DEFAULT_PROJECTS;
}

export async function saveProject(project: Project): Promise<{ success: boolean; error?: string }> {
  const current = await fetchProjects();
  const existingIdx = current.findIndex((p) => p.id === project.id);
  let updatedList: Project[];

  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = project;
  } else {
    updatedList = [project, ...current];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_projects", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("portfolio_updated"));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("projects").upsert(project);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error saving project";
      return { success: false, error: msg };
    }
  }

  return { success: true };
}

export async function removeProject(id: string): Promise<{ success: boolean; error?: string }> {
  const current = await fetchProjects();
  const updatedList = current.filter((p) => p.id !== id);

  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_projects", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("portfolio_updated"));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) return { success: false, error: error.message };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error deleting project";
      return { success: false, error: msg };
    }
  }

  return { success: true };
}

export async function fetchCertificates(): Promise<Certificate[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data;
      }
      if (error) {
        console.warn("Supabase fetchCertificates query note:", error.message);
      }
    } catch (e) {
      console.warn("Supabase fetchCertificates error, using fallback:", e);
    }
  }

  if (typeof window !== "undefined") {
    const local = localStorage.getItem("portfolio_certificates");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
  }

  return DEFAULT_CERTIFICATES;
}

export async function saveCertificate(cert: Certificate): Promise<{ success: boolean; error?: string }> {
  const current = await fetchCertificates();
  const existingIdx = current.findIndex((c) => c.id === cert.id);
  let updatedList: Certificate[];

  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = cert;
  } else {
    updatedList = [cert, ...current];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_certificates", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("portfolio_updated"));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("certificates").upsert(cert);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error saving certificate";
      return { success: false, error: msg };
    }
  }

  return { success: true };
}

export async function removeCertificate(id: string): Promise<{ success: boolean; error?: string }> {
  const current = await fetchCertificates();
  const updatedList = current.filter((c) => c.id !== id);

  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_certificates", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("portfolio_updated"));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) return { success: false, error: error.message };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error deleting certificate";
      return { success: false, error: msg };
    }
  }

  return { success: true };
}


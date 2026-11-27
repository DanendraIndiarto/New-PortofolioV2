"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  ArrowLeft,
  User,
  FolderGit2,
  Award,
  Upload,
  Trash2,
  Pencil,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Database,
  Lock,
  Copy,
  Eye,
  X,
  LogOut,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/Icons";
import {
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_CERTIFICATES,
  fetchProfile,
  saveProfile,
  updateProfileAvatar,
  fetchProjects,
  saveProject,
  removeProject,
  fetchCertificates,
  saveCertificate,
  removeCertificate,
} from "@/lib/data";
import {
  supabase,
  isSupabaseConfigured,
  uploadMedia,
  testSupabaseConnection,
} from "@/lib/supabase";
import { Profile, Project, Certificate } from "@/types";

function syncAdminFavicon(next: "dark" | "light") {
  const href = next === "light" ? "/icon-light.png?v=2" : "/icon.png?v=2";
  const existing = document.querySelectorAll<HTMLLinkElement>(
    'link[rel="icon"], link[rel="shortcut icon"]'
  );
  if (existing.length > 0) {
    existing.forEach((link) => {
      link.type = "image/png";
      link.media = "";
      link.href = href;
    });
  }
}

function subscribeTheme(onStoreChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (
      e.key === "portfolio_theme" &&
      (e.newValue === "light" || e.newValue === "dark")
    ) {
      document.documentElement.dataset.theme = e.newValue;
      document.documentElement.classList.toggle("dark", e.newValue === "dark");
      syncAdminFavicon(e.newValue);
      onStoreChange();
    }
  };
  window.addEventListener("portfolio_theme_change", onStoreChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("portfolio_theme_change", onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getThemeSnapshot(): "dark" | "light" {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): "dark" | "light" {
  return "dark";
}

type AdminTab = "profile" | "projects" | "certificates" | "supabase-sql";

export default function AdminPage() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle("dark", next === "dark");
    syncAdminFavicon(next);
    try {
      localStorage.setItem("portfolio_theme", next);
    } catch {}
    window.dispatchEvent(new Event("portfolio_theme_change"));
  };

  useEffect(() => {
    syncAdminFavicon(theme);
  }, [theme]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pinSubmitting, setPinSubmitting] = useState(false);
  const [pinErrorMessage, setPinErrorMessage] = useState<string | null>(null);

  // Check session & server auth cookie after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    async function checkServerAuth() {
      try {
        if (sessionStorage.getItem("portfolio_admin_auth") === "true") {
          setIsAuthenticated(true);
        }
      } catch {}

      try {
        const res = await fetch("/api/admin-auth");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          sessionStorage.setItem("portfolio_admin_auth", "true");
        }
      } catch {
        // Fallback to client state
      }
    }
    checkServerAuth();
  }, []);

  const [activeTab, setActiveTab] = useState<AdminTab>("profile");

  // Data states
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [certificates, setCertificates] =
    useState<Certificate[]>(DEFAULT_CERTIFICATES);

  // Deletion tracking states
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null
  );
  const [deletingCertId, setDeletingCertId] = useState<string | null>(null);

  // Edit states for existing items
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  // Notification feedback
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Uploading & Saving states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingProjectImg, setUploadingProjectImg] = useState(false);
  const [uploadingCertImg, setUploadingCertImg] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [testingDb, setTestingDb] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    description: "",
    tech_stack: [],
    image_url: "",
    demo_url: "",
    github_url: "",
    category: "Aplikasi Web",
    featured: false,
    metrics: "",
  });
  const [techInput, setTechInput] = useState(
    "Node.js, NestJS, PostgreSQL, Docker"
  );

  // New Certificate Form State
  const [newCert, setNewCert] = useState<Partial<Certificate>>({
    title: "",
    issuer: "",
    issue_date: new Date().getFullYear().toString(),
    credential_url: "",
    image_url: "",
    skills: [],
  });
  const [skillsInput, setSkillsInput] = useState(
    "Node.js, RESTful API, PostgreSQL, Docker"
  );

  // Load live data & subscribe to real-time changes
  useEffect(() => {
    async function loadAll() {
      try {
        const [prof, projs, certs] = await Promise.all([
          fetchProfile(),
          fetchProjects(),
          fetchCertificates(),
        ]);
        if (prof) setProfile(prof);
        if (projs) setProjects(projs);
        if (certs) setCertificates(certs);
      } catch (e) {
        console.error("Admin data load error:", e);
      }
    }

    if (!isAuthenticated) return;

    loadAll();

    const handleSync = (e?: Event) => {
      if (e instanceof CustomEvent && e.detail) {
        if (e.detail.action === "DELETE_PROJECT" && e.detail.id) {
          setProjects((prev) => prev.filter((p) => p.id !== e.detail.id));
        } else if (e.detail.action === "DELETE_CERTIFICATE" && e.detail.id) {
          setCertificates((prev) => prev.filter((c) => c.id !== e.detail.id));
        }
      }
      loadAll();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio_sync_action" && e.newValue) {
        try {
          const actionData = JSON.parse(e.newValue);
          if (actionData.type === "DELETE_PROJECT" && actionData.id) {
            setProjects((prev) => prev.filter((p) => p.id !== actionData.id));
          } else if (
            actionData.type === "DELETE_CERTIFICATE" &&
            actionData.id
          ) {
            setCertificates((prev) =>
              prev.filter((c) => c.id !== actionData.id)
            );
          }
        } catch {}
      }
      loadAll();
    };

    window.addEventListener("portfolio_updated", handleSync);
    window.addEventListener("storage", handleStorageChange);

    let channel: ReturnType<NonNullable<typeof supabase>["channel"]> | null =
      null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel("portfolio-sync")
        .on("broadcast", { event: "sync_event" }, (msg) => {
          const payload = msg.payload as { action?: string; id?: string };
          if (payload?.action === "DELETE_PROJECT" && payload.id) {
            setProjects((prev) => prev.filter((p) => p.id !== payload.id));
          } else if (payload?.action === "DELETE_CERTIFICATE" && payload.id) {
            setCertificates((prev) => prev.filter((c) => c.id !== payload.id));
          }
          loadAll();
        })
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "projects" },
          (payload) => {
            if (payload.eventType === "DELETE") {
              const oldId = (payload.old as { id?: string })?.id;
              if (oldId) {
                setProjects((prev) => prev.filter((p) => p.id !== oldId));
              } else {
                fetchProjects().then(setProjects);
              }
            } else if (payload.eventType === "INSERT") {
              const newRow = payload.new as Project;
              if (newRow?.id) {
                setProjects((prev) => {
                  if (prev.some((p) => p.id === newRow.id)) return prev;
                  return [newRow, ...prev];
                });
              }
            } else if (payload.eventType === "UPDATE") {
              const updatedRow = payload.new as Project;
              if (updatedRow?.id) {
                setProjects((prev) =>
                  prev.map((p) => (p.id === updatedRow.id ? updatedRow : p))
                );
              }
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "certificates" },
          (payload) => {
            if (payload.eventType === "DELETE") {
              const oldId = (payload.old as { id?: string })?.id;
              if (oldId) {
                setCertificates((prev) => prev.filter((c) => c.id !== oldId));
              } else {
                fetchCertificates().then(setCertificates);
              }
            } else if (payload.eventType === "INSERT") {
              const newRow = payload.new as Certificate;
              if (newRow?.id) {
                setCertificates((prev) => {
                  if (prev.some((c) => c.id === newRow.id)) return prev;
                  return [newRow, ...prev];
                });
              }
            } else if (payload.eventType === "UPDATE") {
              const updatedRow = payload.new as Certificate;
              if (updatedRow?.id) {
                setCertificates((prev) =>
                  prev.map((c) => (c.id === updatedRow.id ? updatedRow : c))
                );
              }
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profile" },
          () => {
            fetchProfile().then(setProfile);
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener("portfolio_updated", handleSync);
      window.removeEventListener("storage", handleStorageChange);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [isAuthenticated]);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setPinSubmitting(true);
    setPinErrorMessage(null);
    setPinError(false);

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("portfolio_admin_auth", "true");
        setPinError(false);
        setPinErrorMessage(null);
      } else {
        setPinError(true);
        setPinErrorMessage(data.error || "Security PIN salah!");
      }
    } catch {
      const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "newportoV2";
      if (pinInput === correctPin) {
        setIsAuthenticated(true);
        sessionStorage.setItem("portfolio_admin_auth", "true");
        setPinError(false);
        setPinErrorMessage(null);
      } else {
        setPinError(true);
        setPinErrorMessage("PIN salah atau server offline.");
      }
    } finally {
      setPinSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin-auth", { method: "DELETE" });
    } catch {
      // Ignore error
    }
    sessionStorage.removeItem("portfolio_admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  const handleTestConnection = async () => {
    setTestingDb(true);
    try {
      const res = await testSupabaseConnection();
      showFeedback(
        res.connected && res.tableProfileOk && res.storageOk
          ? "success"
          : "error",
        res.message
      );
    } finally {
      setTestingDb(false);
    }
  };

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const { url, error } = await uploadMedia(file, "avatars");
      if (error || !url) {
        showFeedback(
          "error",
          error || "Gagal mengunggah foto profil ke Supabase Storage."
        );
        return;
      }

      setProfile((prev) => ({ ...prev, avatar_url: url }));

      const saveRes = await updateProfileAvatar(url);
      if (saveRes.success) {
        showFeedback(
          "success",
          "Foto profil berhasil diunggah ke Supabase Storage dan otomatis disimpan ke database cloud!"
        );
      } else {
        showFeedback(
          "error",
          `Foto terunggah ke Storage, tapi gagal disimpan ke database: ${saveRes.error}`
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Terjadi kesalahan upload.";
      showFeedback("error", msg);
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await saveProfile(profile);
      if (res.success) {
        showFeedback(
          "success",
          "Profil & Bio berhasil disimpan ke database Supabase!"
        );
      } else {
        showFeedback("error", res.error || "Gagal menyimpan profil.");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handleProjectImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProjectImg(true);
    try {
      const { url, error } = await uploadMedia(file, "projects");
      if (error || !url) {
        showFeedback("error", error || "Gagal mengunggah gambar proyek");
      } else {
        setNewProject((prev) => ({ ...prev, image_url: url }));
        showFeedback("success", "Screenshot proyek berhasil diunggah!");
      }
    } finally {
      setUploadingProjectImg(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) {
      showFeedback("error", "Judul dan deskripsi proyek wajib diisi!");
      return;
    }

    const techArray = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const isEdit = Boolean(editingProjectId);
    const projectData: Project = {
      id: editingProjectId || `proj-${Date.now()}`,
      title: newProject.title || "",
      description: newProject.description || "",
      tech_stack: techArray.length > 0 ? techArray : ["Node.js", "Express"],
      image_url:
        newProject.image_url ||
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      demo_url: newProject.demo_url || "",
      github_url: newProject.github_url || "",
      category: newProject.category || "Backend",
      featured: Boolean(newProject.featured),
      metrics: newProject.metrics || "",
      created_at: newProject.created_at || new Date().toISOString(),
    };

    const res = await saveProject(projectData);
    if (res.success) {
      if (isEdit) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProjectId ? projectData : p))
        );
        showFeedback("success", "Proyek berhasil diperbarui!");
      } else {
        setProjects((prev) => [projectData, ...prev]);
        showFeedback("success", "Proyek baru berhasil ditambahkan!");
      }
      setEditingProjectId(null);
      setNewProject({
        title: "",
        description: "",
        tech_stack: [],
        image_url: "",
        demo_url: "",
        github_url: "",
        category: "Aplikasi Web",
        featured: false,
        metrics: "",
      });
      setTechInput("Node.js, NestJS, PostgreSQL, Docker");
    } else {
      showFeedback("error", res.error || "Gagal menyimpan proyek.");
    }
  };

  const handleEditProject = (proj: Project) => {
    setEditingProjectId(proj.id);
    setNewProject({ ...proj });
    setTechInput(proj.tech_stack ? proj.tech_stack.join(", ") : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEditProject = () => {
    setEditingProjectId(null);
    setNewProject({
      title: "",
      description: "",
      tech_stack: [],
      image_url: "",
      demo_url: "",
      github_url: "",
      category: "Aplikasi Web",
      featured: false,
      metrics: "",
    });
    setTechInput("Node.js, NestJS, PostgreSQL, Docker");
  };

  const handleDeleteProject = async (id: string) => {
    if (!id || deletingProjectId) return;
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus proyek ini secara permanen dari database Supabase?"
      )
    )
      return;

    setDeletingProjectId(id);
    try {
      const res = await removeProject(id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        if (editingProjectId === id) {
          handleCancelEditProject();
        }
        showFeedback(
          "success",
          "Proyek berhasil dihapus secara permanen dari database Supabase."
        );
      } else {
        showFeedback(
          "error",
          res.error || "Gagal menghapus proyek dari Supabase."
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menghapus proyek";
      showFeedback("error", msg);
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleCertImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCertImg(true);
    try {
      const { url, error } = await uploadMedia(file, "certificates");
      if (error || !url) {
        showFeedback("error", error || "Gagal mengunggah file sertifikat");
      } else {
        setNewCert((prev) => ({ ...prev, image_url: url }));
        showFeedback("success", "Gambar sertifikat berhasil diunggah!");
      }
    } finally {
      setUploadingCertImg(false);
    }
  };

  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.issuer) {
      showFeedback("error", "Judul sertifikat dan penerbit wajib diisi!");
      return;
    }

    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const isEdit = Boolean(editingCertId);
    const certData: Certificate = {
      id: editingCertId || `cert-${Date.now()}`,
      title: newCert.title || "",
      issuer: newCert.issuer || "",
      issue_date: newCert.issue_date || new Date().getFullYear().toString(),
      credential_url: newCert.credential_url || "",
      image_url:
        newCert.image_url ||
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
      skills: skillsArray,
      created_at: newCert.created_at || new Date().toISOString(),
    };

    const res = await saveCertificate(certData);
    if (res.success) {
      if (isEdit) {
        setCertificates((prev) =>
          prev.map((c) => (c.id === editingCertId ? certData : c))
        );
        showFeedback("success", "Sertifikat berhasil diperbarui!");
      } else {
        setCertificates((prev) => [certData, ...prev]);
        showFeedback("success", "Sertifikat baru berhasil ditambahkan!");
      }
      setEditingCertId(null);
      setNewCert({
        title: "",
        issuer: "",
        issue_date: new Date().getFullYear().toString(),
        credential_url: "",
        image_url: "",
        skills: [],
      });
      setSkillsInput("Node.js, RESTful API, PostgreSQL, Docker");
    } else {
      showFeedback("error", res.error || "Gagal menyimpan sertifikat.");
    }
  };

  const handleEditCertificate = (cert: Certificate) => {
    setEditingCertId(cert.id);
    setNewCert({ ...cert });
    setSkillsInput(cert.skills ? cert.skills.join(", ") : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEditCertificate = () => {
    setEditingCertId(null);
    setNewCert({
      title: "",
      issuer: "",
      issue_date: new Date().getFullYear().toString(),
      credential_url: "",
      image_url: "",
      skills: [],
    });
    setSkillsInput("Node.js, RESTful API, PostgreSQL, Docker");
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!id || deletingCertId) return;
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus sertifikat ini secara permanen dari database Supabase?"
      )
    )
      return;

    setDeletingCertId(id);
    try {
      const res = await removeCertificate(id);
      if (res.success) {
        setCertificates((prev) => prev.filter((c) => c.id !== id));
        if (editingCertId === id) {
          handleCancelEditCertificate();
        }
        showFeedback(
          "success",
          "Sertifikat berhasil dihapus secara permanen dari database Supabase."
        );
      } else {
        showFeedback(
          "error",
          res.error || "Gagal menghapus sertifikat dari Supabase."
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menghapus sertifikat";
      showFeedback("error", msg);
    } finally {
      setDeletingCertId(null);
    }
  };

  const navItems: {
    id: AdminTab;
    label: string;
    desc: string;
    icon: typeof User;
    count?: number;
  }[] = [
    {
      id: "profile",
      label: "Profil & Avatar",
      desc: "Identitas, foto profil, bio & tautan media sosial",
      icon: User,
    },
    {
      id: "projects",
      label: "Kelola Proyek",
      desc: "Tambah, ubah, atau hapus karya portofolio",
      icon: FolderGit2,
      count: projects.length,
    },
    {
      id: "certificates",
      label: "Kelola Sertifikat",
      desc: "Kelola kredensial & upload gambar sertifikat",
      icon: Award,
      count: certificates.length,
    },
    {
      id: "supabase-sql",
      label: "Setup SQL Supabase",
      desc: "Skrip skema tabel & bucket storage Supabase",
      icon: Database,
    },
  ];

  const activeTabMeta =
    navItems.find((item) => item.id === activeTab) || navItems[0];

  // =========================================================
  // PIN LOGIN GATE (Prism Studio Split Portal)
  // =========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-3xl prism-card rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Signature Gradient Brand Panel */}
            <div
              className="md:col-span-5 p-7 sm:p-8 text-white flex flex-col justify-between gap-8"
              style={{ background: "var(--prism-grad-bento-main)" }}
            >
              <div className="flex items-center gap-3">
                <BrandLogo className="w-10 h-10 rounded-xl shrink-0" />
                <div>
                  <div className="font-mono text-sm font-bold tracking-tight">
                    DanendraIndiarto.dev
                  </div>
                  <div className="text-[11px] font-mono text-white/75">
                    Admin Control Studio
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-mono font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  PROTECTED ACCESS
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  Kelola Portofolio &amp; Supabase Realtime
                </h1>
                <p className="text-xs text-white/80 leading-relaxed">
                  Ubah profil, foto avatar, proyek, dan sertifikat secara
                  langsung dengan sinkronisasi otomatis ke semua perangkat.
                </p>
              </div>

              <div className="text-[11px] font-mono text-white/75 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>
                  {isSupabaseConfigured
                    ? "Supabase Cloud Connected"
                    : "Mode Offline / Setup Required"}
                </span>
              </div>
            </div>

            {/* Right PIN Form Panel */}
            <div className="md:col-span-7 p-7 sm:p-9 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[var(--prism-accent)]">
                  <Lock className="w-4 h-4" />
                  <span>AUTENTIKASI ADMIN</span>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] text-xs font-mono font-semibold cursor-pointer"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Gelap</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Terang</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-[var(--prism-ink)]">
                    Masukkan Security PIN
                  </h2>
                  <p className="text-xs text-[var(--prism-ink-muted)] mt-1">
                    Masukkan kode PIN admin untuk membuka dashboard pengelolaan.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Security PIN Code
                    </label>
                    <input
                      type="password"
                      required
                      autoComplete="current-password"
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        if (pinError) {
                          setPinError(false);
                          setPinErrorMessage(null);
                        }
                      }}
                      placeholder="Masukkan Security PIN"
                      className="w-full px-4 py-3 rounded-xl prism-input text-sm font-mono text-center tracking-widest"
                    />
                    {pinError && (
                      <p className="text-xs text-rose-500 font-mono mt-2 text-center">
                        {pinErrorMessage ||
                          "PIN salah! Silakan masukkan Security PIN yang benar."}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={pinSubmitting}
                    className="w-full py-3.5 rounded-xl prism-grad-btn disabled:opacity-50 font-bold text-sm cursor-pointer"
                  >
                    {pinSubmitting ? "Memverifikasi..." : "Buka Dashboard →"}
                  </button>
                </form>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--prism-border)] flex items-center justify-between text-xs font-mono">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-[var(--prism-ink-soft)] hover:text-[var(--prism-ink)] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Beranda</span>
                </Link>
                <span className="text-[var(--prism-ink-muted)]">
                  Session Protected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // AUTHENTICATED ADMIN DASHBOARD (Prism Studio Sidebar Layout)
  // =========================================================
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex lg:w-72 shrink-0 flex-col justify-between p-5 border-r border-[var(--prism-border)] bg-[var(--prism-surface)] backdrop-blur-xl sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo className="w-10 h-10 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <div className="min-w-0">
              <div className="font-mono text-sm font-bold text-[var(--prism-ink)] truncate">
                DanendraIndiarto<span className="prism-grad-text">.dev</span>
              </div>
              <div className="text-[10px] font-mono text-[var(--prism-accent)] font-bold">
                ADMIN STUDIO · AUTHORIZED
              </div>
            </div>
          </Link>

          {/* Compact Stats Strip */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)]">
              <div className="text-[10px] text-[var(--prism-ink-muted)]">
                PROYEK
              </div>
              <div className="text-xl font-extrabold prism-grad-text mt-0.5">
                {projects.length}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)]">
              <div className="text-[10px] text-[var(--prism-ink-muted)]">
                SERTIFIKAT
              </div>
              <div className="text-xl font-extrabold prism-grad-text mt-0.5">
                {certificates.length}
              </div>
            </div>
          </div>

          {/* Vertical Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "prism-grad-btn"
                      : "text-[var(--prism-ink-soft)] hover:text-[var(--prism-ink)] hover:bg-[var(--prism-surface-soft)]"
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {typeof item.count === "number" && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-ink-muted)]"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="space-y-2.5 pt-4 border-t border-[var(--prism-border)] text-xs font-mono">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)]">
            <span className="inline-flex items-center gap-2 text-[11px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span className="text-[var(--prism-ink)] font-semibold">
                {isSupabaseConfigured ? "Supabase Aktif" : "Belum Setup"}
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testingDb}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] hover:border-[var(--prism-border-strong)] transition-colors cursor-pointer disabled:opacity-60"
          >
            <Database className="w-3.5 h-3.5 text-[var(--prism-accent)]" />
            <span>{testingDb ? "Menguji..." : "Tes Koneksi DB"}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] hover:border-[var(--prism-border-strong)] transition-colors cursor-pointer"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Gelap</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Terang</span>
                </>
              )}
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] hover:border-[var(--prism-border-strong)] transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[var(--prism-accent)]" />
              <span>Website</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kunci &amp; Keluar</span>
          </button>
        </div>
      </aside>

      {/* RIGHT WORKSPACE */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile + Desktop Top Bar */}
        <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5 border-b border-[var(--prism-border)] bg-[var(--prism-surface)] backdrop-blur-xl">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/"
                className="lg:hidden shrink-0"
                title="Kembali ke Website"
              >
                <BrandLogo className="w-9 h-9 rounded-xl" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[var(--prism-ink)] truncate">
                  {activeTabMeta.label}
                </h1>
                <p className="text-xs text-[var(--prism-ink-muted)] truncate hidden sm:block">
                  {activeTabMeta.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingDb}
                className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] text-xs font-mono cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-[var(--prism-accent)]" />
                <span className="hidden sm:inline">
                  {testingDb ? "Menguji..." : "Tes DB"}
                </span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Ganti tema gelap atau terang"
                className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] text-xs font-mono cursor-pointer"
              >
                {theme === "light" ? (
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                )}
              </button>

              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] text-xs font-mono font-semibold hover:border-[var(--prism-border-strong)] transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[var(--prism-accent)]" />
                <span className="hidden sm:inline">Lihat Live</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Horizontal Tab Pills */}
          <div className="lg:hidden max-w-5xl mx-auto flex gap-1.5 overflow-x-auto pt-3 pb-0.5 text-xs font-mono">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold cursor-pointer ${
                    isActive
                      ? "prism-grad-btn"
                      : "bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-ink-soft)]"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {typeof item.count === "number" && (
                    <span className="opacity-75">({item.count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </header>

        {/* Main Workspace Content */}
        <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 flex-1 space-y-6">
          {/* Unconfigured Alert Banner */}
          {!isSupabaseConfigured && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-500 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  PERHATIAN: Database Supabase Cloud Belum Terhubung!
                </span>
              </div>
              <p className="text-[var(--prism-ink-soft)] leading-relaxed">
                File{" "}
                <code className="px-1.5 py-0.5 rounded bg-[var(--prism-surface-soft)] text-[var(--prism-ink)]">
                  .env.local
                </code>{" "}
                masih menggunakan kredensial placeholder. Masukkan{" "}
                <strong>NEXT_PUBLIC_SUPABASE_URL</strong> dan{" "}
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> agar seluruh
                perubahan tersimpan permanen ke Supabase.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("supabase-sql")}
                className="font-bold prism-grad-text underline cursor-pointer"
              >
                Lihat Panduan Setup &amp; Skrip SQL Schema &rarr;
              </button>
            </div>
          )}

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl text-xs font-mono flex items-center gap-2.5 border ${
                feedback.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-500"
                  : "bg-rose-500/10 border-rose-500/35 text-rose-500"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span className="font-semibold">{feedback.message}</span>
            </div>
          )}

          {/* ================= TAB 1: PROFILE & AVATAR ================= */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Avatar Upload Card */}
              <div className="xl:col-span-4 space-y-5">
                <div className="prism-card rounded-3xl p-6 text-center space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--prism-ink)]">
                      Foto Profil
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-accent)]">
                      Storage Sync
                    </span>
                  </div>

                  <div
                    className="w-36 h-36 mx-auto rounded-2xl p-[2px]"
                    style={{ background: "var(--prism-grad-btn)" }}
                  >
                    <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[var(--prism-surface-solid)]">
                      <Image
                        src={
                          profile.avatar_url ||
                          "https://ntffmjnovbjbcktcisoo.supabase.co/storage/v1/object/public/portfolio-assets/avatars/1790367455704-euqzo0.jpg"
                        }
                        alt="Avatar Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  <p className="text-xs text-[var(--prism-ink-muted)] font-mono leading-relaxed">
                    Unggah foto baru ke Supabase Storage — URL otomatis disimpan
                    ke tabel profil.
                  </p>

                  <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl prism-grad-btn text-xs font-mono font-bold cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>
                      {uploadingAvatar
                        ? "Mengunggah & Menyimpan..."
                        : "Pilih File Foto Baru"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>

                  <div className="pt-4 border-t border-[var(--prism-border)] text-left space-y-2">
                    <label className="block text-[11px] font-mono text-[var(--prism-ink-muted)]">
                      Atau Simpan URL Gambar Langsung:
                    </label>
                    <input
                      type="text"
                      value={profile.avatar_url}
                      onChange={(e) =>
                        setProfile({ ...profile, avatar_url: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl prism-input text-xs font-mono"
                    />
                    <button
                      type="button"
                      disabled={uploadingAvatar}
                      onClick={async () => {
                        if (!profile.avatar_url) {
                          showFeedback("error", "URL foto tidak boleh kosong.");
                          return;
                        }
                        const res = await updateProfileAvatar(
                          profile.avatar_url
                        );
                        if (res.success) {
                          showFeedback(
                            "success",
                            "URL foto profil berhasil disimpan ke database Supabase!"
                          );
                        } else {
                          showFeedback(
                            "error",
                            res.error ||
                              "Gagal menyimpan foto ke database Supabase."
                          );
                        }
                      }}
                      className="w-full py-2 px-3 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] hover:border-[var(--prism-border-strong)] disabled:opacity-50 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--prism-accent)]" />
                      <span>Simpan URL Foto</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Details Form */}
              <div className="xl:col-span-8">
                <form
                  onSubmit={handleSaveProfile}
                  className="prism-card rounded-3xl p-6 sm:p-8 space-y-5"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--prism-border)]">
                    <h2 className="text-base font-extrabold text-[var(--prism-ink)]">
                      Informasi Profil &amp; Kontak
                    </h2>
                    <span className="text-xs font-mono font-bold prism-grad-text">
                      Live Supabase Sync
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                        Spesialisasi / Role Title
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.title}
                        onChange={(e) =>
                          setProfile({ ...profile, title: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Tagline / Sub-headline
                    </label>
                    <input
                      type="text"
                      value={profile.tagline || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, tagline: e.target.value })
                      }
                      placeholder="contoh: Junior Backend Developer & Database Management"
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                        Nomor WhatsApp (kode negara 62...)
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.whatsapp_number}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            whatsapp_number: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                        Email Tujuan
                      </label>
                      <input
                        type="email"
                        required
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                        Lokasi
                      </label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                        Formspree ID
                      </label>
                      <input
                        type="text"
                        value={profile.formspree_id || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            formspree_id: e.target.value,
                          })
                        }
                        placeholder="contoh: mjykellp"
                        className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                        GitHub URL
                      </label>
                      <input
                        type="text"
                        value={profile.github_url}
                        onChange={(e) =>
                          setProfile({ ...profile, github_url: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl prism-input text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                        LinkedIn URL
                      </label>
                      <input
                        type="text"
                        value={profile.linkedin_url}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            linkedin_url: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl prism-input text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                        Instagram URL
                      </label>
                      <input
                        type="text"
                        value={profile.instagram_url || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            instagram_url: e.target.value,
                          })
                        }
                        placeholder="https://instagram.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl prism-input text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Bio Singkat (Ditampilkan di Hero &amp; Tentang Saya)
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full py-3.5 rounded-xl prism-grad-btn disabled:opacity-60 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {savingProfile
                        ? "Menyimpan ke Database Supabase..."
                        : "Simpan Perubahan Profil & Bio"}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB 2: KELOLA PROYEK ================= */}
          {activeTab === "projects" && (
            <div className="space-y-8">
              <form
                onSubmit={handleAddProject}
                className="prism-card rounded-3xl p-6 sm:p-8 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--prism-border)]">
                  <h2 className="text-base font-extrabold text-[var(--prism-ink)] flex items-center gap-2">
                    {editingProjectId ? (
                      <>
                        <Pencil className="w-4 h-4 text-amber-500" />
                        <span>
                          Edit Proyek: {newProject.title || editingProjectId}
                        </span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[var(--prism-accent)]" />
                        <span>Tambah Proyek Portofolio Baru</span>
                      </>
                    )}
                  </h2>

                  {editingProjectId ? (
                    <button
                      type="button"
                      onClick={handleCancelEditProject}
                      className="inline-flex items-center gap-1 text-xs font-mono text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/25 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Batal Edit</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-[var(--prism-ink-muted)]">
                      Upload screenshot &amp; simpan ke Supabase
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Judul Proyek
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                      placeholder="Contoh: Microservices Payment Gateway"
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Kategori
                    </label>
                    <input
                      type="text"
                      value={newProject.category}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          category: e.target.value,
                        })
                      }
                      placeholder="Contoh: Backend & Server"
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Tech Stack (pisahkan koma)
                    </label>
                    <input
                      type="text"
                      required
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Node.js, PostgreSQL, Docker, Directus"
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Metrik / Highlight Singkat
                    </label>
                    <input
                      type="text"
                      value={newProject.metrics}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          metrics: e.target.value,
                        })
                      }
                      placeholder="Contoh: Dockerized PostgreSQL & REST API"
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)]">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Upload Screenshot ke Supabase Storage
                    </label>
                    <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-solid)] text-[var(--prism-accent)] text-xs font-mono font-semibold cursor-pointer hover:border-[var(--prism-border-strong)] transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>
                        {uploadingProjectImg
                          ? "Mengunggah..."
                          : "Pilih File Gambar Proyek"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProjectImageUpload}
                        disabled={uploadingProjectImg}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Atau Masukkan URL Gambar
                    </label>
                    <input
                      type="text"
                      value={newProject.image_url}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          image_url: e.target.value,
                        })
                      }
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                    Deskripsi Proyek
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Jelaskan masalah, arsitektur solusi, dan hasil implementasi sistem..."
                    className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Link Repository GitHub
                    </label>
                    <input
                      type="text"
                      value={newProject.github_url}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          github_url: e.target.value,
                        })
                      }
                      placeholder="https://github.com/username/repo"
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Link Live Demo / Dokumentasi
                    </label>
                    <input
                      type="text"
                      value={newProject.demo_url}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          demo_url: e.target.value,
                        })
                      }
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm"
                    />
                  </div>
                </div>

                <label
                  htmlFor="featuredToggle"
                  className="inline-flex items-center gap-2.5 text-xs font-mono text-[var(--prism-ink-soft)] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="featuredToggle"
                    checked={Boolean(newProject.featured)}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        featured: e.target.checked,
                      })
                    }
                    className="rounded accent-indigo-500 w-4 h-4"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--prism-accent)]" />
                    Tandai sebagai Proyek Unggulan (Featured)
                  </span>
                </label>

                <div className="flex gap-3">
                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={handleCancelEditProject}
                      className="py-3 px-5 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] font-mono text-xs font-semibold cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl prism-grad-btn font-bold text-sm cursor-pointer"
                  >
                    {editingProjectId
                      ? "Simpan Perubahan Proyek"
                      : "+ Simpan Proyek ke Portofolio"}
                  </button>
                </div>
              </form>

              {/* Active Projects List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[var(--prism-ink)]">
                    Daftar Proyek Aktif ({projects.length})
                  </h3>
                  <span className="text-xs font-mono text-[var(--prism-ink-muted)]">
                    Live DB
                  </span>
                </div>

                {projects.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl prism-card text-[var(--prism-ink-muted)] font-mono text-xs">
                    Belum ada proyek terdaftar di database Supabase.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className={`prism-card prism-card-hover rounded-2xl p-4 flex items-start gap-4 transition-opacity ${
                          deletingProjectId === proj.id
                            ? "opacity-40 pointer-events-none"
                            : ""
                        }`}
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] shrink-0">
                          <Image
                            src={proj.image_url}
                            alt={proj.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-bold text-[var(--prism-ink)] truncate">
                              {proj.title}
                            </h4>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleEditProject(proj)}
                                disabled={Boolean(deletingProjectId)}
                                className="p-1.5 rounded-lg bg-[var(--prism-surface-soft)] text-[var(--prism-accent)] border border-[var(--prism-border)] hover:border-[var(--prism-border-strong)] transition-colors cursor-pointer disabled:opacity-50"
                                title="Edit proyek"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(proj.id)}
                                disabled={deletingProjectId === proj.id}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/25 transition-colors cursor-pointer disabled:opacity-50"
                                title="Hapus proyek permanen"
                              >
                                {deletingProjectId === proj.id ? (
                                  <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-[var(--prism-ink-soft)] line-clamp-2 mt-1">
                            {proj.description}
                          </p>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {proj.tech_stack.slice(0, 3).map((t, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-ink-soft)]"
                              >
                                {t}
                              </span>
                            ))}
                            {proj.tech_stack.length > 3 && (
                              <span className="text-[10px] font-mono text-[var(--prism-ink-muted)]">
                                +{proj.tech_stack.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 3: KELOLA SERTIFIKAT ================= */}
          {activeTab === "certificates" && (
            <div className="space-y-8">
              <form
                onSubmit={handleAddCertificate}
                className="prism-card rounded-3xl p-6 sm:p-8 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--prism-border)]">
                  <h2 className="text-base font-extrabold text-[var(--prism-ink)] flex items-center gap-2">
                    {editingCertId ? (
                      <>
                        <Pencil className="w-4 h-4 text-amber-500" />
                        <span>
                          Edit Sertifikat: {newCert.title || editingCertId}
                        </span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[var(--prism-accent)]" />
                        <span>Tambah Sertifikat Baru</span>
                      </>
                    )}
                  </h2>

                  {editingCertId ? (
                    <button
                      type="button"
                      onClick={handleCancelEditCertificate}
                      className="inline-flex items-center gap-1 text-xs font-mono text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/25 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Batal Edit</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-[var(--prism-ink-muted)]">
                      Upload gambar sertifikat ke Supabase
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Nama / Judul Sertifikasi
                    </label>
                    <input
                      type="text"
                      required
                      value={newCert.title}
                      onChange={(e) =>
                        setNewCert({ ...newCert, title: e.target.value })
                      }
                      placeholder="Contoh: Backend & RESTful API"
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Penerbit (Issuer)
                    </label>
                    <input
                      type="text"
                      required
                      value={newCert.issuer}
                      onChange={(e) =>
                        setNewCert({ ...newCert, issuer: e.target.value })
                      }
                      placeholder="Contoh: Dicoding / HackerRank"
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Tahun / Tanggal Diterbitkan
                    </label>
                    <input
                      type="text"
                      required
                      value={newCert.issue_date}
                      onChange={(e) =>
                        setNewCert({ ...newCert, issue_date: e.target.value })
                      }
                      placeholder="Contoh: 2024"
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Skill Terverifikasi (pisahkan koma)
                    </label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="PostgreSQL, Docker, Node-RED, REST API"
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--prism-surface-soft)] border border-[var(--prism-border)]">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Upload File Sertifikat ke Supabase Storage
                    </label>
                    <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-solid)] text-[var(--prism-accent)] text-xs font-mono font-semibold cursor-pointer hover:border-[var(--prism-border-strong)] transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>
                        {uploadingCertImg
                          ? "Mengunggah..."
                          : "Pilih File Gambar Sertifikat"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCertImageUpload}
                        disabled={uploadingCertImg}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                      Atau Masukkan URL Gambar
                    </label>
                    <input
                      type="text"
                      value={newCert.image_url}
                      onChange={(e) =>
                        setNewCert({ ...newCert, image_url: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl prism-input text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--prism-ink-soft)] mb-1.5">
                    URL Verifikasi Kredensial Resmi
                  </label>
                  <input
                    type="text"
                    value={newCert.credential_url}
                    onChange={(e) =>
                      setNewCert({ ...newCert, credential_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl prism-input text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  {editingCertId && (
                    <button
                      type="button"
                      onClick={handleCancelEditCertificate}
                      className="py-3 px-5 rounded-xl border border-[var(--prism-border)] bg-[var(--prism-surface-soft)] text-[var(--prism-ink)] font-mono text-xs font-semibold cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl prism-grad-btn font-bold text-sm cursor-pointer"
                  >
                    {editingCertId
                      ? "Simpan Perubahan Sertifikat"
                      : "+ Simpan Sertifikat ke Portofolio"}
                  </button>
                </div>
              </form>

              {/* Active Certificates Grid (Uncropped Thumbnails) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[var(--prism-ink)]">
                    Daftar Sertifikat Aktif ({certificates.length})
                  </h3>
                  <span className="text-xs font-mono text-[var(--prism-ink-muted)]">
                    Live DB
                  </span>
                </div>

                {certificates.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl prism-card text-[var(--prism-ink-muted)] font-mono text-xs">
                    Belum ada sertifikat terdaftar di database Supabase.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className={`prism-card prism-card-hover rounded-2xl overflow-hidden flex flex-col justify-between transition-opacity ${
                          deletingCertId === cert.id
                            ? "opacity-40 pointer-events-none"
                            : ""
                        }`}
                      >
                        <div>
                          <div className="w-full aspect-[16/11] bg-[var(--prism-surface-soft)] border-b border-[var(--prism-border)] p-2 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={cert.image_url}
                              alt={cert.title}
                              loading="lazy"
                              className="max-w-full max-h-full w-auto h-auto object-contain rounded"
                            />
                          </div>
                          <div className="p-4">
                            <div className="text-[11px] font-mono font-bold text-[var(--prism-accent)]">
                              {cert.issuer} · {cert.issue_date}
                            </div>
                            <h4 className="text-sm font-bold text-[var(--prism-ink)] mt-1 line-clamp-2">
                              {cert.title}
                            </h4>
                          </div>
                        </div>

                        <div className="px-4 py-3 border-t border-[var(--prism-border)] flex items-center justify-between">
                          {cert.credential_url ? (
                            <a
                              href={cert.credential_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-mono font-bold prism-grad-text hover:underline flex items-center gap-1"
                            >
                              Verifikasi <ExternalLink className="w-3 h-3 text-[var(--prism-accent)]" />
                            </a>
                          ) : (
                            <span className="text-xs font-mono text-[var(--prism-ink-muted)]">
                              No link
                            </span>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditCertificate(cert)}
                              disabled={Boolean(deletingCertId)}
                              className="p-1.5 rounded-lg bg-[var(--prism-surface-soft)] text-[var(--prism-accent)] border border-[var(--prism-border)] hover:border-[var(--prism-border-strong)] transition-colors cursor-pointer disabled:opacity-50"
                              title="Edit sertifikat"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCertificate(cert.id)}
                              disabled={deletingCertId === cert.id}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/25 transition-colors cursor-pointer disabled:opacity-50"
                              title="Hapus sertifikat permanen"
                            >
                              {deletingCertId === cert.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: SUPABASE SETUP & SQL SCHEMA ================= */}
          {activeTab === "supabase-sql" && (
            <div className="prism-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--prism-surface-soft)] border border-[var(--prism-border)] text-[var(--prism-accent)]">
                  Langkah Cepat Setup Supabase
                </span>
                <h2 className="text-2xl font-extrabold text-[var(--prism-ink)] tracking-tight mt-3">
                  Skrip SQL DDL &amp; Storage Bucket
                </h2>
                <p className="text-sm text-[var(--prism-ink-soft)] mt-1">
                  Ikuti langkah di bawah untuk menghubungkan portofolio ini
                  dengan proyek Supabase Anda:
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-[var(--prism-ink-soft)] font-mono">
                <li>
                  Buka{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="prism-grad-text font-bold underline"
                  >
                    Supabase Dashboard
                  </a>{" "}
                  lalu buat proyek baru.
                </li>
                <li>
                  Masuk ke menu <strong>SQL Editor</strong>, tempel skrip SQL di
                  bawah, lalu klik <strong>Run</strong>.
                </li>
                <li>
                  Masuk ke menu <strong>Storage</strong>, pastikan bucket{" "}
                  <code className="px-1.5 py-0.5 rounded bg-[var(--prism-surface-soft)] text-[var(--prism-ink)]">
                    portfolio-assets
                  </code>{" "}
                  berstatus <strong>Public</strong>.
                </li>
                <li>
                  Salin <strong>Project URL</strong> &amp;{" "}
                  <strong>anon key</strong> dari{" "}
                  <strong>Project Settings &gt; API</strong> ke{" "}
                  <code className="px-1.5 py-0.5 rounded bg-[var(--prism-surface-soft)] text-[var(--prism-ink)]">
                    .env.local
                  </code>
                  .
                </li>
              </ol>

              {/* SQL Console Box */}
              <div
                className="rounded-2xl overflow-hidden border border-white/10"
                style={{
                  background: "var(--prism-code-bg)",
                  color: "var(--prism-code-ink)",
                }}
              >
                <div
                  className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 text-xs font-mono text-slate-400"
                  style={{ background: "var(--prism-code-surface)" }}
                >
                  <span>supabase-schema.sql</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
                      showFeedback(
                        "success",
                        "Skrip SQL berhasil disalin ke clipboard!"
                      );
                    }}
                    className="inline-flex items-center gap-1.5 text-sky-300 hover:text-white font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin SQL</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 m-0">
                  {SUPABASE_SCHEMA_SQL}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const SUPABASE_SCHEMA_SQL = `-- 0. HAPUS TABEL LAMA (Jika sebelumnya dibuat via GUI dengan tipe ID integer/bigint)
DROP TABLE IF EXISTS public.profile CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;

-- 1. TABEL PROFILE (Menyimpan foto avatar & data profil dinamis)
CREATE TABLE public.profile (
  id TEXT PRIMARY KEY DEFAULT 'main-profile',
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  whatsapp_number TEXT,
  email TEXT,
  location TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  formspree_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABEL PROJECTS
CREATE TABLE public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  category TEXT DEFAULT 'Aplikasi Web',
  featured BOOLEAN DEFAULT FALSE,
  metrics TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL CERTIFICATES
CREATE TABLE public.certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT,
  credential_url TEXT,
  image_url TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BUCKET STORAGE UNTUK ASSETS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. ATURAN KEAMANAN & AKSES (RLS & Storage Policies)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read profile" ON public.profile;
DROP POLICY IF EXISTS "Allow all profile" ON public.profile;
CREATE POLICY "Allow public read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Allow all profile" ON public.profile FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read projects" ON public.projects;
DROP POLICY IF EXISTS "Allow all projects" ON public.projects;
CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow all projects" ON public.projects FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read certs" ON public.certificates;
DROP POLICY IF EXISTS "Allow all certs" ON public.certificates;
CREATE POLICY "Allow public read certs" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow all certs" ON public.certificates FOR ALL USING (true);

-- Storage bucket access policies
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Insert Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-assets');

-- 6. DATA AWAL (SEED DATA BERDASARKAN CV DANENDRA)
INSERT INTO public.profile (id, name, title, tagline, bio, avatar_url, resume_url, whatsapp_number, email, location, github_url, linkedin_url, instagram_url)
VALUES (
  'main-profile',
  'Danendra Athallah Indiarto',
  'Junior Backend Developer',
  'Junior Backend Developer & Database Management',
  'Halo, saya Danendra Athallah Indiarto. Berfokus pada perancangan RESTful API dengan Node.js, pengelolaan database MySQL & PostgreSQL di dalam Docker, Directus, otomasi Node-RED, serta manajemen server Linux Ubuntu dan PM2.',
  'https://ntffmjnovbjbcktcisoo.supabase.co/storage/v1/object/public/portfolio-assets/avatars/1790367455704-euqzo0.jpg',
  '#contact',
  '6282334027274',
  'indiartodanendra@gmail.com',
  'Malang, Indonesia',
  'https://github.com/danendraindiarto',
  'https://www.linkedin.com/in/danendra-indiarto',
  'https://www.instagram.com/d.atllh'
)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  location = EXCLUDED.location,
  whatsapp_number = EXCLUDED.whatsapp_number,
  updated_at = NOW();
`;

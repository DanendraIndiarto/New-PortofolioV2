"use client";

import { useState, useEffect } from "react";
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
  LogOut
} from "lucide-react";
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
  removeCertificate 
} from "@/lib/data";
import { isSupabaseConfigured, uploadMedia, testSupabaseConnection } from "@/lib/supabase";
import { Profile, Project, Certificate } from "@/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("portfolio_admin_auth") === "true";
    }
    return false;
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pinSubmitting, setPinSubmitting] = useState(false);
  const [pinErrorMessage, setPinErrorMessage] = useState<string | null>(null);

  // Check server auth cookie on initial mount
  useEffect(() => {
    async function checkServerAuth() {
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

  // Active Tab: 'profile' | 'projects' | 'certificates' | 'supabase-sql'
  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "certificates" | "supabase-sql">("profile");

  // Data states
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [certificates, setCertificates] = useState<Certificate[]>(DEFAULT_CERTIFICATES);

  // Edit states for existing items
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  // Notification feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
  const [techInput, setTechInput] = useState("Node.js, Express.js, MySQL, PM2");

  // New Certificate Form State
  const [newCert, setNewCert] = useState<Partial<Certificate>>({
    title: "",
    issuer: "",
    issue_date: new Date().getFullYear().toString(),
    credential_url: "",
    image_url: "",
    skills: [],
  });
  const [skillsInput, setSkillsInput] = useState("Node.js, RESTful API, MySQL, Linux Ubuntu");

  // Load live data
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

    if (isAuthenticated) {
      loadAll();
    }
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
      // Offline fallback
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
        res.connected && res.tableProfileOk && res.storageOk ? "success" : "error",
        res.message
      );
    } finally {
      setTestingDb(false);
    }
  };

  // Avatar upload handler - uploads to Supabase Storage & automatically saves to database record
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      // 1. Upload to Supabase Storage bucket 'portfolio-assets' (folder: 'avatars')
      const { url, error } = await uploadMedia(file, "avatars");
      if (error || !url) {
        showFeedback("error", error || "Gagal mengunggah foto profil ke Supabase Storage.");
        return;
      }

      // 2. Immediately update local state
      setProfile((prev) => ({ ...prev, avatar_url: url }));

      // 3. Immediately persist the public URL to Supabase database table 'profile'
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
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan upload.";
      showFeedback("error", msg);
    } finally {
      setUploadingAvatar(false);
      // Reset input value to allow re-uploading same file if desired
      e.target.value = "";
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await saveProfile(profile);
      if (res.success) {
        showFeedback("success", "Profil & Bio berhasil disimpan ke database Supabase!");
      } else {
        showFeedback("error", res.error || "Gagal menyimpan profil.");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  // Project Image upload handler
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Add or Update Project
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
      image_url: newProject.image_url || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
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
        setProjects((prev) => prev.map((p) => (p.id === editingProjectId ? projectData : p)));
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
      setTechInput("Node.js, Express.js, MySQL, PM2");
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
    setTechInput("Node.js, Express.js, MySQL, PM2");
  };

  // Delete Project
  const handleDeleteProject = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;
    const res = await removeProject(id);
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (editingProjectId === id) {
        handleCancelEditProject();
      }
      showFeedback("success", "Proyek berhasil dihapus.");
    } else {
      showFeedback("error", res.error || "Gagal menghapus proyek.");
    }
  };

  // Certificate Image upload handler
  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Add or Update Certificate
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
      image_url: newCert.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
      skills: skillsArray,
      created_at: newCert.created_at || new Date().toISOString(),
    };

    const res = await saveCertificate(certData);
    if (res.success) {
      if (isEdit) {
        setCertificates((prev) => prev.map((c) => (c.id === editingCertId ? certData : c)));
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
      setSkillsInput("Node.js, RESTful API, MySQL, Linux Ubuntu");
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
    setSkillsInput("Node.js, RESTful API, MySQL, Linux Ubuntu");
  };

  // Delete Certificate
  const handleDeleteCertificate = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus sertifikat ini?")) return;
    const res = await removeCertificate(id);
    if (res.success) {
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      if (editingCertId === id) {
        handleCancelEditCertificate();
      }
      showFeedback("success", "Sertifikat berhasil dihapus.");
    } else {
      showFeedback("error", res.error || "Gagal menghapus sertifikat.");
    }
  };

  // PIN Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#070b12]">
        <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl relative">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Masukkan Security PIN untuk mengelola portofolio & Supabase.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Security PIN Code:
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-center text-white tracking-widest focus:outline-none focus:border-emerald-500"
              />
              {pinError && (
                <p className="text-xs text-red-400 font-mono mt-1.5 text-center">
                  {pinErrorMessage || "PIN salah! Silakan masukkan Security PIN yang benar."}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pinSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              {pinSubmitting ? "Memverifikasi..." : "Buka Dashboard"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Utama</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/90 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="Kembali ke Website"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <span>ADMIN CONTROLLER</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    AUTHORIZED
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 font-mono">
                  Live Supabase & Profile Management
                </p>
              </div>
            </div>
          </div>

          {/* Connection status indicator */}
          {/* Connection status indicator & diagnostic test */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTestConnection}
              disabled={testingDb}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition-colors"
              title="Periksa koneksi tabel database dan storage Supabase"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{testingDb ? "Menguji..." : "Tes Koneksi Supabase"}</span>
            </button>

            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Connected
              </span>
            ) : (
              <button
                onClick={() => setActiveTab("supabase-sql")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Belum Terhubung (Klik Setup)</span>
              </button>
            )}

            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lihat Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-mono text-red-400 hover:text-red-300 transition-colors"
              title="Kunci Dashboard & Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Unconfigured Alert Banner */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>PERHATIAN: Database Supabase Cloud Belum Terhubung!</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              File <code className="text-amber-200 px-1 py-0.5 bg-slate-900 rounded">.env.local</code> masih menggunakan kredensial placeholder (<code className="text-amber-200">your-project-id.supabase.co</code>).
              Agar setiap kali mengedit data profil, bio, dan mengunggah foto langsung tersimpan permanen ke Supabase dan otomatis berubah di semua perangkat saat direfresh, silakan buka file <code className="text-amber-200">.env.local</code> di editor lalu masukkan <strong>NEXT_PUBLIC_SUPABASE_URL</strong> dan <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> dari Dashboard Supabase Anda.
            </p>
            <div className="pt-1 flex items-center gap-4">
              <button
                onClick={() => setActiveTab("supabase-sql")}
                className="text-emerald-400 hover:text-emerald-300 underline font-semibold flex items-center gap-1"
              >
                <span>Lihat Panduan Setup &amp; Skrip SQL Schema →</span>
              </button>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 transition-all ${
              feedback.type === "success"
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                : "bg-red-500/15 border border-red-500/30 text-red-300"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/90 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === "profile"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil & Foto Avatar</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === "projects"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Kelola Proyek ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === "certificates"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Kelola Sertifikat ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("supabase-sql")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === "supabase-sql"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Setup SQL Supabase</span>
          </button>
        </div>

        {/* TAB 1: PROFIL & FOTO AVATAR */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Avatar Upload Box */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-slate-800/80 text-center">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Foto Profil (Avatar)
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Storage Sync
                  </span>
                </div>

                <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/40 p-1 bg-slate-900 shadow-xl mb-4 group/preview">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-800">
                    <Image
                      src={profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
                      alt="Avatar Preview"
                      fill
                      className="object-cover group-hover/preview:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-4 font-mono leading-relaxed">
                  Unggah file foto baru. URL publik dari Supabase Storage akan otomatis disimpan ke database profil:
                </p>

                {/* File Upload Button */}
                <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-mono border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingAvatar ? "Mengunggah & Menyimpan ke DB..." : "Pilih File Foto Baru"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                </label>

                {/* Direct Avatar URL input & Instant Save Button */}
                <div className="mt-4 pt-4 border-t border-slate-800 text-left">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Atau Simpan URL Gambar Langsung:
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={profile.avatar_url}
                      onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      disabled={uploadingAvatar}
                      onClick={async () => {
                        if (!profile.avatar_url) {
                          showFeedback("error", "URL foto tidak boleh kosong.");
                          return;
                        }
                        const res = await updateProfileAvatar(profile.avatar_url);
                        if (res.success) {
                          showFeedback("success", "URL foto profil berhasil disimpan ke database Supabase!");
                        } else {
                          showFeedback("error", res.error || "Gagal menyimpan foto ke database Supabase.");
                        }
                      }}
                      className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-850 disabled:opacity-50 text-emerald-400 border border-slate-800 hover:border-emerald-500/40 text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Simpan URL Foto ke Database Supabase</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Profile Details Form */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSaveProfile} className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white font-mono">
                    Informasi Profil & Kontak
                  </h3>
                  <span className="text-xs font-mono text-emerald-400">
                    Live Supabase Sync
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Nama Lengkap:
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Spesialisasi / Role Title:
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Tagline / Sub-headline Hero:
                  </label>
                  <input
                    type="text"
                    value={profile.tagline || ""}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    placeholder="contoh: Junior Backend Developer & Database Management"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Nomor WhatsApp (dengan kode negara 62...):
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.whatsapp_number}
                      onChange={(e) => setProfile({ ...profile, whatsapp_number: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Email Tujuan:
                    </label>
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Lokasi:
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      GitHub URL:
                    </label>
                    <input
                      type="text"
                      value={profile.github_url}
                      onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      LinkedIn URL:
                    </label>
                    <input
                      type="text"
                      value={profile.linkedin_url}
                      onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Instagram URL:
                    </label>
                    <input
                      type="text"
                      value={profile.instagram_url || ""}
                      onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Formspree ID (Opsional untuk Form Kontak Email):
                  </label>
                  <input
                    type="text"
                    value={profile.formspree_id || ""}
                    onChange={(e) => setProfile({ ...profile, formspree_id: e.target.value })}
                    placeholder="contoh: mldgygqw"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Bio Singkat (Ditampilkan pada About Section):
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savingProfile ? "Menyimpan ke Database Supabase..." : "Simpan Perubahan Profil & Bio ke Supabase"}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: KELOLA PROYEK */}
        {activeTab === "projects" && (
          <div className="space-y-12">
            
            {/* Form Tambah / Edit Proyek */}
            <form onSubmit={handleAddProject} className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  {editingProjectId ? (
                    <>
                      <Pencil className="w-4 h-4 text-amber-400" />
                      <span>Edit Proyek: {newProject.title || editingProjectId}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Tambah Proyek Portofolio Baru</span>
                    </>
                  )}
                </h3>
                {editingProjectId ? (
                  <button
                    type="button"
                    onClick={handleCancelEditProject}
                    className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Batal Edit</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-slate-400">
                    Upload screenshot &amp; simpan ke Supabase
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Judul Proyek:
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Contoh: Microservices Payment Gateway"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Kategori:
                  </label>
                  <input
                    type="text"
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    placeholder="Contoh: Microservices & Distributed"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Tech Stack (pisahkan koma):
                  </label>
                  <input
                    type="text"
                    required
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Node.js, PostgreSQL, Docker, Redis"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Metrik Performa / Highlight Singkat:
                  </label>
                  <input
                    type="text"
                    value={newProject.metrics}
                    onChange={(e) => setNewProject({ ...newProject, metrics: e.target.value })}
                    placeholder="Contoh: 1,200+ TPS | < 35ms latency"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Upload screenshot or URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Upload Screenshot ke Supabase Storage:
                  </label>
                  <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-emerald-400 text-xs font-mono border border-slate-800 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingProjectImg ? "Mengunggah..." : "Pilih File Gambar Proyek"}</span>
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
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Atau Masukkan URL Gambar:
                  </label>
                  <input
                    type="text"
                    value={newProject.image_url}
                    onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Deskripsi Proyek:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Jelaskan masalah, arsitektur solusi, dan hasil implementasi sistem..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Link Repository GitHub:
                  </label>
                  <input
                    type="text"
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Link Live Demo / API Documentation:
                  </label>
                  <input
                    type="text"
                    value={newProject.demo_url}
                    onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                    placeholder="https://api.example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={newProject.featured}
                  onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="featuredToggle" className="text-xs font-mono text-slate-300 cursor-pointer">
                  Tandai sebagai Proyek Unggulan (Featured Bento Card)
                </label>
              </div>

              <div className="flex gap-3">
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={handleCancelEditProject}
                    className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-all"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
                >
                  {editingProjectId ? "✓ Simpan Perubahan Proyek" : "+ Simpan Proyek ke Portofolio"}
                </button>
              </div>
            </form>

            {/* List Proyek Terdaftar */}
            <div>
              <h3 className="text-lg font-bold text-white font-mono mb-4 flex items-center justify-between">
                <span>Daftar Proyek Aktif ({projects.length})</span>
                <span className="text-xs font-mono text-slate-500">Live DB</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="glass-card rounded-xl p-4 border border-slate-800 flex items-start gap-4 relative group"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                      <Image
                        src={proj.image_url}
                        alt={proj.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-white truncate">
                          {proj.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditProject(proj)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                            title="Edit proyek"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                            title="Hapus proyek"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.tech_stack.slice(0, 3).map((t, i) => (
                          <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {t}
                          </span>
                        ))}
                        {proj.tech_stack.length > 3 && (
                          <span className="text-[10px] font-mono text-slate-500">
                            +{proj.tech_stack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: KELOLA SERTIFIKAT */}
        {activeTab === "certificates" && (
          <div className="space-y-12">
            
            {/* Form Tambah / Edit Sertifikat */}
            <form onSubmit={handleAddCertificate} className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  {editingCertId ? (
                    <>
                      <Pencil className="w-4 h-4 text-amber-400" />
                      <span>Edit Sertifikat: {newCert.title || editingCertId}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Tambah Sertifikat Baru</span>
                    </>
                  )}
                </h3>
                {editingCertId ? (
                  <button
                    type="button"
                    onClick={handleCancelEditCertificate}
                    className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Batal Edit</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-slate-400">
                    Upload file/gambar sertifikat ke Supabase
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Nama / Judul Sertifikasi:
                  </label>
                  <input
                    type="text"
                    required
                    value={newCert.title}
                    onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                    placeholder="Contoh: AWS Certified Solutions Architect"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Penerbit (Issuer):
                  </label>
                  <input
                    type="text"
                    required
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    placeholder="Contoh: Amazon Web Services / Dicoding"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Tahun / Tanggal Diterbitkan:
                  </label>
                  <input
                    type="text"
                    required
                    value={newCert.issue_date}
                    onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                    placeholder="Contoh: 2024"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Skill Terverifikasi (pisahkan koma):
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="Cloud Architecture, VPC, Docker"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Upload Certificate Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Upload File Sertifikat ke Supabase Storage:
                  </label>
                  <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-emerald-400 text-xs font-mono border border-slate-800 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingCertImg ? "Mengunggah..." : "Pilih File Gambar Sertifikat"}</span>
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
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Atau Masukkan URL Gambar:
                  </label>
                  <input
                    type="text"
                    value={newCert.image_url}
                    onChange={(e) => setNewCert({ ...newCert, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  URL Verifikasi Kredensial Resmi:
                </label>
                <input
                  type="text"
                  value={newCert.credential_url}
                  onChange={(e) => setNewCert({ ...newCert, credential_url: e.target.value })}
                  placeholder="https://aws.amazon.com/verification/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3">
                {editingCertId && (
                  <button
                    type="button"
                    onClick={handleCancelEditCertificate}
                    className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-all"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
                >
                  {editingCertId ? "✓ Simpan Perubahan Sertifikat" : "+ Simpan Sertifikat ke Portofolio"}
                </button>
              </div>
            </form>

            {/* List Sertifikat Aktif */}
            <div>
              <h3 className="text-lg font-bold text-white font-mono mb-4 flex items-center justify-between">
                <span>Daftar Sertifikat Aktif ({certificates.length})</span>
                <span className="text-xs font-mono text-slate-500">Live DB</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-900 mb-3">
                        <Image
                          src={cert.image_url}
                          alt={cert.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400">
                        {cert.issuer} • {cert.issue_date}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">
                        {cert.title}
                      </h4>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                      {cert.credential_url ? (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          Verifikasi <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs font-mono text-slate-500">No link</span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditCertificate(cert)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                          title="Edit sertifikat"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCertificate(cert.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                          title="Hapus sertifikat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: SUPABASE SETUP & SQL SCHEMA */}
        {activeTab === "supabase-sql" && (
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 space-y-6">
            <div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                Langkah Cepat Setup Supabase
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-2">
                Skrip SQL DDL & Storage Bucket
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Ikuti langkah mudah di bawah untuk menghubungkan portofolio ini dengan akun Supabase Anda:
              </p>
            </div>

            <ol className="list-decimal list-inside space-y-3 text-xs sm:text-sm text-slate-300 font-mono">
              <li>
                Buka <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Supabase Dashboard</a> lalu buat proyek baru (free tier).
              </li>
              <li>
                Masuk ke menu <strong>SQL Editor</strong>, tempel skrip SQL di bawah, dan klik <strong>Run</strong>.
              </li>
              <li>
                Masuk ke menu <strong>Storage</strong>, pastikan bucket bernama <code className="text-emerald-300">portfolio-assets</code> sudah terbuat dan diset <strong>Public</strong>.
              </li>
              <li>
                Salin <strong>Project URL</strong> dan <strong>anon key</strong> dari menu <strong>Project Settings &gt; API</strong> ke file <code className="text-emerald-300">.env.local</code> proyek Anda.
              </li>
            </ol>

            {/* SQL Code Box */}
            <div className="relative">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border border-slate-800 rounded-t-xl text-xs font-mono text-slate-400">
                <span>supabase-schema.sql</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
                    showFeedback("success", "Skrip SQL berhasil disalin ke clipboard!");
                  }}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin SQL</span>
                </button>
              </div>
              <pre className="p-4 bg-[#060a12] border-x border-b border-slate-800 rounded-b-xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-96">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>
          </div>
        )}

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
  'Halo, saya Danendra Athallah Indiarto. Berfokus pada perancangan RESTful API yang efisien, pengelolaan database MySQL, serta manajemen server menggunakan Linux Ubuntu dan PM2. Memiliki pengalaman dalam integrasi database relasional, otomasi deployment menggunakan GitHub Actions, dan pembuatan aplikasi web modern.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  '#contact',
  '6282334027274',
  'danendra.athallah@gmail.com',
  'Malang, Indonesia',
  'https://github.com',
  'https://linkedin.com',
  'https://instagram.com'
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

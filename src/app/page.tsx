"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import PortfolioSection from "@/components/PortfolioSection";
import CertificatesSection from "@/components/CertificatesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { 
  DEFAULT_PROFILE, 
  DEFAULT_PROJECTS, 
  DEFAULT_CERTIFICATES, 
  DEFAULT_EXPERIENCES,
  fetchProfile,
  fetchProjects,
  fetchCertificates
} from "@/lib/data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Profile, Project, Certificate } from "@/types";

export default function Home() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("portfolio_cached_projects");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return DEFAULT_PROJECTS;
  });
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("portfolio_cached_certificates");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return DEFAULT_CERTIFICATES;
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, projData, certData] = await Promise.all([
          fetchProfile(),
          fetchProjects(),
          fetchCertificates(),
        ]);
        if (profData) setProfile(profData);
        if (projData) setProjects(projData);
        if (certData) setCertificates(certData);
      } catch (err) {
        console.error("Error loading portfolio data:", err);
      }
    }

    loadData();

    // 1. Instant in-app update event (same window/tab)
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ action?: string; id?: string }>;
      if (customEvent.detail?.action === "DELETE_PROJECT" && customEvent.detail.id) {
        setProjects((prev) => prev.filter((p) => p.id !== customEvent.detail!.id));
      } else if (customEvent.detail?.action === "DELETE_CERTIFICATE" && customEvent.detail.id) {
        setCertificates((prev) => prev.filter((c) => c.id !== customEvent.detail!.id));
      }
      loadData();
    };
    window.addEventListener("portfolio_updated", handleLocalUpdate);

    // 2. Cross-tab storage change listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio_sync_action" && e.newValue) {
        try {
          const actionData = JSON.parse(e.newValue);
          if (actionData.type === "DELETE_PROJECT" && actionData.id) {
            setProjects((prev) => prev.filter((p) => p.id !== actionData.id));
          } else if (actionData.type === "DELETE_CERTIFICATE" && actionData.id) {
            setCertificates((prev) => prev.filter((c) => c.id !== actionData.id));
          }
        } catch {}
      }
      loadData();
    };
    window.addEventListener("storage", handleStorageChange);

    // 3. Tab visibility & focus sync (auto-refresh when switching back to tab)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    };
    window.addEventListener("focus", loadData);
    document.addEventListener("visibilitychange", handleVisibility);

    // 4. Supabase Realtime multi-device sync (both Broadcast & Postgres Changes)
    let channel: ReturnType<NonNullable<typeof supabase>["channel"]> | null = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel("portfolio-sync")
        // Realtime Broadcast (fastest multi-device sync)
        .on("broadcast", { event: "sync_event" }, (msg) => {
          const payload = msg.payload as { action?: string; id?: string };
          if (payload?.action === "DELETE_PROJECT" && payload.id) {
            setProjects((prev) => prev.filter((p) => p.id !== payload.id));
          } else if (payload?.action === "DELETE_CERTIFICATE" && payload.id) {
            setCertificates((prev) => prev.filter((c) => c.id !== payload.id));
          }
          loadData();
        })
        // Postgres Changes (table-level triggers)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profile" },
          () => {
            loadData();
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "projects" },
          (payload) => {
            if (payload.eventType === "DELETE") {
              const oldId = (payload.old as { id?: string })?.id;
              if (oldId) {
                setProjects((prev) => prev.filter((p) => p.id !== oldId));
              }
            }
            loadData();
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
              }
            }
            loadData();
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener("portfolio_updated", handleLocalUpdate);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", loadData);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile} />
      <main className="flex-1">
        <Hero profile={profile} />
        <AboutSection profile={profile} />
        <ExperienceSection experiences={DEFAULT_EXPERIENCES} />
        <PortfolioSection projects={projects} />
        <CertificatesSection certificates={certificates} />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}

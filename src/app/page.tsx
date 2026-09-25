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
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [certificates, setCertificates] = useState<Certificate[]>(DEFAULT_CERTIFICATES);

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

    // 1. Listen to instant in-app update event (same window/tab)
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener("portfolio_updated", handleUpdate);

    // 2. Listen to cross-tab storage changes
    window.addEventListener("storage", handleUpdate);

    // 3. Listen to live Supabase Realtime changes (cross-device & direct DB edits)
    let channel: ReturnType<NonNullable<typeof supabase>["channel"]> | null = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel("portfolio-realtime-sync")
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
          () => {
            loadData();
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "certificates" },
          () => {
            loadData();
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener("portfolio_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
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

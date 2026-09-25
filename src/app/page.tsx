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
import { Profile, Project, Certificate } from "@/types";

export default function Home() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [certificates, setCertificates] = useState<Certificate[]>(DEFAULT_CERTIFICATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, projData, certData] = await Promise.all([
          fetchProfile(),
          fetchProjects(),
          fetchCertificates(),
        ]);
        if (profData) setProfile(profData);
        if (projData && projData.length > 0) setProjects(projData);
        if (certData && certData.length > 0) setCertificates(certData);
      } catch (err) {
        console.error("Error loading portfolio data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Listen to local storage updates if changed in admin tab
    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero profile={profile} />
        <AboutSection profile={profile} />
        <ExperienceSection experiences={DEFAULT_EXPERIENCES} />
        <PortfolioSection projects={projects} />
        <CertificatesSection certificates={certificates} />
        <ContactSection profile={profile} />
      </main>
      <Footer />
    </div>
  );
}

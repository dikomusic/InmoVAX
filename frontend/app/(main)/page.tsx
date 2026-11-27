import React from 'react';
import { HeroSearch } from "@/components/organisms/HeroSearch";
import { PlatformServicesSection } from "@/components/organisms/PlatformServicesSection";
import { FeaturedPropertiesSection } from "@/components/organisms/FeaturedPropertiesSection";
import { HowPlatformWorksSection } from "@/components/organisms/HowPlatformWorksSection";
import { CommunityForumPreview } from "@/components/organisms/CommunityForumPreview";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-light">
      {/* 1. HERO CON BUSCADOR PRINCIPAL */}
      <HeroSearch />

      {/* 2. SERVICIOS DE LA PLATAFORMA (NO SOMOS INMOBILIARIA) */}
      <PlatformServicesSection />

      {/* 3. PROPIEDADES DISPONIBLES CON FOLIO REAL AUDITADO */}
      <FeaturedPropertiesSection />

      {/* 4. CÓMO FUNCIONA LA PLATAFORMA */}
      <HowPlatformWorksSection />

      {/* 5. FORO DE LA COMUNIDAD INMOBILIARIA */}
      <CommunityForumPreview />
    </main>
  );
}

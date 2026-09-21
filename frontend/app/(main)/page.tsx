import React from 'react';
import { HeroSearch } from "@/components/organisms/HeroSearch";
import { FeaturedPropertiesSection } from "@/components/organisms/FeaturedPropertiesSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-light">
      {/* 1. HERO SEARCH */}
      <HeroSearch />

      {/* 2. PROPIEDADES CONECTADAS AL STORE DE PUBLICACIONES */}
      <FeaturedPropertiesSection />
    </main>
  );
}
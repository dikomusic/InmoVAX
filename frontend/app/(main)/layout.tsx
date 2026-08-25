import React from 'react';
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Este molde sí tiene el Navbar y Footer, y solo afectará a las páginas dentro de (main) */}
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
import React from 'react';

export const metadata = {
  title: 'InmoVax | Portal del Vendedor & Propietario',
  description: 'Panel exclusivo para propietarios y vendedores registrados en InmoVax Bolivia para gestionar publicaciones, citas y ofertas.',
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F7FC] text-content-main font-sans antialiased">
      {children}
    </div>
  );
}

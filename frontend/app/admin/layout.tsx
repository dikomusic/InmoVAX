import React from 'react';

export const metadata = {
  title: 'InmoVax | Centro de Control Administrativo',
  description: 'Panel de administración central de InmoVax para la supervisión de operaciones inmobiliarias y auditoría notarial en La Paz, Bolivia.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F0F4F8] text-content-main font-sans antialiased">
      {children}
    </div>
  );
}

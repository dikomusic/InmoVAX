import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LoginForm } from '@/components/organisms/LoginForm';
import { BrandLogo } from '@/components/atoms/BrandLogo';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex bg-surface-light">
      
      {/* Columna Izquierda: Imagen inspiracional (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-dark items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
          alt="Interior de lujo InmoVAX"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="inline-block mb-6">
            <BrandLogo hideTextOnMobile={false} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            La nueva era inmobiliaria en <span className="text-accent">Bolivia</span>
          </h1>
          <p className="text-base text-white/80 font-medium leading-relaxed">
            Accede a tu panel para gestionar tus publicaciones, ofertas, citas presenciales y respaldo legal garantizado.
          </p>
        </div>
      </div>

      {/* Columna Derecha: Formulario de Acceso y Registro */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 relative min-h-screen">
        
        {/* Cabecera / Volver */}
        <div className="w-full max-w-md flex items-center justify-between mb-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <BrandLogo hideTextOnMobile={false} />
          </Link>
          <Link
            href="/"
            className="text-xs sm:text-sm font-bold text-content-muted hover:text-primary transition-colors flex items-center gap-1"
          >
            ← Volver al inicio
          </Link>
        </div>

        {/* Organismo LoginForm */}
        <div className="w-full max-w-md">
          <LoginForm />
        </div>

      </div>
    </main>
  );
}

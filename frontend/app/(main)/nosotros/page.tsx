import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-surface-light pb-20">
      
      {/* Sección Hero */}
      <div className="bg-surface-dark text-content-inverse py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
            Revolucionando el mercado inmobiliario en <span className="text-accent">Bolivia</span>
          </h1>
          <p className="text-lg text-content-inverse/80 font-medium">
            En InmoPaz no solo conectamos propiedades con personas; garantizamos que cada transacción de anticrético, venta o alquiler sea 100% segura y transparente.
          </p>
        </div>
        {/* Decoración */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* Sección de Pilares */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-surface-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <span className="text-4xl block mb-4">⚖️</span>
            <h3 className="text-xl font-extrabold text-content-main mb-2">Respaldo Legal</h3>
            <p className="text-content-muted text-sm font-medium">Verificamos Folios Reales, gravámenes e impuestos antes de publicar cualquier inmueble.</p>
          </div>
          
          <div className="bg-surface-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <span className="text-4xl block mb-4">🚀</span>
            <h3 className="text-xl font-extrabold text-content-main mb-2">Tecnología 3D</h3>
            <p className="text-content-muted text-sm font-medium">Filtramos clientes curiosos mediante recorridos virtuales para que las visitas presenciales sean efectivas.</p>
          </div>
          
          <div className="bg-surface-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <span className="text-4xl block mb-4">🤝</span>
            <h3 className="text-xl font-extrabold text-content-main mb-2">Asesoría Integral</h3>
            <p className="text-content-muted text-sm font-medium">Te acompañamos desde la primera visita hasta la firma en notaría de tu contrato.</p>
          </div>

        </div>
      </div>

      {/* Historia / Equipo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/2 relative h-[400px] rounded-2xl overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop" alt="Equipo InmoPaz" fill className="object-cover" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-extrabold text-content-main mb-6">Nuestra Misión</h2>
          <p className="text-content-muted font-medium mb-6 leading-relaxed">
            Nacimos con una idea clara: modernizar el clásico sistema de anticréticos paceño. Entendemos que poner tu capital en una vivienda requiere confianza absoluta. Por eso, combinamos tecnología de punta (como mapas interactivos y fotos premium) con un riguroso equipo legal.
          </p>
          <Link href="/contacto">
            <Button variant="primary">Habla con un Asesor</Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
import React from 'react';
import { Button } from '@/components/atoms/Button';
import Image from 'next/image'; // 1. Importamos el componente de imagen optimizada

export default function ProyectosPage() {
  return (
    <div className="min-h-screen bg-surface-light py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Encabezado de Proyectos */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-content-main mb-4">
          Proyectos <span className="text-primary">Inmobiliarios</span>
        </h1>
        <p className="text-lg text-content-muted font-medium max-w-2xl mx-auto">
          Invierte en preventas y edificios a estrenar. La mejor rentabilidad con el respaldo de las constructoras más serias de La Paz.
        </p>
      </div>

      {/* Grilla de Proyectos (Tarjetas Horizontales Especiales) */}
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Proyecto 1 */}
        <div className="bg-surface-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          <div className="w-full md:w-2/5 h-64 md:h-auto bg-gray-200 relative">
            {/* 2. Reemplazamos <img> por <Image /> usando la propiedad "fill" */}
            <Image 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
              alt="Edificio en preventa" 
              fill
              className="object-cover" 
            />
            <div className="absolute top-4 left-4 bg-accent text-content-main text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
              En Preventa
            </div>
          </div>
          
          <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
            {/* 3. Escapamos las comillas usando &quot; */}
            <h2 className="text-2xl font-extrabold text-content-main mb-2">Torre Empresarial &quot;El Bosque&quot;</h2>
            <p className="text-content-muted mb-4 font-medium">Ubicado en Calacoto. Oficinas premium desde 40m² con áreas de coworking y auditorio privado.</p>
            <div className="flex gap-6 mb-6 border-y border-gray-100 py-4">
              <div>
                <span className="block text-xs text-content-muted font-bold">ENTREGA</span>
                <span className="font-extrabold text-content-main">Dic 2027</span>
              </div>
              <div>
                <span className="block text-xs text-content-muted font-bold">DESDE</span>
                <span className="font-extrabold text-primary">$us 55,000</span>
              </div>
            </div>
            <Button variant="outline" className="w-fit">Ver unidades disponibles →</Button>
          </div>
        </div>

      </div>
    </div>
  );
}
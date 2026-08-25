import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';

export default function AsesoresPage() {
  const asesores = [
    {
      nombre: "Carlos Mendoza",
      cargo: "Especialista en Anticréticos",
      telefono: "+591 70011223",
      foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop"
    },
    {
      nombre: "Ana Lucía Vargas",
      cargo: "Directora de Ventas Zona Sur",
      telefono: "+591 71122334",
      foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop"
    },
    {
      nombre: "Jorge Salinas",
      cargo: "Asesor Comercial Independiente",
      telefono: "+591 72233445",
      foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-surface-light py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Encabezado */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-content-main mb-4">
          Conoce a nuestros <span className="text-primary">Asesores</span>
        </h1>
        <p className="text-lg text-content-muted font-medium max-w-2xl mx-auto">
          Un equipo de profesionales capacitados para encontrar el inmueble perfecto para ti, con total transparencia y seguridad legal.
        </p>
      </div>

      {/* Grilla de Asesores */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {asesores.map((asesor, index) => (
          <div key={index} className="bg-surface-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            
            {/* Foto del Asesor */}
            <div className="w-full h-80 relative overflow-hidden bg-gray-200">
              <Image 
                src={asesor.foto} 
                alt={asesor.nombre} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            
            {/* Información y Botón */}
            <div className="p-6 text-center">
              <h3 className="text-xl font-extrabold text-content-main">{asesor.nombre}</h3>
              <p className="text-sm font-bold text-accent mb-6 uppercase tracking-wider">{asesor.cargo}</p>
              
              <Button variant="outline" fullWidth className="border-green-500 text-green-600 hover:bg-green-50">
                Contactar por WhatsApp
              </Button>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}
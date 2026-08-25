import React from 'react';
import Image from 'next/image'; // 1. Importamos el componente optimizado de Next.js
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

interface PropertyCardProps {
  titulo: string;
  precio: string;
  ubicacion: string;
  habitaciones: number;
  banos: number;
  metros: number;
  tipoContrato: 'Venta' | 'Alquiler' | 'Anticrético';
  esNuevo?: boolean;
  imagenUrl?: string;
}

export const PropertyCard = ({
  titulo,
  precio,
  ubicacion,
  habitaciones,
  banos,
  metros,
  tipoContrato,
  esNuevo = false,
  imagenUrl = '/placeholder-casa.jpg'
}: PropertyCardProps) => {
  return (
    <div className="bg-surface-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      
      {/* Sección de la Imagen */}
      <div className="relative h-56 bg-gray-200">
        
        {/* 2. Reemplazamos el viejo <img> por el <Image /> de Next.js */}
        <Image 
          src={imagenUrl} 
          alt={`Foto de ${titulo}`} 
          fill
          className="object-cover"
        />
        
        <div className="absolute top-4 left-4 flex gap-2">
          {esNuevo && <Badge text="NUEVO" variant="accent" />}
          <Badge text={tipoContrato} variant="primary" />
        </div>
      </div>

      {/* Sección de Contenido (Aquí cambiamos flex-grow por grow) */}
      <div className="p-5 flex flex-col grow">
        
        <h3 className="text-xl font-bold text-content-main mb-1 line-clamp-1">
          {titulo}
        </h3>
        <p className="text-content-muted text-sm mb-3">
          📍 {ubicacion}
        </p>
        <p className="text-2xl font-extrabold text-primary mb-4">
          {precio}
        </p>

        <div className="flex items-center justify-between border-t border-b border-gray-100 py-3 mb-5 text-content-muted text-sm">
          <div className="flex items-center gap-1">
            <span>🛏️</span> {habitaciones} <span className="hidden sm:inline">Hab</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🛁</span> {banos} <span className="hidden sm:inline">Baños</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📐</span> {metros} m²
          </div>
        </div>

        <div className="mt-auto">
          <Button variant="primary" fullWidth>
            Detalles
          </Button>
        </div>

      </div>
    </div>
  );
};
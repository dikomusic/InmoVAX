"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, PlusCircle, Sparkles } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { PropertyCarousel } from '../molecules/PropertyCarousel';
import { getAllManagedProperties, ManagedProperty, fetchAllPropertiesFromBackend } from '@/lib/propertiesStore';
import { Button } from '../atoms/Button';

export const FeaturedPropertiesSection = () => {
  const [properties, setProperties] = useState<ManagedProperty[]>([]);

  useEffect(() => {
    // 1. Mostrar copia local disponible de inmediato
    const active = getAllManagedProperties().filter((p) => p.status === 'Activo');
    setProperties(active);

    // 2. Traer datos en vivo desde Supabase
    fetchAllPropertiesFromBackend().then((all) => {
      if (all) {
        setProperties(all.filter((p) => p.status === 'Activo'));
      }
    });

    const handleUpdate = () => {
      const activeFresh = getAllManagedProperties().filter((p) => p.status === 'Activo');
      setProperties(activeFresh);
    };
    window.addEventListener('inmovax:properties-updated', handleUpdate);
    return () => window.removeEventListener('inmovax:properties-updated', handleUpdate);
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 w-full">
      <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-content-main text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Inmuebles Verificados en la Plataforma</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main border-l-4 border-accent pl-3 sm:pl-4">
            Propiedades Disponibles ({properties.length})
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm md:text-base text-content-muted">
            Publicaciones activas auditadas con Folio Real en anticrético, venta y alquiler.
          </p>
        </div>

        {properties.length > 0 && (
          <Link href="/comprar/todos" className="text-xs sm:text-sm font-extrabold text-primary hover:underline self-start sm:self-auto inline-flex items-center gap-1">
            <span>Ver todas las publicaciones</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>

      {properties.length > 0 ? (
        properties.length > 3 ? (
          <PropertyCarousel properties={properties} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                id={prop.id}
                titulo={prop.title}
                precio={prop.price}
                ubicacion={prop.zone}
                habitaciones={prop.habitaciones ?? 3}
                banos={prop.banos ?? 2}
                metros={prop.metros ?? 120}
                tipoContrato={prop.type}
                esNuevo={prop.esNuevo ?? true}
                href={`/propiedad/${prop.id}`}
                imagenUrl={prop.image}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm max-w-xl mx-auto">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/10 text-primary mx-auto mb-4">
            <Building2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-extrabold text-content-main">No hay inmuebles publicados actualmente</h3>
          <p className="text-xs text-content-muted mt-1 mb-6 leading-relaxed">
            Las publicaciones eliminadas por los vendedores se retiran en tiempo real de la plataforma.
          </p>
          <Link href="/publicar">
            <Button variant="accent" className="mx-auto">
              <PlusCircle className="h-4 w-4" />
              <span>Publicar Nueva Propiedad</span>
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};

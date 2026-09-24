"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { PublishPropertyForm } from '@/components/organisms/PublishPropertyForm';
import { readStoredSession, saveStoredSession } from '@/lib/frontendStore';
import { addManagedProperty, ManagedProperty } from '@/lib/propertiesStore';

export default function PublicarPage() {
  const router = useRouter();

  const handlePublished = async (data: Parameters<NonNullable<React.ComponentProps<typeof PublishPropertyForm>['onSuccessCallback']>>[0]) => {
    let session = readStoredSession();
    if (!session || !session.email) {
      session = {
        name: 'Propietario InmoVAX',
        email: 'propietario@inmovax.com',
        hasPublishedProperties: true,
        role: 'vendedor'
      };
      saveStoredSession(session);
    } else {
      saveStoredSession({ ...session, hasPublishedProperties: true, role: 'vendedor' });
    }

    const newProp = await addManagedProperty({
      title: `${data.tipoInmueble.toUpperCase()} en ${data.zona}`,
      zone: data.zona,
      address: data.calle || data.zona,
      description: data.descripcion || `${data.tipoInmueble.toUpperCase()} en ${data.zona}`,
      type: (data.operacion === 'anticretico' ? 'Anticrético' : data.operacion.charAt(0).toUpperCase() + data.operacion.slice(1)) as ManagedProperty['type'],
      price: `${data.moneda === 'usd' ? '$us' : 'Bs.'} ${data.precio}`,
      status: 'Activo',
      folioReal: data.folioReal,
      assignedAdvisor: 'Lic. Carlos Vega',
      image: data.imagenUrl || '',
      gallery: data.galeria || [],
      authorEmail: session.email,
      authorName: session.name,
      habitaciones: Number(data.habitaciones) || 3,
      banos: Number(data.banos) || 2,
      metros: Number(data.supConstruida) || 120,
      landAreaSqm: data.supTerreno ? Number(data.supTerreno) : null,
      estacionamientos: Number(data.parqueos) || 0,
      parkingSpots: Number(data.parqueos) || 0,
      amenidades: data.amenidades || [],
      amenities: data.amenidades || [],
      category: data.tipoInmueble ? (data.tipoInmueble.charAt(0).toUpperCase() + data.tipoInmueble.slice(1)) : 'Departamento',
      isNegotiable: data.negociable ?? false,
      latitude: data.coordenadas?.lat ?? null,
      longitude: data.coordenadas?.lng ?? null
    });

    router.push(`/propiedad/${newProp.id}`);
  };

  return (
    <div className="min-h-screen bg-surface-light py-12 px-4 sm:px-6">
      
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-content-main mb-4">
          Publica tu inmueble en <span className="text-accent">minutos</span>
        </h1>
        <p className="text-lg text-content-muted font-medium">
          Llega a miles de clientes verificados en La Paz. Nosotros nos encargamos del marketing y el respaldo legal.
        </p>
      </div>

      {/* Aquí renderizamos nuestro asistente paso a paso */}
      <PublishPropertyForm onSuccessCallback={handlePublished} />
      
    </div>
  );
}
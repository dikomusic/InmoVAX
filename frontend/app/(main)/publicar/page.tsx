import React from 'react';
import { PublishPropertyForm } from '@/components/organisms/PublishPropertyForm';

export default function PublicarPage() {
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
      <PublishPropertyForm />
      
    </div>
  );
}
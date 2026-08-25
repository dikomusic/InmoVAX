import React from 'react';
import { PropertyCard } from '@/components/organisms/PropertyCard';
import { FilterSidebar } from '@/components/organisms/FilterSidebar';
import { Select } from '@/components/atoms/Select';

export default async function AnticreticoDinamicPage({ params }: { params: Promise<{ tipo: string }> }) {
  const resolvedParams = await params;
  const tipoSeleccionado = resolvedParams.tipo || 'todos';

  const tituloFormateado = tipoSeleccionado === 'todos' 
    ? 'Propiedades' 
    : tipoSeleccionado.charAt(0).toUpperCase() + tipoSeleccionado.slice(1);

  return (
    <div className="min-h-screen bg-surface-light py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Encabezado con destaque visual para Anticréticos */}
      <div className="max-w-7xl mx-auto mb-8 bg-surface-dark rounded-2xl p-8 text-center sm:text-left relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-content-inverse">
            {tituloFormateado} en <span className="text-accent">Anticrético</span>
          </h1>
          <p className="text-content-inverse/80 mt-2 font-medium max-w-2xl">
            Invierte tu dinero de forma segura. Todos nuestros anticréticos cuentan con revisión de Folio Real y respaldo legal garantizado por InmoPaz.
          </p>
        </div>
        {/* Decoración de fondo */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4 shrink-0">
          <FilterSidebar />
        </div>

        <div className="w-full lg:w-3/4 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-surface-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-bold text-content-main mb-4 sm:mb-0">
              Mostrando resultados para {tituloFormateado}
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm font-bold text-content-muted whitespace-nowrap">Ordenar por:</span>
              <Select 
                options={[
                  { value: 'recientes', label: 'Más recientes' },
                  { value: 'menor-precio', label: 'Menor precio' },
                  { value: 'mayor-precio', label: 'Mayor precio' }
                ]}
                className="w-48 bg-surface-light py-2 text-sm"
              />
            </div>
          </div>

          {/* Grilla de propiedades (Ejemplo Anticrético) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PropertyCard 
              titulo="Hermoso Departamento"
              precio="$us 35,000"
              ubicacion="Miraflores, La Paz"
              habitaciones={2} banos={2} metros={85}
              tipoContrato="Anticrético" esNuevo={true}
              imagenUrl="https://images.unsplash.com/photo-1502672260266-1c1e5250adfd?q=80&w=1973&auto=format&fit=crop"
            />
            <PropertyCard 
              titulo="Casa Independiente"
              precio="$us 60,000"
              ubicacion="Irpavi, Zona Sur"
              habitaciones={4} banos={3} metros={250}
              tipoContrato="Anticrético"
              imagenUrl="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
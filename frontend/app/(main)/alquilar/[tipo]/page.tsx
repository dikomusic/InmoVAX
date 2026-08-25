import React from 'react';
import { PropertyCard } from '@/components/organisms/PropertyCard';
import { FilterSidebar } from '@/components/organisms/FilterSidebar';
import { Select } from '@/components/atoms/Select';

export default async function AlquilarDinamicPage({ params }: { params: Promise<{ tipo: string }> }) {
  const resolvedParams = await params;
  const tipoSeleccionado = resolvedParams.tipo || 'todos';

  const tituloFormateado = tipoSeleccionado === 'todos' 
    ? 'Propiedades' 
    : tipoSeleccionado.charAt(0).toUpperCase() + tipoSeleccionado.slice(1);

  return (
    <div className="min-h-screen bg-surface-light py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Encabezado adaptado para Alquiler */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-content-main">
          {tituloFormateado} en <span className="text-primary">Alquiler</span>
        </h1>
        <p className="text-content-muted mt-2 font-medium">
          Descubre las mejores opciones de {tipoSeleccionado === 'todos' ? 'inmuebles' : tipoSeleccionado} para alquilar en la ciudad.
        </p>
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

          {/* Grilla de propiedades (Ejemplo de Alquiler) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PropertyCard 
              titulo="Garzonier Amoblado"
              precio="Bs. 2,500 / mes"
              ubicacion="Sopocachi, La Paz"
              habitaciones={1} banos={1} metros={45}
              tipoContrato="Alquiler" esNuevo={true}
              imagenUrl="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
            />
            <PropertyCard 
              titulo="Casa Familiar"
              precio="$us 800 / mes"
              ubicacion="Calacoto, Zona Sur"
              habitaciones={3} banos={3} metros={200}
              tipoContrato="Alquiler"
              imagenUrl="https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=2073&auto=format&fit=crop"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
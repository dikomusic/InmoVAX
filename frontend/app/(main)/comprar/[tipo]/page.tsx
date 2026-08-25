import React from 'react';
import { PropertyCard } from '@/components/organisms/PropertyCard';
import { FilterSidebar } from '@/components/organisms/FilterSidebar';
import { Select } from '@/components/atoms/Select';
import { ResultsMap } from '@/components/molecules/ResultsMap';

export default async function ComprarDinamicPage({ params }: { params: Promise<{ tipo: string }> }) {
  const resolvedParams = await params;
  const tipoSeleccionado = resolvedParams.tipo || 'todos';

  const tituloFormateado = tipoSeleccionado === 'todos' 
    ? 'Propiedades' 
    : tipoSeleccionado.charAt(0).toUpperCase() + tipoSeleccionado.slice(1);

  return (
    /* h-[calc(100vh-80px)] asegura que ocupe el 100% de la pantalla menos el Navbar (que mide 80px) */
    <div className="h-[calc(100vh-80px)] flex w-full bg-surface-light overflow-hidden">
      
      {/* ================= COLUMNA IZQUIERDA (Filtros + Lista) ================= */}
      <div className="w-full lg:w-[60%] flex h-full">
        
        {/* 1. Barra de Filtros Lateral (Scrollable independiente) */}
        <div className="hidden md:block w-64 lg:w-72 border-r border-gray-200 bg-surface-white h-full overflow-y-auto shrink-0 p-4">
          <FilterSidebar />
        </div>

        {/* 2. Lista de Propiedades (Scrollable independiente) */}
        <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 bg-gray-50 flex flex-col">
          
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-extrabold text-content-main">
              {tituloFormateado} en Venta en La Paz
            </h1>
            <Select 
              options={[
                { value: 'recientes', label: 'Más recientes' },
                { value: 'menor-precio', label: 'Menor precio' }
              ]}
              // Cambiamos w-40 por w-[135px] para hacerlo mucho más compacto
              className="w-[135px] bg-surface-light py-1.5 text-sm"
            />
          </div>

          <p className="text-sm font-bold text-content-muted mb-4">Mostrando 86 resultados</p>

          {/* Grilla de Tarjetas (Podemos ponerlas en 1 sola columna para que parezcan horizontales como en tu foto) */}
          <div className="grid grid-cols-1 gap-6 pb-20">
            <PropertyCard 
              titulo="Casa en Venta en Achumani"
              precio="558,000 USD"
              ubicacion="Av. Strongest, Calle 30, La Paz"
              habitaciones={3} banos={3} metros={464}
              tipoContrato="Venta" esNuevo={true}
              imagenUrl="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
            />
            <PropertyCard 
              titulo="Casa con Potencial Comercial"
              precio="178,000 USD"
              ubicacion="Villa El Carmen, La Paz"
              habitaciones={0} banos={4} metros={200}
              tipoContrato="Venta"
              imagenUrl="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
            />
             <PropertyCard 
              titulo="Casa en Venta Calacoto"
              precio="648,000 USD"
              ubicacion="Fuerza Naval, Psje 24B, La Paz"
              habitaciones={4} banos={4} metros={500}
              tipoContrato="Venta"
              imagenUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            />
          </div>
        </div>

      </div>

      {/* ================= COLUMNA DERECHA (Mapa Fijo) ================= */}
      {/* En celular se oculta el mapa, en PC ocupa el 40% derecho fijo */}
      <div className="hidden lg:block lg:w-[40%] h-full relative border-l border-gray-300">
        <ResultsMap />
      </div>

    </div>
  );
}
import React from 'react';

export interface SellerProperty {
  id: string;
  title: string;
  zone: string;
  type: 'Anticrético' | 'Venta' | 'Alquiler';
  price: string;
  views: number;
  inquiries: number;
  status: 'Activo' | 'En Validación Legal' | 'Pausado' | 'Cerrado';
  folioReal: string;
  assignedAdvisor: string;
  image: string;
  datePublished: string;
}

interface SellerPropertyCardProps {
  property: SellerProperty;
  onTogglePause: (id: string) => void;
  onEdit: (property: SellerProperty) => void;
  onViewStats: (property: SellerProperty) => void;
}

export const SellerPropertyCard = ({
  property,
  onTogglePause,
  onEdit,
  onViewStats
}: SellerPropertyCardProps) => {
  const statusStyles = {
    Activo: 'bg-emerald-100 text-emerald-800',
    'En Validación Legal': 'bg-amber-100 text-amber-800',
    Pausado: 'bg-gray-100 text-gray-700',
    Cerrado: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group">
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black shadow-xs ${
              property.type === 'Anticrético' ? 'bg-accent text-surface-dark' :
              property.type === 'Venta' ? 'bg-primary text-white' :
              'bg-purple-600 text-white'
            }`}>
              {property.type}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shadow-xs ${statusStyles[property.status]}`}>
              ● {property.status}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">ID: {property.id} • {property.datePublished}</span>
            <h4 className="font-extrabold text-sm text-surface-dark truncate mt-0.5">{property.title}</h4>
            <p className="text-xs text-content-muted">{property.zone}</p>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-black text-surface-dark">{property.price}</span>
            <span className="text-xs text-primary font-bold">Folio: {property.folioReal}</span>
          </div>

          {/* MÉTRICAS DE VISUALIZACIONES */}
          <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-center text-xs">
            <div>
              <span className="text-gray-400 text-[10px] block uppercase font-bold">Visualizaciones</span>
              <span className="font-black text-surface-dark text-sm">👁️ {property.views}</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] block uppercase font-bold">Consultas</span>
              <span className="font-black text-primary text-sm">💬 {property.inquiries}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 font-medium">
            Asesor oficial asignado: <strong className="text-gray-900">{property.assignedAdvisor}</strong>
          </p>
        </div>
      </div>

      <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewStats(property)}
          className="flex-1 py-2 bg-white hover:bg-gray-100 text-surface-dark font-extrabold text-xs rounded-xl border border-gray-200 transition-colors cursor-pointer text-center"
        >
          Ver Rendimiento
        </button>

        <button
          type="button"
          onClick={() => onEdit(property)}
          className="p-2 bg-blue-50 hover:bg-blue-100 text-primary rounded-xl transition-colors cursor-pointer"
          title="Editar Inmueble"
        >
          ✏️
        </button>

        <button
          type="button"
          onClick={() => onTogglePause(property.id)}
          className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            property.status === 'Activo'
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
          }`}
        >
          {property.status === 'Activo' ? 'Pausar' : 'Activar'}
        </button>
      </div>
    </div>
  );
};

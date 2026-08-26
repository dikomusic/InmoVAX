import React from 'react';

export interface Advisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  zone: string;
  activeProperties: number;
  rating: number;
  avatar: string;
  dealsClosed: number;
}

interface AdvisorCardProps {
  advisor: Advisor;
  onViewSchedule: (advisor: Advisor) => void;
  onEditAdvisor?: (advisor: Advisor) => void;
}

export const AdvisorCard = ({
  advisor,
  onViewSchedule,
  onEditAdvisor
}: AdvisorCardProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
      <div className="relative mb-4">
        <img
          src={advisor.avatar}
          alt={advisor.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-50 shadow-md"
        />
        <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
      </div>

      <h4 className="font-extrabold text-base text-surface-dark">{advisor.name}</h4>
      <p className="text-xs text-primary font-bold mt-0.5">{advisor.zone}</p>
      
      <div className="flex items-center gap-1 my-3 bg-amber-50 px-3 py-1 rounded-full text-amber-800 text-xs font-black">
        <span>⭐</span> {advisor.rating.toFixed(1)} / 5.0 (Excelente)
      </div>

      <div className="w-full border-t border-gray-100 pt-4 mt-2 grid grid-cols-2 gap-2 text-left text-xs text-gray-600">
        <div>
          <span className="text-[10px] text-gray-400 font-bold block uppercase">Propiedades</span>
          <span className="font-black text-surface-dark text-sm">{advisor.activeProperties} activas</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-bold block uppercase">Contratos</span>
          <span className="font-black text-emerald-600 text-sm">{advisor.dealsClosed} cerrados</span>
        </div>
      </div>

      <div className="w-full mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onViewSchedule(advisor)}
          className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-primary font-extrabold text-xs rounded-xl transition-colors cursor-pointer text-center active:scale-95"
        >
          Ver Agenda Citas
        </button>
        {onEditAdvisor && (
          <button
            type="button"
            onClick={() => onEditAdvisor(advisor)}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors cursor-pointer"
            title="Editar Asesor"
          >
            ✏️
          </button>
        )}
      </div>
    </div>
  );
};

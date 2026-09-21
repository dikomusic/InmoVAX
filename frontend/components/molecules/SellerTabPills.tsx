"use client";
import React from 'react';
import { CalendarDays, ClipboardList, FileText, Home, MessageCircle } from 'lucide-react';
import { SellerTab } from '../organisms/SellerSidebar';

interface SellerTabPillsProps {
  activeTab: SellerTab;
  onSelectTab: (tab: SellerTab) => void;
  myPropertiesCount: number;
  appointmentsCount: number;
}

export const SellerTabPills = ({
  activeTab,
  onSelectTab,
  myPropertiesCount,
  appointmentsCount
}: SellerTabPillsProps) => {
  const tabs: {
    id: SellerTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    badgeColor?: string;
  }[] = [
    { id: 'resumen', label: 'Resumen', icon: ClipboardList },
    { id: 'inmuebles', label: 'Mis Inmuebles', icon: Home, count: myPropertiesCount },
    { id: 'consultas', label: 'Consultas & Ofertas', icon: MessageCircle },
    { id: 'citas', label: 'Agenda de Visitas', icon: CalendarDays, count: appointmentsCount, badgeColor: 'bg-blue-500' },
    { id: 'documentos', label: 'Folio Real & Legal', icon: FileText }
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]'
                  : 'bg-white border border-gray-200/80 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.badgeColor || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

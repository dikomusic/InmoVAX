import React from 'react';

export type SellerPropertyStatus = 'Activo' | 'En Validación Legal' | 'Pausado' | 'Cerrado';

interface SellerStatusBadgeProps {
  status: SellerPropertyStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const SellerStatusBadge = ({
  status,
  className = '',
  size = 'sm'
}: SellerStatusBadgeProps) => {
  const configs: Record<
    SellerPropertyStatus,
    { label: string; bg: string; text: string; dot: string; pulse: boolean }
  > = {
    Activo: {
      label: 'Activo en Catálogo',
      bg: 'bg-emerald-50 border border-emerald-200/80',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
      pulse: true
    },
    'En Validación Legal': {
      label: 'Validación Legal DDRR',
      bg: 'bg-amber-50 border border-amber-200/80',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      pulse: true
    },
    Pausado: {
      label: 'Pausado Temporal',
      bg: 'bg-gray-100 border border-gray-200',
      text: 'text-gray-700',
      dot: 'bg-gray-400',
      pulse: false
    },
    Cerrado: {
      label: 'Cerrado / Concluido',
      bg: 'bg-purple-50 border border-purple-200/80',
      text: 'text-purple-800',
      dot: 'bg-purple-500',
      pulse: false
    }
  };

  const current = configs[status] || configs.Activo;
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-extrabold tracking-wide ${sizeClasses} ${current.bg} ${current.text} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${current.dot} ${
          current.pulse ? 'animate-pulse' : ''
        }`}
      />
      <span>{current.label}</span>
    </span>
  );
};

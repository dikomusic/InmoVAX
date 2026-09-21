import React from 'react';

export type ActivityStatusType = 'respondido' | 'pendiente' | 'visita_agendada';

interface ActivityStatusBadgeProps {
  status: ActivityStatusType;
  className?: string;
}

export const ActivityStatusBadge = ({ status, className = '' }: ActivityStatusBadgeProps) => {
  const configs: Record<ActivityStatusType, { label: string; bg: string; text: string; dot: string }> = {
    respondido: {
      label: 'Respuesta recibida',
      bg: 'bg-emerald-50 border border-emerald-200/70',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500'
    },
    pendiente: {
      label: 'En espera de asesor',
      bg: 'bg-amber-50 border border-amber-200/70',
      text: 'text-amber-700',
      dot: 'bg-amber-500'
    },
    visita_agendada: {
      label: 'Visita agendada',
      bg: 'bg-blue-50 border border-blue-200/70',
      text: 'text-blue-700',
      dot: 'bg-blue-500'
    }
  };

  const current = configs[status] || configs.pendiente;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${current.bg} ${current.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot} animate-pulse`} />
      {current.label}
    </span>
  );
};

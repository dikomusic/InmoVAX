import React from 'react';
import { Bath, BedDouble, Ruler } from 'lucide-react';

interface PropertyStatsProps {
  bedrooms: number;
  bathrooms: number;
  area: number;
}

export const PropertyStats = ({ bedrooms, bathrooms, area }: PropertyStatsProps) => {
  const stats = [
    { label: 'Habitaciones', value: bedrooms, Icon: BedDouble },
    { label: 'Baños', value: bathrooms, Icon: Bath },
    { label: 'Superficie', value: `${area} m²`, Icon: Ruler },
  ];

  return (
    <dl className="grid grid-cols-3 gap-3 border-y border-gray-100 py-4 mb-5 text-content-muted">
      {stats.map(({ label, value, Icon }) => (
        <div key={label} className="flex min-w-0 items-center gap-2">
          <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
          <div className="min-w-0">
            <dt className="sr-only">{label}</dt>
            <dd className="truncate text-sm font-bold text-content-main">{value}</dd>
            <span className="block truncate text-[11px] font-medium">{label}</span>
          </div>
        </div>
      ))}
    </dl>
  );
};
import React from 'react';
import { PropertyResultsTemplate } from '@/components/templates/PropertyResultsTemplate';

export default async function ComprarDinamicPage({ params }: { params: Promise<{ tipo: string }> }) {
  const resolvedParams = await params;
  const tipoSeleccionado = resolvedParams.tipo || 'todos';

  return <PropertyResultsTemplate operation="Venta" type={tipoSeleccionado} showMap />;
}
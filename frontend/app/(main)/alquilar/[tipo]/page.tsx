import React from 'react';
import { PropertyResultsTemplate } from '@/components/templates/PropertyResultsTemplate';

export default async function AlquilarDinamicPage({ params }: { params: Promise<{ tipo: string }> }) {
  const resolvedParams = await params;
  const tipoSeleccionado = resolvedParams.tipo || 'todos';

  return <PropertyResultsTemplate operation="Alquiler" type={tipoSeleccionado} showMap />;
}
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';

export default function OficinasPage() {
  const sucursales = [
    {
      nombre: "Sucursal Zona Sur (Central)",
      direccion: "Av. Ballivián, Edificio Torre Sur, Piso 5, Calacoto.",
      horario: "Lun a Vie: 09:00 - 18:30 | Sáb: 09:00 - 13:00",
      telefono: "+591 70000001",
      imagen: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"
    },
    {
      nombre: "Sucursal Centro",
      direccion: "Av. Arce, Edificio Multicentro, Planta Baja.",
      horario: "Lun a Vie: 09:00 - 18:00 | Sáb: Cerrado",
      telefono: "+591 70000002",
      imagen: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-surface-light py-16 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-content-main mb-4">
          Nuestras <span className="text-primary">Oficinas</span>
        </h1>
        <p className="text-lg text-content-muted font-medium max-w-2xl mx-auto">
          Visítanos. Nuestro equipo legal y comercial está listo para asesorarte en persona.
        </p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {sucursales.map((oficina, index) => (
          <div key={index} className="bg-surface-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-gray-200">
              <Image src={oficina.imagen} alt={oficina.nombre} fill className="object-cover" />
            </div>
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
              <h2 className="text-2xl font-extrabold text-content-main mb-4">{oficina.nombre}</h2>
              <div className="space-y-3 mb-6">
                <p className="flex items-center gap-3 text-content-muted font-medium">
                  <span className="text-xl">📍</span> {oficina.direccion}
                </p>
                <p className="flex items-center gap-3 text-content-muted font-medium">
                  <span className="text-xl">🕒</span> {oficina.horario}
                </p>
                <p className="flex items-center gap-3 text-content-muted font-medium">
                  <span className="text-xl">📞</span> {oficina.telefono}
                </p>
              </div>
              <Button variant="outline" className="w-fit">Ver en Google Maps</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
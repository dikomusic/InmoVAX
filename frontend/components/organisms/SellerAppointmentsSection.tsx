"use client";
import React from 'react';

export interface SellerAppointment {
  id: string;
  propertyTitle: string;
  clientName: string;
  clientPhone: string;
  advisorName: string;
  date: string;
  time: string;
  status: 'Confirmada' | 'Realizada' | 'Reprogramada';
}

interface SellerAppointmentsSectionProps {
  appointments: SellerAppointment[];
}

export const SellerAppointmentsSection = ({
  appointments
}: SellerAppointmentsSectionProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* CABECERA */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-xl text-surface-dark">Agenda de Visitas a tus Inmuebles</h3>
          <p className="text-xs text-content-muted mt-0.5">Todas las visitas son acompañadas presencialmente por asesores oficiales de InmoVax para máxima seguridad</p>
        </div>
        <span className="text-xs font-black bg-blue-50 text-primary px-3.5 py-1.5 rounded-xl border border-blue-200">
          {appointments.length} Visitas Programadas
        </span>
      </div>

      {/* LISTA DE CITAS */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-5">Inmueble</th>
                <th className="py-4 px-5">Cliente Interesado</th>
                <th className="py-4 px-5">Fecha y Horario</th>
                <th className="py-4 px-5">Asesor Acompañante</th>
                <th className="py-4 px-5 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-extrabold text-surface-dark block">{apt.propertyTitle}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-bold text-gray-900 block">{apt.clientName}</span>
                    <span className="text-[11px] font-mono text-gray-500">{apt.clientPhone}</span>
                  </td>
                  <td className="py-4 px-5 font-bold text-gray-800">
                    📅 {apt.date} a las {apt.time}
                  </td>
                  <td className="py-4 px-5 text-primary font-bold">
                    👤 {apt.advisorName}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      apt.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-800' :
                      apt.status === 'Realizada' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      ● {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

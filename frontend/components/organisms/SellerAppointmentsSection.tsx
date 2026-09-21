"use client";
import React from 'react';
import { CalendarDays, UserRound, Clock, CalendarCheck } from 'lucide-react';
import { SellerAppointmentCard } from '../molecules/SellerAppointmentCard';

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
      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-xl sm:text-2xl text-surface-dark tracking-tight">
            Agenda de Visitas a tus Inmuebles
          </h2>
          <p className="text-xs text-content-muted mt-0.5">
            Todas las visitas son presenciales y acompañadas por asesores certificados de InmoVAX para tu seguridad.
          </p>
        </div>
        <span className="text-xs font-black bg-blue-50 text-primary px-3.5 py-1.5 rounded-xl border border-blue-200 whitespace-nowrap">
          {appointments.length} Visitas Programadas
        </span>
      </div>

      {/* VISTA MÓVIL Y TABLET (< lg): TARJETAS ATÓMICAS */}
      <div className="lg:hidden space-y-3">
        {appointments.map((apt) => (
          <SellerAppointmentCard key={apt.id} appointment={apt} />
        ))}
      </div>

      {/* VISTA DESKTOP (>= lg): TABLA ELEGANTE */}
      <div className="hidden lg:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Inmueble</th>
                <th className="py-4 px-6">Cliente Interesado</th>
                <th className="py-4 px-6">Fecha y Horario</th>
                <th className="py-4 px-6">Asesor Acompañante</th>
                <th className="py-4 px-6 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-black text-surface-dark block">{apt.propertyTitle}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-900 block">{apt.clientName}</span>
                    <span className="text-[11px] font-mono text-gray-500">{apt.clientPhone}</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-800">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      <span>{apt.date} a las {apt.time}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-primary font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound className="h-3.5 w-3.5" />
                      <span>{apt.advisorName}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      apt.status === 'Confirmada' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      apt.status === 'Realizada' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        apt.status === 'Confirmada' ? 'bg-emerald-500' :
                        apt.status === 'Realizada' ? 'bg-blue-500' :
                        'bg-amber-500'
                      }`} />
                      <span>{apt.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ESTADO VACÍO */}
      {appointments.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm text-content-muted space-y-2">
          <CalendarCheck className="h-10 w-10 text-gray-400 mx-auto" />
          <h4 className="font-extrabold text-surface-dark text-sm">No tienes visitas agendadas</h4>
          <p className="text-xs text-content-muted">Cuando un cliente solicite una visita presencial con un asesor, aparecerá aquí.</p>
        </div>
      )}

    </div>
  );
};

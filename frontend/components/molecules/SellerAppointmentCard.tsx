"use client";
import React from 'react';
import { CalendarDays, Clock, Phone, UserCheck, MapPin } from 'lucide-react';
import { SellerAppointment } from '../organisms/SellerAppointmentsSection';

interface SellerAppointmentCardProps {
  appointment: SellerAppointment;
}

export const SellerAppointmentCard = ({ appointment }: SellerAppointmentCardProps) => {
  const statusStyles: Record<SellerAppointment['status'], { bg: string; text: string; dot: string }> = {
    Confirmada: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500'
    },
    Realizada: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200/80',
      text: 'text-blue-800',
      dot: 'bg-blue-500'
    },
    Reprogramada: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      text: 'text-amber-800',
      dot: 'bg-amber-500'
    }
  };

  const currentStatus = statusStyles[appointment.status] || statusStyles.Confirmada;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:shadow-md transition-shadow space-y-3">
      {/* CABECERA CON INMUEBLE Y ESTADO */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>Inmueble a Visitar</span>
          </div>
          <h4 className="font-extrabold text-sm text-surface-dark truncate mt-0.5">
            {appointment.propertyTitle}
          </h4>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${currentStatus.bg} shrink-0`}>
          <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`} />
          <span>{appointment.status}</span>
        </span>
      </div>

      {/* FECHA Y HORA */}
      <div className="bg-blue-50/60 border border-blue-100/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-blue-950">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>{appointment.date}</span>
        </div>
        <div className="flex items-center gap-1 font-extrabold text-blue-900">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>{appointment.time} hrs</span>
        </div>
      </div>

      {/* DETALLES CLIENTE Y ASESOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Cliente Interesado
          </span>
          <div className="font-extrabold text-gray-900">{appointment.clientName}</div>
          <a
            href={`tel:${appointment.clientPhone}`}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline"
          >
            <Phone className="h-3 w-3" />
            <span>{appointment.clientPhone}</span>
          </a>
        </div>

        <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Asesor InmoVAX
          </span>
          <div className="flex items-center gap-1 font-bold text-gray-900">
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>{appointment.advisorName}</span>
          </div>
          <span className="text-[10px] text-gray-500 block">Acompañamiento certificado</span>
        </div>
      </div>
    </div>
  );
};

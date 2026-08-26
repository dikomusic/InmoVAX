"use client";
import React, { useState } from 'react';
import { AdvisorCard, Advisor } from '../molecules/AdvisorCard';
import { Modal } from '../atoms/Modal';

export interface AppointmentItem {
  id: string;
  clientName: string;
  clientPhone: string;
  propertyTitle: string;
  date: string;
  time: string;
  advisorName: string;
  status: 'Confirmada' | 'Pendiente' | 'Completada' | 'Cancelada';
  notes?: string;
}

interface AdminAdvisorsSectionProps {
  advisors: Advisor[];
  appointments: AppointmentItem[];
  onAddAdvisor: (advisor: Advisor) => void;
  onUpdateAppointmentStatus: (id: string, newStatus: AppointmentItem['status']) => void;
  onAddAppointment: (appointment: AppointmentItem) => void;
}

export const AdminAdvisorsSection = ({
  advisors,
  appointments,
  onAddAdvisor,
  onUpdateAppointmentStatus,
  onAddAppointment
}: AdminAdvisorsSectionProps) => {
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Formulario Asesor
  const [advisorForm, setAdvisorForm] = useState({
    name: '',
    email: '',
    phone: '+591 7',
    zone: 'Zona Sur, La Paz',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  });

  // Formulario Cita
  const [aptForm, setAptForm] = useState({
    clientName: '',
    clientPhone: '+591 7',
    propertyTitle: 'Departamento en Sopocachi',
    date: 'Mañana',
    time: '11:00',
    advisorName: 'Carlos Vega',
    notes: 'Cliente interesado en anticrético con firma inmediata.'
  });

  const handleSaveAdvisor = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdvisor: Advisor = {
      id: `ADV-${advisors.length + 1}`,
      name: advisorForm.name,
      email: advisorForm.email,
      phone: advisorForm.phone,
      zone: advisorForm.zone,
      activeProperties: 1,
      rating: 5.0,
      avatar: advisorForm.avatar,
      dealsClosed: 0
    };
    onAddAdvisor(newAdvisor);
    setIsAdvisorModalOpen(false);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: AppointmentItem = {
      id: `APT-${appointments.length + 1}`,
      clientName: aptForm.clientName,
      clientPhone: aptForm.clientPhone,
      propertyTitle: aptForm.propertyTitle,
      date: aptForm.date,
      time: aptForm.time,
      advisorName: aptForm.advisorName,
      status: 'Confirmada',
      notes: aptForm.notes
    };
    onAddAppointment(newApt);
    setIsAppointmentModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* SECCIÓN DIRECTORES Y ASESORES */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-extrabold text-lg text-surface-dark">Equipo de Asesores Inmobiliarios</h3>
            <p className="text-xs text-content-muted">Agentes certificados por InmoVax para visitas guiadas y suscripción de minutas</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdvisorModalOpen(true)}
            className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>+</span> Registrar Nuevo Asesor
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advisors.map((adv) => (
            <AdvisorCard
              key={adv.id}
              advisor={adv}
              onViewSchedule={(advisor) => setSelectedAdvisor(advisor)}
            />
          ))}
        </div>
      </div>

      {/* AGENDA DE CITAS Y VISITAS */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-surface-dark">Agenda de Citas & Visitas Presenciales</h3>
            <p className="text-xs text-content-muted">Coordinación de clientes con asesores para inspección de propiedades</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAppointmentModalOpen(true)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-primary text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>📅</span> Agendar Nueva Visita
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Teléfono Contacto</th>
                <th className="py-3 px-4">Inmueble de Interés</th>
                <th className="py-3 px-4">Fecha y Horario</th>
                <th className="py-3 px-4">Asesor Asignado</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-surface-dark">{apt.clientName}</td>
                  <td className="py-4 px-4 font-mono text-gray-700">{apt.clientPhone}</td>
                  <td className="py-4 px-4 text-primary font-bold">{apt.propertyTitle}</td>
                  <td className="py-4 px-4 font-bold text-gray-800">{apt.date} • {apt.time}</td>
                  <td className="py-4 px-4 text-gray-700">{apt.advisorName}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      apt.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-800' :
                      apt.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
                      apt.status === 'Completada' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      ● {apt.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {apt.status === 'Pendiente' && (
                      <button
                        type="button"
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'Confirmada')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        Confirmar
                      </button>
                    )}
                    {apt.status === 'Confirmada' && (
                      <button
                        type="button"
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'Completada')}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-primary rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        Completar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL HORARIO ASESOR */}
      <Modal
        isOpen={!!selectedAdvisor}
        onClose={() => setSelectedAdvisor(null)}
        title={`Agenda de Citas: ${selectedAdvisor?.name}`}
        subtitle={`Zona: ${selectedAdvisor?.zone} • Calificación: ${selectedAdvisor?.rating} ⭐`}
      >
        {selectedAdvisor && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4">
              <img src={selectedAdvisor.avatar} alt={selectedAdvisor.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h4 className="font-extrabold text-sm text-surface-dark">{selectedAdvisor.name}</h4>
                <p className="text-xs text-content-muted">{selectedAdvisor.email}</p>
                <p className="text-xs text-primary font-bold mt-0.5">{selectedAdvisor.phone}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-extrabold text-xs text-surface-dark uppercase tracking-wider">Citas Asignadas Activas:</h5>
              {appointments.filter(a => a.advisorName === selectedAdvisor.name).map((a) => (
                <div key={a.id} className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-surface-dark block">{a.clientName} ({a.clientPhone})</span>
                    <span className="text-content-muted text-[11px]">{a.propertyTitle}</span>
                  </div>
                  <span className="font-black text-primary">{a.date} - {a.time}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedAdvisor(null)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL REGISTRAR ASESOR */}
      <Modal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
        title="Registrar Nuevo Asesor Inmobiliario"
        subtitle="Agrega un nuevo agente al directorio autorizado de InmoVax"
      >
        <form onSubmit={handleSaveAdvisor} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-surface-dark mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={advisorForm.name}
              onChange={(e) => setAdvisorForm({ ...advisorForm, name: e.target.value })}
              placeholder="Ej: Lic. Rodrigo Mendoza"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={advisorForm.email}
                onChange={(e) => setAdvisorForm({ ...advisorForm, email: e.target.value })}
                placeholder="rodrigo.mendoza@inmovax.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Teléfono / WhatsApp</label>
              <input
                type="text"
                required
                value={advisorForm.phone}
                onChange={(e) => setAdvisorForm({ ...advisorForm, phone: e.target.value })}
                placeholder="+591 76543210"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-dark mb-1">Zona de Asignación Principal</label>
            <select
              value={advisorForm.zone}
              onChange={(e) => setAdvisorForm({ ...advisorForm, zone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none cursor-pointer"
            >
              <option value="Sopocachi & Centro, La Paz">Sopocachi & Centro, La Paz</option>
              <option value="Calacoto & San Miguel, La Paz">Calacoto & San Miguel, La Paz</option>
              <option value="Achumani & Los Pinos, La Paz">Achumani & Los Pinos, La Paz</option>
              <option value="Miraflores & San Jorge, La Paz">Miraflores & San Jorge, La Paz</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAdvisorModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow cursor-pointer"
            >
              Registrar Asesor
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL REGISTRAR CITA */}
      <Modal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        title="Agendar Nueva Visita Inmobiliaria"
        subtitle="Registra la solicitud de un cliente para coordinar visita presencial"
      >
        <form onSubmit={handleSaveAppointment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-surface-dark mb-1">Nombre del Cliente</label>
            <input
              type="text"
              required
              value={aptForm.clientName}
              onChange={(e) => setAptForm({ ...aptForm, clientName: e.target.value })}
              placeholder="Ej: Ing. Gonzalo Benítez"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Teléfono Cliente</label>
              <input
                type="text"
                required
                value={aptForm.clientPhone}
                onChange={(e) => setAptForm({ ...aptForm, clientPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Asesor Asignado</label>
              <select
                value={aptForm.advisorName}
                onChange={(e) => setAptForm({ ...aptForm, advisorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none cursor-pointer"
              >
                {advisors.map(a => (
                  <option key={a.id} value={a.name}>{a.name} ({a.zone})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Fecha</label>
              <input
                type="text"
                required
                value={aptForm.date}
                onChange={(e) => setAptForm({ ...aptForm, date: e.target.value })}
                placeholder="Ej: 28 de Agosto"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Horario</label>
              <input
                type="text"
                required
                value={aptForm.time}
                onChange={(e) => setAptForm({ ...aptForm, time: e.target.value })}
                placeholder="Ej: 15:30"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-dark mb-1">Inmueble de Interés</label>
            <input
              type="text"
              required
              value={aptForm.propertyTitle}
              onChange={(e) => setAptForm({ ...aptForm, propertyTitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAppointmentModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow cursor-pointer"
            >
              Confirmar Cita
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

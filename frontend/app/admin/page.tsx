"use client";
import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from '@/components/organisms/AdminSidebar';
import { AdminHeader } from '@/components/organisms/AdminHeader';
import { AdminOverviewSection } from '@/components/organisms/AdminOverviewSection';
import { AdminPropertiesSection, PropertyItem } from '@/components/organisms/AdminPropertiesSection';
import { AdminLegalSection } from '@/components/organisms/AdminLegalSection';
import { AdminAdvisorsSection, AppointmentItem } from '@/components/organisms/AdminAdvisorsSection';
import { AdminTransactionsSection } from '@/components/organisms/AdminTransactionsSection';
import { AdminSettingsSection } from '@/components/organisms/AdminSettingsSection';
import { LegalProperty } from '@/components/molecules/LegalDocItem';
import { Advisor } from '@/components/molecules/AdvisorCard';

const INITIAL_PROPERTIES: PropertyItem[] = [
  {
    id: "PROP-104",
    title: "Departamento de Lujo con Terraza Panorámica",
    zone: "Sopocachi, La Paz",
    type: "Anticrético",
    price: "$us 45,000",
    status: "En Revisión Legal",
    advisor: "Carlos Vega",
    folioReal: "2.01.0.99.0018472",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
    date: "Hoy, 10:30 AM",
    rooms: 3,
    area: "140 m²",
    description: "Departamento soleado con vista al Illimani y terraza privada."
  },
  {
    id: "PROP-103",
    title: "Casa Familiar con Jardín y Parrillero",
    zone: "Achumani, La Paz",
    type: "Venta",
    price: "$us 320,000",
    status: "Publicado",
    advisor: "Mariana Ríos",
    folioReal: "2.01.4.12.0049182",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    date: "Ayer",
    rooms: 4,
    area: "320 m²",
    description: "Amplia residencia con garaje para 3 vehículos y parrillero techado."
  },
  {
    id: "PROP-102",
    title: "Penthouse Exclusivo con Vista al Illimani",
    zone: "Calacoto, La Paz",
    type: "Anticrético",
    price: "$us 75,000",
    status: "Pendiente",
    advisor: "Carlos Vega",
    folioReal: "2.01.1.05.0083719",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    date: "24 Ago 2026",
    rooms: 3,
    area: "185 m²",
    description: "Acabados de mármol y ascensor directo al departamento."
  },
  {
    id: "PROP-101",
    title: "Oficina Corporativa Torre Empresarial",
    zone: "San Jorge, La Paz",
    type: "Alquiler",
    price: "$us 1,200/mes",
    status: "Publicado",
    advisor: "Andrea Morales",
    folioReal: "2.01.0.88.0029314",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    date: "22 Ago 2026",
    rooms: 2,
    area: "90 m²",
    description: "Piso alto con divisiones de vidrio templado y parqueo privado."
  },
  {
    id: "PROP-100",
    title: "Monoambiente Amoblado para Ejecutivos",
    zone: "Miraflores, La Paz",
    type: "Alquiler",
    price: "$us 450/mes",
    status: "Publicado",
    advisor: "Mariana Ríos",
    folioReal: "2.01.2.33.0019283",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
    date: "20 Ago 2026",
    rooms: 1,
    area: "48 m²",
    description: "Totalmente equipado a pasos de la estación del teleférico blanco."
  }
];

const INITIAL_LEGAL_ITEMS: LegalProperty[] = [
  {
    id: "PROP-104",
    title: "Departamento de Lujo con Terraza Panorámica",
    zone: "Sopocachi, La Paz",
    price: "$us 45,000",
    folioReal: "2.01.0.99.0018472",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
    advisor: "Carlos Vega",
    status: "En Revisión Notarial",
    alodialStatus: "Vigente",
    taxesYear: 2025
  },
  {
    id: "PROP-102",
    title: "Penthouse Exclusivo con Vista al Illimani",
    zone: "Calacoto, La Paz",
    price: "$us 75,000",
    folioReal: "2.01.1.05.0083719",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    advisor: "Carlos Vega",
    status: "Pendiente Certificado DDRR",
    alodialStatus: "En Trámite",
    taxesYear: 2025
  },
  {
    id: "PROP-106",
    title: "Casa Tradicional en San Miguel",
    zone: "San Miguel, La Paz",
    price: "$us 60,000",
    folioReal: "2.01.1.09.0039182",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop",
    advisor: "Mariana Ríos",
    status: "Revisión de Gravamen",
    alodialStatus: "Vigente",
    taxesYear: 2024
  }
];

const INITIAL_ADVISORS: Advisor[] = [
  {
    id: "ADV-1",
    name: "Carlos Vega",
    email: "carlos.vega@inmovax.com",
    phone: "+591 76543210",
    zone: "Zona Sur & Sopocachi",
    activeProperties: 8,
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    dealsClosed: 14
  },
  {
    id: "ADV-2",
    name: "Mariana Ríos",
    email: "mariana.rios@inmovax.com",
    phone: "+591 71234567",
    zone: "Achumani & Calacoto",
    activeProperties: 6,
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    dealsClosed: 9
  },
  {
    id: "ADV-3",
    name: "Andrea Morales",
    email: "andrea.morales@inmovax.com",
    phone: "+591 78901234",
    zone: "Centro & San Jorge",
    activeProperties: 4,
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    dealsClosed: 11
  }
];

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: "APT-1",
    clientName: "Lic. Roberto Quiroga",
    clientPhone: "+591 77201928",
    propertyTitle: "Anticrético Sopocachi ($us 45,000)",
    date: "Hoy",
    time: "15:00",
    advisorName: "Carlos Vega",
    status: "Confirmada",
    notes: "Cliente interesado en entrega de llaves este mes."
  },
  {
    id: "APT-2",
    clientName: "Arq. Patricia Paredes",
    clientPhone: "+591 70619283",
    propertyTitle: "Casa Achumani ($us 320,000)",
    date: "Mañana",
    time: "10:30",
    advisorName: "Mariana Ríos",
    status: "Pendiente",
    notes: "Visita en familia con chequeo de garaje."
  },
  {
    id: "APT-3",
    clientName: "Dr. Fernando Morales",
    clientPhone: "+591 72039485",
    propertyTitle: "Oficina San Jorge ($us 1,200)",
    date: "28 Ago",
    time: "16:00",
    advisorName: "Andrea Morales",
    status: "Confirmada",
    notes: "Reunión corporativa para firma de contrato."
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Estados de datos en memoria (Frontend)
  const [properties, setProperties] = useState<PropertyItem[]>(INITIAL_PROPERTIES);
  const [legalItems, setLegalItems] = useState<LegalProperty[]>(INITIAL_LEGAL_ITEMS);
  const [advisors, setAdvisors] = useState<Advisor[]>(INITIAL_ADVISORS);
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Manejo de Inmuebles
  const handleUpdatePropertyStatus = (id: string, newStatus: PropertyItem['status']) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    showToast(`Inmueble ${id} actualizado a estado: ${newStatus}`);
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm("¿Confirmas la eliminación definitiva de este inmueble del catálogo?")) {
      setProperties(prev => prev.filter(p => p.id !== id));
      showToast(`Inmueble ${id} eliminado del catálogo.`);
    }
  };

  const handleAddProperty = (newProp: PropertyItem) => {
    setProperties(prev => [newProp, ...prev]);
    showToast(`Inmueble ${newProp.title} registrado exitosamente.`);
  };

  const handleEditProperty = (updatedProp: PropertyItem) => {
    setProperties(prev => prev.map(p => p.id === updatedProp.id ? updatedProp : p));
    showToast(`Inmueble ${updatedProp.id} actualizado.`);
  };

  // Manejo Legal / Folio Real
  const handleApproveLegal = (id: string) => {
    setLegalItems(prev => prev.filter(item => item.id !== id));
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'Publicado' } : p));
    showToast(`Folio Real del inmueble ${id} validado notarialmente y habilitado.`);
  };

  const handleRejectLegal = (id: string) => {
    setLegalItems(prev => prev.filter(item => item.id !== id));
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'Pausado' } : p));
    showToast(`Documentación del inmueble ${id} observada por el departamento legal.`);
  };

  // Manejo de Asesores y Citas
  const handleAddAdvisor = (newAdvisor: Advisor) => {
    setAdvisors(prev => [...prev, newAdvisor]);
    showToast(`Asesor ${newAdvisor.name} incorporado al equipo oficial.`);
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentItem['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    showToast(`Cita ${id} actualizada a: ${newStatus}`);
  };

  const handleAddAppointment = (newApt: AppointmentItem) => {
    setAppointments(prev => [newApt, ...prev]);
    showToast(`Cita para ${newApt.clientName} agendada correctamente.`);
  };

  // Manejo de Configuración
  const handleSaveSettings = () => {
    showToast(`Parámetros y políticas notariales actualizados correctamente.`);
  };

  return (
    <div className="flex min-h-screen">
      
      {/* TOAST FLOTANTE */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-dark text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-accent font-black">⚡ InmoVax Core:</span>
          <span className="text-xs sm:text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* SIDEBAR ORGANISM */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingLegalCount={legalItems.length}
        propertiesCount={properties.length}
      />

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER ORGANISM */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onQuickPublish={() => setActiveTab('propiedades')}
        />

        {/* CONTENEDOR DE PESTAÑAS */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {activeTab === 'resumen' && (
              <AdminOverviewSection
                propertiesCount={properties.length}
                pendingLegalCount={legalItems.length}
                advisorsCount={advisors.length}
                transactionsVolume="$us 441,200"
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'propiedades' && (
              <AdminPropertiesSection
                properties={properties}
                onUpdateStatus={handleUpdatePropertyStatus}
                onDeleteProperty={handleDeleteProperty}
                onAddProperty={handleAddProperty}
                onEditProperty={handleEditProperty}
              />
            )}

            {activeTab === 'legal' && (
              <AdminLegalSection
                legalItems={legalItems}
                onApprove={handleApproveLegal}
                onReject={handleRejectLegal}
              />
            )}

            {activeTab === 'asesores' && (
              <AdminAdvisorsSection
                advisors={advisors}
                appointments={appointments}
                onAddAdvisor={handleAddAdvisor}
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                onAddAppointment={handleAddAppointment}
              />
            )}

            {activeTab === 'transacciones' && (
              <AdminTransactionsSection />
            )}

            {activeTab === 'configuracion' && (
              <AdminSettingsSection
                onSaveSettings={handleSaveSettings}
              />
            )}

          </div>
        </main>

      </div>

    </div>
  );
}

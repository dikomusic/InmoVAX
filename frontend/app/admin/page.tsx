"use client";
import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { readStoredSession } from '@/lib/frontendStore';
import { ShieldAlert, Lock, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<'checking' | 'authorized' | 'denied'>(() => {
    if (typeof window === 'undefined') return 'checking';
    const session = readStoredSession();
    const isAdmin = session && (session.role === 'admin' || session.email === 'admin@inmovax.com');
    return isAdmin ? 'authorized' : 'denied';
  });
  const [activeTab, setActiveTab] = useState<AdminTab>('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Estados dinámicos alimentados directamente por Supabase / Bun
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [legalItems, setLegalItems] = useState<LegalProperty[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);

  useEffect(() => {
    if (authStatus === 'denied') {
      const timer = setTimeout(() => {
        router.replace('/login?error=admin_required&redirect=/admin');
      }, 1800);
      return () => clearTimeout(timer);
    }

    const apiBase = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
      ? process.env.NEXT_PUBLIC_API_URL
      : 'http://localhost:4000/api';

    // 1. Inmuebles reales desde Supabase
    fetch(`${apiBase}/properties`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.properties) {
          const mapped: PropertyItem[] = data.properties.map((p: any) => ({
            id: p.id,
            title: p.title,
            zone: p.zone,
            type: p.type,
            price: p.price,
            status: p.status === 'Activo' ? 'Publicado' : p.status === 'En Validación Legal' ? 'En Revisión Legal' : 'Pendiente',
            advisor: p.assignedAdvisor || 'Lic. Carlos Vega',
            folioReal: p.folioReal,
            image: p.image || '',
            date: p.datePublished || 'Reciente',
            rooms: p.habitaciones || 3,
            area: `${p.metros || 120} m²`,
            description: p.title
          }));
          setProperties(mapped);
        }
      })
      .catch(() => {});

    // 2. Expedientes legales desde Supabase
    fetch('http://localhost:4000/api/legal-audits', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.audits) setLegalItems(data.audits);
      })
      .catch(() => {});

    // 3. Asesores oficiales desde Supabase
    fetch('http://localhost:4000/api/advisors', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.advisors) setAdvisors(data.advisors);
      })
      .catch(() => {});

    // 4. Citas presenciales desde Supabase
    fetch('http://localhost:4000/api/appointments', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.appointments) {
          const mappedApts: AppointmentItem[] = data.appointments.map((a: any) => ({
            id: a.id,
            clientName: a.clientName,
            clientPhone: a.clientPhone,
            propertyTitle: a.propertyTitle,
            date: a.date,
            time: a.time,
            advisorName: a.advisorName,
            status: a.status === 'Confirmada' ? 'Confirmada' : 'Pendiente',
            notes: 'Coordinado vía InmoVAX DDRR'
          }));
          setAppointments(mappedApts);
        }
      })
      .catch(() => {});
  }, []);

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

  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 animate-pulse">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-xl font-black">Panel Administrador InmoVAX</h2>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-accent" /> Verificando permisos de seguridad...
          </p>
        </div>
      </div>
    );
  }

  if (authStatus === 'denied') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              Acceso Restringido
            </span>
            <h2 className="text-2xl font-black text-white mt-3">Área de Administrador</h2>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              Esta sección requiere credenciales maestras de Administrador. No tienes permisos para visualizar este portal.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/login?redirect=/admin"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all text-center"
            >
              Iniciar Sesión como Administrador
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

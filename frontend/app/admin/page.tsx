"use client";
import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminTab } from '@/components/organisms/AdminSidebar';
import { AdminHeader } from '@/components/organisms/AdminHeader';
import { AdminOverviewSection } from '@/components/organisms/AdminOverviewSection';
import { AdminPropertiesSection, PropertyItem } from '@/components/organisms/AdminPropertiesSection';
import { AdminPaymentsSection } from '@/components/organisms/AdminPaymentsSection';
import { AdminUsersSection } from '@/components/organisms/AdminUsersSection';
import { AdminMessagesSection } from '@/components/organisms/AdminMessagesSection';
import { AdminSettingsSection } from '@/components/organisms/AdminSettingsSection';
import { readStoredSession } from '@/lib/frontendStore';
import { getAllManagedProperties, saveManagedProperties, deleteManagedProperty } from '@/lib/propertiesStore';
import { fetchAdminPendingPayments, fetchAdminHistoryPayments } from '@/lib/paymentsApi';
import { Lock, Loader2, Activity } from 'lucide-react';
import { Error403Forbidden } from '@/components/organisms/Error403Forbidden';

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [authStatus, setAuthStatus] = useState<'checking' | 'authorized' | 'denied'>('checking');
  const [activeTab, setActiveTab] = useState<AdminTab>('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Estados dinámicos de inmuebles, pagos y consultas reales
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);
  const [approvedPaymentsCount, setApprovedPaymentsCount] = useState(0);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const loadPropertiesAndMetrics = () => {
    const apiBase = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
      ? process.env.NEXT_PUBLIC_API_URL
      : 'http://localhost:4000/api';

    // 1. Inmuebles reales desde Supabase / Bun
    fetch(`${apiBase}/properties?status=all`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.properties) {
          const mapped: PropertyItem[] = data.properties.map((p: any) => {
            const rawOwner = p.sellerName || p.authorName || p.assignedAdvisor || '';
            const isFakeAdvisor = rawOwner.toLowerCase().includes('carlos vega') || rawOwner.toLowerCase().includes('mariana');
            const cleanOwner = isFakeAdvisor ? 'Propietario InmoVAX' : (rawOwner || 'Propietario InmoVAX');

            return {
              id: p.id,
              title: p.title,
              zone: p.zone,
              type: p.type,
              price: p.price,
              status: p.status === 'Activo' ? 'Publicado' : (p.status === 'En Validación Legal' ? 'En Revisión Legal' : (p.status === 'Pausado' ? 'Pausado' : 'Pendiente')),
              ownerName: cleanOwner,
              ownerContact: p.sellerPhone || p.authorEmail || p.contact_phone || '+591 76543210',
              folioReal: p.folioReal || 'Sin Folio',
              image: p.image || '',
              date: p.datePublished || 'Reciente',
              rooms: p.habitaciones || 3,
              area: `${p.metros || 120} m²`,
              description: p.description || p.title
            };
          });
          setProperties(mapped);
          saveManagedProperties(data.properties);
        }
      })
      .catch(() => {});

    // 2. Pagos reales (pendientes e historial de aprobados)
    Promise.all([
      fetchAdminPendingPayments(),
      fetchAdminHistoryPayments()
    ]).then(([pending, history]) => {
      setPendingPaymentsCount(pending.length);
      const approved = history.filter(h => h.status === 'aprobado');
      setApprovedPaymentsCount(approved.length);
      const rev = approved.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      setRevenueTotal(rev);
    }).catch(() => {});

    // 3. Consultas y mensajes recibidos
    fetch('http://localhost:4000/api/consultations')
      .then(res => res.json())
      .then(data => {
        if (data.consultations) {
          const pending = data.consultations.filter((c: any) => c.status === 'pendiente');
          setUnreadMessagesCount(pending.length);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    setMounted(true);
    const session = readStoredSession();
    const isAdmin = session && (session.role === 'admin' || session.email === 'admin@inmovax.com');
    if (!isAdmin) {
      setAuthStatus('denied');
      return;
    }
    setAuthStatus('authorized');
    loadPropertiesAndMetrics();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Acciones sobre inmuebles
  const handleUpdatePropertyStatus = async (id: string, newStatus: PropertyItem['status']) => {
    const dbStatus = newStatus === 'Publicado' ? 'Activo' : (newStatus === 'En Revisión Legal' ? 'En Validación Legal' : newStatus);
    
    // Actualización optimista local
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    
    try {
      const res = await fetch(`http://localhost:4000/api/properties/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: dbStatus })
      });
      if (res.ok) {
        showNotification(`Inmueble ${id} actualizado a "${newStatus}"`);
        loadPropertiesAndMetrics();
      } else {
        showNotification(`Inmueble actualizado localmente.`);
      }
    } catch {
      showNotification(`Inmueble actualizado en memoria.`);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar permanentemente esta propiedad?')) return;
    
    setProperties(prev => prev.filter(p => p.id !== id));
    deleteManagedProperty(id);
    
    try {
      await fetch(`http://localhost:4000/api/properties/${id}`, {
        method: 'DELETE'
      });
      showNotification(`Propiedad ${id} eliminada permanentemente del sistema.`);
      loadPropertiesAndMetrics();
    } catch {
      showNotification(`Propiedad eliminada localmente.`);
    }
  };

  const handleAddProperty = async (newProp: PropertyItem) => {
    setProperties(prev => [newProp, ...prev]);
    showNotification(`Nueva propiedad "${newProp.title}" registrada exitosamente.`);
    
    try {
      await fetch('http://localhost:4000/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProp.title,
          zone: newProp.zone,
          type: newProp.type,
          price: newProp.price,
          status: newProp.status === 'Publicado' ? 'Activo' : 'En Validación Legal',
          assignedAdvisor: newProp.ownerName,
          sellerName: newProp.ownerName,
          sellerPhone: newProp.ownerContact,
          folioReal: newProp.folioReal,
          image: newProp.image,
          habitaciones: newProp.rooms,
          metros: parseInt(newProp.area) || 120,
          description: newProp.description
        })
      });
      loadPropertiesAndMetrics();
    } catch {}
  };

  const handleEditProperty = (updated: PropertyItem) => {
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
    showNotification(`Propiedad "${updated.title}" actualizada.`);
  };

  if (!mounted || authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4">
        <div className="text-center text-white space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto border border-white/20 animate-pulse">
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
      <Error403Forbidden
        title="403 - Acceso Restringido"
        description="Esta sección requiere permisos y credenciales maestras de Administrador. No tienes autorización para visualizar este portal."
        buttonText="Volver a la página principal"
        buttonHref="/"
      />
    );
  }

  const publishedCount = properties.filter(p => p.status === 'Publicado').length;

  return (
    <div className="flex min-h-screen">
      
      {/* TOAST FLOTANTE */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-dark text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-accent font-black inline-flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-accent" />
            <span>InmoVax Core:</span>
          </span>
          <span className="text-xs sm:text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* SIDEBAR ORGANISM: Los 5 módulos oficiales */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingPaymentsCount={pendingPaymentsCount}
        propertiesCount={properties.length}
        unreadMessagesCount={unreadMessagesCount}
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
            
            {/* 1. DASHBOARD */}
            {activeTab === 'resumen' && (
              <AdminOverviewSection
                propertiesCount={properties.length}
                publishedCount={publishedCount}
                pendingPaymentsCount={pendingPaymentsCount}
                approvedPaymentsCount={approvedPaymentsCount}
                revenueTotal={revenueTotal}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {/* 2. GESTIÓN DE INMUEBLES */}
            {activeTab === 'propiedades' && (
              <AdminPropertiesSection
                properties={properties}
                onUpdateStatus={handleUpdatePropertyStatus}
                onDeleteProperty={handleDeleteProperty}
                onAddProperty={handleAddProperty}
                onEditProperty={handleEditProperty}
              />
            )}

            {/* 3. PLANES Y PAGOS QR */}
            {activeTab === 'pagos' && (
              <AdminPaymentsSection />
            )}

            {/* 4. DIRECTORIO DE USUARIOS */}
            {activeTab === 'usuarios' && (
              <AdminUsersSection />
            )}

            {/* 5. MENSAJES Y CONSULTAS WEB */}
            {activeTab === 'mensajes' && (
              <AdminMessagesSection />
            )}

            {/* 6. CONFIGURACIÓN GLOBAL */}
            {activeTab === 'configuracion' && (
              <AdminSettingsSection
                onSaveSettings={() => showNotification('Configuración del sistema actualizada correctamente.')}
              />
            )}

          </div>
        </main>

      </div>

    </div>
  );
}

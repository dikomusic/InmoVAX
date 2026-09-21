"use client";
import React, { useState, useEffect } from 'react';
import { SellerPortalTemplate } from '@/components/templates/SellerPortalTemplate';
import { SellerSidebar, SellerTab } from '@/components/organisms/SellerSidebar';
import { SellerHeader } from '@/components/organisms/SellerHeader';
import { SellerOverviewSection } from '@/components/organisms/SellerOverviewSection';
import { SellerPropertiesSection } from '@/components/organisms/SellerPropertiesSection';
import { SellerOffersSection } from '@/components/organisms/SellerOffersSection';
import { SellerAppointmentsSection, SellerAppointment } from '@/components/organisms/SellerAppointmentsSection';
import { SellerDocumentsSection } from '@/components/organisms/SellerDocumentsSection';
import { SellerDeleteConfirmModal } from '@/components/molecules/SellerDeleteConfirmModal';
import { SellerProperty } from '@/components/molecules/SellerPropertyCard';
import { SellerOffer } from '@/components/molecules/SellerOfferItem';
import { SellerNotificationItem } from '@/components/molecules/SellerNotifications';
import { Modal } from '@/components/atoms/Modal';
import { PublishPropertyForm } from '@/components/organisms/PublishPropertyForm';
import { readStoredSession } from '@/lib/frontendStore';
import {
  getPropertiesByAuthor,
  addManagedProperty,
  deleteManagedProperty,
  togglePauseManagedProperty,
  updateManagedProperty,
  ManagedProperty
} from '@/lib/propertiesStore';
import {
  fetchSellerProperties,
  fetchSellerOffers,
  acceptSellerOffer,
  rejectSellerOffer,
  counterSellerOffer,
  fetchSellerAppointments,
  fetchSellerNotifications
} from '@/lib/sellerApi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Lock, Loader2, ArrowLeft } from 'lucide-react';

const TAB_TITLES: Record<SellerTab, string> = {
  resumen: 'Mi Panel General',
  inmuebles: 'Mis Inmuebles Publicados',
  consultas: 'Consultas y Ofertas',
  citas: 'Agenda y Visitas',
  documentos: 'Folio Real y Minutas',
  favoritos: 'Favoritos Guardados',
  historial: 'Historial de Navegación'
};

export default function SellerPortalPage() {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<'checking' | 'authorized' | 'unauthenticated'>('checking');
  const [activeTab, setActiveTab] = useState<SellerTab>('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Modal de eliminación segura (reemplazo de window.confirm)
  const [propertyToDelete, setPropertyToDelete] = useState<SellerProperty | null>(null);

  // Modal de publicación asistida
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Sesión actual
  const [session, setSession] = useState<{ email: string; name: string } | null>(null);

  // Control de montaje seguro contra desajustes de hidratación SSR
  const [isMounted, setIsMounted] = useState(false);

  // Datos reactivos de publicaciones del vendedor
  const [properties, setProperties] = useState<SellerProperty[]>([]);
  const [offers, setOffers] = useState<SellerOffer[]>([]);
  const [appointments, setAppointments] = useState<SellerAppointment[]>([]);
  const [notifications, setNotifications] = useState<SellerNotificationItem[]>([]);

  const currentEmail = session?.email || '';
  const currentName = session?.name || '';

  // Carga inicial y conexión con Backend Bun y PostgreSQL
  useEffect(() => {
    setIsMounted(true);
    const current = readStoredSession();
    if (!current || !current.email) {
      setAuthStatus('unauthenticated');
      const timer = setTimeout(() => {
        router.replace('/login?redirect=/vendedor&error=auth_required');
      }, 1800);
      return () => clearTimeout(timer);
    }

    setAuthStatus('authorized');
    const userEmail = current.email;
    const userName = current.name || userEmail.split('@')[0];
    setSession({ email: userEmail, name: userName });

    // 1. Inmuebles sincronizados (Carga rápida local + actualización desde Supabase)
    const localProps = getPropertiesByAuthor(userEmail);
    setProperties(localProps);

    fetchSellerProperties(userEmail).then((cloudProps) => {
      if (cloudProps && cloudProps.length > 0) {
        setProperties(cloudProps);
      }
    });

    // 2. Ofertas reales desde Supabase
    fetchSellerOffers().then((data) => {
      if (data && data.length > 0) setOffers(data);
    });

    // 3. Citas reales desde Supabase
    fetchSellerAppointments().then((data) => {
      if (data && data.length > 0) setAppointments(data);
    });

    // 4. Notificaciones reales desde Supabase
    fetchSellerNotifications().then((data) => {
      if (data && data.length > 0) setNotifications(data);
    });
  }, []);

  // Escuchar cambios reactivos en el almacén de propiedades
  useEffect(() => {
    if (!isMounted) return;
    const syncProperties = () => {
      const localProps = getPropertiesByAuthor(currentEmail);
      setProperties(localProps);
      fetchSellerProperties(currentEmail).then((cloudProps) => {
        if (cloudProps && cloudProps.length > 0) {
          setProperties(cloudProps);
        }
      });
    };

    window.addEventListener('inmovax:properties-updated', syncProperties);
    return () => window.removeEventListener('inmovax:properties-updated', syncProperties);
  }, [currentEmail, isMounted]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Acciones CRUD Inmuebles
  const handleTogglePause = (id: string) => {
    const nextStatus = togglePauseManagedProperty(id);
    setProperties(getPropertiesByAuthor(currentEmail));
    showToast(`Inmueble cambiado a estado: ${nextStatus}`);
  };

  const handleRequestDelete = (property: SellerProperty) => {
    setPropertyToDelete(property);
  };

  const handleConfirmDelete = () => {
    if (propertyToDelete) {
      const deletedTitle = propertyToDelete.title;
      deleteManagedProperty(propertyToDelete.id);
      setProperties(getPropertiesByAuthor(currentEmail));
      setPropertyToDelete(null);
      showToast(`Publicación "${deletedTitle}" eliminada del catálogo.`);
    }
  };

  const handleUpdateProperty = (updated: SellerProperty) => {
    updateManagedProperty({
      ...updated,
      authorEmail: currentEmail,
      authorName: currentName
    });
    setProperties(getPropertiesByAuthor(currentEmail));
    showToast(`Inmueble "${updated.title}" actualizado correctamente.`);
  };

  // Manejo de Ofertas con persistencia real en Supabase
  const handleAcceptOffer = async (id: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: 'Aceptada' } : o));
    const ok = await acceptSellerOffer(id);
    if (ok) {
      showToast('Oferta aceptada en base de datos. El asesor coordinará la minuta notarial.');
    } else {
      showToast('Oferta aceptada localmente.');
    }
  };

  const handleRejectOffer = async (id: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: 'Rechazada' } : o));
    const ok = await rejectSellerOffer(id);
    if (ok) {
      showToast('Oferta rechazada en base de datos.');
    } else {
      showToast('Oferta rechazada.');
    }
  };

  const handleCounterOfferSubmit = async (id: string, counterPrice: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: 'Contraofertada', offerAmount: counterPrice } : o));
    const ok = await counterSellerOffer(id, counterPrice);
    if (ok) {
      showToast(`Contraoferta guardada en Supabase por ${counterPrice}.`);
    } else {
      showToast(`Contraoferta enviada al comprador por ${counterPrice}.`);
    }
  };

  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 animate-pulse">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-xl font-black">Portal del Propietario InmoVAX</h2>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-accent" /> Verificando sesión de vendedor...
          </p>
        </div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Sesión Requerida
            </span>
            <h2 className="text-2xl font-black text-white mt-3">Portal de Propietario</h2>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              Debes iniciar sesión con tu cuenta para gestionar tus publicaciones, recibir ofertas y coordinar visitas.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/login?redirect=/vendedor"
              className="w-full py-3 bg-accent hover:brightness-110 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all text-center"
            >
              Iniciar Sesión en InmoVAX
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a la Página Principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SellerPortalTemplate
      sidebar={
        <SellerSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onPublishClick={() => setIsPublishModalOpen(true)}
          myPropertiesCount={isMounted ? properties.length : undefined}
          appointmentsCount={isMounted ? appointments.length : undefined}
          userName={currentName}
          userEmail={currentEmail}
        />
      }
      header={
        <SellerHeader
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />
      }
      notificationToast={
        notification ? (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md bg-slate-900/95 backdrop-blur-md text-white px-4 sm:px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div className="text-xs sm:text-sm font-semibold leading-tight">
              {notification}
            </div>
          </div>
        ) : null
      }
      modals={
        <>
          {/* MODAL ELIMINACIÓN SEGURA CON PREVIEW */}
          <SellerDeleteConfirmModal
            isOpen={!!propertyToDelete}
            property={propertyToDelete}
            onClose={() => setPropertyToDelete(null)}
            onConfirm={handleConfirmDelete}
          />

          {/* MODAL PUBLICACIÓN RÁPIDA CON FOLIO REAL */}
          <Modal
            isOpen={isPublishModalOpen}
            onClose={() => setIsPublishModalOpen(false)}
            title="Publicar Nuevo Inmueble (Asistente Oficial InmoVAX)"
            subtitle="Registra tu propiedad con geolocalización y Folio Real verificado"
            maxWidth="3xl"
          >
            <div className="pt-2">
              <PublishPropertyForm
                isLoggedInSeller={true}
                onSuccessCallback={(data) => {
                  addManagedProperty({
                    title: `${data.tipoInmueble.toUpperCase()} en ${data.zona}`,
                    zone: data.zona,
                    address: data.calle || data.zona,
                    description: data.descripcion || `${data.tipoInmueble.toUpperCase()} en ${data.zona}`,
                    type: (data.operacion.charAt(0).toUpperCase() + data.operacion.slice(1)) as ManagedProperty['type'],
                    price: `${data.moneda === 'usd' ? '$us' : 'Bs.'} ${data.precio}`,
                    status: 'Activo',
                    folioReal: data.folioReal || `2.01.0.99.00${Math.floor(1000 + Math.random() * 9000)}`,
                    assignedAdvisor: 'Lic. Carlos Vega',
                    image: data.imagenUrl || '',
                    authorEmail: currentEmail,
                    authorName: currentName,
                    habitaciones: Number(data.habitaciones) || 3,
                    banos: Number(data.banos) || 2,
                    metros: Number(data.supConstruida) || 120,
                    estacionamientos: Number(data.parqueos) || 0,
                    amenidades: data.amenidades || []
                  });
                  setProperties(getPropertiesByAuthor(currentEmail));
                  setIsPublishModalOpen(false);
                  showToast('¡Inmueble registrado con éxito! Nuestro equipo legal auditará el Folio Real en menos de 2 horas.');
                  setActiveTab('inmuebles');
                }}
              />
            </div>
          </Modal>
        </>
      }
    >
      {/* SECCIONES SEGÚN TAB ACTIVO */}
      {activeTab === 'resumen' && (
        <SellerOverviewSection
          properties={properties}
          offers={offers}
          notifications={notifications}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onRequestDeleteProperty={handleRequestDelete}
          onOpenPublishModal={() => setIsPublishModalOpen(true)}
          userName={currentName}
        />
      )}

      {activeTab === 'inmuebles' && (
        <SellerPropertiesSection
          properties={properties}
          onTogglePause={handleTogglePause}
          onOpenPublishModal={() => setIsPublishModalOpen(true)}
          onUpdateProperty={handleUpdateProperty}
          onRequestDeleteProperty={handleRequestDelete}
        />
      )}

      {activeTab === 'consultas' && (
        <SellerOffersSection
          offers={offers}
          onAcceptOffer={handleAcceptOffer}
          onRejectOffer={handleRejectOffer}
          onCounterOfferSubmit={handleCounterOfferSubmit}
        />
      )}

      {activeTab === 'citas' && (
        <SellerAppointmentsSection
          appointments={appointments}
        />
      )}

      {activeTab === 'documentos' && (
        <SellerDocumentsSection />
      )}
    </SellerPortalTemplate>
  );
}

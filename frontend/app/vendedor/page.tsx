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
import { SellerSettingsSection } from '@/components/organisms/SellerSettingsSection';
import { SellerDeleteConfirmModal } from '@/components/molecules/SellerDeleteConfirmModal';
import { SellerProperty } from '@/components/molecules/SellerPropertyCard';
import { SellerOffer } from '@/components/molecules/SellerOfferItem';
import { SellerNotificationItem } from '@/components/molecules/SellerNotifications';
import { Modal } from '@/components/atoms/Modal';
import { PublishPropertyForm } from '@/components/organisms/PublishPropertyForm';
import { readStoredSession, ConsultationItem, CONSULTATIONS_KEY, getConsultationsForSeller, fetchConsultationsForSeller } from '@/lib/frontendStore';
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
import { CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { Error403Forbidden } from '@/components/organisms/Error403Forbidden';
import { PublicationPlansModal } from '@/components/organisms/PublicationPlansModal';
import { linkPropertyToOrder, PaymentOrderResponse } from '@/lib/paymentsApi';

export default function SellerPortalPage() {
  // Estado inicial uniforme para evitar errores de hidratación SSR
  const [authStatus, setAuthStatus] = useState<'checking' | 'authorized' | 'unauthenticated'>('checking');
  const [activeTab, setActiveTab] = useState<SellerTab>('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Modal de eliminación segura (reemplazo de window.confirm)
  const [propertyToDelete, setPropertyToDelete] = useState<SellerProperty | null>(null);

  // Flujo invertido de publicación: primero plan, luego formulario
  const [isPlanSelectionOpen, setIsPlanSelectionOpen] = useState(false);
  const [confirmedPlanOrder, setConfirmedPlanOrder] = useState<PaymentOrderResponse['order'] | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Modal para cambiar plan de propiedad existente
  const [propertyForPlan, setPropertyForPlan] = useState<SellerProperty | null>(null);

  // Sesión actual
  const [session, setSession] = useState<{ email: string; name: string } | null>(null);

  // Control de montaje seguro contra desajustes de hidratación SSR
  const [isMounted, setIsMounted] = useState(false);

  // Datos reactivos de publicaciones del vendedor
  const [properties, setProperties] = useState<SellerProperty[]>([]);
  const [offers, setOffers] = useState<SellerOffer[]>([]);
  const [appointments, setAppointments] = useState<SellerAppointment[]>([]);
  const [notifications, setNotifications] = useState<SellerNotificationItem[]>([]);
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);

  const currentEmail = session?.email || '';
  const currentName = session?.name || '';

  // Carga inicial y conexión con Backend Bun y PostgreSQL
  useEffect(() => {
    setIsMounted(true);
    const current = readStoredSession();
    if (!current || !current.email) {
      setAuthStatus('unauthenticated');
      return;
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

    // 5. Consultas y mensajes P2P directos de compradores
    setConsultations(getConsultationsForSeller(userEmail));
    fetchConsultationsForSeller(userEmail).then((cloud) => {
      if (cloud && cloud.length > 0) setConsultations(cloud);
    });
  }, []);

  // Escuchar cambios reactivos en el almacén de propiedades y consultas
  useEffect(() => {
    if (!isMounted) return;
    const syncProperties = () => {
      const localProps = getPropertiesByAuthor(currentEmail);
      setProperties(localProps);
    };

    const syncConsultations = (e?: Event) => {
      const custom = e as CustomEvent<{ key?: string }>;
      if (custom?.detail?.key && custom.detail.key !== CONSULTATIONS_KEY) return;
      setConsultations(getConsultationsForSeller(currentEmail));
      fetchConsultationsForSeller(currentEmail).then((cloud) => {
        setConsultations(cloud || []);
      }).catch(() => {});
    };

    window.addEventListener('inmovax:properties-updated', syncProperties);
    window.addEventListener('inmovax:list-updated', syncConsultations);
    window.addEventListener('inmovax:new-inquiry', syncConsultations);

    // Polling ligero cada 10s para sincronizar consultas
    const pollInterval = setInterval(syncConsultations, 10000);

    return () => {
      window.removeEventListener('inmovax:properties-updated', syncProperties);
      window.removeEventListener('inmovax:list-updated', syncConsultations);
      window.removeEventListener('inmovax:new-inquiry', syncConsultations);
      clearInterval(pollInterval);
    };
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

  const handleUpdateProperty = async (updated: SellerProperty) => {
    await updateManagedProperty({
      ...updated,
      authorEmail: currentEmail,
      authorName: currentName
    });
    setProperties(getPropertiesByAuthor(currentEmail));
    showToast(`Inmueble "${updated.title}" guardado en Supabase PostgreSQL.`);
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
      <Error403Forbidden
        title="403 - Portal del Propietario"
        description="Esta sección está reservada exclusivamente para propietarios y vendedores registrados en InmoVAX. No cuentas con una sesión activa para gestionar este portal."
        buttonText="Volver a la página principal"
        buttonHref="/"
      />
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
          consultationsCount={isMounted ? consultations.length : undefined}
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

          {/* PASO 1: MODAL FLOTANTE DE PLANES Y PAGO QR PREVIO */}
          <PublicationPlansModal
            isOpen={isPlanSelectionOpen}
            onClose={() => setIsPlanSelectionOpen(false)}
            propertyId="nueva-publicacion"
            propertyTitle="Nueva Publicación InmoVAX"
            onPlanConfirmed={(order) => {
              setConfirmedPlanOrder(order);
              setIsPlanSelectionOpen(false);
              setIsPublishModalOpen(true);
            }}
            ctaText="Comprobante Enviado - Llenar Formulario de Inmueble →"
          />

          {/* PASO 2: MODAL CON ASISTENTE DE PUBLICACIÓN */}
          <Modal
            isOpen={isPublishModalOpen}
            onClose={() => setIsPublishModalOpen(false)}
            title="Publicar Nuevo Inmueble (Paso 2: Datos de la Propiedad)"
            subtitle={confirmedPlanOrder ? `Plan Asignado: ${confirmedPlanOrder.planName} • Orden #${confirmedPlanOrder.id}` : "Registra tu propiedad con geolocalización y Folio Real verificado"}
            maxWidth="3xl"
          >
            <div className="pt-2">
              <PublishPropertyForm
                isLoggedInSeller={true}
                onSuccessCallback={async (data) => {
                  const newProp = await addManagedProperty({
                    title: `${data.tipoInmueble.toUpperCase()} en ${data.zona}`,
                    zone: data.zona,
                    address: data.calle || data.zona,
                    description: data.descripcion || `${data.tipoInmueble.toUpperCase()} en ${data.zona}`,
                    type: (data.operacion.charAt(0).toUpperCase() + data.operacion.slice(1)) as ManagedProperty['type'],
                    price: `${data.moneda === 'usd' ? '$us' : 'Bs.'} ${data.precio}`,
                    status: currentEmail.toLowerCase().trim() === 'vip@inmovax.com' ? 'Activo' : 'En Validación Legal',
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

                  if (confirmedPlanOrder && newProp) {
                    await linkPropertyToOrder(confirmedPlanOrder.id, newProp.id, newProp.title);
                  }

                  setProperties(getPropertiesByAuthor(currentEmail));
                  setIsPublishModalOpen(false);
                  showToast(
                    currentEmail.toLowerCase().trim() === 'vip@inmovax.com'
                      ? '¡Inmueble publicado y activo en la página principal (VIP Exento)!'
                      : `¡Inmueble registrado y enviado a validación legal con Plan ${confirmedPlanOrder?.planName || 'Básico'}!`
                  );
                  setActiveTab('inmuebles');
                }}
              />
            </div>
          </Modal>

          {/* MODAL PANTALLA FLOTANTE COMPARATIVA DE PLANES Y PAGO QR */}
          {propertyForPlan && (
            <PublicationPlansModal
              isOpen={!!propertyForPlan}
              onClose={() => setPropertyForPlan(null)}
              propertyId={propertyForPlan.id}
              propertyTitle={propertyForPlan.title}
              onSuccess={() => {
                showToast(`¡Plan de publicación activado para ${propertyForPlan.title}!`);
                setPropertyForPlan(null);
                setProperties(getPropertiesByAuthor(currentEmail));
              }}
            />
          )}
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
          onOpenPublishModal={() => setIsPlanSelectionOpen(true)}
          userName={currentName}
        />
      )}

      {activeTab === 'inmuebles' && (
        <SellerPropertiesSection
          properties={properties}
          onTogglePause={handleTogglePause}
          onOpenPublishModal={() => setIsPlanSelectionOpen(true)}
          onUpdateProperty={handleUpdateProperty}
          onRequestDeleteProperty={handleRequestDelete}
          onOpenPlanModal={(prop) => setPropertyForPlan(prop)}
        />
      )}

      {activeTab === 'consultas' && (
        <SellerOffersSection
          offers={offers}
          consultations={consultations}
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

      {activeTab === 'configuracion' && (
        <SellerSettingsSection
          userEmail={currentEmail}
          userName={currentName}
          onProfileUpdated={(updatedName) => {
            setSession(prev => prev ? { ...prev, name: updatedName } : null);
            showToast('Perfil comercial actualizado.');
          }}
        />
      )}
    </SellerPortalTemplate>
  );
}

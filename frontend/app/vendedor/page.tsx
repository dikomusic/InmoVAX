"use client";
import React, { useState } from 'react';
import { SellerSidebar, SellerTab } from '@/components/organisms/SellerSidebar';
import { SellerHeader } from '@/components/organisms/SellerHeader';
import { SellerOverviewSection } from '@/components/organisms/SellerOverviewSection';
import { SellerPropertiesSection } from '@/components/organisms/SellerPropertiesSection';
import { SellerOffersSection } from '@/components/organisms/SellerOffersSection';
import { SellerAppointmentsSection, SellerAppointment } from '@/components/organisms/SellerAppointmentsSection';
import { SellerDocumentsSection } from '@/components/organisms/SellerDocumentsSection';
import { SellerProperty } from '@/components/molecules/SellerPropertyCard';
import { SellerOffer } from '@/components/molecules/SellerOfferItem';
import { Modal } from '@/components/atoms/Modal';
import { PublishPropertyForm } from '@/components/organisms/PublishPropertyForm';

const INITIAL_SELLER_PROPERTIES: SellerProperty[] = [
  {
    id: "PROP-104",
    title: "Departamento de Lujo con Terraza Panorámica",
    zone: "Sopocachi, La Paz",
    type: "Anticrético",
    price: "$us 45,000",
    views: 312,
    inquiries: 18,
    status: "Activo",
    folioReal: "2.01.0.99.0018472",
    assignedAdvisor: "Carlos Vega",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
    datePublished: "Publicado hace 4 días"
  },
  {
    id: "PROP-102",
    title: "Penthouse Exclusivo con Vista al Illimani",
    zone: "Calacoto, La Paz",
    type: "Anticrético",
    price: "$us 75,000",
    views: 184,
    inquiries: 9,
    status: "En Validación Legal",
    folioReal: "2.01.1.05.0083719",
    assignedAdvisor: "Carlos Vega",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    datePublished: "Publicado ayer"
  },
  {
    id: "PROP-108",
    title: "Monoambiente para Estudiantes o Ejecutivos",
    zone: "Miraflores, La Paz",
    type: "Alquiler",
    price: "$us 420/mes",
    views: 95,
    inquiries: 6,
    status: "Activo",
    folioReal: "2.01.2.11.0029381",
    assignedAdvisor: "Mariana Ríos",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
    datePublished: "Publicado hace 1 semana"
  }
];

const INITIAL_SELLER_OFFERS: SellerOffer[] = [
  {
    id: "OFR-1",
    propertyTitle: "Departamento de Lujo con Terraza Panorámica",
    buyerName: "Dr. Marcelo Zeballos",
    buyerPhone: "+591 77201928",
    offerAmount: "$us 42,000",
    initialPrice: "$us 45,000",
    date: "Hoy, 10:15 AM",
    message: "Buen día Arq. Gonzalo, tengo el capital disponible en dólares efectivo para firma notarial inmediata este fin de semana.",
    status: "Pendiente",
    type: "Anticrético"
  },
  {
    id: "OFR-2",
    propertyTitle: "Penthouse Exclusivo con Vista al Illimani",
    buyerName: "Lic. Andrea Tapia",
    buyerPhone: "+591 71203948",
    offerAmount: "$us 70,000",
    initialPrice: "$us 75,000",
    date: "Ayer",
    message: "Estimado, solicito coordinar visita presencial con su asesor Carlos Vega y propongo $us 70,000 por 2 años.",
    status: "Pendiente",
    type: "Anticrético"
  },
  {
    id: "OFR-3",
    propertyTitle: "Monoambiente para Estudiantes o Ejecutivos",
    buyerName: "Ing. Rodrigo Morales",
    buyerPhone: "+591 76543219",
    offerAmount: "$us 400/mes",
    initialPrice: "$us 420/mes",
    date: "22 Ago",
    message: "Propongo contrato de 1 año con garantía de 2 meses.",
    status: "Aceptada",
    type: "Alquiler"
  }
];

const INITIAL_SELLER_APPOINTMENTS: SellerAppointment[] = [
  {
    id: "APT-S1",
    propertyTitle: "Depto Sopocachi con Terraza",
    clientName: "Dr. Marcelo Zeballos",
    clientPhone: "+591 77201928",
    advisorName: "Carlos Vega",
    date: "Hoy",
    time: "16:00",
    status: "Confirmada"
  },
  {
    id: "APT-S2",
    propertyTitle: "Penthouse Calacoto Vista Illimani",
    clientName: "Lic. Andrea Tapia",
    clientPhone: "+591 71203948",
    advisorName: "Carlos Vega",
    date: "Mañana",
    time: "11:30",
    status: "Confirmada"
  }
];

export default function SellerPortalPage() {
  const [activeTab, setActiveTab] = useState<SellerTab>('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Estados de datos del vendedor
  const [properties, setProperties] = useState<SellerProperty[]>(INITIAL_SELLER_PROPERTIES);
  const [offers, setOffers] = useState<SellerOffer[]>(INITIAL_SELLER_OFFERS);
  const [appointments, setAppointments] = useState<SellerAppointment[]>(INITIAL_SELLER_APPOINTMENTS);

  // Modal de Publicación Rápida
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishForm, setPublishForm] = useState({
    title: '',
    zone: 'Sopocachi, La Paz',
    type: 'Anticrético' as SellerProperty['type'],
    price: '$us 48,000',
    folioReal: '2.01.0.99.00' + Math.floor(1000 + Math.random() * 9000),
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Manejo de Inmuebles
  const handleTogglePause = (id: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Activo' ? 'Pausado' : 'Activo';
        showToast(`Inmueble cambiado a estado: ${nextStatus}`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const handleUpdateProperty = (updated: SellerProperty) => {
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast(`Inmueble ${updated.title} actualizado.`);
  };

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const newProp: SellerProperty = {
      id: `PROP-${Math.floor(110 + Math.random() * 880)}`,
      title: publishForm.title,
      zone: publishForm.zone,
      type: publishForm.type,
      price: publishForm.price,
      views: 1,
      inquiries: 0,
      status: 'En Validación Legal',
      folioReal: publishForm.folioReal,
      assignedAdvisor: 'Carlos Vega',
      image: publishForm.image,
      datePublished: 'Publicado hoy'
    };
    setProperties(prev => [newProp, ...prev]);
    setIsPublishModalOpen(false);
    showToast(`Inmueble registrado. Nuestro equipo legal auditará el Folio Real en menos de 2 horas.`);
    setActiveTab('inmuebles');
  };

  // Manejo de Ofertas
  const handleAcceptOffer = (id: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: 'Aceptada' } : o));
    showToast(`Oferta aceptada. El asesor Carlos Vega coordinará la minuta notarial.`);
  };

  const handleRejectOffer = (id: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: 'Rechazada' } : o));
    showToast(`Oferta rechazada.`);
  };

  const handleCounterOfferSubmit = (id: string, counterPrice: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: 'Contraofertada', offerAmount: counterPrice } : o));
    showToast(`Contraoferta enviada al comprador por ${counterPrice}.`);
  };

  return (
    <div className="flex min-h-screen">
      
      {/* TOAST FLOTANTE */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-dark text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-emerald-400 font-black">🏠 InmoVax Propietario:</span>
          <span className="text-xs sm:text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* SIDEBAR VENDEDOR */}
      <SellerSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'publicar') {
            setIsPublishModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        myPropertiesCount={properties.length}
        offersCount={offers.filter(o => o.status === 'Pendiente').length}
        appointmentsCount={appointments.length}
      />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER VENDEDOR */}
        <SellerHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onPublishClick={() => setIsPublishModalOpen(true)}
          pendingOffersCount={offers.filter(o => o.status === 'Pendiente').length}
        />

        {/* PESTAÑAS ACTIVAS */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {activeTab === 'resumen' && (
              <SellerOverviewSection
                properties={properties}
                offers={offers}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'inmuebles' && (
              <SellerPropertiesSection
                properties={properties}
                onTogglePause={handleTogglePause}
                onOpenPublishModal={() => setIsPublishModalOpen(true)}
                onUpdateProperty={handleUpdateProperty}
              />
            )}

            {activeTab === 'ofertas' && (
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

          </div>
        </main>

      </div>

      {/* MODAL CON FORMULARIO COMPLETO RECICLADO DEL COMPAÑERO */}
      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="Publicar Nuevo Inmueble (Asistente Oficial InmoVax)"
        subtitle="Completa los 4 pasos para registrar tu inmueble con geolocalización y Folio Real"
        maxWidth="3xl"
      >
        <div className="pt-2">
          <PublishPropertyForm
            isLoggedInSeller={true}
            onSuccessCallback={(data) => {
              const newProp: SellerProperty = {
                id: `PROP-${Math.floor(110 + Math.random() * 880)}`,
                title: `${data.tipoInmueble.toUpperCase()} en ${data.zona}`,
                zone: data.zona,
                type: (data.operacion.charAt(0).toUpperCase() + data.operacion.slice(1)) as SellerProperty['type'],
                price: `${data.moneda === 'usd' ? '$us' : 'Bs.'} ${data.precio}`,
                views: 1,
                inquiries: 0,
                status: 'En Validación Legal',
                folioReal: data.folioReal || '2.01.0.99.00' + Math.floor(1000 + Math.random() * 9000),
                assignedAdvisor: 'Carlos Vega',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
                datePublished: 'Publicado hoy'
              };
              setProperties(prev => [newProp, ...prev]);
              setIsPublishModalOpen(false);
              showToast(`¡Inmueble registrado exitosamente con Folio Real!`);
              setActiveTab('inmuebles');
            }}
          />
        </div>
      </Modal>

    </div>
  );
}

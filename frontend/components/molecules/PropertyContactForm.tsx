"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle2, Loader2, Sparkles, Send, User } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { FormField } from './FormField';
import { InternalChatModal } from './InternalChatModal';
import {
  readStoredSession,
  sendP2PMessage,
  ConsultationItem,
  getStoredConsultations,
  writeStoredList,
  CONSULTATIONS_KEY
} from '@/lib/frontendStore';
import { incrementPropertyInquiries, getAllManagedProperties } from '@/lib/propertiesStore';

export interface PropertyContactFormProps {
  property: {
    id: string;
    titulo: string;
    precio: string;
    ubicacion: string;
    imagenUrl?: string;
    autorEmail?: string;
    autorNombre?: string;
    asesor?: string;
  };
}

const QUICK_PROMPTS = [
  "¿El precio es negociable?",
  "¿Está disponible para visitarlo este fin de semana?",
  "¿Acepta financiamiento bancario?",
  "¿Los papeles e impuestos están al día?"
];

export const PropertyContactForm = ({ property }: PropertyContactFormProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeChatConsultation, setActiveChatConsultation] = useState<ConsultationItem | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  let resolvedSellerEmail = property.autorEmail || '';
  let resolvedSellerName = property.autorNombre || property.asesor || '';
  if (!resolvedSellerEmail && typeof window !== 'undefined') {
    const foundProp = getAllManagedProperties().find((p) => p.id === property.id);
    if (foundProp?.authorEmail) {
      resolvedSellerEmail = foundProp.authorEmail;
      resolvedSellerName = foundProp.authorName || resolvedSellerName;
    }
  }
  const sellerName = resolvedSellerName || 'Propietario del Inmueble';
  const sellerEmail = resolvedSellerEmail || 'vendedor@inmovax.com';

  useEffect(() => {
    const session = readStoredSession();
    if (session) {
      if (session.name) setName(session.name);
      if (session.email) setEmail(session.email);
    }

    // Verificar si ya existe un chat previo con este vendedor sobre esta propiedad
    if (session?.email) {
      const existing = getStoredConsultations().find(
        (c) => c.propertyId === property.id && c.buyerEmail?.toLowerCase() === session.email.toLowerCase()
      );
      if (existing) {
        setActiveChatConsultation(existing);
      }
    }
  }, [property.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Por favor escribe tu consulta o selecciona una pregunta rápida.');
      return;
    }

    setIsSubmitting(true);

    try {
      const session = readStoredSession();
      const buyerEmail = session?.email || email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@usuario.com`;

      // 1. Guardar y emitir el mensaje P2P en el Store interno
      const consultation = sendP2PMessage({
        propertyId: property.id,
        propertyTitle: property.titulo,
        propertyLocation: property.ubicacion,
        propertyPrice: property.precio,
        propertyImage: property.imagenUrl || '',
        propertyHref: `/propiedad/${property.id}`,
        sellerEmail,
        sellerName,
        buyerEmail,
        buyerName: name.trim(),
        buyerPhone: phone.trim() || undefined,
        messageText: message.trim()
      });

      // Incrementar contador de consultas del inmueble
      incrementPropertyInquiries(property.id);

      let finalConsultation: ConsultationItem = consultation;

      // 2. Sincronizar con el backend en Supabase PostgreSQL
      try {
        const apiBase = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
          ? process.env.NEXT_PUBLIC_API_URL
          : 'http://localhost:4000/api';

        const res = await fetch(`${apiBase}/consultations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: consultation.id,
            propertyId: property.id,
            propertyTitle: property.titulo,
            propertyLocation: property.ubicacion,
            propertyPrice: property.precio,
            propertyImage: property.imagenUrl || '',
            propertyHref: `/propiedad/${property.id}`,
            sellerEmail,
            sellerName,
            buyerEmail,
            buyerName: name.trim(),
            buyerPhone: phone.trim() || undefined,
            messageText: message.trim()
          })
        });

        if (res.ok) {
          const cloudData = await res.json();
          if (cloudData && cloudData.consultation) {
            finalConsultation = cloudData.consultation;
            const stored = getStoredConsultations();
            const filtered = stored.filter((c) => c.id !== consultation.id && c.id !== finalConsultation.id);
            writeStoredList(CONSULTATIONS_KEY, [finalConsultation, ...filtered], false);
          }
        }
      } catch {
        // En caso de modo offline local, se conserva la copia reactiva
      }

      setActiveChatConsultation(finalConsultation);
      setIsSuccess(true);
      setMessage('');
    } catch {
      setErrorMsg('Ocurrió un error al enviar el mensaje. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-content-main text-base sm:text-lg">
              Contactar al Propietario
            </h4>
            <p className="text-xs text-content-muted mt-0.5">
              Anunciante: <strong className="text-surface-dark">{sellerName}</strong>
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
            {sellerName.slice(0, 1)}
          </div>
        </div>

        {/* Si ya hay un chat previo abierto, ofrecer continuar conversación */}
        {activeChatConsultation && !isSuccess && (
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs font-bold block text-blue-900">Conversación activa</span>
              <p className="text-[11px] text-blue-700 truncate">
                Tienes mensajes con {sellerName} para este inmueble.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsChatOpen(true)}
              className="border-primary text-primary hover:bg-primary/10 shrink-0 text-xs font-bold py-1.5 px-3"
            >
              Abrir Chat
            </Button>
          </div>
        )}

        {isSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>¡Mensaje enviado al vendedor!</span>
            </div>
            <p className="text-xs text-emerald-800/90 leading-relaxed">
              Tu consulta fue entregada a <strong>{sellerName}</strong> dentro de InmoVAX. Podrás ver sus respuestas en tiempo real.
            </p>
            
            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={() => setIsChatOpen(true)}
                className="flex items-center justify-center gap-2 shadow-sm text-xs font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir Chat con el Propietario</span>
              </Button>

              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="text-xs font-bold text-emerald-700 hover:underline pt-1 text-center"
              >
                Escribir otro mensaje
              </button>
            </div>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Preguntas rápidas en 1 clic */}
            <div>
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-content-muted mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Preguntas Rápidas Frecuentes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessage(prompt)}
                    className="text-[11px] font-medium bg-gray-100 hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 transition-all cursor-pointer text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <FormField label="Tu Nombre">
              <Input
                type="text"
                placeholder="Nombre y Apellido"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Teléfono de Contacto (Opcional)">
              <Input
                type="tel"
                placeholder="Número de celular"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormField>

            <FormField label="Tu Mensaje para el Propietario">
              <Textarea
                className="h-24 text-xs sm:text-sm"
                placeholder={`Hola ${sellerName}, estoy interesado en este inmueble y quisiera consultarle...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl shadow-sm text-xs sm:text-sm font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enviando al vendedor...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Enviar Mensaje Interno</span>
                </>
              )}
            </Button>
          </>
        )}
      </form>

      {/* MODAL DE CHAT INTERNO EN TIEMPO REAL */}
      <InternalChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        consultation={activeChatConsultation}
        currentUserRole="comprador"
        onConsultationUpdated={(updated) => setActiveChatConsultation(updated)}
      />
    </>
  );
};

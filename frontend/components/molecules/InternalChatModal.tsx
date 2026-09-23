"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Send, CheckCheck, Building2, MapPin, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import {
  ConsultationItem,
  ChatMessage,
  replyP2PMessage,
  readStoredSession
} from '@/lib/frontendStore';

interface InternalChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: ConsultationItem | null;
  currentUserRole?: 'comprador' | 'vendedor';
  onConsultationUpdated?: (updated: ConsultationItem) => void;
}

const QUICK_QUESTIONS = [
  "¿El precio es negociable?",
  "¿Podemos coordinar una visita este fin de semana?",
  "¿Tiene los papeles e impuestos al día?",
  "¿Acepta financiamiento bancario?"
];

export const InternalChatModal = ({
  isOpen,
  onClose,
  consultation,
  currentUserRole,
  onConsultationUpdated
}: InternalChatModalProps) => {
  const [inputText, setInputText] = useState('');
  const [activeConsultation, setActiveConsultation] = useState<ConsultationItem | null>(consultation);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveConsultation(consultation);
  }, [consultation]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, activeConsultation?.messages?.length]);

  // Sincronización en vivo cada 3s mientras el modal de chat está abierto
  useEffect(() => {
    if (!isOpen || !activeConsultation?.id) return;

    const fetchLatest = async () => {
      try {
        const apiBase = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
          ? process.env.NEXT_PUBLIC_API_URL
          : 'http://localhost:4000/api';
        const res = await fetch(`${apiBase}/consultations/${encodeURIComponent(activeConsultation.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data?.consultation) {
            const serverMsgs = data.consultation.messages || [];
            const currentMsgs = activeConsultation.messages || [];
            const hasNewMsg = serverMsgs.length !== currentMsgs.length ||
              (serverMsgs.length > 0 && currentMsgs.length > 0 && serverMsgs[serverMsgs.length - 1].id !== currentMsgs[currentMsgs.length - 1].id);
            if (hasNewMsg || data.consultation.status !== activeConsultation.status) {
              setActiveConsultation(data.consultation);
              if (onConsultationUpdated) onConsultationUpdated(data.consultation);
            }
          }
        }
      } catch {
        // Ignorar errores de red temporales
      }
    };

    const interval = setInterval(fetchLatest, 3000);
    return () => clearInterval(interval);
  }, [isOpen, activeConsultation?.id, onConsultationUpdated]);

  if (!isOpen || !activeConsultation) return null;

  const session = readStoredSession();
  const currentEmail = session?.email || (currentUserRole === 'vendedor' ? activeConsultation.sellerEmail : activeConsultation.buyerEmail);
  const isCurrentUserSeller = currentUserRole === 'vendedor' || (session?.email && activeConsultation.sellerEmail && session.email.toLowerCase() === activeConsultation.sellerEmail.toLowerCase());

  const otherPersonName = isCurrentUserSeller
    ? (activeConsultation.buyerName || 'Comprador Interesado')
    : (activeConsultation.sellerName || activeConsultation.advisorName || 'Propietario del Inmueble');

  const otherPersonRoleLabel = isCurrentUserSeller ? 'Comprador' : 'Vendedor / Propietario';

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend || !activeConsultation) return;

    const senderRole: 'vendedor' | 'comprador' = isCurrentUserSeller ? 'vendedor' : 'comprador';
    const senderName = isCurrentUserSeller
      ? (session?.name || activeConsultation.sellerName || 'Vendedor')
      : (session?.name || activeConsultation.buyerName || 'Comprador');
    const senderEmail = isCurrentUserSeller
      ? (session?.email || activeConsultation.sellerEmail || 'vendedor@inmovax.com')
      : (session?.email || activeConsultation.buyerEmail || 'comprador@inmovax.com');

    // 1. Limpieza inmediata del input para fluidez visual
    setInputText('');

    // 2. Actualización optimista instantánea en pantalla
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const optimisticMsg: ChatMessage = {
      id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      senderEmail,
      senderName,
      senderRole,
      text: textToSend,
      timestamp: timeNow
    };

    const optimisticConsultation: ConsultationItem = {
      ...activeConsultation,
      lastMessage: textToSend,
      status: senderRole === 'vendedor' ? 'respondido' : 'pendiente',
      messages: [...(activeConsultation.messages || []), optimisticMsg]
    };
    setActiveConsultation(optimisticConsultation);
    if (onConsultationUpdated) onConsultationUpdated(optimisticConsultation);

    // 3. Persistir directamente en Supabase PostgreSQL a través del backend
    try {
      const apiBase = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:4000/api';

      const res = await fetch(`${apiBase}/consultations/${encodeURIComponent(activeConsultation.id)}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderEmail,
          senderName,
          senderRole,
          replyText: textToSend
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.consultation) {
          setActiveConsultation(data.consultation);
          if (onConsultationUpdated) onConsultationUpdated(data.consultation);
        }
      }
    } catch (err) {
      console.error('Error enviando mensaje a Supabase:', err);
    }

    // 4. Mantener sincronizado el almacenamiento reactivo local
    replyP2PMessage(
      activeConsultation.id,
      textToSend,
      senderRole,
      senderName,
      senderEmail
    );
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  // Extraer mensajes de la conversación o mensaje inicial
  const messagesList: ChatMessage[] = (activeConsultation.messages && activeConsultation.messages.length > 0)
    ? activeConsultation.messages
    : [
        {
          id: `init-${activeConsultation.id}`,
          senderEmail: activeConsultation.buyerEmail || 'comprador@inmovax.com',
          senderName: activeConsultation.buyerName || 'Comprador',
          senderRole: 'comprador',
          text: activeConsultation.lastMessage || 'Hola, me interesa este inmueble y deseo más información.',
          timestamp: activeConsultation.date || 'Reciente'
        }
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] border border-gray-100">
        
        {/* 1. CABECERA: Contexto del Inmueble y Persona */}
        <div className="bg-gradient-to-r from-surface-dark to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            {activeConsultation.propertyImage ? (
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden shrink-0 border border-white/20">
                <Image
                  src={activeConsultation.propertyImage}
                  alt={activeConsultation.propertyTitle}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-primary-light" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-white text-sm sm:text-base truncate">
                  {activeConsultation.propertyTitle}
                </h4>
                {activeConsultation.propertyHref && (
                  <Link
                    href={activeConsultation.propertyHref}
                    target="_blank"
                    className="text-white/60 hover:text-white transition-colors"
                    title="Ver ficha del inmueble"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
              <p className="text-xs text-emerald-400 font-black">
                {activeConsultation.propertyPrice} • <span className="text-white/70 font-normal">{activeConsultation.propertyLocation}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-white/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Chat directo con <strong>{otherPersonName}</strong> ({otherPersonRoleLabel})</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Cerrar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. CUERPO: Burbujas de Chat estilo Telegram / WhatsApp */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-slate-50/70">
          <div className="text-center my-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-content-muted bg-white px-3 py-1 rounded-full shadow-2xs border border-gray-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Conversación P2P protegida dentro de InmoVAX
            </span>
          </div>

          {messagesList.map((msg, idx) => {
            const isMe = isCurrentUserSeller
              ? msg.senderRole === 'vendedor'
              : msg.senderRole === 'comprador';

            return (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%] ${isMe ? 'ml-auto' : 'mr-auto'}`}
              >
                <span className="text-[10px] font-bold text-content-muted px-1 mb-1">
                  {isMe ? 'Tú' : msg.senderName} • {msg.timestamp}
                </span>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-primary text-white rounded-br-xs'
                      : 'bg-white text-surface-dark rounded-bl-xs border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. PREGUNTAS RÁPIDAS (Solo para Comprador) */}
        {!isCurrentUserSeller && (
          <div className="px-4 py-2 bg-white border-t border-gray-100 overflow-x-auto flex gap-2 shrink-0 scrollbar-none">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickQuestion(q)}
                className="text-[11px] font-semibold whitespace-nowrap bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-gray-200"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* 4. FOOTER: Input y Botón de Enviar */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Escribe un mensaje para ${otherPersonName}...`}
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            autoFocus
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!inputText.trim()}
            className="px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </Button>
        </form>

      </div>
    </div>
  );
};

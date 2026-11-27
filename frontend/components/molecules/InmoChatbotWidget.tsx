"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, X, Send, Bot, RotateCcw, 
  Building2, MapPin, ExternalLink, PhoneCall,
  Home, Check, Copy, ShieldCheck, Maximize2, Minimize2,
  FileText, Megaphone, Compass, BookOpen, BedDouble, Ruler, ArrowLeft
} from 'lucide-react';
import { readStoredSession } from '@/lib/frontendStore';

export interface PropertyCardItem {
  id: string;
  title: string;
  zone: string;
  price: string;
  bedrooms?: number;
  areaSqm?: number;
  imageUrl?: string;
  href: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedProperties?: PropertyCardItem[];
  timestamp: string;
}

type WidgetTab = 'chat' | 'properties' | 'guide';

const STORAGE_KEY = 'inmovax_chatbot_history_v2';

const QUICK_CATEGORIES = [
  { icon: Building2, label: "Sopocachi", query: "Busco departamentos en Sopocachi en venta o anticretico" },
  { icon: Home, label: "Zona Sur", query: "Busco casas o departamentos en zona Sur Calacoto o Achumani" },
  { icon: FileText, label: "Anticreticos", query: "Como funciona un contrato de anticretico en Bolivia y que garantias legales tiene?" },
  { icon: ShieldCheck, label: "Folio Real", query: "Como me aseguro que un inmueble no tenga gravamenes o hipotecas en Bolivia?" },
  { icon: Megaphone, label: "Publicar", query: "Que planes y requisitos tienen para publicar un inmueble con QR en InmoVAX?" }
];

const LEGAL_GUIDES = [
  {
    title: "¿Que es un contrato de anticretico en Bolivia?",
    desc: "Es un acuerdo legal bilateral donde el anticresista entrega un capital al propietario sin intereses, recibiendo el uso exclusivo de la vivienda. Al vencer el plazo pactado, el propietario debe restituir el 100% del capital íntegro."
  },
  {
    title: "Requisitos de seguridad y Folio Real",
    desc: "Para que un anticretico o compraventa tenga validez y prioridad juridica, debe protocolizarse ante Notario de Fe Publica e inscribirse formalmente en el Registro de Derechos Reales sobre el Folio Real del inmueble."
  },
  {
    title: "Verificacion de gravamenes e hipotecas",
    desc: "En InmoVAX exigimos la verificacion de informacion rapida de Derechos Reales actualizada para garantizar que la propiedad este libre de embargos judiciales o anotaciones preventivas."
  },
  {
    title: "Planes de publicacion con codigo QR",
    desc: "InmoVAX cuenta con planes que incluyen cartel exterior con codigo QR para que los transeuntes puedan escanear la publicacion y contactarte directamente sin comisiones abusivas."
  }
];

export const InmoChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<WidgetTab>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [catalogProperties, setCatalogProperties] = useState<PropertyCardItem[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [botName, setBotName] = useState('InmoBot');
  const [activeModel, setActiveModel] = useState('Gemini 3 Flash');
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar historial y configuración al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = process.env.NEXT_PUBLIC_BOT_NAME || 'InmoBot';
      setBotName(name);

      try {
        const saved = window.sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            // Extraer inmuebles acumulados en la conversacion
            const props: PropertyCardItem[] = [];
            parsed.forEach((m: ChatMessage) => {
              if (m.suggestedProperties && m.suggestedProperties.length > 0) {
                m.suggestedProperties.forEach(p => {
                  if (!props.some(item => item.id === p.id)) props.push(p);
                });
              }
            });
            if (props.length > 0) setCatalogProperties(props);
            return;
          }
        }
      } catch {}

      // Mensaje de bienvenida inicial sin emojis
      const session = readStoredSession();
      const userName = session?.name ? ` ${session.name}` : '';
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: `Estimado usuario${userName}, le doy la bienvenida a InmoVAX.\n\nSoy **${name}**, su asistente inmobiliario automatizado.\n\nPuedo orientarle en la **busqueda de inmuebles** en venta, anticretico o alquiler en La Paz y otras ciudades de Bolivia, explicarle los **aspectos legales del anticretico** o guiarle para **publicar su propiedad**.\n\n¿En que podemos asistirle hoy?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  // Guardar en sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  // Scroll automatico al recibir mensajes
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading, activeTab]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    // Cambiar automaticamente a la pestana de chat
    setActiveTab('chat');

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: timeNow
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const session = readStoredSession();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          session: session ? { name: session.name, email: session.email, role: session.role } : null
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.model) {
          const prettyModel = data.model
            .replace('gemini-', 'Gemini ')
            .replace('-preview', '')
            .replace('-latest', ' (Latest)')
            .replace('fallback-inmovax', 'Motor InmoVAX');
          setActiveModel(prettyModel);
        }

        const suggested = data.suggestedProperties || [];
        if (suggested.length > 0) {
          setCatalogProperties(prev => {
            const next = [...prev];
            suggested.forEach((p: PropertyCardItem) => {
              if (!next.some(item => item.id === p.id)) next.unshift(p);
            });
            return next;
          });
        }

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.message || 'Estamos a su disposicion. ¿Desea realizar alguna otra consulta?',
          suggestedProperties: suggested,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('Error en el servidor');
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `Disculpe, se produjo una breve pausa en la conexion. Puede reiterar su consulta o bien contactar a nuestro equipo de atencion a traves de WhatsApp.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
    const session = readStoredSession();
    const userName = session?.name ? ` ${session.name}` : '';
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Conversacion reiniciada para usted${userName}. Indiquenos que zona, presupuesto o consulta inmobiliaria desea tratar.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lIdx} className={`${line.trim() === '' ? 'h-2' : 'min-h-[1.25rem]'} leading-relaxed`}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* BOTON FLOTANTE DISCRETO Y PROFESIONAL */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <div className="relative flex flex-col items-end">
            
            {/* Globo orientativo en pantallas de escritorio */}
            {showTooltip && (
              <div className="hidden sm:block relative mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div 
                  onClick={() => setIsOpen(true)}
                  className="flex items-center gap-3 px-4 py-2.5 bg-white text-gray-800 text-xs font-semibold rounded-2xl shadow-xl border border-gray-100 hover:border-primary/40 cursor-pointer transition-all"
                >
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-gray-900">¿Consultas sobre inmuebles?</p>
                    <p className="text-[10px] text-gray-500 font-normal">Hable con nuestro asesor virtual</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTooltip(false);
                    }}
                    className="text-gray-300 hover:text-gray-500 p-1 rounded-full ml-1"
                    title="Cerrar aviso"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute right-7 -bottom-1.5 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45"></div>
              </div>
            )}

            {/* Boton circular de apertura */}
            <button
              onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
              }}
              aria-label="Abrir asesor inmobiliario InmoBot"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-primary hover:bg-primary-hover text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center relative cursor-pointer"
            >
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
            </button>
          </div>
        )}

        {/* VENTANA MULTIPANTALLA DEL CHATBOT */}
        {isOpen && (
          <div 
            className={`
              fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50
              bg-white sm:rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden
              transition-all duration-300 animate-in fade-in
              ${isExpanded 
                ? 'sm:w-[860px] sm:h-[780px] sm:max-w-[95vw] sm:max-h-[92vh]' 
                : 'sm:w-[440px] sm:h-[620px] sm:max-w-[95vw] sm:max-h-[88vh]'
              }
              w-full h-[100dvh] sm:h-auto
            `}
          >
            
            {/* CABECERA MULTIPANTALLA */}
            <div className="bg-surface-dark text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-gray-800 shrink-0">
              <div className="flex items-center gap-3">
                {/* Boton volver en movil */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden p-1.5 text-gray-300 hover:text-white rounded-xl"
                  title="Volver"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40 text-primary">
                    <Bot className="w-5 h-5 text-blue-300" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-surface-dark rounded-full"></span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">{botName}</h3>
                    <span className="text-[10px] bg-gray-800 text-blue-200 px-2 py-0.5 rounded-md font-semibold border border-gray-700">
                      {activeModel}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Asesor Inmobiliario En Linea
                  </p>
                </div>
              </div>

              {/* Botones de control de ventana */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Reiniciar conversacion"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Boton para expandir a pantalla amplia (desktop/tablet) */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Reducir a vista compacta" : "Expandir a pantalla amplia"}
                  className="hidden sm:flex p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  title="Cerrar ventana"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* BARRA DE NAVEGACION DE PANTALLAS / VISTAS */}
            <div className="bg-gray-100/80 p-1.5 flex gap-1 border-b border-gray-200/80 shrink-0 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Conversacion</span>
              </button>

              <button
                onClick={() => setActiveTab('properties')}
                className={`flex-1 py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'properties'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Inmuebles</span>
                {catalogProperties.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold">
                    {catalogProperties.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`flex-1 py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Guia y Tramites</span>
              </button>
            </div>

            {/* CONTENIDO SEGUN LA PANTALLA ACTIVA */}
            <div className="flex-1 overflow-hidden flex flex-col">
              
              {/* PANTALLA 1: CONVERSACION CON GEMINI */}
              {activeTab === 'chat' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/60">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {m.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-xl bg-surface-dark text-blue-300 flex items-center justify-center shrink-0 mt-1 shadow-xs border border-gray-700">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs relative group ${
                          m.role === 'user'
                            ? 'bg-primary text-white rounded-br-xs'
                            : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-xs'
                        }`}
                      >
                        {renderFormattedText(m.content)}

                        {/* TARJETAS DE INMUEBLES DENTRO DEL MENSAJE */}
                        {m.suggestedProperties && m.suggestedProperties.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              Propiedades disponibles:
                            </span>

                            <div className={`grid gap-2 ${isExpanded ? 'grid-cols-2' : 'grid-cols-1'}`}>
                              {m.suggestedProperties.map((prop) => (
                                <Link
                                  key={prop.id}
                                  href={prop.href}
                                  className="flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-blue-50/80 rounded-xl border border-gray-200 hover:border-primary/40 transition-all group/card block"
                                >
                                  <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 relative">
                                    {prop.imageUrl ? (
                                      <img 
                                        src={prop.imageUrl} 
                                        alt={prop.title} 
                                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform" 
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Building2 className="w-5 h-5" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[11px] text-gray-900 truncate group-hover/card:text-primary">
                                      {prop.title}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                      {prop.zone}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-[11px] font-extrabold text-primary">
                                        {prop.price}
                                      </span>
                                      {prop.bedrooms ? (
                                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                          <BedDouble className="w-3 h-3 text-gray-400" />
                                          {prop.bedrooms} dorm.
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover/card:text-primary shrink-0 mr-1" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Pie de mensaje y copiar */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 text-[9px]">
                          <span className={m.role === 'user' ? 'text-blue-100' : 'text-gray-400'}>
                            {m.timestamp}
                          </span>
                          {m.role === 'assistant' && (
                            <button
                              onClick={() => copyToClipboard(m.content, m.id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 flex items-center gap-1 cursor-pointer"
                              title="Copiar texto"
                            >
                              {copiedId === m.id ? (
                                <span className="text-emerald-600 flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" /> Copiado
                                </span>
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Indicador de carga sin emojis */}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-gray-500 text-xs py-1">
                      <div className="w-7 h-7 rounded-xl bg-surface-dark text-blue-300 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white px-3.5 py-2.5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-2 text-[11px]">
                        <span className="text-gray-600">Consultando datos de InmoVAX...</span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* PANTALLA 2: CATALOGO DE INMUEBLES ENCONTRADOS */}
              {activeTab === 'properties' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/60">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">Catalogo de Inmuebles</h4>
                      <p className="text-[11px] text-gray-500">Propiedades consultadas o recomendadas</p>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-primary font-bold px-2 py-0.5 rounded-full">
                      {catalogProperties.length} disponibles
                    </span>
                  </div>

                  {catalogProperties.length === 0 ? (
                    <div className="text-center py-12 px-4 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">Aun no ha consultado inmuebles</p>
                      <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                        Escriba en la conversacion por ejemplo: &quot;Busco departamento en Sopocachi&quot; para cargar opciones aqui.
                      </p>
                      <button
                        onClick={() => handleSend("Busco departamentos disponibles en Sopocachi")}
                        className="text-xs bg-primary text-white font-semibold px-4 py-2 rounded-xl hover:bg-primary-hover transition-colors cursor-pointer"
                      >
                        Ver departamentos en Sopocachi
                      </button>
                    </div>
                  ) : (
                    <div className={`grid gap-3 ${isExpanded ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {catalogProperties.map((prop) => (
                        <div
                          key={prop.id}
                          className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between"
                        >
                          <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                              {prop.imageUrl ? (
                                <img src={prop.imageUrl} alt={prop.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Building2 className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-xs text-gray-900 truncate">{prop.title}</h5>
                              <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                {prop.zone}
                              </p>
                              <p className="text-xs font-extrabold text-primary mt-1">{prop.price}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 text-[10px]">
                            <span className="text-gray-500 flex items-center gap-1">
                              {prop.bedrooms ? `${prop.bedrooms} dormitorios` : 'Inmueble verificado'}
                            </span>
                            <Link
                              href={prop.href}
                              className="text-primary hover:text-primary-hover font-bold flex items-center gap-1"
                            >
                              <span>Ver ficha</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PANTALLA 3: GUIA LEGAL Y TRAMITES */}
              {activeTab === 'guide' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/60">
                  <div className="pb-2 border-b border-gray-200">
                    <h4 className="font-bold text-xs text-gray-900">Guia Inmobiliaria y Legal de Bolivia</h4>
                    <p className="text-[11px] text-gray-500">Respuestas a los tramites mas frecuentes en InmoVAX</p>
                  </div>

                  <div className="space-y-2.5">
                    {LEGAL_GUIDES.map((g, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                          <h5 className="font-bold text-xs text-gray-900">{g.title}</h5>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed pl-6">{g.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 text-center space-y-2 mt-2">
                    <p className="text-[11px] text-gray-700 font-medium">
                      ¿Necesita atencion personalizada con un asesor notarial o comercial?
                    </p>
                    <a
                      href="https://wa.me/59170011223?text=Hola,%20deseo%20asesoria%20legal%20sobre%20un%20inmueble%20en%20InmoVAX"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      Contactar por WhatsApp
                    </a>
                  </div>
                </div>
              )}

            </div>

            {/* BARRA DE PREGUNTAS RAPIDAS CON ICONOS (SIN EMOJIS) */}
            <div className="px-3.5 py-2 bg-white border-t border-gray-100 overflow-x-auto flex gap-2 shrink-0 scrollbar-none">
              {QUICK_CATEGORIES.map((cat, idx) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(cat.query)}
                    disabled={isLoading}
                    className="shrink-0 text-[11px] bg-gray-100 hover:bg-blue-50 hover:text-primary text-gray-700 px-3 py-1.5 rounded-xl transition-all duration-150 font-semibold border border-gray-200 hover:border-primary/40 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-primary" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* CAJA DE TEXTO INFERIOR */}
            <div className="p-3 bg-white border-t border-gray-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escriba su consulta o inmueble de interes..."
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Enviar consulta"
                  className="w-10 h-10 bg-primary hover:bg-primary-hover active:scale-95 text-white rounded-xl shadow-xs transition-all disabled:opacity-40 disabled:hover:bg-primary cursor-pointer shrink-0 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* PIE CON CONEXION A ASESOR */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 px-1">
                <span className="flex items-center gap-1 text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  InmoVAX Bolivia
                </span>
                <a
                  href="https://wa.me/59170011223?text=Hola,%20quisiera%20conversar%20con%20un%20asesor%20de%20InmoVAX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[10px]"
                >
                  <PhoneCall className="w-3 h-3" />
                  Atencion WhatsApp
                </a>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
};

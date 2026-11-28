"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Maximize2, Minimize2, ChevronLeft, ChevronRight, Play, Pause, 
  RotateCcw, Sparkles, ShieldCheck, DollarSign, TrendingUp, 
  AlertTriangle, CheckCircle2, ArrowRight, Clock, MessageSquare, 
  Bot, Users, Building2, Home, Scale, Search, FileText, Check,
  BookOpen, Layers, Zap, ExternalLink
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  durationRecommended: string;
  speakerNotes: string[];
}

const SLIDES_META: Slide[] = [
  {
    id: 1,
    badge: "Visión & Propuesta de Valor",
    title: "InmoVAX: La plataforma tecnológica inmobiliaria sin comisiones en Bolivia",
    subtitle: "Conectamos compradores y propietarios directamente mediante Inteligencia Artificial y blindaje legal notarial en Derechos Reales.",
    durationRecommended: "0:00 - 1:00 (1 min)",
    speakerNotes: [
      "Inicia con energía: 'Buenas tardes a todos. Hoy les presento InmoVAX.'",
      "Plantea la premisa principal: No somos una inmobiliaria tradicional; somos la plataforma tecnológica que erradica las comisiones abusivas en Bolivia.",
      "Destaca los dos pilares: Inteligencia Artificial en lenguaje natural + Seguridad jurídica real."
    ]
  },
  {
    id: 2,
    badge: "El Problema del Mercado",
    title: "El desangrado de comisiones y la inseguridad en anticréticos",
    subtitle: "En Bolivia, vender o tomar un anticrético significa perder hasta el 7% en comisiones o arriesgar el patrimonio frente a estafas.",
    durationRecommended: "1:00 - 2:15 (1.15 min)",
    speakerNotes: [
      "Usa el deslizador interactivo de precios en vivo para asombrar al jurado.",
      "Muestra cómo en una casa de $150,000, una familia pierde hasta $10,500 en comisiones que no agregan valor.",
      "Explica el dolor del anticrético boliviano: contratos privados sin verificación en Derechos Reales que terminan en estafas o juicios de años."
    ]
  },
  {
    id: 3,
    badge: "La Solución InmoVAX",
    title: "Desintermediación directa P2P y blindaje notarial",
    subtitle: "Reemplazamos al intermediario abusivo con software moderno, conexión directa y verificación de Folio Real digital.",
    durationRecommended: "2:15 - 3:30 (1.15 min)",
    speakerNotes: [
      "Compara la ruta rota tradicional vs la ruta transparente de InmoVAX.",
      "Enfatiza: Cero comisiones de intermediación (el propietario conserva el 100% de su patrimonio).",
      "Explica la verificación de Folio Real y Notario de Fe Pública para que el anticrético sea 100% seguro."
    ]
  },
  {
    id: 4,
    badge: "Innovación Tecnológica Clave",
    title: "Búsqueda Inteligente con IA en lenguaje natural",
    subtitle: "Nadie habla en filtros técnicos rígidos. En InmoVAX los usuarios buscan como hablan.",
    durationRecommended: "3:30 - 4:45 (1.15 min)",
    speakerNotes: [
      "Muestra la simulación de búsqueda en tiempo real.",
      "Explica cómo la IA desglosa automáticamente la zona, el presupuesto, el tipo de contrato y los dormitorios.",
      "Menciona que InmoBot (potenciado por Gemini Flash) asesora legalmente y filtra inmuebles 24/7 sin emojis y con lenguaje profesional."
    ]
  },
  {
    id: 5,
    badge: "Ecosistema de Plataforma",
    title: "Las 4 herramientas integradas de InmoVAX",
    subtitle: "Una solución completa que acompaña a las partes desde la búsqueda hasta el cierre legal.",
    durationRecommended: "4:45 - 5:30 (45 seg)",
    speakerNotes: [
      "Pasa rápidamente por los 4 pilares: Buscador IA, InmoBot Legal, Foro Comunitario de Bolivia y Formulario en 3 pasos.",
      "Menciona que el foro resuelve dudas reales sobre devolución de capital y trámites en Derechos Reales."
    ]
  },
  {
    id: 6,
    badge: "Modelo de Negocio",
    title: "¿Cómo genera ingresos InmoVAX? (Modelo Freemium)",
    subtitle: "Monetizamos en servicios de alto valor agregado sin quitarle un solo centavo de comisión a la venta.",
    durationRecommended: "5:30 - 6:15 (45 seg)",
    speakerNotes: [
      "Aclara el modelo de negocio: Publicar es 100% gratis para ganar masa crítica y volumen de propiedades.",
      "Monetizamos en: 1) Servicios Notariales y auditoría de Folio Real, 2) Planes de exposición destacada para urgencia de venta.",
      "Este modelo alinea nuestros incentivos con el usuario: ganamos cuando el cliente está seguro, no quitándole porcentaje."
    ]
  },
  {
    id: 7,
    badge: "Mercado & Oportunidad",
    title: "El mercado inmobiliario y el fenómeno del anticrético",
    subtitle: "Un mercado de más de $us 2,500 millones anuales en Bolivia que los gigantes extranjeros no entienden ni resuelven.",
    durationRecommended: "6:15 - 6:45 (30 seg)",
    speakerNotes: [
      "Menciona las tres principales plazas: La Paz, Santa Cruz y Cochabamba.",
      "Explica que plataformas como Facebook Marketplace están llenas de informalidad, y portales tradicionales cobran comisiones caras.",
      "InmoVAX es la única plataforma adaptada a la idiosincrasia boliviana del anticrético."
    ]
  },
  {
    id: 8,
    badge: "Cierre & Demostración",
    title: "El futuro inmobiliario de Bolivia comienza hoy",
    subtitle: "Tecnología, transparencia y cero comisiones para proteger el patrimonio de las familias bolivianas.",
    durationRecommended: "6:45 - 7:00 (15 seg)",
    speakerNotes: [
      "Frase de impacto: 'El patrimonio que una familia tardó 20 años en construir no debería perderse en comisiones de 5 minutos.'",
      "Invita al jurado/inversionistas a ver el demo en vivo con el botón de abajo y abre el espacio de preguntas."
    ]
  }
];

export default function PresentacionPitchPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  
  // Cronómetro del Pitch (Objetivo: 7 minutos = 420 segundos)
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Estados interactivos para Diapositiva 2 (Simulador de comisiones)
  const [propertyPrice, setPropertyPrice] = useState(120000);
  
  // Estados interactivos para Diapositiva 4 (Simulador de búsqueda IA)
  const [simQuery, setSimQuery] = useState("Departamento en Sopocachi en anticrético menos de $us 45,000");

  const totalSlides = SLIDES_META.length;
  const slideMeta = SLIDES_META[currentSlide - 1];

  // Control del cronómetro
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Atajos de teclado para exponer con fluidez
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide(prev => Math.min(totalSlides, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlide(prev => Math.max(1, prev - 1));
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'n') {
        setShowNotes(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cálculo de comisiones dinámicas
  const comisionBaja = propertyPrice * 0.03;
  const comisionAlta = propertyPrice * 0.07;
  const comisionPromedio = propertyPrice * 0.05;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between selection:bg-primary selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. BARRA SUPERIOR DE CONTROL Y CRONÓMETRO DE 7 MINUTOS */}
      <header className="w-full bg-gray-900/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 sticky top-0 z-50">
        
        {/* Marca y Slide actual */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center font-black text-white text-sm shadow-md shadow-primary/20">
              IV
            </div>
            <span className="font-black text-base tracking-tight text-white group-hover:text-primary transition-colors">
              Inmo<span className="text-primary">VAX</span> <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider ml-1">Pitch Deck</span>
            </span>
          </Link>
          <span className="hidden sm:inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
            Diapositiva {currentSlide} de {totalSlides}
          </span>
        </div>

        {/* Cronómetro en vivo de 7 Minutos */}
        <div className="flex items-center gap-3 bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono">
          <Clock className={`w-4 h-4 ${secondsElapsed > 420 ? 'text-red-400 animate-pulse' : secondsElapsed > 300 ? 'text-amber-400' : 'text-emerald-400'}`} />
          <span className={`font-black text-sm ${secondsElapsed > 420 ? 'text-red-400 font-bold' : secondsElapsed > 300 ? 'text-amber-300' : 'text-emerald-300'}`}>
            {formatTimer(secondsElapsed)}
          </span>
          <span className="text-white/40 text-[11px]">/ 07:00</span>
          
          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="hover:text-primary transition-colors cursor-pointer p-1"
            title={isTimerRunning ? 'Pausar cronómetro' : 'Iniciar cronómetro'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => { setSecondsElapsed(0); setIsTimerRunning(false); }}
            className="hover:text-primary transition-colors cursor-pointer p-1"
            title="Reiniciar cronómetro"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Controles de Vista */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showNotes 
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
            title="Ver guion del orador (Tecla N)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Guion del Orador</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all cursor-pointer"
            title="Pantalla completa (Tecla F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL DE LA DIAPOSITIVA */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col justify-center">
        
        {/* Cabecera de la diapositiva */}
        <div className="mb-8 text-center max-w-4xl mx-auto space-y-3 animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-blue-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>{slideMeta.badge}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/60 font-medium lowercase">{slideMeta.durationRecommended}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {slideMeta.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-medium max-w-2xl mx-auto">
            {slideMeta.subtitle}
          </p>
        </div>

        {/* ================= SLIDE 1: PORTADA & VISIÓN ================= */}
        {currentSlide === 1 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black mb-4">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white mb-2">0% Comisiones</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Desintermediación completa. El propietario conserva el 100% del valor de su venta o anticrético sin regalar entre el 3% y el 7%.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white mb-2">Búsqueda Inteligente con IA</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Motor de procesamiento de lenguaje natural en tiempo real que interpreta zonas bolivianas, presupuesto y dormitorios en una sola frase.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white mb-2">Blindaje Jurídico Notarial</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Auditoría de Folio Real en Derechos Reales y soporte notarial para erradicar estafas y gravámenes ocultos en anticréticos.
                  </p>
                </div>
              </div>

            </div>

            {/* Métrica de impacto */}
            <div className="bg-gradient-to-r from-primary/20 via-blue-900/30 to-emerald-950/20 border border-primary/30 rounded-3xl p-6 text-center">
              <span className="text-xs font-black uppercase tracking-wider text-blue-300 block mb-1">
                Propósito Central
              </span>
              <p className="text-base sm:text-lg font-bold text-white max-w-3xl mx-auto">
                Democratizar el acceso a la vivienda y proteger el patrimonio de las familias bolivianas con tecnología accesible y transparente.
              </p>
            </div>
          </div>
        )}

        {/* ================= SLIDE 2: EL PROBLEMA (GRÁFICA ANIMADA DE COMISIONES) ================= */}
        {currentSlide === 2 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            
            {/* Control interactivo de precio para impresionar al jurado */}
            <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Mueve el precio del inmueble:
                </span>
                <span className="text-xl font-black text-emerald-400">
                  $us {propertyPrice.toLocaleString('en-US')}
                </span>
              </div>
              <input
                type="range"
                min="30000"
                max="350000"
                step="10000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1">
                <span>$us 30,000 (Anticrético mediano)</span>
                <span>$us 350,000 (Casa zona Sur)</span>
              </div>
            </div>

            {/* GRÁFICA COMPARATIVA ANIMADA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Modelo Tradicional (Rojo / Pérdida) */}
              <div className="bg-red-950/30 border border-red-500/30 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-red-400 tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Modelo Inmobiliario Tradicional
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                    Comisión del 3% al 7%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-black text-red-400">
                    - $us {comisionPromedio.toLocaleString('en-US')}
                  </div>
                  <p className="text-xs text-red-200/80 leading-relaxed">
                    Dinero del patrimonio familiar confiscado por un agente inmobiliario que solo subió un anuncio a Facebook.
                  </p>
                </div>

                {/* Barra animada de pérdida */}
                <div className="space-y-1">
                  <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden p-0.5 border border-red-500/20">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (comisionAlta / 25000) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 block text-right font-medium">
                    Rango de pérdida: ${comisionBaja.toLocaleString()} a ${comisionAlta.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Modelo InmoVAX (Verde / Ahorro) */}
              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Modelo Directo InmoVAX
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    0% Comisión de Venta
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                    $us 0 en comisiones
                  </div>
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    Conservas el 100% de tu dinero. Negociación transparente de persona a persona mediante chat seguro y WhatsApp.
                  </p>
                </div>

                {/* Barra animada de conservación al 100% */}
                <div className="space-y-1">
                  <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden p-0.5 border border-emerald-500/20">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full" />
                  </div>
                  <span className="text-[10px] text-emerald-400 block text-right font-black">
                    100% de tu patrimonio protegido
                  </span>
                </div>
              </div>

            </div>

            {/* Segundo problema crítico: Inseguridad en Anticréticos */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-gray-300">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>El dolor legal en Bolivia:</strong> Más del 60% de los anticréticos se firman con minutas privadas sin registrarse en Derechos Reales, dejando al anticresista expuesto a perder su capital si el inmueble tiene una hipoteca oculta.
              </span>
            </div>

          </div>
        )}

        {/* ================= SLIDE 3: LA SOLUCIÓN INMOVAX ================= */}
        {currentSlide === 3 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* El Pasado Roto */}
              <div className="bg-gray-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 opacity-75">
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider block">
                  El Pasado: Informalidad y Costos
                </span>
                <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                    <span>Intermediarios que cobran hasta el 7% sin asumir ninguna responsabilidad legal.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                    <span>Anticréticos acordados de palabra o en minutas privadas sin Folio Real.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                    <span>Buscadores obsoletos que obligan a rellenar 15 filtros vacíos.</span>
                  </li>
                </ul>
              </div>

              {/* El Futuro InmoVAX */}
              <div className="bg-gradient-to-b from-blue-950/40 to-primary/10 border-2 border-primary/50 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <span className="text-xs font-black uppercase text-primary tracking-wider block">
                  La Solución InmoVAX: Tecnología Directa
                </span>
                <ul className="space-y-3 text-xs sm:text-sm text-gray-200">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Conexión Directa P2P:</strong> Negociación abierta comprador-propietario sin agentes abusivos.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Auditoría en Derechos Reales:</strong> Verificación de antecedentes de Folio Real y protocolo notarial.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Búsqueda con IA:</strong> Encuentra inmuebles escribiendo en lenguaje natural en segundos.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Diagrama de flujo seguro */}
            <div className="bg-gray-900 border border-white/10 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-black flex items-center justify-center">1</span>
                <span className="font-bold">Publicación Gratuita Directa</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 hidden md:block" />
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-black flex items-center justify-center">2</span>
                <span className="font-bold">Búsqueda Inteligente con IA</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 hidden md:block" />
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-black flex items-center justify-center">3</span>
                <span className="font-bold">Contacto Directo sin Comisión</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 hidden md:block" />
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center">4</span>
                <span className="font-bold">Cierre con Respaldo Notarial</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= SLIDE 4: INNOVACIÓN EN IA (SIMULADOR EN VIVO) ================= */}
        {currentSlide === 4 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            
            {/* Simulador de consulta */}
            <div className="bg-gray-900/90 border border-primary/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-4">
              <span className="text-xs font-black uppercase text-blue-300 tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Simulador del Motor de Búsqueda Inteligente
              </span>

              {/* Barra interactiva */}
              <div className="relative">
                <input
                  type="text"
                  value={simQuery}
                  onChange={(e) => setSimQuery(e.target.value)}
                  className="w-full bg-black/60 text-white rounded-2xl py-4 pl-4 pr-12 text-sm sm:text-base border border-white/20 focus:border-primary outline-hidden font-medium"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 bg-primary text-white p-2 rounded-xl"
                  title="Buscar"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Botones de prueba rápida para la exposición */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-400 font-bold text-[11px]">Consultas de prueba para el pitch:</span>
                {[
                  "Departamento en Sopocachi en anticrético menos de $us 45,000",
                  "Casa en venta en Calacoto con 3 dormitorios",
                  "Oficina en alquiler en Miraflores La Paz"
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSimQuery(q)}
                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chips de interpretación en tiempo real */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  La Inteligencia Artificial desglosa automáticamente:
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-blue-300 border border-primary/30 text-xs font-black">
                    Contrato: Anticrético
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                    Inmueble: Departamento
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
                    Zona: Sopocachi (La Paz)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black">
                    Precio Máx: $us 45,000
                  </span>
                </div>
              </div>
            </div>

            {/* Asistente InmoBot Gemini */}
            <div className="bg-gradient-to-r from-blue-950/40 to-gray-900 border border-white/10 rounded-3xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div className="text-xs sm:text-sm">
                <h4 className="font-extrabold text-white">InmoBot Asesor Virtual 24/7 (Gemini Flash)</h4>
                <p className="text-gray-400 mt-0.5">
                  Responde consultas legales, redacta cláusulas de anticrético y sugiere propiedades verificadas sin emojis y con lenguaje profesional adaptado a la legislación boliviana.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ================= SLIDE 5: ECOSISTEMA ================= */}
        {currentSlide === 5 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-white text-base">Búsqueda con IA</h3>
                  <p className="text-xs text-gray-400">
                    Búsqueda en lenguaje natural que elimina selectores complejos y encuentra en segundos.
                  </p>
                </div>
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-4">Pilar 1</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-white text-base">InmoBot Gemini</h3>
                  <p className="text-xs text-gray-400">
                    Asistente multi-pantalla con pantalla de chat, catálogo de inmuebles y guía legal boliviana.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-4">Pilar 2</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-white text-base">Foro Comunitario</h3>
                  <p className="text-xs text-gray-400">
                    Comunidad viva para consultar dudas reales de anticréticos, impuestos y experiencias notariales.
                  </p>
                </div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-4">Pilar 3</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Home className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-white text-base">Registro Rápido 3 Pasos</h3>
                  <p className="text-xs text-gray-400">
                    Publicación dinámica y limpia sin campos absurdos ni trabas burocráticas.
                  </p>
                </div>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mt-4">Pilar 4</span>
              </div>

            </div>
          </div>
        )}

        {/* ================= SLIDE 6: MODELO DE NEGOCIO ================= */}
        {currentSlide === 6 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                  Nivel 1: Gratuito (Freemium)
                </span>
                <h3 className="text-lg font-black text-white">Publicación Directa P2P</h3>
                <ul className="text-xs text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">✓ Publicación 100% gratuita</li>
                  <li className="flex items-center gap-2">✓ Mensajes y WhatsApp directo</li>
                  <li className="flex items-center gap-2">✓ Cero comisiones de venta</li>
                </ul>
                <p className="text-[11px] text-gray-400 pt-2 border-t border-white/10">
                  Atrae miles de inmuebles y crea un efecto de red insuperable.
                </p>
              </div>

              <div className="bg-primary/10 border-2 border-primary/50 rounded-3xl p-6 space-y-4 shadow-xl">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-primary/30">
                  Nivel 2: Servicios Legales (Principal Fuente)
                </span>
                <h3 className="text-lg font-black text-white">Auditoría Notarial y DDRR</h3>
                <ul className="text-xs text-gray-200 space-y-2">
                  <li className="flex items-center gap-2">✓ Verificación de Folio Real digital</li>
                  <li className="flex items-center gap-2">✓ Redacción de minutas de anticrético</li>
                  <li className="flex items-center gap-2">✓ Protocolización notarial segura</li>
                </ul>
                <p className="text-[11px] text-blue-200 pt-2 border-t border-white/10 font-bold">
                  Tarifas fijas de $us 30 a $us 150 por trámite seguro.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/30">
                  Nivel 3: Visibilidad Destacada
                </span>
                <h3 className="text-lg font-black text-white">Planes de Exposición VIP</h3>
                <ul className="text-xs text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">✓ Posicionamiento prioritario en IA</li>
                  <li className="flex items-center gap-2">✓ Insignia dorada de verificación</li>
                  <li className="flex items-center gap-2">✓ Métricas y analítica de visitas</li>
                </ul>
                <p className="text-[11px] text-gray-400 pt-2 border-t border-white/10">
                  Para propietarios con urgencia de cerrar su operación.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ================= SLIDE 7: MERCADO & OPORTUNIDAD ================= */}
        {currentSlide === 7 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                <span className="text-3xl sm:text-4xl font-black text-primary">
                  $us 2.5B+
                </span>
                <h4 className="text-sm font-extrabold text-white">Mercado Anual Transaccional</h4>
                <p className="text-xs text-gray-400">
                  Volumen anual estimado en compras, ventas y anticréticos en el eje troncal de Bolivia.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                  70%+
                </span>
                <h4 className="text-sm font-extrabold text-white">Desintermediación Digital</h4>
                <p className="text-xs text-gray-400">
                  Propietarios que prefieren vender por su cuenta pero carecen de herramientas seguras.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                <span className="text-3xl sm:text-4xl font-black text-amber-400">
                  3 Ejes Clave
                </span>
                <h4 className="text-sm font-extrabold text-white">La Paz, Santa Cruz, Cochabamba</h4>
                <p className="text-xs text-gray-400">
                  Concentran más del 80% de la demanda habitacional y de inversión del país.
                </p>
              </div>

            </div>

            <div className="bg-gray-900 border border-white/10 rounded-3xl p-5 text-xs text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
              <strong>Ventaja Competitiva Indestructible:</strong> Las plataformas transnacionales no entienden la figura jurídica del <em>anticrético boliviano</em> ni se conectan con los notarios locales. InmoVAX nace y está optimizada para la realidad del país.
            </div>
          </div>
        )}

        {/* ================= SLIDE 8: CIERRE & DEMO EN VIVO ================= */}
        {currentSlide === 8 && (
          <div className="space-y-8 text-center animate-in zoom-in-95 duration-300 max-w-3xl mx-auto">
            
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-primary/30">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                El futuro de los bienes raíces en Bolivia se llama <span className="text-primary">InmoVAX</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-300 font-medium">
                Erradicamos las comisiones abusivas, aceleramos las búsquedas con Inteligencia Artificial y blindamos jurídicamente cada operación.
              </p>
            </div>

            {/* BOTONES DIRECTOS PARA DEMOSTRACIÓN EN VIVO */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/#buscador-principal"
                target="_blank"
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white font-black text-sm uppercase tracking-wider rounded-full shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Probar Buscador con IA en Vivo</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                href="/foro"
                target="_blank"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-amber-300" />
                <span>Ver Foro Comunitario</span>
              </Link>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Gracias por su atención. Quedo abierto a preguntas y comentarios.
            </p>
          </div>
        )}

      </main>

      {/* 3. GUION DEL ORADOR FLOTANTE (DRAWER / TECLA N) */}
      {showNotes && (
        <div className="bg-amber-950/90 border-t-2 border-amber-400 text-amber-100 px-6 py-4 fixed bottom-18 left-0 right-0 z-40 backdrop-blur-lg shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="max-w-4xl mx-auto space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Guion de lo que debes decir en esta diapositiva ({slideMeta.durationRecommended}):
              </span>
              <button 
                type="button" 
                onClick={() => setShowNotes(false)}
                className="text-xs font-bold text-amber-300 hover:text-white"
              >
                Cerrar [✕]
              </button>
            </div>
            <ul className="text-xs sm:text-sm text-amber-100/90 space-y-1 list-disc pl-5">
              {slideMeta.speakerNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 4. BARRA INFERIOR DE NAVEGACIÓN ENTRE DIAPOSITIVAS */}
      <footer className="w-full bg-gray-900/90 border-t border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 sticky bottom-0 z-50">
        
        {/* Botón Anterior */}
        <button
          type="button"
          onClick={() => setCurrentSlide(prev => Math.max(1, prev - 1))}
          disabled={currentSlide === 1}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Indicadores de bolitas clicables */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {SLIDES_META.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(s.id)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentSlide === s.id 
                  ? 'w-8 bg-primary shadow-sm shadow-primary' 
                  : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
              title={`Ir a diapositiva ${s.id}: ${s.badge}`}
            />
          ))}
        </div>

        {/* Botón Siguiente */}
        <button
          type="button"
          onClick={() => setCurrentSlide(prev => Math.min(totalSlides, prev + 1))}
          disabled={currentSlide === totalSlides}
          className="px-4 py-2 rounded-full bg-primary hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-primary/30"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>

    </div>
  );
}

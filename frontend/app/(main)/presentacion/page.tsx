"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Maximize2, Minimize2, ChevronLeft, ChevronRight, Play, Pause, 
  RotateCcw, Sparkles, ShieldCheck, AlertTriangle, CheckCircle2, 
  Clock, Bot, Users, Home, Search, BookOpen, Activity, ArrowUpRight, 
  BedDouble, Bath, ArrowRight, Zap, ShieldAlert, Award, Compass, Eye, Check
} from 'lucide-react';

interface SlideData {
  id: number;
  badge: string;
  tagline: string;
  durationRecommended: string;
  speakerNotes: string[];
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    badge: "Visión & Propósito",
    tagline: "El fin de las comisiones inmobiliarias en Bolivia",
    durationRecommended: "0:00 - 1:00",
    speakerNotes: [
      "Inicia con energía: 'InmoVAX no es una inmobiliaria tradicional. Somos la plataforma tecnológica que conecta directamente a propietarios y compradores con 0% de comisiones y respaldo legal en Derechos Reales.'",
      "Señala las 3 tarjetas fotográficas en movimiento: 0% comisión, 100% trato directo P2P, y seguridad jurídica con Folio Real.",
      "Destaca el ticker en movimiento continuo: estamos construyendo la red inmobiliaria descentralizada de Bolivia."
    ]
  },
  {
    id: 2,
    badge: "El Gran Problema",
    tagline: "El desangrado del 3% al 7% en comisiones y el riesgo del anticrético",
    durationRecommended: "1:00 - 2:15",
    speakerNotes: [
      "Mueve el slider en vivo: 'Miren cómo en una propiedad de $150,000, una familia pierde más de $10,000 en comisiones que no agregan ningún valor.'",
      "Muestra la animación continua de los billetes fugándose hacia la agencia tradicional.",
      "Alerta sobre los anticréticos sin Folio Real: 6 de cada 10 se pactan a ciegas provocando estafas y juicios de años."
    ]
  },
  {
    id: 3,
    badge: "La Solución InmoVAX",
    tagline: "Conexión directa P2P + Escaneo legal en Derechos Reales",
    durationRecommended: "2:15 - 3:30",
    speakerNotes: [
      "Muestra la foto del contrato con el escáner láser verde en movimiento continuo: cada anticrético es auditado en Folio Real.",
      "Muestra la animación del flujo P2P donde la energía viaja directamente del propietario al comprador sin comisiones intermedias."
    ]
  },
  {
    id: 4,
    badge: "Inteligencia Artificial",
    tagline: "Búsqueda en lenguaje natural: la IA piensa como tú",
    durationRecommended: "3:30 - 4:45",
    speakerNotes: [
      "Mira la animación de escritura en tiempo real: el usuario no llena filtros aburridos, solo escribe como habla.",
      "Cada consulta hace aparecer dinámicamente la foto del departamento real en Sopocachi o la casa en Calacoto.",
      "InmoBot (Gemini Flash) asesora legalmente 24/7 sin emojis y con absoluta seriedad."
    ]
  },
  {
    id: 5,
    badge: "Ecosistema Integrado",
    tagline: "4 herramientas interconectadas en un solo núcleo tecnológico",
    durationRecommended: "4:45 - 5:30",
    speakerNotes: [
      "Muestra los 4 módulos visuales con fotos reales y efecto Ken Burns: Buscador IA, InmoBot, Foro Comunitario Legal y Registro en 3 pasos.",
      "Todo está interconectado mediante un canal de datos sincronizado en tiempo real."
    ]
  },
  {
    id: 6,
    badge: "Modelo de Negocio",
    tagline: "Modelo Freemium Legal: captamos volumen y monetizamos en seguridad",
    durationRecommended: "5:30 - 6:15",
    speakerNotes: [
      "Explica el embudo visual con fotografías: publicar es 100% gratis (captamos miles de inmuebles por efecto de red).",
      "Monetizamos en trámites notariales ($30 a $150 por verificación de Folio Real) y visibilidad VIP ($15 a $45).",
      "Ganamos cuando el usuario está protegido, no quitándole el 5% de su patrimonio familiar."
    ]
  },
  {
    id: 7,
    badge: "Mercado Boliviano",
    tagline: "Más de $us 2,500 millones anuales en el eje troncal",
    durationRecommended: "6:15 - 6:45",
    speakerNotes: [
      "Muestra las fotos cinemáticas de Santa Cruz, La Paz y Cochabamba con sus barras de progreso animadas.",
      "Destaca: Las plataformas extranjeras no entienden el anticrético boliviano. InmoVAX domina este nicho único."
    ]
  },
  {
    id: 8,
    badge: "Cierre & Demo",
    tagline: "¿Listos para transformar el mercado inmobiliario?",
    durationRecommended: "6:45 - 7:00",
    speakerNotes: [
      "Frase de remate: 'El patrimonio que tomó 20 años en construirse no debe perderse en comisiones de 5 minutos.'",
      "Haz clic en 'Probar Buscador con IA en Vivo' y pasa a la sesión de preguntas y respuestas."
    ]
  }
];

// Datos dinámicos para la demostración de IA con fotos reales
const AI_DEMO_CASES = [
  {
    query: "Departamento en Sopocachi en anticrético menos de $us 45,000",
    chips: ["Anticrético", "Departamento", "Sopocachi", "< $us 45k", "2 Dorms"],
    property: {
      title: "Departamento Soleado en Sopocachi",
      zone: "Sopocachi, La Paz",
      price: "$us 45,000",
      type: "Anticrético",
      beds: 2,
      baths: 2,
      area: 88,
      img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop"
    }
  },
  {
    query: "Casa en venta en Calacoto con 3 dormitorios y jardín privado",
    chips: ["Venta", "Casa", "Calacoto", "3 Dorms", "Jardín"],
    property: {
      title: "Residencia Familiar en Calacoto",
      zone: "Calacoto, La Paz",
      price: "$us 185,000",
      type: "Venta Directa",
      beds: 3,
      baths: 3,
      area: 240,
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
    }
  },
  {
    query: "Monoambiente moderno en Achumani en alquiler amoblado",
    chips: ["Alquiler", "Monoambiente", "Achumani", "Amoblado", "1 Dorm"],
    property: {
      title: "Studio Loft Amoblado en Achumani",
      zone: "Achumani, La Paz",
      price: "Bs. 2,800/mes",
      type: "Alquiler",
      beds: 1,
      baths: 1,
      area: 45,
      img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop"
    }
  }
];

export default function PresentacionPitchPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  
  // Cronómetro de 7 minutos
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Estados interactivos
  const [propertyPrice, setPropertyPrice] = useState(150000);
  const [aiCaseIndex, setAiCaseIndex] = useState(0);

  const totalSlides = SLIDES.length;
  const slideMeta = SLIDES[currentSlide - 1];

  // Rotación automática de casos de IA en Slide 4 cada 4 segundos
  useEffect(() => {
    if (currentSlide === 4) {
      const interval = setInterval(() => {
        setAiCaseIndex(prev => (prev + 1) % AI_DEMO_CASES.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentSlide]);

  // Cronómetro
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

  // Atajos de teclado
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

  // Cálculos dinámicos de comisiones
  const comisionBaja = Math.round(propertyPrice * 0.03);
  const comisionPromedio = Math.round(propertyPrice * 0.05);
  const comisionAlta = Math.round(propertyPrice * 0.07);

  const currentAICase = AI_DEMO_CASES[aiCaseIndex];

  return (
    <div className="min-h-screen bg-[#060911] text-white flex flex-col justify-between selection:bg-primary selection:text-white font-sans overflow-x-hidden relative">
      
      {/* KEYFRAMES DE ANIMACIONES CINEMÁTICAS EN MOVIMIENTO REAL */}
      <style jsx global>{`
        @keyframes kenBurnsZoom {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.12) translate(-1.5%, -1.5%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes kenBurnsZoomReverse {
          0% { transform: scale(1.1) translate(-1%, -1%); }
          50% { transform: scale(1) translate(1%, 1%); }
          100% { transform: scale(1.1) translate(-1%, -1%); }
        }
        @keyframes floatCashContinuous {
          0% { transform: translateY(0px) rotate(0deg) scale(0.9); opacity: 0; }
          20% { opacity: 1; transform: translateY(-15px) rotate(3deg) scale(1); }
          80% { opacity: 1; transform: translateY(-60px) rotate(-4deg) scale(1.05); }
          100% { transform: translateY(-90px) rotate(10deg) scale(1.1); opacity: 0; }
        }
        @keyframes pulseNeonBorder {
          0%, 100% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.35), inset 0 0 15px rgba(16, 185, 129, 0.15); }
          50% { box-shadow: 0 0 35px rgba(16, 185, 129, 0.8), inset 0 0 25px rgba(16, 185, 129, 0.35); }
        }
        @keyframes pulseBlueBorder {
          0%, 100% { box-shadow: 0 0 15px rgba(37, 99, 235, 0.35), inset 0 0 15px rgba(37, 99, 235, 0.15); }
          50% { box-shadow: 0 0 35px rgba(37, 99, 235, 0.8), inset 0 0 25px rgba(37, 99, 235, 0.35); }
        }
        @keyframes laserScanVertical {
          0% { top: 0%; opacity: 0.85; }
          50% { top: 92%; opacity: 1; filter: drop-shadow(0 0 12px #10b981); }
          100% { top: 0%; opacity: 0.85; }
        }
        @keyframes stampHologramPulse {
          0%, 100% { transform: scale(1) rotate(-3deg); filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.5)); }
          50% { transform: scale(1.08) rotate(-3deg); filter: drop-shadow(0 0 22px rgba(16, 185, 129, 1)); }
        }
        @keyframes cardSlideIn {
          0% { transform: translateY(24px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes waveAudioBars {
          0%, 100% { height: 18%; opacity: 0.5; }
          50% { height: 100%; opacity: 1; }
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes electricPulseLine {
          0% { left: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes shimmerGradient {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-12px) translateX(8px); }
          66% { transform: translateY(8px) translateX(-6px); }
        }

        .anim-kenburns { animation: kenBurnsZoom 22s ease-in-out infinite alternate; }
        .anim-kenburns-rev { animation: kenBurnsZoomReverse 24s ease-in-out infinite alternate; }
        .anim-cash-1 { animation: floatCashContinuous 2.8s infinite cubic-bezier(0.2, 0.8, 0.2, 1); }
        .anim-cash-2 { animation: floatCashContinuous 2.8s infinite cubic-bezier(0.2, 0.8, 0.2, 1) 0.9s; }
        .anim-cash-3 { animation: floatCashContinuous 2.8s infinite cubic-bezier(0.2, 0.8, 0.2, 1) 1.8s; }
        .anim-neon-green { animation: pulseNeonBorder 2.5s infinite ease-in-out; }
        .anim-neon-blue { animation: pulseBlueBorder 2.5s infinite ease-in-out; }
        .anim-laser { animation: laserScanVertical 2.6s infinite ease-in-out; }
        .anim-stamp { animation: stampHologramPulse 2.2s infinite ease-in-out; }
        .anim-card-in { animation: cardSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-marquee { animation: marqueeScroll 25s linear infinite; }
        .anim-electric { animation: electricPulseLine 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .anim-radar { animation: radarSweep 6s linear infinite; }
        .anim-float-orb { animation: floatOrb 8s ease-in-out infinite; }
        .anim-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmerGradient 2.8s infinite;
        }
      `}</style>

      {/* AMBIENTE DE FONDO CON PARTÍCULAS LUMINOSAS Y GRADIENTES ANIMADOS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl anim-float-orb" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl anim-float-orb" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-900/5 rounded-full blur-[120px]" />
      </div>

      {/* 1. BARRA SUPERIOR DE CONTROL Y CRONÓMETRO */}
      <header className="w-full bg-black/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 sticky top-0 z-50">
        
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-primary/30">
              IV
            </div>
            <span className="font-black text-base text-white">
              Inmo<span className="text-primary">VAX</span>
            </span>
          </Link>
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10">
            Slide {currentSlide} / {totalSlides}
          </span>
        </div>

        {/* Cronómetro 7 min */}
        <div className="flex items-center gap-2.5 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono">
          <Clock className={`w-4 h-4 ${secondsElapsed > 420 ? 'text-red-400 animate-pulse' : secondsElapsed > 300 ? 'text-amber-400' : 'text-emerald-400'}`} />
          <span className={`font-black text-sm ${secondsElapsed > 420 ? 'text-red-400' : secondsElapsed > 300 ? 'text-amber-300' : 'text-emerald-300'}`}>
            {formatTimer(secondsElapsed)}
          </span>
          <span className="text-white/40 text-[11px]">/ 07:00</span>
          
          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="hover:text-primary transition-colors cursor-pointer p-0.5"
            title={isTimerRunning ? 'Pausar' : 'Iniciar'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => { setSecondsElapsed(0); setIsTimerRunning(false); }}
            className="hover:text-primary transition-colors cursor-pointer p-0.5"
            title="Reiniciar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showNotes 
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Guion (N)</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/80 transition-all cursor-pointer"
            title="Pantalla completa (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL: GRÁFICAS GIGANTES Y FOTOS EN MOVIMIENTO CINEMÁTICO */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col justify-center relative z-10">
        
        {/* Titular corto */}
        <div className="text-center mb-4 space-y-1">
          <span className="inline-block px-3 py-0.5 rounded-full bg-primary/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-primary/30">
            {slideMeta.badge} • {slideMeta.durationRecommended}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {slideMeta.tagline}
          </h1>
        </div>

        {/* ================= SLIDE 1: PORTADA & VISIÓN (FONDO KEN BURNS Y FOTOTARJETAS) ================= */}
        {currentSlide === 1 && (
          <div className="space-y-5">
            
            {/* 3 Tarjetas con Fotografías Reales, Números Gigantes y Animaciones Continuas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Tarjeta 1: 0% Comisiones con foto de entrega de llaves */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 h-64 sm:h-72 flex flex-col justify-end p-6 group shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop"
                  alt="Entrega de llaves directa"
                  fill
                  className="object-cover object-center anim-kenburns opacity-45 group-hover:opacity-60 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
                <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-black text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  AHORRO INMEDIATO
                </div>
                <div className="relative z-10 space-y-1">
                  <span className="text-5xl font-black text-emerald-400 block tracking-tight">0%</span>
                  <span className="text-sm font-black text-white uppercase tracking-wider block">Comisión Inmobiliaria</span>
                  <p className="text-xs text-gray-300 font-medium">Ahorras del 3% al 7% íntegro de tu patrimonio familiar.</p>
                </div>
              </div>

              {/* Tarjeta 2: 100% P2P con foto de casa moderna */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 h-64 sm:h-72 flex flex-col justify-end p-6 group shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
                  alt="Arquitectura moderna en Bolivia"
                  fill
                  className="object-cover object-center anim-kenburns-rev opacity-45 group-hover:opacity-60 transition-opacity"
                  style={{ animationDelay: '3s' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
                <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-[10px] font-black text-blue-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  SIN INTERMEDIARIOS
                </div>
                <div className="relative z-10 space-y-1">
                  <span className="text-5xl font-black text-blue-400 block tracking-tight">100%</span>
                  <span className="text-sm font-black text-white uppercase tracking-wider block">Trato Directo P2P</span>
                  <p className="text-xs text-gray-300 font-medium">Conexión directa comprador - propietario por WhatsApp.</p>
                </div>
              </div>

              {/* Tarjeta 3: DDRR con foto de contrato notarial */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 h-64 sm:h-72 flex flex-col justify-end p-6 group shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop"
                  alt="Contrato notarial seguro"
                  fill
                  className="object-cover object-center anim-kenburns opacity-45 group-hover:opacity-60 transition-opacity"
                  style={{ animationDelay: '6s' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
                <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-black text-amber-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  LEGAL & NOTARIAL
                </div>
                <div className="relative z-10 space-y-1">
                  <span className="text-5xl font-black text-amber-400 block tracking-tight">DDRR</span>
                  <span className="text-sm font-black text-white uppercase tracking-wider block">Blindaje Notarial</span>
                  <p className="text-xs text-gray-300 font-medium">Folio Real auditado para anticréticos y compras sin estafas.</p>
                </div>
              </div>

            </div>

            {/* MARQUEE CONTINUO ANIMADO (TICKER EN MOVIMIENTO) */}
            <div className="relative overflow-hidden bg-black/60 border border-white/10 rounded-2xl py-2.5">
              <div className="flex whitespace-nowrap anim-marquee gap-8 text-xs font-mono font-black text-gray-300">
                <span className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> 0% COMISIONES INMOBILIARIAS</span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-2 text-blue-400"><Zap className="w-3.5 h-3.5" /> TRATO DIRECTO POR WHATSAPP</span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-2 text-amber-400"><ShieldCheck className="w-3.5 h-3.5" /> AUDITORÍA EN DERECHOS REALES</span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-2 text-primary"><Bot className="w-3.5 h-3.5" /> BÚSQUEDA INTELIGENTE CON GEMINI FLASH</span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-2 text-emerald-400"><Home className="w-3.5 h-3.5" /> LA PAZ • SANTA CRUZ • COCHABAMBA</span>
                <span className="text-white/30">•</span>
                {/* Duplicado para loop infinito fluido */}
                <span className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> 0% COMISIONES INMOBILIARIAS</span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-2 text-blue-400"><Zap className="w-3.5 h-3.5" /> TRATO DIRECTO POR WHATSAPP</span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-2 text-amber-400"><ShieldCheck className="w-3.5 h-3.5" /> AUDITORÍA EN DERECHOS REALES</span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-2 text-primary"><Bot className="w-3.5 h-3.5" /> BÚSQUEDA INTELIGENTE CON GEMINI FLASH</span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-2 text-emerald-400"><Home className="w-3.5 h-3.5" /> LA PAZ • SANTA CRUZ • COCHABAMBA</span>
              </div>
            </div>

          </div>
        )}

        {/* ================= SLIDE 2: EL PROBLEMA (FOTOS REALES + BILLETES FLOTANDO EN MOVIMIENTO) ================= */}
        {currentSlide === 2 && (
          <div className="space-y-4">
            
            {/* Slider de precio interactivo */}
            <div className="bg-black/70 border border-white/15 rounded-2xl p-4 max-w-xl mx-auto flex items-center gap-4 shadow-xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">
                Valor del Inmueble:
              </span>
              <input
                type="range"
                min="50000"
                max="300000"
                step="10000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-xl font-black text-emerald-400 shrink-0 font-mono">
                ${propertyPrice.toLocaleString()} USD
              </span>
            </div>

            {/* BATALLA VISUAL FOTOGRÁFICA CON BILLETES FLOTANDO EN MOVIMIENTO CONTINUO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Lado Rojo: Foto de edificio descuidado con dinero fugándose */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-red-500/50 h-72 sm:h-80 p-6 flex flex-col justify-between shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=800&auto=format&fit=crop"
                  alt="Inmobiliaria tradicional y abandono"
                  fill
                  className="object-cover object-center opacity-30 anim-kenburns"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/95 via-gray-950/80 to-red-950/40" />

                {/* Billetes flotando animados en movimiento continuo ascendente */}
                <div className="absolute right-8 top-8 z-20 pointer-events-none">
                  <span className="text-red-400 text-lg font-black anim-cash-1 block font-mono">-${comisionBaja.toLocaleString()}</span>
                  <span className="text-red-300 text-2xl font-black anim-cash-2 block font-mono">-${comisionPromedio.toLocaleString()}</span>
                  <span className="text-red-200 text-3xl font-black anim-cash-3 block font-mono">-${comisionAlta.toLocaleString()}</span>
                </div>

                <div className="relative z-10">
                  <span className="text-xs font-black uppercase text-red-400 tracking-wider flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
                    Modelo Inmobiliario Tradicional
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-red-400 font-mono tracking-tight">
                    - ${comisionPromedio.toLocaleString()} USD
                  </div>
                  <span className="text-xs text-red-200 block font-bold mt-1">
                    Pérdida neta de comisión del 3% al 7%
                  </span>
                </div>

                <div className="relative z-10 space-y-1.5">
                  <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden p-0.5 border border-red-500/30">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (comisionAlta / 21000) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 block text-right font-mono">
                    Dinero confiscado por un simple cartel o aviso en Facebook
                  </span>
                </div>
              </div>

              {/* Lado Verde: Foto de casa hermosa con patrimonio 100% intacto */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/60 h-72 sm:h-80 p-6 flex flex-col justify-between shadow-2xl anim-neon-green">
                <Image
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop"
                  alt="Casa protegida con InmoVAX"
                  fill
                  className="object-cover object-center opacity-40 anim-kenburns-rev"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-gray-950/75 to-emerald-950/30" />

                <div className="relative z-10">
                  <span className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Modelo Directo InmoVAX
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight">
                    $0 en comisiones
                  </div>
                  <span className="text-xs text-emerald-300 block font-bold mt-1">
                    El 100% del valor pactado se queda con la familia
                  </span>
                </div>

                <div className="relative z-10 space-y-1.5">
                  <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden p-0.5 border border-emerald-500/30 relative">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full" />
                    <div className="absolute inset-0 anim-shimmer" />
                  </div>
                  <span className="text-[11px] text-emerald-400 block text-right font-black font-mono">
                    100% del patrimonio familiar salvaguardado
                  </span>
                </div>
              </div>

            </div>

            {/* Alerta de riesgo en anticréticos */}
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-red-500/30 text-red-300 flex items-center justify-center font-black shrink-0 animate-pulse">!</span>
              <span><strong>El dolor en Bolivia:</strong> 6 de cada 10 anticréticos no se registran en Derechos Reales. Si el propietario tiene gravámenes ocultos, el inquilino pierde todos los ahorros de su vida.</span>
            </div>

          </div>
        )}

        {/* ================= SLIDE 3: LA SOLUCIÓN (FOTO CONTRATO CON ESCÁNER LÁSER + FLUJO P2P ENERGÉTICO) ================= */}
        {currentSlide === 3 && (
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              
              {/* Tarjeta 1: Foto real de Contrato Notarial con Línea Láser en Movimiento Continuo */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/50 h-80 sm:h-96 p-6 flex flex-col justify-between shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop"
                  alt="Escaneo de contrato notarial"
                  fill
                  className="object-cover object-center opacity-35 anim-kenburns"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/50" />

                {/* Línea láser verde en movimiento continuo vertical */}
                <div className="absolute left-0 right-0 h-1.5 bg-emerald-400 shadow-[0_0_25px_#10b981] anim-laser z-20" />

                <div className="relative z-10 flex justify-between items-center text-xs font-mono">
                  <span className="text-primary font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> AUDITORÍA DIGITAL
                  </span>
                  <span className="text-emerald-400 font-black animate-pulse">FOLIO REAL AL DÍA</span>
                </div>

                {/* Holograma notarial animado */}
                <div className="relative z-10 bg-black/70 border border-emerald-400/40 rounded-2xl p-4 space-y-2 backdrop-blur-md">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-gray-300">MATRÍCULA: 2.01.0.99.0018472</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-black border border-emerald-400/30 anim-stamp">
                      VERIFICADO DDRR
                    </span>
                  </div>
                  <ul className="text-xs text-gray-200 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Titularidad legítima confirmada en Derechos Reales
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Libre de gravámenes, embargos e hipotecas bancarias
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Redacción y protocolo notarial supervisado
                    </li>
                  </ul>
                </div>

                <div className="relative z-10 text-xs text-emerald-300 font-bold flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Blindaje del 100% del capital entregado en anticrético o venta.
                </div>
              </div>

              {/* Tarjeta 2: Foto de Trato Directo P2P con Circuito Animado */}
              <div className="relative rounded-3xl overflow-hidden border border-white/20 h-80 sm:h-96 p-6 flex flex-col justify-between shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop"
                  alt="Trato directo P2P de llaves"
                  fill
                  className="object-cover object-center opacity-35 anim-kenburns-rev"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/50" />

                <div className="relative z-10">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Conexión Directa P2P en Bolivia
                  </span>
                </div>

                {/* Diagrama con flujo de luz en movimiento continuo */}
                <div className="relative z-10 my-2 bg-black/70 border border-white/10 rounded-2xl p-5 flex items-center justify-between text-center backdrop-blur-md">
                  
                  <div className="space-y-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto border border-primary/30 shadow-lg shadow-primary/20">
                      <Home className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-xs font-black block text-white">Propietario</span>
                    <span className="text-[10px] text-emerald-400 block font-bold">Publica $0 gratis</span>
                  </div>

                  {/* Canal de energía con punto brillante animado en movimiento continuo */}
                  <div className="flex-1 px-4 flex flex-col items-center">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">0% Comisión</span>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full my-2 relative overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full w-full" />
                      <div className="absolute top-0 bottom-0 w-8 bg-white rounded-full anim-electric" />
                    </div>
                    <span className="text-[10px] text-gray-300 font-bold">WhatsApp Directo</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                      <Users className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-xs font-black block text-white">Comprador</span>
                    <span className="text-[10px] text-blue-400 block font-bold">Trato sin filtro</span>
                  </div>

                </div>

                <div className="relative z-10 text-xs text-gray-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sin inmobiliarias intermediando, demorando citas ni manipulando los precios reales.</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= SLIDE 4: IA CON TARJETA DE FOTO REAL ENTRANTE ================= */}
        {currentSlide === 4 && (
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              
              {/* Lado Izquierdo: Terminal interactiva de IA con ondas dinámicas */}
              <div className="bg-gray-950 border-2 border-primary/50 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden anim-neon-blue shadow-2xl">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                  <span className="text-primary font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary animate-spin" />
                    MOTOR NLP EN TIEMPO REAL
                  </span>
                  <span className="text-emerald-400 font-black animate-pulse">GEMINI 3.6 FLASH</span>
                </div>

                {/* Consulta animada cambiante */}
                <div className="py-3 space-y-2">
                  <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">
                    El usuario escribe como habla:
                  </span>
                  <div className="text-base sm:text-xl font-black text-white bg-black/70 p-3.5 rounded-2xl border border-white/10 min-h-[4.2rem] flex items-center shadow-inner">
                    <span>"{currentAICase.query}"</span>
                  </div>
                </div>

                {/* Chips que se encienden al instante */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Chips inteligentes interpretados por la IA:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentAICase.chips.map((chip, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-primary/20 border border-primary text-blue-300 text-xs font-black shadow-lg shadow-primary/20 animate-bounce"
                        style={{ animationDuration: `${0.9 + idx * 0.15}s` }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ondas ecualizadoras de IA */}
                <div className="pt-3 flex items-center justify-between gap-1 h-7 opacity-75">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-primary to-emerald-400 rounded-full"
                      style={{
                        animation: `waveAudioBars ${0.6 + (i % 5) * 0.2}s ease-in-out infinite`,
                        animationDelay: `${(i % 6) * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Lado Derecho: Tarjeta con Foto Real del Inmueble que Entra en Animación */}
              <div 
                key={aiCaseIndex} 
                className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/50 h-80 sm:h-96 flex flex-col justify-end p-5 shadow-2xl anim-card-in"
              >
                <Image
                  src={currentAICase.property.img}
                  alt={currentAICase.property.title}
                  fill
                  className="object-cover object-center anim-kenburns opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500 text-gray-950 shadow-md">
                      {currentAICase.property.type}
                    </span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {currentAICase.property.price}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">{currentAICase.property.title}</h3>
                    <p className="text-xs text-gray-300 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-primary" /> {currentAICase.property.zone}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-white/15 text-xs text-gray-300">
                    <span className="flex items-center gap-1 font-bold">
                      <BedDouble className="w-3.5 h-3.5 text-primary" /> {currentAICase.property.beds} Dorms
                    </span>
                    <span className="flex items-center gap-1 font-bold">
                      <Bath className="w-3.5 h-3.5 text-primary" /> {currentAICase.property.baths} Baños
                    </span>
                    <span className="flex items-center gap-1 font-bold">
                      <Home className="w-3.5 h-3.5 text-primary" /> {currentAICase.property.area} m²
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= SLIDE 5: ECOSISTEMA (4 TARJETAS CON FOTOS REALES Y EFECTOS KEN BURNS) ================= */}
        {currentSlide === 5 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Foto 1: Buscador IA */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 h-64 sm:h-72 p-4 flex flex-col justify-end group shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop"
                  alt="Buscador IA"
                  fill
                  className="object-cover object-center anim-kenburns opacity-40 group-hover:opacity-60 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/30 text-blue-400 flex items-center justify-center font-black border border-blue-400/30 shadow-md">
                    <Search className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="font-black text-white text-base">Búsqueda IA</h3>
                  <p className="text-[11px] text-gray-300">Lenguaje natural en milisegundos</p>
                </div>
              </div>

              {/* Foto 2: InmoBot Gemini */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 h-64 sm:h-72 p-4 flex flex-col justify-end group shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop"
                  alt="InmoBot"
                  fill
                  className="object-cover object-center anim-kenburns-rev opacity-40 group-hover:opacity-60 transition-opacity"
                  style={{ animationDelay: '2s' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/30 text-emerald-400 flex items-center justify-center font-black border border-emerald-400/30 shadow-md">
                    <Bot className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="font-black text-white text-base">InmoBot Gemini</h3>
                  <p className="text-[11px] text-gray-300">Asesor legal boliviano 24/7</p>
                </div>
              </div>

              {/* Foto 3: Foro Comunitario */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 h-64 sm:h-72 p-4 flex flex-col justify-end group shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop"
                  alt="Foro"
                  fill
                  className="object-cover object-center anim-kenburns opacity-40 group-hover:opacity-60 transition-opacity"
                  style={{ animationDelay: '4s' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/30 text-amber-400 flex items-center justify-center font-black border border-amber-400/30 shadow-md">
                    <Users className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="font-black text-white text-base">Foro Comunitario</h3>
                  <p className="text-[11px] text-gray-300">Consultas reales de anticréticos</p>
                </div>
              </div>

              {/* Foto 4: Publicación en 3 Pasos */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 h-64 sm:h-72 p-4 flex flex-col justify-end group shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"
                  alt="Registro rápido"
                  fill
                  className="object-cover object-center anim-kenburns-rev opacity-40 group-hover:opacity-60 transition-opacity"
                  style={{ animationDelay: '6s' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/30 text-purple-400 flex items-center justify-center font-black border border-purple-400/30 shadow-md">
                    <Home className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="font-black text-white text-base">Registro 3 Pasos</h3>
                  <p className="text-[11px] text-gray-300">Publicación ágil sin trabas</p>
                </div>
              </div>

            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/30 to-emerald-900/30 border border-white/10 text-center text-xs font-mono text-gray-300 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Arquitectura: Next.js 16 Turbopack • Bun Engine • Supabase PostgreSQL • Gemini 3.6 Flash</span>
            </div>
          </div>
        )}

        {/* ================= SLIDE 6: MODELO DE NEGOCIO (FOTOGRAFÍAS DE RESPALDO Y FLUJO MONETARIO) ================= */}
        {currentSlide === 6 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center items-stretch">
              
              {/* Tarjeta 1: Publicación $0 */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 flex flex-col justify-between shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop"
                  alt="Publicación Gratuita"
                  fill
                  className="object-cover object-center opacity-25 anim-kenburns"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/90 to-gray-950/60" />

                <div className="relative z-10">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider block">Entrada Masiva</span>
                  <div className="text-5xl font-black text-white my-3 font-mono">$0</div>
                  <span className="text-sm font-extrabold text-emerald-400 block">Publicación Gratuita P2P</span>
                  <p className="text-xs text-gray-300 mt-2">
                    Efecto de red: captamos el volumen masivo de inmuebles de toda Bolivia.
                  </p>
                </div>
                <div className="relative z-10 pt-4">
                  <div className="h-2 w-full bg-emerald-500/40 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Servicios Notariales $30-$150 */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-primary p-6 flex flex-col justify-between anim-neon-blue shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop"
                  alt="Servicios Notariales"
                  fill
                  className="object-cover object-center opacity-30 anim-kenburns-rev"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/90 to-gray-950/60" />

                <div className="relative z-10">
                  <span className="text-xs font-black text-blue-300 uppercase tracking-wider block">Principal Monetización</span>
                  <div className="text-5xl font-black text-primary my-3 font-mono">$30 - $150</div>
                  <span className="text-sm font-extrabold text-white block">Servicios Notariales y DDRR</span>
                  <p className="text-xs text-blue-100 mt-2">
                    Verificación de Folio Real y protocolo notarial seguro para anticréticos.
                  </p>
                </div>
                <div className="relative z-10 pt-4">
                  <div className="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden relative">
                    <div className="h-full bg-primary rounded-full w-full" />
                    <div className="absolute inset-0 anim-shimmer" />
                  </div>
                </div>
              </div>

              {/* Tarjeta 3: Destacados VIP $15-$45 */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 flex flex-col justify-between shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop"
                  alt="Exposición VIP"
                  fill
                  className="object-cover object-center opacity-25 anim-kenburns"
                  style={{ animationDelay: '4s' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/90 to-gray-950/60" />

                <div className="relative z-10">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider block">Urgencia de Cierre</span>
                  <div className="text-5xl font-black text-amber-400 my-3 font-mono">$15 - $45</div>
                  <span className="text-sm font-extrabold text-amber-300 block">Exposición Destacada VIP</span>
                  <p className="text-xs text-gray-300 mt-2">
                    Prioridad en el algoritmo de IA y mayor volumen de consultas directas.
                  </p>
                </div>
                <div className="relative z-10 pt-4">
                  <div className="h-2 w-full bg-amber-500/40 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-full animate-pulse" />
                  </div>
                </div>
              </div>

            </div>

            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 text-center text-xs text-gray-300">
              <strong>Alineación ética total:</strong> InmoVAX no se queda con el 5% de tu casa. Cobramos por el servicio legal que te da tranquilidad absoluta.
            </div>
          </div>
        )}

        {/* ================= SLIDE 7: MERCADO BOLIVIANO (FOTOS REALES DE LAS 3 CIUDADES + BARRAS ANIMADAS) ================= */}
        {currentSlide === 7 && (
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Santa Cruz */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 h-64 sm:h-72 p-5 flex flex-col justify-between shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop"
                  alt="Santa Cruz Urubó"
                  fill
                  className="object-cover object-center anim-kenburns opacity-45 group-hover:opacity-60 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
                <div className="relative z-10 flex justify-between items-center">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30">
                    SANTA CRUZ
                  </span>
                  <span className="text-sm font-black text-white font-mono">$1,100 M USD</span>
                </div>
                <div className="relative z-10 space-y-1.5">
                  <span className="text-xs text-gray-300 font-bold block">Mayor volumen en compraventas y torres residenciales</span>
                  <div className="h-3 w-full bg-gray-900 rounded-full overflow-hidden p-0.5 border border-blue-500/30 relative">
                    <div className="h-full bg-blue-500 rounded-full w-[85%] animate-pulse" />
                    <div className="absolute inset-0 anim-shimmer" />
                  </div>
                </div>
              </div>

              {/* La Paz / El Alto */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 h-64 sm:h-72 p-5 flex flex-col justify-between shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=800&auto=format&fit=crop"
                  alt="La Paz Sopocachi"
                  fill
                  className="object-cover object-center anim-kenburns-rev opacity-45 group-hover:opacity-60 transition-opacity"
                  style={{ animationDelay: '3s' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
                <div className="relative z-10 flex justify-between items-center">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                    LA PAZ / EL ALTO
                  </span>
                  <span className="text-sm font-black text-white font-mono">$950 M USD</span>
                </div>
                <div className="relative z-10 space-y-1.5">
                  <span className="text-xs text-gray-300 font-bold block">Capital del anticrético y alta densidad urbana</span>
                  <div className="h-3 w-full bg-gray-900 rounded-full overflow-hidden p-0.5 border border-emerald-500/30 relative">
                    <div className="h-full bg-emerald-500 rounded-full w-[75%] animate-pulse" />
                    <div className="absolute inset-0 anim-shimmer" />
                  </div>
                </div>
              </div>

              {/* Cochabamba */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 h-64 sm:h-72 p-5 flex flex-col justify-between shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                  alt="Cochabamba Cala Cala"
                  fill
                  className="object-cover object-center anim-kenburns opacity-45 group-hover:opacity-60 transition-opacity"
                  style={{ animationDelay: '6s' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
                <div className="relative z-10 flex justify-between items-center">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-400/30">
                    COCHABAMBA
                  </span>
                  <span className="text-sm font-black text-white font-mono">$520 M USD</span>
                </div>
                <div className="relative z-10 space-y-1.5">
                  <span className="text-xs text-gray-300 font-bold block">Expansión vertical acelerada en zona norte</span>
                  <div className="h-3 w-full bg-gray-900 rounded-full overflow-hidden p-0.5 border border-amber-500/30 relative">
                    <div className="h-full bg-amber-500 rounded-full w-[50%] animate-pulse" />
                    <div className="absolute inset-0 anim-shimmer" />
                  </div>
                </div>
              </div>

            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-blue-950/40 border border-emerald-500/40 text-center shadow-lg">
              <span className="text-xs uppercase font-black text-emerald-400 tracking-wider">
                Mercado Total Accesible (TAM): +$us 2,500,000,000 Anuales en el Eje Troncal de Bolivia
              </span>
            </div>

          </div>
        )}

        {/* ================= SLIDE 8: CIERRE ÉPICO & DEMO EN VIVO ================= */}
        {currentSlide === 8 && (
          <div className="space-y-6 text-center max-w-3xl mx-auto">
            
            <div className="relative w-28 h-28 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-blue-500 to-emerald-400 text-white flex items-center justify-center shadow-2xl anim-neon-green">
                <Sparkles className="w-14 h-14" />
              </div>
              {/* Anillo de radar giratorio */}
              <div className="absolute -inset-3 rounded-full border-2 border-emerald-400/40 border-dashed anim-radar" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">
                La Oportunidad es Ahora
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                El futuro de los bienes raíces en Bolivia se llama <span className="text-primary">InmoVAX</span>
              </h2>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#buscador-principal"
                target="_blank"
                className="w-full sm:w-auto px-8 py-4 sm:py-5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white font-black text-base uppercase tracking-wider rounded-full shadow-2xl shadow-primary/50 transition-all flex items-center justify-center gap-3 anim-neon-green cursor-pointer"
              >
                <span>Probar Buscador con IA en Vivo</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>

              <Link
                href="/foro"
                target="_blank"
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/15"
              >
                <Users className="w-4 h-4 text-amber-300" />
                <span>Ver Foro Comunitario</span>
              </Link>
            </div>

            <p className="text-xs text-gray-400 font-medium pt-2">
              Muchas gracias por su atención. Comenzamos con la sesión de preguntas.
            </p>
          </div>
        )}

      </main>

      {/* 3. GUION DEL ORADOR FLOTANTE (TECLA N) */}
      {showNotes && (
        <div className="bg-amber-950/95 border-t-2 border-amber-400 text-amber-100 px-6 py-4 fixed bottom-16 left-0 right-0 z-40 backdrop-blur-xl shadow-2xl">
          <div className="max-w-4xl mx-auto space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Guion exacto para decir en esta diapositiva ({slideMeta.durationRecommended}):
              </span>
              <button 
                type="button" 
                onClick={() => setShowNotes(false)}
                className="text-xs font-bold text-amber-300 hover:text-white cursor-pointer"
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

      {/* 4. BARRA INFERIOR DE NAVEGACIÓN */}
      <footer className="w-full bg-black/80 border-t border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 sticky bottom-0 z-50">
        
        <button
          type="button"
          onClick={() => setCurrentSlide(prev => Math.max(1, prev - 1))}
          disabled={currentSlide === 1}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {SLIDES.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(s.id)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentSlide === s.id 
                  ? 'w-8 bg-primary shadow-sm shadow-primary' 
                  : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
              title={`Slide ${s.id}`}
            />
          ))}
        </div>

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

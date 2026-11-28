"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Maximize2, Minimize2, ChevronLeft, ChevronRight, Play, Pause, 
  RotateCcw, Sparkles, ShieldCheck, DollarSign, TrendingUp, 
  AlertTriangle, CheckCircle2, ArrowRight, Clock, 
  Bot, Users, Home, Scale, Search, FileText, Check,
  BookOpen, ExternalLink, Activity, ArrowUpRight
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
    badge: "Visión",
    tagline: "El fin de las comisiones inmobiliarias en Bolivia",
    durationRecommended: "0:00 - 1:00",
    speakerNotes: [
      "Inicia con fuerza: 'InmoVAX no es una inmobiliaria tradicional. Somos la plataforma tecnológica que conecta directamente a propietarios y compradores con 0% de comisiones y respaldo legal en Derechos Reales.'",
      "Señala los 3 números gigantes en pantalla: 0% comisión, 100% P2P, Inteligencia Artificial 24/7."
    ]
  },
  {
    id: 2,
    badge: "El Problema",
    tagline: "El desangrado del 3% al 7% en comisiones y el riesgo del anticrético",
    durationRecommended: "1:00 - 2:15",
    speakerNotes: [
      "Mueve el slider en vivo: 'Miren cómo en una propiedad de $150,000, una familia pierde más de $10,000 en comisiones que no agregan valor.'",
      "Muestra la animación de las monedas fugándose hacia la agencia tradicional.",
      "Alerta sobre los anticréticos sin Folio Real: estafas y juicios de años."
    ]
  },
  {
    id: 3,
    badge: "La Solución",
    tagline: "Conexión directa P2P + Escaneo legal en Derechos Reales",
    durationRecommended: "2:15 - 3:30",
    speakerNotes: [
      "Muestra el rayo de luz que conecta directo al propietario con el comprador sin intermediarios.",
      "Destaca el escáner notarial en movimiento: cada anticrético es auditado en Folio Real para blindar el capital al 100%."
    ]
  },
  {
    id: 4,
    badge: "Tecnología IA",
    tagline: "Búsqueda en lenguaje natural: la IA piensa como tú",
    durationRecommended: "3:30 - 4:45",
    speakerNotes: [
      "Mira la animación de escritura en tiempo real: el usuario no llena filtros aburridos, solo escribe como habla.",
      "La IA detecta automáticamente zona, tipo de contrato, presupuesto y dormitorios al instante.",
      "InmoBot (Gemini Flash) asesora legalmente 24/7 sin emojis y con seriedad."
    ]
  },
  {
    id: 5,
    badge: "Ecosistema",
    tagline: "4 herramientas interconectadas en un solo núcleo",
    durationRecommended: "4:45 - 5:30",
    speakerNotes: [
      "Muestra los 4 satélites orbitando el núcleo: Buscador IA, InmoBot, Foro Comunitario Legal y Registro en 3 pasos.",
      "Todo está integrado en una experiencia limpia y moderna."
    ]
  },
  {
    id: 6,
    badge: "Monetización",
    tagline: "Modelo Freemium: captamos volumen y monetizamos en seguridad legal",
    durationRecommended: "5:30 - 6:15",
    speakerNotes: [
      "Explica el embudo animado: publicar es 100% gratis (captamos miles de inmuebles).",
      "Monetizamos en trámites notariales ($30 a $150 por verificación de Folio Real) y visibilidad VIP.",
      "Ganamos cuando el usuario está protegido, no quitándole comisiones de venta."
    ]
  },
  {
    id: 7,
    badge: "Mercado",
    tagline: "Más de $us 2,500 millones anuales en el eje troncal de Bolivia",
    durationRecommended: "6:15 - 6:45",
    speakerNotes: [
      "Muestra las barras de volumen de La Paz, Santa Cruz y Cochabamba.",
      "Destaca: Las plataformas extranjeras no entienden el anticrético boliviano. InmoVAX domina este nicho."
    ]
  },
  {
    id: 8,
    badge: "Cierre & Demo",
    tagline: "¿Listos para transformar el mercado inmobiliario?",
    durationRecommended: "6:45 - 7:00",
    speakerNotes: [
      "Frase de remate: 'El patrimonio que tomó 20 años en construirse no debe perderse en comisiones de 5 minutos.'",
      "Haz clic en 'Probar Demo en Vivo' y pasa a la sesión de preguntas."
    ]
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
  const [propertyPrice, setPropertyPrice] = useState(140000);
  const [simQueryIndex, setSimQueryIndex] = useState(0);

  const totalSlides = SLIDES.length;
  const slideMeta = SLIDES[currentSlide - 1];

  // Consultas de animación automática para la Diapositiva 4
  const queriesAI = [
    { text: "Departamento en Sopocachi en anticrético menos de $us 45,000", chips: ["Anticrético", "Departamento", "Sopocachi", "< $us 45k"] },
    { text: "Casa en venta en Calacoto con 3 dormitorios y garaje", chips: ["Venta", "Casa", "Calacoto", "3 Dorms", "Parqueo"] },
    { text: "Monoambiente amoblado en Achumani en alquiler", chips: ["Alquiler", "Monoambiente", "Achumani", "Amoblado"] }
  ];

  // Rotación automática de consultas de IA cada 4 segundos si estamos en slide 4
  useEffect(() => {
    if (currentSlide === 4) {
      const qInterval = setInterval(() => {
        setSimQueryIndex(prev => (prev + 1) % queriesAI.length);
      }, 3500);
      return () => clearInterval(qInterval);
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

  // Cálculos dinámicos
  const comisionPromedio = Math.round(propertyPrice * 0.05);
  const comisionAlta = Math.round(propertyPrice * 0.07);

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col justify-between selection:bg-primary selection:text-white font-sans overflow-x-hidden relative">
      
      {/* ESTILOS DE ANIMACIÓN CONTINUA EN MOVIMIENTO REAL (CSS KEYFRAMES) */}
      <style jsx global>{`
        @keyframes floatCash {
          0% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-70px) rotate(15deg) scale(0.85); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(37,99,235,0.3); }
          50% { transform: scale(1.03); box-shadow: 0 0 45px rgba(37,99,235,0.6); }
        }
        @keyframes beamFlow {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scannerMove {
          0%, 100% { transform: translateY(0%); }
          50% { transform: translateY(180%); }
        }
        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes waveBars {
          0%, 100% { height: 15%; }
          50% { height: 95%; }
        }
        .anim-float-1 { animation: floatCash 2.8s infinite ease-out; }
        .anim-float-2 { animation: floatCash 2.8s infinite ease-out 0.9s; }
        .anim-float-3 { animation: floatCash 2.8s infinite ease-out 1.8s; }
        .anim-pulse-glow { animation: pulseGlow 3s infinite ease-in-out; }
        .anim-scanner { animation: scannerMove 2.5s infinite ease-in-out; }
        .anim-orbit { animation: orbitRotate 18s linear infinite; }
        .anim-radar { animation: radarSweep 4s linear infinite; }
      `}</style>

      {/* 1. BARRA SUPERIOR DE CONTROL Y CRONÓMETRO */}
      <header className="w-full bg-black/60 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 sticky top-0 z-50">
        
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

      {/* 2. CONTENIDO PRINCIPAL: 80% GRÁFICAS ANIMADAS Y NÚMEROS DE IMPACTO */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-center">
        
        {/* Titular corto de impacto */}
        <div className="text-center mb-6 space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-primary/30">
            {slideMeta.badge} • {slideMeta.durationRecommended}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {slideMeta.tagline}
          </h1>
        </div>

        {/* ================= SLIDE 1: PORTADA & VISIÓN (RADAR / RED DE NODOS ANIMADA) ================= */}
        {currentSlide === 1 && (
          <div className="space-y-6">
            
            {/* 3 Métricas Gigantes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 text-center space-y-2 anim-pulse-glow">
                <span className="text-5xl sm:text-6xl font-black text-emerald-400 block tracking-tight">
                  0%
                </span>
                <span className="text-sm font-black text-white uppercase tracking-wider block">Comisión Inmobiliaria</span>
                <span className="text-xs text-gray-400 block">Ahorras del 3% al 7% íntegro de tu patrimonio</span>
              </div>

              <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 text-center space-y-2 anim-pulse-glow" style={{ animationDelay: '0.5s' }}>
                <span className="text-5xl sm:text-6xl font-black text-blue-400 block tracking-tight">
                  100%
                </span>
                <span className="text-sm font-black text-white uppercase tracking-wider block">Conexión Directa P2P</span>
                <span className="text-xs text-gray-400 block">Propietario a comprador vía chat y WhatsApp</span>
              </div>

              <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 text-center space-y-2 anim-pulse-glow" style={{ animationDelay: '1s' }}>
                <span className="text-5xl sm:text-6xl font-black text-amber-400 block tracking-tight">
                  DDRR
                </span>
                <span className="text-sm font-black text-white uppercase tracking-wider block">Blindaje con Folio Real</span>
                <span className="text-xs text-gray-400 block">Auditoría notarial contra estafas y gravámenes</span>
              </div>
            </div>

            {/* Gráfica animada de Red de Ciudades en Bolivia */}
            <div className="relative bg-black/50 border border-white/10 rounded-3xl p-6 h-48 flex items-center justify-around overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15),transparent_70%)]" />
              
              {/* Nodos con pulsaciones */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border-2 border-blue-400 flex items-center justify-center font-black text-white shadow-lg animate-pulse">
                  LPZ
                </div>
                <span className="text-xs font-bold text-blue-200">La Paz / El Alto</span>
              </div>

              {/* Rayo de luz animado en el centro */}
              <div className="relative z-10 flex-1 max-w-xs h-1 bg-gray-800 rounded-full mx-4 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400 rounded-full animate-pulse w-full" />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center font-black text-white shadow-lg animate-pulse" style={{ animationDelay: '0.4s' }}>
                  CBBA
                </div>
                <span className="text-xs font-bold text-emerald-200">Cochabamba</span>
              </div>

              <div className="relative z-10 flex-1 max-w-xs h-1 bg-gray-800 rounded-full mx-4 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-blue-500 rounded-full animate-pulse w-full" style={{ animationDelay: '0.7s' }} />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-600/30 border-2 border-amber-400 flex items-center justify-center font-black text-white shadow-lg animate-pulse" style={{ animationDelay: '0.8s' }}>
                  SCZ
                </div>
                <span className="text-xs font-bold text-amber-200">Santa Cruz</span>
              </div>
            </div>

          </div>
        )}

        {/* ================= SLIDE 2: EL PROBLEMA (FUGA DE DINERO EN MOVIMIENTO REAL) ================= */}
        {currentSlide === 2 && (
          <div className="space-y-6">
            
            {/* Slider de precio interactivo */}
            <div className="bg-black/60 border border-white/15 rounded-3xl p-5 max-w-xl mx-auto flex items-center gap-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">
                Precio de Casa:
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
              <span className="text-lg font-black text-emerald-400 shrink-0">
                ${propertyPrice.toLocaleString()} USD
              </span>
            </div>

            {/* COMPARATIVA ANIMADA EN MOVIMIENTO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* Lado Rojo: La Fuga de Dinero con animaciones de billetes subiendo */}
              <div className="bg-red-950/30 border-2 border-red-500/40 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                
                {/* Elementos flotantes animados (Billetes fugándose) */}
                <div className="absolute right-6 top-8 pointer-events-none">
                  <span className="text-red-400 text-lg font-black anim-float-1 block">-$3,500</span>
                  <span className="text-red-400 text-lg font-black anim-float-2 block">-$7,000</span>
                  <span className="text-red-400 text-xl font-black anim-float-3 block">-$10,500</span>
                </div>

                <div>
                  <span className="text-xs font-black uppercase text-red-400 tracking-wider flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
                    Modelo Tradicional: Dinero Confiscado
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-red-400">
                    - ${comisionPromedio.toLocaleString()} USD
                  </div>
                  <span className="text-xs text-red-300 font-semibold block mt-1">
                    (Entre ${Math.round(propertyPrice * 0.03).toLocaleString()} y ${comisionAlta.toLocaleString()} en comisiones)
                  </span>
                </div>

                {/* Barra de desangrado animada */}
                <div className="space-y-1.5 pt-6">
                  <div className="h-6 w-full bg-gray-900 rounded-full overflow-hidden p-1 border border-red-500/30">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (comisionAlta / 21000) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 block text-right font-mono">
                    Pérdida irreversible del patrimonio familiar
                  </span>
                </div>
              </div>

              {/* Lado Verde: Retención Total InmoVAX */}
              <div className="bg-emerald-950/30 border-2 border-emerald-500/50 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between anim-pulse-glow">
                <div>
                  <span className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Modelo InmoVAX: Patrimonio Intacto
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-400">
                    $0 en comisiones
                  </div>
                  <span className="text-xs text-emerald-300 font-semibold block mt-1">
                    Ahorras el 100% del valor de tu propiedad
                  </span>
                </div>

                {/* Barra 100% protegida */}
                <div className="space-y-1.5 pt-6">
                  <div className="h-6 w-full bg-gray-900 rounded-full overflow-hidden p-1 border border-emerald-500/30">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full" />
                  </div>
                  <span className="text-[11px] text-emerald-400 block text-right font-black font-mono">
                    100% protegido para tu familia
                  </span>
                </div>
              </div>

            </div>

            {/* Alerta de riesgo en anticréticos */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-red-200">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 font-black">
                !
              </div>
              <span>
                <strong>El peligro del anticrético tradicional en Bolivia:</strong> 6 de cada 10 contratos no se registran en Derechos Reales. Si el propietario tiene deudas ocultas, el inquilino pierde todos sus ahorros.
              </span>
            </div>

          </div>
        )}

        {/* ================= SLIDE 3: LA SOLUCIÓN (ESCÁNER LÁSER Y RAYOS DE CONEXIÓN) ================= */}
        {currentSlide === 3 && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* Visual 1: El Escáner Notarial en Movimiento */}
              <div className="bg-black/60 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Auditoría Digital de Derechos Reales
                </span>

                {/* Documento virtual con línea de escáner láser animada */}
                <div className="relative my-4 bg-white/5 border border-white/20 rounded-2xl p-4 h-44 flex flex-col justify-between overflow-hidden">
                  
                  {/* Línea verde de escáner en movimiento continuo */}
                  <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] anim-scanner z-20" />

                  <div className="flex justify-between items-center border-b border-white/10 pb-2 text-[11px] font-mono text-gray-400">
                    <span>FOLIO REAL MATRÍCULA: 2.01.0.99.0018472</span>
                    <span className="text-emerald-400 font-bold">ESCANEO ACTIVO</span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-gray-300">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Titularidad legítima confirmada en DDRR
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Sin gravámenes, embargos ni hipotecas ocultas
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Protocolización con Notario de Fe Pública
                    </p>
                  </div>

                  <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl px-3 py-1 text-center">
                    <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                      Sello: Contrato 100% Blindado
                    </span>
                  </div>
                </div>

                <span className="text-xs text-gray-400">
                  Protegemos el 100% del capital entregado en anticrético o compraventa.
                </span>
              </div>

              {/* Visual 2: Conexión Directa en Rayos */}
              <div className="bg-black/60 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Conexión Inmediata Comprador - Propietario
                </span>

                <div className="my-6 flex items-center justify-between gap-3 text-center">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                    <Home className="w-8 h-8 text-primary mx-auto" />
                    <span className="text-xs font-black block">Propietario</span>
                    <span className="text-[10px] text-gray-400 block">Publica gratis</span>
                  </div>

                  {/* Flecha de conexión animada */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">0% Comisión</span>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full my-1 animate-pulse" />
                    <span className="text-[10px] text-gray-400">Chat / WhatsApp</span>
                  </div>

                  <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                    <Users className="w-8 h-8 text-emerald-400 mx-auto" />
                    <span className="text-xs font-black block">Comprador</span>
                    <span className="text-[10px] text-gray-400 block">Trato directo</span>
                  </div>
                </div>

                <span className="text-xs text-gray-400">
                  Sin agentes intermediando ni manipulando los precios.
                </span>
              </div>

            </div>

          </div>
        )}

        {/* ================= SLIDE 4: IA EN VIVO (ANIMACIÓN AUTOMÁTICA DE CONSULTAS Y CHIPS) ================= */}
        {currentSlide === 4 && (
          <div className="space-y-6">
            
            {/* Pantalla de Terminal Inteligente */}
            <div className="bg-gray-950 border-2 border-primary/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden anim-pulse-glow">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono">
                <span className="text-primary font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary animate-spin" />
                  MOTOR NLP INMOVAX • PROCESAMIENTO EN TIEMPO REAL
                </span>
                <span className="text-emerald-400 font-black animate-pulse">EN VIVO</span>
              </div>

              {/* Frase animada cambiante */}
              <div className="py-6">
                <span className="text-xs text-gray-400 font-bold block mb-2 uppercase tracking-wider">
                  El usuario escribe en lenguaje natural:
                </span>
                <div className="text-lg sm:text-2xl md:text-3xl font-black text-white bg-black/60 p-4 rounded-2xl border border-white/10 min-h-[4.5rem] flex items-center">
                  <span>"{queriesAI[simQueryIndex].text}"</span>
                </div>
              </div>

              {/* Chips que se encienden al instante */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  La Inteligencia Artificial desglosa al milisegundo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {queriesAI[simQueryIndex].chips.map((chip, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-primary/20 border-2 border-primary text-blue-300 text-xs sm:text-sm font-black shadow-lg shadow-primary/20 transition-all animate-bounce"
                      style={{ animationDuration: `${1 + idx * 0.2}s` }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Barra de Ondas de Sonido / IA en Movimiento */}
              <div className="pt-6 flex items-center justify-between gap-1 h-8 opacity-70">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-primary to-emerald-400 rounded-full"
                    style={{
                      animation: `waveBars ${0.8 + (i % 5) * 0.2}s ease-in-out infinite`,
                      animationDelay: `${(i % 6) * 0.15}s`
                    }}
                  />
                ))}
              </div>

            </div>

            {/* InmoBot Gemini */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-gray-300">
              <span className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400 shrink-0" />
                <strong>InmoBot con Gemini Flash:</strong> Asesoría jurídica boliviana 24/7 sin emojis y con estricto rigor profesional.
              </span>
              <span className="text-emerald-400 font-mono font-bold">&lt; 1.5 seg</span>
            </div>

          </div>
        )}

        {/* ================= SLIDE 5: ECOSISTEMA (NÚCLEO ORBITAL EN MOVIMIENTO) ================= */}
        {currentSlide === 5 && (
          <div className="space-y-6">
            
            {/* 4 Satélites */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="bg-white/5 border-2 border-blue-500/40 rounded-3xl p-5 text-center space-y-2 anim-pulse-glow">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-black text-white text-sm">Búsqueda IA</h3>
                <p className="text-[11px] text-gray-400">Lenguaje natural en segundos</p>
              </div>

              <div className="bg-white/5 border-2 border-emerald-500/40 rounded-3xl p-5 text-center space-y-2 anim-pulse-glow" style={{ animationDelay: '0.4s' }}>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="font-black text-white text-sm">InmoBot</h3>
                <p className="text-[11px] text-gray-400">Asesor legal boliviano 24/7</p>
              </div>

              <div className="bg-white/5 border-2 border-amber-500/40 rounded-3xl p-5 text-center space-y-2 anim-pulse-glow" style={{ animationDelay: '0.8s' }}>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-black text-white text-sm">Foro Comunitario</h3>
                <p className="text-[11px] text-gray-400">Dudas reales de anticréticos</p>
              </div>

              <div className="bg-white/5 border-2 border-purple-500/40 rounded-3xl p-5 text-center space-y-2 anim-pulse-glow" style={{ animationDelay: '1.2s' }}>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="font-black text-white text-sm">Registro en 3 Pasos</h3>
                <p className="text-[11px] text-gray-400">Sin trabas ni datos absurdos</p>
              </div>

            </div>

            {/* Núcleo de Tecnología Central */}
            <div className="bg-gradient-to-r from-blue-900/30 via-primary/20 to-emerald-900/30 border border-primary/30 rounded-3xl p-6 text-center space-y-2">
              <span className="text-xs font-black text-blue-300 uppercase tracking-widest block">
                Arquitectura de Última Generación
              </span>
              <p className="text-lg font-black text-white">
                Next.js 16 Turbopack • Bun Engine • Supabase PostgreSQL • Google Gemini Flash
              </p>
              <span className="text-xs text-gray-400 block font-mono">
                Tiempos de carga &lt; 0.5s en conexiones móviles bolivianas
              </span>
            </div>

          </div>
        )}

        {/* ================= SLIDE 6: MODELO DE NEGOCIO (EMBUDO Y TARIFAS NOTARIALES) ================= */}
        {currentSlide === 6 && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-stretch">
              
              {/* Nivel 1 */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider block">Entrada Masiva</span>
                  <div className="text-4xl font-black text-white my-2">$0</div>
                  <span className="text-sm font-extrabold text-emerald-400 block">Publicación Gratuita P2P</span>
                  <p className="text-xs text-gray-400 mt-2">
                    Efecto de red: captamos el 80% de propiedades que huyen de inmobiliarias.
                  </p>
                </div>
                <div className="h-1.5 w-full bg-emerald-500/40 rounded-full" />
              </div>

              {/* Nivel 2: Principal Motor de Ingresos */}
              <div className="bg-primary/20 border-2 border-primary rounded-3xl p-6 space-y-3 flex flex-col justify-between anim-pulse-glow">
                <div>
                  <span className="text-xs font-black text-blue-300 uppercase tracking-wider block">Principal Monetización</span>
                  <div className="text-4xl font-black text-primary my-2">$30 - $150</div>
                  <span className="text-sm font-extrabold text-white block">Servicios Notariales y DDRR</span>
                  <p className="text-xs text-blue-100 mt-2">
                    Verificación de Folio Real, redacción de minutas de anticrético y firma notarial.
                  </p>
                </div>
                <div className="h-2 w-full bg-primary rounded-full" />
              </div>

              {/* Nivel 3 */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider block">Urgencia de Cierre</span>
                  <div className="text-4xl font-black text-amber-400 my-2">$15 - $45</div>
                  <span className="text-sm font-extrabold text-amber-300 block">Exposición Destacada VIP</span>
                  <p className="text-xs text-gray-400 mt-2">
                    Prioridad en el algoritmo de IA y mayor volumen de consultas por WhatsApp.
                  </p>
                </div>
                <div className="h-1.5 w-full bg-amber-500/40 rounded-full" />
              </div>

            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center text-xs text-gray-300">
              <strong>Alineación ética total:</strong> InmoVAX no se queda con el 5% de tu casa. Cobramos por el servicio legal que te da tranquilidad.
            </div>

          </div>
        )}

        {/* ================= SLIDE 7: MERCADO BOLIVIANO (BARRAS DE CRECIMIENTO EN MOVIMIENTO) ================= */}
        {currentSlide === 7 && (
          <div className="space-y-6">
            
            {/* Gráfica de Barras Dinámica del Eje Troncal */}
            <div className="bg-black/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-blue-400">SANTA CRUZ • Mayor volumen de compraventa</span>
                  <span>$us 1,100 Millones / año</span>
                </div>
                <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden p-0.5 border border-blue-500/30">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full w-[85%] animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-emerald-400">LA PAZ / EL ALTO • Capital del Anticrético</span>
                  <span>$us 950 Millones / año</span>
                </div>
                <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden p-0.5 border border-emerald-500/30">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full w-[75%] animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-amber-400">COCHABAMBA • Crecimiento urbano vertical</span>
                  <span>$us 520 Millones / año</span>
                </div>
                <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden p-0.5 border border-amber-500/30">
                  <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full w-[45%] animate-pulse" style={{ animationDelay: '0.6s' }} />
                </div>
              </div>

            </div>

            {/* Número Total de Mercado */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/30 to-blue-950/30 border border-emerald-500/30 text-center">
              <span className="text-xs uppercase font-black text-emerald-400 tracking-wider block">
                Mercado Total Accesible (TAM)
              </span>
              <span className="text-3xl sm:text-4xl font-black text-white">
                +$us 2,500,000,000 Anuales
              </span>
            </div>

          </div>
        )}

        {/* ================= SLIDE 8: CIERRE & DEMO EN VIVO ================= */}
        {currentSlide === 8 && (
          <div className="space-y-8 text-center max-w-3xl mx-auto">
            
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary via-blue-500 to-emerald-400 text-white flex items-center justify-center mx-auto shadow-2xl anim-pulse-glow">
              <Sparkles className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">
                La Oportunidad es Ahora
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                El futuro de los bienes raíces en Bolivia se llama <span className="text-primary">InmoVAX</span>
              </h2>
            </div>

            {/* BOTÓN GIGANTE A DEMO EN VIVO */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#buscador-principal"
                target="_blank"
                className="w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white font-black text-base uppercase tracking-wider rounded-full shadow-2xl shadow-primary/50 transition-all flex items-center justify-center gap-3 anim-pulse-glow cursor-pointer"
              >
                <span>Probar Buscador con IA en Vivo</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>

              <Link
                href="/foro"
                target="_blank"
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-amber-300" />
                <span>Ver Foro Comunitario</span>
              </Link>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Gracias por su atención. Comenzamos con la sesión de preguntas.
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
      <footer className="w-full bg-black/60 border-t border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 sticky bottom-0 z-50">
        
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

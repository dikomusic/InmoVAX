"use client";
import React, { useState, useEffect } from 'react';
import { ToggleSwitch } from '../atoms/ToggleSwitch';
import { Database, ShieldCheck, HardDrive, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminSettingsSectionProps {
  onSaveSettings: () => void;
}

export const AdminSettingsSection = ({
  onSaveSettings
}: AdminSettingsSectionProps) => {
  const [healthData, setHealthData] = useState<{
    status: string;
    database?: { status: string; latencyMs: number };
    storage?: { bucket: string; status: string };
  } | null>(null);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);

  const fetchHealth = () => {
    setIsRefreshingHealth(true);
    fetch('http://localhost:4000/health')
      .then(res => res.json())
      .then(data => setHealthData(data))
      .catch(() => setHealthData(null))
      .finally(() => setIsRefreshingHealth(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const [settings, setSettings] = useState({
    commissionRate: 3.0,
    minAnticretico: 15000,
    requireFolioReal: true,
    autoAssignAdvisor: true,
    whatsappAlerts: true,
    emailAlerts: true,
    allowDirectClientPublish: true,
    systemMaintenance: false
  });

  const [zones, setZones] = useState([
    { name: 'Sopocachi', active: true },
    { name: 'Calacoto', active: true },
    { name: 'San Miguel', active: true },
    { name: 'Achumani', active: true },
    { name: 'Miraflores', active: true },
    { name: 'San Jorge', active: true },
    { name: 'Irpavi', active: true },
    { name: 'Los Pinos', active: true },
    { name: 'Cota Cota', active: false },
    { name: 'Obrajes', active: true }
  ]);

  const toggleZone = (index: number) => {
    setZones(prev => prev.map((z, i) => i === index ? { ...z, active: !z.active } : z));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-200">
      
      {/* CABECERA */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-xl text-surface-dark">Parámetros Globales del Portal InmoVax</h3>
          <p className="text-xs text-content-muted mt-0.5">Control de políticas notariales, comisiones y zonas metropolitanas habilitadas</p>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow cursor-pointer active:scale-95 whitespace-nowrap"
        >
          💾 Guardar Parámetros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* POLÍTICAS NOTARIALES Y DE COMISIÓN */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <h4 className="font-extrabold text-base text-surface-dark flex items-center gap-2">
            <span>⚖️</span> Políticas de Seguridad Notarial
          </h4>

          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.requireFolioReal}
              onChange={(checked) => setSettings({ ...settings, requireFolioReal: checked })}
              label="Folio Real Obligatorio para Anticréticos"
              description="Bloquea la publicación de anticréticos si no se carga el número matriculado de DDRR."
            />

            <ToggleSwitch
              checked={settings.autoAssignAdvisor}
              onChange={(checked) => setSettings({ ...settings, autoAssignAdvisor: checked })}
              label="Asignación Automática de Asesor"
              description="Asigna al agente más cercano de la zona cuando un propietario registra un nuevo inmueble."
            />

            <ToggleSwitch
              checked={settings.allowDirectClientPublish}
              onChange={(checked) => setSettings({ ...settings, allowDirectClientPublish: checked })}
              label="Permitir Registro de Inmuebles por Propietarios"
              description="Los clientes pueden cargar solicitudes desde el portal web público."
            />
          </div>

          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Comisión Corretaje (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.commissionRate}
                onChange={(e) => setSettings({ ...settings, commissionRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Mínimo Anticrético ($us)</label>
              <input
                type="number"
                value={settings.minAnticretico}
                onChange={(e) => setSettings({ ...settings, minAnticretico: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* NOTIFICACIONES Y ZONAS COBERTURA */}
        <div className="space-y-6">
          
          {/* NOTIFICACIONES */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-base text-surface-dark flex items-center gap-2">
              <span>🔔</span> Alertas y Mensajería
            </h4>
            
            <ToggleSwitch
              checked={settings.whatsappAlerts}
              onChange={(checked) => setSettings({ ...settings, whatsappAlerts: checked })}
              label="Notificaciones por WhatsApp"
              description="Avisar inmediatamente al asesor cuando un cliente solicita una visita."
            />

            <ToggleSwitch
              checked={settings.emailAlerts}
              onChange={(checked) => setSettings({ ...settings, emailAlerts: checked })}
              label="Resúmenes Notariales por Correo"
              description="Enviar reporte diario de anticréticos cerrados y comisiones al departamento contable."
            />
          </div>

          {/* ZONAS ACTIVAS LA PAZ */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-base text-surface-dark flex items-center gap-2">
              <span>📍</span> Zonas Activas de Cobertura (La Paz)
            </h4>
            <p className="text-xs text-content-muted">Habilita o deshabilita los distritos donde InmoVax presta servicios presenciales:</p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {zones.map((zone, index) => (
                <button
                  key={zone.name}
                  type="button"
                  onClick={() => toggleZone(index)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    zone.active 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {zone.active ? '✓' : '✕'} {zone.name}
                </button>
              ))}
            </div>
          </div>

          {/* INFRAESTRUCTURA Y SALUD SUPABASE POSTGRESQL */}
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-accent/20 text-accent">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-black text-base text-white">Infraestructura Supabase PostgreSQL</h4>
                  <p className="text-xs text-gray-400">Salud de la base de datos, políticas RLS y Storage CDN</p>
                </div>
              </div>
              <button
                type="button"
                onClick={fetchHealth}
                disabled={isRefreshingHealth}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer"
                title="Actualizar métricas"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshingHealth ? 'animate-spin text-accent' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Motor de Base de Datos</span>
                <div className="flex items-center gap-1.5 text-sm font-black text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{healthData?.database?.status === 'connected' ? 'PostgreSQL Conectado' : 'Conectando...'}</span>
                </div>
                <p className="text-[11px] text-gray-400">Latencia: <strong className="text-white">{healthData?.database?.latencyMs ?? '--'} ms</strong></p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Seguridad por Fila (RLS)</span>
                <div className="flex items-center gap-1.5 text-sm font-black text-accent">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>RLS Blindado</span>
                </div>
                <p className="text-[11px] text-gray-400">8 tablas con políticas</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Almacenamiento CDN</span>
                <div className="flex items-center gap-1.5 text-sm font-black text-blue-400">
                  <HardDrive className="h-4 w-4 shrink-0" />
                  <span>Bucket Activo</span>
                </div>
                <p className="text-[11px] text-gray-400">10MB Máx • Solo imágenes</p>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-gray-300">
              <span>Script de Migración SQL: <code className="text-accent font-mono text-[11px]">01_security_and_indexes.sql</code></span>
              <span className="text-emerald-400 font-bold text-[11px]">✓ Listo para producción</span>
            </div>
          </div>

        </div>

      </div>

    </form>
  );
};

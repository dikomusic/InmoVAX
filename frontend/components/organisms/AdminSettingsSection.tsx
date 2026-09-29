"use client";
import React, { useState, useEffect } from 'react';
import { ToggleSwitch } from '../atoms/ToggleSwitch';
import { SettingsCard } from '../molecules/SettingsCard';
import {
  QrCode,
  Building2,
  PhoneCall,
  Mail,
  Clock,
  Scale,
  Bell,
  MapPin,
  Database,
  ShieldCheck,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  Save,
  Check,
  X,
  ExternalLink,
  Layers
} from 'lucide-react';
import {
  fetchPlatformSettings,
  updatePlatformSettings,
  togglePlatformZone,
  PlatformSettings,
  PlatformZone
} from '@/lib/settingsApi';

interface AdminSettingsSectionProps {
  onSaveSettings?: () => void;
}

export const AdminSettingsSection = ({
  onSaveSettings
}: AdminSettingsSectionProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Estado de configuración
  const [settings, setSettings] = useState<PlatformSettings>({
    id: 1,
    bankName: 'Banco Mercantil Santa Cruz',
    bankAccountNumber: '4010-8923-01-92',
    bankAccountHolder: 'InmoVAX Soluciones Inmobiliarias S.R.L.',
    bankAccountType: 'Caja de Ahorro M/E',
    bankAccountIdNumber: '3049581028 (NIT)',
    qrImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
    supportWhatsapp: '+591 77201928',
    supportEmail: 'contacto@inmovax.com',
    supportHours: 'Lunes a Sábado de 08:30 a 19:00',
    listingDurationDays: 60,
    commissionRate: 3.0,
    minAnticreticoAmount: 15000,
    requireFolioReal: true,
    autoAssignAdvisor: true,
    allowDirectClientPublish: true,
    notifyWhatsappAlerts: true,
    notifyEmailSummaries: true,
    systemMaintenance: false
  });

  // Estado de zonas de cobertura
  const [zones, setZones] = useState<PlatformZone[]>([]);

  // Estado de diagnóstico de salud backend
  const [healthData, setHealthData] = useState<{
    status: string;
    database?: { status: string; latencyMs: number };
    storage?: { bucket: string; status: string };
  } | null>(null);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);

  // Carga de datos iniciales desde backend
  useEffect(() => {
    loadSettings();
    fetchHealth();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const res = await fetchPlatformSettings();
    if (res) {
      setSettings(res.settings);
      setZones(res.zones);
    }
    setLoading(false);
  };

  const fetchHealth = () => {
    setIsRefreshingHealth(true);
    fetch('http://localhost:4000/health')
      .then(res => res.json())
      .then(data => setHealthData(data))
      .catch(() => setHealthData(null))
      .finally(() => setIsRefreshingHealth(false));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    const res = await updatePlatformSettings(settings);
    setSaving(false);
    if (res.success) {
      setFeedback('Parámetros guardados correctamente en la base de datos.');
      if (onSaveSettings) onSaveSettings();
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback(res.message || 'Error al guardar los parámetros.');
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleToggleZone = async (zone: PlatformZone) => {
    const nextState = !zone.isActive;
    setZones(prev => prev.map(z => z.id === zone.id ? { ...z, isActive: nextState } : z));
    await togglePlatformZone(zone.id, nextState);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* CABECERA PRINCIPAL CON ESTADO Y BOTÓN DE GUARDADO */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-xl text-surface-dark tracking-tight">Configuración del Sistema</h2>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Panel Maestro
            </span>
          </div>
          <p className="text-xs text-content-muted mt-1">
            Gestión global de pagos QR, canales oficiales de soporte, políticas notariales y zonas metropolitanas.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {feedback && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{feedback}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECCIÓN 1: CUENTA BANCARIA Y QR OFICIAL */}
        <SettingsCard
          icon={QrCode}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          title="Cuenta Bancaria y QR Oficial de Cobros"
          description="Información que visualizan los propietarios para el pago de planes publicitarios"
        >
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
            {/* Visualizador QR */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-white border border-gray-200 p-2 shadow-xs flex items-center justify-center overflow-hidden">
                {settings.qrImageUrl ? (
                  <img
                    src={settings.qrImageUrl}
                    alt="QR Oficial de Recaudación"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 text-center p-2">
                    <QrCode className="w-8 h-8" />
                    <span className="text-[10px] mt-1">Sin QR asignado</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">QR de Recaudación</span>
            </div>

            {/* Campos de Cuenta */}
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">Entidad Bancaria</label>
                <input
                  type="text"
                  value={settings.bankName}
                  onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                  placeholder="Ej. Banco Mercantil Santa Cruz"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">N° de Cuenta</label>
                  <input
                    type="text"
                    value={settings.bankAccountNumber}
                    onChange={(e) => setSettings({ ...settings, bankAccountNumber: e.target.value })}
                    placeholder="4010-XXXX-XX"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">Tipo de Cuenta</label>
                  <input
                    type="text"
                    value={settings.bankAccountType}
                    onChange={(e) => setSettings({ ...settings, bankAccountType: e.target.value })}
                    placeholder="Caja de Ahorro / Corriente"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">Titular de la Cuenta</label>
              <input
                type="text"
                value={settings.bankAccountHolder}
                onChange={(e) => setSettings({ ...settings, bankAccountHolder: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">CI / NIT del Titular</label>
              <input
                type="text"
                value={settings.bankAccountIdNumber}
                onChange={(e) => setSettings({ ...settings, bankAccountIdNumber: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">URL de la Imagen QR Oficial</label>
            <input
              type="url"
              value={settings.qrImageUrl}
              onChange={(e) => setSettings({ ...settings, qrImageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 focus:border-primary outline-none"
            />
          </div>
        </SettingsCard>

        {/* SECCIÓN 2: CANALES OFICIALES DE SOPORTE */}
        <SettingsCard
          icon={PhoneCall}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          title="Canales Oficiales de Contacto y Atención"
          description="Canales enlazados a botones flotantes y soporte notarial de InmoVAX"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>WhatsApp de Soporte Notarial</span>
                {settings.supportWhatsapp && (
                  <a
                    href={`https://wa.me/${settings.supportWhatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-600 hover:underline inline-flex items-center gap-1 font-bold"
                  >
                    <span>Probar enlace</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.supportWhatsapp}
                  onChange={(e) => setSettings({ ...settings, supportWhatsapp: e.target.value })}
                  placeholder="+591 77201928"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">Correo Electrónico Oficial</label>
              <div className="relative">
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  placeholder="contacto@inmovax.com"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">Horarios de Atención Notarial</label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.supportHours}
                  onChange={(e) => setSettings({ ...settings, supportHours: e.target.value })}
                  placeholder="Lunes a Sábado de 08:30 a 19:00"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <ToggleSwitch
                checked={settings.notifyWhatsappAlerts}
                onChange={(checked) => setSettings({ ...settings, notifyWhatsappAlerts: checked })}
                label="Alertas Automáticas por WhatsApp"
                description="Enviar notificación inmediata al asesor ante nuevas consultas o visitas registradas."
              />
            </div>
          </div>
        </SettingsCard>

        {/* SECCIÓN 3: POLÍTICAS NOTARIALES Y DE OPERACIÓN */}
        <SettingsCard
          icon={Scale}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          title="Políticas Operativas y Notariales"
          description="Reglas de validación jurídica y montos mínimos de negociación"
        >
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.requireFolioReal}
              onChange={(checked) => setSettings({ ...settings, requireFolioReal: checked })}
              label="Folio Real Obligatorio para Anticréticos"
              description="Exige el número computarizado de Derechos Reales antes de permitir la publicación."
            />

            <ToggleSwitch
              checked={settings.autoAssignAdvisor}
              onChange={(checked) => setSettings({ ...settings, autoAssignAdvisor: checked })}
              label="Asignación Automática de Asesor Legal"
              description="Asigna automáticamente al asesor inmobiliario certificado según la zona del inmueble."
            />

            <ToggleSwitch
              checked={settings.allowDirectClientPublish}
              onChange={(checked) => setSettings({ ...settings, allowDirectClientPublish: checked })}
              label="Permitir Registro Directo a Propietarios"
              description="Permite que vendedores particulares publiquen tras abonar su plan QR."
            />
          </div>

          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">Comisión (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={settings.commissionRate}
                onChange={(e) => setSettings({ ...settings, commissionRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-extrabold focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">Mín. Anticrético ($us)</label>
              <input
                type="number"
                step="500"
                min="1000"
                value={settings.minAnticreticoAmount}
                onChange={(e) => setSettings({ ...settings, minAnticreticoAmount: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-extrabold focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">Vigencia (Días)</label>
              <input
                type="number"
                min="15"
                value={settings.listingDurationDays}
                onChange={(e) => setSettings({ ...settings, listingDurationDays: parseInt(e.target.value, 10) || 30 })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-extrabold focus:border-primary outline-none"
              />
            </div>
          </div>
        </SettingsCard>

        {/* SECCIÓN 4: ZONAS METROPOLITANAS (3NF) */}
        <SettingsCard
          icon={MapPin}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          title="Zonas de Cobertura Metropolitana"
          description="Control de distritos y ciudades habilitadas en el buscador (Tabla normalizada platform_zones)"
        >
          <div className="space-y-4">
            <p className="text-xs text-content-muted leading-relaxed">
              Haz clic sobre cualquier zona para activarla o desactivarla en tiempo real para todos los buscadores y filtros del portal:
            </p>

            <div className="flex flex-wrap gap-2">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => handleToggleZone(zone)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    zone.isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {zone.isActive ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  )}
                  <span>{zone.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${zone.isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {zone.city}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </SettingsCard>
      </div>

      {/* SECCIÓN 5: SALUD DE INFRAESTRUCTURA SUPABASE POSTGRESQL */}
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-accent/20 text-accent shrink-0">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Infraestructura y Normalización de Base de Datos</h3>
              <p className="text-xs text-gray-400">PostgreSQL en Supabase • Tercera Forma Normal (3NF) • Row Level Security</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchHealth}
            disabled={isRefreshingHealth}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshingHealth ? 'animate-spin text-accent' : ''}`} />
            <span>Verificar Latencia</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Motor Relacional</span>
            <div className="flex items-center gap-2 text-sm font-black text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{healthData?.database?.status === 'connected' ? 'PostgreSQL Conectado' : 'Conectando...'}</span>
            </div>
            <p className="text-xs text-gray-300">Latencia de red: <strong className="text-accent">{healthData?.database?.latencyMs ?? '--'} ms</strong></p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Seguridad por Fila (RLS)</span>
            <div className="flex items-center gap-2 text-sm font-black text-accent">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Políticas RLS Activas</span>
            </div>
            <p className="text-xs text-gray-300">10 tablas con aislamiento seguro</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Normalización 3NF</span>
            <div className="flex items-center gap-2 text-sm font-black text-blue-400">
              <Layers className="h-4 w-4 shrink-0" />
              <span>Catálogos Normalizados</span>
            </div>
            <p className="text-xs text-gray-300">platform_settings & platform_zones</p>
          </div>
        </div>

        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-300 gap-2">
          <span>Migraciones SQL aplicadas: <code className="text-accent font-mono text-[11px]">01_security_and_indexes.sql</code> y <code className="text-accent font-mono text-[11px]">02_platform_settings.sql</code></span>
          <span className="text-emerald-400 font-bold inline-flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Listo para producción
          </span>
        </div>
      </div>
    </div>
  );
};

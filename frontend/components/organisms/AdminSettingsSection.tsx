"use client";
import React, { useState } from 'react';
import { ToggleSwitch } from '../atoms/ToggleSwitch';

interface AdminSettingsSectionProps {
  onSaveSettings: () => void;
}

export const AdminSettingsSection = ({
  onSaveSettings
}: AdminSettingsSectionProps) => {
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

        </div>

      </div>

    </form>
  );
};

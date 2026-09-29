import { Hono } from 'hono';
import { z } from 'zod';
import { supabase } from '../config/supabase';
import { requireAdmin } from '../middleware/auth';

export const settingsRouter = new Hono();

// Estado en memoria por si Supabase aún no tiene la tabla migrada
let memorySettings = {
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
  systemMaintenance: false,
  updatedAt: new Date().toISOString()
};

let memoryZones = [
  { id: 1, city: 'La Paz', name: 'Sopocachi', isActive: true, displayOrder: 1 },
  { id: 2, city: 'La Paz', name: 'Calacoto', isActive: true, displayOrder: 2 },
  { id: 3, city: 'La Paz', name: 'San Miguel', isActive: true, displayOrder: 3 },
  { id: 4, city: 'La Paz', name: 'Achumani', isActive: true, displayOrder: 4 },
  { id: 5, city: 'La Paz', name: 'Miraflores', isActive: true, displayOrder: 5 },
  { id: 6, city: 'La Paz', name: 'San Jorge', isActive: true, displayOrder: 6 },
  { id: 7, city: 'La Paz', name: 'Irpavi', isActive: true, displayOrder: 7 },
  { id: 8, city: 'La Paz', name: 'Los Pinos', isActive: true, displayOrder: 8 },
  { id: 9, city: 'La Paz', name: 'Cota Cota', isActive: false, displayOrder: 9 },
  { id: 10, city: 'La Paz', name: 'Obrajes', isActive: true, displayOrder: 10 },
  { id: 11, city: 'El Alto', name: 'Ciudad Satélite', isActive: true, displayOrder: 11 },
  { id: 12, city: 'Cochabamba', name: 'Zona Norte', isActive: true, displayOrder: 12 },
  { id: 13, city: 'Santa Cruz', name: 'Equipetrol', isActive: true, displayOrder: 13 }
];

/**
 * GET /api/settings: Obtener configuración global de la plataforma
 */
settingsRouter.get('/', async (c) => {
  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) {
      return c.json({
        success: true,
        source: 'memory',
        settings: memorySettings,
        zones: memoryZones
      });
    }

    const formattedSettings = {
      id: data.id,
      bankName: data.bank_name,
      bankAccountNumber: data.bank_account_number,
      bankAccountHolder: data.bank_account_holder,
      bankAccountType: data.bank_account_type,
      bankAccountIdNumber: data.bank_account_id_number,
      qrImageUrl: data.qr_image_url,
      supportWhatsapp: data.support_whatsapp,
      supportEmail: data.support_email,
      supportHours: data.support_hours,
      listingDurationDays: data.listing_duration_days,
      commissionRate: Number(data.commission_rate),
      minAnticreticoAmount: Number(data.min_anticretico_amount),
      requireFolioReal: data.require_folio_real,
      autoAssignAdvisor: data.auto_assign_advisor,
      allowDirectClientPublish: data.allow_direct_client_publish,
      notifyWhatsappAlerts: data.notify_whatsapp_alerts,
      notifyEmailSummaries: data.notify_email_summaries,
      systemMaintenance: data.system_maintenance,
      updatedAt: data.updated_at
    };

    // Obtener zonas
    const { data: dbZones } = await supabase
      .from('platform_zones')
      .select('*')
      .order('display_order', { ascending: true });

    const zones = dbZones && dbZones.length > 0
      ? dbZones.map((z: any) => ({
          id: z.id,
          city: z.city,
          name: z.name,
          isActive: z.is_active,
          displayOrder: z.display_order
        }))
      : memoryZones;

    return c.json({
      success: true,
      source: 'database',
      settings: formattedSettings,
      zones
    });
  } catch (err: any) {
    return c.json({
      success: true,
      source: 'memory_fallback',
      settings: memorySettings,
      zones: memoryZones
    });
  }
});

const updateSettingsSchema = z.object({
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountHolder: z.string().optional(),
  bankAccountType: z.string().optional(),
  bankAccountIdNumber: z.string().optional(),
  qrImageUrl: z.string().optional(),
  supportWhatsapp: z.string().optional(),
  supportEmail: z.string().email().optional(),
  supportHours: z.string().optional(),
  listingDurationDays: z.number().int().positive().optional(),
  commissionRate: z.number().nonnegative().optional(),
  minAnticreticoAmount: z.number().nonnegative().optional(),
  requireFolioReal: z.boolean().optional(),
  autoAssignAdvisor: z.boolean().optional(),
  allowDirectClientPublish: z.boolean().optional(),
  notifyWhatsappAlerts: z.boolean().optional(),
  notifyEmailSummaries: z.boolean().optional(),
  systemMaintenance: z.boolean().optional()
});

/**
 * PATCH /api/settings: Actualizar parámetros globales de la plataforma
 * Blindaje: Requiere privilegios estrictos de Super Administrador (role_id 4)
 */
settingsRouter.patch('/', requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const validated = updateSettingsSchema.parse(body);

    // Mapeo snake_case para PostgreSQL
    const dbPayload: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (validated.bankName !== undefined) dbPayload.bank_name = validated.bankName;
    if (validated.bankAccountNumber !== undefined) dbPayload.bank_account_number = validated.bankAccountNumber;
    if (validated.bankAccountHolder !== undefined) dbPayload.bank_account_holder = validated.bankAccountHolder;
    if (validated.bankAccountType !== undefined) dbPayload.bank_account_type = validated.bankAccountType;
    if (validated.bankAccountIdNumber !== undefined) dbPayload.bank_account_id_number = validated.bankAccountIdNumber;
    if (validated.qrImageUrl !== undefined) dbPayload.qr_image_url = validated.qrImageUrl;
    if (validated.supportWhatsapp !== undefined) dbPayload.support_whatsapp = validated.supportWhatsapp;
    if (validated.supportEmail !== undefined) dbPayload.support_email = validated.supportEmail;
    if (validated.supportHours !== undefined) dbPayload.support_hours = validated.supportHours;
    if (validated.listingDurationDays !== undefined) dbPayload.listing_duration_days = validated.listingDurationDays;
    if (validated.commissionRate !== undefined) dbPayload.commission_rate = validated.commissionRate;
    if (validated.minAnticreticoAmount !== undefined) dbPayload.min_anticretico_amount = validated.minAnticreticoAmount;
    if (validated.requireFolioReal !== undefined) dbPayload.require_folio_real = validated.requireFolioReal;
    if (validated.autoAssignAdvisor !== undefined) dbPayload.auto_assign_advisor = validated.autoAssignAdvisor;
    if (validated.allowDirectClientPublish !== undefined) dbPayload.allow_direct_client_publish = validated.allowDirectClientPublish;
    if (validated.notifyWhatsappAlerts !== undefined) dbPayload.notify_whatsapp_alerts = validated.notifyWhatsappAlerts;
    if (validated.notifyEmailSummaries !== undefined) dbPayload.notify_email_summaries = validated.notifyEmailSummaries;
    if (validated.systemMaintenance !== undefined) dbPayload.system_maintenance = validated.systemMaintenance;

    // Actualizar en memoria
    memorySettings = {
      ...memorySettings,
      ...validated,
      updatedAt: new Date().toISOString()
    };

    // Intentar actualizar en Supabase
    try {
      await supabase
        .from('platform_settings')
        .upsert({ id: 1, ...dbPayload });
    } catch {
      // Ignorar si la tabla no está creada en Supabase aún
    }

    return c.json({
      success: true,
      message: 'Configuración de la plataforma actualizada correctamente.',
      settings: memorySettings
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return c.json({ success: false, error: 'Datos inválidos', details: err.errors }, 400);
    }
    return c.json({ success: false, error: err.message || 'Error al guardar configuración' }, 500);
  }
});

/**
 * PATCH /api/settings/zones/:id/toggle: Activar o desactivar zona de cobertura
 * Blindaje: Requiere privilegios estrictos de Super Administrador (role_id 4)
 */
settingsRouter.patch('/zones/:id/toggle', requireAdmin, async (c) => {
  const zoneId = parseInt(c.req.param('id'), 10);
  try {
    const body = await c.req.json();
    const isActive = Boolean(body.isActive);

    // Actualizar en memoria
    memoryZones = memoryZones.map(z => z.id === zoneId ? { ...z, isActive } : z);

    // Intentar actualizar en Supabase
    try {
      await supabase
        .from('platform_zones')
        .update({ is_active: isActive })
        .eq('id', zoneId);
    } catch {}

    return c.json({
      success: true,
      message: `Zona ${isActive ? 'habilitada' : 'deshabilitada'} exitosamente.`
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

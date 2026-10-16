import { SettingRepository } from '../repositories/setting.repository';
import { PlatformSettings, PlatformZone } from '../interfaces/setting.interface';
import { UpdateSettingsInput } from '../models/setting.model';

let memorySettings: PlatformSettings = {
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
  updatedAt: new Date().toISOString(),
};

let memoryZones: PlatformZone[] = [
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
  { id: 13, city: 'Santa Cruz', name: 'Equipetrol', isActive: true, displayOrder: 13 },
];

export class SettingService {
  static async getPlatformConfig(): Promise<{
    source: string;
    settings: PlatformSettings;
    zones: PlatformZone[];
  }> {
    try {
      const { data, error } = await SettingRepository.getSettings();

      if (error || !data) {
        return {
          source: 'memory',
          settings: memorySettings,
          zones: memoryZones,
        };
      }

      const formattedSettings: PlatformSettings = {
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
        updatedAt: data.updated_at,
      };

      const { data: dbZones } = await SettingRepository.getZones();
      const zones =
        dbZones && dbZones.length > 0
          ? dbZones.map((z: any) => ({
              id: z.id,
              city: z.city,
              name: z.name,
              isActive: z.is_active,
              displayOrder: z.display_order,
            }))
          : memoryZones;

      return {
        source: 'database',
        settings: formattedSettings,
        zones,
      };
    } catch {
      return {
        source: 'memory_fallback',
        settings: memorySettings,
        zones: memoryZones,
      };
    }
  }

  static async updatePlatformConfig(input: UpdateSettingsInput): Promise<PlatformSettings> {
    const dbPayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (input.bankName !== undefined) dbPayload.bank_name = input.bankName;
    if (input.bankAccountNumber !== undefined) dbPayload.bank_account_number = input.bankAccountNumber;
    if (input.bankAccountHolder !== undefined) dbPayload.bank_account_holder = input.bankAccountHolder;
    if (input.bankAccountType !== undefined) dbPayload.bank_account_type = input.bankAccountType;
    if (input.bankAccountIdNumber !== undefined) dbPayload.bank_account_id_number = input.bankAccountIdNumber;
    if (input.qrImageUrl !== undefined) dbPayload.qr_image_url = input.qrImageUrl;
    if (input.supportWhatsapp !== undefined) dbPayload.support_whatsapp = input.supportWhatsapp;
    if (input.supportEmail !== undefined) dbPayload.support_email = input.supportEmail;
    if (input.supportHours !== undefined) dbPayload.support_hours = input.supportHours;
    if (input.listingDurationDays !== undefined) dbPayload.listing_duration_days = input.listingDurationDays;
    if (input.commissionRate !== undefined) dbPayload.commission_rate = input.commissionRate;
    if (input.minAnticreticoAmount !== undefined) dbPayload.min_anticretico_amount = input.minAnticreticoAmount;
    if (input.requireFolioReal !== undefined) dbPayload.require_folio_real = input.requireFolioReal;
    if (input.autoAssignAdvisor !== undefined) dbPayload.auto_assign_advisor = input.autoAssignAdvisor;
    if (input.allowDirectClientPublish !== undefined) dbPayload.allow_direct_client_publish = input.allowDirectClientPublish;
    if (input.notifyWhatsappAlerts !== undefined) dbPayload.notify_whatsapp_alerts = input.notifyWhatsappAlerts;
    if (input.notifyEmailSummaries !== undefined) dbPayload.notify_email_summaries = input.notifyEmailSummaries;
    if (input.systemMaintenance !== undefined) dbPayload.system_maintenance = input.systemMaintenance;

    memorySettings = {
      ...memorySettings,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    try {
      await SettingRepository.upsertSettings(dbPayload);
    } catch {
      // Fallback a memoria si la tabla no está disponible
    }

    return memorySettings;
  }

  static async toggleZone(id: number, isActive: boolean): Promise<void> {
    memoryZones = memoryZones.map((z) => (z.id === id ? { ...z, isActive } : z));
    try {
      await SettingRepository.updateZone(id, isActive);
    } catch {}
  }
}

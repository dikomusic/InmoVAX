import { Context } from 'hono';
import { z } from 'zod';
import { SettingService } from '../services/setting.service';
import { updateSettingsSchema } from '../models/setting.model';

export class SettingController {
  static async getSettings(c: Context) {
    const config = await SettingService.getPlatformConfig();
    return c.json({
      success: true,
      source: config.source,
      settings: config.settings,
      zones: config.zones,
    });
  }

  static async updateSettings(c: Context) {
    try {
      const body = await c.req.json();
      const validated = updateSettingsSchema.parse(body);
      const settings = await SettingService.updatePlatformConfig(validated);

      return c.json({
        success: true,
        message: 'Configuración de la plataforma actualizada correctamente.',
        settings,
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({ success: false, error: 'Datos inválidos', details: err.errors }, 400);
      }
      return c.json({ success: false, error: err.message || 'Error al guardar configuración' }, 500);
    }
  }

  static async toggleZone(c: Context) {
    const zoneId = parseInt(c.req.param('id') || '0', 10);
    try {
      const body = await c.req.json();
      const isActive = Boolean(body.isActive);
      await SettingService.toggleZone(zoneId, isActive);

      return c.json({
        success: true,
        message: `Zona ${isActive ? 'habilitada' : 'deshabilitada'} exitosamente.`,
      });
    } catch (err: any) {
      return c.json({ success: false, error: err.message }, 500);
    }
  }
}

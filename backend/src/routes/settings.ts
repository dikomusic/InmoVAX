import { Hono } from 'hono';
import { SettingController } from '../controllers/setting.controller';
import { requireAdmin } from '../middleware/auth';

export const settingsRouter = new Hono();

settingsRouter.get('/', SettingController.getSettings);
settingsRouter.patch('/', requireAdmin, SettingController.updateSettings);
settingsRouter.patch('/zones/:id/toggle', requireAdmin, SettingController.toggleZone);

export type { PlatformSettings, PlatformZone } from '../interfaces/setting.interface';

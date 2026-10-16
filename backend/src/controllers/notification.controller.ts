import { Context } from 'hono';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
  static async getNotifications(c: Context) {
    const notifications = await NotificationService.getRecentNotifications();
    return c.json({
      source: 'supabase-postgresql',
      total: notifications.length,
      notifications,
    });
  }
}

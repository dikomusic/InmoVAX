import { Hono } from 'hono';
import { NotificationController } from '../controllers/notification.controller';

export const notificationsRouter = new Hono();

notificationsRouter.get('/', NotificationController.getNotifications);

export type { SellerNotificationItem } from '../interfaces/notification.interface';

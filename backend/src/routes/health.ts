import { Hono } from 'hono';
import { HealthController } from '../controllers/health.controller';

export const healthRouter = new Hono();

healthRouter.get('/', HealthController.getHealth);
healthRouter.get('/audit-logs', HealthController.getAuditLogs);

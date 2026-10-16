import { Context } from 'hono';
import { HealthService } from '../services/health.service';

export class HealthController {
  static async getHealth(c: Context) {
    const health = await HealthService.checkHealth();
    return c.json(health);
  }

  static getAuditLogs(c: Context) {
    const logs = HealthService.getAuditLogs();
    return c.json(logs);
  }
}

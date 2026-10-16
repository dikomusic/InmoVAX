import { Context } from 'hono';
import { AdvisorService } from '../services/advisor.service';

export class AdvisorController {
  static async getAdvisors(c: Context) {
    const result = await AdvisorService.listActiveAdvisors();
    return c.json({
      source: 'supabase-postgresql',
      total: result.total,
      advisors: result.advisors,
    });
  }
}

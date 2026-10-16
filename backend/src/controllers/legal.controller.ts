import { Context } from 'hono';
import { LegalService } from '../services/legal.service';

export class LegalController {
  static async getLegalAudits(c: Context) {
    const result = await LegalService.listLegalAudits();
    return c.json({
      source: 'supabase-postgresql',
      total: result.total,
      audits: result.audits,
    });
  }
}

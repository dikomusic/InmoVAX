import { supabase } from '../config/supabase';

export class NotificationRepository {
  static async getRecentOffers(limit: number = 2) {
    return await supabase
      .from('offers')
      .select('id, offer_amount, currency, created_at, properties(title)')
      .order('created_at', { ascending: false })
      .limit(limit);
  }

  static async getRecentAppointments(limit: number = 2) {
    return await supabase
      .from('appointments')
      .select('id, visit_date, time_slot, created_at, properties(title), advisors(full_name)')
      .order('created_at', { ascending: false })
      .limit(limit);
  }

  static async getRecentAudits(limit: number = 2) {
    return await supabase
      .from('legal_audits')
      .select('id, folio_real, alodial_status, verified_by, created_at, properties(title)')
      .order('created_at', { ascending: false })
      .limit(limit);
  }
}

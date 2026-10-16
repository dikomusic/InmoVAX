import { supabase } from '../config/supabase';

export class LegalRepository {
  static async findAll() {
    return await supabase
      .from('legal_audits')
      .select('*, properties(title, zone, price_amount, currency, code, property_images(image_url), advisors(full_name))')
      .order('created_at', { ascending: false });
  }
}

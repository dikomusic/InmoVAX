import { supabase } from '../config/supabase';

export class AdvisorRepository {
  static async findAllActive() {
    return await supabase
      .from('advisors')
      .select('*, properties(id)')
      .eq('is_active', true)
      .order('full_name', { ascending: true });
  }
}

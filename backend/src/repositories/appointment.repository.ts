import { supabase } from '../config/supabase';

export class AppointmentRepository {
  static async findAll() {
    return await supabase
      .from('appointments')
      .select('*, properties(title), advisors(full_name)')
      .order('visit_date', { ascending: true });
  }

  static async findPropertyByCode(code: string) {
    return await supabase
      .from('properties')
      .select('id, inquiries_count')
      .eq('code', code)
      .maybeSingle();
  }

  static async getFirstProperty() {
    return await supabase
      .from('properties')
      .select('id, inquiries_count')
      .limit(1)
      .single();
  }

  static async incrementPropertyInquiries(id: string, currentCount: number) {
    return await supabase
      .from('properties')
      .update({ inquiries_count: currentCount + 1 })
      .eq('id', id);
  }

  static async getFirstAdvisor() {
    return await supabase
      .from('advisors')
      .select('id')
      .limit(1)
      .single();
  }

  static async create(payload: {
    property_id: string;
    advisor_id: string;
    client_name: string;
    client_phone: string;
    visit_date: string;
    time_slot: string;
    status: string;
    notes: string | null;
  }) {
    return await supabase
      .from('appointments')
      .insert(payload)
      .select('*, properties(title), advisors(full_name)')
      .single();
  }
}

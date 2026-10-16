import { supabase } from '../config/supabase';

export class OfferRepository {
  static async findAll() {
    return await supabase
      .from('offers')
      .select('*, properties(title, price_amount, currency, type_id)')
      .order('created_at', { ascending: false });
  }

  static async updateStatus(id: string, status: string) {
    return await supabase
      .from('offers')
      .update({ status })
      .eq('id', id)
      .select('*, properties(title, price_amount, currency, type_id)')
      .maybeSingle();
  }

  static async counterOffer(id: string, amount: number) {
    return await supabase
      .from('offers')
      .update({
        status: 'Contraofertada',
        offer_amount: amount,
      })
      .eq('id', id)
      .select('*, properties(title, price_amount, currency, type_id)')
      .maybeSingle();
  }
}

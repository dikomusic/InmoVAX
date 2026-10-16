import { supabase } from '../config/supabase';

export class SettingRepository {
  static async getSettings() {
    return await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
  }

  static async getZones() {
    return await supabase
      .from('platform_zones')
      .select('*')
      .order('display_order', { ascending: true });
  }

  static async upsertSettings(payload: Record<string, any>) {
    return await supabase
      .from('platform_settings')
      .upsert({ id: 1, ...payload });
  }

  static async updateZone(id: number, isActive: boolean) {
    return await supabase
      .from('platform_zones')
      .update({ is_active: isActive })
      .eq('id', id);
  }
}

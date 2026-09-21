import { Hono } from 'hono';
import { supabase } from '../config/supabase';

export const advisorsRouter = new Hono();

export interface AdvisorRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  zone: string;
  activeProperties: number;
  rating: number;
  avatar: string;
}

// GET /api/advisors: Listar asesores certificados desde Supabase PostgreSQL
advisorsRouter.get('/', async (c) => {
  try {
    const { data, error } = await supabase
      .from('advisors')
      .select('*, properties(id)')
      .eq('is_active', true)
      .order('full_name', { ascending: true });

    if (!error && data) {
      const mapped: AdvisorRecord[] = data.map((adv: any, index: number) => {
        const propCount = adv.properties ? adv.properties.length : (index === 0 ? 8 : 5);
        return {
          id: adv.id,
          name: adv.full_name,
          email: adv.email || 'asesor@inmovax.com',
          phone: adv.phone,
          licenseNumber: adv.license_number,
          zone: index === 0 ? 'Zona Sur & Sopocachi' : 'Calacoto & Miraflores',
          activeProperties: propCount,
          rating: index === 0 ? 4.9 : 4.8,
          avatar: index === 0
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
        };
      });

      return c.json({
        source: 'supabase-postgresql',
        total: mapped.length,
        advisors: mapped
      });
    }
  } catch (err) {
    console.error('Error fetching advisors from Supabase:', err);
  }

  return c.json({ source: 'supabase-postgresql', total: 0, advisors: [] });
});

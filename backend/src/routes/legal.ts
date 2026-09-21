import { Hono } from 'hono';
import { supabase } from '../config/supabase';

export const legalRouter = new Hono();

// GET /api/legal-audits: Listar expedientes jurídicos y Folios Reales desde Supabase
legalRouter.get('/', async (c) => {
  try {
    const { data, error } = await supabase
      .from('legal_audits')
      .select('*, properties(title, zone, price_amount, currency, code, property_images(image_url), advisors(full_name))')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped = data.map((audit: any) => {
        const prop = audit.properties || {};
        const images = prop.property_images || [];
        const advisor = prop.advisors || {};
        const pricePrefix = prop.currency === 'USD' ? '$us ' : 'Bs. ';
        const price = prop.price_amount ? `${pricePrefix}${Number(prop.price_amount).toLocaleString()}` : '$us 45,000';

        return {
          id: audit.id,
          propertyId: prop.code || audit.property_id,
          title: prop.title || 'Inmueble con Folio Real',
          zone: prop.zone || 'La Paz',
          price,
          folioReal: audit.folio_real,
          docType: audit.doc_type,
          status: audit.alodial_status || 'Auditado & Vigente',
          alodialStatus: audit.alodial_status || 'Vigente',
          advisor: advisor.full_name || 'Lic. Carlos Vega',
          verifiedBy: audit.verified_by,
          verificationDate: audit.verification_date,
          legalNotes: audit.legal_notes,
          image: images[0]?.image_url || '',
          taxesYear: 2025
        };
      });

      return c.json({
        source: 'supabase-postgresql',
        total: mapped.length,
        audits: mapped
      });
    }
  } catch (err) {
    console.error('Error fetching legal audits from Supabase:', err);
  }

  return c.json({ source: 'supabase-postgresql', total: 0, audits: [] });
});

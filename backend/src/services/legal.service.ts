import { LegalRepository } from '../repositories/legal.repository';
import { LegalAuditItem } from '../interfaces/legal.interface';

export class LegalService {
  static async listLegalAudits(): Promise<{ total: number; audits: LegalAuditItem[] }> {
    try {
      const { data, error } = await LegalRepository.findAll();

      if (!error && data) {
        const mapped: LegalAuditItem[] = data.map((audit: any) => {
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
            taxesYear: 2025,
          };
        });

        return {
          total: mapped.length,
          audits: mapped,
        };
      }
    } catch (err) {
      console.error('Error fetching legal audits from Supabase:', err);
    }

    return { total: 0, audits: [] };
  }
}

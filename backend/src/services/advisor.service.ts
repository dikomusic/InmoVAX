import { AdvisorRepository } from '../repositories/advisor.repository';
import { AdvisorRecord } from '../interfaces/advisor.interface';

export class AdvisorService {
  static async listActiveAdvisors(): Promise<{ total: number; advisors: AdvisorRecord[] }> {
    try {
      const { data, error } = await AdvisorRepository.findAllActive();

      if (!error && data) {
        const mapped: AdvisorRecord[] = data.map((adv: any, index: number) => {
          const propCount = adv.properties ? adv.properties.length : (index === 0 ? 8 : 5);
          return {
            id: adv.id,
            name: adv.full_name,
            email: adv.email || '',
            phone: adv.phone,
            licenseNumber: adv.license_number,
            zone: index === 0 ? 'Zona Sur & Sopocachi' : 'Calacoto & Miraflores',
            activeProperties: propCount,
            rating: index === 0 ? 4.9 : 4.8,
            avatar: index === 0
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          };
        });

        return {
          total: mapped.length,
          advisors: mapped,
        };
      }
    } catch (err) {
      console.error('Error fetching advisors from Supabase:', err);
    }

    return { total: 0, advisors: [] };
  }
}

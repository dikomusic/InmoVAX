import { OfferRepository } from '../repositories/offer.repository';
import { OfferItem } from '../interfaces/offer.interface';

const typeMap: Record<number, 'Anticrético' | 'Venta' | 'Alquiler'> = {
  1: 'Anticrético',
  2: 'Venta',
  3: 'Alquiler',
};

export class OfferService {
  static mapDbOffer(dbOffer: any): OfferItem {
    const prop = dbOffer.properties || {};
    const pricePrefix = dbOffer.currency === 'USD' ? '$us ' : 'Bs. ';
    const offerAmount = `${pricePrefix}${Number(dbOffer.offer_amount).toLocaleString()}`;
    const initialPrice = `${pricePrefix}${Number(dbOffer.initial_price).toLocaleString()}`;
    const type = typeMap[prop.type_id] || 'Anticrético';

    return {
      id: dbOffer.id,
      code: dbOffer.code || `OFR-${dbOffer.id.slice(0, 5).toUpperCase()}`,
      propertyTitle: prop.title || 'Inmueble InmoVAX',
      buyerName: dbOffer.buyer_name,
      buyerPhone: dbOffer.buyer_phone,
      offerAmount,
      initialPrice,
      date: dbOffer.created_at
        ? new Date(dbOffer.created_at).toLocaleDateString('es-BO', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Reciente',
      message: dbOffer.message || '',
      status: dbOffer.status || 'Pendiente',
      type,
    };
  }

  static async listOffers(): Promise<{ total: number; pending: number; offers: OfferItem[] }> {
    try {
      const { data, error } = await OfferRepository.findAll();
      if (!error && data) {
        const mapped = data.map(OfferService.mapDbOffer);
        return {
          total: mapped.length,
          pending: mapped.filter((o) => o.status === 'Pendiente').length,
          offers: mapped,
        };
      }
    } catch (err) {
      console.error('Error fetching offers from Supabase:', err);
    }
    return { total: 0, pending: 0, offers: [] };
  }

  static async acceptOffer(id: string): Promise<OfferItem | null> {
    const { data: updated, error } = await OfferRepository.updateStatus(id, 'Aceptada');
    if (error || !updated) {
      return null;
    }
    return OfferService.mapDbOffer(updated);
  }

  static async rejectOffer(id: string): Promise<OfferItem | null> {
    const { data: updated, error } = await OfferRepository.updateStatus(id, 'Rechazada');
    if (error || !updated) {
      return null;
    }
    return OfferService.mapDbOffer(updated);
  }

  static async counterOffer(id: string, counterPrice: string): Promise<OfferItem | null> {
    const numericAmount = parseFloat(counterPrice.replace(/[^0-9]/g, '')) || 50000;
    const { data: updated, error } = await OfferRepository.counterOffer(id, numericAmount);
    if (error || !updated) {
      return null;
    }
    return OfferService.mapDbOffer(updated);
  }
}

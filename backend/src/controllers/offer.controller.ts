import { Context } from 'hono';
import { OfferService } from '../services/offer.service';
import { counterSchema } from '../models/offer.model';

export class OfferController {
  static async getOffers(c: Context) {
    const result = await OfferService.listOffers();
    return c.json({
      source: 'supabase-postgresql',
      total: result.total,
      pending: result.pending,
      offers: result.offers,
    });
  }

  static async acceptOffer(c: Context) {
    const id = c.req.param('id') || '';
    try {
      const offer = await OfferService.acceptOffer(id);
      if (!offer) {
        return c.json({ success: false, error: 'Oferta no encontrada o error al actualizar' }, 404);
      }
      return c.json({
        success: true,
        message: 'Oferta aceptada formalmente. Asesor notarial coordinará la minuta.',
        offer,
      });
    } catch {
      return c.json({ success: false, error: 'Error al procesar aceptación' }, 500);
    }
  }

  static async rejectOffer(c: Context) {
    const id = c.req.param('id') || '';
    try {
      const offer = await OfferService.rejectOffer(id);
      if (!offer) {
        return c.json({ success: false, error: 'Oferta no encontrada o error al actualizar' }, 404);
      }
      return c.json({
        success: true,
        message: 'Oferta rechazada.',
        offer,
      });
    } catch {
      return c.json({ success: false, error: 'Error al procesar rechazo' }, 500);
    }
  }

  static async counterOffer(c: Context) {
    const id = c.req.param('id') || '';
    try {
      const body = await c.req.json();
      const { counterPrice } = counterSchema.parse(body);
      const offer = await OfferService.counterOffer(id, counterPrice);
      if (!offer) {
        return c.json({ success: false, error: 'Oferta no encontrada o error al actualizar' }, 404);
      }
      return c.json({
        success: true,
        message: `Contraoferta enviada al comprador por ${counterPrice}`,
        offer,
      });
    } catch {
      return c.json({ success: false, error: 'Precio de contraoferta inválido' }, 400);
    }
  }
}

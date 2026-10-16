import { Hono } from 'hono';
import { OfferController } from '../controllers/offer.controller';

export const offersRouter = new Hono();

offersRouter.get('/', OfferController.getOffers);
offersRouter.patch('/:id/accept', OfferController.acceptOffer);
offersRouter.patch('/:id/reject', OfferController.rejectOffer);
offersRouter.patch('/:id/counter', OfferController.counterOffer);

export type { OfferItem } from '../interfaces/offer.interface';

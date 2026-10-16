import { z } from 'zod';

export const counterSchema = z.object({
  counterPrice: z.string().min(2, 'El precio de contraoferta es requerido'),
});

export type CounterOfferInput = z.infer<typeof counterSchema>;

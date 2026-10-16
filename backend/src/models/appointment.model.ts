import { z } from 'zod';

export const newAppointmentSchema = z.object({
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
  clientName: z.string().min(1, 'El nombre es requerido'),
  clientPhone: z.string().optional().default('No provisto'),
  advisorId: z.string().optional(),
  advisorName: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  visitDate: z.string().optional(),
  timeSlot: z.string().optional(),
  notes: z.string().optional(),
});

export type NewAppointmentInput = z.infer<typeof newAppointmentSchema>;

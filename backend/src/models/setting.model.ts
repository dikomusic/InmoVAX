import { z } from 'zod';

export const updateSettingsSchema = z.object({
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountHolder: z.string().optional(),
  bankAccountType: z.string().optional(),
  bankAccountIdNumber: z.string().optional(),
  qrImageUrl: z.string().optional(),
  supportWhatsapp: z.string().optional(),
  supportEmail: z.string().email().optional(),
  supportHours: z.string().optional(),
  listingDurationDays: z.number().int().positive().optional(),
  commissionRate: z.number().nonnegative().optional(),
  minAnticreticoAmount: z.number().nonnegative().optional(),
  requireFolioReal: z.boolean().optional(),
  autoAssignAdvisor: z.boolean().optional(),
  allowDirectClientPublish: z.boolean().optional(),
  notifyWhatsappAlerts: z.boolean().optional(),
  notifyEmailSummaries: z.boolean().optional(),
  systemMaintenance: z.boolean().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

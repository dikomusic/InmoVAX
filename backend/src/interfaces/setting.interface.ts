export interface PlatformSettings {
  id: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  bankAccountType: string;
  bankAccountIdNumber: string;
  qrImageUrl: string;
  supportWhatsapp: string;
  supportEmail: string;
  supportHours: string;
  listingDurationDays: number;
  commissionRate: number;
  minAnticreticoAmount: number;
  requireFolioReal: boolean;
  autoAssignAdvisor: boolean;
  allowDirectClientPublish: boolean;
  notifyWhatsappAlerts: boolean;
  notifyEmailSummaries: boolean;
  systemMaintenance: boolean;
  updatedAt: string;
}

export interface PlatformZone {
  id: number;
  city: string;
  name: string;
  isActive: boolean;
  displayOrder: number;
}

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
  updatedAt?: string;
}

export interface PlatformZone {
  id: number;
  city: string;
  name: string;
  isActive: boolean;
  displayOrder: number;
}

export interface SellerProfileData {
  id?: string;
  email: string;
  fullName: string;
  phone: string;
  companyName: string;
  whatsappSales: string;
  bio: string;
  notifyEmailOffers: boolean;
  notifyWhatsappAlerts: boolean;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function fetchPlatformSettings(): Promise<{ settings: PlatformSettings; zones: PlatformZone[] } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/settings`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success) {
      return {
        settings: data.settings,
        zones: data.zones || []
      };
    }
    return null;
  } catch {
    return null;
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('inmovax-token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-admin-key': 'AdminInmoVAX#2026'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function updatePlatformSettings(updates: Partial<PlatformSettings>): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/settings`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function togglePlatformZone(zoneId: number, isActive: boolean): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/settings/zones/${zoneId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive })
    });
    const data = await res.json();
    return !!data.success;
  } catch {
    return false;
  }
}

export async function fetchSellerProfile(identifier: string): Promise<SellerProfileData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/profile/${encodeURIComponent(identifier)}`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.profile) {
      return data.profile;
    }
    return null;
  } catch {
    return null;
  }
}

export async function updateSellerProfile(identifier: string, updates: Partial<SellerProfileData>): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/profile/${encodeURIComponent(identifier)}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function changeSellerPassword(email: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

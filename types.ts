export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  joinedYear: number;
  bio: string;
  membershipActive: boolean;
  packageLevel: string;
  renewalDate: string;
  paymentMethod: string;
  currentProgressDays: number;
  totalDaysInCycle: number;
  totalVisits: number;
  lastCheckInTime: string;
  bestStreak: number;
  memberId: string;
  avatarUrl: string;
}

export interface PackageOption {
  id: string;
  name: string;
  category: 'individual' | 'partnership' | 'squad';
  price: number;
  period: string;
  perks: string[];
  popular?: boolean;
}

export interface TrainerPackageOption {
  id: string;
  name: string;
  price: number;
  period: string;
  perks: string[];
}

export type PaymentMethod = 'bank_transfer' | 'virtual_account' | 'qris';

export type PaymentState = 
  | 'checkout' 
  | 'processing_va' 
  | 'processing_qris' 
  | 'processing_bank' 
  | 'success';

export interface OrderSummary {
  packageName: string;
  description: string;
  monthlyRate: number;
  registrationFee: number; // 0 for FREE
  taxPercentage: number; // e.g., 10 for 10%
  totalDue: number;
  appliedPromo?: {
    code: string;
    discountValue: number;
  };
}
export type BankType = 'bca' | 'mandiri' | 'bni' | 'bri';

export interface BankInfo {
  name: string;
  accountNumber: string;
  accountHolder: string;
}

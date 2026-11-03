export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type UrgencyLevel = 'URGENT' | 'TODAY' | 'WITHIN_24H' | 'WITHIN_3_DAYS' | 'SCHEDULED';

export type RequestStatus = 'Active' | 'Partially Fulfilled' | 'Fulfilled' | 'Expired' | 'Cancelled';

export type BangladeshDivision =
  | 'Dhaka'
  | 'Chattogram'
  | 'Barishal'
  | 'Khulna'
  | 'Rajshahi'
  | 'Sylhet'
  | 'Rangpur'
  | 'Mymensingh';

export interface BloodRequest {
  id: string;
  bloodGroup: BloodGroup;
  units: number;
  hospitalName: string;
  hospitalLocation: string;
  division: BangladeshDivision;
  patientName: string;
  patientRelation: string;
  requiredDate: string;
  requiredTime: string;
  contactNumber: string;
  alternateContact?: string;
  additionalInfo?: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  createdAt: string;
  requesterId: string;
  requesterName: string;
  responsesCount: number;
  contactedDonors?: Array<{
    id: string;
    donorName: string;
    phone: string;
    timestamp: string;
  }>;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donationDate: string;
  hospitalName: string;
  location: string;
  bloodGroup: BloodGroup;
  units: number;
  note?: string;
  verified?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  division: BangladeshDivision;
  location: string;
  dateOfBirth: string;
  age: number;
  totalDonations: number;
  lastDonationDate: string;
  nextEligibleDate: string;
  isEligible: boolean;
  availabilityStatus: 'Available' | 'Unavailable';
  avatarInitials: string;
  rolePreference: 'donor' | 'requester' | 'both';
  settings: {
    smsUrgentAlerts: boolean;
    emailDigest: boolean;
    hidePhoneUntilContact: boolean;
    showInDonorDirectory: boolean;
  };
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}


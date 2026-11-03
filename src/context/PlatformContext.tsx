'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BloodRequest, DonationRecord, UserProfile, RequestStatus } from '@/types';
import { INITIAL_USER, INITIAL_REQUESTS, INITIAL_DONATIONS } from '@/data/mockData';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

interface PlatformContextType {
  user: UserProfile | null;
  requests: BloodRequest[];
  donations: DonationRecord[];
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  activeDetailRequest: BloodRequest | null;
  setActiveDetailRequest: (req: BloodRequest | null) => void;
  activeContactRequest: BloodRequest | null;
  setActiveContactRequest: (req: BloodRequest | null) => void;
  isLoading: boolean;

  // Actions
  addRequest: (newReqData: Omit<BloodRequest, 'id' | 'createdAt' | 'responsesCount' | 'status' | 'requesterId' | 'requesterName'>) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestStatus) => Promise<void>;
  cancelRequest: (id: string) => Promise<void>;
  editRequest: (id: string, updates: Partial<BloodRequest>) => Promise<void>;
  addDonation: (recordData: Omit<DonationRecord, 'id' | 'donorId' | 'verified'>) => Promise<void>;
  updateUserAvailability: (status: 'Available' | 'Unavailable') => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loginAs: (role: 'donor' | 'requester' | 'guest') => Promise<void>;
  logout: () => Promise<void>;
  contactRequest: (requestId: string, donorName?: string, donorPhone?: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

// Helper to normalize backend BloodRequest document to frontend BloodRequest interface
const normalizeRequest = (raw: any): BloodRequest => {
  const urgencyMap: Record<string, any> = {
    critical: 'URGENT',
    urgent: 'URGENT',
    normal: 'WITHIN_24H',
  };

  const statusMap: Record<string, RequestStatus> = {
    active: 'Active',
    partially_fulfilled: 'Partially Fulfilled',
    fulfilled: 'Fulfilled',
    expired: 'Expired',
    cancelled: 'Cancelled',
  };

  return {
    id: raw._id?.toString() || raw.id,
    bloodGroup: raw.bloodGroup,
    units: raw.unitsRequired ?? raw.units ?? 1,
    hospitalName: raw.hospitalName,
    hospitalLocation: raw.hospitalLocation,
    division: raw.division,
    patientName: raw.patientName,
    patientRelation: raw.patientRelation || 'Relative',
    requiredDate: raw.requiredDate,
    requiredTime: raw.requiredTime,
    contactNumber: raw.contactPhone || raw.contactNumber,
    alternateContact: raw.alternatePhone || raw.alternateContact,
    additionalInfo: raw.description || raw.additionalInfo,
    urgency: urgencyMap[raw.urgency] || raw.urgency || 'URGENT',
    status: statusMap[raw.status] || raw.status || 'Active',
    createdAt: raw.createdAt ? new Date(raw.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
    requesterId: raw.requesterId?._id?.toString() || raw.requesterId?.toString() || 'usr-guest',
    requesterName: raw.requesterId?.name || raw.patientName,
    responsesCount: raw.responsesCount || 0,
    contactedDonors: raw.contactedDonors || [],
  };
};

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [requests, setRequests] = useState<BloodRequest[]>(INITIAL_REQUESTS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [isLoading, setIsLoading] = useState(false);

  // Global Modals
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [activeDetailRequest, setActiveDetailRequest] = useState<BloodRequest | null>(null);
  const [activeContactRequest, setActiveContactRequest] = useState<BloodRequest | null>(null);

  // Fetch real data from backend on initial mount
  const refreshData = async () => {
    try {
      // 1. Fetch live requests
      const reqRes = await api.requests.getAll().catch(() => null);
      if (reqRes?.requests && Array.isArray(reqRes.requests)) {
        const normalized = reqRes.requests.map(normalizeRequest);
        setRequests(normalized);
      }

      // 2. Fetch active session
      const meRes = await api.auth.me().catch(() => null);
      if (meRes?.user) {
        setUser({
          ...meRes.user,
          avatarInitials: meRes.user.name.slice(0, 2).toUpperCase(),
          availabilityStatus: meRes.user.isAvailable ? 'Available' : 'Unavailable',
          rolePreference: 'both',
        });
      }

      // 3. Fetch donations
      const donRes = await api.donations.getAll().catch(() => null);
      if (donRes?.donations && Array.isArray(donRes.donations)) {
        setDonations(
          donRes.donations.map((d: any) => ({
            id: d._id?.toString() || d.id,
            donorId: d.donorId?.toString() || 'usr-101',
            donationDate: d.donationDate,
            hospitalName: d.hospitalName,
            location: d.location,
            bloodGroup: d.bloodGroup,
            units: d.units || 1,
            note: d.notes,
            verified: d.verified ?? true,
          }))
        );
      }
    } catch (err) {
      // Fallback gracefully to existing data
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Save helpers
  const saveRequests = (newReqs: BloodRequest[]) => {
    setRequests(newReqs);
  };

  const saveDonations = (newDons: DonationRecord[]) => {
    setDonations(newDons);
  };

  const saveUser = (u: UserProfile | null) => {
    setUser(u);
  };

  // Create blood request
  const addRequest = async (
    reqData: Omit<BloodRequest, 'id' | 'createdAt' | 'responsesCount' | 'status' | 'requesterId' | 'requesterName'>
  ) => {
    setIsLoading(true);
    try {
      const urgencyBackend = reqData.urgency === 'URGENT' ? 'urgent' : reqData.urgency === 'TODAY' ? 'urgent' : 'normal';
      
      const created = await api.requests.create({
        patientName: reqData.patientName,
        patientRelation: reqData.patientRelation,
        bloodGroup: reqData.bloodGroup,
        unitsRequired: reqData.units,
        hospitalName: reqData.hospitalName,
        hospitalLocation: reqData.hospitalLocation,
        division: reqData.division,
        requiredDate: reqData.requiredDate,
        requiredTime: reqData.requiredTime,
        contactPhone: reqData.contactNumber,
        alternatePhone: reqData.alternateContact || '',
        description: reqData.additionalInfo || '',
        urgency: urgencyBackend,
      }).catch(() => null);

      if (created) {
        const norm = normalizeRequest(created);
        saveRequests([norm, ...requests]);
      } else {
        // Fallback local create
        const newRequest: BloodRequest = {
          ...reqData,
          id: `req-${Date.now().toString().slice(-4)}`,
          status: 'Active',
          createdAt: 'Just now',
          responsesCount: 0,
          requesterId: user ? user.id : 'guest-requester',
          requesterName: user ? user.name : reqData.patientName,
          contactedDonors: [],
        };
        saveRequests([newRequest, ...requests]);
      }

      showToast('success', 'Blood Request Posted', 'Your emergency blood requirement is now visible to nearby donors.');
      setCreateModalOpen(false);
    } catch (err: any) {
      showToast('error', 'Error Posting Request', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update status (e.g. Fulfilled)
  const updateRequestStatus = async (id: string, status: RequestStatus) => {
    try {
      const backendStatus = status === 'Fulfilled' ? 'fulfilled' : status === 'Cancelled' ? 'cancelled' : 'active';
      await api.requests.updateStatus(id, backendStatus).catch(() => null);

      const updated = requests.map((req) => (req.id === id ? { ...req, status } : req));
      saveRequests(updated);
      showToast('success', 'Status Updated', `Request has been marked as "${status}".`);
    } catch (err: any) {
      showToast('error', 'Status Update Failed', err.message);
    }
  };

  // Cancel request
  const cancelRequest = async (id: string) => {
    try {
      await api.requests.delete(id).catch(() => null);
      updateRequestStatus(id, 'Cancelled');
    } catch {
      updateRequestStatus(id, 'Cancelled');
    }
  };

  // Edit request
  const editRequest = async (id: string, updates: Partial<BloodRequest>) => {
    try {
      await api.requests.update(id, {
        unitsRequired: updates.units,
        requiredTime: updates.requiredTime,
        description: updates.additionalInfo,
      }).catch(() => null);

      const updated = requests.map((req) => (req.id === id ? { ...req, ...updates } : req));
      saveRequests(updated);
      showToast('success', 'Request Updated', 'Changes have been saved successfully.');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  // Add donation
  const addDonation = async (recordData: Omit<DonationRecord, 'id' | 'donorId' | 'verified'>) => {
    try {
      const res = await api.donations.add({
        donationDate: recordData.donationDate,
        hospitalName: recordData.hospitalName,
        location: recordData.location,
        bloodGroup: recordData.bloodGroup,
        units: recordData.units,
        notes: recordData.note || '',
      }).catch(() => null);

      const newRecord: DonationRecord = {
        ...recordData,
        id: res?.donation?._id?.toString() || `don-${Date.now().toString().slice(-4)}`,
        donorId: user ? user.id : 'usr-101',
        verified: true,
      };

      const updatedDonations = [newRecord, ...donations];
      saveDonations(updatedDonations);

      // Calculate next eligible date (3 months from donationDate)
      const donDate = new Date(recordData.donationDate);
      donDate.setMonth(donDate.getMonth() + 3);
      const nextEligibleStr = donDate.toISOString().split('T')[0];

      if (user) {
        const updatedUser: UserProfile = {
          ...user,
          totalDonations: user.totalDonations + 1,
          lastDonationDate: recordData.donationDate,
          nextEligibleDate: nextEligibleStr,
          isEligible: new Date() >= donDate,
        };
        saveUser(updatedUser);
      }

      showToast('success', 'Donation Logged', 'Your donation history and eligibility date have been updated.');
    } catch (err: any) {
      showToast('error', 'Error Saving Donation', err.message);
    }
  };

  // Update availability
  const updateUserAvailability = async (status: 'Available' | 'Unavailable') => {
    if (!user) return;
    try {
      await api.users.updateAvailability(status === 'Available').catch(() => null);
      const updated = { ...user, availabilityStatus: status };
      saveUser(updated);
      showToast('info', 'Availability Updated', `You are now marked as ${status} to donate.`);
    } catch {
      const updated = { ...user, availabilityStatus: status };
      saveUser(updated);
    }
  };

  // Update profile
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await api.users.updateProfile(updates).catch(() => null);
      const updated = { ...user, ...updates };
      saveUser(updated);
      showToast('success', 'Profile Updated', 'Your profile details have been saved.');
    } catch {
      const updated = { ...user, ...updates };
      saveUser(updated);
    }
  };

  // Switch demo account
  const loginAs = async (role: 'donor' | 'requester' | 'guest') => {
    if (role === 'guest') {
      await api.auth.logout().catch(() => null);
      saveUser(null);
      showToast('info', 'Logged Out', 'Viewing platform in public guest mode.');
    } else {
      const res = await api.auth.demo(role).catch(() => null);
      if (res?.user) {
        saveUser({
          ...res.user,
          id: res.user.id || res.user._id,
          avatarInitials: res.user.name.slice(0, 2).toUpperCase(),
          availabilityStatus: res.user.isAvailable ? 'Available' : 'Unavailable',
          rolePreference: role === 'donor' ? 'donor' : 'requester',
        });
        showToast('success', `Logged in as ${res.user.name}`, `Switched to ${role} session.`);
      } else {
        // Fallback local demo
        if (role === 'donor') {
          saveUser(INITIAL_USER);
          showToast('success', 'Logged in as Rahim Ahmed', 'Switched to Donor mode.');
        } else {
          saveUser({
            ...INITIAL_USER,
            id: 'usr-202',
            name: 'Tanjil Hasan',
            email: 'tanjil.hasan@example.com',
            phone: '+880 1819-234567',
            bloodGroup: 'B+',
            rolePreference: 'requester',
            totalDonations: 2,
            lastDonationDate: '2025-11-20',
            nextEligibleDate: '2026-02-20',
            avatarInitials: 'TH',
          });
          showToast('success', 'Logged in as Tanjil Hasan', 'Switched to Requester mode.');
        }
      }
    }
  };

  const logout = async () => {
    await loginAs('guest');
  };

  // When donor contacts requester
  const contactRequest = async (requestId: string, donorName?: string, donorPhone?: string) => {
    const callerName = donorName || (user ? user.name : 'Anonymous Donor');
    const callerPhone = donorPhone || (user ? user.phone : '+880 1700-000000');

    try {
      await api.connections.create({
        requestId,
        donorName: callerName,
        donorPhone: callerPhone,
        contactMethod: 'call',
      }).catch(() => null);

      const updated = requests.map((req) => {
        if (req.id === requestId) {
          const existing = req.contactedDonors || [];
          const newContact = {
            id: `cd-${Date.now()}`,
            donorName: callerName,
            phone: callerPhone,
            timestamp: 'Just now',
          };
          return {
            ...req,
            responsesCount: req.responsesCount + 1,
            contactedDonors: [newContact, ...existing],
          };
        }
        return req;
      });

      saveRequests(updated);
      showToast('success', 'Contact Initiated', 'The requester has been notified of your intent to donate.');
    } catch {
      showToast('success', 'Contact Initiated', 'The requester has been notified of your intent to donate.');
    }
  };

  return (
    <PlatformContext.Provider
      value={{
        user,
        requests,
        donations,
        isCreateModalOpen,
        setCreateModalOpen,
        activeDetailRequest,
        setActiveDetailRequest,
        activeContactRequest,
        setActiveContactRequest,
        isLoading,
        addRequest,
        updateRequestStatus,
        cancelRequest,
        editRequest,
        addDonation,
        updateUserAvailability,
        updateUserProfile,
        loginAs,
        logout,
        contactRequest,
        refreshData,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};

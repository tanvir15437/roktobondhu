'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BloodRequest, DonationRecord, UserProfile, RequestStatus } from '@/types';
import { INITIAL_USER, INITIAL_REQUESTS, INITIAL_DONATIONS } from '@/data/mockData';
import { useToast } from '@/components/ui/Toast';

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
  
  // Actions
  addRequest: (newReqData: Omit<BloodRequest, 'id' | 'createdAt' | 'responsesCount' | 'status' | 'requesterId' | 'requesterName'>) => void;
  updateRequestStatus: (id: string, status: RequestStatus) => void;
  cancelRequest: (id: string) => void;
  editRequest: (id: string, updates: Partial<BloodRequest>) => void;
  addDonation: (recordData: Omit<DonationRecord, 'id' | 'donorId' | 'verified'>) => void;
  updateUserAvailability: (status: 'Available' | 'Unavailable') => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  loginAs: (role: 'donor' | 'requester' | 'guest') => void;
  logout: () => void;
  contactRequest: (requestId: string, donorName?: string, donorPhone?: string) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [requests, setRequests] = useState<BloodRequest[]>(INITIAL_REQUESTS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  
  // Global Modals
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [activeDetailRequest, setActiveDetailRequest] = useState<BloodRequest | null>(null);
  const [activeContactRequest, setActiveContactRequest] = useState<BloodRequest | null>(null);

  // Load from local storage if available
  useEffect(() => {
    try {
      const savedRequests = localStorage.getItem('roktobondhu_requests');
      if (savedRequests) {
        setRequests(JSON.parse(savedRequests));
      }
      const savedDonations = localStorage.getItem('roktobondhu_donations');
      if (savedDonations) {
        setDonations(JSON.parse(savedDonations));
      }
      const savedUser = localStorage.getItem('roktobondhu_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // fallback to initial mock
    }
  }, []);

  // Save requests
  const saveRequests = (newReqs: BloodRequest[]) => {
    setRequests(newReqs);
    try {
      localStorage.setItem('roktobondhu_requests', JSON.stringify(newReqs));
    } catch {
      // ignore
    }
  };

  // Save donations
  const saveDonations = (newDons: DonationRecord[]) => {
    setDonations(newDons);
    try {
      localStorage.setItem('roktobondhu_donations', JSON.stringify(newDons));
    } catch {
      // ignore
    }
  };

  // Save user
  const saveUser = (u: UserProfile | null) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem('roktobondhu_user', JSON.stringify(u));
      } else {
        localStorage.removeItem('roktobondhu_user');
      }
    } catch {
      // ignore
    }
  };

  // Create blood request
  const addRequest = (
    reqData: Omit<BloodRequest, 'id' | 'createdAt' | 'responsesCount' | 'status' | 'requesterId' | 'requesterName'>
  ) => {
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

    const updated = [newRequest, ...requests];
    saveRequests(updated);
    showToast('success', 'Blood Request Posted', 'Your emergency blood requirement is now visible to nearby donors.');
    setCreateModalOpen(false);
  };

  // Update status (e.g. Fulfilled)
  const updateRequestStatus = (id: string, status: RequestStatus) => {
    const updated = requests.map((req) => (req.id === id ? { ...req, status } : req));
    saveRequests(updated);
    showToast('success', 'Status Updated', `Request has been marked as "${status}".`);
  };

  // Cancel request
  const cancelRequest = (id: string) => {
    updateRequestStatus(id, 'Cancelled');
  };

  // Edit request
  const editRequest = (id: string, updates: Partial<BloodRequest>) => {
    const updated = requests.map((req) => (req.id === id ? { ...req, ...updates } : req));
    saveRequests(updated);
    showToast('success', 'Request Updated', 'Changes have been saved successfully.');
  };

  // Add donation
  const addDonation = (recordData: Omit<DonationRecord, 'id' | 'donorId' | 'verified'>) => {
    const newRecord: DonationRecord = {
      ...recordData,
      id: `don-${Date.now().toString().slice(-4)}`,
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
  };

  // Update availability
  const updateUserAvailability = (status: 'Available' | 'Unavailable') => {
    if (!user) return;
    const updated = { ...user, availabilityStatus: status };
    saveUser(updated);
    showToast('info', 'Availability Updated', `You are now marked as ${status} to donate.`);
  };

  // Update profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    saveUser(updated);
    showToast('success', 'Profile Updated', 'Your profile details have been saved.');
  };

  // Switch demo account for easy testing
  const loginAs = (role: 'donor' | 'requester' | 'guest') => {
    if (role === 'guest') {
      saveUser(null);
      showToast('info', 'Logged Out', 'Viewing platform in public guest mode.');
    } else if (role === 'donor') {
      saveUser(INITIAL_USER);
      showToast('success', 'Logged in as Rahim Ahmed', 'Switched to Donor mode.');
    } else {
      const requesterUser: UserProfile = {
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
      };
      saveUser(requesterUser);
      showToast('success', 'Logged in as Tanjil Hasan', 'Switched to Requester mode.');
    }
  };

  const logout = () => {
    loginAs('guest');
  };

  // When donor contacts requester
  const contactRequest = (requestId: string, donorName?: string, donorPhone?: string) => {
    const callerName = donorName || (user ? user.name : 'Anonymous Donor');
    const callerPhone = donorPhone || (user ? user.phone : '+880 1700-000000');

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


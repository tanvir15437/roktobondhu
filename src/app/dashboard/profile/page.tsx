'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/context/PlatformContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { BloodGroupBadge } from '@/components/ui/Badges';
import { BANGLADESH_DIVISIONS, BLOOD_GROUPS } from '@/data/mockData';
import { BloodGroup, BangladeshDivision } from '@/types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Bell,
  Shield,
  Save,
  CheckCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserProfile, updateUserAvailability } = usePlatform();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(user?.bloodGroup || 'O+');
  const [division, setDivision] = useState<BangladeshDivision>(user?.division || 'Dhaka');
  const [location, setLocation] = useState(user?.location || '');
  const [age, setAge] = useState(user?.age ? user.age.toString() : '28');

  // Settings
  const [smsAlerts, setSmsAlerts] = useState(user?.settings.smsUrgentAlerts ?? true);
  const [emailDigest, setEmailDigest] = useState(user?.settings.emailDigest ?? false);
  const [hidePhone, setHidePhone] = useState(user?.settings.hidePhoneUntilContact ?? false);
  const [showInDirectory, setShowInDirectory] = useState(user?.settings.showInDonorDirectory ?? true);

  if (!user) {
    return (
      <div className="py-16 max-w-xl mx-auto px-4 text-center">
        <h2 className="text-24 font-bold text-ink-primary mb-2">Profile & Settings</h2>
        <p className="text-14 text-ink-secondary mb-6">
          Sign in to manage your donor profile and communication settings.
        </p>
        <Link href="/login">
          <Button variant="primary" size="md">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      email,
      bloodGroup,
      division,
      location,
      age: parseInt(age) || user.age,
      settings: {
        smsUrgentAlerts: smsAlerts,
        emailDigest,
        hidePhoneUntilContact: hidePhone,
        showInDonorDirectory: showInDirectory,
      },
    });
  };

  return (
    <div className="py-8 sm:py-12 bg-ui-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-ui-border">
          <div className="flex items-center gap-2 text-12 font-bold text-brand-primary uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            Account & Donor Profile
          </div>
          <h1 className="text-24 sm:text-32 font-bold text-ink-primary tracking-tight">
            Profile Settings
          </h1>
          <p className="text-14 text-ink-secondary mt-1">
            Manage your personal contact details, blood group, and emergency alert preferences.
          </p>
        </div>

        {/* Profile Card Header */}
        <Card className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              initials={user.avatarInitials}
              size="xl"
              availabilityStatus={user.availabilityStatus}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-20 sm:text-24 font-bold text-ink-primary">{user.name}</h2>
                <BloodGroupBadge group={user.bloodGroup} size="sm" />
              </div>
              <p className="text-14 text-ink-secondary mt-0.5">{user.location}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    user.availabilityStatus === 'Available'
                      ? 'bg-semantic-success'
                      : 'bg-ink-muted'
                  }`}
                />
                <span className="text-12 font-semibold text-ink-primary">
                  Status: {user.availabilityStatus} to Donate
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant={user.availabilityStatus === 'Available' ? 'outline' : 'success'}
              size="sm"
              fullWidth
              onClick={() =>
                updateUserAvailability(
                  user.availabilityStatus === 'Available' ? 'Unavailable' : 'Available'
                )
              }
            >
              {user.availabilityStatus === 'Available'
                ? 'Set as Unavailable'
                : 'Mark as Available'}
            </Button>
          </div>
        </Card>

        {/* Edit Information Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-4">
            <h3 className="text-18 font-bold text-ink-primary pb-3 border-b border-ui-border">
              Personal & Donor Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                requiredIndicator
              />
              <Select
                label="Blood Group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                options={[...BLOOD_GROUPS]}
                requiredIndicator
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                requiredIndicator
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Division"
                value={division}
                onChange={(e) => setDivision(e.target.value as BangladeshDivision)}
                options={BANGLADESH_DIVISIONS}
              />
              <Input
                label="Specific Area / Thana"
                placeholder="e.g. Dhanmondi, Dhaka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Input
                label="Age (Years)"
                type="number"
                min="18"
                max="65"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </Card>

          {/* Notification & Privacy Settings */}
          <Card className="p-6 sm:p-8 space-y-4">
            <h3 className="text-18 font-bold text-ink-primary pb-3 border-b border-ui-border">
              Alerts & Privacy Preferences
            </h3>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-sm text-brand-primary border-ui-border focus:ring-brand-primary"
                />
                <div>
                  <span className="text-14 font-semibold text-ink-primary block">
                    SMS Emergency Alerts
                  </span>
                  <span className="text-12 text-ink-secondary">
                    Receive urgent SMS alerts when an emergency request matching your blood group is posted within your division.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInDirectory}
                  onChange={(e) => setShowInDirectory(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-sm text-brand-primary border-ui-border focus:ring-brand-primary"
                />
                <div>
                  <span className="text-14 font-semibold text-ink-primary block">
                    Show in Community Donor Directory
                  </span>
                  <span className="text-12 text-ink-secondary">
                    Allow hospital patients to discover your donor availability status when searching for donors.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hidePhone}
                  onChange={(e) => setHidePhone(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-sm text-brand-primary border-ui-border focus:ring-brand-primary"
                />
                <div>
                  <span className="text-14 font-semibold text-ink-primary block">
                    Privacy Protection (Mask Phone Number)
                  </span>
                  <span className="text-12 text-ink-secondary">
                    Require requesters to confirm their emergency case before viewing your phone number.
                  </span>
                </div>
              </label>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


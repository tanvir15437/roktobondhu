'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { BloodGroup } from '@/types';
import { BLOOD_GROUPS } from '@/data/mockData';
import { usePlatform } from '@/context/PlatformContext';

export interface AddDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDonationModal: React.FC<AddDonationModalProps> = ({ isOpen, onClose }) => {
  const { addDonation, user } = usePlatform();

  const [donationDate, setDonationDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [hospitalName, setHospitalName] = useState('');
  const [location, setLocation] = useState(user?.location || 'Dhaka');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(user?.bloodGroup || 'O+');
  const [units, setUnits] = useState('1');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName.trim()) {
      setError('Hospital or donation center name is required');
      return;
    }

    addDonation({
      donationDate,
      hospitalName: hospitalName.trim(),
      location: location.trim(),
      bloodGroup,
      units: parseInt(units) || 1,
      note: note.trim() || undefined,
    });

    setHospitalName('');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Past Blood Donation"
      description="Keep your personal blood donation records organized and calculate your next eligibility date."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Donation Date"
            type="date"
            value={donationDate}
            onChange={(e) => setDonationDate(e.target.value)}
            requiredIndicator
          />
          <Select
            label="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
            options={[...BLOOD_GROUPS]}
          />
        </div>

        <Input
          label="Hospital or Donation Center"
          placeholder="e.g. Dhaka Medical College Hospital"
          value={hospitalName}
          onChange={(e) => {
            setHospitalName(e.target.value);
            if (error) setError('');
          }}
          error={error}
          requiredIndicator
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Location / City"
            placeholder="e.g. Shahbagh, Dhaka"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            label="Units Donated"
            type="number"
            min="1"
            max="3"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-14 font-semibold text-ink-primary mb-1">
            Optional Notes / Recipient Case
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Voluntary donation for thalassemia patient or hospital camp"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 text-14 text-ink-primary bg-ui-surface border border-ui-border rounded-md hover:border-ink-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        <div className="p-3 bg-brand-subtle rounded-md border border-brand-light text-12 text-ink-secondary">
          <strong>Note:</strong> Logging this donation will automatically update your next eligible donation date to 90 days after this date.
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-ui-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Record
          </Button>
        </div>
      </form>
    </Modal>
  );
};


'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { BloodGroup, UrgencyLevel, BangladeshDivision } from '@/types';
import { BANGLADESH_DIVISIONS, BLOOD_GROUPS } from '@/data/mockData';
import { usePlatform } from '@/context/PlatformContext';
import { AlertCircle } from 'lucide-react';

export const CreateRequestModal: React.FC = () => {
  const { isCreateModalOpen, setCreateModalOpen, addRequest, user } = usePlatform();

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [units, setUnits] = useState('1');
  const [urgency, setUrgency] = useState<UrgencyLevel>('URGENT');
  const [patientName, setPatientName] = useState('');
  const [patientRelation, setPatientRelation] = useState('Parent');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalLocation, setHospitalLocation] = useState('');
  const [division, setDivision] = useState<BangladeshDivision>('Dhaka');
  const [requiredDate, setRequiredDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [requiredTime, setRequiredTime] = useState('07:00 PM');
  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [alternateContact, setAlternateContact] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!patientName.trim()) newErrors.patientName = 'Patient name is required';
    if (!hospitalName.trim()) newErrors.hospitalName = 'Hospital name is required';
    if (!contactNumber.trim()) newErrors.contactNumber = 'Contact phone number is required';
    if (parseInt(units) < 1 || isNaN(parseInt(units))) newErrors.units = 'At least 1 unit required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addRequest({
      bloodGroup,
      units: parseInt(units) || 1,
      urgency,
      patientName: patientName.trim(),
      patientRelation,
      hospitalName: hospitalName.trim(),
      hospitalLocation: hospitalLocation.trim() || `${division}`,
      division,
      requiredDate,
      requiredTime,
      contactNumber: contactNumber.trim(),
      alternateContact: alternateContact.trim() || undefined,
      additionalInfo: additionalInfo.trim() || undefined,
    });

    // Reset fields
    setPatientName('');
    setHospitalName('');
    setHospitalLocation('');
    setAdditionalInfo('');
  };

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={() => setCreateModalOpen(false)}
      title="Create Emergency Blood Request"
      description="Post your requirement to quickly reach verified blood donors nearby."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Urgency and Blood Group Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-14 font-semibold text-ink-primary mb-1">
              Blood Group Needed <span className="text-semantic-error">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setBloodGroup(bg)}
                  className={`h-10 text-14 font-bold rounded-md border transition-colors ${
                    bloodGroup === bg
                      ? 'bg-brand-primary text-white border-brand-primary shadow-subtle'
                      : 'bg-ui-surface text-ink-primary border-ui-border hover:border-brand-primary/50'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-14 font-semibold text-ink-primary mb-1">
              Urgency Level <span className="text-semantic-error">*</span>
            </label>
            <div className="space-y-1.5">
              {[
                { value: 'URGENT', label: 'Urgent (Immediate transfusion needed)' },
                { value: 'TODAY', label: 'Today (Within today evening)' },
                { value: 'WITHIN_24H', label: 'Within 24 Hours' },
                { value: 'SCHEDULED', label: 'Scheduled procedure' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer text-12 transition-colors ${
                    urgency === opt.value
                      ? 'border-brand-primary bg-brand-light/30 text-ink-primary font-semibold'
                      : 'border-ui-border text-ink-secondary hover:bg-ui-bg'
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={opt.value}
                    checked={urgency === opt.value}
                    onChange={() => setUrgency(opt.value as UrgencyLevel)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Units & Patient Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Required Units"
            type="number"
            min="1"
            max="10"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            error={errors.units}
            requiredIndicator
          />
          <Input
            label="Patient Full Name"
            placeholder="e.g. Rahim Ahmed"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            error={errors.patientName}
            requiredIndicator
          />
          <Select
            label="Patient Relation"
            value={patientRelation}
            onChange={(e) => setPatientRelation(e.target.value)}
            options={[
              'Father',
              'Mother',
              'Brother',
              'Sister',
              'Spouse',
              'Child',
              'Self',
              'Relative',
              'Friend',
            ]}
          />
        </div>

        {/* Hospital & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Hospital / Clinic Name"
            placeholder="e.g. Dhaka Medical College Hospital"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            error={errors.hospitalName}
            requiredIndicator
          />
          <Select
            label="Division"
            value={division}
            onChange={(e) => setDivision(e.target.value as BangladeshDivision)}
            options={BANGLADESH_DIVISIONS}
          />
        </div>

        <Input
          label="Specific Location / Ward"
          placeholder="e.g. Shahbagh, Emergency Ward 3, Bed 12"
          value={hospitalLocation}
          onChange={(e) => setHospitalLocation(e.target.value)}
          helperText="Helps donors identify the exact building or counter."
        />

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Required Date"
            type="date"
            value={requiredDate}
            onChange={(e) => setRequiredDate(e.target.value)}
            requiredIndicator
          />
          <Input
            label="Required Time"
            placeholder="e.g. 07:00 PM"
            value={requiredTime}
            onChange={(e) => setRequiredTime(e.target.value)}
            requiredIndicator
          />
        </div>

        {/* Contact Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Primary Contact Number"
            placeholder="e.g. +880 1712-345678"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            error={errors.contactNumber}
            requiredIndicator
          />
          <Input
            label="Alternate Phone (Optional)"
            placeholder="e.g. +880 1819-234567"
            value={alternateContact}
            onChange={(e) => setAlternateContact(e.target.value)}
          />
        </div>

        {/* Additional Clinical / Logistics Info */}
        <div>
          <label className="block text-14 font-semibold text-ink-primary mb-1">
            Additional Information / Reason
          </label>
          <textarea
            rows={3}
            placeholder="Describe the medical situation, hemoglobin count, emergency surgery type, etc."
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full p-3 text-14 text-ink-primary bg-ui-surface border border-ui-border rounded-md hover:border-ink-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        {/* Safety & Responsible Posting Notice */}
        <div className="p-3 bg-ui-bg border border-ui-border rounded-md flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
          <p className="text-12 text-ink-secondary leading-snug">
            Please only post genuine emergencies. Donors will reach out to your contact number. Please mark this request as fulfilled as soon as blood is arranged to avoid unnecessary donor calls.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-ui-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCreateModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Post Blood Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};


'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { usePlatform } from '@/context/PlatformContext';
import { Phone, Copy, Check, MessageSquare, ShieldAlert, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export const ContactRequesterModal: React.FC = () => {
  const { activeContactRequest, setActiveContactRequest, contactRequest, user } = usePlatform();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [donorNotes, setDonorNotes] = useState('');

  if (!activeContactRequest) return null;

  const handleCopyPhone = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeContactRequest.contactNumber);
      setCopied(true);
      showToast('success', 'Phone Number Copied', activeContactRequest.contactNumber);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCall = () => {
    contactRequest(activeContactRequest.id, user?.name, user?.phone);
    window.location.href = `tel:${activeContactRequest.contactNumber}`;
  };

  const handleSms = () => {
    contactRequest(activeContactRequest.id, user?.name, user?.phone);
    const text = encodeURIComponent(
      `Hello, I saw your emergency request on RoktoBondhu for ${activeContactRequest.bloodGroup} blood at ${activeContactRequest.hospitalName}. I am available to donate. Please let me know the details.`
    );
    window.location.href = `sms:${activeContactRequest.contactNumber}?body=${text}`;
  };

  return (
    <Modal
      isOpen={!!activeContactRequest}
      onClose={() => setActiveContactRequest(null)}
      title="Contact Blood Requester"
      description="Connect directly with the patient attendants or family member."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Patient and Hospital Snapshot */}
        <div className="p-4 bg-ui-bg rounded-lg border border-ui-border flex items-center justify-between">
          <div>
            <span className="text-12 font-medium text-ink-muted">Requirement</span>
            <h4 className="text-16 font-bold text-ink-primary">
              {activeContactRequest.bloodGroup} ({activeContactRequest.units} Units)
            </h4>
            <p className="text-12 text-ink-secondary">
              {activeContactRequest.patientName} · {activeContactRequest.hospitalName}
            </p>
          </div>
          <div className="text-right">
            <span className="text-12 font-medium text-ink-muted">Urgency</span>
            <p className="text-14 font-bold text-semantic-error">
              {activeContactRequest.urgency}
            </p>
          </div>
        </div>

        {/* Primary Contact Box */}
        <div className="p-4 rounded-lg bg-brand-subtle border border-brand-light text-center">
          <p className="text-12 font-medium text-ink-secondary mb-1">Requester Phone Number</p>
          <div className="text-22 font-bold text-ink-primary tracking-wide mb-3">
            {activeContactRequest.contactNumber}
          </div>
          {activeContactRequest.alternateContact && (
            <p className="text-12 text-ink-secondary mb-3">
              Alternate: {activeContactRequest.alternateContact}
            </p>
          )}

          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={copied ? <Check className="w-4 h-4 text-semantic-success" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopyPhone}
            >
              {copied ? 'Copied' : 'Copy Number'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Phone className="w-4 h-4" />}
              onClick={handleCall}
            >
              Call Requester Now
            </Button>
          </div>
        </div>

        {/* Quick SMS Option */}
        <div className="p-3 bg-ui-surface rounded-lg border border-ui-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-brand-primary" />
            <div>
              <p className="text-14 font-semibold text-ink-primary">Send Quick SMS</p>
              <p className="text-12 text-ink-secondary">Pre-filled donor response template</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSms}>
            Send SMS
          </Button>
        </div>

        {/* Safety Guidelines */}
        <div className="p-3 bg-[#FFF9F2] border border-[#FDE6D2] rounded-md flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-semantic-warning flex-shrink-0 mt-0.5" />
          <div className="text-12 text-ink-secondary leading-snug">
            <strong className="text-ink-primary">Donor Guidelines:</strong>
            <p className="mt-0.5">
              Confirm patient registration number and ward location directly with hospital attendants before heading out. Ensure you are well hydrated and ate within the last 3 hours.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-ui-border">
          <Button
            variant="ghost"
            size="md"
            onClick={() => setActiveContactRequest(null)}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};


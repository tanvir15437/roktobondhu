'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { BloodGroupBadge, UrgencyBadge, StatusBadge } from '@/components/ui/Badges';
import { usePlatform } from '@/context/PlatformContext';
import {
  MapPin,
  Clock,
  User,
  Building2,
  Phone,
  ShieldAlert,
  Share2,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export const RequestDetailModal: React.FC = () => {
  const { activeDetailRequest, setActiveDetailRequest, setActiveContactRequest } = usePlatform();
  const { showToast } = useToast();

  if (!activeDetailRequest) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('info', 'Link Copied', 'Request link copied to clipboard.');
    }
  };

  const handleContact = () => {
    const req = activeDetailRequest;
    setActiveDetailRequest(null);
    setActiveContactRequest(req);
  };

  return (
    <Modal
      isOpen={!!activeDetailRequest}
      onClose={() => setActiveDetailRequest(null)}
      title={
        <div className="flex items-center gap-3">
          <BloodGroupBadge group={activeDetailRequest.bloodGroup} size="lg" />
          <div>
            <span className="text-18 sm:text-20 font-bold text-ink-primary">
              {activeDetailRequest.bloodGroup} Blood Needed
            </span>
            <div className="flex items-center gap-2 mt-1">
              <UrgencyBadge urgency={activeDetailRequest.urgency} />
              <StatusBadge status={activeDetailRequest.status} />
            </div>
          </div>
        </div>
      }
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Share2 className="w-4 h-4" />}
            onClick={handleShare}
          >
            Share
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setActiveDetailRequest(null)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Phone className="w-4 h-4" />}
              onClick={handleContact}
            >
              Contact Requester
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Core Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-ui-bg rounded-lg border border-ui-border">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-brand-light text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-12 text-ink-muted">Hospital & Center</p>
              <p className="text-14 font-semibold text-ink-primary">
                {activeDetailRequest.hospitalName}
              </p>
              <p className="text-12 text-ink-secondary">{activeDetailRequest.hospitalLocation}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-brand-light text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-12 text-ink-muted">Required By</p>
              <p className="text-14 font-semibold text-ink-primary">
                {activeDetailRequest.requiredDate} · {activeDetailRequest.requiredTime}
              </p>
              <p className="text-12 text-ink-secondary">Posted {activeDetailRequest.createdAt}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-brand-light text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-12 text-ink-muted">Patient Details</p>
              <p className="text-14 font-semibold text-ink-primary">
                {activeDetailRequest.patientName}
              </p>
              <p className="text-12 text-ink-secondary">
                Relation: {activeDetailRequest.patientRelation}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-brand-light text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-12 text-ink-muted">Units Required</p>
              <p className="text-14 font-semibold text-brand-primary">
                {activeDetailRequest.units} {activeDetailRequest.units > 1 ? 'Units' : 'Unit'}
              </p>
              <p className="text-12 text-ink-secondary">
                Division: {activeDetailRequest.division}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical / Case Notes */}
        {activeDetailRequest.additionalInfo && (
          <div className="p-4 bg-ui-surface rounded-lg border border-ui-border">
            <h4 className="text-14 font-semibold text-ink-primary mb-1">
              Case Description & Medical Notes
            </h4>
            <p className="text-14 text-ink-secondary leading-relaxed">
              {activeDetailRequest.additionalInfo}
            </p>
          </div>
        )}

        {/* Safety Notice as requested */}
        <div className="p-4 rounded-lg bg-[#FFF9F2] border border-[#FDE6D2] flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-semantic-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-14 font-bold text-ink-primary">Safety & Donation Notice</h4>
            <p className="text-12 text-ink-secondary mt-1 leading-normal">
              Only contact the requester if you are genuinely able to donate. Confirm hospital and patient details before donating. Blood donation through RoktoBondhu is 100% voluntary and humanitarian. Never offer or accept financial payment for blood.
            </p>
          </div>
        </div>

        {/* Donor Eligibility Reminder */}
        <div className="p-3 bg-brand-subtle rounded-md border border-brand-light flex items-center justify-between text-12 text-ink-secondary">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0" />
            <span>Ensure you have at least 12 weeks gap from your last donation.</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};


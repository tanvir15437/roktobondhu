'use client';

import React from 'react';
import { BloodRequest } from '@/types';
import { BloodGroupBadge, UrgencyBadge, StatusBadge } from '@/components/ui/Badges';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { usePlatform } from '@/context/PlatformContext';
import { Building2, MapPin, Clock, User, Phone } from 'lucide-react';

export interface RequestCardProps {
  request: BloodRequest;
  compact?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, compact = false }) => {
  const { setActiveDetailRequest, setActiveContactRequest } = usePlatform();

  return (
    <Card
      padding="none"
      className="flex flex-col justify-between overflow-hidden transition-all duration-150 hover:border-brand-primary/40 hover:shadow-card group"
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-ui-border/70 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <BloodGroupBadge group={request.bloodGroup} size={compact ? 'md' : 'lg'} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-16 sm:text-18 font-bold text-ink-primary group-hover:text-brand-primary transition-colors">
                {request.bloodGroup} Blood Needed
              </span>
            </div>
            <p className="text-12 font-semibold text-brand-primary mt-0.5">
              {request.units} {request.units > 1 ? 'Units' : 'Unit'} Required
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <UrgencyBadge urgency={request.urgency} />
          {request.status !== 'Active' && <StatusBadge status={request.status} />}
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 sm:p-5 space-y-2.5 flex-1">
        <div className="flex items-start gap-2.5 text-14 text-ink-primary">
          <Building2 className="w-4 h-4 text-ink-muted flex-shrink-0 mt-1" />
          <div>
            <span className="font-semibold block leading-tight">{request.hospitalName}</span>
            <span className="text-12 text-ink-secondary flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-ink-muted" />
              {request.hospitalLocation}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-12 text-ink-secondary">
          <Clock className="w-4 h-4 text-ink-muted flex-shrink-0" />
          <span>
            Required: <strong className="text-ink-primary">{request.requiredTime}</strong> ({request.requiredDate})
          </span>
        </div>

        <div className="flex items-center justify-between text-12 text-ink-secondary pt-2 border-t border-ui-border/50">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-ink-muted" />
            <span>Patient: <span className="font-medium text-ink-primary">{request.patientName}</span></span>
          </div>
          <span className="text-ink-muted">Posted {request.createdAt}</span>
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="p-3 sm:px-5 sm:py-3.5 bg-ui-bg/70 border-t border-ui-border flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => setActiveDetailRequest(request)}
        >
          View Request
        </Button>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Phone className="w-3.5 h-3.5" />}
          className="flex-1"
          onClick={() => setActiveContactRequest(request)}
        >
          Contact
        </Button>
      </div>
    </Card>
  );
};


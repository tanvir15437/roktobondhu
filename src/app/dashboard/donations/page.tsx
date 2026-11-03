'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/context/PlatformContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BloodGroupBadge } from '@/components/ui/Badges';
import { AddDonationModal } from '@/components/modals/AddDonationModal';
import {
  Calendar,
  Building2,
  MapPin,
  Heart,
  PlusCircle,
  Clock,
  ShieldCheck,
  FileCheck2,
  Award,
} from 'lucide-react';

export default function MyDonationsPage() {
  const { user, donations } = usePlatform();
  const [isAddDonationOpen, setAddDonationOpen] = useState(false);

  if (!user) {
    return (
      <div className="py-16 max-w-xl mx-auto px-4 text-center">
        <h2 className="text-24 font-bold text-ink-primary mb-2">My Donations Tracker</h2>
        <p className="text-14 text-ink-secondary mb-6">
          Sign in to view your blood donation timeline and personal badges.
        </p>
        <Link href="/login">
          <Button variant="primary" size="md">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  // Filter donations for the current donor
  const userDonations = donations.filter((d) => d.donorId === user.id || d.donorId === 'usr-101');

  return (
    <div className="py-8 sm:py-12 bg-ui-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-ui-border">
          <div>
            <div className="flex items-center gap-2 text-12 font-bold text-brand-primary uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              Verified Lifetime Records
            </div>
            <h1 className="text-24 sm:text-32 font-bold text-ink-primary tracking-tight">
              My Donation History
            </h1>
            <p className="text-14 text-ink-secondary mt-1">
              Keep track of all your voluntary donations, hospitals visited, and upcoming eligibility dates.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setAddDonationOpen(true)}
          >
            Record Past Donation
          </Button>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <span className="text-12 font-medium text-ink-muted block mb-1">Total Donations</span>
            <div className="text-28 sm:text-32 font-bold text-ink-primary">
              {userDonations.length}
            </div>
            <span className="text-12 text-ink-secondary">~{userDonations.length * 3} lives touched</span>
          </Card>

          <Card className="p-5">
            <span className="text-12 font-medium text-ink-muted block mb-1">Last Donation</span>
            <div className="text-16 sm:text-18 font-bold text-ink-primary">
              {user.lastDonationDate}
            </div>
            <span className="text-12 text-ink-secondary">Recorded in timeline</span>
          </Card>

          <Card className="p-5">
            <span className="text-12 font-medium text-ink-muted block mb-1">Next Eligible Date</span>
            <div className="text-16 sm:text-18 font-bold text-semantic-success">
              {user.nextEligibleDate}
            </div>
            <span className="text-12 text-ink-secondary">
              {user.isEligible ? 'Eligible to donate' : 'Cooldown period'}
            </span>
          </Card>

          <Card className="p-5">
            <span className="text-12 font-medium text-ink-muted block mb-1">Blood Group</span>
            <div className="text-24 sm:text-28 font-bold text-brand-primary">
              {user.bloodGroup}
            </div>
            <span className="text-12 text-ink-secondary">Verified donor profile</span>
          </Card>
        </div>

        {/* Donation Timeline / List */}
        <div className="bg-ui-surface p-6 sm:p-8 rounded-lg border border-ui-border shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-ui-border">
            <h3 className="text-18 font-bold text-ink-primary">Donation Timeline</h3>
            <span className="text-12 text-ink-muted">{userDonations.length} Records Documented</span>
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-ui-border">
            {userDonations.map((item, index) => (
              <div key={item.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-brand-light border-2 border-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                </div>

                <div className="p-4 bg-ui-bg rounded-lg border border-ui-border hover:border-brand-primary/40 transition-colors space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <BloodGroupBadge group={item.bloodGroup} size="sm" />
                      <h4 className="text-16 font-bold text-ink-primary">
                        {item.hospitalName}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-12 text-ink-secondary">
                      <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                      <strong className="text-ink-primary">{item.donationDate}</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-12 text-ink-secondary">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                      {item.location}
                    </span>
                    <span>·</span>
                    <span>Units: <strong>{item.units} Unit</strong></span>
                    {item.verified && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-semantic-success font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified Record
                        </span>
                      </>
                    )}
                  </div>

                  {item.note && (
                    <p className="text-12 text-ink-secondary pt-1 border-t border-ui-border/60 italic">
                      &ldquo;{item.note}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Card */}
        <div className="p-4 bg-ui-surface rounded-lg border border-ui-border flex items-start gap-3 text-12 text-ink-secondary">
          <FileCheck2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
          <p>
            This personal donation timeline helps you keep track of your humanitarian deeds and health interval. It is not an official government hospital certificate. For clinical screening, please present physical donor card if requested by hospital blood banks.
          </p>
        </div>
      </div>

      <AddDonationModal
        isOpen={isAddDonationOpen}
        onClose={() => setAddDonationOpen(false)}
      />
    </div>
  );
}


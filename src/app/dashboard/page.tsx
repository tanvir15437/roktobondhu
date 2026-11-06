'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/context/PlatformContext';
import { RequestCard } from '@/components/requests/RequestCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AddDonationModal } from '@/components/modals/AddDonationModal';
import { COMPATIBLE_RECIPIENTS } from '@/data/mockData';
import {
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  Activity,
} from 'lucide-react';

export default function DonorDashboardPage() {
  const { user, requests, updateUserAvailability, setCreateModalOpen } = usePlatform();
  const [isAddDonationOpen, setAddDonationOpen] = useState(false);

  if (!user) return null;

  // Get matching requests based on donor blood group compatibility
  const compatibleGroups = COMPATIBLE_RECIPIENTS[user.bloodGroup] || [user.bloodGroup];
  const matchingRequests = requests.filter(
    (req) =>
      (req.status === 'Active' || req.status === 'Partially Fulfilled') &&
      compatibleGroups.includes(req.bloodGroup)
  );

  const toggleAvailability = () => {
    const nextStatus = user.availabilityStatus === 'Available' ? 'Unavailable' : 'Available';
    updateUserAvailability(nextStatus);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
        {/* ========================================================= */}
        {/* TOP WELCOME & ELIGIBILITY BANNER                          */}
        {/* ========================================================= */}
        <div className="bg-ui-surface p-6 sm:p-8 rounded-lg border border-ui-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-14 font-semibold text-brand-primary">Donor Portal</span>
              <span className="text-ink-muted">·</span>
              <span className="text-12 px-2 py-0.5 rounded-sm bg-brand-light text-brand-primary font-bold">
                Group {user.bloodGroup}
              </span>
            </div>
            <h1 className="text-24 sm:text-32 font-bold text-ink-primary tracking-tight">
              Good day, {user.name}
            </h1>
            <div className="flex items-center gap-2 text-14 text-ink-secondary">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  user.isEligible ? 'bg-semantic-success' : 'bg-semantic-warning'
                }`}
              />
              <strong className="text-ink-primary">
                {user.isEligible ? "You're eligible to donate" : 'Not eligible to donate yet'}
              </strong>
              <span>· Next eligible date: <strong className="text-brand-primary">{user.nextEligibleDate}</strong></span>
            </div>
          </div>

          {/* Availability Status Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="p-3 bg-ui-bg rounded-md border border-ui-border text-center sm:text-left">
              <span className="text-12 text-ink-muted block">Availability Status</span>
              <span
                className={`text-14 font-bold ${
                  user.availabilityStatus === 'Available'
                    ? 'text-semantic-success'
                    : 'text-ink-muted'
                }`}
              >
                {user.availabilityStatus} to Donate
              </span>
            </div>

            <Button
              variant={user.availabilityStatus === 'Available' ? 'outline' : 'success'}
              size="md"
              onClick={toggleAvailability}
            >
              {user.availabilityStatus === 'Available' ? 'Set as Unavailable' : 'Mark as Available'}
            </Button>

            <Button
              variant="primary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => setAddDonationOpen(true)}
            >
              Log Donation
            </Button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* KEY DONOR STATISTICS                                      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-5">
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-12 font-medium">Total Donations</span>
              <Heart className="w-4 h-4 text-brand-primary" />
            </div>
            <div className="text-28 sm:text-36 font-bold text-ink-primary">
              {user.totalDonations}
            </div>
            <p className="text-12 text-ink-secondary mt-1">Verified community donations</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-12 font-medium">Last Donation</span>
              <Calendar className="w-4 h-4 text-brand-primary" />
            </div>
            <div className="text-18 sm:text-20 font-bold text-ink-primary">
              {user.lastDonationDate}
            </div>
            <p className="text-12 text-ink-secondary mt-1">
              {user.division} Medical Network
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-12 font-medium">Blood Group</span>
              <Activity className="w-4 h-4 text-brand-primary" />
            </div>
            <div className="text-28 sm:text-36 font-bold text-brand-primary">
              {user.bloodGroup}
            </div>
            <p className="text-12 text-ink-secondary mt-1">
              Can give to {compatibleGroups.join(', ')}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-12 font-medium">Next Eligible Date</span>
              <Clock className="w-4 h-4 text-brand-primary" />
            </div>
            <div className="text-18 sm:text-20 font-bold text-semantic-success">
              {user.nextEligibleDate}
            </div>
            <p className="text-12 text-ink-secondary mt-1">
              {user.isEligible ? 'Eligible today' : 'Cooldown in progress'}
            </p>
          </Card>
        </div>

        {/* ========================================================= */}
        {/* PRIMARY SECTION: REQUESTS YOU CAN HELP WITH               */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-12 font-bold text-brand-primary uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                Tailored Matching
              </div>
              <h2 className="text-20 sm:text-24 font-bold text-ink-primary">
                Requests You Can Help With
              </h2>
              <p className="text-14 text-ink-secondary mt-0.5">
                Active hospital requests compatible with your <strong className="text-brand-primary">{user.bloodGroup}</strong> blood group.
              </p>
            </div>

            <Link href="/requests">
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Browse All Requests ({requests.length})
              </Button>
            </Link>
          </div>

          {matchingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingRequests.map((req) => (
                <RequestCard key={req.id} request={req} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-ink-secondary">
              <p className="text-14 font-semibold text-ink-primary mb-1">No Urgent Compatible Requests</p>
              <p className="text-12 mb-4">There are currently no active requests waiting for {user.bloodGroup} blood in your area.</p>
              <Link href="/requests">
                <Button variant="outline" size="sm">
                  View All Requests
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* ========================================================= */}
        {/* ELIGIBILITY & CLINICAL NOTICE                             */}
        {/* ========================================================= */}
        <div className="p-4 bg-ui-surface rounded-lg border border-ui-border flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
          <div className="text-12 text-ink-secondary leading-relaxed">
            <strong className="text-ink-primary">Medical Disclaimer:</strong> Next eligible donation date calculation is an informational estimation based on the standard 90-day recovery interval. Actual donation eligibility is subject to clinical on-site screening (blood pressure, hemoglobin test, medical history) performed by certified doctors at the blood donation center.
          </div>
        </div>

        {/* Add Donation Modal */}
        <AddDonationModal
          isOpen={isAddDonationOpen}
          onClose={() => setAddDonationOpen(false)}
        />
      </div>
    );
  }


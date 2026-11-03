'use client';

import React, { useState, useMemo } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { RequestCard } from '@/components/requests/RequestCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { BloodGroup, UrgencyLevel, BangladeshDivision } from '@/types';
import { BANGLADESH_DIVISIONS, BLOOD_GROUPS } from '@/data/mockData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Droplets,
  Calendar,
  AlertCircle,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export default function FindBloodPage() {
  const { requests, user, setCreateModalOpen } = usePlatform();

  // Search & Filter State
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filtered requests computation
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Blood group filter
      if (selectedGroup !== 'ALL' && req.bloodGroup !== selectedGroup) {
        return false;
      }
      // Division filter
      if (selectedDivision !== 'ALL' && req.division !== selectedDivision) {
        return false;
      }
      // Urgency filter
      if (selectedUrgency !== 'ALL' && req.urgency !== selectedUrgency) {
        return false;
      }
      // Date filter
      if (selectedDate && req.requiredDate !== selectedDate) {
        return false;
      }
      // Query filter (search hospital, patient, or notes)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesHospital = req.hospitalName.toLowerCase().includes(q);
        const matchesLocation = req.hospitalLocation.toLowerCase().includes(q);
        const matchesPatient = req.patientName.toLowerCase().includes(q);
        const matchesNotes = req.additionalInfo?.toLowerCase().includes(q);
        if (!matchesHospital && !matchesLocation && !matchesPatient && !matchesNotes) {
          return false;
        }
      }
      return true;
    });
  }, [requests, selectedGroup, selectedDivision, selectedUrgency, selectedDate, searchQuery]);

  const activeFiltersCount =
    (selectedGroup !== 'ALL' ? 1 : 0) +
    (selectedDivision !== 'ALL' ? 1 : 0) +
    (selectedUrgency !== 'ALL' ? 1 : 0) +
    (selectedDate ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const resetFilters = () => {
    setSelectedGroup('ALL');
    setSelectedDivision('ALL');
    setSelectedUrgency('ALL');
    setSelectedDate('');
    setSearchQuery('');
  };

  const setMatchingMyBlood = () => {
    if (user?.bloodGroup) {
      setSelectedGroup(user.bloodGroup);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-ui-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-ui-border">
          <div>
            <div className="flex items-center gap-2 text-12 font-bold text-brand-primary uppercase tracking-wider mb-1">
              <Droplets className="w-4 h-4" />
              Live Blood Requirement Directory
            </div>
            <h1 className="text-24 sm:text-32 font-bold text-ink-primary tracking-tight">
              Find Someone Who Needs Your Blood
            </h1>
            <p className="text-14 text-ink-secondary mt-1 max-w-2xl">
              Filter emergency requests by your blood group, division, or hospital. Contact attendants directly to volunteer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => setCreateModalOpen(true)}
            >
              Post a Request
            </Button>
            {user?.bloodGroup && selectedGroup !== user.bloodGroup && (
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Sparkles className="w-4 h-4" />}
                onClick={setMatchingMyBlood}
              >
                Match My Group ({user.bloodGroup})
              </Button>
            )}
          </div>
        </div>

        {/* Quick Filter Bar */}
        <div className="my-6 bg-ui-surface p-4 rounded-lg border border-ui-border shadow-subtle space-y-4">
          {/* Blood Group Fast Selectors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-12 font-bold text-ink-primary uppercase tracking-wider">
                Select Blood Group
              </label>
              {selectedGroup !== 'ALL' && (
                <button
                  onClick={() => setSelectedGroup('ALL')}
                  className="text-12 text-brand-primary hover:underline font-medium"
                >
                  Show All Groups
                </button>
              )}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
              <button
                onClick={() => setSelectedGroup('ALL')}
                className={`h-9 text-12 font-bold rounded-md border transition-colors ${
                  selectedGroup === 'ALL'
                    ? 'bg-brand-primary text-white border-brand-primary shadow-subtle'
                    : 'bg-ui-surface text-ink-secondary border-ui-border hover:border-brand-primary/40'
                }`}
              >
                All
              </button>
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`h-9 text-12 font-bold rounded-md border transition-colors ${
                    selectedGroup === bg
                      ? 'bg-brand-primary text-white border-brand-primary shadow-subtle'
                      : 'bg-ui-surface text-ink-primary border-ui-border hover:border-brand-primary/40'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Secondary Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-ui-border">
            <Input
              placeholder="Search hospital, ward or patient..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Bangladesh Divisions' },
                ...BANGLADESH_DIVISIONS.map((d) => ({ value: d, label: d })),
              ]}
            />

            <Select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Urgency Levels' },
                { value: 'URGENT', label: 'Urgent (Immediate)' },
                { value: 'TODAY', label: 'Today' },
                { value: 'WITHIN_24H', label: 'Within 24 Hours' },
                { value: 'WITHIN_3_DAYS', label: 'Within 3 Days' },
                { value: 'SCHEDULED', label: 'Scheduled' },
              ]}
            />

            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                title="Filter by required date"
              />
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={resetFilters}
                  title="Clear all filters"
                  className="text-ink-muted hover:text-ink-primary flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-4 text-14 text-ink-secondary">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-ink-primary">{filteredRequests.length}</strong> active requests
            </span>
            {activeFiltersCount > 0 && (
              <span className="text-12 px-2 py-0.5 rounded-sm bg-brand-light text-brand-primary font-semibold">
                {activeFiltersCount} filters active
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-12 text-brand-primary hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Requests Grid or Empty State */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<AlertCircle className="w-6 h-6" />}
            title="No Matching Blood Requests Found"
            description="There are currently no active requests matching your selected filters. Try broadening your criteria or reset filters."
            actionLabel="Reset All Filters"
            onAction={resetFilters}
          />
        )}
      </div>
    </div>
  );
}

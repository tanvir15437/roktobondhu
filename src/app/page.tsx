'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { RequestCard } from '@/components/requests/RequestCard';
import { usePlatform } from '@/context/PlatformContext';
import {
  Search,
  PlusCircle,
  HeartHandshake,
  CalendarCheck,
  ShieldCheck,
  Users,
  Building,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { requests, setCreateModalOpen } = usePlatform();

  // Highlight urgent requests for Section 3
  const urgentRequests = requests
    .filter((req) => req.status === 'Active' || req.status === 'Partially Fulfilled')
    .slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ========================================================= */}
      {/* SECTION 1: HERO                                           */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-ui-surface border-b border-ui-border py-16 sm:py-24">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-brand-light/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-brand-subtle blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-subtle border border-brand-light text-brand-primary text-12 font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                Bangladesh Emergency Blood Network
              </div>

              <h1 className="text-32 sm:text-44 font-bold text-ink-primary tracking-tight leading-[1.15]">
                Someone needs blood. <br className="hidden sm:inline" />
                <span className="text-brand-primary">You could be the one who helps.</span>
              </h1>

              <p className="text-16 sm:text-18 text-ink-secondary max-w-xl leading-relaxed">
                Find urgent blood requests near you or create a request when someone needs help. A fast, transparent and community-led emergency platform for all 8 divisions.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link href="/requests">
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<Search className="w-5 h-5" />}
                    className="w-full sm:w-auto"
                  >
                    Find Blood Requests
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<PlusCircle className="w-5 h-5" />}
                  onClick={() => setCreateModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  I Need Blood
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-ui-border flex flex-wrap items-center gap-6 text-12 text-ink-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-semantic-success" />
                  <span>Verified phone numbers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-semantic-success" />
                  <span>Direct patient attendant contact</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-semantic-success" />
                  <span>100% Free & voluntary</span>
                </div>
              </div>
            </div>

            {/* Right Visual: Clean, trustworthy live emergency snapshot card */}
            <div className="lg:col-span-5">
              <div className="bg-ui-surface rounded-lg border border-ui-border shadow-card p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-ui-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-semantic-error animate-ping" />
                    <span className="text-14 font-bold text-ink-primary">Live Emergency Feed</span>
                  </div>
                  <span className="text-12 text-ink-muted">Updated moments ago</span>
                </div>

                {/* Sample Micro-card 1 */}
                <div className="p-3 bg-ui-bg rounded-md border border-ui-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-md bg-brand-primary text-white font-bold flex items-center justify-center text-14">
                      O+
                    </span>
                    <div>
                      <p className="text-14 font-semibold text-ink-primary leading-tight">
                        Dhaka Medical College
                      </p>
                      <p className="text-12 text-ink-secondary">2 Units · Surgery · 7:00 PM</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-sm text-12 font-bold bg-semantic-error-subtle text-semantic-error">
                    URGENT
                  </span>
                </div>

                {/* Sample Micro-card 2 */}
                <div className="p-3 bg-ui-bg rounded-md border border-ui-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-md bg-brand-primary text-white font-bold flex items-center justify-center text-14">
                      B+
                    </span>
                    <div>
                      <p className="text-14 font-semibold text-ink-primary leading-tight">
                        Chattogram Medical College
                      </p>
                      <p className="text-12 text-ink-secondary">3 Units · Cesarean · 6:00 PM</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-sm text-12 font-bold bg-semantic-warning-subtle text-semantic-warning">
                    Today
                  </span>
                </div>

                {/* Quick Info bar */}
                <div className="p-3 bg-brand-subtle rounded-md border border-brand-light flex items-center justify-between text-12">
                  <span className="text-ink-secondary">Total Active Inquiries:</span>
                  <span className="font-bold text-brand-primary">8 Inquiries in Progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: QUICK ACTION                                   */}
      {/* ========================================================= */}
      <section className="py-12 sm:py-16 bg-ui-bg border-b border-ui-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-ui-surface p-6 rounded-lg border border-ui-border shadow-subtle hover:border-brand-primary/40 transition-all">
              <div className="w-10 h-10 rounded-md bg-brand-light text-brand-primary flex items-center justify-center mb-4">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="text-18 font-bold text-ink-primary mb-1">Need Blood?</h3>
              <p className="text-14 text-ink-secondary mb-4 leading-relaxed">
                Post your requirement in under 60 seconds. Connect directly with eligible nearby donors.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreateModalOpen(true)}
              >
                Post a Requirement
              </Button>
            </div>

            {/* Card 2 */}
            <div className="bg-ui-surface p-6 rounded-lg border border-ui-border shadow-subtle hover:border-brand-primary/40 transition-all">
              <div className="w-10 h-10 rounded-md bg-brand-light text-brand-primary flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-18 font-bold text-ink-primary mb-1">Want to Donate?</h3>
              <p className="text-14 text-ink-secondary mb-4 leading-relaxed">
                Find someone who needs your blood group right now at a hospital near your area.
              </p>
              <Link href="/requests">
                <Button variant="outline" size="sm">
                  Browse Active Requests
                </Button>
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-ui-surface p-6 rounded-lg border border-ui-border shadow-subtle hover:border-brand-primary/40 transition-all">
              <div className="w-10 h-10 rounded-md bg-brand-light text-brand-primary flex items-center justify-center mb-4">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-18 font-bold text-ink-primary mb-1">Track Donations</h3>
              <p className="text-14 text-ink-secondary mb-4 leading-relaxed">
                Keep your donation history in one place and know exactly when you become eligible again.
              </p>
              <Link href="/dashboard/donations">
                <Button variant="outline" size="sm">
                  View Donation History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: URGENT REQUESTS                                */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 bg-ui-surface border-b border-ui-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-12 font-bold text-semantic-error uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-semantic-error animate-pulse" />
                Emergency Cases
              </div>
              <h2 className="text-24 sm:text-32 font-bold text-ink-primary tracking-tight">
                Urgent Blood Requests
              </h2>
              <p className="text-14 text-ink-secondary mt-1">
                Patients who need blood units immediately or within today.
              </p>
            </div>

            <Link href="/requests">
              <Button
                variant="outline"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View All Requests ({requests.length})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {urgentRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: HOW IT WORKS                                   */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-ui-bg border-b border-ui-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-12 font-bold text-brand-primary uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h2 className="text-24 sm:text-32 font-bold text-ink-primary tracking-tight mt-1 mb-3">
            How RoktoBondhu Works
          </h2>
          <p className="text-14 sm:text-16 text-ink-secondary max-w-xl mx-auto mb-12">
            No complicated forms. We focus entirely on quick connection when time matters most.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-ui-surface p-8 rounded-lg border border-ui-border shadow-subtle text-left">
              <span className="text-32 font-bold text-brand-secondary/40 leading-none">01</span>
              <h3 className="text-18 font-bold text-ink-primary mt-4 mb-2">
                Post a Request
              </h3>
              <p className="text-14 text-ink-secondary leading-relaxed">
                Provide hospital name, required units, patient details, and contact number. The request becomes visible immediately.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-ui-surface p-8 rounded-lg border border-ui-border shadow-subtle text-left">
              <span className="text-32 font-bold text-brand-secondary/40 leading-none">02</span>
              <h3 className="text-18 font-bold text-ink-primary mt-4 mb-2">
                Find a Donor
              </h3>
              <p className="text-14 text-ink-secondary leading-relaxed">
                Eligible donors in your division filter requests by blood group and call the contact person directly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-ui-surface p-8 rounded-lg border border-ui-border shadow-subtle text-left">
              <span className="text-32 font-bold text-brand-secondary/40 leading-none">03</span>
              <h3 className="text-18 font-bold text-ink-primary mt-4 mb-2">
                Save a Life
              </h3>
              <p className="text-14 text-ink-secondary leading-relaxed">
                Donor arrives at the hospital, completes medical screening, donates blood, and marks the requirement fulfilled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: WHY DONATE?                                    */}
      {/* ========================================================= */}
      <section id="why-donate" className="py-16 sm:py-20 bg-ui-surface border-b border-ui-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-12 font-bold text-brand-primary uppercase tracking-wider">
                Community Responsibility
              </span>
              <h2 className="text-24 sm:text-32 font-bold text-ink-primary tracking-tight">
                Why Donate Through RoktoBondhu?
              </h2>
              <p className="text-14 sm:text-16 text-ink-secondary leading-relaxed">
                In Bangladesh, over 1,000 bags of blood are needed daily for emergency surgeries, road accidents, thalassemia patients, and childbirth complications.
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-sm bg-brand-light text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-14 font-bold text-ink-primary">Help someone in an emergency</h4>
                    <p className="text-12 text-ink-secondary">
                      Your single donation can be the difference for a patient in critical care.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-sm bg-brand-light text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-14 font-bold text-ink-primary">Support your local community</h4>
                    <p className="text-12 text-ink-secondary">
                      Direct connection with families without middlemen or commercial blood brokers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-sm bg-brand-light text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-14 font-bold text-ink-primary">Keep your donation history</h4>
                    <p className="text-12 text-ink-secondary">
                      Maintain a structured digital timeline of every hospital visit and donation date.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-sm bg-brand-light text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-14 font-bold text-ink-primary">Know when you are eligible again</h4>
                    <p className="text-12 text-ink-secondary">
                      Clear reminders ensuring the required 3-month gap between safe donations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Donor Guidelines Info Card */}
            <div className="lg:col-span-6">
              <div className="bg-ui-bg p-6 sm:p-8 rounded-lg border border-ui-border space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-brand-primary" />
                  <h3 className="text-18 font-bold text-ink-primary">Safe Donation Guidelines</h3>
                </div>
                <p className="text-12 text-ink-secondary">
                  RoktoBondhu promotes safe, medically verified donations. Local clinical guidelines recommend:
                </p>

                <div className="grid grid-cols-2 gap-3 text-12">
                  <div className="p-3 bg-ui-surface rounded-md border border-ui-border">
                    <span className="font-bold text-ink-primary block">Age Range</span>
                    <span className="text-ink-secondary">18 to 60 years old</span>
                  </div>
                  <div className="p-3 bg-ui-surface rounded-md border border-ui-border">
                    <span className="font-bold text-ink-primary block">Weight</span>
                    <span className="text-ink-secondary">Minimum 50 kg</span>
                  </div>
                  <div className="p-3 bg-ui-surface rounded-md border border-ui-border">
                    <span className="font-bold text-ink-primary block">Interval</span>
                    <span className="text-ink-secondary">At least 90 days gap</span>
                  </div>
                  <div className="p-3 bg-ui-surface rounded-md border border-ui-border">
                    <span className="font-bold text-ink-primary block">Hemoglobin</span>
                    <span className="text-ink-secondary">12.5 g/dL or above</span>
                  </div>
                </div>

                <p className="text-12 text-ink-muted leading-snug">
                  *This information is educational and not medical advice. Clinical eligibility is determined on-site by certified blood bank officers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: DONATION IMPACT                                */}
      {/* ========================================================= */}
      <section id="impact" className="py-16 sm:py-20 bg-ui-bg border-b border-ui-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-12 font-bold text-brand-primary uppercase tracking-wider">
            Verified Community Impact
          </span>
          <h2 className="text-24 sm:text-32 font-bold text-ink-primary tracking-tight mt-1 mb-3">
            Real Lives Reached Across Bangladesh
          </h2>
          <p className="text-14 sm:text-16 text-ink-secondary max-w-lg mx-auto mb-12">
            Every statistic represents an anxious family that found a willing donor in their time of need.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-ui-surface p-8 rounded-lg border border-ui-border shadow-subtle">
              <span className="text-36 sm:text-44 font-bold text-brand-primary leading-none">
                12,480+
              </span>
              <h3 className="text-16 font-bold text-ink-primary mt-3">
                Blood Requests Posted
              </h3>
              <p className="text-12 text-ink-secondary mt-1">
                Across all 8 divisional medical hospitals
              </p>
            </div>

            <div className="bg-ui-surface p-8 rounded-lg border border-ui-border shadow-subtle">
              <span className="text-36 sm:text-44 font-bold text-semantic-success leading-none">
                8,900+
              </span>
              <h3 className="text-16 font-bold text-ink-primary mt-3">
                Successful Connections
              </h3>
              <p className="text-12 text-ink-secondary mt-1">
                Direct phone matches with willing donors
              </p>
            </div>

            <div className="bg-ui-surface p-8 rounded-lg border border-ui-border shadow-subtle">
              <span className="text-36 sm:text-44 font-bold text-brand-secondary leading-none">
                5,200+
              </span>
              <h3 className="text-16 font-bold text-ink-primary mt-3">
                Active Donors
              </h3>
              <p className="text-12 text-ink-secondary mt-1">
                Verified volunteers ready on call
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: COMMUNITY CTA                                  */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 bg-ui-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center mx-auto mb-4">
            <HeartHandshake className="w-6 h-6" />
          </div>

          <h2 className="text-28 sm:text-36 font-bold text-ink-primary tracking-tight mb-4">
            Your blood could be someone&apos;s second chance.
          </h2>

          <p className="text-16 text-ink-secondary max-w-xl mx-auto mb-8 leading-relaxed">
            Register as a voluntary donor today. Receive emergency notifications only when someone near your area is desperately looking for your blood group.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Become a Donor
              </Button>
            </Link>
            <Link href="/requests">
              <Button variant="outline" size="lg">
                Explore Active Requests
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


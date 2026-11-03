'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePlatform } from '@/context/PlatformContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { BANGLADESH_DIVISIONS, BLOOD_GROUPS } from '@/data/mockData';
import { BloodGroup, BangladeshDivision } from '@/types';
import { Droplets, HeartHandshake, PlusCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { loginAs, updateUserProfile } = usePlatform();

  // User intent choice
  const [intent, setIntent] = useState<'donor' | 'requester'>('donor');

  // Lightweight essential fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [division, setDivision] = useState<BangladeshDivision>('Dhaka');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!password.trim() || password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      loginAs(intent === 'donor' ? 'donor' : 'requester');
      updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        bloodGroup,
        division,
      });
      setLoading(false);
      router.push(intent === 'donor' ? '/dashboard' : '/dashboard/my-requests');
    }, 400);
  };

  return (
    <div className="py-12 sm:py-20 bg-ui-bg min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-brand-primary text-white flex items-center justify-center shadow-subtle">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-22 font-bold text-ink-primary">
              Rokto<span className="text-brand-primary">Bondhu</span>
            </span>
          </Link>
          <h1 className="text-20 sm:text-24 font-bold text-ink-primary tracking-tight">
            Create Your Account
          </h1>
          <p className="text-14 text-ink-secondary">
            Join the community blood network. Takes less than a minute.
          </p>
        </div>

        {/* Lightweight Registration Form */}
        <Card className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Primary Intent Choice */}
            <div>
              <label className="block text-14 font-semibold text-ink-primary mb-2">
                What is your primary goal today?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIntent('donor')}
                  className={`p-3.5 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                    intent === 'donor'
                      ? 'border-brand-primary bg-brand-light/40 shadow-subtle'
                      : 'border-ui-border hover:border-brand-primary/40 bg-ui-surface'
                  }`}
                >
                  <HeartHandshake className={`w-5 h-5 mt-0.5 ${intent === 'donor' ? 'text-brand-primary' : 'text-ink-muted'}`} />
                  <div>
                    <span className="text-14 font-bold text-ink-primary block leading-tight">
                      I want to donate
                    </span>
                    <span className="text-12 text-ink-secondary leading-snug">
                      Receive alerts when someone needs your blood group.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIntent('requester')}
                  className={`p-3.5 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                    intent === 'requester'
                      ? 'border-brand-primary bg-brand-light/40 shadow-subtle'
                      : 'border-ui-border hover:border-brand-primary/40 bg-ui-surface'
                  }`}
                >
                  <PlusCircle className={`w-5 h-5 mt-0.5 ${intent === 'requester' ? 'text-brand-primary' : 'text-ink-muted'}`} />
                  <div>
                    <span className="text-14 font-bold text-ink-primary block leading-tight">
                      I may need blood
                    </span>
                    <span className="text-12 text-ink-secondary leading-snug">
                      Post emergency blood requests for a patient.
                    </span>
                  </div>
                </button>
              </div>
              <p className="mt-2 text-12 text-ink-muted italic">
                *You can both donate blood and post blood requests from your account at any time.
              </p>
            </div>

            {/* Essential Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                placeholder="e.g. Rahim Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                requiredIndicator
              />
              <Input
                label="Phone Number"
                placeholder="e.g. +880 1712-345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                requiredIndicator
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Blood Group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                options={[...BLOOD_GROUPS]}
                requiredIndicator
              />
              <Select
                label="Division"
                value={division}
                onChange={(e) => setDivision(e.target.value as BangladeshDivision)}
                options={BANGLADESH_DIVISIONS}
                requiredIndicator
              />
            </div>

            <Input
              type="password"
              label="Choose a Password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              requiredIndicator
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>
        </Card>

        {/* Login Footer Link */}
        <p className="text-center text-14 text-ink-secondary">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-brand-primary hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}


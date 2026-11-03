'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Droplets, ArrowLeft, CheckCircle2, Phone } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-ui-bg min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
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
            Reset Your Password
          </h1>
          <p className="text-14 text-ink-secondary">
            Enter your registered mobile number to receive a 6-digit recovery code.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-4">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Mobile Number"
                placeholder="+880 1712-345678"
                leftIcon={<Phone className="w-4 h-4" />}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                requiredIndicator
              />

              <Button type="submit" variant="primary" size="lg" fullWidth>
                Send Verification Code
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-semantic-success-subtle text-semantic-success flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-16 font-bold text-ink-primary">Code Sent Successfully</h3>
              <p className="text-14 text-ink-secondary leading-relaxed">
                We have sent an SMS verification code to <strong className="text-ink-primary">{phone}</strong>.
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="outline" size="md">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-14 text-ink-secondary hover:text-brand-primary font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}


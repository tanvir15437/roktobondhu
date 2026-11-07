'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';
import {
  Droplets,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Lock,
  KeyRound,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Step state: 1 = Request OTP, 2 = Verify OTP & Enter New Password, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Helper info
  const [demoOtp, setDemoOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // STEP 1: Request Password Recovery Code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your registered mobile number or email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.auth.forgotPassword(identifier.trim());
      if (res?.demoOtp) {
        setDemoOtp(res.demoOtp);
        setOtp(res.demoOtp); // Auto-fill for friction-free testing
      }
      showToast('success', 'Recovery Code Generated', `Verification code sent for ${identifier}.`);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'No registered account found with this information.');
      showToast('error', 'Request Failed', err.message || 'Account not found.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      await api.auth.resetPassword({
        identifier: identifier.trim(),
        otp: otp.trim(),
        newPassword,
      });

      showToast('success', 'Password Updated', 'Your password has been changed successfully.');
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code.');
      showToast('error', 'Reset Failed', err.message || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.auth.forgotPassword(identifier.trim());
      if (res?.demoOtp) {
        setDemoOtp(res.demoOtp);
        setOtp(res.demoOtp);
      }
      showToast('info', 'Code Resent', `A new verification code is ready.`);
    } catch (err: any) {
      showToast('error', 'Resend Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-ui-bg min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
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
            {step === 1 && 'Reset Your Password'}
            {step === 2 && 'Enter Verification Code'}
            {step === 3 && 'Password Changed!'}
          </h1>
          <p className="text-14 text-ink-secondary">
            {step === 1 && 'Enter your registered phone or email to receive a recovery code.'}
            {step === 2 && `Enter the 6-digit code sent for ${identifier} and choose a new password.`}
            {step === 3 && 'Your account security has been updated successfully.'}
          </p>
        </div>

        {/* Progress Step Pills */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-2 text-12 font-medium">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${step === 1 ? 'bg-brand-light text-brand-primary font-bold' : 'bg-ui-surface text-ink-muted border border-ui-border'}`}>
              <span className="w-4 h-4 rounded-full bg-brand-primary text-white text-10 font-bold flex items-center justify-center">1</span>
              <span>Find Account</span>
            </div>
            <span className="text-ink-muted">→</span>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${step === 2 ? 'bg-brand-light text-brand-primary font-bold' : 'bg-ui-surface text-ink-muted border border-ui-border'}`}>
              <span className="w-4 h-4 rounded-full bg-brand-primary text-white text-10 font-bold flex items-center justify-center">2</span>
              <span>Verify & Reset</span>
            </div>
          </div>
        )}

        <Card className="p-6 sm:p-8 space-y-4 shadow-card">
          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-semantic-error-subtle border border-[#F8C8C8] rounded-md flex items-start gap-2.5 text-12 text-semantic-error animate-in fade-in">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Enter Phone or Email */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <Input
                label="Registered Phone Number or Email"
                placeholder="+880 1712-345678 or user@example.com"
                leftIcon={<Phone className="w-4 h-4" />}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                requiredIndicator
              />

              {/* Quick Demo Pre-fills for Testing */}
              <div className="p-3 bg-ui-bg rounded-md border border-ui-border space-y-2">
                <span className="text-11 font-bold text-ink-secondary block uppercase tracking-wider">
                  Test with demo accounts:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIdentifier('+880 1712-345678')}
                    className="px-2 py-1 bg-ui-surface hover:bg-brand-light/60 text-11 font-semibold text-brand-primary rounded border border-ui-border transition-colors"
                  >
                    Rahim (+880 1712-345678)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdentifier('+880 1819-234567')}
                    className="px-2 py-1 bg-ui-surface hover:bg-brand-light/60 text-11 font-semibold text-brand-primary rounded border border-ui-border transition-colors"
                  >
                    Tanjil (+880 1819-234567)
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Recovery Code
              </Button>
            </form>
          )}

          {/* STEP 2: Enter 6-Digit OTP and Set New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Dev Testing OTP Helper Banner */}
              {demoOtp && (
                <div className="p-3 bg-brand-subtle border border-brand-light rounded-md space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-11 font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Testing OTP Generated:
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtp(demoOtp)}
                      className="text-11 font-bold text-brand-primary hover:underline"
                    >
                      Use Code
                    </button>
                  </div>
                  <div className="text-20 font-mono font-bold tracking-widest text-ink-primary">
                    {demoOtp}
                  </div>
                  <p className="text-11 text-ink-secondary">
                    (In production with SMS/Email gateway, this code is sent to your phone/inbox)
                  </p>
                </div>
              )}

              <div>
                <Input
                  label="6-Digit Verification Code"
                  placeholder="e.g. 123456"
                  leftIcon={<KeyRound className="w-4 h-4" />}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  requiredIndicator
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-11 text-ink-muted">Code expires in 10 minutes</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-12 font-semibold text-brand-primary hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend Code
                  </button>
                </div>
              </div>

              <div>
                <label className="text-14 font-semibold text-ink-primary mb-1 block">
                  New Password <span className="text-semantic-error">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    leftIcon={<Lock className="w-4 h-4" />}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-14 font-semibold text-ink-primary mb-1 block">
                  Confirm New Password <span className="text-semantic-error">*</span>
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-type new password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                >
                  Update Password
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: Reset Success */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#E8F8F0] text-semantic-success flex items-center justify-center mx-auto shadow-subtle">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-18 font-bold text-ink-primary">Password Reset Complete!</h3>
                <p className="text-14 text-ink-secondary leading-relaxed">
                  Your password has been successfully updated. You can now sign in with your new credentials.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/login" className="block">
                  <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Sign In Now
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        {/* Back to Sign In Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-14 text-ink-secondary hover:text-brand-primary font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

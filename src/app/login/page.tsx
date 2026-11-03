'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePlatform } from '@/context/PlatformContext';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Droplets, Lock, Phone, UserCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAs, refreshData } = usePlatform();
  const { showToast } = useToast();
  const [identifier, setIdentifier] = useState('+880 1712-345678');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.auth.login(identifier, password).catch(() => null);
      if (res?.user) {
        showToast('success', 'Logged In', `Welcome back, ${res.user.name}!`);
        await refreshData();
        router.push('/dashboard');
      } else {
        // Fallback for demo
        await loginAs('donor');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      showToast('error', 'Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoDonor = async () => {
    await loginAs('donor');
    router.push('/dashboard');
  };

  const handleDemoRequester = async () => {
    await loginAs('requester');
    router.push('/dashboard/my-requests');
  };

  return (
    <div className="py-12 sm:py-20 bg-ui-bg min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
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
            Sign In to Your Account
          </h1>
          <p className="text-14 text-ink-secondary">
            Manage your donation history or track your emergency blood requests.
          </p>
        </div>

        {/* Demo Fast Logins for UX Reviewers */}
        <div className="p-4 bg-brand-subtle rounded-lg border border-brand-light space-y-2">
          <div className="flex items-center gap-1.5 text-12 font-bold text-brand-primary">
            <UserCheck className="w-4 h-4" />
            <span>Interactive Demo Quick Switch</span>
          </div>
          <p className="text-12 text-ink-secondary">
            Test the experience instantly with one click:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDemoDonor}
              className="text-12 font-semibold bg-ui-surface"
            >
              Sign In as Donor (Rahim)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDemoRequester}
              className="text-12 font-semibold bg-ui-surface"
            >
              Sign In as Requester (Tanjil)
            </Button>
          </div>
        </div>

        {/* Login Form */}
        <Card className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 bg-semantic-error-subtle border border-[#F8C8C8] rounded-md flex items-center gap-2 text-12 text-semantic-error">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Phone Number or Email"
              placeholder="+880 1712-345678"
              leftIcon={<Phone className="w-4 h-4" />}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              requiredIndicator
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-14 font-semibold text-ink-primary">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-12 font-semibold text-brand-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                requiredIndicator
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-14 text-ink-secondary">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded-sm text-brand-primary border-ui-border focus:ring-brand-primary"
                />
                <span>Keep me signed in</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>
        </Card>

        {/* Register Footer Link */}
        <p className="text-center text-14 text-ink-secondary">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-semibold text-brand-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

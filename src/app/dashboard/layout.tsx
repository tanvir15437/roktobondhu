'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePlatform } from '@/context/PlatformContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import {
  LayoutDashboard,
  Droplets,
  FileText,
  HeartHandshake,
  User,
  PlusCircle,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Globe,
  Bell,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, requests, updateUserAvailability, setCreateModalOpen, logout, loginAs } = usePlatform();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);

  // Active requests created by this user
  const userRequestsCount = requests.filter(
    (req) => (user && (req.requesterId === user.id || req.requesterName === user.name)) && req.status === 'Active'
  ).length;

  const sidebarLinks = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'My Requests',
      href: '/dashboard/my-requests',
      icon: FileText,
      badge: userRequestsCount > 0 ? userRequestsCount : undefined,
    },
    {
      label: 'My Donations',
      href: '/dashboard/donations',
      icon: HeartHandshake,
    },
    {
      label: 'Find Blood',
      href: '/requests',
      icon: Droplets,
    },
    {
      label: 'Profile & Settings',
      href: '/dashboard/profile',
      icon: User,
    },
  ];

  // If user is not logged in, present a clean dashboard sign-in gate
  if (!user) {
    return (
      <div className="min-h-screen bg-ui-bg flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-ui-surface p-6 sm:p-8 rounded-lg border border-ui-border shadow-card text-center space-y-6">
          <div className="w-12 h-12 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-22 font-bold text-ink-primary tracking-tight">
              Sign In to Your Dashboard
            </h1>
            <p className="text-14 text-ink-secondary">
              Access your personal blood donation records, track emergency blood requests, and manage your donor availability.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link href="/login" className="block">
              <Button variant="primary" size="lg" fullWidth>
                Sign In to Your Account
              </Button>
            </Link>
            <Link href="/register" className="block">
              <Button variant="outline" size="lg" fullWidth>
                Create an Account
              </Button>
            </Link>
          </div>

          {/* Quick Demo Switchers for Review */}
          <div className="pt-4 border-t border-ui-border space-y-2">
            <span className="text-12 font-medium text-ink-muted block">
              Or test immediately with demo credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await loginAs('donor');
                  router.push('/dashboard');
                }}
                className="text-12 bg-ui-bg hover:bg-brand-light/40 border border-ui-border text-ink-primary font-semibold"
              >
                Donor (Rahim)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await loginAs('requester');
                  router.push('/dashboard/my-requests');
                }}
                className="text-12 bg-ui-bg hover:bg-brand-light/40 border border-ui-border text-ink-primary font-semibold"
              >
                Requester (Tanjil)
              </Button>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-13 font-semibold text-brand-primary hover:underline"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>← Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const toggleAvailability = () => {
    const nextStatus = user.availabilityStatus === 'Available' ? 'Unavailable' : 'Available';
    updateUserAvailability(nextStatus);
  };

  return (
    <div className="min-h-screen bg-ui-bg flex">
      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR                                           */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-ui-surface border-r border-ui-border sticky top-0 h-screen select-none">
        {/* Brand Area */}
        <div className="p-5 border-b border-ui-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-md bg-brand-primary text-white flex items-center justify-center shadow-subtle group-hover:bg-brand-dark transition-colors">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-17 font-bold text-ink-primary tracking-tight leading-none group-hover:text-brand-primary transition-colors">
                  Rokto<span className="text-brand-primary">Bondhu</span>
                </span>
              </div>
              <span className="text-11 font-bold uppercase tracking-wider text-brand-primary mt-0.5">
                Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Link back to Website */}
        <div className="px-4 pt-3 pb-1">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-md bg-ui-bg hover:bg-brand-light/40 text-12 font-semibold text-ink-secondary hover:text-brand-primary border border-ui-border transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-brand-primary" />
              <span>Public Website</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-ink-muted group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-14 font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-light text-brand-primary shadow-subtle'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-ui-bg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-brand-primary' : 'text-ink-muted'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-11 font-bold bg-brand-primary text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Urgent Action in Sidebar */}
        <div className="p-4 border-t border-ui-border">
          <Button
            variant="primary"
            size="md"
            fullWidth
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setCreateModalOpen(true)}
          >
            I Need Blood
          </Button>
        </div>

        {/* User Card in Sidebar Bottom */}
        <div className="p-3.5 bg-ui-bg border-t border-ui-border flex items-center justify-between gap-3">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
          >
            <Avatar
              initials={user.avatarInitials}
              size="md"
              availabilityStatus={user.availabilityStatus}
            />
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-13 font-bold text-ink-primary truncate leading-tight">
                {user.name}
              </span>
              <span className="text-11 font-medium text-brand-primary leading-tight">
                Group {user.bloodGroup} · {user.availabilityStatus}
              </span>
            </div>
          </Link>
          <button
            onClick={() => logout()}
            title="Sign Out"
            className="p-1.5 text-ink-muted hover:text-semantic-error hover:bg-ui-surface rounded-md border border-ui-border transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN DASHBOARD SHELL                                      */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-ui-surface/95 backdrop-blur-md border-b border-ui-border h-16 flex items-center justify-between px-4 sm:px-6">
          {/* Left: Mobile Toggle & Page Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-ink-secondary hover:text-ink-primary hover:bg-ui-bg rounded-md"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-15 sm:text-17 font-bold text-ink-primary">
                {pathname === '/dashboard' && 'Donor Overview'}
                {pathname === '/dashboard/my-requests' && 'My Emergency Requests'}
                {pathname === '/dashboard/donations' && 'My Donation History'}
                {pathname === '/dashboard/profile' && 'Profile & Settings'}
                {pathname === '/requests' && 'Find Blood Requests'}
              </span>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {/* Quick Availability Switch Pill */}
            <button
              onClick={toggleAvailability}
              className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-12 font-semibold transition-all ${
                user.availabilityStatus === 'Available'
                  ? 'border-semantic-success/40 bg-[#E8F8F0] text-semantic-success hover:bg-[#D4F3E4]'
                  : 'border-semantic-warning/40 bg-semantic-warning-subtle text-semantic-warning hover:bg-[#FBE8D0]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  user.availabilityStatus === 'Available'
                    ? 'bg-semantic-success animate-pulse'
                    : 'bg-semantic-warning'
                }`}
              />
              <span>{user.availabilityStatus === 'Available' ? 'Available to Donate' : 'Unavailable'}</span>
            </button>

            {/* Quick Post Request */}
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => setCreateModalOpen(true)}
              className="hidden md:inline-flex"
            >
              I Need Blood
            </Button>

            {/* User Profile Header Dropdown */}
            <div className="relative">
              <button
                onClick={() => setHeaderDropdownOpen(!headerDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-ui-bg border border-ui-border transition-colors"
                aria-expanded={headerDropdownOpen}
              >
                <Avatar
                  initials={user.avatarInitials}
                  size="sm"
                  availabilityStatus={user.availabilityStatus}
                />
                <ChevronDown className="w-3.5 h-3.5 text-ink-muted mr-1 hidden sm:inline" />
              </button>

              {headerDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setHeaderDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-ui-surface rounded-lg border border-ui-border shadow-dropdown p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-ui-border mb-1">
                      <p className="text-13 font-bold text-ink-primary">{user.name}</p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-brand-light text-brand-primary text-11 font-bold rounded-sm">
                        Group {user.bloodGroup}
                      </span>
                    </div>

                    <Link
                      href="/"
                      onClick={() => setHeaderDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-13 text-ink-secondary hover:text-ink-primary hover:bg-ui-bg rounded-md"
                    >
                      <Globe className="w-4 h-4 text-brand-primary" />
                      <span>Public Website</span>
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setHeaderDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-13 text-ink-secondary hover:text-ink-primary hover:bg-ui-bg rounded-md"
                    >
                      <User className="w-4 h-4 text-brand-primary" />
                      <span>Profile Settings</span>
                    </Link>

                    <div className="border-t border-ui-border my-1" />

                    <button
                      onClick={() => {
                        setHeaderDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-13 text-semantic-error hover:bg-semantic-error-subtle rounded-md text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Dynamic View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MOBILE DRAWER SIDEBAR                                     */}
      {/* ========================================================= */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink-primary/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer Box */}
          <div className="relative w-72 max-w-[85vw] h-full bg-ui-surface flex flex-col z-10 shadow-dropdown animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-ui-border flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-md bg-brand-primary text-white flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                <span className="text-16 font-bold text-ink-primary">
                  Rokto<span className="text-brand-primary">Bondhu</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-ink-secondary hover:text-ink-primary rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Public Site Link */}
            <div className="px-4 pt-3 pb-1">
              <Link
                href="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-md bg-ui-bg text-12 font-semibold text-brand-primary border border-ui-border"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Go to Public Website</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
              {sidebarLinks.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-md text-14 font-semibold ${
                      isActive
                        ? 'bg-brand-light text-brand-primary'
                        : 'text-ink-secondary hover:bg-ui-bg'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full text-11 font-bold bg-brand-primary text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Bottom Actions */}
            <div className="p-4 border-t border-ui-border space-y-3">
              <Button
                variant="primary"
                size="md"
                fullWidth
                leftIcon={<PlusCircle className="w-4 h-4" />}
                onClick={() => {
                  setMobileSidebarOpen(false);
                  setCreateModalOpen(true);
                }}
              >
                I Need Blood
              </Button>
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-13 font-semibold text-semantic-error hover:bg-semantic-error-subtle rounded-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { usePlatform } from '@/context/PlatformContext';
import {
  PlusCircle,
  Menu,
  X,
  Droplets,
  ChevronDown,
  User,
  HeartHandshake,
  Clock,
  LogOut,
  FileText,
  UserCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, setCreateModalOpen, loginAs, logout } = usePlatform();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Find Blood', href: '/requests' },
    { label: 'Donor Dashboard', href: '/dashboard' },
    { label: 'My Donations', href: '/dashboard/donations' },
    { label: 'How It Works', href: '/#how-it-works' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ui-surface/95 backdrop-blur-sm border-b border-ui-border">
      {/* Demo Persona Switcher Banner (Subtle Top Bar for testing Phase 1 effortlessly) */}
      <div className="bg-brand-subtle border-b border-brand-light/70 py-1 px-4 text-12 text-ink-secondary">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-brand-primary">Phase 1 Prototype Demo:</span>
            <span className="hidden sm:inline">Active Mode:</span>
            <span className="font-bold text-ink-primary">
              {user ? `${user.name} (${user.rolePreference === 'both' ? 'Donor & Requester' : user.rolePreference})` : 'Guest Visitor'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-12 text-ink-muted hidden md:inline">Quick Switch:</span>
            <button
              onClick={() => loginAs('donor')}
              className={`px-2 py-0.5 rounded-sm text-12 font-medium transition-colors ${
                user?.id === 'usr-101'
                  ? 'bg-brand-primary text-white font-semibold'
                  : 'bg-ui-surface text-ink-secondary hover:text-ink-primary border border-ui-border'
              }`}
            >
              Donor (Rahim)
            </button>
            <button
              onClick={() => loginAs('requester')}
              className={`px-2 py-0.5 rounded-sm text-12 font-medium transition-colors ${
                user?.id === 'usr-202'
                  ? 'bg-brand-primary text-white font-semibold'
                  : 'bg-ui-surface text-ink-secondary hover:text-ink-primary border border-ui-border'
              }`}
            >
              Requester (Tanjil)
            </button>
            <button
              onClick={() => loginAs('guest')}
              className={`px-2 py-0.5 rounded-sm text-12 font-medium transition-colors ${
                !user
                  ? 'bg-brand-primary text-white font-semibold'
                  : 'bg-ui-surface text-ink-secondary hover:text-ink-primary border border-ui-border'
              }`}
            >
              Guest (Logged Out)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-9 h-9 rounded-md bg-brand-primary text-white flex items-center justify-center shadow-subtle group-hover:bg-brand-dark transition-colors">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-18 font-bold text-ink-primary tracking-tight leading-none group-hover:text-brand-primary transition-colors">
              Rokto<span className="text-brand-primary">Bondhu</span>
            </span>
            <span className="text-12 font-medium text-ink-muted leading-tight mt-0.5">
              Bangladesh Blood Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-14 font-medium transition-colors ${
                  isActive
                    ? 'text-brand-primary bg-brand-light/60 font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-ui-bg'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setCreateModalOpen(true)}
          >
            I Need Blood
          </Button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-md hover:bg-ui-bg border border-ui-border transition-colors"
                aria-expanded={userDropdownOpen}
              >
                <Avatar
                  initials={user.avatarInitials}
                  size="sm"
                  availabilityStatus={user.availabilityStatus}
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-14 font-semibold text-ink-primary leading-tight">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-12 text-ink-secondary leading-tight">
                    {user.bloodGroup} · {user.availabilityStatus}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-ink-muted" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-ui-surface rounded-lg border border-ui-border shadow-dropdown p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-ui-border mb-1">
                      <p className="text-14 font-bold text-ink-primary">{user.name}</p>
                      <p className="text-12 text-ink-secondary">{user.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-brand-light text-brand-primary text-12 font-semibold rounded-sm">
                        Group: {user.bloodGroup}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-14 text-ink-primary hover:bg-ui-bg rounded-md"
                    >
                      <HeartHandshake className="w-4 h-4 text-brand-primary" />
                      Donor Dashboard
                    </Link>

                    <Link
                      href="/dashboard/donations"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-14 text-ink-primary hover:bg-ui-bg rounded-md"
                    >
                      <Clock className="w-4 h-4 text-brand-primary" />
                      Donation History
                    </Link>

                    <Link
                      href="/dashboard/my-requests"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-14 text-ink-primary hover:bg-ui-bg rounded-md"
                    >
                      <FileText className="w-4 h-4 text-brand-primary" />
                      My Requests
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-14 text-ink-primary hover:bg-ui-bg rounded-md"
                    >
                      <User className="w-4 h-4 text-brand-primary" />
                      Profile & Settings
                    </Link>

                    <div className="border-t border-ui-border my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-14 text-semantic-error hover:bg-semantic-error-subtle rounded-md text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="md">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="md">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
          >
            Need Blood
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink-secondary hover:text-ink-primary hover:bg-ui-bg rounded-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-ui-border bg-ui-surface p-4 space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-14 font-medium ${
                  pathname === link.href
                    ? 'text-brand-primary bg-brand-light/60 font-semibold'
                    : 'text-ink-secondary hover:bg-ui-bg'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  href="/dashboard/my-requests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-14 font-medium text-ink-secondary hover:bg-ui-bg"
                >
                  My Requests
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-14 font-medium text-ink-secondary hover:bg-ui-bg"
                >
                  Profile & Settings
                </Link>
              </>
            )}
          </nav>

          <div className="pt-3 border-t border-ui-border flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar initials={user.avatarInitials} size="sm" />
                  <span className="text-14 font-semibold text-ink-primary">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" fullWidth>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


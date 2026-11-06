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
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, setCreateModalOpen, logout } = usePlatform();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Clean consumer navigation links for the public website
  const navLinks = [
    { label: 'Find Blood', href: '/requests' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Why Donate', href: '/#why-donate' },
    { label: 'Impact', href: '/#impact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ui-surface/95 backdrop-blur-md border-b border-ui-border">
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

        {/* Desktop Actions */}
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
            /* Logged-In User Profile Dropdown */
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full hover:bg-ui-bg border border-ui-border transition-all shadow-subtle"
                aria-expanded={userDropdownOpen}
              >
                <Avatar
                  initials={user.avatarInitials}
                  size="sm"
                  availabilityStatus={user.availabilityStatus}
                />
                <div className="flex flex-col text-left">
                  <span className="text-13 font-semibold text-ink-primary leading-tight">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-11 font-medium text-brand-primary leading-tight">
                    Group {user.bloodGroup}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-ink-muted ml-0.5" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-ui-surface rounded-lg border border-ui-border shadow-dropdown p-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                    {/* User Mini Profile Header */}
                    <div className="p-3 bg-ui-bg rounded-md mb-2">
                      <div className="flex items-center justify-between">
                        <p className="text-14 font-bold text-ink-primary truncate max-w-[150px]">
                          {user.name}
                        </p>
                        <span className="px-2 py-0.5 bg-brand-light text-brand-primary text-12 font-bold rounded-sm">
                          {user.bloodGroup}
                        </span>
                      </div>
                      <p className="text-12 text-ink-secondary truncate mt-0.5">
                        {user.phone || user.email}
                      </p>
                    </div>

                    {/* Prominent Go to Dashboard CTA */}
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 mb-1.5 rounded-md bg-brand-primary text-white text-13 font-semibold shadow-subtle hover:bg-brand-dark transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-white" />
                        <span>Go to Dashboard</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/80" />
                    </Link>

                    {/* Secondary Portal Links */}
                    <Link
                      href="/dashboard/my-requests"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-13 font-medium text-ink-secondary hover:text-ink-primary hover:bg-ui-bg rounded-md transition-colors"
                    >
                      <FileText className="w-4 h-4 text-brand-primary" />
                      <span>My Requests</span>
                    </Link>

                    <Link
                      href="/dashboard/donations"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-13 font-medium text-ink-secondary hover:text-ink-primary hover:bg-ui-bg rounded-md transition-colors"
                    >
                      <HeartHandshake className="w-4 h-4 text-brand-primary" />
                      <span>Donation History</span>
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-13 font-medium text-ink-secondary hover:text-ink-primary hover:bg-ui-bg rounded-md transition-colors"
                    >
                      <User className="w-4 h-4 text-brand-primary" />
                      <span>Profile & Settings</span>
                    </Link>

                    <div className="border-t border-ui-border my-1.5" />

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-13 font-medium text-semantic-error hover:bg-semantic-error-subtle rounded-md transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Logged-Out Public Visitors */
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
        <div className="sm:hidden border-t border-ui-border bg-ui-surface p-4 space-y-4 animate-in slide-in-from-top-2">
          {/* If Logged In, show top profile card with Go to Dashboard button */}
          {user && (
            <div className="p-3 bg-brand-subtle rounded-lg border border-brand-light flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar initials={user.avatarInitials} size="md" />
                <div>
                  <p className="text-14 font-bold text-ink-primary">{user.name}</p>
                  <p className="text-12 text-ink-secondary font-medium">Group {user.bloodGroup}</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 bg-brand-primary text-white text-12 font-semibold rounded-md shadow-subtle"
              >
                Dashboard
              </Link>
            </div>
          )}

          {/* Navigation Links */}
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
          </nav>

          {/* Actions */}
          <div className="pt-3 border-t border-ui-border">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-primary text-white font-semibold rounded-md text-14"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-center text-13 font-medium text-semantic-error hover:bg-semantic-error-subtle rounded-md"
                >
                  Sign Out
                </button>
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

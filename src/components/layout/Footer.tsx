import React from 'react';
import Link from 'next/link';
import { Droplets, Heart, Shield, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ui-surface border-t border-ui-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-brand-primary text-white flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <span className="text-18 font-bold text-ink-primary">
                Rokto<span className="text-brand-primary">Bondhu</span>
              </span>
            </Link>
            <p className="text-14 text-ink-secondary max-w-sm leading-relaxed">
              A community-driven blood donation and emergency blood request platform for Bangladesh. Connecting patients in immediate need with voluntary, eligible donors across all 8 divisions.
            </p>
            <div className="pt-2 flex items-center gap-2 text-12 text-ink-muted">
              <Shield className="w-4 h-4 text-brand-primary" />
              <span>100% Non-profit community initiative</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-14 font-bold text-ink-primary mb-3">Platform</h4>
            <ul className="space-y-2 text-14 text-ink-secondary">
              <li>
                <Link href="/requests" className="hover:text-brand-primary transition-colors">
                  Find Blood Requests
                </Link>
              </li>
              <li>
                <Link href="/requests" className="hover:text-brand-primary transition-colors">
                  Urgent Cases
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-primary transition-colors">
                  Donor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/donations" className="hover:text-brand-primary transition-colors">
                  Donation Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Safety */}
          <div>
            <h4 className="text-14 font-bold text-ink-primary mb-3">Community & Safety</h4>
            <ul className="space-y-2 text-14 text-ink-secondary">
              <li>
                <Link href="/#how-it-works" className="hover:text-brand-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#why-donate" className="hover:text-brand-primary transition-colors">
                  Donor Eligibility
                </Link>
              </li>
              <li>
                <span className="text-ink-secondary">Safety Protocols</span>
              </li>
              <li>
                <span className="text-ink-secondary">Hospital Directory</span>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-14 font-bold text-ink-primary mb-3">Support & Legal</h4>
            <ul className="space-y-2 text-14 text-ink-secondary">
              <li>
                <span className="text-ink-secondary">Emergency Hotline: 999</span>
              </li>
              <li>
                <span className="text-ink-secondary">support@roktobondhu.org</span>
              </li>
              <li>
                <span className="text-ink-secondary">Privacy Policy</span>
              </li>
              <li>
                <span className="text-ink-secondary">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-ui-border flex flex-col sm:flex-row items-center justify-between gap-4 text-12 text-ink-muted">
          <p>© {new Date().getFullYear()} RoktoBondhu. Built with compassion for Bangladesh.</p>
          <div className="flex items-center gap-1">
            <span>Every drop counts. Donate voluntary, save lives.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { PlatformProvider } from '@/context/PlatformContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CreateRequestModal } from '@/components/modals/CreateRequestModal';
import { RequestDetailModal } from '@/components/modals/RequestDetailModal';
import { ContactRequesterModal } from '@/components/modals/ContactRequesterModal';

export const metadata: Metadata = {
  title: 'RoktoBondhu | Emergency Blood Donation Platform Bangladesh',
  description:
    'A modern Bangladesh-focused blood donation and emergency blood request platform connecting patients in urgent need with eligible voluntary donors.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-ui-bg text-ink-primary antialiased font-sans">
        <ToastProvider>
          <PlatformProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* Global interactive modals */}
            <CreateRequestModal />
            <RequestDetailModal />
            <ContactRequesterModal />
          </PlatformProvider>
        </ToastProvider>
      </body>
    </html>
  );
}


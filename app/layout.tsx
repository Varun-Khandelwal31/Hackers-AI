import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';
import { AppProvider } from '@/lib/AppContext';

export const metadata: Metadata = {
  title: 'HackOps AI — AI Operations Layer for Hackathons',
  description: 'Devfolio tells you who registered. HackOps AI tells you who should team up, who needs help right now, and who is actually worth hiring.',
  openGraph: {
    title: 'HackOps AI — Next-Gen Hackathon AI Operations',
    description: 'Automating project evaluations with radar charts, instant mentor triage, and AI team complementarity matching.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        <AppProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}

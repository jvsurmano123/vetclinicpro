'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Loader2 } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
} 
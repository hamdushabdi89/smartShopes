'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import CustomerSidebar from '@/components/CustomerSidebar';
import CustomerNavbar from '@/components/CustomerNavbar';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <CustomerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CustomerNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

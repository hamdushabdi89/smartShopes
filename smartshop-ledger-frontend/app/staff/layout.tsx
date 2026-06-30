'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import StaffSidebar from '@/components/StaffSidebar';
import StaffNavbar from '@/components/StaffNavbar';

export default function StaffLayout({
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
      <StaffSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StaffNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

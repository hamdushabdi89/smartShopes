'use client';

import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-700">{user?.username || 'User'}</p>
            <p className="text-gray-400 text-xs">{user?.role || 'Role'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

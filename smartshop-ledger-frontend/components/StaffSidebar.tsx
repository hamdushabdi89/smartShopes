'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/staff/inventory', label: 'Inventory', icon: Package },
  { href: '/staff/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/staff/customers', label: 'Customers', icon: Users },
  { href: '/staff/reports', label: 'Reports', icon: FileText },
  { href: '/staff/settings', label: 'Settings', icon: Settings },
];

export default function StaffSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl glass-strong text-[#d4af37]"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 glass-strong transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="flex items-center gap-3 px-6 py-7 border-b border-[rgba(212,175,55,0.1)]">
          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
            <Store size={22} className="text-black" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              <span className="gold-gradient">SmartShop</span>
            </h1>
            <p className="text-[11px] text-[#a0a0a0] tracking-widest uppercase">Staff Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'glass text-[#d4af37] font-medium gold-border'
                    : 'text-[#a0a0a0] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f5f5f5]'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-[#d4af37]' : ''} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[rgba(212,175,55,0.1)]">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#a0a0a0] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f5f5f5] w-full transition-all duration-200">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

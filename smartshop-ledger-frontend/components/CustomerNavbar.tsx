'use client';

import { Search, Bell, ShoppingCart, ChevronDown } from 'lucide-react';

export default function CustomerNavbar() {
  return (
    <header className="glass-strong px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search size={16} className="text-[#a0a0a0]" />
        <input
          type="text"
          placeholder="Search products..."
          className="bg-transparent text-sm text-[#f5f5f5] placeholder-[#a0a0a0] outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative p-2 rounded-xl hover:bg-[rgba(255,255,255,0.04)] transition-colors">
          <Bell size={18} className="text-[#a0a0a0]" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#d4af37] text-[10px] font-bold text-black flex items-center justify-center">2</span>
        </button>

        <button className="relative p-2 rounded-xl hover:bg-[rgba(255,255,255,0.04)] transition-colors">
          <ShoppingCart size={18} className="text-[#a0a0a0]" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#d4af37] text-[10px] font-bold text-black flex items-center justify-center">1</span>
        </button>

        <div className="flex items-center gap-3 pl-5 border-l border-[rgba(212,175,55,0.1)]">
          <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-[11px] font-bold text-black">
            SJ
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[#f5f5f5]">Sarah J.</p>
            <p className="text-[11px] text-[#a0a0a0]">Gold Member</p>
          </div>
          <ChevronDown size={14} className="text-[#a0a0a0]" />
        </div>
      </div>
    </header>
  );
}

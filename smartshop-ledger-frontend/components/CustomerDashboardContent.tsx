'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  DollarSign,
  MapPin,
  Camera,
  Star,
  Heart,
  ChevronRight,
} from 'lucide-react';
import GlassCard from './GlassCard';

const orderHistory = [
  { id: '#ORD-7842', date: '2026-06-28', items: 3, total: 245.00, status: 'Delivered', eta: null },
  { id: '#ORD-7835', date: '2026-06-25', items: 1, total: 89.99, status: 'Shipped', eta: 'Jul 2' },
  { id: '#ORD-7829', date: '2026-06-20', items: 5, total: 520.00, status: 'Delivered', eta: null },
  { id: '#ORD-7818', date: '2026-06-15', items: 2, total: 175.50, status: 'Processing', eta: 'Jul 5' },
  { id: '#ORD-7802', date: '2026-06-10', items: 4, total: 310.00, status: 'Delivered', eta: null },
  { id: '#ORD-7795', date: '2026-06-05', items: 1, total: 45.00, status: 'Cancelled', eta: null },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-500/20 text-green-400',
  Shipped: 'bg-[#d4af37]/20 text-[#d4af37]',
  Processing: 'bg-blue-500/20 text-blue-400',
  Cancelled: 'bg-red-500/20 text-red-400',
};
const statusDotColors: Record<string, string> = {
  Delivered: 'bg-green-400',
  Shipped: 'bg-[#d4af37]',
  Processing: 'bg-blue-400',
  Cancelled: 'bg-red-400',
};

const featuredProducts = [
  { name: 'Premium Wireless Headphones', price: 149.99, rating: 4.8, category: 'Electronics', color: 'from-purple-600 to-pink-500' },
  { name: 'Artisan Coffee Maker', price: 89.99, rating: 4.6, category: 'Home & Kitchen', color: 'from-amber-600 to-orange-500' },
  { name: 'Minimalist Leather Watch', price: 199.99, rating: 4.9, category: 'Accessories', color: 'from-emerald-600 to-teal-500' },
  { name: 'Smart Fitness Tracker', price: 79.99, rating: 4.7, category: 'Electronics', color: 'from-blue-600 to-cyan-500' },
  { name: 'Japanese Chef Knife Set', price: 129.99, rating: 4.5, category: 'Kitchen', color: 'from-slate-600 to-gray-500' },
  { name: 'Luxury Scented Candle', price: 34.99, rating: 4.4, category: 'Home', color: 'from-rose-600 to-red-500' },
  { name: 'Ergonomic Office Chair', price: 349.99, rating: 4.8, category: 'Furniture', color: 'from-indigo-600 to-violet-500' },
  { name: 'Portable Bluetooth Speaker', price: 59.99, rating: 4.3, category: 'Electronics', color: 'from-cyan-600 to-blue-500' },
];

const statsCards = [
  { label: 'Total Orders', value: '24', icon: Package, subtitle: 'All time' },
  { label: 'Active Orders', value: '2', icon: Clock, subtitle: 'In progress' },
  { label: 'Total Spent', value: '$3,845', icon: DollarSign, subtitle: 'Lifetime' },
  { label: 'Member Since', value: '2024', icon: Star, subtitle: 'Gold tier' },
];

const recentSearches = ['Wireless earbuds', 'Leather bag', 'Coffee grinder', 'Desk lamp', 'Yoga mat'];

export default function CustomerDashboardContent() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'gallery' | 'profile'>('orders');
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight gold-gradient">Welcome back, Sarah</h1>
          <p className="text-sm text-[#a0a0a0] mt-1">Here&apos;s what&apos;s happening with your account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <GlassCard key={card.label} hover>
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-[#a0a0a0] tracking-wide uppercase">{card.label}</p>
                <p className="text-2xl font-bold text-[#f5f5f5]">{card.value}</p>
                <p className="text-[11px] text-[#a0a0a0]">{card.subtitle}</p>
              </div>
              <div className="p-3 rounded-xl bg-[rgba(212,175,55,0.1)]">
                <card.icon size={20} className="text-[#d4af37]" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex gap-1 p-1 rounded-xl glass-strong w-fit">
        {(['orders', 'gallery', 'profile'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize ${
              activeTab === tab
                ? 'glass text-[#d4af37]'
                : 'text-[#a0a0a0] hover:text-[#f5f5f5]'
            }`}
          >
            {tab === 'orders' ? 'Order History' : tab === 'gallery' ? 'Product Gallery' : 'Profile Settings'}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-[#f5f5f5]">Your Orders</h3>
              <p className="text-xs text-[#a0a0a0] mt-0.5">Track and manage your purchases</p>
            </div>
          </div>
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.05)]">
                  <th className="text-left pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">Order</th>
                  <th className="text-left pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">Date</th>
                  <th className="text-left pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider hidden sm:table-cell">Items</th>
                  <th className="text-left pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">Total</th>
                  <th className="text-left pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">Status</th>
                  <th className="text-right pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">ETA</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((order) => (
                  <tr key={order.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-3.5 text-sm font-medium text-[#d4af37]">{order.id}</td>
                    <td className="py-3.5 text-sm text-[#f5f5f5]">{order.date}</td>
                    <td className="py-3.5 text-sm text-[#a0a0a0] hidden sm:table-cell">{order.items}</td>
                    <td className="py-3.5 text-sm text-[#f5f5f5]">${order.total.toFixed(2)}</td>
                    <td className="py-3.5">
                      <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${statusColors[order.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[order.status]}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-xs text-[#a0a0a0] text-right">{order.eta || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product, i) => (
            <GlassCard key={i} hover>
              <div className="space-y-3">
                <div className={`h-40 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <Package size={40} className="text-white/60" />
                  <button className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                    <Heart size={14} className="text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-[11px] text-[#a0a0a0] tracking-wider uppercase">{product.category}</p>
                  <p className="text-sm font-semibold text-[#f5f5f5] mt-0.5 leading-tight">{product.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-[#d4af37]">${product.price}</p>
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-[#d4af37] fill-[#d4af37]" />
                      <span className="text-[11px] text-[#a0a0a0]">{product.rating}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2 rounded-xl text-xs font-semibold glass-strong text-[#d4af37] hover:bg-[rgba(212,175,55,0.1)] transition-all duration-200">
                  Add to Cart
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-1">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center text-2xl font-bold text-black">
                SJ
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#f5f5f5]">Sarah Johnson</h3>
                <p className="text-sm text-[#a0a0a0]">sarah.j@email.com</p>
                <span className="inline-block mt-2 px-3 py-1 text-[10px] font-semibold rounded-full bg-[#d4af37]/20 text-[#d4af37] tracking-wider uppercase">
                  Gold Member
                </span>
              </div>
              <button className="flex items-center gap-2 text-xs text-[#d4af37] hover:underline">
                <Camera size={14} />
                Change Photo
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.05)] space-y-3">
              <h4 className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">Quick Links</h4>
              {['My Wishlist', 'Addresses', 'Payment Methods', 'Notifications'].map((link) => (
                <button
                  key={link}
                  className="flex items-center justify-between w-full py-2 text-sm text-[#f5f5f5] hover:text-[#d4af37] transition-colors"
                >
                  {link}
                  <ChevronRight size={14} className="text-[#a0a0a0]" />
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-[#f5f5f5] mb-6">Account Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-[#a0a0a0] font-medium block mb-1.5">Full Name</label>
                <div className="glass rounded-xl px-4 py-2.5">
                  <p className="text-sm text-[#f5f5f5]">Sarah Johnson</p>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#a0a0a0] font-medium block mb-1.5">Email</label>
                <div className="glass rounded-xl px-4 py-2.5">
                  <p className="text-sm text-[#f5f5f5]">sarah.j@email.com</p>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#a0a0a0] font-medium block mb-1.5">Phone</label>
                <div className="glass rounded-xl px-4 py-2.5">
                  <p className="text-sm text-[#f5f5f5]">+1 (555) 123-4567</p>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#a0a0a0] font-medium block mb-1.5">Member Tier</label>
                <div className="glass rounded-xl px-4 py-2.5">
                  <p className="text-sm text-[#d4af37] font-medium">Gold</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.05)]">
              <h4 className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wider mb-4">Shipping Address</h4>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.08)]">
                <MapPin size={16} className="text-[#d4af37] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#f5f5f5]">742 Maple Drive, Apt 4B</p>
                  <p className="text-sm text-[#a0a0a0]">Brooklyn, NY 11201</p>
                  <p className="text-xs text-[#a0a0a0]">United States</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold glass-strong text-[#d4af37] hover:bg-[rgba(212,175,55,0.1)] transition-all duration-200">
                Edit Profile
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold gold-gradient text-black hover:opacity-90 transition-all duration-200">
                Save Changes
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

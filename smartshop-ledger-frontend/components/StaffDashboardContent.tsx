'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Package,
  DollarSign,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import GlassCard from './GlassCard';

const weeklyRevenue = [
  { day: 'Mon', revenue: 4200, orders: 18 },
  { day: 'Tue', revenue: 3800, orders: 15 },
  { day: 'Wed', revenue: 5100, orders: 22 },
  { day: 'Thu', revenue: 4700, orders: 20 },
  { day: 'Fri', revenue: 6200, orders: 28 },
  { day: 'Sat', revenue: 5500, orders: 24 },
  { day: 'Sun', revenue: 3400, orders: 12 },
];

const lowStockItems = [
  { name: 'Premium Sneakers', sku: 'SNK-001', qty: 3, reorder: 10, status: 'Critical' },
  { name: 'Wireless Earbuds', sku: 'AUD-042', qty: 5, reorder: 15, status: 'Low' },
  { name: 'Organic Coffee Beans', sku: 'FOO-118', qty: 2, reorder: 20, status: 'Critical' },
  { name: 'Denim Jacket', sku: 'APR-209', qty: 8, reorder: 12, status: 'Low' },
  { name: 'Samsung 27" Monitor', sku: 'ELC-077', qty: 1, reorder: 5, status: 'Critical' },
];

const recentOrders = [
  { id: '#ORD-7842', customer: 'Sarah Johnson', items: 3, total: 245.00, status: 'Delivered', date: '2 min ago' },
  { id: '#ORD-7841', customer: 'Mike Chen', items: 1, total: 89.99, status: 'Processing', date: '15 min ago' },
  { id: '#ORD-7840', customer: 'Emma Williams', items: 5, total: 520.00, status: 'Shipped', date: '1 hr ago' },
  { id: '#ORD-7839', customer: 'James Rodriguez', items: 2, total: 175.50, status: 'Pending', date: '2 hrs ago' },
  { id: '#ORD-7838', customer: 'Lisa Kim', items: 4, total: 310.00, status: 'Delivered', date: '3 hrs ago' },
];

const statsCards = [
  { label: 'Total Revenue', value: '$24,560', change: '+12.5%', icon: DollarSign, up: true, subtitle: 'vs last month' },
  { label: 'Orders Today', value: '28', change: '+8.2%', icon: ShoppingCart, up: true, subtitle: 'vs yesterday' },
  { label: 'Active Customers', value: '1,423', change: '+3.1%', icon: Users, up: true, subtitle: 'vs last month' },
  { label: 'Low Stock Alerts', value: '12', change: '+2 items', icon: AlertTriangle, up: false, subtitle: 'needs attention' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-500/20 text-green-400',
  Processing: 'bg-blue-500/20 text-blue-400',
  Shipped: 'bg-[#d4af37]/20 text-[#d4af37]',
  Pending: 'bg-orange-500/20 text-orange-400',
};

const statusDotColors: Record<string, string> = {
  Delivered: 'bg-green-400',
  Processing: 'bg-blue-400',
  Shipped: 'bg-[#d4af37]',
  Pending: 'bg-orange-400',
};

export default function StaffDashboardContent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight gold-gradient">Staff Dashboard</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">Store analytics and management overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <GlassCard key={card.label} hover>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#a0a0a0] tracking-wide uppercase">{card.label}</p>
                <p className="text-2xl font-bold text-[#f5f5f5]">{card.value}</p>
                <div className="flex items-center gap-1.5">
                  {card.up ? (
                    <ArrowUp size={12} className="text-green-400" />
                  ) : (
                    <ArrowDown size={12} className="text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${card.up ? 'text-green-400' : 'text-red-400'}`}>
                    {card.change}
                  </span>
                  <span className="text-[11px] text-[#a0a0a0]">{card.subtitle}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[rgba(212,175,55,0.1)]">
                <card.icon size={20} className="text-[#d4af37]" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-[#f5f5f5]">Revenue Overview</h3>
              <p className="text-xs text-[#a0a0a0] mt-0.5">Weekly revenue & order trends</p>
            </div>
            <button className="text-xs text-[#d4af37] hover:underline">View Full Report</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#a0a0a0', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a0a0a0', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(18,18,18,0.95)',
                    border: '1px solid rgba(212,175,55,0.15)',
                    borderRadius: '12px',
                    color: '#f5f5f5',
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#d4af37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#f5f5f5]">Inventory Alerts</h3>
            <AlertTriangle size={16} className="text-orange-400" />
          </div>
          <div className="space-y-3">
            {lowStockItems.slice(0, 4).map((item) => (
              <div key={item.sku} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#f5f5f5] truncate">{item.name}</p>
                  <p className="text-[11px] text-[#a0a0a0]">{item.sku} &middot; {item.qty}/{item.reorder}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  item.status === 'Critical'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-xs text-[#d4af37] py-2 hover:underline text-center">
            View All Inventory
          </button>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-[#f5f5f5]">Recent Orders</h3>
            <p className="text-xs text-[#a0a0a0] mt-0.5">Latest transactions across the store</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline">
            <Eye size={14} />
            View All
          </button>
        </div>
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.05)]">
                <th className="text-left pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">Order</th>
                <th className="text-left pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">Customer</th>
                <th className="text-left pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider hidden sm:table-cell">Items</th>
                <th className="text-left pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">Total</th>
                <th className="text-left pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">Status</th>
                <th className="text-right pb-3 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider hidden md:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3.5 text-sm font-medium text-[#d4af37]">{order.id}</td>
                  <td className="py-3.5 text-sm text-[#f5f5f5]">{order.customer}</td>
                  <td className="py-3.5 text-sm text-[#a0a0a0] hidden sm:table-cell">{order.items}</td>
                  <td className="py-3.5 text-sm text-[#f5f5f5]">${order.total.toFixed(2)}</td>
                  <td className="py-3.5">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${statusColors[order.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[order.status]}`} />
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-xs text-[#a0a0a0] text-right hidden md:table-cell">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

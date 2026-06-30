'use client';

import { DollarSign, Package, Users, AlertTriangle } from 'lucide-react';
import type { DashboardSummary } from '@/types';

interface Props {
  data: DashboardSummary | null;
  loading: boolean;
}

export default function DashboardCards({ data, loading }: Props) {
  const cards = [
    {
      label: 'Total Sales Today',
      value: data?.totalSalesToday ?? 0,
      icon: DollarSign,
      color: 'bg-green-500',
      format: true,
    },
    {
      label: 'Total Stock Value',
      value: data?.totalStockValue ?? 0,
      icon: Package,
      color: 'bg-blue-500',
      format: true,
    },
    {
      label: 'Outstanding Debt',
      value: data?.outstandingCustomerDebt ?? 0,
      icon: Users,
      color: 'bg-red-500',
      format: true,
    },
    {
      label: 'Low Stock Items',
      value: data?.lowStockCount ?? 0,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      format: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {card.format
                    ? `$${Number(card.value).toLocaleString()}`
                    : card.value}
                </p>
              )}
            </div>
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon size={24} className="text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

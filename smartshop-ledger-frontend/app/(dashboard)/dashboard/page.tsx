'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardCards from '@/components/DashboardCards';
import SalesChart from '@/components/Charts';
import type { DashboardSummary } from '@/types';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardSummary>('/dashboard/summary')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <DashboardCards data={data} loading={loading} />
      <div className="mt-6">
        <SalesChart data={data?.salesChart || []} loading={loading} />
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { Sale } from '@/types';
import { Loader2 } from 'lucide-react';

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      params.append('pageSize', '100');
      const res = await api.get<Sale[]>(`/sales?${params}`);
      setSales(res.data);
    } catch {
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSales(); }, []);

  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalProfit = sales.reduce((sum, s) => {
    const cost = s.items.reduce((c, i) => c + (i.subtotal / i.unitPrice) * (i.subtotal / i.quantity > 0 ? 0 : 0), 0);
    return sum;
  }, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Report</h3>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="flex items-end">
              <button onClick={fetchSales}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Filter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">Total Sales</p>
              <p className="text-2xl font-bold text-green-800">${totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">Transactions</p>
              <p className="text-2xl font-bold text-blue-800">{sales.length}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">#</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Total</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-8"><Loader2 size={24} className="animate-spin mx-auto text-indigo-600" /></td></tr>
                ) : sales.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">No sales found</td></tr>
                ) : (
                  sales.map((s) => (
                    <tr key={s.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium">{s.id}</td>
                      <td className="px-4 py-3">{s.customerName}</td>
                      <td className="px-4 py-3 text-right">${s.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          s.status === 'Paid' ? 'bg-green-100 text-green-700' :
                          s.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>{s.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(s.saleDate).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Inventory Valuation</h3>
            <InventoryValuation />
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryValuation() {
  const [data, setData] = useState<{ totalStockValue: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/inventory/stock-value').then((res) => setData(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-20 bg-gray-100 animate-pulse rounded-lg" />;

  return (
    <div>
      <p className="text-3xl font-bold text-gray-800">${(data?.totalStockValue || 0).toLocaleString()}</p>
      <p className="text-sm text-gray-500 mt-1">Total inventory value at cost</p>
    </div>
  );
}

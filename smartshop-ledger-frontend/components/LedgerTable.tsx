'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { LedgerEntry, Customer, Supplier } from '@/types';
import { Search, Loader2 } from 'lucide-react';

export default function LedgerTable() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerFilter, setCustomerFilter] = useState<number | ''>('');
  const [supplierFilter, setSupplierFilter] = useState<number | ''>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (customerFilter !== '') params.append('customerId', String(customerFilter));
      if (supplierFilter !== '') params.append('supplierId', String(supplierFilter));
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);
      const res = await api.get<LedgerEntry[]>(`/ledger?${params}`);
      setEntries(res.data);
    } catch {
      toast.error('Failed to load ledger entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get<Customer[]>('/customers').then((r) => setCustomers(r.data)).catch(() => {});
    api.get<Supplier[]>('/suppliers').then((r) => setSuppliers(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [customerFilter, supplierFilter, fromDate, toDate]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select
            value={customerFilter}
            onChange={(e) => {
              setCustomerFilter(e.target.value ? Number(e.target.value) : '');
              setSupplierFilter('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">All Customers</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
          <select
            value={supplierFilter}
            onChange={(e) => {
              setSupplierFilter(e.target.value ? Number(e.target.value) : '');
              setCustomerFilter('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">All Suppliers</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Description</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Customer/Supplier</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Balance</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <Loader2 size={24} className="animate-spin mx-auto text-indigo-600" />
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No ledger entries found
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(e.entryDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        e.type === 'Debit'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {e.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${e.type === 'Debit' ? 'text-red-600' : 'text-green-600'}`}>
                    ${e.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.description || '-'}</td>
                  <td className="px-4 py-3">{e.customerName || e.supplierName || '-'}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    ${e.runningBalance.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

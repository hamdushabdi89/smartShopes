'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import ProductTable from './ProductTable';
import type { Product, Customer, Sale } from '@/types';
import { Trash2, Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';

export default function SalesForm() {
  const { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCartStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [showProducts, setShowProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<Customer[]>('/customers').then((res) => setCustomers(res.data)).catch(() => {});
  }, []);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post<Sale>('/sales', {
        customerId: customerId || null,
        paidAmount,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      });
      toast.success(`Sale #${res.data.id} completed!`);
      clearCart();
      setPaidAmount(0);
      setCustomerId('');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: string } })?.response?.data || 'Sale failed';
      toast.error(typeof message === 'string' ? message : 'Sale failed');
    } finally {
      setSubmitting(false);
    }
  };

  const cartTotal = total();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <button
              onClick={() => setShowProducts(!showProducts)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showProducts ? 'Hide' : 'Browse Products'}
            </button>
          </div>
          {showProducts && (
            <ProductTable
              selectMode
              onAddToCart={(product: Product) => {
                addItem(product);
                toast.success(`${product.name} added to cart`);
              }}
            />
          )}
        </div>
      </div>

      <div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart size={20} /> Cart ({itemCount()})
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Walk-in Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
            {items.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Cart is empty</p>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-gray-500">
                      ${item.product.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
              <input
                type="number"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {paidAmount < cartTotal && paidAmount > 0 && (
              <p className="text-sm text-yellow-600">
                Remaining: ${(cartTotal - paidAmount).toFixed(2)} (debt recorded)
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={submitting || items.length === 0}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader2 size={18} className="animate-spin" /> Processing...</>
              ) : (
                'Complete Sale'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

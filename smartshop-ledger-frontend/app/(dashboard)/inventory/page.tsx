'use client';

import ProductTable from '@/components/ProductTable';

export default function InventoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Management</h1>
      <ProductTable />
    </div>
  );
}

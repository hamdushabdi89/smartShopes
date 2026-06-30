'use client';

import LedgerTable from '@/components/LedgerTable';

export default function LedgerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ledger / Account Book</h1>
      <LedgerTable />
    </div>
  );
}

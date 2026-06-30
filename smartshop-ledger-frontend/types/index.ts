export interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  price: number;
  costPrice: number;
  stockQty: number;
  reorderLevel: number;
  createdAt: string;
}

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  balance: number;
}

export interface Supplier {
  id: number;
  name: string;
  phone?: string;
  balance: number;
}

export interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  customerId?: number;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  saleDate: string;
  userName: string;
  items: SaleItem[];
}

export interface CreateSaleItem {
  productId: number;
  quantity: number;
}

export interface CreateSale {
  customerId?: number;
  paidAmount: number;
  items: CreateSaleItem[];
}

export interface LedgerEntry {
  id: number;
  type: string;
  amount: number;
  referenceType?: string;
  referenceId?: number;
  description?: string;
  entryDate: string;
  customerName?: string;
  supplierName?: string;
  runningBalance: number;
}

export interface DashboardSummary {
  totalSalesToday: number;
  totalStockValue: number;
  outstandingCustomerDebt: number;
  lowStockCount: number;
  salesChart: SalesChartData[];
}

export interface SalesChartData {
  date: string;
  amount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

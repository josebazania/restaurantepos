
export type Role = 'Administrador' | 'Cocinero' | 'Mozo' | 'Cajero';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: Role;
  avatar: string;
}

export type TableStatus = 'Libre' | 'Ocupada' | 'Cuenta' | 'Limpieza';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: CartItem[];
  status: 'Pendiente' | 'En Cocina' | 'Listo' | 'Pagado';
  subtotal: number;
  tax: number;
  total: number;
  timestamp: number;
}

export interface CashSession {
  id: string;
  status: 'Abierta' | 'Cerrada';
  openedAt: number;
  closedAt?: number;
  openingBalance: number;
  totalSales: number;
  expectedBalance: number;
  userId: string;
  userName: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  icon: string;
  stock: number;
}

export type Category = 'Comida' | 'Bebidas' | 'Snacks' | 'Postres' | 'Electrónica';

export interface CartItem extends Product {
  quantity: number;
  notes?: string;
}

// Added tableId to Sale interface to support table lookup by ID in App.tsx
export interface Sale {
  id: string;
  timestamp: number;
  items: CartItem[];
  total: number;
  paymentMethod: 'Efectivo' | 'Tarjeta';
  sessionId: string;
  orderId: string;
  tableId: string;
  tableNumber: number;
}

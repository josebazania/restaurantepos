
import React from 'react';
import { 
  Utensils, 
  Coffee, 
  Cookie, 
  IceCream, 
  Smartphone, 
  Pizza, 
  Wine, 
  Sandwich,
  Laptop,
  Tv
} from 'lucide-react';
import { Product, User, Table } from './types';

export const CATEGORIES = ['Comida', 'Bebidas', 'Snacks', 'Postres', 'Electrónica'] as const;

export const AVAILABLE_ICONS = [
  'Pizza', 'Utensils', 'Sandwich', 'Coffee', 'Wine', 'Cookie', 'IceCream', 'Smartphone', 'Laptop', 'Tv'
] as const;

export const INITIAL_TABLES: Table[] = [
  { id: 't1', number: 1, capacity: 2, status: 'Libre' },
  { id: 't2', number: 2, capacity: 2, status: 'Libre' },
  { id: 't3', number: 3, capacity: 4, status: 'Libre' },
  { id: 't4', number: 4, capacity: 4, status: 'Libre' },
  { id: 't5', number: 5, capacity: 6, status: 'Libre' },
  { id: 't6', number: 6, capacity: 6, status: 'Libre' },
  { id: 't7', number: 7, capacity: 8, status: 'Libre' },
  { id: 't8', number: 8, capacity: 4, status: 'Libre' },
];

export const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', password: '123', name: 'Super Admin', role: 'Administrador', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: '2', username: 'cajero', password: '123', name: 'Juan Cobros', role: 'Cajero', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { id: '3', username: 'mozo', password: '123', name: 'Luis Pedidos', role: 'Mozo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max' },
  { id: '4', username: 'chef', password: '123', name: 'Chef Gordon', role: 'Cocinero', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Pizza Pepperoni', price: 12.99, category: 'Comida', icon: 'Pizza', stock: 50 },
  { id: '2', name: 'Hamburguesa Pro', price: 8.50, category: 'Comida', icon: 'Utensils', stock: 30 },
  { id: '3', name: 'Sandwich Club', price: 6.75, category: 'Comida', icon: 'Sandwich', stock: 25 },
  { id: '4', name: 'Café Espresso', price: 2.50, category: 'Bebidas', icon: 'Coffee', stock: 100 },
  { id: '5', name: 'Vino Tinto', price: 15.00, category: 'Bebidas', icon: 'Wine', stock: 12 },
  { id: '6', name: 'Galletas Choco', price: 1.20, category: 'Snacks', icon: 'Cookie', stock: 60 },
  { id: '7', name: 'Helado Vainilla', price: 3.50, category: 'Postres', icon: 'IceCream', stock: 20 },
];

export const getIcon = (iconName: string, className?: string) => {
  const icons: Record<string, React.ReactNode> = {
    Pizza: <Pizza className={className} />,
    Utensils: <Utensils className={className} />,
    Sandwich: <Sandwich className={className} />,
    Coffee: <Coffee className={className} />,
    Wine: <Wine className={className} />,
    Cookie: <Cookie className={className} />,
    IceCream: <IceCream className={className} />,
    Smartphone: <Smartphone className={className} />,
    Laptop: <Laptop className={className} />,
    Tv: <Tv className={className} />,
  };
  return icons[iconName] || <Utensils className={className} />;
};

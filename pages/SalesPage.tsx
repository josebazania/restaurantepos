
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Minus, Trash2, CreditCard, Banknote, 
  ShoppingBag, ShoppingCart, CheckCircle, Download, 
  Printer, X, ChefHat, Receipt, ArrowLeft, Save
} from 'lucide-react';
import { Product, CartItem, Sale, Category, Table, Order } from '../types';
import { CATEGORIES, getIcon } from '../constants';
import { generateInvoicePDF } from '../invoiceGenerator';

interface SalesPageProps {
  products: Product[];
  tables: Table[];
  activeOrders: Order[];
  onUpdateOrder: (order: Order) => void;
  onCompleteSale: (sale: Sale) => void;
  sessionId: string;
}

const SalesPage: React.FC<SalesPageProps> = ({ products, tables, activeOrders, onUpdateOrder, onCompleteSale, sessionId }) => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const table = tables.find(t => t.id === tableId);
  const existingOrder = activeOrders.find(o => o.tableId === tableId && o.status !== 'Pagado');

  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Tarjeta'>('Efectivo');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (existingOrder) {
      setCart(existingOrder.items);
    }
  }, [existingOrder]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.16;
    return { subtotal, tax, total: subtotal + tax };
  }, [cart]);

  const handleSendToKitchen = () => {
    if (cart.length === 0 || !tableId) return;
    const order: Order = {
      id: existingOrder?.id || Math.random().toString(36).substr(2, 9).toUpperCase(),
      tableId,
      items: cart,
      status: 'En Cocina',
      ...totals,
      timestamp: existingOrder?.timestamp || Date.now()
    };
    onUpdateOrder(order);
    navigate('/tables');
  };

  const handleCheckout = () => {
    if (cart.length === 0 || !tableId) return;
    // Including tableId in the sale object to satisfy the updated Sale interface
    const sale: Sale = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: Date.now(),
      items: cart,
      total: totals.total,
      paymentMethod,
      sessionId,
      orderId: existingOrder?.id || 'DIRECT',
      tableId: tableId,
      tableNumber: table?.number || 0
    };
    onCompleteSale(sale);
    setShowSuccessModal(true);
    setCart([]);
  };

  if (!table) return <div>Mesa no encontrada</div>;

  return (
    <div className="flex h-full gap-6 overflow-hidden relative">
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <header className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/tables')} className="p-2 hover:bg-slate-50 rounded-xl">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h3 className="font-bold text-slate-800">Mesa {table.number}</h3>
              <p className="text-xs text-slate-400">Capacidad: {table.capacity} personas</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button 
               onClick={handleSendToKitchen}
               className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-sm shadow-md"
             >
               <ChefHat size={18} />
               Enviar a Cocina
             </button>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('Todos')}
            className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'Todos' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 no-scrollbar">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 mb-3">
                {getIcon(product.icon, "w-6 h-6")}
              </div>
              <h4 className="font-semibold text-slate-800 text-sm">{product.name}</h4>
              <p className="text-lg font-bold text-indigo-600 mt-1">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[380px] bg-white border-l border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="text-indigo-600" size={20} />
            <h2 className="text-lg font-bold text-slate-800">Comanda Actual</h2>
          </div>
          <p className="text-xs text-slate-400">Items en el pedido: {cart.length}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                <p className="text-[10px] text-slate-500">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md"><Minus size={12} /></button>
                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md"><Plus size={12} /></button>
              </div>
              <div className="text-right ml-2">
                <p className="text-xs font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-100 space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-800 pt-2">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentMethod('Efectivo')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs border-2 transition-all ${
                paymentMethod === 'Efectivo' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'
              }`}
            >
              <Banknote size={16} /> Efectivo
            </button>
            <button
              onClick={() => setPaymentMethod('Tarjeta')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs border-2 transition-all ${
                paymentMethod === 'Tarjeta' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'
              }`}
            >
              <CreditCard size={16} /> Tarjeta
            </button>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            <Receipt size={20} />
            Cerrar y Cobrar Mesa
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => navigate('/tables')}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-2xl font-bold">Pago Exitoso</h3>
            <p className="text-slate-500">Mesa {table.number} ha sido liberada.</p>
            <button onClick={() => navigate('/tables')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">Volver al Mapa</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;


import React from 'react';
import { TrendingUp, Users, ShoppingBag, AlertCircle, ChefHat, Clock, CheckCircle2 } from 'lucide-react';
import { Sale, Product, Order } from '../types';

interface DashboardPageProps {
  sales: Sale[];
  products: Product[];
  activeOrders: Order[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ sales, products, activeOrders }) => {
  const todayTotal = sales.reduce((acc, s) => acc + s.total, 0);
  const kitchenOrders = activeOrders.filter(o => o.status === 'En Cocina');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
          <TrendingUp className="mb-4" size={24} />
          <p className="text-indigo-100 text-sm font-medium">Ventas del Turno</p>
          <h3 className="text-3xl font-bold">${todayTotal.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <ChefHat className="text-amber-500 mb-4" size={24} />
          <p className="text-slate-500 text-sm font-medium">Pedidos en Cocina</p>
          <h3 className="text-3xl font-bold text-slate-800">{kitchenOrders.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <AlertCircle className="text-rose-500 mb-4" size={24} />
          <p className="text-slate-500 text-sm font-medium">Stock Bajo</p>
          <h3 className="text-3xl font-bold text-slate-800">{products.filter(p => p.stock < 10).length}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ChefHat className="text-indigo-600" /> Monitor de Cocina
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase">Tiempo Real</span>
          </div>
          <div className="space-y-4">
            {kitchenOrders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400">
                No hay pedidos pendientes en cocina
              </div>
            ) : (
              kitchenOrders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-xl text-slate-800">Mesa {order.tableId.replace('t', '')}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {new Date(order.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase">Pendiente</span>
                  </div>
                  <div className="space-y-2 border-t border-slate-50 pt-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700">
                          <span className="text-indigo-600 font-black mr-2">{item.quantity}x</span>
                          {item.name}
                        </span>
                        {item.notes && <span className="text-[10px] text-rose-500 font-medium italic">{item.notes}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800">Últimas Ventas</h3>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {sales.slice(0, 5).map(sale => (
                <div key={sale.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Mesa {sale.tableNumber}</p>
                      <p className="text-[10px] text-slate-400">{new Date(sale.timestamp).toLocaleTimeString()} • {sale.paymentMethod}</p>
                    </div>
                  </div>
                  <p className="font-black text-indigo-600">${sale.total.toFixed(2)}</p>
                </div>
              ))}
              {sales.length === 0 && <p className="p-8 text-center text-slate-400 text-sm">No hay ventas registradas</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UtensilsCrossed, Receipt, CheckCircle, Clock } from 'lucide-react';
import { Table, Order } from '../types';

interface TablesPageProps {
  tables: Table[];
  activeOrders: Order[];
}

const TablesPage: React.FC<TablesPageProps> = ({ tables, activeOrders }) => {
  const navigate = useNavigate();

  const getTableOrder = (tableId: string) => activeOrders.find(o => o.tableId === tableId && o.status !== 'Pagado');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mapa de Mesas</h2>
          <p className="text-slate-500">Selecciona una mesa para gestionar el pedido</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div> LIBRE
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <div className="w-3 h-3 bg-rose-500 rounded-full"></div> OCUPADA
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div> CUENTA
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tables.map(table => {
          const order = getTableOrder(table.id);
          const statusColors = {
            Libre: 'bg-white border-slate-200 text-slate-400',
            Ocupada: 'bg-rose-50 border-rose-200 text-rose-600',
            Cuenta: 'bg-amber-50 border-amber-200 text-amber-600',
            Limpieza: 'bg-indigo-50 border-indigo-200 text-indigo-600',
          };

          return (
            <button
              key={table.id}
              onClick={() => navigate(`/pos/${table.id}`)}
              className={`p-6 rounded-3xl border-2 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-4 relative overflow-hidden group shadow-sm hover:shadow-md ${statusColors[table.status]}`}
            >
              <div className={`p-4 rounded-2xl ${table.status === 'Libre' ? 'bg-slate-50' : 'bg-white shadow-sm'}`}>
                <UtensilsCrossed size={32} />
              </div>
              
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Mesa</span>
                <h3 className="text-3xl font-black">{table.number}</h3>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold">
                <Users size={12} />
                CAP: {table.capacity}
              </div>

              {order && (
                <div className="absolute top-2 right-2 flex gap-1">
                   <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                </div>
              )}

              {order && (
                <div className="mt-2 w-full pt-4 border-t border-current border-dashed opacity-40">
                  <p className="text-[10px] font-bold">TOTAL: ${order.total.toFixed(2)}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TablesPage;

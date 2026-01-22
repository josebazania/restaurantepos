
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { Sale } from '../types';

interface ReportsPageProps {
  sales: Sale[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ sales }) => {
  // Mock data if no sales exist to show the chart aesthetics
  const salesByHour = useMemo(() => {
    const data = Array.from({ length: 12 }, (_, i) => ({
      hour: `${i + 9}:00`,
      ventas: 0
    }));

    sales.forEach(s => {
      const hour = new Date(s.timestamp).getHours();
      const index = hour - 9;
      if (index >= 0 && index < 12) {
        data[index].ventas += s.total;
      }
    });

    // If no sales, use some mock numbers to visualize
    if (sales.length === 0) {
      return data.map((d, i) => ({ ...d, ventas: [50, 80, 150, 200, 120, 90, 110, 250, 310, 180, 140, 60][i] }));
    }

    return data;
  }, [sales]);

  const paymentData = useMemo(() => {
    const counts = sales.reduce((acc, s) => {
      acc[s.paymentMethod] = (acc[s.paymentMethod] || 0) + s.total;
      return acc;
    }, { 'Efectivo': 0, 'Tarjeta': 0 } as Record<string, number>);

    return [
      { name: 'Efectivo', value: counts['Efectivo'] || 500 },
      { name: 'Tarjeta', value: counts['Tarjeta'] || 850 }
    ];
  }, [sales]);

  const COLORS = ['#6366f1', '#10b981'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Análisis y Reportes</h2>
        <p className="text-slate-500">Visualiza el rendimiento de tu negocio en tiempo real</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Hour */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Ventas por Hora</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByHour}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="ventas" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Métodos de Pago</h3>
          <div className="h-80 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Crecimiento Mensual</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { month: 'Ene', ingresos: 4000 },
              { month: 'Feb', ingresos: 3000 },
              { month: 'Mar', ingresos: 2000 },
              { month: 'Abr', ingresos: 2780 },
              { month: 'May', ingresos: 1890 },
              { month: 'Jun', ingresos: 2390 },
              { month: 'Jul', ingresos: 3490 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip />
              <Line type="monotone" dataKey="ingresos" stroke="#6366f1" strokeWidth={3} dot={{r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

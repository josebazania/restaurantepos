
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Lock,
  User as UserIcon,
  ShieldCheck,
  Wallet,
  Grid
} from 'lucide-react';
import { Product, Sale, User, Role, CashSession, Table, Order } from './types';
import { INITIAL_PRODUCTS, MOCK_USERS, INITIAL_TABLES } from './constants';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import CashSessionPage from './pages/CashSessionPage';
import TablesPage from './pages/TablesPage';

const SidebarItem: React.FC<{ to: string, icon: any, label: string, active: boolean, disabled?: boolean }> = ({ to, icon: Icon, label, active, disabled }) => (
  <Link
    to={disabled ? '#' : to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      disabled 
        ? 'opacity-30 cursor-not-allowed grayscale pointer-events-none' 
        : active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const LoginPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (user) onLogin(user);
    else setError('Credenciales inválidas. Intente admin/123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold">Nexus Resto POS</h2>
          <p className="text-indigo-100 text-sm mt-1">Gestión de Restaurante Pro</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Usuario</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="password" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode, currentUser: User, onLogout: () => void, isCashOpen: boolean }> = ({ children, currentUser, onLogout, isCashOpen }) => {
  const location = useLocation();
  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['Administrador', 'Cajero', 'Cocinero'] },
    { to: '/tables', icon: Grid, label: 'Mesas / Salón', roles: ['Administrador', 'Cajero', 'Mozo'] },
    { to: '/cash', icon: Wallet, label: 'Caja', roles: ['Administrador', 'Cajero'] },
    { to: '/inventory', icon: Package, label: 'Inventario', roles: ['Administrador'] },
    { to: '/reports', icon: BarChart3, label: 'Reportes', roles: ['Administrador'] },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
          <h1 className="text-xl font-bold text-slate-800">Nexus <span className="text-indigo-600">POS</span></h1>
        </div>
        <div className="p-6 flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map(item => (
            <SidebarItem key={item.to} to={item.to} icon={item.icon} label={item.label} active={location.pathname === item.to || location.pathname.startsWith('/pos/')} disabled={!item.roles.includes(currentUser.role)} />
          ))}
        </div>
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-6 p-2 bg-slate-50 rounded-2xl">
            <img src={currentUser.avatar} className="w-10 h-10 rounded-full" alt="Avatar" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-indigo-600 font-bold uppercase">{currentUser.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"><LogOut size={20} /> Salir</button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
          <h2 className="text-slate-800 font-bold">Nexus POS Restaurante</h2>
          <div className="flex items-center gap-4">
             <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${isCashOpen ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
               CAJA {isCashOpen ? 'ABIERTA' : 'CERRADA'}
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8 no-scrollbar">{children}</div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>([]);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentCashSession, setCurrentCashSession] = useState<CashSession | null>(() => {
    const saved = localStorage.getItem('nexus_cash_session');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('nexus_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexus_session');
  };

  const handleUpdateOrder = (order: Order) => {
    setActiveOrders(prev => {
      const existing = prev.find(o => o.id === order.id);
      if (existing) return prev.map(o => o.id === order.id ? order : o);
      return [...prev, order];
    });
    setTables(prev => prev.map(t => t.id === order.tableId ? { ...t, status: 'Ocupada', currentOrderId: order.id } : t));
  };

  const handleCompleteSale = (sale: Sale) => {
    setSales(prev => [sale, ...prev]);
    setActiveOrders(prev => prev.filter(o => o.id !== sale.orderId));
    setTables(prev => prev.map(t => t.id === sale.tableId ? { ...t, status: 'Libre', currentOrderId: undefined } : t));
    
    if (currentCashSession) {
      const updated = {
        ...currentCashSession,
        totalSales: currentCashSession.totalSales + sale.total,
        expectedBalance: currentCashSession.expectedBalance + sale.total
      };
      setCurrentCashSession(updated);
      localStorage.setItem('nexus_cash_session', JSON.stringify(updated));
    }
  };

  const handleOpenCash = (b: number) => {
    if (!currentUser) return;
    const session: CashSession = { id: Date.now().toString(), status: 'Abierta', openedAt: Date.now(), openingBalance: b, totalSales: 0, expectedBalance: b, userId: currentUser.id, userName: currentUser.name };
    setCurrentCashSession(session);
    localStorage.setItem('nexus_cash_session', JSON.stringify(session));
  };

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;

  return (
    <Router>
      <Layout currentUser={currentUser} onLogout={handleLogout} isCashOpen={!!currentCashSession}>
        <Routes>
          <Route path="/" element={<DashboardPage sales={sales} products={products} activeOrders={activeOrders} />} />
          <Route path="/tables" element={<TablesPage tables={tables} activeOrders={activeOrders} />} />
          <Route path="/pos/:tableId" element={
            currentCashSession 
              ? <SalesPage 
                  products={products} 
                  tables={tables} 
                  activeOrders={activeOrders} 
                  onUpdateOrder={handleUpdateOrder}
                  onCompleteSale={handleCompleteSale}
                  sessionId={currentCashSession.id}
                />
              : <Navigate to="/cash" />
          } />
          <Route path="/cash" element={<CashSessionPage currentSession={currentCashSession} onOpenSession={handleOpenCash} onCloseSession={() => { setCurrentCashSession(null); localStorage.removeItem('nexus_cash_session'); }} currentUser={currentUser} />} />
          <Route path="/inventory" element={<InventoryPage products={products} setProducts={setProducts} />} />
          <Route path="/reports" element={<ReportsPage sales={sales} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

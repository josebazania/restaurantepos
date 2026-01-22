
import React, { useState } from 'react';
import { Wallet, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { CashSession, User } from '../types';

interface CashSessionPageProps {
  currentSession: CashSession | null;
  onOpenSession: (amount: number) => void;
  onCloseSession: (realAmount: number) => void;
  currentUser: User;
}

const CashSessionPage: React.FC<CashSessionPageProps> = ({ currentSession, onOpenSession, onCloseSession, currentUser }) => {
  const [amount, setAmount] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOpen = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) return alert('Ingrese un monto válido');
    onOpenSession(val);
    setAmount('');
  };

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) return alert('Ingrese el conteo real de caja');
    onCloseSession(val);
    setAmount('');
    setShowConfirm(false);
  };

  if (!currentSession) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <Wallet size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Apertura de Caja</h2>
            <p className="text-slate-500 text-sm">Debes iniciar una sesión de caja para poder realizar ventas.</p>
          </div>
          
          <form onSubmit={handleOpen} className="space-y-4 pt-4 text-left">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Monto Inicial (Fondo de caja)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-xl"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Abrir Caja Registradora
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Caja Abierta</h2>
            <p className="text-xs text-slate-400">Desde: {new Date(currentSession.openedAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Responsable</p>
            <p className="font-bold text-slate-800">{currentSession.userName}</p>
          </div>
          <button 
            onClick={() => setShowConfirm(true)}
            className="px-6 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-all flex items-center gap-2"
          >
            <LogOut size={18} />
            Cerrar Caja
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase mb-2">Saldo Inicial</p>
          <p className="text-2xl font-bold text-slate-800">${currentSession.openingBalance.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase mb-2">Ventas del Turno</p>
          <p className="text-2xl font-bold text-indigo-600">+${currentSession.totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 text-white">
          <p className="text-indigo-100 text-xs font-bold uppercase mb-2">Efectivo Esperado</p>
          <p className="text-2xl font-bold">${currentSession.expectedBalance.toFixed(2)}</p>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6 animate-in zoom-in duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-slate-800">Confirmar Cierre</h3>
              <p className="text-slate-500">Ingresa el total de efectivo que tienes físicamente en caja.</p>
            </div>
            <form onSubmit={handleClose} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Contenedo Real en Caja</label>
                <input 
                  autoFocus
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-xl font-bold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowConfirm(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all">Finalizar Turno</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashSessionPage;

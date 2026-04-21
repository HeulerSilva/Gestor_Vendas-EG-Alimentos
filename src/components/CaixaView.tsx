import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { Box, DollarSign, List, CheckCircle, TrendingUp, ShieldAlert, Cpu, Activity, Database } from 'lucide-react';
import { Despesa, MovimentacaoCaixa, Venda, TipoPagamento } from '../types';
import { motion } from 'motion/react';

interface Props {
  expenses: Despesa[];
  movements: MovimentacaoCaixa[];
  setMovements: Dispatch<SetStateAction<MovimentacaoCaixa[]>>;
  sales: Venda[];
  payments: TipoPagamento[];
}

export default function CaixaView({ expenses, movements, setMovements, sales, payments }: Props) {
  const [selectedExpense, setSelectedExpense] = useState('');
  const [expenseValue, setExpenseValue] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const salesToday = sales.filter(s => s.dataHora.startsWith(today));
  
  const totalsByPayment = payments.map(p => {
    const total = salesToday
      .filter(s => s.tipoPgtoId === p.id)
      .reduce((acc, s) => acc + s.totalVenda, 0);
    return { name: p.tipoPgto, value: total };
  });

  const totalSales = totalsByPayment.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpenses = movements.filter(m => m.data === today).reduce((acc, m) => acc + (m.valorDespesa || 0), 0);

  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedExpense || !expenseValue) return;

    const newMov: MovimentacaoCaixa = {
      id: Math.random().toString(36).substr(2, 9),
      data: today,
      despesaId: selectedExpense,
      valorDespesa: Number(expenseValue),
      fecharCaixa: false
    };

    setMovements([...movements, newMov]);
    setSelectedExpense('');
    setExpenseValue('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono">
      <div className="space-y-6">
        <div className="bg-brand-sidebar p-6 rounded-xl border border-brand-line shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <TrendingUp className="text-brand-accent" size={20} />
               <h2 className="text-sm font-black text-slate-100 uppercase tracking-widest italic-serif">Day_Cycle: Sales_Matrix</h2>
            </div>
            <div className="text-[10px] font-mono text-brand-accent/50 uppercase tracking-widest flex items-center gap-2">
               <Activity size={12} /> Live_Feed
            </div>
          </div>

          <div className="space-y-3">
            {totalsByPayment.map((t, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-900 border border-brand-line/50 rounded-lg group hover:border-brand-accent/30 transition-all">
                <div className="flex flex-col">
                   <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mb-1">Gateway_Node</span>
                   <span className="text-xs font-bold text-slate-200 uppercase">{t.name}</span>
                </div>
                <span className="font-black text-brand-accent text-sm tracking-tighter">
                  {t.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            ))}
            
            <div className="mt-6 pt-6 border-t border-brand-line flex justify-between items-end">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Total_Cycle_Magnitude</span>
                  <span className="text-2xl font-black text-brand-accent tracking-tighter leading-none italic-serif">
                    {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
               </div>
               <div className="text-[10px] text-slate-600 uppercase tracking-widest pb-1 opacity-50">CURRENCY: BRL</div>
            </div>
          </div>
        </div>

        <div className="bg-amber-950/20 border border-brand-accent/20 p-8 rounded-xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 flex flex-col items-end">
             <Cpu size={120} />
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
               <Database size={12} /> Cash_Reserves (Local_Pool)
            </span>
            <span className="text-4xl font-black text-brand-accent italic-serif tracking-tighter shadow-brand-accent/20">
               R$ {(totalSales - totalExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-brand-sidebar p-6 rounded-xl border border-brand-line shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <DollarSign className="text-red-500" size={20} />
               <h2 className="text-sm font-black text-slate-100 uppercase tracking-widest italic-serif">Expense_Protocol: Node_Output</h2>
            </div>
            <div className="text-[10px] font-mono text-red-500/50 uppercase tracking-widest flex items-center gap-2">
               <ShieldAlert size={12} /> Sec_Validation: ON
            </div>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-3 space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Target_Account</label>
                <select 
                  value={selectedExpense} 
                  onChange={e => setSelectedExpense(e.target.value)}
                  className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-red-500/50"
                  required
                >
                  <option value="">-- SELECT_ENTRY --</option>
                  {expenses.filter(e => e.status === 'Ativo').map(e => (
                    <option key={e.id} value={e.id} className="bg-slate-900 uppercase italic-serif tracking-widest">{e.nome}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Magnitude (BRL)</label>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs">$</span>
                   <input 
                    type="number" 
                    step="0.01"
                    value={expenseValue} 
                    onChange={e => setExpenseValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-900 border border-brand-line rounded-lg pl-8 pr-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-red-500/50"
                    required
                  />
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-slate-950 py-3 rounded-lg flex items-center justify-center gap-2 font-black transition-all shadow-lg shadow-red-500/10 active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              Authorize_Withdrawal
            </button>
          </form>
        </div>

        <div className="bg-brand-sidebar rounded-xl border border-brand-line overflow-hidden shadow-2xl">
           <div className="p-4 border-b border-brand-line bg-slate-900/50 flex items-center gap-2">
              <List size={14} className="text-slate-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol_Logs: Output_History</span>
           </div>
           <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-left font-mono text-[10px]">
                <thead>
                   <tr className="bg-slate-950/20 text-slate-600 border-b border-brand-line uppercase italic-serif tracking-widest underline decoration-slate-800">
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-right">Value</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-brand-line/30 italic-serif">
                   {movements.filter(m => m.data === today).map(m => {
                     const exp = expenses.find(e => e.id === m.despesaId);
                     return (
                       <tr key={m.id} className="hover:bg-red-500/[0.02] transition-colors">
                          <td className="px-4 py-3 text-slate-600">{today}</td>
                          <td className="px-4 py-3 text-slate-300 font-bold tracking-widest uppercase">{exp?.nome || 'UNKNOWN'}</td>
                          <td className="px-4 py-3 text-right text-red-400 font-bold">
                            - {m.valorDespesa?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                       </tr>
                     );
                   })}
                   {movements.filter(m => m.data === today).length === 0 && (
                     <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-700 italic font-black uppercase tracking-[0.2em] opacity-30">
                          Idle: No_Protocol_Outputs_Detected
                        </td>
                     </tr>
                   )}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}

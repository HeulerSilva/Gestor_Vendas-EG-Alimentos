import { useState } from 'react';
import { FileText, Search, Download, Calendar, Filter, Database, BarChart3, LineChart } from 'lucide-react';
import { Venda, Vendedor, Cliente, TipoPagamento } from '../types';
import { motion } from 'motion/react';

interface Props {
  sales: Venda[];
  vendors: Vendedor[];
  clients: Cliente[];
  payments: TipoPagamento[];
}

export default function RelatoriosView({ sales, vendors, clients, payments }: Props) {
  const [filters, setFilters] = useState({
    date: '',
    vendorId: '',
    clientId: '',
    paymentId: ''
  });

  const filteredSales = sales.filter(sale => {
    const saleDate = sale.dataHora.split('T')[0];
    return (
      (!filters.date || saleDate === filters.date) &&
      (!filters.vendorId || sale.vendedorId === filters.vendorId) &&
      (!filters.clientId || sale.clienteId === filters.clientId) &&
      (!filters.paymentId || sale.tipoPgtoId === filters.paymentId)
    );
  });

  const totalFiltered = filteredSales.reduce((acc, curr) => acc + curr.totalVenda, 0);

  return (
    <div className="space-y-8 pb-10 font-mono">
      <div className="bg-brand-sidebar p-8 rounded-xl border border-brand-line shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Filter className="text-brand-accent" size={20} />
          <h2 className="text-sm font-black text-slate-100 uppercase tracking-widest italic-serif">Query_Engine: Multi-Parameter_Filter</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temporal_Node (DATE)</label>
            <input 
              type="date"
              className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent"
              value={filters.date}
              onChange={e => setFilters({ ...filters, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vendedor_UUID</label>
            <select 
              className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent"
              value={filters.vendorId}
              onChange={e => setFilters({ ...filters, vendorId: e.target.value })}
            >
              <option value="">ALL_VENDORS</option>
              {vendors.map(v => <option key={v.id} value={v.id} className="bg-slate-900 uppercase">[{v.id.slice(0,4)}] {v.nome}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Client_Datalink</label>
            <select 
              className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent"
              value={filters.clientId}
              onChange={e => setFilters({ ...filters, clientId: e.target.value })}
            >
              <option value="">ALL_ENTITIES</option>
              {clients.map(c => <option key={c.id} value={c.id} className="bg-slate-900 uppercase">{c.nome}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Channel_Protocol</label>
            <select 
              className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent"
              value={filters.paymentId}
              onChange={e => setFilters({ ...filters, paymentId: e.target.value })}
            >
              <option value="">ALL_GATEWAYS</option>
              {payments.map(p => <option key={p.id} value={p.id} className="bg-slate-900 uppercase">{p.tipoPgto}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-brand-sidebar rounded-xl border border-brand-line shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-brand-line flex justify-between items-center bg-slate-900/50">
          <div className="flex gap-6 items-center">
             <div className="bg-brand-accent/10 border border-brand-accent/20 p-4 rounded-lg flex items-center gap-4">
                <BarChart3 className="text-brand-accent" size={32} />
                <div>
                   <span className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Query_Magnitude</span>
                   <span className="text-2xl font-black text-brand-accent tracking-tighter italic-serif">
                     {totalFiltered.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                   </span>
                </div>
             </div>
             <div>
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest italic-serif">Result_Set_Buffer</h3>
                <p className="text-[10px] text-slate-500 font-mono italic">{filteredSales.length} records retrieved from disk memory.</p>
             </div>
          </div>
          <button className="flex items-center gap-2 bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg active:scale-95 transition-all">
             <Download size={16} /> Export_Data.csv
          </button>
        </div>

        <div className="overflow-x-auto font-mono text-[10px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/20 text-slate-600 border-b border-brand-line uppercase tracking-widest italic-serif">
                <th className="px-8 py-4">Transaction_ID</th>
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4">Client_Datalink</th>
                <th className="px-8 py-4">Vendedor</th>
                <th className="px-8 py-4">Protocol</th>
                <th className="px-8 py-4 text-right">Magnitude</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line/50 italic-serif">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-brand-accent/[0.03] transition-colors group">
                  <td className="px-8 py-4 text-slate-500 font-mono">0x{String(sale.id).slice(0,4)}</td>
                  <td className="px-8 py-4 text-slate-400">{new Date(sale.dataHora).toLocaleString('pt-BR')}</td>
                  <td className="px-8 py-4 text-slate-200 font-bold tracking-widest uppercase">
                    {clients.find(c => c.id === sale.clienteId)?.nome || 'ANONYMOUS_ENTITY'}
                  </td>
                  <td className="px-8 py-4 text-slate-500 uppercase tracking-tighter italic font-black">
                    {vendors.find(v => v.id === sale.vendedorId)?.nome}
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] px-2 py-0.5 rounded border border-brand-line bg-slate-900 text-slate-400 font-bold uppercase tracking-widest">
                       {payments.find(p => p.id === sale.tipoPgtoId)?.tipoPgto}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right font-black text-brand-accent text-sm">
                    {sale.totalVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-700 opacity-30">
                       <Database size={32} />
                       <span className="uppercase tracking-[0.3em] font-black">Memory_Leak: No_Data_Found_In_Query</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

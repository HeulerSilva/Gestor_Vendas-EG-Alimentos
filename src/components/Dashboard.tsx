import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertTriangle
} from 'lucide-react';
import { Vendedor, Cliente, Produto, Venda } from '../types';

interface Props {
  vendors: Vendedor[];
  clients: Cliente[];
  products: Produto[];
  sales: Venda[];
}

export default function Dashboard({ vendors, clients, products, sales }: Props) {
  const totalSalesValue = sales.reduce((acc, sale) => acc + sale.totalVenda, 0);
  const totalProducts = products.length;
  const activeClients = clients.filter(c => c.status === 'Ativo').length;
  
  const stats = [
    { label: 'Vendas Totais', value: `R$ ${totalSalesValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-brand-accent', bg: 'bg-amber-50', trend: '+12.5%', trendType: 'up' },
    { label: 'Produtos', value: totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+3 novos', trendType: 'up' },
    { label: 'Clientes Ativos', value: activeClients, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: '-1.2%', trendType: 'down' },
    { label: 'Vendedores', value: vendors.length, icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Estável', trendType: 'neutral' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black italic-serif text-slate-100 uppercase tracking-tight">Visão Geral do Sistema</h1>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Status: Operacional / Sync: Estável</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="bg-brand-sidebar p-6 rounded-xl border border-brand-line shadow-2xl flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={80} />
            </div>
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-2.5 rounded-lg bg-slate-800 border border-slate-700 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1 rounded bg-slate-800 border border-slate-700 ${stat.trendType === 'up' ? 'text-brand-accent' : stat.trendType === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
                {stat.trend}
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-2xl font-black text-slate-100 mt-1 font-mono tracking-tighter">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-brand-sidebar rounded-xl border border-brand-line shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-brand-line flex justify-between items-center bg-slate-900/50">
            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-300">Fluxo de Vendas</h3>
            <span className="text-[10px] font-mono text-slate-500">LIVE FEED</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950/50 text-[10px] font-bold text-slate-600 uppercase tracking-widest italic-serif">
                <tr>
                  <th className="px-6 py-4 border-b border-brand-line">Protocolo</th>
                  <th className="px-6 py-4 border-b border-brand-line">Agente</th>
                  <th className="px-6 py-4 border-b border-brand-line">Valor</th>
                  <th className="px-6 py-4 border-b border-brand-line text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono divide-y divide-brand-line/50">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-600">Nenhum dado processado.</td>
                  </tr>
                ) : (
                  sales.slice(-5).reverse().map((sale) => (
                    <tr key={sale.id} className="hover:bg-brand-accent/5 transition-colors group cursor-pointer">
                      <td className="px-6 py-4 text-brand-accent/70">#{sale.id}</td>
                      <td className="px-6 py-4 text-slate-400">{vendors.find(v => v.id === sale.vendedorId)?.nome || 'Unknown'}</td>
                      <td className="px-6 py-4 font-bold text-slate-200">
                        R$ {sale.totalVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[10px] bg-brand-accent/10 text-brand-accent border border-brand-accent/20 px-2 py-0.5 rounded uppercase font-bold">COMPLETED</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-brand-sidebar rounded-xl border border-brand-line shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-brand-line flex justify-between items-center bg-red-500/5">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle size={16} />
              <h3 className="font-bold text-sm uppercase tracking-widest">Alertas de Estoque</h3>
            </div>
            <span className="text-[10px] font-mono text-red-400/60 blink">CRITICAL_LEVEL</span>
          </div>
          <div className="overflow-y-auto max-h-[350px]">
             <table className="w-full text-left">
              <thead className="bg-slate-950/50 text-[10px] font-bold text-slate-600 uppercase tracking-widest italic-serif border-b border-brand-line">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Nível Atual</th>
                  <th className="px-6 py-4">Mín. Seguro</th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono divide-y divide-brand-line/50">
                {products.filter(p => p.qtdEstoque <= p.estoqueMinimo).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-600 italic">Integridade de estoque mantida.</td>
                  </tr>
                ) : (
                  products.filter(p => p.qtdEstoque <= p.estoqueMinimo).map((product) => (
                    <tr key={product.id} className="hover:bg-red-500/5 transition-colors">
                      <td className="px-6 py-4 text-slate-300">{product.nome}</td>
                      <td className="px-6 py-4 text-red-500 font-bold">{product.qtdEstoque} {product.und}</td>
                      <td className="px-6 py-4 text-slate-500">{product.estoqueMinimo} {product.und}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

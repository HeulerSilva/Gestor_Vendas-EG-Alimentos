import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { Truck, Search, Plus, Trash2, CheckCircle, Package, Database, ShieldAlert, FileText } from 'lucide-react';
import { Pedido, Fornecedor, Produto, PedidoItem } from '../types';
import { motion } from 'motion/react';

interface Props {
  data: Pedido[];
  setData: Dispatch<SetStateAction<Pedido[]>>;
  suppliers: Fornecedor[];
  products: Produto[];
  setProducts: Dispatch<SetStateAction<Produto[]>>;
}

export default function PedidosList({ data, setData, suppliers, products, setProducts }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [nrNota, setNrNota] = useState('');
  const [cart, setCart] = useState<PedidoItem[]>([]);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.idProduto === productId);
    if (existing) return;

    setCart([...cart, {
      idProduto: productId,
      itemAtendido: true,
      precoCusto: product.precoCusto,
      quantidade: 1
    }]);
  };

  const updateCartItem = (productId: string, field: keyof PedidoItem, value: any) => {
    setCart(cart.map(item => item.idProduto === productId ? { ...item, [field]: value } : item));
  };

  const handleFinalize = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || cart.length === 0) return;

    const total = cart.reduce((acc, item) => acc + (item.itemAtendido ? (item.precoCusto * item.quantidade) : 0), 0);
    
    const newPedido: Pedido = {
      id: Math.random().toString(36).substr(2, 9),
      dataPedido: new Date().toISOString(),
      nrNota: nrNota,
      fornecedorId: selectedSupplierId,
      itens: [...cart],
      totalPedido: total
    };

    // Update stock for attended items
    setProducts(prev => prev.map(p => {
      const item = cart.find(c => c.idProduto === p.id && c.itemAtendido);
      if (item) {
        return { ...p, qtdEstoque: p.qtdEstoque + item.quantidade };
      }
      return p;
    }));

    setData([...data, newPedido]);
    setIsModalOpen(false);
    setCart([]);
    setNrNota('');
    setSelectedSupplierId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-black text-slate-100 uppercase tracking-tighter italic-serif">Logística & Entradas</h2>
           <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">Status do Fluxo: OPERACIONAL</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark px-6 py-2.5 rounded-lg flex items-center gap-2 font-black transition-all shadow-lg shadow-brand-accent/10 active:scale-95"
        >
          <Plus size={18} /> <span className="text-xs uppercase tracking-widest">Nova NF-e / Entrada</span>
        </button>
      </div>

      <div className="bg-brand-sidebar rounded-xl border border-brand-line shadow-2xl overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic-serif border-b border-brand-line">
                <th className="px-6 py-4">Sincronização</th>
                <th className="px-6 py-4">Nota Fiscal</th>
                <th className="px-6 py-4">Datalink: Fornecedor</th>
                <th className="px-6 py-4 text-right">Magnitude</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line/50 italic-serif">
              {data.map(p => (
                <tr key={p.id} className="hover:bg-brand-accent/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{new Date(p.dataPedido).toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-brand-line font-bold">
                       DOC_{p.nrNota || 'PROVISÓRIO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-bold uppercase tracking-widest">
                    {suppliers.find(s => s.id === p.fornecedorId)?.nome || 'SUPPLIER_NOT_FOUND'}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-brand-accent text-sm">
                    VAL: {p.totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-600 opacity-50">
                       <Database size={32} />
                       <span className="uppercase tracking-[0.3em] text-[10px] font-black">Memory_Empty: No_Ingress_Data</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-sidebar border border-brand-line w-full max-w-5xl h-[85vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-brand-line bg-slate-900/50 flex justify-between items-center">
               <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest italic-serif flex items-center gap-2">
                <Truck size={16} className="text-brand-accent" />
                Ingresso de Mercadoria: Protocolo de Entrada
              </h3>
            </div>

            <form onSubmit={handleFinalize} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/20">
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Protocolo NF-e</label>
                   <input 
                    value={nrNota}
                    onChange={e => setNrNota(e.target.value)}
                    className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-2.5 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent"
                    placeholder="ID_SERIAL"
                    required
                  />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Selecione o Vendor</label>
                   <select 
                    value={selectedSupplierId}
                    onChange={e => setSelectedSupplierId(e.target.value)}
                    className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-2.5 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent"
                    required
                  >
                    <option value="">-- SELECIONAR_SUPPLY_NODE --</option>
                    {suppliers.map(s => <option key={s.id} value={s.id} className="bg-slate-900 uppercase">[{s.id.slice(0,4)}] {s.nome}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2 text-brand-accent">Add Item (Scanner Simulator)</label>
                   <select 
                    onChange={e => { if(e.target.value) handleAddToCart(e.target.value); e.target.value = ''; }}
                    className="w-full bg-slate-800 border border-brand-accent/30 rounded-lg px-4 py-2 text-xs font-mono text-brand-accent outline-none focus:border-brand-accent"
                  >
                    <option value="">DETECTING_MERCHANDISE...</option>
                    {products.map(p => <option key={p.id} value={p.id} className="bg-slate-900">COD_{p.codigo}: {p.nome}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-8 pb-8">
                <div className="border border-brand-line rounded-xl overflow-hidden bg-slate-950/30">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-900/50 text-[10px] text-slate-500 uppercase tracking-widest border-b border-brand-line">
                      <tr>
                        <th className="px-6 py-3 w-16 text-center">SYNC</th>
                        <th className="px-6 py-3 text-brand-accent/70 italic-serif uppercase">Product_Identity</th>
                        <th className="px-6 py-3 w-32 uppercase tracking-tighter">Volume</th>
                        <th className="px-6 py-3 w-40 uppercase tracking-tighter">Unit_Cost</th>
                        <th className="px-6 py-3 w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-line/50">
                      {cart.map(item => {
                        const p = products.find(x => x.id === item.idProduto);
                        return (
                          <tr key={item.idProduto} className="hover:bg-white/[0.02]">
                            <td className="px-6 py-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={item.itemAtendido} 
                                onChange={e => updateCartItem(item.idProduto, 'itemAtendido', e.target.checked)}
                                className="w-4 h-4 rounded border-brand-line bg-slate-800 text-brand-accent"
                              />
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-200">
                               <div className="flex flex-col">
                                 <span className="uppercase italic-serif tracking-widest">{p?.nome}</span>
                                 <span className="text-[10px] text-slate-600">DB_REF: {p?.id.slice(0,8)}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                              <input 
                                type="number" 
                                value={item.quantidade} 
                                onChange={e => updateCartItem(item.idProduto, 'quantidade', Math.max(1, Number(e.target.value)))}
                                className="w-full bg-slate-900 border border-brand-line rounded p-1.5 focus:border-brand-accent outline-none text-center"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 text-[10px]">R$</span>
                                <input 
                                  type="number" 
                                  step="0.01"
                                  value={item.precoCusto} 
                                  onChange={e => updateCartItem(item.idProduto, 'precoCusto', Number(e.target.value))}
                                  className="w-full bg-slate-900 border border-brand-line rounded p-1.5 pl-6 focus:border-brand-accent outline-none"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button type="button" onClick={() => setCart(cart.filter(c => c.idProduto !== item.idProduto))} className="p-1.5 text-slate-700 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {cart.length === 0 && (
                        <tr><td colSpan={5} className="py-10 text-center uppercase tracking-[0.2em] text-[10px] text-slate-700 italic font-black">Scanner_Waiting: Insert_Items</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

               <div className="p-6 border-t border-brand-line bg-slate-900/50 flex flex-wrap gap-4 items-center justify-between sticky bottom-0">
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-800 transition-all font-mono">
                      ABORT_SEQUENCE
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-8">
                     <div className="text-right">
                        <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest">NET_TOTAL_MAGNITUDE</span>
                        <span className="text-xl font-black text-brand-accent font-mono">
                          {cart.reduce((acc, item) => acc + (item.itemAtendido ? (item.precoCusto * item.quantidade) : 0), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                     </div>
                     <button 
                      type="submit" 
                      disabled={cart.length === 0 || !selectedSupplierId}
                      className="bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-30 disabled:hover:bg-brand-accent text-brand-accent-dark px-8 py-3 rounded-lg flex items-center gap-3 font-black transition-all shadow-lg shadow-brand-accent/20 active:scale-95 uppercase tracking-widest"
                    >
                      <Database size={18} /> COMMIT_TO_STOCK
                    </button>
                  </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

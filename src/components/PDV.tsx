import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  User, 
  Users, 
  CreditCard, 
  Search, 
  Plus, 
  Minus, 
  CheckCircle,
  Tag,
  DollarSign,
  Package
} from 'lucide-react';
import { 
  Vendedor, 
  Cliente, 
  Produto, 
  TipoPagamento, 
  Venda, 
  VendaItem 
} from '../types';

interface Props {
  vendors: Vendedor[];
  clients: Cliente[];
  products: Produto[];
  payments: TipoPagamento[];
  sales: Venda[];
  setSales: Dispatch<SetStateAction<Venda[]>>;
  setProducts: Dispatch<SetStateAction<Produto[]>>;
}

export default function PDV({ vendors, clients, products, payments, sales, setSales, setProducts }: Props) {
  const [cart, setCart] = useState<VendaItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [selectedPaymentId, setSelectedPaymentId] = useState(payments[0]?.id || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.totalProduto, 0);

  const handleAddToCart = (product: Produto) => {
    const existing = cart.find(item => item.idProduto === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.idProduto === product.id 
          ? { ...item, quantidade: item.quantidade + 1, totalProduto: (item.quantidade + 1) * item.precoVenda }
          : item
      ));
    } else {
      setCart([...cart, {
        idProduto: product.id,
        quantidade: 1,
        precoVenda: product.precoVenda,
        descontoReais: 0,
        descontoPercentual: 0,
        totalProduto: product.precoVenda
      }]);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.idProduto !== productId));
  };

  const handleSetQty = (productId: string, qty: number) => {
    const newQty = Math.max(1, qty);
    setCart(cart.map(item => {
      if (item.idProduto === productId) {
        return { ...item, quantidade: newQty, totalProduto: newQty * item.precoVenda };
      }
      return item;
    }));
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    const item = cart.find(i => i.idProduto === productId);
    if (item) handleSetQty(productId, item.quantidade + delta);
  };

  const handleFinishSale = () => {
    if (!selectedVendorId) {
      alert('Selecione um vendedor!');
      return;
    }
    if (cart.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    const nextId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 70000;
    
    const newSale: Venda = {
      id: nextId,
      dataHora: new Date().toISOString(),
      vendedorId: selectedVendorId,
      clienteId: selectedClientId,
      tipoPgtoId: selectedPaymentId,
      itens: [...cart],
      totalVenda: subtotal,
    };

    // Update stock
    setProducts(prev => prev.map(p => {
      const sold = cart.find(item => item.idProduto === p.id);
      if (sold) {
        return { ...p, qtdEstoque: p.qtdEstoque - sold.quantidade };
      }
      return p;
    }));

    setSales([...sales, newSale]);
    setCart([]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="h-full flex gap-0 -m-8 overflow-hidden">
      {/* Product Catalog / Search Area */}
      <section className="flex-1 flex flex-col p-8 space-y-6 border-r border-brand-line">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar Produto ou Código de Barras (F1)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-brand-line rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent placeholder:text-slate-500 font-mono"
            />
          </div>
          <div className="text-xs font-mono bg-slate-900 px-3 py-3 rounded border border-brand-line text-slate-400 flex items-center gap-2">
            <Tag size={14} className="text-brand-accent" /> CATEGORIA: TODAS
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-500 border-b border-brand-line italic-serif">
                <th className="py-3 px-2">Código</th>
                <th className="py-3 px-2">Produto</th>
                <th className="py-3 px-2">Estoque</th>
                <th className="py-3 px-2">Und</th>
                <th className="py-3 px-2 text-right">Preço (R$)</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono text-slate-100">
              {products.filter(p => p.status === 'Ativo').map((product) => (
                <tr 
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="border-b border-brand-line/30 hover:bg-brand-accent/5 cursor-pointer group transition-colors"
                >
                  <td className="py-4 px-2 text-slate-500">{product.codigo}</td>
                  <td className="py-4 px-2 text-slate-200 group-hover:text-brand-accent transition-colors">{product.nome}</td>
                  <td className={`py-4 px-2 font-bold ${product.qtdEstoque > 0 ? 'text-brand-accent' : 'text-red-500/80'}`}>
                    {product.qtdEstoque.toString().padStart(2, '0')}
                  </td>
                  <td className="py-4 px-2 text-slate-500 uppercase">{product.und}</td>
                  <td className="py-4 px-2 text-right font-black">
                    {product.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Identity Panel */}
        <div className="h-24 grid grid-cols-3 gap-4 shrink-0">
          <div className="bg-slate-900 border border-brand-line p-4 rounded-xl">
             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Operador / Vendedor</p>
             <select 
               value={selectedVendorId}
               onChange={(e) => setSelectedVendorId(e.target.value)}
               className="bg-transparent border-none text-slate-200 text-sm font-bold w-full outline-none focus:text-brand-accent"
             >
               <option value="" className="bg-slate-900">Selecionar...</option>
               {vendors.map(v => <option key={v.id} value={v.id} className="bg-slate-900">{v.nome}</option>)}
             </select>
          </div>
          <div className="bg-slate-900 border border-brand-line p-4 rounded-xl">
             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Cliente Alvo</p>
             <select 
               value={selectedClientId}
               onChange={(e) => setSelectedClientId(e.target.value)}
                className="bg-transparent border-none text-slate-200 text-sm font-bold w-full outline-none focus:text-brand-accent"
             >
               {clients.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.nome}</option>)}
             </select>
          </div>
          <div className="bg-slate-900 border border-brand-line p-4 rounded-xl">
             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Método de Liquidação</p>
             <select 
                value={selectedPaymentId}
                onChange={(e) => setSelectedPaymentId(e.target.value)}
                className="bg-transparent border-none text-slate-200 text-sm font-bold w-full outline-none focus:text-brand-accent"
             >
                {payments.map(p => <option key={p.id} value={p.id} className="bg-slate-900">{p.tipoPgto}</option>)}
             </select>
          </div>
        </div>
      </section>

      {/* Cart Summary Side Panel */}
      <section className="w-[500px] bg-slate-950 flex flex-col shrink-0 border-l border-brand-line shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.5)]">
        <div className="p-8 flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Ambiente de Checkout / Carrinho</h3>
            <span className="text-[10px] font-mono text-brand-accent/40 bg-brand-accent/5 px-2 py-1 rounded border border-brand-accent/10 tracking-[0.2em]">ID_VENDA: ACTIVE</span>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
            {cart.map((item) => {
              const product = products.find(p => p.id === item.idProduto);
              const isEditing = editingId === item.idProduto;
              
              return (
                <div 
                  key={item.idProduto} 
                  className={`flex justify-between items-start group p-4 rounded-xl border transition-all ${isEditing ? 'bg-brand-accent/5 border-brand-accent/30' : 'border-transparent hover:bg-slate-900/50'}`}
                >
                  <div className="flex-1 pr-4" onClick={() => setEditingId(item.idProduto)}>
                    <p className="text-base font-black text-slate-100 tracking-tight cursor-pointer hover:text-brand-accent transition-colors">{product?.nome}</p>
                    <div className="flex items-center gap-3 mt-2 h-6">
                       {isEditing ? (
                         <div className="flex items-center gap-2">
                           <input 
                             autoFocus
                             type="number"
                             value={item.quantidade}
                             onChange={(e) => handleSetQty(item.idProduto, Number(e.target.value))}
                             onBlur={() => setEditingId(null)}
                             onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                             className="w-16 bg-slate-900 border border-brand-accent/50 rounded px-2 py-0.5 text-xs font-mono text-brand-accent outline-none"
                           />
                           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">UN x {item.precoVenda.toFixed(2)}</span>
                         </div>
                       ) : (
                         <div className="flex items-center gap-3">
                           <span className="text-xs font-mono text-slate-500 font-bold">
                             <span className="text-brand-accent/70">{item.quantidade.toString().padStart(2, '0')}</span> UN x {item.precoVenda.toFixed(2)}
                           </span>
                           <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                             <button onClick={(e) => { e.stopPropagation(); handleUpdateQty(item.idProduto, -1); }} className="p-1 hover:bg-slate-800 rounded text-slate-600 hover:text-brand-accent"><Minus size={14} /></button>
                             <button onClick={(e) => { e.stopPropagation(); handleUpdateQty(item.idProduto, 1); }} className="p-1 hover:bg-slate-800 rounded text-slate-600 hover:text-brand-accent"><Plus size={14} /></button>
                             <button onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(item.idProduto); }} className="p-1 hover:bg-red-950/30 rounded text-slate-600 hover:text-red-500 ml-1"><Trash2 size={14} /></button>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                  <p className="text-lg font-black font-mono text-slate-100">{item.totalProduto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              );
            })}
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-10 py-20">
                <ShoppingCart size={100} />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-6">Aguardando Incursão de Itens</p>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-brand-line pt-8 space-y-5">
            <div className="flex justify-between text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
              <span>Subtotal</span>
              <span className="text-slate-300">{subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs font-mono uppercase tracking-[0.2em] text-red-500/50">
              <span>Desconto Protocolo (0%)</span>
              <span>- 0,00</span>
            </div>
            
            <div className="flex flex-col pt-8 border-t-2 border-brand-accent/20 mt-8">
               <span className="text-[10px] font-black text-brand-accent/50 uppercase tracking-[0.4em] mb-2 text-center">Magnitude Total Liquidação</span>
               <span className="text-6xl font-black text-brand-accent font-mono tracking-tighter text-center">
                 {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleFinishSale}
          className="w-full bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark font-black py-10 transition-all flex flex-col items-center justify-center gap-1 relative overflow-hidden group active:scale-[0.99] border-t border-brand-accent/30"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="text-3xl uppercase tracking-tighter relative z-10 flex items-center gap-3">
             Finalizar Venda <CheckCircle size={28} />
          </span>
          <span className="text-[10px] opacity-60 font-mono relative z-10 tracking-[0.3em]">COMMIT_TRANSACTION (F12)</span>
        </button>
      </section>

      {showSuccess && (
        <div className="fixed top-20 right-8 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent px-8 py-5 rounded-xl flex items-center gap-3 shadow-[0_0_50px_rgba(251,191,36,0.2)] backdrop-blur-md animate-in fade-in slide-in-from-right-8 z-[100]">
           <CheckCircle size={24} />
           <div className="flex flex-col">
              <span className="font-black text-sm font-mono uppercase tracking-widest leading-none">Liquidação Concluída</span>
              <span className="text-[10px] opacity-70 uppercase tracking-widest mt-1">Sincronização de estoque finalizada</span>
           </div>
        </div>
      )}

      {/* Footer Hotkeys */}
      <div className="fixed bottom-0 left-[260px] right-0 h-10 bg-slate-950 border-t border-brand-line flex items-center justify-between px-8 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono z-20">
         <div className="flex gap-10">
            <span className="flex items-center gap-1"><span className="text-brand-accent/50 font-black">F1</span> PESQUISAR</span>
            <span className="flex items-center gap-1"><span className="text-brand-accent/50 font-black">F2</span> QUANTIDADE</span>
            <span className="flex items-center gap-1"><span className="text-brand-accent/50 font-black">F5</span> CANCELAR</span>
            <span className="flex items-center gap-1 text-brand-accent/70 font-black tracking-widest underline decoration-brand-accent/30 underline-offset-4">F12 FINALIZAR</span>
         </div>
         <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shadow-[0_0_12px_rgba(251,191,36,0.6)]"></span>
              NODE_STATUS: ONLINE / SYNC_OK
            </span>
         </div>
      </div>
    </div>
  );
}

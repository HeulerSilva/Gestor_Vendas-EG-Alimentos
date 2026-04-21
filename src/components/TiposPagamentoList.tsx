import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { Plus, Edit2, Trash2, CreditCard, Activity } from 'lucide-react';
import { TipoPagamento } from '../types';
import { motion } from 'motion/react';

interface Props {
  data: TipoPagamento[];
  setData: Dispatch<SetStateAction<TipoPagamento[]>>;
}

export default function TiposPagamentoList({ data, setData }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TipoPagamento | null>(null);

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: TipoPagamento = {
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      tipoPgto: formData.get('tipoPgto') as string,
      produtivo: formData.get('produtivo') === 'on',
    };
    if (editingItem) setData(data.map(d => d.id === editingItem.id ? newItem : d));
    else setData([...data, newItem]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('REMOVER GATEWAY DE PAGAMENTO?')) {
      setData(data.filter(d => d.id !== id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-black text-slate-100 uppercase tracking-tighter italic-serif">Canais de Recebimento</h2>
           <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">Gateways configurados: {data.length}</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark px-6 py-2.5 rounded-lg flex items-center gap-2 font-black transition-all shadow-lg shadow-brand-accent/10 active:scale-95"
        >
          <Plus size={18} /> <span className="text-xs uppercase tracking-widest">Novo Canal</span>
        </button>
      </div>

      <div className="bg-brand-sidebar rounded-xl border border-brand-line shadow-2xl overflow-hidden font-mono text-xs">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/50 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic-serif border-b border-brand-line">
              <th className="px-6 py-4 w-24">ID_HEX</th>
              <th className="px-6 py-4">CHANNEL_TYPE</th>
              <th className="px-6 py-4 text-center">PRODUCTIVE_FLAG</th>
              <th className="px-6 py-4 text-right">CONTROLS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line/50">
            {data.map(t => (
              <tr key={t.id} className="hover:bg-brand-accent/5 transition-colors group italic-serif">
                <td className="px-6 py-4 font-mono text-[10px] text-slate-600">0x{t.id.slice(0, 4)}</td>
                <td className="px-6 py-4 font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard size={14} className="text-brand-accent/50" />
                  {t.tipoPgto}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${t.produtivo ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                    {t.produtivo ? 'TRUE' : 'FALSE'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 px-6">
                    <button 
                      onClick={() => { setEditingItem(t); setIsModalOpen(true); }} 
                      className="p-1.5 hover:bg-brand-accent/10 text-slate-500 hover:text-brand-accent transition-colors rounded-md"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(t.id)} 
                      className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-sidebar border border-brand-line w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-brand-line bg-slate-900/50">
               <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest italic-serif">
                Parametrização de Gateway
              </h3>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Descriptive Alias</label>
                   <input name="tipoPgto" required defaultValue={editingItem?.tipoPgto} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent placeholder:text-slate-700 uppercase" placeholder="Ex: CARTAO_DEBITO" />
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-brand-line/50">
                   <input type="checkbox" name="produtivo" id="produtivo" defaultChecked={editingItem?.produtivo} className="w-4 h-4 rounded border-brand-line bg-slate-800 text-brand-accent focus:ring-brand-accent" />
                   <label htmlFor="produtivo" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer flex items-center gap-2">
                     <Activity size={12} className="text-brand-accent" />
                     HABILITAR_PRODUTIVIDADE
                   </label>
                </div>
              </div>

               <div className="flex justify-end gap-3 pt-6 border-t border-brand-line">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-800 transition-all font-mono"
                >
                  ABORT_CONFIG
                </button>
                <button 
                  type="submit"
                  className="bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-accent/10 active:scale-95"
                >
                  DEPLOY_CHANNEL
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

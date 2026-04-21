import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { Plus, Edit2, Trash2, ReceiptText, AlertTriangle } from 'lucide-react';
import { Despesa } from '../types';
import { motion } from 'motion/react';

interface Props {
  data: Despesa[];
  setData: Dispatch<SetStateAction<Despesa[]>>;
}

export default function DespesasList({ data, setData }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Despesa | null>(null);

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: Despesa = {
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      nome: formData.get('nome') as string,
      status: formData.get('status') as 'Ativo' | 'Inativo',
    };
    if (editingItem) setData(data.map(d => d.id === editingItem.id ? newItem : d));
    else setData([...data, newItem]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('REMOVER ESTE CENTRO DE CUSTO / DESPESA?')) {
      setData(data.filter(x => x.id !== id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-black text-slate-100 uppercase tracking-tighter italic-serif">Plano de Contas / Despesas</h2>
           <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">Centros de custo monitorados: {data.length}</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark px-6 py-2.5 rounded-lg flex items-center gap-2 font-black transition-all shadow-lg shadow-brand-accent/10 active:scale-95"
        >
          <Plus size={18} /> <span className="text-xs uppercase tracking-widest">Nova Categoria</span>
        </button>
      </div>

      <div className="bg-brand-sidebar rounded-xl border border-brand-line shadow-2xl overflow-hidden font-mono text-xs">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/50 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic-serif border-b border-brand-line">
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Expense_Category</th>
              <th className="px-6 py-4 text-right">Dev_Commands</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line/50">
            {data.map(d => (
              <tr key={d.id} className="hover:bg-brand-accent/5 transition-colors group italic-serif">
                <td className="px-6 py-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${d.status === 'Ativo' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                    {d.status === 'Ativo' ? 'Operational' : 'Halted'}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                  <ReceiptText size={14} className="text-brand-accent/50" />
                  {d.nome}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 px-6">
                    <button 
                      onClick={() => { setEditingItem(d); setIsModalOpen(true); }} 
                      className="p-1.5 hover:bg-brand-accent/10 text-slate-500 hover:text-brand-accent transition-colors rounded-md"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(d.id)} 
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
               <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest italic-serif flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-500 shadow-sm shadow-yellow-500/50" />
                Datalink: Registry_Node
              </h3>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Descriptive Name</label>
                   <input name="nome" required defaultValue={editingItem?.nome} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent placeholder:text-slate-700 uppercase" placeholder="NAME_IDENTIFIER" />
                </div>
                
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Node State</label>
                   <select name="status" defaultValue={editingItem?.status || 'Ativo'} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent">
                     <option value="Ativo" className="bg-slate-900 uppercase">ACTIVE_OPERATIONAL</option>
                     <option value="Inativo" className="bg-slate-900 uppercase">INACTIVE_DISABLED</option>
                   </select>
                </div>
              </div>

               <div className="flex justify-end gap-3 pt-6 border-t border-brand-line">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-800 transition-all font-mono"
                >
                  ABORT_CMD
                </button>
                <button 
                  type="submit"
                  className="bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-accent/10 active:scale-95"
                >
                  SAVE_PARAMETERS
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

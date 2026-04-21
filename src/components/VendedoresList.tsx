import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Vendedor } from '../types';

interface Props {
  data: Vendedor[];
  setData: Dispatch<SetStateAction<Vendedor[]>>;
}

export default function VendedoresList({ data, setData }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Vendedor | null>(null);

  const filtered = data.filter(item => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: Vendedor = {
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      nome: formData.get('nome') as string,
      recebeComissao: formData.get('recebeComissao') === 'on',
      comissao: Number(formData.get('comissao')),
    };

    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? newItem : d));
    } else {
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este vendedor?')) {
      setData(data.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-black text-slate-100 uppercase tracking-tighter italic-serif">Operadores & Vendedores</h2>
           <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">Total de registros: {data.length}</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark px-6 py-2.5 rounded-lg flex items-center gap-2 font-black transition-all shadow-lg shadow-brand-accent/10 active:scale-95"
        >
          <Plus size={18} /> <span className="text-xs uppercase tracking-widest">Novo Operador</span>
        </button>
      </div>

      <div className="bg-brand-sidebar rounded-xl border border-brand-line shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-brand-line bg-slate-900/50 flex justify-between items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Filtrar por nome ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-brand-line rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-accent placeholder:text-slate-600"
            />
          </div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden sm:block">
            Sync Status: Online
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic-serif border-b border-brand-line">
                <th className="px-6 py-4">ID_SYS</th>
                <th className="px-6 py-4">Nome do Operador</th>
                <th className="px-6 py-4">Status Comis.</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono divide-y divide-brand-line/50">
              {filtered.map((vendedor) => (
                <tr key={vendedor.id} className="hover:bg-brand-accent/5 transition-colors group">
                  <td className="px-6 py-4 text-brand-accent/70">#{vendedor.id.slice(0, 4)}</td>
                  <td className="px-6 py-4 text-slate-300 font-bold">{vendedor.nome}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${vendedor.recebeComissao ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                      {vendedor.recebeComissao ? 'Habilitado' : 'Desabilitado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 px-6">
                      <button 
                        onClick={() => { setEditingItem(vendedor); setIsModalOpen(true); }}
                        className="p-1.5 hover:bg-brand-accent/10 text-slate-500 hover:text-brand-accent transition-colors rounded-md"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(vendedor.id)}
                        className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors rounded-md"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-600 font-mono text-xs uppercase tracking-widest italic">Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-sidebar border border-brand-line w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-brand-line bg-slate-900/50">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest italic-serif">
                {editingItem ? 'Editando Operador' : 'Novo Registro de Operador'}
              </h3>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Nome Completo</label>
                   <input 
                     name="nome" 
                     className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-sm font-mono text-slate-200 outline-none focus:border-emerald-500 transition-colors" 
                     defaultValue={editingItem?.nome} 
                     required 
                   />
                 </div>
                 <div className="flex gap-8 py-2">
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Comissão (%)</label>
                      <input 
                        name="comissao" 
                        type="number" 
                        step="0.01" 
                        className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-sm font-mono text-slate-200 outline-none focus:border-emerald-500 transition-colors" 
                        defaultValue={editingItem?.comissao || 0} 
                        required 
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <input 
                        type="checkbox" 
                        name="recebeComissao" 
                        id="recebeComissao"
                        className="w-5 h-5 rounded border-brand-line bg-slate-900 text-emerald-500 focus:ring-emerald-500 ring-offset-slate-900"
                        defaultChecked={editingItem?.recebeComissao} 
                      />
                      <label htmlFor="recebeComissao" className="text-xs font-bold text-slate-400 cursor-pointer uppercase tracking-widest">Habilitar Comissão</label>
                    </div>
                 </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-brand-line">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-800 transition-all"
                >
                  Descartar
                </button>
                <button 
                  type="submit"
                  className="bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                >
                  Salvar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

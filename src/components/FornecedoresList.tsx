import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { Plus, Search, Edit2, Trash2, Shield, Globe } from 'lucide-react';
import { Fornecedor } from '../types';
import { motion } from 'motion/react';

interface Props {
  data: Fornecedor[];
  setData: Dispatch<SetStateAction<Fornecedor[]>>;
}

export default function FornecedoresList({ data, setData }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Fornecedor | null>(null);

  const filtered = data.filter(item => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: Fornecedor = {
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      status: formData.get('status') as 'Ativo' | 'Inativo',
      nome: formData.get('nome') as string,
      telefone: formData.get('telefone') as string,
      endereco: {
        rua: formData.get('rua') as string,
        nr: formData.get('nr') as string,
        cep: formData.get('cep') as string,
        setor: formData.get('setor') as string,
        cidade: formData.get('cidade') as string,
        uf: formData.get('uf') as string,
      }
    };
    if (editingItem) setData(data.map(d => d.id === editingItem.id ? newItem : d));
    else setData([...data, newItem]);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('DESEJA EXCLUIR ESTE PONTO DE SUPRIMENTO?')) {
      setData(data.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-black text-slate-100 uppercase tracking-tighter italic-serif">Cadeia de Suprimentos</h2>
           <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">Parceiros Logísticos homologados: {data.length}</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark px-6 py-2.5 rounded-lg flex items-center gap-2 font-black transition-all shadow-lg shadow-brand-accent/10 active:scale-95"
        >
          <Plus size={18} /> <span className="text-xs uppercase tracking-widest">Novo Supply</span>
        </button>
      </div>

      <div className="bg-brand-sidebar rounded-xl border border-brand-line shadow-2xl overflow-hidden font-mono text-xs">
        <div className="p-4 border-b border-brand-line bg-slate-900/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar Vendor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-brand-line rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-accent placeholder:text-slate-600 text-slate-100"
            />
          </div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Globe size={12} />
            NODE_STATE: SYNCED
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic-serif border-b border-brand-line">
                <th className="px-6 py-4 w-24">UUID</th>
                <th className="px-6 py-4">VENDOR_NAME</th>
                <th className="px-6 py-4">COMM_LINE</th>
                <th className="px-6 py-4">LOCALIZATION</th>
                <th className="px-6 py-4 text-right">SEC_CMD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line/50">
              {filtered.map(f => (
                <tr key={f.id} className="hover:bg-brand-accent/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-600">{f.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 font-bold text-slate-200 uppercase tracking-tighter italic-serif">{f.nome}</td>
                  <td className="px-6 py-4 text-brand-accent">{f.telefone}</td>
                  <td className="px-6 py-4 text-slate-500 italic lowercase">{f.endereco.cidade || 'NOT_SET'} / {f.endereco.uf || '--'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingItem(f); setIsModalOpen(true); }} 
                        className="p-1.5 hover:bg-brand-accent/10 text-slate-500 hover:text-brand-accent transition-colors rounded-md"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(f.id)} 
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-sidebar border border-brand-line w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-brand-line bg-slate-900/50 flex justify-between items-center">
               <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest italic-serif flex items-center gap-2">
                <Shield size={16} className="text-brand-accent" />
                Datalink: Fornecedor
              </h3>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Social Entity Name</label>
                   <input name="nome" required defaultValue={editingItem?.nome} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent placeholder:text-slate-700 uppercase" placeholder="NAME_IDENTIFIER" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Protocol Status</label>
                    <select name="status" defaultValue={editingItem?.status || 'Ativo'} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent">
                      <option value="Ativo" className="bg-slate-900 uppercase">ACTIVE_LINK</option>
                      <option value="Inativo" className="bg-slate-900 uppercase">OFFLINE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Direct Line</label>
                    <input name="telefone" defaultValue={editingItem?.telefone} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent" placeholder="(00) 00000-0000" />
                  </div>
                </div>
              </div>

               <div className="flex justify-end gap-3 pt-6 border-t border-brand-line">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-800 transition-all font-mono"
                >
                  ABORT_LINK
                </button>
                <button 
                  type="submit"
                  className="bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-accent/10 active:scale-95"
                >
                  SAVE_PROTOCOL
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

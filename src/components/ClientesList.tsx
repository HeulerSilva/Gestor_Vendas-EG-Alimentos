import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Phone, Database, UserCheck, ShieldAlert } from 'lucide-react';
import { Cliente } from '../types';
import { motion } from 'motion/react';

interface Props {
  data: Cliente[];
  setData: Dispatch<SetStateAction<Cliente[]>>;
}

export default function ClientesList({ data, setData }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Cliente | null>(null);

  const filtered = data.filter(item => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.telefone.includes(searchTerm)
  );

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: Cliente = {
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
        referencia: formData.get('referencia') as string,
      }
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
    if (confirm('REMOVER REGISTRO DE ENTIDADE?')) {
      setData(data.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-black text-slate-100 uppercase tracking-tighter italic-serif">Base de Entidades / Clientes</h2>
           <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">Registros ativos: {data.filter(c => c.status === 'Ativo').length}</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark px-6 py-2.5 rounded-lg flex items-center gap-2 font-black transition-all shadow-lg shadow-brand-accent/10 active:scale-95"
        >
          <Plus size={18} /> <span className="text-xs uppercase tracking-widest">Nova Entidade</span>
        </button>
      </div>

      <div className="bg-brand-sidebar rounded-xl border border-brand-line shadow-2xl overflow-hidden text-sm">
        <div className="p-4 border-b border-brand-line bg-slate-900/50 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="QUERY_FILTER: Name, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-brand-line rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-accent placeholder:text-slate-600 uppercase"
            />
          </div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] hidden sm:block">LOCAL_BUFFER: ACTIVE</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic-serif border-b border-brand-line">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Entity_Name</th>
                <th className="px-6 py-4">Datalink</th>
                <th className="px-6 py-4">Geo_Ref</th>
                <th className="px-6 py-4 text-right">Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line/50 italic-serif">
              {filtered.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-brand-accent/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${cliente.status === 'Ativo' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                      {cliente.status === 'Ativo' ? 'ONLINE' : 'HALTED'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-200 uppercase tracking-widest">{cliente.nome}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs flex items-center gap-2">
                    <Phone size={12} className="text-brand-accent/50" />
                    {cliente.telefone}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} />
                      {cliente.endereco.cidade} / {cliente.endereco.uf}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingItem(cliente); setIsModalOpen(true); }}
                        className="p-1.5 hover:bg-brand-accent/10 text-slate-600 hover:text-brand-accent transition-colors rounded-md"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cliente.id)}
                        className="p-1.5 hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors rounded-md"
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
            className="bg-brand-sidebar border border-brand-line w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl flex flex-col h-[90vh]"
          >
            <div className="p-6 border-b border-brand-line bg-slate-900/50 flex justify-between items-center">
               <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest italic-serif flex items-center gap-2">
                <UserCheck size={18} className="text-brand-accent" />
                Registry_Node: Entity_Parameters
              </h3>
               <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Protocol: 0x{editingItem?.id.slice(0,4) || 'NEW'}</div>
            </div>

            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">State_Protocol</label>
                    <select 
                      name="status" 
                      defaultValue={editingItem?.status || 'Ativo'}
                      className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent"
                    >
                      <option value="Ativo" className="bg-slate-900">ACTIVE_OPERATIONAL</option>
                      <option value="Inativo" className="bg-slate-900">INACTIVE_HALTED</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Datalink (PHONE)</label>
                    <input 
                      name="telefone" 
                      defaultValue={editingItem?.telefone}
                      className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent"
                      placeholder="DIAL_CODE"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entity_Alias (NAME)</label>
                  <input 
                    name="nome" 
                    required 
                    defaultValue={editingItem?.nome}
                    className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent uppercase"
                    placeholder="FULL_IDENTIFIER"
                  />
                </div>

                <div className="space-y-6 pt-4 border-t border-brand-line/50">
                  <span className="text-[10px] font-black text-brand-accent/50 uppercase tracking-[0.3em]">Geo_Spatial_Data</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Address_String</label>
                      <input name="rua" defaultValue={editingItem?.endereco.rua} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unit_Identifier</label>
                      <input name="nr" defaultValue={editingItem?.endereco.nr} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ZIP_Code</label>
                      <input name="cep" defaultValue={editingItem?.endereco.cep} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sector_Zone</label>
                      <input name="setor" defaultValue={editingItem?.endereco.setor} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Locality: City</label>
                      <input name="cidade" defaultValue={editingItem?.endereco.cidade} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Jurisdiction: UF</label>
                      <input name="uf" defaultValue={editingItem?.endereco.uf} maxLength={2} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent uppercase" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reference_Node</label>
                    <input name="referencia" defaultValue={editingItem?.endereco.referencia} className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-3 text-xs font-mono text-slate-100 outline-none focus:border-brand-accent" />
                  </div>
                </div>
              </div>

               <div className="p-6 border-t border-brand-line bg-slate-900/50 flex justify-end gap-4">
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
                  COMMIT_DATA
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

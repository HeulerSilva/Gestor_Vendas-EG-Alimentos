import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  Info, 
  Tag, 
  Layers, 
  Box, 
  DollarSign, 
  Receipt 
} from 'lucide-react';
import { Produto, Fornecedor } from '../types';

interface Props {
  data: Produto[];
  setData: Dispatch<SetStateAction<Produto[]>>;
  suppliers: Fornecedor[];
}

export default function ProdutosList({ data, setData, suppliers }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Produto | null>(null);

  const filtered = data.filter(item => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo.includes(searchTerm)
  );

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const custo = Number(formData.get('precoCusto'));
    const margem = Number(formData.get('margemLucro'));
    const venda = custo + (custo * (margem / 100));

    const newItem: Produto = {
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      status: formData.get('status') as 'Ativo' | 'Inativo',
      codigo: formData.get('codigo') as string,
      nome: formData.get('nome') as string,
      qtdEstoque: editingItem?.qtdEstoque || 0,
      und: formData.get('und') as string,
      precoCusto: custo,
      margemLucro: margem,
      precoVenda: venda,
      categoria: formData.get('categoria') as string,
      subcategoria: formData.get('subcategoria') as string,
      fabricante: formData.get('fabricante') as string,
      fornecedorId: formData.get('fornecedorId') as string,
      pesoPadrao: Number(formData.get('pesoPadrao')),
      estoqueLocalizacao: formData.get('estoqueLocalizacao') as 'INTERNO-FIXO' | 'MÓVEL',
      estoqueMinimo: Number(formData.get('estoqueMinimo')),
      estoqueMaximo: Number(formData.get('estoqueMaximo')),
      ncm: formData.get('ncm') as string,
      cts: formData.get('cts') as string,
      cfop: formData.get('cfop') as string,
      icms: Number(formData.get('icms')),
      ipi: Number(formData.get('ipi')),
      codigoBarras: formData.get('codigoBarras') as string,
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
    if (confirm('Deseja realmente excluir este produto?')) {
      setData(data.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-black text-slate-100 uppercase tracking-tighter italic-serif">Catálogo de Mercadorias</h2>
           <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">Produtos registrados: {data.length}</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-dark px-6 py-2.5 rounded-lg flex items-center gap-2 font-black transition-all shadow-lg shadow-brand-accent/10 active:scale-95"
        >
          <Plus size={18} /> <span className="text-xs uppercase tracking-widest">Novo Item</span>
        </button>
      </div>

      <div className="bg-brand-sidebar rounded-xl border border-brand-line shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-brand-line bg-slate-900/50 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nome, código ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-brand-line rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-accent placeholder:text-slate-600"
            />
          </div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] hidden sm:block">STATUS: ONLINE / READ_SYNC</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic-serif border-b border-brand-line">
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Designação</th>
                <th className="px-6 py-4 text-right">Estoque</th>
                <th className="px-6 py-4 text-right">Preço Venda</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono divide-y divide-brand-line/50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-brand-accent/5 transition-colors group">
                  <td className="px-6 py-4 text-slate-500 text-xs">#{product.codigo}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-200 font-bold">{product.nome}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">{product.categoria}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-black tracking-tighter ${product.qtdEstoque <= product.estoqueMinimo ? 'text-red-500' : 'text-brand-accent'}`}>
                      {product.qtdEstoque.toString().padStart(2, '0')} {product.und}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-100 font-black">
                    R$ {product.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 px-6">
                      <button 
                        onClick={() => { setEditingItem(product); setIsModalOpen(true); }}
                        className="p-1.5 hover:bg-brand-accent/10 text-slate-500 hover:text-brand-accent transition-colors rounded-md"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-sidebar border border-brand-line w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-brand-line bg-slate-900/50 flex justify-between items-center">
               <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest italic-serif">
                <Package className="inline-block mr-2 text-brand-accent" size={18} />
                {editingItem ? 'Configuração Técnica do Item' : 'Novo Registro de Mercadoria'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-100"><Trash2 size={18} /></button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8 bg-brand-sidebar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* General Info */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-brand-accent/50 uppercase tracking-[0.2em] border-l-2 border-brand-accent/30 pl-3">Identificação e Status</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Estado Operacional</label>
                      <select name="status" className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-2.5 text-xs font-mono text-slate-200 outline-none focus:border-brand-accent" defaultValue={editingItem?.status}>
                        <option value="Ativo" className="bg-slate-900">Ativo</option>
                        <option value="Inativo" className="bg-slate-900">Inativo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Código SYS / EAN</label>
                      <input name="codigo" className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-2.5 text-xs font-mono text-slate-200 outline-none focus:border-brand-accent" defaultValue={editingItem?.codigo} required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Designação Mercadoria</label>
                      <input name="nome" className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-2.5 text-xs font-mono text-slate-200 outline-none focus:border-brand-accent" defaultValue={editingItem?.nome} required />
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-brand-accent/50 uppercase tracking-[0.2em] border-l-2 border-brand-accent/30 pl-3">Parametros de Margem</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Preço de Custo (Base)</label>
                      <input type="number" step="0.01" name="precoCusto" className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-2.5 text-xs font-mono text-slate-200 outline-none focus:border-brand-accent" defaultValue={editingItem?.precoCusto} required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Margem Proposta (%)</label>
                      <input type="number" step="0.01" name="margemLucro" className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-2.5 text-xs font-mono text-slate-200 outline-none focus:border-brand-accent" defaultValue={editingItem?.margemLucro} required />
                    </div>
                    <div className="p-4 bg-slate-900 border border-brand-line rounded-xl">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Venda Sugerida</p>
                      <p className="text-2xl font-black text-brand-accent font-mono tracking-tighter">
                        R$ {editingItem?.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logistic Info */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-brand-accent/50 uppercase tracking-[0.2em] border-l-2 border-brand-accent/30 pl-3">Capacidade Logística</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Qtd em Mãos</label>
                        <input type="number" name="qtdEstoque" className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-2.5 text-xs font-mono text-slate-200 outline-none focus:border-brand-accent" defaultValue={editingItem?.qtdEstoque || 0} required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Alerta de Mín.</label>
                        <input type="number" name="estoqueMinimo" className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-2.5 text-xs font-mono text-slate-200 outline-none focus:border-brand-accent" defaultValue={editingItem?.estoqueMinimo || 5} required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Endereço de Armazenagem</label>
                      <input name="estoqueLocalizacao" className="w-full bg-slate-900 border border-brand-line rounded-lg px-4 py-2.5 text-xs font-mono text-slate-200 outline-none focus:border-brand-accent" defaultValue={editingItem?.estoqueLocalizacao} />
                    </div>
                  </div>
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

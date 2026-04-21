import { useState, useMemo } from 'react';
import { 
  Users, 
  UserCircle, 
  Package, 
  MapPin, 
  CreditCard, 
  Truck, 
  DollarSign, 
  ShoppingCart, 
  Receipt, 
  LayoutDashboard, 
  FileText,
  Menu,
  X,
  Plus,
  Search,
  ChevronRight,
  TrendingUp,
  Box,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Vendedor, 
  Cliente, 
  Produto, 
  TipoPagamento, 
  Fornecedor, 
  Despesa, 
  Venda, 
  Pedido,
  MovimentacaoCaixa
} from './types';

// Components for different views
import Dashboard from './components/Dashboard';
import VendedoresList from './components/VendedoresList';
import ClientesList from './components/ClientesList';
import ProdutosList from './components/ProdutosList';
import FornecedoresList from './components/FornecedoresList';
import TiposPagamentoList from './components/TiposPagamentoList';
import DespesasList from './components/DespesasList';
import PedidosList from './components/PedidosList';
import PDV from './components/PDV';
import CaixaView from './components/CaixaView';
import RelatoriosView from './components/RelatoriosView';

type View = 
  | 'dashboard' 
  | 'vendedores' 
  | 'clientes' 
  | 'produtos' 
  | 'fornecedores' 
  | 'pagamentos' 
  | 'despesas' 
  | 'pedidos' 
  | 'vendas' 
  | 'caixa' 
  | 'relatorios';

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Global State (Mocked)
  const [vendedores, setVendedores] = useState<Vendedor[]>([
    { id: '1', nome: 'Admin', recebeComissao: true, comissao: 5 }
  ]);
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: '1', status: 'Ativo', nome: 'Consumidor Final', telefone: '', endereco: { rua: '', nr: '', cep: '', setor: '', cidade: '', uf: '' } }
  ]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [tiposPagamento, setTiposPagamento] = useState<TipoPagamento[]>([
    { id: '1', tipoPgto: 'Dinheiro', produtivo: true },
    { id: '2', tipoPgto: 'Cartão de Crédito', produtivo: true },
    { id: '3', tipoPgto: 'PIX', produtivo: true }
  ]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [caixa, setCaixa] = useState<MovimentacaoCaixa[]>([]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { section: 'Cadastros' },
    { id: 'vendedores', label: 'Vendedores', icon: Users },
    { id: 'clientes', label: 'Clientes', icon: UserCircle },
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'fornecedores', label: 'Fornecedores', icon: Truck },
    { id: 'pagamentos', label: 'Tipos Pagamento', icon: CreditCard },
    { id: 'despesas', label: 'Despesas', icon: DollarSign },
    { section: 'Movimentações' },
    { id: 'pedidos', label: 'Pedidos Compras', icon: Receipt },
    { id: 'vendas', label: 'Vendas (PDV)', icon: ShoppingCart },
    { id: 'caixa', label: 'Caixa / Despesas', icon: Box },
    { section: 'Sistema' },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard vendors={vendedores} clients={clientes} products={produtos} sales={vendas} />;
      case 'vendedores': return <VendedoresList data={vendedores} setData={setVendedores} />;
      case 'clientes': return <ClientesList data={clientes} setData={setClientes} />;
      case 'produtos': return <ProdutosList data={produtos} setData={setProdutos} suppliers={fornecedores} />;
      case 'fornecedores': return <FornecedoresList data={fornecedores} setData={setFornecedores} />;
      case 'pagamentos': return <TiposPagamentoList data={tiposPagamento} setData={setTiposPagamento} />;
      case 'despesas': return <DespesasList data={despesas} setData={setDespesas} />;
      case 'pedidos': return <PedidosList data={pedidos} setData={setPedidos} suppliers={fornecedores} products={produtos} setProducts={setProdutos} />;
      case 'vendas': return <PDV vendors={vendedores} clients={clientes} products={produtos} payments={tiposPagamento} sales={vendas} setSales={setVendas} setProducts={setProdutos} />;
      case 'caixa': return <CaixaView expenses={despesas} movements={caixa} setMovements={setCaixa} sales={vendas} payments={tiposPagamento} />;
      case 'relatorios': return <RelatoriosView sales={vendas} vendors={vendedores} clients={clientes} payments={tiposPagamento} />;
      default: return <Dashboard vendors={vendedores} clients={clientes} products={produtos} sales={vendas} />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg text-slate-100 font-sans selection:bg-brand-accent/30 italic-serif">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-brand-sidebar border-r border-brand-line flex flex-col h-full z-20"
      >
        <div className="p-6 flex items-center gap-3 border-b border-brand-line">
          <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center text-brand-accent-dark font-black text-xl shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            EG
          </div>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg tracking-tighter text-brand-accent leading-tight"
            >
              GESTOR<br/>
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono">Vendas 2026</span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item, idx) => {
            if ('section' in item) {
              return isSidebarOpen ? (
                <div key={idx} className="px-4 py-3 mt-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.15em]">
                  {item.section}
                </div>
              ) : (
                <div key={idx} className="h-px bg-brand-line my-4 mx-2" />
              );
            }

            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-brand-accent/10 text-brand-accent font-medium border-l-2 border-brand-accent rounded-l-none' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-brand-accent' : 'text-slate-500 group-hover:text-slate-300'} />
                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 bg-slate-950/50 border-t border-brand-line">
          {isSidebarOpen && (
            <div className="mb-4 space-y-1 font-mono text-[10px] text-slate-600">
              <p>INSTANCE: SQLEXPRESS</p>
              <p className="truncate">DB: Note-Dell\SQLEXPRESS</p>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 text-slate-500 transition-colors"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-brand-bg/50 backdrop-blur-md border-b border-brand-line flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-3">
             <div className="text-xs font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-400">
               SYS_MONITOR: ACTIVE
             </div>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">{activeView}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data / Hora</p>
              <p className="text-sm font-mono text-slate-300">{new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
            <div className="h-8 w-px bg-brand-line" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-brand-accent">João Silva</p>
                <p className="text-[10px] text-slate-500 uppercase font-mono">ID: 05_OPERATOR</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-brand-accent/30 bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold">
                JS
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full relative z-10"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

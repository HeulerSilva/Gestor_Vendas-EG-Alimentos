/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vendedor {
  id: string;
  nome: string;
  recebeComissao: boolean;
  comissao: number;
}

export interface Endereco {
  rua: string;
  nr: string;
  cep: string;
  setor: string;
  cidade: string;
  uf: string;
  referencia?: string;
}

export interface Cliente {
  id: string;
  status: 'Ativo' | 'Inativo';
  nome: string;
  endereco: Endereco;
  telefone: string;
}

export interface Produto {
  id: string;
  status: 'Ativo' | 'Inativo';
  codigo: string;
  nome: string;
  qtdEstoque: number;
  und: string;
  precoCusto: number;
  margemLucro: number;
  precoVenda: number;
  categoria: string;
  subcategoria: string;
  fabricante: string;
  fornecedorId: string;
  pesoPadrao: number;
  estoqueLocalizacao: 'INTERNO-FIXO' | 'MÓVEL';
  estoqueMinimo: number;
  estoqueMaximo: number;
  ncm: string;
  cts: string;
  cfop: string;
  icms: number;
  ipi: number;
  codigoBarras: string;
}

export interface TipoPagamento {
  id: string;
  tipoPgto: string;
  produtivo: boolean;
}

export interface Fornecedor {
  id: string;
  status: 'Ativo' | 'Inativo';
  nome: string;
  endereco: Endereco;
  telefone: string;
}

export interface Despesa {
  id: string;
  nome: string;
  status: 'Ativo' | 'Inativo';
}

export interface Pedido {
  id: string;
  dataPedido: string;
  nrNota: string;
  fornecedorId: string;
  itens: PedidoItem[];
  totalPedido: number;
}

export interface PedidoItem {
  idProduto: string;
  itemAtendido: boolean;
  precoCusto: number;
  quantidade: number;
}

export interface Venda {
  id: number; // Sequence starting at 70000
  dataHora: string;
  vendedorId: string;
  clienteId: string;
  tipoPgtoId: string;
  itens: VendaItem[];
  totalVenda: number;
}

export interface VendaItem {
  idProduto: string;
  quantidade: number;
  precoVenda: number;
  descontoReais: number;
  descontoPercentual: number;
  totalProduto: number;
}

export interface MovimentacaoCaixa {
  id: string;
  data: string;
  despesaId?: string;
  valorDespesa?: number;
  fecharCaixa: boolean;
}

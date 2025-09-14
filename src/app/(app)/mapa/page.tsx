// src/app/(app)/mapa/page.tsx
'use client'

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PaginaMapa() {
  const supabase = createClient();

  // Estados para a busca e para o formulário
  const [protocoloBusca, setProtocoloBusca] = useState('');
  const [fatura, setFatura] = useState<any | null>(null);
  const [mapaValor, setMapaValor] = useState<number | string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Função para buscar a fatura pelo número do protocolo
  const handleBuscarFatura = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFatura(null);
    setMessage('');

    const { data, error } = await supabase
      .from('faturas')
      .select('*, fornecedores(razao_social)') // Pega tudo da fatura e o nome do fornecedor
      .eq('protocolo_seq', protocoloBusca)
      .single();

    if (error || !data) {
      setMessage('Erro: Fatura não encontrada.');
    } else {
      setFatura(data);
      setMapaValor(data.mapa || ''); // Preenche o campo mapa com o valor existente ou vazio
    }
    setLoading(false);
  };

  // Função para salvar a alteração no campo mapa
  const handleSalvarMapa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fatura) return;

    setLoading(true);
    const { error } = await supabase
      .from('faturas')
      .update({ mapa: mapaValor === '' ? null : Number(mapaValor) }) // Salva como número ou null se estiver vazio
      .eq('protocolo_seq', fatura.protocolo_seq);

    if (error) {
      setMessage(`Erro ao salvar: ${error.message}`);
    } else {
      setMessage('Campo "Mapa" salvo com sucesso!');
      // Atualiza o estado local da fatura para refletir a mudança
      setFatura({ ...fatura, mapa: mapaValor });
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Atualizar Mapa da Fatura</h1>

      {/* Formulário de Busca */}
      <div className="bg-white p-6 shadow-md rounded-lg border mb-8">
        <form onSubmit={handleBuscarFatura}>
          <label htmlFor="protocolo" className="block text-sm font-medium text-gray-700 mb-2">
            Digite o Número do Protocolo (PDR)
          </label>
          <div className="flex space-x-2">
            <input
              id="protocolo"
              type="number"
              value={protocoloBusca}
              onChange={(e) => setProtocoloBusca(e.target.value)}
              placeholder="Ex: 11232"
              className="p-2 border rounded w-full shadow-sm"
              required
            />
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>
      </div>

      {/* Exibe mensagem de erro ou sucesso */}
      {message && <p className={`mb-4 text-center p-2 rounded ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</p>}

      {/* Formulário de Edição (só aparece se uma fatura for encontrada) */}
      {fatura && (
        <div className="bg-white p-6 shadow-md rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Detalhes da Fatura</h2>
          <form onSubmit={handleSalvarMapa} className="space-y-4">
            {/* Campos desabilitados - apenas para visualização */}
            <div>
              <label className="block text-sm font-medium text-gray-500">Fornecedor (OCS)</label>
              <input type="text" value={fatura.fornecedores?.razao_social || 'N/A'} readOnly className="mt-1 p-2 border rounded w-full bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Valor da Fatura (R$)</label>
              <input type="text" value={fatura.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} readOnly className="mt-1 p-2 border rounded w-full bg-gray-100 cursor-not-allowed" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-500">Data de Saída</label>
              <input type="text" value={fatura.data_saida ? new Date(fatura.data_saida + 'T12:00:00').toLocaleDateString('pt-BR') : 'FATURA EM ABERTO'} readOnly className="mt-1 p-2 border rounded w-full bg-gray-100 cursor-not-allowed" />
            </div>

            <hr className="my-4"/>
            
            {/* Campo "Mapa" - O único editável */}
            <div>
              <label htmlFor="mapa" className="block text-sm font-medium text-gray-700">Número do Mapa</label>
              <input
                id="mapa"
                type="number"
                value={mapaValor}
                onChange={(e) => setMapaValor(e.target.value)}
                className="mt-1 p-2 border rounded w-full shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                // REGRA DE NEGÓCIO: Só pode editar se houver data de saída
                disabled={!fatura.data_saida}
              />
              {!fatura.data_saida && (
                <p className="text-xs text-red-600 mt-1">Este campo só pode ser editado após a fatura ter uma data de saída.</p>
              )}
            </div>
            
            <div className="text-right">
              <button type="submit" disabled={!fatura.data_saida || loading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
                {loading ? 'Salvando...' : 'Salvar Mapa'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// 1. ATUALIZAÇÃO: O tipo agora inclui o ID
type Ocs = {
  id: number;
  razao_social: string;
};

export default function PaginaConsultas() {
  const supabase = createClient();

  const [ocsList, setOcsList] = useState<Ocs[]>([]);
  const [loadingOcs, setLoadingOcs] = useState(true);

  // Estados dos formulários (agora guardarão IDs)
  const [ocsId, setOcsId] = useState('');
  const [dataSaida, setDataSaida] = useState('');
  const [mapa, setMapa] = useState('');
  const [ocsAbertoId, setOcsAbertoId] = useState('');
  const [ocsFechadoId, setOcsFechadoId] = useState('');

  useEffect(() => {
    const fetchOcs = async () => {
      setLoadingOcs(true);
      // 2. ATUALIZAÇÃO: Buscamos ID e razao_social
      const { data, error } = await supabase
        .from('fornecedores')
        .select('id, razao_social')
        .order('razao_social', { ascending: true });

      if (error) console.error("Erro ao buscar Fornecedores (OCS):", error);
      else if (data) setOcsList(data);
      setLoadingOcs(false);
    };
    fetchOcs();
  }, [supabase]);

  const handleGerarRelatorio = (params: Record<string, string>) => {
    const queryParams = new URLSearchParams(params);
    window.open(`/consultas/relatorio?${queryParams.toString()}`, '_blank');
  };

  return (
    // =================================================================
    // CORREÇÃO APLICADA AQUI: Adicionada a classe "text-gray-800"
    // =================================================================
    <div className="p-8 max-w-7xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">Painel de Consultas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Caixa 1 e 2 (sem alteração) */}
        <div className="bg-white p-4 shadow-md rounded-lg border flex flex-col">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Faturas em Aberto</h2>
          <p className="text-sm text-gray-600 mb-3 flex-grow">Relatório com faturas sem data de saída.</p>
          <button onClick={() => handleGerarRelatorio({ tipo: 'em_aberto' })} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-sm">Gerar Relatório</button>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg border flex flex-col">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Faturas Fechadas</h2>
          <p className="text-sm text-gray-600 mb-3 flex-grow">Relatório com faturas que já tiveram saída.</p>
          <button onClick={() => handleGerarRelatorio({ tipo: 'fechadas' })} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded text-sm">Gerar Relatório</button>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg border">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Por Número do Mapa</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleGerarRelatorio({ tipo: 'mapa', numero: mapa }); }}>
            <input type="number" id="mapa" value={mapa} onChange={(e) => setMapa(e.target.value)} className="p-2 border rounded w-full mb-3" required placeholder="Digite o nº do mapa"/>
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-3 rounded w-full text-sm">Gerar Relatório</button>
          </form>
        </div>
        
        {/* Caixa OCS Abertas */}
        <div className="bg-white p-4 shadow-md rounded-lg border">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">OCS com Faturas Abertas</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleGerarRelatorio({ tipo: 'ocs_em_aberto', ocs_id: ocsAbertoId }); }}>
              <select id="ocs_aberto" value={ocsAbertoId} onChange={(e) => setOcsAbertoId(e.target.value)} className="p-2 border rounded w-full mb-3" required disabled={loadingOcs}>
                <option value="" disabled>{loadingOcs ? 'Carregando...' : 'Selecione uma OCS'}</option>
                {/* 3. ATUALIZAÇÃO: O 'value' agora é o ID */}
                {ocsList.map((item) => (<option key={item.id} value={item.id}>{item.razao_social}</option>))}
              </select>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded w-full text-sm">Gerar Relatório</button>
          </form>
        </div>

        {/* Caixa OCS Fechadas */}
        <div className="bg-white p-4 shadow-md rounded-lg border">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">OCS com Faturas Fechadas</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleGerarRelatorio({ tipo: 'ocs_fechadas', ocs_id: ocsFechadoId }); }}>
              <select id="ocs_fechado" value={ocsFechadoId} onChange={(e) => setOcsFechadoId(e.target.value)} className="p-2 border rounded w-full mb-3" required disabled={loadingOcs}>
                <option value="" disabled>{loadingOcs ? 'Carregando...' : 'Selecione uma OCS'}</option>
                {/* 3. ATUALIZAÇÃO: O 'value' agora é o ID */}
                {ocsList.map((item) => (<option key={item.id} value={item.id}>{item.razao_social}</option>))}
              </select>
            <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-3 rounded w-full text-sm">Gerar Relatório</button>
          </form>
        </div>

        {/* Caixa OCS e Data */}
        <div className="bg-white p-4 shadow-md rounded-lg border">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">OCS por Data de Saída</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleGerarRelatorio({ tipo: 'combinada', ocs_id: ocsId, data: dataSaida }); }} className="space-y-3">
              <select id="ocs" value={ocsId} onChange={(e) => setOcsId(e.target.value)} className="p-2 border rounded w-full" required disabled={loadingOcs}>
                <option value="" disabled>{loadingOcs ? 'Carregando...' : 'Selecione uma OCS'}</option>
                   {/* 3. ATUALIZAÇÃO: O 'value' agora é o ID */}
                {ocsList.map((item) => (<option key={item.id} value={item.id}>{item.razao_social}</option>))}
              </select>
              <input type="date" id="data_saida" value={dataSaida} onChange={(e) => setDataSaida(e.target.value)} className="p-2 border rounded w-full" required />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded w-full text-sm">Gerar Relatório</button>
          </form>
        </div>
      </div>
    </div>
  );
}
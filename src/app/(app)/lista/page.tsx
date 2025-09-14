'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

// Define o tipo de dados para uma fatura
type Fatura = {
  id: string;
  numero_fatura: string;
  valor: number;
  protocolo_seq: number;
  fornecedores: {
    razao_social: string;
  } | null; // Fornecedores pode ser nulo se a junção falhar
};

export default function ListaFaturasPage() {
  const supabase = createClient();
  
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para buscar os dados quando a página carregar
  useEffect(() => {
    const fetchFaturas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('faturas')
        .select('id, numero_fatura, valor, protocolo_seq, fornecedores(razao_social)')
        .order('created_at', { ascending: false });

      if (error) {
        setError('Erro ao buscar faturas.');
        console.error(error);
      } else {
        setFaturas(data as Fatura[]);
      }
      setLoading(false);
    };

    fetchFaturas();
  }, [supabase]);

  // Filtra as faturas com base no termo de busca (número do protocolo)
  const filteredFaturas = faturas.filter(fatura =>
    String(fatura.protocolo_seq).includes(searchTerm)
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Lista de Todas as Faturas</h1>
      
      {/* Campo de Busca */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por Nº do Protocolo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
      </div>

      {/* Exibição dos dados */}
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {loading && <li className="p-4 text-center">A carregar...</li>}
          {error && <li className="p-4 text-center text-red-500">{error}</li>}
          {!loading && filteredFaturas.map((fatura) => (
            <li key={fatura.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50">
              {/* Informações da Fatura */}
              <div>
                <p className="font-bold text-blue-600">PDR nº {fatura.protocolo_seq}</p>
                <p className="font-semibold text-gray-900 mt-1">{fatura.fornecedores?.razao_social || 'OCS não encontrado'}</p>
                <p className="text-sm text-gray-600">Nº Fatura: {fatura.numero_fatura}</p>
                <p className="text-sm text-gray-800 font-medium mt-1">
                  R$ {fatura.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* ========== INÍCIO DA MODIFICAÇÃO ========== */}
              {/* Container dos Botões de Ação com a ordem invertida */}
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                {/* BOTÃO DE IMPRIMIR AGORA VEM PRIMEIRO */}
                <button 
                  onClick={() => window.open(`/imprimir/relatorio/${fatura.protocolo_seq}`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm whitespace-nowrap"
                >
                  Imprimir Relatório
                </button>
                
                <Link 
                  href={`/faturas/saida/protocolo/${fatura.protocolo_seq}`} 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm whitespace-nowrap"
                >
                  Processar Saída
                </Link>
              </div>
              {/* ========== FIM DA MODIFICAÇÃO ========== */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
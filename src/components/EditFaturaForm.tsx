'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Fatura, Fornecedor } from '@/app/actions/faturas';

const piOptions = [
  { id: 1, name: 'Fusex' },
  { id: 2, name: 'Pass' },
  { id: 3, name: 'Fator Custo' },
  { id: 4, name: 'Ex Combatente' },
  { id: 5, name: 'Periódico' },
];

export default function EditFaturaForm({ fatura, fornecedores }: { fatura: Fatura, fornecedores: Fornecedor[] }) {
  const router = useRouter();
  const supabase = createClient();
  
  // Inicializa os estados com os dados da fatura recebidos
  const [fornecedorId, setFornecedorId] = useState(fatura.fornecedor_id);
  const [numeroFatura, setNumeroFatura] = useState(fatura.numero_fatura);
  const [dataProtocolo, setDataProtocolo] = useState(fatura.data_protocolo?.split('T')[0] || ''); // Formata a data
  const [valor, setValor] = useState(String(fatura.valor));
  const [piCod, setPiCod] = useState(String(fatura.pi_cod || ''));
  const [observacoes, setObservacoes] = useState(fatura.observacoes || '');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Lógica de UPDATE no Supabase
    const { error: updateError } = await supabase
      .from('faturas')
      .update({ 
        fornecedor_id: fornecedorId,
        numero_fatura: numeroFatura,
        data_protocolo: dataProtocolo,
        valor: parseFloat(valor),
        pi_cod: piCod ? Number(piCod) : null,
        observacoes: observacoes,
      })
      .eq('id', fatura.id); // A condição para atualizar a fatura correta
      
    setIsLoading(false);

    if (updateError) {
      setError(`Erro ao atualizar a fatura: ${updateError.message}`);
    } else {
      alert('Fatura atualizada com sucesso!');
      router.push('/lista'); // Redireciona para a lista após o sucesso
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 mb-8 bg-white shadow-md rounded-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Editar Fatura</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <select value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)} required className="p-2 border rounded">
          <option value="" disabled>Selecione um OCS</option>
          {fornecedores.map((fornecedor) => (
            <option key={fornecedor.id} value={fornecedor.id}>
              {fornecedor.razao_social}
            </option>
          ))}
        </select>
        
        <input type="text" placeholder="Número da Fatura" value={numeroFatura} onChange={(e) => setNumeroFatura(e.target.value)} required className="p-2 border rounded" />
        <input type="date" value={dataProtocolo} onChange={(e) => setDataProtocolo(e.target.value)} required className="p-2 border rounded" />
        <input type="number" step="0.01" placeholder="Valor da Fatura" value={valor} onChange={(e) => setValor(e.target.value)} required className="p-2 border rounded" />
        
        <textarea placeholder="Observações" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="p-2 border rounded md:col-span-2" rows={3} />

        <div className="md:col-span-2">
          <label className="block font-medium mb-2">PI:</label>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {piOptions.map((option) => (
              <label key={option.id} className="flex items-center space-x-2">
                <input type="radio" name="pi" checked={piCod === String(option.id)} value={option.id} onChange={(e) => setPiCod(e.target.value)} />
                <span>{option.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button type="submit" disabled={isLoading} className="md:col-span-2 p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
          {isLoading ? 'Atualizando...' : 'Atualizar Fatura'}
        </button>
        {error && <p className="text-red-500 md:col-span-2">{error}</p>}
      </div>
    </form>
  );
}
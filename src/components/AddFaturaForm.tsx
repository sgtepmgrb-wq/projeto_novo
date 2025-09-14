// src/components/AddFaturaForm.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Fornecedor = {
  id: string;
  razao_social: string;
};

const piOptions = [
  { id: 1, name: 'Fusex' },
  { id: 2, name: 'Pass' },
  { id: 3, name: 'Fator Custo' },
  { id: 4, name: 'Ex Combatente' },
  { id: 5, name: 'Periódico' },
];

export default function AddFaturaForm({ fornecedores }: { fornecedores: Fornecedor[] }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [fornecedorId, setFornecedorId] = useState('');
  const [numeroFatura, setNumeroFatura] = useState('');
  const [dataProtocolo, setDataProtocolo] = useState('');
  const [valor, setValor] = useState('');
  const [piCod, setPiCod] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Você precisa estar logado para salvar uma fatura.');
      setIsLoading(false);
      return;
    }

    if (!fornecedorId) {
      setError('Por favor, selecione um OCS.');
      setIsLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('faturas')
      .insert([
        { 
          fornecedor_id: fornecedorId,
          numero_fatura: numeroFatura,
          data_protocolo: dataProtocolo,
          data_emissao: new Date().toISOString(),
          valor: parseFloat(valor),
          pi_cod: piCod ? Number(piCod) : null,
          observacoes: observacoes,
          usuario_id: user.id
        }
      ]);
      
    setIsLoading(false);

    if (insertError) {
      setError(`Erro ao salvar a fatura: ${insertError.message}`);
    } else {
      alert('Fatura salva com sucesso!');
      router.refresh();
      setFornecedorId('');
      setNumeroFatura('');
      setDataProtocolo('');
      setValor('');
      setPiCod('');
      setObservacoes('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 mb-8 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Adicionar Nova Fatura</h2>
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
        
        <button type="submit" disabled={isLoading} className="md:col-span-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
          {isLoading ? 'Salvando...' : 'Salvar Fatura'}
        </button>
        {/* --- LINHA CORRIGIDA --- */}
        {error && <p className="text-red-500 md:col-span-2">{error}</p>}
      </div>
    </form>
  );
}
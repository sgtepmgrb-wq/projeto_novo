'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import CurrencyInput from 'react-currency-input-field';
import { RelatorioParaImprimir } from './RelatorioParaImprimir';

type Fatura = any; // Simplificado para evitar erros de tipo complexos por agora

export default function SaidaFaturaForm({ fatura }: { fatura: Fatura }) {
  const router = useRouter();
  const supabase = createClient();
  const [dataSaida, setDataSaida] = useState(fatura.data_saida || '');
  const [observacoes, setObservacoes] = useState(fatura.observacoes || '');
  const [valorDesmembrado, setValorDesmembrado] = useState(fatura.valor_desmembrado || 0);
  const [valorGlosa, setValorGlosa] = useState(fatura.valor_glosa || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valorFinal = (Number(fatura.valor) || 0) - valorGlosa - valorDesmembrado;

  const handlePrint = () => { window.print(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('faturas')
      .update({ 
        data_saida: dataSaida,
        observacoes: observacoes,
        valor_desmembrado: valorDesmembrado,
        valor_glosa: valorGlosa,
        status: 'Processado'
      })
      .eq('id', fatura.id);

    setIsLoading(false);

    if (updateError) {
      setError(`Erro ao atualizar a fatura: ${updateError.message}`);
    } else {
      alert('Saída da fatura registrada com sucesso!');
      router.push('/faturas/buscar');
    }
  };

  return (
    <>
      <div className="hidden print:block">
        <RelatorioParaImprimir 
          fatura={fatura}
          valoresEditados={{ valorGlosa, valorDesmembrado, observacoes, valorFinal }}
        />
      </div>
    
      <div className="print:hidden">
        <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold border-b pb-4">Processar Saída da Fatura</h1>
            <button type="button" onClick={handlePrint} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Imprimir Relatório
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold">OCS:</span> {fatura.fornecedores.razao_social}</p>
            <p><span className="font-semibold">Nº Fatura:</span> {fatura.numero_fatura}</p>
            <p><span className="font-semibold">Data Protocolo:</span> {new Date(fatura.data_protocolo).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
            <p><span className="font-semibold">Valor Bruto:</span> R$ {fatura.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div><label className="block font-medium mb-1">Data de Saída</label><input type="date" value={dataSaida} onChange={(e) => setDataSaida(e.target.value)} className="p-2 border rounded w-full" /></div>
            <div><label htmlFor="valorGlosa" className="block font-medium mb-1">Valor Glosa</label><CurrencyInput id="valorGlosa" name="valorGlosa" className="p-2 border rounded w-full" placeholder="R$ 0,00" defaultValue={valorGlosa} decimalsLimit={2} decimalSeparator="," groupSeparator="." onValueChange={(value) => setValorGlosa(parseFloat(value || '0'))} /></div>
            <div><label htmlFor="valorDesmembrado" className="block font-medium mb-1">Valor Desmembrado</label><CurrencyInput id="valorDesmembrado" name="valorDesmembrado" className="p-2 border rounded w-full" placeholder="R$ 0,00" defaultValue={valorDesmembrado} decimalsLimit={2} decimalSeparator="," groupSeparator="." onValueChange={(value) => setValorDesmembrado(parseFloat(value || '0'))} /></div>
            <div className="md:col-span-2"><label className="block font-medium mb-1">Observações</label><textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="p-2 border rounded w-full" rows={4} /></div>
          </div>
          <div className="pt-4 border-t flex justify-between items-center">
            <div className="text-xl font-bold text-gray-800">
              <span>Valor Final: </span><span className="text-blue-600">R$ {valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <button type="submit" disabled={isLoading} className="p-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
              {isLoading ? 'Salvando...' : 'Salvar Saída'}
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </>
  );
}
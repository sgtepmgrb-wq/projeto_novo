'use client';
export const dynamic = 'force-dynamic';

// src/app/(main-app)/consultas/relatorio/page.tsx
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// ... (o código de printStyles continua o mesmo aqui)
const printStyles = `
  @media print {
    .no-print { display: none !important; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 landscape; margin: 15mm; }
  }
`;


function RelatorioComponent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  
  const [resultados, setResultados] = useState<any[]>([]);
  const [titulo, setTitulo] = useState('');
  const [loading, setLoading] = useState(true);

  const tipo = searchParams.get('tipo');
  const isConsultaAberta = tipo === 'em_aberto' || tipo === 'ocs_em_aberto';
  const isConsultaFechada = tipo === 'fechadas' || tipo === 'ocs_fechadas';

  useEffect(() => {
    const fetchResultados = async () => {
      console.log('1. Iniciando busca de resultados...');
      setLoading(true);
      const ocsId = searchParams.get('ocs_id');
      const NOME_DA_COLUNA_FK_FORNECEDOR = 'fornecedor_id';

      let query = supabase.from('faturas').select('*, fornecedores(razao_social)');
      
      if (isConsultaAberta) {
        setTitulo(tipo === 'em_aberto' ? 'Relatório de Faturas em Aberto' : `Faturas em Aberto do Fornecedor`);
        if (tipo === 'ocs_em_aberto') query = query.eq(NOME_DA_COLUNA_FK_FORNECEDOR, ocsId);
        query = query.is('data_saida', null);
      
      } else if (isConsultaFechada) {
        setTitulo(tipo === 'fechadas' ? 'Relatório de Faturas Fechadas' : `Faturas Fechadas do Fornecedor`);
        if (tipo === 'ocs_fechadas') query = query.eq(NOME_DA_COLUNA_FK_FORNECEDOR, ocsId);
        query = query.not('data_saida', 'is', null);
      
      } else if (tipo === 'mapa') {
        const numero = parseInt(searchParams.get('numero') || '0', 10);
        setTitulo(`Relatório de Faturas do Mapa Nº ${numero}`);
        query = query.eq('mapa', numero);

      } else if (tipo === 'combinada') {
        const data = searchParams.get('data');
        setTitulo(`Relatório de Consulta Específica`);
        query = query.eq(NOME_DA_COLUNA_FK_FORNECEDOR, ocsId).eq('data_saida', data);
      }
      
      query = query.neq('protocolo_seq', new Date().getTime() * -1);

      console.log('2. Executando a consulta no Supabase...');
      const { data, error } = await query.order('protocolo_seq', { ascending: true });
      
      console.log('3. Consulta finalizada. Analisando resultados...');
      console.log('Dados recebidos:', data);
      console.log('Erro recebido:', error);
      
      if (data) {
        console.log('4. Sucesso! Atualizando o estado com os resultados.');
        setResultados(data);
      }
      if (error) {
        console.error('5. ERRO na consulta ao Supabase:', error);
      }

      console.log('6. Finalizando o carregamento (setLoading para false).');
      setLoading(false);
    };
    fetchResultados();
  }, [searchParams, supabase, isConsultaAberta, isConsultaFechada, tipo]);

  useEffect(() => {
    console.log('Efeito de impressão verificado. Loading:', loading, 'Resultados:', resultados.length);
    if (!loading && resultados.length > 0) {
      console.log('Disparando a impressão (window.print)...');
      // window.print(); // Temporariamente comentado para não atrapalhar o debug
    }
  }, [loading, resultados]);

  // O resto do seu código (cálculo de totais, JSX, etc.) continua exatamente igual
  // ...
  
  const totais = resultados.reduce((acc, fatura) => {
    const valor = fatura.valor || 0;
    const desmembrado = fatura.valor_desmembrado || 0;
    const glosa = fatura.valor_glosa || 0;
    acc.valor += valor;
    acc.desmembrado += desmembrado;
    acc.glosa += glosa;
    acc.final += (valor - desmembrado - glosa);
    return acc;
  }, { valor: 0, desmembrado: 0, glosa: 0, final: 0 });

  if (loading) return <p className="p-12 text-center">Gerando relatório...</p>;

  return (
    <>
      <style>{printStyles}</style>
      <div className="p-4 font-sans">
        <header className="text-center mb-6">
          <h1 className="text-xl font-bold">{titulo}</h1>
          <p className="text-sm text-gray-600">Total de {resultados.length} fatura(s) encontrada(s).</p>
        </header>
        
        {resultados.length > 0 ? (
          <table className="w-full text-xs border-collapse border border-gray-400">
            <thead className="bg-gray-100 font-bold">
              <tr>
                <td className="border p-1">Nº PDR</td>
                <td className="border p-1">Nome da OCS</td>
                {isConsultaAberta && <td className="border p-1">Data de Entrada</td>}
                {isConsultaAberta && <td className="border p-1 text-center">Dias em Aberto</td>}
                {isConsultaFechada && <td className="border p-1">Data de Saída</td>}
                <td className="border p-1 text-right">Valor Inicial (R$)</td>
                <td className="border p-1 text-right">Desmembrado (R$)</td>
                <td className="border p-1 text-right">Glosa (R$)</td>
                <td className="border p-1 text-right">Valor Final (R$)</td>
              </tr>
            </thead>
            <tbody>
              {resultados.map((fatura) => {
                const valor = fatura.valor || 0;
                const desmembrado = fatura.valor_desmembrado || 0;
                const glosa = fatura.valor_glosa || 0;
                const valorFinal = valor - desmembrado - glosa;

                const diasEmAberto = isConsultaAberta 
                  ? Math.floor((new Date().getTime() - new Date(fatura.created_at).getTime()) / (1000 * 60 * 60 * 24)) 
                  : 0;

                return (
                  <tr key={fatura.protocolo_seq}>
                    <td className="border p-1">{fatura.protocolo_seq}</td>
                    <td className="border p-1">{fatura.fornecedores?.razao_social || 'N/A'}</td>
                    
                    {isConsultaAberta && <td className="border p-1">{new Date(fatura.created_at).toLocaleDateString('pt-BR')}</td>}
                    {isConsultaAberta && <td className="border p-1 text-center font-semibold">{diasEmAberto}</td>}
                    {isConsultaFechada && <td className="border p-1">{new Date(fatura.data_saida + 'T12:00:00').toLocaleDateString('pt-BR')}</td>}

                    <td className="border p-1 text-right">{valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="border p-1 text-right">{desmembrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="border p-1 text-right">{glosa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="border p-1 text-right font-bold">{valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-100 font-bold">
              <tr>
                <td colSpan={isConsultaAberta ? 4 : (isConsultaFechada ? 3 : 2)} className="border p-1 text-right">TOTAIS:</td>
                <td className="border p-1 text-right">{totais.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="border p-1 text-right">{totais.desmembrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="border p-1 text-right">{totais.glosa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="border p-1 text-right">{totais.final.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p className="text-center mt-8">Nenhum resultado encontrado para esta consulta.</p>
        )}
      </div>
    </>
  );
}

export default function PaginaRelatorioDeConsultas() {
  return (
    <Suspense fallback={<p className="p-12 text-center">Carregando...</p>}>
      <RelatorioComponent />
    </Suspense>
  );
}
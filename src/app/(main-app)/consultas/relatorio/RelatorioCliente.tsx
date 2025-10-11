// src/app/(main-app)/consultas/relatorio/RelatorioCliente.tsx
'use client';

import { useEffect } from 'react';

// Estilos de impressão (podemos movê-los para um CSS global mais tarde)
const printStyles = `
  @media print {
    .no-print { display: none !important; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 landscape; margin: 15mm; }
  }
`;

// O tipo 'any' é para simplicidade, podemos tipar isso melhor depois
type RelatorioProps = {
  resultados: any[];
  titulo: string;
};

export function RelatorioCliente({ resultados, titulo }: RelatorioProps) {
  // Este useEffect agora tem uma única responsabilidade: imprimir quando os dados estiverem prontos.
  useEffect(() => {
    if (resultados && resultados.length > 0) {
      window.print();
    }
  }, [resultados]);

  const isConsultaAberta = titulo.includes('Aberto');
  const isConsultaFechada = titulo.includes('Fechada');

  // Lógica para calcular os totais (exatamente como antes)
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

  // O JSX para renderizar a tabela (exatamente como antes)
  return (
    <>
      <style>{printStyles}</style>
      <div className="p-4 font-sans">
        <header className="text-center mb-6 no-print">
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
          <div className="text-center mt-8">
             <h1 className="text-xl font-bold">{titulo}</h1>
             <p>Nenhum resultado encontrado para esta consulta.</p>
          </div>
        )}
      </div>
    </>
  );
}
// src/components/RelatorioParaImprimir.tsx

import React from 'react';

type RelatorioProps = {
  fatura: any;
  valoresEditados: {
    valorGlosa: number;
    valorDesmembrado: number;
    observacoes: string;
    valorFinal: number;
  };
};

export function RelatorioParaImprimir({ fatura, valoresEditados }: RelatorioProps) {
  const valorApresentado = Number(fatura.valor) || 0;
  const valorGlosa = Number(valoresEditados.valorGlosa) || 0;
  const valorDesmembrado = Number(valoresEditados.valorDesmembrado) || 0;
  const valorFinal = valorApresentado - valorGlosa - valorDesmembrado;

  return (
    <div id="area-para-imprimir" className="p-4 text-black bg-white font-serif">

      {/* Tabela do Cabeçalho Principal (imitando o PHP) */}
      <table className="w-full text-xs text-center">
        <tbody>
          <tr>
            <td className="w-[25%] border-2 border-black align-top p-0.5 text-[9px]" rowSpan={2}>
              <span>Auditado no SIRE,</span>
              <p className="mt-2">_______/_______/______</p>
              <p className="mt-2">________________________</p>
              <em className="text-[8px]">(Controle Interno do HGeS)</em>
            </td>
            <td className="w-[50%] align-middle text-[10px]">
              <p>MINISTÉRIO DA DEFESA</p>
              <p>EXÉRCITO BRASILEIRO</p>
              <p>C M NE - 6ª REGIÃO MILITAR</p>
              <p>HOSPITAL GERAL DE SALVADOR</p>
            </td>
            <td className="w-[25%] border-2 border-black align-top p-0.5 text-[9px]" rowSpan={2}>
              <span>Apresentado no SIRE,</span>
              <p className="mt-2">_______/_______/______</p>
              <p className="mt-2">________________________</p>
              <em className="text-[8px]">(Controle Interno do HGeS)</em>
            </td>
          </tr>
          <tr>
            <td className="align-middle font-bold text-base">RELATÓRIO DE AUDITORIA</td>
          </tr>
        </tbody>
      </table>
      
      {/* Tabela de Informações PDR/OCS/Fatura */}
      <table className="w-full border-2 border-black border-collapse text-sm mt-1">
        <thead>
          <tr className="border-2 border-black">
            <th className="p-1 font-bold border-r border-black w-[22%]">PDR Nº</th>
            <th className="p-1 font-bold border-r border-black w-[58%]">OCS</th>
            <th className="p-1 font-bold w-[20%]">Fatura Nº</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-2 border-black text-center">
            <td className="p-1 border-r border-black">
              {fatura.protocolo_seq}, de {new Date(fatura.data_protocolo).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
            </td>
            <td className="p-1 border-r border-black text-left">
              {fatura.fornecedores.razao_social}
            </td>
            <td className="p-1">{fatura.numero_fatura}</td>
          </tr>
        </tbody>
      </table>

      {/* Tabela Hospitalar/Ambulatorial/Grupo */}
      <table className="w-full border-2 border-black border-collapse text-sm mt-1">
        <tbody>
          <tr>
            <td className="p-1 w-[12%] font-bold">HOSPITALAR:</td>
            <td className="p-1 w-[5%] border-2 border-black bg-gray-200"></td>
            <td className="p-1 w-[23%] font-bold text-right">AMBULATORIAL:</td>
            <td className="p-1 w-[5%] border-2 border-black bg-gray-200"></td>
            <td className="p-1 w-[55%] font-bold uppercase text-center">GRUPO: {fatura.cad_pi?.pi_nome || 'Não especificado'}</td>
          </tr>
        </tbody>
      </table>

      {/* Tabela CONTA / FATURA HOSPITALAR (com placeholders) */}
      <table className="w-full border-2 border-black border-collapse text-sm mt-4">
        <thead>
          <tr className="border-2 border-black text-center font-bold">
            <td colSpan={4} className="p-1 border-r border-black">DESCRIÇÃO</td>
            <td className="p-1 w-[8%] border-r border-black">Qnt</td>
            <td colSpan={3} className="p-1 border-r border-black">Apresentado (R$)</td>
            <td className="p-1 w-[15%] border-r border-black">Glosado (R$)</td>
            <td className="p-1 w-[7%]">Legenda</td>
          </tr>
        </thead>
        <tbody>
          {['DIAGNÓSTICO POR IMAGEM', 'DIÁRIAS DE ENFERMARIA/APTO', 'EXAMES LABORATORIAIS', 'FISIOTERAPIA', 'GASOTERAPIA', 'HEMODERIVADOS', 'HONORÁRIOS PROFISSIONAIS', 'MATERIAIS DESCARTÁVEIS', 'MEDICAMENTOS', 'OPME', 'TAXAS', 'DIÁRIA UTI', 'PACOTES', 'NUTRIÇÃO', 'OUTROS (Enfermagem)'].map(item => (
            <tr key={item} className="border-b border-black">
              <td colSpan={4} className="p-1 border-r border-black text-xs h-5">{item}</td>
              <td className="p-1 border-r border-black"></td>
              <td colSpan={3} className="p-1 border-r border-black"></td>
              <td className="p-1 border-r border-black"></td>
              <td className="p-1"></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabela de Totais */}
      <table className="w-full border-2 border-black border-collapse text-xs mt-1">
        <tbody>
          <tr>
            <td className="w-[70%] p-1 text-right font-bold border-r border-black">TOTAL APRESENTADO:</td>
            <td className="w-[30%] p-1">R$ {valorApresentado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="p-1 text-right font-bold border-r border-black">VALOR GLOSADO:</td>
            <td className="p-1">R$ {valorGlosa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="p-1 text-right font-bold border-r border-black">DESMEMBRADO:</td>
            <td className="p-1">R$ {valorDesmembrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="p-1 text-right font-bold border-r border-black">VALOR FINAL A PAGAR:</td>
            <td className="p-1 h-6">R$ </td>
          </tr>
        </tbody>
      </table>

      {/* Observações e Rodapé */}
      <div className="border-2 border-black border-t-0 p-1 text-sm">
        <p className="font-bold">OBSERVAÇÕES / LEGENDA:</p>
        <p className="mt-1 min-h-[50px]">{valoresEditados.observacoes}</p>
      </div>

      <div className="mt-8 flex justify-between items-end text-sm">
        <div>
          <p>DATA: {fatura.data_saida ? new Date(fatura.data_saida).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '__ /__ /____'}</p>
        </div>
        <div className="text-center">
          <p>_________________________</p>
          <p>AUDITOR / CARIMBO</p>
        </div>
      </div>

      <div className="mt-4 text-[10px] text-justify">
        <p>Data do envio do RA a OCS, para análise de glosa: ( &nbsp; ) FAX ( &nbsp; ) E-MAIL &nbsp; Data____/____/_____ .</p>
        <p>1) SOLICITAMOS QUE O DOCUMENTO DE ACATAÇÃO OU CONTESTAÇÃO DE GLOSA, SEJA RESPONDIDO NO PRAZO MÁXIMO DE 15 (DIAS) CORRIDOS, SOB CONDIÇÃO DE SER CONSIDERADA COMO ACATADA A GLOSA REALIZADA PELA AUDITORIA DO HOSPITAL GERAL DE SALVADOR.</p>
        <p>2) FAVOR, SÓ EMITIR A(S) NOTA(S) FISCAL(IS), APÓS A SINALIZAÇÃO DA SEÇÃO DE CONTAS MÉDICAS DO HGeS.</p>
      </div>
    </div>
  );
}
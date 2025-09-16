// src/components/RelatorioParaImprimir.tsx

import React from 'react';

type RelatorioProps = {
  fatura: any;
  valoresEditados: {
    valorGlosa: number;
    valorDesmembrado: number;
    observacoes: string;
    valorFinal: number; // Embora não usado para exibição aqui, é bom manter
  };
};

export function RelatorioParaImprimir({ fatura, valoresEditados }: RelatorioProps) {
  const valorApresentado = Number(fatura.valor) || 0;
  // const valorGlosa = Number(valoresEditados.valorGlosa) || 0; // Removido pois será preenchido à caneta
  const valorDesmembrado = Number(valoresEditados.valorDesmembrado) || 0;
  // const valorFinal = valorApresentado - valorGlosa - valorDesmembrado; // Removido pois será preenchido à caneta

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
              <em className="text-[8px]">(Controle Interno do PMGuRB)</em>
            </td>
            <td className="w-[50%] align-middle text-[10px]">
              <p>MINISTÉRIO DA DEFESA</p>
              <p>EXÉRCITO BRASILEIRO</p>
              <p>CMA – 12ª RM – 17ª Bda Inf Sl</p>
              <p>COMANDO DE FRONTEIRA ACRE / 4º BIS</p>
              <p>BATALHÃO PLÁCIDO DE CASTRO</p>
            </td>
            <td className="w-[25%] border-2 border-black align-top p-0.5 text-[9px]" rowSpan={2}>
              <span>Apresentado no SIRE,</span>
              <p className="mt-2">_______/_______/______</p>
              <p className="mt-2">________________________</p>
              <em className="text-[8px]">(Controle Interno do PMGuRB)</em>
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
      <table className="w-full border-2 border-black border-collapse text-sm mt-1">
        <thead>
          <tr className="border-2 border-black text-center font-bold">
            <td colSpan={4} className="p-1 border-r border-black">DESCRIÇÃO</td>
            <td className="p-1 w-[8%] border-r border-black">Qnt</td>
            <td colSpan={3} className="p-1 border-r border-black">Apresentado (R$)</td>
            <td className="p-1 w-[15%] border-r border-black">Glosa (R$)</td>
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
      {/* MUDANÇA: Removido mt-1 para colar na tabela de cima */}
      <table className="w-full border-2 border-black border-collapse text-xs">
        <tbody>
          <tr>
            <td className="w-[70%] px-1 py-0.5 text-right font-bold border-r border-black">TOTAL APRESENTADO:</td> {/* MUDANÇA: px-1 py-0.5 para diminuir altura */}
            <td className="w-[30%] px-1 py-0.5">R$ {valorApresentado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td> {/* MUDANÇA: px-1 py-0.5 */}
          </tr>
          <tr>
            <td className="px-1 py-0.5 text-right font-bold border-r border-black">VALOR GLOSADO:</td> {/* MUDANÇA: px-1 py-0.5 */}
            <td className="px-1 py-0.5">R$ </td> {/* MUDANÇA: Removido valorGlosa, px-1 py-0.5 */}
          </tr>
          <tr>
            <td className="px-1 py-0.5 text-right font-bold border-r border-black">DESMEMBRADO:</td> {/* MUDANÇA: px-1 py-0.5 */}
            <td className="px-1 py-0.5">R$ {valorDesmembrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td> {/* MUDANÇA: px-1 py-0.5 */}
          </tr>
          <tr>
            <td className="px-1 py-0.5 text-right font-bold border-r border-black">VALOR FINAL A PAGAR:</td> {/* MUDANÇA: px-1 py-0.5 */}
            <td className="px-1 py-0.5 h-6">R$ </td> {/* MUDANÇA: px-1 py-0.5 */}
          </tr>
        </tbody>
      </table>

      {/* Observações e Rodapé */}
      <div className="border-2 border-black border-t-0 p-1 text-sm">
        <p className="font-bold">OBSERVAÇÕES / LEGENDA:</p>
        {/* MUDANÇA: Adicionadas 3 linhas horizontais */}
        <div className="border-b border-black h-4 my-1.5"></div>
        <div className="border-b border-black h-4 my-1.5"></div>
        <div className="border-b border-black h-4 my-1.5"></div>
      
        {/* <p className="mt-1 min-h-[50px]">{valoresEditados.observacoes}</p> // Removido para escrita manual */}
      </div>

      <div className="mt-8 flex justify-between items-end text-sm">
        <div>
          {/* MUDANÇA: Data agora é apenas o placeholder para preenchimento manual */}
          <p>DATA: __ /__ /____</p>
        </div>
        <div className="text-center">
          <p>_________________________</p>
          <p>AUDITOR / CARIMBO</p>
        </div>
      </div>

      <div className="mt-4 text-[10px] text-justify">
        <p>Data do envio do RA a OCS, para análise de glosa: ( &nbsp; ) FAX ( &nbsp; ) E-MAIL &nbsp; Data____/____/_____ .</p>
        <p>1) SOLICITAMOS QUE O DOCUMENTO DE ACATAÇÃO OU CONTESTAÇÃO DE GLOSA, SEJA RESPONDIDO NO PRAZO MÁXIMO DE 15 (DIAS) CORRIDOS, SOB CONDIÇÃO DE SER CONSIDERADA COMO ACATADA A GLOSA REALIZADA PELA AUDITORIA POSTO MÉDICO DE GUARNIÇÃO DE RIO BRANCO.</p>
        <p>2) FAVOR, SÓ EMITIR A(S) NOTA(S) FISCAL(IS), APÓS A SINALIZAÇÃO DA SEÇÃO DE CONTAS MÉDICAS DO PMGuRB.</p>
      </div>
    </div>
  );
}
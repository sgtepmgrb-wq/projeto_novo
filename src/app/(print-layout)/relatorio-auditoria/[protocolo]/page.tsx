// ATENÇÃO: Este arquivo NÃO PODE ter 'use client' no topo.
import { createClient } from "@/lib/supabase/server";
import { RelatorioParaImprimir } from "@/components/RelatorioParaImprimir"; // Importa o seu componente
import { PrintTrigger } from "./PrintTrigger"; // Importa o gatilho de impressão

export const dynamic = 'force-dynamic';

async function getDadosDoRelatorio(protocolo: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('faturas')
    .select(`
      *, 
      fornecedores(razao_social), 
      cad_pi(pi_nome)
    `)
    .eq('protocolo_seq', protocolo)
    .single();
  
  if (error) {
    console.error("Erro ao buscar dados do relatório de auditoria:", error);
    return null;
  }
  return data;
}

export default async function PaginaRelatorioDeAuditoria({ params }: { params: { protocolo: string } }) {
  const dadosDoRelatorio = await getDadosDoRelatorio(params.protocolo);

  if (!dadosDoRelatorio) {
    return <p className="p-12 text-center">Relatório não encontrado para o protocolo {params.protocolo}.</p>;
  }

  // Preparamos as props que o seu componente RelatorioParaImprimir espera
  const valoresEditados = {
    valorGlosa: dadosDoRelatorio.valor_glosa || 0,
    valorDesmembrado: dadosDoRelatorio.valor_desmembrado || 0,
    observacoes: dadosDoRelatorio.observacoes_saida || '',
    valorFinal: 0
  };

  return (
    <div>
      {/* Agora renderizamos o SEU componente, passando os dados corretos */}
      <RelatorioParaImprimir fatura={dadosDoRelatorio} valoresEditados={valoresEditados} />
      
      {/* E adicionamos o gatilho que vai chamar a função de imprimir */}
      <PrintTrigger />
    </div>
  );
}
'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RelatorioParaImprimir } from '@/components/RelatorioParaImprimir'; // 1. IMPORTE SEU COMPONENTE

export default function PaginaDeImpressaoHospedeira({ params }: { params: { protocolo_seq: string } }) {
  const supabase = createClient();

  // Vamos usar um estado para a fatura completa, que contém tudo que seu componente precisa
  const [faturaCompleta, setFaturaCompleta] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDadosCompletos = async () => {
      if (!params.protocolo_seq) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('faturas')
        // 2. ATUALIZE A QUERY PARA PEGAR TODOS OS CAMPOS NECESSÁRIOS
        // Peça aqui todos os campos que seu componente RelatorioParaImprimir usa.
        // ADICIONE/ALTERE OS NOMES DAS COLUNAS CONFORME SEU BANCO DE DADOS
        .select(`
          *, 
          fornecedores(razao_social), 
          cad_pi(pi_nome)
        `)
        .eq('protocolo_seq', params.protocolo_seq)
        .single();

      if (data) {
        setFaturaCompleta(data);
      } else {
        console.error("Erro ao buscar dados completos da fatura:", error);
      }
      setLoading(false);
    };

    fetchDadosCompletos();
  }, [params.protocolo_seq, supabase]);

  // Efeito para acionar a impressão (continua igual)
  useEffect(() => {
    if (!loading && faturaCompleta) {
      setTimeout(() => window.print(), 500); // Damos um tempo extra para renderizar a tabela complexa
    }
  }, [loading, faturaCompleta]);

  if (loading) {
    return <p className="p-12 text-center">Carregando relatório...</p>;
  }

  if (!faturaCompleta) {
    return <p className="p-12 text-center text-red-600">Protocolo não encontrado ou dados insuficientes.</p>;
  }

  // 3. PREPARE AS PROPS PARA SEU COMPONENTE
  // Mapeamos os dados buscados para o formato que o seu componente espera.
  const valoresParaRelatorio = {
    valorGlosa: faturaCompleta.valor_glosa || 0,       // <-- Substitua pelo nome real da coluna
    valorDesmembrado: faturaCompleta.valor_desmembrado || 0, // <-- Substitua pelo nome real da coluna
    observacoes: faturaCompleta.observacoes_saida || '',  // <-- Substitua pelo nome real da coluna
    valorFinal: 0 // O cálculo já é feito dentro do seu componente
  };

  return (
    // 4. RENDERIZE SEU COMPONENTE PASSANDO AS PROPS
    <div>
      <RelatorioParaImprimir fatura={faturaCompleta} valoresEditados={valoresParaRelatorio} />
    </div>
  );
}
// src/app/(main-app)/consultas/relatorio/page.tsx
import { createClient } from '@/lib/supabase/server'; // Importante: usar o cliente de SERVIDOR
import { RelatorioCliente } from './RelatorioCliente'; // Importa o componente que acabamos de criar
import { Suspense } from 'react';

// Esta instrução garante que a Vercel NUNCA usará cache para esta página.
export const dynamic = 'force-dynamic';

// A página agora é uma função assíncrona (async)
export default async function PaginaRelatorioDeConsultas({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  
  // Função para buscar os dados (toda a lógica de antes, agora no servidor)
  const fetchResultados = async () => {
    // NOTA: Em um componente de servidor, não podemos usar o createClient() que vem de @/lib/supabase/client
    // Precisamos de um cliente de servidor. Assumindo que você tem um em @/lib/supabase/server
    // Se não tiver, me avise que te ajudo a criar.
    const supabase = createClient();
    
    let titulo = '';
    const tipo = searchParams.tipo;
    const ocsId = searchParams.ocs_id;
    const NOME_DA_COLUNA_FK_FORNECEDOR = 'fornecedor_id';

    let query = supabase.from('faturas').select('*, fornecedores(razao_social)');
      
    if (tipo === 'em_aberto' || tipo === 'ocs_em_aberto') {
      titulo = tipo === 'em_aberto' ? 'Relatório de Faturas em Aberto' : `Faturas em Aberto do Fornecedor`;
      if (tipo === 'ocs_em_aberto') query = query.eq(NOME_DA_COLUNA_FK_FORNECEDOR, ocsId as string);
      query = query.is('data_saida', null);
    } else if (tipo === 'fechadas' || tipo === 'ocs_fechadas') {
      titulo = tipo === 'fechadas' ? 'Relatório de Faturas Fechadas' : `Faturas Fechadas do Fornecedor`;
      if (tipo === 'ocs_fechadas') query = query.eq(NOME_DA_COLUNA_FK_FORNECEDOR, ocsId as string);
      query = query.not('data_saida', 'is', null);
    } else if (tipo === 'mapa') {
      const numero = parseInt(searchParams.numero as string || '0', 10);
      titulo = `Relatório de Faturas do Mapa Nº ${numero}`;
      query = query.eq('mapa', numero);
    } else if (tipo === 'combinada') {
      const data = searchParams.data;
      titulo = `Relatório de Consulta Específica`;
      query = query.eq(NOME_DA_COLUNA_FK_FORNECEDOR, ocsId as string).eq('data_saida', data as string);
    }
    
    const { data, error } = await query.order('protocolo_seq', { ascending: true });

    if (error) {
      console.error('Erro ao buscar dados no servidor:', error);
      // Retorna um estado de erro claro se a base de dados falhar
      return { resultados: [], titulo: 'Erro ao Gerar Relatório' };
    }

    return { resultados: data || [], titulo };
  };

  // Executa a busca e pega os dados
  const { resultados, titulo } = await fetchResultados();

  // Renderiza o componente de cliente, passando os dados prontos como props
  return (
    <Suspense fallback={<p className="p-12 text-center">Gerando relatório...</p>}>
      <RelatorioCliente resultados={resultados} titulo={titulo} />
    </Suspense>
  );
}
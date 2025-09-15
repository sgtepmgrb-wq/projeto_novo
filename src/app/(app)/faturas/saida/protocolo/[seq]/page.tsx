// src/app/(app)/faturas/saida/protocolo/[seq]/page.tsx

import { createClient } from '@/lib/supabase/server';
import SaidaFaturaForm from '@/components/SaidaFaturaForm';

// 1. Definindo a estrutura de dados da sua fatura.
// Isso melhora a segurança do código e ajuda o VS Code a autocompletar.
// Adapte os campos conforme a sua tabela `faturas` no Supabase.
interface Fatura {
  protocolo_seq: string;
  // Adicione outros campos da sua fatura aqui
  // Ex: numero_fatura: string; valor: number; etc...
  fornecedores: {
    razao_social: string;
  } | null; // A relação pode ser nula
  cad_pi: {
    pi_nome: string;
  } | null; // A relação pode ser nula
}

// 2. Definindo a tipagem para as props que a página recebe da URL.
// Isso corrige o erro de build que estava acontecendo.
type PageProps = {
  params: {
    seq: string;
  };
};

export default async function SaidaPorProtocoloPage({ params }: PageProps) {
  const supabase = createClient();
  const { seq } = params;
  
  // 3. Melhorando a busca de dados para também capturar possíveis erros.
  const { data: fatura, error } = await supabase
    .from('faturas')
    .select('*, fornecedores(razao_social), cad_pi(pi_nome)')
    .eq('protocolo_seq', seq)
    .single<Fatura>(); // Usamos a interface Fatura para tipar o retorno

  // Tratamento de erro caso a busca no Supabase falhe
  if (error) {
    console.error('Erro ao buscar fatura:', error);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Erro ao buscar dados!</h1>
        <p className="mt-2">Não foi possível carregar as informações da fatura. Tente novamente mais tarde.</p>
      </div>
    );
  }

  // Tratamento de erro para fatura não encontrada
  if (!fatura) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Fatura não encontrada!</h1>
        <p className="mt-2">Nenhuma fatura encontrada com o protocolo nº {seq}.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* O componente SaidaFaturaForm agora recebe uma fatura com tipo definido */}
      <SaidaFaturaForm fatura={fatura} />
    </div>
  );
}
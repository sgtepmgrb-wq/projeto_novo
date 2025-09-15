// src/app/(app)/faturas/saida/protocolo/[seq]/page.tsx

import { createClient } from '@/lib/supabase/server';
import SaidaFaturaForm from '@/components/SaidaFaturaForm';

export const runtime = "nodejs";

// Tipagem das props da página
type PageProps = {
  params: { seq: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Tipagem da fatura (ajuste conforme seu banco)
interface Fatura {
  protocolo_seq: string;
  fornecedores: { razao_social: string } | null;
  cad_pi: { pi_nome: string } | null;
}

export default async function SaidaPorProtocoloPage({
  params,
}: PageProps) {
  const supabase = createClient();
  const { seq } = params;

  const { data: fatura, error } = await supabase
    .from('faturas')
    .select('*, fornecedores(razao_social), cad_pi(pi_nome)')
    .eq('protocolo_seq', seq)
    .single<Fatura>();

  if (error) {
    console.error('Erro ao buscar fatura:', error);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Erro ao buscar dados!</h1>
        <p className="mt-2">Não foi possível carregar as informações da fatura.</p>
      </div>
    );
  }

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
      <SaidaFaturaForm fatura={fatura} />
    </div>
  );
}

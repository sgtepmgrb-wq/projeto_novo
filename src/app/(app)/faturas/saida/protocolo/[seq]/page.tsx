import { createClient } from '@/lib/supabase/server';
import SaidaFaturaForm from '@/components/SaidaFaturaForm';

export default async function SaidaPorProtocoloPage({ params }: { params: { seq: string } }) {
  const supabase = createClient();
  const { seq } = params;
  
  const { data: fatura } = await supabase
    .from('faturas')
    .select('*, fornecedores(razao_social), cad_pi(pi_nome)')
    .eq('protocolo_seq', seq)
    .single();

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
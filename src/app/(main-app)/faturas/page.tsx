// src/app/(main-app)/faturas/page.tsx
import { createClient } from '@/lib/supabase/server';
import AddFaturaForm from '@/components/AddFaturaForm';

export default async function FaturasPage() {
  const supabase = createClient();
  
  // Busca os dados dos OCS apenas para popular o dropdown do formulário
  const { data: fornecedores } = await supabase
    .from('fornecedores')
    .select('id, razao_social');

  // A busca pela lista de faturas foi REMOVIDA daqui.

  return (
    // ========================================================
    // CORREÇÃO APLICADA AQUI na linha abaixo
    // ========================================================
    <div className="p-8 max-w-6xl mx-auto text-gray-800">
      {/* A página agora renderiza apenas o formulário de adição */}
      <AddFaturaForm fornecedores={fornecedores || []} />
    </div>
  );
}
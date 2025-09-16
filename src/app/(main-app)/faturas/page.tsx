// src/app/(app)/faturas/page.tsx
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
    <div className="p-8 max-w-6xl mx-auto">
      {/* A página agora renderiza apenas o formulário de adição */}
      <AddFaturaForm fornecedores={fornecedores || []} />
    </div>
  );
}
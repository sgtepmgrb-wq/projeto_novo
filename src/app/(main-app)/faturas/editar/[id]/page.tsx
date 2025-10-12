import { getFaturaById, getFornecedores } from '@/app/actions/faturas';
import EditFaturaForm from '@/components/EditFaturaForm'; // Usaremos este novo componente
import { notFound } from 'next/navigation';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EditFaturaPage({ params }: PageProps) {
  const id = params.id;

  // Busca os dados da fatura e a lista de fornecedores no servidor
  const fatura = await getFaturaById(id);
  const fornecedores = await getFornecedores();

  // Se a fatura não for encontrada, mostra uma página 404
  if (!fatura) {
    notFound();
  }

  // Renderiza o componente de formulário, passando os dados para ele
  return (
    // ========================================================
    // CORREÇÃO APLICADA AQUI
    // Adicionamos um 'div' principal para controlar o layout e a cor do texto
    // ========================================================
    <div className="p-8 max-w-6xl mx-auto text-gray-800">
      <EditFaturaForm fatura={fatura} fornecedores={fornecedores} />
    </div>
  );
}
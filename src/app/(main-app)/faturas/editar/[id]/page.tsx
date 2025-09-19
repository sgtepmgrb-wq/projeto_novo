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
  return <EditFaturaForm fatura={fatura} fornecedores={fornecedores} />;
}
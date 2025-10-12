import AddOcsForm from '@/components/AddOcsForm';

// Esta página agora é mais simples. Ela não precisa buscar dados,
// apenas renderiza o componente do formulário.
export default function FornecedoresPage() {
  return (
    // CORREÇÃO APLICADA AQUI
    <div className="p-8 max-w-4xl mx-auto text-gray-800">
      <AddOcsForm />
    </div>
  );
}
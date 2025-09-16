// src/app/(app)/fornecedores/page.tsx
import AddOcsForm from '@/components/AddOcsForm';

// Esta página agora é mais simples. Ela não precisa buscar dados,
// apenas renderiza o componente do formulário.
export default function FornecedoresPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <AddOcsForm />
    </div>
  );
}
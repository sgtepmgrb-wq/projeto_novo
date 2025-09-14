// src/components/AddOcsForm.tsx
'use client'; 

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AddOcsForm() {
  const router = useRouter();
  const supabase = createClient();

  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('fornecedores')
      .insert([ { razao_social: razaoSocial, cnpj: cnpj } ]);

    setIsLoading(false);

    if (insertError) {
      if (insertError.code === '23505') { 
        setError('Este CNPJ já está cadastrado.');
      } else {
        setError(insertError.message);
      }
    } else {
      setRazaoSocial('');
      setCnpj('');
      router.refresh(); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 mb-8 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Adicionar Novo OCS</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Razão Social"
          value={razaoSocial}
          // --- MUDANÇA AQUI ---
          // Converte o texto para maiúsculas enquanto o usuário digita
          onChange={(e) => setRazaoSocial(e.target.value.toUpperCase())}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="CNPJ"
          value={cnpj}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/[^0-9]/g, '');
            setCnpj(numericValue);
          }}
          required
          maxLength={14}
          className="p-2 border rounded"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Salvando...' : 'Salvar OCS'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </form>
  );
}
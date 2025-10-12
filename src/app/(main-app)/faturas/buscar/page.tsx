'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuscarFaturaPage() {
  const router = useRouter();
  const [protocoloSeq, setProtocoloSeq] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (protocoloSeq.trim()) {
      router.push(`/faturas/saida/protocolo/${protocoloSeq}`);
    }
  };

  return (
    // CORREÇÃO: Classe 'text-gray-800' adicionada na linha abaixo
    <div className="p-8 max-w-xl mx-auto text-gray-800">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Buscar Fatura por Protocolo</h1>
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <label htmlFor="protocoloSeq" className="font-medium text-gray-700">
            Digite o Número do Protocolo:
          </label>
          <input
            id="protocoloSeq"
            type="number"
            value={protocoloSeq}
            onChange={(e) => setProtocoloSeq(e.target.value)}
            placeholder="Digite o número do protocolo aqui..."
            required
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buscar Fatura
          </button>
        </form>
      </div>
    </div>
  );
}
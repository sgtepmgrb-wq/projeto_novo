// src/app/(main-app)/imprimir/page.tsx
'use client';

import { useState } from 'react';

export default function PaginaImprimir() {
  const [protocolo, setProtocolo] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (protocolo) {
      // Abre a página do relatório final (que tem o layout de impressão) em uma nova aba
      window.open(`/relatorio-auditoria/${protocolo}`, '_blank');
    }
  };

  return (
    // A classe text-gray-800 garante que o texto seja legível
    <div className="flex justify-center items-center pt-20 text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Imprimir Relatório por Protocolo
        </h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="protocolo" className="block text-sm font-medium text-gray-700 mb-2">
            Digite o Número do Protocolo
          </label>
          <input
            id="protocolo"
            type="number"
            value={protocolo}
            onChange={(e) => setProtocolo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Gerar e Imprimir
          </button>
        </form>
      </div>
    </div>
  );
}
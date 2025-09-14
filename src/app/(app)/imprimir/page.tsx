// src/app/imprimir/page.tsx
'use client'

import { useState } from 'react';

export default function PaginaBuscaImpressao() {
  const [protocolo, setProtocolo] = useState('');

  const handleGerarRelatorio = (e: React.FormEvent) => {
    e.preventDefault();
    if (protocolo.trim()) {
      window.open(`/imprimir/relatorio/${protocolo.trim()}`, '_blank');
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto mt-10">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Imprimir Relatório por Protocolo</h1>
        <form onSubmit={handleGerarRelatorio}>
          <label htmlFor="protocolo" className="block text-sm font-medium text-gray-700 mb-2">
            Digite o Número do Protocolo
          </label>
          <input
            id="protocolo"
            type="number"
            value={protocolo}
            onChange={(e) => setProtocolo(e.target.value)}
            placeholder="Ex: 11232"
            className="p-3 border rounded w-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            Gerar e Imprimir
          </button>
        </form>
      </div>
    </div>
  );
}
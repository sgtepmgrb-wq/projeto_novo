// src/app/(app)/imprimir/layout.tsx
import React from 'react';

export default function ImprimirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Um div simples que garante que não há padding/margin adicionais
    // O "flex flex-col min-h-screen" do layout padrão não é necessário aqui
    <div className="print:block print:w-full print:h-auto">
      {children}
    </div>
  );
}
import React from 'react';
import Header from '@/components/Header'; // Importa o novo componente de Header
import { AuthProvider } from '@/contexts/AuthContext'; // Importa o novo provedor de autenticação

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // O AuthProvider "envelopa" a aplicação para que todos os componentes dentro
    // dele (incluindo o Header) possam saber quem é o usuário logado.
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        
        {/* O Header agora é um componente separado e inteligente */}
        <Header />

        <main>
          <div className="container mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

      </div>
    </AuthProvider>
  );
}
// src/app/(app)/layout.tsx

// ===================================================================
// MUDANÇA 1: Adicionado para permitir interatividade e hooks
// ===================================================================
'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
// ===================================================================
// MUDANÇA 2: Novos imports para a funcionalidade de logout
// ===================================================================
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // ===================================================================
  // MUDANÇA 3: Lógica para o logout
  // ===================================================================
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      <header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/logo.png"
                    alt="Logo do Sistema de Faturas"
                    width={80}
                    height={50}
                    priority
                  />
                </Link>
              </div>
              
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/lista" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Faturas</Link>
                  <Link href="/faturas/buscar" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Saída de Fatura</Link>
                  <Link href="/fornecedores" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Cadastrar OCS</Link>
                  <Link href="/imprimir" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Imprimir</Link>
                  <Link href="/consultas" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Consultas</Link>
                  <Link href="/mapa" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Mapa</Link>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                <Link href="/faturas" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">Incluir Fatura</Link>
                
                {/* ======================================================= */}
                {/* MUDANÇA 4: Adicionado o onClick ao seu botão          */}
                {/* ======================================================= */}
                <button
                  onClick={handleLogout}
                  className="bg-gray-700 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
            
          </div>
        </nav>
      </header>
      
      <main>
        <div className="container mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
    </div>
  );
}
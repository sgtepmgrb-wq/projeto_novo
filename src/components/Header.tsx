'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const router = useRouter();
  const supabase = createClient();
  const { profile, loading } = useAuth();

  const handleLogout = async () => {
    // Adicionamos a depuração aqui para o botão de sair
    console.log('Botão Sair clicado. Iniciando processo de logout...');
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erro ao tentar fazer logout no Supabase:', error);
      alert('Ocorreu um erro ao tentar sair. Verifique o console do navegador.');
    } else {
      console.log('Logout no Supabase bem-sucedido. Redirecionando para /login...');
      router.push('/login');
      router.refresh();
    }
  };

  if (loading) {
    return <header className="bg-gray-800 h-20 shadow-md sticky top-0 z-50"></header>;
  }

  const userRole = profile?.role;

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* GRUPO DA ESQUERDA: Logo e Links de Navegação */}
        <div className="flex items-center space-x-10">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo do Sistema"
                width={80}
                height={50}
                priority
              />
            </Link>
          </div>
          <ul className="hidden md:flex items-baseline space-x-4">
            <li><Link href="/lista" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Faturas</Link></li>

            {(userRole === 'admin' || userRole === 'auditoria') && (
              <>
                <li><Link href="/faturas/buscar" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Saída de Fatura</Link></li>
                <li><Link href="/fornecedores" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Cadastrar OCS</Link></li>
                <li><Link href="/imprimir" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Imprimir</Link></li>
              </>
            )}
            
            <li><Link href="/consultas" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Consultas</Link></li>

            {(userRole === 'admin' || userRole === 'fusex') && (
              <li><Link href="/mapa" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Mapa</Link></li>
            )}

            {userRole === 'admin' && (
              <li><Link href="/admin/criar-usuario" className="text-yellow-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Criar Usuário</Link></li>
            )}
          </ul>
        </div>

        {/* GRUPO DA DIREITA: Botões de Ação, Perfil e Sair */}
        <div className="hidden md:flex items-center space-x-4">
          {(userRole === 'admin' || userRole === 'auditoria') && (
            <Link href="/faturas" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">Incluir Fatura</Link>
          )}

          {/* --- MUDANÇA REALIZADA AQUI --- */}
          {profile && (
            <span className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
              Olá, {profile.full_name.split(' ')[0]}
            </span>
          )}
          {/* --- FIM DA MUDANÇA --- */}

          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Sair
          </button>
        </div>
      </nav>
    </header>
  );
}
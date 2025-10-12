// src/components/Header.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// O tipo de dados do perfil (igual ao do layout)
type Profile = {
  role: string;
  full_name: string;
};

// O Header agora recebe 'user' e 'profile' como props
type HeaderProps = {
  user: User | null;
  profile: Profile | null;
};

export default function Header({ user, profile }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh(); 
  };
  
  // Não precisamos mais do estado de 'loading' do useAuth
  // Se o layout está a renderizar, os dados já chegaram.

  const userRole = profile?.role;

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* GRUPO DA ESQUERDA: Logo e Links de Navegação */}
        <div className="flex items-center space-x-10">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Logo do Sistema" width={70} height={42} priority />
            </Link>
          </div>
          {/* Apenas mostra os links de navegação se o utilizador estiver logado */}
          {user && (
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
          )}
        </div>

        {/* GRUPO DA DIREITA: Botões de Ação, Perfil e Sair */}
        {/* Apenas mostra este grupo se o utilizador estiver logado */}
        {user && profile && (
            <div className="hidden md:flex items-center space-x-4">
            {(userRole === 'admin' || userRole === 'auditoria') && (
              <Link href="/faturas" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">Incluir Fatura</Link>
            )}

            <span className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
              Olá, {profile.full_name.split(' ')[0]}
            </span>

            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
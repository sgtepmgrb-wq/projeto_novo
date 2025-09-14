// src/components/Header.tsx
'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/faturas" className="hover:text-gray-300 transition-colors">
            Protocolo
          </Link>
        </div>
        <ul className="flex items-center space-x-6">
          <li><Link href="/lista" className="hover:text-gray-300 transition-colors">Lista</Link></li>
          <li><Link href="/fornecedores" className="hover:text-gray-300 transition-colors">Cadastrar OCS</Link></li>
          <li><Link href="/faturas" className="hover:text-gray-300 transition-colors">Cadastrar Fatura</Link></li>
          <li><Link href="/faturas/buscar" className="text-yellow-400 hover:text-yellow-300 transition-colors font-semibold">Buscar Saída</Link></li>
          <li><Link href="/imprimir" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md">
  Imprimir</Link></li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
            >
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
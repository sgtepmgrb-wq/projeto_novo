'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// Define o tipo de dados que nosso perfil terá
type Profile = {
  role: string;
  full_name: string;
};

// Define o que nosso contexto vai fornecer
type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
};

// Cria o contexto com um valor padrão
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

// Cria o Provedor, que é o componente que vai gerenciar os dados
export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar os dados da sessão e do perfil
    const fetchData = async () => {
      // Pega a sessão atual (contém o 'user')
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Se houver um usuário, busca o perfil dele na tabela 'profiles'
      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', session.user.id)
          .single();
        setProfile(userProfile);
      }
      setLoading(false);
    };

    fetchData();

    // Fica 'escutando' por mudanças na autenticação (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', session.user.id)
            .single();
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Limpa o listener quando o componente é desmontado
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = { user, profile, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Cria um hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
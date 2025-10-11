// src/app/(main-app)/layout.tsx
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header"; // Verifique se o caminho está correto

// O tipo de dados do perfil que esperamos do banco de dados
type Profile = {
  role: string;
  full_name: string;
};

// O layout agora é uma função assíncrona (async)
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  // Busca o utilizador atual a partir dos cookies da sessão
  const { data: { user } } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  // Se o utilizador existir, busca o perfil dele
  if (user) {
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();
    profile = userProfile;
  }

  return (
    // Não precisamos mais do AuthProvider aqui!
    <div className="min-h-screen bg-gray-100">
      
      {/* Passamos os dados do utilizador e do perfil diretamente para o Header */}
      <Header user={user} profile={profile} />

      <main>
        <div className="container mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

    </div>
  );
}
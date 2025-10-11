import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { getUsersWithProfiles } from '@/app/actions/userManagement';
import ManageUsersClient from "@/components/ManageUsersClient"; // Importaremos um novo componente

export const dynamic = 'force-dynamic';

export default async function ManageUsersPage() {
  const supabase = createClient();

  // 1. Busca o utilizador e o seu perfil no servidor
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user 
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null };
  
  // 2. Protege a página: se não for admin, redireciona para a página inicial
  if (profile?.role !== 'admin') {
    redirect('/'); // Redireciona para a página principal se não for admin
  }

  // 3. Busca a lista inicial de utilizadores no servidor
  const initialUsers = await getUsersWithProfiles();

  // 4. Renderiza o componente de cliente, passando a lista de utilizadores
  return <ManageUsersClient initialUsers={initialUsers} adminUserId={user.id} />;
}
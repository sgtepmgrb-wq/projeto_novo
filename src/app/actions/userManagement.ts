'use server';

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Esquema de validação para a atualização
const updateUserSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(3, { message: "O nome é obrigatório." }),
  role: z.enum(['admin', 'auditoria', 'fusex']),
  password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }).optional().or(z.literal('')),
});

// Função para buscar todos os usuários com seus perfis
export async function getUsersWithProfiles() {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }

  // Pega todos os perfis de uma vez
  const { data: profiles, error: profileError } = await supabaseAdmin.from('profiles').select('*');
  if (profileError) {
    console.error("Erro ao buscar perfis:", profileError);
    return [];
  }

  // Mapeia os perfis para um acesso mais fácil
  const profileMap = new Map(profiles.map(p => [p.id, p]));

  // Combina os dados de autenticação com os perfis
  const combinedUsers = users.users.map(user => ({
    ...user,
    profile: profileMap.get(user.id) || { full_name: 'Perfil não encontrado', role: 'desconhecido' },
  }));

  return combinedUsers;
}

// Ação para ATUALIZAR um usuário
export async function updateUser(prevState: any, formData: FormData) {
  const supabaseAdmin = createSupabaseAdminClient();
  
  const validatedFields = updateUserSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return { message: 'Dados inválidos.', errors: validatedFields.error.flatten().fieldErrors };
  }

  const { id, full_name, role, password } = validatedFields.data;

  // 1. Atualiza o perfil (nome e cargo)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ full_name, role })
    .eq('id', id);

  if (profileError) {
    return { message: `Erro ao atualizar perfil: ${profileError.message}` };
  }

  // 2. Se uma nova senha foi fornecida, atualiza a autenticação
  if (password) {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { password });
    if (authError) {
      return { message: `Erro ao atualizar senha: ${authError.message}` };
    }
  }

  revalidatePath('/admin/criar-usuario');
  return { message: 'Usuário atualizado com sucesso!' };
}

// Ação para EXCLUIR um usuário
export async function deleteUser(formData: FormData) {
  const supabase = createClient();
  const supabaseAdmin = createSupabaseAdminClient();
  const id = formData.get('id') as string;

  // Trava de segurança: Pega o ID do admin que está executando a ação
  const { data: { user: adminUser } } = await supabase.auth.getUser();

  if (adminUser?.id === id) {
    // Retorna um erro se o admin tentar se auto-excluir
    throw new Error('Ação proibida: Administradores não podem excluir a si mesmos.');
  }

  // Exclui o usuário da autenticação (o perfil é excluído em cascata pelo trigger)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    throw new Error(`Erro ao excluir usuário: ${error.message}`);
  }

  revalidatePath('/admin/criar-usuario');
}
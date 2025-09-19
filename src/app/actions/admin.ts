// src/app/actions/admin.ts
'use server'

import { z } from 'zod'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

// MUDANÇA AQUI
const createUserSchema = z.object({
  full_name: z.string().min(3, { message: 'O nome é obrigatório.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' }),
  role: z.enum(['admin', 'auditoria', 'fusex']), // Atualizado com os novos cargos
})

export async function createNewUser(prevState: any, formData: FormData) {
  // ... o resto da função continua exatamente igual ...
  const validatedFields = createUserSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Dados inválidos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { full_name, email, password, role } = validatedFields.data;
  const supabaseAdmin = createSupabaseAdminClient();

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: full_name },
  });

  if (authError) {
    if (authError.message.includes('already been registered')) {
      return { message: `Erro: O e-mail '${email}' já está cadastrado.` };
    }
    return { message: `Erro no servidor: ${authError.message}` };
  }

  if (!authData.user) {
    return { message: 'Erro: Usuário não foi criado na autenticação.' };
  }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ role: role, full_name: full_name })
    .eq('id', authData.user.id);

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return { message: `Erro no servidor ao ATUALIZAR perfil: ${profileError.message}` };
  }
  
  return { message: `Usuário '${email}' criado com sucesso como '${role}'!`, errors: {} };
}
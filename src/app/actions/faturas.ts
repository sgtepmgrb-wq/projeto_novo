'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Define os tipos de dados que vamos usar
export type Fatura = {
  id: string;
  numero_fatura: string;
  valor: number;
  fornecedor_id: string;
};
export type Fornecedor = {
  id: string;
  razao_social: string;
};

// Função para buscar uma única fatura pelo seu ID
export async function getFaturaById(id: string): Promise<Fatura | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('faturas')
    .select('id, numero_fatura, valor, fornecedor_id')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar fatura:', error);
    return null;
  }
  return data;
}

// Função para buscar a lista de todos os fornecedores
export async function getFornecedores(): Promise<Fornecedor[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('fornecedores').select('id, razao_social');
  if (error) {
    console.error('Erro ao buscar fornecedores:', error);
    return [];
  }
  return data;
}

// Esquema de validação para o formulário
const updateFaturaSchema = z.object({
  id: z.string().uuid(),
  numero_fatura: z.string().min(1, 'O número da fatura é obrigatório.'),
  valor: z.coerce.number().positive('O valor deve ser positivo.'),
  fornecedor_id: z.string().uuid('Selecione um fornecedor válido.'),
});

// A Server Action que ATUALIZA a fatura
export async function updateFatura(prevState: any, formData: FormData) {
  const validatedFields = updateFaturaSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Dados inválidos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...dataToUpdate } = validatedFields.data;
  const supabase = createClient();

  const { error } = await supabase
    .from('faturas')
    .update(dataToUpdate)
    .eq('id', id);

  if (error) {
    return { message: `Erro no servidor: ${error.message}` };
  }

  // Limpa o cache e redireciona para a lista
  revalidatePath('/lista');
  redirect('/lista');
}
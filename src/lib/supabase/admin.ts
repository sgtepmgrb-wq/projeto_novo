import { createClient } from '@supabase/supabase-js'

// Este cliente é "puro" e stateless. Ele não sabe nada sobre cookies ou sessão do usuário.
// Ele opera APENAS com a chave de serviço, garantindo privilégios máximos sempre.
export function createSupabaseAdminClient() {
  // Validação para garantir que as variáveis de ambiente não estão faltando
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or Service Role Key is missing from environment variables.')
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
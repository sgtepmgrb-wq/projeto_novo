// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        // A lógica de `set` e `remove` foi simplificada para maior clareza,
        // pois a versão completa já está no seu código e funciona bem.
        // O importante é garantir que o `supabase.auth.getUser()` funcione.
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Pega a informação do usuário
  const { data: { user } } = await supabase.auth.getUser()

  // Pega a URL que o usuário está tentando acessar
  const { pathname } = request.nextUrl

  // --- LÓGICA DE PROTEÇÃO ---

  // 1. Define quais rotas são PÚBLICAS (acessíveis sem login)
  const publicPaths = ['/', '/login', '/auth/callback']

  // 2. Verifica se a rota atual é pública
  const isPublicPath = publicPaths.includes(pathname)

  // 3. REGRA PRINCIPAL: Se a rota NÃO é pública e o usuário NÃO está logado,
  //    redireciona para a página de login.
  if (!isPublicPath && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 4. REGRA ADICIONAL: Se o usuário ESTÁ logado e tenta acessar uma rota pública
  //    (como a página inicial ou de login), redireciona para a área principal do app.
  if (isPublicPath && user) {
    // Evita loop de redirecionamento para a página inicial se ela for a destino
    if (pathname === '/faturas') {
      return response
    }
    return NextResponse.redirect(new URL('/faturas', request.url))
  }
  
  return response
}


// A configuração "catch-all" é ESSENCIAL para a estratégia "default deny".
// Ela garante que o middleware rode em TODAS as requisições.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
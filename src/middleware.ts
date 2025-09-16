// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Cria um cliente Supabase que pode operar no servidor e no middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
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

  // Pega a sessão do usuário
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // --- LÓGICA DE PROTEÇÃO DE ROTAS ---

  // Lista de rotas e arquivos que são sempre públicos
  const publicPaths = [
    '/',               // A página inicial (landing page)
    '/login',          // A página de login
    '/auth/callback',  // Rota de callback do Supabase
    '/pmgurb.jpg'      // A imagem de fundo da página inicial
  ]

  const isPublicPath = publicPaths.includes(pathname)

  // REGRA 1: Proteger rotas privadas
  // Se o caminho não é público e não há um usuário logado, redireciona para /login.
  if (!isPublicPath && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // REGRA 2: Redirecionar usuários já logados
  // Se o usuário está logado e tenta acessar a página de login,
  // redireciona para a página principal da aplicação.
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/lista', request.url))
  }
  
  // Se nenhuma das regras acima for atendida, permite que a requisição continue normalmente.
  return response
}

// Configuração para definir em quais rotas o middleware deve rodar.
// Este padrão executa em todas as rotas, exceto arquivos estáticos e rotas de API.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
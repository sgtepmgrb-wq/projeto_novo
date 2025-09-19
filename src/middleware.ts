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

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // --- LÓGICA DE PROTEÇÃO DE ROTAS ---

  const publicPaths = ['/', '/login', '/auth/callback', '/pmgurb.jpg']
  const isPublicPath = publicPaths.includes(pathname)

  // Se a rota não é pública e não há usuário, redireciona para login.
  if (!isPublicPath && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se o usuário está logado, verificamos seu cargo e aplicamos as regras.
  if (user) {
    // Se o usuário logado tenta acessar a página de login, redireciona para a lista.
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/lista', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Assume 'fusex' como cargo padrão se o perfil não for encontrado por algum motivo.
    const userRole = profile?.role || 'fusex'

    // REGRA 1: Admin pode tudo. Se o usuário é admin, não fazemos mais nenhuma verificação.
    if (userRole === 'admin') {
      return response // Permite o acesso
    }

    // REGRA 2: Auditoria não pode acessar /mapa.
    if (userRole === 'auditoria') {
      if (pathname.startsWith('/mapa')) {
        // Se tentar acessar, redireciona para a página principal.
        return NextResponse.redirect(new URL('/lista', request.url))
      }
    }

    // REGRA 3: FUSEX só pode acessar um conjunto específico de páginas.
    if (userRole === 'fusex') {
      const allowedPathsForFusex = ['/lista', '/consultas', '/mapa']
      
      // Verificamos se a página que o usuário FUSEX está tentando acessar
      // NÃO está na lista de páginas permitidas para ele.
      const isAllowed = allowedPathsForFusex.some(path => pathname.startsWith(path))

      if (!isAllowed) {
        // Se não estiver na lista permitida, redireciona para a página principal.
        return NextResponse.redirect(new URL('/lista', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    // Roda em todas as rotas, exceto as de API e arquivos estáticos.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
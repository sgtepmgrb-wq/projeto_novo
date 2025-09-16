// src/app/page.tsx

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div
      className="relative flex flex-col min-h-screen items-center justify-center text-white"
      style={{
        backgroundImage: "url('/pmgurb.jpg')", // garante que puxe do /public
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay escuro com transparência */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Conteúdo principal */}
      <main className="relative z-10 flex-grow flex items-center">
        <section className="w-full">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  CUIDAR E SERVIR
                </h1>
                <p className="mx-auto mt-4 max-w-[700px] text-gray-200 md:text-xl">
                  Controle faturas, OCS e relatórios em um só lugar. Simplifique sua rotina e
                  foque no que realmente importa.
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Acessar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="relative z-10 py-6 text-center text-sm text-gray-400">
        <p>© 2025 Sgt SORIANO.</p>
      </footer>
    </div>
  )
}

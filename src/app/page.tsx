// src/app/page.tsx (versão corrigida)

import Link from 'next/link'
// 👇 AQUI ESTÁ A MUDANÇA
import LandingHeader from '@/components/LandingHeader' 
import Footer from '@/components/Footer'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 👇 E AQUI */}
      <LandingHeader />

      <main className="flex-grow flex items-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                  CUIDAR E SERVIR
                </h1>
                <p className="mx-auto mt-4 max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
                  Controle faturas, OCS e relatórios em um só lugar. Simplifique sua rotina e foque no que realmente importa.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Acessar Plataforma
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Saber Mais
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
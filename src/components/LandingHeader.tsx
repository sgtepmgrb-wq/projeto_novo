// src/components/LandingHeader.tsx

import Link from 'next/link'

export default function LandingHeader() {
  return (
    <header className="absolute top-0 w-full z-10 py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Substitua por seu Logo ou Nome */}
          <span className="text-xl font-bold">MeuProjeto</span> 
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
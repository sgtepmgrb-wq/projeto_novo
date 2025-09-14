// src/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="w-full py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sgt SORIANO. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="/termos" className="hover:underline">Termos de Serviço</a>
            <a href="/privacidade" className="hover:underline">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
// src/components/LogoutButton.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (!error) {
      router.push('/login')
      router.refresh()
    } else {
      console.error('Erro ao fazer logout:', error.message)
    }
  }

  return (
    // 👇 ESTE É O SEU BOTÃO, AGORA COM A AÇÃO ONCLICK
    <button
      onClick={handleLogout}
      className="bg-gray-700 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Saída
    </button>
  )
}
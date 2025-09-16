// src/app/(auth)/login/page.tsx
'use client'; 

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/lista'); 
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    // MUDANÇA: Adiciona a imagem de fundo na div principal
    <div 
      className="relative flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: "url('/pmgurb.jpg')", // Sua imagem de fundo
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* MUDANÇA: Overlay mais translúcido (bg-black/80 ou bg-black/70 para mais translucidez) */}
      <div className="absolute inset-0 bg-black/80 z-0" /> {/* Ajuste bg-black/X0 para mudar a opacidade */}

      {/* MUDANÇA: Garante que o formulário fique acima do overlay */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          localization={{
            variables: {
              sign_in: { email_label: 'Seu endereço de e-mail', password_label: 'Sua senha', button_label: 'Entrar', link_text: 'Já tem uma conta? Entre' },
              sign_up: { email_label: 'Seu endereço de e-mail', password_label: 'Crie uma senha', button_label: 'Cadastrar', link_text: 'Não tem uma conta? Cadastre-se' },
              forgotten_password: { email_label: 'Seu endereço de e-mail', button_label: 'Enviar instruções', link_text: 'Esqueceu sua senha?' },
            },
          }}
        />
      </div>
    </div>
  );
}
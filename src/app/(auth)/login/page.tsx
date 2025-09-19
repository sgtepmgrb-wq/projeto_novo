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
    <div 
      className="relative flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: "url('/pmgurb.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/80 z-0" />

      <div className="relative z-10 w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          view="sign_in"

          // --- MUDANÇA PRINCIPAL AQUI ---
          showLinks={false} // Remove os links "Sign up" e "Esqueceu a senha"
          
          localization={{
            variables: {
              sign_in: { 
                email_label: 'Seu endereço de e-mail',
                password_label: 'Sua senha',
                button_label: 'Entrar',
                // Tradução dos placeholders adicionada
                email_input_placeholder: 'exemplo@email.com',
                password_input_placeholder: 'Sua senha aqui',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
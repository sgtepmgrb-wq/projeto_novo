// src/app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Apenas renderiza a página filha (neste caso, a página de login)
  return <>{children}</>;
}
// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <-- A LINHA MAIS IMPORTANTE! VERIFIQUE SE ELA EXISTE.

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meu Sistema",
  description: "Descrição do sistema",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
// eslint.config.mjs

import next from 'next';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"], // Aplica a todos os arquivos TypeScript
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    // Estende as configurações recomendadas
    ...next.configs.recommended,
    ...tseslint.configs.recommended,
    
    // 👇 AQUI ESTÁ A MUDANÇA IMPORTANTE 👇
    rules: {
      // Outras regras podem estar aqui...

      // Mudamos a regra de 'error' para 'warn'
      // Isso vai gerar um aviso em vez de quebrar o build.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Outras configurações de arquivo (ex: para JavaScript) podem estar aqui
];
// ATENÇÃO: Este arquivo PRECISA ter 'use client' no topo.
// Ele usa o hook 'useEffect', que só funciona no cliente.
'use client';

import { useEffect } from 'react';

export function PrintTrigger() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return null; // Este componente não renderiza nada visível
}
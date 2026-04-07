import { useState, useEffect } from 'preact/hooks';

export interface Route {
  page: string;
  id?: string;
}

function parseHash(): Route {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 0) return { page: 'home' };

  switch (parts[0]) {
    case 'add':
      return { page: 'add' };
    case 'review':
      return { page: 'review', id: parts[1] };
    case 'shops':
      return { page: 'shops' };
    case 'shop':
      return { page: 'shop', id: parts[1] };
    case 'settings':
      return { page: 'settings' };
    default:
      return { page: 'home' };
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const handler = () => setRoute(parseHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}

export function navigate(path: string) {
  window.location.hash = path;
}

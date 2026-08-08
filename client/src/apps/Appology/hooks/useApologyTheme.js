import { useMemo } from 'react';
import { ApologyThemeRegistry, resolveApologyTheme } from '../themes/themeRegistry';

export function useApologyTheme(themeSlug) {
  return useMemo(() => {
    const key = resolveApologyTheme(themeSlug);
    return ApologyThemeRegistry[key] || ApologyThemeRegistry['midnight-romance'];
  }, [themeSlug]);
}

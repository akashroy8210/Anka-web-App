export const ApologyThemeRegistry = {
  'midnight-romance': {
    name: 'Midnight Romance',
    cssClass: 'theme-midnight-romance',
    badge: '🌙 Midnight Romance',
    description: 'Dark, intimate velvet, candlelight and rose glow',
    bgColor: '#0B0710',
    primaryColor: '#D94F83',
    textColor: '#FFF5F8'
  },
  'blush-pink': {
    name: 'Blush Pink',
    cssClass: 'theme-blush-pink',
    badge: '🌸 Blush Pink',
    description: 'Soft warm pink paper stationery and spring petals',
    bgColor: '#FFF5F8',
    primaryColor: '#F06F9B',
    textColor: '#4A3038'
  },
  'lavender-dream': {
    name: 'Lavender Dream',
    cssClass: 'theme-lavender-dream',
    badge: '🔮 Lavender Dream',
    description: 'Whimsical lilac, fireflies, stars and soft blue clouds',
    bgColor: '#F7F2FF',
    primaryColor: '#9B78D4',
    textColor: '#382C49'
  }
};

export function resolveApologyTheme(themeSlug) {
  const cleanSlug = (themeSlug || '').toLowerCase().trim();
  if (cleanSlug.includes('blush') || cleanSlug.includes('pink')) return 'blush-pink';
  if (cleanSlug.includes('lavender') || cleanSlug.includes('purple')) return 'lavender-dream';
  return 'midnight-romance';
}

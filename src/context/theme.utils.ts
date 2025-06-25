import { Theme } from './theme.types';
import { THEME_STORAGE_KEY } from './theme.types';

export const getInitialTheme = (): Theme => {
  // Check for saved theme preference
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (savedTheme) return savedTheme;

    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  
  // Default to light theme
  return 'light';
};

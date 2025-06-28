import { createContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeContextType, THEME_STORAGE_KEY } from './theme.types';
import { getInitialTheme } from './theme.utils';

declare global {
  interface Window {
    updateThemeColor?: (isDark: boolean) => void;
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Update the theme color in the HTML head
    if (typeof window !== 'undefined' && window.updateThemeColor) {
      window.updateThemeColor(theme === 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme: Theme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
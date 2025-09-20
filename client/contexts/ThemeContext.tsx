import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'default' | 'dark' | 'theme-ocean' | 'theme-sunset' | 'theme-forest';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to 'default'
    return (localStorage.getItem('theme') as Theme) || 'default';
  });

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove('dark', 'theme-ocean', 'theme-sunset', 'theme-forest');
    
    // Apply the current theme class (except for default)
    if (theme !== 'default') {
      document.documentElement.classList.add(theme);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (initialTheme && ['default', 'dark', 'theme-ocean', 'theme-sunset', 'theme-forest'].includes(initialTheme)) {
      setTheme(initialTheme as Theme);
    }
  }, [initialTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

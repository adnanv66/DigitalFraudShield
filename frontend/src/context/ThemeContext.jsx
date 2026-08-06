import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [seniorMode, setSeniorMode] = useState(() => {
    return localStorage.getItem('seniorMode') === 'true';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'normal'; // 'normal', 'large', 'xlarge'
  });

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast || seniorMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', highContrast);
  }, [highContrast, seniorMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xlarge');
    const effectiveScale = seniorMode ? 'xlarge' : fontSize;
    root.classList.add(`font-scale-${effectiveScale}`);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('seniorMode', seniorMode);
  }, [fontSize, seniorMode]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleSeniorMode = () => setSeniorMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{
      highContrast,
      toggleHighContrast,
      darkMode,
      toggleDarkMode,
      seniorMode,
      toggleSeniorMode,
      fontSize,
      setFontSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

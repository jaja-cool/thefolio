import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check for saved dark mode preference
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDark);
    
    // Broadcast to other tabs
    const channel = new BroadcastChannel('dark-mode');
    channel.postMessage({ darkMode: isDark });
  }, [isDark]);

  useEffect(() => {
    // Listen for dark mode changes from other tabs
    const channel = new BroadcastChannel('dark-mode');
    channel.onmessage = (event) => {
      const darkMode = event.data.darkMode;
      setIsDark(darkMode);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};


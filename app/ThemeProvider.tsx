import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance, OpaqueColorValue, StyleSheet, StyleSheetProperties } from "react-native";


import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = {
  primary: string | OpaqueColorValue | undefined;
  colors: any;
  background: string;
  text: string;
  card: string;
  button: string;
};




interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: ThemeType;
}

const lightTheme: ThemeType = {
  background: "#ffffff",
  text: "#000000",
  card: "#f9f9f9",
  button: "#2563eb",
};

const darkTheme: ThemeType = {
  background: "#121212",
  text: "#ffffff",
  card: "#1e1e1e",
  button: "#3b82f6",
};

// 🔥 Ajout d'un type par défaut pour éviter un objet vide
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === "dark");
  const [theme, setTheme] = useState(isDarkMode ? darkTheme : lightTheme);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themePreference");
        if (savedTheme) {
          const isDark = savedTheme === "dark";
          setIsDarkMode(isDark);
          setTheme(isDark ? darkTheme : lightTheme);
        } else {
          const systemTheme = Appearance.getColorScheme();
          const isDark = systemTheme === "dark";
          setIsDarkMode(isDark);
          setTheme(isDark ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du thème :", error);
      }
    };

    loadThemePreference();
  }, []);

  const toggleDarkMode = async () => {
    const newTheme = !isDarkMode;
    console.log('this function execute with new theme ' + newTheme)
    setIsDarkMode(newTheme);
    setTheme(newTheme ? darkTheme : lightTheme);
  console.log('current theme'+ JSON.stringify (theme));
    await AsyncStorage.setItem("themePreference", newTheme ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Ajout d'une vérification pour éviter les erreurs
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  }
  return context;
};

import React, { createContext, useContext } from "react";
import { StyleSheet, useColorScheme } from "react-native";

// Create a Theme Context
const ThemeContext = createContext("light");

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme(); // Detect system theme: "light" or "dark"
  
  return (
    <ThemeContext.Provider value={systemTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook to Access Theme Styles
export const useTheme = () => {
  const theme = useContext(ThemeContext);
  return theme === "dark" ? darkTheme : lightTheme;
};

// Light Theme Styles
const lightTheme = StyleSheet.create({
  background: { backgroundColor: "#f8f8f8" },
  text: { color: "#000" },
  card: { backgroundColor: "#fff", borderColor: "#ccc" },
});

// Dark Theme Styles
const darkTheme = StyleSheet.create({
  background: { backgroundColor: "#121212" },
  text: { color: "#fff" },
  card: { backgroundColor: "#1e1e1e", borderColor: "#333" },
});

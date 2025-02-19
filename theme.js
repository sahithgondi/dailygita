import React, { createContext, useContext } from "react";
import { StyleSheet } from "react-native";

const ThemeContext = createContext();

export const ThemeProvider = ({ theme, children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  return theme === "dark" ? darkTheme : lightTheme;
};

// Light & Dark Mode Styles
const lightTheme = StyleSheet.create({
  background: { backgroundColor: "#f8f8f8" },
  text: { color: "#000" },
  card: { backgroundColor: "#fff", borderColor: "#ccc" },
});

const darkTheme = StyleSheet.create({
  background: { backgroundColor: "#121212" },
  text: { color: "#fff" },
  card: { backgroundColor: "#1e1e1e", borderColor: "#333" },
});

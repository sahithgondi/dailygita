import React from "react";
import { useColorScheme } from "react-native";
import { ThemeProvider } from "../../theme"; // Import global theme provider
import { Tabs } from "expo-router";

export default function Layout() {
  const theme = useColorScheme(); // Detects system theme

  return (
    <ThemeProvider theme={theme}>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Daily Bhagavad Gita" }} />
      </Tabs>
    </ThemeProvider>
  );
}

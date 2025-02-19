import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../../theme"; 
import { useColorScheme } from "react-native";
import MainScreen from "./MainScreen";

const Stack = createStackNavigator();

export default function Layout() {
  const theme = useColorScheme();

  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainScreen" component={MainScreen} />
        </Stack.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  );
}

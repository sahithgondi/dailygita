import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./MainScreen";
import TranslationGuideScreen from "../translation-guide";
import GitaDhyana from "../gita-dhyana";

// 1) Import your ThemeProvider (adjust the path as needed).
import { ThemeProvider } from "../../theme"; 

const Stack = createStackNavigator();

export default function Layout() {
  return (
    <ThemeProvider theme="dark">
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name="translation-guide" component={TranslationGuideScreen}/>
          <Stack.Screen name="GitaDhyana" component={GitaDhyana} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

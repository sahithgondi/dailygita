import React, { useEffect } from "react";
import { setupDatabase } from "../database";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; 

import MainScreen from "./MainScreen";
import TranslationGuideScreen from "../translation-guide";
import GitaDhyana from "./gita-dhyana.js";
import Chapter1 from "./chapter-1.js";
import Chapter2 from "./chapter-2.js";
import Chapter3 from "./chapter-3.js";
import Chapter4 from "./chapter-4.js";
import Chapter5 from "./chapter-5.js";
import Chapter6 from "./chapter-6.js";
import Chapter7 from "./chapter-7.js";
import Chapter8 from "./chapter-8.js";
import Chapter9 from "./chapter-9.js";
import Chapter10 from "./chapter-10.js";
import Chapter11 from "./chapter-11.js";
import Chapter12 from "./chapter-12.js";
import Chapter13 from "./chapter-13.js";
import Chapter14 from "./chapter-14.js";
import Chapter15 from "./chapter-15.js";
import Chapter16 from "./chapter-16.js";
import Chapter17 from "./chapter-17.js";
import Chapter18 from "./chapter-18.js";

import { ThemeProvider } from "../../theme";

const Stack = createStackNavigator();

export default function Layout() {
  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <ThemeProvider theme="dark">
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name="translation-guide" component={TranslationGuideScreen} />
          <Stack.Screen name="GitaDhyana" component={GitaDhyana} />
          <Stack.Screen name="Chapter1" component={Chapter1} />
          <Stack.Screen name="Chapter2" component={Chapter2} />
          <Stack.Screen name="Chapter3" component={Chapter3} />
          <Stack.Screen name="Chapter4" component={Chapter4} />
          <Stack.Screen name="Chapter5" component={Chapter5} />
          <Stack.Screen name="Chapter6" component={Chapter6} />
          <Stack.Screen name="Chapter7" component={Chapter7} />
          <Stack.Screen name="Chapter8" component={Chapter8} />
          <Stack.Screen name="Chapter9" component={Chapter9} />
          <Stack.Screen name="Chapter10" component={Chapter10} />
          <Stack.Screen name="Chapter11" component={Chapter11} />
          <Stack.Screen name="Chapter12" component={Chapter12} />
          <Stack.Screen name="Chapter13" component={Chapter13} />
          <Stack.Screen name="Chapter14" component={Chapter14} />
          <Stack.Screen name="Chapter15" component={Chapter15} />
          <Stack.Screen name="Chapter16" component={Chapter16} />
          <Stack.Screen name="Chapter17" component={Chapter17} />
          <Stack.Screen name="Chapter18" component={Chapter18} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

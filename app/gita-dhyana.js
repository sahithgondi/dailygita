import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView, PanGestureHandler, State } from "react-native-gesture-handler";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseAsync("gita.db");

export default function GitaDhyana() {
  const navigation = useNavigation();
  const [shlokas, setShlokas] = useState([]);

  useEffect(() => {
    fetchShlokas();
  }, []);

  const fetchShlokas = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM shlokas WHERE chapter_id = ?",
        ["A"],
        (_, { rows }) => {
          setShlokas(rows._array);
        },
        (error) => {
          console.log("Error fetching shlokas: ", error);
        }
      );
    });
  };

  const handleSwipe = ({ nativeEvent }) => {
    if (nativeEvent.translationX > 50) {
      navigation.navigate("MainScreen"); // Swipe Right → Back to Main Screen
    } else if (nativeEvent.translationX < -50) {
      navigation.navigate("Chapter1"); // Swipe Left → Next Chapter
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={handleSwipe}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Gita Dhyana</Text>
          {shlokas.map((shloka, index) => (
            <View key={index} style={styles.shlokaContainer}>
              <Text style={styles.shlokaText}>{shloka.shloka}</Text>
              <Text style={styles.meaningText}>{shloka.shloka_meaning}</Text>
            </View>
          ))}
        </ScrollView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  shlokaContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
  },
  shlokaText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  meaningText: {
    fontSize: 16,
    color: "#bbb",
    marginTop: 5,
  },
});

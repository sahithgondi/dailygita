import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../theme";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const TranslationGuideScreen = () => {
  const { styles } = useTheme();
  const navigation = useNavigation();

  const handleSwipeBack = (event) => {
    if (event.nativeEvent.translationX > 50) {
      navigation.goBack();
    }
  };

  return (
    <GestureHandlerRootView style={styles.background}>
      <PanGestureHandler onGestureEvent={handleSwipeBack}>
        <ScrollView style={styles.background}>
          <View style={[styles.container, styles.card]}>
            <Text style={styles.title}>Transliteration and Pronunciation Guide</Text>
            <View style={styles.tableContainer}>
              <View style={styles.rowHeader}>
                <Text style={styles.cellHeader}>Letter(s)</Text>
                <Text style={styles.cellHeader}>Pronounced as</Text>
                <Text style={styles.cellHeader}>Letter(s)</Text>
                <Text style={styles.cellHeader}>Pronounced as</Text>
              </View>
              {[ 
                ["om", "Home or Rome", "ṭa", "Touch"],
                ["a", "Fun", "ṭha", "Ant-hill"],
                ["ā", "Car", "ḍa", "Duck"],
                ["i", "Pin", "ḍha", "Godhood"],
                ["ī", "Feet", "ṇa", "Thunder"],
                ["u", "Put", "ta", "(Close to) Think"],
                ["ū", "Pool", "tha", "(Close to) Pathetic"],
                ["ṛ", "Rig", "da", "(Close to) Father"],
                ["ṝ", "(Long r)", "dha", "(Close to) Breathe hard"],
                ["e", "Play", "na", "Numb"],
                ["ai", "High", "pa", "Purse"],
                ["o", "Over", "pha", "Sapphire"],
                ["au", "Cow", "ba", "But"],
                ["aṁ/aṃ", "Nasalized", "bha", "Abhor"],
                ["aḥ", "Aspirated vowel", "ma", "Mother"],
                ["Ka", "Kind", "ya", "Young"],
                ["Kha", "Blockhead", "ra", "Run"],
                ["Ga", "Gate", "la", "Luck"],
                ["Gha", "Log-hut", "va", "Virtue"],
                ["Na", "Sing", "śa", "Shove"],
                ["Ca", "Chunk", "ṣa", "Bushel"],
                ["Cha", "Match", "sa", "Sir"],
                ["Ja", "Jug", "ha", "House"],
                ["Jha", "Hedgehog", "(Note 1)", "(Close to) World"],
                ["Ṭra", "Three", "kṣa", "Worksheet"],
                ["A (a)", "Unpronounced", "Aa (ā)", "Unpronounced"]
              ].map((row, index) => (
                <View key={index} style={styles.row}>
                  {row.map((cell, cellIndex) => (
                    <Text key={cellIndex} style={styles.cell}>{cell}</Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cellHeader: {
    flex: 1,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },
  cell: {
    flex: 1,
    padding: 5,
    textAlign: "center",
  },
});

export default TranslationGuideScreen;

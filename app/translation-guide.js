import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useTheme } from "../theme";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const TranslationGuideScreen = () => {
  const theme = useTheme(); // Get current theme
  const navigation = useNavigation();

  const handleSwipeBack = (event) => {
    if (event.nativeEvent.state === State.END && event.nativeEvent.translationX > 50) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, theme.background]}>
      <GestureHandlerRootView style={styles.flex}>
        <PanGestureHandler onHandlerStateChange={handleSwipeBack}>
          <ScrollView contentContainerStyle={styles.scrollContent} style={theme.background}>
            <View style={[styles.card, theme.card]}>
              <Text style={[styles.title, theme.text]}>Transliteration and Pronunciation Guide</Text>
              <View style={styles.tableContainer}>
                <View style={[styles.rowHeader, theme.card]}>
                  <Text style={[styles.cellHeader, theme.text]}>Letter(s)</Text>
                  <Text style={[styles.cellHeader, theme.text]}>Pronounced as</Text>
                </View>
                {[
                  ["om", "Home or Rome"],
                  ["a", "Fun"],
                  ["ā", "Car"],
                  ["i", "Pin"],
                  ["ī", "Feet"],
                  ["u", "Put"],
                  ["ū", "Pool"],
                  ["ṛ", "Rig"],
                  ["ṝ", "(Long r)"],
                  ["e", "Play"],
                  ["ai", "High"],
                  ["o", "Over"],
                  ["au", "Cow"],
                  ["aṁ/aṃ", "Nasalized"],
                  ["aḥ", "Aspirated vowel"],
                  ["Ka", "Kind"],
                  ["Kha", "Blockhead"],
                  ["Ga", "Gate"],
                  ["Gha", "Log-hut"],
                  ["Na", "Sing"],
                  ["Ca", "Chunk"],
                  ["Cha", "Match"],
                  ["Ja", "Jug"],
                  ["Jha", "Hedgehog"],
                  ["Ṭra", "Three"],
                  ["A (a)", "Unpronounced"],
                  ["Aa (ā)", "Unpronounced"],
                  ["ṭa", "Touch"],
                  ["ṭha", "Ant-hill"],
                  ["ḍa", "Duck"],
                  ["ḍha", "Godhood"],
                  ["ṇa", "Thunder"],
                  ["ta", "(Close to) Think"],
                  ["tha", "(Close to) Pathetic"],
                  ["da", "(Close to) Father"],
                  ["dha", "(Close to) Breathe hard"],
                  ["na", "Numb"],
                  ["pa", "Purse"],
                  ["pha", "Sapphire"],
                  ["ba", "But"],
                  ["bha", "Abhor"],
                  ["ma", "Mother"],
                  ["ya", "Young"],
                  ["ra", "Run"],
                  ["la", "Luck"],
                  ["va", "Virtue"],
                  ["śa", "Shove"],
                  ["ṣa", "Bushel"],
                  ["sa", "Sir"],
                  ["ha", "House"],
                  ["(Note 1)", "(Close to) World"],
                  ["kṣa", "Worksheet"],
                  ["jña", "*"],
                ].map((row, index) => (
                  <View key={index} style={styles.row}>
                    {row.map((cell, cellIndex) => (
                      <Text key={cellIndex} style={[styles.cell, theme.text]}>{cell}</Text>
                    ))}
                  </View>
                ))}
              </View>
              <Text style={[styles.notes, theme.text]}>Note 1: "ḹ" Itself is sometimes used.</Text>
              <Text style={[styles.notes, theme.text]}>* No English Equivalent</Text>
              <Text style={[styles.notes, theme.text]}>** Nasalization of the preceding vowel</Text>
              <Text style={[styles.notes, theme.text]}>*** Aspiration of preceding vowel.</Text>
            </View>
          </ScrollView>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: "center",
  },
  card: {
    borderRadius: 8,
    padding: 16,
    width: "90%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  rowHeader: {
    flexDirection: "row",
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
    fontSize: 18,
    padding: 8,
    textAlign: "center",
  },
  notes: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
});

export default TranslationGuideScreen;

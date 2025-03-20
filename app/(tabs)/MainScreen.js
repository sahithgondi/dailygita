import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { setupDatabase, getRandomShloka } from "../database";
import { useTheme } from "../../theme";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const chapters = [
  { id: "A", title: "Gītā Dhyāna Ślokāḥ", screen: "GitaDhyana" },
  { id: "1", title: "Arjuna Viṣāda Yogaḥ", screen: "Chapter1" },
  { id: "2", title: "Sāṅkhya Yogaḥ", screen: "Chapter2" },
  { id: "3", title: "Karma Yogaḥ", screen: "Chapter3" },
  { id: "4", title: "Jñāna Yogaḥ", screen: "Chapter4" },
  { id: "5", title: "Karma Sanyāsa Yogaḥ", screen: "Chapter5" },
  { id: "6", title: "Ātma Saṁyama Yogaḥ", screen: "Chapter6" },
  { id: "7", title: "Jñāna Vijñāna Yogaḥ", screen: "Chapter7" },
  { id: "8", title: "Akṣara Parabrahma Yogaḥ", screen: "Chapter8" },
  { id: "9", title: "Rājavidyā Rājaguhya Yogaḥ", screen: "Chapter9" },
  { id: "10", title: "Vibhūti Yogaḥ", screen: "Chapter10" },
  { id: "11", title: "Viśvarūpa Sandarśana Yogaḥ", screen: "Chapter11" },
  { id: "12", title: "Bhakti Yogaḥ", screen: "Chapter12" },
  { id: "13", title: "Kṣetrakṣetrajña Vibhāga Yogaḥ", screen: "Chapter13" },
  { id: "14", title: "Guṇatraya Vibhāga Yogaḥ", screen: "Chapter14" },
  { id: "15", title: "Puruṣottama Yogaḥ", screen: "Chapter15" },
  { id: "16", title: "Daivāsura Sampadvibhāga Yogaḥ", screen: "Chapter16" },
  { id: "17", title: "Śraddhātraya Vibhāga Yogaḥ", screen: "Chapter17" },
  { id: "18", title: "Mokṣa Sanyāsa Yogaḥ", screen: "Chapter18" },
  { id: "C", title: "Gītāsāram", screen: "ChapterC" },
  { id: "D", title: "Phalaśruti", screen: "ChapterD" },
];

const MainScreen = () => {
  const navigation = useNavigation();
  const themeStyles = useTheme();
  const [randomShloka, setRandomShloka] = useState(null);

  useEffect(() => {
    setupDatabase().then(() => {
      getRandomShloka((shloka) => setRandomShloka(shloka[0]));
    });
  }, []);

  const requestNotificationPermission = async () => {
    if (!Device.isDevice) {
      Alert.alert("Error", "Notifications only work on a physical iPhone.");
      return;
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable notifications to receive daily shlokas."
        );
        return;
      }
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📜 Daily Bhagavad Gita",
        body: "Your daily Shloka is ready! Open the app to read it.",
      },
      trigger: { hour: 8, minute: 0, repeats: true },
    });

    Alert.alert(
      "✅ Notifications Enabled",
      "You will receive a daily Shloka every morning!"
    );
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.background]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topSection}>
          <Text style={[styles.title, themeStyles.text]}>Daily Bhagavad Gita</Text>
        </View>

        <View style={styles.middleSection}>
          <View style={styles.spacer} />
          {randomShloka && (
            <View style={styles.shlokaContainer}>
              <Text style={[styles.verse, themeStyles.text]}>
                {randomShloka.shloka}
              </Text>
              <Text style={[styles.translation, themeStyles.text]}>
                {randomShloka.shloka_meaning}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.button, styles.specialButton]}
            onPress={requestNotificationPermission}
          >
            <Text style={styles.buttonText}>Get a Daily Shloka</Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.tableOfContents}>
            <Text style={[styles.sectionTitle, themeStyles.text]}>Table of Contents</Text>
            {chapters.map((chapter) => (
              <TouchableOpacity
                key={chapter.id}
                onPress={() => navigation.navigate(chapter.screen)}
              >
                <Text style={[styles.chapter, themeStyles.text]}>{chapter.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("translation-guide")}>
            <Text style={styles.link}>Transliteration Guide</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  topSection: { alignItems: "center", marginTop: 40 },
  middleSection: { alignItems: "center", flex: 1 },
  spacer: { height: 70 },
  bottomSection: { alignItems: "center", paddingBottom: 20 },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  shlokaContainer: { marginVertical: 20, paddingHorizontal: 16 },
  verse: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  translation: { fontSize: 14, fontStyle: "italic", textAlign: "center" },
  tableOfContents: { alignItems: "center", marginVertical: 20 },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },
  chapter: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
    textAlign: "center",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: 220,
    marginVertical: 10,
  },
  specialButton: { backgroundColor: "#FA5F55" },
  buttonText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  link: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FA5F55",
    marginVertical: 10,
    textDecorationLine: "none",
  },
});

export default MainScreen;
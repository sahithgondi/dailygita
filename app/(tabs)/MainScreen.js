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
  { id: "B", title: "Gītā Dhyāna Ślokāḥ" },
  { id: "1", title: "Arjuna Viṣāda Yogaḥ" },
  { id: "2", title: "Sāṅkhya Yogaḥ" },
  { id: "3", title: "Karma Yogaḥ" },
  { id: "4", title: "Jñāna Yogaḥ" },
  { id: "5", title: "Karma Sanyāsa Yogaḥ" },
  { id: "6", title: "Ātma Saṁyama Yogaḥ" },
  { id: "7", title: "Jñāna Vijñāna Yogaḥ" },
  { id: "8", title: "Akṣara Parabrahma Yogaḥ" },
  { id: "9", title: "Rājavidyā Rājaguhya Yogaḥ" },
  { id: "10", title: "Vibhūti Yogaḥ" },
  { id: "11", title: "Viśvarūpa Sandarśana Yogaḥ" },
  { id: "12", title: "Bhakti Yogaḥ" },
  { id: "13", title: "Kṣetrakṣetrajña Vibhāga Yogaḥ" },
  { id: "14", title: "Guṇatraya Vibhāga Yogaḥ" },
  { id: "15", title: "Puruṣottama Yogaḥ" },
  { id: "16", title: "Daivāsura Sampadvibhāga Yogaḥ" },
  { id: "17", title: "Śraddhātraya Vibhāga Yogaḥ" },
  { id: "18", title: "Mokṣa Sanyāsa Yogaḥ" },
  { id: "C", title: "Gītāsāram" },
  { id: "D", title: "Phalaśruti" },
];

const MainScreen = () => {
  const navigation = useNavigation();
  const themeStyles = useTheme(); // Apply dark or light mode
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
        {/* Top Section */}
        <View style={styles.topSection}>
          <Text style={[styles.title, themeStyles.text]}>Daily Bhagavad Gita</Text>
        </View>

        {/* Middle Section */}
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

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.tableOfContents}>
            <Text style={[styles.sectionTitle, themeStyles.text]}>Table of Contents</Text>
            {chapters.map((chapter) => (
            <TouchableOpacity
              key={chapter.id}
              onPress={() => navigation.navigate(chapter.id === "B" ? "GitaDhyana" : `chapter-${chapter.id}`)}
            >
              <Text style={[styles.chapter, themeStyles.text]}>{chapter.title}</Text>
            </TouchableOpacity>
            ))}
          </View>
          {/* Hyperlink-style Transliteration Guide */}
          <TouchableOpacity
            onPress={() => navigation.navigate("translation-guide")}
          >
            <Text style={styles.link}>Transliteration Guide</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  topSection: {
    alignItems: "center",
    marginTop: 40,
  },
  middleSection: {
    alignItems: "center",
    flex: 1,
  },
  spacer: {
    height: 70,
  },
  bottomSection: {
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  shlokaContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  verse: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  translation: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
  tableOfContents: {
    alignItems: "center",
    marginVertical: 20,
  },
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
  specialButton: {
    backgroundColor: "#FA5F55",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  link: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FA5F55",
    marginVertical: 10,
    textDecorationLine: "none",
  },
});

export default MainScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { setupDatabase, getRandomShloka } from "../database";
import { useTheme } from "../../theme";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const chapters = [
  { id: "A", title: "Transliteration and Pronunciation Guide" },
  { id: "B", title: "Gītā Dhyāna Ślokāḥ" },
  { id: "1", title: "Arjuna Viṣāda Yogaḥ" },
  { id: "2", title: "Sāṅkhya Yogaḥ" },
  { id: "3", title: "Karma Yogaḥ" },
  { id: "4", title: "Jñāna Yogaḥ" },
  { id: "5", title: "Karma Sanyāsa Yogaḥ" },
  { id: "6", title: "Ātma Saṁyama Yogaḥ (Dhyāna Yogaḥ)" },
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
  const theme = useTheme();
  const [randomShloka, setRandomShloka] = useState(null);

  useEffect(() => {
    setupDatabase().then(() => {
      getRandomShloka((shloka) => setRandomShloka(shloka[0]));
    });
  }, []);

  // ✅ Request Notification Permission for iOS
  const requestNotificationPermission = async () => {
    if (!Device.isDevice) {
      Alert.alert("Error", "Notifications only work on a physical iPhone.");
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Required", "Please enable notifications to receive daily shlokas.");
      return;
    }

    Notifications.scheduleNotificationAsync({
      content: {
        title: "📜 Daily Bhagavad Gita",
        body: "Your daily Shloka is ready! Open the app to read it.",
      },
      trigger: { hour: 8, minute: 0, repeats: true }, // Sends at 8 AM daily
    });

    Alert.alert("✅ Notifications Enabled", "You will receive a daily Shloka every morning!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={[styles.container, theme.background]}>
        {/* Header Section */}
        <View style={[styles.header, theme.card]}>
          <Text style={[styles.title, theme.text]}>Daily Bhagavad Gita</Text>

          {/* Daily Shloka Section */}
          {randomShloka && (
            <View style={[styles.shlokaContainer, theme.card]}>
              <Text style={[styles.verse, theme.text]}>{randomShloka.shloka}</Text>
              <Text style={[styles.translation, theme.text]}>{randomShloka.shloka_meaning}</Text>
            </View>
          )}

          {/* ✅ Get Daily Shloka Button */}
          <Button title="Get a Daily Shloka" onPress={requestNotificationPermission} />
        </View>

        {/* Table of Contents Section */}
        <View style={styles.tableOfContents}>
          <Text style={[styles.sectionTitle, theme.text]}>Table of Contents</Text>
          {chapters.map((chapter) => (
            <TouchableOpacity key={chapter.id} onPress={() => navigation.navigate(`chapter-${chapter.id}`)}>
              <Text style={[styles.chapter, theme.text]}>{chapter.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000", // Ensure it blends well with dark mode
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50, // ✅ Moves title below the notch
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  shlokaContainer: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: "center",
  },
  verse: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  translation: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
  tableOfContents: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chapter: {
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});

export default MainScreen;

import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../theme"; // Import global theme

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
  const theme = useTheme(); // Get the current theme styles

  return (
    <ScrollView style={[styles.container, theme.background]}>
      {/* Header Section */}
      <View style={[styles.header, theme.card]}>
        <Text style={[styles.title, theme.text]}>Daily Gita</Text>
        <Text style={[styles.message, theme.text]}>
          May you enjoy peace, comfort, and happiness by the grace of Sri Krishna Paramatma
        </Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  message: {
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 10,
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

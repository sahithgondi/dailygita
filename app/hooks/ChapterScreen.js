import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from "react-native";
import { getShlokasByChapter } from "../database";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../theme";
import MainScreenButton from "../hooks/MainScreenButton";

export default function ChapterScreen({ chapterId = "1", title = "" }) {
  const [shlokas, setShlokas] = useState([]);
  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchShlokas = async () => {
      const result = await getShlokasByChapter(String(chapterId));
      const formatted = result.map((shloka) => ({
        ...shloka,
        shloka: shloka.shloka
          ?.replace(/\|\|/g, "\u00A0||\u00A0")
          .replace(/\|/g, "\u00A0|\u00A0"),
      }));
      setShlokas(formatted);
    };
    fetchShlokas();
  }, [chapterId]);

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      paddingBottom: 80,
      ...theme.background,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      ...theme.text,
      marginBottom: 24,
      textAlign: "center",
    },
    shlokaCard: {
      padding: 16,
      backgroundColor: theme.card.backgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.card.borderColor,
      marginBottom: 12,
      elevation: 3,
    },
    shlokaNumber: {
      fontSize: 14,
      color: theme.text.color,
      textAlign: "center",
    },
    shlokaText: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      color: theme.text.color,
      marginTop: 8,
    },
    shlokaMeaning: {
      fontSize: 16,
      fontStyle: "italic",
      textAlign: "center",
      color: theme.text.color,
      marginTop: 6,
    },
  });

  const handleLongPress = (shloka) => {
    navigation.navigate("ShlokaPopupScreen", { shloka });
  };

  return (
    <SafeAreaView style={[{ flex: 1 }, theme.background]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {shlokas.map((shloka) => (
          <Pressable
            key={shloka.id}
            onLongPress={() => handleLongPress(shloka)}
            delayLongPress={150}
            style={styles.shlokaCard}
          >
            <View>
              <Text style={styles.shlokaNumber}>Shloka {shloka.id}</Text>
              <Text style={styles.shlokaText}>{shloka.shloka}</Text>
              {shloka.shloka_meaning ? (
                <Text style={styles.shlokaMeaning}>{shloka.shloka_meaning}</Text>
              ) : null}
            </View>
          </Pressable>
        ))}
        <MainScreenButton />
      </ScrollView>
    </SafeAreaView>
  );
}

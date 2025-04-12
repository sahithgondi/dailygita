// 📄 ChapterScreen.js (Enhanced Popup Version with [[MEANING_HERE]] support)
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
  ActivityIndicator, 
  Share,
  Alert,
} from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { setupDatabase, getShlokasByChapter, toggleBookmark, addNote } from "../database";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import MainScreenButton from "../hooks/MainScreenButton";
import { useTheme } from "../../theme";
import * as Clipboard from 'expo-clipboard';

export default function ChapterScreen({ chapterId = "1", title = "", nextScreen = "" }) {
  const [shlokas, setShlokas] = useState([]);
  const [dbReady, setDbReady] = useState(false);
  const [selectedShloka, setSelectedShloka] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showMenuAbove, setShowMenuAbove] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const menuScaleAnim = useRef(new Animated.Value(1)).current;
  const refs = useRef({});

  const windowHeight = Dimensions.get("window").height;
  const theme = useTheme();
  const handleSwipe = useSwipeNavigation("goBack", nextScreen);

  useEffect(() => {
    const init = async () => {
      await setupDatabase();
      setDbReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (!dbReady) return;
    const fetchShlokas = async () => {
      const result = await getShlokasByChapter(String(chapterId));
      result.forEach((shloka) => {
        if (!refs.current[shloka.id]) refs.current[shloka.id] = React.createRef();
      });
      setShlokas(result);
    };
    fetchShlokas();
  }, [chapterId, dbReady]);

  const handleLongPress = (shloka, ref) => {
    if (!ref?.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ref.current.measureInWindow((x, y, width, height) => {
      setPopupPosition({ x: x + width / 2, y: y + height / 2 });
      setShowMenuAbove(y > windowHeight * 0.6);
      setSelectedShloka(shloka);
      translateYAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 7 }),
        Animated.timing(translateYAnim, { toValue: -30, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  const closePopup = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 200, useNativeDriver: true }),
      Animated.timing(translateYAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setSelectedShloka(null));
  };

  const animateMenuPress = (callback) => {
    Animated.sequence([
      Animated.timing(menuScaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(menuScaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => callback && callback());
  };

  const handleToggleStar = () =>
    animateMenuPress(async () => {
      await toggleBookmark(selectedShloka.id, selectedShloka.starred);
      const updated = await getShlokasByChapter(chapterId);
      setShlokas(updated);
      closePopup();
    });

  const handleAddNote = () =>
    animateMenuPress(() => {
      addNote(selectedShloka.id);
      closePopup();
    });

  const handleCopyShloka = () => {
    Clipboard.setStringAsync(selectedShloka.shloka);
    Alert.alert("Shloka copied to clipboard");
  };

  const handleCopyMeaning = () => {
    Clipboard.setStringAsync(selectedShloka.shloka_meaning);
    Alert.alert("Shloka meaning copied to clipboard");
  };

  const handleShareShloka = () => {
    Share.share({
      message: selectedShloka.shloka,
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateYAnim.setValue(-30 + gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 60) closePopup();
        else Animated.timing(translateYAnim, { toValue: -30, duration: 150, useNativeDriver: true }).start();
      },
    })
  ).current;

  const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 80, ...theme.background },
    title: { fontSize: 28, fontWeight: "700", ...theme.text, marginBottom: 24, textAlign: "center", letterSpacing: 1 },
    shlokaContainer: {
      padding: 16,
      backgroundColor: theme.card.backgroundColor,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.card.borderColor,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 2,
      alignItems: "center",
    },
    shlokaNumber: { fontSize: 14, color: theme.text.color, marginBottom: 6 },
    shlokaText: { fontSize: 20, fontWeight: "600", color: theme.text.color, lineHeight: 28, textAlign: "center" },
    meaningText: { fontSize: 16, color: theme.text.color, marginTop: 8, lineHeight: 24, textAlign: "center" },
    overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
    blur: { ...StyleSheet.absoluteFillObject },
    popupWrapper: {
      position: "absolute",
      width: 320,
      zIndex: 10,
      borderRadius: 28,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 20,
      elevation: 10,
    },
    popupCard: {
      backgroundColor: theme.card.backgroundColor,
      padding: 20,
      borderRadius: 24,
      alignItems: "center",
      maxWidth: "100%",
    },
    popupShloka: { fontSize: 22, fontWeight: "700", color: theme.text.color, textAlign: "center", marginBottom: 12 },
    popupMeaning: { fontSize: 18, color: theme.text.color, textAlign: "center", lineHeight: 26 },
    menu: {
      marginTop: 12,
      backgroundColor: theme.card.backgroundColor,
      borderRadius: 16,
      paddingVertical: 10,
      width: "100%",
      alignItems: "center",
    },
    menuItem: { paddingVertical: 12, width: "100%", alignItems: "center" },
    menuText: { fontSize: 18, color: theme.text.color },
  });

  if (!dbReady) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background.backgroundColor }}>
        <ActivityIndicator size="large" color={theme.text.color} />
        <Text style={{ marginTop: 10, color: theme.text.color }}>Loading chapter...</Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={handleSwipe}>
        <SafeAreaView style={[{ flex: 1 }, theme.background]}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {shlokas.map((shloka) => (
              <TouchableOpacity
                key={shloka.id}
                ref={refs.current[shloka.id]}
                onLongPress={() => handleLongPress(shloka, refs.current[shloka.id])}
                delayLongPress={150}
                style={styles.shlokaContainer}
              >
                <Text style={styles.shlokaNumber}>{shloka.id}</Text>
                {shloka.shloka.includes("[[MEANING_HERE]]") ? (
                  <>
                    <Text style={styles.shlokaText}>{shloka.shloka.split("[[MEANING_HERE]]")[0]}</Text>
                    <Text style={styles.meaningText}>{shloka.shloka_meaning}</Text>
                    <Text style={styles.shlokaText}>{shloka.shloka.split("[[MEANING_HERE]]")[1]}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.shlokaText}>{shloka.shloka}</Text>
                    {shloka.shloka_meaning?.length > 0 && (
                      <Text style={styles.meaningText}>{shloka.shloka_meaning}</Text>
                    )}
                  </>
                )}
              </TouchableOpacity>
            ))}
            <MainScreenButton />
          </ScrollView>

          {selectedShloka && (
            <Pressable style={styles.overlay} onPress={closePopup}>
              <BlurView intensity={30} style={styles.blur} />
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.popupWrapper,
                  {
                    top: popupPosition.y - 160,
                    left: popupPosition.x - 160,
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
                  },
                ]}
              >
                <View style={styles.popupCard}>
                  {selectedShloka.shloka.includes("[[MEANING_HERE]]") ? (
                    <>
                      <Text style={styles.popupShloka}>{selectedShloka.shloka.split("[[MEANING_HERE]]")[0]}</Text>
                      <Text style={styles.popupMeaning}>{selectedShloka.shloka_meaning}</Text>
                      <Text style={styles.popupShloka}>{selectedShloka.shloka.split("[[MEANING_HERE]]")[1]}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.popupShloka}>{selectedShloka.shloka}</Text>
                      <Text style={styles.popupMeaning}>{selectedShloka.shloka_meaning}</Text>
                    </>
                  )}
                </View>

                <Animated.View style={[styles.menu, showMenuAbove ? { marginBottom: 10, marginTop: 0 } : {}, { transform: [{ scale: menuScaleAnim }] }]}>
                  <TouchableOpacity onPress={handleToggleStar} style={styles.menuItem}>
                    <Text style={styles.menuText}>{selectedShloka.starred ? "⭐ Unstar" : "⭐ Star"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleAddNote} style={styles.menuItem}>
                    <Text style={styles.menuText}>📝 Add Note</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCopyShloka} style={styles.menuItem}>
                    <Text style={styles.menuText}>📋 Copy Shloka</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCopyMeaning} style={styles.menuItem}>
                    <Text style={styles.menuText}>📋 Copy Shloka Meaning</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleShareShloka} style={styles.menuItem}>
                    <Text style={styles.menuText}>🔗 Share Shloka</Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            </Pressable>
          )}
        </SafeAreaView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
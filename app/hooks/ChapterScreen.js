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
} from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { getShlokasByChapter, toggleBookmark, addNote } from "../database";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import MainScreenButton from "../hooks/MainScreenButton";
import { useTheme } from "../../theme";

export default function ChapterScreen({ chapterId = "1", title = "", nextScreen = "" }) {
  const [shlokas, setShlokas] = useState([]);
  const [selectedShloka, setSelectedShloka] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const menuScaleAnim = useRef(new Animated.Value(1)).current;
  const refs = useRef({});

  const theme = useTheme();
  const handleSwipe = useSwipeNavigation("goBack", nextScreen);

  useEffect(() => {
    const fetchShlokas = async () => {
      const result = await getShlokasByChapter(String(chapterId));
      console.log("Fetched Shlokas for Chapter:", chapterId, result);

      result.forEach((shloka) => {
        if (!refs.current[shloka.id]) {
          refs.current[shloka.id] = React.createRef();
        }
      });
      setShlokas(result);
    };
    fetchShlokas();
  }, [chapterId]);

  const handleLongPress = (shloka, ref) => {
    if (!ref?.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ref.current.measureInWindow((x, y, width, height) => {
      setPopupPosition({ x: x + width / 2, y: y + height / 2 });
      setSelectedShloka(shloka);
      translateYAnim.setValue(0);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          tension: 40,
        }),
        Animated.timing(translateYAnim, {
          toValue: -30,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closePopup = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setSelectedShloka(null));
  };

  const animateMenuPress = async (callback) => {
    Animated.sequence([
      Animated.timing(menuScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(menuScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
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

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateYAnim.setValue(-30 + gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 60) {
          closePopup();
        } else {
          Animated.timing(translateYAnim, {
            toValue: -30,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

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
      letterSpacing: 1,
    },
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
    shlokaNumber: {
      fontSize: 14,
      color: theme.text.color,
      marginBottom: 6,
      textAlign: "center",
    },
    shlokaText: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text.color,
      lineHeight: 28,
      textAlign: "center",
    },
    meaningText: {
      fontSize: 16,
      color: theme.text.color,
      marginTop: 8,
      lineHeight: 24,
      textAlign: "center",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
    },
    blur: {
      ...StyleSheet.absoluteFillObject,
      position: "absolute",
    },
    popupWrapper: {
      position: "absolute",
      width: 300,
      zIndex: 10,
      borderRadius: 24,
      alignItems: "center",
    },
    popupShloka: {
      backgroundColor: theme.card.backgroundColor,
      padding: 18,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 10,
      elevation: 6,
    },
    popupText: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.text.color,
      textAlign: "center",
    },
    menu: {
      marginTop: 10,
      backgroundColor: theme.card.backgroundColor,
      borderRadius: 16,
      paddingVertical: 12,
      width: "100%",
      alignItems: "center",
    },
    menuItem: {
      paddingVertical: 10,
      width: "100%",
      alignItems: "center",
    },
    menuText: {
      fontSize: 18,
      color: theme.text.color,
    },
  });

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
                <Text style={styles.shlokaText}>{shloka.shloka}</Text>
                {shloka.shloka_meaning && (
                  <Text style={styles.meaningText}>{shloka.shloka_meaning}</Text>
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
                    top: popupPosition.y - 100,
                    left: popupPosition.x - 150,
                    opacity: fadeAnim,
                    transform: [
                      { scale: scaleAnim },
                      { translateY: translateYAnim },
                    ],
                  },
                ]}
              >
                <View style={styles.popupShloka}>
                  <Text style={styles.popupText}>{selectedShloka.shloka}</Text>
                </View>
                <Animated.View style={[styles.menu, { transform: [{ scale: menuScaleAnim }] }]}>
                  <TouchableOpacity onPress={handleToggleStar} style={styles.menuItem}>
                    <Text style={styles.menuText}>
                      {selectedShloka.starred ? "⭐ Unstar" : "⭐ Star"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleAddNote} style={styles.menuItem}>
                    <Text style={styles.menuText}>📝 Add Note</Text>
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

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
  Easing,
} from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { setupDatabase, getShlokasByChapter, toggleBookmark, addNote } from "../database";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import MainScreenButton from "../hooks/MainScreenButton";
import { useTheme } from "../../theme";
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



export default function ChapterScreen({ chapterId = "1", title = "", nextScreen = "" }) {
  const [shlokas, setShlokas] = useState([]);
  const [dbReady, setDbReady] = useState(false);
  const [selectedShloka, setSelectedShloka] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showMenuAbove, setShowMenuAbove] = useState(false);
  const [popupHeight, setPopupHeight] = useState(0);
  const [finalPosition, setFinalPosition] = useState({ top: 0, left: 0 });
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const menuScaleAnim = useRef(new Animated.Value(1)).current;
  const refs = useRef({});

  const windowHeight = Dimensions.get("window").height;
  const theme = useTheme();
  const handleSwipe = useSwipeNavigation("goBack", nextScreen);

  const safeMargin = 12;
  const screenTop = safeMargin + insets.top;
  const screenBottom = windowHeight - safeMargin - insets.bottom;

  const calculatePosition = (height) => {
    if (!selectedShloka) return;
    
    const desiredTop = popupPosition.y - height / 2;
    const desiredLeft = Math.max(popupPosition.x - 160, safeMargin); 
    
    // Clamp the vertical position to keep within screen bounds
    const clampedY = Math.min(
      Math.max(desiredTop, screenTop),
      screenBottom - height
    );

    // Store the final position to prevent layout shifts
    setFinalPosition({
      top: clampedY,
      left: desiredLeft
    });
  };

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

  // More subtle, slower animations with completion callback
  const animatePopupAppearance = () => {
    // Make sure to reset any in-progress animations
    translateYAnim.stopAnimation();
    scaleAnim.stopAnimation();
    fadeAnim.stopAnimation();
    
    // Reset all animations - Start with smaller initial values for subtlety
    translateYAnim.setValue(8);    // Reduced starting position
    scaleAnim.setValue(0.96);      // Start closer to final scale
    fadeAnim.setValue(0);
    
    Animated.parallel([
      // Quick fade in
      Animated.timing(fadeAnim, { 
        toValue: 1, 
        duration: 180,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }),
      
      // More controlled position animation
      Animated.spring(translateYAnim, { 
        toValue: -20,
        useNativeDriver: true,
        tension: 120,
        friction: 15,
        velocity: -0.5
      }),
      
      // Very subtle scale animation
      Animated.spring(scaleAnim, { 
        toValue: 1, 
        useNativeDriver: true, 
        tension: 110,
        friction: 14,
        velocity: 1
      })
    ]).start(() => {
      // Explicitly set final values to ensure stability
      translateYAnim.setValue(-20);
      scaleAnim.setValue(1);
      fadeAnim.setValue(1);
    });
  };

  const handleLongPress = (shloka, ref) => {
    if (!ref?.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ref.current.measureInWindow((x, y, width, height) => {
      setPopupPosition({ x: x + width / 2, y: y + height / 2 });
      const estimatedCardHeight = 200;
      const estimatedMenuHeight = 180;

      const spaceBelow = windowHeight - y;
      const spaceAbove = y;

      setShowMenuAbove(spaceBelow < estimatedMenuHeight + 40); // show above if not enough space

      // Set the selected shloka first, before any animations
      setSelectedShloka(shloka);
      
      // Use a slight delay to let layout calculations complete
      setTimeout(() => {
        animatePopupAppearance();
      }, 10);
    });
  };

  const closePopup = () => {
    // Simple fade out animation
    Animated.parallel([
      Animated.timing(fadeAnim, { 
        toValue: 0, 
        duration: 140, 
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }),
      Animated.timing(scaleAnim, { 
        toValue: 0.94, 
        duration: 140, 
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }),
      Animated.timing(translateYAnim, { 
        toValue: 0, 
        duration: 140, 
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      })
    ]).start(() => {
      setSelectedShloka(null);
      // Reset animations for next time
      translateYAnim.setValue(0);
    });
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
      borderRadius: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 16,
      elevation: 10,
      backfaceVisibility: 'hidden',
      willChange: 'transform',
    },
    popupCard: {
      backgroundColor: theme.card.backgroundColor,
      padding: 20,
      borderRadius: 14,
      alignItems: "center",
      maxWidth: "100%",
    },
    popupShloka: { fontSize: 22, fontWeight: "700", color: theme.text.color, textAlign: "center", marginBottom: 12 },
    popupMeaning: { fontSize: 18, color: theme.text.color, textAlign: "center", lineHeight: 26 },
    menu: {
      marginTop: 8,
      backgroundColor: theme.card.backgroundColor,
      borderTopWidth: 1,
      borderTopColor: 'rgba(60,60,60,0.1)',
      borderRadius: 14,
      paddingTop: 6,
      paddingBottom: 8,
      width: "100%",
    },
    menuItem: { 
      paddingVertical: 10,
      width: "100%", 
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(60,60,60,0.05)',
    },
    menuText: { fontSize: 17, fontWeight: "500", color: theme.text.color },
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
                onLayout={(event) => {
                  const { height } = event.nativeEvent.layout;
                  setPopupHeight(height);
                  calculatePosition(height);
                }}
                style={[
                  styles.popupWrapper,
                  {
                    position: 'absolute',
                    top: finalPosition.top,
                    left: finalPosition.left,
                    opacity: fadeAnim,
                    transform: [
                      { scale: scaleAnim }, 
                      { translateY: translateYAnim },
                    ],
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
                      {selectedShloka.shloka_meaning && selectedShloka.shloka_meaning.length > 0 && (
                        <Text style={styles.popupMeaning}>{selectedShloka.shloka_meaning}</Text>
                      )}
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
                  <TouchableOpacity onPress={handleShareShloka} style={[styles.menuItem, { borderBottomWidth: 0 }]}>
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
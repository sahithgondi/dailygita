import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { getShlokasByChapter, toggleBookmark, addNote } from "../database";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import MainScreenButton from "../hooks/MainScreenButton";

export default function GitaDhyana() {
  const [shlokas, setShlokas] = useState([]);
  const [selectedShloka, setSelectedShloka] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // For smooth transitions

  const handleSwipe = useSwipeNavigation("goBack", "Chapter1");

  useEffect(() => {
    const fetchShlokas = async () => {
      const result = await getShlokasByChapter("A");
      setShlokas(result);
    };
    fetchShlokas();
  }, []);

  const handleLongPress = (shloka) => {
    setSelectedShloka(shloka);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closePopup = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedShloka(null));
  };

  const handleToggleStar = async () => {
    await toggleBookmark(selectedShloka.id, selectedShloka.starred);
    const updated = await getShlokasByChapter("A");
    setShlokas(updated);
    closePopup();
  };

  const handleAddNote = () => {
    addNote(selectedShloka.id);
    closePopup();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={handleSwipe}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Gita Dhyana</Text>

            {shlokas.map((shloka) => (
              <TouchableOpacity
                key={shloka.id}
                onLongPress={() => handleLongPress(shloka)}
                delayLongPress={200}
                style={styles.shlokaContainer}
              >
                <Text style={styles.shlokaNumber}>Shloka {shloka.id}</Text>
                <Text style={styles.shlokaText}>{shloka.shloka}</Text>
                {shloka.shloka_meaning && (
                  <Text style={styles.meaningText}>{shloka.shloka_meaning}</Text>
                )}
              </TouchableOpacity>
            ))}

            <MainScreenButton />
          </ScrollView>

          {/* Blurred Background + Popup */}
          {selectedShloka && (
            <Pressable style={styles.overlay} onPress={closePopup}>
              <BlurView intensity={30} style={styles.blur}>
                <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
                  <View style={styles.popupShloka}>
                    <Text style={styles.popupText}>{selectedShloka.shloka}</Text>
                  </View>
                  <View style={styles.menu}>
                    <TouchableOpacity onPress={handleToggleStar} style={styles.menuItem}>
                      <Text style={styles.menuText}>{selectedShloka.starred ? "⭐ Unstar" : "⭐ Star"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddNote} style={styles.menuItem}>
                      <Text style={styles.menuText}>📝 Add Note</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </BlurView>
            </Pressable>
          )}
        </SafeAreaView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 24,
    textAlign: "center",
    letterSpacing: 1,
  },
  shlokaContainer: {
    padding: 16,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2e2e2e",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  shlokaNumber: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 6,
    fontStyle: "italic",
  },
  shlokaText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    lineHeight: 28,
  },
  meaningText: {
    fontSize: 16,
    color: "#bbb",
    marginTop: 8,
    lineHeight: 24,
  },

  // Overlay & Blur Effect
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  blur: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  // Pop-up styling
  popup: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    borderRadius: 20,
  },
  popupShloka: {
    backgroundColor: "#1e1e1e",
    padding: 16,
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
    color: "#fff",
    textAlign: "center",
  },

  // Menu
  menu: {
    marginTop: 10,
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    paddingVertical: 12,
    width: "70%",
    alignItems: "center",
  },
  menuItem: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  menuText: {
    fontSize: 18,
    color: "#fff",
  },
});


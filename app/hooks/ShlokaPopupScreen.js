import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

const { height } = Dimensions.get("window");

export default function ShlokaPopupScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { shloka } = route.params || {};

  const popupY = useSharedValue(height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    popupY.value = withSpring(0, { damping: 20 });
    opacity.value = withTiming(1);
  }, []);

  const animatedPopupStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: popupY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleClose = () => {
    popupY.value = withTiming(height, {}, () => runOnJS(navigation.goBack)());
    opacity.value = withTiming(0);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.popupContainer, animatedPopupStyle]}>
        <View style={styles.popupCard}>
          <Text style={styles.shlokaText}>{shloka?.shloka}</Text>
          <Text style={styles.shlokaMeaning}>{shloka?.shloka_meaning}</Text>
        </View>

        <View style={styles.menuBox}>
          <Pressable style={styles.menuItem} onPress={() => console.log("Bookmark")}> 
            <Text style={styles.menuText}>⭐ Bookmark</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={() => console.log("Add Note")}> 
            <Text style={styles.menuText}>📝 Add Note</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  popupContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
  },
  popupCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  shlokaText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  shlokaMeaning: {
    fontSize: 16,
    color: "#ccc",
    fontStyle: "italic",
    textAlign: "center",
  },
  menuBox: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  menuItem: {
    paddingVertical: 10,
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#fff",
  },
});

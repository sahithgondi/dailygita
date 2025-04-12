// 📄 ChapterScreen.js (Enhanced Popup Version with [[MEANING_HERE]] support)
import React, { useEffect, useRef, useState, useCallback } from "react";
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
  const [popupHeight, setPopupHeight] = useState(200); // Pre-set an estimated height
  const [finalPosition, setFinalPosition] = useState({ top: 0, left: 0, triangleOffset: 0 });
  const [shlokaItemScale, setShlokaItemScale] = useState(null); // For the pressed item animation
  const [calculationComplete, setCalculationComplete] = useState(false);
  const [contentPosition, setContentPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  
  // Non-native driver animations (JS driven)
  const [blurIntensity] = useState(new Animated.Value(0)); // Must use JS driver for BlurView
  
  // Native driver animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const contentScaleAnim = useRef(new Animated.Value(0.95)).current;
  const menuScaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Value to track without animating directly
  const shadowOpacity = useRef(new Animated.Value(0)).current;
  
  const refs = useRef({});
  // Store the currently pressed item ref for animating the scale
  const pressedItemRef = useRef(null);

  const insets = useSafeAreaInsets();

  // Get screen dimensions correctly
  const windowDimensions = Dimensions.get("window");
  const windowWidth = windowDimensions.width;
  const windowHeight = windowDimensions.height;
  
  const theme = useTheme();
  const handleSwipe = useSwipeNavigation("goBack", nextScreen);

  const safeMargin = 12;
  const screenTop = safeMargin + insets.top;
  const screenBottom = windowHeight - safeMargin - insets.bottom;

  // Handle long press on a shloka to show the popup menu
  const handleLongPress = useCallback((shloka) => {
    // Safety check to make sure shloka exists and has an id
    if (!shloka || !shloka.id) {
      console.error('Invalid shloka object:', shloka);
      return;
    }
    
    // Get reference to the pressed item
    const ref = refs.current[shloka.id];
    if (!ref || !ref.current) return;
    
    pressedItemRef.current = ref.current;
    
    // Initial haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // PHASE 1: Scale up the pressed item
    setShlokaItemScale(ref.current);
    
    // Animate the pressed item to be slightly larger
    Animated.timing(new Animated.Value(1), {
      toValue: 1.05, // Scale to 105%
      duration: 120, // Slow, deliberate growth
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
    
    // Measure position for the menu using the proper React Native method
    ref.current.measureInWindow((x, y, width, height) => {
      // Store the original item position for menu placement
      const itemPosition = {
        x,
        y,
        width,
        height
      };
      
      // Cache the position for calculating menu placement
      setPopupPosition({ 
        x, 
        y, 
        width, 
        height 
      });
      
      // Content popup should be positioned directly on top of the original item
      // with slight adjustments for better appearance
      const contentPos = {
        top: y,
        left: x,
        width: width,
        height: height
      };
      
      // Set content position first, ensuring it's available for menu positioning
      setContentPosition(contentPos);
      
      // Calculate available space accurately
      const spaceBelow = windowHeight - (y + height) - insets.bottom;
      const spaceAbove = y - insets.top;
      
      console.log('Space calculation:', { 
        spaceBelow, 
        spaceAbove, 
        windowHeight, 
        itemBottom: y + height,
        insets,
        originalItemPosition: itemPosition,
        contentPopupPosition: contentPos
      });
      
      // Use clear threshold based on actual space
      const showAbove = spaceBelow < 200 && spaceAbove > 150;
      setShowMenuAbove(showAbove);
      
      // PHASE 2: Set the selected shloka but delay showing the menu
      setSelectedShloka(shloka);
      
      // PHASE 3: After a brief pause, calculate and show the menu
      setTimeout(() => {
        setCalculationComplete(true);
        
        // Second haptic right when menu appears
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        // Reset animation values
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.8);
        menuScaleAnim.setValue(0.9);
        shadowOpacity.setValue(0);
        translateYAnim.setValue(0);
        contentFadeAnim.setValue(0);
        contentScaleAnim.setValue(0.92);
        
        // Force recalculation of position
        calculatePosition(popupHeight);
        
        // Create a staggered animation sequence for iOS-like emergence
        Animated.sequence([
          // First blur the background smoothly
          Animated.timing(blurIntensity, {
            toValue: 1,
            duration: 120,
            useNativeDriver: false,
            easing: Easing.out(Easing.quad),
          }),
          
          // Then animate both content and menu
          Animated.parallel([
            // Content popup appears first
            Animated.timing(contentFadeAnim, {
              toValue: 1,
              duration: 120,
              useNativeDriver: true,
              easing: Easing.out(Easing.quad),
            }),
            
            Animated.spring(contentScaleAnim, {
              toValue: 1,
              useNativeDriver: true,
              tension: 120,
              friction: 10,
            }),
            
            // Then animate the menu components in sequence - with more subtle timing
            Animated.stagger(20, [ // Shorter stagger time (was 40)
              // Fade in the container
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 120,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad),
              }),
              
              // Expand the container with smooth timing
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 50, // Simple timing instead of spring
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
              }),
              
              // Show the menu items with a simple fade in instead of bounce
              Animated.timing(menuScaleAnim, {
                toValue: 1,
                duration: 120,     // Longer, smoother animation
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic), // Cubic easing for smoother finish
              }),
            ]),
          ]),
        ]).start(() => {
          // Animation complete - ensure final values
          fadeAnim.setValue(1);
          scaleAnim.setValue(1);
          menuScaleAnim.setValue(1);
          shadowOpacity.setValue(1); // Just set the value directly, don't animate it
          contentFadeAnim.setValue(1);
          contentScaleAnim.setValue(1);
        });
      }, 80); // Brief pause to mimic iOS "thinking" about placement
    });
  }, []);

  // Calculate the final position for the popup
  const calculatePosition = (height) => {
    if (!selectedShloka || !calculationComplete || !contentPosition.width) return;
    
    try {
      // Get window dimensions again to ensure they're correct
      const windowDim = Dimensions.get('window');
      
      // Use content position as our reference point
      const itemRect = { ...contentPosition };
      
      console.log('Positioning menu - Content dimensions:', {
        contentTop: itemRect.top,
        contentHeight: itemRect.height,
        menuHeight: height,
        gapAbove: 12,
        gapBelow: 8
      });
      
      // Calculate available space
      const spaceBelow = windowDim.height - (itemRect.top + itemRect.height) - insets.bottom;
      const spaceAbove = itemRect.top - insets.top;
      
      // Determine if we should show above or below
      const useAbove = spaceBelow < 200 && spaceAbove > 150;
      setShowMenuAbove(useAbove);
      
      // Calculate positions based on whether to show above or below
      let top, left;
      
      // Use different gap values for above vs below to account for visual balance
      const menuGapAbove = 20; // More space when above to avoid feeling crowded
      const menuGapBelow = 20; // Much more space when below to address the excess space issue
      
      if (useAbove) {
        // Position above with more gap
        top = itemRect.top - height - menuGapAbove;
      } else {
        // Position below with less gap - use the ACTUAL measured height
        top = itemRect.top + itemRect.height + menuGapBelow;
      }
      
      // Center horizontally with the item
      const menuWidth = 320; // Hard-coded menu width
      left = itemRect.left + (itemRect.width / 2) - (menuWidth / 2);
      
      // Ensure left edge stays on screen
      if (left < 20) left = 20;
      
      // Ensure right edge stays on screen
      if (left + menuWidth > windowDim.width - 20) {
        left = windowDim.width - menuWidth - 20;
      }
      
      // Calculate triangle position
      const itemCenterX = itemRect.left + (itemRect.width / 2);
      const triangleOffset = itemCenterX - left - 10; // 10 = half triangle width
      
      console.log('Final position calculated:', {
        useAbove,
        dimensions: windowDim,
        menuPosition: {top, left},
        triangleOffset,
        itemRect
      });
      
      setFinalPosition({ 
        top, 
        left,
        triangleOffset
      });
    } catch (error) {
      console.error('Error calculating position:', error);
    }
  };

  // Database setup and shlokas fetching
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

  // Close the popup with reverse animation
  const closePopup = () => {
    // Animate the pressed item back to normal size
    if (shlokaItemScale) {
      // Create a new animation to avoid conflicting with previous animations
      const scaleBackAnim = new Animated.Value(1.05);
      Animated.timing(scaleBackAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }).start();
    }
    
    // Reverse animation sequence
    Animated.parallel([
      // Fade out everything
      Animated.timing(fadeAnim, { 
        toValue: 0, 
        duration: 120, 
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }),
      
      // Scale down slightly
      Animated.timing(scaleAnim, { 
        toValue: 0.8, 
        duration: 120, 
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }),
      
      // Also animate the content popup out
      Animated.timing(contentFadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }),
      
      Animated.timing(contentScaleAnim, {
        toValue: 0.95,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }),
      
      // Blur out background (blurIntensity must use JS driver since BlurView doesn't support native)
      Animated.timing(blurIntensity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: false, // Must be false for blur
        easing: Easing.out(Easing.quad),
      }),
    ]).start(() => {
      // Cleanup separately
      // This is important: we need to manage shadowOpacity separately
      // since it's used with useNativeDriver: false elsewhere
      shadowOpacity.setValue(0);
      
      // Reset state values - must be done AFTER all animations complete
      setSelectedShloka(null);
      setCalculationComplete(false);
      setShlokaItemScale(null);
      pressedItemRef.current = null;
    });
  };

  const animateMenuPress = (callback) => {
    Animated.sequence([
      Animated.timing(menuScaleAnim, { 
        toValue: 0.99,  // Much less scaling (was 0.98)
        duration: 30,   // Even faster animation (was 80)
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(menuScaleAnim, { 
        toValue: 1, 
        duration: 60,   // Even faster animation (was 80)
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start(() => callback && callback());
  };

  const handleToggleStar = () =>
    animateMenuPress(async () => {
      if (!selectedShloka || !selectedShloka.id) return;
      await toggleBookmark(selectedShloka.id, selectedShloka.starred);
      const updated = await getShlokasByChapter(chapterId);
      setShlokas(updated);
      closePopup();
    });

  const handleAddNote = () =>
    animateMenuPress(() => {
      if (!selectedShloka || !selectedShloka.id) return;
      addNote(selectedShloka.id);
      closePopup();
    });

  const handleCopyShloka = () => {
    if (!selectedShloka || !selectedShloka.shloka) return;
    Clipboard.setStringAsync(selectedShloka.shloka);
    Alert.alert("Shloka copied to clipboard");
  };

  const handleCopyMeaning = () => {
    if (!selectedShloka || !selectedShloka.shloka_meaning || selectedShloka.shloka_meaning.trim() === '') return;
    Clipboard.setStringAsync(selectedShloka.shloka_meaning);
    Alert.alert("Shloka meaning copied to clipboard");
  };

  const handleShareShloka = () => {
    if (!selectedShloka || !selectedShloka.shloka) return;
    Share.share({
      message: selectedShloka.shloka,
    });
  };

  // Reset the calculated position immediately when contentPosition changes
  useEffect(() => {
    if (contentPosition.width && contentPosition.height && calculationComplete) {
      // Recalculate menu position whenever content position changes
      calculatePosition(popupHeight);
    }
  }, [contentPosition, calculationComplete]);

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
    overlay: { 
      ...StyleSheet.absoluteFillObject, 
      justifyContent: "center", 
      alignItems: "center" 
    },
    blur: { 
      ...StyleSheet.absoluteFillObject,
    },
    shlokaItemScaled: {
      transform: [{ scale: 1.05 }],
      zIndex: 5,
    },
    popupWrapper: {
      position: "absolute",
      width: 320,
      zIndex: 20, // Higher than content popup
      borderRadius: 13,
      backgroundColor: theme.card.backgroundColor,
      overflow: 'hidden',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 15,
      shadowOpacity: 0.3,
      elevation: 8,
    },
    popupShadow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 13,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 15,
      elevation: 10,
    },
    triangleUp: {
      position: 'absolute',
      top: -10,
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: theme.card.backgroundColor,
      zIndex: 100,
    },
    triangleDown: {
      position: 'absolute',
      bottom: -10,
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: theme.card.backgroundColor,
      zIndex: 100,
    },
    popupCard: {
      padding: 16,
      borderRadius: 13,
      alignItems: "center",
      maxWidth: "100%",
      borderBottomWidth: 0.5,
      borderBottomColor: 'rgba(60,60,60,0.1)', // Very subtle divider
      overflow: 'hidden',
    },
    popupShloka: { 
      fontSize: 22, 
      fontWeight: "600", 
      color: theme.text.color, 
      textAlign: "center", 
      marginBottom: 12,
    },
    popupMeaning: { 
      fontSize: 17, 
      color: theme.text.color, 
      textAlign: "center", 
      lineHeight: 22,
    },
    menu: {
      width: "100%",
      paddingVertical: 4,
      overflow: 'hidden',
    },
    menuItem: { 
      paddingVertical: 11,
      width: "100%", 
      alignItems: "center", 
      flexDirection: 'row',
      justifyContent: 'center',
      borderBottomWidth: 0.3,
      borderBottomColor: 'rgba(60,60,60,0.05)',
    },
    menuText: { 
      fontSize: 16, 
      fontWeight: "500", 
      color: theme.text.color,
      letterSpacing: 0.1,
    },
    contentPopup: {
      position: 'absolute',
      backgroundColor: theme.card.backgroundColor,
      borderRadius: 13,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      shadowOpacity: 0.2,
      elevation: 6,
      zIndex: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
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
                onLongPress={() => handleLongPress(shloka)}
                delayLongPress={150}
                style={[
                  styles.shlokaContainer,
                  shlokaItemScale === refs.current[shloka.id] && styles.shlokaItemScaled,
                  shlokaItemScale === refs.current[shloka.id] && { opacity: 0 } // Hide the original shloka
                ]}
              >
                <Text style={styles.shlokaNumber}>{shloka.id}</Text>
                {shloka.shloka && shloka.shloka.includes("[[MEANING_HERE]]") ? (
                  <>
                    <Text style={styles.shlokaText}>{shloka.shloka.split("[[MEANING_HERE]]")[0]}</Text>
                    <Text style={styles.meaningText}>{shloka.shloka_meaning || ''}</Text>
                    <Text style={styles.shlokaText}>{shloka.shloka.split("[[MEANING_HERE]]")[1]}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.shlokaText}>{shloka.shloka || ''}</Text>
                    {shloka.shloka_meaning && shloka.shloka_meaning.length > 0 && (
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
              <Animated.View style={[
                styles.blur, 
                {opacity: blurIntensity}
              ]}>
                <BlurView intensity={50} style={StyleSheet.absoluteFill} />
              </Animated.View>
              
              {/* Shloka Content Popup - positioned at the original shloka location */}
              <Animated.View
                style={[
                  styles.contentPopup,
                  {
                    top: contentPosition.top,
                    left: contentPosition.left,
                    width: contentPosition.width,
                    opacity: contentFadeAnim,
                    transform: [{ scale: contentScaleAnim }],
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    backgroundColor: theme.card.backgroundColor,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                    marginBottom: 0,
                    marginTop: 0,
                  }
                ]}
                onLayout={(event) => {
                  // Get the actual rendered height of the content popup
                  const { height, width } = event.nativeEvent.layout;
                  
                  // Only update if dimensions have changed
                  if (Math.abs(height - contentPosition.height) > 1 || 
                      Math.abs(width - contentPosition.width) > 1) {
                    // Update content position with actual height and width
                    setContentPosition(prev => ({
                      ...prev,
                      height,
                      width
                    }));
                    
                    // Force recalculation of menu position with new dimensions
                    calculatePosition(popupHeight);
                  }
                }}
              >
                {selectedShloka && selectedShloka.shloka && selectedShloka.shloka.includes("[[MEANING_HERE]]") ? (
                  <>
                    <Text style={[styles.popupShloka, { fontSize: 18 }]}>{selectedShloka.shloka.split("[[MEANING_HERE]]")[0]}</Text>
                    <Text style={[styles.popupMeaning, { fontSize: 15 }]}>{selectedShloka.shloka_meaning || ''}</Text>
                    <Text style={[styles.popupShloka, { fontSize: 18 }]}>{selectedShloka.shloka.split("[[MEANING_HERE]]")[1]}</Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.popupShloka, { fontSize: 18 }]}>{selectedShloka && selectedShloka.shloka || ''}</Text>
                    {selectedShloka && selectedShloka.shloka_meaning && selectedShloka.shloka_meaning.length > 0 && (
                      <Text style={[styles.popupMeaning, { fontSize: 15 }]}>{selectedShloka.shloka_meaning}</Text>
                    )}
                  </>
                )}
              </Animated.View>
              
              {/* Separate menu that appears above or below the shloka */}
              {calculationComplete && (
                <Animated.View
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    if (popupHeight !== height) {
                      setPopupHeight(height);
                      calculatePosition(height);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: finalPosition.top,
                    left: finalPosition.left,
                    width: 320,
                    backgroundColor: theme.card.backgroundColor,
                    borderRadius: 13,
                    opacity: fadeAnim,
                    zIndex: 99,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowRadius: 15,
                    shadowOpacity: 0.3, // Use fixed value instead of animated
                    elevation: 8,
                    transform: [
                      { scale: scaleAnim },
                    ],
                  }}
                >
                  {/* Triangle indicator pointing to the selected item */}
                  {showMenuAbove ? (
                    <View style={[styles.triangleDown, { left: finalPosition.triangleOffset }]} />
                  ) : (
                    <View style={[styles.triangleUp, { left: finalPosition.triangleOffset }]} />
                  )}
                  
                  <Animated.View
                    style={[
                      styles.menu,
                      { transform: [{ scale: menuScaleAnim }] }
                    ]}
                  >
                    <TouchableOpacity onPress={handleToggleStar} style={styles.menuItem}>
                      <Text style={styles.menuText}>{selectedShloka.starred ? "⭐ Unstar" : "⭐ Star"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddNote} style={styles.menuItem}>
                      <Text style={styles.menuText}>📝 Add Note</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCopyShloka} style={styles.menuItem}>
                      <Text style={styles.menuText}>📋 Copy Shloka</Text>
                    </TouchableOpacity>
                    {selectedShloka.shloka_meaning && selectedShloka.shloka_meaning.trim().length > 0 && (
                      <TouchableOpacity onPress={handleCopyMeaning} style={styles.menuItem}>
                        <Text style={styles.menuText}>📋 Copy Shloka Meaning</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={handleShareShloka} style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                      <Text style={styles.menuText}>🔗 Share Shloka</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </Animated.View>
              )}
            </Pressable>
          )}
        </SafeAreaView>
      </PanGestureHandler>
    </GestureHandlerRootView>  
  );
}
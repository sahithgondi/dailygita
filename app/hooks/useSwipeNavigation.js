import { useNavigation } from "@react-navigation/native";

export const useSwipeNavigation = (prevScreen, nextScreen) => {
  const navigation = useNavigation();

  const handleSwipe = ({ nativeEvent }) => {
    if (nativeEvent.translationX > 50) {
      if (prevScreen === "goBack") {
        navigation.goBack();
      } else if (prevScreen) {
        navigation.navigate(prevScreen);
      }
    } else if (nativeEvent.translationX < -50 && nextScreen) {
      navigation.navigate(nextScreen);
    }
  };

  return handleSwipe;
};
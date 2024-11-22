import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { Image, View } from "react-native"
import AuthPage from "./Login"
import { useFonts } from 'expo-font';
import { useEffect } from 'react';


SplashScreen.preventAutoHideAsync();
export default function () {

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  useEffect(() => {

    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }



  return (
    <View style={{ flex: 1 }}>
      <AuthPage />
    </View>
  )
}
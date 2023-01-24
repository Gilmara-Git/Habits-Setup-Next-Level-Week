import './src/lib/dayjs';  // this is applying the locale configured, it could be pt-br, but mine is en-us
import { StatusBar } from "react-native";
import Loading from "./src/components/Loading";
import { Routes } from './src/routes'
import { useFonts } from 'expo-font';

import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <>
      <Routes />
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
    
    </>
  );
}

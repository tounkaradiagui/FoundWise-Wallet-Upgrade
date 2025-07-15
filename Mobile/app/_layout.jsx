import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import Toast from "react-native-toast-message";
import {StatusBar} from "react-native"

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
        <Toast/>
      </SafeScreen>
      <StatusBar backgroundColor="#078ECB" color="#fff" />
    </ClerkProvider>
  );
}

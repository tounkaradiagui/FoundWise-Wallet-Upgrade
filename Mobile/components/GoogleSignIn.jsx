import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
  const { startSSOFlow } = useSSO();

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "mobile", // Remplace par le scheme de ton app (voir commentaire ci-dessous)
        }),
      });

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.log("Erreur OAuth Google:", JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow]);

  return (
    <TouchableOpacity
      style={styles.google}
      onPress={handleGoogleSignIn}
      accessible={true}
      accessibilityLabel="Continuer avec Google"
    >
      <Ionicons name="logo-google" size={24} color="white" />
      <Text style={styles.buttonText}>Continuer avec Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  google: {
    backgroundColor: "crimson",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

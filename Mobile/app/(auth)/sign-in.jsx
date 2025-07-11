import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Divider from "@/components/Divider";
import GoogleSignIn from "@/components/GoogleSignIn";
import Toast from "react-native-toast-message";
import NetInfo from "@react-native-community/netinfo";
import getClerkErrorMessage from "@/utils/translateClerkError";
import * as WebBrowser from 'expo-web-browser';

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    const state = await NetInfo.fetch();
    // Vérifier la connexion de l'utilisateur
    if (!state.isConnected) {
      Toast.show({
        text1: "Erreur de connexion",
        text2: "Veuillez vérifier votre connexion Internet.",
        type: "error",
        position: "top",
        visibilityTime: 3000,
      });
      setLoading(false);
      return;
    }

    if (Platform.OS !== "web") {
      await WebBrowser.coolDownAsync();
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/dashboard");
        Toast.show({
          type: "success",
          text1: "Connexion réussie",
          text2: "Bienvenue dans votre tableau de bord.",
        });
      } else {
        // Si la connexion n'est pas complète, on peut afficher un message ou gérer l'état
        // par exemple, en demandant à l'utilisateur de vérifier son e-mail
        Toast.show({
          type: "info",
          text1: "Connexion en attente",
          text2: "Veuillez vérifier votre e-mail pour finaliser la connexion.",
        });
        // console.log("Connexion incomplète", signInAttempt);
      }
    } catch (err) {
      console.log("SignIn error:", JSON.stringify(err, null, 2));
      // Gérer les erreurs de connexion
      const errorCode = err?.errors?.[0]?.code || "";
      const fallback =
        err?.errors?.[0]?.message || "Une erreur s'est produite.";

      Toast.show({
        type: "error",
        text1: "Erreur de connexion",
        text2: getClerkErrorMessage(errorCode, fallback),
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = emailAddress.length > 3 && password.length > 3;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.statusBarBackground} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image
          source={require("@/assets/images/myOfficialLogo.png")}
          resizeMode="contain"
          style={styles.logo}
        />

        <Text style={styles.title}>Bienvenue 👋</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="email" size={22} color="black" />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="Adresse email"
              placeholderTextColor="#A0AEC0"
              value={emailAddress}
              onChangeText={setEmailAddress}
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="lock" size={22} color="black" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Mot de passe"
              placeholderTextColor="#A0AEC0"
              style={styles.textInput}
            />
            <MaterialCommunityIcons
              onPress={togglePasswordVisibility}
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>

        <View style={styles.forgotPassword}>
          <Link href="/forgot-password">
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </Link>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, !isFormValid && styles.disabledButton]}
            onPress={onSignInPress}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Connexion</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Vous n'avez pas de compte ?
            <Link style={styles.link} href={"/sign-up"}>
              {" "}
              S'inscrire
            </Link>
          </Text>

          <Divider />

          <GoogleSignIn />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight,
    backgroundColor: "#078ECB",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 25,
    color: "#111827",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    color: "#078ECB",
    fontWeight: "600",
  },
  buttonContainer: {
    alignItems: "center",
    gap: 20,
  },
  submitButton: {
    backgroundColor: "#078ECB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    width: "100%",
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupText: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
  },
  link: {
    color: "#078ECB",
    fontWeight: "700",
  },
});

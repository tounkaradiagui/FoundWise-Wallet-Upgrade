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

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/dashboard");
      } else {
        console.warn("Connexion incomplète", signInAttempt);
      }
    } catch (err) {
      // Traduction basique des messages d'erreur courants
      const errorCode = err?.errors?.[0]?.code || "";
      const message = err?.errors?.[0]?.message || "";

      const translated = {
        form_identifier_not_found: "Adresse e-mail introuvable.",
        form_password_incorrect: "Mot de passe incorrect.",
        form_param_format_invalid: "Format invalide dans le formulaire.",
        form_password_pwned:
          "Mot de passe compromis. Veuillez en choisir un autre.",
        form_identifier_exists: "Cette adresse est déjà utilisée.",
        form_password_too_short: "Mot de passe trop court.",
      };

      const fallback = "Une erreur s'est produite. Veuillez réessayer.";
      const errorMessage = translated[errorCode] || fallback;

      Toast.show({
        type: "error",
        text1: "Erreur de connexion",
        text2: errorMessage,
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
    width: 120,
    height: 120,
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

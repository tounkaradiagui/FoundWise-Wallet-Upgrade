import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import Verify from "./verify";

export default function SignUp() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);

  const [loading, setLoading] = useState(false);
  const isFormValid =
    emailAddress.length > 3 &&
    password.length > 3 &&
    confirmPassword.length > 3 &&
    firstname.length > 1 &&
    lastname.length > 1;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const translatedErrors = {
    form_identifier_exists: "Cette adresse e-mail est déjà utilisée.",
    form_password_too_short: "Le mot de passe est trop court.",
    form_password_pwned:
      "Ce mot de passe est compromis. Veuillez en choisir un autre.",
    form_param_format_invalid: "Format invalide dans un des champs.",
    form_identifier_not_found: "Adresse e-mail introuvable.",
    form_password_incorrect: "Mot de passe incorrect.",
    form_email_address_invalid: "Adresse e-mail invalide.",
    form_email_address_too_long: "L'adresse e-mail est trop longue.",
    form_email_address_too_short: "L'adresse e-mail est trop courte.",
    form_password_length_too_short:
      "Le mot de passe doit contenir au moins 8 caractères.",
    form_code_incorrect: "Le code de vérification est incorrect.",
    form_code_expired: "Le code de vérification a expiré.",
  };

  const validateInputs = () => {
    if (!emailAddress || !password || !confirmPassword || !firstname || !lastname) {
      Toast.show({
        type: "error",
        text1: "Champs manquants",
        text2: "Veuillez remplir tous les champs.",
      });
      return false;
    }
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Mot de passe",
        text2: "Les mots de passe ne correspondent pas.",
      });
      return false;
    }
    return true;
  };

  const onSignUpPress = async () => {
    if (!isLoaded || !validateInputs()) return;
    setLoading(true);

    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      const code = err?.errors?.[0]?.code;
      const fallbackMessage =
        err?.errors?.[0]?.message ||
        "Une erreur s'est produite. Veuillez réessayer.";
      const message = translatedErrors[code] || fallbackMessage;
      Toast.show({
        type: "error",
        text1: "Erreur d'inscription",
        text2: message,
      });
      // console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return <Verify />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Créer un compte</Text>

        {/* Nom */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="person" size={24} color="black" />
          <TextInput
            placeholder="Prénom"
            placeholderTextColor="#A0AEC0"
            value={firstname}
            onChangeText={setFirstname}
            style={styles.textInput}
          />
        </View>

        {/* Prénom */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="person" size={24} color="black" />
          <TextInput
            placeholder="Nom"
            placeholderTextColor="#A0AEC0"
            value={lastname}
            onChangeText={setLastname}
            style={styles.textInput}
          />
        </View>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={24} color="black" />
          <TextInput
            placeholder="Adresse email"
            placeholderTextColor="#A0AEC0"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.textInput}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Mot de passe */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="lock" size={24} color="black" />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#A0AEC0"
            value={password}
            onChangeText={setPassword}
            style={styles.textInput}
            secureTextEntry={!showPassword}
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="black"
            onPress={togglePasswordVisibility}
          />
        </View>

        {/* Confirmer mot de passe */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="lock" size={24} color="black" />
          <TextInput
            placeholder="Confirmer le mot de passe"
            placeholderTextColor="#A0AEC0"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.textInput}
            secureTextEntry={!showConfirmPassword}
          />
          <MaterialCommunityIcons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={24}
            color="black"
            onPress={toggleConfirmPasswordVisibility}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, !isFormValid && styles.disabledButton]}
            onPress={onSignUpPress}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Connexion</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text style={styles.signupText}>
              Déjà inscris ? <Text style={styles.link}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
    color: "#111827",
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
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
  buttonContainer: {
    alignItems: "center",
    gap: 20,
    marginTop: 10,
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

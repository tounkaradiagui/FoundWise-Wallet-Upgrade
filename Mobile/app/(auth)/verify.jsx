import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import NetInfo from "@react-native-community/netinfo";

export default function Verify() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = code.length > 5;

  const onVerifyPress = async () => {
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

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/dashboard");
        Toast.show({
          type: "success",
          text1: "Vérification réussie",
          text2: "Votre adresse e-mail a été vérifiée avec succès.",
        });
      }
      if (signUpAttempt.status === "needs_action") {
        // console.log("Vérification en attente", signUpAttempt);
        Toast.show({
          type: "info",
          text1: "Vérification en attente",
          text2: "Veuillez vérifier votre e-mail pour le code de vérification.",
        });
      }
      if (signUpAttempt.status === "failed") {
        // console.log("Échec de la vérification", signUpAttempt);
        const errorMessage = signUpAttempt.errors[0]?.message || "Échec de la vérification.";
        Toast.show({
          type: "error",
          text1: "Échec de la vérification",
          text2: errorMessage,
        });
      }
      setLoading(false);
      
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      const message = err?.errors?.[0]?.message || "Code invalide ou expiré.";

      Toast.show({
        type: "error",
        text1: "Erreur de vérification",
        text2: message,
      });
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { marginTop: 60 }]}>
      <Text style={styles.title}>Vérification de l'email</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={24} color="black" />
          <TextInput
            value={code}
            placeholder="Entrez le code reçu"
            onChangeText={setCode}
            style={styles.textInput}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.submitButton, !isFormValid && styles.disabledButton]}
        onPress={onVerifyPress}
        disabled={!isFormValid || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Vérifier</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
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
});

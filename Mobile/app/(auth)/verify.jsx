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

export default function Verify() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = code.length > 5;

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    if (!isFormValid) {
      Toast.show({
        type: "error",
        text1: "Code manquant",
        text2: "Veuillez entrer le code de vérification.",
      });
      return;
    }
    setLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/dashboard");
        Toast.show({
        type: "success",
        text1: "Vérification requise",
        text2: "Un e-mail de vérification a été envoyé. Veuillez vérifier votre boîte de réception.",
      });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Code invalide",
        text2: "Le code de vérification est incorrect ou expiré.",
      });
      // console.error(JSON.stringify(err, null, 2));
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

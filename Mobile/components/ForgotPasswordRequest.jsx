import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import Toast from "react-native-toast-message";
import NetInfo from "@react-native-community/netinfo";

export default function ForgotPasswordRequest({ onCodeSent, email, setEmail }) {
  const { isLoaded, signIn } = useSignIn();
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async () => {
    if (!isLoaded) return;
    if (!email || !email.includes("@")) {
      Toast.show({
        type: "error",
        text1: "Email invalide",
        text2: "Veuillez entrer une adresse email valide.",
      });
      return;
    }

    setLoading(true);

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Toast.show({
        text1: "Erreur de connexion",
        text2: "Veuillez vérifier votre connexion Internet.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      Toast.show({
        type: "success",
        text1: "Code envoyé",
        text2: "Un email de réinitialisation a été envoyé.",
      });

      onCodeSent();
    } catch (err) {
        // Vérifier si l'erreur est liée à un compte inexistant
        if (err.status === 404) {
        // Afficher un message d'erreur spécifique si aucun compte n'est associé à l'email
        Toast.show({
            type: "error",
            text1: "Erreur",
            text2: "Aucun compte associé à cet email",
        });
        } else {
        // Afficher un message d'erreur générique pour les autres erreurs
        Toast.show({
            type: "error",
            text1: "Erreur",
            text2: err?.errors?.[0]?.message || "Une erreur s'est produite.",
            });     
    }
      // console.log("Erreur de réinitialisation du mot de passe:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Adresse email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={[styles.button, (!email || loading) && styles.disabledButton]}
        onPress={handleResetRequest}
        disabled={!email || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Envoyer le code</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: "#D1D5DB",
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#078ECB",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

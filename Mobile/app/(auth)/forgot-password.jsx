import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { NetInfo } from "@react-native-community/netinfo";

export default function ForgotPassword() {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stage, setStage] = useState("request");
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async () => {
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
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      Toast.show({
        type: "success",
        text1: "Code envoyé",
        text2: "Un email de réinitialisation a été envoyé.",
      });

      setStage("reset");
    } catch (err) {
      console.log("Reset request error:", err);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2:
          err.errors?.[0]?.message ||
          "Échec de l’envoi du code. Vérifiez l’email.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
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
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        Toast.show({
          type: "success",
          text1: "Mot de passe réinitialisé. Veuillez vous connecter.",
        });
        router.replace("/sign-in");
      } else {
        console.log("Reset password attempt:", result);
        Toast.show({
            type: "info",
            text1: "Réinitialisation en attente",
            text2: "Veuillez vérifier votre email pour le code de réinitialisation.",
        });
        setStage("request");
      }
    } catch (err) {
      console.log("Reset password error:", err);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2:
          err.errors?.[0]?.message ||
          "Code incorrect ou mot de passe invalide.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mot de passe oublié</Text>

      {stage === "request" ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Adresse email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            style={[
              styles.button,
              (!email || loading) && styles.disabledButton,
            ]}
            onPress={handleResetRequest}
            disabled={!email || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Envoyer le code</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Code de vérification"
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
          />
          <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            style={[
              styles.button,
              (!code || !newPassword || loading) && styles.disabledButton,
            ]}
            onPress={handleResetPassword}
            disabled={!code || !newPassword || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Réinitialiser</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
    color: "#111827",
  },
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

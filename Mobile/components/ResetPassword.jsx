import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import Toast from "react-native-toast-message";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";

export default function ResetPassword({ email }) {
  const { isLoaded, signIn } = useSignIn();
  const { signOut } = useAuth(); 
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!isLoaded) return;
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
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        // Déconnexion de l'utilisateur après la réinitialisation du mot de passe
        await signOut();
        // Afficher un message de succès et rediriger vers la page de connexion
        Toast.show({
          type: "success",
          text1: "Mot de passe réinitialisé",
          text2: "Veuillez vous reconnecter.",
        });
        router.replace("/sign-in");
      } else {
        Toast.show({
          type: "info",
          text1: "Réinitialisation en attente",
          text2: "Vérifiez l’email pour le code.",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2:
          err?.errors?.[0]?.message || "Code incorrect ou mot de passe invalide.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
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

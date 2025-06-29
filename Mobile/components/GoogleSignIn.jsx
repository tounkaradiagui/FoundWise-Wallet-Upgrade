import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function GoogleSignIn() {
  const handleGoogleSignIn = () => {
    console.log("Google Sign-In clicked");
    // Sign-in logic
  };

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

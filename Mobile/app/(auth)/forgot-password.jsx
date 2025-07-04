import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import ForgotPasswordRequest from "../../components/ForgotPasswordRequest";
import ResetPassword from "../../components/ResetPassword";

export default function ForgotPassword() {
  const [stage, setStage] = useState("request");
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mot de passe oublié</Text>
      {stage === "request" ? (
        <ForgotPasswordRequest
          email={email}
          setEmail={setEmail}
          onCodeSent={() => setStage("reset")}
        />
      ) : (
        <ResetPassword email={email} />
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
});

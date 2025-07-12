import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EmptyTransaction() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="file-tray-outline" size={64} color="#999" />
      <Text style={styles.title}>Aucune transaction trouvée</Text>
      <Text style={styles.subtitle}>Commencez par en ajouter une !</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/create-transactions")}
      >
        <Text style={styles.buttonText}>Créer une transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
    color: "#444",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#078ECB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

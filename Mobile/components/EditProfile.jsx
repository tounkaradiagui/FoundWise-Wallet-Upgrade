import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfile() {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  const handleSave = async () => {
    try {
      await user?.update({
        firstName,
        lastName,
      });

      Alert.alert("Succès", "Profil mis à jour !");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
      console.error("Update profile error:", error);
    }
  };

  if (!isLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier mon profil</Text>

      <Text style={styles.label}>Prénom</Text>
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.saveText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#078ECB",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

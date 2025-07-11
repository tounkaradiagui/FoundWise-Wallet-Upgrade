import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function EditProfile() {
  const { user, isLoaded } = useUser();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [avatar, setAvatar] = useState(user?.imageUrl || "");

  const router = useRouter();

  // 📸 Fonction pour sélectionner une image locale
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return Alert.alert("Permission refusée", "Accès requis pour choisir une image.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      await user?.update({
        firstName,
        lastName,
        // imageUrl: avatar, // url de l'image (en local ou uploadée)
      });

      if (email !== user.primaryEmailAddress?.emailAddress) {
        await user?.updateEmailAddress({ email });
      }

      Toast.show({
        type: "success",
        text1: "Succès",
        text2: "Profil mis à jour !",
      });
      
      // Return back to profile page
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Échec de la mise à jour.");
      console.error("Update profile error:", error);
    }
  };

  if (!isLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier mon profil</Text>

      {/* Photo de profil */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.cameraIcon}>
            <FontAwesome name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Prénom</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.saveText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#F5F5F5" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: { fontSize: 14, marginBottom: 6, color: "#333" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  avatarContainer: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  cameraIcon: {
    position: "absolute",
    right: -5,
    bottom: -5,
    backgroundColor: "#078ECB",
    padding: 6,
    borderRadius: 20,
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
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

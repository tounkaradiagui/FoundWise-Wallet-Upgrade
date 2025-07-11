import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SignOutButton } from "../../components/SignOutButton";
import Toast from "react-native-toast-message";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();


  const formatDate = (isoDate) => {
    if (!isoDate) return "Indisponible";

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "Indisponible";

    const formatted = date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${formatted} à ${hours}:${minutes}`;
  };

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Déconnexion",
          onPress: async () => {
            try {
              await signOut();

              Toast.show({
                type: "success",
                text1: "Succès",
                text2: "Déconnexion réussie",
              });

              router.replace("/(auth)/sign-in");
            } catch (error) {
              console.error("Erreur lors de la déconnexion :", error);

              Toast.show({
                type: "error",
                text1: "Erreur",
                text2: "Impossible de se déconnecter",
              });
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

//   const handleEditProfile = () => {
//     Alert.alert("Modification du profil", "Fonction à venir...");
//   };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: user?.imageUrl || "",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.cameraIcon}
            onPress={() => Alert.alert("Changer la photo")}
          >
            <FontAwesome name="camera" size={14} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>
          {user?.firstName} {user?.lastName}
        </Text>

        <Text style={styles.userEmail}>
          <Text style={styles.name}>
            {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
          </Text>{" "}
        </Text>

        {/* Bouton Modifier */}
        <Link style={styles.editButton} href="/edit-profile">
          <MaterialIcons name="edit" size={18} color="white" />
          <Text style={styles.editButtonText}>Modifier le profil</Text>
        </Link>
      </View>

      {/* Liste des options */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.option}>
          <FontAwesome
            name="bell"
            size={22}
            color="#078ECB"
            style={styles.icon}
          />
          <Text style={styles.optionText}>Notifications</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialIcons
            name="settings"
            size={22}
            color="#078ECB"
            style={styles.icon}
          />
          <Text style={styles.optionText}>Paramètres</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialIcons
            name="help"
            size={22}
            color="#078ECB"
            style={styles.icon}
          />
          <Text style={styles.optionText}>À propos</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => handleLogout()}>
          <SimpleLineIcons
            name="logout"
            size={22}
            color="#078ECB"
            style={styles.icon}
          />
          <Text style={styles.optionText}>Déconnexion</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: 40,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#078ECB",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#222",
  },
  userEmail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  lastSeen: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
  },
  editButton: {
    marginTop: 15,
    flexDirection: "row",
    backgroundColor: "#078ECB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  icon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#222",
    flex: 1,
  },
});

export default Profile;

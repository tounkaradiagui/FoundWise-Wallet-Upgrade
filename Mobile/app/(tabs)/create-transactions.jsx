import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import { API_URL } from "../../constants/api";

const categories = [
  { id: "food", name: "Nourriture & Boissons", icon: "utensils" },
  { id: "shopping", name: "Achats", icon: "shopping-bag" },
  { id: "transportation", name: "Transport", icon: "bus" },
  { id: "freelance", name: "Freelance", icon: "laptop-code" },
  { id: "entertainment", name: "Divertissement", icon: "film" },
  { id: "bills", name: "Facture", icon: "file-invoice" },
  { id: "income", name: "Revenu", icon: "money-bill" },
  { id: "rent", name: "Loyer", icon: "home" },
  { id: "other", name: "Autres", icon: "ellipsis-h" },
];

export default function CreateTransaction() {
  const router = useRouter();
  const { user } = useUser();

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Toast.show({
        text1: "Erreur",
        text2: "Veuillez un titre de la transaction.",
        type: "error",
        position: "top",
        visibilityTime: 3000,
      });
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Toast.show({
        text1: "Erreur",
        text2: "Le montant doit etre supérieur à 0.",
        type: "error",
        position: "top",
        visibilityTime: 3000,
      });
    }

    if (!selectedCategory) {
      Toast.show({
        text1: "Erreur",
        text2: "Veuillez selectionner une catégorie.",
        type: "error",
        position: "top",
        visibilityTime: 3000,
      });
    }

    setLoading(true);

    try {
      // Format a amount for expenses negative and positive for income
      const formatAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));
      const res = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formatAmount,
          category: selectedCategory,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // console.log("Statut:", res.status);
        throw new Error(errorData.error || "Erreur lors de l'enregistrement");
      }

      Toast.show({
        text1: "Félicitations !!",
        text2: "La transaction a été enregistrée.",
        type: "success",
        position: "top",
        visibilityTime: 3000,
      });

      router.back();
      // console.log("Saved:", res);
      setAmount("");
      setTitle("");
      setSelectedCategory("");
    } catch (err) {
      Toast.show({
        text1: "Erreur",
        text2: "Erreur lors de l'ajout d'une transaction.",
        type: "error",
        position: "top",
        visibilityTime: 3000,
      });
      // console.log(err);
    } finally {
      setLoading(false);
    }
  };

   const isFormValid = title.length > 3 && amount.length > 3;

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle Transaction</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeButton, isExpense && styles.expenseActive]}
            onPress={() => setIsExpense(true)}
          >
            <Text style={[styles.typeButtonText, isExpense]}>Dépense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              !isExpense && styles.incomeActive,
            ]}
            onPress={() => setIsExpense(false)}
          >
            <Text style={[styles.typeButtonText, !isExpense]}>Revenu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.amountInput}
            keyboardType="numeric"
            placeholder="0 F CFA"
            placeholderTextColor="#333"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Titre de la Transaction"
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <Text style={styles.categoryLabel}>Catégorie</Text>
        <View style={styles.categoryContainer}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.categoryItem,
                selectedCategory === item.name && styles.categorySelected,
              ]}
              onPress={() => setSelectedCategory(item.name)}
            >
              <FontAwesome5
                name={item.icon}
                size={14}
                color={selectedCategory === item.name ? "#fff" : "#333"}
              />
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === item.name && { color: "#fff" },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity
          style={[styles.saveButton, !isFormValid && styles.disabledButton]}
          onPress={handleSave}
           disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  header: {
    paddingHorizontal: 20,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  typeToggle: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  expenseActive: {
    backgroundColor: "#E9B94E",
  },
  incomeActive: {
    backgroundColor: "#C1E3BE",
  },
  typeButtonText: {
    fontWeight: "bold",
    color: "#333",
  },
  inputWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 8 : 2,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  textInput: {
    fontSize: 16,
    color: "#333",
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    color: "#333",
  },
  categorySelected: {
    backgroundColor: "#078ECB",
    borderColor: "#078ECB",
  },
  bottomButtonWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#078ECB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

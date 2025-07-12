// components/TransactionItem.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const categoryIcons = {
  "Food & Drinks": "fast-food",
  Income: "cash",
  Shopping: "cart",
  Transportation: "car",
  Entertainment: "film",
  Bills: "receipt",
  Other: "dots-horizontal",
};


export default function TransactionItem({ item, onDelete }) {
  const isIncome = parseFloat(item.amount) > 0;
  const iconName = categoryIcons[item.category] || "pricetag-outline" ;

    // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("fr-FR", options); // Format de la date en français
  };

  return (
    <View style={styles.card} key={item.id}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={categoryIcons[item.category] || "cash"}
          size={26}
          color={isIncome ? "green" : "crimson"}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>

      <View style={styles.right}>
        <Text
          style={[styles.amount, { color: isIncome ? "green" : "crimson" }]}
        >
          {isIncome ? "+" : " "}{item.amount} F CFA
        </Text>
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        {/* <TouchableOpacity onPress={() => onDelete(item.id)}>
          <MaterialIcons name="delete" size={22} color="#ff4444" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  iconContainer: {
    backgroundColor: "#f1f1f1",
    borderRadius: 50,
    padding: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    fontSize: 13,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#aaa",
  },
  right: {
    alignItems: "flex-end",
    gap: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

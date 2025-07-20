import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useTransaction } from "@/hooks/useTransaction";
import { FontAwesome } from "@expo/vector-icons";
import EmptyTransaction from "@/components/EmptyTransaction";
import { useCallback, useEffect, useState } from "react";
import Loader from "@/components/Loader";

export default function Transactions() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { transactions, deleteTransaction, loadData } = useTransaction(user.id);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

    const sortedTransactions = Array.isArray(transactions)
  ? [...transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  : [];

  const handleDelete = (id) => {
    Alert.alert(
      "Supprimer la transaction",
      "Voulez-vous vraiment supprimer cette transaction ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          onPress: async () => {
            await deleteTransaction(id);
            await loadData();
          },
          style: "destructive",
        },
      ]
    );
  };

   useEffect(() => {
      loadData();
    }, [loadData]);

     if (loading && !refreshing) return <Loader />;

  const renderItem = ({ item }) => (
    <View style={styles.transactionRow}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionAmount(item.amount)}>
          {item.amount.toLocaleString()} F CFA
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <FontAwesome name="trash" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="history" size={20} color="#078ECB" />
        <Text style={styles.title}>Historique des Transactions</Text>
      </View>

      <FlatList
        data={sortedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyTransaction />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  transactionInfo: {
    flexDirection: "column",
    gap: 4,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  transactionAmount: (amount) => ({
    fontSize: 15,
    fontWeight: "bold",
    color: amount > 0 ? "green" : "red",
  }),
});

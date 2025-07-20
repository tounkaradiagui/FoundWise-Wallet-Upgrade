import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTransaction } from "../../hooks/useTransaction";
import { useCallback, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { MaterialIcons } from "@expo/vector-icons";
import TransactionItem from "@/components/TransactionItem";
import EmptyTransaction from "@/components/EmptyTransaction";

export default function Home() {
  const { user } = useUser();
  const { transactions, summary, loading, loadData } =
    useTransaction(user.id);

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


  const router = useRouter();

  // Fonction pour obtenir la salutation selon le moment de la journée
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Bonjour"; // Matin
    } else if (hour < 18) {
      return "Bon après-midi"; // Après-midi
    } else {
      return "Bonsoir"; // Soir
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !refreshing) return <Loader />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.salutation}>{getGreeting()},</Text>
          <Text style={styles.name}>
            {user.firstName} {user.lastName} !
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={{ marginTop: 15 }}
            onPress={() => router.push("/profile")}
          >
            <Image
              source={{
                uri: user?.imageUrl || "",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.topRow}>
          <View style={styles.balanceContainer}>
            <Text style={styles.subTitle}>Solde total</Text>
            <Text style={styles.balanceText}>{summary.balance} F CFA</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.column}>
            <Text style={styles.subTitle}>Revenus</Text>
            <Text style={styles.incomeText}>{summary.income} F CFA</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.subTitle}>Dépenses</Text>
            <Text style={styles.expenseText}>{summary.expenses} F CFA</Text>
          </View>
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.transactionContainer}>
        <View>
          <Text style={styles.name}>Dernières Transactions</Text>
        </View>
        <View>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => router.push("/transactions")}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
              Voir
            </Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sortedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        ListEmptyComponent={<EmptyTransaction />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  headerLeft: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    marginTop: 0,
  },

  salutation: {
    fontSize: 20,
    fontWeight: "bold",
  },

  name: {
    fontSize: 14,
    fontWeight: "bold",
  },

  transactionContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "#E9B94E",
    marginHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  summaryCard: {
    marginTop: 20,
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    shadowColor: "#078ECB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 15,
  },

  balanceContainer: {
    alignItems: "flex-start",
  },

  balanceText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  column: {
    flex: 1,
    alignItems: "center",
  },

  subTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },

  incomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },

  expenseText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#078ECB",
  },
});

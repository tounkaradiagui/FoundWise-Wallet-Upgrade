import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransaction } from "../../hooks/useTransaction";
import { useEffect } from "react";
import Loader from "../../components/Loader";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function Home() {
  const { user } = useUser();
  const { transactions, summary, loading, loadData, deleteTransaction } =
    useTransaction(user.id);

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


  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("fr-FR", options); // Format de la date en français
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log("Transactions:", transactions);
  console.log("Summary:", summary);

  console.log("User ID:", user?.id);

  if (loading) return <Loader />;

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.salutation}>{getGreeting()},</Text>
          <Text style={styles.name}>
            {user.firstName} {user.lastName} !
          </Text>
          {/* username */}
          {/* <Text style={styles.name}>{user?.emailAddresses[0]?.emailAddress.split("@")[0]}</Text> */}
        </View>
        <View>
          <TouchableOpacity style={{marginTop: 15}}>
            <Image source={require("../../assets/images/profile-picture.jpg")} style={styles.avatar} />
            {/* <FontAwesome6 name="user-tie" size={30} color="#078ECB" /> */}
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
          <TouchableOpacity style={{ flexDirection: "row" }}>
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

      {/* <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Text>Balance: {summary.balance}</Text>
        <Text>Income: {summary.income}</Text>
        <Text>Expenses: {summary.expenses}</Text>
        <Text>Username: {user.id}</Text>
        <Text>First Name: {user?.firstName}</Text>
        <Text>Last Name: {user?.lastName}</Text>
        <SignOutButton />

      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
        <Link href="/index">
          <Text>Sign up</Text>
        </Link>
      </SignedOut> */}
    </View>
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
    marginTop: 15,
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
    height: 55,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#078ECB",
  },

});

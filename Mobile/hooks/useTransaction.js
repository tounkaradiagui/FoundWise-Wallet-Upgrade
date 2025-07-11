import { useCallback, useState } from "react";
import { Alert } from "react-native";

const API_URL = "https://foundwise-wallet-upgrade-1.onrender.com/api";
// const API_URL = "http://localhost:5001/api";

export const useTransaction = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });

    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.log("Error fetching transactions:", error);
            
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.log("Error fetching summary:", error);
            
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        if(!userId) return;
        setLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.log("Error fetching summary:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchTransactions, fetchSummary, userId]);

    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete transaction");
            }
            loadData(); // Refresh data after deletion
            console.log("Transaction deleted successfully");
            Alert.alert("Transaction deleted successfully");
        } catch (error) {
            console.log("Error deleting transaction:", error);
            Alert.alert("Error deleting transaction", error.message);          
        }
    };

    return {
        transactions,
        summary,
        loading,
        loadData,
        deleteTransaction,
    };
}
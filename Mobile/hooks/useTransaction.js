import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";


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
            Toast.show({
                text1: "Erreur",
                text2: "Erreur de chargement de la liste de transaction",
                type: "error",
                position: "top",
                visibilityTime: 3000,
            });
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            Toast.show({
                text1: "Erreur",
                text2: "Erreur de chargement du solde total",
                type: "error",
                position: "top",
                visibilityTime: 3000,
            });
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            Toast.show({
                text1: "Erreur",
                text2: "Erreur de chargement",
                type: "error",
                position: "top",
                visibilityTime: 3000,
            });
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
            Toast.show({
                text1: "Félicitations !!",
                text2: "La transaction a été supprimée.",
                type: "success",
                position: "top",
                visibilityTime: 3000,
            });
        } catch (error) {
            Toast.show({
                text1: "Erreur",
                text2: "Erreur de suppression.",
                type: "error",
                position: "top",
                visibilityTime: 3000,
            });
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
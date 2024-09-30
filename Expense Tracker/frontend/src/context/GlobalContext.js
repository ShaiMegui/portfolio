import React, { useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Ajouter un revenu
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            getIncomes();
        } catch (err) {
            setError(err.response ? err.response.data.message : "Une erreur s'est produite lors de l'ajout du revenu");
        }
    };

    // Récupérer les revenus
    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.message : "Une erreur s'est produite lors de la récupération des revenus");
        }
    };

    // Supprimer un revenu
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            getIncomes();
        } catch (err) {
            setError(err.response ? err.response.data.message : "Une erreur s'est produite lors de la suppression du revenu");
        }
    };

    // Calcul du revenu total
    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    // Ajouter une dépense
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            getExpenses();
        } catch (err) {
            setError(err.response ? err.response.data.message : "Une erreur s'est produite lors de l'ajout de la dépense");
        }
    };

    // Récupérer les dépenses
    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.message : "Une erreur s'est produite lors de la récupération des dépenses");
        }
    };

    // Supprimer une dépense
    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            getExpenses();
        } catch (err) {
            setError(err.response ? err.response.data.message : "Une erreur s'est produite lors de la suppression de la dépense");
        }
    };

    // Calcul des dépenses totales
    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    // Calcul du solde total
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    // Historique des transactions (revenus et dépenses)
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};

import axios from 'axios';
import { BASE_URL } from '../config/api';

export const fetchCryptoPriceAtDate = async (cryptoId, date, currency = 'eur') => {
    // Convertir la date en timestamp Unix (secondes)
    const timestamp = Math.floor(new Date(date).getTime() / 1000);

    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart/range`, {
            params: {
                vs_currency: currency,
                from: timestamp,
                to: timestamp,
            },
        });

        const price = response.data.prices[0][1]; // Le prix à cette date
        return price;
    } catch (error) {
        console.error('Erreur lors de la récupération du prix de la crypto :', error);
        return null;
    }
};


// Assurez-vous que BASE_URL est bien configuré

// Fonction pour récupérer les ordres d'un utilisateur
export const fetchUserOrders = async (userId) => {
    try {
        const token = localStorage.getItem('jwtToken'); // Assurez-vous que l'utilisateur est authentifié
        const response = await axios.get(`${BASE_URL}/api/user/${userId}/orders`, {
            headers: {
                Authorization: `Bearer ${token}`, // Envoyer le token JWT dans les en-têtes
                Accept: 'application/json',
            },
        });

        return response.data; // Retourne les données des ordres
    } catch (error) {
        console.error('Erreur lors de la récupération des ordres :', error);
        throw error; // Lève une erreur si quelque chose ne va pas
    }
};

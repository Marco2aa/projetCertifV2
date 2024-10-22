import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart'; // Assurez-vous que la bibliothèque MUI est correctement installée
import { BASE_URL } from '../config/api'; // Assurez-vous que BASE_URL est correctement défini

const PortfolioChartWithMultipleCryptos = () => {
    const [orders, setOrders] = useState([]);
    const [coinGeckoData, setCoinGeckoData] = useState({});
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    // Fonction pour récupérer les données de CoinGecko pour chaque cryptoId
    const fetchCoinGeckoData = async (cryptoId, fromTimestamp) => {
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart/range`, {
                params: {
                    vs_currency: 'eur',
                    from: fromTimestamp,
                    to: Math.floor(Date.now() / 1000), // Jusqu'à maintenant
                },
            }
            );
            if (response.data && Array.isArray(response.data.prices)) {
                return response.data.prices;
            } else {
                return [];
            }
        } catch (error) {
            console.error(`Erreur lors de la récupération des données pour ${cryptoId}:`, error);
            return [];
        }
    };

    // Fonction pour récupérer les ordres de l'utilisateur
    const fetchUserOrders = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${BASE_URL}/api/user/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des ordres:', error);
            setErrorMessage('Erreur lors de la récupération des données.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserOrders();
    }, []); // Cela s'exécutera une seule fois au montage du composant

    useEffect(() => {
        const fetchAllCryptoData = async () => {
            const cryptos = [...new Set(orders.map(order => order.cryptoId))];
            const firstTimestamp = Math.floor(
                Math.min(...orders.map(order => new Date(order.createdAt).getTime()))
            ); // Le timestamp le plus ancien (utilisé comme référence)

            const coinData = {};

            for (const cryptoId of cryptos) {
                const data = await fetchCoinGeckoData(cryptoId, firstTimestamp);
                coinData[cryptoId] = data;
            }

            setCoinGeckoData(coinData);
        };

        if (orders.length > 0) {
            fetchAllCryptoData();
        }
    }, [orders]);

    if (loading) {
        return <div>Chargement des ordres...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    // Fonction pour calculer les valeurs du portefeuille pour une cryptomonnaie donnée
    const calculateCryptoValues = (cryptoId) => {
        let currentQuantity = 0;
        const sortedOrders = orders
            .filter(order => order.cryptoId === cryptoId)
            .sort((a, b) => a.createdAt - b.createdAt);

        let nextOrderIndex = 0;
        let firstOrderPassed = false;
        const cryptoValues = [];

        // Parcourir les timestamps de la cryptomonnaie
        coinGeckoData[cryptoId]?.forEach(([timestamp, price]) => {
            // Appliquer les transactions avant ce timestamp
            while (nextOrderIndex < sortedOrders.length && sortedOrders[nextOrderIndex].createdAt <= timestamp / 1000) {
                const order = sortedOrders[nextOrderIndex];
                if (order.type === 'Achat') {
                    currentQuantity += order.quantity;
                    firstOrderPassed = true;
                } else if (order.type === 'Vente') {
                    currentQuantity -= order.quantity;
                    firstOrderPassed = true;
                }
                nextOrderIndex++;
            }

            // Ajouter la valeur actuelle de la cryptomonnaie
            cryptoValues.push({
                timestamp,
                value: firstOrderPassed ? price * currentQuantity : 0, // Si le premier ordre n'est pas passé, valeur = 0
            });
        });

        return cryptoValues;
    };

    // Fonction pour fusionner les valeurs d'Ethereum dans le tableau de Bitcoin
    const mergeCryptoValues = (bitcoinValues, ethereumValues) => {
        const mergedData = [];

        // Nombre de lignes dans le tableau de Bitcoin
        const bitcoinLength = bitcoinValues.length;
        const ethereumLength = ethereumValues.length;

        // Commencer à remplir les valeurs d'Ethereum à partir de la fin du tableau de Bitcoin
        const ethStartIndex = bitcoinLength - ethereumLength;

        bitcoinValues.forEach((btcValue, index) => {
            let ethValue = 0;

            // Si l'index est supérieur ou égal à ethStartIndex, insérer les valeurs d'Ethereum à partir de la fin
            if (index >= ethStartIndex) {
                ethValue = ethereumValues[index - ethStartIndex]?.value || 0;
            }

            mergedData.push({
                x: btcValue.timestamp,
                bitcoin: btcValue.value,
                ethereum: ethValue,
            });
        });

        return mergedData;
    };

    // Calcul des valeurs pour Bitcoin et Ethereum
    const bitcoinValues = calculateCryptoValues('bitcoin');
    const ethereumValues = calculateCryptoValues('ethereum');

    // Fusion des deux tableaux
    const combinedData = mergeCryptoValues(bitcoinValues, ethereumValues);

    console.log("Combined data for chart:", combinedData);

    return (
        <div>
            <h3>Valeur du portefeuille dans le temps</h3>
            <LineChart
                dataset={combinedData}
                xAxis={[{
                    dataKey: 'x', label: 'Date', valueFormatter: (timestamp) => {
                        const date = new Date(timestamp);
                        return date.toLocaleDateString(); // Convertir le timestamp en une date lisible
                    }
                }]} // Axe X basé sur les timestamps
                series={[
                    {
                        dataKey: 'bitcoin', label: 'Bitcoin', showMark: false, labelPosition: 'end', // Positionner le label à la fin de la ligne
                        labelOffset: 10,
                    },
                    {
                        dataKey: 'ethereum', label: 'Ethereum', showMark: false, labelPosition: 'end', // Positionner le label à la fin de la ligne
                        labelOffset: 25,
                    },

                ]}
                height={300}
                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                grid={{ vertical: true, horizontal: true }}
            />
        </div>
    );
};

export default PortfolioChartWithMultipleCryptos;

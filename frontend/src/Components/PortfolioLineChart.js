import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const PortfolioChart = ({ coinGeckoData, symfonyOrders }) => {
    const [portfolioHistory, setPortfolioHistory] = useState([]);

    useEffect(() => {
        const calculatePortfolioValue = () => {
            let portfolioValues = [];
            let currentQuantity = 0;

            // Trier les ordres Symfony par timestamp (au cas où)
            const sortedOrders = symfonyOrders.sort((a, b) => a.createdAt - b.createdAt);
            let nextOrderIndex = 0;

            // Parcourir les données de CoinGecko (timestamps et prix)
            for (const [timestamp, price] of coinGeckoData) {
                // Convertir timestamp CoinGecko en secondes (au cas où ils seraient en millisecondes)
                const coinGeckoTimestamp = Math.floor(timestamp / 1000);

                // Vérifier si on a des ordres à cette date ou avant
                while (nextOrderIndex < sortedOrders.length && sortedOrders[nextOrderIndex].createdAt <= coinGeckoTimestamp) {
                    const order = sortedOrders[nextOrderIndex];

                    // Mettre à jour la quantité en fonction du type d'ordre (achat/vente)
                    if (order.type === 'Achat') {
                        currentQuantity += order.quantity;
                    } else if (order.type === 'Vente') {
                        currentQuantity -= order.quantity;
                    }

                    // Passer à l'ordre suivant
                    nextOrderIndex++;
                }

                // Calculer la valeur du portefeuille pour ce timestamp
                const portfolioValue = price * currentQuantity;

                // Stocker la valeur et la date pour le graphique
                portfolioValues.push({
                    x: coinGeckoTimestamp,
                    y: portfolioValue,
                });
            }

            // Mettre à jour le state avec les valeurs calculées
            setPortfolioHistory(portfolioValues);
            console.log(portfolioHistory)
        };

        calculatePortfolioValue();
    }, [coinGeckoData, symfonyOrders]);

    return (
        <div>
            <h3>Valeur du portefeuille dans le temps</h3>
            <LineChart
                dataset={portfolioHistory}
                xAxis={[{ dataKey: 'x' }]} // Les dates des ordres sur l'axe X
                series={[{ dataKey: 'y' }]} // Les valeurs de l'ordre sur l'axe Y
                height={300}
                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                grid={{ vertical: true, horizontal: true }}
            />
        </div>
    );
};

export default PortfolioChart;

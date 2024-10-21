import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { fetchCryptoPriceAtDate } from '../config/fetchCryptoPrice'; // La fonction pour récupérer les prix à des dates spécifiques
import { SparkLineChart } from '@mui/x-charts';

export default function PortfolioChart({ orders }) {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const calculatePortfolioValue = async () => {
            let portfolioHistory = [];

            for (const order of orders) {
                const { cryptoId, type, quantity, createdAt } = order;

                // Récupérer le prix de la crypto à la date de l'ordre
                const cryptoPriceAtDate = await fetchCryptoPriceAtDate(cryptoId, createdAt);

                // Calculer la valeur de l'ordre
                const valueAtTime = cryptoPriceAtDate * quantity;

                // Si c'est un achat, on ajoute à la valeur totale, si c'est une vente, on soustrait
                portfolioHistory.push({
                    x: new Date(createdAt).toLocaleDateString(),
                    y: type === 'Achat' ? valueAtTime : -valueAtTime, // Achat +, Vente -
                });
            }

            setChartData(portfolioHistory);
            console.log(chartData);
        };

        calculatePortfolioValue();
    }, [orders]);

    return (
        <LineChart
            dataset={chartData}
            xAxis={[{ dataKey: 'x', label: 'Date' }]} // Les dates des ordres sur l'axe X
            series={[{ dataKey: 'y', label: 'Valeur du portefeuille en €' }]} // Les valeurs de l'ordre sur l'axe Y
            height={300}
            margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
            grid={{ vertical: true, horizontal: true }}
        />
    );
}

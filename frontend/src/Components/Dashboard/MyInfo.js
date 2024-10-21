import React, { useState, useEffect } from 'react';
import PortfolioChart from '../PortfolioLineChart';
import axios from 'axios';
import { BASE_URL } from '../../config/api'; // Assurez-vous que BASE_URL est correctement défini

const MyInfo = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Ajout d'un état de chargement
    const [errorMessage, setErrorMessage] = useState(null); // État pour gérer les erreurs

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const token = localStorage.getItem('jwtToken'); // Assurez-vous que l'utilisateur est authentifié
                const response = await axios.get(`${BASE_URL}/api/user/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });

                setOrders(response.data); // Met à jour les ordres dans l'état
                setLoading(false); // Désactive le chargement
            } catch (error) {
                console.error('Erreur lors de la récupération des ordres:', error);
                setErrorMessage('Erreur lors de la récupération des données.');
                setLoading(false); // Désactive le chargement même en cas d'erreur
            }
        };

        fetchUserOrders();
    }, []);

    if (loading) {
        return <div>Chargement des ordres...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    return (
        <div>
            <PortfolioChart orders={orders} />
        </div>
    );
};

export default MyInfo;

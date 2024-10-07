import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);


    const decodeJWT = (token) => {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            const parsedPayload = JSON.parse(decodedPayload);
            return parsedPayload;
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedToken = decodeJWT(token);
            setAuthToken(token);
            setIsAuthenticated(true);
            setUser(decodedToken);
        }
    }, []);

    const login = async (email, password, notifysuccess, notifyfailure, navigate) => {
        try {
            const response = await axios.post('https://localhost:8000/api/login', {
                username: email,
                password: password,
            });
            localStorage.setItem('jwtToken', response.data.token);
            const decodedToken = decodeJWT(response.data.token);
            setAuthToken(response.data.token);
            setIsAuthenticated(true);
            setUser(decodedToken);
            notifysuccess();

            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            setError('Invalid credentials. Please try again.');
            notifyfailure();
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setAuthToken(null);
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, isAuthenticated, user, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

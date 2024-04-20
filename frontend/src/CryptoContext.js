import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const Crypto = createContext()

const CryptoContext = ({children}) => {
  const [devises, setDevises] = useState([]);
  const [currency, setCurrency] = useState("EUR");

  useEffect(() => {
      const fetchData = async () => {
        try {
            let allDevises = [];
            for (let page = 1; page <= 6; page++) {
              const response = await axios.get(`https://localhost:8000/api/devises?page=${page}`);
              const data = response.data;
              allDevises = [...allDevises, ...data['hydra:member']];
            }
    
            setDevises(allDevises);
          } catch (error) {
            console.error('Error fetching devises:', error);
          }
      };
      fetchData();
  }, []);
  return (
    <Crypto.Provider value={{devises, currency, setCurrency}}>{children}</Crypto.Provider>
  )
}

export default CryptoContext;

export const CryptoState = () => {
    return useContext(Crypto);
}

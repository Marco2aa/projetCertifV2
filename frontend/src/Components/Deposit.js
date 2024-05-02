import React, { useState, useEffect } from 'react'
import { CryptoState } from '../CryptoContext'
import AutocompleteHint from './Autocomplete';
import { Button, InputAdornment, TextField } from '@mui/material';
import SelectWallet from './SelectWallet';
import axios from 'axios'

const Deposit = () => {

    const { currency, devises } = CryptoState()
    const [selectedValue, setSelectedValue] = useState(null);
    const [montant, setMontant] = useState(0)
    const [wallet, setWallet] = useState([])
    const [selectedWallet, setSelectedWallet] = useState('')

    const token = localStorage.getItem('token')

    const handleDeposit = async (thisWallet) => {
        if (selectedValue) {
            const montantEuros = montant / selectedValue.valeur
            console.log(montantEuros)
            try {
                const response = await axios.post(`https://localhost:8000/api/walletupdate/${thisWallet}`, {
                    solde: montantEuros
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    }
                });
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('No value selected');
        }
    };


    const handleSelectWallet = (selectedValue) => {
        console.log("Wallet selected:", selectedValue);
        setSelectedWallet(selectedValue)
    }

    useEffect(() => {
        fetchWallet()
    }, [])

    const fetchWallet = async () => {
        try {
            console.log(token)
            const response = await axios.get('https://localhost:8000/api/walletuser', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            })
            console.log(response.data)
            setWallet(response.data)
        } catch (error) {
            console.error('erreur lors de la recuperation du portefeuille :', error)
        }

    }

    const handleSelectedValueChange = (newValue) => {
        setSelectedValue(newValue);
    }

    const thisWallet = wallet.find(item => item.name === selectedWallet)
    console.log(thisWallet);

    return (
        <div style={{ width: '100%', }}>
            <div style={{ width: '50%', margin: 'auto', marginTop: '100px', border: 'solid 1px grey', borderRadius: '8px', }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px' }}>
                    <SelectWallet wallets={wallet} onSelect={handleSelectWallet} />
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '35px', fontFamily: 'Poppins' }}>
                        <AutocompleteHint
                            options={devises}
                            label="Devises"
                            id="2"
                            onChange={handleSelectedValueChange}
                        />
                        <p style={{ fontWeight: 600 }}>
                            {selectedValue ? '1 ' + selectedValue.name + '=' : ''}
                            {selectedValue ? (1 / selectedValue.valeur).toString().slice(0, 6) : ''}
                            {selectedValue ? '€' : ''}
                        </p>
                    </div>
                    <TextField
                        fullWidth
                        value={montant}
                        onChange={(e) => setMontant(e.target.value)}
                        color='warning'
                        label="Déposer"
                        placeholder='Saisissez un montant'
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">{selectedValue ? selectedValue.name : ''}</InputAdornment>,
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto', gap: '20px' }}>
                            <p style={{ fontWeight: 700, fontFamily: 'Poppins', justifyContent: 'space-around' }}>
                                {thisWallet ? 'Portefeuille : ' + thisWallet.name : ''}

                            </p>
                            <p>|</p>
                            <p style={{ fontWeight: 700, fontFamily: 'Poppins', margin: 'auto' }}>
                                {thisWallet ? 'Solde : ' + thisWallet.solde + ' €' : ''}

                            </p>
                        </div>
                        <p style={{ fontWeight: 700, fontFamily: 'Poppins', margin: 'auto' }}> Montant reçu : {selectedValue ? (montant / selectedValue.valeur).toString().slice(0, 6) : 0} € </p>
                        <p style={{ fontWeight: 700, fontFamily: 'Poppins', margin: 'auto' }}>Montant du solde après opération
                            <span> : </span>
                            <span style={{ marginLeft: '10px', fontWeight: 700, fontFamily: 'Poppins', color: 'orange' }}>
                                {thisWallet && selectedValue ? (thisWallet.solde + montant / selectedValue.valeur) : ''} €
                            </span>
                        </p>
                    </div>
                    <button style={{
                        height: "55px",
                        backgroundColor: "orange",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        color: 'black',
                        fontSize: "1.2em",
                        fontWeight: "500",
                        width: "100%"
                    }} onClick={() => handleDeposit(thisWallet.name)} >Déposer</button>
                </div>
            </div>
        </div>
    )
}

export default Deposit

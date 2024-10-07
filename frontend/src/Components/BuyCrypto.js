import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Autocomplete, Button, InputAdornment, Slider, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AutocompleteHint from './Autocomplete';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { CryptoState } from '../Context/CryptoContext';
import SelectWallet from './SelectWallet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './RegisterForm/RegisterForm.css'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { loadStripe } from '@stripe/stripe-js';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, backgroundColor: 'transparent' }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}



TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function BuyCrypto() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const { currency, devises } = CryptoState();
    const [loading, setLoading] = useState(false);
    const [coins, setCoins] = useState([]);
    const [page, setPage] = useState(1);
    const [pageTitle, setPageTitle] = useState('Achetez des Cryptos.');
    const [selectedPercentage, setSelectedPercentage] = useState(0);
    const [amount, setAmount] = useState('');
    const [amountToSpend, setAmountToSpend] = useState(0);
    const [amountToReceive, setAmountToReceive] = useState(null);
    const [solde, setSolde] = useState(0)
    const [selectedValue, setSelectedValue] = useState(null);
    const [wallet, setWallet] = useState([])
    const [selectedWallet, setSelectedWallet] = useState('')
    const [error, setError] = useState(false)
    const [cryptoSelected, setCryptoSelected] = useState(null);
    const [deviseSelected, setDeviseSelected] = useState(null);
    const [sessionId, setSessionId] = useState(null)
    const [username, setUsername] = useState(null)

    const thisWallet = wallet.find(item => item.name === selectedWallet)
    console.log(thisWallet);


    const handleBuyDeposit = async () => {
        const stripe = await loadStripe('pk_test_51PCKdwJY5Z1qjO57ILNP2mLo6qGyF2GMm3BbEBuVM52DoLWJoejzCYYRpsccpzWnZlaCRskr5fsozXHCD9lp9thC00eZzvDhcw')

        const token = localStorage.getItem('token');



        try {

            const decodedToken = decodeJWT(token);
            const username = decodedToken.username;
            console.log(decodedToken)
            console.log(username)
            setUsername(username);

            const response = await axios.post(
                `https://localhost:8000/api/create-checkout-session/buy-and-sell`,
                {
                    cryptoId: parseInt(cryptoSelected.id),
                    email: username,
                    walletId: parseInt(thisWallet.id),
                    quantity: parseInt(amountToReceive.toFixed(2)),
                    amount: amount,
                    deviseId: parseInt(deviseSelected.id)

                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            console.log(response.data);
            setSessionId(response.data.sessionId)
            stripe.redirectToCheckout({
                sessionId: response.data.sessionId
            })
        } catch (error) {
            console.error(error);
        }

    };

    const decodeJWT = (token) => {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            const parsedPayload = JSON.parse(decodedPayload);
            console.log(parsedPayload)
            return parsedPayload;
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };


    const calculateAmount = (percentage) => {
        const walletBalance = thisWallet.solde;
        const calculatedAmount = (percentage / 100) * walletBalance * deviseSelected.valeur;
        return calculatedAmount.toFixed(2);
    };

    useEffect(() => {
        if (cryptoSelected && deviseSelected) {
            const calculatedAmountToReceive = calculateAmountToReceive(amount, cryptoSelected, deviseSelected);
            console.log(amount, cryptoSelected.current_price, deviseSelected.valeur, calculatedAmountToReceive)
            setAmountToReceive(calculatedAmountToReceive)

        }
    }, [cryptoSelected, deviseSelected, amount]);

    const calculateAmountToReceive = (amountToSpend, cryptoSelected, deviseSelected) => {
        const sum = amountToSpend / deviseSelected.valeur / cryptoSelected.current_price
        return sum

    };




    const handlePercentageChange = (event, newValue) => {
        setSelectedPercentage(newValue);
        const newAmount = calculateAmount(newValue);
        setAmount(newAmount);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            setPageTitle('Achetez des  Cryptos.');
        } else if (newValue === 1) {
            setPageTitle('Vendez vos  Cryptos.');
        }
    };



    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const fetchCoins = useCallback(async () => {
        setLoading(true);
        let allCoins = [];
        try {
            for (let page = 1; page <= 4; page++) {
                const response = await axios.get(`https://127.0.0.1:8000/api/cryptos?page=${page}`);
                const data = response.data;
                allCoins = [...allCoins, ...data['hydra:member']];
            }

            setCoins(allCoins);
            setLoading(false);
            console.log(allCoins);
        } catch (error) {
            console.error("Error fetching coins:", error);
            setLoading(false);
        }
    }, [currency, page]);

    useEffect(() => {
        fetchCoins();
    }, [fetchCoins]);

    useEffect(() => {
        fetchWallet()
    }, [])

    const fetchWallet = async () => {
        try {
            const token = localStorage.getItem('token')
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


    const useStyles = makeStyles(() => ({
        title: {
            fontFamily: "Poppins",
            fontWeight: "700",
            marginBottom: "50px"


        },
        form: {
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            width: "100%",
            marginTop: "5px",
            marginBottom: '5px'
        },

        button: {
            height: "55px",
            backgroundColor: "orange",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1.2em",
            fontWeight: "500",
            width: "100%",
            // marginTop: '10px'
        },
        div: {
            display: "flex",
            width: "100%",
            flexDirection: "column",
            gap: "10px"
        },
        fields: {

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: "10px"
        },
        fivecryptos: {
            borderRadius: '8px',
            border: 'solid 1px grey',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            fontFamily: 'Poppins',
            fontWeight: '500',
            padding: '15px'

        },
        icon: {
            height: '20px',
            width: '20px'
        }

    }))

    const classes = useStyles()

    const handleCryptoSelectedChange = (newValue) => {
        setCryptoSelected(newValue);
    }

    const handleDeviseSelectedChange = (newValue) => {
        setDeviseSelected(newValue);
    }

    const handleSelectWallet = (selectedValue) => {
        console.log("Wallet selected:", selectedValue);
        setSelectedWallet(selectedValue)
    }

    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue === '') {
            setError(false);
            setAmount(inputValue);
        } else if (parseFloat(inputValue) <= thisWallet.solde) {
            setAmount(inputValue);
            setError(false);
        } else {
            setAmount(thisWallet.solde.toString());
            setError(true);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '250px',
            justifyContent: 'space-evenly',
            width: '100%',
            marginTop: 5,
        }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '60px' }}>
                <Typography fontWeight={700} variant="h2">{pageTitle}</Typography>
                <div className={classes.fivecryptos}>
                    <p style={{ marginLeft: '15px', fontWeight: 500 }}>Cryptos populaires</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {coins.slice(0, 5).map((coin) => (
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'space-between' }}>
                                <div style={{ marginLeft: '15px', display: 'flex', flexDirection: 'row', gap: '15px' }}>
                                    <img className={classes.icon} src={coin.image} />
                                    <p>{coin.symbol.toUpperCase()}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', marginRight: '15px', gap: '65px' }}>
                                    <p>{coin.currentPrice}</p>
                                    <p style={{
                                        color: coin.price_change_percentage_24h > 0 ? "rgb(14, 203, 129)" : "red"
                                    }}>{coin.price_change_percentage_24h} %</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </Box>
            <Box sx={{
                bgcolor: 'transparent',
                width: '100%',
                height: '100%',
                borderRadius: 5,
                // overflow: "hidden",
                border: '1px solid grey',
                marginTop: "20px"
            }} >
                <AppBar color='transparent' position="static"

                    sx={{
                        borderTopRightRadius: '8px',
                        borderTopLeftRadius: '8px',
                        width: '100%',
                    }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#FFA500',
                            },
                        }}
                    >
                        <Tab label="Acheter" {...a11yProps(0)} />
                        <Tab label="Vendre" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel sx={{
                        '& .MuiTabPanel-root': {
                            backgroundColor: 'transparent'
                        }
                    }} value={value} index={0} dir={theme.direction}>
                        <div
                            className={classes.form}>
                            <SelectWallet wallets={wallet} onSelect={handleSelectWallet} />

                            <div className={classes.div}>
                                <div className={classes.fields}>
                                    <div style={{ width: '100%' }}>
                                        <TextField
                                            id="outlined-number"
                                            color='warning'
                                            fullWidth
                                            label="Dépenser"
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            placeholder={deviseSelected && thisWallet
                                                ? `0.00 - ${(thisWallet.solde * deviseSelected.valeur).toFixed(2)}`
                                                : ''}
                                            value={amount}
                                            onChange={handleAmountChange}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{deviseSelected ? deviseSelected.name : ''}</InputAdornment>,
                                            }}
                                        />
                                        {console.log(thisWallet)}
                                        {error && (
                                            <p id="pwdnote" className={error ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                Le montant dépasse le solde maximum autorisé.
                                            </p>
                                        )}

                                    </div>


                                    <AutocompleteHint
                                        options={devises}
                                        label="Devises"
                                        id="2"
                                        onChange={handleDeviseSelectedChange}
                                    />
                                    {console.log(coins)}
                                </div>
                                <div className={classes.fields}>
                                    <TextField
                                        fullWidth
                                        color='warning'
                                        label="Recevoir"
                                        placeholder='0.00'
                                        type="text"
                                        value={amountToReceive}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">{cryptoSelected ? cryptoSelected.symbol : ''}</InputAdornment>,
                                        }}

                                    />
                                    <AutocompleteHint
                                        options={coins}
                                        label="Cryptos"
                                        id="1"
                                        onChange={handleCryptoSelectedChange}
                                    />
                                </div>
                            </div>
                            {thisWallet && deviseSelected && cryptoSelected &&
                                < Slider
                                    value={selectedPercentage}
                                    onChange={handlePercentageChange}
                                    aria-label="Temperature"
                                    defaultValue={30}
                                    color='warning'
                                    valueLabelDisplay="auto"
                                    shiftStep={30}
                                    step={10}
                                    marks
                                    min={0}
                                    max={100}
                                />
                            }
                            {deviseSelected && cryptoSelected &&
                                <>
                                    <Typography margin='auto' fontWeight={600}>
                                        Montant : {amount + deviseSelected.name}
                                    </Typography>
                                    <Typography margin='auto' fontWeight={600}>
                                        Montant en Euros: {(amount / deviseSelected.valeur).toFixed(2)} €
                                    </Typography>
                                </>
                            }

                            <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto', gap: '20px' }}>
                                <p style={{ fontWeight: 600, fontFamily: 'Poppins', justifyContent: 'space-around' }}>
                                    {thisWallet ? 'Portefeuille : ' + thisWallet.name : ''}

                                </p>
                                <p>|</p>
                                <p style={{ fontWeight: 600, fontFamily: 'Poppins', margin: 'auto' }}>
                                    {thisWallet ? 'Solde : ' + thisWallet.solde + ' €' : ''}

                                </p>
                            </div>
                            <button
                                onClick={() => handleBuyDeposit()}
                                className={classes.button}
                            >Recevoir</button>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <form
                            className={classes.form}>

                            <div className={classes.div}>
                                <TextField
                                    fullWidth
                                    color='warning'
                                    label="Depenser"
                                    placeholder='Saisissez un montant'
                                    type="text"
                                />
                                <TextField
                                    fullWidth
                                    color='warning'
                                    label="Recevoir"
                                    placeholder='0.00'
                                    type="text"

                                />
                            </div>
                            <button

                                className={classes.button}
                            >Recevoir
                            </button>
                        </form>
                    </TabPanel>
                </SwipeableViews>
            </ Box >
        </Box>
    );
}
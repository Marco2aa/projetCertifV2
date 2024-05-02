import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Autocomplete, Slider, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AutocompleteHint from './Autocomplete';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { CryptoState } from '../CryptoContext';
import SelectWallet from './SelectWallet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './RegisterForm/RegisterForm.css'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';


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
    const [pageTitle, setPageTitle] = useState('Achetez des Cryptos .');
    const [selectedPercentage, setSelectedPercentage] = useState(0);
    const [amount, setAmount] = useState(0);
    const [solde, setSolde] = useState(0)
    const [selectedValue, setSelectedValue] = useState(null);
    const [wallet, setWallet] = useState([])
    const [selectedWallet, setSelectedWallet] = useState('')
    const [error, setError] = useState(false)

    const thisWallet = wallet.find(item => item.name === selectedWallet)
    console.log(thisWallet);


    const calculateAmount = (percentage) => {
        const walletBalance = solde;
        const calculatedAmount = (percentage / 100) * walletBalance;
        return calculatedAmount.toFixed(2);
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
            setSolde(response.data[0].solde)
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

    const handleSelectedValueChange = (newValue) => {
        setSelectedValue(newValue);
    }

    const handleSelectWallet = (selectedValue) => {
        console.log("Wallet selected:", selectedValue);
        setSelectedWallet(selectedValue)
    }

    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue === '') {
            setError(false);
            setAmount(inputValue) // Réinitialise l'erreur si l'utilisateur efface le contenu
        } else if (parseFloat(inputValue) <= solde) {
            setAmount(inputValue);
            setError(false); // Réinitialise l'erreur si la valeur saisie est valide
        } else {
            setAmount(solde.toString()); // Remplace la valeur saisie par le solde
            setError(true); // Définit l'erreur sur true si la valeur saisie dépasse le solde
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
                <Typography>Pris en charge :

                </Typography>
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
                border: '1px solid grey'
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
                        <form
                            className={classes.form}>
                            <SelectWallet wallets={wallet} onSelect={handleSelectWallet} />

                            <div className={classes.div}>
                                <div className={classes.fields}>
                                    <div style={{ width: '100%' }}>

                                        <TextField
                                            fullWidth
                                            color='warning'
                                            label="Depenser"
                                            placeholder={`0.00 - ${solde.toFixed(2)}`}
                                            type="text"
                                            value={amount}
                                            onChange={handleAmountChange}
                                        />
                                        {error && (
                                            <p id="pwdnote" className={error ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                Le montant dépasse le solde maximum autorisé.
                                            </p>
                                        )}

                                    </div>


                                    <AutocompleteHint
                                        options={coins}
                                        label="Cryptos"
                                        id="1"
                                        onChange={handleSelectedValueChange}
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

                                    />
                                    <AutocompleteHint
                                        options={devises}
                                        label="Devises"
                                        id="2"
                                        onChange={handleSelectedValueChange}
                                    />
                                </div>
                            </div>
                            <Slider
                                value={selectedPercentage}
                                onChange={handlePercentageChange}
                                aria-label="Temperature"
                                defaultValue={30}
                                color='warning'
                                // getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                shiftStep={30}
                                step={10}
                                marks
                                min={0}
                                max={100}
                            />
                            <Typography margin='auto' fontWeight={600}>
                                Montant sélectionné: {amount}
                            </Typography>
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
                                className={classes.button}
                                type="sumbit">Recevoir</button>
                        </form>
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
                                type="sumbit">Recevoir</button>
                        </form>
                    </TabPanel>
                </SwipeableViews>
            </ Box >
        </Box>
    );
}
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
import SelectCrypto from '../Autocomplete';
import AutocompleteHint from '../Autocomplete';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { CryptoState } from '../../CryptoContext';


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
                <Box sx={{ p: 3 }}>
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




    const handleChange = (event, newValue) => {
        setValue(newValue);
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


    const useStyles = makeStyles(() => ({
        title: {
            fontFamily: "Poppins",
            fontWeight: "700",
            marginBottom: "50px"


        },
        form: {
            display: "flex",
            gap: "100px",
            flexDirection: "column",
            width: "100%",
            marginBottom: "10px"
        },

        button: {
            height: "55px",
            backgroundColor: "orange",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1.2em",
            fontWeight: "500",
            width: "100%"
        },
        div: {
            display: "flex",
            width: "100%",
            flexDirection: "column",
            gap: "30px"
        },
        fields: {

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: "30px"
        }

    }))

    const classes = useStyles()



    return (
        <Box sx={{
            bgcolor: 'background.paper',
            width: 600, borderRadius: 5,
            overflow: "hidden",
            marginTop: 15
        }} >
            <AppBar position="static"
                sx={{
                    borderTopRightRadius: '8px',
                    borderTopLeftRadius: '8px'
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
                        // '& .MuiTab-root': {
                        //     borderRadius: '10px', 
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
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <form
                        className={classes.form}>

                        <div className={classes.div}>
                            <div className={classes.fields}>

                                <TextField
                                    fullWidth
                                    color='warning'
                                    label="Depenser"
                                    placeholder='Saisissez un montant'
                                    type="email"
                                />
                                <AutocompleteHint
                                    options={coins}
                                    label="Cryptos"
                                    id="1"
                                />
                                {console.log(coins)}
                            </div>
                            <div className={classes.fields}>
                                <TextField
                                    fullWidth
                                    color='warning'
                                    label="Recevoir"
                                    placeholder='0.00'
                                    type="password"

                                />
                                <AutocompleteHint
                                    options={devises}
                                    label="Devises"
                                    id="2"
                                />
                            </div>
                        </div>
                        <Slider
                            aria-label="Temperature"
                            defaultValue={30}
                            // getAriaValueText={valuetext}
                            valueLabelDisplay="auto"
                            shiftStep={30}
                            step={10}
                            marks
                            min={10}
                            max={110}
                        />
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
                                type="email"
                            />
                            <TextField
                                fullWidth
                                color='warning'
                                label="Recevoir"
                                placeholder='0.00'
                                type="password"

                            />
                        </div>
                        <button
                            className={classes.button}
                            type="sumbit">Recevoir</button>
                    </form>
                </TabPanel>
            </SwipeableViews>
        </ Box >
    );
}
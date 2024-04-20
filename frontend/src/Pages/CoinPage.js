import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { CryptoState } from '../CryptoContext.js';
import { ThemeProvider, makeStyles } from '@mui/styles';
import { useState } from 'react';
import axios from "axios";
import { SingleCoin } from '../config/api.js';
import CoinInfo from '../Components/CoinInfo.js';
import { LinearProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { numberWithCommas } from '../Components/Banner/Carousel.js';

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol } = CryptoState();
  const theme = useTheme();
  
  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
  const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  console.log(coin);

  useEffect(() => {
    fetchCoin();
  }, []);

  const useStyles = makeStyles(() => ({
    container: {
      display: "flex",
      ...(matchesMD &&{
        flexDirection:"column",
        alignItems:"center",
      }),
      // height:"100vh",
      flexGrow: 1,
    },
    sidebar: {
      width: matchesSM ? "100%" : "30%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: matchesMD ?"none" : "2px solid grey" ,
      height:"100vh",
      flexShrink: 0,
      gap:50
     
    },
    heading: {
      fontWeight: "bolder",
      marginBottom: "40px",
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 40,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      display:"flex",
      flexDirection:"column",

      gap:40,
      width: "100%",
      ...(matchesMD && {
        display: "flex",
        justifyContent: "space-around",
        flexDirection:"row",

      }),
      ...(matchesSM && {
        flexDirection: "column",
        alignItems: "center",
      }),
      ...(matchesXS && {
        alignItems: "start",
      }),
    },
  }));

  const classes = useStyles();

  if(!coin) return <LinearProgress style={{
    backgroundColor:"gold",
  }}/>

  return (
      <div className={classes.container}>
        <div className={classes.sidebar}>
          <img
            src={coin?.image.large}
            alt={coin?.name}
            height="200"
            style={{ marginBottom: 20 }}
          />
          <Typography variant="h3" className={classes.heading}>
            {coin?.name}
          </Typography>
          <Typography variant="subtitle1" className={classes.description}>
          {coin?.description?.en?.split(". ")[0]}.
        </Typography>

        <div className={classes.marketData}>
          <span style={{display:"flex"}}>
          <Typography variant="h5" className={classes.heading}>
            Rank:
          </Typography>
          <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
            {coin?.market_cap_rank}
          </Typography>
          </span>
          <span style={{display:"flex"}}>
          <Typography variant="h5" className={classes.heading}>
            Current Price:
          </Typography>
          <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
          {symbol}{" "}
          {numberWithCommas(
            coin?.market_data.current_price[currency.toLowerCase()])}
          </Typography>
          </span>
          <span style={{display:"flex"}}>
          <Typography variant="h5" className={classes.heading}>
            Market Cap:{" "}
          </Typography>
          
          <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
          {symbol}{" "}
          {numberWithCommas(
            coin?.market_data.market_cap[currency.toLowerCase()]
              .toString()
              .slice(0,-6)
            )}
            M
          </Typography>
          </span>
        </div>
        
        </div>

        <CoinInfo coin={coin} />
      </div>

  );
};

export default CoinPage;

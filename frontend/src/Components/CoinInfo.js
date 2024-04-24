import React, { useEffect, useState } from 'react';
import { CryptoState } from '../CryptoContext.js';
import { HistoricalChart } from '../config/api.js';
import axios from 'axios';
import { useTheme } from '@material-ui/core';
import { CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import SelectButton from './SelectButton.js';
import { chartDays } from '../config/data.js';

ChartJS.register(...registerables);

const CoinInfo = ({ coin }) => {
  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);

  const { currency } = CryptoState();

  const theme = useTheme();

  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistoricalData(data.prices);
  };

  useEffect(() => {
    fetchHistoricData();
  }, [currency, days]);

  // const darkTheme = createTheme({
  //   palette: {
  //     primary: {
  //       main: "#fff",
  //     },
  //     type: "dark",
  //   }
  // });

  const useStyles = makeStyles(() => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      ...(matchesMD && {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      }),
    },
  }));

  const classes = useStyles();

  return (
    // <ThemeProvider theme={darkTheme}>
    <div className={classes.container}>
      {!historicalData ? (
        <CircularProgress
          style={{ color: "orange" }}
          size={250}
          thickness={1}
        />
      ) : (
        <>
          <Line
            data={{
              labels: historicalData.map(coin => {
                let date = new Date(coin[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                    : `${date.getHours()}:${date.getMinutes()} AM`;

                return days === 1 ? time : date.toLocaleDateString();
              }),
              datasets: [
                {
                  data: historicalData.map(coin => coin[1]),
                  label: `Price (Past ${days} Days) in ${currency}`,
                  borderColor: "#EEBC1D"
                }
              ]
            }}
            options={{
              elements: {
                point: {
                  radius: 1
                }
              }
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: 20,
              justifyContent: "space-around",
              width: "100%"
            }}
          >
            {chartDays.map(day => (
              <SelectButton
                key={day.value}
                onClick={() => setDays(day.value)}
                selected={day.value === days}
              >
                {day.label}
              </SelectButton>
            ))}
          </div>
        </>
      )}
    </div>

  );
};

export default CoinInfo;

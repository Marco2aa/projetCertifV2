import { AppBar, Toolbar, Typography ,Container, makeStyles, createTheme, ThemeProvider, Select, MenuItem} from '@material-ui/core'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CryptoState } from '../CryptoContext.js'

const useStyles = makeStyles(() =>({
  title: {
    flex: 1,
    color: "gold",
    fontFamily : "Montserrat",
    fontWeight :"bold",
    cursor: "pointer",
  }
}))

const Header = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate("/");
  }

  const {currency, setCurrency, devises} = CryptoState()

  console.log(currency);
  
  const darkTheme = createTheme({
    palette: {
      primary:{
        main : "#fff",
      },
      type: "dark",
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color='transparent' position='static'>
        <Container>
        <Toolbar>
            <Typography onClick={handleNavigate} className={classes.title}>
                Afflo Crypto
            </Typography>
            <Select
            variant='outlined'
            style={{
              width:100,
              height:40,
              marginLeft:15,
            }}
            value={currency}
            onChange={(e) =>setCurrency(e.target.value)}>
              {console.log(devises)}
              {devises.map((devise) => ( 
                <MenuItem key={devise.id} value={devise.nom}>{devise.nom}</MenuItem>
              ))}
            </Select>
        </Toolbar>
        </Container>
    </AppBar>
    </ThemeProvider>
    
  )
}

export default Header

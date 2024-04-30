import { AppBar, Toolbar, Typography, Container, makeStyles, createTheme, ThemeProvider, Select, MenuItem } from '@material-ui/core'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CryptoState } from '../CryptoContext.js'
import { Button, FormControl, InputLabel } from '@mui/material'
import { useState, useEffect } from 'react'
import { AccountBalanceIcon } from '@mui/icons-material/AccountBalance';
import { yellow } from '@material-ui/core/colors'
import { Mosque, WidthFull, Synagogue } from '@mui/icons-material'
import UserDisplay from './UserDisplay/UserDisplay.js'

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: "orange",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: 20

  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  formControl: {
    marginLeft: "auto",
    minWidth: 120
  },
  container: {
    width: '100%'

  }
}))

const Header = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate("/");
  }

  const { currency, setCurrency, devises } = CryptoState()
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleDisconect = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  console.log(currency);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar className={classes.toolbar} color='transparent' position='static'>
        <div className={classes.container}>
          <Toolbar>
            <Mosque sx={{ color: yellow['A700'], fontSize: 40 }} />
            <Synagogue sx={{ color: yellow['A700'], fontSize: 40 }} />
            <Typography variant='h5' onClick={handleNavigate} className={classes.title}>
              Afflo Crypto
            </Typography>
            <FormControl
              variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                label="Devise"
              >
                {console.log(devises)}
                {devises.map((devise) => (
                  <MenuItem key={devise.id} value={devise.name}>{devise.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {isAuthenticated ? (
              <Button onClick={handleDisconect}>Déconnexion</Button>
            ) : (
              <>
                <Link to='/login'>Connexion</Link>
                <Link to='/register'>S'inscrire</Link>
              </>
            )}
            <UserDisplay />
          </Toolbar>
        </div>
      </AppBar>
    </ThemeProvider>



  )
}

export default Header

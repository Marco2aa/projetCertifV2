import { AppBar, Toolbar, Typography, Avatar, makeStyles, createTheme, ThemeProvider, Select, MenuItem } from '@material-ui/core';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CryptoState } from '../Context/CryptoContext.js';
import { Button, FormControl } from '@mui/material';
import { Mosque, Synagogue } from '@mui/icons-material';
import { AuthContext } from '../Context/AuthContext'; // Import du contexte AuthContext

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
  avatar: {
    marginLeft: 20,
    cursor: 'pointer'
  },
  container: {
    width: '100%'
  }
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { currency, setCurrency, devises } = CryptoState();

  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const handleNavigate = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
            <Mosque sx={{ color: "yellow", fontSize: 40 }} />
            <Synagogue sx={{ color: "yellow", fontSize: 40 }} />
            <Typography variant='h5' onClick={handleNavigate} className={classes.title}>
              Afflo Crypto
            </Typography>

            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                label="Devise"
              >
                {devises.map((devise) => (
                  <MenuItem key={devise.id} value={devise.name}>{devise.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {isAuthenticated ? (
              <>
                <Avatar alt={user?.username} src={user?.profileImage} className={classes.avatar} />
                <Typography variant="h6" sx={{ marginLeft: 2 }}>Bienvenue, {user?.username}!</Typography>
                <Button onClick={handleLogout}>Déconnexion</Button>
              </>
            ) : (
              <>
                <Link to='/login'>Connexion</Link>
                <Link to='/register'>S'inscrire</Link>
              </>
            )}
          </Toolbar>
        </div>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Typography } from '@material-ui/core';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { yellow } from '@material-ui/core/colors'
import { BorderColor } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const primary = yellow['A700'];
  const [register, setRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const useStyles = makeStyles(() => ({
    title: {
      fontFamily: "Poppins",
      fontWeight: "700",
      marginBottom: "50px"


    },
    form: {
      display: "flex",
      gap: "35px",
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
      fontWeight: "500"
    }

  }))

  const notifysucces = () => toast('🦄 Wow so easy!');
  const notifyfailure = () => toast('🦄 Wow not so easy!');

  const classes = useStyles()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAuthenticated === false) {
      try {
        const response = await axios.post('https://localhost:8000/api/login', {
          username: email,
          password: password
        });
        console.log('Login successful:', response.data);
        localStorage.setItem('token', response.data.token)
        setIsAuthenticated(true)
        notifysucces()
        // navigate('/')
      } catch (error) {
        setError('Invalid credentials. Please try again.');
        console.log('Invalid credentials. Please try again.');
      }
    } else {
      notifyfailure()
    }

  };


  return (


    <Box
      height={550}
      width={400}

      display="flex"
      alignItems="center"
      gap={4}
      p={2}
      flexDirection='column'
      justifyContent='center'
      sx={{
        border: '1px solid grey',
        borderRadius: '16px'
      }}
    >
      <Typography
        variant='h5'

        className={classes.title}>
        Connectez vous
      </Typography>
      <form
        className={classes.form}
        onSubmit={handleSubmit}>
        <TextField
          fullWidth
          color='warning'
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <TextField
          fullWidth
          color='warning'
          label="Mot de passe"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className={classes.button}
          type="sumbit">Connexion</button>
      </form>
      <Link>Mot de passe oublié ?</Link>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Box>



  )
}

export default LoginForm;

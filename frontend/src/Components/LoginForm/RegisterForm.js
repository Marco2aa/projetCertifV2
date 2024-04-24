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

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
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
            // marginBottom: "0px"


        },
        form: {
            display: "flex",
            gap: "25px",
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



    const classes = useStyles()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === passwordConfirm) {
            try {


                navigate('/')
            } catch (error) {
                setError('Invalid credentials. Please try again.');
                console.log('Invalid credentials. Please try again.');
            }
        }

    };



    return (


        <Box
            height={650}
            width={450}

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
                Bienvenue sur Afflo'Crypto
            </Typography>
            <form
                className={classes.form}
                onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    color='warning'
                    label="Email"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    color='warning'
                    label="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    type="text"
                />
                <TextField
                    fullWidth
                    color='warning'
                    label="Prénom"
                    value={prenom}
                    type="password"
                    onChange={(e) => setPrenom(e.target.value)}
                />
                <TextField
                    fullWidth
                    color='warning'
                    label="Mot de passe"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    fullWidth
                    color='warning'
                    label="Confirmez le mot de passe"
                    value={passwordConfirm}
                    type="password"
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <button
                    className={classes.button}
                    type="sumbit">Inscrivez vous</button>
            </form>



        </Box>



    )
}

export default RegisterForm;

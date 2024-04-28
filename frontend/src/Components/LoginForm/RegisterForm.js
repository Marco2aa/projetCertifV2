import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Typography } from '@material-ui/core';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Visibility, VisibilityOff } from '@mui/icons-material';

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);


    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    const emailRef = useRef();
    const errRef = useRef();

    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setValidEmail(email);
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === confirmPassword);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])



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

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password === passwordConfirm) {
            try {
                const response = await axios.post('https://localhost:8000/api/register', {
                    email,
                    password,
                    nom,
                    prenom
                });
                console.log(response.data);
                navigate('/');
            } catch (error) {
                setError('Invalid credentials. Please try again.');
                console.log('Invalid credentials. Please try again.');
            }
        }
    };



    return (


        <Box
            // height={650}
            // width={450}

            display="flex"
            alignItems="center"
            gap={4}
            p={4}
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
                onSubmit={handleRegister}>
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
                    type="text"
                    onChange={(e) => setPrenom(e.target.value)}
                />
                <FormControl variant="outlined">
                    <InputLabel color='warning' htmlFor="outlined-adornment-password">Mot de passe</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment style={{ display: 'flex', gap: '10px' }} position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                <FontAwesomeIcon icon={faCheck} />
                            </InputAdornment>
                        }
                        label="Mot de passe"
                        color='warning'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel color='warning' htmlFor="outlined-adornment-password">Confirmez le mot de passe</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Confirmez le mot de passe"
                        color='warning'
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                </FormControl>
                <TextField
                    fullWidth
                    color='warning'
                    label="Mot de passe"
                    value={password}
                    type="password"
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <OutlinedInput
                    fullWidth
                    color='warning'
                    label="Confirmez le mot de passe"
                    placeholder='Confirmez le mot de passe'
                    value={passwordConfirm}
                    type='password'
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

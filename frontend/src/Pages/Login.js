import React, { useState } from 'react';
import LoginForm from '../Components/LoginForm/LoginForm';
import Header from '../Components/Header';
import FormLayout from '../Components/FormLayout';
import RegisterForm from '../Components/LoginForm/RegisterForm';
import { Link } from 'react-router-dom';

const Login = () => {
  const [register, setRegister] = useState(false);

  const handleClick = () => {
    setRegister(!register)
  }



  return (
    <div>
      <FormLayout>
        {register ? (
          <>
            <RegisterForm />
            <Link onClick={handleClick}>Déjà un compte ? Connectez vous maintenant</Link>
          </>
        ) : (
          <>
            <LoginForm />
            <Link onClick={handleClick}>Créez un compte Afllo'Crypto</Link>
          </>
        )}
      </FormLayout>
    </div>
  );
};

export default Login;

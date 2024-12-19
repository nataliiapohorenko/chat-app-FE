import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import PropTypes from 'prop-types';
import { TailSpin } from "react-loader-spinner";
import { useHttp } from '../hooks/http.hook';
import config from '../config.js';

import '../styles/LoginPage.scss';

const LoginPage = ({setIsAuthenticated}) => {
  const [loading, setLoading] = useState(false)

  const { request} = useHttp();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const expiry = new Date().getTime() + 60 * 60 * 1000; 
      const token = credentialResponse.credential;
      localStorage.setItem('authToken', JSON.stringify({ token, expiry }));
      setLoading(true);
      const response = await request(
        `${config.apiUrl}/auth/login`,
        'POST',
        {},
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );
      if (response?.user?.name) {
        localStorage.setItem('user', response.user.name);
        setLoading(false);
      } else {
        console.warn('User information not found in the response');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setIsAuthenticated(false);
    }
    setIsAuthenticated(true);
  };

  return (
    <div className='login'>
      <div className='login-container'>
        {
          !loading ? <>
            <p>Welcome to our chat application! Please, log in using your Google account.</p>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </> : <TailSpin color="grey" radius={"4px"} width={'150px'}  height={'150px'}/>
        }
        
    </div>
    </div>
  );
};

LoginPage.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};


export default LoginPage;

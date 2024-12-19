import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx';

const CLIENT_ID = "477245118510-j0h3tp2l2mq7i6f43o8lnivcadv24inu.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}> 
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);


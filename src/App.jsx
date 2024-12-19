import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import './styles/App.scss';

import config from './config.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');

  useEffect(() => {
    fetch(`${config.apiUrl}/healthcheck`, { method: 'GET' })
      .catch(err => console.error(err));
  }, [])
  
  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('authToken'));
    setUser(localStorage.getItem('user'));
}, [isAuthenticated]);

const storedItem = localStorage.getItem('authToken');

if (storedItem) {
  const { expiry } = JSON.parse(storedItem);
  const now = new Date().getTime();
  if (now > expiry) {
    console.log('Token has expired');
    localStorage.removeItem('authToken'); 
    setIsAuthenticated(false);
    setUser('');
  } 
} 

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <MainPage user={user} setIsAuthenticated={setIsAuthenticated}/> : <LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

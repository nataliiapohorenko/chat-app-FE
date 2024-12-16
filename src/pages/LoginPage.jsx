import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Логіка авторизації
    if (email === 'test@example.com' && password === 'password') {
      console.log('Logged in successfully');
      navigate('/'); // Перенаправлення на головну сторінку
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <h1>Log In</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default LoginPage;

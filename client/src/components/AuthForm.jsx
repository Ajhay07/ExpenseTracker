import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const AuthForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!email || !password || (!isLogin && !username)) {
      alert('Please fill all required fields');
      return;
    }

    const user = isLogin
      ? {
          email,
          username: email.split('@')[0], // fallback username for login
          password
        }
      : {
          email,
          username,
          password
        };

    localStorage.setItem('user', JSON.stringify(user));
    onAuth(user);
  };

  return (
    <Paper sx={{ p: 4, mt: 8, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {isLogin ? 'Login' : 'Sign Up'}
      </Typography>

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {!isLogin && (
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
        {isLogin ? 'Login' : 'Sign Up'}
      </Button>

      <Button
        variant="text"
        fullWidth
        onClick={() => setIsLogin(!isLogin)}
        sx={{ mt: 1 }}
      >
        {isLogin ? 'Create account' : 'Already have an account?'}
      </Button>
    </Paper>
  );
};

export default AuthForm;

// trigger vercel deploy
import React, { useState, useEffect } from 'react';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@mui/material';
import ExpenseTracker from './components/ExpenseTracker';
import AuthForm from './components/AuthForm';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const theme = createTheme({
    palette: { mode: darkMode ? 'dark' : 'light' }
  });

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Expense Tracker
          </Typography>

          {user && (
            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {user.username || user.email}
            </Typography>
          )}

          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

          {user && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {user ? <ExpenseTracker /> : <AuthForm onAuth={setUser} />}
    </ThemeProvider>
  );
}

export default App;

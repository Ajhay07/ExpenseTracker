import React from 'react';
import { Paper, Typography, Grid } from '@mui/material';

const Dashboard = ({ transactions }) => {
  const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
  const balance = income + expense;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6">Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography>💰 Income</Typography>
          <Typography color="green">₹{income}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>💸 Expense</Typography>
          <Typography color="red">₹{Math.abs(expense)}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>💼 Balance</Typography>
          <Typography color="primary">₹{balance}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Dashboard;

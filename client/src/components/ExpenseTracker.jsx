import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Dashboard from './Dashboard';
import PieChart from './PieChart';

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('General');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const API = 'http://localhost:4000/transactions';
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user?.email) return;

    try {
      const query = new URLSearchParams({
        email: user.email,
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      });

      const res = await axios.get(`${API}?${query.toString()}`);
      setTransactions(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const addTransaction = async () => {
    if (!desc || !amount) {
      alert('Please fill in description and amount.');
      return;
    }

    const signedAmount =
      type === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

    const newTxn = {
      desc,
      amount: signedAmount,
      type,
      category,
      userEmail: user.email
    };

    try {
      const res = await axios.post(API, newTxn);
      console.log("Saved transaction:", res.data);
      setTransactions([res.data, ...transactions]);

      setDesc('');
      setAmount('');
      setType('income');
      setCategory('General');
    } catch (error) {
      alert('Failed to save. Please check server.');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (error) {
      alert('Failed to delete transaction.');
      console.error("Delete error:", error);
    }
  };

  const exportToExcel = () => {
    const query = new URLSearchParams({
      email: user.email,
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    });

    window.open(`http://localhost:4000/transactions/export?${query.toString()}`, '_blank');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Dashboard transactions={transactions} />

      <TextField
        label="Start Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <TextField
        label="End Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <Button
        variant="outlined"
        fullWidth
        sx={{ my: 1 }}
        onClick={fetchTransactions}
      >
        Apply Date Filter
      </Button>

      <Button
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        onClick={exportToExcel}
      >
        Export as Excel
      </Button>

      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="General">General</MenuItem>
          <MenuItem value="Food">Food</MenuItem>
          <MenuItem value="Transport">Transport</MenuItem>
          <MenuItem value="Entertainment">Entertainment</MenuItem>
          <MenuItem value="Bills">Bills</MenuItem>
          <MenuItem value="Shopping">Shopping</MenuItem>
          <MenuItem value="Others">Others</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        margin="normal"
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={addTransaction}
      >
        ADD
      </Button>

      <Divider sx={{ my: 3 }} />
      <PieChart data={transactions} />

      <List>
        {transactions.map((t) => (
          <ListItem
            key={t._id}
            secondaryAction={
              <IconButton edge="end" onClick={() => deleteTransaction(t._id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${t.desc} (${t.category})`}
              secondary={`${t.type === 'income' ? '+' : '-'} ₹${Math.abs(t.amount)}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ExpenseTracker;

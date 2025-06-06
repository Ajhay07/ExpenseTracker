// index.js (Complete Server Code with Excel Export, Colors & Totals)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ExcelJS = require('exceljs');
const Transaction = require('./models/Transaction');

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb+srv://ajhaymadan:Ajhay1415@cluster0.jfmcyjq.mongodb.net/expenseDB?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// POST: Add transaction
app.post('/transactions', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get transactions for a user (with date filter)
app.get('/transactions', async (req, res) => {
  try {
    const { email, startDate, endDate } = req.query;
    const query = { userEmail: email };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a transaction by ID
app.delete('/transactions/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EXPORT: Download transactions as Excel with styling
app.get('/transactions/export', async (req, res) => {
  try {
    const { email, startDate, endDate } = req.query;

    if (!email) return res.status(400).send('Missing user email');

    const query = { userEmail: email };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).sort({ date: 1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    worksheet.columns = [
      { header: 'Description', key: 'desc', width: 30 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Date', key: 'date', width: 25 },
      { header: 'Balance', key: 'balance', width: 20 }
    ];

    let balance = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(txn => {
      balance += txn.amount;
      if (txn.type === 'income') totalIncome += txn.amount;
      else totalExpense += txn.amount;

      const row = worksheet.addRow({
        desc: txn.desc,
        amount: txn.amount,
        type: txn.type,
        category: txn.category,
        date: new Date(txn.date).toLocaleString(),
        balance
      });

      row.eachCell(cell => {
        cell.font = {
          color: {
            argb: txn.type === 'income' ? 'FF007500' : 'FFB22222'
          }
        };
      });
    });

    const totalRow = worksheet.addRow({
      desc: 'Total',
      amount: '',
      type: '',
      category: '',
      date: '',
      balance: balance
    });

    totalRow.getCell('desc').font = { bold: true };
    totalRow.getCell('amount').value = {
      richText: [
        { text: `+${totalIncome} `, font: { color: { argb: 'FF007500' } } },
        { text: ` -${Math.abs(totalExpense)}`, font: { color: { argb: 'FFB22222' } } }
      ]
    };
    totalRow.getCell('balance').font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=transactions.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).send('Failed to export transactions');
  }
});

app.listen(4000, () => console.log('Server running on port 4000'));

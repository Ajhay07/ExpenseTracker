const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  desc: String,
  amount: Number,
  type: String,
  category: String,
  userEmail: String, // ✅ user identifier
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);

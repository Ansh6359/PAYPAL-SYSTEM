const mongoose = require('mongoose');
const User = require('./User');

const transactionSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Completed', 'Failed'],
    required: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

transactionSchema.methods.getSender = async function() {
  return await User.findById(this.senderId);
};

transactionSchema.methods.getRecipient = async function() {
  return await User.findById(this.recipientId);
};

module.exports = Transaction;
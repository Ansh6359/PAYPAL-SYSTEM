const mongoose = require('mongoose');
const User = require('./User');

const walletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
    default: 0.0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Wallet = mongoose.model('Wallet', walletSchema);

walletSchema.methods.getUser = async function() {
  return await User.findById(this.userId);
};

module.exports = Wallet;

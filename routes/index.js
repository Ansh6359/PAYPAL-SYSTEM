var express = require('express');
var router = express.Router();
const Wallet = require('../models/wallet');
const User = require('../models/User');
const Transaction = require('../models/transaction');

// ROUTE TO RENDER HOME PAGE 
router.get('/', async function (req, res, next) {
  if (req.isAuthenticated()) {
    try {
      const userId = req.user._id; 
      const wallet = await Wallet.findOne({ userId });

      res.render('index', {
        title: 'PayPal System',
        user: req.user,
        wallet: wallet ? wallet : { balance: 0 },
        error: null,
        success: null
      });
    } catch (err) {
      console.error(err);
      res.render('index', {
        title: 'PayPal System',
        user: req.user,
        error: 'Error fetching wallet data',
        success: null
      });
    }
  } else {
    res.render('index', { title: 'PayPal System', user: null, error: null, success: null });
  }
});

// ROUTE TO HANDLE ADDING MONEY TO THE WALLET
router.post('/add-money', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  try {
    const userId = req.user._id;
    const amount = parseFloat(req.body.amount);

    // Validate the amount
    if (isNaN(amount) || amount <= 0) {
      return res.render('index', { 
        title: 'PayPal System',
        user: req.user,
        wallet: { balance: 0 },
        error: 'Invalid amount',
        success: null
      });
    }

    // Find or create a wallet for the user
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId, balance: amount });
      await wallet.save();
    } else {
      wallet.balance += amount;
      await wallet.save();
    }

    // Show success message
    res.render('index', {
      title: 'PayPal System',
      user: req.user,
      wallet,
      error: null,
      success: `Successfully added $${amount} to your wallet.`
    });
  } catch (err) {
    console.log(err);
    res.status(500).render('index', {
      title: 'PayPal System',
      user: req.user,
      wallet: { balance: 0 },
      error: 'Something went wrong',
      success: null
    });
  }
});

// ROUTE TO HANDLE SENDING MONEY
router.post('/send-money', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }

  const { recipient_email, amount } = req.body;

  try {
    const sender = req.user;
    const recipient = await User.findOne({ email: recipient_email });

    if (!recipient) {
      return res.render('index', { 
        title: 'PayPal System',
        user: req.user,
        wallet: { balance: 0 },
        error: 'Recipient not found.',
        success: null
      });
    }

    if (sender.email === recipient.email) {
      return res.render('index', {
        title: 'PayPal System',
        user: req.user,
        wallet: { balance: 0 },
        error: 'You cannot send money to yourself.',
        success: null
      });
    }

    // Check sender's wallet balance
    const senderWallet = await Wallet.findOne({ userId: sender._id });

    if (!senderWallet || senderWallet.balance < amount) {
      return res.render('index', {
        title: 'PayPal System',
        user: req.user,
        wallet: { balance: 0 },
        error: 'Insufficient balance.',
        success: null
      });
    }

    // Deduct amount from sender's wallet
    senderWallet.balance -= amount;
    await senderWallet.save();

    // Add amount to recipient's wallet
    let recipientWallet = await Wallet.findOne({ userId: recipient._id });
    if (!recipientWallet) {
      recipientWallet = new Wallet({ userId: recipient._id, balance: 0 });
      await recipientWallet.save();
    }
    recipientWallet.balance += amount;
    await recipientWallet.save();

    // Create a transaction record
    await Transaction.create({
      senderId: sender._id,
      recipientId: recipient._id,
      amount,
      status: 'Completed'
    });

    // Success message
    res.render('index', {
      title: 'PayPal System',
      user: req.user,
      wallet: senderWallet,
      error: null,
      success: `Successfully sent $${amount} to ${recipient.email}.`
    });
  } catch (err) {
    console.log(err);
    res.status(500).render('index', {
      title: 'PayPal System',
      user: req.user,
      wallet: { balance: 0 },
      error: 'Something went wrong.',
      success: null
    });
  }
});

// ROUTE TO DISPLAY TRANSACTION HISTORY
router.get('/transactions', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }

  try {
    const userId = req.user._id;

    // Get sent transactions and populate recipient
    const sentTransactions = await Transaction.find({ senderId: userId })
      .populate('recipientId', 'username email');

    // Get received transactions and populate sender
    const receivedTransactions = await Transaction.find({ recipientId: userId })
      .populate('senderId', 'username email');

    res.render('transactions', {
      title: 'Transaction History',
      sent_transactions: sentTransactions,
      received_transactions: receivedTransactions,
      error: null,
      success: null,
      user: req.user
    });
  } catch (err) {
    console.log(err);
    res.render('transactions', {
      title: 'Transaction History',
      sent_transactions: [],
      received_transactions: [],
      error: 'Error fetching transaction history',
      success: null,
      user: req.user
    });
  }
});

module.exports = router;

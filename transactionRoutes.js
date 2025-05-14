const express = require('express');
const router = express.Router();
const {
  createAccount,
  getBalance,
  sendMoney,
  getTransactions
} = require('../controllers/transactionController');

router.post('/create', createAccount);
router.get('/balance/:upiId', getBalance);
router.post('/send', sendMoney);
router.get('/history/:upiId', getTransactions);

module.exports = router;

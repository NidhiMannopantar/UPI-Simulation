let users = {
  'test1@upi': { balance: 1000, history: [] },
  'test2@upi': { balance: 500, history: [] }
};

const checkFraud = require('../fraud/fraudCheck'); // Optional AI

exports.createAccount = (req, res) => {
  const { upiId, balance } = req.body;
  if (users[upiId]) return res.status(400).json({ error: "Account exists" });
  users[upiId] = { balance, history: [] };
  res.json({ message: "Account created" });
};

exports.getBalance = (req, res) => {
  const upiId = req.params.upiId;
  const user = users[upiId];
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ balance: user.balance });
};

exports.sendMoney = async (req, res) => {
  const { fromUpiId, toUpiId, amount } = req.body;
  const sender = users[fromUpiId];
  const receiver = users[toUpiId];

  if (!sender || !receiver) return res.status(404).json({ error: "User not found" });
  if (sender.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

  // Optional AI fraud check
  const hour = new Date().getHours();
  const freq = sender.history.length;
  checkFraud(amount, hour, freq, (risk) => {
    if (risk === "FRAUD") {
      return res.status(403).json({ error: "Transaction flagged as suspicious" });
    }

    sender.balance -= amount;
    receiver.balance += amount;

    const transaction = {
      from: fromUpiId,
      to: toUpiId,
      amount,
      time: new Date().toISOString()
    };

    sender.history.push(transaction);
    receiver.history.push(transaction);

    res.json({ message: "Transaction successful", transaction });
  });
};

exports.getTransactions = (req, res) => {
  const upiId = req.params.upiId;
  const user = users[upiId];
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ history: user.history });
};

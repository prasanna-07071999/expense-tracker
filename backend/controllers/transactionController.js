const Transaction = require("../models/Transaction");

// Add Transaction
exports.addTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Failed to add transaction" });
  }
};

// Get All Transactions (Explorer API)
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, min, max, startDate, endDate } = req.query;

    const query = { user: req.user._id };

    //  Search (title + notes)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } }
      ];
    }

    //  Filter by category
    if (category) {
      query.category = category;
    }

    //  Filter by amount range
    if (min || max) {
      query.amount = {};
      if (min) query.amount.$gte = Number(min);
      if (max) query.amount.$lte = Number(max);
    }

    //  Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

// Get Single Transaction
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!transaction)
        return res.status(404).json({ message: "Transaction not found" });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Transaction
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
const Transaction = require("../models/Transaction");

// Get Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔹 Total Expenses
    const totalResult = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const totalExpenses = totalResult[0]?.total || 0;

    // 🔹 Category Breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // 🔹 Recent Transactions (Last 5)
    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      totalExpenses,
      categoryBreakdown,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
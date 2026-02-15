const express = require("express");
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");

const { protect } = require("../middlewares/authMiddleware");

router.use(protect);

router.route("/")
  .post(addTransaction)
  .get(getTransactions);

router.route("/:id")
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
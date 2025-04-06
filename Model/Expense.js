const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    ExpenseName: {
      type: String,
      required: true,
    },
    BranchId: {
      type: String,
      required: true,
    },
    Amount: {
      type: Number,
      required: true,
    },
    Month: {
      type: Number,
      required: true,
    },
    Year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Expensemodel = mongoose.model("Expense", ExpenseSchema);
module.exports = Expensemodel;

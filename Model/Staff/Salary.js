const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema(
  {
    BranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branchmanagement",
      required: true,
    },
    StaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
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
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Salarymodel = mongoose.model("Salary", SalarySchema);
module.exports = Salarymodel;

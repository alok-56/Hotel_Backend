const { validationResult } = require("express-validator");
const AppErr = require("../Helper/AppError");
const Branchmodel = require("../Model/Branch");
const Expensemodel = require("../Model/Expense");

// Create Expense
const CreateExpense = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { ExpenseName, BranchId, Amount, Month, Year } = req.body;

    // Check Branch
    let branch = await Branchmodel.findById(BranchId);
    if (!branch) {
      return next(new AppErr("Branch not found", 403));
    }

    let Expense = await Expensemodel.create(req.body);

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Expense Created Successfully",
      data: Expense,
    });
  } catch (error) {
    return error.message;
  }
};

// Update Expense
const UpdateExpense = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { ExpenseName, BranchId, Amount, Month, Year } = req.body;

    let { id } = req.params;

    // Check Branch
    if (BranchId) {
      let branch = await Branchmodel.findById(BranchId);
      if (!branch) {
        return next(new AppErr("Branch not found", 403));
      }
    }

    let updateData = {};
    if (ExpenseName) updateData.ExpenseName = ExpenseName;
    if (Amount) updateData.Amount = Amount;
    if (BranchId) updateData.BranchId = BranchId;
    if (Month) updateData.Month = Month;
    if (Year) updateData.Year = Year;

    let Expense = await Expensemodel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Expense Updated Successfully",
      data: Expense,
    });
  } catch (error) {
    return error.message;
  }
};

// Get Expense
const GetAllExpense = async (req, res, next) => {
  try {
    let Expense = await Expensemodel.find({
      BranchId: { $in: req.branch },
    }).populate("BranchId")
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Expense fetched successfully",
      data: Expense,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Delete Expence
const DeleteExpense = async (req, res, next) => {
  try {
    let { id } = req.params;
    let Expense = await Expensemodel.findByIdAndDelete(id);
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Expense Deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateExpense,
  UpdateExpense,
  GetAllExpense,
  DeleteExpense,
};

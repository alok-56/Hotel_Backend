const express = require("express");

const { body } = require("express-validator");
const Islogin = require("../Middleware/Islogin");
const {
  CreateExpense,
  UpdateExpense,
  GetAllExpense,
  DeleteExpense,
} = require("../Controller/Expense");
const ExpenseRouter = express.Router();

ExpenseRouter.post(
  "/create/Expense",
  body("ExpenseName").notEmpty().withMessage("ExpenseName is required"),
  body("BranchId").notEmpty().withMessage("BranchId is required"),
  body("Amount").notEmpty().withMessage("Amount is required"),
  body("Month").notEmpty().withMessage("Month is required"),
  body("Year").notEmpty().withMessage("Year is required"),
  Islogin,
  CreateExpense
);

ExpenseRouter.patch("/update/Expense/:id", Islogin, UpdateExpense);

ExpenseRouter.get("/getall/Expense", Islogin, GetAllExpense);

ExpenseRouter.delete("/delete/Expense/:id", Islogin, DeleteExpense);

module.exports = ExpenseRouter;

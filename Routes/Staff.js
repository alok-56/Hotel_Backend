const express = require("express");
const { body } = require("express-validator");
const Islogin = require("../Middleware/Islogin");
const {
  CreateStaff,
  UpdateStaff,
  GetAllStaff,
  AddStaffSalary,
  GetAllSalary,
  GetAllSalaryByStaff,
} = require("../Controller/Staff");

const StaffRouter = express.Router();

StaffRouter.post(
  "/create/Staff",
  body("Name").notEmpty().withMessage("Name is required"),
  body("Number").notEmpty().withMessage("Number is required"),
  body("Role").notEmpty().withMessage("Role is required"),
  body("BranchId").notEmpty().withMessage("BranchId is required"),
  body("JoiningDate").notEmpty().withMessage("JoiningDate is required"),
  body("Address").notEmpty().withMessage("Address is required"),
  body("Salary").notEmpty().withMessage("Salary is required"),
  Islogin,
  CreateStaff
);

StaffRouter.post(
  "/create/Salary",
  body("BranchId").notEmpty().withMessage("BranchId is required"),
  body("StaffId").notEmpty().withMessage("StaffId is required"),
  body("Amount").notEmpty().withMessage("Amount is required"),
  body("Month").notEmpty().withMessage("Month is required"),
  body("Year").notEmpty().withMessage("Year is required"),
  Islogin,
  AddStaffSalary
);

StaffRouter.patch("/update/Staff/:id", Islogin, UpdateStaff);

StaffRouter.get("/getall/Staff", Islogin, GetAllStaff);

StaffRouter.get("/getall/Salary", Islogin, GetAllSalary);

StaffRouter.get("/getall/Salary/:staffid", Islogin, GetAllSalaryByStaff);

module.exports = StaffRouter;

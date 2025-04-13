const { validationResult } = require("express-validator");
const AppErr = require("../Helper/AppError");
const Branchmodel = require("../Model/Branch");
const Staffmodel = require("../Model/Staff/Staff");
const Salarymodel = require("../Model/Staff/Salary");

// Create Staff
const CreateStaff = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Name, Number, Role, BranchId, JoiningDate, Address, Salary } =
      req.body;

    // Check Branch
    let branch = await Branchmodel.findById(BranchId);
    if (!branch) {
      return next(new AppErr("Branch not found", 403));
    }

    let staff = await Staffmodel.create(req.body);

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Staff Created Successfully",
      data: staff,
    });
  } catch (error) {
    return error.message;
  }
};

// Update Staff
const UpdateStaff = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Name, Number, Role, BranchId, JoiningDate, Address, Salary, Active } =
      req.body;

    let { id } = req.params;

    // Check Branch
    if (BranchId) {
      let branch = await Branchmodel.findById(BranchId);
      if (!branch) {
        return next(new AppErr("Branch not found", 403));
      }
    }

    let updateData = {};
    if (Name) updateData.Name = Name;
    if (Number) updateData.Number = Number;
    if (Role) updateData.Role = Role;
    if (BranchId) updateData.BranchId = BranchId;
    if (JoiningDate) updateData.JoiningDate = JoiningDate;
    if (Address) updateData.Address = Address;
    if (Salary) updateData.Salary = Salary;
    if (Active) updateData.Active = Active;

    let staff = await Staffmodel.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Staff Updated Successfully",
      data: staff,
    });
  } catch (error) {
    return error.message;
  }
};

// Add Salary

const AddStaffSalary = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { BranchId, StaffId, Amount, Month, Year } = req.body;

    // Check Branch
    let branch = await Branchmodel.findById(BranchId);
    if (!branch) {
      return next(new AppErr("Branch not found", 403));
    }

    // check staff
    let staff = await Staffmodel.findById(StaffId);
    if (!staff) {
      return next(new AppErr("Staff not found", 403));
    }

    let salary = await Salarymodel.create(req.body);

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Salary Created Successfully",
      data: salary,
    });
  } catch (error) {
    return error.message;
  }
};

// Get Staff
const GetAllStaff = async (req, res, next) => {
  try {
    let staff = await Staffmodel.find({
      BranchId: { $in: req.branch },
    }).populate("BranchId");
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Staff fetched successfully",
      data: staff,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get All salary
const GetAllSalary = async (req, res, next) => {
  try {
    let salaray = await Salarymodel.find({
      BranchId: { $in: req.branch },
    })
      .populate("BranchId")
      .populate("StaffId");
    return res.status(200).json({
      status: true,
      code: 200,
      message: "salary fetched successfully",
      data: salaray,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Salary By Staff Id
const GetAllSalaryByStaff = async (req, res, next) => {
  try {
    let { staffid } = req.params;
    let salaray = await Salarymodel.find({
      StaffId: staffid,
    });
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Salary fetched successfully",
      data: salaray,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateStaff,
  UpdateStaff,
  AddStaffSalary,
  GetAllSalary,
  GetAllStaff,
  GetAllSalaryByStaff,
};

const { validationResult } = require("express-validator");
const AppErr = require("../Helper/AppError");
const Adminmodel = require("../Model/Admin");
const generateToken = require("../Helper/GenerateToken");
const Branchmodel = require("../Model/Branch");

// Create Admin
const CreateAdmin = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { Name, Username, Password, Permission } = req.body;

    let admincheck = await Adminmodel.findOne({ Username: Username });
    if (admincheck) {
      return next(new AppErr("UserName Already Exists", 400));
    }

    let admin = await Adminmodel.create(req.body);

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Admin Created Successfully",
      data: admin,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Login Admin
const LoginAdmin = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { Username, Password } = req.body;

    let admincheck = await Adminmodel.findOne({
      Username: Username,
      Password: Password,
    });
    if (!admincheck) {
      return next(
        new AppErr("Admin Not Found! Invailed Username or Password", 440)
      );
    }

    let token = await generateToken(admincheck._id);

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Admin Created Successfully",
      data: admincheck,
      token: token,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update Admin
const UpdateAdmin = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { Name, Username, Password, Permission, Branch } = req.body;

    let { id } = req.params;
    if (!id) {
      return next(new AppErr("ID is required", 400));
    }

    if (Username) {
      let admincheck = await Adminmodel.findOne({
        Username: Username,
        _id: { $ne: id },
      });
      if (admincheck) {
        return next(new AppErr("UserName Already Exists", 400));
      }
    }

    if (Branch) {
      Branch.forEach(async (item) => {
        let branchcheck = await Branchmodel.findById(item);
        if (!branchcheck) {
          return next(new AppErr("Some Branch Not Found", 404));
        }
      });
    }

    let updateData = {};
    if (Name) updateData.Name = Name;
    if (Username) updateData.Username = Username;
    if (Password) updateData.Password = Password;
    if (Permission) updateData.Permission = Permission;
    if (Branch) updateData.Branch = Branch;

    let updateBranch = await Adminmodel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Admin Updated Successfully",
      data: updateBranch,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get All Admin Data
const GetAllAdmin = async (req, res, next) => {
  try {
    // { Branch: { $in: req.branch } }
    let admin = await Adminmodel.find();
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Admin fetched successfully",
      data: admin,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Admin By ID
const GetAdminById = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("ID is required", 400));
    }

    let admin = await Adminmodel.findById(id);
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Admin fetched successfully",
      data: admin,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Own Profile
const GetOwnProfile = async (req, res, next) => {
  try {
    let admin = await Adminmodel.findById(req.admin);
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Admin fetched successfully",
      data: admin,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Delete Admin
const DeleteAdmin = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Branch ID is required", 400));
    }

    await Adminmodel.findByIdAndDelete(id);

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Admin Deleted Successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};



module.exports = {
  CreateAdmin,
  LoginAdmin,
  UpdateAdmin,
  GetAllAdmin,
  GetAdminById,
  GetOwnProfile,
  DeleteAdmin,
};

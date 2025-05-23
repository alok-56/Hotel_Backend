const { validationResult } = require("express-validator");
const AppErr = require("../Helper/AppError");
const Branchmodel = require("../Model/Branch");
const Adminmodel = require("../Model/Admin");

// Create Branch
const CreateBranch = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Branchname, Location, Heading, Description, HotelInfo, Image } =
      req.body;
    req.body.Code = Math.floor(Math.random() * 10000);

    let branch = await Branchmodel.create(req.body);
    let admin = await Adminmodel.findById(req.admin);
    admin.Branch.push(branch._id);
    await admin.save();

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Branch Created Successfully",
      data: branch,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update Branch
const UpdateBranch = async (req, res, next) => {
  try {
    let { Branchname, Location, Heading, Description, HotelInfo, Image } =
      req.body;

    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Branch ID is required", 400));
    }

    // Prepare the update data
    let updateData = {};

    if (Branchname) updateData.Branchname = Branchname;
    if (Location) updateData.Location = Location;
    if (Heading) updateData.Heading = Heading;
    if (Description) updateData.Description = Description;
    if (HotelInfo) updateData.HotelInfo = HotelInfo;
    if (Image) updateData.Image = Image;

    // Perform the update operation
    let updateBranch = await Branchmodel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    // Check if the branch was found and updated
    if (!updateBranch) {
      return next(new AppErr("Branch not found", 404));
    }

    // Return success response
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Branch Updated Successfully",
      data: updateBranch,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get All Branch
const GetAllBranch = async (req, res, next) => {
  try {
    let branch = await Branchmodel.find();

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Branch Fecthed Successfully",
      data: branch,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get All Branch
const GetAllBranchForUser = async (req, res, next) => {
  try {
    let branch = await Branchmodel.find();

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Branch Fecthed Successfully",
      data: branch,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//  Get Branch By  Id
const GetBranchById = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Branch ID is required", 400));
    }

    let branch = await Branchmodel.findById(id);

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Branch Fecthed Successfully",
      data: branch,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Delete Branch
const DeleteBranch = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Branch ID is required", 400));
    }

    await Branchmodel.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Branch Deleted Successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateBranch,
  UpdateBranch,
  GetAllBranch,
  GetBranchById,
  DeleteBranch,
  GetAllBranchForUser
};

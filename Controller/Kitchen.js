const { validationResult } = require("express-validator");
const AppErr = require("../Helper/AppError");
const Kitchenmodel = require("../Model/Kitchen");
const Floormodel = require("../Model/Floor");
const Branchmodel = require("../Model/Branch");
const generateToken = require("../Helper/GenerateToken");

// Create Kitchen
const CreateKitchen = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { Kitchenname, Kitchennumber, Kitchenpassword, Floor, Branch } =
      req.body;

    // checking floor
    Floor.forEach(async (item) => {
      let floorcheck = await Floormodel.findById(Floor);
      if (!floorcheck) {
        return next(new AppErr("Floor not found", 404));
      }
    });

    // checking Branch
    let branchcheck = await Branchmodel.findById(Branch);
    if (!branchcheck) {
      return next(new AppErr("Branch not found", 404));
    }

    // check kitchen present at same floor and Branch
    let kithchenexist = await Kitchenmodel.findOne({
      Floor: { $in: Floor },
      Branch: Branch,
    });
    if (kithchenexist) {
      return next(
        new AppErr(
          `Kitchen Already Exists for branch ${branchcheck.Branchname} and all floor `,
          404
        )
      );
    }

    let Kitchen = await Kitchenmodel.create(req.body);
    return res.status(200).json({
      status: false,
      code: 200,
      message: "Kitchen Created Successfully",
      data: Kitchen,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update Kitchen
const UpdateKitchen = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { Kitchenname, Kitchennumber, Kitchenpassword, Floor, Branch } =
      req.body;

    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Kitchen ID is required", 400));
    }

    // checking floor
    if (Floor) {
      Floor.forEach(async (item) => {
        let floorcheck = await Floormodel.findById(Floor);
        if (!floorcheck) {
          return next(new AppErr("Floor not found", 404));
        }
      });
    }

    // checking Branch
    if (Branch) {
      let branchcheck = await Branchmodel.findById(Branch);
      if (!branchcheck) {
        return next(new AppErr("Branch not found", 404));
      }
    }

    // check kitchen present at same floor and Branch
    if (Floor && Branch) {
      let kithchenexist = await Kitchenmodel.findOne({
        Floor: { $in: Floor },
        Branch: Branch,
        _id: { $ne: id },
      });
      if (kithchenexist) {
        return next(new AppErr(`Kitchen Already Exists`, 400));
      }
    }

    let updateData = {};
    if (Kitchenname) updateData.Kitchenname = Kitchenname;
    if (Kitchennumber) updateData.Kitchennumber = Kitchennumber;
    if (Kitchenpassword) updateData.Kitchenpassword = Kitchenpassword;
    if (Floor) updateData.Floor = Floor;
    if (Branch) updateData.Branch = Branch;

    let updateKitchen = await Kitchenmodel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Kitchen Updated Successfully",
      data: updateKitchen,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Login Kitchen
const LoginKitchen = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Kitchennumber, Kitchenpassword } = req.body;

    let kitchen = await Kitchenmodel.findOne({
      Kitchennumber: Kitchennumber,
      Kitchenpassword: Kitchenpassword
    });
    if (!kitchen) {
      return next(new AppErr("Invailed Username or Password", 500));
    }

    let token = await generateToken(kitchen._id);

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Login success",
      data: kitchen,
      tokrn: token,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get All Kitchen
const GetAllKitchen = async (req, res, next) => {
  try {
    let Kitchen = await Kitchenmodel.find({ Branch: { $in: req.branch } });

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Kitchen Fecthed Successfully",
      data: Kitchen,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//  Get Kitchen By  Id
const GetKitchenById = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Kitchen ID is required", 400));
    }

    let Kitchen = await Kitchenmodel.findById(id);

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Kitchen Fecthed Successfully",
      data: Kitchen,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Delete Kitchen
const DeleteKitchen = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Kitchen ID is required", 400));
    }

    await Kitchenmodel.findByIdAndDelete(id);

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Kitchen Deleted Successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateKitchen,
  UpdateKitchen,
  GetAllKitchen,
  GetKitchenById,
  DeleteKitchen,
  LoginKitchen,
};

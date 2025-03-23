const { validationResult } = require("express-validator");
const AppErr = require("../Helper/AppError");
const Floormodel = require("../Model/Floor");

// Create Floor
const CreateFloor = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { Floorname, Floornumber } = req.body;

    let Floor = await Floormodel.create(req.body);
    return res.status(200).json({
      status: false,
      code: 200,
      message: "Floor Created Successfully",
      data: Floor,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update Floor
const UpdateFloor = async (req, res, next) => {
  try {
    let { Floorname, Floornumber } = req.body;

    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Floor ID is required", 400));
    }

    let updateData = {};
    if (Floorname) updateData.Floorname = Floorname;
    if (Floornumber) updateData.Floornumber = Floornumber;

    let updateFloor = await Floormodel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Floor Updated Successfully",
      data: updateFloor,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get All Floor
const GetAllFloor = async (req, res, next) => {
  try {
    let Floor = await Floormodel.find();

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Floor Fecthed Successfully",
      data: Floor,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//  Get Floor By  Id
const GetFloorById = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Floor ID is required", 400));
    }

    let Floor = await Floormodel.findById(id);

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Floor Fecthed Successfully",
      data: Floor,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Delete Floor
const DeleteFloor = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Floor ID is required", 400));
    }

    await Floormodel.findByIdAndDelete(id);

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Floor Deleted Successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateFloor,
  UpdateFloor,
  GetAllFloor,
  GetFloorById,
  DeleteFloor,
};

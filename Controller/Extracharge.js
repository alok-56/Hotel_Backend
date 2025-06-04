const { validationResult } = require("express-validator");
const AppErr = require("../Helper/AppError");
const Extrachargemodal = require("../Model/Extracharge");

// Add extra charge
const AddExtracharge = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { BookingId, Extratype, Name, Amount } = req.body;
    let extra = await Extrachargemodal.create(req.body);

    return res.status(200).json({
      status: true,
      code: 200,
      data: extra,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get extra charge by BookingId

const GetExtrachargeByBooking = async (req, res, next) => {
  try {
    const { BookingId } = req.params;

    if (!BookingId) {
      return next(new AppErr("BookingId is required", 400));
    }

    const charges = await Extrachargemodal.find({ BookingId });

    return res.status(200).json({
      status: true,
      code: 200,
      data: charges,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Delete extra charge

const DeleteExtracharge = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new AppErr("Extra charge ID is required", 400));
    }

    const deleted = await Extrachargemodal.findByIdAndDelete(id);

    if (!deleted) {
      return next(new AppErr("Extra charge not found", 404));
    }

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Extra charge deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  AddExtracharge,
  GetExtrachargeByBooking,
  DeleteExtracharge,
};

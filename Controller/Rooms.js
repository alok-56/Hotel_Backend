const { validationResult } = require("express-validator");
const AppErr = require("../Helper/AppError");
const Branchmodel = require("../Model/Branch");
const Roommodal = require("../Model/Rooms");

// Create Room
const CreateRoom = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    // payload
    let {
      BranchId,
      RoomName,
      RoomNo,
      features,
      Price,
      numberofguest,
      BookingDate,
      Image,
    } = req.body;
    req.body.RoomId = Math.floor(Math.random() * 1000000);

    // check branch
    let branch = await Branchmodel.findById(BranchId);
    if (!branch) {
      return next(new AppErr("Branch Not Found", 404));
    }

    let room = await Roommodal.create(req.body);
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Room Created Successfully",
      data: room,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update Room
const UpdateRoom = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    // payload
    const { id } = req.params;
    let {
      BranchId,
      RoomName,
      RoomNo,
      features,
      Price,
      numberofguest,
      BookingDate,
      Image,
    } = req.body;

    // check branch
    if (BranchId) {
      let branch = await Branchmodel.findById(BranchId);
      if (!branch) {
        return next(new AppErr("Branch Not Found", 404));
      }
    }

    const updatedata = {};
    if (BranchId) updatedata.BranchId = BranchId;
    if (RoomName) updatedata.RoomName = RoomName;
    if (RoomNo) updatedata.RoomNo = RoomNo;
    if (features) updatedata.features = features;
    if (Price) updatedata.Price = Price;
    if (Image) updatedata.Image = Image;
    if (numberofguest) updatedata.numberofguest = numberofguest;
    if (BookingDate) updatedata.BookingDate = BookingDate;

    let room = await Roommodal.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Room Updated Successfully",
      data: room,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Room
const GetRoom = async (req, res, next) => {
  try {
    let room = await Roommodal.find({ BranchId: { $in: req.branch } });

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Room Fetched Successfully",
      data: room,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Room By Id
const GetRoomById = async (req, res, next) => {
  try {
    let { id } = req.params;
    let room = await Roommodal.findById(id);
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Room Fetched Successfully",
      data: room,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Search Room
const SearchRoom = async (req, res, next) => {
  try {
    const { branchid, checkindate, checkoutdate } = req.query;

    const checkinDate = new Date(checkindate);
    const checkoutDate = new Date(checkoutdate);

    if (!checkinDate || !checkoutDate) {
      return next(new AppErr("Invalid check-in or check-out date", 400));
    }

    if (checkinDate >= checkoutDate) {
      return next(new AppErr("Checkout date must be after check-in date", 400));
    }

    let rooms = await Roommodal.find({
      BranchId: branchid,
      $nor: [
        {
          BookingDate: {
            $elemMatch: {
              $or: [
                {
                  checkin: { $gte: checkinDate, $lt: checkoutDate },
                  checkout: { $gt: checkinDate, $lte: checkoutDate },
                },
                {
                  checkin: { $lt: checkoutDate },
                  checkout: { $gte: checkinDate },
                },
              ],
            },
          },
        },
      ],
    }).populate("BranchId");

    rooms = rooms.filter((room) => {
      return room.BookingDate.every((booking) => {
        return booking.checkout <= checkoutDate.toISOString();
      });
    });

    if (rooms.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No available rooms found for the selected dates.",
      });
    }

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Rooms fetched successfully",
      data: rooms,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Delete Room
const deleteroom = async (req, res, next) => {
  try {
    let { id } = req.params;
    let room = await Roommodal.findByIdAndDelete(id);
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Rooms deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateRoom,
  UpdateRoom,
  GetRoom,
  GetRoomById,
  SearchRoom,
  deleteroom,
};

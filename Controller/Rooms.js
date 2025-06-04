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
    let room = await Roommodal.find({ BranchId: { $in: req.branch } }).populate(
      "BranchId"
    );

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

    if (!branchid || !checkindate || !checkoutdate) {
      return next(new AppErr("Branch ID and both dates are required", 400));
    }

    // Set check-in at 11:00 AM and check-out at 12:00 PM
    const checkinDate = new Date(checkindate);
    checkinDate.setHours(11, 0, 0, 0);

    const checkoutDate = new Date(checkoutdate);
    checkoutDate.setHours(12, 0, 0, 0);

    if (checkinDate >= checkoutDate) {
      return next(new AppErr("Checkout date must be after check-in date", 400));
    }

    // Find rooms that do NOT have any booking overlapping with requested dates
    const rooms = await Roommodal.find({
      BranchId: branchid,
      $or: [
        { BookingDate: { $exists: false } }, // Rooms with no bookings yet
        {
          BookingDate: {
            $not: {
              $elemMatch: {
                // Overlapping condition:
                checkin: { $lt: checkoutDate },
                checkout: { $gt: checkinDate },
              },
            },
          },
        },
      ],
    }).populate("BranchId");

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
    return next(new AppErr(error.message || "Something went wrong", 500));
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

// Get Room along with booking
const getRoomInventory = async (req, res, next) => {
  try {
    const { branchId, date } = req.query;

    // Validate required parameters
    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: "Branch ID is required",
      });
    }

    // Set center date (default to today if not provided)
    const centerDate = date ? new Date(date) : new Date();

    // Validate date format
    if (isNaN(centerDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Please use YYYY-MM-DD",
      });
    }

    // Get all rooms for the branch
    const rooms = await Roommodal.find({ BranchId: branchId }).lean();

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rooms found for this branch",
      });
    }

    const inventoryData = {};
    const totalRooms = rooms.length;

    for (let i = -3; i <= 3; i++) {
      const currentDate = new Date(centerDate);
      currentDate.setDate(centerDate.getDate() + i);
      const dateKey = currentDate.toISOString().split("T")[0];

      let soldRooms = 0;
      rooms.forEach((room) => {
        if (room.BookingDate && room.BookingDate.length > 0) {
          const isBooked = room.BookingDate.some((booking) => {
            const checkinDate = new Date(booking.checkin);
            const checkoutDate = new Date(booking.checkout);
            return currentDate >= checkinDate && currentDate < checkoutDate;
          });

          if (isBooked) {
            soldRooms++;
          }
        }
      });

      const availableRooms = totalRooms - soldRooms;
      const occupancyRate =
        totalRooms > 0 ? Math.round((soldRooms / totalRooms) * 100) : 0;

      inventoryData[dateKey] = {
        date: dateKey,
        dayName: currentDate.toLocaleDateString("en-US", { weekday: "long" }),
        totalRooms,
        soldRooms,
        availableRooms,
        occupancyRate,
      };
    }

    const inventoryValues = Object.values(inventoryData);
    const totalSoldRooms = inventoryValues.reduce(
      (sum, day) => sum + day.soldRooms,
      0
    );
    const totalAvailableRooms = inventoryValues.reduce(
      (sum, day) => sum + day.availableRooms,
      0
    );
    const averageOccupancy = Math.round(
      inventoryValues.reduce((sum, day) => sum + day.occupancyRate, 0) /
        inventoryValues.length
    );

    let branchInfo = null;
    try {
      const BranchModel = mongoose.model("Branchmanagement");
      branchInfo = await BranchModel.findById(branchId).lean();
    } catch (error) {
      console.log("Branch model not found, continuing without branch details");
    }

    res.status(200).json({
      success: true,
      message: "7-day inventory data retrieved successfully",
      data: {
        branchId,
        branchName: branchInfo?.name || `Branch ${branchId}`,
        centerDate: centerDate.toISOString().split("T")[0],
        dateRange: {
          startDate: Object.keys(inventoryData)[0],
          endDate: Object.keys(inventoryData)[6],
        },
        inventory: inventoryData,
        summary: {
          totalRooms,
          averageOccupancy,
          weeklyStats: {
            totalSoldRooms,
            totalAvailableRooms,
            totalRoomNights: totalRooms * 7,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in getRoomInventory:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get All Hotels with total room

const getAllBrancheswithrooms = async (req, res, next) => {
  try {
    // Aggregate rooms by branch to get total room count for each branch
    const branchData = await Roommodal.aggregate([
      {
        $group: {
          _id: "$BranchId",
          totalRooms: { $sum: 1 },
          roomDetails: {
            $push: {
              roomId: "$RoomId",
              roomName: "$RoomName",
              roomNo: "$RoomNo",
              price: "$Price"
            }
          }
        }
      },
      {
        $lookup: {
          from: "branchmanagements", 
          localField: "_id",
          foreignField: "_id",
          as: "branchInfo"
        }
      },
      {
        $project: {
          branchId: "$_id",
          totalRooms: 1,
          branchName: {
            $ifNull: [
              { $arrayElemAt: ["$branchInfo.Branchname", 0] },
              { $concat: ["Branch ", { $toString: "$_id" }] }
            ]
          },
          branchLocation: { $arrayElemAt: ["$branchInfo.Location", 0] },
          branchAddress: { $arrayElemAt: ["$branchInfo.Address", 0] },
          branchPhone: { $arrayElemAt: ["$branchInfo.Phone", 0] },
          branchCode: { $arrayElemAt: ["$branchInfo.Code", 0] },
          branchHeading: { $arrayElemAt: ["$branchInfo.Heading", 0] },
          branchDescription: { $arrayElemAt: ["$branchInfo.Description", 0] },
          roomDetails: 1,
          _id: 0
        }
      },
      {
        $sort: { branchName: 1 }
      }
    ]);

    if (!branchData || branchData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No branches found"
      });
    }

    // Calculate total statistics across all branches
    const totalBranches = branchData.length;
    const totalRoomsAllBranches = branchData.reduce(
      (sum, branch) => sum + branch.totalRooms,
      0
    );
    const averageRoomsPerBranch = Math.round(totalRoomsAllBranches / totalBranches);

    res.status(200).json({
      success: true,
      message: "All branches retrieved successfully",
      data: {
        branches: branchData,
        summary: {
          totalBranches,
          totalRoomsAllBranches,
          averageRoomsPerBranch
        }
      }
    });
  } catch (error) {
    console.error("Error in getAllBranches:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  CreateRoom,
  UpdateRoom,
  GetRoom,
  GetRoomById,
  SearchRoom,
  deleteroom,
  getRoomInventory,
  getAllBrancheswithrooms
};

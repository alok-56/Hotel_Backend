const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    BranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branchmanagement",
      required: true,
    },
    RoomName: {
      type: String,
      required: true,
    },
    RoomNo: {
      type: String,
      required: true,
    },
    RoomId: {
      type: Number,
      required: true,
      unique: true,
    },
    features: [],
    Price: {
      type: Number,
      required: true,
    },
    numberofguest: {
      type: Number,
      required: true,
    },
    BookingDate: [
      {
        checkin: String,
        checkout: String,
        BookingId: String,
      },
    ],
    Image: [],
  },
  { timestamps: true }
);

const Roommodal = mongoose.model("Rooms", RoomSchema);
module.exports = Roommodal;

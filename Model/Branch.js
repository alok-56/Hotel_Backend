const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
  {
    Branchname: {
      type: String,
      required: true,
    },
    Code: {
      type: Number,
      required: true,
      unique: true,
    },
    Location: {
      type: String,
      required: true,
    },
    Heading: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    HotelInfo: [],
    Image: {
      hotel: [],
      rooms: [],
      restaurant: [],
      other: [],
    },
  },
  { timestamps: true }
);

const Branchmodel = mongoose.model("Branchmanagement", BranchSchema);
module.exports = Branchmodel;

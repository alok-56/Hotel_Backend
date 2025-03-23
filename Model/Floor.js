const mongoose = require("mongoose");

const FloorSchema = new mongoose.Schema(
  {
    Floorname: {
      type: String,
      required: true,
    },
    Floornumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Floormodel = mongoose.model("Floormanagement", FloorSchema);
module.exports = Floormodel;

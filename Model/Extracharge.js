const mongoose = require("mongoose");

const ExtrachargeSchema = new mongoose.Schema(
  {
    BookingId: {
      type: String,
      required: true,
    },
    Extratype: {
      type: String,
      enum: ["Food", "Penalty", "ExtraTime", "other"],
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Extrachargemodal = mongoose.model("extracharge", ExtrachargeSchema);
module.exports = Extrachargemodal;

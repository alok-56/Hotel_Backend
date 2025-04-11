const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    BranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branchmanagement",
      required: true,
    },
    BookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    merchantTransactionId: {
      type: String,
      required: true,
      unique: true,
    },
    Tax: {
      type: Number,
      unique:false
    },
    TotalAmount: {
      type: Number,
      required: true,
    },
    Status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Paymentmodal = mongoose.model("Payments", PaymentSchema);
module.exports = Paymentmodal;

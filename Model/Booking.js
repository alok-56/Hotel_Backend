const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    BookingId: {
      type: String,
      required: true,
    },
    BranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branchmanagement",
      required: true,
    },
    RoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms",
      required: true,
    },
    PaymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payments",
    },
    CheckinDate: {
      type: String,
      required: true,
    },
    CheckOutDate: {
      type: String,
      required: true,
    },
    UserInformation: {
      Name: String,
      Phonenumber: Number,
      Age: Number,
    },
    bookingtype: {
      type: String,
      enum: ["Online", "Offline"],
    },
    Numberofchildren: {
      type: Number,
    },
    Tax: {
      type: Number,
    },
    TotalAmount: {
      type: Number,
      required: true,
    },
    Status: {
      type: String,
      default: "pending",
      enum: ["pending", "cancelled", "failed", "Booked", "checkout"],
    },
    Cancelfee: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Bookingmodal = mongoose.model("Booking", BookingSchema);
module.exports = Bookingmodal;

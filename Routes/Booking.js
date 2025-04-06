const express = require("express");
const { body } = require("express-validator");
const {
  BookRoom,
  ValidatePayment,
  GetBooking,
  GetBookingById,
  OfflineBooking,
  UpdateBookingstatus,
  GetPayment,
  GetPaymentById,
  MyBooking,
} = require("../Controller/Booking");
const Islogin = require("../Middleware/Islogin");

const bookingrouter = express.Router();

bookingrouter.post(
  "/room/pay",
  body("BranchId").notEmpty().withMessage("BranchId is required"),
  body("RoomId").notEmpty().withMessage("RoomId is required"),
  body("CheckinDate").notEmpty().withMessage("CheckinDate is required"),
  body("CheckOutDate").notEmpty().withMessage("CheckOutDate is required"),
  body("UserInformation").notEmpty().withMessage("UserInformation is required"),
  body("TotalAmount").notEmpty().withMessage("TotalAmount is required"),
  BookRoom
);

bookingrouter.get("/payment/validate/:merchantTransactionId", ValidatePayment);

bookingrouter.get("/get/room", Islogin, GetBooking);

bookingrouter.get("/get/room/:id", Islogin, GetBookingById);

bookingrouter.post(
  "/create/offline/book",
  body("BranchId").notEmpty().withMessage("BranchId is required"),
  body("RoomId").notEmpty().withMessage("RoomId is required"),
  body("CheckinDate").notEmpty().withMessage("CheckinDate is required"),
  body("CheckOutDate").notEmpty().withMessage("CheckOutDate is required"),
  body("UserInformation").notEmpty().withMessage("UserInformation is required"),
  body("TotalAmount").notEmpty().withMessage("TotalAmount is required"),
  Islogin,
  OfflineBooking
);

bookingrouter.patch("/update/book/status", Islogin, UpdateBookingstatus);

bookingrouter.get("/get/payment", Islogin, GetPayment);

bookingrouter.get("/get/payment/:id", Islogin, GetPaymentById);

bookingrouter.get("/get/mybooking", MyBooking);

module.exports = bookingrouter;

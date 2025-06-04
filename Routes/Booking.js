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
  LoginUser,
} = require("../Controller/Booking");
const Islogin = require("../Middleware/Islogin");
const {
  AddExtracharge,
  GetExtrachargeByBooking,
  DeleteExtracharge,
} = require("../Controller/Extracharge");

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

bookingrouter.post("/auth/login", LoginUser);

bookingrouter.post(
  "/add/extra",
  body("BookingId").notEmpty().withMessage("BookingId is required"),
  body("Extratype").notEmpty().withMessage("Extratype is required"),
  body("Name").notEmpty().withMessage("Name is required"),
  body("Amount").notEmpty().withMessage("Amount is required"),
  Islogin,
  AddExtracharge
);

bookingrouter.get("/get/extra/:BookingId", Islogin, GetExtrachargeByBooking);

bookingrouter.delete("/extra/delete/:id", Islogin, DeleteExtracharge);

module.exports = bookingrouter;

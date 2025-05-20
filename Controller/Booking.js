const axios = require("axios");
const sha256 = require("sha256");
const uniqid = require("uniqid");
const AppErr = require("../Helper/AppError");
const Branchmodel = require("../Model/Branch");
const Roommodal = require("../Model/Rooms");
const Bookingmodal = require("../Model/Booking");
const Paymentmodal = require("../Model/Payments");
const { validationResult } = require("express-validator");
const generateToken = require("../Helper/GenerateToken");
require("dotenv").config();
const mongoose = require("mongoose");
const Usermodal = require("../Model/User");

// Create Payment Payload
const createPaymentPayload = (
  transactionid,
  TotalAmount,
  Phonenumber,
  Name,
  Age,
  bookingid
) => {
  const userid = `${Phonenumber} ${Name} ${Age} ${bookingid}`;
  let normalPayLoad = {
    merchantId: process.env.MERCHANT_ID,
    merchantTransactionId: transactionid,
    merchantUserId: userid,
    amount: TotalAmount * 100,
    redirectUrl: `${process.env.APP_BASE_URL}/api/v1/booking/payment/validate/${transactionid}`,
    redirectMode: "REDIRECT",
    mobileNumber: Phonenumber,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  return Buffer.from(JSON.stringify(normalPayLoad), "utf8").toString("base64");
};

// Create Booking
const BookRoom = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let bookingid = uniqid();
    let transactionid = uniqid();
    let {
      BranchId,
      RoomId,
      CheckinDate,
      CheckOutDate,
      UserInformation,
      bookingtype,
      Numberofchildren,
      Tax,
      TotalAmount,
      Cancelfee,
    } = req.body;

    req.body.bookingtype = "Online";
    req.body.BookingId = bookingid;

    if (!UserInformation) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppErr("User Info Not Found", 404));
    }

    let { Name, Phonenumber, Age } = UserInformation;

    let branch = await Branchmodel.findById(BranchId).session(session);
    if (!branch) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppErr("Branch Not Found", 404));
    }

    let room = await Roommodal.findById(RoomId).session(session);
    if (!room) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppErr("Room Not Found", 404));
    }

    // CReate user
    await Usermodal.create({
      Number: Phonenumber,
    });

    // Create booking (in transaction)
    let bookingroom = await Bookingmodal.create([req.body], { session });

    // Create payment (in transaction)
    let paymentcreate = new Paymentmodal({
      BranchId: BranchId,
      BookingId: bookingroom[0]._id,
      merchantTransactionId: transactionid,
      Tax: Tax,
      TotalAmount: TotalAmount,
    });

    await paymentcreate.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Prepare payment payload
    const base64EncodedPayload = createPaymentPayload(
      transactionid,
      TotalAmount,
      Phonenumber,
      Name,
      Age,
      bookingid
    );

    // Generate checksum
    let string = base64EncodedPayload + "/pg/v1/pay" + process.env.SALT_KEY;
    let sha256_val = sha256(string);
    let xVerifyChecksum = sha256_val + "###" + process.env.SALT_INDEX;

    // Initiate Payment
    axios
      .post(
        `${process.env.PHONE_PE_HOST_URL}/pg/v1/pay`,
        { request: base64EncodedPayload },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerifyChecksum,
            accept: "application/json",
          },
        }
      )
      .then(async (response) => {
        res.status(200).json({
          status: true,
          code: 200,
          message: "success",
          data: response.data.data.instrumentResponse.redirectInfo.url,
        });
      })
      .catch(function (error) {
        res.status(400).json({
          status: true,
          code: 400,
          message: "Error during payment initiation",
          data: error.message,
        });
      });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new AppErr(error.message, 500));
  }
};

// Validate Payment
const ValidatePayment = async (req, res, next) => {
  try {
    const { merchantTransactionId } = req.params;
    const PHONE_PE_HOST_URL = process.env.PHONE_PE_HOST_URL;

    let statusUrl = `${PHONE_PE_HOST_URL}/pg/v1/status/${process.env.MERCHANT_ID}/${merchantTransactionId}`;
    let string = `/pg/v1/status/${process.env.MERCHANT_ID}/${merchantTransactionId}${process.env.SALT_KEY}`;
    let sha256_val = sha256(string);
    let xVerifyChecksum = sha256_val + "###" + process.env.SALT_INDEX;

    axios
      .get(statusUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          "X-MERCHANT-ID": merchantTransactionId,
          accept: "application/json",
        },
      })
      .then(async (response) => {
        if (response.data && response.data.code === "PAYMENT_SUCCESS") {
          let payment = await Paymentmodal.findOne({
            merchantTransactionId: merchantTransactionId,
          });
          payment.Status = true;

          let booking = await Bookingmodal.findById(payment.BookingId);
          booking.PaymentId = payment._id;
          booking.Status = "Booked";

          let room = await Roommodal.findById(booking.RoomId);
          room.BookingDate.push({
            checkin: booking.CheckinDate,
            checkout: booking.CheckOutDate,
            BookingId: booking._id,
          });

          await payment.save();
          await booking.save();
          await room.save();

          return res.status(200).json({
            status: true,
            code: 200,
            message: "Payment Success",
            data: response.data,
          });
        } else {
          return res.status(400).json({
            status: true,
            code: 400,
            message: "Payment Failed",
            data: response.data,
          });
        }
      })
      .catch(function (error) {
        res.status(500).json({
          status: true,
          code: 500,
          message: "Error validating payment",
          data: error.message,
        });
      });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Booking
const GetBooking = async (req, res, next) => {
  try {
    let { status } = req.query;

    let filter = {
      BranchId: { $in: req.branch },
    };

    if (status) {
      filter.Status = status;
    }

    let book = await Bookingmodal.find(filter)
      .populate("PaymentId")
      .populate("RoomId");

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Booking fetched Successfully",
      data: book,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Booking bY Id
const GetBookingById = async (req, res, next) => {
  try {
    let { id } = req.params;

    let book = await Bookingmodal.findById(id).populate("PaymentId");

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Booking fetched Successfully",
      data: book,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Create Offline Booking
const OfflineBooking = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let bookingid = uniqid();
    let transactionid = uniqid();
    let {
      BranchId,
      RoomId,
      CheckinDate,
      CheckOutDate,
      UserInformation,
      Numberofchildren,
      Tax,
      TotalAmount,
    } = req.body;

    req.body.bookingtype = "Offline";
    req.body.BookingId = bookingid;
    req.body.Status = "Booked";

    if (!UserInformation) {
      return next(new AppErr("User Info Not Found", 404));
    }

    let { Name, Phonenumber, Age } = UserInformation;

    // check branch
    let branch = await Branchmodel.findById(BranchId);
    if (!branch) {
      return next(new AppErr("Branch Not Found", 404));
    }

    // check room
    let room = await Roommodal.findById(RoomId);
    if (!room) {
      return next(new AppErr("Room Not Found", 404));
    }

    await Usermodal.create({
      Number: Phonenumber,
    });

    let bookingroom = await Bookingmodal.create(req.body);

    // Create payment details and save
    let paymentcreate = new Paymentmodal({
      BranchId: BranchId,
      BookingId: bookingroom._id,
      merchantTransactionId: transactionid,
      Tax: Tax,
      TotalAmount: TotalAmount,
      Status: true,
    });
    await paymentcreate.save();

    room.BookingDate.push({
      checkin: CheckinDate,
      checkout: CheckOutDate,
      BookingId: bookingroom._id,
    });

    bookingroom.PaymentId = paymentcreate._id;
    await room.save();
    await bookingroom.save();

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Booking Done Successfully",
      data: bookingroom,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update Status of Booking
const UpdateBookingstatus = async (req, res, next) => {
  try {
    let { status, bookingid } = req.query;
    let book = await Bookingmodal.findById(bookingid);
    if (!book) {
      return next(new AppErr("Booking not found", 404));
    }
    let room = await Roommodal.findById(book.RoomId);
    if (!room) {
      return next(new AppErr("Room not found", 404));
    }
    book.Status = status;
    await Roommodal.updateOne(
      { "BookingDate.BookingId": bookingid },
      { $pull: { BookingDate: { BookingId: bookingid } } }
    );

    await book.save();

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Booking Updated successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Payment
const GetPayment = async (req, res, next) => {
  try {
    let { status } = req.query;

    let filter = {
      BranchId: { $in: req.branch },
    };

    if (status) {
      filter.Status = status;
    }

    let payment = await Paymentmodal.find(filter).populate("BookingId");

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Payment fetched Successfully",
      data: payment,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Payment By Id
const GetPaymentById = async (req, res, next) => {
  try {
    let { id } = req.params;

    let payment = await Paymentmodal.findById(id).populate("BookingId");

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Payment fetched Successfully",
      data: payment,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get My Booking
const MyBooking = async (req, res, next) => {
  try {
    let { Phonenumber } = req.query;

    // Corrected query to search for bookings by Phonenumber inside UserInformation
    let bookings = await Bookingmodal.find({
      "UserInformation.Phonenumber": Phonenumber,
    })
      .populate("PaymentId")
      .populate("RoomId")
      .populate('Branchmanagement')

    if (!bookings.length) {
      return res.status(404).json({
        status: true,
        code: 404,
        message: "No bookings found for this phone number.",
      });
    }

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Bookings fetched successfully.",
      data: bookings,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Login User
const LoginUser = async (req, res, next) => {
  try {
    // await mongoose.connection.dropDatabase();
    // res.status(200).json({
    //   status: true,
    //   message: "Entire database deleted successfully",
    // });

    let { Phonenumber } = req.query;
    let user = await Usermodal.findOne({ Number: Phonenumber });
    if (!user) {
      await Usermodal.create({ Number: Phonenumber });
    }

    let token = await generateToken(Phonenumber);

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Bookings fetched successfully.",
      token: token,
      number: Phonenumber,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
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
};

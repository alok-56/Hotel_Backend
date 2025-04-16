const express = require("express");
const {
  CreateRoom,
  UpdateRoom,
  GetRoom,
  GetRoomById,
  deleteroom,
  SearchRoom,
} = require("../Controller/Rooms");
const Islogin = require("../Middleware/Islogin");
const { body } = require("express-validator");
const Roomtrouter = express.Router();

Roomtrouter.post(
  "/create/room",
  body("BranchId").notEmpty().withMessage("BranchId is required"),
  body("RoomName").notEmpty().withMessage("RoomName is required"),
  body("Price").notEmpty().withMessage("Price is required"),
  body("numberofguest").notEmpty().withMessage("numberofguest is required"),
  Islogin,
  CreateRoom
);

Roomtrouter.patch("/update/room/:id", Islogin, UpdateRoom);

Roomtrouter.get("/getall/room", Islogin, GetRoom);

Roomtrouter.get("/get/room/:id", GetRoomById);

Roomtrouter.delete("/delete/room/:id", Islogin, deleteroom);

Roomtrouter.get("/search/room", SearchRoom);

module.exports = Roomtrouter;

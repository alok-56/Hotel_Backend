const express = require("express");

const { body } = require("express-validator");
const Islogin = require("../Middleware/Islogin");
const { CreateFloor, UpdateFloor, GetAllFloor, GetFloorById, DeleteFloor } = require("../Controller/Floor");
const FloorRouter = express.Router();

FloorRouter.post(
  "/create/Floor",
  body("Floorname").notEmpty().withMessage("Floorname is required"),
  body("Floornumber").notEmpty().withMessage("Floornumber is required"),
  Islogin,
  CreateFloor
);

FloorRouter.patch("/update/Floor/:id", Islogin, UpdateFloor);

FloorRouter.get("/getall/Floor", Islogin, GetAllFloor);

FloorRouter.get("/get/Floor/:id", Islogin, GetFloorById);

FloorRouter.delete("/delete/Floor/:id", Islogin, DeleteFloor);

module.exports = FloorRouter;

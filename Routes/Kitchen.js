const express = require("express");

const { body } = require("express-validator");
const Islogin = require("../Middleware/Islogin");
const {
  CreateKitchen,
  UpdateKitchen,
  GetAllKitchen,
  GetKitchenById,
  DeleteKitchen,
  LoginKitchen,
} = require("../Controller/Kitchen");
const KitchenRouter = express.Router();

KitchenRouter.post(
  "/create/Kitchen",
  body("Kitchenname").notEmpty().withMessage("Kitchenname is required"),
  body("Kitchennumber").notEmpty().withMessage("Kitchennumber is required"),
  body("Kitchenpassword").notEmpty().withMessage("Kitchenpassword is required"),
  body("Floor").notEmpty().withMessage("Floor is required"),
  body("Branch").notEmpty().withMessage("Branch is required"),
  Islogin,
  CreateKitchen
);

KitchenRouter.post(
  "/login/Kitchen",
  body("Kitchennumber").notEmpty().withMessage("Kitchennumber is required"),
  body("Kitchenpassword").notEmpty().withMessage("Kitchenpassword is required"),
  LoginKitchen
);

KitchenRouter.patch("/update/Kitchen/:id", Islogin, UpdateKitchen);

KitchenRouter.get("/getall/Kitchen", Islogin, GetAllKitchen);

KitchenRouter.get("/get/Kitchen/:id", Islogin, GetKitchenById);

KitchenRouter.delete("/delete/Kitchen/:id", Islogin, DeleteKitchen);

module.exports = KitchenRouter;

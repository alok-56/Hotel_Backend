const express = require("express");
const {
  CreateAdmin,
  LoginAdmin,
  UpdateAdmin,
  GetAllAdmin,
  GetAdminById,
  GetOwnProfile,
  DeleteAdmin,
} = require("../Controller/Admin");
const { body } = require("express-validator");
const Islogin = require("../Middleware/Islogin");
const AdminRouter = express.Router();

AdminRouter.post(
  "/create/admin",
  body("Name").notEmpty().withMessage("Name is required"),
  body("Username").notEmpty().withMessage("Username is required"),
  body("Password").notEmpty().withMessage("Password is required"),
  body("Permission").notEmpty().withMessage("Permission is required"),
  CreateAdmin
);

AdminRouter.post(
  "/auth/Login",
  body("Username").notEmpty().withMessage("Username is required"),
  body("Password").notEmpty().withMessage("Password is required"),
  LoginAdmin
);

AdminRouter.patch("/update/admin/:id", Islogin, UpdateAdmin);

AdminRouter.get("/getall/admin", Islogin, GetAllAdmin);

AdminRouter.get("/get/admin/:id", Islogin, GetAdminById);

AdminRouter.get("/profile", Islogin, GetOwnProfile);

AdminRouter.delete("/delete/admin/:id", Islogin, DeleteAdmin);

module.exports = AdminRouter;

const express = require("express");
const { body } = require("express-validator");
const Islogin = require("../Middleware/Islogin");
const {
  CreateMenu,
  UpdateMenu,
  GetAllMenu,
  GetMenuById,
  DeleteMenu,
  GetAllMenuForusers,
} = require("../Controller/Product/menu");

const MenuRouter = express.Router();

MenuRouter.post(
  "/create/Menu",
  body("Menuname").notEmpty().withMessage("Menuname is required"),
  body("Description").notEmpty().withMessage("Description is required"),
  body("ingridents").notEmpty().withMessage("ingridents is required"),
  body("Price").notEmpty().withMessage("Price is required"),
  body("Category").notEmpty().withMessage("Category is required"),
  Islogin,
  CreateMenu
);

MenuRouter.patch("/update/Menu/:id", Islogin, UpdateMenu);

MenuRouter.get("/getall/Menu", Islogin, GetAllMenu);

MenuRouter.get("/get/Menu/:id", Islogin, GetMenuById);

MenuRouter.delete("/delete/Menu/:id", Islogin, DeleteMenu);

MenuRouter.get("/user/Menu/", GetAllMenuForusers);

module.exports = MenuRouter;

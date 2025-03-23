const express = require("express");

const { body } = require("express-validator");
const Islogin = require("../Middleware/Islogin");
const { GetAllCategoryForusers, CreateCategory, UpdateCategory, GetAllCategory, GetCategoryById, DeleteCategory } = require("../Controller/Product/Category");
const CategoryRouter = express.Router();

CategoryRouter.post(
  "/create/Category",
  body("Categoriesname").notEmpty().withMessage("Categoriesname is required"),
  body("Branch").notEmpty().withMessage("Branch is required"),
  Islogin,
  CreateCategory
);

CategoryRouter.patch("/update/Category/:id", Islogin, UpdateCategory);

CategoryRouter.get("/users/Category/:branch", GetAllCategoryForusers);

CategoryRouter.get("/getall/Category", Islogin, GetAllCategory);

CategoryRouter.get("/get/Category/:id", Islogin, GetCategoryById);

CategoryRouter.delete("/delete/Category/:id", Islogin, DeleteCategory);

module.exports = CategoryRouter;
